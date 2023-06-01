import { writable,  get } from 'svelte/store';
import { client } from '../lib/client'
import { getString,setString,remove } from '@nativescript/core/application-settings'
import { User } from '~/models/user';
import { clearCookies } from "@klippa/nativescript-http";

function buildUserTokenStore() {
    var stored_token = getString('user_token', null);
    const user_token = writable(stored_token);
    return {
        subscribe: user_token.subscribe,
        set(value: string) {
            if (value) {
                setString('user_token', value); 
            } else {
                remove('user_token');
            }
            user_token.set(value);
        }
    }
}

export const user_token = buildUserTokenStore();


function buildUserProfileStore() {
    const user_profile = writable({})

    return {
        subscribe: user_profile.subscribe,
        update: user_profile.update,

        async loadUserFromToken() {
            if (!get(user_token)) return {};
            const userResponse = await client.get<any>('/users/me');
            console.log(userResponse)
            userResponse.points = userResponse.points || 0;
            user_profile.set(userResponse);
        },

        set: user_profile.set
    }
}

export const user_profile = buildUserProfileStore();

export function logout() {
    let user=get(user_profile);
    client.put(`/users/${user.id}`,{
        fcmToken:""
    });
    user_profile.set(null);
    user_token.set(null);
    clearCookies();
}

function getCookie(string, key) {
    const regexp = new RegExp(`.*${key}=([^;]*)`);
    const result = regexp.exec(string);
    if(result) {
      return result[1];
    }
}
function getCaseInsensitiveAttr(headers,key){
    if(headers[key]){
        return headers[key];
    }else if(headers[key.toLowerCase()]){
        return headers[key.toLowerCase()];
    }
}

export function login(email: string):Promise<User> {
    return client.post<any>('/auth/local', {
        identifier: email
    },true).then(async loginResponse => {
        const token = getCookie(getCaseInsensitiveAttr(loginResponse.headers,'Set-Cookie'),"token");   
        user_token.set(token);
        const user = await client.get<any>('/users/me');
        user_profile.set(user);
        return user;
    })
}



export function signup(email: string):Promise<User> {
    return client.post<any>('/auth/local/register', {
        username: email,
        email: email,
        password: email
    },true).then(async response => {
        const token = getCookie(getCaseInsensitiveAttr(response.headers,'Set-Cookie'),"token");      
        user_token.set(token);
        const user = await client.get<any>('/users/me');
        user_profile.set(user);
        return user;
    })
}
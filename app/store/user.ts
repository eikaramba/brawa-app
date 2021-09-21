import { writable,  get } from 'svelte/store';
import { client } from '../lib/client'
import * as appSettings from '@nativescript/core/application-settings'
import { User } from '~/models/user';

function buildUserTokenStore() {
    var stored_token = appSettings.getString('user_token', null);
    const user_token = writable(stored_token);
    return {
        subscribe: user_token.subscribe,
        set(value: string) {
            if (value) {
                appSettings.setString('user_token', value); 
            } else {
                appSettings.remove('user_token');
            }
            user_token.set(value);
        }
    }
}

export const user_token = buildUserTokenStore();


function buildUserProfileStore() {
    const user_profile = writable(null)

    return {
        subscribe: user_profile.subscribe,

        async loadUserFromToken() {
            if (!get(user_token)) return null;
            const userResponse = await client.get<any>('/users/me');
            user_profile.set(userResponse);
        },

        set: user_profile.set
    }
}

export const user_profile = buildUserProfileStore();

export function logout() {
    user_profile.set(null);
    user_token.set(null);
}

function getCookie(string, key) {
    const regexp = new RegExp(`.*${key}=([^;]*)`);
    const result = regexp.exec(string);
    if(result) {
      return result[1];
    }
  }

export function login(email: string):Promise<User> {
    return client.post<any>('/auth/local', {
        identifier: email
    },true).then(async loginResponse => {
        const token = getCookie(loginResponse.headers['Set-Cookie'],"token");
        user_token.set(token);
        const user = await client.get<any>('/users/me');
        user_profile.set(user);
        return user;
    })
}



export function signup(email: string):Promise<User> {
    return client.post<any>('/auth/local/register', {
        username: email,
        email: email
    },true).then(async response => {
        const token = getCookie(response.headers['Set-Cookie'],"token");
        user_token.set(token);
        const user = await client.get<any>('/users/me');
        user_profile.set(user);
        return user;
    })
}
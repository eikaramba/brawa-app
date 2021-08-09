import { writable, derived, get } from 'svelte/store';
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

    const user_profile_with_defaults = derived(user_profile, profile => {
        if (profile && !profile.image) {
            profile.image = "https://static.productionready.io/images/smiley-cyrus.jpg"
        }
        return profile;
    });

    return {
        subscribe: user_profile_with_defaults.subscribe,

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
        const token = getCookie(loginResponse.headers.map['set-cookie'],"token");
        user_token.set(token);
        const user = await client.get<any>('/users/me');
        user_profile.set(user);
        return user;
    })
}

// export function oauthLogin(accessToken: string,provider:string):Promise<User> {
//     return client.get<any>(`/auth/${provider}/callback?access_token=${accessToken}`,true).then(async loginResponse => {
//         if(loginResponse.status!=200) throw Error;
//         const token = getCookie(loginResponse.headers.map['set-cookie'],"token");
//         user_token.set(token);
//         const user = await client.get<any>('/users/me');
//         user_profile.set(user);
//         return user;
//     })
// }

interface ProfileUpdate {
    avatar_url: string
    bio: string
    email: string
    username: string
    new_password: string
}

export function update(update: ProfileUpdate):Promise<User> {
    let payload:any = {
        image: update.avatar_url,
        bio: update.bio,
        username: update.username,
        email: update.email,
    }
    if (update.new_password) {
        payload.new_password = update.new_password;
    }

    return client.put<any>('/users/me', {
        user: payload
    }).then(userResponse => {
        let user = userResponse.user;
        user_token.set(userResponse.jwt);
        user_profile.set(user);
        return user;
    })
}


export function signup(email: string):Promise<User> {
    return client.post<any>('/auth/local/register', {
        username: email,
        email: email
    },true).then(async response => {
        const token = getCookie(response.headers.map['set-cookie'],"token");
        user_token.set(token);
        const user = await client.get<any>('/users/me');
        user_profile.set(user);
        return user;
    })
}
import { writable, derived, get } from 'svelte/store';
import * as appSettings from '@nativescript/core/application-settings'

function buildUUIDStore() {
    const uuid = writable(appSettings.getString('uuid', null));
    return {
        subscribe: uuid.subscribe,
        set(value) {
            if (value) {
                appSettings.setString('uuid', value); 
            } else {
                appSettings.remove('uuid');
            }
            uuid.set(value);
        }
    }
}

export const uuid = buildUUIDStore();
import { EventEmitter } from "~/utils/eventemitter";
import { get } from 'svelte/store';
import { user_token } from '~/store/user'

type ValidationErrors = {[index: string]: string[]}

class ApiError {
    constructor(message, errorCode = null) {
        this.message = message;
        this.errorCode = errorCode;
    }
    errors: ValidationErrors = {};
    errorCode: number = 0;
    message: string = "Api Error"
}


class ApiClient {
    onError: EventEmitter<ApiError>;

    constructor() {
        this.onError = new EventEmitter<ApiError>();
    }

    async sendRequest<T>(relative_url: string, method: string, payload = null, raw = false): Promise<T> {
        // console.log('fetching ', `${API_BASE}${relative_url}`, method);
        let headers = {}
        if (payload) {
            headers['Content-Type'] = 'application/json';
            headers['Accept'] = "application/json"
        }
        const token = get(user_token);
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
        let res;
        try {
           res = await fetch(
                `${API_BASE}${relative_url}`,
                {
                    method: method,
                    mode: "cors",
                    headers: headers,
                    body: payload ? JSON.stringify(payload) : null
                }
            )
        } catch (e) {
            console.log("error running fetch", e)
            throw e;
        }

        if (!res.ok) {
            let err = new ApiError(res.statusText, res.status)
            if (res.status == 422) {
                try {
                    let validation_errors = await res.json();
                    err.errors = validation_errors;
                } catch {}
            }
            this.onError.fire(err);
            throw err;
        }

        try {
            // console.log("res",res.json());
            if(raw) return res;
            else return await res.json()
        } catch {
            let err = new ApiError("Error parsing server response");
            this.onError.fire(err);
            throw err;
        }
    }
    async get<T>(relative_url: string, raw = false): Promise<T> {
        return this.sendRequest(relative_url, "GET", null, raw);
    }
    async post<T>(relative_url: string, payload = null, raw = false): Promise<T> {
        return this.sendRequest(relative_url, "POST", payload, raw);
    }
    async put<T>(relative_url: string, payload = null, raw = false): Promise<T> {
        return this.sendRequest(relative_url, "PUT", payload, raw);
    }
    async delete<T>(relative_url: string, payload = null, raw = false): Promise<T> {
        return this.sendRequest(relative_url, "DELETE", payload, raw);
    }
}

export let client = new ApiClient();
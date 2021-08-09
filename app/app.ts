/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import { svelteNative } from "svelte-native";
import Home from  "./views/main.svelte";
import Login from  "./views/login.svelte";
import AlarmPage from './views/alarm/index.svelte';
import Theme from "@nativescript/theme";

import { get } from 'svelte/store';
import { user_token } from './store/user'
import { registerNativeViewElement } from 'svelte-native/dom'
import {  navigate } from 'svelte-native'
import { Toasty,ToastDuration } from "@triniwiz/nativescript-toasty"
import { Application, isAndroid, AndroidApplication } from "@nativescript/core";
import { createAndroidNotificationChannel } from "./android-notification";


require("@nativescript/firebase").firebase;

console.log('start app');
// registerUniversalLinkCallback(async ul => {
//     console.log('Got the following appURL');
//     console.dir(ul);

//     const pathElements = ul.pathname.split("/");    
//     if(ul.origin.indexOf('oauth')>-1){
//         const urlParams = new URLSearchParams(ul.href);
//         const provider = pathElements[1]
//         const access_token = urlParams.get('access_token')
//         try {
//             await oauthLogin(access_token,provider)
//             navigate(
//                 { page: Home, clearHistory: true }
//             )
//         } catch (error) {
//             const toast = new Toasty({ text: `Login mit ${provider} hat leider nicht geklappt. Bitte informiere uns über psyweb@uni-muenster.de` }).setToastDuration(ToastDuration.LONG);
//             toast.show();
//         }
//     }
//   });



if (isAndroid) {
  try {
    Application.android.on(
      AndroidApplication.activityCreatedEvent,
      (args: any) => {
        createAndroidNotificationChannel({
          id: "channelId_01",
          name: "Alarme",
          description: "Standard Alarm",
          soundFilename: "alarm2", //  filename (without the extension)
        });
      }
    );

    // Activity Started (app started/booted)
    Application.android.on(
      AndroidApplication.activityResumedEvent,
      (args: any) => {
        if (args.activity) {
          let extras = args.activity.getIntent().getExtras();
          console.log("!!!!!!!!!!!!!!!!!!!extras:",extras);
          if(extras) {
            let id = JSON.parse(extras.getString("id"));
            let template = JSON.parse(extras.getString("template"));
            console.log("id is " + id);
            navigate(
                              { page: AlarmPage, props:{id,template} }
                          )
          }
        }
        console.log("Event: " + args.eventName + ", Activity: " + args.activity);
      }
    );
  } catch (e) {
    console.log('Error setting up Android Events', e);
  }
}


registerNativeViewElement("svgimage", () => require('@sergeymell/nativescript-svg').SVGImage);

Theme.setMode(Theme.Light);

if (!get(user_token)) {
    svelteNative(Login, {});
}else{
    svelteNative(Home, {});
}


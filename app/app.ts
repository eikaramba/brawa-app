/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import { svelteNative } from "svelte-native";
import Home from  "./views/main.svelte";
import Login from  "./views/login.svelte";
import Module from  "./views/alarm/module.svelte";
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
          id: "AlarmA",
          name: "Alarmtyp A",
          description: "Wird ausgelöst bei potentielle Brandgefahren",
          soundFilename: "alarma",
        });
        createAndroidNotificationChannel({
          id: "AlarmB",
          name: "Alarmtyp B",
          description: "Wird ausgelöst bei potentielle Brandgefahren",
          soundFilename: "alarmb",
        });
        createAndroidNotificationChannel({
          id: "reminder",
          name: "Erinnerungen",
          description: "Zur Erinnerung an die Funktionsweise der App"
        });
      }
    );

    // import { Observable, Frame } from '@nativescript/core';
    // Frame.topmost().navigate({
    //   moduleName: `plugin-demos/${args.object.text}`,
    // });
    // Activity Started (app started/booted)
    // Application.android.on(
    //   AndroidApplication.activityResumedEvent,
    //   (args: any) => {
    //     if (args.activity) {
    //       let extras = args.activity.getIntent().getExtras();
    //       console.log("!!!!!!!!!!!!!!!!!!!extras:",extras);
    //       if(extras) {
    //         let id = JSON.parse(extras.getString("id"));
    //         let template = JSON.parse(extras.getString("template"));
    //         console.log("id is " + id);
    //         navigate(
    //                           { page: AlarmPage, props:{id,template} }
    //                       )
    //       }
    //     }
    //     console.log("Event: " + args.eventName + ", Activity: " + args.activity);
    //   }
    // );
  } catch (e) {
    console.log('Error setting up Android Events', e);
  }
}


registerNativeViewElement("svgimage", () => require('@sergeymell/nativescript-svg').SVGImage);

Theme.setMode(Theme.Light);

// svelteNative(AlarmPage as typeof SvelteComponent, {

//     id:60,
//     moduleStep:0,
//     template:
//       {
//         id:1,
//         layout:'ampelA',
//         brandwahrscheinlichkeit:45,
//         callToAction_text:'<h1 style="text-align:center;">Bitte <span style="color:#FF9D33;">geh </span>in den nächsten Raum</h1><h2 style="text-align:center;">überschrift 2</h2><h3 style="text-align:center;">überschrift 3</h3><p style="text-align:center;">normaler text</p><p style="text-align:center;"><span style="color:#EF4444;"><strong><u>Jetzt sofort!</u></strong></span></p>',
//         callToAction_button:'Hab ich gemacht',
//         reminder:false,
//         quittierung_text:'Super, danke das du das gemacht hast. Im Folgenden möchten wir Dir gerne noch ein paar Fragen stellen',
//         randomisierte_module:false,
//         gamification_nutzen:false,
//         nfc_nutzen:false,
//         fehlalarm:false,
//         modules:[
//           {
//             components: [
//               {
//                 __component: 'components.question',
//                 isRanking:true,
//                 question:"Ich bin der klügste im ganzen raum",
//                 answers: [
//                   {
//                     label: 'Ich stimme vollkommen zu'
//                   },
//                   {
//                     label: 'Ich stimme in Teilen zu'
//                   },
//                   {
//                     label: 'Ich stimme bedingt zu'
//                   },
//                   {
//                     label: 'Ich stimme meistens nicht zu'
//                   },
//                   {
//                     label: 'Ich stimme generell nicht zu'
//                   },
//                   {
//                     label: 'Ich stimme gar nicht zu'
//                   }
//                 ]
//               },
//               {
//                 __component: 'components.question',
//                 question:"nochmal anders dargstellt",
//                 multipleAnswersAllowed:true,
//                 answers: [
//                   {
//                     label: 'Ich stimme vollkommen zu'
//                   },
//                   {
//                     label: 'Ich stimme in Teilen zu'
//                   },
//                   {
//                     label: 'Ich stimme bedingt zu'
//                   },
//                   {
//                     label: 'Ich stimme meistens nicht zu'
//                   }
//                 ]
//               },
//               {
//                 __component: 'components.textfield',
//                 label:"Wie lautet dein Name?"
//               }
//             ]
//           }
//         ]
//       }
// });
// svelteNative(Module as typeof SvelteComponent, {

//   id:0,
//   moduleStep:0,
//   template:
//     {
//       modules:[
//         {
//           components: [
//             {
//               __component: 'components.question',
//               isRanking:true,
//               question:"Ich bin der klügste im ganzen raum",
//               answers: [
//                 {
//                   label: 'Ich stimme vollkommen zu'
//                 },
//                 {
//                   label: 'Ich stimme in Teilen zu'
//                 },
//                 {
//                   label: 'Ich stimme bedingt zu'
//                 },
//                 {
//                   label: 'Ich stimme meistens nicht zu'
//                 },
//                 {
//                   label: 'Ich stimme generell nicht zu'
//                 },
//                 {
//                   label: 'Ich stimme gar nicht zu'
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     }
// });
if (!get(user_token)) {
    svelteNative(Login as typeof SvelteComponent, {});
}else{
    svelteNative(Home as typeof SvelteComponent, {});
}


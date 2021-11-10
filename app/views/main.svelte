<page actionBarHidden="true">
    <scrollView orientation="vertical" height="100%" width="100%">
        <stackLayout class="page ns-light px-4">
            {#await loadingPromise}
                <flexboxLayout height="100%" alignItems="center" justifyContent="center" flexDirection="column">
                    <activityIndicator busy="true" horizontalAlignment="center" verticalAlignment="center" height="25%" width="25%" />
                </flexboxLayout>
            {:then}
            <stackLayout height="100%" paddingTop="{statusBarHeight}px">
                {#if $user_profile}
                <label textWrap="true" class="text-sm font mt-2 text-right text-gray-500" text="Eingeloggt als {$user_profile.email}" />
                <label text="Ausloggen" class="-mt-1 text-sm text-green text-right" on:tap="{doLogout}" />
                {/if}

                
                {#if checkDevice()|| isBackgroundRestricted || !hasDnDPermission || !isDnDBypassed || (activityRecognitionAvailable && !permissionsGranted)}
                <label textWrap="true" class="text-xl font-medium mt-6" text="Einrichtung der App" />
                
                <label textWrap="true" class="text-md mt-4" text="Bitte beachten Sie die folgenden Hinweise, um ein möglichst reibungsloses Funktionieren der App zu garantieren:" />
                {/if}
                
                {#if isBackgroundRestricted}
                <stackLayout class="my-4 p-4 bg-red rounded-lg text-white" on:tap="{()=>{toggleTab(0)}}">
                    <flexboxLayout alignItems="center">
                        <label class="text-lg font-medium bg-white rounded-full w-7 h-7 text-red text-center" text="1" />
                        <label class="ml-2 text-md font-medium text-white " text="Optimierungen für Brawa deaktivieren" />
                    </flexboxLayout>
                    {#if setupTabOpen==0}
                        <label textWrap="true" class="text-md mt-4" text="Die Akku Optimierung ist für die App aktiv. Dies kann das Empfangen von Alarmen beeinflußen. Bitte in den Einstellungen unter 'Akku' deaktivieren." />
                        <button on:tap={openAppSettings} class="text-md text-white bg-red-800 my-0 w-full" text="Akku Optimierungen für Brawa abschalten" />
                    {/if}
                </stackLayout>
                {/if}

                {#if !hasDnDPermission || !isDnDBypassed}
                <stackLayout class="my-4 p-4 bg-orange rounded-lg text-white" on:tap="{()=>{toggleTab(1)}}">
                    <flexboxLayout alignItems="center">
                        <label class="text-lg font-medium bg-white rounded-full w-7 h-7 text-red-800 text-center" text="{(isBackgroundRestricted&1)+1}" />
                        <label class="ml-2 text-md font-medium text-white " text="Stummschaltung ignorieren" />
                    </flexboxLayout>
                    {#if setupTabOpen==1}
                    <label textWrap="true" class="text-md my-4" text="Um keine Benachrichtigungen im Modus 'Nicht stören' zu verpassen, bitte Button klicken und auf der folgenden Seite Brawa den Zugriff zulassen:" />
                    <button on:tap="{requestDnDPermissions}" class="text-md text-white bg-gray-700 my-0 w-full" text="Bitte nicht stören Zugriff zulassen" />
                    <label textWrap="true" class="text-sm mt-4" text="Sichergehen das folgende Einstellung aktiv ist (sollte automatisch gesetzt werden nach erlauben der obigen Berechtigung):" />
                    <label on:tap="{openAppSettings}" textWrap="true" class="text-sm underline font-medium" text="1. App Details aufrufen" />
                    <label textWrap="true" class="text-sm" text="2. Benachrichtigungen anklicken" />
                    <label textWrap="true" class="text-sm" text="3. Jeweils 'AlarmA', 'AlarmB' und 'Erinnerungen' anklicken und ..."/>
                    <label textWrap="true" class="text-sm" text="4. Unter Erweitert -> 'Bitte nicht stören ignorieren' muss eingeschaltet sein"/>
                    <image class="mt-2" src="~/images/donotdisturb.png" stretch="aspectFit" />
                    {/if}
                </stackLayout>
                {/if}
                
                {#if activityRecognitionAvailable && !permissionsGranted}
                <stackLayout class="my-4 p-4 bg-yellow-400 rounded-lg text-white" on:tap="{()=>{toggleTab(2)}}">
                    <flexboxLayout alignItems="center">
                        <label class="text-lg font-medium bg-white rounded-full w-7 h-7 text-yellow-800 text-center" text="{(isBackgroundRestricted&1)+(!isDnDBypassed & 1)+1}" />
                        <label class="ml-2 text-md font-medium text-white " text="Schrittzähler Berechtigung erteilen" />
                    </flexboxLayout>
                    {#if setupTabOpen==2}
                    <label textWrap="true" class="text-md my-4" text="Sobald ein Alarm ausgelöst und geöffnet wird, versucht die App die zurückgelegte Strecke in Schritten zu zählen. Dies funktioniert auf Android jedoch nur mit Ihrer ausdrücklichen Zustimmung." />
                    <button on:tap="{requestStepPermissions}" class="text-md text-white bg-yellow-600 my-0 w-full" text="Berechtigungen erlauben" />
                    {/if}
                </stackLayout>
                {/if}

                {#if checkDevice()}
                <stackLayout class="my-4 p-4 bg-gray-700 rounded-lg text-white" on:tap="{()=>{toggleTab(3)}}">
                    <flexboxLayout alignItems="center">
                        <label class="text-lg font-medium bg-white rounded-full w-7 h-7 text-gray-700 text-center" text="{(isBackgroundRestricted&1)+(!isDnDBypassed & 1)+((activityRecognitionAvailable && !permissionsGranted) & 1)+1}" />
                        <label class="ml-2 text-md font-medium text-white " text="Hersteller spezifische Probleme lösen" />
                    </flexboxLayout>
                    {#if setupTabOpen==3}
                        <label textWrap="true" class="text-md mt-4">
                            <formattedString>
                                <span text="Bei {Device.manufacturer} Handys ist es bekannt, dass Apps oft " />
                                <span text="keine Benachrichtigungen" fontWeight="bold" />
                                <span text=" empfangen können." />
                            </formattedString>
                        </label>
                        
                        <label textWrap="true" class="text-md mt-4">
                            <formattedString>
                                <span text="Bitte befolgen Sie daher die Tipps auf der folgenden " />
                                <span text="Seite, um die Optimierungen für die Brawa App" fontWeight="bold" />
                                <span text=" abzuschalten. Ansonsten kann es passieren, dass keine Alarme durchkommen!" />
                            </formattedString>
                        </label>

                        <button on:tap="{Utils.openUrl(helpLink)}" class="text-md text-white bg-gray-800 my-0 w-full" text="Infos zur Problemlösung öffnen" />


                        <label textWrap="true" class="text-md mt-4 italic" text="Aus technischen Gründen bleibt dieser Teil der Anleitung zu den Berechtigungen stehen. Dadurch ist die Funktionsweise der App nicht beeinträchtigt!" />
                    {/if}
                </stackLayout>
                {/if}
                

                
            </stackLayout>
            {/await}
        </stackLayout>
    </scrollView>
</page>

<script>
    import { user_token, user_profile,logout } from '../store/user'
    import {getStatusbarHeight} from '~/utils/helpers'
    import { onMount } from 'svelte'
    import { firebase } from "@nativescript/firebase";
    import { client } from '~/lib/client'
    import { Device,Utils,Application,AndroidApplication,Frame } from '@nativescript/core';
    import AlarmPage from './alarm/index.svelte';
    import ReminderPage from './reminder.svelte';
    import Login from './login.svelte';
    import { navigate } from 'svelte-native'
    import { Toasty,ToastDuration } from "@triniwiz/nativescript-toasty"
    import { crashlytics } from "@nativescript/firebase/crashlytics";
    const permissions = require( "nativescript-permissions" );
    import { createAndroidNotificationChannel } from "../android-notification";
    

    let statusBarHeight=0;
    let setupTabOpen=-1;
    let permissionsGranted=false;
    let activityRecognitionAvailable=false;
    let loadingPromise = Promise.resolve([]);
    let isDnDBypassed=false;
    let hasDnDPermission=false;
    let isBackgroundRestricted=false;
    let activityResumedEventListening=false;
    const listOfAffectedManufacturers = [
        "samsung",
        "xiaomi",
        "huawei",
        "oneplus",
        "oppo",
        "vivo",
        "nokia",
        "unihertz",
        "sony",
        "leonovo",
        "htc"
        ]
    let helpLink="https://dontkillmyapp.com"


    function openAppSettings() {
        try {
            let Intent = new android.content.Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            Intent.addCategory(android.content.Intent.CATEGORY_DEFAULT);
			Intent.setData(android.net.Uri.parse('package:com.brawa.android'));
            Intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
			Application.android.context.startActivity(Intent);
        } catch (err) {
            console.log({err})
            crashlytics.sendCrashLog(new java.lang.Exception("error opening app details: "+err));
        }
    }

    function toggleTab(tab){
        if(setupTabOpen==tab)
            setupTabOpen=-1;
        else
            setupTabOpen=tab;
    }

    function doLogout() {
        logout();
        navigate(
            { page: Login }
        );
    }
    function requestDnDPermissions(){
        // Code to change DnD
        // <uses-permission android:name="android.permission.ACCESS_NOTIFICATION_POLICY" />
        let Intent = new android.content.Intent(android.provider.Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
        Intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        Application.android.context.startActivity(Intent);
        //TODO: Use manager.isNotificationPolicyAccessGranted()
        // then https://developer.android.com/reference/android/app/NotificationManager.html#setInterruptionFilter(int)
    }
    function requestStepPermissions(){
        permissions.requestPermission(android.Manifest.permission.ACTIVITY_RECOGNITION, "Wird benötigt um Bewegungsmuster zu messen.")
        .then( () => {
            permissionsGranted=true;
        })
        .catch( () => {
            console.log("no activity permissions granted");
        });
    }

    function checkDevice() {
        return listOfAffectedManufacturers.includes(Device.manufacturer.toLowerCase());
    }

    function generateDKMALink(){
        switch (Device.manufacturer.toLowerCase()) {
            case "samsung":
                return `https://dontkillmyapp.com/${Device.manufacturer.toLowerCase()}?app=Brawa`;
                break;
            case "xiaomi":
                return `https://dontkillmyapp.com/${Device.manufacturer.toLowerCase()}?app=Brawa`;
                break;
            case "huawei":
                return `https://dontkillmyapp.com/${Device.manufacturer.toLowerCase()}?app=Brawa`;
                break;
            case "oneplus":
                return `https://dontkillmyapp.com/${Device.manufacturer.toLowerCase()}?app=Brawa`;
                break;
            case "oppo":
                return `https://dontkillmyapp.com/${Device.manufacturer.toLowerCase()}?app=Brawa`;
                break;
            case "vivo":
                return `https://dontkillmyapp.com/${Device.manufacturer.toLowerCase()}?app=Brawa`;
                break;
            case "nokia":
                return `https://dontkillmyapp.com/${Device.manufacturer.toLowerCase()}?app=Brawa`;
                break;
            case "unihertz":
                return `https://dontkillmyapp.com/${Device.manufacturer.toLowerCase()}?app=Brawa`;
                break;
            case "sony":
                return `https://dontkillmyapp.com/${Device.manufacturer.toLowerCase()}?app=Brawa`;
                break;
            case "leonovo":
                return `https://dontkillmyapp.com/${Device.manufacturer.toLowerCase()}?app=Brawa`;
                break;
            case "htc":
                return `https://dontkillmyapp.com/${Device.manufacturer.toLowerCase()}?app=Brawa`;
                break;
        }

    }

    onMount(async ()=>{
        helpLink = generateDKMALink();
        loadingPromise = new Promise(resolve => setTimeout(resolve, 500));
        if (global.isAndroid && Device.sdkVersion >= '29') {
            activityRecognitionAvailable=true;
            permissionsGranted = permissions.hasPermission(android.Manifest.permission.ACTIVITY_RECOGNITION);
        }
        statusBarHeight = getStatusbarHeight();
        console.log("starting app with ", $user_profile, $user_token);
        if (!$user_profile) {
            console.log("load user profile");
            await user_profile.loadUserFromToken();
            console.log("profile loaded from server:", $user_profile);
        }
        try {
            crashlytics.setUserId(""+$user_profile.id);
            crashlytics.setString("userId", $user_profile.id);
        } catch (err) {
            console.log("error setting userId", err);
        }

        try {
            var activity = Application.android.foregroundActivity || Application.android.startActivity  
            console.log("created");
            handleAlarmsAndPermissions(activity)
        } catch (err) {
            console.log(err)
        }

        firebase.init({
            showNotifications: false,
            showNotificationsWhenInForeground: false,

            onPushTokenReceivedCallback: async (fcmToken) => {
                    console.log('[Firebase] onPushTokenReceivedCallback:', { fcmToken });
                    await registerOrUpdateToken(fcmToken);
            }
        })
        .catch(error => {
            console.log('[Firebase] Initialize', { error });
            crashlytics.sendCrashLog(new java.lang.Exception("[Firebase] Initialize failed: "+JSON.stringify(error)));
        });
     

        if(!activityResumedEventListening) {
            Application.android.on(
            AndroidApplication.activityResumedEvent,
            (args) => {
                console.log("resumed");
                handleAlarmsAndPermissions(args.activity)
            }
            );
            activityResumedEventListening = true;
        }
    })
    function handleAlarmsAndPermissions(activity){
        var intentExtras = activity.getIntent().getExtras();
        if(intentExtras){
            let templateJson = activity.getIntent().getStringExtra("templateJson");
            let alarmId = activity.getIntent().getIntExtra("alarmId",-1);
            console.log("alarmId", alarmId);
            console.log("templateJson", templateJson);
            if(alarmId && alarmId!=-1){
                activity.getIntent().removeExtra("alarmId"); 
                activity.getIntent().removeExtra("templateJson"); 
                const template = JSON.parse(templateJson);
                if(template.reminder) {
                    navigate({ page: ReminderPage,props:{id:alarmId,template} });
                }else{
                    navigate({ page: AlarmPage,props:{id:alarmId,template} });
                }
            }
        }else{
            checkPermissions();
            if(!isDnDBypassed && hasDnDPermission){
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
                checkPermissions();
            }
        }
    }

    function checkPermissions(){
        const context = Utils.ad.getApplicationContext();
        const manager = context.getSystemService(
            android.app.NotificationManager.class
        );
        const channel1 = manager.getNotificationChannel("AlarmA");
        const channel2 = manager.getNotificationChannel("AlarmB");
        isDnDBypassed = channel1.canBypassDnd() && channel2.canBypassDnd()
        hasDnDPermission = manager.isNotificationPolicyAccessGranted();
        
        if (global.isAndroid && Device.sdkVersion >= '28') {
            try {
                const context = Utils.ad.getApplicationContext();
                const activityManager = context.getSystemService(android.content.Context.ACTIVITY_SERVICE);
                isBackgroundRestricted = activityManager.isBackgroundRestricted();
            } catch (err) {
                console.log(err);
            }
        }
    }
     async function registerOrUpdateToken(newfcmToken){
        try {
                if($user_profile.fcmToken!=newfcmToken){
                    console.log(`update old token ${$user_profile.fcmToken} with new token ${newfcmToken}`);
                    await client.put(`/users/${$user_profile.id}`,{
                            fcmToken:newfcmToken
                    });
                }
            } catch (err) {
                const toast = new Toasty({ text: `Fehler: "${err}"` }).setToastDuration(ToastDuration.LONG);
                toast.show();
            }
     }


/*
how to do fcm in js purely https://discord.com/channels/603595811204366337/751068755206864916/906127778724859944
function remoteMessageToJs(remoteMessage) {
    var json = new org.json.JSONObject()
    json.put("from", remoteMessage.getFrom())

    var notif = remoteMessage.getNotification()
    if (notif != null) {
        json.put("title", notif.getTitle()).put("body", notif.getBody())
    }

    var data_json = new org.json.JSONObject()
    var iterator = remoteMessage.getData().entrySet().iterator()
    while (iterator.hasNext())
    {
        var entry = iterator.next()

        data_json.put(entry.getKey(), entry.getValue())
    }
    json.put("data", data_json)

    return JSON.parse(json)
}

com.google.firebase.messaging.FirebaseMessagingService.extend("org.nativescript.xxx.MyFirebaseMessagingService", {

    onMessageReceived(remoteMessage) {
        var message = remoteMessageToJs(remoteMessage)

        
    }

})


in webpack.config.js:

module.exports = (env) => {
    env.appComponents = (env.appComponents || []).concat([
        './app/Backend/Firebase',
    ])

...
})


in the manifest I have:

<service
            android:name=".MyFirebaseMessagingService"
            android:exported="true">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT"/>
            </intent-filter>
        </service>
 */
</script>

<style>
    
</style>

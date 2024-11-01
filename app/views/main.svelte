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
                {/if}
                <label text="Ausloggen" class="-mt-1 text-sm text-green text-right" on:tap="{doLogout}" />

                
                {#if checkDevice()|| isBackgroundRestricted || (Device.sdkVersion >= '23' && (!hasDnDPermission || !isDnDBypassed)) || (activityRecognitionAvailable && !permissionsGranted)}
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

                {#if Device.sdkVersion >= '23' && (!hasDnDPermission || !isDnDBypassed)}
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
                <stackLayout class="mt-4 p-4 bg-gray-700 rounded-lg text-white" on:tap="{()=>{toggleTab(3)}}">
                    <flexboxLayout alignItems="center">
                        <label class="text-lg font-medium bg-white rounded-full w-7 h-7 text-gray-700 text-center" text="{(isBackgroundRestricted&1)+(!isDnDBypassed & 1)+((activityRecognitionAvailable && !permissionsGranted) & 1)+1}" />
                        <label class="ml-2 text-md font-medium text-white " text="Herstellerspezifische Probleme lösen" />
                    </flexboxLayout>
                    {#if setupTabOpen==3}
                        <label textWrap="true" class="text-md mt-4">
                            <formattedString>
                                <span text="Bei {Device.manufacturer}-Smartphones ist es bekannt, dass Apps oft " />
                                <span text="keine Benachrichtigungen" fontWeight="bold" />
                                <span text=" empfangen können." />
                            </formattedString>
                        </label>
                        
                        <label textWrap="true" class="text-md mt-4">
                            <formattedString>
                                <span text="Sollte dieses Problem bei Ihnen auftreten, befolgen Sie bitte die " />
                                <span text="Tipps auf der folgenden Seite." fontWeight="bold" />
                            </formattedString>
                        </label>

                        <button on:tap="{Utils.openUrl(helpLink)}" class="text-md text-white bg-gray-800 my-0 w-full" text="Infos zur Problemlösung öffnen" />


                    {/if}
                </stackLayout>
                <label textWrap="true" class="text-sm mb-4 italic" text="Aus technischen Gründen bleibt diese Anweisung auch nach der Erteilung der Berechtigungen stehen. Dadurch ist die Funktionsweise der App nicht zwangsläufig  beeinträchtigt!" />
                    
                {/if}

                {#if $user_profile.points>0}
                <stackLayout orientation="vertical" class="bg-gray-200 p-4 text-center">
                    <label textWrap="true" class="text-md">
                        <formattedString>
                            <span text="Dein aktueller Punktestand: " />
                            <span text="{$user_profile.points}" fontWeight="bold" />
                        </formattedString>
                    </label>
                    <label textWrap="true" class="text-md" text="Du hast Level {level} erreicht!" />
                    <flexboxLayout alignItems="center">
                        <svgview src="~/images/badge1{level<1?'_disabled':''}.svg" width="100%" height="46" margin="0 0 0 0" />
                        <svgview src="~/images/badge2{level<2?'_disabled':''}.svg" width="100%" height="46" margin="0 0 0 0" />
                        <svgview src="~/images/badge3{level<3?'_disabled':''}.svg" width="100%" height="46" margin="0 0 0 0" />
                        <svgview src="~/images/badge4{level<4?'_disabled':''}.svg" width="100%" height="46" margin="0 0 0 0" />
                        <svgview src="~/images/badge5{level<5?'_disabled':''}.svg" width="100%" height="46" margin="0 0 0 0" />
                    </flexboxLayout>
                </stackLayout>
                {/if}
            
                <label textWrap="true" class="text-xl font-medium mt-6" text="Testalarm anhören" />
                <label textWrap="true" class="mt-4 text-md " text="Um sicherzugehen, dass alles funktioniert und um den Alarm einmal anzuhören, können Sie sich selbst einen Alarm per Knopfdruck erstellen lassen." />
                <button on:tap="{createTestAlarm}" class="text-md text-white bg-gray-800 mt-2 icon" text="{mdi['alarm-add']} Alarm in 10 Sekunden erzeugen" />
                
            </stackLayout>
            {/await}
        </stackLayout>
    </scrollView>
</page>

<script>
    import { user_token, user_profile,logout } from '../store/user'
    import {getStatusbarHeight} from '~/utils/helpers'
    import { onMount,tick } from 'svelte'
    import { client } from '~/lib/client'
    import { Device,Utils,Application,AndroidApplication,isIOS } from '@nativescript/core';
    import AlarmPage from './alarm/index.svelte';
    import ReminderPage from './reminder.svelte';
    import Login from './login.svelte';
    import { navigate } from 'svelte-native'
    import { Toasty,ToastDuration } from "@triniwiz/nativescript-toasty"
    const permissions = require( "nativescript-permissions" );
    import { createAndroidNotificationChannel } from "../android-notification";
    import { mdi } from '~/utils/icons'

    // import permissions from "@master.technology/permissions";
    import { firebase } from '@nativescript/firebase-core';
    firebase().messaging().showNotificationsWhenInForeground = true;
    const crashlytics = firebase().crashlytics();
    
    $: level = $user_profile.points/100;
    let statusBarHeight=0;
    let setupTabOpen=-1;
    let permissionsGranted=false;
    let activityRecognitionAvailable=false;
    let loadingPromise = Promise.resolve([]);
    let isDnDBypassed=false;
    let hasDnDPermission=false;
    let isBackgroundRestricted=false;
    let activityResumedEventListening=false;
    let FCMTokenReceived=false;
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
            crashlytics.recordError(err)
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
            { page: Login, clearHistory: true  }
        );
    }
    function requestDnDPermissions(){
        // Code to change DnD
        // <uses-permission android:name="android.permission.ACCESS_NOTIFICATION_POLICY" />
        let Intent = new android.content.Intent(android.provider.Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
        Intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        Utils.android.getApplicationContext().startActivity(Intent);
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
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
        if (!$user_profile || $user_profile?.id == null) {
            console.log("load user profile");
            try {
                await user_profile.loadUserFromToken();
            } catch (err) {}
            if (!$user_profile || $user_profile?.id == null) {
                return doLogout();
            }
            console.log("profile loaded from server:", $user_profile);
        }
        try {
            crashlytics.setUserId(""+$user_profile.id);
            crashlytics.setAttribute("userId", String($user_profile.id));
        } catch (err) {
            console.log("error setting userId", err);
        }

        try {
            var activity = Application.android.foregroundActivity || Application.android.startActivity
            /*
              you should be able to use them just fine; but need a full understanding of the NativeScript UI lifecycle
              Frame and Page in particular are pretty weird components
              The "loaded" event is very useful indeed, because that's when both the NativeScript (JavaScript) class instance has been added into the tree and more importantly its underlying native component has been loaded (specifically the event is fired on the latter – JS class instance gets inserted first, and the underlying native component gets inserted second). 
             */
            await handleAlarmsAndPermissions(activity)
        } catch (err) {
            console.log(err)
        }

        try {
            let enabled = false;
            if (isIOS || android.os.Build.VERSION.SDK_INT >= 33) {
                try {
                    await permissions.requestPermission(android.Manifest.permission.POST_NOTIFICATIONS, "Für Push Benachrichtigungen benötigt");
                    // await permissions.requestPermission(android.Manifest.permission.POST_NOTIFICATIONS)
                    enabled = true;
                }catch(error) {
                    console.log(error);
                    const toast = new Toasty({ text: `Bitte Berechtigung für Benachrichtigungen erteilen` }).setToastDuration(ToastDuration.LONG);
                    toast.show();
                }
            }else{
                enabled = true;
            }
            console.log("fcm enabled", enabled);
            if (enabled) {
                await firebase().messaging().registerDeviceForRemoteMessages();

                firebase().messaging()
                .getToken()
                .then(async token => {
                    await registerOrUpdateToken(token);
                });
                firebase().messaging().onToken(async token => {
                    await registerOrUpdateToken(token);
                });

                // firebase()
                // .messaging()
                // .onMessage(async (remoteMessage) => {
                //     console.log(JSON.stringify(remoteMessage));
                // });
            
            }
        }catch(error) {
            console.log('[Firebase] Initialize', { error });
            if(error=="Firebase already initialized"){
                console.log("manually getting token")
                firebase().messaging().getToken().then(async (fcmtoken) => {
                    console.log('[Firebase] getCurrentPushToken:', { fcmtoken });
                    await registerOrUpdateToken(fcmtoken);
                });
            }else
                crashlytics.recordError(error)
        }

        if(!activityResumedEventListening) {
            Application.android.on(
            Application.android.activityResumedEvent,
            (args) => {
                console.log("resumed");
                try {
                    user_profile.loadUserFromToken();
                } catch (err) {}
                handleAlarmsAndPermissions(args.activity)
            }
            );
            activityResumedEventListening = true;
        }
    })
    async function handleAlarmsAndPermissions(activity){
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
                await timeout(100);
                await tick(); // see https://github.com/halfnelson/svelte-native/issues/82
                    try {
                        if(template.reminder) {
                            navigate({ page: ReminderPage,props:{id:alarmId,template} });
                        }else{
                            navigate({ page: AlarmPage,props:{id:alarmId,template} });
                        }
                    } catch (err1) {
                        console.log({err1})
                        await timeout(3000);
                        try {
                            if(template.reminder) {
                                navigate({ page: ReminderPage,props:{id:alarmId,template} });
                            }else{
                                navigate({ page: AlarmPage,props:{id:alarmId,template} });
                            }
                        } catch (err2) {
                            console.log({err2})
                            crashlytics.recordError(err2)
                        }
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
        const context = Utils.android.getApplicationContext();
        const manager = context.getSystemService(
            android.app.NotificationManager.class
        );
        const channel1 = manager.getNotificationChannel("AlarmA");
        const channel2 = manager.getNotificationChannel("AlarmB");
        isDnDBypassed = channel1.canBypassDnd() && channel2.canBypassDnd()
        hasDnDPermission = manager.isNotificationPolicyAccessGranted();
        
        if (global.isAndroid && Device.sdkVersion >= '28') {
            try {
                const activityManager = context.getSystemService(android.content.Context.ACTIVITY_SERVICE);
                isBackgroundRestricted = activityManager.isBackgroundRestricted();
            } catch (err) {
                console.log(err);
            }
        }
    }
     async function registerOrUpdateToken(newfcmToken){
        if(FCMTokenReceived) return;
        FCMTokenReceived=true;
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
        setTimeout(()=>{FCMTokenReceived=false;},5000);
     }

     async function createTestAlarm(){
        await client.post(`/alarms/test`,{ });
        (new Toasty({ text: `Bitte die App jetzt schließen und auf den Alarm warten` }).setToastDuration(ToastDuration.SHORT)).show();
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

<page actionBarHidden="true">
    <scrollView  height="100%" width="100%">
            {#await loadingPromise}
                <flexboxLayout class="page ns-light p-2" height="100%" alignItems="center" justifyContent="center" flexDirection="column">
                <activityIndicator busy="true" horizontalAlignment="center" verticalAlignment="center" height="25%" width="25%" />
                </flexboxLayout>
            {:then}
            <stackLayout class="page ns-light p-4" height="100%" paddingTop="{statusBarHeight}px">
                {#if $user_profile}
                <label textWrap="true" class="text-md font-medium" text="Eingeloggt als {$user_profile.username} ({$user_profile.email})." />
                {/if}
                <!-- https://ajax.systems/de/blog/ajax-alerts/ -->
                <label textWrap="true" class="text-md mt-4" text="Um keine Benachrichtigungen im Modus 'Nicht stören' zu verpassen, muss die Option „Nicht stören“ ignorieren eingeschaltet werden." />
                {#if activityRecognitionAvailable && !permissionsGranted}
                <button text="Berechtigungen erlauben" class="text-md bg-white text-green border-0 border-white flatBtn mt-4 my-0 w-full" on:tap="{requestPermissions}" />
                {/if}
                <button text="App mit anderer Email nutzen" class="text-md bg-white text-green border-0 border-white flatBtn mt-4 my-0 w-full" on:tap="{doLogout}" />
            </stackLayout>
            {/await}
    </scrollView>
</page>

<script>
    import { user_token, user_profile,logout } from '../store/user'
    import {getStatusbarHeight} from '~/utils/helpers'
    import { onMount } from 'svelte'
    import { firebase } from "@nativescript/firebase";
    import { client } from '~/lib/client'
    import { Device } from '@nativescript/core';
    import AlarmPage from './alarm/index.svelte';
    import ReminderPage from './reminder.svelte';
    import Login from './login.svelte';
    import { navigate } from 'svelte-native'
    import { Toasty,ToastDuration } from "@triniwiz/nativescript-toasty"
    import { crashlytics } from "@nativescript/firebase/crashlytics";
    const permissions = require( "nativescript-permissions" );
    

    let statusBarHeight=0;
    let permissionsGranted=false;
    let activityRecognitionAvailable=false;
    let loadingPromise = Promise.resolve([]);

    function doLogout() {
        logout();
        navigate(
            { page: Login }
        );
    }
    function requestPermissions(){
        permissions.requestPermission(android.Manifest.permission.ACTIVITY_RECOGNITION, "Wird benötigt um Bewegungsmuster zu messen.")
        .then( () => {
            permissionsGranted=true;
        })
        .catch( () => {
            console.log("no activity permissions granted");
        });
    }

    onMount(async ()=>{
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
        crashlytics.setUserId($user_profile.id);
        crashlytics.setString("userId", $user_profile.id);

        firebase.init({
            showNotifications: true,
            showNotificationsWhenInForeground: true,

            onPushTokenReceivedCallback: async (fcmToken) => {
                    console.log('[Firebase] onPushTokenReceivedCallback:', { fcmToken });
                    await registerOrUpdateToken(fcmToken);
            },
        })
        .then(() => {
            console.log('[Firebase] Initialized');
            firebase.addOnMessageReceivedCallback((message) => {
                const template = JSON.parse(message.data.template);
                console.log('[Firebase] onMessageReceivedCallback:', { message });
                if(template.reminder) {
                    navigate({ page: ReminderPage,props:{id:message.data.id,template} });
                }else{
                    navigate({ page: AlarmPage,props:{id:message.data.id,template} });
                }
            })
        })
        .catch(error => {
            console.log('[Firebase] Initialize', { error });
        });
    })


     async function registerOrUpdateToken(newfcmToken){
        try {
                const uuid = Device.uuid;
                

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

</script>

<style>
    
</style>

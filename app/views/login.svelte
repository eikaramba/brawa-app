<page actionBarHidden="true" on:loaded="{pageLoaded}">
    <scrollView  height="100%" width="100%">
        <gridLayout class="layout page ns-light"  rows="auto, *, auto" >
            <stackLayout row="0" paddingTop="12" class="bg-dark text-white" verticalAlignment="center" >
                <stackLayout padding="0 24" verticalAlignment="center" >
                    <svgimage src="~/images/logo.svg" width="100%" height="46" margin="18 0 32" />
                <label textWrap="true" class="text-white text-center text-lg">
                    <formattedString>
                        <span text="Mit dieser App bist du Teil des " />
                        <span text="BRAWA Projektes zur frühen Bekämpfung von Bränden!" fontWeight="bold" />
                    </formattedString>
                </label>
                </stackLayout>
                <image src="~/images/line.png" width="100%" stretch="aspectFill" horizontalAlignment="stretch" />
            </stackLayout>
            

            <stackLayout row="1" class="px-8 pt-4" verticalAlignment="center" >

                <label textWrap="true" class="text-md" text="Bitte gib deine bei PsyWeb hinterlegte E-Mail ein, um die App zu aktivieren" />
                <textField class="input border-gray-300" hint="E-Mail" keyboardType="email" autocorrect="false" autocapitalizationType="none"
                    bind:text="{email}" returnKeyType="next" editable="{!isLoading}"/>
                    
                <button isEnabled="{!!email&&!isLoading}" text="Aktivieren" on:tap="{doLogin}" class="btn {email?'bg-red':'bg-gray-400'}" marginTop="20"/>

                <activityIndicator busy="{isLoading}" horizontalAlignment="center" verticalAlignment="center" class="activity-indicator" />
            </stackLayout>

            <label row="2" class="sign-up-label text-gray-400 text-sm" on:tap="{register}" horizontalAlignment="center">
                <formattedString>
                    <span text="Noch keinen Account?"/>
                    <span text=" Jetzt registrieren" fontWeight="bold" />
                </formattedString>
            </label>

        </gridLayout>
    </scrollView>
</page>
<style lang="scss">

    .btn {
        color: white;
        border-radius:24px;
        width:100%;
        text-transform: uppercase;
    }


    .input {
        width:100%;
        placeholder-color: var(--gray-300);
        font-size:18;
    }

    .sign-up-label {
        padding: 10 10 32 10;
    }

</style>

<script>
    import { alert } from 'tns-core-modules/ui/dialogs'
    import {  navigate } from 'svelte-native'
    import { onMount } from 'svelte'
    import { user_token, user_profile, login } from '../store/user'
    // import Register from './Register'
    import Home from './main.svelte'
    import Signup from './signup.svelte'
    import Theme from "@nativescript/theme";
    import { Utils } from '@nativescript/core'
    Theme.setMode(Theme.Light);


    let email;
    email="test@test.de";
    let isLoading = false;

    function pageLoaded(args){ //needed so that view is scrollable, even if keyboard is visible
        let page = args.object;
       if (page.android) {
         page.android.setFitsSystemWindows(true);
       }
    }
    onMount(()=> {
        if ($user_profile) {
            navigate(
                { page: Home, clearHistory: true }
            );
        }
    })

    async function doLogin() {
        isLoading = true
        await login(email).then(
            user => navigate(
                { page: Home, clearHistory: true }
            ),
            err => {
                if (err.errorCode == 422) {
                    alert("E-Mail nicht bekannt. Bitte die PsyWeb E-Mail nutzen")
                } else {
                    alert(err.message);
                }
            }
        )
        isLoading = false
    }

    function register() {
        navigate(
                { page: Signup}
            );
    }
    
    function openOauth(provider){
        Utils.openUrl(API_BASE+`/connect/${provider}?callback=brawa://oauth/${provider}`)  
    }
</script>
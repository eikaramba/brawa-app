<page actionBarHidden="true" on:loaded="{pageLoaded}">
    <scrollView  height="100%" width="100%">
        <gridLayout class="layout page ns-light"  rows="auto, *, auto" >
            <stackLayout row="0" paddingTop="12" class="bg-blue text-white" verticalAlignment="center" >
                <stackLayout padding="0 24" verticalAlignment="center" >
                <svgimage src="~/images/logo.svg" width="100%" height="46" margin="18 0 32" />
                <label textWrap="true" class="text-white text-center text-lg">
                    <formattedString>
                        <span text="Mit dieser App bist du Teil des" />
                        <span text="BRAWA Projektes zur frühen Bekämpfung von Bränden" fontWeight="bold" />
                        <span text="! Du musst dich mit deiner PsyWeb E-Mail einloggen ." />
                    </formattedString>
                </label>
                </stackLayout>
                <image src="~/images/line.png" width="100%" stretch="aspectFill" horizontalAlignment="stretch" />
            </stackLayout>
            

            <stackLayout row="1" class="px-8 pt-4" verticalAlignment="center" >

            
                <textField class="input border-gray-300" hint="E-Mail" keyboardType="email" autocorrect="false" autocapitalizationType="none"
                bind:text="{email}" returnKeyType="next" editable="{!isLoading}"/>
                
                <stackLayout orientation="horizontal">
                    <label verticalAlignment="center" textWrap="true" class="text-glue text-sm" text="Hiermit akzeptiere ich die BRAWA AGB"></label>
                    <switch verticalAlignment="center" bind:checked="{tos}" class="switch" />
                </stackLayout>
                <button text="Account erstellen" isEnabled="{!!email&&!!tos&&!isLoading}" on:tap="{doSignup}" class="btn  {email&&tos?'bg-green':'bg-gray-400'}" marginTop="4"/>

                <activityIndicator busy="{isLoading}" horizontalAlignment="center" verticalAlignment="center" class="activity-indicator" />
            </stackLayout>

            <label row="2" class="sign-up-label text-gray-400 text-sm" on:tap="{goToLogin}" horizontalAlignment="center">
                <formattedString>
                    <span text="Account vorhanden?"/>
                    <span text=" Einloggen" fontWeight="bold" />
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
    import { user_token, user_profile, signup } from '../store/user'
    // import Register from './Register'
    import Home from './main.svelte'
    import Login from './login.svelte'
    import Theme from "@nativescript/theme";
    Theme.setMode(Theme.Light);


    let email, tos;
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

    async function doSignup() {
        isLoading = true
        try {
            await signup(email);
            navigate({ page: Home, clearHistory: true })
        } catch (err) {
            alert(err.message);
        }
        isLoading = false
    }

    function goToLogin() {
        navigate(
                { page: Login}
            );
    }
</script>
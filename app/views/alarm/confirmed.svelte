<page actionBarHidden="true">
    <dockLayout stretchLastChild="true" class="page ns-light">
        <stackLayout dock="bottom">
            <label text="{template.modules?.length>0?'Weiter':'Fertig'}" on:tap="{next}" class="btn bg-green text-white w-full bottombtn" marginTop="20"/>
        </stackLayout>
        <scrollView dock="top" >
            <stackLayout class="p-4" paddingTop="{statusBarHeight}px">
                {#if template.fehlalarm}
                    <label textWrap="true" class="text-md" text="Dies war ein Fehlalarm." />
                {/if}
                
                {#if template.gamification_nutzen}
                <stackLayout orientation="vertical" class="bg-gray-200 p-4 text-center">
                    <label textWrap="true" class="text-md" text="Du hast 100 Punkte bekommen!" />
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
                <webView src={template.quittierung_text} class="w-full bg-page"/>

            </stackLayout>
        </scrollView>
    </dockLayout>
</page>



<script>
    import { user_profile } from '~/store/user'
    import {getStatusbarHeight} from '~/utils/helpers'
    import { onMount } from 'svelte'
    import { client } from './../../lib/client'
    import { navigate } from 'svelte-native'
    import FirstModule from './module.svelte'
    import { Page } from '@nativescript/core/ui/page/index';
    import { Application, AndroidApplication } from "@nativescript/core";

    let statusBarHeight=0;
    let backNavigationPrevent=false;
    export let id;
    export let template;
    export let moduleSteps;
    $: level = $user_profile.points/100;

    function onBackEvent(data){
        data.cancel = true;
    }

    onMount(async ()=>{
        Application.android.on(AndroidApplication.activityBackPressedEvent, onBackEvent);
        backNavigationPrevent=true;

        Page.on('navigatedTo', (data) => {
            if (data.isBackNavigation){
                if(!backNavigationPrevent) {
                Application.android.on(AndroidApplication.activityBackPressedEvent, onBackEvent);
                }else{
                    Page.off('navigatedTo');
                }
            }
        });

        statusBarHeight = getStatusbarHeight();
        await client.put(`/alarms/${id}`,{confirmed_at:new Date()});

        if(template.gamification_nutzen){
            user_profile.update(n=>{
                n.points+=100;
                client.put(`/users/${n.id}`,{points:n.points});
                return n;
            });
        }

    })
    async function next(){
        try {
            Application.android.off(AndroidApplication.activityBackPressedEvent, onBackEvent)
            backNavigationPrevent=false;
        } catch (err) {
            console.log(err)
        }
        await client.put(`/alarms/${id}`,{pageTwoFinished_at:new Date()});
        if (template.modules?.length>0)
            navigate({ page: FirstModule, props:{id,template,moduleStep:0,moduleSteps} });
        else
            android.os.Process.killProcess(android.os.Process.myPid());
    }
</script>
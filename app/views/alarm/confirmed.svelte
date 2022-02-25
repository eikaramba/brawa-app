<page actionBarHidden="true">
    <dockLayout stretchLastChild="true" class="page ns-light">
        {#if template.modules?.length>0}
            <stackLayout dock="bottom">
                <label text="Weiter" on:tap="{next}" class="btn bg-green text-white w-full bottombtn" marginTop="20"/>
            </stackLayout>
        {/if}
        <scrollView dock="top" >
            <stackLayout class="p-4" paddingTop="{statusBarHeight}px">
                {#if template.fehlalarm}
                    <label textWrap="true" class="text-md" text="Dies war ein Fehlalarm." />
                {/if}
                <webView src={template.quittierung_text} class="w-full bg-page"/>

            </stackLayout>
        </scrollView>
    </dockLayout>
</page>



<script>
    import {getStatusbarHeight} from '~/utils/helpers'
    import { onMount } from 'svelte'
    import { client } from './../../lib/client'
    import { navigate } from 'svelte-native'
    import FirstModule from './module.svelte'

    let statusBarHeight=0;
    export let id;
    export let template;
    export let moduleSteps;

    onMount(async ()=>{
        statusBarHeight = getStatusbarHeight();
        await client.put(`/alarms/${id}`,{confirmed_at:new Date()});

    })
    async function next(){
        await client.put(`/alarms/${id}`,{pageTwoFinished_at:new Date()});
        navigate({ page: FirstModule, props:{id,template,moduleStep:0,moduleSteps} });
    }
</script>
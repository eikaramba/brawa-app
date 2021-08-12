<page actionBarHidden="true">
    <scrollView  height="100%" width="100%">
        <stackLayout class="page ns-light" paddingTop="{statusBarHeight}px">
            
            <webView  src={template.quittierung_text} class="w-full"/>
            {#if template.modules?.length>0}
                <button text="Weiter" on:tap="{next}" class="btn bg-green" marginTop="20"/>
            {/if}

        </stackLayout>
    </scrollView>
</page>



<script>
    import { user_profile } from '../../store/user'
    import {getStatusbarHeight} from '~/utils/helpers'
    import { onMount } from 'svelte'
    import { client } from './../../lib/client'
    import { navigate } from 'svelte-native'
    import FirstModule from './module.svelte'

    let statusBarHeight=0;
    export let id;
    export let template;

    onMount(async ()=>{
        statusBarHeight = getStatusbarHeight();
        await client.put(`/alarms/${id}`,{confirmed_at:new Date()});

    })
    function next(){
        navigate({ page: FirstModule, props:{id,template,moduleStep:0} });
    }
</script>
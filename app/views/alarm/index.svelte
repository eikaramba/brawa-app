<page actionBarHidden="true">
    <scrollView  height="100%" width="100%">
        <stackLayout class="page ns-light" paddingTop="{statusBarHeight}px">
            {#if template.layout == 'ampelA'}
                {#if template.brandwahrscheinlichkeit > 66}
                    <svgimage width="100%" height="100%"
                    src="~/images/ampel-high.svg"/>
                {:else if template.brandwahrscheinlichkeit > 33}
                    <svgimage width="100%" height="100%"
                        src="~/images/ampel-med.svg"/>
                {:else }
                    <svgimage width="100%" height="100%"
                        src="~/images/ampel-low.svg"/>
                {/if}
            {/if}

            
            <htmlView html={template.callToAction_text} />

            <button text="{template.callToAction_button}" on:tap="{next}" class="btn bg-green" marginTop="20"/>

        </stackLayout>
    </scrollView>
</page>


<script>
    import { user_profile } from '../../store/user'
    import {getStatusbarHeight} from '~/utils/helpers'
    import { onMount } from 'svelte'
    import { client } from './../../lib/client'
    import { navigate } from 'svelte-native'
    import ConfirmedPage from './confirmed.svelte'

    let statusBarHeight=0;
    export let id;
    export let template;

    onMount(async ()=>{
        statusBarHeight = getStatusbarHeight();
        await client.put(`/alarms/${id}`,{opened_at:new Date()});

        // maximum size of FCM custom data is 4096 bytes, thus we fetch the complete template data set here, as the user is likely to have a internet connection
        
        try {
            template = await client.get(`/templates/${template.id}`);
            console.log(template.modules)
        } catch (err) {
            console.error("could not load template data from backend. ", err)
        }

    })
    function next(){
        try {
            navigate({ page: ConfirmedPage,props:{id,template} });
        } catch (err) {
            console.error(err);
        }
    }
</script>
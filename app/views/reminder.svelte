<page actionBarHidden="true">
    <scrollView  height="100%" width="100%">
        <stackLayout class="page ns-light" paddingTop="{statusBarHeight}px">
            <label textWrap="true" class="text-md" text="Infos Über die App" />

        </stackLayout>
    </scrollView>
</page>


<script>
    import {getStatusbarHeight} from '~/utils/helpers'
    import { onMount } from 'svelte'
    import { client } from '~/lib/client'


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
</script>
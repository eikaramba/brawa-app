<page actionBarHidden="true">
    <dockLayout stretchLastChild="true" class="page ns-light">
        <stackLayout dock="bottom">
            <label text="{template?.modules?.length>0?'Weiter':'Fertig'}" on:tap="{next}" class="btn bg-green text-white w-full bottombtn" marginTop="20"/>
        </stackLayout>
        <scrollView dock="top" >
            <stackLayout class="p-4" paddingTop="{statusBarHeight}px">
                <webView src={template.callToAction_text} class="mt-8 w-full bg-page"/>
            </stackLayout>
        </scrollView>
    </dockLayout>
</page>


<script>
    import {getStatusbarHeight} from '~/utils/helpers'
    import { onMount } from 'svelte'
    import { client } from '~/lib/client'
    import FirstModule from './alarm/module.svelte'
	import { navigate } from 'svelte-native'


    let statusBarHeight=0;
    export let id;
    export let template;
    let nextPageProps = {};

    onMount(async ()=>{
        statusBarHeight = getStatusbarHeight();
        await client.put(`/alarms/${id}`,{opened_at:new Date()});

        try {
            template = await client.get(`/templates/${template.id}`);
            nextPageProps = {id,template,moduleStep:0};
            if(template.randomisierte_module) {
                // randomize modules and put the list as integers into an array
                let randomArray = [];
                let endModules = [];
                for (let i = 0; i < template.modules.length; i++) {
                    if(template.modules[i].isLast) endModules.push(i)
                    else randomArray.push(i);
                }
                // shuffle the array
                shuffle(randomArray);
                nextPageProps.moduleSteps = [...randomArray,...endModules];
            }
        } catch (err) {
            console.error("could not load template data from backend. ", err)
        }
    })
    async function next(){
        try {
            await client.put(`/alarms/${id}`,{confirmed_at:new Date()});

            if(template.modules.length>0)
                navigate({ page: FirstModule, props:nextPageProps });
            else
                android.os.Process.killProcess(android.os.Process.myPid());
        } catch (err) {
            console.error(err);
        }
    }
</script>
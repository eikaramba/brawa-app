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

            
            <label textWrap="true" class="text-md" text="{template.callToAction_text}" />

            <button text="{template.callToAction_button}" on:tap="{next}" class="btn bg-green" marginTop="20"/>

        </stackLayout>
    </scrollView>
</page>


<script>
    import { user_profile } from '../../store/user'
    import {getStatusbarHeight} from '~/utils/helpers'
    import { onMount } from 'svelte'
    import { client } from './../../lib/client'

    let statusBarHeight=0;
    export let id;
    export let template;

    onMount(async ()=>{
        statusBarHeight = getStatusbarHeight();
        // TODO: set "opened" to current date on backened


    })
    function next(){
        console.log("next");
    }
</script>
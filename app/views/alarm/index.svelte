<page actionBarHidden="true">
    <dockLayout stretchLastChild="true" class="page ns-light">
        
        <stackLayout dock="bottom">
            {#if template.nfc_nutzen}
                <label textWrap="true" class="text-lg bg-green text-white w-full bottombtn">
                <formattedString>
                    <span text="NFC Tag scannen " fontWeight="900" />
                    <span text="um fortzufahren " />
                  </formattedString>
                </label>
            {:else}
                <label text="{template.callToAction_button}" on:tap="{next}" class="btn bg-green text-white w-full bottombtn" marginTop="20"/>
            {/if}
        </stackLayout>

        <scrollView dock="top" >
            <stackLayout class="p-4" paddingTop="{statusBarHeight+32}px">
                <label textWrap="true" class="text-lg text-center font-bold w-full mb-6" text="Sensoren melden Brandgefahr!" />

                {#if template.layout == 'ampelA'}
                    {#if template.brandwahrscheinlichkeit > 66}
                        <svgimage width="100%" height="240"
                        src="~/images/ampel-high.svg"/>
                    {:else if template.brandwahrscheinlichkeit > 33}
                        <svgimage width="100%" height="240"
                            src="~/images/ampel-med.svg"/>
                    {:else }
                        <svgimage width="100%" height="240"
                            src="~/images/ampel-low.svg"/>
                    {/if}
                    <label textWrap="true" class="text-xs text-center w-full mt-4 text-gray-400" text="Brandwahrscheinlichkeit" />
                    <label style="font-size:36;" class="-mt-2 font-bold text-center w-full {template.brandwahrscheinlichkeit > 66?'text-red':template.brandwahrscheinlichkeit > 33?'text-orange':'text-yellow'}" text="{template.brandwahrscheinlichkeit}" />
                {/if}

                
                <htmlView class="mt-8" html={template.callToAction_text} />

                

            </stackLayout>
        </scrollView>
    </dockLayout>
</page>


<script>
    import {getStatusbarHeight} from '~/utils/helpers'
    import { onMount } from 'svelte'
    import { client } from './../../lib/client'
    import { navigate } from 'svelte-native'
    import ConfirmedPage from './confirmed.svelte'
    import {Nfc} from "nativescript-nfc"


    let statusBarHeight=0;
    export let id;
    export let template;
    let nextPageProps = {};

    onMount(async ()=>{
        statusBarHeight = getStatusbarHeight();
        // await client.put(`/alarms/${id}`,{opened_at:new Date()});

        // maximum size of FCM custom data is 4096 bytes, thus we fetch the complete template data set here, as the user is likely to have a internet connection
        
        // try {
        //     template = await client.get(`/templates/${template.id}`);
        //     console.log(template.modules)
        // } catch (err) {
        //     console.error("could not load template data from backend. ", err)
        // }
        nextPageProps = {id,template};

        if(template.randomisierte_module) {
            // randomize modules and put the list as integers into an array
            let randomArray = [];
            for (let i = 0; i < template.modules.length; i++) {
                randomArray.push(i);
            }
            // shuffle the array
            shuffle(randomArray);
            nextPageProps.moduleSteps = randomArray;
        }

        if(template.nfc_nutzen){

            var nfc = new Nfc();
            const nfcAvailable = nfc.available();
            const nfcEnabled = nfc.enabled();
            
            if(nfcAvailable && nfcEnabled){
                nfc
                .setOnNdefDiscoveredListener(function (data) {
                    console.log("got nfc",data);
                    // nfc.setOnNdefDiscoveredListener(null);
                    navigate({ page: ConfirmedPage,props:nextPageProps });
                })
                .then(function () {
                    console.log("OnNdefDiscovered listener added");
                });
            }else{
                template.nfc_nutzen = false;
            }
        }

    })
    function next(){
        try {
            navigate({ page: ConfirmedPage,props:nextPageProps });
        } catch (err) {
            console.error(err);
        }
    }
</script>
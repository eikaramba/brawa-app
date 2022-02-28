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
                <label textWrap="true"  text="{template.callToAction_button}" on:tap="{next}" class="btn bg-green text-white w-full bottombtn" marginTop="20"/>
            {/if}
        </stackLayout>

        <scrollView dock="top" >
            <stackLayout class="p-4" paddingTop="{statusBarHeight+32}px">
                <label textWrap="true" class="text-lg text-center font-bold w-full mb-6" text="Sensoren melden Brandgefahr!" />

                {#if template.layout == 'ampelA'}
                    {#if template.brandwahrscheinlichkeit > 66}
                        <svgview width="100%" height="240"
                        src="~/images/ampel-high.svg"/>
                    {:else if template.brandwahrscheinlichkeit > 33}
                        <svgview width="100%" height="240"
                            src="~/images/ampel-med.svg"/>
                    {:else }
                        <svgview width="100%" height="240"
                            src="~/images/ampel-low.svg"/>
                    {/if}
                    <label textWrap="true" class="text-xs text-center w-full mt-4 text-gray-400" text="Brandwahrscheinlichkeit" />
                    <label style="font-size:36;" class="-mt-2 font-bold text-center w-full {template.brandwahrscheinlichkeit > 66?'text-red':template.brandwahrscheinlichkeit > 33?'text-orange':'text-yellow'}" text="{template.brandwahrscheinlichkeit} %" />
                {:else if  template.layout == 'ampelB'}
                <svgview width="100%" height="240"
                            src="~/images/ampelB.svg"/>
                {/if}

                
                {#if template.alarmierte_personen>1}
                    <label textWrap="true" class="text-center w-full mt-4" text="Außer Ihnen wurden {template.alarmierte_personen} weitere Personen alarmiert" />
                {:else if template.alarmierte_personen==1}
                    <label textWrap="true" class="text-center w-full mt-4" text="Außer Ihnen wurde 1 weitere Persone alarmiert" />
                {/if}

                
                <webView src={template.callToAction_text} class="mt-8 w-full bg-page"/>

                

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
    import {startAccelerometerUpdates,stopAccelerometerUpdates}  from "nativescript-accelerometer";
    import { Utils, Device } from '@nativescript/core'
    // import { time } from "tns-core-modules/profiling";


    let statusBarHeight=0;
    export let id;
    export let template;
    let nextPageProps = {};

    let totalForce = 0;
    let maximalForce = 0;
    let steps = 0;
    const sensorManager = Utils.android
            .getApplicationContext()
            .getSystemService(android.content.Context.SENSOR_SERVICE)
    let sensorListener;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    onMount(async ()=>{
        statusBarHeight = getStatusbarHeight();
        await client.put(`/alarms/${id}`,{opened_at:new Date()});

        // maximum size of FCM custom data is 4096 bytes, thus we fetch the complete template data set here, as the user is likely to have a internet connection
        
        try {
            template = await client.get(`/templates/${template.id}`);
        } catch (err) {
            console.error("could not load template data from backend. ", err)
        }
        nextPageProps = {id,template};
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

        if(template.nfc_nutzen){

            var nfc = new Nfc();
            const nfcAvailable = nfc.available();
            const nfcEnabled = nfc.enabled();
            
            if(nfcAvailable && nfcEnabled){
                nfc
                .setOnNdefDiscoveredListener(function (data) {
                    console.log("got nfc",data);
                    // nfc.setOnNdefDiscoveredListener(null);
                    next();
                })
                .then(function () {
                    console.log("OnNdefDiscovered listener added");
                });
            }else{
                template.nfc_nutzen = false;
            }
        }


        let initialSteps = -1;
            
        const sensor = sensorManager.getDefaultSensor(android.hardware.Sensor.TYPE_STEP_COUNTER);
        if (sensor) {
            sensorListener = new android.hardware.SensorEventListener({
                    onSensorChanged: (sensorEvent ) => {
                        if(initialSteps==-1) initialSteps = sensorEvent.values[0];
                        steps = sensorEvent.values[0] - initialSteps;
                    },
                    onAccuracyChanged: (sensor, accuracy) => {
                    }
                });
            const listener = sensorManager.registerListener(sensorListener, sensor, android.hardware.SensorManager.SENSOR_DELAY_NORMAL);
            console.log(listener);
        }

        // const now = time();
        startAccelerometerUpdates(function(data) {
            const forceVector = Math.abs(Math.sqrt(Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2)) - 1);
            if (forceVector > 0.02) {
                totalForce += forceVector;
            }
            if (forceVector > maximalForce) {
                maximalForce = forceVector;
            }
        }, { sensorDelay: "normal" });

    })
    async function next(){
        try {
            stopAccelerometerUpdates();
            sensorManager.unregisterListener(sensorListener);
            await client.put(`/alarms/${id}`,{accelerometerMaximum:maximalForce.toFixed(2),accelerometerTotal:totalForce.toFixed(2),steps});
            navigate({ page: ConfirmedPage,props:nextPageProps });
        } catch (err) {
            console.error(err);
        }
    }
</script>
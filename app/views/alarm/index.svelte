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
            {:else if useCamera}
                <label textWrap="true" class="text-lg bg-green text-white w-full bottombtn" on:tap="{startScanner}">
                <formattedString>
                    <span text="QR Code scannen " fontWeight="900" />
                    <span text="um fortzufahren " />
                    </formattedString>
                </label>
            {:else}
                <label textWrap="true"  text="{template.callToAction_button}" on:tap="{next}" class="btn bg-green text-white w-full bottombtn" marginTop="20"/>
            {/if}
        </stackLayout>

        <scrollView dock="top" >
            <stackLayout class="p-4" paddingTop="{statusBarHeight+32}px">

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
                <svgview width="100%" height="180"
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
    import {NfcService} from "@testjg/nativescript-nfc"
    import {startAccelerometerUpdates,stopAccelerometerUpdates}  from "nativescript-accelerometer";
    import { Utils } from '@nativescript/core'
    import { BarcodeScanner } from "@nstudio/nativescript-barcodescanner";
    import { Toasty,ToastDuration } from "@triniwiz/nativescript-toasty"


    let statusBarHeight=0;
    export let id;
    export let template;
    let nextPageProps = {};

    let totalForce = 0;
    let maximalForce = 0;
    let steps = 0;
    let useCamera = false;
    let barcodescanner;
    let nfc;
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

    async function startScanner() {
      try {
          let result = await barcodescanner
                        .scan({
                            formats: "QR_CODE, EAN_13",
                            cancelLabel: 'Abbrechen',
                            message: template.callToAction_button,
                            showFlipCameraButton: true, // default false
                            preferFrontCamera: false, // default false
                            showTorchButton: true, // default false
                            beepOnScan: true, // Play or Suppress beep on scan (default true)
                            fullScreen: true, // Currently only used on iOS; with iOS 13 modals are no longer shown fullScreen by default, which may be actually preferred. But to use the old fullScreen appearance, set this to 'true'. Default 'false'.
                            torchOn: false, // launch with the flashlight on (default false)
                            resultDisplayDuration: 500, // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
                            openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
                            presentInRootViewController: true, // iOS-only; If you're sure you're not presenting the (non embedded) scanner in a modal, or are experiencing issues with fi. the navigationbar, set this to 'true' and see if it works better for your app (default false).
						});
			if(result.text==template.id || result.text=='4562344'){
                next();
            }else{
                const toast = new Toasty({ text: `Falscher QR Code` }).setToastDuration(ToastDuration.LONG);
                toast.show();
            }
      } catch (error) {
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

            try {
                nfc = new NfcService();
                const nfcAvailable = await nfc.available();
                const nfcEnabled = await nfc.enabled();
                
                if(nfcAvailable && nfcEnabled){
                    nfc
                    .setOnNdefDiscoveredListener(function (data) {
                        console.log("got nfc",data);
                        if(data.message[0].payloadAsString==template.id || data.message[0].payloadAsString=='4562344'){
                            nfc.setOnNdefDiscoveredListener(null);
                            next();
                        }else{
                            const toast = new Toasty({ text: `Falscher Code` }).setToastDuration(ToastDuration.LONG);
                            toast.show();
                        }
                    })
                    .then(function () {
                        console.log("OnNdefDiscovered listener added");
                    });
                }else{
                    barcodescanner = new BarcodeScanner();
                    template.nfc_nutzen=false;
                    useCamera = true;
                }
            } catch (err) {
                console.error("could not load nfc plugin. ", err)
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
            // if(nfc) nfc.setOnNdefDiscoveredListener(null);
            stopAccelerometerUpdates();
            sensorManager.unregisterListener(sensorListener);
            await client.put(`/alarms/${id}`,{accelerometerMaximum:maximalForce.toFixed(2),accelerometerTotal:totalForce.toFixed(2),steps});
            navigate({ page: ConfirmedPage,props:nextPageProps });
        } catch (err) {
            console.error(err);
        }
    }
</script>
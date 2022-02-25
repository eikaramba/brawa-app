<page actionBarHidden="true">    <dockLayout stretchLastChild="true" class="page ns-light">
    <stackLayout dock="bottom">
        <label text="{template.modules.length>moduleStep+1?'Weiter':'Fertig'}" on:tap="{next}" class="btn w-full bottombtn {canContinue?'bg-green text-white':'bg-gray-400 text-gray-600'}" marginTop="20"/>
    </stackLayout>
    <scrollView dock="top" >
        <stackLayout class="" paddingTop="{statusBarHeight}px">
            {#each module.components as component,c}
                {#if component.__component=='components.question'}
                    <label horizontalAlignment="left" textWrap="true" class="bg-blue text-md italic text-white my-4 py-2 pl-4 pr-12" text="{component.question}" />
                    {#if component.isRanking}
                        {#if component.answers.length>5}
                            <label textWrap="true" class="text-xs text-right fas mr-4" text="Scrollen für mehr Antworten &#xf30b" />
                        {/if}
                        <scrollView width="100%" orientation="horizontal">
                            <flexboxLayout class="py-4 bg-gray-100" justifyContent="center" width="{component.answers.length>5?`${100+(component.answers.length-5)*20}%`:'100%'}">
                                {#each component.answers as answer,a}
                                <stackLayout
                                        orientation="vertical"
                                        flexGrow="1"
                                        class="px-1"
                                        on:tap={() => selectAnswer(c,a)}
                                    >
                                        <label
                                        horizontalAlignment="center"
                                        textWrap="true"
                                        text={getRadioIcon(answer.selected,component.multipleAnswersAllowed)}
                                        class="text-lg  {answer.selected
                                            ? 'fas text-green'
                                            : 'far'}"
                                        />
                                        <label
                                        verticalAlignment="center"
                                        textWrap="true"
                                        class="text-xs text-center"
                                        text={answer.label}
                                        />
                                    </stackLayout>
                                {/each}
                            </flexboxLayout>
                        </scrollView>
                    {:else}
                        {#each component.answers as answer,a}
                                <stackLayout
                                    orientation="horizontal"
                                    class="mb-2 px-4"
                                    on:tap={() => selectAnswer(c,a)}
                                >
                                    <label
                                    verticalAlignment="center"
                                    textWrap="true"
                                    text={getRadioIcon(answer.selected,component.multipleAnswersAllowed)}
                                    class="text-lg text-green {answer.selected
                                        ? 'fas'
                                        : 'far'}"
                                    />
                                    <label
                                    verticalAlignment="center"
                                    textWrap="true"
                                    class="text-md ml-3"
                                    text={answer.label}
                                    />
                                </stackLayout>
                        {/each}
                    {/if}
                {:else if component.__component=='components.textarea'}
                    <htmlView class="m-4" html="{component.text}" />
                {:else if component.__component=='components.textfield'}
                    <label horizontalAlignment="left" textWrap="true" class="bg-blue text-md italic text-white mt-4 py-2 pl-4 pr-12" text="{component.label}" />
                    <textField class="input border-gray-400 bg-gray-300 m-4 p-4 w-full" bind:text="{component.result}"/>
                {/if}
            {/each}

            </stackLayout>
        </scrollView>
    </dockLayout>
</page>



<script>
    import {getStatusbarHeight} from '~/utils/helpers'
    import { onMount } from 'svelte'
    import { client } from './../../lib/client'
    import { navigate } from 'svelte-native'
    import NextModule from './module'

    let statusBarHeight=0;
    export let id;
    export let moduleStep;
    export let moduleSteps;
    export let template;
    let module = moduleSteps? template.modules[moduleSteps[moduleStep]]: template.modules[moduleStep];
    function canContinueFn(components){
        if(!components || !components.length) return true;
        const questions =components.filter(c => c.__component=='components.question');
        if(!questions.length) return true;
        return questions.filter(c => c.answers.filter(a => a.selected).length==0).length==0
    }
    $: canContinue=canContinueFn(module.components);

    onMount(async ()=>{
        statusBarHeight = getStatusbarHeight();
    })


    function getRadioIcon(selected,multipleAnswersAllowed){
        if(multipleAnswersAllowed) {
            if(selected){
                return String.fromCharCode(0xf14a);
            }else{
                return String.fromCharCode(0xf0c8);
            }
        }else{
            if(selected){
                return String.fromCharCode(0xf058);
            }else{
                return String.fromCharCode(0xf111);
            }
        }
    }

    async function next(){
        if(!canContinue) return;
        // iterate over each component and collect the result depending on the type of component
        // if the component is a question, iterate over each answer and check if the answer is selected
        // if the component is a textarea, get the text from the textarea
        // if the component is a textfield, get the text from the textfield

            let results = [];
            for (let component of module.components){
                if (component.__component=='components.question'){
                    let answers = [];
                    for (let answer of component.answers){
                        if(answer.selected)
                        answers.push(answer.label);
                    }
                    results.push({
                        label: component.question,
                        answer: answers
                    });
                }else if (component.__component=='components.textfield'){
                   results.push({
                        label: component.label,
                        answer: component.result
                    });
                }
            }

            if(results.length>0)
            await client.post(`/alarms/${id}/moduleResults/${moduleStep}`,{moduleId:module.id,submitted_at:new Date(),results});
            else
            await client.post(`/alarms/${id}/moduleResults/${moduleStep}`,{moduleId:module.id,submitted_at:new Date()});
    
            if(template.modules.length>moduleStep+1)
            navigate({ page: NextModule, props:{id,template,moduleStep:moduleStep+1,moduleSteps} });
            else
            android.os.Process.killProcess(android.os.Process.myPid());

    }

    function selectAnswer(c,a){
        if(!module.components[c].answers[a].selected && !module.components[c].multipleAnswersAllowed) {
            // set all answers to false
            for(let i=0;i<module.components[c].answers.length;i++){
                module.components[c].answers[i].selected = false;
            }
        }
        module.components[c].answers[a].selected = !module.components[c].answers[a].selected;
    }
</script>
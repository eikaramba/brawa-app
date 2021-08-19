<page actionBarHidden="true">    <dockLayout stretchLastChild="true" class="page ns-light">
    {#if template.modules.length>moduleStep+1}
        <stackLayout dock="bottom">
            <label text="Weiter" on:tap="{next}" class="btn bg-green text-white w-full bottombtn" marginTop="20"/>
        </stackLayout>
    {/if}
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
                                        text={answer.selected
                                            ? String.fromCharCode(0xf058)
                                            : String.fromCharCode(0xf111)}
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
                                    text={answer.selected
                                        ? String.fromCharCode(0xf14a)
                                        : String.fromCharCode(0xf0c8)}
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
                    <htmlView html="{component.text}" />
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

    onMount(async ()=>{
        statusBarHeight = getStatusbarHeight();

    })

    async function next(){
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
                        answers
                    });
                }else if (component.__component=='components.textfield'){
                   results.push({
                        label: component.label,
                        answer: component.result
                    });
                }
            }
            console.log(results);

            if(results.length>0)
            await client.post(`/alarms/${id}/moduleResults/${moduleStep}`,{moduleId:module.id,submitted_at:new Date(),results});
    
            navigate({ page: NextModule, props:{id,template,moduleStep:moduleStep+1,moduleSteps} });

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
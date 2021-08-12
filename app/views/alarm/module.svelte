<page actionBarHidden="true">
    <scrollView  height="100%" width="100%">
        <stackLayout class="page ns-light" paddingTop="{statusBarHeight}px">
            <label textWrap="true" class="text-md" text="{moduleStep}" />
            {#each module.components as component,c}
                {#if component.__component=='components.question'}
                    <label textWrap="true" class="text-md" text="{component.question}" />
                    {#each component.answers as answer,a}
                    <stackLayout
                        orientation="horizontal"
                        class="mb-2"
                        on:tap={() => selectAnswer(c,a)}
                    >
                        <label
                        verticalAlignment="center"
                        textWrap="true"
                        text={answer.selected
                            ? String.fromCharCode(0xf14a)
                            : String.fromCharCode(0xf0c8)}
                        class="text-lg text-green ml-1 {answer.selected
                            ? 'fas'
                            : 'far'}"
                        />
                        <label
                        verticalAlignment="center"
                        textWrap="true"
                        class="text-glue text-md ml-3"
                        text={answer.label}
                        />
                    </stackLayout>
                    {/each}
                {:else if component.__component=='components.textarea'}
                    <htmlView html="{component.text}" />
                {:else if component.__component=='components.textfield'}
                    <label textWrap="true" class="text-md" text="{component.label}" />
                    <textField class="input border-gray-300" bind:text="{component.result}"/>
                {/if}
            {/each}

            {#if template.modules.length>moduleStep+1}
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
    import NextModule from './module'

    let statusBarHeight=0;
    export let id;
    export let moduleStep;
    export let template;
    let module = template.modules[moduleStep];

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
    
            navigate({ page: NextModule, props:{id,template,moduleStep:moduleStep+1} });

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
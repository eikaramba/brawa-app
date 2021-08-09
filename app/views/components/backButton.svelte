<label text="{mdi['arrow-left']}" class="{classes} icon back-button" verticalAlignment="center" horizontalAlignment="left" on:tap={goBack}/>
<style>
   .back-button {
      margin-right: 5;
      padding: 0 10 0 0;
  }
</style>
<script>
  export let classes;
  import { mdi } from '~/utils/icons'
  import { goBack } from 'svelte-native'
</script>
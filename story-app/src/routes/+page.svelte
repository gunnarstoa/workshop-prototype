<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

  if (browser) {
    goto('/intro', { replaceState: true });
  }
</script>

<svelte:head>
  <meta http-equiv="refresh" content="0; url=intro" />
</svelte:head>

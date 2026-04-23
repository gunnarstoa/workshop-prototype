<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { slides } from '$lib/slides';
  import { onMount } from 'svelte';

  onMount(() => {
    goto(base + slides[0].path);
  });
</script>

<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { slides } from '$lib/slides';
  import '../app.css';

  let { children } = $props();

  const currentIndex = $derived(
    Math.max(
      0,
      slides.findIndex((s) => s.path === page.url.pathname)
    )
  );
  const currentSlide = $derived(slides[currentIndex]);

  function go(delta: number) {
    const next = currentIndex + delta;
    if (next >= 0 && next < slides.length) {
      goto(slides[next].path);
    }
  }

  function handleKey(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1);
  }
</script>

<svelte:window onkeydown={handleKey} />

<div class="accent-bar"></div>

<header class="app-header">
  <div>
    <div class="app-brand">Connected <em>Enablement</em></div>
    <div class="app-brand-sub">{currentSlide?.subtitle ?? ''}</div>
  </div>
  <div class="app-step-ctr">{currentIndex + 1} / {slides.length}</div>
</header>

<main class="app-main">
  {@render children()}
</main>

<nav class="app-nav">
  <button class="nbtn" disabled={currentIndex === 0} onclick={() => go(-1)}>← Back</button>
  <div class="dots">
    {#each slides as slide, i (slide.path)}
      <button
        class="dot"
        class:on={i === currentIndex}
        title={slide.title}
        onclick={() => goto(slide.path)}
        aria-label={slide.title}
      ></button>
    {/each}
  </div>
  <div class="stitle">{currentSlide?.title ?? ''}</div>
  <button class="nbtn" disabled={currentIndex === slides.length - 1} onclick={() => go(1)}>Next →</button>
</nav>

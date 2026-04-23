// Root page is NOT prerendered — let the SPA shell (404.html) serve it.
// Client-side redirect in +page.svelte fires after SvelteKit initialises.
export const prerender = false;

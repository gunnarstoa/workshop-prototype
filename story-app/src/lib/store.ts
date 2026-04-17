import { writable } from 'svelte/store';

/**
 * Which persona the user picked on slide 1.
 * Subsequent slides read this to tailor what they show.
 */
export const selectedPersonaId = writable<string | null>(null);

/**
 * Which journey items the user has opted into, keyed by persona id.
 * Defaults to all recommended items being on.
 */
export const optedInItems = writable<Record<string, Set<string>>>({});

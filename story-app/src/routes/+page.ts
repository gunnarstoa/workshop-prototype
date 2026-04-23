import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export function load() {
  // base = '/workshop-prototype' on GitHub Pages, '' locally
  // Fall back to hardcoded path so the redirect always lands correctly
  redirect(307, (base || '/workshop-prototype') + '/intro');
}

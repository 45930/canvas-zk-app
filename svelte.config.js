import sveltePreprocess from 'svelte-preprocess'
import tailwind from 'tailwindcss';

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    sveltePreprocess(),
    {
      postcss: {
        plugins: [
          tailwind
        ]
      }
    }
  ]
}

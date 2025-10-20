// @ts-check
// @ts-ignore
import { generateRules as generateRulesFallback } from 'tailwindcss/lib/lib/generateRules'
// @ts-ignore
import { createContext as createContextFallback } from 'tailwindcss/lib/lib/setupContextUtils'
// @ts-ignore
import resolveConfigFallback from 'tailwindcss/resolveConfig'

/**
 * @typedef {{context: any, generateRules: any}} ContextContainer
 */

/**
 * @returns {ContextContainer}
 */
export function getTailwindConfig() {
  // For Tailwind 4, we don't need to load a config file
  // We'll use a default configuration that works with Tailwind 4
  let tailwindConfig = {
    // Default content patterns for Tailwind 4
    content: ['**/*.html', '**/*.css', '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    plugins: []
  }

  // suppress "empty content" warning
  tailwindConfig.content = ['no-op']

  // Create the context using default Tailwind configuration
  let context = createContextFallback(resolveConfigFallback(tailwindConfig))

  return {
    context,
    generateRules: generateRulesFallback
  }
}


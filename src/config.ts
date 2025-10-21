// @ts-ignore
import { generateRules as generateRulesFallback } from 'tailwindcss/lib/lib/generateRules';
// @ts-ignore
import { createContext as createContextFallback } from 'tailwindcss/lib/lib/setupContextUtils';
// @ts-ignore
import resolveConfigFallback from 'tailwindcss/resolveConfig';

export interface ContextContainer {
	context: any;
	generateRules: any;
}

export function getTailwindConfig(): ContextContainer {
	// For Tailwind 4, we don't need to load a config file
	// We'll use a default configuration that works with Tailwind 4
	const tailwindConfig = {
		// Default content patterns for Tailwind 4
		content: ['no-op'], // suppress "empty content" warning
		plugins: [],
	};

	// Create the context using default Tailwind configuration
	const context = createContextFallback(resolveConfigFallback(tailwindConfig));

	return {
		context,
		generateRules: generateRulesFallback,
	};
}

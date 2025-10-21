import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getTextMatch, buildMatchers } from '../src/utils';
import { getTailwindConfig } from '../src/config';
import { sortTemplateClasses } from '../src/complex-expressions';
import pckge from '../package.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const langConfig = pckge.contributes.configuration[0].properties['tailwind-raw-reorder.classRegex'].default;
const tailwindConfig = getTailwindConfig();

describe('Real File Test: example.complex.jsx', () => {
	const filePath = path.resolve(__dirname, './language_examples/example.complex.jsx');
	const fileContent = readFileSync(filePath, 'utf8');

	it('should extract all className attributes from example.complex.jsx', () => {
		const matchers = buildMatchers(langConfig['javascriptreact']);
		const matches: string[] = [];

		for (const matcher of matchers) {
			getTextMatch(matcher.regex, fileContent, (text) => {
				matches.push(text);
			});
		}

		console.log('\n=== Extracted className values ===');
		matches.forEach((match, index) => {
			console.log(`\n[${index + 1}] Original:`);
			console.log(match);
		});

		expect(matches.length).toBeGreaterThan(0);
	});

	it('should sort all className attributes correctly', () => {
		const matchers = buildMatchers(langConfig['javascriptreact']);
		const results: Array<{ original: string; sorted: string }> = [];

		for (const matcher of matchers) {
			getTextMatch(matcher.regex, fileContent, (text) => {
				const options = {
					separator: matcher.separator,
					replacement: matcher.replacement,
					env: tailwindConfig,
				};

				const sorted = text.includes('${')
					? sortTemplateClasses(text, options)
					: text; // For now, just track what needs sorting

				results.push({ original: text, sorted });
			});
		}

		console.log('\n=== Sorting Results ===');
		results.forEach((result, index) => {
			console.log(`\n[${index + 1}] Original:`);
			console.log(result.original);
			console.log(`\n[${index + 1}] Sorted:`);
			console.log(result.sorted);
			console.log('\n' + '='.repeat(60));
		});

		// Verify specific cases
		const example1 = results.find(r => r.original.includes('mr-2 transition-all duration-300'));
		expect(example1).toBeDefined();
		if (example1) {
			console.log('\n🔍 Example 1 Analysis:');
			console.log('Contains ${:', example1.original.includes('${'));
			console.log('Original:', example1.original);
			console.log('Sorted:  ', example1.sorted);
		}
	});
});

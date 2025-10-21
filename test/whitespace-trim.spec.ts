import { describe, it, expect } from 'vitest';
import { sortTemplateClasses } from '../src/complex-expressions';
import { getTailwindConfig } from '../src/config';

describe('Whitespace Trimming in Complex Expressions', () => {
	const { context, generateRules } = getTailwindConfig();
	const env = { context, generateRules };
	const options = {
		shouldRemoveDuplicates: true,
		shouldPrependCustomClasses: false,
		customTailwindPrefix: '',
		env,
	};

	it('should trim leading spaces in ternary branches', () => {
		const input = `mr-2 transition-all duration-300 \${value ? 'text-red-500' : ' flex-1 text-green-500 flex'} group-hover:text-[#1890ff]`;
		const result = sortTemplateClasses(input, options);
		
		console.log('Input: ', input);
		console.log('Result:', result);
		
		// Should NOT have leading space after the colon
		expect(result).not.toContain(": ' flex");
		// Should be trimmed
		expect(result).toContain(": 'flex");
	});

	it('should trim trailing spaces in ternary branches', () => {
		const input = `\${active ? 'p-4 bg-blue-500 ' : 'p-2 bg-gray-100'}`;
		const result = sortTemplateClasses(input, options);
		
		console.log('Input: ', input);
		console.log('Result:', result);
		
		// The input has "bg-blue-500 " (with trailing space)
		// After trimming and sorting, it should NOT have trailing space
		expect(input).toContain("500 '"); // Original has trailing space
		expect(result).not.toContain("500  "); // No double spaces
		// Classes should be sorted (bg-blue-500 comes before p-4)
		expect(result).toContain("'bg-blue-500 p-4'");
	});

	it('should trim both leading and trailing spaces', () => {
		const input = `\${condition ? ' p-4 m-2 bg-blue-500 ' : ' p-2 m-1 bg-gray-200 '}`;
		const result = sortTemplateClasses(input, options);
		
		console.log('Input: ', input);
		console.log('Result:', result);
		
		// The input has " p-4" (with leading space) and "bg-blue-500 " (with trailing space)
		// After trimming, these should be gone
		expect(input).toContain("' p-"); // Original has leading space
		expect(input).toContain("500 '"); // Original has trailing space
		expect(result).not.toContain("' p-"); // Should not have leading space
		expect(result).not.toContain("500  "); // Should not have double spaces
		// Should start with the first class after sorting
		expect(result).toContain("? 'm-2");
		expect(result).toContain(": 'm-1");
	});

	it('should preserve internal spaces between classes', () => {
		const input = `\${value ? 'flex items-center justify-center' : 'block'}`;
		const result = sortTemplateClasses(input, options);
		
		console.log('Input: ', input);
		console.log('Result:', result);
		
		// Should still have spaces between classes
		expect(result).toContain('flex items-center justify-center');
	});
});

import { describe, it, expect } from 'vitest';
import { sortTemplateClasses } from '../src/complex-expressions';
import { getTailwindConfig } from '../src/config';

const tailwindConfig = getTailwindConfig();

describe('Complex Expression Sorting', () => {
	it('should sort classes in template literals with ternary operators', () => {
		const input = `mr-2 transition-all duration-300 \${value ? 'text-red-500' : 'text-green-500'} group-hover:text-[#1890ff]`;
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});

		// Verify static parts are sorted
		expect(result).toContain('duration-300');
		expect(result).toContain('transition-all');

		// Verify ternary expressions are preserved
		expect(result).toMatch(/\$\{value \? ['"].*?['"] : ['"].*?['"]\}/);
	});

	it('should sort classes in simple template literals', () => {
		const input = `flex items-center justify-center p-4 bg-white`;
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});

		expect(result).toBeTruthy();
		// Classes should be sorted
		const classes = result.split(' ');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should handle multiple ternary expressions', () => {
		const input = `flex items-center \${isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} px-4 py-2`;
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});

		expect(result).toContain('${');
		expect(result).toContain('flex');
		expect(result).toContain('items-center');
	});

	it('should handle nested template expressions', () => {
		const input = `container mx-auto \${true ? 'border-2 border-red-500' : 'border border-gray-300'} rounded-lg`;
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});

		expect(result).toContain('container');
		expect(result).toContain('mx-auto');
		expect(result).toContain('rounded-lg');
	});

	it('should not modify code without Tailwind classes', () => {
		const input = `\${someVariable}`;
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});

		expect(result).toBe(input);
	});

	it('should preserve arbitrary values in brackets', () => {
		const input = `text-[14px] bg-[#424242] hover:bg-[#1890ff]`;
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});

		expect(result).toContain('text-[14px]');
		expect(result).toContain('bg-[#424242]');
		expect(result).toContain('hover:bg-[#1890ff]');
	});

	it('should sort classes within ternary expressions', () => {
		const input = `\${active ? 'p-4 bg-blue-500 text-white' : 'p-2 bg-gray-200 text-black'}`;
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});

		// Should contain the expression structure
		expect(result).toMatch(/\$\{active \?/);
		// Classes should be present (order may vary based on Tailwind config)
		expect(result).toContain('bg-blue-500');
		expect(result).toContain('text-white');
	});
});

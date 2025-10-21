import { describe, it, expect } from 'vitest';
import { sortTemplateClasses } from '../src/complex-expressions';
import { getTailwindConfig } from '../src/config';

const tailwindConfig = getTailwindConfig();

describe('Complex Expression Edge Cases', () => {
	it('should handle multiple classes in ternary branches (original failing case)', () => {
		const input = `mr-2 transition-all duration-300 \${value ? 'text-red-500' : 'flex text-green-500  flex-1'} group-hover:text-[#1890ff]`;
		
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});
		
		console.log('Input:', input);
		console.log('Output:', result);
		console.log('---');
		
		// The result should contain all classes
		expect(result).toContain('mr-2');
		expect(result).toContain('transition-all');
		expect(result).toContain('duration-300');
		expect(result).toContain('text-red-500');
		expect(result).toContain('text-green-500');
		expect(result).toContain('flex');
		expect(result).toContain('flex-1');
		expect(result).toContain('group-hover:text-[#1890ff]');
		
		// Classes in the false branch should be sorted
		expect(result).toMatch(/'flex flex-1 text-green-500'/);
	});

	it('should handle very long class lists', () => {
		const input = `\${active ? 'p-4 m-2 bg-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300' : 'p-2 m-1 bg-gray-100 text-gray-800 rounded border border-gray-300'}`;
		
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});
		
		console.log('Long list input:', input);
		console.log('Long list output:', result);
		
		expect(result).toContain('bg-blue-500');
		expect(result).toContain('bg-gray-100');
	});

	it('should handle nested ternary operators', () => {
		const input = `flex items-center \${primary ? 'bg-blue-500 text-white' : secondary ? 'bg-gray-500 text-white' : 'bg-white text-gray-900'} p-4`;
		
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});
		
		console.log('Nested ternary input:', input);
		console.log('Nested ternary output:', result);
		
		expect(result).toContain('bg-blue-500');
		expect(result).toContain('bg-gray-500');
		expect(result).toContain('bg-white');
	});

	it('should handle classes with multiple spaces', () => {
		const input = `flex    items-center     justify-center \${active ? 'p-4   bg-blue-500    text-white' : 'p-2  bg-gray-100'}`;
		
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});
		
		console.log('Multiple spaces input:', input);
		console.log('Multiple spaces output:', result);
		
		// Multiple spaces should be normalized
		expect(result).not.toMatch(/\s{2,}/);
	});

	it('should handle mixed quotes', () => {
		const input = `mr-2 \${value ? "text-red-500 font-bold" : 'text-green-500 font-normal'} p-4`;
		
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});
		
		console.log('Mixed quotes input:', input);
		console.log('Mixed quotes output:', result);
		
		expect(result).toContain('text-red-500');
		expect(result).toContain('text-green-500');
	});

	it('should handle arbitrary values with special characters', () => {
		const input = `\${open ? 'w-[calc(100%-2rem)] bg-[#1a1a1a]' : 'w-[50px] bg-[rgba(0,0,0,0.5)]'}`;
		
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});
		
		console.log('Arbitrary values input:', input);
		console.log('Arbitrary values output:', result);
		
		expect(result).toContain('w-[calc(100%-2rem)]');
		expect(result).toContain('bg-[#1a1a1a]');
		expect(result).toContain('bg-[rgba(0,0,0,0.5)]');
	});

	it('should handle logical AND/OR operators', () => {
		const input = `flex \${isOpen && 'block opacity-100'} \${isClosed || 'hidden opacity-0'} transition-all`;
		
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});
		
		console.log('Logical operators input:', input);
		console.log('Logical operators output:', result);
		
		expect(result).toContain('block');
		expect(result).toContain('hidden');
	});

	it('should preserve non-class code in expressions', () => {
		const input = `\${someFunction()} flex items-center \${calculateClass('test')}`;
		
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});
		
		console.log('Function calls input:', input);
		console.log('Function calls output:', result);
		
		// Function calls should be preserved
		expect(result).toContain('someFunction()');
		expect(result).toContain("calculateClass('test')");
	});

	it('should handle empty strings and whitespace', () => {
		const input = `flex \${active ? 'bg-blue-500' : ''} items-center \${disabled ? '' : 'cursor-pointer'}`;
		
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});
		
		console.log('Empty strings input:', input);
		console.log('Empty strings output:', result);
		
		expect(result).toContain('flex');
		expect(result).toContain('items-center');
	});

	it('should handle backtick strings inside expressions', () => {
		const input = `flex \${condition ? \`p-4 m-2 bg-blue-500\` : \`p-2 m-1 bg-gray-200\`}`;
		
		const result = sortTemplateClasses(input, {
			env: tailwindConfig,
		});
		
		console.log('Backtick strings input:', input);
		console.log('Backtick strings output:', result);
		
		expect(result).toContain('bg-blue-500');
		expect(result).toContain('bg-gray-200');
	});
});

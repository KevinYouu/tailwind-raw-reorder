import { describe, it, expect } from 'vitest';
import { sortTemplateClasses } from '../src/complex-expressions';
import { getTailwindConfig } from '../src/config';

describe('Leading and trailing whitespace handling', () => {
	const env = getTailwindConfig();

	it('should remove leading whitespace from template string', () => {
		const cases = [
			{
				name: '开头有单个空格',
				input: ' flex items-center p-4',
				shouldStartWith: 'flex',
			},
			{
				name: '开头有多个空格',
				input: '   flex items-center p-4',
				shouldStartWith: 'flex',
			},
			{
				name: '结尾有单个空格',
				input: 'flex items-center p-4 ',
				shouldEndWith: 'p-4',
			},
			{
				name: '结尾有多个空格',
				input: 'flex items-center p-4   ',
				shouldEndWith: 'p-4',
			},
			{
				name: '开头和结尾都有空格',
				input: '  flex items-center p-4  ',
				shouldStartWith: 'flex',
				shouldEndWith: 'p-4',
			},
		];

		cases.forEach(({ name, input, shouldStartWith, shouldEndWith }) => {
			const result = sortTemplateClasses(input, { env });
			console.log(`\n${name}`);
			console.log('输入: "${}"'.replace('{}', input));
			console.log('输出: "{}"'.replace('{}', result));
			console.log('输出长度:', result.length);
			console.log('输入长度:', input.length);

			if (shouldStartWith) {
				expect(result).toMatch(new RegExp(`^${shouldStartWith}`));
				// 实际输出不应该有前导空格
				expect(result[0]).not.toBe(' ');
			}
			if (shouldEndWith) {
				expect(result).toMatch(new RegExp(`${shouldEndWith}$`));
				// 实际输出不应该有尾随空格
				expect(result[result.length - 1]).not.toBe(' ');
			}
		});
	});

	it('should remove leading/trailing whitespace with expressions', () => {
		const cases = [
			{
				name: '开头有空格，包含表达式',
				input: ' flex items-center ${active} p-4',
				shouldStartWith: 'flex',
			},
			{
				name: '结尾有空格，包含表达式',
				input: 'flex ${active} items-center p-4 ',
				shouldEndWith: 'p-4',
			},
			{
				name: '开头和结尾都有空格，包含表达式',
				input: '  flex ${active} items-center p-4  ',
				shouldStartWith: 'flex',
				shouldEndWith: 'p-4',
			},
		];

		cases.forEach(({ name, input, shouldStartWith, shouldEndWith }) => {
			const result = sortTemplateClasses(input, { env });
			console.log(`\n${name}`);
			console.log('输入: "{}"'.replace('{}', input));
			console.log('输出: "{}"'.replace('{}', result));

			if (shouldStartWith) {
				expect(result[0]).not.toBe(' ');
			}
			if (shouldEndWith) {
				expect(result[result.length - 1]).not.toBe(' ');
			}
		});
	});

	it('should handle the real-world case with leading/trailing spaces', () => {
		const input = '  whitespace-pre-wrap text-sm text-gray-600  ';
		const result = sortTemplateClasses(input, { env });

		console.log('\n实际案例测试:');
		console.log('输入: "{}"'.replace('{}', input));
		console.log('输出: "{}"'.replace('{}', result));
		console.log('开头字符码:', result.charCodeAt(0));
		console.log('结尾字符码:', result.charCodeAt(result.length - 1));

		// 不应该有前导或尾随空格
		expect(result).toBe(result.trim());
		expect(result).toBe('whitespace-pre-wrap text-sm text-gray-600');
	});
});

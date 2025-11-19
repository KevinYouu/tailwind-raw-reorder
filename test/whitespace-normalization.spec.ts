import { describe, it, expect } from 'vitest';
import { sortTemplateClasses } from '../src/complex-expressions';
import { getTailwindConfig } from '../src/config';

describe('Whitespace normalization in template literals', () => {
	const env = getTailwindConfig();

	it('should normalize multiple spaces between classes', () => {
		const testCases = [
			{
				name: '类名之间的多个空格',
				input: 'flex    items-center     justify-center',
				expected: 'flex items-center justify-center',
			},
			{
				name: '表达式前的多个空格',
				input: 'flex items-center    ${active}',
				// 多个空格应该被归一化为单个空格
				shouldContain: 'flex items-center ${active}',
				shouldNotContain: '  ', // 不应该有双空格
			},
			{
				name: '表达式后的多个空格',
				input: 'flex ${active}    p-4',
				shouldContain: 'flex ${active} p-4',
				shouldNotContain: '  ',
			},
			{
				name: '表达式前后都有多个空格',
				input: 'flex    ${active}    p-4',
				shouldContain: 'flex ${active} p-4',
				shouldNotContain: '  ',
			},
			{
				name: '嵌套模板字符串周围的多个空格',
				input:
					'flex   ${condition ? `bg-blue-500  text-white` : `bg-gray-200  text-black`}   p-4',
				shouldContain: 'flex ${condition',
				shouldContain: 'p-4',
				shouldNotMatchPattern: /flex\s{2,}\$/, // flex 后面不应该有多个空格
				shouldNotMatchPattern: /\}\s{2,}p-4/, // } 后面不应该有多个空格
			},
		];

		testCases.forEach(
			({
				name,
				input,
				expected,
				shouldContain,
				shouldNotContain,
				shouldNotMatchPattern,
			}) => {
				const result = sortTemplateClasses(input, { env });
				console.log(`\n${name}`);
				console.log('输入:', input);
				console.log('输出:', result);

				if (expected) {
					expect(result).toBe(expected);
				}
				if (shouldContain) {
					expect(result).toContain(shouldContain);
				}
				if (shouldNotContain) {
					expect(result).not.toContain(shouldNotContain);
				}
				if (shouldNotMatchPattern) {
					expect(result).not.toMatch(shouldNotMatchPattern);
				}
			}
		);
	});

	it('should preserve necessary whitespace (newlines and indentation)', () => {
		const input = `flex items-center
		\${active ? 'bg-blue-500' : 'bg-gray-200'}
		p-4`;

		const result = sortTemplateClasses(input, { env });

		console.log('\n保留换行和缩进:');
		console.log('输入:', input);
		console.log('输出:', result);

		// 应该保留换行符
		expect(result).toContain('\n');
		// 不应该在同一行有多个空格（除了缩进）
		const lines = result.split('\n');
		lines.forEach((line, i) => {
			const trimmedLine = line.trim();
			if (trimmedLine && !trimmedLine.includes('${')) {
				// 非表达式行，类名之间应该只有单个空格
				const classesOnly = trimmedLine.replace(/\$\{[^}]+\}/g, '');
				expect(classesOnly).not.toMatch(/\S\s{2,}\S/);
			}
		});
	});

	it('should handle the original reported issue with extra spaces', () => {
		const input = ` whitespace-pre-wrap  text-sm  text-gray-600  \${
		  !isExpanded ? \`line-clamp-\${maxLines}\` : ''
		}`;

		const result = sortTemplateClasses(input, { env });

		console.log('\n原始问题（多余空格）:');
		console.log('输入:', input);
		console.log('输出:', result);

		// 静态部分不应该有多余空格
		const staticPart = result.split('${')[0];
		console.log('静态部分:', staticPart);

		// 类名应该被正确排序且只有单个空格分隔
		expect(staticPart.trim()).toBe('whitespace-pre-wrap text-sm text-gray-600');

		// 表达式前应该只有一个空格
		expect(result).toMatch(/text-gray-600 \$\{/);
	});

	it('should handle complex real-world examples', () => {
		const testCases = [
			{
				name: '实际项目中的复杂示例',
				input: `container   mx-auto   px-4   sm:px-6   lg:px-8    \${
					isActive ? 'bg-blue-500  text-white  shadow-lg' : 'bg-gray-100  text-gray-800'
				}    rounded-lg   overflow-hidden`,
			},
		];

		testCases.forEach(({ name, input }) => {
			const result = sortTemplateClasses(input, { env });

			console.log(`\n${name}:`);
			console.log('输入长度:', input.length);
			console.log('输出长度:', result.length);
			console.log('输出:', result);

			// 不应该有多个连续空格（除了表达式内部的格式）
			const beforeExpr = result.split('${')[0];
			const afterExpr = result.split('}')[1];

			expect(beforeExpr).not.toMatch(/\S\s{2,}\S/);
			if (afterExpr) {
				expect(afterExpr).not.toMatch(/\S\s{2,}\S/);
			}
		});
	});
});

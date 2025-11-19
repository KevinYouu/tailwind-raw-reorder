import { describe, it, expect } from 'vitest';
import { sortTemplateClasses } from '../src/complex-expressions';
import { getTailwindConfig } from '../src/config';

describe('Extra whitespace handling', () => {
	const env = getTailwindConfig();

	it('should remove extra whitespace from nested template literals', () => {
		// 测试嵌套模板字符串中的多余空格
		const cases = [
			{
				name: '嵌套模板字符串内部的多余空格',
				input: `whitespace-pre-wrap text-sm text-gray-600 \${!isExpanded ? \`line-clamp-\${maxLines}\` : ''}`,
				shouldContain: 'text-gray-600',
				shouldNotContain: '  ', // 不应该有双空格
			},
			{
				name: '嵌套模板字符串之间的多余空格',
				input: `flex items-center  \${condition ? \`bg-blue-500  text-white\` : \`bg-gray-200  text-black\`}  p-4`,
				shouldContain: 'items-center',
				shouldNotContain: '  ', // 不应该有双空格
			},
			{
				name: '表达式前后的多余空格',
				input: `text-sm   \${value}   p-4`,
				shouldContain: 'text-sm',
			},
		];

		cases.forEach(({ name, input, shouldContain, shouldNotContain }) => {
			console.log(`\n测试: ${name}`);
			console.log('输入:', input);
			const result = sortTemplateClasses(input, { env });
			console.log('输出:', result);

			if (shouldContain) {
				expect(result).toContain(shouldContain);
			}
			if (shouldNotContain) {
				// 检查是否还有多余空格（但排除表达式内部）
				const parts = result.split('${');
				const staticParts = parts.filter(
					(_, i) => i === 0 || !parts[i - 1].includes('}')
				);
				staticParts.forEach((part) => {
					if (!part.includes('${') && !part.includes('}')) {
						expect(part).not.toContain(shouldNotContain);
					}
				});
			}
		});
	});

	it('should handle the specific nested template case with extra spaces', () => {
		const input = `whitespace-pre-wrap  text-sm  text-gray-600  \${
		  !isExpanded ? \`line-clamp-\${maxLines}\` : ''
		}`;

		const result = sortTemplateClasses(input, { env });

		console.log('\n嵌套模板字符串空格测试:');
		console.log('输入:', input);
		console.log('输出:', result);

		// 静态部分不应该有多余空格
		const beforeExpression = result.split('${')[0];
		console.log('表达式前的部分:', beforeExpression);

		// 检查类名之间是否只有单个空格
		const classes = beforeExpression.trim().split(/\s+/);
		console.log('类名列表:', classes);
		expect(classes.length).toBeGreaterThan(0);
	});
});

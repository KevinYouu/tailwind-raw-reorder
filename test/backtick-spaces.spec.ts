import { describe, it, expect } from 'vitest';
import { sortTemplateClasses } from '../src/complex-expressions';
import { getTailwindConfig } from '../src/config';

describe('Specific user case - backtick with leading/trailing spaces', () => {
	const env = getTailwindConfig();

	it('should remove spaces inside backticks before and after content', () => {
		// 用户的实际案例
		const input = ` whitespace-pre-wrap text-sm text-gray-600  \${
          !isExpanded ? \`line-clamp-\${maxLines}\` : ''
        } `;

		const result = sortTemplateClasses(input, { env });

		console.log('\n用户案例分析:');
		console.log('输入: "' + input + '"');
		console.log('输出: "' + result + '"');
		console.log('输入长度:', input.length);
		console.log('输出长度:', result.length);
		console.log('开头字符:', input[0], '(code:', input.charCodeAt(0) + ')');
		console.log(
			'结尾字符:',
			input[input.length - 1],
			'(code:',
			input.charCodeAt(input.length - 1) + ')'
		);
		console.log(
			'输出开头字符:',
			result[0],
			'(code:',
			result.charCodeAt(0) + ')'
		);
		console.log(
			'输出结尾字符:',
			result[result.length - 1],
			'(code:',
			result.charCodeAt(result.length - 1) + ')'
		);

		// 开头不应该有空格
		expect(result[0]).not.toBe(' ');
		expect(result).toMatch(/^whitespace-pre-wrap/);

		// 结尾不应该有空格（可能有换行）
		expect(result.trim()).toBe(result.replace(/\s+$/, ''));
	});

	it('should handle inline version without newlines', () => {
		const input = ` whitespace-pre-wrap text-sm text-gray-600  \${!isExpanded ? \`line-clamp-\${maxLines}\` : ''} `;

		const result = sortTemplateClasses(input, { env });

		console.log('\n内联版本:');
		console.log('输入: "' + input + '"');
		console.log('输出: "' + result + '"');

		// 开头和结尾都不应该有空格
		expect(result[0]).not.toBe(' ');
		expect(result[result.length - 1]).not.toBe(' ');
		expect(result.trim()).toBe(result);
	});

	it('should analyze the exact structure', () => {
		const input = ` whitespace-pre-wrap text-sm text-gray-600  \${
          !isExpanded ? \`line-clamp-\${maxLines}\` : ''
        } `;

		console.log('\n结构分析:');
		console.log('原始字符串长度:', input.length);

		// 分析各部分
		const parts = input.split('${');
		console.log('第一部分（表达式前）:', '"' + parts[0] + '"');
		console.log('第一部分长度:', parts[0].length);
		console.log(
			'第一部分开头空格数:',
			(parts[0].match(/^\s+/) || [''])[0].length
		);
		console.log(
			'第一部分结尾空格数:',
			(parts[0].match(/\s+$/) || [''])[0].length
		);

		if (parts[1]) {
			const remaining = parts[1];
			const closeBraceIndex = remaining.lastIndexOf('}');
			const afterExpr = remaining.substring(closeBraceIndex + 1);
			console.log('表达式后部分:', '"' + afterExpr + '"');
			console.log('表达式后部分长度:', afterExpr.length);
			console.log(
				'表达式后开头空格数:',
				(afterExpr.match(/^\s+/) || [''])[0].length
			);
			console.log(
				'表达式后结尾空格数:',
				(afterExpr.match(/\s+$/) || [''])[0].length
			);
		}

		const result = sortTemplateClasses(input, { env });
		console.log('\n排序后:');
		console.log('输出:', '"' + result + '"');
		console.log('输出长度:', result.length);
	});
});

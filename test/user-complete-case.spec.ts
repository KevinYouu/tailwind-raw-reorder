import { describe, it, expect } from 'vitest';
import { getTextMatch, buildMatchers } from '../src/utils';
import { sortTemplateClasses } from '../src/complex-expressions';
import { getTailwindConfig } from '../src/config';

describe('Complete user case - className with backtick spaces', () => {
	const env = getTailwindConfig();

	it('should handle the exact user JSX code', () => {
		// 用户的完整 JSX 代码
		const jsxCode = `<div
        className={\` whitespace-pre-wrap text-sm text-gray-600  \${
          !isExpanded ? \`line-clamp-\${maxLines}\` : ''
        } \`}
      >Content</div>`;

		console.log('\n完整 JSX 代码测试:');
		console.log('原始代码:\n', jsxCode);

		// 使用 package.json 中的正则表达式提取 className
		const reactRegex = [
			[
				'(?:class(?:Name)?|tw)\\s*=\\s*\\{\\s*(`[\\s\\S]*?`(?=\\s*\\}))',
				'`([\\s\\S]*)`',
			],
		];

		const matchers = buildMatchers(reactRegex);
		let extractedClassName = '';

		for (const matcher of matchers) {
			getTextMatch(matcher.regex, jsxCode, (text) => {
				extractedClassName = text;
			});
		}

		console.log('\n提取的 className 内容:');
		console.log('"' + extractedClassName + '"');
		console.log('长度:', extractedClassName.length);

		// 排序
		const sorted = sortTemplateClasses(extractedClassName, { env });

		console.log('\n排序后:');
		console.log('"' + sorted + '"');
		console.log('长度:', sorted.length);

		// 验证
		expect(sorted[0]).not.toBe(' '); // 开头没有空格
		expect(sorted[0]).toBe('w'); // 应该以 'whitespace-pre-wrap' 开始
		expect(sorted[sorted.length - 1]).not.toBe(' '); // 结尾没有空格
		expect(sorted.trim()).toBe(sorted); // 没有前导或尾随空格

		// 应该包含所有类名
		expect(sorted).toContain('whitespace-pre-wrap');
		expect(sorted).toContain('text-sm');
		expect(sorted).toContain('text-gray-600');
		expect(sorted).toContain('${');
		expect(sorted).toContain('line-clamp-');
	});

	it('should compare before and after', () => {
		const before = ` whitespace-pre-wrap text-sm text-gray-600  \${
          !isExpanded ? \`line-clamp-\${maxLines}\` : ''
        } `;

		const after = sortTemplateClasses(before, { env });

		console.log('\n对比测试:');
		console.log('之前:', '"' + before + '"');
		console.log('之后:', '"' + after + '"');
		console.log('');
		console.log('之前长度:', before.length);
		console.log('之后长度:', after.length);
		console.log('减少了:', before.length - after.length, '个字符');
		console.log('');
		console.log(
			'之前开头:',
			before
				.substring(0, 5)
				.split('')
				.map((c) => (c === ' ' ? '␣' : c))
				.join('')
		);
		console.log(
			'之后开头:',
			after
				.substring(0, 5)
				.split('')
				.map((c) => (c === ' ' ? '␣' : c))
				.join('')
		);
		console.log('');
		console.log(
			'之前结尾:',
			before
				.substring(before.length - 5)
				.split('')
				.map((c) => (c === ' ' ? '␣' : c === '\n' ? '↵' : c))
				.join('')
		);
		console.log(
			'之后结尾:',
			after
				.substring(after.length - 5)
				.split('')
				.map((c) => (c === ' ' ? '␣' : c === '\n' ? '↵' : c))
				.join('')
		);

		// 验证改进
		expect(before.length).toBeGreaterThan(after.length); // 长度减少了
		expect(before[0]).toBe(' '); // 之前有空格
		expect(after[0]).not.toBe(' '); // 之后没有空格
		expect(before[before.length - 1]).toBe(' '); // 之前结尾有空格
		expect(after[after.length - 1]).not.toBe(' '); // 之后结尾没有空格
	});
});

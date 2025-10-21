import { describe, it, expect } from 'vitest';
import { sortTemplateClasses } from '../src/complex-expressions';
import { getTailwindConfig } from '../src/config';

describe('User Reported Issue - Leading Space', () => {
	const { context, generateRules } = getTailwindConfig();
	const env = { context, generateRules };
	const options = {
		shouldRemoveDuplicates: true,
		shouldPrependCustomClasses: false,
		customTailwindPrefix: '',
		env,
	};

	it('should remove leading space in the exact user case', () => {
		// 用户提供的确切案例
		const input = `mr-2 transition-all duration-300 \${value ? 'text-red-500' : ' flex-1 text-green-500 flex'} group-hover:text-[#1890ff]`;
		const result = sortTemplateClasses(input, options);
		
		console.log('\n=== 用户案例测试 ===');
		console.log('输入:', input);
		console.log('输出:', result);
		console.log('');
		
		// 检查输出中是否还有 ": ' flex"（带开头空格）
		const hasLeadingSpace = result.includes(": ' flex") || result.includes(`: ' flex`);
		console.log('是否还有开头空格?', hasLeadingSpace);
		console.log('');
		
		// 断言
		expect(result).not.toContain(": ' flex");
		expect(result).toContain(": 'flex");
	});

	it('should show detailed parsing', () => {
		const input = `\${value ? 'text-red-500' : ' flex-1 text-green-500 flex'}`;
		const result = sortTemplateClasses(input, options);
		
		console.log('\n=== 详细解析 ===');
		console.log('输入:', input);
		console.log('输出:', result);
		
		// 提取三元运算符的两个分支
		const match1 = result.match(/\? '([^']+)'/);
		const match2 = result.match(/: '([^']+)'/);
		
		console.log('\n第一个分支:', match1 ? match1[1] : 'NOT FOUND');
		console.log('第二个分支:', match2 ? match2[1] : 'NOT FOUND');
		
		if (match2 && match2[1]) {
			console.log('\n第二个分支开头字符:', JSON.stringify(match2[1][0]));
			console.log('是空格吗?', match2[1][0] === ' ');
		}
	});
});

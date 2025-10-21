import { describe, it, expect } from 'vitest';
import { sortClasses } from '../src/sorting';
import { sortTemplateClasses } from '../src/complex-expressions';
import { getTailwindConfig } from '../src/config';

describe('VS Code Extension Simulation', () => {
	const { context, generateRules } = getTailwindConfig();
	const env = { context, generateRules };
	const options = {
		shouldRemoveDuplicates: true,
		shouldPrependCustomClasses: false,
		customTailwindPrefix: '',
		env,
	};

	it('should simulate VSCode extension sorting a full file', () => {
		// 模拟用户在 VS Code 中选中的代码
		const userCode = `className={\`mr-2 transition-all duration-300 \${value ? 'text-red-500' : ' flex-1 text-green-500 flex'} group-hover:text-[#1890ff]\`}`;
		
		console.log('\n=== VS Code 扩展模拟 ===');
		console.log('原始代码:');
		console.log(userCode);
		console.log('');
		
		// 提取 className 的值（模拟扩展的 regex 匹配）
		const match = userCode.match(/className=\{`([^`]+)`\}/);
		
		if (match && match[1]) {
			const classNameContent = match[1];
			console.log('提取的 className 内容:');
			console.log(classNameContent);
			console.log('');
			
			// 检查是否包含 ${}
			const hasExpression = classNameContent.includes('${');
			console.log('是否包含 ${}?', hasExpression);
			console.log('');
			
			// 排序
			let sorted;
			if (hasExpression) {
				sorted = sortTemplateClasses(classNameContent, options);
			} else {
				sorted = sortClasses(classNameContent, options);
			}
			
			console.log('排序后的内容:');
			console.log(sorted);
			console.log('');
			
			// 替换回原代码
			const newCode = userCode.replace(/className=\{`[^`]+`\}/, `className={\`${sorted}\`}`);
			console.log('最终代码:');
			console.log(newCode);
			console.log('');
			
			// 验证
			expect(sorted).not.toContain(": ' flex");
			expect(sorted).toContain(": 'flex");
			expect(newCode).not.toContain(": ' flex");
		}
	});

	it('should test raw className value directly', () => {
		// 直接测试 className 的值，不带 className={`...`} 包装
		const input = `mr-2 transition-all duration-300 \${value ? 'text-red-500' : ' flex-1 text-green-500 flex'} group-hover:text-[#1890ff]`;
		
		console.log('\n=== 直接测试 className 值 ===');
		console.log('输入:', input);
		
		const result = sortTemplateClasses(input, options);
		
		console.log('输出:', result);
		console.log('');
		
		// 高亮显示差异
		const inputSecondBranch = input.match(/: '([^']+)'/)?.[1];
		const resultSecondBranch = result.match(/: '([^']+)'/)?.[1];
		
		console.log('输入的第二分支:', JSON.stringify(inputSecondBranch));
		console.log('输出的第二分支:', JSON.stringify(resultSecondBranch));
		console.log('');
		
		if (inputSecondBranch && resultSecondBranch) {
			console.log('第一个字符比较:');
			console.log('  输入:', JSON.stringify(inputSecondBranch[0]), '(空格)', inputSecondBranch[0] === ' ');
			console.log('  输出:', JSON.stringify(resultSecondBranch[0]), '(空格)', resultSecondBranch[0] === ' ');
		}
		
		expect(result).not.toContain(": ' flex");
	});

	it('should handle the case without backslashes in template string', () => {
		// 测试真实的模板字符串（不是转义的）
		const input = 'mr-2 ${value ? \'text-red-500\' : \' flex-1 text-green-500 flex\'} p-4';
		
		console.log('\n=== 无转义测试 ===');
		console.log('输入:', input);
		
		const result = sortTemplateClasses(input, options);
		
		console.log('输出:', result);
		console.log('');
		
		expect(result).not.toContain(": ' flex");
	});
});

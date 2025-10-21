import { describe, it, expect } from 'vitest';
import { sortTemplateClasses } from '../src/complex-expressions';
import { getTailwindConfig } from '../src/config';

describe('User Reported ACTUAL Issue', () => {
	const { context, generateRules } = getTailwindConfig();
	const env = { context, generateRules };
	const options = {
		shouldRemoveDuplicates: true,
		shouldPrependCustomClasses: false,
		customTailwindPrefix: '',
		env,
	};

	it('should test the EXACT string user provided', () => {
		// 用户说这是"出现问题的"输出
		const problematicOutput = `mr-2 transition-all duration-300 \${value ? 'text-red-500' : ' flex flex-1 text-green-500'} group-hover:text-[#1890ff]`;
		
		console.log('\n=== 用户提供的问题字符串分析 ===');
		console.log('字符串:', problematicOutput);
		console.log('');
		
		// 提取冒号后的部分
		const afterColon = problematicOutput.match(/: (.+?)\}/)?.[1];
		console.log('冒号后的部分:', JSON.stringify(afterColon));
		console.log('');
		
		if (afterColon) {
			console.log('字符分解:');
			for (let i = 0; i < Math.min(afterColon.length, 30); i++) {
				console.log(`  [${i}]: "${afterColon[i]}" (${afterColon.charCodeAt(i)})`);
			}
		}
		
		// 检查是否是 ' flex（引号+空格+flex）还是 ' flex（空格+引号+flex）
		const hasSpaceQuoteSpace = problematicOutput.includes(`: ' flex`);
		const hasQuoteSpaceFlex = problematicOutput.includes(`': ' flex`); 
		const hasQuoteFlex = problematicOutput.includes(`': 'flex`);
		
		console.log('');
		console.log('模式检测:');
		console.log('  包含 `: \' flex` (冒号+空格+引号+空格+flex)?', hasSpaceQuoteSpace);
		console.log('  包含 `\': \' flex` (引号+冒号+空格+引号+空格+flex)?', hasQuoteSpaceFlex);
		console.log('  包含 `\': \'flex` (引号+冒号+空格+引号+flex)?', hasQuoteFlex);
	});

	it('should try to reproduce the issue', () => {
		// 可能的原始输入
		const possibleInputs = [
			// 情况1: 空格在引号里面
			`mr-2 \${value ? 'text-red-500' : ' flex flex-1 text-green-500'} p-4`,
			// 情况2: 空格在引号外面？（这不太可能）
			`mr-2 \${value ? 'text-red-500' :' flex flex-1 text-green-500'} p-4`,
			// 情况3: 双空格
			`mr-2 \${value ? 'text-red-500' : '  flex flex-1 text-green-500'} p-4`,
		];
		
		console.log('\n=== 尝试重现问题 ===');
		
		possibleInputs.forEach((input, index) => {
			console.log(`\n情况 ${index + 1}:`);
			console.log('输入:', input);
			
			const result = sortTemplateClasses(input, options);
			console.log('输出:', result);
			
			const hasLeadingSpace = result.includes(`: ' flex`) || result.includes(`':' flex`);
			console.log('输出是否有前导空格?', hasLeadingSpace);
		});
	});
});

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pckge from '../package.json';
import { getTextMatch, buildMatchers } from '../src/utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const langConfig =
	pckge.contributes.configuration[0].properties[
		'tailwind-raw-reorder.classRegex'
	].default;

describe('cn() Function Support', () => {
	const cnFilePath = path.resolve(
		__dirname,
		'./language_examples/cn-function.tsx'
	);
	const cnFile = readFileSync(cnFilePath, 'utf8');

	describe('TypeScript React', () => {
		it('应该匹配 cn() 函数中的字符串参数', () => {
			const matches: string[] = [];
			const matchers = buildMatchers(langConfig['typescriptreact']);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, cnFile, (text) => {
					matches.push(text);
				});
			}

			console.log('\n=== TypeScript React cn() 匹配结果 ===');
			console.log('总匹配数:', matches.length);
			matches.forEach((match, index) => {
				console.log(`[${index + 1}]:`, match);
			});

			// 验证基本匹配
			expect(matches.length).toBeGreaterThan(0);

			// 测试用例 1: 简单字符串
			expect(matches).toContain('mx-auto flex w-full justify-center');

			// 测试用例 2: cn() 会匹配每个字符串字面量
			expect(matches.some(m => m.includes('mx-auto flex w-full justify-center'))).toBe(true);

			// 测试用例 3: 条件类名
			expect(matches.some(m => m.includes('px-4 py-2 rounded'))).toBe(true);

			// 测试用例 5: 单行简洁写法
			expect(matches.some(m => m.includes('flex items-center gap-2 p-4'))).toBe(true);

			// 测试用例 6: 复杂嵌套
			expect(matches.some(m => m.includes('rounded font-medium transition-all duration-200'))).toBe(true);

			// 测试用例 10: 多行格式化
			expect(matches.some(m => m.includes('container mx-auto'))).toBe(true);
		});

		it('应该在 cn() 配置中包含正确的 regex 模式', () => {
			const cnPatterns = langConfig.typescriptreact;

			// 应该有 cn() 相关的配置
			expect(Array.isArray(cnPatterns)).toBe(true);

			// 将配置转换为字符串以便检查
			const configStr = JSON.stringify(cnPatterns);

			// 应该包含 cn 模式
			expect(configStr.includes('cn')).toBe(true);
		});
	});

	describe('JavaScript React', () => {
		it('应该匹配 JavaScript React 中的 cn() 函数调用', () => {
			const matches: string[] = [];
			const matchers = buildMatchers(langConfig['javascriptreact']);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, cnFile, (text) => {
					matches.push(text);
				});
			}

			console.log('\n=== JavaScript React cn() 匹配结果 ===');
			console.log('总匹配数:', matches.length);

			// JavaScript React 应该也能匹配相同的模式
			expect(matches.length).toBeGreaterThan(0);
			expect(matches.some(m => m.includes('mx-auto flex w-full justify-center'))).toBe(true);
		});
	});

	describe('边缘情况', () => {
		it('应该正确处理嵌套的引号', () => {
			const testCode = `
				<div className={cn("bg-white dark:bg-gray-900")}>Test</div>
			`;
			const matches: string[] = [];
			const matchers = buildMatchers(langConfig['typescriptreact']);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, testCode, (text) => {
					matches.push(text);
				});
			}

			expect(matches).toContain('bg-white dark:bg-gray-900');
		});

		it('应该处理包含特殊字符的类名', () => {
			const testCode = `
				<div className={cn("w-1/2 h-3/4 bg-[#424242]")}>Test</div>
			`;
			const matches: string[] = [];
			const matchers = buildMatchers(langConfig['typescriptreact']);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, testCode, (text) => {
					matches.push(text);
				});
			}

			expect(matches.some(m => m.includes('w-1/2 h-3/4 bg-[#424242]'))).toBe(true);
		});
	});
});

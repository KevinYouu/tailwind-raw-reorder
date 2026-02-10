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

describe('XML Language Support for Titanium SDK / PurgeTSS', () => {
	const xmlFilePath = path.resolve(
		__dirname,
		'./language_examples/example.xml'
	);
	const xmlFile = readFileSync(xmlFilePath, 'utf8');

	describe('Activation Events', () => {
		it('应该在 activationEvents 中包含 xml 语言支持', () => {
			const activationEvents = pckge.activationEvents;
			expect(activationEvents).toContain('onLanguage:xml');
		});
	});

	describe('Configuration', () => {
		it('应该包含 xml 语言的 classRegex 配置', () => {
			expect(langConfig).toHaveProperty('xml');
			expect(Array.isArray(langConfig.xml)).toBe(true);
			expect(langConfig.xml.length).toBe(3); // class, classes, icon
		});
	});

	describe('class 属性匹配', () => {
		it('应该匹配所有 class 属性', () => {
			const matches: string[] = [];
			const classPattern = langConfig.xml[0]; // class attribute pattern
			const matchers = buildMatchers(classPattern);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, xmlFile, (text) => {
					matches.push(text);
				});
			}

			// 验证匹配到的 class 属性
			expect(matches.length).toBeGreaterThan(0);
			expect(matches).toContain('flex-1 bg-white');
			expect(matches).toContain('p-4 rounded-lg shadow-md bg-gray-100');
			expect(matches).toContain('text-lg font-bold text-gray-900');
			expect(matches).toContain('w-full h-screen');
			expect(matches).toContain('container mx-auto px-4 py-8');
		});

		it('应该支持单引号和双引号', () => {
			const matches: string[] = [];
			const classPattern = langConfig.xml[0];
			const matchers = buildMatchers(classPattern);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, xmlFile, (text) => {
					matches.push(text);
				});
			}

			// 双引号
			expect(matches).toContain('flex-1 bg-white');
			// 单引号
			expect(matches).toContain('container mx-auto px-4 py-8');
		});
	});

	describe('classes 属性匹配（PurgeTSS 特定）', () => {
		it('应该匹配所有 classes 属性', () => {
			const matches: string[] = [];
			const classesPattern = langConfig.xml[1]; // classes attribute pattern
			const matchers = buildMatchers(classesPattern);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, xmlFile, (text) => {
					matches.push(text);
				});
			}

			// 验证匹配到的 classes 属性
			expect(matches.length).toBeGreaterThan(0);
			expect(matches).toContain('mt-4 mb-2 flex items-center justify-between');
			expect(matches).toContain('px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600');
			expect(matches).toContain('flex flex-col items-center justify-center');
		});
	});

	describe('icon 属性匹配', () => {
		it('应该匹配所有 icon 属性', () => {
			const matches: string[] = [];
			const iconPattern = langConfig.xml[2]; // icon attribute pattern
			const matchers = buildMatchers(iconPattern);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, xmlFile, (text) => {
					matches.push(text);
				});
			}

			// 验证匹配到的 icon 属性
			expect(matches.length).toBeGreaterThan(0);
			expect(matches).toContain('text-xl text-gray-600 hover:text-gray-800 transition-colors duration-200');
			expect(matches).toContain('text-2xl text-primary-500');
		});

		it('应该匹配 activeIcon 属性（被 icon regex 自动匹配）', () => {
			const matches: string[] = [];
			const iconPattern = langConfig.xml[2];
			const matchers = buildMatchers(iconPattern);

			// activeIcon 应该被 icon 的 regex 匹配
			// 因为 regex 是 icon=(...)，它会匹配 icon 开头的属性
			for (const matcher of matchers) {
				getTextMatch(matcher.regex, xmlFile, (text) => {
					matches.push(text);
				});
			}

			// 验证 activeIcon 也被匹配
			expect(matches).toContain('text-blue-500 font-bold text-base');
		});
	});

	describe('综合测试', () => {
		it('应该匹配 XML 文件中的所有 Tailwind 类', () => {
			const allMatches: string[] = [];
			const matchers = buildMatchers(langConfig['xml']);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, xmlFile, (text) => {
					allMatches.push(text);
				});
			}

			// 验证总匹配数量
			expect(allMatches.length).toBeGreaterThan(15); // 至少应该有15个匹配项

			// 验证不同类型的属性都被匹配
			const hasClassMatch = allMatches.some(m => m.includes('flex-1 bg-white'));
			const hasClassesMatch = allMatches.some(m => m.includes('mt-4 mb-2 flex items-center'));
			const hasIconMatch = allMatches.some(m => m.includes('text-xl text-gray-600'));

			expect(hasClassMatch).toBe(true);
			expect(hasClassesMatch).toBe(true);
			expect(hasIconMatch).toBe(true);
		});

		it('应该处理包含多个属性的元素', () => {
			const matches: string[] = [];
			const matchers = buildMatchers(langConfig['xml']);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, xmlFile, (text) => {
					matches.push(text);
				});
			}

			// 同一个 View 元素有 class, classes, icon 三个属性
			expect(matches).toContain('w-full h-screen');
			expect(matches).toContain('flex flex-col items-center justify-center');
			expect(matches).toContain('text-2xl text-primary-500');
		});

		it('应该处理复杂的嵌套 XML 结构', () => {
			const matches: string[] = [];
			const matchers = buildMatchers(langConfig['xml']);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, xmlFile, (text) => {
					matches.push(text);
				});
			}

			// 验证嵌套结构中的类
			expect(matches).toContain('bg-gradient-to-br from-purple-500 to-pink-500');
			expect(matches).toContain('flex-1 p-6');
			expect(matches).toContain('space-y-4 divide-y divide-gray-200');
			expect(matches).toContain('text-3xl font-extrabold text-white shadow-lg');
		});
	});

	describe('Regex 模式验证', () => {
		it('XML 配置应该使用两步匹配模式', () => {
			const xmlClassRegex = langConfig.xml[0];

			// XML 使用数组形式的两步匹配，与 HTML 类似
			expect(Array.isArray(xmlClassRegex)).toBe(true);
			expect(xmlClassRegex.length).toBe(2);

			// 第一步：匹配整个 class 属性
			expect(xmlClassRegex[0]).toContain('class=');
		});

		it('应该正确处理转义字符', () => {
			const testString = `<View class="bg-blue-500 hover:bg-blue-600">`;
			const matches: string[] = [];
			const matchers = buildMatchers(langConfig['xml'][0]);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, testString, (text) => {
					matches.push(text);
				});
			}

			expect(matches).toContain('bg-blue-500 hover:bg-blue-600');
		});

		it('应该正确处理包含斜杠的类名', () => {
			const testString = `<View classes="w-1/2 h-3/4 aspect-16/9">`;
			const matches: string[] = [];
			const matchers = buildMatchers(langConfig['xml'][1]);

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, testString, (text) => {
					matches.push(text);
				});
			}

			expect(matches).toContain('w-1/2 h-3/4 aspect-16/9');
		});
	});
});

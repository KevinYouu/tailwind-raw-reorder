import { describe, it, expect } from 'vitest';
import { getTextMatch, buildMatchers } from '../src/utils';
import pckge from '../package.json';

const langConfig =
	pckge.contributes.configuration[0].properties[
		'tailwind-raw-reorder-next.classRegex'
	].default;

describe('cn() Real User Cases - Debug', () => {
	it('应该匹配用户的实际案例 1', () => {
		const code = `className={cn(
          'px-0  mr-2  text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden',
        )}`;

		console.log('\n=== 案例 1 ===');
		console.log('代码:', code);

		const matches: string[] = [];
		const matchers = buildMatchers(langConfig['typescriptreact']);

		console.log('\n所有 matchers:');
		matchers.forEach((matcher, index) => {
			console.log(`Matcher ${index}:`, matcher.regex.map(r => r.source));
		});

		for (const matcher of matchers) {
			getTextMatch(matcher.regex, code, (text) => {
				matches.push(text);
			});
		}

		console.log('\n匹配结果:', matches);
		console.log('匹配数量:', matches.length);

		// 应该匹配到这个字符串
		const expected = 'px-0  mr-2  text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden';
		expect(matches.some(m => m.includes('px-0'))).toBe(true);
	});

	it('应该匹配用户的实际案例 2', () => {
		const code = `className={cn(
          buttonVariants({ variant: 'ghost' }),
          'px-0  mr-2  text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden',
        )}`;

		console.log('\n=== 案例 2 ===');
		console.log('代码:', code);

		const matches: string[] = [];
		const matchers = buildMatchers(langConfig['typescriptreact']);

		for (const matcher of matchers) {
			getTextMatch(matcher.regex, code, (text) => {
				matches.push(text);
			});
		}

		console.log('\n匹配结果:', matches);
		console.log('匹配数量:', matches.length);

		const expected = 'px-0  mr-2  text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden';
		expect(matches.some(m => m.includes('px-0'))).toBe(true);
	});
});

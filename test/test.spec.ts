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

describe('Basic Regex Tests', () => {
	describe('PHP', () => {
		const phpFilePath = path.resolve(
			__dirname,
			'./language_examples/example.blade.php'
		);
		const phpFile = readFileSync(phpFilePath, 'utf8');
		const matchesTruth = (
			phpFile.match(/class="((?:[^"{}<>]+|\\")+)"/g) || []
		).map((value) => {
			const match = value.match(/class="((?:[^"{}<>]+|\\")+)"/);
			return match ? match[1] : '';
		});

		it('should match all classes', () => {
			const matches: string[] = [];
			const matchers = buildMatchers(langConfig['php']);
			for (const matcher of matchers) {
				getTextMatch(matcher.regex, phpFile, (text) => {
					matches.push(text);
				});
			}
			expect(matches).toEqual(matchesTruth);
		});
	});

	describe('HTML', () => {
		const htmlFilePath = path.resolve(
			__dirname,
			'./language_examples/example.html'
		);
		const htmlFile = readFileSync(htmlFilePath, 'utf8');
		const matchesTruth = (
			htmlFile.match(/class="((?:[^"{}<>]+|\\")+)"/g) || []
		).map((value) => {
			const match = value.match(/class="((?:[^"{}<>]+|\\")+)"/);
			return match ? match[1] : '';
		});

		it('should match all classes', () => {
			const matches: string[] = [];
			const matchers = buildMatchers(langConfig['html']);
			for (const matcher of matchers) {
				getTextMatch(matcher.regex, htmlFile, (text) => {
					matches.push(text);
				});
			}
			expect(matches).toEqual(matchesTruth);
		});
	});

	describe('JavaScript', () => {
		const jsFilePath = path.resolve(
			__dirname,
			'./language_examples/example.vanilla.js'
		);
		const jsFile = readFileSync(jsFilePath, 'utf8');
		const matchesTruth = (
			jsFile.match(
				/(?:class(?:Name)?|tw)\s*=\s*(["'`])(?:(?:[^{}<>](?!\1))|\\\1)+[^{}<>]\1/g
			) || []
		).map((value) => {
			const match = value.match(
				/(?:class(?:Name)?|tw)\s*=\s*(["'`])((?:(?:[^{}<>](?!\1))|\\\1)+[^{}<>])\1/
			);
			return match ? match[2] : '';
		});

		it('should match all classes', () => {
			const matches: string[] = [];
			const matchers = buildMatchers(langConfig['javascript']);
			for (const matcher of matchers) {
				getTextMatch(matcher.regex, jsFile, (text) => {
					matches.push(text);
				});
			}
			expect(matches).toEqual(matchesTruth);
		});
	});

	describe('JavaScript React', () => {
		const jsxFilePath = path.resolve(
			__dirname,
			'./language_examples/example.react.jsx'
		);
		const jsxFile = readFileSync(jsxFilePath, 'utf8');
		const matchesTruth = (
			jsxFile.match(
				/(?:class(?:Name)?|tw)\s*=\s*{?(["'`])(?:(?:[^{}<>](?!\1))|\\\1)+[^{}<>]\1/g
			) || []
		).map((value) => {
			const match = value.match(
				/(?:class(?:Name)?|tw)\s*=\s*{?(["'`])((?:(?:[^{}<>](?!\1))|\\\1)+[^{}<>])\1/
			);
			return match ? match[2] : '';
		});

		it('should match all classes', () => {
			const matches: string[] = [];
			const matchers = buildMatchers(langConfig['javascriptreact']);
			for (const matcher of matchers) {
				getTextMatch(matcher.regex, jsxFile, (text) => {
					matches.push(text);
				});
			}
			expect(matches).toEqual(matchesTruth);
		});
	});
});

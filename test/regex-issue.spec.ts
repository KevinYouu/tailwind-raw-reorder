import { describe, it, expect } from 'vitest';
import { getTextMatch, buildMatchers } from '../src/utils';
import { sortTemplateClasses } from '../src/complex-expressions';
import { sortClasses } from '../src/sorting';
import { getTailwindConfig } from '../src/config';

describe('Package.json regex issue with nested template literals', () => {
	const tailwindConfig = getTailwindConfig();

	it('should correctly match and sort className with nested template literal', () => {
		// This is the actual JSX code that has the problem
		const code = `<div
  className={\`whitespace-pre-wrap text-sm text-gray-600 \${
    !isExpanded ? \`line-clamp-\${maxLines}\` : ''
  }\`}
>Content</div>`;

		// Test with the NEW improved regex from package.json
		const reactRegex = [
			[
				'(?:class(?:Name)?|tw)\\s*=\\s*\\{\\s*(`[\\s\\S]*?`(?=\\s*\\}))',
				'`([\\s\\S]*)`',
			],
			[
				'(?:class(?:Name)?|tw)\\s*=\\s*\\{?((["\'])(?:(?:[^{}<>](?!\\2))|\\\\\\2)+[^{}<>]\\2)',
				'["\']([^"\']+)["\']',
			],
		];

		const matchers = buildMatchers(reactRegex);

		let matchedText = '';
		let matchCount = 0;

		for (const matcher of matchers) {
			getTextMatch(matcher.regex, code, (text) => {
				matchedText = text;
				matchCount++;
				console.log('Matched text:', text);
			});
		}

		// Should match exactly once
		expect(matchCount).toBe(1);

		// The matched text should be the full template literal
		expect(matchedText).toContain('whitespace-pre-wrap');
		expect(matchedText).toContain('${');
		expect(matchedText).toContain('line-clamp-${maxLines}');
		expect(matchedText).toContain('`line-clamp-${maxLines}`');

		// Now test sorting
		const sortedText = sortTemplateClasses(matchedText, {
			env: tailwindConfig,
		});

		console.log('Original:', matchedText);
		console.log('Sorted:', sortedText);

		// The sorted text should maintain the structure
		expect(sortedText).toContain('${');
		expect(sortedText).toContain('`line-clamp-${maxLines}`');
		// The backtick should NOT appear after a }
		expect(sortedText).not.toContain('}`line-clamp-');
	});

	it('should handle the problematic regex pattern', () => {
		// The NEW improved regex pattern
		const pattern1 = new RegExp(
			'(?:class(?:Name)?|tw)\\s*=\\s*\\{\\s*(`[\\s\\S]*?`(?=\\s*\\}))',
			'gi'
		);

		const code = `className={\`whitespace-pre-wrap text-sm text-gray-600 \${!isExpanded ? \`line-clamp-\${maxLines}\` : ''}\`}`;

		const match = pattern1.exec(code);
		expect(match).not.toBeNull();

		if (match) {
			const capturedGroup = match[1];
			console.log('Pattern 1 captured:', capturedGroup);

			// This should now capture the entire template literal including nested ones
			expect(capturedGroup).toContain('`line-clamp-${maxLines}`');
			expect(capturedGroup).toContain('whitespace-pre-wrap');
			expect(capturedGroup).toContain('text-gray-600');

			// The second-level regex extraction
			const pattern2 = new RegExp('`([\\s\\S]*)`', 'gi');
			const match2 = pattern2.exec(capturedGroup);

			if (match2) {
				const innerContent = match2[1];
				console.log('Pattern 2 captured:', innerContent);

				// This is what gets sorted
				// It should contain the full content including nested templates
				expect(innerContent).toContain('${');
				expect(innerContent).toContain('line-clamp-${maxLines}');
			}
		}
	});

	it('should test the actual problematic regex from package.json', () => {
		// The regex that might be problematic:
		// "`([^`]*(?:\\$\\{[^}]*\\}[^`]*)*)`"
		// This pattern tries to match template literals but has issues with nested backticks

		const testString = `whitespace-pre-wrap text-sm text-gray-600 \${!isExpanded ? \`line-clamp-\${maxLines}\` : ''}`;

		// The pattern [^`]* means "match anything except backtick"
		// But when we have nested backticks like `line-clamp-${maxLines}`,
		// the pattern stops at the first backtick it encounters

		const problematicPattern = /`([^`]*(?:\$\{[^}]*\}[^`]*)*)`/g;
		const matches = [];
		let match;

		while ((match = problematicPattern.exec(testString)) !== null) {
			matches.push(match[1]);
			console.log('Match found:', match[1]);
		}

		console.log('All matches:', matches);

		// The problem: [^`]* will match up to the first backtick in the nested template
		// This can cause the regex to capture incorrectly or multiple times
	});
});

import { describe, it, expect } from 'vitest';
import { sortTemplateClasses } from '../src/complex-expressions';
import { getTailwindConfig } from '../src/config';

describe('Template literal issue with nested expressions', () => {
	const env = getTailwindConfig();

	it('should not break template literals with nested expressions', () => {
		const input = `whitespace-pre-wrap text-sm text-gray-600 \${
		  !isExpanded ? \`line-clamp-\${maxLines}\` : ''
		}`;

		const result = sortTemplateClasses(input, { env });

		// The result should not move the backtick or break the structure
		expect(result).toContain('${');
		expect(result).toContain('`line-clamp-${maxLines}`');
		expect(result).not.toContain('}`line-clamp-');
	});

	it('should handle className with template literal containing ternary and nested template', () => {
		const input = `whitespace-pre-wrap text-sm text-gray-600 \${!isExpanded ? \`line-clamp-\${maxLines}\` : ''}`;

		const result = sortTemplateClasses(input, { env });

		// Verify structure is maintained
		expect(result).toMatch(
			/\$\{!isExpanded \? `line-clamp-\$\{maxLines\}` : ''\}/
		);
	});
});

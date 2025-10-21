import { Env, sortClasses } from './sorting';

/**
 * Sort Tailwind classes within template literals that may contain expressions
 * Example: `mr-2 ${value ? 'text-red-500' : 'text-green-500'} group-hover:text-[#1890ff]`
 */
export function sortTemplateClasses(
	templateString: string,
	options: {
		seperator?: RegExp;
		replacement?: string;
		env: Env;
	}
): string {
	if (!templateString || typeof templateString !== 'string') {
		return templateString;
	}

	// If no template expressions, just sort normally
	if (!templateString.includes('${')) {
		return sortClasses(templateString, options);
	}

	let result = '';
	let currentIndex = 0;

	// Parse the template string character by character to handle nested expressions
	while (currentIndex < templateString.length) {
		// Find the next ${
		const exprStart = templateString.indexOf('${', currentIndex);

		if (exprStart === -1) {
			// No more expressions, sort the remaining static text
			const remaining = templateString.substring(currentIndex);
			if (remaining.trim()) {
				// Preserve leading/trailing spaces
				const leadingSpace = remaining.match(/^\s*/)?.[0] || '';
				const trailingSpace = remaining.match(/\s*$/)?.[0] || '';
				const trimmed = remaining.trim();
				result += leadingSpace + sortClasses(trimmed, options) + trailingSpace;
			} else {
				result += remaining;
			}
			break;
		}

		// Sort the static text before the expression
		const staticText = templateString.substring(currentIndex, exprStart);
		if (staticText.trim()) {
			// Preserve leading/trailing spaces
			const leadingSpace = staticText.match(/^\s*/)?.[0] || '';
			const trailingSpace = staticText.match(/\s*$/)?.[0] || '';
			const trimmed = staticText.trim();
			result += leadingSpace + sortClasses(trimmed, options) + trailingSpace;
		} else {
			result += staticText;
		}

		// Find the matching closing brace
		let braceDepth = 0;
		let exprEnd = exprStart + 2; // Start after ${
		let inString = false;
		let stringChar = '';

		while (exprEnd < templateString.length) {
			const char = templateString[exprEnd];

			// Handle string boundaries
			if (
				(char === '"' || char === "'" || char === '`') &&
				templateString[exprEnd - 1] !== '\\'
			) {
				if (!inString) {
					inString = true;
					stringChar = char;
				} else if (char === stringChar) {
					inString = false;
					stringChar = '';
				}
			}

			// Only count braces outside of strings
			if (!inString) {
				if (char === '{') {
					braceDepth++;
				} else if (char === '}') {
					if (braceDepth === 0) {
						break; // Found the matching closing brace
					}
					braceDepth--;
				}
			}

			exprEnd++;
		}

		// Extract and process the expression
		const expression = templateString.substring(exprStart + 2, exprEnd);
		const sortedExpression = sortExpressionClasses(expression, options);
		result += '${' + sortedExpression + '}';

		currentIndex = exprEnd + 1; // Move past the closing brace
	}

	return result;
}

/**
 * Sort class strings within JavaScript expressions
 * Handles strings in quotes: 'class-name' or "class-name"
 */
function sortExpressionClasses(
	expression: string,
	options: {
		seperator?: RegExp;
		replacement?: string;
		env: Env;
	}
): string {
	// Match all quoted strings in the expression
	// We need to match each quote type separately to avoid cross-matching
	// Pattern: single quotes, double quotes, or backticks
	return expression.replace(
		/'([^']*)'|"([^"]*)"|`([^`]*)`/g,
		(match, singleContent, doubleContent, backContent) => {
			const content = singleContent || doubleContent || backContent;
			const quote = match[0];
			
			if (!content) return match;

			// Check if this looks like Tailwind classes
			// Must contain either a hyphen (e.g., text-red) or colon (e.g., hover:)
			// and should only contain valid Tailwind class characters
			const isTailwindClasses =
				content.trim() &&
				/[a-z0-9\-_:\/\[\]#., ]/i.test(content) &&
				(/[a-z]+-[a-z0-9]/i.test(content) ||
					/[a-z]+:/i.test(content) ||
					/\[.*\]/.test(content));

		if (isTailwindClasses) {
			try {
				// Trim leading/trailing whitespace before sorting
				const trimmedContent = content.trim();
				const sorted = sortClasses(trimmedContent, options);
				// console.log(`[sortExpressionClasses] "${content}" -> "${sorted}"`);
				return `${quote}${sorted}${quote}`;
			} catch (e) {
				// If sorting fails, return original
				return match;
			}
		}			return match;
		}
	);
}

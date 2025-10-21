export interface Context {
	getClassOrder?: (classes: string[]) => [string, number | null][];
	layerOrder: any;
}

export interface Env {
	generateRules: (classes: Set<string>, context: Context) => [number, any][];
	context: Context;
}

export function bigSign(bigIntValue: bigint | number): number {
	const a = bigIntValue > 0n ? 1 : 0;
	const b = bigIntValue < 0n ? 1 : 0;
	return a - b;
}

// Tailwind 4 compatible class ordering
function getClassOrderTailwind4(
	classes: string[],
	{ env }: { env: Env }
): [string, number | null][] {
	// For Tailwind 4, we use a simpler approach that works with the new class ordering
	// This provides a reasonable default ordering for common Tailwind classes

	// Define a simple ordering for common Tailwind 4 classes
	const classOrder = [
		// Layout
		'container',
		'fixed',
		'absolute',
		'relative',
		'static',
		'sticky',
		// Display & positioning
		'block',
		'inline-block',
		'inline',
		'flex',
		'grid',
		'hidden',
		'justify-center',
		'justify-start',
		'justify-end',
		'items-center',
		'items-start',
		'items-end',
		// Sizing
		'w',
		'h',
		'min-w',
		'min-h',
		'max-w',
		'max-h',
		// Spacing
		'm',
		'p',
		'mx',
		'my',
		'px',
		'py',
		'mt',
		'mr',
		'mb',
		'ml',
		'pt',
		'pr',
		'pb',
		'pl',
		// Colors & backgrounds
		'bg',
		'text',
		'border',
		// Typography
		'text',
		'font',
		'leading',
		'tracking',
		// Effects
		'shadow',
		'opacity',
		'rounded',
		// Transitions & animations
		'transition',
		'transform',
		'duration',
		'ease',
	];

	const classNamesWithOrder: [string, number | null][] = [];

	for (const className of classes) {
		let order: number | null = null;

		// Try to determine order based on class prefix
		for (let i = 0; i < classOrder.length; i++) {
			if (className.startsWith(classOrder[i])) {
				order = i;
				break;
			}
		}

		// If no specific order found, try to use Tailwind's internal ordering
		if (order === null && env.context.getClassOrder) {
			const tailwindOrder = env.context.getClassOrder([className])[0];
			order = tailwindOrder[1];
		}

		// If still no order, use the generateRules approach as fallback
		if (order === null) {
			try {
				const rules = env.generateRules(new Set([className]), env.context);
				order = rules.sort(([a], [z]) => bigSign(z - a))[0]?.[0] ?? null;
			} catch (e) {
				// If all else fails, put unknown classes at the beginning
				order = -1;
			}
		}

		classNamesWithOrder.push([className, order]);
	}

	return classNamesWithOrder;
}

export function sortClasses(
	classStr: string,
	{
		seperator,
		replacement,
		env,
	}: {
		seperator?: RegExp;
		replacement?: string;
		env: Env;
	}
): string {
	if (typeof classStr !== 'string' || classStr === '') {
		return classStr;
	}

	// Ignore class attributes containing `{{`, to match Prettier behaviour:
	// https://github.com/prettier/prettier/blob/main/src/language-html/embed.js#L83-L88
	if (classStr.includes('{{')) {
		return classStr;
	}

	let result = '';
	let classes = classStr.split(seperator || /\s+/g).filter((t) => t);

	if (classes[classes.length - 1] === '') {
		classes.pop();
	}

	classes = sortClassList(classes, { env });

	// get rid of duplicates
	classes = [...new Set(classes)];

	for (let i = 0; i < classes.length; i++) {
		result += `${classes[i]}${replacement ?? ' '}`;
	}

	return result.trim();
}

export function sortClassList(
	classList: string[],
	{ env }: { env: Env }
): string[] {
	const classNamesWithOrder = env.context.getClassOrder
		? env.context.getClassOrder(classList)
		: getClassOrderTailwind4(classList, { env });

	return classNamesWithOrder
		.sort(([, a], [, z]) => {
			if (a === z) return 0;
			if (a === null) return -1;
			if (z === null) return 1;
			return bigSign(a - z);
		})
		.map(([className]) => className);
}

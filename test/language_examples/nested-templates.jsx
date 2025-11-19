// 这个文件演示了正则表达式修复后的效果

import React from 'react';

// 示例 1: 嵌套模板字符串（原问题场景）
function Example1({ isExpanded, maxLines }) {
	return (
		<div
			className={`whitespace-pre-wrap text-sm text-gray-600 ${
				!isExpanded ? `line-clamp-${maxLines}` : ''
			}`}
		>
			这个例子展示了嵌套的模板字符串。
			修复前会被错误格式化，修复后保持正确结构。
		</div>
	);
}

// 示例 2: 更复杂的嵌套
function Example2({ condition, value }) {
	return (
		<div
			className={`flex items-center ${
				condition
					? `bg-blue-${value} text-white`
					: `bg-gray-${value} text-black`
			} p-4`}
		>
			支持在嵌套模板字符串中使用变量
		</div>
	);
}

// 示例 3: 多层嵌套
function Example3({ primary, secondary, size }) {
	return (
		<button
			className={`rounded ${
				primary
					? `bg-blue-500 text-white ${size ? `p-${size}` : 'p-4'}`
					: secondary
					? `bg-gray-500 text-white ${size ? `p-${size}` : 'p-2'}`
					: 'bg-white text-gray-900'
			} hover:opacity-80`}
		>
			多层嵌套也能正确处理
		</button>
	);
}

// 示例 4: 多行模板字符串
function Example4({ active, loading }) {
	return (
		<div
			className={`
        flex items-center justify-center
        ${
					active
						? `
          bg-blue-500 
          text-white 
          shadow-lg
        `
						: `
          bg-gray-200 
          text-gray-800
        `
				}
        ${loading ? `opacity-50 cursor-not-allowed` : 'cursor-pointer'}
      `}
		>
			支持多行格式
		</div>
	);
}

// 示例 5: 混合使用
function Example5({ props }) {
	const { expanded, lines, theme } = props;

	return (
		<article
			className={`
        prose max-w-none
        ${theme === 'dark' ? 'prose-invert' : 'prose-light'}
        ${!expanded ? `line-clamp-${lines} overflow-hidden` : ''}
        ${theme === 'custom' ? `text-${props.customColor}` : ''}
      `}
		>
			混合使用各种模式
		</article>
	);
}

export { Example1, Example2, Example3, Example4, Example5 };

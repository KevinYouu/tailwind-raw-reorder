// cn() 函数测试用例
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 测试用例 1: 简单的字符串参数
const Component1 = () => {
  return (
    <div className={cn("mx-auto flex w-full justify-center")}>
      Simple string
    </div>
  )
}

// 测试用例 2: 多个字符串参数
const Component2 = ({ className }: { className?: string }) => {
  return (
    <div className={cn(
      "mx-auto flex w-full justify-center",
      "p-4 bg-white rounded-lg shadow-md",
      className
    )}>
      Multiple arguments
    </div>
  )
}

// 测试用例 3: 条件类名
const Component3 = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={cn(
      "px-4 py-2 rounded",
      isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
    )}>
      Conditional classes
    </div>
  )
}

// 测试用例 4: 对象形式的条件类名
const Component4 = ({ isActive, isDisabled }: { isActive: boolean, isDisabled: boolean }) => {
  return (
    <button className={cn(
      "px-6 py-3 font-semibold rounded-lg transition-colors",
      {
        "bg-blue-500 hover:bg-blue-600 text-white": isActive,
        "bg-gray-300 cursor-not-allowed text-gray-500": isDisabled
      }
    )}>
      Object syntax
    </button>
  )
}

// 测试用例 5: 单行简洁写法
const Component5 = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2 p-4", className)}>
    Inline
  </div>
)

// 测试用例 6: 复杂嵌套
const Component6 = ({ variant, size }: { variant: 'primary' | 'secondary', size: 'sm' | 'lg' }) => {
  return (
    <button className={cn(
      "rounded font-medium transition-all duration-200",
      variant === 'primary' && "bg-blue-500 hover:bg-blue-600 text-white",
      variant === 'secondary' && "bg-gray-200 hover:bg-gray-300 text-gray-900",
      size === 'sm' && "px-3 py-1 text-sm",
      size === 'lg' && "px-6 py-3 text-lg"
    )}>
      Complex nested
    </button>
  )
}

// 测试用例 7: 数组参数
const Component7 = () => {
  const baseClasses = ["flex", "items-center", "justify-center"]
  return (
    <div className={cn(baseClasses, "p-4 bg-white")}>
      Array arguments
    </div>
  )
}

// 测试用例 8: 模板字符串（不在 cn 内部）
const Component8 = ({ color }: { color: string }) => {
  return (
    <div className={cn(`bg-${color}-500 text-white p-4 rounded`)}>
      Template literal
    </div>
  )
}

// 测试用例 9: 嵌套的 cn 调用（边缘情况）
const Component9 = ({ className }: { className?: string }) => {
  const baseStyles = cn("flex flex-col gap-4")
  return (
    <div className={cn(baseStyles, "p-6 bg-gray-50", className)}>
      Nested cn
    </div>
  )
}

// 测试用例 10: 多行格式化
const Component10 = () => {
  return (
    <div
      className={cn(
        "container mx-auto",
        "max-w-7xl",
        "px-4 sm:px-6 lg:px-8",
        "py-8 md:py-12"
      )}
    >
      Multi-line formatted
    </div>
  )
}

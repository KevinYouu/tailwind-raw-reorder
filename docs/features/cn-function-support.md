# cn() 函数支持

## 功能说明

支持对 `cn()` 函数（来自 `clsx` + `tailwind-merge` 的常用工具函数）内的 Tailwind CSS 类名进行排序。

`cn()` 函数是 React/Next.js 项目中广泛使用的工具函数，用于合并和去重 Tailwind 类名：

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 实现位置

### 配置文件
- **package.json**: `contributes.configuration[0].properties['tailwind-raw-reorder.classRegex'].default`
  - `javascriptreact`: 第 3 个配置项
  - `typescript`: 第 3 个配置项
  - `typescriptreact`: 第 3 个配置项

### Regex 模式
```json
"\\bcn\\s*\\([^)]*?[\"'`]([^\"'`]+)[\"'`]"
```

### 测试文件
- `test/cn-function.spec.ts`: 测试规范（5 个测试用例）
- `test/language_examples/cn-function.tsx`: 测试示例文件（10+ 种使用场景）

## 运行流程

1. **匹配阶段**：使用正则表达式 `\bcn\s*\([^)]*?["'`]([^"'`]+)["'`]` 匹配 `cn()` 函数调用
2. **提取阶段**：提取每个字符串字面量参数中的类名
3. **排序阶段**：使用 Tailwind CSS 官方排序规则对类名排序
4. **替换阶段**：将排序后的类名替换回原位置

## 支持的语法

### ✅ 支持的用法

```tsx
// 1. 简单字符串参数
<div className={cn("mx-auto flex w-full justify-center")}>

// 2. 多个字符串参数
<div className={cn(
  "mx-auto flex w-full justify-center",
  "p-4 bg-white rounded-lg shadow-md",
  className
)}>

// 3. 条件类名（三元运算符）
<div className={cn(
  "px-4 py-2 rounded",
  isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
)}>

// 4. 单行简洁写法
<div className={cn("flex items-center gap-2 p-4", className)}>

// 5. 复杂嵌套条件
<button className={cn(
  "rounded font-medium transition-all duration-200",
  variant === 'primary' && "bg-blue-500 hover:bg-blue-600 text-white",
  variant === 'secondary' && "bg-gray-200 hover:bg-gray-300 text-gray-900"
)}>

// 6. 多行格式化
<div className={cn(
  "container mx-auto",
  "max-w-7xl",
  "px-4 sm:px-6 lg:px-8",
  "py-8 md:py-12"
)}>

// 7. 特殊字符和任意值
<div className={cn("w-1/2 h-3/4 bg-[#424242]")}>

// 8. 响应式类名
<div className={cn("bg-white dark:bg-gray-900")}>
```

### ⚠️ 限制

当前实现会匹配 `cn()` 函数调用中的**每个字符串字面量**，但：

- **对象语法**：`{ "bg-blue-500": isActive }` 不会被排序（字符串键会被匹配）
- **变量引用**：`cn(baseClasses, className)` 中的变量值不会被排序
- **嵌套 cn 调用**：嵌套的 `cn()` 会被分别处理

## 配置 / API

### 启用/禁用

此功能默认启用，无需额外配置。如需禁用，可以在 VS Code 设置中自定义 `classRegex` 配置，移除 `cn` 相关的 regex 模式。

### 自定义 Regex

如果你使用的是其他类似的函数名（如 `classNames`, `cx` 等），可以在设置中添加相应的 regex：

```json
{
  "tailwind-raw-reorder.classRegex": {
    "typescriptreact": [
      // ... 现有配置
      "\\bclassNames\\s*\\([^)]*?[\"'`]([^\"'`]+)[\"'`]",
      "\\bcx\\s*\\([^)]*?[\"'`]([^\"'`]+)[\"'`]"
    ]
  }
}
```

## 示例

### 排序前

```tsx
<div className={cn(
  "mx-auto justify-center flex w-full",
  "shadow-md rounded-lg bg-white p-4"
)}>
  Content
</div>
```

### 排序后

```tsx
<div className={cn(
  "mx-auto flex w-full justify-center",
  "rounded-lg bg-white p-4 shadow-md"
)}>
  Content
</div>
```

## 注意事项

1. **多参数匹配**：`cn()` 接受多个参数时，每个字符串字面量会被单独匹配和排序
2. **性能**：Regex 匹配在大文件上可能稍慢，建议对单个文件或选区使用
3. **引号类型**：支持双引号、单引号和反引号
4. **空格规范化**：会移除类名之间的多余空格
5. **兼容性**：支持 JavaScript React, TypeScript 和 TypeScript React

## 测试覆盖

- ✅ 简单字符串参数
- ✅ 多个字符串参数
- ✅ 条件类名（三元运算符）
- ✅ 单行简洁写法
- ✅ 复杂嵌套条件
- ✅ 多行格式化
- ✅ 特殊字符处理（斜杠、方括号、井号等）
- ✅ 嵌套引号
- ✅ 响应式修饰符（如 `dark:`, `hover:` 等）

运行测试：

```bash
npm run test -- cn-function.spec.ts
```

## 相关功能

- [className 属性排序](./className-sorting.md)（如果存在）
- [模板字符串支持](./template-literal-support.md)（如果存在）

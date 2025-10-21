# 功能使用指南

## 支持的类名格式

### 1. 简单字符串类名 ✅
```jsx
// HTML
<div class="flex items-center justify-center bg-white p-4">

// React/JSX
<div className="flex items-center justify-center p-4 bg-white">

// Vue
<div :class="'flex items-center justify-center p-4 bg-white'">
```

### 2. 模板字符串（无表达式）✅
```jsx
const classes = `flex items-center justify-center p-4 bg-white`;
```

### 3. 带三元运算符的模板字符串 ✨ NEW!
```jsx
// 基础三元运算符
<div className={`mr-2 transition-all ${isActive ? 'bg-blue-500' : 'bg-gray-200'} rounded-lg`}>

// 复杂三元运算符
<div className={`
  flex items-center
  ${value ? 'text-red-500 font-bold' : 'text-green-500 font-normal'}
  group-hover:text-[#1890ff]
`}>

// 多个条件表达式
<div className={`
  container mx-auto
  ${isPrimary ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}
  ${isLarge ? 'text-2xl p-8' : 'text-base p-4'}
  rounded-lg shadow-md
`}>
```

### 4. 任意值（Arbitrary Values）✅
```jsx
// 颜色
<div className="bg-[#424242] text-[rgb(255,0,0)]">

// 尺寸
<div className="w-[500px] h-[calc(100vh-4rem)]">

// 自定义属性
<div className="top-[117px] text-[14px]">
```

### 5. 嵌套和混合场景 ✅
```jsx
// 混合静态和动态
<div className={`
  fixed top-0 left-0 w-full
  ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
  transition-all duration-300 ease-in-out
  bg-white shadow-lg z-50
`}>

// 多层嵌套
<div className={`
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
  ${status === 'success' ? 'border-green-500 bg-green-50' : 
    status === 'error' ? 'border-red-500 bg-red-50' : 
    'border-gray-300 bg-gray-50'}
  p-6 rounded-xl
`}>
```

## 使用方式

### 方法 1: 保存时自动排序
默认启用，每次保存文件时自动排序所有 Tailwind 类名。

**配置：**
```json
{
  "tailwind-raw-reorder.runOnSave": true
}
```

### 方法 2: 手动触发排序
**快捷键：**
- macOS: `Shift + Alt + T`
- Windows/Linux: `Ctrl + Alt + T`

**命令面板：**
1. 打开命令面板 (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. 输入 "Tailwind Raw Reorder: Sort Tailwind CSS Classes"
3. 回车执行

### 方法 3: 选中文本排序
1. 选中包含类名的文本（不包括引号）
2. 打开命令面板
3. 执行 "Tailwind Raw Reorder: Sort Tailwind CSS Classes on current Selection"

### 方法 4: 整个工作区排序
对整个项目的所有文件进行排序：

1. 打开命令面板
2. 执行 "Tailwind Raw Reorder: Sort Tailwind CSS Classes on Entire Workspace"

## 示例对比

### Before ❌
```jsx
<div className={`
  text-white bg-blue-500 p-4 rounded-lg
  ${isActive ? 'shadow-lg border-2 border-blue-700' : 'shadow-md border border-gray-300'}
  flex items-center justify-center
  hover:bg-blue-600 transition-all duration-300
`}>
```

### After ✅
```jsx
<div className={`
  bg-blue-500 p-4 rounded-lg text-white
  ${isActive ? 'border-2 border-blue-700 shadow-lg' : 'border border-gray-300 shadow-md'}
  flex items-center justify-center
  duration-300 transition-all hover:bg-blue-600
`}>
```

## 支持的语言

- HTML
- JavaScript / TypeScript
- JSX / TSX (React)
- Vue
- Svelte
- PHP (Blade)
- CSS / SCSS / Less / PostCSS
- ERB, EJS, Haml, Pug, Twig

## 高级配置

### 自定义正则表达式
在 VS Code 设置中可以自定义每种语言的匹配模式：

```json
{
  "tailwind-raw-reorder.classRegex": {
    "html": "\\bclass\\s*=\\s*[\\\"\\']([_a-zA-Z0-9\\s\\-\\:\\/]+)[\\\"\\']",
    "javascriptreact": [
      [
        "((?:class(?:Name)?|tw)\\s*=\\s*{?([\"'`])(?:(?:[^{}<>](?!\\2))|\\\\\\2)+[^{}<>]\\2)",
        "(?:class(?:Name)?|tw)\\s*=\\s*{?(([\"'`])(?:(?:[^{}<>](?!\\2))|\\\\\\2)+[^{}<>])\\2",
        "[\"'`]([^]+)"
      ]
    ]
  }
}
```

## 注意事项

### ✅ 推荐做法
1. 让扩展在保存时自动运行
2. 配合 Prettier 或其他格式化工具使用
3. 在提交代码前确保类名已排序

### ⚠️ 已知限制
1. 不支持动态生成的类名变量：
   ```jsx
   const dynamicClass = someFunction(); // ❌ 无法排序
   <div className={dynamicClass}>
   ```

2. 复杂的 JavaScript 逻辑：
   ```jsx
   <div className={classes.map(c => c.name).join(' ')}> // ❌ 无法排序
   ```

### 💡 最佳实践
对于复杂的动态类名，建议使用条件类名库（如 `clsx` 或 `classnames`）配合静态字符串：

```jsx
import clsx from 'clsx';

<div className={clsx(
  'flex items-center justify-center', // ✅ 可以排序
  {
    'bg-blue-500 text-white': isPrimary, // ✅ 可以排序
    'bg-gray-200 text-gray-800': !isPrimary, // ✅ 可以排序
  }
)}>
```

## 故障排除

### 问题：排序后类名顺序看起来不对
**解决方案：** 扩展使用 Tailwind CSS 官方的类名顺序。如果顺序看起来不符合预期，请检查：
1. 是否使用了最新版本的 Tailwind CSS
2. 自定义配置是否正确

### 问题：某些文件类型不工作
**解决方案：** 检查 VS Code 的语言模式是否正确识别，并确保该语言在 `activationEvents` 中配置。

### 问题：三元运算符中的类名没有排序
**解决方案：** 确保使用的是 v3.3.0 或更高版本。早期版本不支持复杂表达式。

## 更新日志

### v3.3.0 (当前版本)
- ✨ 新增：支持模板字符串中的三元运算符
- ✨ 新增：支持复杂的 JavaScript 表达式
- 🚀 优化：TypeScript 完全重写
- 🧹 清理：移除旧的 JavaScript 文件
- 📦 优化：减少 22% 的依赖

---

**需要帮助？** 
- [GitHub Issues](https://github.com/KevinYouu/tailwind-raw-reorder/issues)
- [文档](https://github.com/KevinYouu/tailwind-raw-reorder#readme)

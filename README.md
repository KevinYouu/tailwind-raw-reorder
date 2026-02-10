# Tailwind Raw Reorder

Tailwind Raw Reorder is an opinionated Tailwind CSS class sorter for Visual Studio Code. It enforces consistent ordering of classes by parsing your code and reprinting class tags to follow a given order.

> Tailwind Raw Reorder runs on save, will remove duplicate classes and can even sort entire workspaces. **Now works with Tailwind CSS v4+ without requiring configuration files!**

## ✨ New in v4.0

- 🛠️ **TypeScript Migration** - Core codebase migrated to TypeScript for better type safety and maintainability
- 🧪 **Enhanced Test Coverage** - Comprehensive test suite with real-world user scenarios
- 🚀 **Tailwind CSS v4 Support** - Works without `tailwind.config` files
- ⚡ **Performance Optimized** - No more startup performance warnings
- 📁 **Enhanced Workspace Support** - Works with single files and workspaces
- 🎯 **Smart Activation** - Only activates when needed
- 🔧 **Simplified Configuration** - Removed complex config file dependencies

---

## Usage

You can install Tailwind Raw Reorder via the VS Code Marketplace, or package it yourself using [vsce](https://code.visualstudio.com/api/working-with-extensions/publishing-extension). Tailwind Raw Reorder works globally once installed and will run on save automatically.

### 🎯 Supported File Types

- **Web Frontend**: HTML, JavaScript, TypeScript, JSX, TSX, Vue, Svelte
- **CSS**: CSS, SCSS, Less, PostCSS
- **Template Engines**: PHP, Blade, ERB, EJS, Haml, Pug, Twig

### 🚀 Quick Start

1. Install the extension from the VS Code Marketplace
2. Open a file with Tailwind CSS classes
3. The extension will automatically sort classes on save
4. Or use keyboard shortcuts to sort manually

You can also trigger Tailwind Raw Reorder by:

* Pressing ALT + Shift + T on Mac
* Pressing CTRL + ALT + T on Windows
* Pressing CTRL + ALT + T on Linux


Tailwind Raw Reorder can sort individual files by running 'Sort Tailwind CSS Classes' via the Command Palette.

Workspaces can also be sorted by running 'Sort Tailwind CSS Classes on Entire Workspace'.

Your current selection can be sorted by running 'sort Tailwind CSS Classes on Selection'. You should select only the classes you want to sort, and not the entire line or surrounding qoutes / whitespace.

Any unknown classes will be moved to the start of the class list, whilst duplicate classes will be removed.

### `tailwind-raw-reorder.classRegex`:

An object with language IDs as keys and their values determining the regex to search for Tailwind CSS classes.
The default is located in [package.json](package.json) but this can be customized to suit your needs.

There can be multiple capturing groups, that should only contain a string with Tailwind CSS classes (without any apostrophies etc.). If a new group, which doesn't contain the `class` string, is created, ensure that it is non-capturing by using `(?:)`.

Example from `package.json`:

```json
"tailwind-raw-reorder.classRegex": {
    "html": "\\bclass\\s*=\\s*[\\\"\\']([_a-zA-Z0-9\\s\\-\\:\\/]+)[\\\"\\']",
    "javascriptreact": "(?:\\bclassName\\s*=\\s*[\\\"\\']([_a-zA-Z0-9\\s\\-\\:\\/]+)[\\\"\\'])|(?:\\btw\\s*`([_a-zA-Z0-9\\s\\-\\:\\/]*)`)"
}
```

#### Multi-step Regex

A multi-step regex can be specified by using an array of regexes to be executed in order.

Example from `package.json`:

```js
"tailwind-raw-reorder.classRegex": {
    "javascript": [
        "(?:\\bclass(?:Name)?\\s*=\\s*(?:{([\\w\\d\\s_\\-:/${}()[\\]\"'`,]+)})|([\"'`][\\w\\d\\s_\\-:/]+[\"'`]))|(?:\\btw\\s*(`[\\w\\d\\s_\\-:/]+`))",
        "(?:[\"'`]([\\w\\d\\s_\\-:/${}()[\\]\"']+)[\"'`])"
    ],
}
```

The first regex will look for JSX `class` or `className` attributes or [twin.macro](https://github.com/ben-rogerson/twin.macro) usage.

The second regex will then look for class names to be sorted within these matches.

#### Configuration Object

Optionally a configuration object can be passed to specify additional options for sorting class names.

- `regex` - specifies the regex to be used to find class names
- `separator` - regex pattern that is used to separate class names (default: `"\\s+"`)
- `replacement` - string used to replace separator matches (default: `" "`)

Example from `package.json`:

```js
"tailwind-raw-reorder.classRegex": {
    "jade": [
        {
            "regex": "\\.([\\._a-zA-Z0-9\\-]+)",
            "separator": "\\.",
            "replacement": "."
        },
        "\\bclass\\s*=\\s*[\\\"\\']([_a-zA-Z0-9\\s\\-\\:\\/]+)[\\\"\\']"
    ],
}
```

#### Debugging Custom Regex:

To debug custom `classRegex`, you can use the code below:
```js
// Your test string here
const editorText = `
  export const Layout = ({ children }) => (
    <div class="h-screen">
      <div className="w-64 h-full bg-blue-400 relative"></div>
      <div>{children}</div>
    </div>
  )
`
// Your Regex here
const regex = /(?:\b(?:class|className)?\s*=\s*{?[\"\']([_a-zA-Z0-9\s\-\:/]+)[\"\']}?)/
const classWrapperRegex = new RegExp(regex, 'gi')

let classWrapper
while ((classWrapper = classWrapperRegex.exec(editorText)) !== null) {
  const wrapperMatch = classWrapper[0]
  const valueMatchIndex = classWrapper.findIndex((match, idx) => idx !== 0 && match)
  const valueMatch = classWrapper[valueMatchIndex]

  console.log('classWrapper', classWrapper)
  console.log('wrapperMatch', wrapperMatch)
  console.log('valueMatchIndex', valueMatchIndex)
  console.log('valueMatch', valueMatch)
}
```

The result of `valueMatch` should be the class text _exactly_, with no other characters.

Good example value: `valueMatch w-64 h-full bg-blue-400 relative`

**Note**: Changes made to Tailwind Raw Reorder's JSON configuration options may not take effect immediately. When experimenting with custom `classRegex`, after each change you should open the control pallete (Ctrl/Cmd + Shift + P) and run `Developer: Reload Window` to ensure changes are applied.

<hr>

### `tailwind-raw-reorder.runOnSave`:

Tailwind Raw Reorder will run on save by default. This can be toggled on or off.

`"tailwind-raw-reorder.runOnSave": false`

## 🔄 Migration from v3.2.x

If you're upgrading from version 3.2.x or earlier:

1. **No Configuration Required** - The extension now works without `tailwind.config` files
2. **Removed Settings** - The following settings have been removed:
   - `tailwind-raw-reorder.IgnoreConfigNotFound`
   - `tailwind-raw-reorder.tailwindConfigPath`
3. **Better Performance** - Extension only activates when needed
4. **Broader Support** - Works with more file types out of the box

## 🛠️ Technical Improvements

### TypeScript Migration (v4.0)

The codebase has been completely migrated from JavaScript to TypeScript, providing:

- **Type Safety**: Compile-time error detection and improved code reliability
- **Better Maintainability**: Enhanced IDE support with IntelliSense and auto-completion
- **Improved Code Quality**: Better refactoring capabilities and code documentation
- **Enhanced Testing**: Type-safe test cases with better coverage

### Enhanced Test Suite

Comprehensive test coverage including:

- **User Issue Tests**: Real-world scenarios reported by users
- **Whitespace Handling**: Robust testing of whitespace and edge cases
- **Complex Expressions**: Advanced CSS expression parsing and sorting
- **VSCode Simulation**: Tests that simulate actual VSCode extension behavior
- **Edge Cases**: Comprehensive coverage of unusual class patterns

## 🧪 Development

The project now uses a modern development stack:

- **TypeScript** for type-safe development
- **Vitest** for fast and reliable testing
- **ESM modules** for modern JavaScript support
- **Automated CI/CD** with comprehensive test reporting

## Contributing

Tailwind Raw Reorder is open-source and contributions are always welcome. If you're interested in submitting a pull request, please take a moment to review [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].

## 🌟 Features

- ✨ **Zero Configuration** - Works out of the box with Tailwind CSS v4+
- 🛠️ **TypeScript-Powered** - Type-safe codebase for reliability and maintainability
- ⚡ **High Performance** - Smart activation prevents startup delays
- 🎯 **Precision Sorting** - Consistent class ordering based on Tailwind's logic
- 🔄 **Automatic on Save** - Sort classes as you work
- 📁 **Workspace Support** - Sort entire projects or individual files
- 🎨 **Multi-language Support** - Works with HTML, JSX, Vue, Svelte, PHP, and more
- 🛠️ **Customizable** - Configure regex patterns for your specific needs
- 🧪 **Thoroughly Tested** - Comprehensive test suite covering real-world scenarios

### Forked from [heybourn/headwind]

This project was forked from [[heybourn/headwind](https://github.com/heybourn/headwind)] to continue development. Old repo is inactive as of 2023 Oct 6th.

Thanks to all the contributors of the original project.

## License

Tailwind Raw Reorder is open-source software licensed under the [MIT license](LICENSE.md).
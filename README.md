# Tailwind Raw Reorder Next

This project is a maintained fork of Tailwind Raw Reorder.

The original project is no longer actively maintained,
so this fork continues development and bug fixes.

Tailwind Raw Reorder Next is a high-performance, opinionated Tailwind CSS class sorter for Visual Studio Code. It ensures consistent class ordering by parsing your code and re-organizing class tags to follow Tailwind's recommended order.

> Tailwind Raw Reorder Next runs on save, removes duplicate classes, and can even sort entire workspaces. **Fully compatible with Tailwind CSS v4+ without requiring any configuration files!**

## ✨ Key Enhancements in This Version

This version represents a significant evolution of the original class sorting concept, featuring:

- 🛠️ **Full TypeScript Rewrite** - The entire core codebase has been migrated to TypeScript for rock-solid reliability, better type safety, and modern maintainability.
- 🚀 **Tailwind CSS v4 Engine** - Native support for Tailwind CSS v4's high-performance engine, working seamlessly without the need for `tailwind.config.js` files.
- ⚡ **Performance First** - Optimized activation and processing to ensure zero impact on VS Code startup time and ultra-fast sorting.
- 🧪 **Robust Test Suite** - Comprehensive testing against real-world scenarios, edge cases, and complex whitespace patterns to ensure your code is never broken.
- 🎯 **Smart Detection** - Improved regex engines that accurately identify classes in complex expressions, template literals, and diverse language formats.

---

## Usage

Install **Tailwind Raw Reorder Next** via the VS Code Marketplace. Once installed, it works globally and is configured to run on save by default.

### 🎯 Supported File Types

- **Web Frontend**: HTML, JavaScript, TypeScript, JSX, TSX, Vue, Svelte
- **CSS**: CSS, SCSS, Less, PostCSS
- **Template Engines**: PHP, Blade, ERB, EJS, Haml, Pug, Twig
- **Mobile & XML**: XML, React Native components

### 🚀 Quick Start

1. Install the extension from the VS Code Marketplace.
2. Open any file containing Tailwind CSS classes.
3. Classes will be automatically sorted when you save the file.
4. Or use manual triggers:
   * **Mac**: `Shift` + `Alt` + `T`
   * **Windows/Linux**: `Ctrl` + `Alt` + `T`

### Manual Commands

- **Sort Tailwind CSS Classes**: Sort classes in the current active editor.
- **Sort Tailwind CSS Classes on Entire Workspace**: Batch sort all supported files in your project.
- **Sort Tailwind CSS Classes on Selection**: Sort only the highlighted text (useful for complex template strings).

Any unknown classes will be moved to the beginning of the list, and duplicate classes are automatically removed.

---

## 🔧 Configuration

### `tailwind-raw-reorder-next.classRegex`

Define custom regex patterns to find classes in any language. The default patterns cover most use cases, but you can override them in your VS Code settings.

Example:
```json
"tailwind-raw-reorder-next.classRegex": {
    "html": "\\bclass\\s*=\\s*[\\\"\\']([_a-zA-Z0-9\\s\\-\\:\\/]+)[\\\"\\']",
    "javascriptreact": "(?:\\bclassName\\s*=\\s*[\\\"\\']([_a-zA-Z0-9\\s\\-\\:\\/]+)[\\\"\\'])|(?:\\btw\\s*`([_a-zA-Z0-9\\s\\-\\:\\/]*)`)"
}
```

### `tailwind-raw-reorder-next.runOnSave`

Toggle automatic sorting on save (Default: `true`).

```json
"tailwind-raw-reorder-next.runOnSave": false
```

---

## 🛠️ Technical Deep Dive

### TypeScript Migration
By rewriting the codebase in TypeScript, we've eliminated entire classes of bugs related to null references and improper type handling. This ensures that the organizer behaves predictably even when encountering malformed HTML or complex JavaScript expressions.

### Advanced Parsing
Unlike simpler sorters, this extension uses a multi-step regex approach to handle:
- Template literals with nested expressions `${...}`.
- Class variance authority (CVA) and `cn()` function patterns.
- Framework-specific attributes like `tw` or `classes`.

---

## 🔄 Relationship to Other Projects

This project was originally forked from [heybourn/headwind] to provide continued maintenance and modern feature support (like TypeScript and Tailwind v4). While it shares a lineage with Headwind, it has been significantly refactored and enhanced to meet modern development standards and performance requirements.

We thank the original authors for the foundational concept.

## Contributing

Tailwind Raw Reorder Next is open-source and we welcome contributions! Please check [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

## License

Tailwind Raw Reorder Next is open-source software licensed under the [MIT license](LICENSE.md).

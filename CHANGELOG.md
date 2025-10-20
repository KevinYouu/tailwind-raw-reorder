# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.3.0] - 2025-10-20

### Changed
- **BREAKING:** Removed tailwind.config file dependency for Tailwind 4+ compatibility
- Extension now works without requiring configuration files
- Optimized activation events to improve performance (removed `*` activation)
- Updated class sorting logic for Tailwind 4 compatibility
- Enhanced workspace support - now works with and without workspace folders
- Improved error handling and user feedback messages

### Added
- Support for Tailwind CSS v4 and later versions
- Custom class ordering logic for Tailwind 4
- Support for additional file types: Blade, ERB, EJS, Haml, Pug, Twig
- Flexible activation based on file types and commands

### Removed
- `tailwind-raw-reorder.IgnoreConfigNotFound` setting
- `tailwind-raw-reorder.tailwindConfigPath` setting
- Configuration file discovery and loading logic
- Strict workspace folder requirements

### Fixed
- Performance warning for universal activation events
- Extension not working in single-file scenarios
- Missing workspace error messages

## Unreleased

### Changed

* Overhauled class detecting regex for javascript/javascriptreact/typescript/typescriptreact, thanks [@petertriho](https://github.com/petertriho) in [#109](https://github.com/heybourn/headwind/pull/109)
* Support multiple class name regexes per language and optional separator and replacement options, thanks [@han-tyumi](https://github.com/han-tyumi) in [#112](https://github.com/heybourn/headwind/pull/112)
* Fix `cmd+shift+t` overriding default vscode keymap for reopening previously closed tabs, thanks [@tylerjlawson](https://github.com/tylerjlawson) in [#163](https://github.com/heybourn/headwind/pull/163)
* Forked from [heybourn/headwind] to [Trapfether/tailwind-raw-reorder] to continue development. Old repo is inactive.
* Initial rework of the extension to use the same approach as the [Prettier Tailwind plugin]
* Updated the html and php regexes to only select class attributes proceeded by a space
* Added Sort Selection command to sort the selected classes

## [3.2.0]

### Added
- Option to ignore tailwind config not found error (thanks to [@kyaruwo](https://github.com/kyaruwo)) in [#11]
- Option to change default tailwind config path
- Output Channel to log errors and info
- Sort Selection command to sort the selected classes

### Changed
- Startup check for workspace folder. If no workspace folder is found, the extension will not activate
- Runtime check for workspace folder based on the active file. If the active file is not in the workspace folder, the extension will not run. This is to prevent the extension from running on files outside the workspace folder
- If either of the above checks fail, the extension will log an error message to it's output channel
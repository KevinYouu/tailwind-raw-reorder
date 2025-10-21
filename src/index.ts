import {
	commands,
	workspace,
	Range,
	window,
	ExtensionContext,
	WorkspaceFolder,
} from 'vscode';
import { getTextMatch, buildMatchers, LangConfig } from './utils';
import { spawn } from 'child_process';
import { rustyWindPath } from 'rustywind';
import { getTailwindConfig } from './config';
import { sortClasses } from './sorting';
import { sortTemplateClasses } from './complex-expressions';

// Re-export for testing
export { getTextMatch, buildMatchers } from './utils';
export { sortClasses } from './sorting';
export { sortTemplateClasses } from './complex-expressions';

const config = workspace.getConfiguration();
const langConfig: { [key: string]: LangConfig | LangConfig[] } =
	config.get('tailwind-raw-reorder.classRegex') || {};
const workspaceFolder: WorkspaceFolder | undefined =
	(workspace.workspaceFolders || [])[0];
const outputLogChannel = window.createOutputChannel('Tailwind Raw Reorder');

export function activate(context: ExtensionContext): void {
	// Extension now works with or without workspace folders
	// This allows it to be used when editing single files
	if (!workspaceFolder) {
		outputLogChannel.appendLine('Extension activated without workspace folder');
	}

	const disposable = commands.registerTextEditorCommand(
		'tailwind-raw-reorder.sortTailwindClasses',
		function (editor, edit) {
			const editorText = editor.document.getText();
			const editorLangId = editor.document.languageId;
			const editorFilePath = editor.document.fileName;
			const editorWorkspace = workspace.getWorkspaceFolder(editor.document.uri);

			const matchers = buildMatchers(
				langConfig[editorLangId] || langConfig['html']
			);

			// For Tailwind 4, we don't need to check for config files
			const tailwindConfig = getTailwindConfig();

			for (const matcher of matchers) {
				getTextMatch(matcher.regex, editorText, (text, startPosition) => {
					const endPosition = startPosition + text.length;
					const range = new Range(
						editor.document.positionAt(startPosition),
						editor.document.positionAt(endPosition)
					);

					const options = {
						separator: matcher.separator,
						replacement: matcher.replacement,
						env: tailwindConfig,
					};

					// Check if the text contains template literal expressions
					const sortedText = text.includes('${')
						? sortTemplateClasses(text, options)
						: sortClasses(text, options);

					edit.replace(range, sortedText);
				});
			}
		}
	);

	const runOnProject = commands.registerCommand(
		'tailwind-raw-reorder.sortTailwindClassesOnWorkspace',
		() => {
			const workspaceFolders = workspace.workspaceFolders || [];
			if (workspaceFolders.length > 0) {
				window.showInformationMessage(
					`Running Tailwind Raw Reorder on: ${workspaceFolders[0].uri.fsPath}`
				);

				const rustyWindArgs = [
					workspaceFolders[0].uri.fsPath,
					'--write',
				].filter((arg) => arg !== '');

				const rustyWindProc = spawn(rustyWindPath, rustyWindArgs);

				rustyWindProc.stdout.on(
					'data',
					(data) =>
						data &&
						data.toString() !== '' &&
						console.log('rustywind stdout:\n', data.toString())
				);

				rustyWindProc.stderr.on('data', (data) => {
					if (data && data.toString() !== '') {
						console.log('rustywind stderr:\n', data.toString());
						window.showErrorMessage(
							`Tailwind Raw Reorder error: ${data.toString()}`
						);
					}
				});
			} else {
				window.showInformationMessage(
					'No workspace folder found. Please open a folder to run workspace sorting.'
				);
			}
		}
	);

	const runOnSelection = commands.registerCommand(
		'tailwind-raw-reorder.sortTailwindClassesOnSelection',
		() => {
			const editor = window.activeTextEditor;
			if (editor) {
				const selection = editor.selection;
				const editorText = editor.document.getText(selection);
				const editorLangId = editor.document.languageId;

				const matchers = buildMatchers(
					langConfig[editorLangId] || langConfig['html']
				);

				// For Tailwind 4, we don't need to check for config files
				const tailwindConfig = getTailwindConfig();

				for (const matcher of matchers) {
					const seperator = matcher.separator;
					const replacement = matcher.replacement;

					// regex that matches a seperator seperated list of classes that may contain letters, numbers, dashes, underscores, square brackets, square brackets with single quotes inside, and forward slashes
					const regexContent = `(?:[a-zA-Z][a-zA-Z\\/_\\-:]+(?:\\[[a-zA-Z\\/_\\-"'\\\\:\\.]\\])?(${
						(seperator || /\s/).source
					})*)+`;
					const regex = new RegExp(regexContent);
					if (regex.test(editorText) || editorText.includes('${')) {
						const options = {
							seperator: seperator,
							replacement,
							env: tailwindConfig,
						};
						// Check if the text contains template literal expressions
						const sortedText = editorText.includes('${')
							? sortTemplateClasses(editorText, options)
							: sortClasses(editorText, options);

						editor.edit((editBuilder) => {
							editBuilder.replace(selection, sortedText);
						});
					}
				}
			}
		}
	);

	context.subscriptions.push(runOnProject);
	context.subscriptions.push(disposable);
	context.subscriptions.push(runOnSelection);

	// if runOnSave is enabled organize tailwind classes before saving
	if (config.get('tailwind-raw-reorder.runOnSave')) {
		context.subscriptions.push(
			workspace.onWillSaveTextDocument((_e) => {
				commands.executeCommand('tailwind-raw-reorder.sortTailwindClasses');
			})
		);
	}
}

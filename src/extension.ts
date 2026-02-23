import * as vscode from 'vscode';
import { GitScanner } from './gitScanner';
import { WebviewProvider } from './webviewProvider';

let webviewPanel: vscode.WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
	console.log('Git Projects Welcome extension activated');

	// Create status bar item
	const statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
		-1000
	);
	statusBarItem.text = '$(folder-opened) projects';
	statusBarItem.command = 'git-projects-welcome.openPanel';
	statusBarItem.tooltip = 'Click to open Git Projects';
	statusBarItem.show();

	// Command: Open Git Projects Panel
	const openPanelCmd = vscode.commands.registerCommand(
		'git-projects-welcome.openPanel',
		() => {
			openWebviewPanel(context);
		}
	);

	// Command: Refresh projects list
	const refreshCmd = vscode.commands.registerCommand(
		'git-projects-welcome.refreshProjects',
		() => {
			refreshProjectsList();
		}
	);

	// Command: Open project (from webview)
	const openCmd = vscode.commands.registerCommand(
		'git-projects-welcome.openProject',
		(projectPath: string) => {
			if (projectPath) {
				vscode.commands.executeCommand(
					'vscode.openFolder',
					vscode.Uri.file(projectPath),
					false
				);
			}
		}
	);

	// Watch for configuration changes
	const configWatcher = vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration('gitProjectsWelcome')) {
			refreshProjectsList();
		}
	});

	// Auto-open panel on activation
	openWebviewPanel(context);

	context.subscriptions.push(statusBarItem);
	context.subscriptions.push(openPanelCmd);
	context.subscriptions.push(refreshCmd);
	context.subscriptions.push(openCmd);
	context.subscriptions.push(configWatcher);
}

function openWebviewPanel(context: vscode.ExtensionContext) {
	if (webviewPanel) {
		webviewPanel.reveal(vscode.ViewColumn.One);
		return;
	}

	webviewPanel = vscode.window.createWebviewPanel(
		'gitProjectsWelcome',
		'Git Projects',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			enableCommandUris: true,
			retainContextWhenHidden: true,
		}
	);

	webviewPanel.onDidDispose(() => {
		webviewPanel = undefined;
	});

	webviewPanel.webview.onDidReceiveMessage((message) => {
		switch (message.command) {
			case 'openProject':
				vscode.commands.executeCommand(
					'git-projects-welcome.openProject',
					message.path
				);
				break;
			case 'refresh':
				refreshProjectsList();
				break;
		}
	});

	refreshProjectsList();
}

function refreshProjectsList() {
	if (!webviewPanel) {
		return;
	}

	const config = vscode.workspace.getConfiguration('gitProjectsWelcome');
	const directories = config.get<string[]>('repositoryDirectories', []);
	const gitPath = config.get<string>('gitPath', 'git');

	const repositories = GitScanner.scanDirectories(directories, gitPath);
	updateWebview(repositories);
}

function updateWebview(repositories: any[]) {
	if (!webviewPanel) {
		return;
	}

	const isDark =
		vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ||
		vscode.window.activeColorTheme.kind ===
		vscode.ColorThemeKind.HighContrast;

	const htmlContent = WebviewProvider.getHtmlContent(repositories, isDark);
	webviewPanel.webview.html = htmlContent;
}

export function deactivate() { }

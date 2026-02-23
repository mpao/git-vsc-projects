# Git Projects Welcome

A VS Code extension that displays a welcome page listing git repositories from configured directories.

## Features

- 📁 **Automatic Repository Detection**: Scans configured directories for git repositories
- 🔍 **Repository Information**: Shows branch name and modified file count for each repo
- 🎨 **Theme Support**: Adapts to VS Code light and dark themes
- ⚙️ **Configurable**: Simple settings to specify which directories to scan
- 🔄 **Real-time Updates**: Automatically refreshes when settings change
- 🖱️ **Click to Open**: Click on any repository to open it in VS Code
- 🔧 **Custom Git Path**: Support for custom git executable locations

## Installation

### Quick Install (Automatic)

#### Linux / macOS

```bash
chmod +x install.sh
./install.sh
```

#### Windows

```batch
install.bat
```

### Manual Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile the extension**
   ```bash
   npm run compile
   ```

4. **Package the extension**
   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```

5. **Install in VS Code**
   ```bash
   code --install-extension git-projects-welcome-0.0.1.vsix
   ```

### Development Mode

1. Clone the repository
2. Run `npm install`
3. Run `npm run compile` or `npm run watch` for continuous compilation
4. Open the folder in VS Code
5. Press `F5` to launch the extension in a debug window

## Configuration

Add the following to your VS Code `settings.json`:

```json
{
  "gitProjectsWelcome.repositoryDirectories": [
    "/path/to/projects",
    "~/my-repos",
    "$HOME/workspace"
  ],
  "gitProjectsWelcome.maxDepth": 3,
  "gitProjectsWelcome.gitPath": "git"
}
```

### Settings

- **`gitProjectsWelcome.repositoryDirectories`**: Array of directories to scan for git repositories. Supports `~` for home directory and environment variables like `$HOME`.
- **`gitProjectsWelcome.maxDepth`**: Maximum directory depth to scan (default: 3)
- **`gitProjectsWelcome.gitPath`**: Path to the git executable. Use this if git is not in your PATH or if you want to use a custom git installation (default: "git")

## How It Works

1. The extension opens a webview panel displaying all git projects
2. Scans the configured directories recursively
3. Finds all `.git` directories and builds a repository list
4. For each repository, it gathers:
   - Repository name (from directory name)
   - Current branch
   - Number of modified files
5. Repositories are grouped by their parent directory
6. The list is displayed in an interactive table format
7. Click on any repository name to open it in VS Code
8. Use the Refresh button to rescan for changes

## Usage

### Open the Panel

- Use the command palette: `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type "Git Projects Welcome"
- Select "Open Git Projects Panel"

### Click to Open

Simply click on any repository name in the list to open that folder in VS Code.

### Refresh Projects

Click the "🔄 Refresh" button in the panel to manually rescan for changes.

## Commands

- **Git Projects Welcome: Open Git Projects Panel**: Opens the interactive webview panel with all discovered projects
- **Git Projects Welcome: Refresh Git Projects**: Manually refresh the repository list
- **Git Projects Welcome: Open Project**: Opens a specific project (called automatically when clicking on a repo)

## Development

### Build

```bash
npm run compile
```

### Watch Mode

```bash
npm run watch
```

### Test

```bash
npm test
```

## Extension Architecture

- `gitScanner.ts`: Core logic for finding git repositories and gathering information
- `webviewProvider.ts`: HTML/CSS content generation for the UI
- `extension.ts`: VS Code extension entry point and command handlers

## Release Notes

### 0.0.1

Initial release with basic repository scanning and list display functionality.

# Git Projects Welcome - Extension Development Instructions

This is a VS Code extension that displays a welcome page listing git repositories from configured directories.

## Project Overview

- **Type**: VS Code Extension (TypeScript)
- **Main Purpose**: Scan configured directories for git repositories and display them with metadata
- **Key Components**:
  - `src/gitScanner.ts`: Repository detection and metadata gathering
  - `src/webviewProvider.ts`: UI content generation
  - `src/extension.ts`: Extension lifecycle and command handlers

## Setup Status

- ✅ Project scaffolded with Yeoman generator-code
- ✅ TypeScript configured
- ✅ Core modules implemented
- ✅ Compilation successful

## Next Steps for Development

1. **Test the Extension**: Press F5 to launch debug mode
2. **Test Configuration**: Add test directories to settings
3. **Enhance UI**: Consider adding webview panel for richer interface
4. **Add Tests**: Implement unit tests for gitScanner module
5. **Publish**: Follow VS Code extension publishing guidelines

## Development Commands

- `npm run compile`: Build the extension
- `npm run watch`: Continuous compilation
- `npm run lint`: Run ESLint
- `npm test`: Run tests
- `F5` (in VS Code): Launch debug instance with extension loaded

## Configuration Examples

Add to VS Code `settings.json`:

```json
{
  "gitProjectsWelcome.repositoryDirectories": [
    "/path/to/projects",
    "~/my-repos"
  ]
}
```

## Notes

- The extension scans directories recursively up to configurable depth
- Supports `~` and environment variables in paths
- Automatically detects branch and modified file count for each repo
- Refreshes on configuration changes

#!/bin/bash

# Git Projects Welcome - Extension Installation Script

set -e

echo "📦 Git Projects Welcome - Extension Installer"
echo "================================================"

# Check if VS Code is installed
if ! command -v code &> /dev/null; then
    echo "❌ Error: VS Code is not installed or not in PATH"
    echo "Please install VS Code from https://code.visualstudio.com"
    exit 1
fi

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
npm install

# Compile TypeScript
echo ""
echo "🔨 Compiling TypeScript..."
npm run compile

# Package the extension (using npx to avoid global permission issues)
echo ""
echo "📦 Packaging extension..."
npx @vscode/vsce package

# Install the extension
echo ""
echo "🚀 Installing extension in VS Code..."
VSIX_FILE=$(ls -t git-projects-welcome-*.vsix 2>/dev/null | head -1)

if [ -z "$VSIX_FILE" ]; then
    echo "❌ Error: VSIX file not found"
    exit 1
fi

code --install-extension "$VSIX_FILE"

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Open VS Code settings (Ctrl+,)"
echo "2. Search for 'gitProjectsWelcome.repositoryDirectories'"
echo "3. Add your project directories to the array"
echo "4. Click the 'projects' button in the status bar to view your repositories"
echo ""

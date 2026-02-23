import * as vscode from 'vscode';
import { GitRepository } from './gitScanner';

export class WebviewProvider {
	static getHtmlContent(repositories: GitRepository[], isDark: boolean): string {
		const repositoryRows =
			repositories.length > 0
				? repositories
					.map(
						(repo) =>
							`
              <tr class="repo-row" data-path="${this.escapeHtml(repo.path)}">
                <td class="repo-directory">${this.escapeHtml(repo.group)}</td>
                <td class="repo-name" title="${this.escapeHtml(repo.path)}">
                  <span class="repo-link">${this.escapeHtml(repo.name)}</span>
                </td>
                <td class="branch-name">${this.escapeHtml(repo.branch)}</td>
                <td class="status">
                  ${repo.isDirty > 0 ? `<span class="badge">${repo.isDirty}</span>` : ''}
                </td>
              </tr>
            `
					)
					.join('')
				: '';

		const bgColor = isDark ? '#1e1e1e' : '#ffffff';
		const textColor = isDark ? '#e0e0e0' : '#333333';
		const borderColor = isDark ? '#3e3e42' : '#d0d0d0';
		const hoverBg = isDark ? '#2d2d30' : '#f5f5f5';
		const linkColor = isDark ? '#4fc1ff' : '#0078d4';

		return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Git Projects Welcome</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background-color: ${bgColor};
            color: ${textColor};
            padding: 20px;
            line-height: 1.6;
        }

        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: auto;
            margin-right: auto;
            width: auto;
            min-width: 55%;
            position: relative;
        }

        .controls {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 8px;
            width: 100%;
        }

        .refresh-btn {
            background-color: transparent;
            color: ${textColor};
            border: 1px solid ${borderColor};
            padding: 4px 10px;
            border-radius: 2px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 500;
            transition: background-color 0.2s, border-color 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .refresh-btn:hover {
            background-color: ${hoverBg};
            border-color: ${textColor};
        }

        .refresh-btn:active {
            opacity: 0.8;
        }

        .repo-table {
            width: auto;
            border-collapse: collapse;
            font-size: 13px;
            table-layout: auto;
        }

        .repo-table thead {
            background-color: ${isDark ? '#2d2d30' : '#f5f5f5'};
            border-bottom: 1px solid ${borderColor};
        }

        .repo-table th {
            padding: 10px 12px;
            text-align: left;
            font-weight: 600;
            color: ${isDark ? '#cccccc' : '#444444'};
        }

        .repo-table td {
            padding: 10px 12px;
            border-bottom: 1px solid ${borderColor};
        }

        .repo-row {
            transition: background-color 0.2s ease;
            cursor: pointer;
        }

        .repo-row:hover {
            background-color: ${hoverBg};
        }

        .repo-row:last-child td {
            border-bottom: none;
        }

        .repo-directory {
            color: ${isDark ? '#858585' : '#666666'};
            font-size: 11px;
            font-weight: 400;
            padding-right: 12px !important;
            padding-left: 0 !important;
            width: auto;
            white-space: nowrap;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .repo-link {
            color: ${linkColor};
            text-decoration: none;
            cursor: pointer;
        }

        .repo-link:hover {
            text-decoration: underline;
        }

        .repo-name {
            font-weight: 500;
            word-break: break-word;
            max-width: 400px;
        }

        .branch-name {
            color: ${isDark ? '#ce9178' : '#d7651c'};
            font-family: 'Courier New', monospace;
            font-size: 12px;
        }

        .status {
            text-align: center;
            height: 24px;
            vertical-align: middle;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            height: 24px;
            border-radius: 12px;
            background-color: ${isDark ? '#d73a49' : '#ff4757'};
            color: white;
            font-weight: 700;
            font-size: 11px;
            padding: 0 6px;
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: ${isDark ? '#b0b0b0' : '#666666'};
        }

        .empty-state p {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        ${repositories.length > 0
				? `
        <div class="controls">
            <button class="refresh-btn" onclick="refreshProjects()">↻ Refresh</button>
        </div>
        <table class="repo-table">
          <thead>
            <tr>
              <th> </th>
              <th>Repository</th>
              <th>Branch</th>
              <th style="width: 6%;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${repositoryRows}
          </tbody>
        </table>
        `
				: `
        <div class="empty-state">
            <p>No git repositories found.</p>
            <p style="font-size: 12px; margin-top: 20px;">
                Configure repository directories in settings:
            </p>
            <code style="display: inline-block; margin-top: 10px; padding: 8px 12px; background-color: ${hoverBg}; border-radius: 4px;">
                gitProjectsWelcome.repositoryDirectories
            </code>
        </div>
        `
			}
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        document.querySelectorAll('.repo-row').forEach(row => {
            row.addEventListener('click', () => {
                const path = row.getAttribute('data-path');
                if (path) {
                    vscode.postMessage({
                        command: 'openProject',
                        path: path
                    });
                }
            });
        });

        function refreshProjects() {
            vscode.postMessage({
                command: 'refresh'
            });
        }
    </script>
</body>
</html>
    `;
	}

	private static escapeHtml(text: string): string {
		const map: { [key: string]: string } = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;',
		};
		return text.replace(/[&<>"']/g, (char) => map[char]);
	}
}

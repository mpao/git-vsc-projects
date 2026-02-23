import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface GitRepository {
	path: string;
	name: string;
	group: string;
	branch: string;
	isDirty: number;
}

export interface GitGroup {
	name: string;
	repositories: GitRepository[];
}

export class GitScanner {
	private static gitPath: string = 'git';

	/**
	 * Set the path to the git executable
	 */
	static setGitPath(path: string) {
		this.gitPath = path;
	}

	/**
	 * Recursively find all git repositories in a directory
	 */
	static findRepositories(root: string, maxDepth: number = 3): string[] {
		const repos: string[] = [];
		const visited = new Set<string>();

		const scan = (dir: string, depth: number) => {
			if (depth > maxDepth) {
				return;
			}

			try {
				const realPath = fs.realpathSync(dir);
				if (visited.has(realPath)) {
					return;
				}
				visited.add(realPath);

				// Check if current directory is a git repo
				if (fs.existsSync(path.join(dir, '.git'))) {
					repos.push(dir);
					return; // Don't recurse into git repositories
				}

				const entries = fs.readdirSync(dir, { withFileTypes: true });
				for (const entry of entries) {
					if (entry.isDirectory() && !entry.name.startsWith('.')) {
						try {
							scan(path.join(dir, entry.name), depth + 1);
						} catch (e) {
							// Skip directories we can't access
						}
					}
				}
			} catch (e) {
				// Skip if directory doesn't exist or isn't readable
			}
		};

		if (fs.existsSync(root)) {
			scan(root, 0);
		}

		return repos;
	}

	/**
	 * Get git information for a repository
	 */
	static getRepoInfo(
		repoPath: string
	): { branch: string; isDirty: number } {
		try {
			// Get current branch
			const branch = execSync(
				`"${this.gitPath}" -C "${repoPath}" rev-parse --abbrev-ref HEAD 2>/dev/null`,
				{ encoding: 'utf-8' }
			)
				.trim()
				.split('\n')[0];

			// Get number of changed files
			const statusOutput = execSync(
				`"${this.gitPath}" -C "${repoPath}" status --porcelain 2>/dev/null`,
				{ encoding: 'utf-8' }
			);
			const isDirty = statusOutput.split('\n').filter((line) => line).length;

			return { branch: branch || 'unknown', isDirty };
		} catch (e) {
			return { branch: 'unknown', isDirty: 0 };
		}
	}

	/**
	 * Scan directories and return flat sorted list of repositories
	 */
	static scanDirectories(directoryPaths: string[], gitPath: string = 'git'): GitRepository[] {
		this.setGitPath(gitPath);
		const repos: GitRepository[] = [];

		for (const dirPath of directoryPaths) {
			if (!dirPath || !fs.existsSync(dirPath)) {
				continue;
			}

			try {
				const expandedPath = this.expandPath(dirPath);
				const foundRepos = this.findRepositories(expandedPath);

				for (const repo of foundRepos) {
					const parentDir = path.basename(path.dirname(repo));
					const repoName = path.basename(repo);
					const { branch, isDirty } = this.getRepoInfo(repo);

					const gitRepo: GitRepository = {
						path: repo,
						name: repoName,
						group: parentDir,
						branch,
						isDirty,
					};

					repos.push(gitRepo);
				}
			} catch (e) {
				console.error(`Error scanning directory ${dirPath}:`, e);
			}
		}

		// Sort by group (directory) first, then by name (project)
		repos.sort((a, b) => {
			const groupCompare = a.group.localeCompare(b.group);
			if (groupCompare !== 0) {
				return groupCompare;
			}
			return a.name.localeCompare(b.name);
		});

		return repos;
	}

	/**
	 * Scan directories and group repositories (legacy method for compatibility)
	 */
	static scanDirectoriesGrouped(directoryPaths: string[], gitPath: string = 'git'): GitGroup[] {
		const repos = this.scanDirectories(directoryPaths, gitPath);
		const repoMap = new Map<string, GitRepository[]>();

		for (const repo of repos) {
			if (!repoMap.has(repo.group)) {
				repoMap.set(repo.group, []);
			}
			repoMap.get(repo.group)!.push(repo);
		}

		const groups: GitGroup[] = Array.from(repoMap.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([name, repositories]) => ({ name, repositories }));

		return groups;
	}

	/**
	 * Expand ~ and environment variables in paths
	 */
	private static expandPath(dirPath: string): string {
		if (dirPath.startsWith('~')) {
			return path.join(process.env.HOME || '~', dirPath.slice(1));
		}
		return dirPath.replace(/\$\{?(\w+)\}?/g, (_, name) => {
			return process.env[name] || '';
		});
	}
}

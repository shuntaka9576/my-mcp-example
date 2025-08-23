import * as fs from "node:fs";
import * as path from "node:path";
import { FastMCP } from "fastmcp";
import * as z from "zod";

const server = new FastMCP({
	name: "MyMcp",
	version: "0.0.1",
});

server.addTool({
	name: "get-slack-message",
	description: "Slackのメッセージを取得します",
	parameters: z.object({
		channelName: z.string(),
	}),
	execute: async (args) => {
		return `${args.channelName} ダミーレスポンスです`;
	},
});

server.addResource({
	uri: "file:///resources/repos/mcp-specification/docs/specification",
	name: "mcp-specification",
	description: "MCP仕様のドキュメント",
	mimeType: "text/markdown",
	async load() {
		const docsDir =
			"/Users/shuntaka/repos/github.com/shuntaka9576/my-mcp/resources/repos/mcp-specification/docs/specification";

		const findMarkdownFiles = async (dir: string): Promise<string[]> => {
			const entries = await fs.promises.readdir(dir, { withFileTypes: true });
			const files = await Promise.all(
				entries.map(async (entry) => {
					const fullPath = path.join(dir, entry.name);
					if (entry.isDirectory()) {
						return findMarkdownFiles(fullPath);
					}
					if (entry.name.endsWith(".md")) {
						return [fullPath];
					}
					return [];
				}),
			);
			return files.flat();
		};

		const markdownFiles = await findMarkdownFiles(docsDir);
		const texts = await Promise.all(
			markdownFiles.map(async (filePath) => {
				const content = await fs.promises.readFile(filePath, "utf8");
				const relativePath = path.relative(docsDir, filePath);
				return `# ${relativePath}\n\n${content}`;
			}),
		);

		return {
			text: texts.join("\n\n"),
		};
	},
});

server.addPrompt({
	name: "git-commit",
	description: "Generate a Git commit message",
	arguments: [
		{
			name: "changes",
			description: "Git diff or description of changes",
			required: true,
		},
	],
	load: async (args) => {
		return `Generate a concise but descriptive commit message for these changes:\n\n${args.changes}`;
	},
});

// プロジェクト設定の配列
const projects = [
	{
		name: "blocc",
		path: "/Users/shuntaka/repos/github.com/shuntaka9576/blocc",
		description: "BLOCC プロジェクト",
	},
];

// プロジェクトファイル登録の初期化処理
const initializeProjectResources = async () => {
	const { exec } = await import("node:child_process");
	const { promisify } = await import("node:util");
	const execAsync = promisify(exec);

	for (const project of projects) {
		try {
			const { stdout } = await execAsync("rg --files", { cwd: project.path });
			const files = stdout
				.trim()
				.split("\n")
				.filter((line) => line);

			// 各ファイルを個別のリソースとして登録
			for (const file of files) {
				const filePath = path.join(project.path, file);
				server.addResource({
					uri: `file:///resources/repos/${project.name}/${file}`,
					name: `${project.name}:${file}`,
					description: `${project.description}: ${file}`,
					mimeType: "text/plain",
					async load() {
						try {
							const content = await fs.promises.readFile(filePath, "utf8");
							return {
								text: content,
							};
						} catch (error) {
							return {
								text: `Error reading file: ${error}`,
							};
						}
					},
				});
			}
		} catch (error) {
			console.error(`Error initializing resources for ${project.name}:`, error);
		}
	}
};

// リソースを初期化
initializeProjectResources();

server.addPrompt({
	name: "translate-to-japanese",
	description: "英語のテキストを日本語に翻訳します",
	arguments: [
		{
			name: "text",
			description: "翻訳したい英語のテキスト",
			required: true,
		},
	],
	load: async (args) => {
		return `以下の英語テキストを自然な日本語に翻訳してください:\n\n${args.text}`;
	},
});

server.start({
	transportType: "stdio",
});

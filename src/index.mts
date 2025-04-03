import { FastMCP } from "fastmcp";
import * as fs from "node:fs";
import * as path from "node:path";
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

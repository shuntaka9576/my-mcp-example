import { FastMCP } from "fastmcp";

const server = new FastMCP({
	name: "MyMcp",
	version: "0.0.1",
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

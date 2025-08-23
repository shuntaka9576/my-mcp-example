# PostgreSQL開発環境

## セットアップ
```bash
git submodule update --init --recursive
docker compose up -d
```

## PostgreSQL接続
```bash
psql -h localhost -p 5432 -U postgres -d postgres
# パスワード: postgres
```

## 基本コマンド
```sql
\dt                    -- テーブル一覧
SELECT * FROM users;   -- ユーザー一覧
SELECT * FROM products; -- 商品一覧
SELECT * FROM orders;  -- 注文一覧
\q                     -- 終了
```

## MCP設定
```bash
/Users/shuntaka/.local/share/mise/installs/node/24.6.0/bin/node --experimental-transform-types /Users/shuntaka/repos/github.com/shuntaka9576/my-mcp-example/src/index.mts
```

```json
  "mcpServers": {
    "mymcp": {
      "command": "/Users/shuntaka/.local/share/mise/installs/node/22.13.0/bin/node",
      "args": ["--experimental-transform-types", "/Users/shuntaka/repos/github.com/shuntaka9576/my-mcp/src/index.mts"]
    }
  }
```

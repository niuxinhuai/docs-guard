# docs-guard

A small CI/commit hook tool that enforces documentation updates when configured source paths change.

一个小型 CI / commit hook 工具：当配置的源码路径变更时，强制检查对应文档是否同步更新。

## English

### Install

```bash
npm install -g docs-guard
```

For local development:

```bash
npm install
npm link
docs-guard --help
```

### Usage

Create docs-guard.config.json, then run docs-guard in CI or pre-commit.

```bash
docs-guard
docs-guard --base main
docs-guard --config docs-guard.config.json
```

Example config:

```json
{
  "rules": [
    {
      "changed": "src/api/**",
      "docs": ["docs/api.md"]
    }
  ]
}
```

### Status

This is an MVP designed to be useful immediately and easy to extend. It has no runtime dependencies and targets Node.js 18+.

### Test

```bash
npm test
```

## 中文

### 安装

```bash
npm install -g docs-guard
```

本地开发：

```bash
npm install
npm link
docs-guard --help
```

### 用法

创建 docs-guard.config.json，然后在 CI 或 pre-commit 中运行 docs-guard。

```bash
docs-guard
docs-guard --base main
docs-guard --config docs-guard.config.json
```

配置示例：

```json
{
  "rules": [
    {
      "changed": "src/api/**",
      "docs": ["docs/api.md"]
    }
  ]
}
```

### 当前状态

这是一个可以直接使用的 MVP，重点是小、清晰、容易二次开发。运行时无第三方依赖，要求 Node.js 18+。

### 测试

```bash
npm test
```

## License

MIT

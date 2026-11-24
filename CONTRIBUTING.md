# Contributing / 贡献指南

欢迎提交 issue 和 pull request。

## 本地验证

需要 Node.js 20+。

    npm run check
    npm test
    npm pack --dry-run

## 约定

- 保持插件跨工作区通用，不写死任何本机路径。
- Host 路由与 Client UI 的改动都要写进 CHANGELOG.md。
- 与工作区绑定相关的逻辑改动应补充 lib/workspace-artifacts.mjs 的单元测试。
- 保留 LICENSE 与 ATTRIBUTION.md；基于原项目的来源说明不要删除。

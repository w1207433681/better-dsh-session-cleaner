# 工作区产物隔离规则（<workspace>）

每个新会话先运行 `powershell -NoProfile -ExecutionPolicy Bypass -File .dsh\session-workspace.ps1 -Name "<topic>"`，以输出的 SESSION_WORKDIR 为唯一工作目录，相对路径均按它解析。样本、解压、脚本、截图、报告、日志、缓存、下载物全部写入该目录；根目录只放规则、入口脚本和已有历史目录，新产物落根目录视为违规。代码任务优先用独立 Git worktree（<workspace>\worktrees\<task-name>\）；会话结束输出会话目录和产物清单。

<!-- better-dsh-session-cleaner:workspace-binding -->
<!-- /better-dsh-session-cleaner:workspace-binding -->

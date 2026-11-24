# 工作区产物隔离规则

每个新会话先运行：

powershell -NoProfile -ExecutionPolicy Bypass -File .dsh\session-workspace.ps1 -Name "<topic>"

以输出的 SESSION_WORKDIR 作为当前会话唯一工作目录。样本、解压、脚本、报告、日志、缓存和下载物都写入该目录。根目录只放规则、脚本和已有资料。

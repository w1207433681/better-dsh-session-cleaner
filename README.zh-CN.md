# better-dsh-session-cleaner

一个 DSH 会话删除插件：在会话菜单里真正删除会话，确认框按家族树展示子智能体和派生对话，并可勾选工作产物目录一起删除。

这个版本是跨工作区通用版。它不写死任何本机路径，工作产物目录从会话自己的 header.cwd 推导。

## 功能

- 删除会话日志、工作区记录、归档/置顶记录、投影缓存。
- 家族树：子智能体、派生对话及其下一层，按层级勾选。
- 工作产物目录：显示路径、目录大小、打开按钮、删除勾选框。
- 跨工作区：从会话所属工作区推导 <workspace>\sessions。
- 两种绑定来源：DSH 会话目录里的 artifact_workdir.txt，工作区里的 session-artifacts.json。
- 目录缺失时默认不创建；用户可在对话框里显式点击“创建并绑定当前会话”。
- 工作区级一次性绑定：工作区标题右侧新增“一键绑定当前工作区”图标按钮，点击即绑定当前会话所属工作区。
- 详细绑定入口：批量删除对话框头部提供“详细绑定工作区”，按工作区分组列出并逐个绑定，显示“已绑定/未绑定”。
- 持久绑定状态：绑定后标题栏图标保持绿色；切换到已绑定会话时自动重新读取状态，不再闪一下就消失。
- 安装脚本也会写入 AGENTS.md 规则和初始化脚本；以后该工作区的新会话自动建立产物目录。

## 安装

克隆仓库：

    git clone https://github.com/w1207433681/better-dsh-session-cleaner.git

把仓库内容复制到 DSH profile 的 node_modules：

    C:\Users\<you>\.dsh\profiles\desktop\node_modules\better-dsh-session-cleaner

Host 侧改动需要完全重启 DSH。

## 工作区绑定

### 界面入口

1. 工作区标题栏右侧的小按钮区现在多了一个“文件夹 + 加号”图标：一键绑定当前工作区。它只发送当前会话 ID，Host 从该会话的 header.cwd 推导工作区根目录，不依赖任何写死的本机路径。
2. 批量删除对话框头部提供“详细绑定工作区”：按工作区分组列出全部可绑定项，显示“已绑定/未绑定”，已绑定工作区显示“重新绑定这个工作区”，并显示成功路径或错误信息。
3. 标题栏图标的绿色是持久状态：插件通过只读的 workspace-status 路由检查当前会话，点开已绑定会话会继续显示绿色。

### 命令行安装

在目标工作区根目录运行：

    powershell -NoProfile -ExecutionPolicy Bypass -File .\node_modules\better-dsh-session-cleaner\scripts\install-workspace.ps1 -Workspace .

它会做三件事：

1. 复制初始化脚本到 .dsh\session-workspace.ps1。
2. 创建 sessions\session-artifacts.json。
3. 在 AGENTS.md 追加带标记的规则块；已有 AGENTS.md 不会被覆盖。

之后每个从该工作区根目录启动的新会话，先运行：

    powershell -NoProfile -ExecutionPolicy Bypass -File .dsh\session-workspace.ps1 -Name "topic"

脚本输出 SESSION_WORKDIR，并创建：

    <workspace>\sessions\YYYYMMDD-topic\
    <workspace>\sessions\YYYYMMDD-topic\samples\
    <workspace>\sessions\YYYYMMDD-topic\work\
    <workspace>\sessions\YYYYMMDD-topic\exports\
    <workspace>\sessions\YYYYMMDD-topic\reports\
    <workspace>\sessions\YYYYMMDD-topic\logs\
    <workspace>\sessions\YYYYMMDD-topic\cache\
    <workspace>\sessions\YYYYMMDD-topic\evidence\

同时写 session.json、DSH 会话目录里的 artifact_workdir.txt，以及 session-artifacts.json。

## manifest 格式

    {
      "version": 1,
      "sessions": {
        "session-8686b40a-...": "20261124-workspace-isolation"
      }
    }

sessions 的值是相对 <workspace>\sessions 的目录名。Host 会拒绝绝对路径、.. 穿越和根目录本身。

## 目录解析顺序

1. 从 header.cwd 得到 <workspace>\sessions。
2. 读取 DSH 会话目录里的 artifact_workdir.txt。
3. 如果 sidecar 路径合法，用它。
4. 否则读取 session-artifacts.json，用当前 sessionId 查目录名。
5. 都找不到就认为没有绑定目录。

## 删除对话框

- 上半部分沿用原版家族树。
- 工作产物区块显示每个已绑定会话的路径、大小和打开按钮。
- 每个目录独立勾选；只有勾选的目录会随会话一起删除。
- 没有绑定目录时显示提示，并提供“创建并绑定当前会话”按钮。
- 创建动作是显式用户操作；inspect 和 delete 路径不会偷偷创建目录。

## 开发

    npm run check
    npm test

模块说明：

- host.js：Cordis Host 路由、会话解析、工作产物绑定和删除。
- client.js：Web 客户端对话框、家族树、工作产物区块。
- session-model.js：DSH 会话路径模型。
- lib/workspace-artifacts.mjs：纯函数路径解析，可单独测试。
- scripts/install-workspace.ps1：工作区一次性绑定。
- scripts/session-workspace.ps1：每会话初始化。

## 隐私说明

对话框会显示本机工作区里的产物目录路径和目录大小。这些信息只从本机 DSH 会话记录和工作区 manifest 读取，不会上传到插件服务器。

## 参考来源

本项目参考并基于 Lzcdebear 的 better-dsh-session-deletetool 0.7.5 改造，保留了原插件的会话家族树、批量删除、Host/Client 结构和交互设计。

原项目：https://github.com/Lzcdebear/better-dsh-session-deletetool

感谢原作者提供的基础实现。

## License

MIT

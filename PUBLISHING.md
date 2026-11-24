# Publishing / 发布说明

本目录就是可直接放进 Git 仓库的开源版源码。

## 首次建仓

    git init -b main
    git add .
    git commit -m "Initial open-source release"
    git remote add origin https://github.com/w1207433681/better-dsh-session-cleaner.git
    git push -u origin main

发布前本机验证：

    npm run check
    npm test
    npm pack --dry-run

安装到 DSH 时把仓库内容放到 profile 的 node_modules/better-dsh-session-cleaner，然后完全重启 DSH。

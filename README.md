# Flowdesk 工作台

Next.js App Router 实现的事件与任务工作台，包含概览、事件记录、事件任务、数据看板和系统管理。

## 本地运行

```bash
npm install
npm run dev
```

`npm run build` 构建生产文件，`npm run lint` 运行静态检查。

路由位于 `src/app`，页面交互组件位于 `src/views`。`/projects` 和 `/tasks` 会分别重定向到 `/events` 和 `/event-tasks`。

## 系统管理演示

首次登录时，任意有效邮箱会成为管理员。演示密码是 `password`。管理员可在“系统管理”中添加用户、编辑姓名与部门、启停账号、分配角色，以及增删未使用的角色和调整权限。后续登录只能使用已添加且启用的邮箱。

用户和角色保存在当前浏览器的 `localStorage`，登录状态保存在 `sessionStorage`。权限只在前端执行；这是一套演示交互，不能用于真实的身份认证或安全边界。正式部署需要后端账号、密码处理、服务端权限校验和持久化存储。

# docker 安装 mysql
docker-compose up -d

# 开发Express项目

1. 安装 express 脚手架

2. 安装 sequelize 命令行工具

```
npm i -g express-generator@4

npm i -g sequelize-cli
```

3. 创建项目
```
express --no-view <project-name> // 记得删除 public 下的 index.html 文件

cd <project-name>

npm i

npm i nodemon // 修改package启动命令

npm i sequelize mysql2

sequelize init

npm start

```

4. 创建数据库
```
sequelize db:create --charset utf8mb4 --collate utf8mb4_general_ci // 创建数据库

sequelize model:generate --name Article --attributes title:string,content:text // 创建模型

sequelize db:migrate // 运行迁移文件

sequelize seed:generate --name article // 创建种子文件

sequelize db:seed --seed xxx-article // 运行指定种子文件

sequelize db:seed:all // 运行所有种子文件
```
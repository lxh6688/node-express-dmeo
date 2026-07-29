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

5. 其他表
```
sequelize model:generate --name Category --attributes name:string,rank:integer // Category表

sequelize model:generate --name User --attributes email:string,username:string,password:string,nickname:string,sex:tinyint,company:string,introduce:text,role:tinyint // User表

sequelize model:generate --name Course --attributes categoryId:integer,userId:integer,name:string,image:string,recommended:boolean,introductory:boolean,content:text,likesCount:integer,chaptersCount:integer // Course表

sequelize model:generate --name Chapter --attributes courseId:integer,title:string,content:text,video:string,rank:integer // Chapter表

sequelize model:generate --name Like --attributes courseId:integer,userId:integer // Like表

sequelize model:generate --name Setting --attributes name:string,icp:string,copyright:string // Setting表
```

6. 添加、删除、修改字段
```
sequelize migration:create --name add-avatar-to-user
```

7. 管理员用户和普通用户
```
sequelize seed:generate --name user
```
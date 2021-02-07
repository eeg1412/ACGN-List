# ACGN-List

自用动画漫画游戏小说记录系统。
前端使用 react + Ant Design
后端使用 nodejs + express
数据库使用 mongodb

## 预览

![](https://raw.githubusercontent.com/eeg1412/ACGN-List/main/gitImage/1.png)
![](https://raw.githubusercontent.com/eeg1412/ACGN-List/main/gitImage/2.png)
![](https://raw.githubusercontent.com/eeg1412/ACGN-List/main/gitImage/3.png)
![](https://raw.githubusercontent.com/eeg1412/ACGN-List/main/gitImage/4.png)
![](https://raw.githubusercontent.com/eeg1412/ACGN-List/main/gitImage/5.png)

## 使用

1. 在[这里](https://github.com/eeg1412/ACGN-List/releases)下载最新的发布版本。
2. 创建.env 配置文件，参考内容如下：

```

DB_HOST=mongodb://localhost:27017/acgnlist
JSON_LIMT=1mb
URLENCODED_LIMT=1mb
JWT_SECRET_KEY=wikimoeacgnlist
ACGN_SESSION_SECRET=wikimoeacgnlist
PORT=3000
USE_HTTPS=0
KEY_FILE_PATH=./bin/key.pem
CERT_FILE_PATH=./bin/chain.pem
SSL_PORT=669
SITE_URL=https://127.0.0.1:669

```

| 参数名              | 说明                  |
| ------------------- | --------------------- |
| DB_HOST             | Mongodb 的地址        |
| JSON_LIMT           | JSON 数据的最大数据量 |
| URLENCODED_LIMT     | 传输数据的最大数据量  |
| JWT_SECRET_KEY      | JWT 加密字符串        |
| ACGN_SESSION_SECRET | session 加密字符串    |
| PORT                | HTTP 端口             |
| USE_HTTPS           | 是否使用 HTTPS        |
| KEY_FILE_PATH       | HTTPS 私钥文件路径    |
| CERT_FILE_PATH      | HTTPS 证书文件路径    |
| SSL_PORT            | HTTPS 端口            |
| SITE_URL            | 网站 URL              |

3. 用控制台进入根目录
4. cd client 进入前端目录
5. npm install 安装前端依赖
6. 返回项目根目录
7. npm install 安装后端依赖
8. npm run start 启动项目

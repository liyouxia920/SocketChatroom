# Node.js + Socket实现移动端聊天程序

# 

## 1. 请先通过命令行安装相关依赖：

```
cnpm install

# 服务端
cnpm install express@4.17.1 --save
cnpm install socket.io@2.3.0 --save

# 客户端
cnpm install weapp.socket.io
```

## 2. 注意修改服务器的ip地址

```javascript
// Client/main.js
// 修改为你的服务器ip
Vue.prototype.socket = io('http://10.4.9.73:8081')
```

## 3. 启动服务端

## 4. 在HBuilder X中启动客户端

# 

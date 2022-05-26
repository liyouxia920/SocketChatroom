const express = require('express')
const app = express()
const port = 3000

let server = app.listen(8081)
let io = require('socket.io').listen(server);
//引入socket.js
require('./model/socket.js')(io);


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`项目已经在端口${port}启动!`))
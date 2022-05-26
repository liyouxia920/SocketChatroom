module.exports = function(io){
	let socketList = {};
	let users = [];

	io.sockets.on('connection',function(socket){
		// 此处提示语可以换成你的服务器ip
		console.log('连接到http://10.4.9.73:8081成功！');

		socket.on('join',(name,img) => {
			socket.name = name;
			socketList[name] = socket.id;
			let user = {name:name,img:img,id:socket.id,tip:false};
			users.push(user);

			socket.broadcast.emit('welcome',name,users);
			socket.emit('myself',name,users,socket.id);
		});
		//接收信息广播
		socket.on('message',data => {
			//广播
			socket.broadcast.emit('sendMsg',data);
		})
		//一对一消息
		socket.on('msg',data => {
			//console.log(data.tid);
			//广播
			socket.to(data.tid).emit('sMsg',data);
		})

		//用户离开
		socket.on('disconnecting',function(){
			if(socketList.hasOwnProperty(socket.name)){
				//删除
				delete socketList[socket.name];
				for(let i=0;i<users.length;i++){
					if(users[i].name == socket.name){
						users.splice(i,1);
					}
				}
				//广播有用户退出
				socket.broadcast.emit('quit',socket.name,users);
			}
		})
	})
}
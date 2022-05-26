<template>
	<view>
		<view class="status-bar">
			<view @tap="exit" class="login" hover-class="none">
				<image src="../../static/back.png" class="login-back"></image>
			</view>
			<scroll-view scroll-x="true" class="scrollNavbar">
				<view class="users">
					<view v-for="(item,index) in users" class="userLeft" @tap="otoChat(index)">
						<view class="tip" v-if="item.tip"></view>
						<image :src="'../../static/images/'+item.img+'.jpg'"></image>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="main">
			<view v-for="(item,index) in chat" :key="index">
				<view class="left msg" v-if="item.id ==1">
					<image :src="'../../static/images/'+item.img+'.jpg'"></image>
					<view class="dialogDetail">
						<view class="dialog">
							{{item.dialog}}
						</view>
						<view class="bottom-name">{{item.name}} {{timeData(item.time)}}</view>
					</view>
				</view>
				<view class="right msg" v-if="item.id==2">
					<image :src="'../../static/images/'+item.img+'.jpg'"></image>
					<view class="dialogDetail">
						<view class="dialog">
							{{item.dialog}}
						</view>
						<view class="bottom-name">{{timeData(item.time)}}</view>
					</view>
				</view>
				<view class="center" v-if="item.id==3">
					<view class="inner">{{item.name}}</view>
				</view>
			</view>
		</view>
		<!-- 发送消息 -->
		<view class="send">
			<textarea type="text" confirm-type="send" class="chat-send" v-model="chatm" auto-height="true"
				show-confirm-bar="false" maxlength="-1" />
			<button @tap="sendMsg" type="primary">发送</button>
		</view>
		<!-- 弹出层一对一聊天 -->
		<view class="popup" :animation="animationData">
			<view class="u-name">
				{{uname}}
			</view>
			<scroll-view class="dialogContainer" scroll-y="true">
				<view v-for="(item,index) in otochat" :key="index">
					<view class="left msg" v-if="item.fid == fid">
						<image :src="'../../static/images/'+item.img+'.jpg'"></image>
						<view class="dialogDetail">
							<view class="dialog">
								{{item.dialog}}
							</view>
							<view class="bottom-name">{{timeData(item.time)}}</view>
						</view>
					</view>
					<view class="right msg" v-if="item.fid==uid && item.tid == fid">
						<image :src="'../../static/images/'+item.img+'.jpg'"></image>
						<view class="dialogDetail">
							<view class="dialog">
								{{item.dialog}}
							</view>
							<view class="bottom-name">{{timeData(item.time)}}</view>
						</view>
					</view>
					<view class="cebottom-nameer" v-if="item.id==3">
						<view class="inner">{{item.name}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="bg" @tap="outotoChat" :style="{display:bg}"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chatm: '', //消息内容
				name: '', //用户名称
				uname: '',
				fid: '',
				uid: 'a',
				img: '', //用户头像
				chat: [], //聊天内容
				animationData: {},
				showDialog: false,
				bg: 'none',
				users: '',
				otochat: [],
			}
		},
		onLoad(e) {
			this.name = e.name;
			this.img = e.img;
			this.join(this.name, this.img);
			this.welcome();
			this.myself();
			this.receiveMsg();
			this.getMsg();
			this.quit();
		},
		methods: {
			timeData(date) {
				var time;
				var d = new Date(date);
				var n = new Date();
				// 获取时间戳
				var dd = d.getTime();
				var h = d.getHours();
				var m = d.getMinutes();
				var Y = d.getFullYear();
				var M = d.getMonth() + 1;
				var D = d.getDate();
				// 现在时间
				var nn = n.getTime();
				var hh = n.getHours();
				var mm = n.getMinutes();
				var YY = n.getFullYear();
				var MM = n.getMonth() + 1;
				var DD = n.getDate();

				if (D == DD && M == MM && Y == YY) {
					if (h < 10) {
						h = '0' + h;
					}
					if (m < 10) {
						m = '0' + m;
					}
					time = h + ':' + m;
					return time;
				} else if (D + 1 == DD && M == MM && Y == YY) {
					if (h < 10) {
						h = '0' + h;
					}
					if (m < 10) {
						m = '0' + m;
					}
					time = '昨天' + ' ' + h + ':' + m;
					return time;
				} else {
					if (M < 10) {
						M = '0' + M;
					}
					if (D < 10) {
						D = '0' + D;
					}
					if (h < 10) {
						h = '0' + h;
					}
					if (m < 10) {
						m = '0' + m;
					}
					time = Y + '年' + M + '月' + D + '日' + ' ' + h + ':' + m;
					return time;
				}
			},
			// 发送消息
			sendMsg() {
				if (this.chatm.length > 0 && this.fid == '') {
					// 自己发送的信息不需要看到自己的名字
					let onemsg = {
						dialog: this.chatm,
						img: this.img,
						time: new Date(),
						id: 2,
					}
					let data = {
						dialog: this.chatm,
						img: this.img,
						name: this.name,
						time: new Date(),
						id: 1,
					}
					this.chat.push(onemsg);
					this.chatm = ''; //清空
					this.socket.emit('message', data);
				} else if (this.chatm.length > 0 && this.fid != '') {
					// 一对一聊天
					let onemsg = {
						dialog: this.chatm,
						img: this.img,
						time: new Date(),
						fid: this.uid,
						tid: this.fid,
					}
					let data = {
						dialog: this.chatm,
						img: this.img,
						name: this.name,
						time: new Date(),
						fid: this.uid,
						tid: this.fid,
					}
					this.otochat.push(onemsg);
					this.chatm = ''; //清空
					// 客户端发送信息
					this.socket.emit('msg', data);
				}
			},
			// 加入群
			join(name, img) {
				this.socket.emit('join', name, img);
			},
			// 欢迎加入群
			welcome() {
				// 获取即时信息渲染，接收广播后的信息
				this.socket.on('welcome', (name, users) => {
					// 新增欢迎信息
					let wel = {
						name: '欢迎 ' + name + ' 加入群聊',
						id: 3,
					}
					this.chat.push(wel);
					for (var i = 0; i < users.length; i++) {
						if (users[i].id == this.uid) {
							users.splice(i, 1);
						}
					}
					this.users = users;
					console.log(this.users)
				})
			},
			// 获取自己
			myself() {
				// 获取即时信息渲染
				this.socket.on('myself', (name, users, id) => {
					// 新增欢迎信息
					this.uid = id;
					console.log(this.uid);
					let wel = {
						name: '欢迎 ' + name + ' 加入群聊',
						id: 3,
					}
					this.chat.push(wel);
					for (var i = 0; i < users.length; i++) {
						if (users[i].id == this.uid) {
							users.splice(i, 1);
						}
					}
					this.users = users;
					console.log(this.users)
				})
			},
			// 退出群提醒
			quit() {
				// 获取即时信息渲染
				this.socket.on('quit', (data, users) => {
					// 新增退出信息
					let wel = {
						name: data + ' 退出群聊',
						id: 3,
					}
					this.chat.push(wel);
					for (var i = 0; i < users.length; i++) {
						if (users[i].id == this.uid) {
							users.splice(i, 1);
						}
					}
					this.users = users;
				})
			},
			// 获取消息
			receiveMsg() {
				// 获取即时信息渲染
				this.socket.on('sendMsg', data => {
					this.chat.push(data);
				})
			},
			// 获取私聊消息
			getMsg() {
				this.socket.on('sMsg', data => {
					let fid = data.fid;
					if (this.fid != fid) {
						for (var i = 0; i < this.users.length; i++) {
							if (this.users[i].id == fid) {
								this.users[i].tip = true;
							}
						}
					}
					this.otochat.push(data);
				})
			},
			// 进入私聊
			otoChat(e) {
				//获取信息
				this.uname = this.users[e].name;
				this.fid = this.users[e].id;
				this.users[e].tip = false;
				this.popup();
			},
			// 退出私聊
			outotoChat() {
				this.uname = '';
				this.fid = '';
				this.popup();
			},
			// 私聊页面动画
			popup() {
				this.showDialog = !this.showDialog;
				if (this.showDialog) {
					this.bg = 'block';
				} else {
					this.bg = 'none';
				}
				var animation = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease',
				})
				this.animation = animation
				if (this.showDialog) {
					animation.bottom(0).step()

				} else {
					animation.bottom().step()
				}
				this.animationData = animation.export()
			},
			// 退出群聊
			exit() {
				uni.navigateTo({
					url:"../index/index"
				})
				this.$router.go(0)
			}
		}
	}
</script>

<style lang="scss">
	scroll-view ::-webkit-scrollbar {
	   //下面四个属性，选一个就可
	    display:none;
	    width: 0; 
	    height: 0;
	    background-color: transparent; 
	}
	.status-bar {
		position: fixed;
		left: 0;
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		overflow: hidden;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		z-index: 998;
		color: #272832;
		-webkit-transition-property: all;
		transition-property: all;
		background: rgba(255, 255, 255, 0.96);

		.login {
			width: 60rpx;
			height: 60rpx;
			padding-top: 22rpx;
			padding-left: 32rpx;
		}

		.login-back {
			width: 20rpx;
			height: 34rpx;
		}

		.scrollNavbar {
			width: 84%;
			.users {
				display: flex;
				.userLeft {
					padding: 12rpx 8rpx;
					position: relative;
					image {
						width: 64rpx;
						height: 64rpx;
						border-radius: 50%;
					}
					.tip {
						width: 14rpx;
						height: 14rpx;
						background: rgba(255, 0, 0, 1);
						position: absolute;
						top: 12rpx;
						right: 12rpx;
						border-radius: 50%;
						z-index: 10;
					}
				}
			}
		}
	}

	.main {
		padding: 160rpx 28rpx 160rpx;
	}
	.main,
	.dialogContainer {
		.msg {
			display: flex;
			align-items: flex-end;
			padding: 40rpx 0;
			image {
				flex: none;
				width: 64rpx;
				height: 64rpx;
				border-radius: 18rpx;
				margin: 0 20rpx;

			}
			.dialogDetail {
				.dialog {
					max-width: 380rpx;
					padding: 26rpx 32rpx;
					min-height: 48rpx;
					font-size: 28rpx;
					color: rgba(25, 29, 35, 1);
					line-height: 40rpx;
				}
				.bottom-name {
					padding-top: 8rpx;
					position: absolute;
					font-size: 24rpx;
					color: rgba(25, 29, 35, 0.5);
					line-height: 34rpx;
				}
			}
		}
		.left {
			flex-direction: row;
			.dialog {
				background: rgba(244, 244, 244, 1);
				border-radius: 24rpx 24rpx 24rpx 0px;
			}
		}
		.right {
			flex-direction: row-reverse;
			.dialog {
				background: rgba(85, 170, 255, 0.28);
				border-radius: 24rpx 24rpx 0px 24rpx;
			}
			.bottom-name {
				right: 132rpx;
			}
		}
		.center {
			text-align: center;
			padding: 32rpx 0 20rpx;
			.inner {
				font-size: 24rpx;
				display: inline-block;
				color: rgba(25, 29, 35, 0.5);
				line-height: 34rpx;
			}
		}
	}
	.send {
		position: fixed;
		z-index: 1002;
		bottom: 0;
		width: 100%;
		padding-bottom: var(--status-bar-height);
		min-height: 100rpx;
		background: rgba(255, 255, 255, 0.96);
		display: flex;
		align-items: center;
		justify-content: center;
		.chat-send {
			margin: 12rpx 24rpx;
			flex: 1;
			min-height: 40rpx;
			background: rgba(242, 242, 242, 1);
			border-radius: 24rpx;
			font-size: 28rpx;
			color: rgba(25, 29, 35, 1);
			line-height: 40rpx;
			padding: 24rpx;
		}
		button {
			display: flex;
			margin: 0 24rpx 0 0;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			width: 110rpx;
			height: 70rpx;
			border-radius: 24rpx;
		}
	}
	.popup {
		position: fixed;
		overflow: hidden;
		left: 0;
		bottom: -90%;
		width: 100%;
		height: 90%;
		z-index: 1000;
		background: #fff;
		border-radius: 48rpx 48rpx 0px 0px;
	}
	.u-name {
		position: absolute;
		top: 0;
		background-color: #fff;
		height: 80rpx;
		text-align: center;
		width: 100%;
		line-height: 80rpx;
	}
	.dialogContainer {
		padding: 88rpx 28rpx 120rpx;
		box-sizing: border-box;
		height: 100%;
	}
	.bg {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.4);
	}
</style>

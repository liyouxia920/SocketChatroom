<template>
	<view class="content">
		<view class="title">欢迎进入李酉夏的聊天室</view>
		<view class="head" @click="chooseImg">
			<image :src="'../../static/images/'+ avatarImg +'.jpg'" mode="aspectFill" class="avatar-img"></image>
			<image src="../../static/arrow.png" mode="aspectFit" class="arrow"></image>
		</view>
		<input type="text" class="user" placeholder="请输入您的用户名" v-model="name" placeholder-style="color:#999999;font-size:32rpx;font-weight:normal"/>
		<view class="join" @tap="submit">加入</view>
		<view class="chooseImg" :animation="animationData">	
			<view class="avatar-box">
				<view v-for="(item,index) in img" :key="index" class="image-container" @tap="selected(index)">
					<image :src="'../../static/images/'+item.i+'.jpg'" mode="aspectFit"></image>	
					<view class="dot" :style="{opacity:item.flag}"></view>
				</view>
			</view>
		</view>
		<view class="shadow" @tap="chooseImg" :style="{display:shadow}"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:'',
				avatarImg:'a',
				animationData: {},
				showSelectBox:false,
				shadow:'none',
				img:[
					{i:'a',flag:1},
					{i:'b',flag:0},
					{i:'c',flag:0},
					{i:'d',flag:0},
					{i:'e',flag:0},
					{i:'f',flag:0},
					{i:'g',flag:0},
					{i:'h',flag:0},
					{i:'i',flag:0},
					{i:'j',flag:0},
					{i:'k',flag:0},
					{i:'l',flag:0},
					{i:'m',flag:0},
					{i:'n',flag:0},
					{i:'o',flag:0},
					{i:'p',flag:0},
					{i:'q',flag:0},
					{i:'r',flag:0},
					{i:'s',flag:0},
					{i:'t',flag:0},
				],
			}
		},
		methods: {
			chooseImg(){
				this.showSelectBox= !this.showSelectBox;
				if(this.showSelectBox){
					this.shadow = 'block';
				}else{
					this.shadow = 'none';
				}
				var animation = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease',
				})
				 this.animation = animation
				 if(this.showSelectBox){
				 	animation.bottom(0).step()
				 				 				  
				 }else{
				 	animation.bottom().step()		  
				 }				
				 this.animationData = animation.export()
			},
			selected(index){
				for(let i = 0;i<this.img.length;i++){
					this.img[i].flag = 0;
				}
				this.img[index].flag = 1;
				this.avatarImg = this.img[index].i;
			},
			submit(){
				if(this.name.length>0){
					var mesg = {
						name:this.name,
						img: this.avatarImg,
					}
					uni.navigateTo({
					    url: '../chatroom/chatroom?name='+this.name+'&img='+this.avatarImg,
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 200rpx;
	}

	.title {
		font-size:36rpx;
		font-weight:600;
		color:rgba(85, 170, 255, 1.0);
		line-height:50rpx;
		padding-bottom: 116rpx;
	}
	.head{
		width: 144rpx;
		height: 144rpx;
		position: relative;
		.avatar-img{
			width: 144rpx;
			height: 144rpx;
			border-radius: 50%;
		}
		.arrow{
			position: absolute;
			opacity: 0.6;
			right: -48rpx;
			top: 48rpx;
			width: 48rpx;
			height: 48rpx;
		}
	}
	.user{
		margin-top: 54rpx;
		padding: 0 24rpx;
		width:440rpx;
		height:96rpx;
		background:rgba(242,242,242,1);
		border-radius:24rpx;
		text-align: center;
		font-size: 36rpx;
		font-weight:600;
		color:rgba(25,29,35,1);
	}
	.join{
		margin-top: 180rpx;
		width:200rpx;
		height:200rpx;
		background:rgba(85, 170, 255, 1.0);
		box-shadow:0px 36rpx 68rpx -8rpx rgba(0, 0, 0, 0.4);
		border-radius: 50%;
		font-size:28rpx;
		font-weight:600;
		text-align: center;
		line-height: 200rpx;
		color:rgba(255,255,255,1);
	}
	.chooseImg{
		position: fixed;
		left: 0;
		bottom:-800rpx;
		width: 100%;
		height: 800rpx;
		z-index: 1000;
		background: #fff;
		border-radius:48rpx 48rpx 0px 0px;
	}
	.avatar-box{
		padding: 80rpx 36rpx;
		flex-direction: row;
		display: flex;
		flex-wrap:wrap;
		.image-container{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 20%;
			image{
				width:80rpx;
				height:80rpx;
				border-radius:18rpx;
				margin-bottom: 10rpx;
			}
			.dot{
				display: flex;
				align-items: center;
				justify-content:center;
				margin-bottom: 20rpx;
				width: 16rpx;
				height: 16rpx;
				background:rgba(85, 170, 255, 1.0);
				border-radius: 50%;
			}
		}
	}
	.shadow{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,0.6);
		
	}
</style>

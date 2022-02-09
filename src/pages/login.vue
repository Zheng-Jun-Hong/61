<template>
	<div class="login_page" ref="loginPage">

		<div id="hellowWorld">
			<h2>{{ helloWorld.en }}</h2>
			<p>{{ helloWorld.zh }}</p>
		</div>

        <div id="cursorLight" ref="cursorLight"></div>
		<div class="mnav_logo">
			<a href="/homefunc"><img :src="logo.src" :alt="logo.alt"></a>
		</div>


		<div class="login_form">
			<h1>{{ pageTitle }}</h1>
			
			<el-form 
			ref="loginForm"
			:model="loginForm"
			:rules="loginRule">

				<el-form-item prop="station">
					<el-input 
					type="text" 
					v-model="loginForm.station"
					prefix-icon="el-icon-house"
					placeholder="電站名稱"
					autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item prop="account">
					<el-input 
					type="text" 
					v-model="loginForm.account"
					placeholder="輸入帳號"
					prefix-icon="el-icon-user"
					autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item prop="password">
					<el-input 
					type="password" 
					v-model="loginForm.password"
					prefix-icon="el-icon-lock"
					placeholder="輸入密碼"
					show-password
					autocomplete="off"></el-input>
				</el-form-item>


				<el-form-item>
					<el-button 
					type="primary" 
					@click="loginSubmit()">登入</el-button>
				</el-form-item>
			</el-form>

		</div>


	</div>
</template>

<script>
export default {
	name: 'login',
	data() {
		//客制驗證
		var valiStation = (rule, value, callback)=>{
			/* if( !value ){
				return callback( new Error('電站不能空白') );
			}else{ callback() } */
			callback()
		}
		var valiAccount = (rule, value, callback)=>{
			if( !value ){
				return callback( new Error('帳號不能空白') );
			}else{ callback() }
		}
		var valiPassword = (rule, value, callback)=>{
			if( !value ){
				return callback( new Error('密碼不能空白') );
			}else{ callback() }
		}
		return {
			pageTitle: '太陽能監控管理系統',
			helloWorld:{
				zh: '歡迎',
				en: 'Welcome'
			},
			logo: { src: './imgs/logo.svg', alt: 'test' },
			loginForm: {
				station: '',
				account: '',
				password: '',
			},
			loginRule: {
				station: { validator: valiStation, trigger: 'blur' },
				account: { validator: valiAccount, trigger: 'blur' },
				password: { validator: valiPassword, trigger: 'blur' }
			},
			gotoNext: {url: '/'}
		}
	},
    mounted(){
        this.$globalFunc.followCursor(this.$refs.cursorLight)
    },
	methods: {
		loginSubmit() {
			this.$refs['loginForm'].validate((vali)=>{
				console.log(vali)
				if( vali ){
					let _loginForm = new FormData();
					_loginForm.append("company", this.loginForm.station)
					_loginForm.append("username", this.loginForm.account)
					_loginForm.append("password", this.loginForm.password)
					var that = this
					this.axios.post("/login", _loginForm)
					.then(function (data) {
						console.log('登入成功');
						that.$refs['loginPage'].classList.add('fadeOut')
						setTimeout(()=>{
							// 登入成功跑個動畫再切過去
							that.$router.push( that.gotoNext.url )
						}, 800)
					})
					.catch(function (data) {
						that.$alert('帳密錯誤', '錯誤', {
							confirmButtonText: '確定',
							callback: action => {
								this.$message({
								type: 'info',
								message: `action: ${ action }`
								});
							}
						});
						return false
					});
					
					
				}else{
					console.log('帳密錯誤')
					return false;
				}
			})
		}
	}
}
</script>
<style>
.el-message-box__btns > button.el-button--small{
	padding: 12px 22px;
}
</style>


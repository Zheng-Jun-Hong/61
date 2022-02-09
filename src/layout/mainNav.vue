<template>
<div id="mainNav" :class="{close: navopen}">
	<div class="mnav_logo">
		<h1>
			<router-link :to="logo.link">
				<img :src="logo.src" :alt="logo.alt">
			</router-link>
		</h1>
	</div>
	<div class="mnav_wrap">
		<div class="mnav_top">
			<div v-for="(nava, index) in nav_top" :key="index">
				<router-link :to="nava.link">
					<i :class="'icon-' + nava.icon"></i>
					<span>{{ nava.name }}</span>
                </router-link>
			</div>
		</div>
		<div class="mnav_mid">
			<div v-for="(nava, index) in nav_mid" :key="index">
				<router-link :to="nava.link">
					<i :class="'icon-' + nava.icon"></i>
					<span>{{ nava.name }}</span>
					<b v-if="nava.alertNumb">{{ nava.alertNumb }}</b>
                </router-link>
			</div>
		</div>
		<div class="mnav_btm">
			<div v-for="(nava, index) in nav_btm" :key="index">
				<router-link :to="nava.link">
					<i :class="'icon-' + nava.icon"></i>
					<span>{{ nava.name }}</span>
                </router-link>
			</div>
		</div>
	</div>
	<div id="mnavOpen" @click="toggleNav">
		<div>收起<i class="el-icon-back"></i></div>
		<div>展開<i class="el-icon-right"></i></div>
	</div>
</div>
</template>

<script>

export default {
	name: 'mainNav',
	data() {
		return {
			navopen: false,
			logo: { src: './imgs/logo.svg', alt: 'test', link: '/homeFunc' },
			nav_top: [
				
				/* { name: '展示頁', link: '/show', icon: 'nav_show' } */
			],
			nav_mid: [
				{ name: '功能首頁', link: '/homefunc', icon: 'nav_home' },
				{ name: '電站管理', link: '/stationlist', icon: 'nav_factory' },
				{ name: '電站圖面', link: '/stationGraphic', icon: 'nav_list' },
				{ name: '警報', link: '/alertOverview', icon: 'nav_alert', alertNumb: undefined },
				/* { name: '圖表', link: '/chartOverview', icon: 'nav_chart' }, */
				{ name: '報表', link: '/reportOverview', icon: 'nav_docs' },
				/* { name: '派工', link: '/dispatch', icon: 'nav_works' }, */
				{ name: '設定', link: '/setting', icon: 'nav_setting' }
			],
			nav_btm: [
				{ name: '登出', link: '/logout', icon: 'nav_log' }
			]
		}
	},
	watch: {
		$route(to, from){
			document.body.classList.remove('lock');
			// console.log(to, from)
		}
	},
	mounted(){
		let that = this
		if( localStorage.getItem('ysolar_nav_close') == 'yes' ){
			this.navopen = true;
		}else{
			this.navopen = false;
		}
		this.alarm_total_count()
		this.sync_alarm_count = setInterval(function(){
			that.alarm_total_count()
		}, 5000)
	},
	methods: {
		toggleNav(){
			this.navopen = !this.navopen;
			if( this.navopen ){
				localStorage.setItem('ysolar_nav_close', 'yes')
			}else{
				localStorage.setItem('ysolar_nav_close', 'no')
			}
			window.cusVueFunc.taiwanResize()
		},
		alarm_total_count(){
			let that = this
			this.axios.get("/alarm_total_count").then(function(data){
				that.nav_mid[3].alertNumb = data.data.data
			})
		},
	},
	destroyed(){
		clearInterval(this.sync_alarm_count)
	}
}
</script>



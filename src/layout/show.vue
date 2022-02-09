<template>
	<div class="home_page show">
		<div id="maploader"></div>
		<div class="show_logo">
			<img :src="logo.src" :alt="logo.alt">
		</div>
		<div id="clock">
			<div ref="clockRun"></div>
			<div>{{curr_date[0]}},{{curr_date[1]}}月{{curr_date[2]}}日</div>
		</div>
		<taiwan3D :get3d-points="cityStations" v-if="cityStations.length != 0" @tw3d-finish="tw3dFinish" />
		<totalCount :ttl-data="ttlData" />
		<stationChange :city-stations="cityStations" v-if="cityStations.length != 0" />
		<div class="show_login">
			<el-button type="primary">
				<router-link :to="ctaButton.url">
					{{ ctaButton.text }}
                </router-link>
			</el-button>
		</div>
	</div>
</template>

<script>
import totalCount from '../components/map/totalCount.vue'
import stationChange from '../components/map/stationChange.vue'
import taiwan3D from '../components/map/taiwan3D.vue'
export default {
	name: 'HomeFunc',
	components: { totalCount, stationChange, taiwan3D },
	data() {
		return {
			ctaButton: {
				text: '返回功能首頁',
				url: '/homefunc'
			},
			logo: { src: './imgs/logo.svg', alt: 'test' },
			ttlData: [
				{ title: '全國總電站數', numb: '---', icon: 'ttl_sunboard', unit: '座'},
				{ title: '全國總建置容量', numb: '---', icon: 'ttl_drive', unit: 'MW'},
				{ title: '全國總累計發電量', numb: '---', icon: 'ttl_thunder', unit: 'MWh'},
				{ title: '全國總累計減碳量', numb: '---', icon: 'ttl_leaf', unit: 'kg'},
				{ title: '累計躉售', numb: '---', icon: 'ttl_money', unit: '元'}
			],
			cityStations: [
				/* {
					idfor3Dpoint: {
						camPosition: {
							x: -1.8069327949075777, y: 1.3218037618160248, z: 6.067617947954192},
						position: {
							x: -1.0254632113962252,y:  0.32180376181602477,z: -0.19280618916128667},
						parent: "city_pingtung"
					},
					name: '天權',
					link: {
						title: '查看案場',
						url: '/',
					},
					weather: {
						imgurl: './imgs/weather_test2.svg',
						temperature: '30',
						status: '晴天',
						rain: '降雨機率10%'
					},
					ttlPower: {
						title: '總累計發電量',
						numb: '8,645',
						unit: 'kWh'
					},
					todayPower: {
						title: '今日發電量',
						numb: '3445',
						unit: 'kWh'
					},
					otherInfos: [
						{ title: '總電站數', numb: '10', unit: '座' },
						{ title: '等效日照小時', numb: '4', unit: 'h' },
						{ title: '今日發電量', numb: '234', unit: 'kWh' },
						{ title: '今日減排量', numb: '151', unit: 'kg' },
						{ title: '累計減排量', numb: '35468746541', unit: 'kg' },
					]
				},
				{
					idfor3Dpoint: {
						camPosition: {
							x: -1.8069327949075777, y: 1.3218037618160248, z: 6.067617947954192},
						position: {
							x: -1.0254632113962252,y:  0.32180376181602477,z: -0.19280618916128667},
						parent: "city_pingtung"
					},
					name: '玉衡',
					link: {
						title: '查看案場',
						url: '/',
					},
					weather: {
						imgurl: './imgs/weather_test2.svg',
						temperature: '30',
						status: '晴天',
						rain: '降雨機率10%'
					},
					ttlPower: {
						title: '總累計發電量',
						numb: '8,645',
						unit: 'kWh'
					},
					todayPower: {
						title: '今日發電量',
						numb: '3445',
						unit: 'kWh'
					},
					otherInfos: [
						{ title: '總電站數', numb: '10', unit: '座' },
						{ title: '等效日照小時', numb: '4', unit: 'h' },
						{ title: '今日發電量', numb: '234', unit: 'kWh' },
						{ title: '今日減排量', numb: '151', unit: 'kg' },
						{ title: '累計減排量', numb: '35468746541', unit: 'kg' },
					]
				},
				{
					idfor3Dpoint: {
						camPosition: {
							x: -1.8069327949075777, y: 1.3218037618160248, z: 6.067617947954192},
						position: {
							x: -1.0254632113962252,y:  0.32180376181602477,z: -0.19280618916128667},
						parent: "city_pingtung"
					},
					name: '開陽',
					link: {
						title: '查看案場',
						url: '/',
					},
					weather: {
						imgurl: './imgs/weather_test2.svg',
						temperature: '30',
						status: '晴天',
						rain: '降雨機率10%'
					},
					ttlPower: {
						title: '總累計發電量',
						numb: '8,645',
						unit: 'kWh'
					},
					todayPower: {
						title: '今日發電量',
						numb: '3445',
						unit: 'kWh'
					},
					otherInfos: [
						{ title: '總電站數', numb: '10', unit: '座' },
						{ title: '等效日照小時', numb: '4', unit: 'h' },
						{ title: '今日發電量', numb: '234', unit: 'kWh' },
						{ title: '今日減排量', numb: '151', unit: 'kg' },
						{ title: '累計減排量', numb: '35468746541', unit: 'kg' },
					]
				} */
			],
			curr_date: [2021, 1, 1]
		}
	},
	mounted() {
		this.clockRun();
		this.tawian3d_plant_overview()
		let that = this
        this.stats_all_pv()
        this.syncdata = setInterval(function(){
			that.stats_all_pv()
			that.tawian3d_plant_overview()
		}, 1000)
	},
	destroyed(){
		clearInterval(this.syncdata)
	},
	methods: {
		tw3dFinish(){
			//等待taiwan3D mount 好
			//因為request要時間，所以taiwan3D不能馬上載入
			//等初次request下來，tawian3D才載入
			//這邊把 播放自選案紐關掉的
			document.querySelector('.tw_switch').style.display = 'none'
		},
		clockRun(){
			var date = new Date();
			var h = date.getHours(); // 0 - 23
			var m = date.getMinutes(); // 0 - 59
			var s = date.getSeconds(); // 0 - 59
			if(h == 0){
				h = 12;
			}
			h = (h < 10) ? "0" + h : h;
			m = (m < 10) ? "0" + m : m;
			s = (s < 10) ? "0" + s : s;
			
			var time = h + ":" + m + ":" + s + " ";
			this.$refs['clockRun'].innerText = time;
			this.$refs['clockRun'].textContent = time;
			const offset = date.getTimezoneOffset()
			date = new Date(date.getTime() - (offset*60*1000))
			this.curr_date = date.toISOString().split('T')[0].split('-')
			this.curr_date.forEach((i, cursor) => {
				this.curr_date[cursor] = parseInt(i)
			})
			setTimeout(this.clockRun, 1000);
		},
		stats_all_pv(){
			let that = this
			this.axios.get('/stats_all_pv').then(function(data){
				const stats_data = data.data.data
				that.ttlData[0].numb = stats_data['total_station']
				that.ttlData[1].numb = stats_data['total_capacity']
				that.ttlData[2].numb = stats_data['total_kwh']
				that.ttlData[3].numb = stats_data['total_carbon_reduction']
				that.ttlData[4].numb = stats_data['profit']
			})
		},
		tawian3d_plant_overview(){
			let that = this
			this.axios.get('/tawian3d_plant_overview').then(function(data){
				//console.log(data.data.data)
				that.cityStations = data.data.data
			})
		}
	}
}
</script>



<template>
	<div class="home_page">
		<div id="maploader"></div>
		<div id="clock">
			<div ref="clockRun"></div>
			<div>{{curr_date[0]}},{{curr_date[1]}}月{{curr_date[2]}}日</div>
		</div>
		<taiwan3D :get3d-points="cityStations" v-if="cityStations.length != 0" @tw3d-finish="tw3dFinish" />
		<totalCount :ttl-data="ttlData" />
		<stationChange :city-stations="cityStations" v-if="cityStations.length != 0" />
		<stationPop ref="stationPop" />
	</div>
</template>

<script>
import totalCount from '../components/map/totalCount.vue'
import stationChange from '../components/map/stationChange.vue'
import taiwan3D from '../components/map/taiwan3D.vue'
import stationPop from '../components/station/stationPop.vue'

export default {
	name: 'HomeFunc',	
	components: { 
		totalCount, 
		stationChange, 
		taiwan3D, 
		stationPop 
	},
	data() {
		return {
			ttlData: [
				{ title: '全國總電站數', numb: '---', icon: 'ttl_sunboard', unit: '座'},
				{ title: '全國總建置容量', numb: '---', icon: 'ttl_drive', unit: 'MW'},
				{ title: '全國總累計發電量', numb: '---', icon: 'ttl_thunder', unit: 'MWh'},
				{ title: '全國總累計減碳量', numb: '---', icon: 'ttl_leaf', unit: 'kg'},
				{ title: '累計躉售', numb: '---', icon: 'ttl_money', unit: '元'}
			],
			cityStations: [],
			curr_date: [2021, 1, 1]
		}
	},
	mounted() {
		this.clockRun();
		let that = this
        this.stats_all_pv()
        this.syncdata = setInterval(function(){
			that.tawian3d_plant_overview()
			that.stats_all_pv()
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
		openStation(){
			this.$refs.stationPop.$el.style.display = 'block';			
			document.body.classList.add('lock');
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



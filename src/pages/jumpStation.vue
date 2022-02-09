<template>
	<div class="page_wrap">
		<h2>{{ pageTitle }}</h2>
		<div class="page_content">

			<div class="pagetop_info">
				<div class="ptop_btns">
					<el-popover placement="bottom-start" trigger="click">
						<el-button size="medium" slot="reference" class="esicon_btn">
							<i class="icon-nav_factory"></i>選擇電站</el-button>
						<selectStation v-model="plant_select" />
					</el-popover>

					<el-button-group>

						<el-button icon="el-icon-menu" 
						:class="{active: showcard}" 
						@click="switchDisplay"></el-button>

						<el-button icon="el-icon-s-unfold" 
						:class="{active: showtable}" 
						@click="switchDisplay"></el-button>

					</el-button-group>
				</div>

				<div class="ptop_datas">
					<div v-for="(data, idx) in ttlData" :key="idx" class="ptop_data">
						<h2>{{ data.title }}</h2>
						<span>{{ data.numb }}</span>
						<div class="ttlc_icon">
							<i :class="'icon-' + data.icon"></i>
						</div>
						<div class="ttlc_unit">
							{{ data.unit }}
						</div>
					</div>
				</div>
			</div>

			<stationCardList 
			:class="{active: showcard}" 
			:station-data="stationList" 
			@open-station="openStation" />
			<stationTableList
			:class="{active: showtable}"
			:station-data="stationList" 
			@open-station="openStation" />


			<div class="pagination_wrap">
				<el-pagination
				background
				layout="prev, pager, next"
				:total="plant_select['ID_list'].length"
				:current-page.sync="current_page"
				@current-change="get_card_overview()">
				</el-pagination>
			</div>
			
		</div>

		<stationPop ref="stationPop" />

	</div>
</template>

<script>
import selectStation from '../components/station/selectStation.vue'
import stationCardList from '../components/station/listCard.vue'
import stationPop from '../components/station/stationPop.vue'
import stationTableList from '../components/station/listTable.vue'


export default {
	name: 'jumpStation',
	components:{		
		selectStation, 
		stationCardList, 
		stationPop, 
		stationTableList
	},
	data() {
		return{
			showcard: true,
			showtable: false,
			plant_select: {'ID_list': [], 'col_list': []},
			pageTitle: '電站管理',
			ttlData: [
				{ title: '全國總電站數', numb: '---', icon: 'ttl_sunboard', unit: '座'},
				{ title: '全國總建置容量', numb: '---', icon: 'ttl_drive', unit: 'MW'},
				{ title: '全國累計發電量', numb: '---', icon: 'ttl_thunder', unit: 'kWh'},
				{ title: '全國總累計碳排量', numb: '---', icon: 'ttl_leaf', unit: 'kg'},
				{ title: '累計躉售', numb: '---', icon: 'ttl_money', unit: '元'}
			],
			stationList:[
				/* {
					status:{ work: false, communi: true, no_alert: false, alertCount: '3' },
					name: 'TP_DEMO_01', pr: '60', kwp: '243.6 kWp',
					power: '4.1', sun: '5', profit: '4059', lastTime: '13:45', url: '/',
					imgsrc: './imgs/teststation.jpg'
				} */
			],
			current_page: 0
		}
	},
	methods: {
		switchDisplay(){
			if( this.showcard == true ){
				this.showcard = false
				this.showtable = true
			}else{
				this.showcard = true
				this.showtable = false
			}
		},
		openStation(data){
			this.$refs.stationPop.$el.style.display = 'block';
			this.$refs.stationPop.stationData = data		
			document.body.classList.add('lock')
		},
		stats_all_pv(page_init=false){
			let that = this
			this.axios.get('/stats_all_pv').then(function(data){
				const stats_data = data.data.data
				that.ttlData[0].numb = stats_data['total_station']
				that.ttlData[1].numb = stats_data['total_capacity']
				that.ttlData[2].numb = stats_data['total_kwh']
				that.ttlData[3].numb = stats_data['total_carbon_reduction']
				that.ttlData[4].numb = stats_data['profit']
				if(page_init){
					that.plant_select['ID_list'] = stats_data['ID_list']
					that.plant_select['col_list'] = new Array(stats_data['ID_list'].length).fill('pv_plant')
					that.get_card_overview()
				}
			})
		},
		async get_card_overview(){
			let that = this
			//假如 request過慢 要求的案場資料 不等於使用者現在選的
			//拋棄request結果
			let old_ID_list = this.plant_select['ID_list']
			await this.axios.post('/get_card_overview',{  // Send ID only in pagination range
				ID_list: this.plant_select['ID_list'].slice((this.current_page-1)*10, this.current_page*10), 
				col_list: this.plant_select['col_list'].slice((this.current_page-1)*10, this.current_page*10)
			}).then(function(data){
				if(old_ID_list != that.plant_select['ID_list']){
					//假如 request過慢 要求的案場資料 不等於使用者現在選的
					//拋棄request結果
					console.log('Expire loading data!')
					return false
				}
				let station_data = data.data.data
				that.stationList = []
				for(var i in station_data){
					let d = station_data[i]
					that.stationList.push({
						status:{ work: d['work'], communi: d['communi'], no_alert: d['no_alert'], alertCount: d['alert_count'] },
						name: d['name'], pr: d['pr'], kwp: d['capacity']+' kW',
						power: d['dmy'], sun: d['irrh'], profit: d['profit'], lastTime: d['lastTime'], url: '/',
						imgsrc: './imgs/teststation.jpg', type: d['type'], ID: d['ID'], collection: d['collection']
					})
				}
			})
		},
	},
	mounted(){
		let that = this
		//URL 跳轉參數
		let query = this.$router.history.current.query
		if(query.name !== undefined && query.name !== null && query.name !== ""){
			this.axios.post('/jump_station_get_data', {
				name: query.name
			}).then(function(data){
				console.log(data.data.data)
				that.openStation(data.data.data)
			})
		}
        this.stats_all_pv(true)
        this.syncdata = setInterval(function(){
			that.stats_all_pv()
			that.get_card_overview()
		}, 1000)
	},
	watch:{
		plant_select: async function(data){
			this.current_page = 1
			await this.get_card_overview()
		},
	},
	destroyed(){
		clearInterval(this.syncdata)
	}
}
</script>



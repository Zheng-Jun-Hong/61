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
					<span>
						<el-autocomplete
							v-model="plant_search"
							:fetch-suggestions="querySearchAsync"
							placeholder="搜尋"
							value-key="name"
							@select="handleSelect"
						></el-autocomplete>
					</span>

					<span>
						<el-button-group>

							<el-button icon="el-icon-menu" 
							:class="{active: showcard}" 
							@click="switchDisplay"></el-button>

							<el-button icon="el-icon-s-unfold" 
							:class="{active: showtable}" 
							@click="switchDisplay"></el-button>

						</el-button-group>
					</span>

					<span>
						<el-popover
							placement="bottom"
							width="200"
							trigger="click">
								<div class="favo_select">
									<ul>
										<li
										v-for="(item) in favoriteData"
										:key="item.name">
											<span
											:class="{ active: myfavoriteSelect == item.name }"
											@click="selectFavorite(item)"
											>
												{{ item.name }}
											</span>
											<span 
											@click="editFavorite(item)"
											class="select_cancel">
												<i class="el-icon-s-tools"></i>
											</span>
										</li>
									</ul>
									<el-row type="flex" class="row-bg" justify="center">
										<el-col :span="6">
											<el-button class="favo_select_btn" size="small" @click="favoriteModal=true">
												<i class="el-icon-plus"></i>
											</el-button>
										</el-col>
									</el-row>
								</div>
								<el-button 
								class="favo_select_btn" 
								slot="reference">
									<i class="el-icon-star-off"></i> {{myfavoriteSelect}}
								</el-button>
						</el-popover>
					</span>
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
			@dblclick-jump="dblclick_jump"
			@open-station="openStation" />
			<stationTableList
			:class="{active: showtable}"
			:station-data="stationList" 
			@dblclick-jump="dblclick_jump"
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

		<!-- 我的最愛編輯視窗 -->
		<el-dialog class="stationFavoriteModal" :visible.sync="favoriteModal">
			<span slot="title">
				<el-input
					type="text"
					placeholder="我的最愛名稱"
					v-model="favoriteName"
					maxlength="20"
					show-word-limit
					autofocus
					class="favoriteName"
				></el-input>
				<label style="color: #F56C6C; padding-left: 24px;" v-if="favoriteName == '' || favoriteName == null">請輸入名稱!</label>
			</span>
			<el-autocomplete
				v-model="favorite_plant_search"
				:fetch-suggestions="querySearchAsync"
				placeholder="搜尋"
				value-key="name"
				@select="handleSelect_favorite"
			></el-autocomplete>
			<el-table
				class="stationFavoriteTable"
				max-height="270"
				style="width: 100%; margin-top: 15px;"
				empty-text="無資料，請使用搜尋來選擇電站"
				:row-class-name="favoriteTableColor"
				:data="favoriteStationData"
			>
				<el-table-column
				prop="name"
				label="已選取清單">
				</el-table-column>
				<el-table-column width="100">
					<template slot-scope="scope">
						<el-button type="small" @click="delete_favorite_station(scope.$index)">
							<i class="el-icon-circle-close"></i>
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-divider></el-divider>
			<el-button type="primary" @click="save_favorite">
				儲存
			</el-button>
			<el-button type="danger" @click="delete_favorite">
				刪除
			</el-button>
		</el-dialog>

	</div>
</template>

<script>
import selectStation from '../components/station/selectStation.vue'
import stationCardList from '../components/station/listCard.vue'
import stationPop from '../components/station/stationPop.vue'
import stationTableList from '../components/station/listTable.vue'


export default {
	name: 'stationList',
	components:{		
		selectStation, 
		stationCardList, 
		stationPop, 
		stationTableList
	},
	data() {
		return{
			plant_search: "",
			showcard: true,
			showtable: false,
			plant_select: {'ID_list': [], 'col_list': []},
			pageTitle: '電站管理',
			ttlData: [
				{ title: '全國總電站數', numb: '---', icon: 'ttl_sunboard', unit: '座'},
				{ title: '全國總建置容量', numb: '---', icon: 'ttl_drive', unit: 'MW'},
				{ title: '全國累計發電量', numb: '---', icon: 'ttl_thunder', unit: 'MWh'},
				{ title: '全國總累計減碳量', numb: '---', icon: 'ttl_leaf', unit: 'kg'},
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
			PV_data: [

			],
			current_page: 0,
			// 我的最愛區
			favoriteData: [],
			myfavoriteSelect: "我的最愛",
			favoriteModal: false,
			favoriteStationData: [],
			favorite_plant_search: "",
			favoriteName: "",
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
				that.PV_data = stats_data['PV_data']
				if(page_init){
					that.plant_select['ID_list'] = stats_data['ID_list']
					that.plant_select['col_list'] = new Array(stats_data['ID_list'].length).fill('pv_plant')
					that.get_card_overview()
					page_init = false
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
						imgsrc: d['imgsrc'], type: d['type'], ID: d['ID'], collection: d['collection'],
						carbon_reduction: d['carbon_reduction'],
						PV: d['PV'], lgroup: d['lgroup']
					})
				}
			})
		},
		dblclick_jump(data){
			//alert(`${data.ID} ${data.type}`)
			let that = this
			if(data.type == 'pv_group')
				return false
			this.axios.post('/station_search_ID', {
				name: null,
				ID: data.ID,
				type: data.type
			}).then((data)=>{
				that.plant_select = {ID_list: data.data.data.ID_list, col_list: data.data.data.col_list}
			})
		},
		async querySearchAsync(queryString, cb) {
			//console.log(queryString)
			//console.log(this.PV_data)
			if(queryString == undefined || queryString == null || queryString == ""){
				this.search_empty_wait_PV_data(cb)
				return false
			}
			else{
				await this.axios.post('/station_search_regex', {
					query: queryString
				}).then(data => {
					//console.log(data.data.data)
					if(data.data.data.length == 0){
						cb([{'name': '無資料'}])
					}else{
						cb(data.data.data)
					}
				})
			}
		},
		search_empty_wait_PV_data(cb){
			if(this.PV_data.length == 0){
				this.searchTimeout = setTimeout(() => {
					this.search_empty_wait_PV_data
				}, 500 * Math.random());
			}else{
				clearTimeout(this.searchTimeout)
				cb(this.PV_data)
			}
		},
		handleSelect(item) {
			//console.log(item)
			if(item.name == '無資料'){
				return false
			}

			if(item.collection == 'pv_plant' || item.collection == 'pv_lgroup'){
				this.dblclick_jump({
					ID: item.ID, type: item.collection
				})
			}
			else if(item.collection == 'pv_group'){
				this.plant_select.ID_list = [item.ID]
				this.plant_select.col_list = [item.collection]
			}
		},
		//我的最愛程式區
		handleSelect_favorite(item){
			if(item.name == '無資料'){
				return false
			}
			this.favoriteStationData.push(item)
		},
		favoriteTableColor({row, rowIndex}) {
			switch(row.collection){
				case "pv_plant":
					return "PV_header_style"
				case "pv_lgroup":
					return "lgroup_header_style"
				case "pv_group":
					return "group_header_style"
				default:
					return ""
			}
		},
		delete_favorite_station(scope){
			this.favoriteStationData.splice(scope, 1)
		},
		save_favorite(){
			let that = this
			if(this.favoriteName == "" || this.favoriteName == null){
				return false
			}
			console.log(this.favoriteName)
			console.log(this.favoriteStationData)
			this.axios.post("/station_favorite", {
				name: this.favoriteName,
				data: this.favoriteStationData
			}).then(data => {
				//console.log(data.data.data)
				that.favoriteModal = false
				that.get_favorite(that.favoriteName)
				that.favoriteName = ""
				that.favoriteStationData = []
				that.favorite_plant_search = ""
				that.$message({
					message: '儲存成功',
					type: 'success'
				})
			})
		},
		delete_favorite(){
			if(this.favoriteName == "" || this.favoriteName == null){
				return false
			}
			let that = this
			this.axios.delete("/station_favorite", {
				data: {name: this.favoriteName}
			}).then(data => {
				that.favoriteModal = false
				that.favoriteName = ""
				that.favoriteStationData = []
				that.favorite_plant_search = ""
				this.myfavoriteSelect = "我的最愛"
				this.get_favorite()
				that.$message({
					message: '已刪除',
					type: 'success'
				})
			})
		},
		editFavorite(data){
			this.favoriteName = data.name
			this.favoriteStationData = data.data
			this.favoriteModal = true
		},
		selectFavorite(data){
			this.myfavoriteSelect = data.name
			this.plant_select.ID_list = []
			this.plant_select.col_list = []
			for(var i in data.data){
				this.plant_select.ID_list.push(data.data[i].ID)
				this.plant_select.col_list.push(data.data[i].collection)
			}
		},
		get_favorite(select=null){
			let that = this
			//取得我的最愛群組
			this.axios.get("/station_favorite").then(data => {
				that.favoriteData = data.data.data.favorite_list
				if(select !== null){
					for(var i in that.favoriteData){
						if(select == that.favoriteData[i].name)
							that.selectFavorite(that.favoriteData[i])
					}
				}
				// 預設顯示案場
				if(data.data.data.default_favorite != null){
					that.plant_select.ID_list = []
					that.plant_select.col_list = []
					data.data.data.default_favorite.data.forEach(d=>{
						that.plant_select.ID_list.push(d.ID)
						that.plant_select.col_list.push(d.collection)
					})
					that.stats_all_pv()
					that.get_card_overview()
				}else{
					that.stats_all_pv(true)
				}
			})	
		},
	},
	mounted(){
		let that = this
		this.get_favorite()
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

<style>
	.stationFavoriteTable .el-button{
		border: 0px !important;
	}
	.stationFavoriteModal .el-dialog__header{
		padding-top: 10px;
		padding-left: 0px;
	}
	.stationFavoriteModal .el-dialog__body{
		padding-top: 0px !important;
	}
	.favoriteName .el-input__inner{
		border: 0px;
		padding-bottom: 0px;
	}
</style>

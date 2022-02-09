<template>
	<div class="stations_display">
	<div class="station_table">
		<el-table
		empty-text="無資料"
		:data="stationData">

			<el-table-column 
			prop="name" 
			label="電站名稱" 
			width="150"
			sortable
			:sort-method="testCusSort"> <!-- 自定義搜尋 -->
				<template slot-scope="scope">
					<div style="text-align: left !important;" @dblclick="header_dblclick(scope.row.ID, scope.row.collection)">
						<i :class="{'icon-nav_factory':scope.row.type=='PV',
						'icon-ttl_sunboard':scope.row.type=='pv_lgroup'}"></i>
						<label :class="{'fw-bold': scope.row.type=='PV', 'ml-30px': scope.row.type=='pv_group'}">{{scope.row.name}}</label>
					</div>
				</template>
			</el-table-column>

			<el-table-column prop="pr" label="PR" width="65" sortable></el-table-column>
			<el-table-column prop="kwp" label="電站容量kWp" width="140" sortable></el-table-column>

			<el-table-column label="運轉狀態" sortable width="110">
				<template slot-scope="scope"><i :class="statusIcon(scope.row.status.work)"></i></template>
			</el-table-column>
			<el-table-column label="通訊狀態" sortable width="110">
				<template slot-scope="scope"><i :class="statusIcon(scope.row.status.communi)"></i></template>
			</el-table-column>
			<el-table-column label="警報" sortable width="110">
				<template slot-scope="scope"><i :class="statusIcon(scope.row.status.no_alert)"></i></template>
			</el-table-column>

			<el-table-column label="發電量kWh/kWp" sortable width="160">
				<template slot-scope="scope">{{scope.row.power}}<sub>kWh/kWp</sub></template>
			</el-table-column>

			<el-table-column label="等效日照h" sortable width="110">
				<template slot-scope="scope">{{scope.row.sun}}<sub>h</sub></template>
			</el-table-column>

			<el-table-column label="累計減碳量kg" sortable width="140">
				<template slot-scope="scope">{{scope.row.carbon_reduction}}<sub>Kg</sub></template>
			</el-table-column>

			<el-table-column label="收益TWD" sortable width="140">
				<template slot-scope="scope">{{scope.row.profit}}<sub>TWD</sub></template>
			</el-table-column>
			
			<el-table-column prop="lastTime" label="最後通訊時間" sortable width="140"></el-table-column>

			<el-table-column fixed="right" min-width="140">
				<template slot-scope="scope">
					<el-button @click="emit_openStation(scope.row)" type="small" style="float: right;">查看案場</el-button>
				</template>
			</el-table-column>

		</el-table>
	</div>
	</div>
</template>

<script>
export default {
	name: 'stationTableList',
	props: {
		stationData: Array
	},
	methods:{
		statusIcon(val){
			if( val == true ){
				return 'el-icon-success'
			}else{
				return 'el-icon-warning'
			}
		},
		testCusSort(){
			console.log('自定義搜尋')
		},
		emit_openStation(data){
			this.$emit('open-station', data)
		},
		header_dblclick(ID, type){
			this.$emit("dblclick-jump", {ID: ID, type: type})
		}
	}
}
</script>
<style>
.el-table__header tr{
	background-attachment: fixed !important;
}
i.icon-nav_factory{
	font-size: 1.8rem;
}
.fw-bold{
	font-weight: bold !important;;
}
.ml-30px{
	margin-left: 30px !important;
}
</style>
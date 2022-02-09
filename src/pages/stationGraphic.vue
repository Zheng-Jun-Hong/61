<template>
	<div class="page_wrap page_staflat">
		<h2>{{ pageTitle }}</h2>
		<div class="page_content">
			<el-tabs type="card" v-model="activeName">
				<el-tab-pane label="單線圖" name="staGraSingle">
					<stationGraTabSld :page-type="'single'" v-if="activeName=='staGraSingle'" />
				</el-tab-pane>
				<el-tab-pane label="平面圖" name="staGraFlat">
					<stationGraTabSld :page-type="'flat'"  v-if="activeName=='staGraFlat'" />
				</el-tab-pane>
				<el-tab-pane label="紅外線空拍" name="staGraInfrared">
					<stationGraTabInfrared />
				</el-tab-pane>
				<el-tab-pane label="串電流熱圖" name="stationGraTabHeatmap">
					<stationGraTabHeatmap />
				</el-tab-pane>
			</el-tabs>
		</div>
		

	</div>
</template>
<script>
import stationGraTabSld from '../components/stationGraphic/stationGraTabSld.vue'
//import stationGraTabFlat from '../components/stationGraphic/stationGraTabFlat.vue'
import stationGraTabInfrared from '../components/stationGraphic/stationGraTabInfrared.vue'
import stationGraTabHeatmap from '../components/stationGraphic/stationGraHeatmap.vue'

export default {
	name: 'stationGraphic',
	components:{		
		stationGraTabSld, stationGraTabInfrared, stationGraTabHeatmap
	},
	data(){
		return{
			pageTitle: '電站圖面',
			activeName: 'staGraSingle',
		}
	},
	methods: {
		
	},
	mounted(){
        let that = this
        let query = this.$router.history.current.query
		//若url有參數 則判斷type (單平面圖會是svg)
        if(query.type !== undefined && query.type=='svg'){
			// 再判斷其是單線or平面 (有沒有layout)
			if(query.svg !== undefined && query.svg.slice(-6) == 'Layout'){
				that.activeName = 'staGraFlat'   //平面
			}else{
				that.activeName = 'staGraSingle' //單線
			}
        }
	}
}
</script>

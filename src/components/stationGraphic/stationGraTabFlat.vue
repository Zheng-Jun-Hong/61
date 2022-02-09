<template>
	<div>
		<div class="grafla_titles">
			<div>
				<el-popover placement="bottom-start" trigger="click">
					<el-button size="medium" slot="reference" class="esicon_btn">
						<i class="icon-nav_factory"></i>選擇電站</el-button>
					<selectStation/>
				</el-popover>
			</div>
			<div>
				<h2>{{numberTitle}}</h2>
			</div>
			<div class="grafla_msg">
				<div>{{alertText}}</div>
			</div>
		</div>
		<div class="stbigimg_title"><div></div>
			<div class="st_status_ball">
				<div
				v-for="(item, idx) in statusBall"
				:key="idx">
					<i :style="{background: item.color}"></i>
					{{ item.name }}
				</div>
			</div>
		</div>
		<div class="stbigimg">
		</div>
	</div>
</template>
<script>
import selectStation from '../station/selectStation.vue'
export default {
	name: 'stationGraTabFlat',
	components:{		
		selectStation, 
	},
	data(){
		return{
			numberTitle: 'No.1234',
			alertText: '無警報訊息',
			statusBall: [
				{ name: "正常", color: "#13AD74" },
				{ name: "一級警報", color: "#FFC557" },
				{ name: "二級警報", color: "#FF4671" },
				{ name: "斷線", color: "#9CA3AC" },
			],
		}
	},
	methods: {
		
	}
}
</script>

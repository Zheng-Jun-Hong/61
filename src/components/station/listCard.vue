<template>
	<div class="stations_display">
		<transition-group name="fade" class="station_list_wrap">
			<div 
			class="station_cards"
			v-for="(station, idx) in stationData" :key="idx">
				<h3 @dblclick="header_dblclick(station.ID,station.collection)" :class="{'PV_header_style': station.type == 'PV', 
				'lgroup_header_style': station.type == 'pv_lgroup'}">{{ station.name }} <b>{{ station.kwp }}</b></h3>
				<div class="sta_content">
					<div class="sta_info">
						<div class="stai_row">
							<i :class="statusIcon(station.status.work)"></i>運轉狀態
						</div>
						<div class="stai_row">
							<i :class="statusIcon(station.status.communi)"></i>通訊狀態
						</div>
						<div class="stai_row">
							<i :class="statusIcon(station.status.no_alert)"></i>警報
							<span>{{ station.status.alertCount }}</span>
						</div>
						<div class="stai_row">
							<i class="icon-sta_lighting"></i>發電量
							<span>{{ station.power }} <sub>kWh/kWp</sub></span>
						</div>
						<div class="stai_row">
							<i class="icon-sta_sun"></i>等效日照
							<span>{{ station.sun }} <sub>h</sub></span>
						</div>
						<div class="stai_row">
							<i class="icon-ttl_leaf"></i>累計減碳量
							<span>{{ station.carbon_reduction }} <sub>Kg</sub></span>
						</div>
						<div class="stai_row">
							<i class="icon-sta_money"></i>收益
							<span>{{ station.profit }} <sub>TWD</sub></span>
						</div>
						<div class="stai_row" v-if="station.type != 'PV'">
							<i class="icon-sta_time"></i>最後通訊時間
							<span>{{ station.lastTime }}</span>
						</div>
					</div>
					<div class="sta_chart">
						<div class="sta_circle" ref="staCircle" :data-per="station.pr">
							<div class="stacir_img">
								<figure :style="{ 'background-image': 'url(' + station.imgsrc + ')' }"></figure>
								<span><b>PR</b>{{ station.pr }}%</span>
							</div>
							<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 493.2 493.3" style="enable-background: new 0 0 493.2 493.3;" xml:space="preserve">
								<path d="M246.6,10c130.7,0,236.6,105.9,236.6,236.6S377.3,483.3,246.6,483.3S10,377.3,10,246.6S115.9,10,246.6,10" />
							</svg>
						</div>
						<el-button 
						type="medium" @click="emit_openStation(station)"
						>查看案場</el-button>
					</div>
				</div>
			</div>
		</transition-group>
	</div>
</template>

<script>
export default {
	name: 'stationCardList',
	props: {
		stationData: Array,
	},
	data(){
		return{
			pathLenth: 0
		}
	},
	mounted(){
		window.addEventListener('scroll', this.handleScroll)
        if(this.stationData.length > 0){
            this.pathLenth = this.$refs['staCircle'][0].children[1].children[0].getTotalLength();
            this.handleScroll()
        }
	},
	destroy(){
		window.removeEventListener('scroll', this.handleScroll);
	},
	methods:{
		statusIcon(val){
			if( val == true ){
				return 'el-icon-success'
			}else{
				return 'el-icon-warning'
			}
		},
		emit_openStation(data){
			this.$emit('open-station', data)
		},
		handleScroll(){
			this.$refs['staCircle'].forEach( el =>{
				
				let thisTop = el.offsetTop - window.innerHeight;
				let srcV    = window.scrollY;
				let perc    = 1 - (el.dataset.per / 100);
				let dashOff = el.children[1].children[0];

				if( srcV > thisTop ){
					dashOff.style.strokeDashoffset = this.pathLenth * perc;
				}else{
					dashOff.style.strokeDashoffset = this.pathLenth;
				}
			});
		},
		header_dblclick(ID, type){
			this.$emit("dblclick-jump", {ID: ID, type: type})
		}
	},
	watch:{
        stationData(){
            if(this.stationData.length > 0){
                this.pathLenth = this.$refs['staCircle'][0].children[1].children[0].getTotalLength();
                this.handleScroll()
            }
        }
    },
}
</script>
<style scoped>
.PV_header_style{
	background: linear-gradient(to right, #00ac93, #6effcf);
}
.lgroup_header_style{
	/* background: linear-gradient(-45deg, #6e82ff, #36d2ff 41.6%, #6ec3ff 66.81%, #0070ad); */
	background: linear-gradient(to right, #0070ad, #00c0f7 41.6%);
}
</style>

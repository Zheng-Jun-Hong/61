<template>
	<div class="stationtab_basic">
		<h3>{{ stationData.name }}</h3>
		<div class="statab_content">
			<div>

				<div class="statab_weather" v-if="Object.keys(BasicData).length > 0">
					<div>
						<h4>{{ BasicData.weather.temperature }} °C</h4>
						<p>{{ BasicData.weather.status }}</p>
						<p>{{ BasicData.weather.rain }}</p>
						<img :src="BasicData.weather.imgurl">
					</div>
					<div>
						<figure :style="{ 'background-image': 'url(' + stationData.imgsrc + ')' }"></figure>
					</div>
				</div>

				<div class="statab_status">
					<div
					v-for="(sta, idx) in BasicData.block_data" :key="idx"
					:class="{alert: sta.error}">
						<div class="sstb_title">
							<i :class="'icon-' + sta.icon"></i>{{ sta.title }}
						</div>
						<div class="sstb_content">
							<div>
								{{ sta.text }}
								<span v-if="sta.text2">{{ sta.text2 }}</span>
							</div>
						</div>
					</div>
				</div>
				
			</div>

			<div class="chart_scope_wrap">
				<div class="chart_scope">
					<h5>今日發電量</h5>
					<div id="plot_div" style="position: relative;"></div>
				</div>
				<!-- <div class="chart_scope">
					<h5>累計發電量</h5>
					<div>
						<img :src="testchart" alt="">
					</div>
				</div> -->
			</div>
		</div>
	</div>
</template>

<script>
import Plotly from "plotly.js"
export default {
	name: 'stationTabBasic',
	props: {
		basicData: Object,
		stationData: Object
	},
	data(){
		return{
			//testchart: './imgs/testchart.jpg'
			BasicData: {},
		}
	},
	methods: {
		plot_resize(){
            let update = {
                width: "",
                heigth: "",
            }
            update = {
                width: document.getElementById('plot_div').clientWidth,
                height:  document.getElementById('plot_div').clientHeight,
                margin: this.plot_margin()
            }
            Plotly.relayout("plot_div", update)
        },
        plot_margin(){
            let margin =  {
                l: 70,
                r: 0,
                b: 50,
                t: 0,
                pad: 20,
            }
            return margin
        },
		kwh_plot(){
			let that = this
			console.log(this.stationData)
			let request_json = {
				history_ID: this.stationData['ID'],
				datacollection: this.stationData['collection'],
				datatype: 'kwh',
				date_range: 1
			}
			console.log(request_json)
			this.axios.post('/history_data_list', request_json).then(function(data){
				const MyPlot = document.getElementById('plot_div')
				let layout = {
					width: document.getElementById('plot_div').clientWidth,
					height: document.getElementById('plot_div').clientHeight,
					margin: that.plot_margin(),
					modebar:{
						orientation: 'v',
					},
					legend: {
						x: 1,
						xanchor: 'right',
						y: 1
					},
					xaxis:{
						title:{
							text: "時間"
						}
					},
					yaxis:{
						title:{
							text: "發電量(kWh)"
						}
					},
				}
				Plotly.newPlot( MyPlot, [{x: data.data.data.x_axis, y: data.data.data.y_axis, type:'bar'}], layout,
					{
						displaylogo: false,
						modeBarButtonsToRemove: [
							"sendDataToCloud",
							"hoverClosestCartesian",
							"hoverCompareCartesian",
							"toggleSpikelines",
						],
					}
				)
				})
			
		},
		get_basic_data(){
			let that = this
			if(this.stationData !== undefined && this.stationData !== null && Object.keys(this.stationData).length !== 0){
				this.axios.post('/get_basic_data',{
					'ID_list': [this.stationData['ID']],
					'col_list': [this.stationData['collection']]
				}).then(function(data){
					that.BasicData = data.data.data[0]
					console.log(that.BasicData)
					that.BasicData['block_data'] = [
						{
							error: that.BasicData.led_state == 0 ? false : true,
							title: "發電狀態",
							icon: "ttl_thunder",
							text: that.BasicData.led_state == 0 ? "發電正常" : that.BasicData.led_state == 1 ? "一級警報" :
							that.BasicData.led_state == 2 ? "二級警報" : that.BasicData.led_state == 3 ? "斷線警報" : "其他警報",
						},
						{
							error: !that.BasicData.communi,
							title: "4G通訊狀態",
							icon: "ttl_mail",
							text: that.BasicData.communi ?"正常":"斷訊",
							text2: "最後通訊時間 "+ that.BasicData.lastTime,
						},
						{
							error: false,
							title: "DMY",
							icon: "ttl_time",
							text: that.BasicData.dmy,
						},
						{
							error: that.BasicData.alert_count > 0,
							title: "警報數",
							icon: "ttl_alert",
							text: that.BasicData.alert_count,
						},
					]
				})
			}
		},
	},
	mounted(){
		if(this.stationData['ID'] != null && this.stationData['ID'] != '' && this.stationData['ID'] != undefined){
			this.get_basic_data()
			this.kwh_plot()
		}
		window.addEventListener("resize", this.plot_resize)
    },
	destroyed(){
        window.removeEventListener("resize", this.plot_resize)
    },
}
</script>


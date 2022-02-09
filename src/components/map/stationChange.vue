<template>
	<div id="stationChange">
		<div class="hom_station_wrap">
			<div 
			class="hom_station"
			v-for="(station, idx) in cityStations"
			:class="{'d-none': idx >0}"
			:key="idx">
				<h2>{{ station.name }}</h2>
				<div class="homst_topinfo">
					<div class="homst_weather">
						<img :src="station.weather.imgurl">
						<h3>{{ station.weather.temperature }}</h3>
						<span>{{ station.weather.status }}</span>
						<span>{{ station.weather.rain }}</span>
					</div>
					<div class="homst_rightinfo">
						<div>
							<h3>{{ station.ttlPower.title }}</h3>
							<i>{{ station.ttlPower.unit }}</i>
							<span>{{ station.ttlPower.numb }}</span>
						</div>
						<div>
							<h3>{{ station.todayPower.title }}</h3>
							<i>{{ station.todayPower.unit }}</i>
							<span>{{ station.todayPower.numb }}</span>
						</div>
					</div>
				</div>
				<div class="homst_btminfo">
					<div 
					class="homst_b_item"
					v-for="( info, idx ) in station.otherInfos"
					:key="idx">
						<h3>{{ info.title }}</h3>
						<i>{{ info.unit }}</i>
						<span>{{ info.numb }}</span>
					</div>
					<div class="homst_cta">
						<el-button @click="openStation(station)">
							查看案場
						</el-button>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'stationChange',
	props: {
		cityStations: Array
	},
	methods: {
		openStation(data){
			this.$parent.$refs.stationPop.$el.style.display = 'block';
			this.$parent.$refs.stationPop.stationData = data	
			document.body.classList.add('lock');
		}
	}
}
</script>
<style>
.d-none{
	display: none;
}
</style>
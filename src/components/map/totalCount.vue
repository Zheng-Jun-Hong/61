<template>
	<div id="totalCount">
		<div class="ttlc_wrap">
			<div 
			v-for="(item, idx) in ttlData" 
			:key="idx" 
			class="ttlc_list"
			>
				<h2>{{ item.title }}</h2>
				<span>{{ item.numb }}</span>
				<div class="ttlc_icon" :class="{'d-flex': item.icon == 'ttl_sunboard'}">
					<i @click="open" class="el-icon-s-data" v-if="item.icon == 'ttl_sunboard'" 
					style="font-size: unset; cursor: pointer;"></i>
					<i :class="'icon-' + item.icon"></i>
				</div>
				<div class="ttlc_unit">
					{{ item.unit }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import plantHistory from "./plantHistory.vue";

export default {
	name: 'totalCount',
	props: {
		ttlData: Array
	},
	methods:{
		open() {
			const h = this.$createElement;
			this.$msgbox({
			title: '',
			message: h(plantHistory),
			showConfirmButton: false,
			customClass: 'plantModal',
			});
		},
	}
}
</script>
<style>
.d-flex{
	display: flex;
}
.plantModal{
	width: 80vw;
	overflow-y: scroll;
	height: 90vh;
}
</style>

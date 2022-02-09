<template>
	<div id="selectStation">
		<div class="select_s_wrap">
			<div class="select_city">
				<div class="sels_wrap">
					<el-radio-group v-model="selectedCity">
						<el-radio 
						v-for="(item, idx) in nationOpt"
						:key="idx"
						:label="item.value"
						@change="selectCity(item, $event)"></el-radio>
					</el-radio-group>
				</div>
			</div>

			<el-cascader-panel 
			ref="cascaSelect"
			popper-class="select_station_cascader"
			v-model="selectedValue"
			:options="selectedOpt"
			:props="{ multiple: true }"
			@change="checkChange()"
			></el-cascader-panel>

		</div>
		<div 
		ref="seleVal"
		class="seleted_value_wrap">
			<div>已選取：</div>
			<div class="seleted_value">
				<div 
				v-for="(item, idx) in selectedValue"
				:key="idx" >
					<b v-for="(child, idx) in groupIDLable[item[3]]" :key="idx">{{child}}</b>
				</div>
			</div>
		</div>
	</div>
</template>
<style>
.el-cascader-menu:nth-child(1)::before{content: '區'}
.el-cascader-menu:nth-child(2)::before{content: '電廠（段）'}
.el-cascader-menu:nth-child(3)::before{content: '電站'}
.el-cascader-menu:nth-child(4)::before{content: '分組'}
.seleted_value{
	max-height: 30vh;
	overflow: auto;
}
</style>
<script>
export default {
	name: 'selectStation',
	props: ['plant_select'],
	data(){
		return{
			selectedValue: [],
			selectedCity: '',
			selectedOpt: [],
			groupIDLable:{},
			nationOpt: [],
		}
	},
	methods: {
		selectCity(val, e){
			this.selectedValue = [];
			this.selectedOpt = val.children;
			this.$refs['cascaSelect'].$el.style.display = 'flex';
		},
		checkChange(){
			this.$refs['seleVal'].style.display = 'block';
		}
	},
	beforeMount(){
		let that = this
		this.axios.get('/get_select_station').then(function(data){
			that.nationOpt = data.data.data['nationOpt']
			that.groupIDLable = data.data.data['groupIDLable']
		})
	},
	watch:{
		selectedValue: function(val){
			let ID_select = []
			let col_select = []
			let plant_select = []
			let lgroup_select = []
			for(var ii in this.$refs['cascaSelect'].store.nodes){
				//console.log(this.$refs['cascaSelect'].store.nodes[ii])
				for(var plant_i in this.$refs['cascaSelect'].store.nodes[ii].children){
					if(this.$refs['cascaSelect'].store.nodes[ii].children[plant_i].checked == true){
						plant_select.push(this.$refs['cascaSelect'].store.nodes[ii].children[plant_i].value)
					}
					for(var lgroup_i in this.$refs['cascaSelect'].store.nodes[ii].children[plant_i].children){
						if(this.$refs['cascaSelect'].store.nodes[ii].children[plant_i].children[lgroup_i].checked == true){
							lgroup_select.push(this.$refs['cascaSelect'].store.nodes[ii].children[plant_i].children[lgroup_i].value)
						}
					}
				}
			}
			for(var i in val){
				if(plant_select.includes(val[i][1])){
					ID_select.push(val[i][1])
					col_select.push('pv_plant')
					let index = plant_select.indexOf(val[i][1])
					if (index >= 0) {
						plant_select.splice( index, 1 )
						//console.log(plant_select)
					}
				}
				if(lgroup_select.includes(val[i][2])){
					ID_select.push(val[i][2])
					col_select.push('pv_lgroup')
					let index = lgroup_select.indexOf(val[i][2])
					if (index >= 0) {
						lgroup_select.splice( index, 1 )
					}
				}
				ID_select.push(val[i][3])
				col_select.push('pv_group')
			}
			//console.log(ID_select)
			//console.log(col_select)
			this.$emit('input', {'ID_list': ID_select, 'col_list': col_select});   //傳遞已選擇的ID到外層
		}
	}
}
</script>


<!-- 改寫自selectStation
原本是選地區
這邊選的是全部 地面型 水面型 屋頂型 
by YuShan -->
<template>
	<div id="selectStation">
		<div class="select_s_wrap">
			<div class="select_city">
				<div class="sels_wrap">
					<el-radio-group v-model="selectedCity">
						<el-radio 
						v-for="(item, idx) in system"
						:key="idx"
						:label="item.label"
						@change="selectCity(item, $event)"></el-radio>
					</el-radio-group>
				</div>
			</div>

			<el-cascader-panel 
			v-if="selectedCity!='全部'"    
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
		class="seleted_value_wrap"
		v-if="selectedCity!='全部'">   <!-- 全部案場der時候不顯示 -->
			<div>已選取：</div>
			<div class="seleted_value">
				<div 
				v-for="(item, idx) in selectedValue"
				:key="idx">
					<b v-for="(child, idx) in groupIDLable[item[2]]" :key="idx">{{child}}</b>
				</div>
			</div>
		</div>
	</div>
</template>
<style>
.el-cascader-menu:nth-child(1)::before{content: '電廠（段）'}
.el-cascader-menu:nth-child(2)::before{content: '電站'}
.el-cascader-menu:nth-child(3)::before{content: '分組'}
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
			selectedCity: '全部',
			selectedOpt: [],
			groupIDLable:{},
			system: [],
		}
	},
	methods: {
		selectCity(val, e){
			if(this.selectedCity == '全部'){
				this.$emit('input', {'ID_list': null, 'col_list': null, 'all': true});   //傳遞全部到外層
				return false
			}
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
		this.axios.get('/get_select_station_system').then(function(data){
			that.system = data.data.data['system']
			that.groupIDLable = data.data.data['groupIDLable']
		})
	},
	mounted(){
		this.$emit('input', {'ID_list': null, 'col_list': null, 'all': true});   //傳遞全部到外層
	},
	watch:{
		selectedValue: function(val){
			if(this.selectedCity == '全部'){
				return true
			}
			let ID_select = []
			let col_select = []
			let plant_select = []
			let lgroup_select = []
			for(var ii in this.$refs['cascaSelect'].store.nodes){
				//console.log(this.$refs['cascaSelect'].store.nodes[ii])
				if(this.$refs['cascaSelect'].store.nodes[ii].checked == true){
					plant_select.push(this.$refs['cascaSelect'].store.nodes[ii].value)
				}
				for(var lgroup_i in this.$refs['cascaSelect'].store.nodes[ii].children){
					if(this.$refs['cascaSelect'].store.nodes[ii].children[lgroup_i].checked == true){
						lgroup_select.push(this.$refs['cascaSelect'].store.nodes[ii].children[lgroup_i].value)
					}
					for(var group_i in this.$refs['cascaSelect'].store.nodes[ii].children[lgroup_i].children){
					if(this.$refs['cascaSelect'].store.nodes[ii].children[lgroup_i].children[group_i].checked == true){
						lgroup_select.push(this.$refs['cascaSelect'].store.nodes[ii].children[lgroup_i].children[group_i].value)
					}
				}
				}
				
			}
			for(var i in val){
				if(plant_select.includes(val[i][0])){
					ID_select.push(val[i][0])
					col_select.push('pv_plant')
					let index = plant_select.indexOf(val[i][0])
					if (index >= 0) {
						plant_select.splice( index, 1 )
						//console.log(plant_select)
					}
				}
				if(lgroup_select.includes(val[i][1])){
					ID_select.push(val[i][1])
					col_select.push('pv_lgroup')
					let index = lgroup_select.indexOf(val[i][1])
					if (index >= 0) {
						lgroup_select.splice( index, 1 )
					}
				}
				ID_select.push(val[i][2])
				col_select.push('pv_group')
			}
			//console.log(ID_select)
			//console.log(col_select)
			this.$emit('input', {'ID_list': ID_select, 'col_list': col_select, 'all': false});   //傳遞已選擇的ID到外層
		}
	}
}
</script>


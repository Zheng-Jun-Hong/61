<template>
    <div class="">
        <div class="chartana_select_wrap">
            <div style="margin-bottom: 16px;"> 
                <el-popover placement="bottom-start" trigger="click">
                    <el-button size="medium" slot="reference" class="esicon_btn">
                        <i class="icon-nav_factory"></i>選擇電站</el-button>
                    <selectStation v-model="plant_select" />
                </el-popover>
                <span style="margin: 0 1rem;">
                    <el-autocomplete
                        v-model="plant_search"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="搜尋"
                        value-key="name"
                        @select="handleSelect"
                    ></el-autocomplete>
                </span>
                <el-popover
                popper-class="select_device_cascader"
                placement="bottom"
                trigger="click">
                    <el-cascader-panel 
                    v-model="selectedDevice"
                    @change="checkChange()"
                    :props="{ multiple: true  }"
                    :options="device_list"
                    ref="device_point_ref">
                    </el-cascader-panel>
                    <!-- <div 
                    ref="seleVal"
                    class="seleted_value_wrap">
                        <div>已選取：</div>
                        <div class="seleted_value">
                            <div 
                            v-for="(item, idx) in selectedDevice"
                            :key="idx" >
                                <b v-for="(child, idx) in item" :key="idx">{{child}}</b>
                            </div>
                        </div>
                    </div> -->
                    <el-button 
                    class="select_device_btn"
                    slot="reference"><i class="icon-ttl_sunboard"></i> 選擇設備</el-button>
                </el-popover>
                <h2>{{ myfavorite_name }}</h2>
            </div>
            <div>
                <el-popover
                placement="bottom"
                width="200"
                trigger="click">
                    <div class="favo_select">
                        <ul>
                            <li v-show="myfavorite.length == 0">{{nofavo.text}}</li>
                            <li
                            v-for="(item, idx) in myfavorite"
                            :key="item.label">
                                <span
                                :class="{ active: item.isActive }"
                                @click="selectFavo(item, idx)">
                                    {{ item.label }}
                                </span>
                                <span 
                                @click="selectCancel(idx)"
                                class="select_cancel">
                                    <i class="el-icon-error"></i>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <el-button 
                    class="favo_select_btn" 
                    slot="reference">
                        <i class="el-icon-star-off"></i> {{myfavoriteSelect}}
                    </el-button>
                </el-popover>
            </div>
        </div>
        <div class="chart_ana_func_wrap">
            <div class="search_device_list">
                <ul>
                    <li
                    v-for="(item, idx) in searchDeviceList"
                    :key="idx">
                        <div
                        :class="{ select: item.select }" 
                        class="ser_dev_item">
                            <p @click="selectSearchDevice(item)">{{ item.name }}</p>
                            <span
                            @click="deleteSearchDevice(idx)"><i class="el-icon-close"></i></span>
                        </div>
                    </li>
                </ul>
                <div class="add_to_favo">
                    <el-input v-model="addFavoName" placeholder="請輸入欲要加入最愛的名稱"></el-input>
                    <el-button 
                    @click="addToMyFavo()"
                    style="padding: 1rem 2rem 1rem 1.5rem; margin: 0 0 0 1rem"
                    type="primary" plain>
                        <i class="el-icon-star-off"></i> 儲存我的最愛
                    </el-button>
                </div>
                <div class="time_range_selector">
                    <timeRangePicker v-model="date_selection" />
                </div>
                <div style="display: flex;">
                    <el-button  style="margin-left: auto;" type="primary" @click="get_compare_data()">確認比較</el-button>
                </div>
            </div>
        </div>
        <div class="stbigimg">
            <div class="history_container"  v-loading="loading">
                <div style="display: flex; align-items: center; padding: 1rem;">
                    <el-button size="small" type="primary" >
                        輸出CSV
                    </el-button>
                </div>
                <div id="plot_div"></div>
            </div>
        </div>
    </div>
</template>
<style>
.select_device_cascader .el-cascader-menu:first-child .el-checkbox{
	display: none;
}
</style>
<script>
import Plotly from "plotly.js";
import c from 'assets/js/common.js';

import selectStation from '../station/selectStation.vue';
import timeRangePicker from "../datepicker/timeRangePickerSimple.vue";
export default {
    name: "chartAnalysis",
	components:{		
		selectStation, timeRangePicker
	},
    data() {
        return {
            myfavorite_name: '',
            loading: false,
            plant_select: {'ID_list': [], 'col_list': []},
            plant_search: "",
            myfavorite: [
                /* { label: '最愛組合A', isActive:false, favoList: [
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter1', select: false },
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter2', select: false },
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter3', select: false },
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter4', select: false },
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter5', select: false },
                ] },
                { label: '測試用組合B', isActive:false, favoList: [
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter1', select: false },
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter2', select: false },
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter3', select: false },
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter4', select: false },
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter5', select: false },
                ] },
                { label: '測試用組合C', isActive:false, favoList: [
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter1', select: false },
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter2', select: false },
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter3', select: false },
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter4', select: false },
                    { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter5', select: false },
                ] }, */
            ],
            myfavoriteSelect: '選取我的最愛',
            nofavo: {
                text: '您目前沒有任何最愛清單'
            },
            selectDevice: {},
            /* selectDevice: [
                { label: '變流器', children: [
                    { label: 'Inverter 4', value: 'Inverter 4', children:[
                        { label: '交流輸出電流L2', value: '交流輸出電流L2' }
                    ] },
                ] },
                { label: '環境感測器', children: [
                    { label: '2Inverter 4', value: '2Inverter 4', children:[
                        { label: '交流輸出電流L2', value: '2交流輸出電流L2' }
                    ] },
                ] },
                { label: '智慧電表', children: [
                    { label: '3Inverter 4', value: '3Inverter 4', children:[
                        { label: '交流輸出電流L2', value: '3交流輸出電流L2' }
                    ] },
                ] }
            ], */
            device_list: [],
            selectedDevice: [],
            searchDeviceList: {},
            /* searchDeviceList: [
                { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter1', select: false },
                { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter2', select: false },
                { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter3', select: false },
                { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter4', select: false },
                { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter5', select: false },
                { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter6', select: false },
                { name: '上萬安段/上萬安段/地號5、33、34/變流器/Inverter7', select: false }
            ], */
            selectedDeviceList: [],
            addFavoName: '',
            date_selection: {},
        };
    },
    mounted(){
        this.get_compare_group()
    },
    methods: {
        get_compare_group(){
            let that = this
            this.axios.get('/compare_group_tool').then(data=>{
                that.myfavorite = []
                //console.log(data.data.data)
                data.data.data.group_data.forEach(group => {
                    that.myfavorite.push({
                        label: group.name,
                        isActive: false,
                        favoList: group.equip_data
                    })
                })
            })
        },
        deleteSearchDevice(idx){
            //this.searchDeviceList.splice(idx, 1);
            this.$delete(this.searchDeviceList, idx)
        },
        selectSearchDevice(item){
            if(  item.select == false ){
                item.select = true;
                this.selectedDeviceList.push( item );
            }else{
                item.select = false;
                this.selectedDeviceList.forEach(function(el, idx, ary){
                    if( el.name == item.name ){
                        ary.splice(idx, 1)
                    }
                })
            }
        },
        selectCancel(idx){
            this.myfavoriteSelect = '選取我的最愛';
            this.myfavorite.splice(idx, 1);
            this.nofavoFunc()
        },
        selectFavo(item){
            console.log(item)
            this.myfavorite_name = item.label
            this.addFavoName = item.label
            this.myfavorite.forEach(el => el.isActive = false);
            item.isActive = true;
            this.myfavoriteSelect = item.label;
            this.searchDeviceList = {}
            item.favoList.forEach(equip=>{
                this.searchDeviceList[`${equip.ID}_${equip.about}`] = ({
                    name: equip.label,
                    type: equip.type,
                    select: false
                })
            })
        },
		checkChange(){
			//this.$refs['seleVal'].style.display = 'block';
            let checked_node = this.$refs['device_point_ref'].getCheckedNodes()
            checked_node.forEach(node => {
                if(node.hasChildren){
                    return
                }
                if(node.pathLabels.length == 3){
                    console.log(node)
                    let name_str = `${node.pathLabels[1]}/${node.pathLabels[2]}`
                    let id_str = `${node.parent.value}_${node.value}` 
                    if(!node.checked){
                        delete this.searchDeviceList[id_str]
                        return
                    }
                    if(!(id_str in this.searchDeviceList)){
                        this.searchDeviceList[id_str] = ({
                            name: name_str,
                            type: node.data.type,
                            select: false
                        })
                    }
                }
                else if(node.pathLabels.length == 2){
                    let name_str = `${node.pathLabels[1]}`
                    let id_str = `${node.value}_value` 
                    if(!node.checked){
                        delete this.searchDeviceList[id_str]
                        return
                    }
                    if(!(id_str in this.searchDeviceList)){
                        this.searchDeviceList[id_str] = ({
                            name: name_str,
                            type: node.data.type,
                            parentID: node.data.parentID,
                            select: false
                        })
                    }
                }
                //console.log(this.searchDeviceList)
            })
		},
        addToMyFavo(){
            if(this.addFavoName == null || this.addFavoName == undefined || this.addFavoName == ""){
                this.$message({
                    message: '請輸入我的最愛名稱',
                    type: 'error'
                })
                return false
            }
            //console.log(this.searchDeviceList)
            let equip_list = []
            for(var _id in this.searchDeviceList){
                if(this.searchDeviceList[_id].type == 'sensor'){
                    equip_list.push({
                        ID: _id.slice(0, _id.indexOf('_')),
                        type: this.searchDeviceList[_id].type,
                        about: _id.slice(_id.indexOf('_')+1),
                        parentID: this.searchDeviceList[_id].parentID
                    })
                }else{
                    equip_list.push({
                        ID: _id.slice(0, _id.indexOf('_')),
                        type: this.searchDeviceList[_id].type,
                        about: _id.slice(_id.indexOf('_')+1)
                    })
                }
                
            }
            let that = this
            this.axios.post('/compare_group_tool', {
                'name': this.addFavoName,
                'equip_data': equip_list
            }).then(data => {
                that.$message({
                    message: '已成功加入我的最愛',
                    type: 'success'
                })
                that.get_compare_group()
            }).catch(error => {
                console.log(error)
                that.$message({
                    message: '儲存失敗',
                    type: 'error'
                })
            })
        },
        // Plant Serach 
        group_ID_selected(ID){
            this.plant_select.ID_list = [ID]
            this.plant_select.col_list = ['pv_group']
            this.get_equip_select()
        },
        async querySearchAsync(queryString, cb) {
			//console.log(queryString)
			//console.log(this.PV_data)
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
		},
        handleSelect(item) {
			//console.log(item)
			this.plant_select.ID_list = [item.ID]
            this.plant_select.col_list = [item.collection]
            this.get_equip_select()
		},
        get_equip_select(){
            let that = this
            this.selectDevice = {}
            for(var i in this.plant_select.ID_list){
                this.axios.post('/get_equip_select_compare', {
                    ID: this.plant_select.ID_list[i],
                    collection: this.plant_select.col_list[i]
                }).then(data=>{
                    console.log(data.data.data)
                    let station_str = data.data.data.station_data.station_str
                    for(var equip_type in data.data.data.equip_data){
                        if(equip_type == 'inv' && data.data.data.equip_data[equip_type].length>0){
                            if(!('變流器' in that.selectDevice)){
                                that.selectDevice['變流器'] = { 
                                    label: '變流器', 
                                    children: []     
                                }
                            }
                            data.data.data.equip_data[equip_type].forEach(inv => {
                                let inv_data = {
                                    label: station_str + inv.name,
                                    value: inv.ID,
                                    children: []
                                }
                                inv.point_info.forEach(point => {
                                    inv_data.children.push({
                                        label: point.name,
                                        type: 'inv',
                                        value: point.about
                                    })
                                })
                                that.selectDevice['變流器'].children.push(inv_data)
                            })
                            
                        }
                        else if(equip_type == 'meter' && data.data.data.equip_data[equip_type].length>0){
                            if(!('智慧電錶' in that.selectDevice)){
                                that.selectDevice['智慧電錶'] = { 
                                    label: '智慧電錶', 
                                    children: []     
                                }
                            }
                            data.data.data.equip_data[equip_type].forEach(meter => {
                                let meter_data = {
                                    label: station_str + meter.name,
                                    value: meter.ID,
                                    children: []
                                }
                                meter.point_info.forEach(point => {
                                    meter_data.children.push({
                                        label: point.name,
                                        type: 'meter',
                                        value: point.about
                                    })
                                })
                                that.selectDevice['智慧電錶'].children.push(meter_data)
                            })
                        }
                        else if(equip_type == 'sensor' && data.data.data.equip_data[equip_type].length>0){
                            if(!('環境感測器' in that.selectDevice)){
                                that.selectDevice['環境感測器'] = { 
                                    label: '環境感測器', 
                                    children: []     
                                }
                            }
                            data.data.data.equip_data[equip_type].forEach(sensor => {
                                let sensor_data = {
                                    label: station_str + sensor.name,
                                    type: 'sensor',
                                    value: sensor.ID,
                                    parentID: that.plant_select.ID_list[i],
                                }
                                that.selectDevice['環境感測器'].children.push(sensor_data)
                            })
                        }
                    }
                    this.device_list = Object.values(this.selectDevice)
                })
            }
        },
        get_compare_data(){
            if(Object.keys(this.searchDeviceList).length == 0){
                alert('請至少選擇一樣儀器')
                return false
            }
            this.axios.post('/get_compare_data', {
                datepicker1: this.date_selection.date_list[0],
                datepicker2: this.date_selection.date_list[1],
                equip_list: Object.keys(this.searchDeviceList)
            }).then(data=>{
                console.log(data.data.data)
                const plot_obj = document.getElementById('plot_div')
                plot_obj.innerHTML = ""
                var alldata = data.data.data.return_dict
                var axisdict = data.data.data.axisdict
                let plot_data = []
                var num = 1
                let layout = {
                    width: plot_obj.clientWidth,
                    height: plot_obj.clientHeight,
                    margin: c.plot_margin(),
                    title: {
                        text: '比較圖表',
                        font: {
                        family: "Courier New, monospace",
                        size: 24,
                        },
                    },
                    xaxis:{
                        domain: [Object.keys(axisdict).length*0.1, 1],
                        automargin: true,
                        title: {
                        text: 'Date',
                        font: {
                            family: 'Courier New, monospace',
                            size: 18,
                            color: '#7f7f7f'
                        }
                        },
                        
                        tickangle: 'auto',
                    },
                    legend: {"orientation": "h"},
                }
                for(var i in alldata){
                    alldata[i]['type'] = 'scatter'
                    alldata[i]['yaxis'] = "y" + alldata[i]['yaxis']
                    plot_data.push(alldata[i])
                }
                let position = 0
                for(var i in axisdict){
                    layout['yaxis'+axisdict[i]] = (parseInt(axisdict[i]) <= 1) ? {title: i,
                    } : {title: i,
                    anchor: 'free',
                    overlaying: 'y',
                    side: 'left',
                    position: position
                    }
                    position += 0.1
                }
                console.log('Ploting')
                console.log(plot_data)
                console.log(layout)
                Plotly.newPlot(plot_obj, plot_data, layout, {
                    displaylogo: false,
                    modeBarButtonsToRemove: [
                        "sendDataToCloud",
                        "hoverClosestCartesian",
                        "hoverCompareCartesian",
                        "toggleSpikelines",
                    ],
                })
            })
        }
    },
    watch:{
		plant_select: function(){
            this.get_equip_select()
		},
        date_selection(){
            if(Object.keys(this.searchDeviceList).length == 0){
                return false
            }
            this.get_compare_data()
        }
	},
};
</script>
<style scoped>
/* Fix ES Style Problem. */
.el-cascader-panel >>> .el-cascader-menu:nth-child(1)::before{
    content: "" !important;
}
.el-cascader-panel >>> .el-cascader-menu__empty-text{
    display: none;
}
.el-cascader-panel >>> .el-scrollbar__view.el-cascader-menu__list.is-empty::before{
    content: "請先選擇電站";
    width: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
</style>

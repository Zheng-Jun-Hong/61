<template>
    <div>
        <div class="grafla_titles">
            <div>
                <el-popover placement="bottom-start" trigger="click">
                    <el-button
                        size="medium"
                        slot="reference"
                        class="esicon_btn"
                    >
                        <i class="icon-nav_factory"></i>選擇電站</el-button
                    >
                    <selectStation v-model="plant_select" v-if="pageType=='single'" />
                    <select-station-group v-model="plant_select" v-else-if="pageType=='flat'"></select-station-group>
                </el-popover>
            </div>
            <div style="min-width: 150px;">
                <h2 v-if="plant_select != null && plant_select.length > 0">{{ numberTitle }}</h2>
            </div>
            <div class="grafla_msg">
                <div :class="{'text-danger': alertText != '無警報訊息' }">{{ alertText }}</div>
            </div>
        </div>
        <div class="stbigimg_title">
            <div>
                <el-autocomplete
                    v-model="plant_search"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="搜尋"
                    value-key="name"
                    @select="handleSelect"
                ></el-autocomplete>
            </div>
            <div></div>
            <div class="st_status_ball">
                <div v-for="(item, idx) in statusBall" :key="idx">
                    <i :style="{ background: item.color }"></i>
                    {{ item.name }}
                </div>
            </div>
        </div>
        <div class="stbigimg">
            <svg-zone :plant_select="plant_select" :svg_path="svg_path"></svg-zone>   <!-- SVG Loading Area -->
            <div class="sm_data_list" v-if="loading_successful">
                <div
                    v-for="(item, idx) in smdataList"
                    :key="idx"
                    class="sm_data"
                >
                    <div class="smtitle">{{ item.title }}</div>
                    <div class="smvalue">{{ item.value }}</div>
                    <div class="smicon"><i :class="item.icon"></i></div>
                    <div class="smunit">{{ item.unit }}</div>
                </div>
            </div>
        </div>

        <stationPop ref="stationPop" />
    </div>
</template>
<script>
import selectStation from "../station/selectStation_sld.vue";
import selectStationGroup from "../station/selectStation_singleGroup.vue"
import svgZone from "./svgZone.vue"
import stationPop from '@/components/station/stationPop.vue'


export default {
    name: "stationGraTabSld",
    props:['pageType'],
    components: {
        selectStation,
        selectStationGroup,
        svgZone,
        stationPop
    },
    data() {
        return {
            plant_search: "",
            plant_select: [],
            svg_path: "",
            loading_successful: false,
            numberTitle: "請選擇電站",
            alertText: "無警報訊息",
            smdataList: [
                {
                    title: "日發電量",
                    value: "-5,333",
                    icon: "icon-circle_d",
                    unit: "kWh",
                },
                {
                    title: "月發電量",
                    value: "12,333",
                    icon: "icon-circle_m",
                    unit: "kWh",
                },
                {
                    title: "年發電量",
                    value: "963,033",
                    icon: "icon-circle_y",
                    unit: "kWh",
                },
                {
                    title: "裝置容量",
                    value: "1,884",
                    icon: "icon-ttl_drive",
                    unit: "kWp",
                },
                {
                    title: "裝置容量",
                    value: "1,884",
                    icon: "icon-ttl_drive",
                    unit: "kWp",
                },
                {
                    title: "PR值",
                    value: "45",
                    icon: "icon-ttl_thunder",
                    unit: "%",
                },
                {
                    title: "Inverter狀態",
                    value: "20/23",
                    icon: "icon-wrench",
                    unit: "異常數/總台數",
                },
            ],
            statusBall: [
                { name: "正常", color: "#13AD74" },
                { name: "一級警報", color: "#FFC557" },
                { name: "二級警報", color: "#FF4671" },
                { name: "斷線", color: "#9CA3AC" },
            ],
        };
    },
    methods: {
        alarmLatest(){
            if(this.plant_select.length == 0)
                return false
            let that = this
            this.axios.post("/alarmLatest", {
                'PV': this.plant_select[1],
                'lgroup': this.plant_select[2]
            }).then(function(data){
                let event = data.data.data.event
                const equip = data.data.data.equip
                const dict = {
                    inv: "變流器",
                    string: "串電流表",
                    iot: "資料收集器",
                }

                if (event !== null) {
                    that.alertText = `報警名稱：${event.event}( ${event.time} ) 、
                        報警設備：${equip.name}
                        (
                            廠區：${equip.lgroup}-${equip.group},
                            類型:${dict[equip.type]}
                        )`
                    
                } else {
                    that.alertText = "無警報訊息"
                }
            })
        },
        SLD_path_analysis(plant, lgroup, svg){
            let that = this
            this.axios.post('/SLD_path_analysis', {
                plant: plant,
                lgroup: lgroup,
                svg: svg,
                layout: this.pageType == 'single'? 0 : 1
            }).then(function(data){
                console.log(data.data.data)
                let _data = data.data.data
                that.svg_path = `./solar_static/SLD/${_data.plant}/${_data.lgroup}/${_data.svg}.svg`
            })
        },
        async querySearchAsync(queryString, cb) {
			//console.log(queryString)
			//console.log(this.PV_data)
			await this.axios.post('/station_search_regex_SLD', {
                layout: this.pageType == 'single'? 0 : 1,
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
			if(item.name == '無資料'){
				return false
			}

			if(item.collection == 'pv_lgroup'){
				this.plant_select = [null, item.PV, item.realName, null]
			}
            else if(item.collection == 'pv_group'){
                this.plant_select = [null, item.PV, item.lgroup, item.realName]
            } 
		},
    },
    mounted(){
        let that = this
        let query = this.$router.history.current.query
        if((query.plant != undefined & query.lgroup != undefined)){
            this.plant_select = ['', query.plant, query.lgroup, query.svg]
        }
        this.syncdata = setInterval(function(){
            that.alarmLatest()
        }, 5000)
    },
    watch: {
        plant_select: function(){
            if(this.plant_select.length > 0){
                let svg = undefined
                if(this.plant_select.length == 4)
                    svg = this.plant_select[3]
                this.SLD_path_analysis(this.plant_select[1], this.plant_select[2], svg)
                this.alarmLatest()
                this.numberTitle = this.plant_select[1]
            }
            //console.log(this.plant_select)
        }
    },
    destroyed(){
        clearInterval(this.syncdata)
    }
};
</script>
<style>
.text-danger{
    color: red !important;
}
</style>
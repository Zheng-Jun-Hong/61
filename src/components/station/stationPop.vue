<template>
    <div class="station_pop es_popup">
        <div class="spop_wrap">
            <div class="spop_tabs">
                <el-tabs type="card" v-model="activeName" ref="alertSpot" :key="stationData['ID']" >   <!-- 當換案場時 重新渲染 -->
                    <el-tab-pane label="資訊頁" name="basic">
                        <stationTabBasic :basic-data="stationBasic" :station-data="stationData" v-if="activeName == 'basic'" />
                    </el-tab-pane>
                    <el-tab-pane label="基本資料" name="info" v-if="'collection' in stationData && stationData.collection == 'pv_plant'">
                        <stationTabInfo :station-data="stationData"  v-if="activeName == 'info'" />
                    </el-tab-pane>
                    <el-tab-pane label="設備資訊" name="equip" >
                        <stationTabEquip :equip-data="stationTabEquip"  :station-data="stationData" 
                        :jump-equip-id="jump_equip_ID"
                        :equip-select-data="equipment_select_data" v-if="activeName == 'equip'" />
                    </el-tab-pane>
                    <el-tab-pane label="單線圖" name="single" v-if="'collection' in stationData && stationData.collection != 'pv_plant'">
                        <stationTabSingle :single-data="stationTabSingle"  :station-data="stationData" v-if="activeName == 'single'" 
                        @jump_in_pop="jump_in_pop" />
                    </el-tab-pane>
                    <el-tab-pane label="平面圖" name="flat" v-if="'collection' in stationData && stationData.collection != 'pv_plant'" >
                        <stationTabFlat :single-data="stationTabSingle" :station-data="stationData" v-if="activeName == 'flat'"
                        @jump_in_pop="jump_in_pop" />
                    </el-tab-pane>
                    <el-tab-pane label="串電流熱圖" name="power" v-if="'collection' in stationData && stationData.collection != 'pv_plant'">
                        <stationTabPower  :station-data="stationData"  v-if="activeName == 'power'" />
                    </el-tab-pane>
                    <el-tab-pane name="alert">
                        <span slot="label">警報<div id="alert_indicator" :style="{'color': hasAlert}">.</div></span>
                        <stationTabAlert :station-data="stationData"  v-if="activeName == 'alert'" />
                    </el-tab-pane>
                    <el-tab-pane label="報表" name="chart">
                        <stationTabChart v-if="activeName == 'chart'" :station-data="stationData" />
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="spop_content">
                <h3></h3>
            </div>
        </div>
        <div ref="closePop" class="close_pop" @click="closePop">
            <i class="el-icon-close"></i>
        </div>
    </div>
</template>

<script>
import stationTabBasic from "./tabs/stationTabBasic.vue";
import stationTabInfo from "./tabs/stationTabInfo.vue";
import stationTabEquip from "./tabs/stationTabEquip.vue";
import stationTabSingle from "./tabs/stationTabSingle.vue";
import stationTabPower from "./tabs/stationTabPower.vue";
import stationTabFlat from "./tabs/stationTabFlat.vue";
import stationTabAlert from "./tabs/stationTabAlert.vue";
import stationTabChart from "./tabs/stationTabChart.vue";

export default {
    name: "stationCardList",
    components: {
        stationTabBasic,
        stationTabInfo,
        stationTabEquip,
        stationTabSingle,
        stationTabPower,
        stationTabFlat,
        stationTabAlert,
        stationTabChart,
    },
    data() {
        return {
            hasAlert: 'red',
            activeName: 'basic',
            stationData: {},  //傳入物件 name,ID與collection是必要的 !!!!!!!!
            stationBasic: {
                tabTitle: "TP_DEMO_01",
                mainImgSrc: "./imgs/teststation.jpg",
                weather: {
                    imgurl: "./imgs/weather_test.svg",
                    temperature: "30°C",
                    status: "晴天",
                    rain: "降雨機率10%",
                },
                infos: [
                    {
                        error: false,
                        title: "發電狀態",
                        icon: "ttl_thunder",
                        text: "發電正常",
                    },
                    {
                        error: true,
                        title: "4G通訊狀態",
                        icon: "ttl_mail",
                        text: "斷訊",
                        text2: "最後通訊時間 14:30",
                    },
                    {
                        error: false,
                        title: "DMY",
                        icon: "ttl_time",
                        text: "3.5",
                    },
                    {
                        error: true,
                        title: "警報數",
                        icon: "ttl_alert",
                        text: "3",
                    },
                ],
            },
            stationTabEquip: {
                tabTitle: "TP_DEMO_01",
                statusBall: [
                    { name: "正常", color: "#13AD74" },
                    { name: "一級警報", color: "#FFC557" },
                    { name: "二級警報", color: "#FF4671" },
                    { name: "斷線", color: "#9CA3AC" },
                ],
            },
            stationTabFlat: {
                tabTitle: "TP_DEMO_01",
                alertMsg: "無警報訊息",
                statusBall: [
                    { name: "正常", color: "#13AD74" },
                    { name: "一級警報", color: "#FFC557" },
                    { name: "二級警報", color: "#FF4671" },
                    { name: "斷線", color: "#9CA3AC" },
                ],
            },
            stationTabSingle: {
                tabTitle: "TP_DEMO_01",
                alertMsg: "無警報訊息",
                bigimgTitle: "資料收集器通訊狀態：",
                statusBall: [
                    { name: "正常", color: "#13AD74" },
                    { name: "一級警報", color: "#FFC557" },
                    { name: "二級警報", color: "#FF4671" },
                    { name: "斷線", color: "#9CA3AC" },
                ],
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
            },
            stationTabPower: {
                tabTitle: "TP_DEMO_01",
                inverters: [
                    {
                        title: "Inverter 1",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm1-1", active: false },
                            { unit_name: "sm1-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 2",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm2-1", active: false },
                            { unit_name: "sm2-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 3",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm3-1", active: false },
                            { unit_name: "sm3-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 4",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm4-1", active: false },
                            { unit_name: "sm4-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 5",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm5-1", active: false },
                            { unit_name: "sm5-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 6",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm6-1", active: false },
                            { unit_name: "sm6-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 7",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm7-1", active: false },
                            { unit_name: "sm7-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 8",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm8-1", active: false },
                            { unit_name: "sm8-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 9",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm9-1", active: false },
                            { unit_name: "sm9-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 10",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm10-1", active: false },
                            { unit_name: "sm10-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 11",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm11-1", active: false },
                            { unit_name: "sm11-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 12",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm12-1", active: false },
                            { unit_name: "sm12-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 13",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm13-1", active: false },
                            { unit_name: "sm13-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 14",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm14-1", active: false },
                            { unit_name: "sm14-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 15",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm15-1", active: false },
                            { unit_name: "sm15-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 16",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm16-1", active: false },
                            { unit_name: "sm16-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 17",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm17-1", active: false },
                            { unit_name: "sm17-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 18",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm18-1", active: false },
                            { unit_name: "sm18-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 19",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm19-1", active: false },
                            { unit_name: "sm19-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 20",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm20-1", active: false },
                            { unit_name: "sm20-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 21",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm21-1", active: false },
                            { unit_name: "sm21-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 22",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm22-1", active: false },
                            { unit_name: "sm22-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 23",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm23-1", active: false },
                            { unit_name: "sm23-2", active: true },
                        ],
                    },
                ],
            },
            stationTabAlert: {
                statusBall: [
                    { name: "一級警報", color: "#FFC557" },
                    { name: "二級警報", color: "#FF4671" },
                    { name: "斷線", color: "#9CA3AC" },
                ],
            },
            stationTabChart: {},
            equipment_select_data: {},
            jump_equip_ID: null,
        };
    },
    watch: {
        stationData(){
            this.stationTabEquip.tabTitle = this.stationData.name
            this.stationTabSingle.tabTitle = this.stationData.name
            this.stationTabFlat.tabTitle = this.stationData.name
            this.stationTabPower.tabTitle = this.stationData.name
            if(this.jump_equip_ID != null)
                this.activeName = 'equip'
            else
                this.activeName = 'basic'
            this.get_equipment_selection()
        }
    },
    methods: {
        closePop() {
            this.$el.style.display = "none";
            document.body.classList.remove("lock");
        },
        get_equipment_selection(){
            let that = this
            if(this.stationData.ID != undefined && this.stationData.collection != undefined){
                this.axios.post('/get_equip_select', {
                    ID: this.stationData.ID ,
                    collection: this.stationData.collection
                }).then(function(data){
                    //console.log(data.data.data)
                    that.equipment_select_data = data.data.data
                })

            }
        },
        unreturn_alarm_count_by_id(){
            if(Object.keys(this.stationData).length == 0 || this.stationData.ID == undefined){
                return false
            }
            let that = this
            this.axios.post("/unreturn_alarm_count_by_id", {
                ID: this.stationData.ID
            }).then(function(data){
                that.hasAlert = data.data.data.no_alarm ? "#13AD74": "#FF4671"
            })
        },
        jump_in_pop(ID){
            // handle emit from SLD already in pop
            // Set jump_equip_ID
            // And open tab Equip
            this.activeName = 'equip'
            this.jump_equip_ID = ID
        }
    },
    mounted(){
        let that = this
        this.syncData = setInterval(function(){
            that.unreturn_alarm_count_by_id()
        }, 1000)
    },
    destroyed(){
        clearInterval(this.syncData)
    },
};
</script>
<style>
#alert_indicator {
	font-size: 3.5rem;
    position: absolute;
    top: -1.5rem;
    right: 1rem
}
</style>
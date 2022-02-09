<template>
    <div class="smart_device_data_container">
        <div class="smart_device_data current_data_detail">
            <el-table
                :data="smartDeviceData"
                empty-text="無資料"
                class="sd_data_table"
                highlight-current-row
                stripe
                @cell-dblclick="cell_click"
            >
                <el-table-column
                    prop=""
                    :label="parentBtnDeviceName"
                    align="center"
                >
                    <el-table-column
                        align="center"
                        prop="el_meter"
                        label="電錶"
                        min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="p"
                        label="功率"
                        min-width="120"
                        align="start"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="v"
                        label="電壓"
                        min-width="120"
                        align="start"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="f"
                        label="頻率"
                        min-width="120"
                        align="start"
                    >
                    </el-table-column>
                    <el-table-column
                        align="start"
                        prop="i"
                        label="電流"
                        min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                        align="start"
                        prop="kwh_today"
                        label="日發電量"
                        min-width="170"
                    >
                    </el-table-column>
                    <el-table-column
                        align="start"
                        prop="kwh_month"
                        label="月發電量"
                        min-width="170"
                    >
                    </el-table-column>
                    <el-table-column
                        align="start"
                        prop="kwh_year"
                        label="年發電量"
                        min-width="170"
                    >
                    </el-table-column>
                </el-table-column>
            </el-table>
            <!-- <div class="stats_data_detail_container">
                <div class="stats_data_by_month">
                    <span class="stats_title">VCB功率</span>
                    <div class="month_picker_container">
                        <dateMonthPicker
                            :parent-picker-type="pickerType"
                            :parent-date="dateSelected"
                            @select-last-month="selectLastMonth"
                            @select-next-month="selectNextMonth"
                        />
                    </div>
                    <div class="el_table_container">
                        <el-table :data="vcbTableData">
                            <el-table-column
                                align="center"
                                prop="valType"
                                label=""
                                min-width="40"
                            >
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="kW"
                                label="功率"
                                min-width="40"
                            >
                            </el-table-column>
                            <el-table-column
                                prop="illuminance"
                                align="center"
                                label="照度"
                                min-width="40"
                            >
                            </el-table-column>
                        </el-table>
                        <el-button size="small" type="primary">
                            輸出CSV
                        </el-button>
                    </div>
                </div>
                <div class="smart_device_stats_img"></div>
            </div> -->
            <data-history-data :data-name="data_name" :key="parentBtnDeviceId+'_'+data_type"
                :data-collection="parentBtnDeviceCollection" :parent-name="parentBtnDeviceName"
                :data-type="data_type" :data-id="parentBtnDeviceId"/>
        </div>
    </div>
</template>

<style>
.smart_device_data .is-group .is-leaf:nth-child(2) .cell::after {
    content: "kW";
}
.smart_device_data .is-group .is-leaf:nth-child(3) .cell::after {
    content: "V";
}

.smart_device_data .is-group .is-leaf:nth-child(4) .cell::after {
    content: "Hz";
}
.smart_device_data .is-group .is-leaf:nth-child(5) .cell::after {
    content: "A";
}
.smart_device_data .is-group .is-leaf:nth-child(6) .cell::after,
.smart_device_data .is-group .is-leaf:nth-child(7) .cell::after,
.smart_device_data .is-group .is-leaf:nth-child(8) .cell::after {
    content: "kWh";
}
</style>

<script>
/* import dateMonthPicker from "../../../datepicker/dateMonthPicker.vue"; */
import dataHistoryData from "./dataHistoryData.vue"

export default {
    name: "sm_device_data_table",
    components: {
        dataHistoryData,
    },
    props: {
        parentBtnDeviceName: {
            type: String,
            requird: true,
        },
        parentBtnDeviceId: {
            type: String,
            requird: true,
        },
        parentBtnDeviceCollection:{
            type: String,
            required: true
        }
    },
    data() {
        return {
            dateSelected: "",
            pickerType: "month",
            date_selection: {},
            smartDeviceData: [
            ],
            vcbTableData: [
                {
                    valType: "最小值",
                    kW: "6",
                    illuminance: "23",
                },
                {
                    valType: "最大值",
                    kW: "12,333",
                    illuminance: "44",
                },
                {
                    valType: "平均值",
                    kW: "5,688",
                    illuminance: "33",
                },
            ],
            options: [{
                value: 1,
                label: '日'
            }, {
                value: 2,
                label: '月'
            },{
                value: 3,
                label: '年'
            },{
                value: 4,
                label: '歷年'
            }],
            date_range: 0,
            data_type: 'kwh',
            data_name: "發電量",
        };
    },
    created() {
        this.dateSelected = new Date();
    },
    methods: {
        selectLastMonth() {
            this.dateSelected =
                this.dateSelected.getTime() - 3600 * 1000 * 24 * 30;
            this.dateSelected = new Date(this.dateSelected);
        },
        selectNextMonth() {
            this.dateSelected =
                this.dateSelected.getTime() + 3600 * 1000 * 24 * 30;
            this.dateSelected = new Date(this.dateSelected);
        },
        cell_click(row, column, cell, event){
            //console.log(row, column, cell, event)
            switch(column.property){
                case "kwh_today":
                case "kwh_month":
                case "kwh_year":
                    this.data_type = "kwh"
                    this.data_name = "發電量"
                    break
                default:
                    this.data_type = column.property
                    this.data_name = column.label
            }
        },
        pv_meter_data(){
            let that = this
            //console.log(this.parentBtnDeviceName, this.parentBtnDeviceId)
            this.axios.post('/pv_meter_data',{
                'ID_list': [this.parentBtnDeviceId]
            }).then(function(data){
                //console.log(data.data.data)
                that.smartDeviceData = []
                for(var i in data.data.data.meter_data){
                    let _meter_data = data.data.data.meter_data[i]
                    that.smartDeviceData.push({
                        el_meter: that.parentBtnDeviceName,
                        p: _meter_data.p,
                        v: _meter_data.v,
                        f: _meter_data.f,
                        i: _meter_data.i,
                        kwh_today: _meter_data.kwh_today,
                        kwh_month: _meter_data.kwh_month,
                        kwh_year: _meter_data.kwh_year,
                    })
                }
            })
        },
    },
    mounted(){
        let that = this
        this.pv_meter_data()
        this.syncData = setInterval(function(){
            that.pv_meter_data()
        }, 1000)
    },
    watch: {
        parentBtnDeviceId(){
            this.pv_meter_data()
        }
    },
    destroyed(){
        clearInterval(this.syncData)
    },
};
</script>
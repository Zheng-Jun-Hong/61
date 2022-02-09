<template>
    <div class="inverter_data_container">
        <div class="inverter_data_list">
            <div
                v-for="(item, idx) in inverterData"
                :key="idx"
                class="inverter_data_single"
                @dblclick="inv_data_row(item.datatype)"
            >
                <div class="inverter_title">{{ item.title }}</div>
                <div class="inverter_value">{{ item.value }}</div>
                <div class="inverter_icon"><i :class="item.icon"></i></div>
                <div class="inverter_unit">{{ item.unit }}</div>
            </div>
        </div>

        <div class="inverter_data_detail">
            <el-table
                :data="inverterDataAC"
                class="inverter_data_table ac_data_table"
                stripe
                highlight-i-row
                @cell-dblclick="inv_data_ac_table"
                empty-text="無資料"
            >
                <el-table-column
                    prop="chartType"
                    label="交流輸出側"
                    align="center"
                >
                    <el-table-column
                        align="center"
                        prop="label"
                        label=""
                        min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="v"
                        label="電壓"
                        min-width="140"
                    >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="i"
                        label="電流"
                        min-width="140"
                    >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="p"
                        label="功率"
                        min-width="140"
                    >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="f"
                        label="頻率"
                        min-width="140"
                    >
                    </el-table-column>
                </el-table-column>
            </el-table>

            <!-- <el-table
                :data="inverterDataDC"
                class="inverter_data_table dc_data_table"
                stripe
                highlight-i-row
                @cell-dblclick="inv_data_mppt_table"
            >
                <el-table-column
                    prop="chartType"
                    label="直流輸出側"
                    min-width="100%"
                    align="center"
                >
                    <el-table-column
                        align="center"
                        prop="datatype"
                        label=""
                        min-width="120"
                    >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="v"
                        label="電壓"
                        min-width="140"
                    >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="i"
                        label="電流"
                        min-width="140"
                    >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="p"
                        label="功率"
                        min-width="140"
                    >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="temp_Boost"
                        label="Boost 溫度"
                        min-width="140"
                    >
                    </el-table-column>
                </el-table-column>
            </el-table> -->

            <!-- <div class="stats_img_container">
                <div class="stats_img"></div>
                <div class="stats_img"></div>
            </div> -->
            <data-history-data :data-name="data_name" :key="parentBtnDeviceId+'_'+data_type"
                :data-collection="'inverter'" :parent-name="parentBtnDeviceName"
                :data-type="data_type" :data-id="parentBtnDeviceId"/>

        </div>
    </div>
</template>

<style>
.inverter_data_detail .stats_img_container .stats_img:first-child::before {
    content: "功率-照度";
}
.inverter_data_detail .stats_img_container .stats_img:last-child::before {
    content: "發電量";
}
.inverter_data_detail .is-group .is-leaf:nth-child(2) .cell::after {
    content: "V";
}
.inverter_data_detail .is-group .is-leaf:nth-child(3) .cell::after {
    content: "A";
}
.inverter_data_detail .is-group .is-leaf:nth-child(4) .cell::after {
    content: "W";
}

.inverter_data_detail .is-group .is-leaf:nth-child(5) .cell::after {
    content: "Hz";
}

.inverter_data_detail
    .dc_data_table
    .is-group
    .is-leaf:nth-child(5)
    .cell::after {
    content: "°C";
}
</style>

<script>
import c from 'assets/js/common.js'
import dataHistoryData from "./dataHistoryData.vue"

export default {
    name: "inverter_data_table",
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
            inverterData: [
                {
                    datatype: "p_cell_total",
                    title: "直流功率",
                    value: "---",
                    icon: "icon-ttl_thunder",
                    unit: "kW",
                },
                {
                    datatype: "p_bus_total",
                    title: "交流功率",
                    value: "---",
                    icon: "icon-zigzagchart",
                    unit: "kW",
                },
                {
                    datatype: "kwh",
                    title: "發電量",
                    value: "---",
                    icon: "icon-battery-2",
                    unit: "kWh",
                },
                {
                    datatype: "temp_inner",
                    title: "Ambient溫度",
                    value: "---",
                    icon: "icon-temp",
                    unit: "°C",
                },
                {
                    datatype: "temp_sink",
                    title: "Inverter溫度",
                    value: "---",
                    icon: "icon-plug-1",
                    unit: "°C",
                },
                {
                    datatype: "RA",
                    title: "RA",
                    value: "---",
                    icon: "icon-linechart",
                    unit: "%",
                },
                {
                    datatype: "PR",
                    title: "PR",
                    value: "---",
                    icon: "icon-linechart",
                    unit: "%",
                },
            ],
            inverterDataAC: [
                {
                    label: "L1",
                    datatype: "bus_1",
                    v: "---",
                    i: "---",
                    p: "---",
                    f: "---",
                },
                {
                    label: "L2",
                    datatype: "bus_2",
                    v: "---",
                    i: "---",
                    p: "---",
                    f: "---",
                },
                {
                    label: "L3",
                    datatype: "bus_3",
                    v: "---",
                    i: "---",
                    p: "---",
                    f: "---",
                },
            ],
            inverterDataDC: [
            ],
            data_type: "p_cell_total",
            data_name: "直流功率",
        };
    },
    methods: {
        pv_inv_data(){
            let that = this
            this.axios.post("/pv_inv_data", {"inv_ID": this.parentBtnDeviceId}).
            then(function(data){
                //console.log(data.data)
                let inv_data = data.data.data.inv_data
                let device_data = data.data.data.device_data
                for(var i in that.inverterData){
                    that.inverterData[i].value = c.round(inv_data[that.inverterData[i].datatype], 2)
                }
                for(var i in that.inverterDataAC){
                    let datatype = that.inverterDataAC[i].datatype
                    that.inverterDataAC[i].v = c.round(inv_data[`v_${datatype}`], 2)
                    that.inverterDataAC[i].i = c.round(inv_data[`i_${datatype}`], 2)
                    that.inverterDataAC[i].p = c.round(inv_data[`p_${datatype}`], 2)
                    that.inverterDataAC[i].f = c.round(inv_data[`f_${datatype}`], 2)
                }
                that.inverterDataDC = [] // Content depends on true MPPT connections of inverter
                for(var i=1; i<=device_data.MPPT_data.MPPT_num; i++){
                    that.inverterDataDC.push({
                        datatype: `MPPT${i}`,
                        num: i,
                        v: c.round(inv_data[`v_cell_${i}`], 2),
                        i: c.round(inv_data[`i_cell_${i}`], 2),
                        f: c.round(inv_data[`f_cell_${i}`], 2),
                        p: c.round(inv_data[`p_cell_${i}`], 2),
                        temp_Boost: c.round(inv_data[`temp_Boost_${i}`], 2),
                    })
                }
            })
        },
        inv_data_row(datatype){
            this.data_type = datatype
            switch(datatype){
                case "p_cell_total":
                    this.data_name = "直流功率"
                    break
                case "p_bus_total":
                    this.data_name = "交流功率"
                    break
                case "kwh":
                    this.data_name = "發電量"
                    break
                case "temp_inner":
                    this.data_name = "Ambient溫度"
                    break
                case "temp_simk":
                    this.data_name = "Inverter溫度"
                    break
                default:
                    this.data_name = datatype
            }
        },
        inv_data_ac_table(row, column, cell, event){
            //console.log(row, column, cell, event)
            this.data_type = column.property+"_"+row.datatype
            this.data_name = row.label + column.label
        },
        inv_data_mppt_table(row, column, cell, event){
            //console.log(row, column, cell, event)
            this.data_type = `${column.property}_cell_${row.num}`
            this.data_name = row.label + column.label
        }
    },
    mounted(){
        let that = this
        this.pv_inv_data()
        this.syncData = setInterval(function(){
            that.pv_inv_data()
        }, 1000)
    },
    watch: {
        parentBtnDeviceId(){
            this.pv_inv_data()
        }
    },
    destroyed(){
        clearInterval(this.syncData)
    },
};
</script>

<style>
</style>
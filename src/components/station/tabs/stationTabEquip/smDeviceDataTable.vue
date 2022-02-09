<template>
    <div class="sm_device_data_container">
        <div class="stats_title_wrapper">
            <div class="stats_title stats_array_num">{{ serial_num }}</div>
            <div class="stats_title stats_module_num">{{ module_num }}</div>
        </div>
        <div class="current_data_detail">
            <el-table
                :data="string_data"
                class="current_data_table"
                highlight-current-row
                stripe
                :row-class-name="tableRowClassName"
                @cell-dblclick="table_click"
            >
                <el-table-column prop="chartType" label="串電流" align="center">
                    <el-table-column
                        v-for="(item, idx) in serial_num"
                        align="center"
                        :prop="'sa' + (idx + 1)"
                        :label="'#' + (idx + 1)"
                        min-width="76"
                        :key="idx"
                    >
                    </el-table-column>
                </el-table-column>
            </el-table>
            <data-history-data :data-name="data_name" :key="parentBtnDeviceId+'_'+data_type"
                :data-collection="'string_meter'" :parent-name="parentBtnDeviceName"
                :data-type="data_type" :data-id="parentBtnDeviceId" v-if="serial_num != ''" />
        </div>
    </div>
</template>


<style>
.current_data_detail .stats_img::before  {
	content:'串電流 (A)';
}

</style>

<script>
import c from 'assets/js/common.js'
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
            serial_num: "",
            module_num: "",
            string_data: [
                {
                },
            ],
            data_name: "",
            data_type: "sa",
        };
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex === 0) {
                return "row-bg-grey";
            } else {
                return "";
            }
        },
        pv_string_data(){
            let that = this
            this.axios.post("/pv_string_data", {
                string_ID: this.parentBtnDeviceId
            }).then(function(data){
                //console.log(data.data.data)
                let equip_data = data.data.data.equip_data
                let string_data = data.data.data.string_data
                that.module_num = equip_data.module_num
                that.serial_num = equip_data.serial_num
                that.string_data = [{}]
                for(var i=1; i<=that.serial_num; i++){
                    that.string_data[0][`sa${i}`] = string_data[`sa${i}`]
                }
            })
        },
        table_click(row, column, cell, event){
            console.log(row, column, cell, event)
            this.data_type = column.property
            this.data_name = this.parentBtnDeviceName + '串電流' + column.label
        }
    },
    mounted(){
        let that = this
        this.pv_string_data()
        this.syncData = setInterval(function(){
            that.pv_string_data()
        }, 1000)
        this.data_name = this.parentBtnDeviceName + '串電流'
    },
    watch: {
        parentBtnDeviceId(){
            this.pv_string_data()
        }
    },
    destroyed(){
        clearInterval(this.syncData)
    },
};
</script>
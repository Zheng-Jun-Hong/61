<template>
    <div class="smart_device_data_container">
        <div class="current_data_detail">
            <el-table
                :data="ioData"
                class="sd_data_table"
                highlight-current-row
                stripe
                @cell-dblclick="cell_click"
                empty-text="無資料"
            >
                <el-table-column
                    prop=""
                    :label="parentBtnDeviceName"
                    align="center"
                >
                    <el-table-column
                        v-for="i in 8"
                        :key="i"
                        :prop="'DI'+i"
                        :label="'DI '+i"
                        min-width="120"
                        align="center"
                    >
                    </el-table-column>
                </el-table-column>
            </el-table>
            <data-history-data :data-name="data_name" :key="parentBtnDeviceId+'_'+data_type"
                :data-collection="parentBtnDeviceCollection" :parent-name="parentBtnDeviceName"
                :data-type="data_type" :data-id="parentBtnDeviceId"
                :stat-table-show="false" />
        </div>
    </div>
</template>


<script>
/* import dateMonthPicker from "../../../datepicker/dateMonthPicker.vue"; */
import dataHistoryData from "./dataHistoryData.vue"

export default {
    name: "pv_io_table",
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
            data_type: 'DI',
            data_name: "DI",
            ioData: [
            ],
        };
    },
    created() {
        this.dateSelected = new Date();
    },
    methods: {
        cell_click(row, column, cell, event){
            this.data_type = column.property
            this.data_name = column.label
        },
        pv_io_data(){
            let that = this
            //console.log(this.parentBtnDeviceName, this.parentBtnDeviceId)
            this.axios.post('/pv_io_data',{
                'io_ID': this.parentBtnDeviceId
            }).then(function(data){
                //console.log(data.data.data)
                that.ioData = [data.data.data.io_data]
    
            })
        },
        setAll(){
            this.data_type = "DI"
            this.data_name = "DI"
        }
    },
    mounted(){
        let that = this
        this.pv_io_data()
        let table_first_tr = document.querySelector(".sd_data_table .el-table__header tr")
        table_first_tr.addEventListener("dblclick", this.setAll)
        this.syncData = setInterval(function(){
            that.pv_io_data()
        }, 1000)
    },
    watch: {
        parentBtnDeviceId(){
            this.pv_io_data()
        }
    },
    destroyed(){
        clearInterval(this.syncData)
        let table_first_tr = document.querySelector(".sd_data_table .el-table__header tr")
        table_first_tr.removeEventListener("dblclick", this.setAll)
    },
};
</script>
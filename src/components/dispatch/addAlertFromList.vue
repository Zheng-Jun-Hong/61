<template>
    <div class="add_alert_from_list">
        <div class="station_alert_top"> 
            <el-button @click="close()">取消</el-button>
            <el-button  @click="save()" type="success">儲存</el-button>
        </div>
        <div class="station_alert_top">

                <el-radio-group
                    v-model="alertLabel"
                    class="alert_radio"
                    size="medium"
                    @change="alarm_get()"
                >
                    <el-radio-button label="all">總覽警報</el-radio-button>
                    <el-radio-button label="not_returned">未復歸警報</el-radio-button>
                    <el-radio-button label="returned">已復歸警報</el-radio-button>
                    <el-radio-button label="not_archived">未歸檔警報</el-radio-button>
                    <el-radio-button label="archived">已歸檔警報</el-radio-button>
                </el-radio-group>

                <div class="st_status_ball">
                    <div v-for="(item, idx) in statusBall" :key="idx">
                        <i :style="{ background: item.color }"></i>
                        {{ item.name }}
                    </div>
                </div>

        </div>

        <div class="alert_selector_list">
            <div>
                <!-- 設備選單  -->
                <el-select v-model="selectedEquipType" placeholder="設備類型" @change="alarm_get()">
                    <el-option
                        v-for="alert in alertEquipList"
                        :key="alert.value"
                        :label="alert.label"
                        :value="alert.value"
                    >
                    </el-option>
                </el-select>
            </div>
            <div>
                <!-- 警報類型選單 -->
                <el-select v-model="selectedAlertGroup" placeholder="警報類型" @change="alarm_get()">
                    <el-option
                        v-for="alert in alertGroupList"
                        :key="alert.value"
                        :label="alert.label"
                        :value="alert.value"
                    >
                    </el-option>
                </el-select>
            </div>
        </div>

        <div class="time_range_selector">
            <timeRangePicker v-model="date_selection" />
        </div>
        

        <div class="alert_data_table">
            <el-table
                :data="alertTableData"
                stripe
                highlight-current-row
                :empty-text="'無資料'"
                ref="alarmTable"
                @selection-change="handleSelectionChange"
                row-key="_id"
            >
                <el-table-column prop="alarm_place" label="廠區" width="220">
                </el-table-column>
                <el-table-column prop="alarm_group" label="警報類型" min-width="100">
                </el-table-column>
                <el-table-column prop="equip_type" label="設備類型" min-width="100">
                </el-table-column>
                <el-table-column prop="equip_name" label="設備名稱" min-width="110">
                </el-table-column>
                <el-table-column prop="alarm_event" label="警報名稱" min-width="100">
                    <template slot-scope="scope">
                        <div class="st_status_ball">
                            <i :style="{ background: statusBall[scope.row.level].color}"></i>
                            <label style="font-size: 80%; color: rgb(147, 147, 147);">{{statusBall[scope.row.level].name}}</label>
                        </div>
                        <label>{{scope.row.alarm_event}}</label>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="警報發生" min-width="120">
                </el-table-column>
                <el-table-column
                    prop="checktime"
                    label="警報確認"
                    min-width="120"
                >
                </el-table-column>
                <el-table-column prop="returntime" label="警報修復" min-width="120">
                </el-table-column>
                <el-table-column
                    prop="dispatchRecord"
                    label="派工紀錄"
                    min-width="122"
                >
                </el-table-column>
                <el-table-column prop="tools" label="工具" width="160">
                    <template slot-scope="scope">
                        <div class="alert_funcs">
                            <div @click="handleTools(scope.row,$event)"><i class="icon-addperson"></i></div>
                            <div @click="handleTools(scope.row,$event)"><i class="icon-configline"></i></div>
                            <div @click="handleTools(scope.row,$event)"><i class="icon-save"></i></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" type="selection" label="選取派工" width="60"
                :reserve-selection="true">
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination_wrap">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="total_count"
                :current-page.sync="current_page"
                @current-change="page_change"
            >
            </el-pagination>
        </div>
    </div>
</template>
<style>
.alert_select_device .el-cascader-menu{
    padding: 1rem 0;
}
.alert_select_device .el-cascader-menu:nth-child(1)::before {
    content: "類型";
}
.alert_select_device .el-cascader-menu:nth-child(2)::before {
    content: "設備";
}
</style>
<script>

import timeRangePicker from "../datepicker/timeRangePicker.vue";
import selectInverter from "../station/selectDevice.vue";

export default {
    name: "addAlertFromList",
    components: {
        selectInverter,
        timeRangePicker,
    },
    props:['plant_ID'],
    data() {
        return {
            alarm_select: [],
            current_page: 1,
            total_count: 0,
            ajax_lock: true,   //由於時間、案場調整完都會自動alarm_get，在mounted時會多次呼叫，所以lock起來 
            date_selection: {},
			pageTitle: '警報總覽',
            alertLabel: "all",
            placeholder: "選擇設備",
            selectedAlertGroup: "all",
            selectedEquipType: "all",
            statusBall: [
                { name: "正常", color: "#13AD74" },
                { name: "一級警報", color: "#FFC557" },
                { name: "二級警報", color: "#FF4671" },
                { name: "斷線", color: "#9CA3AC" },
            ],
            alertEquipList: [
                { value: "all", label: "全部設備" },
                { value: "inv", label: "變流器"},
                { value: "iot", label: "資料收集器"},
                { value: "string", label: "串電流錶"},
                { value: "sun", label: "日照計"},
                { value: "temp", label: "溫度計"},
                { value: "wind", label: "風速計"},
            ],
            alertGroupList: [
                { value: "all", label: "全部警報" },
                { value: "設備", label: "設備警報" },
                { value: "軟體", label: "軟體警報" },
                { value: "AI", label: "AI警報" },
            ],
            alertTableData: [],
        };
    },
    methods: {
        //依照按鈕客製取得所需的 data 再呼叫 Func
        handleTools(v, e){
            switch( e.target.classList[0] ) {
                case 'icon-addperson'  : this.toolClickCallback(v.tools.check, 'check')  ; break;
                case 'icon-configline' : this.toolClickCallback(v.tools.manual, 'manual_return') ; break;
                case 'icon-save'       : this.toolClickCallback(v.tools.archived, 'archived')       ; break;
            }
        },
        toolClickCallback(val, mode){
            let request_json = {
                ID: val, mode: mode
            }
            let that = this
            this.axios.post('/alarm_tools', request_json).then(function(data){
                that.$message({
                    message: '成功',
                    type: 'success'
                });
                that.alarm_get()
            }).catch(function(e){
                console.log(that)
                that.$message({
                    message: '失敗' ,
                    type: 'error'
                });
            })
        },
        alarm_get(){
            if(this.plant_ID == undefined || this.plant_ID == null)
                return false
            let that = this
            let request_json = {
                time: { mode: this.date_selection.mode, start_date: this.date_selection.date_list[0],
                end_date: this.date_selection.date_list[1]},
                plant: { all: false, ID: [this.plant_ID], col: ['pv_lgroup']},
                alarm_type: this.alertLabel, alarm_group: this.selectedAlertGroup,
                equip_type: this.selectedEquipType,
                page: this.current_page,
            }
            this.axios.post('/alarm_get', request_json).then(function(data){
                that.ajax_lock = false
                that.alertTableData = data.data.data['data']
                that.total_count = data.data.data['total_count']
            })
        },
        close(){
            this.$emit('confirmAdd', null)
        },
        save(){
            this.$emit('confirmAdd', this.alarm_select)
        },
        handleSelectionChange(val) {
            this.alarm_select = []
            let that = this
            val.forEach(element => {
                this.alarm_select.push(element._id)                
            })
        },
        page_change(){
            document.querySelector('.add_alert_from_list').scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
            this.alarm_get()
        }
    },
    mounted(){
        let that = this
        this.alarm_get()
        this.syncdata = setInterval(function(){
			that.alarm_get()
		}, 5000)
    },
    watch:{
        date_selection: function(){
            if(this.ajax_lock == true){
                return false
            }
            this.alarm_get()
        },
        plant_ID(){
            this.alarm_get()
        }
    },
    destroyed(){
		clearInterval(this.syncdata)
	}
};
</script>
<style>
.el-table__header tr{
	background-attachment: fixed !important;
}
i.icon-nav_factory{
	font-size: 1.8rem;
}
.fw-bold{
	font-weight: bold !important;;
}
.ml-30px{
	margin-left: 30px !important;
}
</style>

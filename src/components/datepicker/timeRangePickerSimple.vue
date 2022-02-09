<template>
    <div>
        <div class="estime_range_pick">
            <div class="btn_select_wrapper">
                <el-button
                    size="mini"
                     @click="selectToday"
                    class="btn_set_date_range"
                    :class="{ active: mode=='today' }"
                >
                    本日
                </el-button>
            </div>
        </div>
        <div class="estime_range_pick">
            <!-- 選擇單間、區間 -->
            <div class="btn_select_wrapper">
                <el-button
                    size="mini"
                    @click="setRangeType($event)"
                    class="auto_date_range btn_set_date_range"
                    :class="{ active: mode=='single' }"
                >
                    單日
                </el-button>
                <el-button
                    size="mini"
                    @click="setRangeType($event)"
                    class="manual_date_range btn_set_date_range"
                    :class="{ active: !singleDateRange }"
                >
                    區間
                </el-button>
            </div>
            <!-- 起始時間 -->
            <el-date-picker
                v-model="startDate"
                placeholder="開始日期"
                type="date"
                :disabled="mode != 'single' && mode != 'interval'"
            ></el-date-picker>
            <!-- 調整起始時間按鈕 -->
            <div class="btn_time_picker_wrapper start_time">
                <el-button
                    class="btn_start_date_last_month"
                    @click="selectDateRange($event)"
                    size="mini"
                    :disabled="mode != 'single' && mode != 'interval'"
                >
                    <i class="el-icon-caret-left"></i>
                </el-button>
                <el-button
                    class="btn_start_date_yday"
                    @click="selectDateRange($event)"
                    size="mini"
                    :disabled="mode != 'single' && mode != 'interval'"
                >
                    <i class="el-icon-caret-left"></i>
                </el-button>
                <el-button
                    class="btn_start_date_tmr"
                    @click="selectDateRange($event)"
                    size="mini"
                    :disabled="mode != 'single' && mode != 'interval'"
                >
                    <i class="el-icon-caret-right"></i>
                </el-button>
                <el-button
                    class="btn_start_date_next_month"
                    @click="selectDateRange($event)"
                    size="mini"
                    :disabled="mode != 'single' && mode != 'interval'"
                >
                    <i class="el-icon-caret-right"></i>
                </el-button>
            </div>
            <!-- 結束時間 -->
            <el-date-picker
                v-model="endDate"
                type="date"
                placeholder="結束日期"
                :disabled="singleDateRange"
            ></el-date-picker>
            <!-- 調整結束時間按鈕 -->
            <div class="btn_time_picker_wrapper end_time">
                <el-button
                    class="btn_end_date_last_month"
                    @click="selectDateRange($event)"
                    size="mini"
                    :disabled="singleDateRange"
                >
                    <i class="el-icon-caret-left"></i>
                </el-button>
                <el-button
                    class="btn_end_date_yday"
                    @click="selectDateRange($event)"
                    size="mini"
                    :disabled="singleDateRange"
                >
                    <i class="el-icon-caret-left"></i>
                </el-button>
                <el-button
                    class="btn_end_date_tmr"
                    @click="selectDateRange($event)"
                    size="mini"
                    :disabled="singleDateRange"
                >
                    <i class="el-icon-caret-right"></i>
                </el-button>
                <el-button
                    class="btn_end_date_next_month"
                    @click="selectDateRange($event)"
                    size="mini"
                    :disabled="singleDateRange"
                >
                    <i class="el-icon-caret-right"></i>
                </el-button>
            </div>

            <button @click="searchDateRange(dateRange)" class="btn_send_time_range"
            :disabled="mode != 'single' && mode != 'interval'">
                <i class="el-icon-search"></i>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "dateMonthPicker",
    props: ['date_selection'],
    data() {
        return {
            singleDateRange: true,
            mode: 'today',    //會有 today single interval
            date: "",
            startDate: "",
            endDate: "",
            dateRange: [null, null],
        };
    },
    mounted(){
        this.searchDateRange()
    },
    created() {
        this.date = new Date();
        this.startDate = new Date();
        this.endDate = new Date();
    },
    methods: {
        // 選取時間範圍類型：單間 or 區間
        setRangeType(e) {
            const clsList = e.target.classList;
            if (clsList.contains("auto_date_range")) {
                this.singleDateRange = true;
                this.mode = 'single'
            } else if (clsList.contains("manual_date_range")) {
                this.singleDateRange = false;
                this.mode = 'interval'
            } else {
                console.log("請重新選擇");
            }
        },
        // 區間選取功能
        selectDateRange(e) {
            const classList = e.target.classList;
            switch (true) {
                case classList.contains("btn_start_date_last_month"):
                    this.startDate = this.selectLastMonth(this.startDate);
                    break;
                case classList.contains("btn_start_date_next_month"):
                    this.startDate = this.selectNextMonth(this.startDate);
                    break;
                case classList.contains("btn_start_date_yday"):
                    this.startDate = this.selectLastDay(this.startDate);
                    break;
                case classList.contains("btn_start_date_tmr"):
                    this.startDate = this.selectNextDay(this.startDate);
                    break;
                case classList.contains("btn_end_date_last_month"):
                    this.endDate = this.selectLastMonth(this.endDate);
                    break;
                case classList.contains("btn_end_date_next_month"):
                    this.endDate = this.selectNextMonth(this.endDate);
                    break;
                case classList.contains("btn_end_date_yday"):
                    this.endDate = this.selectLastDay(this.endDate);
                    break;
                case classList.contains("btn_end_date_tmr"):
                    this.endDate = this.selectNextDay(this.endDate);
                    break;
                default:
                    console.log("請重新選擇");
            }
        },
        selectLastMonth(newDate) {
            newDate = newDate.getTime() - 3600 * 1000 * 24 * 30;
            newDate = new Date(newDate);
            return newDate;
        },
        selectNextMonth(newDate) {
            newDate = newDate.getTime() + 3600 * 1000 * 24 * 30;
            newDate = new Date(newDate);
            return newDate;
        },
        selectLastDay(newDate) {
            newDate = newDate.getTime() - 3600 * 1000 * 24;
            newDate = new Date(newDate);
            return newDate;
        },
        selectNextDay(newDate) {
            newDate = newDate.getTime() + 3600 * 1000 * 24;
            newDate = new Date(newDate);
            return newDate;
        },
        selectToday() {
            console.log("選擇今日");
            this.singleDateRange = true;
            this.mode = 'today'
            this.searchDateRange()

        },
        // 送出查詢
        searchDateRange() {
            this.dateRange = [this.startDate, this.endDate];
            const offset = this.dateRange[0].getTimezoneOffset()
            let start_date = ""
            if(this.mode == 'today'){
                let today = new Date()
                start_date = new Date(today.getTime()-(offset*60*1000))
                start_date = start_date.toISOString().split('T')[0]
            }
            else{
                start_date = new Date(this.dateRange[0].getTime()-(offset*60*1000))
                start_date = start_date.toISOString().split('T')[0]
            }
            let end_date = ""
            if(this.mode == 'single' || this.mode == 'today'){
                end_date = start_date
            }else{
                end_date = new Date(this.dateRange[1].getTime()-(offset*60*1000))
                end_date = end_date.toISOString().split('T')[0]
            } 
            console.log(start_date, end_date)
            //方便history_data_list api today會在這邊換成等效<<單日，日期今天這樣>>
            this.$emit('input', {date_list: [start_date, end_date], mode: this.mode == 'today'? 'single':this.mode});   //傳遞已選擇的ID到外層
        },
    },
};
</script>

<template>
    <div class="esdate_month_pick">
        <el-date-picker
            v-model="date"
            :type="parentPickerType"
            placeholder="選擇日期"
            :disabled="parentIsDisabled"
            :clearable="false"
            @change="emit_date"
        ></el-date-picker>
        <div class="btn_time_picker_wrapper">
            <el-button
                class="btn_start_date_last_month"
                @click="selectDateRange($event)"
                size="mini"
            >
                <i class="el-icon-caret-left"></i>
            </el-button>
            <el-button
                class="btn_start_date_yday"
                @click="selectDateRange($event)"
                size="mini"
            >
                <i class="el-icon-caret-left"></i>
            </el-button>
            <el-button
                class="btn_start_date_tmr"
                @click="selectDateRange($event)"
                size="mini"
            >
                <i class="el-icon-caret-right"></i>
            </el-button>
            <el-button
                class="btn_start_date_next_month"
                @click="selectDateRange($event)"
                size="mini"
            >
                <i class="el-icon-caret-right"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "dateMonthPicker",
    props: {
        parentIsDisabled: {
            type: Boolean,
            required: false,
        },
        parentPickerType: {
            type: String,
            default:'date'
        }
    },
    data(){
        return {
            date: new Date(),
        }
    },
    mounted(){
        this.emit_date()
    },
    methods: {
        selectDateRange(e) {
            const classList = e.target.classList;
            switch (true) {
                case classList.contains("btn_start_date_last_month"):
                    this.date = this.selectLastMonth(this.date);
                    break;
                case classList.contains("btn_start_date_next_month"):
                    this.date = this.selectNextMonth(this.date);
                    break;
                case classList.contains("btn_start_date_yday"):
                    this.date = this.selectLastDay(this.date);
                    break;
                case classList.contains("btn_start_date_tmr"):
                    this.date = this.selectNextDay(this.date);
                    break;
                default:
                    console.log("請重新選擇");
            }
            this.emit_date()
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
        emit_date(){
            const offset = this.date.getTimezoneOffset()
            let sel_date = new Date(this.date.getTime()-(offset*60*1000))
            sel_date = sel_date.toISOString().split('T')[0]
            this.$emit("set-date", sel_date);   //傳遞已選擇的ID到外層
        }
    },
};
</script>


<template>
    <div id="dispatchRecord" class="page_wrap">
        <h2>{{ pageTitle }}</h2>
        <div class="page_content">
            <div class="dispatch_head">

                <div style="display: flex;">
                    <el-popover placement="bottom-start" trigger="click">
                        <el-button
                            size="medium"
                            slot="reference"
                            class="esicon_btn">
                            <i class="icon-nav_home"></i>選擇縣市／區域</el-button>
                        <selectStation />
                    </el-popover>
                    <el-button style="margin-left: auto;">下載</el-button>
                    <el-button @click="dispatchingNewCase" type="primary">新增派工</el-button>
                </div>

                <div class="time_range_selector">
                    <timeRangePicker v-model="date_selection" />
                </div>

                <div class="dispatch_type">
                    <el-tabs
                        type="card"
                        align="center"
                        v-model="showTab"
                        @tab-click="handleClick">
                        <el-tab-pane label="暫存" name="tempRecord">
                            <table__temporary 
                            @inspecShow="temporary__InspectionShow" 
                            @alertShow="temporary__alertRepairShow"
                            :date-select="date_selection" />
                        </el-tab-pane>
                        <el-tab-pane label="已派工" name="diapatched">
                            <table__dispatch 
                            @inspecShow="dispatched__InspectionShow" 
                            @alertShow="dispatched__alertRepairShow"
                            :date-select="date_selection" />
                        </el-tab-pane>
                        <el-tab-pane label="已結案" name="storage">
                            <table__storage 
                            @inspecShow="stored__InspectionShow" 
                            @alertShow="stored__alertRepairShow" />
                        </el-tab-pane>
                    </el-tabs>
                </div>


            </div>
        </div>
       
        <createNewDispatch 
        v-model="isDispatchingNewCase"  
        @closePop="dispatchingNewCaseClose"/>

        <dispatched__Inspection 
        v-model="isdispatched__Inspection" 
        @closePop="dispatched__InspectionClose"/>
        <dispatched__alertRepair 
        v-model="isdispatched__alertRepair" 
        @closePop="dispatched__alertRepairClose"/>

        <temporary__Inspection 
        v-model="istemporary__Inspection" 
        @closePop="temporary__InspectionClose"/>
        <temporary__alertRepair 
        v-model="istemporary__alertRepair" 
        @closePop="temporary__alertRepairClose"/>

        <stored__Inspection 
        v-model="isstored__Inspection" 
        @closePop="stored__InspectionClose"/>
        <stored__alertRepair
        v-model="isstored__alertRepair" 
        @closePop="stored__alertRepairClose"/>
    </div>
</template>

<script>
import selectStation from "../components/station/selectStation.vue";
import timeRangePicker from "../components/datepicker/timeRangePicker.vue";

import table__temporary from "../components/dispatch/table__temporary.vue";
import table__dispatch from "../components/dispatch/table__dispatch.vue";
import table__storage from "../components/dispatch/table__storage.vue";

import createNewDispatch from "../components/dispatch/createNewDispatch.vue";

import temporary__Inspection from "../components/dispatch/temporary__Inspection.vue";
import temporary__alertRepair from "../components/dispatch/temporary__alertRepair.vue";
import dispatched__Inspection from "../components/dispatch/dispatched__Inspection.vue";
import dispatched__alertRepair from "../components/dispatch/dispatched__alertRepair.vue";
import stored__Inspection from "../components/dispatch/stored__Inspection.vue";
import stored__alertRepair from "../components/dispatch/stored__alertRepair.vue";

export default {
    name: "dispatch",
    components: {
        selectStation,
        timeRangePicker,
        createNewDispatch,

        table__dispatch,
        table__temporary,
        table__storage,

        dispatched__Inspection,
        dispatched__alertRepair,
        temporary__Inspection,
        temporary__alertRepair,
        stored__Inspection,
        stored__alertRepair
    },
    data() {
        return {
            isDispatchingNewCase: false,

            istemporary__alertRepair: false,
            istemporary__Inspection: false,

            isstored__alertRepair: false,
            isstored__Inspection: false,

            isdispatched__alertRepair: false,
            isdispatched__Inspection: false,

            pageTitle: "派工",
            showTab: "tempRecord",
            date_selection: {},

        };
    },
    mounted(){
        //子元件的手風琴，統一從這聽
        this.$globalFunc.esCollapse()
    },
    methods: {
        handleClick(tab, event) {},
        dispatchingNewCase() {
            this.isDispatchingNewCase = true;
        },
        dispatchingNewCaseClose(){
            this.isDispatchingNewCase = false;
        },
        dispatched__InspectionShow(){
            this.isdispatched__Inspection = true;
        },
        dispatched__InspectionClose(){
            this.isdispatched__Inspection = false;
        },

        dispatched__alertRepairShow(){
            this.isdispatched__alertRepair = true;
        },
        dispatched__alertRepairClose(){
            this.isdispatched__alertRepair = false;
        },

        temporary__alertRepairShow(){
            this.istemporary__alertRepair = true;
        },
        temporary__alertRepairClose(){
            this.istemporary__alertRepair = false;
        },
        temporary__InspectionShow(){
            this.istemporary__Inspection = true;
        },
        temporary__InspectionClose(){
            this.istemporary__Inspection = false;
        },
        stored__InspectionShow(){
            this.isstored__Inspection = true;
        },
        stored__InspectionClose(){
            this.isstored__Inspection = false;
        },
        stored__alertRepairShow(){
            this.isstored__alertRepair = true;
        },
        stored__alertRepairClose(){
            this.isstored__alertRepair = false;
        }
    },
};
</script>

<style>
.el-table__header tr{
	background-attachment: fixed !important;
}
</style>
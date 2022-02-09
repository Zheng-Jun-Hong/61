<template>
    <div class="es_popup" id="numberPopup" style="display: none">
        <div class="dispatchSelecWrap">
                
            
            <div class="time_range_selector">
                <timeRangePicker />
                <el-button type="primary">輸出CSV</el-button>
            </div>
            <div class="stbigimg"></div>
            <div class="poc_table">
                <el-table :data="pocTable">
                    <el-table-column label="最小值">
                        <template slot-scope="scope">
                            {{ scope.row.valueMin }} <i>{{ scope.row.unit }}</i>
                        </template>
                    </el-table-column>
                    <el-table-column label="最大值">
                        <template slot-scope="scope">
                            {{ scope.row.valueMax }} <i>{{ scope.row.unit }}</i>
                        </template>
                    </el-table-column>
                    <el-table-column label="平均值">
                        <template slot-scope="scope">
                            {{ scope.row.valueAve }} <i>{{ scope.row.unit }}</i>
                        </template>
                    </el-table-column>
                    <el-table-column label="加總值">
                        <template slot-scope="scope">
                            {{ scope.row.valueTtl }} <i>{{ scope.row.unit }}</i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div  @click="$globalFunc.closeEachNumb()" class="close_popup_bill">
            <i class="el-icon-close"></i>
        </div>
    </div>
</template>

<script>
import timeRangePicker from './datepicker/timeRangePicker.vue'

export default {
    name: "clickNumber",
	components:{		
        timeRangePicker
	},
    data() {
        return {
            dateSelected: new Date(),
            isShow: true,
            isSelectAll: false,
            inveterFilterData: {
                popoverPosition: 'bottom-end',
            },
            pocTable: [
                { 
                    unit: 'kWh',
                    valueMax: 0,
                    valueMin: 0,
                    valueAve: 0,
                    valueTtl: 0
                },
            ],
            fromBigToSml: false,
            lostPower: false,
            pocDayTable: [
                { 
                    unit: 'kWh',
                    valueMax: 1,
                    valueMin: 2,
                    valueAve: 3,
                    valueTtl: 4
                },
            ]
        };
    },
    methods: {
        closePop() {
            this.$emit('closePop', false);
        },
    }
};
</script>
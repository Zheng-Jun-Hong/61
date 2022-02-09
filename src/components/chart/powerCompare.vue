<template>
    <div class="power_compare_wrap">
        <el-tabs v-model="activeName">
                <el-tab-pane label="與前25%平均發電量差值" name="first">
                    <div class="poc_content">
                        <div class="poc_head">
                            <div>
                                <el-popover placement="bottom-start" trigger="click">
                                    <el-button size="medium" slot="reference" class="esicon_btn">
                                        <i class="icon-nav_factory"></i>選擇電站</el-button>
                                    <selectStation/>
                                </el-popover>
                                <h2>{{powerCompareTitle}}</h2>
                            </div>
                            <div>
                                <dateMonthPicker
                                    :parent-date="dateSelected"
                                    @select-last-month="selectLastMonth"
                                    @select-next-month="selectNextMonth"
                                />
                                <inveterFilter :inveter-filter-data="inveterFilterData"/>
                            </div>
                        </div>
                        <div class="poc_checks">
                            <el-checkbox v-model="fromBigToSml">按大小排序</el-checkbox>
                        </div>
                        <div class="stbigimg"></div>
                        <div class="poc_table">
                            <el-table :data="pocTable">
                                <el-table-column label="本月最大差值">
                                    <template slot-scope="scope">
                                        {{ scope.row.valueMax }} <i>{{ scope.row.unit }}</i>
                                    </template>
                                </el-table-column>
                                <el-table-column label="本月最小差值">
                                    <template slot-scope="scope">
                                        {{ scope.row.valueMin }} <i>{{ scope.row.unit }}</i>
                                    </template>
                                </el-table-column>
                                <el-table-column label="本月平均差值">
                                    <template slot-scope="scope">
                                        {{ scope.row.valueAve }} <i>{{ scope.row.unit }}</i>
                                    </template>
                                </el-table-column>
                                <el-table-column label="本月總計差值">
                                    <template slot-scope="scope">
                                        {{ scope.row.valueTtl }} <i>{{ scope.row.unit }}</i>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="每日損失總計" name="second">
                    <div class="poc_content">
                        <div class="poc_head">
                            <div>
                                <el-popover placement="bottom-start" trigger="click">
                                    <el-button size="medium" slot="reference" class="esicon_btn">
                                        <i class="icon-nav_factory"></i>選擇電站</el-button>
                                    <selectStation/>
                                </el-popover>
                                <h2>{{powerCompareTitle}}</h2>
                            </div>
                            <div>
                                <dateMonthPicker
                                    :parent-date="dateSelected"
                                    @select-last-month="selectLastMonth"
                                    @select-next-month="selectNextMonth"
                                />
                            </div>
                        </div>
                        <div class="poc_checks">
                            <el-checkbox v-model="fromBigToSml">按大小排序</el-checkbox>
                            <el-checkbox v-model="lostPower">電費損失</el-checkbox>
                        </div>
                        <div class="stbigimg"></div>
                        <div class="poc_table">
                            <el-table :data="pocDayTable">
                                <el-table-column label="本月最大差值">
                                    <template slot-scope="scope">
                                        {{ scope.row.valueMax }} <i>{{ scope.row.unit }}</i>
                                    </template>
                                </el-table-column>
                                <el-table-column label="本月最小差值">
                                    <template slot-scope="scope">
                                        {{ scope.row.valueMin }} <i>{{ scope.row.unit }}</i>
                                    </template>
                                </el-table-column>
                                <el-table-column label="本月平均差值">
                                    <template slot-scope="scope">
                                        {{ scope.row.valueAve }} <i>{{ scope.row.unit }}</i>
                                    </template>
                                </el-table-column>
                                <el-table-column label="本月總計差值">
                                    <template slot-scope="scope">
                                        {{ scope.row.valueTtl }} <i>{{ scope.row.unit }}</i>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>

            </el-tabs>
    </div>
</template>

<script>
import selectStation from "../station/selectStation.vue"
import inveterFilter from '../station/inveterFilter.vue'
import dateMonthPicker from '../datepicker/dateMonthPicker.vue'

export default {
    name: "powerCompare",
	components:{		
        selectStation, inveterFilter, dateMonthPicker
	},
    data() {
        return {
            activeName: "first",
            powerCompareTitle: 'No.1234',
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
        selectLastMonth() {
            this.dateSelected = this.dateSelected.getTime() - 3600 * 1000 * 24 * 30;
            this.dateSelected = new Date(this.dateSelected);
        },
        selectNextMonth() {
            this.dateSelected = this.dateSelected.getTime() + 3600 * 1000 * 24 * 30;
            this.dateSelected = new Date(this.dateSelected);
        }
    }
};
</script>
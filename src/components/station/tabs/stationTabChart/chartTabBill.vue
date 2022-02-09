<template>
    <div class="chart_tab_container">
        <div class="chart_tab_top chart_tab_bill">
            <dateMonthPicker
                :parent-picker-type="pickerType"
                :parent-date="dateSelected"
                :parent-is-disabled="isDisabled"
                @select-last-month="selectLastMonth"
                @select-next-month="selectNextMonth"
            />
            <el-button
                class="btn_chart_new_bill"
                type="primary"
                v-show="!isShow && !isDisabled"
                @click="showBillUpload"
            >
                新增電費單
            </el-button>
            <el-button
                class="btn_chart_download"
                v-show="!isShow && !isDisabled"
            >
                下載
            </el-button>
        </div>
        <div class="bill_upload_page" v-show="isShow | isDisabled">
            <el-upload
                class="bill_upload_area"
                drag
                multiple
                action="https://jsonplaceholder.typicode.com/posts/"
            >
                <div>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        將文件拖曳到此處，或<em>點擊上傳</em>
                    </div>
                    <div class="el-upload__tip" slot="tip">
                        範例解釋文字 只能上傳 JPG / PNG
                    </div>
                </div>
            </el-upload>
        </div>
        <el-button
            class="btn_chart_new_bill"
            type="primary"
            v-show="isShow"
            @click="closeBillUpload"
        >
            確認上傳
        </el-button>

        <div v-show="isDisabled">
            <div v-if="!isUpdated" class="btn_update_bill_container">
                <el-button
                    class="btn_chart_delete_record"
                    @click="deleteBillRecord"
                >
                    刪除紀錄
                </el-button>
                <el-button
                    class="btn_chart_update_bill"
                    type="primary"
                    @click="updateBillRecord"
                >
                    更新此紀錄
                </el-button>
                <el-button class="btn_chart_download"> 下載 </el-button>
            </div>
            <div v-else>
                <el-button
                    class="btn_chart_update_bill"
                    type="primary"
                    @click="closeBillRecord"
                >
                    確認更新
                </el-button>
            </div>
        </div>

        <div class="chart_data_table" v-show="!isShow && !isDisabled">
            <el-table
                :data="chartTableData"
                class="bill_el_table"
                stripe
                highlight-current-row
            >
                <el-table-column
                    prop="chartType"
                    label="報表類型"
                    min-width="120"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="station"
                    label="電站"
                    align="center"
                    min-width="100"
                >
                </el-table-column>
                <el-table-column
                    prop="deviceGroup"
                    label="分組"
                    align="center"
                    min-width="180"
                >
                </el-table-column>
                <el-table-column
                    prop="chartMonth"
                    label="月份"
                    align="center"
                    min-width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="kWh"
                    label="本期度數 kWh"
                    align="center"
                    min-width="140"
                >
                </el-table-column>
                <el-table-column
                    prop="cost"
                    label="本期電費 元"
                    align="center"
                    min-width="130"
                >
                </el-table-column>
                <el-table-column
                    prop="uploadTime"
                    label="上傳時間"
                    align="center"
                    min-width="120"
                >
                </el-table-column>
                <el-table-column
                    prop="dateRange"
                    label=""
                    align="center"
                    min-width="100"
                >
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            class="btn_check_bill"
                            @click="showSingleRecord(scope.$index, scope.row)"
                            plain
                        >
                            查看
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    type="selection"
                    label=""
                    width="60"
                    align="center"
                >
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<style>
</style>

<script>
import dateMonthPicker from "../../../datepicker/dateMonthPicker.vue";

export default {
    name: "chart_tab_bill",
    components: {
        dateMonthPicker,
    },
    data() {
        return {
            isShow: false,
            isDisabled: false,
            isUpdated: false,
            pickerType: "month",
            dateSelected: "",
            chartTableData: [
                {
                    chartType: "電費單",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    chartMonth: "2021-10",
                    kWh: "123,123,123",
                    cost: "123,123,123",
                    uploadTime: "2021-10-2 13:00",
                },
                {
                    chartType: "電費單",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    chartMonth: "2021-10",
                    kWh: "123,123,123",
                    cost: "123,123,123",
                    uploadTime: "2021-10-2 13:00",
                },
                {
                    chartType: "電費單",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    chartMonth: "2021-10",
                    kWh: "123,123,123",
                    cost: "123,123,123",
                    uploadTime: "2021-10-2 13:00",
                },
                {
                    chartType: "電費單",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    chartMonth: "2021-10",
                    kWh: "123,123,123",
                    cost: "123,123,123",
                    uploadTime: "2021-10-2 13:00",
                },
                {
                    chartType: "電費單",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    chartMonth: "2021-10",
                    kWh: "123,123,123",
                    cost: "123,123,123",
                    uploadTime: "2021-10-2 13:00",
                },
                {
                    chartType: "電費單",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    chartMonth: "2021-10",
                    kWh: "123,123,123",
                    cost: "123,123,123",
                    uploadTime: "2021-10-2 13:00",
                },
                {
                    chartType: "電費單",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    chartMonth: "2021-10",
                    kWh: "123,123,123",
                    cost: "123,123,123",
                    uploadTime: "2021-10-2 13:00",
                },
                {
                    chartType: "電費單",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    chartMonth: "2021-10",
                    kWh: "123,123,123",
                    cost: "123,123,123",
                    uploadTime: "2021-10-2 13:00",
                },
            ],
        };
    },
    created() {
        this.dateSelected = new Date();
    },
    methods: {
        showBillUpload() {
            this.isShow = true;
            this.isDisabled = false;
        },
        closeBillUpload() {
            this.isShow = false;
        },
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
        showSingleRecord(idx, row) {
            this.isDisabled = true;
        },
        deleteBillRecord() {},
        closeBillRecord() {
            this.isUpdated = false;
            this.isShow = false;
            this.isDisabled = false;
        },
        updateBillRecord() {
            this.isUpdated = true;
        },
    },
};
</script>
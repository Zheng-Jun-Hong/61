<template>
    <div class="chart_tab_container">
        <div class="chart_tab_top">
            <timeRangePicker />
            <el-button class="btn_chart_download">下載</el-button>
        </div>

        <div class="chart_data_table">
            <el-table
                :data="chartTableData"
                stripe
                highlight-current-row
            >
                <el-table-column
                    prop="chartType"
                    label="報表類型"
                    min-width="80"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="station"
                    label="電站"
                    align="center"
                    min-width="80"
                >
                </el-table-column>
                <el-table-column
                    prop="deviceGroup"
                    label="分組"
                    align="center"
                    min-width="80"
                >
                </el-table-column>
                <el-table-column
                    prop="dateRange"
                    label="時間"
                    align="center"
                    min-width="80"
                >
                </el-table-column>
                <el-table-column
                    fixed="right"
                    type="selection"
                    label="download"
                    width="60"
                    align="center"
                >
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import timeRangePicker from "../../../datepicker/timeRangePicker.vue";

export default {
    name: "chartTabAll",
    components: { timeRangePicker },
    data() {
        return {
            allCharts: [],
            chartTableData: [
                {
                    chartType: "日報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-09",
                },
                {
                    chartType: "日報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10",
                },
                {
                    chartType: "日報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-11",
                },
                {
                    chartType: "週報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2020-12-17",
                },
                {
                    chartType: "週報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2020-12-17",
                },
                {
                    chartType: "旬報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2020-12-20",
                },
                {
                    chartType: "旬報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2020-12-20",
                },
                {
                    chartType: "月報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2021-01-10",
                },
                {
                    chartType: "月報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2021-01-10",
                },
                {
                    chartType: "年報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2021-12-10",
                },
                {
                    chartType: "年報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2021-12-10",
                },
            ],
        };
    },
};
</script>

<style>
</style>
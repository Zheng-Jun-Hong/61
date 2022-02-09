<template>
    <div class="chart_tab_container">
        <div class="chart_tab_top">
            <timeRangePicker />
        </div>
        <div class="chart_select_inverter">
            <!-- 警報類型選單 -->
            <el-select  v-model="selectedInverter" placeholder="選擇變流器">
                <el-option
                    v-for="inverter in inverterList"
                    :key="inverter.value"
                    :label="inverter.label"
                    :value="inverter.value"
                >
                </el-option>
            </el-select>
            <el-button class="btn_chart_download">下載</el-button>
        </div>
        <div class="chart_data_table">
            <el-table
                :data="chartTableData"
                class="inverter_el_table"
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
            selectedInverter:"",
            inverterList: [
                { value: "Inverter 1" },
                { value: "Inverter 2" },
                { value: "Inverter 3" },
                { value: "Inverter 4" },
                { value: "Inverter 5" },
                { value: "Inverter 6" },
                { value: "Inverter 7" },
                { value: "Inverter 8" },
                { value: "Inverter 9" },
                { value: "Inverter 10" },
            ],
            chartTableData: [
                {
                    chartType: "變流器報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-09",
                },
                {
                    chartType: "變流器報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10",
                },
                {
                    chartType: "變流器報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-11",
                },
                {
                    chartType: "變流器報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2020-12-17",
                },
                {
                    chartType: "變流器報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2020-12-17",
                },
                {
                    chartType: "變流器報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2020-12-20",
                },
                {
                    chartType: "變流器報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2020-12-20",
                },
                {
                    chartType: "變流器報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2021-01-10",
                },
                {
                    chartType: "變流器報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2021-01-10",
                },
                {
                    chartType: "變流器報表",
                    station: "上萬安段",
                    deviceGroup: "上萬安段-地號5、33、34",
                    dateRange: "2020-12-10~2021-12-10",
                },
                {
                    chartType: "變流器報表",
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
<template>
    <div class="history_container"  v-loading="loading">
        <div style="display: flex; align-items: center; padding: 1rem;">
            <!-- <label style="color: #656D74; margin-right: auto;">{{
                dataName
            }}</label> -->
                <el-select v-model="date_range" v-if="date_range != 0" placeholder="Select" class="date_type_selection">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select>
            <el-button size="small" type="primary" @click="oneline_download">
                輸出CSV
            </el-button>
        </div>
        <div id="plot_div"></div>
        <div class="el_table_container" style="margin: .5rem; max-width: 99%;"
        v-if="statTableShow">
            <el-table :data="tableData" empty-text="無資料">
                <el-table-column
                    v-for="(item, i) in tableHead"
                    :key="i"
                    align="center"
                    :prop="item.prop"
                    :label="item.label"
                    min-width="40"
                >
                </el-table-column>
            </el-table>
        </div>
        <div class="time_range_selector" style="margin-left: .5rem;">
            <timeRangePicker v-model="date_selection" />
        </div>
    </div>
</template>
<script>
import timeRangePicker from "../../../datepicker/timeRangePickerSimple.vue";
import Plotly from "plotly.js";
import c from 'assets/js/common.js'


export default {
    name: "dataHistoryData",
    components: {
        timeRangePicker
    },
    props:{
        dataName: {type: String, require: true},
        dataType: {type: String, require: true},
        dataCollection: {type: String, require: true},
        dataId: {type: String, require: true},
        parentName: {type: String},
        statTableShow: {type: Boolean, default: true},
        ieeeCode:{type:String, require: false, default: null}
    },
    data(){
        return {
            date_selection: {},
            options: [{
                value: 1,
                label: '日'
            }, {
                value: 2,
                label: '月'
            },{
                value: 3,
                label: '年'
            },{
                value: 4,
                label: '歷年'
            }],
            date_range: 0,
            loading: true,
            tableHead: [{
                lable: '',
                prop: 'datatype'
            },
            {
                lable: '最大值',
                prop: 'max'
            }],
            tableData: [],
        }
    },
    methods: {
        pfvalue(y_axis) {
            //公因數值轉換
            for (var i = 0; i < y_axis.length; ++i) {
                if (y_axis[i] == 0) {
                var allzero = true
                for (var j = 1, k = 1; j <= i || k < y_axis.length - 1 - i; j++, k++) {
                    try {
                    if (y_axis[i - j] > 0 && i >= 0) {
                        y_axis[i] = 1
                        allzero = false
                        break
                    } else if (y_axis[i - j] < 0 && i >= 0) {
                        y_axis[i] = -1
                        allzero = false
                        break
                    }

                    if (y_axis[i + k] > 0 && i < y_axis.length) {
                        y_axis[i] = 1
                        allzero = false
                        break
                    } else if (y_axis[i + k] < 0 && i < y_axis.length) {
                        y_axis[i] = -1
                        allzero = false
                        break
                    }
                    } catch (e) {
                    console.log("error")
                    }
                }
                if (allzero == true) {
                    for (var z = 0; z < y_axis.length; ++z) {
                    y_axis[z] = 1
                    }
                    break
                }
                } else if (y_axis[i] <= 1 && y_axis[i] > 0) {
                y_axis[i] = c.round(Math.abs(y_axis[i] - 1), 3)
                } else if (y_axis[i] < 0 && y_axis[i] >= -1) {
                y_axis[i] = c.round(Math.abs(y_axis[i]) - 1, 3)
                } else {
                y_axis[i] = null
                }
            }
            //console.log(y_axis)
            return y_axis
        },
        plot(plot_obj, that, x, y, title, name, type, y_title, pf = false) {
            //console.log(id)
            //console.log(x)
            //console.log(y)
            //console.log(y_title)

            if (pf == false) {
                var trace1 = {
                    type: type,
                    mode: "lines",
                    name: name,
                    x: x,
                    y: y,
                    line: { color: "#17BECF" },
                }
                var yaxis_set = {
                    title: {
                        text: y_title,
                    },
                    rangemode: "tozero",
                    autorange: true,
                    type: "linear",
                }
            } else {
                var text = []
                for (var i in y) {
                    text.push(y[i])
                }
                y = that.pfvalue(y)

                var trace1 = {
                    type: type,
                    mode: "lines",
                    name: name,
                    hoverinfo: "text",
                    x: x,
                    y: y,
                    text: text,
                    line: { color: "#17BECF" },
                }
                var yaxis_set = {
                    title: {
                        text: y_title,
                    },
                    autorange: true,
                    type: "linear",
                    tickmode: "array", // If "array", the placement of the ticks is set via `tickvals` and the tick text is `ticktext`.
                    tickvals: [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1],
                    ticktext: [
                        "0(lag)",
                        "-0.25",
                        "-0.5",
                        "-0.75",
                        "1",
                        "0.75",
                        "0.5",
                        "0.25",
                        "0(lead)",
                    ],
                }
            }

            var data = [trace1]
            var layout = {
                title: {
                    text: title,
                    font: {
                        family: "Courier New, monospace",
                        size: 30,
                },
                },
                xaxis: {},
                yaxis: yaxis_set,
                width: plot_obj.clientWidth,
                height: plot_obj.clientHeight,
                margin: c.plot_margin(),
            }
            Plotly.newPlot(plot_obj, data, layout, {
                displaylogo: false,
                modeBarButtonsToRemove: [
                "sendDataToCloud",
                "hoverClosestCartesian",
                "hoverCompareCartesian",
                "toggleSpikelines",
                ],
            })
        },
        plot_p_sun(plot_obj, that, x, y, title) {
            var data = []
            var color = ["#17BECF", "#CC0000"]

            for (var i in y) {
                if (i == 0) {
                data.push({
                    mode: "lines",
                    name: "功率",
                    x: x,
                    y: y[i],
                    yaxis: "y",
                    line: { color: color[i] },
                })
                } else {
                //console.log(x,y[i])
                data.push({
                    mode: "lines",
                    name: "照度",
                    x: x,
                    y: y[i],
                    yaxis: "y2",
                    line: { color: color[i] },
                })
                }
            }
            var layout = {
                title: {
                text: title,
                font: {
                    family: "Courier New, monospace",
                    size: 30,
                },
                },
                xaxis: {
                    domain: [0.1, 0.94],
                    anchor: "free",
                    position: 0,
                },
                yaxis: {
                    title: {
                        text: "功率(kW)",
                    },
                    range: [Math.min(...y[0]), Math.max(...y[0])],
                    type: "linear",
                },
                yaxis2: {
                    title: {
                        text: "照度(W/m²)",
                    },
                    range: [Math.min(...y[0]), Math.max(...y[1])],
                    type: "linear",
                    anchor: "x",
                    overlaying: "y",
                    side: "right",
                },
                width: plot_obj.clientWidth,
                height: plot_obj.clientHeight,
                margin: c.plot_margin(),
            }
            Plotly.newPlot(plot_obj, data, layout, {
                displaylogo: false,
                modeBarButtonsToRemove: [
                "sendDataToCloud",
                "hoverClosestCartesian",
                "hoverCompareCartesian",
                "toggleSpikelines",
                ],
            })
        },
        plot_sa(plot_obj, that, x, y, title, name) {
            var data = []
            var color = [
                "black",
                "darkred",
                "darkorange",
                "olive",
                "darkgreen",
                "darkblue",
                "indigo",
                "crimson",
                "sandybrown",
                "khaki",
                "greenyellow",
                "lightblue",
                "mediumorchid",
                "brown",
                "pink",
                "thistle",
                "lightseagreen",
            ]
            for (var i=0; i<that.$parent.serial_num; i++) {
                data.push({
                type: "scatter",
                mode: "lines",
                name: name[i],
                x: x,
                y: y[i],
                yaxis: "y",
                line: { color: color[i] },
                })
            }
           // console.log(data)

            var layout = {
                title: {
                text: title,
                font: {
                    family: "Courier New, monospace",
                    size: 30,
                },
                },
                xaxis: {
                domain: [0.1, 0.94],
                anchor: "free",
                position: 0,
                },
                yaxis: {
                title: {
                    text: "電流(A)",
                },
                rangemode: "tozero",
                autorange: true,
                type: "linear",
                },

                hovermode: "closest",
                hoverlabel: {
                bgcolor: "#FFFFFF",
                bordercolor: "#888888",
                font: {
                    color: "#000000",
                },
                },
            }
            Plotly.newPlot(plot_obj, data, layout, {
                displaylogo: false,
                modeBarButtonsToRemove: [
                "sendDataToCloud",
                "hoverClosestCartesian",
                "hoverCompareCartesian",
                "toggleSpikelines",
                ],
            })
        },
        plot_io_multi(plot_obj, that, x, y, title, name) {
            var data = []
            var color = [
                "black",
                "darkred",
                "darkorange",
                "olive",
                "darkgreen",
                "darkblue",
                "indigo",
                "crimson",
                "sandybrown",
                "khaki",
                "greenyellow",
                "lightblue",
                "mediumorchid",
                "brown",
                "pink",
                "thistle",
                "lightseagreen",
            ]
            for (var i=0; i<8; i++) {
                data.push({
                type: "scatter",
                mode: "lines",
                name: name[i],
                x: x,
                y: y[i],
                yaxis: "y",
                line: { color: color[i] },
                })
            }
           // console.log(data)

            var layout = {
                title: {
                text: title,
                font: {
                    family: "Courier New, monospace",
                    size: 30,
                },
                },
                xaxis: {
                domain: [0.1, 0.94],
                anchor: "free",
                position: 0,
                },
                yaxis: {
                    title: {
                        text: "狀態",
                    },
                    tickvals: ["0", "1"],
                    ticktext: ["OFF", "ON"],

                    type: "linear",
                },

                hovermode: "closest",
                hoverlabel: {
                bgcolor: "#FFFFFF",
                bordercolor: "#888888",
                font: {
                    color: "#000000",
                },
                },
            }
            Plotly.newPlot(plot_obj, data, layout, {
                displaylogo: false,
                modeBarButtonsToRemove: [
                "sendDataToCloud",
                "hoverClosestCartesian",
                "hoverCompareCartesian",
                "toggleSpikelines",
                ],
            })
        },
        plot_io(plot_obj, that, x, y, title, name, y_title) {
            //console.log(id)
            //console.log(x)
            //console.log(y)
            //console.log(y_title)

            
            var trace1 = {
                type: "scatter",
                mode: "lines",
                name: name,
                x: x,
                y: y,
                line: { color: "#17BECF" },
            }
                      
            var data = [trace1]
            var layout = {
                title: {
                text: title,
                font: {
                    family: "Courier New, monospace",
                    size: 30,
                },
                },
                xaxis: {
                domain: [0.1, 0.94],
                anchor: "free",
                position: 0,
                },
                yaxis: {
                    title: {
                        text: "狀態",
                    },
                    tickvals: ["0", "1"],
                    ticktext: ["OFF", "ON"],

                    type: "linear",
                },

                hovermode: "closest",
                hoverlabel: {
                bgcolor: "#FFFFFF",
                bordercolor: "#888888",
                font: {
                    color: "#000000",
                },
                },
            }
            Plotly.newPlot(plot_obj, data, layout, {
                displaylogo: false,
                modeBarButtonsToRemove: [
                "sendDataToCloud",
                "hoverClosestCartesian",
                "hoverCompareCartesian",
                "toggleSpikelines",
                ],
            })
        },
        plot_protective_relay(plot_obj, that, x, y, title, name_list){
            var data = []
            var color = [
                "black",
                "darkred",
                "darkorange",
                "olive",
                "darkgreen",
                "darkblue",
                "indigo",
                "crimson",
                "sandybrown",
                "khaki",
                "greenyellow",
                "lightblue",
                "mediumorchid",
                "brown",
                "pink",
                "thistle",
                "lightseagreen",
                "lightgrey",
                "lightpink",
                "lightsalmon",
                "lightseagreen",
                "lightskyblue",
                "lightyellow",
                "lime",
                "linen",
                "magenta",
                "maroon",
                "mediumaquamarine",
                "mediumvioletred",
                "midnightblue",
                "moccasin",
                "orangered"
            ]
            // alert(this.ieeeCode)
            for (var i=0; i<name_list.length; i++) {
                data.push({
                    type: "scatter",
                    mode: "lines",
                    name: name_list[i],
                    x: x,
                    y: y[i],
                    yaxis: "y",
                    line: { color: color[i] }
                })
            }
            var layout = {
                title: {
                    text: title,
                    font: {
                        family: "Courier New, monospace",
                        size: 30,
                    },
                },
                xaxis: {
                    domain: [0.1, 0.94],
                    anchor: "free",
                    position: 0,
                },
                yaxis: {
                    title: {
                        text: "跳脫狀態",
                    },
                },

                hovermode: "closest",
                hoverlabel: {
                    bgcolor: "#FFFFFF",
                    bordercolor: "#888888",
                    font: {
                        color: "#000000",
                    },
                },
            }
            Plotly.newPlot(plot_obj, data, layout, {
                displaylogo: false,
                modeBarButtonsToRemove: [
                "sendDataToCloud",
                "hoverClosestCartesian",
                "hoverCompareCartesian",
                "toggleSpikelines",
                ],
            })
        },
        history_info(that, x, min, max, avg, total, _datatype, datatype, num = 1) {
            //console.log(x, min, max, avg, total)
            num = 5
            that.tableHead = []
            that.tableData = []
            for (var i in min) {
                var minimum = c.round(min[i]["value"], num)
                var min_time_index = min[i]["time"]
                var maximum = c.round(max[i]["value"], num)
                var max_time_index = max[i]["time"]
                var avg_num = c.round(avg[i]["value"], 3)
                var total_num = c.round(total[i]["value"], 3)

                if (min_time_index != null) {
                    var min_time = x[min_time_index]
                } else {
                    var min_time = "---"
                }
                if (max_time_index != null) {
                    var max_time = x[max_time_index]
                } else {
                    var max_time = "---"
                }
                //console.log(datatype)
                if (datatype == "kwh") {
                    that.tableHead = [{
                        prop: 'datatype',
                        lable: ''
                        },
                        {
                            prop: 'min',
                            label: '最小值',
                        },
                        {
                            prop: 'max',
                            label: '最大值',
                        },
                        {
                            prop: 'avg',
                            label: '平均值',
                        },
                        {
                            prop: 'total',
                            label: '加總值',
                        }
                    ]
                    that.tableData.push({
                        datatype: Array.isArray(_datatype) ? _datatype[i] : _datatype,
                        min: minimum,
                        max: maximum,
                        avg: avg_num,
                        total: total_num,
                    })
                } else {
                    that.tableHead = [{
                        prop: 'datatype',
                        lable: ''
                        },
                        {
                            prop: 'min',
                            label: '最小值',
                        },
                        {
                            prop: 'max',
                            label: '最大值',
                        },
                        {
                            prop: 'avg',
                            label: '平均值',
                        },
                    ]
                    that.tableData.push({
                        datatype:Array.isArray(_datatype) ? _datatype[i] : _datatype,
                        min: minimum,
                        max: maximum,
                        avg: avg_num,
                    })
                }
            }
        },
        history_data_list(){
            this.loading = true
            let that = this
            let datatype = this.dataType
            let history_ID = this.dataId
            let history_name = this.parentName

            this.axios.post('/history_data_list',{
                history_ID: this.dataId,
                datacollection: this.dataCollection,
                datatype: this.dataType,
                date_range: this.date_range,
                datepicker1: this.date_selection.date_list[0],
                datepicker2: this.date_selection.date_list[1],
                "IEEE_code": this.ieeeCode

            }).then(function(data){
                let plot_data = data.data.data
                //console.log(plot_data)
                var y_title = ""
                var type = "scatter"
                var x_axis = plot_data.x_axis
                var y_axis = plot_data.y_axis
                var _datatype = [datatype]
                var id = "#" + history_ID
                var num = 1
                var time_year = data.time_year

                const MyPlot = document.getElementById('plot_div')
                MyPlot.innerHTML = ""

                if (
                    that.dataCollection == "pv_plant" ||
                    that.dataCollection == "pv_lgroup" ||
                    that.dataCollection == "pv_group" ||
                    that.dataCollection == "pv_meter"
                ) {
                    if (datatype == "p") {
                        y_title = "功率(kW)"
                    } else if (datatype == "PR") {
                        y_title = "PR"
                        type = "bar"
                    }else if (datatype == "PSH") {
                        y_title = "PSH"
                        type = "bar"
                    } 
                    else if (datatype == "r_rate") {
                        y_title = "Percent Operating Reserve(％)"
                    } else if (datatype == "kwh") {
                        y_title = "發電量(kWh)"
                        type = "bar"
                    } else if (datatype == "v") {
                        y_title = "電壓(V)"
                    } else if (datatype == "f") {
                        y_title = "頻率(Hz)"
                    } else if (datatype == "i") {
                        y_title = "電流(A)"
                    }
                    _datatype = [datatype, "sun"]
                    if (datatype == "p") {
                        y_title = "功率(kW)"
                        _datatype = ["功率", "照度(W/m2)"]
                        that.plot_p_sun(
                            MyPlot,
                            that,
                            x_axis,
                            y_axis,
                            history_name + " " + "功率(kW)"
                        )
                    } else {
                        _datatype = [y_title]
                        that.plot(
                            MyPlot,
                            that,
                            x_axis,
                            y_axis,
                            history_name + " " + y_title,
                            datatype,
                            type,
                            y_title
                        )
                    }
                } else if (that.dataCollection == "inverter") {
                    //console.log(datatype)
                    if (datatype == "p_cell_total") {
                        y_title = "直流功率(kW)"
                        _datatype = ["功率", "照度(W/m2)"]

                        that.plot_p_sun(
                            MyPlot,
                            that,
                            x_axis,
                            y_axis,
                            history_name + " " + "直流功率(kW)"
                        )
                    } else if (datatype == "p_bus_total") {
                        y_title = "交流功率(kW)"
                        _datatype = ["功率", "照度(W/m2)"]

                        that.plot_p_sun(
                            MyPlot,
                            that,
                            x_axis,
                            y_axis,
                            history_name + " " + "交流功率(kW)"
                    )
                    } else {
                    if (datatype == "kwh") {
                        y_title = "發電量(kWh)"
                        type = "bar"

                    } else if (datatype == "PR" || datatype == "RA") {
                        y_title = datatype
                        type = "bar"

                    } else if (datatype == "v_cell_1") {
                        y_title = "直流電壓1(V)"
                    } else if (datatype == "v_cell_2") {
                        y_title = "直流電壓2(V)"
                    } else if (datatype == "i_cell_1") {
                        y_title = "直流電流1(A)"
                    } else if (datatype == "i_cell_2") {
                        y_title = "直流電流2(A)"
                    } else if (datatype == "p_cell_1") {
                        y_title = "直流功率1(W)"
                    } else if (datatype == "p_cell_2") {
                        y_title = "直流功率2(W)"
                    } else if (datatype == "v_bus_1") {
                        y_title = "交流電壓L1(V)"
                    } else if (datatype == "v_bus_2") {
                        y_title = "交流電壓L2(V)"
                    } else if (datatype == "v_bus_3") {
                        y_title = "交流電壓L3(V)"
                    } else if (datatype == "i_bus_1") {
                        y_title = "交流電流L1(A)"
                    } else if (datatype == "i_bus_2") {
                        y_title = "交流電流L2(A)"
                    } else if (datatype == "i_bus_3") {
                        y_title = "交流電流L3(A)"
                    } else if (datatype == "p_bus_1") {
                        y_title = "交流功率L1(W)"
                    } else if (datatype == "p_bus_2") {
                        y_title = "交流功率L2(W)"
                    } else if (datatype == "p_bus_3") {
                        y_title = "交流功率L3(W)"
                    } else if (datatype == "f_bus_1") {
                        y_title = "頻率L1(Hz)"
                    } else if (datatype == "f_bus_2") {
                        y_title = "頻率L2(Hz)"
                    } else if (datatype == "f_bus_3") {
                        y_title = "頻率L3(Hz)"
                    } else if (datatype == "temp_inner") {
                        y_title = "Ambient溫度(°C)"
                    } else if (datatype == "temp_Boost_1") {
                        y_title = "Boost1溫度(°C)"
                    } else if (datatype == "temp_Boost_2") {
                        y_title = "Boost2溫度(°C)"
                    } else if (datatype == "temp_sink") {
                        y_title = "Inverter溫度(°C)"
                    }

                    _datatype = [y_title]
                    that.plot(
                        MyPlot,
                        that,
                        x_axis,
                        y_axis,
                        history_name + " " + y_title,
                        datatype,
                        type,
                        y_title
                    )
                    }
                } else if (that.dataCollection == "string_meter") {
                    if (datatype == "sa") {
                        let sa_name = []
                        for(var i=1; i<= that.$parent.serial_num; i++){
                            sa_name.push(`#${i}`)
                        }
                        _datatype = sa_name
                        that.plot_sa(
                            MyPlot,
                            that,
                            x_axis,
                            y_axis,
                            history_name + "串電流(A)", 
                            sa_name)
                    } else {
                    if (datatype == "v") {
                        y_title = "電壓(V)"
                    } else if (datatype == "i") {
                        y_title = "電流(A)"
                    } else if (datatype == "p") {
                        y_title = "功率(kW)"
                    } else if (datatype == "temp") {
                        y_title = "溫度(°C)"
                    } else if (datatype == "sa1") {
                        y_title = "串電流＃1(A)"
                    } else if (datatype == "sa2") {
                        y_title = "串電流＃2(A)"
                    } else if (datatype == "sa3") {
                        y_title = "串電流＃3(A)"
                    } else if (datatype == "sa4") {
                        y_title = "串電流＃4(A)"
                    } else if (datatype == "sa5") {
                        y_title = "串電流＃5(A)"
                    } else if (datatype == "sa6") {
                        y_title = "串電流＃6(A)"
                    } else if (datatype == "sa7") {
                        y_title = "串電流＃7(A)"
                    } else if (datatype == "sa8") {
                        y_title = "串電流＃8(A)"
                    } else if (datatype == "sa9") {
                        y_title = "串電流＃9(A)"
                    } else if (datatype == "sa10") {
                        y_title = "串電流＃10(A)"
                    } else if (datatype == "sa11") {
                        y_title = "串電流＃11(A)"
                    } else if (datatype == "sa12") {
                        y_title = "串電流＃12(A)"
                    } else if (datatype == "sa13") {
                        y_title = "串電流＃13(A)"
                    } else if (datatype == "sa14") {
                        y_title = "串電流＃14(A)"
                    } else if (datatype == "sa15") {
                        y_title = "串電流＃15(A)"
                    } else if (datatype == "sa16") {
                        y_title = "串電流＃16(A)"
                    }
                    _datatype = [y_title]
                    that.plot(
                        MyPlot,
                        that,
                        x_axis,
                        y_axis,
                        history_name + " " + y_title,
                        datatype,
                        type,
                        y_title
                    )
                    }
                } else if (that.dataCollection == "sensor") {
                    _datatype = [y_title]
                    that.plot(
                        MyPlot,
                        that,
                        x_axis,
                        y_axis,
                        history_name,
                        datatype,
                        type,
                        y_title
                    )
                } else if (that.dataCollection == "pv_io") {
                    if (datatype == "DI") {
                        let io_name = []
                        for(var i=1; i<= 8; i++){
                            io_name.push(`DI${i}`)
                        }
                        _datatype = io_name
                        that.plot_io_multi(
                            MyPlot,
                            that,
                            x_axis,
                            y_axis,
                            history_name + "狀態", 
                            io_name)
                    } else {
                        y_title = `${datatype}狀態`
                        _datatype = [y_title]
                        that.plot_io(
                            MyPlot,
                            that,
                            x_axis,
                            y_axis,
                            history_name + " " + y_title,
                            datatype,
                            y_title
                        )
                    }

                } else if (that.dataCollection == "ProtectiveRelay") {
                    var name_list = plot_data["name_list"]
                    _datatype = name_list
                    that.plot_protective_relay(
                        MyPlot,
                        that,
                        x_axis,
                        y_axis,
                        that.dataName,
                        name_list
                    )
                }
                that.history_info(
                    that,
                    x_axis,
                    plot_data.min,
                    plot_data.max,
                    plot_data.avg,
                    plot_data.total,
                    _datatype,
                    datatype,
                    num
                )


                that.loading = false
            })
        },
        oneline_download() {
            var csvList = []
            var memberContent = ""
            var csvContent

            //csv title 處理
            let title = document.querySelector("#plot_div text.gtitle").innerHTML
            if(title == undefined || title == null){
                title = "export"
            }
            if(title.split(' ').length > 1){
                title = title.split(' ')[0] + "_" + title.split(' ')[1].split('(')[0]
            }else{
                title = title.split(' ')[0].split('(')[0]
            }
            let filename = title + ".csv"

            var gd = document.getElementById("plot_div")

            //console.log(gd.data)
            var regList = ["number", "time"]
            for (var i = 0; i < gd.data.length; i++) {
                regList.push(gd.data[i].name)
            }
            csvList.push(regList)

            var x = gd.data[0].x

            for (var j = 0; j < x.length; j++) {
                var regList = []
                regList.push(j + 1)
                regList.push(x[j])
                for (var i = 0; i < gd.data.length; i++) {
                regList.push(gd.data[i].y[j])
                }
                csvList.push(regList)
            }

            console.log(csvList)
            // 產生 csv 內容
            csvList.forEach(function (rowArray) {
                var row = rowArray.join(",")
                memberContent += row + "\r\n"
            })

            // 產生 csv Blob
            csvContent = URL.createObjectURL(
                new Blob(["\uFEFF" + memberContent], {
                type: "text/csv;charset=utf-8;",
                })
            )
            // 產生 csv 連結
            var link = document.createElement("a")
            document.body.appendChild(link)
            link.href = csvContent
            link.download = filename
            link.click()
            }
    },
    mounted(){
        if(['kwh', 'PR', 'dmy', 'RA', 'PSH'].includes(this.dataType)){
            this.date_range = 1
        }else{
            this.date_range = 0
        }
    },
    watch: {
        date_range(){
            this.history_data_list()
        },
        date_selection(){
            this.history_data_list()
        },
        ieeeCode(){
            this.history_data_list()
        }
    }
}
</script>
<style scoped>
.date_type_selection{
    margin-right: 1rem;
}
#plot_div{
    position: relative; 
    padding: 1rem; 
    min-height: 400px;
    max-width: 95%
}
.history_container{
    height: 650 px;
    position: relative;
    min-width: 80%;
    background: #ffffff;
    border-radius: 1rem;
    box-shadow: 0 0 15px #DEE4EA;
}
</style>
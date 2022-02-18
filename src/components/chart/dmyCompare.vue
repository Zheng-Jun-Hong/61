<template>
    <div class="history_container" v-loading="loading">
        <div style="display: flex; align-items: center; padding: 1rem; margin-left: 1.5rem;">
            <el-select v-model="date_range" v-if="date_range != 0" placeholder="Select" class="date_type_selection">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select>
            <el-button size="small" type="primary" @click="online_download">
                輸出CSV
            </el-button>
        </div>
        <div id="plot_dmy"></div>
        <div class="time_range_selector" style="margin-left: 8.5rem;">
            <timeRangePicker v-model="date_selection" />
        </div>

    </div>
</template>


<script>
import Plotly from "plotly.js";
import c from 'assets/js/common.js'
import timeRangePicker from "../datepicker/timeRangePickerSimple.vue";
export default {
    name: "dmyCompare",
    components:{
        timeRangePicker
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
            loading: true,
            date_range: 1,
            ID_list: [],
        }
    },
    methods: {
        initial(){
            let that = this
            this.axios.post('/stats_all_pv')
            .then(function(data){
                let compareData = data.data.data
                that.ID_list = compareData.ID_list
                that.history_data_list()
                //console.log(that.ID_list)
            })
        },
        plot(plot_obj, that, dmyDataList, irrhDataList){
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
            var data = []
            var counter = 0
            for(var i in dmyDataList){
                data.push({
                    type: "scatter",
                    mode: "lines+markers",
                    x: dmyDataList[i].x_axis,
                    y: dmyDataList[i].y_axis,
                    name: dmyDataList[i].label,
                    yaxis: "y",
                    line: { 
                        color: color[i],
                        shape: 'linear'
                    },
                    marker: {
                        size: 8
                    }
                })
                counter += 1
            }
            for(var i=0; i < irrhDataList.length; i++){
                data.push({
                    type: "scatter",
                    mode: "lines+markers",
                    x: irrhDataList[i].x_axis,
                    y: irrhDataList[i].y_axis,
                    name: irrhDataList[i].label,
                    yaxis: "y",
                    line: { 
                        color: color[i+counter],
                        shape: 'linear',
                        dash: 'dot'
                    },
                    marker:{
                        size: 8
                    }
                })
            }
            var layout = {
                title: {
                    text: "DMY",
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
                        text: "小時(h)",
                    },
                },
                width: plot_obj.clientWidth,
                height: plot_obj.clientHeight,
                margin: c.plot_margin(),
                legend:{
                    x: 0.11,
                    y: 1
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
            // console.log(data)
            console.log("width: "+ plot_obj.clientWidth)
            // console.log(x_axis)
            // console.log(y_axis)
            // console.log(label)
            
        },
        history_data_list(){
            this.loading = true
            let that = this
            this.axios.post('/ID_get_dmy_irrh_interval',{
                ID_list: this.ID_list,
                datepicker1: this.date_selection.date_list[0],
                datepicker2: this.date_selection.date_list[1],
                date_range: this.date_range
            }).then(function(data){
                let dmyData = data.data.data.return_list
                let irrhData = data.data.data.sun_list
                // console.log(dmyData)
                // console.log(irrhData)

                const MyPlot = document.getElementById('plot_dmy')
                MyPlot.innerHTML = ""

                that.plot(MyPlot, that, dmyData, irrhData)

                that.loading = false
            })


        },
        online_download(){
            var csvList = []
            var memberContent = ""
            var csvContent
            let title = "DMY比較_"
            let datepicker1 = this.date_selection.date_list[0]
            let datepicker2 = this.date_selection.date_list[1]
            let select = this.options.find(element => element.value == this.date_range)

            if (datepicker1 === datepicker2){
                title += datepicker1
            }else{
                title = title + datepicker1 + "_" + datepicker2
            }
            title = title + "_" + select.label
            let filename = title + ".csv"

            var gd = document.getElementById("plot_dmy")
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

            //console.log(csvList)

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
    watch: {
        date_range(){
            this.history_data_list()
        },
        date_selection(){
            this.history_data_list()
        }
    },
    mounted(){
        this.initial()
    }
}
</script>

<style scoped>
.date_type_selection{
    margin-right: 1rem;
}
.history_container{
    height: 650 px;
    position: relative;
    min-width: 80%;
    background: #ffffff;
    border-radius: 1rem;
    box-shadow: 0 0 15px #DEE4EA;
}
#plot_dmy{
    position: relative; 
    padding: 16px 16px 0 16px; 
    min-height: 400px;
    max-width: 95%;
}
</style>

<template>
    <div class="stationtab_power">
        <div class="stapower_top">
            <dateMonthPicker
                :date-seleced="dateSelected"
                @set-date="setDate"
            />
            <inveterFilter :inveter-filter-data="inveterFilterData" :string-list="allData.stringList" 
            v-if="'stringList' in allData" @get_selected_index="get_selected_index"
            />
        </div>
        

        <div class="stbigimg_title">
            <div>{{stationData.name}}</div>
        </div>
        <div class="stbigimg">
            <div id="plot_div"></div>
        </div>
    </div>
</template>


<script>
import inveterFilter from '../inveterFilter.vue'
import dateMonthPicker from "../../datepicker/dateMonthPicker.vue";
import Plotly from "plotly.js";

export default {
    name: "stationTabPower",
    props: {
        stationData: Object,
    },
    components: {
        inveterFilter,
        dateMonthPicker,
    },
    data() {
        return {
            inveterFilterData: {
                popoverPosition: 'bottom',
            },
            dateSelected: "",
            isShow: true,
            isSelectAll: false,
            inverter_list: [],
            allData: {},
            sm_numObj: {},
        };
    },
    created() {
        this.dateSelected = new Date();
    },
    mounted() {
        this.pv_heatmap_string_pvlof_plot()
    },
    methods: {
        setDate(data){
            this.dateSelected = data
            
            this.pv_heatmap_string_pvlof_plot()
        },
        get_selected_index(data){
            this.sm_numObj = data
            //console.log(data)
            var gd = document.getElementById("plot_div")
            //console.log(gd.data)
            if (gd._dragging && !gd._transitioning) {
                // signal to drag handler that after everything else is done
                // we need to replot, because something has changed
                gd._replotPending = true
                return Promise.reject()
            } else {
                // we're going ahead with a replot now
                gd._replotPending = false
            }
            let [y_data, z_data] = this.heatmapYZData()
            Plotly.restyle("plot_div",{
                y: [y_data],
                z: [z_data]
            })
            /* Plotly.restyle("plot_div", "y", [y_data])
            Plotly.restyle("plot_div", "z", [z_data]) */
        },
        heatmapYZData() {
            let y_data = []
            let z_data = []
            for(var i in this.allData.y_axis){
                if(this.sm_numObj[i] == true){
                    y_data = y_data.concat(this.allData.y_axis[i])
                    z_data = z_data.concat(this.allData.z_axis[i])
                }
            }
            z_data = z_data.map((string) => {
                // return string.slice(108, 193)
                return string.slice(108, 181)
            })
            //console.log(y_data, z_data)
            return [y_data, z_data]
        },
        pv_heatmap_string_pvlof_plot(){
            let that = this
            this.axios.post('pv_heatmap_string_pvlof_plot', {
                ID: this.stationData.ID,
                datepicker: this.dateSelected
            }).then(function(data){
                console.log(data.data.data)
                that.allData = data.data.data
                let sm_count = 0
                for(var i in that.allData.stringList){
                    that.sm_numObj[sm_count] = true
                    sm_count += 1
                }

                let x_data = that.allData.x_axis.slice(108, 181)
                //console.log(x_data)
                let [y_data, z_data] = that.heatmapYZData()
                //console.log(y_data, z_data)
                let plot_data = [
                    {
                    z: z_data,
                    x: x_data,
                    y: y_data,
                    zmin: 0,
                    zmax: 15,
                    colorscale: [
                        ["0.0", "blue"],
                        ["0.6", "orange"],
                        ["1.0", "red"],
                    ],
                    type: "heatmap",
                    },
                ]

                let layout = {
                    width: document.getElementById("plot_div").clientWidth,
                    height:document.getElementById("plot_div").clientHeight,
                    margin: {
                        l: 80,
                        r: 50,
                        b: 40,
                        t: 50,
                        pad: 4,
                    },
                    title: {
                    text: `${that.stationData.name} ${that.dateSelected}`,
                    font: {
                        family: "Courier New, monospace",
                        size: 24,
                    },
                    },
                }
                document.getElementById("plot_div").innerHTML = ""
                Plotly.newPlot("plot_div", plot_data, layout, {
                    displaylogo: false,
                    modeBarButtonsToRemove: [
                    "sendDataToCloud",
                    "hoverClosestCartesian",
                    "hoverCompareCartesian",
                    "toggleSpikelines",
                    ],
                })
            })
        },
    },
};
</script>
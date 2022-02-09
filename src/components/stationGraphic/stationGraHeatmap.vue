<template>
    <div class="stationtab_power">
        <div class="stapower_top">
            <el-popover placement="bottom-start" trigger="click" style="margin-right: 1rem;">
                <el-button
                    size="medium"
                    slot="reference"
                    class="esicon_btn"
                >
                    <i class="icon-nav_factory"></i>選擇電站</el-button
                >
                <select-station-single-group :v-model="group_select" @setGroup="setGroup" />
            </el-popover>
            <div style="margin-right: 1rem;">
                <el-autocomplete
                    v-model="plant_search"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="搜尋"
                    value-key="name"
                    @select="handleSelect"
                ></el-autocomplete>
            </div>
            <dateMonthPicker
                :date-seleced="dateSelected"
                @set-date="setDate"
            />
             <inveterFilter :inveter-filter-data="inveterFilterData" :string-list="allData.stringList" 
                v-if="'stringList' in allData" @get_selected_index="get_selected_index"
              />
        </div>
       

        <div class="stbigimg_title">
            <div>{{title}}</div>
        </div>
        <div class="stbigimg">
            <div id="plot_div"></div>
        </div>
    </div>
</template>

<script>
import inveterFilter from '../station/inveterFilter.vue'
import dateMonthPicker from "../datepicker/dateMonthPicker.vue";
import selectStationSingleGroup from "../station/selectStation_singleGroup.vue"
import Plotly from "plotly.js";
import c from 'assets/js/common.js'

export default {
    name: "stationTabHeatmap",
    components: {
        dateMonthPicker,
        inveterFilter,
        selectStationSingleGroup,
    },
    data() {
        return {
            plant_search: "",
            title: '',
            inveterFilterData: {
                popoverPosition: 'bottom',
            },
            dateSelected: "",
            isShow: true,
            isSelectAll: false,
            group_select: [],
            inverter_list: [],
            allData: {},
            sm_numObj: {},
        }
    },
    created() {
    },
    methods: {
        setDate(data){
            this.dateSelected = data
            if(this.group_select.length > 0){
                this.pv_heatmap_string_pvlof_plot()
            }
        },
        setGroup(data){
            //console.log(data)
            this.group_select = data
            if(data.length != []){
                this.title = `${data[1]}/${data[2]}/${data[3]}`
                this.pv_heatmap_string_pvlof_plot()
            }
        },
        get_selected_index(data){
            this.sm_numObj = data
            console.log(data)
        },
        heatmapYZData() {
            let y_data = []
            let z_data = []
            for(var i in this.allData.y_axis){
                y_data = y_data.concat(this.allData.y_axis[i])
                z_data = z_data.concat(this.allData.z_axis[i])
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
                pv_name: this.group_select[1],
                pv_lgroup: this.group_select[2],
                pv_group: this.group_select[3],
                datepicker: this.dateSelected
            }).then(function(data){
                console.log(data.data.data)
                that.allData = data.data.data

                let x_data = that.allData.x_axis.slice(108, 181)
                console.log(x_data)
                let [y_data, z_data] = that.heatmapYZData()
                console.log(y_data, z_data)
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
                    text: `${that.group_select[2]}_${that.group_select[3]} ${that.dateSelected}`,
                    font: {
                        family: "Courier New, monospace",
                        size: 24,
                    },
                    },
                }
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
        async querySearchAsync(queryString, cb) {
			//console.log(queryString)
			//console.log(this.PV_data)
			await this.axios.post('/station_search_regex_group', {
                query: queryString
            }).then(data => {
                //console.log(data.data.data)
                if(data.data.data.length == 0){
                    cb([{'name': '無資料'}])
                }else{
                    cb(data.data.data)
                }
            })
		},
        handleSelect(item) {
			//console.log(item)
			if(item.name == '無資料'){
				return false
			}

			if(item.collection == 'pv_group'){
				this.setGroup([null, item.PV, item.lgroup, item.realName, null])
			}
		},
    }
};
</script>
<style scoped>
#plot_div{
    position: relative; 
    padding: 1rem; 
    min-height: 400px;
    max-width: 95%
}
</style>
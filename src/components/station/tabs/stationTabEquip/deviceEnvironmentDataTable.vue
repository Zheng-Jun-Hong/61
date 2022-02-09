<template>
    <div class="envir_device_data">
        <div class="el_table_container">
            <el-table
                :data="envirDeviceData"
                class="envir_data_table"
                highlight-current-row
                stripe
                v-if="Object.keys(envirDeviceData[0]).length > 0"
            >
                <el-table-column prop="" label="環境感測器" align="center">
                    <el-table-column
                        v-for="item in sensorData"
                        :key="item['ID']"
                        align="center"
                        :prop="item['ID']"
                        :label="item['name']"
                        min-width="200"
                    >
                        <template slot="header">
                            <div class="alertBall"
                            v-if="item['ID'] in stateData"
                            v-bind:style="{'background': statusBall[stateData[item['ID']]].color}" ></div>
                            <span>{{item.name}}</span>
                            <div class="statsUnit" style="flex-grow: unset;">{{item.unit}}</div>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
        <data-history-data :data-name="parentBtnDeviceName" :key="parentBtnDeviceId+'_'+'value'"
            :data-collection="'sensor'" :parent-name="parentBtnDeviceName"
            :data-type="'value'" :data-id="parentBtnDeviceId"/>
    </div>
</template>

<style scoped>
#plot_div{
    position: relative; 
    padding: 1rem; 
    min-height: 440px;
    max-width: 95%
}
</style>

<script>
import dataHistoryData from "./dataHistoryData.vue"

export default {
    name: "environmentDeviceDataTable",
    components:{
        dataHistoryData,
    },
    props: {
        parentBtnDeviceName: {
            type: String,
            requird: true,
        },
        parentBtnDeviceId: {
            type: String,
            requird: true,
        },
        sensorData: {
            type: Array,
            default(){
                return []
            }
        },
        statusBall: {
            type: Array
        }
    },
    data() {
        return {
            envirDeviceData: [
                {},
            ],
            date_selection: {},
            ID_list: [],
            stateData: {},
            name_unit_dict: {},
        };
    },
    methods: {
        pv_sensor_data(){
            let that = this
            this.axios.post('/pv_sensor_data',{
                ID_list: this.ID_list
            }).then(function(data){
                that.envirDeviceData = [{}]
                let _data = data.data.data
                _data.forEach(obj => {
                    that.stateData[obj.ID] = obj.state
                    that.envirDeviceData[0][obj.ID] =  obj.value
                })
            })
        },
        get_ID_list(){
            this.ID_list = []
            for(var i in this.sensorData){
                this.ID_list.push(this.sensorData[i].ID)
                this.name_unit_dict[this.sensorData[i].ID] = `${this.sensorData[i].name} ${this.sensorData[i].unit}`
            }
            this.pv_sensor_data()
        },
    },
    mounted(){
        let that = this
        this.get_ID_list()
        this.syncData = setInterval(function(){
                if(that.ID_list.length > 0){
                    that.pv_sensor_data()
                }
        }, 1000)
    },
    destroyed(){
        clearInterval(this.syncData)
    },
    watch: {
        sensorData(){
            this.get_ID_list()
        },
    }
};
</script>

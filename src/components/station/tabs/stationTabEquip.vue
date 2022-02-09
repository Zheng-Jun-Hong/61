<template>
    <div class="station_tab_device_info">
        <div class="tab_device_info_top">
            <h3 @click="resetBtnName">{{ equipData.tabTitle }}</h3>
            <div class="selc_btn_container">
                <el-tooltip placement="top-start" offset="-90" effect="light">
                    <div class="st_status_ball" slot="content">
                        <div
                            v-for="(item, idx) in equipData.statusBall"
                            :key="idx"
                        >
                            <i :style="{ background: item.color }"></i>
                            {{ item.name }}
                        </div>
                    </div>
                    <el-popover
                        placement="bottom-start"
                        trigger="click"
                        class="select_device_popup"
                    >
                        <el-button
                            size="medium"
                            slot="reference"
                            class="esicon_btn icon-ttl_sunboard"
                            style="width: 200px;"
                        >
                            <span class="selc_btn_title">{{
                                btnDeviceName
                            }}</span>
                            <span
                                class="slec_btn_alert_spot"
                                :v-model="equipData.alertStatus"
                                v-if="btnDeviceName != '選擇設備'"
                                :style="'background:'+ switchAlertClr"
                            ></span>
                        </el-button>

                        <select-device
                            :parent-btn-name="btnDeviceName"
                            :equip-select-data="equipSelectData"
                            :status-ball="equipData.statusBall"
                            :jump-equip-id="jumpEquipId"
                            @update-parent-btn-name="updateBtnName"
                        />
                    </el-popover>
                </el-tooltip>
            </div>
        </div>
        <div class="tab_device_data_table" v-if="btnDeviceName == '選擇設備' && deviceTableData.length > 0">
            <el-table
                :data="deviceTableData"
                class="device_info_table"
                height="70vh"
                stripe
                highlight-current-row
            >
                <el-table-column
                    prop="deviceName"
                    label="設備名稱"
                    width="150"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="deviceCapacity"
                    label="裝置容量 kW"
                    min-width="130"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="DC"
                    label="直流功率 kW"
                    min-width="130"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="AC"
                    label="交流功率 kW"
                    min-width="130"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="powerGeneration"
                    label="發電量 kWh"
                    min-width="130"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="tempEnvir"
                    label="Ambient溫度 °C"
                    min-width="130"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="tempInverter"
                    label="變流器溫度 °C"
                    min-width="140"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="RA"
                    label="RA %"
                    min-width="80"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="PR"
                    label="PR %"
                    min-width="80"
                    align="center"
                >
                </el-table-column>
            </el-table>
        </div>
        <div
            class="inverter_table_container"
            v-else-if="btnDeviceType == 'inv'"
        >
            <inverter-data-table :station-data="stationData"
                :parent-btn-device-name="btnDeviceName"
                :parent-btn-device-id="btnDeviceID"
                :parent-btn-device-collection="btnDeviceCollection"
            />
        </div>
        <div class="" v-else-if="btnDeviceType == 'string'">
            <smDeviceDataTable 
                :parent-btn-device-name="btnDeviceName"
                :parent-btn-device-id="btnDeviceID"
                :parent-btn-device-collection="btnDeviceCollection"
            />
        </div>
        <div class="" v-else-if="btnDeviceType == 'meter'">
            <deviceSmartMeterDataTable
                :parent-btn-device-name="btnDeviceName"
                :parent-btn-device-id="btnDeviceID"
                :parent-btn-device-collection="btnDeviceCollection"
            />
        </div>
        <div class="" v-else-if="btnDeviceType=='sensor'" >
            <deviceEnvironment :sensor-data="pv_sensor_list" 
                :parent-btn-device-name="btnDeviceName"
                :parent-btn-device-id="btnDeviceID"
                :status-ball="equipData.statusBall" 
            />
        </div>
        <div class="" v-else-if="btnDeviceType == 'io'">
            <pvIoTable
                :key="btnDeviceID"
                :parent-btn-device-name="btnDeviceName"
                :parent-btn-device-id="btnDeviceID"
                :parent-btn-device-collection="btnDeviceCollection"
            />
        </div>
        <div class="" v-else-if="btnDeviceType == 'ProtectiveRelay'">
            <protective-relay-table
                :key="btnDeviceID"
                :parent-btn-device-name="btnDeviceName"
                :parent-btn-device-id="btnDeviceID"
                :parent-btn-device-collection="btnDeviceCollection"
            />
        </div>
    </div>
</template>

<style scoped>
</style>

<script>
import selectDevice from "../selectDevice.vue";
import inverterDataTable from "./stationTabEquip/inverterDataTable.vue";
import smDeviceDataTable from "./stationTabEquip/smDeviceDataTable.vue";
import deviceSmartMeterDataTable from "./stationTabEquip/deviceSmartMeterDataTable.vue";
import deviceEnvironment from "./stationTabEquip/deviceEnvironmentDataTable.vue";
import pvIoTable from "./stationTabEquip/pvIoTable.vue"
import protectiveRelayTable from "./stationTabEquip/protectiveRelayTable.vue"

export default {
    name: "stationTabEquip",
    components: {
        selectDevice,
        inverterDataTable,
        smDeviceDataTable,
        deviceSmartMeterDataTable,
        deviceEnvironment,
        pvIoTable,
        protectiveRelayTable
    },
    props: {
        equipData: { type: Object, required: true },
        stationData: { type: Object, required: true },
        equipSelectData: {type: Object, required: true},
        jumpEquipId: {},
    },
    data() {
        return {
            alertStatus: 0,
            btnDeviceName: "選擇設備",
            btnDeviceID: null,
            btnDeviceCollection: null,
            btnDeviceType: null,
            deviceTableData: [
                /* {
                    deviceName: "Inverter 1",
                    deviceCapacity: "123,123",
                    AC: "4,432,333",
                    DC: "2,243,994",
                    powerGeneration: "123,123",
                    tempEnvir: "65",
                    tempInverter: "23",
                    RA: "76",
                    PR: "33",
                }, */
            ],
            pv_sensor_list: [],
        };
    },
    computed: {
        switchAlertClr: function () {
            /* let newStatusColor = "";
            this.equipData.statusBall.forEach((el) => {
                if (el.name === this.alertStatus) {
                    newStatusColor = el.color;
                }
            }); */
            return this.equipData.statusBall[this.alertStatus].color;
        },
    },
    methods: {
        updateBtnName(newData) {
            //console.log(newData)
            this.btnDeviceName = newData.name
            this.btnDeviceType = newData.type
            this.btnDeviceID = newData.ID
            this.btnDeviceCollection = newData.collection
            this.alertStatus = newData.state
        },
        resetBtnName() {
            this.btnDeviceName = "選擇設備";
        },
        pv_inv_total_data(inv_ID_list){
            let that = this
            this.axios.post('/pv_inv_total_data',{
                ID_list: inv_ID_list
            }).then(function(data){
                //console.log(data.data.data)
                let _data = data.data.data
                let _deviceTableData = []
                for(var i in _data){
                    _deviceTableData.push({
                        deviceName: _data[i].name,
                        deviceCapacity: _data[i].capacity,
                        AC: _data[i].p_bus_total,
                        DC: _data[i].p_cell_total,
                        powerGeneration: _data[i].kwh,
                        tempEnvir: _data[i].temp_inner == undefined ? '---': _data[i].temp_inner,
                        tempInverter: _data[i].temp_sink == undefined ? '---': _data[i].temp_sink,
                        RA: _data[i].RA,
                        PR: _data[i].PR,
                    })
                }
                that.deviceTableData = _deviceTableData
            })
        },
        equip_update(){
            let inv_ID_list = []
            this.pv_sensor_list = []
            for(var i in this.equipSelectData.inv){
                inv_ID_list.push(this.equipSelectData.inv[i].ID)
            }
            this.pv_inv_total_data(inv_ID_list)
            for(var i in this.equipSelectData.sensor){
                this.pv_sensor_list.push(this.equipSelectData.sensor[i])
            }
        }
    },
    watch: {
        equipSelectData(){
            this.equip_update()
        }
    },
    mounted(){
        this.equip_update()
    }
};
</script>


<template>
    <div>
        <div class="dispatch_title">新增警報維修派工單</div>
        <div class="dispatch_content">
            <addAlertFromList 
            @confirmAdd="confirmAdd"
            :plant_ID="plant_ID"
            v-show="addAlertShow"/>
            <el-popover placement="bottom-start" trigger="click">
                <el-button size="medium" slot="reference" class="esicon_btn">
                    <i class="icon-nav_factory"></i>選擇電站</el-button>
                <selectStation v-model="plant_select" />
            </el-popover>
            <el-button 
            style="margin: 0 0 0 1rem"
            type="primary"
            :class="{'disable-div': plant_select.length == 0}"
            @click="openAddAlert">新增警報</el-button>
            <div :class="{'disable-div': plant_select.length == 0}">
                <div class="dis_col">
                    <div>
                        <div class="discol_title"><i class="el-icon-warning"></i>工單資訊</div>
                        <table class="estable">
                            <tr>
                                <td>派工單號</td>
                                <td>{{ infos.ID }}</td>
                            </tr>
                            <tr>
                                <td>派工日期</td>
                                <td>
                                    <el-date-picker
                                    v-model="infos.date"
                                    type="date"
                                    placeholder="派工日期">
                                    </el-date-picker>
                                </td>
                            </tr>
                            <tr>
                                <td>工單狀態</td>
                                <td>{{ infos.status }}</td>
                            </tr>
                            <tr>
                                <td>派工單號</td>
                                <td>{{ infos.type }}</td>
                            </tr>
                        </table>
                        <div 
                        style="margin: 1rem 0 0"
                        class="discol_title"><i class="icon-ttl_sunboard"></i>電站資料</div>
                        <table class="estable">
                            <tr>
                                <td>電站名稱/地址</td>
                                <td>{{ stationInfo.plant_address }}</td>
                            </tr>
                            <tr>
                                <td>系統型式</td>
                                <td>{{ stationInfo.system_type }}</td>
                            </tr>
                            <tr>
                                <td>裝置容量</td>
                                <td>{{ stationInfo.capacity }}</td>
                            </tr>
                            <tr>
                                <td>模組數量</td>
                                <td>{{ stationInfo.module }}</td>
                            </tr>
                            <tr>
                                <td>變流器數量</td>
                                <td>{{ stationInfo.inverter }}</td>
                            </tr>
                        </table>
                        <div class="dispatch_ppl">
                            <div>
                                <div>派工者</div>
                                <div>
                                    <el-autocomplete
                                    v-model="disppl.name"
                                    :fetch-suggestions="dispplSearch"
                                    @select="disSelect"
                                    placeholder="派工者姓名"
                                    ></el-autocomplete>
                                    </div>
                                <div><el-input v-model="disppl.tel" placeholder="派工者電話"></el-input></div>
                            </div>
                            <div>
                                <div>受託者</div>
                                <div>
                                    <el-autocomplete
                                    v-model="deleppl.name"
                                    :fetch-suggestions="delpplSearch"
                                    @select="delSelect"
                                    placeholder="受託者姓名"
                                    ></el-autocomplete>
                                </div>
                                <div><el-input v-model="deleppl.tel" placeholder="受託者電話"></el-input></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="dis_option_wrap">
                            <div>
                                <div class="discol_title"><i class="icon-wrench"></i>派工項目</div>
                                <el-collapse 
                                >

                                    <el-collapse-item
                                        v-for="alarm, alarm_index in alarmData"
                                        :key="alarm._id"
                                        :title="alarm.event" 
                                    >
                                        <div style="display: flex; width: 100%">
                                            <div style="width: 30%; margin-right: .5rem;">
                                                電站:{{alarm.ID_data.station}}
                                                <br/>
                                                設備:{{alarm.ID_data.name}}
                                                <br/>
                                                發生時間:{{alarm.time}}
                                                <br/>
                                                復歸時間:{{alarm.returntime}}
                                            </div>
                                            <div style="width: 70%">
                                                <label style="margin-bottom: .5rem;"><span><i class="el-icon-s-opportunity"></i></span>原因分析</label>
                                                <el-collapse
                                                v-for="cause_group, cause_group_index in alarm.alarm_cause"
                                                :key="alarm._id+'_'+cause_group.name">
                                                    <el-collapse-item>
                                                        <template slot="title">
                                                            <el-checkbox 
                                                                :v-bind:value="cause_group.check"
                                                                @change="discolCheckAll(alarm_index, cause_group_index, cause_group.check)"
                                                            >
                                                                {{ cause_group.name }}
                                                            </el-checkbox>
                                                        </template>
                                                        <div 
                                                            class="dis_option"
                                                            v-for="child, child_index in cause_group.children"
                                                            v-bind:key="alarm._id+'_'+child.name"
                                                            @click="disOption(alarm_index, cause_group_index, child_index)"
                                                            :class="disOption_class(alarm_index, cause_group_index, child_index)"
                                                            style="width: fit-content;"
                                                        >
                                                            {{ child.name }}
                                                        </div>
                                                    </el-collapse-item>
                                                </el-collapse>
                                                <div 
                                                ref="seleVal"
                                                style="margin: 1rem 0 0; display: block;"
                                                class="seleted_value_wrap">
                                                    <div>已選取：</div>
                                                    <div class="seleted_value">
                                                        <div 
                                                        v-for="(item) in alarm.alarm_cause_selected"
                                                        :key="alarm._id+'cause'+item" >
                                                            {{item}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </el-collapse-item>
                                </el-collapse>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dis_actions">
                    <el-button><a href="xx" target="_blank">下載</a></el-button>
                    <el-button @click="sentAction()">刪除工單</el-button>
                    <el-button @click="save(2)">暫存工單</el-button>
                    <el-button @click="save()" type="primary">確認派工</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import selectStation from "../station/selectStation_sld.vue";
import dispatchCollapse from "./dispatchCollapse.vue";
import addAlertFromList from "./addAlertFromList.vue";
export default {
    name: "createAlert",
    components: {
        selectStation,
        dispatchCollapse,
        addAlertFromList
    },
    data(){
        return{
            plant_select: [],
            plant_ID: null,
            infos:{
                ID: '尚未儲存',
                date: '',
                status: '未派工',
                type: '告警檢修',
                _id: null,
            },
            stationInfo:{
                plant_address: '',
                system_type: '',
                capacity: '',
                module: '',
                inverter: ''
            },
            disppl: {
                name: '', 
                tel: '',
                suggestions: [
                    { value: '派工者a', tel: '0288881111' },
                ]
            },
            deleppl: {
                name: '', 
                tel: '',
                suggestions: [
                    {value: '測試名a', tel: '0288881111'},
                ]
            },
            addAlertShow: false,
            alarmIDList: [],
            alarmData: [],
            alarmCause: [
            ],
            dispatchSelected: [],
        }
    },
    methods: {
        disSelect(v) {
            this.disppl.tel = v.tel 
        },
        delSelect(v) {
            this.deleppl.tel = v.tel 
        },
        delpplSearch(queryString, cb){
            var getSugges = this.deleppl.suggestions;
            var results = queryString ? getSugges.filter( this.createFilter(queryString) ) : getSugges;
            cb(results)
        },
        dispplSearch(queryString, cb) {
            var getSugges = this.disppl.suggestions;
            var results = queryString ? getSugges.filter( this.createFilter(queryString) ) : getSugges;
            cb(results)
        },
        createFilter(queryString) {
            return (getSugges) => {
                return ( getSugges.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            }
        },
        save(show=1){
            console.log(this.alarmData)
            console.log(this.infos)
            if(this.infos.date == '' && show == 1){
                alert('請選擇派工日期')
                return false
            }
            this.axios.post('/save_dispatch', {
                infos: this.infos, alarmData: this.alarmData, 
                worker_contact: {
                    name: this.disppl.name,
                    TEL: this.disppl.tel
                },
                client_contact: {
                    name: this.deleppl.name,
                    TEL: this.deleppl.tel
                },
                ID: this.plant_ID,  // lgroup ID
                show: show
            }).then(data => {
                if(data.data.status == true){
                    this.$emit('sentAction', false);
                }
            })
        },
        sentAction(){
            this.$emit('sentAction', false);
        },
        openAddAlert(){
            this.addAlertShow = true;
        },
        confirmAdd(val){
            let that = this
            this.addAlertShow = false;
            console.log(val)
            if(val !== null){
                val.forEach(element => {
                    if(!that.alarmIDList.includes(element)){
                        that.alarmIDList.push(element)
                    }
                })
            }
            this.axios.post('ID_get_alarm_data', {
                alarmIDList: this.alarmIDList
            }).then(data => {
                that.alarmData = data.data.data.data
                that.alarmData.forEach((obj, i) => {
                    //that.alarmData[i].alarm_cause = JSON.parse(JSON.stringify(that.alarmCause ))
                    that.alarmData[i].alarm_cause_selected = []
                    that.alarmData[i].alarm_cause_selected_ID = []
                })
                console.log(that.alarmData)

                
            })
        },
        //選擇全部
        discolCheckAll(alarm_index, cause_group_index, check){
            this.alarmData[alarm_index].alarm_cause[cause_group_index].check = !check
            //console.log(alarm_index, cause_group_index, check)
            for(var i in this.alarmData[alarm_index].alarm_cause[cause_group_index].children){
                this.alarmData[alarm_index].alarm_cause[cause_group_index].children[i].select = !check
                if(this.alarmData[alarm_index].alarm_cause[cause_group_index].children[i].select && 
                !this.alarmData[alarm_index].alarm_cause_selected.includes(`${this.alarmData[alarm_index].alarm_cause[cause_group_index].name}\\${this.alarmData[alarm_index].alarm_cause[cause_group_index].children[i].name}`)){
                    this.alarmData[alarm_index].alarm_cause_selected.push(
                        `${this.alarmData[alarm_index].alarm_cause[cause_group_index].name}\\${this.alarmData[alarm_index].alarm_cause[cause_group_index].children[i].name}`
                    )
                    this.alarmData[alarm_index].alarm_cause_selected_ID.push(
                        this.alarmData[alarm_index].alarm_cause[cause_group_index].children[i].ID
                    )
                }else{
                    let index = this.alarmData[alarm_index].alarm_cause_selected.indexOf(
                        `${this.alarmData[alarm_index].alarm_cause[cause_group_index].name}\\${this.alarmData[alarm_index].alarm_cause[cause_group_index].children[i].name}`                )
                    this.alarmData[alarm_index].alarm_cause_selected.splice(index, 1)
                    index = this.alarmData[alarm_index].alarm_cause_selected_ID.indexOf(this.alarmData[alarm_index].alarm_cause[cause_group_index].children[i].ID)
                    this.alarmData[alarm_index].alarm_cause_selected_ID.splice(index, 1)
                }
            }
        },
        //單一選擇
        disOption(alarm_index, cause_group_index, child_index){
            this.alarmData[alarm_index].alarm_cause[cause_group_index].children[child_index].select = !this.alarmData[alarm_index].alarm_cause[cause_group_index].children[child_index].select
            if(this.alarmData[alarm_index].alarm_cause[cause_group_index].children[child_index].select &&
            !this.alarmData[alarm_index].alarm_cause_selected.includes(`${this.alarmData[alarm_index].alarm_cause[cause_group_index].name}\\${this.alarmData[alarm_index].alarm_cause[cause_group_index].children[child_index].name}`)){
                this.alarmData[alarm_index].alarm_cause_selected.push(
                    `${this.alarmData[alarm_index].alarm_cause[cause_group_index].name}\\${this.alarmData[alarm_index].alarm_cause[cause_group_index].children[child_index].name}`
                )
                this.alarmData[alarm_index].alarm_cause_selected_ID.push(
                    this.alarmData[alarm_index].alarm_cause[cause_group_index].children[i].ID
                )
            }else{
                let index = this.alarmData[alarm_index].alarm_cause_selected.indexOf(
                    `${this.alarmData[alarm_index].alarm_cause[cause_group_index].name}\\${this.alarmData[alarm_index].alarm_cause[cause_group_index].children[child_index].name}`                )
                this.alarmData[alarm_index].alarm_cause_selected.splice(index, 1)
                index = this.alarmData[alarm_index].alarm_cause_selected_ID.indexOf(this.alarmData[alarm_index].alarm_cause[cause_group_index].children[i].ID)
                this.alarmData[alarm_index].alarm_cause_selected_ID.splice(index, 1)
            }
        },
        //單一選擇
        disOption_class(alarm_index, cause_group_index, child_index){
            if(this.alarmData[alarm_index].alarm_cause[cause_group_index].children[child_index].select){
                return "selected"
            }else{
                return ""
            }
        },
    },
    mounted(){
        let that = this
        this.axios.post('db_find',{
            collection: 'alarm_cause',
            filter: {'show': 1}
        }).then(data => {
            //console.log(data.data.data.data)
            let group_dict = {}
            data.data.data.data.forEach(obj => {
                if(! (obj.alarm_group in group_dict) ){
                    group_dict[obj.alarm_group] = []
                }
                group_dict[obj.alarm_group].push({
                    ID: obj._id,
                    name: obj.event,
                    select: false,
                })
            })
            for(var key in group_dict){
                that.alarmCause.push({
                    name: key,
                    check: false,
                    children: group_dict[key]
                })
            }
            //console.log(that.alarmCause)
        })
    },
    watch: {
        plant_select(){
            //console.log(this.plant_select)
            let that = this
            if(this.plant_select.length > 0){
                this.axios.post('/db_find', {
                    collection: 'plant',
                    filter: {'name': this.plant_select[1]}
                }).then(data => {
                    let plant_data = data.data.data.data[0]
                    //console.log(plant_data)
                    //that.plant_ID = plant_data._id
                    that.stationInfo = {
                        plant_address: plant_data.plant_address,
                        system_type: plant_data.system_type,
                        capacity: plant_data.capacity,
                        module: plant_data.module,
                        inverter: plant_data.inverter
                    }
                })
                this.axios.post('/db_find', {
                    collection: 'equipment',
                    filter: {'name': this.plant_select[2], 'type': 'pv_lgroup'}
                }).then(data => {
                    let plant_data = data.data.data.data[0]
                    that.plant_ID = plant_data._id
                })
            }
        }
    }
};
</script>

<style>
.disable-div{
    pointer-events: none;
    opacity: 0.4;
}
</style>
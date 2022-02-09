<template>
    <div class="es_popup" v-show="popshow">
        <div class="dispatchSelecWrap">
            <div class="dispatch_saved" v-show="savedShow">
                <div class="dispatch_title">暫存 定檢/清洗 維修派工單</div>
                <div class="dispatch_content">
                    <el-popover placement="bottom-start" trigger="click">
                        <el-button size="medium" slot="reference" class="esicon_btn">
                            <i class="icon-nav_factory"></i>選擇電站</el-button>
                        <selectStation/>
                    </el-popover>
                    <div class="dis_col">
                        <div>
                            <div class="discol_title"><i class="el-icon-warning"></i>工單資訊</div>
                            <table class="estable">
                                <tr>
                                    <td>派工單號</td>
                                    <td>{{ infos.number }}</td>
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
                                    <td>{{ stationInfo.address }}</td>
                                </tr>
                                <tr>
                                    <td>系統型式</td>
                                    <td>{{ stationInfo.sysType }}</td>
                                </tr>
                                <tr>
                                    <td>裝置容量</td>
                                    <td>{{ stationInfo.storage }}</td>
                                </tr>
                                <tr>
                                    <td>模組數量</td>
                                    <td>{{ stationInfo.moduleQty }}</td>
                                </tr>
                                <tr>
                                    <td>變流器數量</td>
                                    <td>{{ stationInfo.inveterQty }}</td>
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
                            <div class="discol_title"><i class="icon-wrench"></i>派工項目</div>
                            <dispatchCollapse/>
                        </div>
                    </div>
                    <div class="dis_actions">
                        <el-button><a href="https://123" target="_blank">下載</a></el-button>
                        <el-button @click="sentAction()">刪除工單</el-button>
                        <el-button @click="sentAction()">暫存工單</el-button>
                        <el-button @click="sentAction()" type="primary">確認派工</el-button>
                    </div>
                </div>
            </div>
            <!-- 按鈕結果 -->
            <div class="dispatchSuccess" v-show="dispatchSent.show">
                <div :class="dispatchSent.status" class="es_result">
                    <div>
                        <div><i :class="dispatchSent.icon"></i></div>
                        <h3>{{dispatchSent.title}}</h3>
                    </div>
                </div>
            </div>
        </div>
        <div  @click="closePop()" class="close_popup_bill">
            <i class="el-icon-close"></i>
        </div>
    </div>
</template>

<script>

import selectStation from "../station/selectStation.vue";
import dispatchCollapse from "./dispatchCollapse.vue";

export default {
    name: "temporary__Inspection",
    model:{
        prop: 'popshow'
    },
    props: {
        popshow: Boolean
    },
    components: {
        selectStation,
        dispatchCollapse
    },
    data(){
        return{
            infos:{
                number: '上萬安-202103-A-003',
                date: '',
                status: '未派工',
                type: '定期檢修'
            },
            stationInfo:{
                address: '屏東縣新園鄉南龍路424-2號',
                sysType: '併聯型',
                storage: '366kwp',
                moduleQty: '1198片',
                inveterQty: '12台'
            },
            disppl: {
                name: '', 
                tel: '',
                suggestions: [
                    { value: '派工者a', tel: '0288881111' },
                    { value: '派工者b', tel: '0288881111' },
                    { value: '派工者c', tel: '0288881111' },
                    { value: '派工者d', tel: '0288881111' },
                    { value: '派工者e', tel: '0288881111' },
                    { value: '派工者f', tel: '0288881111' },
                    { value: '派工者g', tel: '0288881111' },
                ]
            },
            deleppl: {
                name: '', 
                tel: '',
                suggestions: [
                    {value: '測試名a', tel: '0288881111'},
                    {value: '測試名b', tel: '0288881111'},
                    {value: '測試名c', tel: '0288881111'},
                    {value: '測試名d', tel: '0288881111'},
                ]
            },
            dispatchSent: {
                show: false,
                status: 'success', //failed success 2 colors
                icon: 'el-icon-success',
                title: '成功',
            },
            savedShow: true,
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
        closePop(){
            this.dispatchSent.show = false
            this.savedShow = true
            this.$emit('closePop', false);
        },
        sentAction(){
            this.dispatchSent.show = true
            this.savedShow = false
            setTimeout(()=>{
                this.dispatchSent.show = false
                this.savedShow = true
                this.$emit('closePop', false);
            },1500)
        },
    }
};
</script>

<style>
</style>
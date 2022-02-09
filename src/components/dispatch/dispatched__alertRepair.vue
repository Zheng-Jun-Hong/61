<template>
    <div class="es_popup" ref="dispatchNewCase" v-show="popshow">
        <div class="dispatchSelecWrap">
            <div class="dispatch_saved" v-show="savedShow">
                <div class="dispatch_title">已派工 警報</div>
                <div class="dispatch_content">
                    <addAlertFromList 
                    @confirmAdd="confirmAdd"
                    v-show="addAlertShow"/>
                    <el-popover placement="bottom-start" trigger="click">
                        <el-button size="medium" slot="reference" class="esicon_btn">
                            <i class="icon-nav_factory"></i>選擇電站</el-button>
                        <selectStation/>
                    </el-popover>
                    <el-button 
                    style="margin: 0 0 0 1rem"
                    type="primary"
                    @click="openAddAlert">新增警報</el-button>
                    <div class="dis_col">
                        <!-- 資訊欄位 -->
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
                                        {{infos.date}}
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
                                <tr>
                                    <td>派工者</td>
                                    <td>{{ stationInfo.dispatchName }}:{{ stationInfo.dispatchNumber }}</td>
                                </tr>
                                <tr>
                                    <td>派工者</td>
                                    <td>{{ stationInfo.delegateName }}:{{ stationInfo.delegateNumber }}</td>
                                </tr>
                            </table>
                        </div>
                        <!-- 紀錄表格 -->
                        <div>
                            <div class="discol_title"><i class="el-icon-edit"></i>定檢檢修紀錄</div>
                            <el-table 
                            :data="tableRepairRecord" 
                            class="nostyle table_align_top">

                                <el-table-column
                                label="項目"
                                fixed="left"
                                min-width="150">
                                    <template slot-scope="scope">
                                        <div style="color: #00AD74; font-weight: bolder;"
                                        >{{ scope.row.title }}</div>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                label="原因分析"
                                prop="results"
                                min-width="280">
                                    <template slot-scope="scope">
                                        <el-popover
                                            placement="bottom"
                                            width="500"
                                            trigger="click">
                                                <div>{{scope.row.reasons}}</div>
                                            <el-button slot="reference" size="small">查看原因</el-button>
                                        </el-popover>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                label="備註"
                                min-width="250">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.note"></el-input>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                label="上傳圖片"
                                min-width="100">
                                    <template slot-scope="scope">
                                        <el-upload
                                            class="estable_upload"
                                            :class="{ hasfile : scope.row.images.length > 0 }"
                                            action="https://jsonplaceholder.typicode.com/posts/"
                                            multiple
                                            :file-list="scope.row.images"
                                            list-type="picture-card"
                                            >
                                            <div 
                                            class="esfiles"
                                            slot="file"
                                            slot-scope="{file}">
                                                <el-popover
                                                    placement="bottom"
                                                    width="300"
                                                    trigger="click">
                                                    <img :src="file.url" alt="">
                                                    <span 
                                                    slot="reference"
                                                    class="estable_preview"><i class="el-icon-picture"></i></span>
                                                </el-popover>
                                                <span 
                                                class="estable_canclefile"
                                                @click="handleRemove(file)"><i class="el-icon-error"></i></span>
                                            </div>
                                            <i class="el-icon-upload"></i>
                                        </el-upload>
                                    </template>
                                </el-table-column>

                            </el-table>
                        </div>
                    </div>
                    <div class="dis_col">
                        <!-- 定檢 -->
                        <div>
                            <div class="discol_title"><i class="el-icon-alarm-clock"></i>定檢工作記錄</div>
                            <table class="estable">
                                <tr>
                                    <td>維修日期</td>
                                    <td>{{ repairRecord.repairDate }}</td>
                                </tr>
                                <tr>
                                    <td>維修人員</td>
                                    <td class="es_unit_input">
                                        <el-select v-model="repairRecord.selectedRepairMan">
                                            <el-option
                                            v-for="item in repairRecord.repairMen"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>工作時數</td>
                                    <td class="es_unit_input">
                                        <el-input v-model="repairRecord.hours"></el-input> 
                                        小時
                                    </td>
                                </tr>
                                <tr>
                                    <td>派工費用</td>
                                    <td class="es_unit_input">
                                        <el-input v-model="repairRecord.cost"></el-input> 
                                        元
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="dis_col_last">
                            <div class="dis_actions">
                                <el-button><a href="https://123" target="_blank">下載</a></el-button>
                                <el-button @click="sentAction()">儲存工單</el-button>
                                <el-button @click="sentAction()" type="primary">確認結案</el-button>
                            </div>
                        </div>
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
import addAlertFromList from "./addAlertFromList.vue";

export default {
    name: "dispatched__alertRepair",
    model:{
        prop: 'popshow'
    },
    props: {
        popshow: Boolean
    },
    components: {
        selectStation,
        addAlertFromList
    },
    data(){
        return{
            dialogVisible: false,
            infos:{
                number: '上萬安-202103-A-003',
                date: '2021/02/01  23:00',
                status: '未派工',
                type: '定期檢修'
            },
            stationInfo:{
                address: '屏東縣新園鄉南龍路424-2號',
                sysType: '併聯型',
                storage: '366kwp',
                moduleQty: '1198片',
                inveterQty: '12台',
                dispatchName: '王小明',
                dispatchNumber: '0926863688',
                delegateName: '王小明',
                delegateNumber: '0926863688',
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
            tableRepairRecord: [
                {
                    title: '警報A2345',
                    results: false,
                    reasons: '原因分析文字，原因分析文字，原因分析文字，原因分析文字，原因分析文字，原因分析文字，原因分析文字',
                    note: '',
                    images: [
                        { name: 'test1.jpg', url: './imgs/testuploaded.jpg' },
                        { name: 'test2.jpg', url: './imgs/testuploaded.jpg' },
                        { name: 'test3.jpg', url: './imgs/testuploaded.jpg' },
                        { name: 'test4.jpg', url: './imgs/testuploaded.jpg' },
                    ]
                },{
                    title: '警報A2345',
                    results: false,
                    reasons: '原因分析文字，原因分析文字，原因分析文字，原因分析文字，原因分析文字，原因分析文字，原因分析文字',
                    note: 'notenote',
                    images: []
                },{
                    title: '警報A2345',
                    results: false,
                    reasons: '原因分析文字，原因分析文字，原因分析文字，原因分析文字，原因分析文字，原因分析文字，原因分析文字',
                    note: 'notenote',
                    images: []
                },
            ],
            repairRecord: {
                repairDate: '2021/02/01  23:00',
                repairMen: [
                    { name: '維修工名稱1' },
                    { name: '維修工名稱2' },
                    { name: '維修工名稱3' }
                ],
                selectedRepairMan: '',
                hours: '2',
                cost: '300'
            },
            dispatchSent: {
                show: false,
                status: 'success', //failed success 2 colors
                icon: 'el-icon-success',
                title: '成功',
            },
            savedShow: true,
            addAlertShow: false,
        }
    },
    methods: {
        checkReason(ary, reason){
            if( reason.check === true ){
                reason.check = false;
                for( let i = 0 ; i < ary.length ; i++ ){
                    if( ary[i] == reason.value ){
                        ary.splice(i, 1)
                    }
                }
            }else{
                reason.check = true;
                ary.push( reason.value );
            }

        },
        handleRemove(file) {
            this.$message({
                message: 'ajax刪除圖片' + file,
                type: 'warning'
            });
        },
        addNewWriteRecord(){
            this.repairRecord.records.push({ text: '', images: [] })
        },
        removeRecord(idx){
            this.repairRecord.records.splice(idx, 1)
        },
        sentAction(){
            this.dispatchSent.show = true
            this.savedShow = false
        },
        closePop(){
            this.dispatchSent.show = false
            this.savedShow = true
            this.$emit('closePop', false);
        },
        openAddAlert(){
            this.addAlertShow = true;
        },
        confirmAdd(){
            this.addAlertShow = false;
        },
    }
};
</script>

<style>
</style>
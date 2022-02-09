<template>
    <div class="es_popup" ref="dispatchNewCase" v-show="popshow">
        <div class="dispatchSelecWrap">
            <div class="dispatch_saved" v-show="savedShow">
                <div class="dispatch_title">已結案 警報</div>
                <div class="dispatch_content">
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
                            <!-- 定檢 -->
                            <div class="discol_title"><i class="el-icon-alarm-clock"></i>定檢工作記錄</div>
                            <table class="estable">
                                <tr>
                                    <td>維修日期</td>
                                    <td>{{ repairRecord.repairDate }}</td>
                                </tr>
                                <tr>
                                    <td>維修人員</td>
                                    <td>{{repairRecord.name}}</td>
                                </tr>
                                <tr>
                                    <td>工作時數</td>
                                    <td>{{repairRecord.hours}} 小時</td>
                                </tr>
                                <tr>
                                    <td>派工費用</td>
                                    <td>{{repairRecord.cost}} 元</td>
                                </tr>
                            </table>
                        </div>
                        <!-- 紀錄表格 -->
                        <div>
                            <div class="discol_title"><i class="el-icon-edit"></i>警報檢修紀錄</div>
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
                                min-width="100">
                                    <template slot-scope="scope">
                                        <div style="display: flex; align-items: center">
                                            <el-popover
                                                placement="bottom"
                                                width="500"
                                                trigger="click">
                                                    <div>
                                                        {{ scope.row.reasons }}
                                                    </div>
                                                <el-button 
                                                style="margin: 0 0 0 10px"
                                                slot="reference" size="small">查看</el-button>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                label="維修項目"
                                min-width="100">
                                    <template slot-scope="scope">
                                        <div style="display: flex; align-items: center">
                                            <el-popover
                                                placement="bottom"
                                                width="500"
                                                trigger="click">
                                                    <div>
                                                        <table class="estable">
                                                            <tr 
                                                            v-for="(item, idx) in scope.row.repaired"
                                                            :key="idx">
                                                                <td>{{ item }}</td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                <el-button 
                                                style="margin: 0 0 0 10px"
                                                slot="reference" size="small">項目</el-button>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                label="備註"
                                min-width="250">
                                    <template slot-scope="scope">
                                        <p>{{ scope.row.note }}</p>
                                        <div class="dis_table_files">
                                            <div 
                                            v-for="img in scope.row.images"
                                            :key="img.name">
                                                <el-popover
                                                    placement="bottom"
                                                    width="300"
                                                    trigger="click">
                                                    <img :src="img.url" alt="">
                                                    <span 
                                                    slot="reference"
                                                    class="estable_preview"><i class="el-icon-picture"></i></span>
                                                </el-popover>
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            
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


export default {
    name: "stored__alertRepair",
    model:{
        prop: 'popshow'
    },
    props: {
        popshow: Boolean
    },
    components: {
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
                    reasons: '原因文字原因文字，原因文字原因文字原因文字原因文字原因文字原因文字原因文字',
                    note: '備註文字區備註文字區備註文字區備註文字區備註文字區備註文字區備註文字區備註文字區',
                    repaired: [
                        '項目N-123', '項目N-123', '項目N-123', '項目N-123', '項目N-123'
                    ],
                    images: [
                        { name: 'test1.jpg', url: './imgs/testuploaded.jpg' },
                        { name: 'test2.jpg', url: './imgs/testuploaded.jpg' },
                        { name: 'test3.jpg', url: './imgs/testuploaded.jpg' },
                        { name: 'test4.jpg', url: './imgs/testuploaded.jpg' },
                    ]
                },{
                    title: '警報A2345',
                    results: false,
                    reasons: '原因文字原因文字，原因文字原因文字原因文字原因文字原因文字原因文字原因文字',
                    note: 'notenote',
                    repaired: [
                        '項目N-123', '項目N-123', '項目N-123', '項目N-123', '項目N-123'
                    ],
                    images: []
                },{
                    title: '警報A2345',
                    results: false,
                    reasons: '原因文字原因文字，原因文字原因文字原因文字原因文字原因文字原因文字原因文字',
                    note: 'notenote',
                    repaired: [
                        '項目N-123', '項目N-123', '項目N-123', '項目N-123', '項目N-123'
                    ],
                    images: []
                },
            ],
            repairRecord: {
                repairDate: '2021/02/01  23:00',
                name: '維修工名稱',
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
        removeRecord(idx){
            this.repairRecord.records.splice(idx, 1)
        },
        closePop(){
            this.dispatchSent.show = false
            this.savedShow = true
            this.$emit('closePop', false);
        },
    }
};
</script>

<style>
</style>
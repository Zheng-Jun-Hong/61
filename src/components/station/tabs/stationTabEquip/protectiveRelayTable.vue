<template>
    <div class="smart_device_data_container">
        <div class="select" v-show="false">
            <el-select v-model="value" placeholder="請選擇" style="width:200px" @change="selection">
                <el-option
                    v-for="item in options"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
        </div>
        <br/>
        <el-table
            class="header_class"
            :data="protectiveRelayDataReg"
            empty-text="無資料"
            stripe
            :header-cell-style="styleHeader"
            @cell-dblclick="dblclickHandler"
        >
            <el-table-column
                class-name="header"
                prop=""
                :label="title"
                align="center"
            >
                <el-table-column
                    prop="label"
                    label="點位"
                    align="center"
                    min-width="25%"
                    class="columnHeader"
                >
                </el-table-column>
                <el-table-column
                    prop="Op"
                    label="跳脫狀態"
                    align="center"
                    min-width="25%"
                    class="columnHeader"
                    :formatter="formatBoolean_0"
                >
                </el-table-column>
                <el-table-column
                    prop="label1"
                    label="點位"
                    align="center"
                    min-width="25%"
                    class="columnHeader"
                >
                </el-table-column>
                <el-table-column
                    prop="Op1"
                    label="跳脫狀態"
                    align="center"
                    min-width="25%"
                    class="columnHeader"
                    :formatter="formatBoolean_1"
                >
                </el-table-column>
            </el-table-column>
        </el-table>
        <br/>
        <data-history-data :data-name="outputLabel" :key="parentBtnDeviceId+'_'+data_type"
            :data-collection="parentBtnDeviceCollection" :parent-name="parentBtnDeviceName"
            :data-type="data_type" :data-id="parentBtnDeviceId"
            :stat-table-show="false"  :ieee-code="ieeeCode"/>
    </div>
</template>

<style scoped>
.select{
    width: 100%;
    align-items:flex-start;
}
</style>
<script>
import dataHistoryData from "./dataHistoryData.vue"

export default {
    name: "ProtectiveRelayTable",
    components: {
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
        parentBtnDeviceCollection:{
            type: String,
            required: true
        }
    },
    data() {
        return {
            options:[
                {
                    value: ["27"],
                    label: '欠電壓保護'
                },
                {
                    value: ["59"],
                    label: '過電壓保護'
                },
                {
                    value: ["50", "50N"],
                    label: '瞬時過電流保護'
                },
                {
                    value: ["50G"],
                    label: '接地瞬時過電流保護'
                },
                {
                    value: ["51", "51N"],
                    label: '延時過電流保護'
                },
                {
                    value: ["51G"],
                    label: '接地延時過電流保護'
                },
                {
                    value: ["81"],
                    label: '低/高頻跳脫'
                },
                {
                    value: ["total"],
                    label: '全部'
                }
            ],
            protectiveRelayData:[],
            protectiveRelayDataReg: [],
            data_reg: [],
            ieeeData: [],
            value: "全部",
            label: "全部",
            outputLabel: "全部",
            ieeeCode: "total",
            data_type: "total",
            dataType: "total",
            title: "保護電驛點位資料",
            total: "total"
        }
    },
    methods:{
        selection(val){
            this.dataType = "total";
            this.data_reg = [];
            this.protectiveRelayDataReg = [];
            this.pv_protective_relay_data(val);
        },
        pv_protective_relay_data(val, dataType=this.dataType){
            // console.log(this.parentBtnDeviceName)   //設備名稱
            // console.log(this.parentBtnDeviceId)    //設備ID
            // console.log(this.parentBtnDeviceCollection)    //設備collection

            this.data_type = dataType;
            this.ieeeCode = val[0];

            // let obj = this.options.find((item)=>{
            //     return item.value === val;
            // });
            // this.label = null;
            this.outputLabel = "全部"

            let that = this;
            that.protectiveRelayData = [];
            let time = 0;

            const promise = new Promise(function(resolve, reject){
                that.data_reg = [];
                that.ieeeData  = [];
                resolve('success');
            })
            promise.then(() =>{
                function getData(time){
                    if(time < val.length){
                        that.axios.post("/pv_protective_relay_data",{
                            "ID": that.parentBtnDeviceId,
                            "IEEE_code": val[time]
                        })
                        .then(function(data){
                            if (time === 0 && that.data_reg.length > 0){
                                that.data_reg = [];
                            }
                            that.ieeeData.push(data.data.data.relay_data);
                            that.data_reg = that.data_reg.concat(data.data.data.relay_data);
                            time += 1;
                            if (time+1 > val.length){
                                that.tableData();
                            }
                            getData(time);
                        })
                    }
                }
                getData(time);
            })
        },
        formatBoolean_0: function(row){
            var ret = '';
            if (row.Op == true){
                ret = "true";
            }
            else if (row.Op == false){
                ret = "false";
            }
            else{
                ret = " ";
            }
            return ret
        },
        formatBoolean_1: function(row){
            var ret = '';
            if (row.Op1 == true){
                ret = "true";
            }
            else if (row.Op1 == false){
                ret = "false";
            }
            else{
                ret = " ";
            }
            return ret
        },
        styleHeader({rowIndex}){
            if (rowIndex > 0){
                return 'background: white; color: black'
            }
        },
        tableData(){
            let relay_data = this.data_reg;
            let data_length = relay_data.length;
            this.protectiveRelayData = [];
            for (var i = 0; i < data_length; i+=2){
                if (i + 1 >= data_length){
                    this.protectiveRelayData.push({
                        label: relay_data[i]["label"],
                        label1: null,
                        LN: relay_data[i]["LN"],
                        Op: relay_data[i]["Attribute"]["Op"],
                        LN1: null,
                        Op1: null
                    })
                }
                else{
                    this.protectiveRelayData.push({
                        label: relay_data[i]["label"],
                        label1: relay_data[i+1]["label"],
                        LN: relay_data[i]["LN"],
                        Op: relay_data[i]["Attribute"]["Op"],
                        LN1: relay_data[i+1]["LN"],
                        Op1: relay_data[i+1]["Attribute"]["Op"]
                    })
                }
            }
            this.protectiveRelayDataReg = this.protectiveRelayData;
            console.log("update");
            //console.log(this.protectiveRelayDataReg);
            //console.log(this.protectiveRelayData);
        },
        dblclickHandler(row, column){
            var comfirm = false;
            if (column.property == "label"){
                this.outputLabel = row.label;
                for (var i=0; i<this.ieeeData.length; i++){
                    for (var j=0; j<this.ieeeData[i].length; j++){
                        if (this.ieeeData[i][j]["label"] == row.label){
                            this.data_type = row.LN;
                            this.dataType = row.LN;
                            this.ieeeCode = this.value[i];
                            comfirm = true;
                            break
                        }
                    }
                    if (comfirm){
                        break
                    }
                }
            }
            else if (column.property == "label1"){
                this.outputLabel = row.label1;
                for (var i=0; i<this.ieeeData.length; i++){
                    for (var j=0; j<this.ieeeData[i].length; j++){
                        if (this.ieeeData[i][j]["label"] == row.label1){
                            this.data_type = row.LN1;
                            this.dataType = row.LN1;
                            this.ieeeCode = this.value[i];
                            comfirm = true;
                            break
                        }
                    }
                    if (comfirm){
                        break
                    }
                }
            }
            if (this.ieeeCode == "全" || this.ieeeCode == "全部" || this.ieeeCode == "部"){
                this.ieeeCode = "total";
            }
        },
        dblclickHeader(){
            this.data_type = "total";
            this.outputLabel = "全部";
            this.dataType  = "total";
        }
    },
    // beforeUpdate(){
    //     if (typeof(this.value) === "string"){
    //         this.value = ["total"];
    //     }
    //     // this.protectiveRelayDataReg = this.protectiveRelayData;
    // },
    // updated(){
    //     this.protectiveRelayDataReg = this.protectiveRelayData;
    // },
    mounted(){
        // alert('頁面維護中')   //完成時拿掉
        let that = this;
        this.pv_protective_relay_data(["total"]);
        let headerEvent = document.querySelector(".header_class .el-table__header tr");
        headerEvent.addEventListener("dblclick", this.dblclickHeader);
        this.syncData = setInterval(function(){
            if (that.value === "全部"){
                that.pv_protective_relay_data(["total"]);
            }
            else{
                that.pv_protective_relay_data(that.value);
            }
        }, 5000);
    },
    destroyed(){
        clearInterval(this.syncData);
        let headerEvent = document.querySelector(".header_class .el-table__header tr");
        headerEvent.removeEventListener("dblclick", this.dblclickHeader);
    }
}
</script>
<template>
    <div class="smart_device_data_container">
        <div class="select" v-show="true">
            <el-select v-model="value" placeholder="請選擇" style="width:200px" @change="pv_protective_relay_data">
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
            :data="protectiveRelayData"
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
            data_reg: [],
            ieeeData: [],
            value: "全部",
            label: "全部",
            outputLabel: "全部",
            ieeeCode: "total",
            data_type: "total",
            title: "保護電驛點位資料",
            total: "total"
        }
    },
    methods:{
        pv_protective_relay_data(val){
            // console.log(this.parentBtnDeviceName)   //設備名稱
            // console.log(this.parentBtnDeviceId)    //設備ID
            // console.log(this.parentBtnDeviceCollection)    //設備collection
            this.data_type = this.total;
            this.ieeeCode = val[0];

            let obj = this.options.find((item)=>{
                return item.value === val;
            });
            this.label = obj.label;
            this.outputLabel = "全部"

            let that = this;
            that.protectiveRelayData = [];
            that.data_reg = [];
            let time = 0;

            const promise = new Promise(function(resolve, reject){
                that.ieeeData  = [];
                resolve('success');
            })
            promise.then(function(){
                function getData(time){
                    if(time < val.length){
                        that.axios.post("/pv_protective_relay_data",{
                            "ID": that.parentBtnDeviceId,
                            "IEEE_code": val[time]
                        })
                        .then(function(data){
                            that.ieeeData.push(data.data.data.relay_data);
                            // console.log(that.ieeeData);
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
            for (var i = 0; i <= data_length; i+=2){
                if (i + 1 >= data_length){
                    this.protectiveRelayData.push({
                        label: relay_data[i]["label"],
                        LN: relay_data[i]["LN"],
                        Op: relay_data[i]["Attribute"]["Op"],
                        label1: null,
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
            console.log(this.protectiveRelayData);
        },
        dblclickHandler(row, column){
            var comfirm = false;
            if (column.property == "label"){
                this.outputLabel = row.label;
                for (var i=0; i<this.ieeeData.length; i++){
                    for (var j=0; j<this.ieeeData[i].length; j++){
                        if (this.ieeeData[i][j]["label"] == row.label){
                            this.data_type = row.LN;
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
            
        },

        dblclickHeader(){
            // if (column.label == "保護電驛點位資料"){
            //     this.pv_protective_relay_data(["total"]);
            // }
            alert("abc");
            // alert(column);
        }
    },
    mounted(){
        // alert('頁面維護中')   //完成時拿掉
        let that = this
        this.pv_protective_relay_data(["total"])
        let headerEvent = document.querySelector('.header_class')
        headerEvent.addEventListener("click", this.dblclickHeader)
        this.syncData = setInterval(function(){
            that.pv_protective_relay_data(that.value)
        }, 1000)
    },
    destroyed(){
        clearInterval(this.syncData)
    }
}
</script>
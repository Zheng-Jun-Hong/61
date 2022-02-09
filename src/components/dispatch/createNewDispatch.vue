<template>
    <div class="es_popup" ref="dispatchNewCase" v-show="popshow">
        <div class="dispatchSelecWrap">
            <div class="dispatch_type_select" v-show="dispatchTypeShow">
                <div>
                    <h2>選擇新增派工單類型</h2>
                    <div class="distype_btns">
                        <el-button @click="dispatchInspection()">定檢</el-button>
                        <el-button @click="dispatchInspection()">清洗</el-button>
                        <el-button @click="dispatchAlert()">警報</el-button>
                    </div>
                </div>
            </div>
            <div class="dispatch_inspection" v-show="periodicInspectionShow">
                <createInspection @sentAction="disSent"/>
            </div>
            <div class="dispatch_alert" v-if="dispatchAlertShow">
                <createAlert @sentAction="disSent"/>
            </div>
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

import createInspection from "./createInspection.vue";
import createAlert from "./createAlert.vue";
export default {
    name: "createNewDispatch",
    components:{
        createInspection,
        createAlert
    },
    model:{
        prop: 'popshow'
    },
    props: {
        popshow: Boolean
    },
    data(){
        return{
            dispatchTypeShow: true,
            periodicInspectionShow: false,
            dispatchAlertShow: false,
            dispatchSent: {
                show: false,
                status: 'success', //failed success 2 colors
                icon: 'el-icon-success',
                title: '成功',
            }
        }
    },
    watch: {
        popshow(v){
            this.openpop = v;
        }
    },
    methods: {
        dispatchInspection(){
            this.dispatchTypeShow = false
            this.periodicInspectionShow = true
        },
        dispatchAlert(){
            this.dispatchTypeShow = false
            this.dispatchAlertShow = true
        },
        closePop() {
            this.dispatchTypeShow = true
            this.periodicInspectionShow = false
            this.dispatchAlertShow = false
            this.$emit('closePop', false);
        },
        disSent(){
            this.dispatchSent.show = true
            this.dispatchTypeShow = false
            this.periodicInspectionShow = false
            this.dispatchAlertShow = false
            setTimeout(()=>{
                this.dispatchSent.show = false
                this.dispatchTypeShow = true
                this.$emit('closePop', false);
            },1500)
        }
    },
};
</script>

<style>
</style>
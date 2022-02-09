<template>
    <div class="smart_device_data_container">
    </div>
</template>
<script>

export default {
    name: "ProtectiveRelayTable",
    components: {
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
    methods:{
        pv_protective_relay_data(){
            console.log(this.parentBtnDeviceName)   //設備名稱
            console.log(this.parentBtnDeviceId)    //設備ID
            console.log(this.parentBtnDeviceCollection)    //設備collection
        }
    },
    mounted(){
        alert('頁面維護中')   //完成時拿掉
        let that = this
        this.pv_protective_relay_data()
        this.syncData = setInterval(function(){
            that.pv_protective_relay_data()
        }, 1000)
    },
    destroyed(){
        clearInterval(this.syncData)
    }
}
</script>
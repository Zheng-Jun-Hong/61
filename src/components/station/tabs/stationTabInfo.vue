<template>
	<div class="stationtab_info">
		<h3>{{ stationData.name }}</h3>
        <div class="esflex col2">
            <div class="st_main_info">
                <table class="estable">
                    <tr>
                        <td><i class="icon-ttl_time"></i> 掛錶日期</td>
                        <td>{{infoData.start_date}}</td>
                    </tr>
                    <tr>
                        <td><i class="icon-ttl_thunder"></i> 裝置容量</td>
                        <td>{{infoData.capacity}} kWp</td>
                    </tr>
                    <tr>
                        <td><i class="el-icon-location"></i> 案場位置</td>
                        <td>{{infoData.plant_address}}</td>
                    </tr>
                    <tr>
                        <td><i class="icon-globe"></i> 經緯度</td>
                        <td>{{infoData.coordinates}}</td>
                    </tr>
                    <tr>
                        <td><i class="el-icon-s-tools"></i> 變流器型號</td>
                        <td>{{infoData.typeNumb}}</td>
                    </tr>
                    <tr>
                        <td><i class="icon-plug"></i> 預期發電量</td>
                        <td>{{infoData.expectedPower}}
                            <el-input placeholder="輸入後更新" v-model="infoData.expectedPowerRenew">
                                <el-button 
                                @click="renewExpectedPower()"
                                slot="append">更新</el-button>
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td><i class="icon-pencil"></i> 備註欄</td>
                        <td v-html="infoData.event"></td>
                    </tr>
                </table>
            </div>
            <div class="st_client_info">
                <div class="esflex">
                    <div><h4><i class="icon-briefcase"></i>客戶資訊</h4></div>
                    <div>
                        <table class="estable">
                            <tr>
                                <td>客戶名稱</td>
                                <td>{{infoData.client_info.unit}}</td>
                            </tr>
                            <tr>
                                <td>管理員</td>
                                <td>{{infoData.client_info.admin}}</td>
                            </tr>
                            <tr>
                                <td>電話</td>
                                <td v-html="infoData.client_info.TEL"></td>
                            </tr>
                            <tr>
                                <td>備註欄</td>
                                <td>{{infoData.client_info.event}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="esflex">
                    <div><h4><i class="icon-wrench"></i>維運團隊資訊</h4></div>
                    <div>
                        <table class="estable">
                            <tr>
                                <td>承攬單位</td>
                                <td>{{infoData.paets_info.unit}}</td>
                            </tr>
                            <tr>
                                <td>聯絡人員</td>
                                <td>{{infoData.paets_info.admin}}</td>
                            </tr>
                            <tr>
                                <td>電話</td>
                                <td v-html="infoData.paets_info.TEL"></td>
                            </tr>
                            <tr>
                                <td>備註欄</td>
                                <td>{{infoData.paets_info.event}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
export default {
	name: 'stationTabBasic',
	props: {
        stationData: Object
	},
	data(){
		return{
            infoData: {}
		}
	},
    methods:{
        renewExpectedPower(){
            this.infoData.expectedPower = this.infoData.expectedPowerRenew;
        }
    },
    mounted(){
        if(this.stationData['ID'] != undefined && this.stationData['ID'] != null){
            let that = this
            this.axios.post('/get_plant_detail',{ID: this.stationData['ID']}).then(function(data){
                that.infoData = data.data.data
            })
        }
    }
}
</script>


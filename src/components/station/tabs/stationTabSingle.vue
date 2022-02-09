<template>
	<div class="stationtab_single">
        <div class="stmsg_title">
            <h3>{{ stationData.name }}</h3>
            <div class="stmsg">{{ alertText }}</div>
        </div>
        <div class="stbigimg_title">
            <!-- <div>{{ singleData.bigimgTitle }}</div> -->
            <div class="st_status_ball">
                <div
                v-for="(item, idx) in singleData.statusBall"
                :key="idx">
                    <i :style="{background: item.color}"></i>
                    {{ item.name }}
                </div>
            </div>
        </div>
        <div class="stbigimg">
            <svg-zone :plant_select="plant_select" :svg_path="svg_path"></svg-zone>   <!-- SVG Loading Area -->
            <!-- <div class="sm_data_list">
                <div v-for="(item, idx) in singleData.smdataList"
                :key="idx" class="sm_data">
                    <div class="smtitle">{{item.title}}</div>
                    <div class="smvalue">{{item.value}}</div>
                    <div class="smicon"><i :class="item.icon"></i></div>
                    <div class="smunit">{{item.unit}}</div>
                </div>
            </div> -->
        </div>
	</div>
</template>

<script>
import svgZone from "../../stationGraphic/svgZone.vue"

export default {
	name: 'stationTabSingle',
    components:{
        svgZone
    },
	props: {
		singleData: Object,
        stationData: Object
	},
	data(){
		return{
            plant_select: [],
            svg_path: "",
            pageType: 'single',
            alertText: "",
		}
	},
    mounted(){
        let that = this
        console.log(this.stationData)
        switch(this.stationData.collection){
            case 'pv_plant':
                this.plant_select = [undefined, this.stationData.name, null, null]
                this.SLD_path_analysis(this.stationData.name, null, null, null)
                break
            case 'pv_lgroup':
                this.plant_select = [undefined, this.stationData.PV, this.stationData.name, null]
                this.SLD_path_analysis(this.stationData.PV, this.stationData.name, null, null)
                break
            case 'pv_group':
                this.plant_select = [undefined, this.stationData.PV, this.stationData.lgroup, this.stationData.name]
                this.SLD_path_analysis(this.stationData.PV, this.stationData.lgroup, this.stationData.name, null)
                break
        }
        this.alarmLatest()
        this.syncdata = setInterval(function(){
            that.alarmLatest()
        }, 5000)
    },
    methods:{
        alarmLatest(){
            if(this.plant_select.length == 0)
                return false
            let that = this
            this.axios.post("/alarmLatest", {
                'PV': this.plant_select[1],
                'lgroup': this.plant_select[2],
                'group': this.plant_select[3],
            }).then(function(data){
                let event = data.data.data.event
                const equip = data.data.data.equip
                const dict = {
                    inv: "變流器",
                    string: "串電流表",
                    iot: "資料收集器",
                }

                if (event !== null) {
                    that.alertText = `報警名稱：${event.event}( ${event.time} ) 、
                        報警設備：${equip.name}
                        (
                            廠區：${equip.lgroup}-${equip.group},
                            類型:${dict[equip.type]}
                        )`
                    
                } else {
                    that.alertText = "無警報訊息"
                }
            })
        },
        SLD_path_analysis(plant, lgroup, group, svg){
            let that = this
            this.axios.post('/SLD_path_analysis', {
                plant: plant,
                lgroup: lgroup,
                group: group,
                svg: svg,
                layout: this.pageType == 'single'? 0 : 1
            }).then(function(data){
                console.log(data.data.data)
                let _data = data.data.data
                that.svg_path = `./solar_static/SLD/${_data.plant}/${_data.lgroup}/${_data.svg}.svg`
            })
        }
    },
    destroyed(){
        clearInterval(this.syncdata)
    }
}
</script>
<style scoped>
.stbigimg{
    min-height: unset;
}
</style>


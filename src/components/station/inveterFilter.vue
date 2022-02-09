<template>
    <div>
        <el-popover
        :placement="inveterFilterData.popoverPosition"
        width="1000"
        popper-class="inveter_filter"
        trigger="click"
        @show="openPopover()"
        @hide="closePopover()">
            <div class="inveter_fil_inner" v-if="invList.length >0">
                <button
                    class="btn_select_all"
                    :class="{ active: isSelectAll }"
                    @click="
                        isSelectAll
                            ? deselectAllUnits(isSelectAll)
                            : selectAllUnits(isSelectAll)
                    "
                ></button>
                <div class="inverters_container">
                    <div class="inverters_wrapper">
                        <div
                            class="single_inverter"
                            v-for="(inverter, index) in invList"
                            :key="index"
                        >
                            <span>{{ inverter.title }}</span>
                            <div class="btn_inverter_wrapper">
                                <button
                                    v-for="(unit, index) in inverter.units"
                                    :key="index"
                                    :class="{ selected: unit.active }"
                                    class="btn_inverter_sm"
                                    @click="toggleSelectUnit(unit)"
                                >
                                    {{ unit.unit_name }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="inveter_fil_inner" v-else>此案場目前無任何String Meter設備 </div>
        <el-button 
        type="primary"
        class="infilter_open_btn" slot="reference">{{ btnText }}</el-button>
        </el-popover>
    </div>
</template>

<style scoped>
.btn_select_all.active::before {
    content: "取消全選";
}

.btn_select_all::before {
    content: "全選";
}
</style>

<script>

export default {
    name: "stationTabPower",
    components: {
    },
    props: {
        inveterFilterData: Object,
        stringList: Array,
    },
    data() {
        return {
            btnText: '顯示條件',
            isSelectAll: true,
            invList: [],
            sm_numObj: {},
            /* filters: {
                inverters: [
                    {
                        title: "Inverter 1",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm1-1", active: false },
                            { unit_name: "sm1-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 2",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm2-1", active: false },
                            { unit_name: "sm2-2", active: true },
                        ],
                    },
                    {
                        title: "Inverter 3",
                        color: "#13AD74",
                        units: [
                            { unit_name: "sm3-1", active: false },
                            { unit_name: "sm3-2", active: true },
                        ],
                    },                    
                ],
            }, */
        }
    },
    created() {
    },
    methods: {
        openPopover(){
            this.btnText = '關閉條件'
        },
        closePopover(){
            this.btnText = '顯示條件'
        },
        selectLastMonth() {
            this.dateSelected =
                this.dateSelected.getTime() - 3600 * 1000 * 24 * 30;
            this.dateSelected = new Date(this.dateSelected);
        },
        selectNextMonth() {
            this.dateSelected =
                this.dateSelected.getTime() + 3600 * 1000 * 24 * 30;
            this.dateSelected = new Date(this.dateSelected);
        },
        toggleInterversPopup() {
            this.isShow = !this.isShow;
        },
        toggleSelectUnit(unit) {
            unit.active = !unit.active;
            this.sm_numObj[unit.numb] = unit.active
            this.emit_function()
        },
        selectAllUnits(isSelectAll) {
            let that = this
            this.isSelectAll = !isSelectAll;
            this.invList.forEach((inverter) => {
                inverter.units.forEach((unit) => {
                    unit.active = true;
                    that.sm_numObj[unit.numb] = true
                });
            });
            that.emit_function()
        },
        deselectAllUnits(isSelectAll) {
            let that = this
            this.isSelectAll = !isSelectAll;
            this.invList.forEach((inverter) => {
                inverter.units.forEach((unit) => {
                    unit.active = false;
                    that.sm_numObj[unit.numb] = false
                });
            });
            that.emit_function()
        },
        emit_function(){
            this.$emit('get_selected_index', this.sm_numObj)
        },
        make_invList(){
            let stringList = this.stringList
            let inv_name_obj = {}
            let sm_count = 0
            for(var i in stringList){
                if(!(stringList[i].inv in inv_name_obj)){
                    inv_name_obj[stringList[i].inv] = {
                        title: stringList[i].inv,
                        color: "#13AD74",
                        units: [
                        
                        ],
                    }
                }
                inv_name_obj[stringList[i].inv].units.push({
                    unit_name: stringList[i].name,
                    numb: sm_count,
                    active: true 
                })
                this.sm_numObj[sm_count] = true
                sm_count += 1
            }
            this.invList = []
            for(var name in inv_name_obj){
                this.invList.push(inv_name_obj[name])
            }
        }
    },
    mounted(){
        this.make_invList()
    },
    watch:{
        stringList(){
            this.make_invList()
            
        }
    }
};
</script>
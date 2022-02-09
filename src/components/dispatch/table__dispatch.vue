<template>
    <div class="dispatch_table">
        <el-table :data="dispatchTable" :empty-text="'無工單'">
            <el-table-column
                align="start"
                label="派工單號"
                prop="name"
                min-width="120px"
            ></el-table-column>
            <el-table-column
                column-key="date"
                :filters="dataTypeFilter"
                :filter-method="filterHandler"
                align="center"
                label="類別"
                prop="type"
                min-width="60px"
            ></el-table-column>
            <el-table-column
                align="center"
                label="電站"
                prop="station_name"
                min-width="60px"
            ></el-table-column>
            <el-table-column
                align="center"
                label="派工時間"
                prop="dispatch_time"
                min-width="80px"
            ></el-table-column>
            <el-table-column
                align="center"
                label="填寫紀錄"
                prop="dispatch_record"
                min-width="60px"
            >
                <template slot-scope="scope">
                    <span
                    class="estable_click"
                    @click="editShow(scope.row.showType)">
                        <i class="el-icon-edit-outline"></i>
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                type="selection"
                fixed="right"
                width="100px"
            ></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "table__dispatch",
    data() {
        return {
            dispatchType: "",
            dataTypeFilter: [
                { text: "定檢", value: "定檢" },
                { text: "清洗", value: "清洗" },
                { text: "警報檢修", value: "警報檢修" },
            ],
            dispatchTable: [
                /* {
                    number: "上萬安段20210303-Ａ-01",
                    type: "定檢",
                    station: "上萬安段",
                    dispatchDate: "2020/02/05 13:00",
                    makeRecord: "",
                    showType: 'inspection'
                }, */
                
            ],
        };
    },
    props: {
        dateSelect: {
            type: Object,
        }
    },
    methods: {
        filterHandler(value, row, column) {
            const property = column["property"];
            return row[property] === value;
        },
        get_dispatch(){
            let that = this
            this.axios.post("/dispatch_get", {
                show: 1, time: this.dateSelect
            }).then(data => {
                console.log(data.data.data)
                that.dispatchTable = data.data.data.dispatch_list
            })
        },
        editShow(type){
            if( type == 'inspection' ){
                this.$emit('inspecShow');
            }else{
                this.$emit('alertShow');
            }
        }
    },
    watch: {
        dateSelect(){
            console.log(this.dateSelect)
            this.get_dispatch()
        }
    }
};
</script>

<style>
</style>
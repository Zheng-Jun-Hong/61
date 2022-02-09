<template>
    <div class="dispatch_table">
        <el-table :data="dispatchTable">
            <el-table-column
                align="start"
                label="派工單號"
                prop="number"
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
                prop="station"
                min-width="60px"
            ></el-table-column>
            <el-table-column
                align="center"
                label="派工時間"
                prop="closeDate"
                min-width="80px"
            ></el-table-column>
            <el-table-column
                align="center"
                min-width="80px"
            >
                <template slot-scope="scope">
                    <el-button 
                    size="small"
                    @click="editShow(scope.row.showType)">
                        查看
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                label="下載"
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
    name: "storageRecord",
    data() {
        return {
            dispatchType: "",
            dataTypeFilter: [
                { text: "定檢", value: "定檢" },
                { text: "清洗", value: "清洗" },
                { text: "警報檢修", value: "警報檢修" },
            ],
            dispatchTable: [
                {
                    number: "上萬安段20210303-Ａ-01",
                    type: "定檢",
                    station: "上萬安段",
                    closeDate: "2020/02/05 13:00",
                    showType: 'inspection'
                },
                {
                    number: "上萬安段20210303-Ａ-01",
                    type: "清洗",
                    station: "上萬安段",
                    closeDate: "2020/02/05 13:00",
                    showType: 'inspection'
                },
                {
                    number: "上萬安段20210303-Ａ-01",
                    type: "警報檢修",
                    station: "上萬安段",
                    closeDate: "2020/02/05 13:00",
                    showType: 'alertRepair'
                },
            ],
        };
    },
    methods: {
        filterHandler(value, row, column) {
            const property = column["property"];
            return row[property] === value;
        },
        editShow(type){
            if( type == 'inspection' ){
                this.$emit('inspecShow');
            }else{
                this.$emit('alertShow');
            }
        }
    },
};
</script>

<style>
</style>
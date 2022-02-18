<template>
    <div class="page_wrap page_staflat">
        <h2>{{ pageTitle }}</h2>

        <div class="page_content">
            <el-tabs type="card" v-model="activeName">
                <el-tab-pane label="分析圖表" name="chartAnalysis">
                    <chart-analysis/>
                </el-tab-pane>
                <!-- <el-tab-pane label="電能比較表" name="elecComparision">
                    <powerCompare/>
                </el-tab-pane> -->
                <el-tab-pane label="DMY比較圖表" name="dmyCompare">
                    <dmy-compare v-if="activeName == 'dmyCompare'"/>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import chartAnalysis from '../components/chart/chartAnalysis.vue'
import powerCompare from '../components/chart/powerCompare.vue'
import dmyCompare from '../components/chart/dmyCompare.vue'
export default {
    name: "chartOverview",
	components:{		
		chartAnalysis, powerCompare, dmyCompare
	},
    data() {
        return {
            pageTitle: "圖表總覽",
            activeName: "chartAnalysis"
        };
    },
};
</script>

<style>
</style>
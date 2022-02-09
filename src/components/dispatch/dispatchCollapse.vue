<template>
    <div>
        <el-collapse v-model="discategory.cateopen">
            <el-collapse-item 
            v-for="item in discategory.categories"
            :key="item.name"
            :title="item.name" 
            :name="item.name">
                <div class="es_collapse"
                v-for="sub in item.children"
                :key="sub.catename">
                    <div class="escoll_quest">
                        <el-checkbox 
                        v-model="sub.check"
                        @change="discolCheckAll(sub)">
                            {{ sub.catename }}
                        </el-checkbox>
                        <span class="es_opencoll"><i class="el-icon-arrow-down"></i></span>
                    </div>
                    <div class="escoll_ans"><div>
                        <div 
                        class="dis_option"
                        v-for="opt in sub.options"
                        :key="opt.name"
                        @click="disOption(opt)"
                        :class="{ selected: opt.select }">
                            {{ opt.name }}
                        </div>
                    </div></div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div 
        ref="seleVal"
        style="margin: 1rem 0 0"
        class="seleted_value_wrap">
            <div>已選取：</div>
            <div class="seleted_value">
                <div 
                v-for="(item, idx) in dispatchSelected"
                :key="idx" >
                    {{item}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "dispatchCollapse",
    data(){
        return{
            discategory: {
                cateopen: ['分類A'],
                categories: [
                    { 
                        name: '分類A',
                        children: [
                            {
                                catename: '分類A-1',
                                check: false,
                                options: [
                                    { name: 'a-1項目1', select: false },
                                    { name: 'a-1項目2', select: false },
                                    { name: 'a-1項目3', select: false },
                                    { name: 'a-1項目4', select: false },
                                    { name: 'a-1項目5', select: false },
                                    { name: 'a-1項目6', select: false },
                                ]
                            }
                        ]
                    },{ 
                        name: '分類B',
                        children: [
                            {
                                catename: '分類B-1',
                                check: false,
                                options: [
                                    { name: 'b-1項目1', select: false },
                                    { name: 'b-1項目2', select: false },
                                    { name: 'b-1項目3', select: false },
                                    { name: 'b-1項目4', select: false },
                                    { name: 'b-1項目5', select: false },
                                    { name: 'b-1項目6', select: false },
                                ]
                            }
                        ]
                    }
                ]
            },
            dispatchSelected: [],
        }
    },
    methods: {
        //選擇全部
        discolCheckAll(sub){
            let ary = sub.options;
            let seleAry = this.dispatchSelected;
            if( sub.check === true ){
                ary.forEach(el => {
                    if( el.select === false ){
                        seleAry.push(el.name);
                    }
                    el.select = true;
                });
            }else{ //清除
                ary.forEach(el => {
                    if( el.select === true ){
                        for(let i = 0 ; i < seleAry.length ; i++ ){
                            if( seleAry[i] == el.name ){
                                seleAry.splice(i, 1)
                            }
                        }
                    }
                    el.select = false;
                });
            }
            this.showSelected()
        },
        //單一選擇
        disOption(opt){
            let seleAry = this.dispatchSelected;
            if( opt.select === true ){
                opt.select = false;
                for(let i = 0 ; i < seleAry.length ; i++ ){
                    if( seleAry[i] == opt.name ){
                        seleAry.splice(i, 1)
                    }
                }
            }else{ //清除
                opt.select = true;
                seleAry.push(opt.name);
            }
            this.showSelected()
        },
        showSelected(){
            if( this.dispatchSelected.length > 0 ){
                this.$refs['seleVal'].style.display = 'block';
            }else{
                this.$refs['seleVal'].style.display = 'none';
            }
        }
    }
};
</script>

<style>
</style>
<template>
    <div class="update_bill_container">
        <div v-if="!isUpdated" class="bill_record"></div>
        <div v-if="!isUpdated" class="btn_update_bill_wrapper">
            <el-button
                class="btn_chart_delete_record"
                @click="deleteBillRecord"
            >
                刪除紀錄
            </el-button>
            <el-button
                class="btn_chart_update_bill"
                type="primary"
                @click="updateBillRecord"
            >
                更新此紀錄
            </el-button>
        </div>
        <div v-else class="bill_upload_page">
            <el-upload
                class="bill_upload_area"
                drag
                multiple
                action="https://jsonplaceholder.typicode.com/posts/"
            >
                <div>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        將文件拖曳到此處，或<em>點擊上傳</em>
                    </div>
                    <div class="el-upload__tip" slot="tip">
                        範例解釋文字 只能上傳 JPG / PNG
                    </div>
                </div>
            </el-upload>
            <el-button
                class="btn_chart_update_bill"
                type="primary"
                @click.stop.prevent="callParentCloseUpload"
            >
                確認更新
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "updateBillReocrd",
    data() {
        return {
            isShow: true,
            isUpdated: false,
        };
    },
    methods: {
        deleteBillRecord() {},
        updateBillRecord() {
            this.isUpdated = true;
        },
        callParentCloseUpload() {
            this.isUpdated = false;
            this.$emit("close-bill-upload");
        },
    },
};
</script>
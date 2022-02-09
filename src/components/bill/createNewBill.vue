<template>
    <div class="bill_upload_page">
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
            class="btn_chart_new_bill"
            type="primary"
            v-show="parentIsShow"
            @click.stop.prevent="callParentCloseUpload"
        >
            確認上傳
        </el-button>
    </div>
</template>

<script>
export default {
    name: "createNewBill",
    props: {
        parentIsShow: {
            type: Boolean,
            default: true
        },
    },
    methods: {
        callParentCloseUpload() {
            this.$emit("close-bill-upload");
        },
    },
};
</script>


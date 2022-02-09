<template>
    <div>
        <div class="frared_wrap">
            <el-tabs v-model="activeName">
                <el-tab-pane label="使用者觀看區" name="first">
                    <div class="fra_content">
                        <div class="fra_con_top">
                            <div>
                                <el-popover
                                    placement="bottom-start"
                                    trigger="click"
                                >
                                    <el-button
                                        size="medium"
                                        slot="reference"
                                        class="esicon_btn"
                                    >
                                        <i class="icon-nav_factory"></i
                                        >選擇電站</el-button
                                    >
                                    <select-station-single-group :v-model="group_select" @setGroup="setGroup" />
                                </el-popover>
                            </div>
                            <div style="margin-left: 1rem;">
                                <el-autocomplete
                                    v-model="plant_search"
                                    :fetch-suggestions="querySearchAsync"
                                    placeholder="搜尋"
                                    value-key="name"
                                    @select="handleSelect"
                                ></el-autocomplete>
                            </div>
                            <div>
                                <h2>{{ tabTitle }}</h2>
                            </div>
                            <div style="float: right;">
                                <el-select v-model="userview_value" placeholder="請選擇紀錄" v-if="userview_data.length > 0">
                                    <el-option
                                    v-for="item in userview_data"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                <div v-else>
                                    無紀錄
                                </div>
                            </div>
                        </div>
                        <!-- <div class="stbigimg" id="userview_zone"></div> -->
                        <iframe class="stbigimg" src="" id="userview_zone"></iframe>
                    </div>
                </el-tab-pane>
                <!-- --------------------------------------------------------------------------- -->
                <el-tab-pane label="上傳區" name="second">
                    <div class="fra_content">
                        <div class="fra_con_top">
                            <div>
                                <el-popover
                                    placement="bottom-start"
                                    trigger="click"
                                >
                                    <el-button
                                        size="medium"
                                        slot="reference"
                                        class="esicon_btn"
                                    >
                                        <i class="icon-nav_factory"></i
                                        >選擇電站</el-button
                                    >
                                    <select-station-single-group :v-model="group_select" @setGroup="setGroup" />
                                </el-popover>
                            </div>
                            <div>
                                <h2>{{ tabTitle }}</h2>
                            </div>
                        </div>
                         <div style="margin-bottom: 2rem;">
                            拍攝日期
                            <dateMonthPicker
                                :date-seleced="dateSelected"
                                @set-date="setDate"
                            />
                            <el-time-select
                                v-model="timeSelected"
                                :picker-options="{
                                    start: '00:00',
                                    end: '24:00'
                                }"
                                placeholder="選擇時間">
                            </el-time-select>

                        </div>
                        <div class="fra_upload">
                            <div :class="{'disable-div': group_select.length == 0}" v-loading="company_loading">
                                <div class="fra_up_title">廠商上傳區</div>
                                <el-upload
                                    class="esupload"
                                    drag
                                    multiple
                                    action="/api/thermalImage_upload_file_company"
                                    accept="image/*,.html,.tfw"
                                    :auto-upload="false"
                                    ref="company_upload"
                                    :file-list="company_filelist"
                                >
                                    <div>
                                        <i class="el-icon-upload"></i>
                                        <div class="el-upload__text">
                                            將文件拖曳到此處，或<em
                                                >點擊上傳</em
                                            >
                                        </div>
                                        <div class="el-upload__tip" slot="tip">
                                            先選擇電站與拍攝日期後才能上傳
                                        </div>
                                    </div>
                                </el-upload>
                                <el-button slot="trigger" size="small" type="primary" @click="upload_file_company">點選上傳</el-button>
                            </div>
                            <div  :class="{'disable-div': group_select.length == 0}" v-loading="user_loading">
                                <div class="fra_up_title">使用者上傳區</div>
                                <el-upload
                                    class="esupload"
                                    drag
                                    multiple
                                    action="/api/thermalImage_upload_file_company"
                                    accept="image/*,.html,.tfw"
                                    :auto-upload="false"
                                    ref="user_upload"
                                    :file-list="user_filelist"
                                >
                                    <div>
                                        <i class="el-icon-upload"></i>
                                        <div class="el-upload__text">
                                            將文件拖曳到此處，或<em
                                                >點擊上傳</em
                                            >
                                        </div>
                                        <div class="el-upload__tip" slot="tip">
                                            先選擇電站與拍攝日期後才能上傳
                                        </div>
                                    </div>
                                </el-upload>
                                <el-button slot="trigger" size="small" type="primary" @click="upload_file_user">點選上傳</el-button>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <!-- --------------------------------------------------------------------------- -->
                <el-tab-pane label="廠商下載區" name="third">
                    <div class="fra_content">
                        <div class="fra_con_top">
                            <div>
                                <el-popover
                                    placement="bottom-start"
                                    trigger="click"
                                >
                                    <el-button
                                        size="medium"
                                        slot="reference"
                                        class="esicon_btn"
                                    >
                                        <i class="icon-nav_factory"></i
                                        >選擇電站</el-button
                                    >
                                    <select-station-single-group :v-model="group_select" @setGroup="setGroup" />
                                </el-popover>
                            </div>
                            <div>
                                <h2>{{ tabTitle }}</h2>
                            </div>
                        </div>
                        <!-- <div class="time_range_selector">
                            <timeRangePicker />
                        </div> -->
                        <!-- <div style="margin-bottom: 1rem;">
                            <el-select v-model="userview_value" placeholder="請選擇紀錄" v-if="userview_data.length > 0">
                                <el-option
                                v-for="item in userview_data"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <div v-else>
                                
                            </div>
                        </div> -->
                        <el-button type="primary" style="margin-bottom: 1rem;" @click="download">下載</el-button>
                        <el-table :data="downloadTable"
                        @selection-change="handleSelectionChange">
                            <el-table-column
                                prop="station"
                                label="案場"
                            ></el-table-column>
                            <el-table-column
                                prop="group"
                                label="群組"
                            ></el-table-column>
                            <el-table-column
                                prop="date"
                                label="時間"
                            ></el-table-column>
                            <el-table-column
                                prop="zone"
                                type="selection"
                                fixed="right"
                                width="100"
                            ></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import selectStationSingleGroup from "../station/selectStation_singleGroup.vue"
import dateMonthPicker from "../datepicker/dateMonthPicker.vue";
import timeRangePicker from "../datepicker/timeRangePicker.vue";
import { Loading } from 'element-ui';

export default {
    name: "stationGraTabInfrared",
    components: {
        selectStationSingleGroup,
        dateMonthPicker,
        timeRangePicker,
    },
    data() {
        return {
            plant_search: "",
            dateSelected: "",
            timeSelected: "00:00",
            activeName: "first",
            tabTitle: "",
            downloadTable: [
                /* {
                    station: "上萬安段",
                    group: " 上萬安段-地號5、33、34",
                    date: "2020-12-01~2020-12-10",
                }, */
                
            ],
            group_select: [],
            userview_value: "",
            userview_data: [],
            multipleSelection: [],
            company_filelist: [],
            user_filelist: [],
            company_loading: false,
            user_loading: false,
        };
    },
    created() {
        this.dateSelected = new Date();
    },
    methods: {
        setDate(data){
            this.dateSelected = data
            if(this.group_select.length > 0)
                this.user_view()
            
        },
        setGroup(data){
            this.group_select = data
            document.getElementById('userview_zone').src = ""
            if(this.group_select.length > 0){
                this.tabTitle = `${this.group_select[1]}/${this.group_select[2]}/${this.group_select[3]}`
                this.user_view()
                
            }
            else{
                this.tabTitle = ""
            }
        },
        upload_file_user(){
            let that = this
            let formData = new FormData();  //  FormData 
            formData.append('plantName', this.group_select[1])
            formData.append('groupName', `${this.group_select[2]}_${this.group_select[3]}`)
            formData.append('filming_time', `${this.dateSelected} ${this.timeSelected}`)
            let fileCount = 0
            let { uploadFiles } = this.$refs.user_upload
            uploadFiles.forEach(file => { 
                formData.append(`file${fileCount}`, file.raw)	
                fileCount += 1	
            }) 
            formData.append('fileLength', fileCount)
                
            this.user_loading = true
            this.axios.post('/thermalImage_upload_file', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function(data){
                console.log(data.data.data)
                formData.append("pathName", data.data.data.pathName)
                that.axios.post('/ir_server/save_images',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(function(data){
                    alert('上傳成功')
                    that.user_filelist = []
                    that.user_loading = false
                }).catch(e =>{
                    alert('無法與遠端Server連線')
                    that.user_loading = false
                })

            }).catch(function(e){
                alert('無法Server連線')
                that.user_loading = false
            })
        },
        upload_file_company(){
            let that = this
            let formData = new FormData();  //  FormData 
            formData.append('plantName', this.group_select[1])
            formData.append('groupName', `${this.group_select[2]}_${this.group_select[3]}`)
            formData.append('filming_time', `${this.dateSelected} ${this.timeSelected}`)
            let fileCount = 0
            let { uploadFiles } = this.$refs.company_upload
            uploadFiles.forEach(file => { 
                formData.append(`file${fileCount}`, file.raw)	
                fileCount += 1	
            }) 
            formData.append('fileLength', fileCount)
                
            this.company_loading = true
            this.axios.post('/thermalImage_upload_file_company', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function(data){
                console.log(data.data.data)
                formData.append("pathName", data.data.data.pathName)
                formData.append("ID", data.data.data.group_ID)
                that.axios.post('/ir_server/save_files_company',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(function(data){
                    alert('上傳成功')
                    that.company_filelist = []
                    that.company_loading = false
                }).catch(e =>{
                    alert('無法與遠端Server連線')
                    that.company_loading = false
                })

            }).catch(function(e){
                alert('無法Server連線')
                that.company_loading = false
            })
        },
        user_view(){
            let that = this
            this.axios.post('/get_thermalImage_timepath', {
                plantName: this.group_select[1],
                groupName: `${this.group_select[2]}_${this.group_select[3]}`
            }).then(function(data){
                //console.log(data.data.data)
                let _data = data.data.data
                that.userview_data = []
                that.userview_value = ""
                that.downloadTable = []
                for(var i in _data){
                    that.userview_data.push({
                        label: _data[i].time,
                        value: _data[i].htmlpath
                    })
                    that.downloadTable.push({
                        station: that.group_select[1],
                        group:  `${that.group_select[2]}_${that.group_select[3]}`,
                        date: _data[i].time,
                        pathName: _data[i].htmlpath
                    })
                }
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async download(){
            let that = this
            console.log(this.multipleSelection)
            for(var i in this.multipleSelection){
                let loadingInstance = Loading.service({ fullscreen: true })
                await that.axios.post('/IR_image_downloadzip', {
                    pathName: that.multipleSelection[i].pathName
                }).then(function(data){
                    console.log(data.data.data)
                    let link = document.createElement("a")
                    link.id =  `downlink${i}`
                    document.body.appendChild(link)
                    link.href = data.data.data
                    link.download = `${that.multipleSelection[i].station}_${that.multipleSelection[i].group}_${that.multipleSelection[i].date}.zip`
                    link.click()
                    document.body.removeChild(link);
                    loadingInstance.close()
                })
            }
        },
        async querySearchAsync(queryString, cb) {
			//console.log(queryString)
			//console.log(this.PV_data)
			await this.axios.post('/station_search_regex_group', {
                query: queryString
            }).then(data => {
                //console.log(data.data.data)
                if(data.data.data.length == 0){
                    cb([{'name': '無資料'}])
                }else{
                    cb(data.data.data)
                }
            })
		},
        handleSelect(item) {
			//console.log(item)
			if(item.name == '無資料'){
				return false
			}

			if(item.collection == 'pv_group'){
				this.setGroup([null, item.PV, item.lgroup, item.realName, null])
			}
		},
    },
    watch:{
        userview_value(){
            if(this.userview_value !== ""){
                console.log(this.userview_value)
                document.getElementById('userview_zone').src = `./solar_static/uploadThermalImage/${this.userview_value}PVMap.html`
            }
        },
        activeName(){
            if(this.activeName == 'first' && this.group_select.length > 0){
                this.user_view()
            }
        }
    },
};
</script>
<style>
.disable-div{
    pointer-events: none;
    opacity: 0.4;
}
.el-table__header tr{
	background-attachment: fixed !important;
}
</style>
<style scoped>
.fra_con_top > div:nth-child(3){
    float: unset;
}
</style>
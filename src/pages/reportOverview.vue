<template>
    <div class="page_wrap">
        <h2 v-show="isShow">{{ pageTitle }}</h2>
        <div v-show="isShow" class="page_content">
            <div class="repo_head">
                <div style="display: flex; align-items: center;">
                    <el-popover placement="bottom-start" trigger="click">
                        <el-button
                            size="medium"
                            slot="reference"
                            class="esicon_btn"
                        >
                            <i class="icon-nav_factory"></i>選擇電站</el-button
                        >
                        <selectStation  v-model="plant_select" />
                    </el-popover>
                    <span style="margin-left: 8px;">
						<el-autocomplete
							v-model="plant_search"
							:fetch-suggestions="querySearchAsync"
							placeholder="搜尋"
							value-key="name"
							@select="handleSelect"
						></el-autocomplete>
					</span>
                    <el-select
                        v-model="typeSelected"
                        :placeholder="reportType[typeSelected]"
                        @change="checkTableType($event)"
                    >
                        <template slot="prefix"
                            ><i
                                style="color: #282828; font-size: 18px"
                                class="el-icon-tickets"
                            ></i
                        ></template>
                        <el-option
                            v-for="(name, type) in reportType"
                            :key="type"
                            :value="type"
                            :label="name"
                        >
                        </el-option>
                    </el-select>
                    <el-button style="margin-left: auto;" @click="download">下載</el-button>
                    <el-button
                        @click="createBill"
                        v-show="false"
                        type="primary"
                        >新增電費單</el-button
                    >
                </div>
                <div>
                    <div class="time_range_selector">
                        <timeRangePicker v-model="date_selection" />
                    </div>
                </div>
            </div>
            <div class="repo_table">
                <el-table
                    v-show="['day_report', 'year_report', 'month_report'].includes(typeSelected)"
                    :data="reportData"
                    :empty-text="'無報表'"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        label="報表類型"
                        prop="reportType"
                    ></el-table-column>
                    <el-table-column
                        label="電站"
                        prop="group"
                    ></el-table-column>
                    <el-table-column
                        label="期數"
                        prop="period"
                    ></el-table-column>
                    <el-table-column label="時間" prop="date"></el-table-column>
                    <el-table-column
                        type="selection"
                        fixed="right"
                        width="60"
                    ></el-table-column>
                </el-table>
            </div>
            <div class="repo_table">
                <el-table
                    v-show="['week_report'].includes(typeSelected)"
                    :data="reportData"
                    :empty-text="'無報表'"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        label="報表類型"
                        prop="reportType"
                    ></el-table-column>
                    <el-table-column label="時間" prop="date"></el-table-column>
                    <el-table-column
                        type="selection"
                        fixed="right"
                        width="60"
                    ></el-table-column>
                </el-table>
            </div>
            <div class="repo_table">
                <el-table
                    v-show="['Tday_report'].includes(typeSelected)"
                    :data="reportData"
                    :empty-text="'無報表'"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        label="報表類型"
                        prop="reportType"
                    ></el-table-column>
                    <el-table-column
                        label="電站"
                        prop="group"
                    ></el-table-column>
                    <el-table-column
                        label="期數"
                        prop="period"
                    ></el-table-column>
                    <el-table-column label="時間" prop="date"></el-table-column>
                    <el-table-column
                        type="selection"
                        fixed="right"
                        width="60"
                    ></el-table-column>
                </el-table>
            </div>
            <div class="repo_table">
                <el-table
                    v-show="['inverter_excel'].includes(typeSelected)"
                    :data="reportData"
                    :empty-text="'無報表'"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        label="報表類型"
                        prop="reportType"
                    ></el-table-column>
                    <el-table-column
                        label="電站"
                        prop="group"
                    ></el-table-column>
                    <el-table-column
                        label="變流器"
                        prop="inverter"
                    ></el-table-column>
                    <el-table-column label="時間" prop="date"></el-table-column>
                    <el-table-column
                        type="selection"
                        fixed="right"
                        width="60"
                    ></el-table-column>
                </el-table>
            </div>
            <div class="repo_table">
                <el-table
                    v-show="false"
                    :empty-text="'無報表'"
                >
                    <el-table-column
                        label="報表類型"
                        prop="repoType"
                    ></el-table-column>
                    <el-table-column
                        label="電站"
                        prop="repoStation"
                    ></el-table-column>
                    <el-table-column
                        label="分組"
                        prop="gourp"
                        min-width="150"
                    ></el-table-column>
                    <el-table-column
                        label="月份"
                        prop="month"
                    ></el-table-column>
                    <el-table-column
                        label="本期度數 kWh"
                        prop="kwh"
                    ></el-table-column>
                    <el-table-column
                        label="本期電費 元"
                        prop="cost"
                    ></el-table-column>
                    <el-table-column
                        label="上傳時間"
                        prop="dateUpload"
                    ></el-table-column>
                    <el-table-column label="查看">
                        <template>
                            <el-button @click="updateBill" size="small"
                                >查看</el-button
                            >
                        </template>
                    </el-table-column>
                    <el-table-column
                        type="selection"
                        fixed="right"
                        width="60"
                    ></el-table-column>
                </el-table>
            </div>
            <div class="pagination_wrap">
				<el-pagination
				background
				layout="prev, pager, next"
				:total="total_report"
				:current-page.sync="current_page"
				@current-change="search_bill">
				</el-pagination>
			</div>
        </div>

        <div class="es_popup" ref="createNewBill">
            <div class="create_new_bill_wrap">
                <div class="create_bill_selector">
                    <el-popover placement="bottom-start" trigger="click">
                        <el-button
                            size="medium"
                            slot="reference"
                            class="esicon_btn"
                        >
                            <i class="icon-nav_factory"></i
                            >選擇縣市／區域</el-button
                        >
                        <selectStation />
                    </el-popover>
                    <dateMonthPicker
                        :parentPickerType="pickerType"
                        :parentDate="dateSelected"
                        @select-last-month="selectLastMonth"
                        @select-next-month="selectNextMonth"
                    />
                </div>
                <createNewBill @close-bill-upload="closePop" />
            </div>
        </div>
        <div class="es_popup" ref="updateBillRecord">
            <div class="update_new_bill_wrap">
                <div class="update_bill_selector">
                    <div class="update_bill_title">No.1234</div>
                    <dateMonthPicker
                        :parentPickerType="pickerType"
                        :parentDate="dateSelected"
                        :parent-is-disabled="isDisabled"
                    />
                </div>
                <updateBillRecord @close-bill-upload="closePop" />
            </div>
        </div>
        <div
            ref="closePop"
            class="close_popup_bill"
            v-show="!isShow"
            @click.stop.prevent="closePop"
        >
            <i class="el-icon-close"></i>
        </div>
    </div>
</template>

<script>
import selectStation from "../components/station/selectStation.vue";
import dateMonthPicker from "../components/datepicker/dateMonthPicker.vue";
import timeRangePicker from "../components/datepicker/timeRangePicker.vue";
import createNewBill from "../components/bill/createNewBill.vue";
import updateBillRecord from "../components/bill/updateBillRecord.vue";

//JSZip
import JSZip from 'jszip' 
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver'

// Element loading
import { Loading } from 'element-ui';

export default {
    name: "reportOverview",
    components: {
        selectStation,
        dateMonthPicker,
        timeRangePicker,
        createNewBill,
        updateBillRecord,
    },
    data() {
        return {
            isShow: true,
            isDisabled: true,
            pickerType: "month",
            dateSelected: new Date(),
            pageTitle: "報表總覽",
            reportType: {
                /* day_report: '日報表', */
                week_report: '週報表-A',
                month_report: '月報表',
                /* year_report: '年報表', */
                Tday_report: '旬報表',
                inverter_excel: '變流器報表',
                electricBill: '電費單',
                
            },
            typeSelected: "選擇報表類型",
            reportData: [],
            current_page: 1,
            total_report: 0,
            reportSelected: [],
            plant_search: "",
            plant_select: {'ID_list': [], 'col_list': []},
            date_selection: {},
        };
    },
    methods: {
        checkTableType(){
            this.search_bill()
        },
        createBill() {
            this.isShow = false;
            this.$refs.createNewBill.style.display = "block";
        },
        updateBill() {
            this.isShow = false;
            this.$refs.updateBillRecord.style.display = "block";
        },
        closePop() {
            this.isShow = true;
            this.$refs.createNewBill.style.display = "none";
            this.$refs.updateBillRecord.style.display = "none";
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
        async querySearchAsync(queryString, cb) {
			//console.log(queryString)
			//console.log(this.PV_data)
			await this.axios.post('/station_search_regex', {
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
            this.plant_select = {
                ID_list: [item.ID],
                col_list: [item.collection]
            }	
		},
        search_bill(){
            this.reportData = []
            this.reportSelected = []
            if(this.typeSelected == "選擇報表類型"){
                return false
            }
            console.log(this.plant_select)
            console.log(this.typeSelected)
            console.log(this.date_selection)
            let request_json = {
                page: this.current_page,
                time: { mode: this.date_selection.mode, start_date: this.date_selection.date_list[0],
                end_date: this.date_selection.date_list[1]},
                ID_list: this.plant_select.ID_list,
                col_list: this.plant_select.col_list,
            }
            switch(this.typeSelected){
                case "Tday_report":
                    this.report_get_Tday(request_json)
                    break
                case "inverter_excel":
                    this.report_get_inverter(request_json)
                    break
                case "month_report":
                    this.report_get_month_report(request_json)
                    break
                case "week_report":
                    this.report_get_week_report(request_json)
                    break
                default:
                    break
            }
            
        },
        report_get_Tday(request_json){
            let that = this
            this.axios.post("/report_get_Tday", request_json).then(data => {
                //console.log(data.data.data)
                that.total_report = data.data.data.total_report
                data.data.data.data.forEach(element => {
                    that.reportData.push({
                        reportType: '旬報表',
                        group: element.group,
                        date: element.time,
                        period: element.period,
                        filename: element.filename,
                        url: `solar_static/excel/${element.filename}`
                    })
                })
            })
        },
        report_get_inverter(request_json){
            let that = this
            this.axios.post("/report_get_inverter", request_json).then(data => {
                //console.log(data.data.data)
                that.total_report = data.data.data.total_report
                data.data.data.data.forEach(element => {
                    that.reportData.push({
                        reportType: '變流器報表',
                        group: element.group,
                        date: element.time,
                        inverter: element.inverter,
                        filename: element.filename,
                        url: `solar_static/inverter_excel/${element.filename}`
                    })
                })
            })
        },
        report_get_month_report(request_json){
            let that = this
            this.axios.post("/report_get_month_report", request_json).then(data => {
                //console.log(data.data.data)
                that.total_report = data.data.data.total_report
                data.data.data.data.forEach(element => {
                    that.reportData.push({
                        reportType: '月報表',
                        group: element.group,
                        date: element.time,
                        period: element.period,
                        filename: element.filename,
                        url: `solar_static/report_plot/${element.filename}`
                    })
                })
            })
        },
        report_get_week_report(request_json){
            let that = this
            this.axios.post("/report_get_week_report", request_json).then(data => {
                //console.log(data.data.data)
                that.total_report = data.data.data.total_report
                data.data.data.data.forEach(element => {
                    that.reportData.push({
                        reportType: '週報表-A',
                        date: element.time,
                        filename: element.filename,
                        url: `solar_static/week_report/${element.filename}`
                    })
                })
            })
        },
        // Table Selection
        handleSelectionChange(val) {
            this.reportSelected = []
            let that = this
            val.forEach(element => {
                this.reportSelected.push(element.url)                
            })
        },
        // Download
        async download(){
            let that = this
            let loadingInstance = Loading.service()
            function urlToPromise(url, filename="") {
                return new Promise(function(resolve, reject) {
                    JSZipUtils.getBinaryContent(url, function (err, data) {
                        if(err) {
                            reject(err)
                            alert(`找不到此檔案 ${filename}。\n下載中止`)
                        } else {
                            resolve(data)
                        }
                    });
                });
            }
            async function check_realtime(ID){
                let response = await that.axios.post('realtime_inv_excel_generate', {
                    ID: ID
                }, { responseType: 'blob' } )
                if(response.status == 200){
                    let contentDisposition = response.headers["content-disposition"]
                    let matches = contentDisposition.split("filename=")
                    let filename = "report.xlsx"
                    if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                    filename = decodeURI(filename)
                    //var obj = URL.createObjectURL(new Blob([response.data], {type: ''}))
                    return [new Blob([response.data], {type: ''}), filename]
                }
            }
            if(this.reportSelected.length == 1){
                if(this.reportSelected[0].split("_____")[1] == 'realtime'){
                    let obj = await check_realtime(this.reportSelected[0].split("_____")[2])
                    let link = document.createElement("a")
                    document.body.appendChild(link)
                    link.href = URL.createObjectURL(obj[0], {type: ''})
                    link.download = obj[1]
                    link.click()
                    document.body.removeChild(link)
                }
                else{
                    let link = document.createElement("a")
                    document.body.appendChild(link)
                    let uri = this.reportSelected[0]
                    link.href = uri
                    link.click()
                    document.body.removeChild(link)
                }
                
                
            }else if(this.reportSelected.length > 1){
                var zip = new JSZip()
                var folder = zip.folder("report")
                for(var i in this.reportSelected){
                    let uri = this.reportSelected[i]
                    if(uri.split("_____")[1] == 'realtime'){
                        let obj = await check_realtime(uri.split("_____")[2])
                        folder.file(obj[1], obj[0])
                    }
                    else{
                        let filename = uri.split("/")
                        filename = filename[filename.length - 1]
                        folder.file(filename, urlToPromise(uri, filename), {binary:true})
                    }
                }
                zip.generateAsync({type:"blob"})
                .then(function callback(blob) {
                    saveAs(blob, "report.zip")
                })
            }
            loadingInstance.close()
            return false
        }
    },
    watch: {
        plant_select(){
            this.current_page = 1
            this.search_bill()
        },
        date_selection(){
            this.current_page = 1
            this.search_bill()
        },
        typeSelected(){
            this.current_page = 1
        }
    }
};
</script>

<style>
.el-table__header tr{
	background-attachment: fixed !important;
}
</style>
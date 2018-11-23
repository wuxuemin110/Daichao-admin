<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.productDisplayNum" placeholder="产品编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.productName" placeholder="产品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="点击时间">
        <el-date-picker
          unlink-panels
          v-model="dataForm.createTime"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!--<el-button v-if="isAuth('sys:channel:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->

      </el-form-item>
      <el-form-item>
        <el-button  v-loading.fullscreen.lock="fullscreenLoading"  @click="Download()"   type="primary">导出列表</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :summary-method="getSummaries"
      show-summary
      style="width: 100%;">

      <el-table-column
        prop="date"
        v-if="isTrue"
        header-align="center"
        align="center"
        width="100"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="productDisplayNum"
        header-align="center"
        align="center"

        label="产品编号">
      </el-table-column>
      <el-table-column
        prop="loanTitle"
        header-align="center"
        align="center"

        label="代超名称">
      </el-table-column>
      <el-table-column
        prop="count"
        header-align="center"
        align="center"

        label="点击次数">
      </el-table-column>
      <el-table-column
        prop="completeCount"
        header-align="center"
        align="center"

        label="加载完成次数">
      </el-table-column>
      <el-table-column
        prop="sumRegisteredCount"
        header-align="center"
        align="center"

        label="注册数">
        <template slot-scope="scope">
          <span>{{scope.row.sumRegisteredCount?scope.row.sumRegisteredCount:0 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="loadRate"
        header-align="center"
        align="center"
        width="120"
        label="加载完成率">
        <template slot-scope="scope">
          <span>{{scope.row.loadRate }}%</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="conversionRate"
        header-align="center"
        align="center"

        label="注册转换率">
        <template slot-scope="scope">
          <span>{{scope.row.conversionRate?scope.row.conversionRate:0 }}%</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        dataForm: {
          productName: null,
          productDisplayNum: null,
          date: null
        },
        isTrue: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,

        fullscreenLoading: false,

        allList: ['合计']

      }
    },
    activated () {
      this.getDataList()
      this.getALLdataList()
    },
    methods: {
      // 获取合计
      getSummaries (param) {
        return this.allList
      },
      getALLdataList () {
        this.$http({
          url: this.$http.adornUrl(`/generation/clickloans/clickSum`),
          method: 'get',
          params: this.$http.adornParams({
            'token': this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.allList[3] = data.list[0]
            this.allList[4] = data.list[1]
            this.allList[5] = data.list[2]
            this.allList[6] = data.list[3]
            this.allList[7] = data.list[4]
          }
        })
      },
      dateFormat (row, column) {
        var date = row[column.property]
        if (date === undefined || date == null) {
          return ''
        }
        return formatDate(new Date(date), 'yyyy-MM-dd hh:mm:ss')
      },
      Download () {
        window.location.href = this.$http.adornUrl(`/sys/report/clickReportDownload?token=${this.$cookie.get('token')}${this.pageIndex ? '&page=' + this.pageIndex : ''}${this.pageSize ? '&limit=' + this.pageSize : ''}${this.dataForm.loanName ? '&loanName=' + this.dataForm.loanName : ''}${this.dataForm.startTime ? '&startTime=' + this.dataForm.startTime : ''}${this.dataForm.endTime ? '&endTime=' + this.dataForm.endTime : ''}`)
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        if (this.dataForm.createTime === undefined || this.dataForm.createTime === null) {
          this.isTrue = true
        } else {
          this.isTrue = false
        }

        this.$http({
          url: this.$http.adornUrl(`/generation/clickloans/all/list`),
          method: 'get',
          params: this.$http.adornParams({
            'token': this.$cookie.get('token'),
            'page': this.pageIndex,
            'limit': this.pageSize,
            'productName': this.dataForm.productName || null,
            'productDisplayNum': this.dataForm.productDisplayNum || null,
            'startDate': this.dataForm.date !== null ? this.dataForm.date[0] : null,
            'endDate': this.dataForm.date !== null ? this.dataForm.date[1] : null
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      }
    }
  }
</script>

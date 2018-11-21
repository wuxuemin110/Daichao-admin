<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="贷超名称">
        <el-input v-model="dataForm.loanName" placeholder="贷超名称" clearable style="width: 150px;"></el-input>
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
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"

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
          loanName: null,
          createTime: null
        },
        isTrue: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      dateFormat (row, column) {
        var date = row[column.property]
        if (date === undefined || date == null) {
          return ''
        }
        return formatDate(new Date(date), 'yyyy-MM-dd hh:mm:ss')
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
            'page': this.pageIndex,
            'limit': this.pageSize,
            'loanName': this.dataForm.loanName,
            'startTime': this.dataForm.createTime !== null ? this.dataForm.createTime[0] : null,
            'endTime': this.dataForm.createTime !== null ? this.dataForm.createTime[1] : null
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

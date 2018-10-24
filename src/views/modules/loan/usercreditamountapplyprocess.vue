<template>
  <div class="mod-config">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="处理状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">待审核</span>
          <span v-if="scope.row.status === 1">取消</span>
          <span v-if="scope.row.status === 2">审核中</span>
          <span v-if="scope.row.status === 3">通过</span>
          <span v-if="scope.row.status === 4">拒绝</span>
          <span v-if="scope.row.status === 5">机审通过</span>
          <span v-if="scope.row.status === 6">机审拒绝</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operateUserName"
        header-align="center"
        align="center"
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="operateTime"
        header-align="center"
        align="center"
        :formatter="dateFormat"
        label="操作时间">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="处理说明">
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
        applyId: null,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    methods: {
      dateFormat (row, column) {
        var date = row[column.property]
        if (date === undefined || date == null) {
          return ''
        }
        return formatDate(new Date(date), 'yyyy-MM-dd hh:mm:ss')
      },
      init (applyId) {
        if (this.applyId !== applyId) {
          this.applyId = applyId || 0
          this.dataList = []
          this.getDataList()
        }
      },
      // 获取数据列表
      getDataList () {
        this.$nextTick(() => {
          if (this.applyId) {
            this.dataListLoading = true
            this.$http({
              url: this.$http.adornUrl(`/sys/usercreditamountapply/process/log`),
              method: 'get',
              params: this.$http.adornParams({
                'page': this.pageIndex,
                'limit': this.pageSize,
                'applyId': this.applyId
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
          }
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
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 弹窗关闭，清除数据
      clear () {
        this.applyId = 0
      }
    }
  }
</script>

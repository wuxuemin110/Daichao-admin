<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.productName" placeholder="产品名称查询" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.productDisplayNum" placeholder="产品编号查询" clearable></el-input>
      </el-form-item>
      <el-form-item label="日期" >
        <el-date-picker
          unlink-panels
          v-model="dataForm.date"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>

      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">

      <el-table-column
        prop="productDisplayNum"
        header-align="center"
        align="center"
        label="产品编号">
      </el-table-column>
      <el-table-column
        prop="productName"
        header-align="center"
        align="center"
        label="产品名字">
      </el-table-column>

      <el-table-column
        prop="price"
        header-align="center"
        align="center"

        label="单价">
      </el-table-column>

      <el-table-column
        prop="balance"
        header-align="center"
        align="center"

        label="余额">
      </el-table-column>
      <el-table-column
        prop="clickComplete"
        header-align="center"
        align="center"

        label="点击数">
      </el-table-column>
      <el-table-column
        prop="settedCount"
        header-align="center"
        align="center"

        label="结算金额">
      </el-table-column>
      <el-table-column
        prop="settedRegistered"
        header-align="center"
        align="center"

        label="结算注册数">
      </el-table-column>
      <el-table-column
        prop="conversionRate"
        header-align="center"
        align="center"
        label="注册转化率">
      </el-table-column>

      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="结算时间">
      </el-table-column>
      <el-table-column
        prop="totalRecharge"
        header-align="center"
        align="center"
        label="总充值">
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
          productDisplayNum:null,
          date:null
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        dataListSelections:[]
      }
    },
    components: {

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
        this.$http({
          url: this.$http.adornUrl(`/generation/companyProduct/balance/list`),
          method: 'get',
          params: this.$http.adornParams({
            'token': this.$cookie.get('token'),
            'page': this.pageIndex,
            'limit': this.pageSize,
            'productName': this.dataForm.productName || null,
            'productDisplayNum':this.dataForm.productDisplayNum || null,
            'startDate':this.dataForm.date !== null ? this.dataForm.date[0] : null,
            'endDate':this.dataForm.date !== null ? this.dataForm.date[1] : null,
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.companyProductBalanceVOs
            this.totalPage = data.totalCount
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
      },

      // 新增 / 修改
      addOrUpdateHandle (item) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(item)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定要删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generation/companyInfo/delete'),
            method: 'post',
            params: this.$http.adornParams({
              'token':this.$cookie.get('token'),
              'companyId':id,
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>

<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.productDisplayNum" placeholder="产品编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.productName" placeholder="产品名称" clearable></el-input>
      </el-form-item>

      <el-form-item label="日期" >
        <el-date-picker
          unlink-panels
          v-model="dataForm.date"
          type="datetimerange"

          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"

          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>


      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('generation:companyProduct:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :formatter="dateFormat"
        label="日期">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="companyId"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="公司编号">-->
      <!--</el-table-column>-->
      <el-table-column

        header-align="center"
        align="center"
        label="产品编号">
        <template slot-scope="scope">
         <span>{{  `${scope.row.companyId}-${scope.row.productNum}` }}</span>
        </template>

      </el-table-column>

      <!--<el-table-column-->
        <!--prop="companyName"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="公司名称">-->
      <!--</el-table-column>-->

      <el-table-column
        prop="productName"
        header-align="center"
        align="center"
        label="产品名称">
      </el-table-column>
      <el-table-column
        prop="linkUrl"
        header-align="center"
        align="center"
        label="产品链接">
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="合作单价">
        <template slot-scope="scope">
          <span>{{scope.row.price}}元</span>
        </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="contactName"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="对接人">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="contactMobile"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="联系方式">-->
      <!--</el-table-column>-->
      <el-table-column
      prop="sumClickComplete"
      header-align="center"
      align="center"
      label="当日点击数上限">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.productId)">删除</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './customer-add-or-delete'
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        dataForm: {

          productName: null,
          productDisplayNum: null,
          date: null
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
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
        return formatDate(new Date(date), 'yyyy-MM-dd')
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/generation/companyProduct/list`),
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
            this.dataList = data.companyProducts
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
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定要删除吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generation/companyProduct/delete'),
            method: 'post',
            params: this.$http.adornParams({
              'token': this.$cookie.get('token'),
              'productId': id
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
          }).catch(() => {

          })
        })
      }
    }
  }
</script>

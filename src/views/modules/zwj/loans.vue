<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <!--<el-form-item>-->
        <!--<el-input v-model="dataForm.loadName" placeholder="代超名称" clearable></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <!--<el-button @click="getDataList()">查询</el-button>-->
        <el-button  v-if="isAuth('generation:loans:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!--<el-button v-if="isAuth('generation:loans:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!--<el-table-column-->
        <!--type="selection"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--width="50">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="loanName"
        header-align="center"
        align="center"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="loanIconUrl"
        header-align="center"
        align="center"
        label="图标">
        <template slot-scope="scope">
          <img :src="scope.row.loanIconUrl" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>

	  <!--<el-table-column-->
        <!--prop="hotTag"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="热点标识">-->
      <!--</el-table-column>-->
	  <el-table-column
        prop="successCount"
        header-align="center"
        align="center"
        label="成功次数">
      </el-table-column>
	  <el-table-column
        prop="color"
        header-align="center"
        align="center"
        label="颜色编码">
      </el-table-column>
	  <el-table-column
        prop="minAmount"
        header-align="center"
        align="center"
        label="最小金额">
      <template slot-scope="scope">
        <span>{{scope.row.minAmount}}元</span>
      </template>
      </el-table-column>
	  <el-table-column
        prop="maxAmount"
        header-align="center"
        align="center"
        label="最大金额">
      <template slot-scope="scope">
      <span>{{scope.row.maxAmount}}元</span>
      </template>
      </el-table-column>
	  <el-table-column
        prop="days"
        header-align="center"
        align="center"
        label="日期">
      <template slot-scope="scope">
        <span>{{scope.row.days}}天</span>
      </template>
      </el-table-column>
	  <!--<el-table-column-->
        <!--prop="successRateTxt"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="成功年化文本">-->
      <!--</el-table-column>-->
	  <el-table-column
        prop="dayRate"
        header-align="center"
        align="center"
        label="日年化率">
      <template slot-scope="scope">
        <span>{{scope.row.dayRate}}%</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="successRate"
        header-align="center"
        align="center"
        label="自动下架阈值">
        <template slot-scope="scope">
          <span>{{scope.row.offCount}}次</span>
        </template>
      </el-table-column>
	  <!--<el-table-column-->
        <!--prop="applyCondition"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="描述">-->
      <!--</el-table-column>-->
	  <!--<el-table-column-->
        <!--prop="description"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="描述2">-->
      <!--</el-table-column>-->
	  <!--<el-table-column-->
        <!--prop="applyMaterial"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="条件">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="linkUrl"
        header-align="center"
        align="center"
        label="跳转地址">
      </el-table-column>
	  <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="首页推荐">
      <template slot-scope="scope">
        <span v-if="scope.row.orderNum == 0">不推荐</span>
        <span v-if="scope.row.orderNum == 1">推荐</span>

      </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">正常</span>
          <span v-if="scope.row.status == 1">锁定</span>
          <span v-if="scope.row.status == 2">删除</span>
          <span v-if="scope.row.status == 3">下架</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        header-align="center"
        align="center"
        label="排序">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button  v-if="isAuth('generation:loans:update')"  type="text" size="small" @click="addOrUpdateHandle(scope.row.loanId)">修改</el-button>
          <el-button  v-if="isAuth('generation:loans:delete') && scope.row.status != 2"  type="text"  size="small" @click="deleteHandle(scope.row)">删除</el-button>
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
  import AddOrUpdate from './loans-add-or-update'
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        dataForm: {
          loadName: ''
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
      fromatAmount (row, column) {
        var amount = row[column.property]
        if (amount === undefined || amount == null) {
          return ''
        }
        return amount / 100
      },
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
          url: this.$http.adornUrl(`/generation/loans/list`),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'flag': 0
          })
        }).then(({data}) => {
          console.log(data)
          if (data && data.code == 0) {
            this.dataList = data.data
            this.totalPage = data.count
            console.log(this.dataList,this.totalPage)
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (item) {
       console.log(item)
        this.$confirm(`确定对[${item.loanName}]进行删除批量删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generation/loans/del'),
            method: 'post',
            params: this.$http.adornParams({loanId:item.loanId})
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

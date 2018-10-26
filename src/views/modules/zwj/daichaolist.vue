<template>
  <div class="mod-config">
    <el-form :inline="true"  @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input placeholder="手机号" v-model="phone" clearable></el-input>
        <!--<el-button @click="getDataList()">查询</el-button>-->
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button  type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>

    </el-form>
    <el-table
      :data="dataList"
      border
      size="medium "
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
       >
      </el-table-column>
      <el-table-column
        prop="realName"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        label="用户ID">
      </el-table-column>
      <el-table-column
        prop="amount"
        header-align="center"
        align="center"
        label="借款金额">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}元</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="purpose"
        header-align="center"
        align="center"
        label="借款用途">
        <template slot-scope="scope">
          <span v-if="scope.row.purpose === 1">旅游娱乐</span>
          <span v-if="scope.row.purpose === 2">生活消费</span>
          <span v-if="scope.row.purpose === 3">电子数码</span>
          <span v-if="scope.row.purpose === 4">租房装修</span>
          <span v-if="scope.row.purpose === 5">医疗健康</span>
          <span v-if="scope.row.purpose === 0">其他用途</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="idCardNo"
        header-align="center"
        align="center"
        label="收款银行卡">
      </el-table-column>
      <el-table-column
        prop="loanRate"
        header-align="center"
        align="center"
        label="贷款利率">
        <template slot-scope="scope">
          <span>{{scope.row.loanRate}}%</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="loanLimitTime"
        header-align="center"
        align="center"
        label="贷款期限">
        <template slot-scope="scope">
          <span>{{scope.row.loanLimitTime}}天</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="当前状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">未获得额度</span>
          <span v-if="scope.row.status === 1">审核中</span>
          <span v-if="scope.row.status === 2">审核成功，获得信用额度</span>
          <span v-if="scope.row.status === 3">审核失败，15天后才能申请</span>
          <span v-if="scope.row.status === 4">贷款申请处理中</span>
          <span v-if="scope.row.status === 5">已贷款</span>
          <span v-if="scope.row.status === 6">已贷款逾期</span>
          <span v-if="scope.row.status === 7">还款中</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        :formatter="dateFormat"
        align="center"
        label="放款时间">
      </el-table-column>
      <el-table-column
        prop="dueTime"
        header-align="center"
        :formatter="dateFormat"
        align="center"
        label="还款时间">
      </el-table-column>
      <el-table-column
        prop="feeAmount"
        header-align="center"
        align="center"
        label="还款金额">
        <template slot-scope="scope">
          <span>{{scope.row.feeAmount/100 + scope.row.amount}}元</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  import AddOrUpdate from './daichao-add-or-update'
  import { formatDate } from '@/utils/format'
  export default {
    name: 'class',
    data () {
      return {
        dataList: [],

        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        phone: '',
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        value6: '',
        value7: ''
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
        return formatDate(new Date(date), 'yyyy-MM-dd hh:mm:ss')
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },

      getDataList () {

        this.$http({
          url: this.$http.adornUrl('/sys/userloan/list'),
          method: 'post',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'mobileNumber': this.phone
          })
        }).then((res) => {
          if(res.data.code !=  0){
            this.$message.error(res.data.msg)
          }else {

            this.totalPage = res.data.page.totalCount
            this.dataList = res.data.page.list
            console.log( this.dataList)
          }
        })
        // this.$http({
        //   url: 'https://api.nytimes.com/svc/archive/v1/2016/1.json?api-key=da38403f168642ea8ffd6585b23c7d8c',
        //   method: 'get',
        //
        // }).then((res) => {
        //   if(res.data.code !=  0){
        //     this.$message.error(res.data.msg)
        //   }else {
        //
        //     this.totalPage = res.data.page.totalCount
        //     this.dataList = res.data.page.list
        //     console.log( this.dataList)
        //   }
        // })
      },
      deleteHandle () {

      },
      selectionChangeHandle () {

      },
      sizeChangeHandle (page) {

      },
      currentChangeHandle (page) {

      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <!--<el-form-item>-->
        <!--<el-input v-model="dataForm.productNum" placeholder="产品编号查询" clearable></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-input v-model="dataForm.productName" placeholder="产品名字查询" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('generation:companyBalance:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        prop='productName'
        header-align="center"
        align="center"
        label="产品名称">

      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="接入单价">
        <template slot-scope="scope">
          <span>{{scope.row.price }}元</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="conversionRate"
        header-align="center"
        align="center"
        label="注册转化率">
        <template slot-scope="scope">
          <span>{{scope.row.conversionRate }}%</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="sumSettedRegistered"
        header-align="center"
        align="center"
        label="已结算注册数">
      </el-table-column>
      <el-table-column
        prop="sumClickComplete"
        header-align="center"
        align="center"
        label="累计点击数">
      </el-table-column>
      <el-table-column
        prop="sumSettedCount"
        header-align="center"
        align="center"
        label="已结算金额">
        <template slot-scope="scope">
          <span>{{scope.row.sumSettedCount }}元</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalRecharge"
        header-align="center"
        align="center"
        label="总充值">
        <template slot-scope="scope">
          <span>{{scope.row.totalRecharge }}元</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="balance"
        header-align="center"
        align="center"
        label="余额">
        <template slot-scope="scope">
          <span>{{scope.row.balance }}元</span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="account(scope.row)">结算</el-button>
          <el-button type="text" size="small" @click="recharge(scope.row)">充值</el-button>
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
    <!--新增-->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!--结算-->
    <accountBalance v-if="accountBalance" ref="accountBalance" @refreshDataList="getDataList" ></accountBalance>
    <!--充值-->
    <accountRecharge v-if='accountRecharge' ref="accountRecharge" @refreshDataList="getDataList" ></accountRecharge>
  </div>
</template>

<script>
  import AddOrUpdate from './account-add'
  import accountBalance from './account-balance'
  import accountRecharge from './account-recharge'
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        dataForm: {
          productNum: null,
          productName:null
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        accountBalance:false,
        accountRecharge:false
      }
    },
    components: {
      AddOrUpdate,
      accountBalance,
      accountRecharge
    },
    activated () {
      this.getDataList()
      console.log(this.$store.state.user)
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
          url: this.$http.adornUrl(`/generation/companyProduct/balance/sum/list`),
          method: 'get',
          params: this.$http.adornParams({
            'token':this.$cookie.get('token'),
            'page': this.pageIndex,
            'limit': this.pageSize,
            'productNum': this.dataForm.productNum || null,
            'productName':this.dataForm.productName || null,
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

      // 新增
      addOrUpdateHandle (item) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(item)
        })
      },
      //结算
      account(item){
        this.accountBalance = true
        this.$nextTick(()=>{
          this.$refs.accountBalance.init(item)
        })
      },
      //充值
      recharge(item){
        this.accountRecharge = true
        this.$nextTick(()=>{
          this.$refs.accountRecharge.init(item)
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
            params:this.$http.adornParams({
              'token':this.$cookie.get('token'),
              'productIds':id
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
          }).catch(()=>{

          })
        })
      }
    }
  }
</script>

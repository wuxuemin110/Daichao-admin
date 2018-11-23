<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.mobile" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="dataForm.channelId" placeholder="渠道名称">
          <el-option
            v-for="item in selectList"
            :key="item.id"
            :label="item.channelName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item>
        <el-input v-model="dataForm.channelId" placeholder="渠道id" clearable></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-input v-model="dataForm.deviceSource" placeholder="设备" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.market" placeholder="下载途径" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.appName" placeholder="app名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="最近一次登陆时间">
        <el-date-picker
          v-model="dataForm.lastLoginTime"
          type="date"
          value-format="timestamp"
          placeholder="最后一次登录">
        </el-date-picker>
      </el-form-item>
      <el-form-item label='登录次数'>
        <el-input-number v-model="dataForm.loginCount" placeholder="登录次数" clearable></el-input-number>
      </el-form-item>

      <el-form-item label="注册日期" >
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


      <el-form-item label='点击次数'>
        <el-input-number v-model="dataForm.clickCount" placeholder="点击次数" clearable></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  v-loading.fullscreen.lock="fullscreenLoading"  @click="Download()"  v-if="isAuth('generation:userinfo:list')" type="primary">导出列表</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="用户">
      </el-table-column>
      <el-table-column
        prop="channelName"
        header-align="center"
        align="center"
        label="注册渠道">
      </el-table-column>
      <el-table-column
        prop="deviceSource"
        header-align="center"
        align="center"
        label="设备">
      </el-table-column>
      <el-table-column
        prop="ip"
        header-align="center"
        align="center"
        label="ip">
      </el-table-column>
      <el-table-column
        prop="market"
        header-align="center"
        align="center"
        label="下载途径">
      </el-table-column>
      <el-table-column
        prop="appVersion"
        header-align="center"
        align="center"
        label="app版本">
      </el-table-column>
      <el-table-column
        prop="appName"
        header-align="center"
        align="center"
        label="app名字">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :formatter="dateFormat"
        label="激活时间">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        header-align="center"
        align="center"
        :formatter="dateFormat"
        label="最近一次登陆时间">
      </el-table-column>
      <el-table-column
        prop="loginCount"
        header-align="center"
        align="center"
        label="总登陆次数">
      </el-table-column>
      <el-table-column
        prop="clickCount"
        header-align="center"
        align="center"
        label="点击次数">
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
  import AddOrUpdate from './banner-add-or-update'
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        dataForm: {
          mobile:'',//用户名
          channelId:'',//渠道id
          deviceSource:'',//设备
          appName:'',//app名称
          market:'',
          lastLoginTime: (new Date()).getTime(),
          loginCount: 0,
          clickCount: 0,
          date: null
        },
        fullscreenLoading: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        selectList:[]
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
      this.channelList()
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
          url: this.$http.adornUrl(`/generation/userinfo/list`),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'mobile':this.dataForm.mobile,
            'channelId':this.dataForm.channelId,
            'deviceSource':this.dataForm.deviceSource,
            'appName':this.dataForm.appName,
            'market':this.dataForm.market,
            'lastLoginTime': this.dataForm.lastLoginTime,
            'loginCount': this.dataForm.loginCount,
            'clickCount': this.dataForm.clickCount,
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
      Download(){
        window.location.href =this.$http.adornUrl(`/sys/report/userInfoReportDownload?token=${this.$cookie.get('token')}&mobile=${this.dataForm.mobile}&channelId=${this.dataForm.channelId}&deviceSource=${this.dataForm.deviceSource}&appName=${this.dataForm.appName}&market=${this.dataForm.market}`)
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
      channelList () {
        this.$http({
          url: this.$http.adornUrl(`/sys/channel/list`),
          method: 'get',
          params: this.$http.adornParams({
            'page':1,
            'limit': 999,
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.selectList = data.page.list
          }
        })
      }
    }
  }
</script>

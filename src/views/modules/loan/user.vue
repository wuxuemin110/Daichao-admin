<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-width="80px">
      <el-form-item label="设备">
        <el-select v-model="dataForm.deviceSource" placeholder="请选择设备" style="width: 150px;">
          <el-option
            v-for="item in deviceSources"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="流量渠道">
        <el-select v-model="dataForm.channelId" placeholder="请选择渠道" style="width: 150px;">
          <el-option
            v-for="item in channels"
            :key="item.id"
            :label="item.channelName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="APP版本">-->
        <!--<el-select v-model="dataForm.appVersion" placeholder="请选择版本" style="width: 150px;">-->
          <!--<el-option-->
            <!--v-for="item in appVersions"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="APP名字">-->
        <!--<el-input v-model="dataForm.appName" placeholder="请输入名字" clearable style="width: 150px;"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="完件状态">-->
        <!--<el-select v-model="dataForm.finishStatus" placeholder="请选择状态" style="width: 150px;">-->
          <!--<el-option-->
            <!--v-for="item in finishStatusList"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="下载途径">-->
        <!--<el-select v-model="dataForm.market" placeholder="请选择下载途径" style="width: 150px;">-->
          <!--<el-option-->
            <!--v-for="item in markets"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="姓名">-->
        <!--<el-input v-model="dataForm.name" placeholder="" clearable style="width: 150px;"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="手机">-->
        <!--<el-input v-model="dataForm.mobile" placeholder="" clearable style="width: 150px;"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="注册时间">-->
        <!--<el-date-picker-->
          <!--v-model="dataForm.registerTime"-->
          <!--type="daterange"-->
          <!--value-format="timestamp"-->
          <!--range-separator="至"-->
          <!--start-placeholder="开始日期"-->
          <!--end-placeholder="结束日期">-->
        <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!-- <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="">
      </el-table-column> -->
      <el-table-column
        prop="channelName"
        header-align="center"
        align="center"
        label="流量渠道">
      </el-table-column>
      <el-table-column
        prop="realName"
        header-align="center"
        align="center"
        label="用户信息"
        width="120">
        <template slot-scope="scope">
          <span>{{scope.row.realName}}</span><br/>
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="deviceSource"
        header-align="center"
        align="center"
        label="设备">
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
        label="APP版本">
      </el-table-column>
      <el-table-column
        prop="appName"
        header-align="center"
        align="center"
        label="APP名字">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :formatter="dateFormat"
        label="注册时间">
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        header-align="center"
        align="center"
        :formatter="dateFormat"
        label="修改时间">
      </el-table-column>
      <el-table-column
        prop="finishStatus"
        header-align="center"
        align="center"
        label="完件状态">
        <template slot-scope="scope">
          <span v-if="scope.row.finishStatus === 0">仅注册</span>
          <span v-if="scope.row.finishStatus === 1">未完件</span>
          <span v-if="scope.row.finishStatus === 2">完件</span>
          <span v-else></span>
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
  import AddOrUpdate from './user-add-or-update'
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        dataForm: {
          deviceSource: null,
          channelId: null,
          appVersion: null,
          appName: null,
          finishStatus: null,
          market: null,
          name: null,
          mobile: null,
          registerTime: null
        },
        deviceSources: [
          {
            value: null,
            label: '全部'
          },
          {
            value: 'android',
            label: '安卓'
          },
          {
            value: 'ios',
            label: '苹果'
          }
        ],
        channels: [
          {
            id: null,
            channelName: '全部'
          }
        ],
        appVersions: [
          {
            value: null,
            label: '全部'
          },
          {
            value: '1.0',
            label: '1.0'
          },
          {
            value: '1.1',
            label: '1.1'
          }
        ],
        finishStatusList: [
          {
            value: null,
            label: '全部'
          },
          {
            value: 2,
            label: '完件'
          },
          {
            value: 1,
            label: '未完件'
          },
          {
            value: 0,
            label: '仅注册'
          }
        ],
        markets: [
          {
            value: null,
            label: '全部'
          }
        ],
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
      this.getChannels()
      this.getMarkets()
      this.getDataList()
    },
    methods: {
      // 获取流量渠道
      getChannels () {
        this.$http({
          url: this.$http.adornUrl(`/sys/channel/list`),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'limit': 100
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.page !== undefined && data.page.list !== undefined) {
              this.channels = this.channels.concat(data.page.list)
            }
          }
        })
      },
      getMarkets () {
        this.$http({
          url: this.$http.adornUrl(`/sys/appuser/markets`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.markets !== undefined) {
              for (var i = 0; i < data.markets.length; i++) {
                var market = {
                  'value': data.markets[i],
                  'label': data.markets[i]
                }
                this.markets.push(market)
              }
            }
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
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/sys/appuser/list`),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'deviceSource': this.dataForm.deviceSource,
            'channelId': this.dataForm.channelId,
            'appVersion': this.dataForm.appVersion,
            'appName': this.dataForm.appName,
            'finishStatus': this.dataForm.finishStatus,
            'market': this.dataForm.market,
            'name': this.dataForm.name,
            'mobile': this.dataForm.mobile,
            'registerStartTime': this.dataForm.registerTime !== null ? this.dataForm.registerTime[0] : null,
            'registerEndTime': this.dataForm.registerTime !== null ? this.dataForm.registerTime[1] + 86400000 : null
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
      }
      // 删除
      // deleteHandle (id) {
      //   var ids = id ? [id] : this.dataListSelections.map(item => {
      //     return item.id
      //   })
      //   this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.$http({
      //       url: this.$http.adornUrl('/sys/appuser/delete'),
      //       method: 'post',
      //       data: this.$http.adornData(ids, false)
      //     }).then(({data}) => {
      //       if (data && data.code === 0) {
      //         this.$message({
      //           message: '操作成功',
      //           type: 'success',
      //           duration: 1500,
      //           onClose: () => {
      //             this.getDataList()
      //           }
      //         })
      //       } else {
      //         this.$message.error(data.msg)
      //       }
      //     })
      //   })
      // }
    }
  }
</script>

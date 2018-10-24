<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-width="80px">
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
      <el-form-item label="订单状态">
        <el-select v-model="dataForm.status" placeholder="请选择状态" style="width: 150px;">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="dataForm.name" placeholder="" clearable style="width: 150px;"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="dataForm.mobile" placeholder="" clearable style="width: 150px;"></el-input>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="dataForm.applyTime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核时间">
        <el-date-picker
          v-model="dataForm.approveTime"
          type="daterange"
          value-format="timestamp"
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
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <!-- <el-table-column
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
        label="用户信息">
        <template slot-scope="scope">
          <span>{{scope.row.realName}}</span><br/>
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="applyCount"
        header-align="center"
        align="center"
        label="申请次数">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :formatter="dateFormat"
        label="申请时间">
      </el-table-column>
      <el-table-column
        prop="approveTime"
        header-align="center"
        align="center"
        :formatter="dateFormat"
        label="审核时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
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
        prop="approveUserName"
        header-align="center"
        align="center"
        label="操作人">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="80"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">分配</el-button> -->
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.userId, scope.row.id, scope.row.status)">详情</el-button>
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
  import AddOrUpdate from './usercreditamountapply-add-or-update'
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        dataForm: {
          channelId: null,
          status: null,
          name: null,
          mobile: null,
          applyTime: null,
          approveTime: null
        },
        channels: [
          {
            id: null,
            channelName: '全部'
          }
        ],
        statusList: [
          {
            value: null,
            label: '全部'
          },
          {
            value: '0',
            label: '待审核'
          },
          {
            value: '1',
            label: '取消'
          },
          {
            value: '2',
            label: '审核中'
          },
          {
            value: '3',
            label: '通过'
          },
          {
            value: '4',
            label: '拒绝'
          },
          {
            value: '5',
            label: '机审通过'
          },
          {
            value: '6',
            label: '机审拒绝'
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
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/sys/usercreditamountapply/list`),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'channelId': this.dataForm.channelId,
            'status': this.dataForm.status,
            'name': this.dataForm.name,
            'mobile': this.dataForm.mobile,
            'applyStartTime': this.dataForm.applyTime !== null ? this.dataForm.applyTime[0] : null,
            'applyEndTime': this.dataForm.applyTime !== null ? this.dataForm.applyTime[1] + 86400000 : null,
            'approveStartTime': this.dataForm.approveTime !== null ? this.dataForm.approveTime[0] : null,
            'approveEndTime': this.dataForm.approveTime !== null ? this.dataForm.approveTime[1] + 86400000 : null
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
      addOrUpdateHandle (userId, applyId, applyStatus) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(userId, applyId, applyStatus)
        })
      },
      // 删除
      deleteHandle (id) {
        // var ids = id ? [id] : this.dataListSelections.map(item => {
        //   return item.id
        // })
        // this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   this.$http({
        //     url: this.$http.adornUrl('/sys/usercreditamountapply/delete'),
        //     method: 'post',
        //     data: this.$http.adornData(ids, false)
        //   }).then(({data}) => {
        //     if (data && data.code === 0) {
        //       this.$message({
        //         message: '操作成功',
        //         type: 'success',
        //         duration: 1500,
        //         onClose: () => {
        //           this.getDataList()
        //         }
        //       })
        //     } else {
        //       this.$message.error(data.msg)
        //     }
        //   })
        // })
      }
    }
  }
</script>

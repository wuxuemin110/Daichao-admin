<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="渠道名">
        <el-input v-model="dataForm.channelName" placeholder="渠道名" clearable style="width: 150px;"></el-input>
      </el-form-item>
      <!--<el-form-item label="销售员">-->
        <!--<el-input v-model="dataForm.saleUserName" placeholder="销售员" clearable style="width: 150px;"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="dataForm.createTime"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:channel:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!-- <el-button v-if="isAuth('sys:channel:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
<!--       <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column> -->
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="渠道ID">
      </el-table-column>
      <el-table-column
        prop="channelName"
        header-align="center"
        align="center"
        width="150"
        label="渠道名">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="saleUserName"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--width="120"-->
        <!--label="销售员">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="promotionLink"
        header-align="center"
        align="center"
        label="推广链接">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="160"
        :formatter="dateFormat"
        label="添加时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">上架</span>
          <span v-if="scope.row.status == 2">下架</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="80"
        label="操作">
        <template slot-scope="scope">
           <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button  type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="registCount"
        header-align="center"
        align="center"
        label="用户总数">
      </el-table-column>
      <el-table-column
        prop="activeCount"
        header-align="center"
        align="center"
        label="激活数">
      </el-table-column>
      <el-table-column
        prop="userClickCount"
        header-align="center"
        align="center"
        label="3次及以上点击次数用户数">
      </el-table-column>
      <el-table-column
        prop="loginOnce"
        header-align="center"
        align="center"
        label="次留">
      </el-table-column>
      <el-table-column
        prop="loginThreeTime"
        header-align="center"
        align="center"
        label="3留">
      </el-table-column>
      <el-table-column
        prop="loginSevenTime"
        header-align="center"
        align="center"
        label="7留">
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
  import AddOrUpdate from './channel-add-or-update'
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        dataForm: {
          channelName: null,
          saleUserName: null,
          createTime: null
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
        return formatDate(new Date(date), 'yyyy-MM-dd hh:mm:ss')
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/sys/channel/list`),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'channelName': this.dataForm.channelName,
            'saleUserName': this.dataForm.saleUserName,
            'startTime': this.dataForm.createTime !== null ? this.dataForm.createTime[0] : null,
            'endTime': this.dataForm.createTime !== null ? this.dataForm.createTime[1] + 86400000 : null
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
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/channel/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
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

<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item  v-if="isAuth('loan:channel:list')" >
        <el-input v-model="dataForm.channelId" placeholder="渠道编号" clearable style="width: 150px;"></el-input>
      </el-form-item>
      <el-form-item  v-if="isAuth('loan:channel:list')" >
        <el-input v-model="dataForm.channelName" placeholder="渠道名称" clearable style="width: 150px;"></el-input>
      </el-form-item>

      <el-form-item label="日期">
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
        <!--<el-button v-if="isAuth('sys:channel:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <el-button v-if="isAuth('loan:channel:user')" type="primary" @click="addOrUpdateHandle3()">新增渠道后台管理员</el-button>
        <!-- <el-button v-if="isAuth('sys:channel:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"

      :summary-method="getSummaries"
      show-summary
      >

      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"

        :formatter="dateFormat"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="channelId"
        header-align="center"
        align="center"

        label="渠道编号">
      </el-table-column>
      <el-table-column
        prop="channelName"
        header-align="center"
        align="center"
        width="150"
        label="渠道名称">
      </el-table-column>
      <el-table-column
        v-if="isAuth('loan:channel:listInfo')"
        prop="realRegister"
        header-align="center"
        align="center"

        label="真实注册数">
      </el-table-column>
      <el-table-column
        prop="showRegister"
        header-align="center"
        align="center"

        label="注册数">
      </el-table-column>
      <el-table-column
        prop="percent"
        header-align="center"
        align="center"
        v-if="isAuth('loan:channel:listInfo')"
        label="注册数扣量比例">
        <template slot-scope="scope">
          <span>{{scope.row.percent}}%</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="isAuth('loan:channel:listInfo')"
        header-align="center"
        align="center"
        width="80"
        label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList2"></add-or-update>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update2 v-if="addOrUpdateVisible2" ref="addOrUpdate2" @refreshDataList="getDataList"></add-or-update2>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update3 v-if="addOrUpdateVisible3" :channelList="dataList2" ref="addOrUpdate3" @refreshDataList="getDataList"></add-or-update3>
    <el-form  v-if="isAuth('loan:channel:list')" :inline="true" :model="dataForm2" @keyup.enter.native="getDataList2()" style="margin-top: 20px;">
      <el-form-item label="渠道名">
        <el-input v-model="dataForm2.channelName" placeholder="渠道名" clearable style="width: 150px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList2()">查询</el-button>
        <!--<el-button v-if="isAuth('sys:channel:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <!-- <el-button v-if="isAuth('sys:channel:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      v-if="isAuth('loan:channel:list')"
      :data="dataList2"
      border
      v-loading="dataListLoading2"
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
          <el-button  type="text" size="small" @click="addOrUpdateHandle2(scope.row.id)">修改</el-button>
          <el-button  type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination
      v-if="isAuth('loan:channel:list')"
      @size-change="sizeChangeHandle2"
      @current-change="currentChangeHandle2"
      :current-page="pageIndex2"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize2"
      :total="totalPage2"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  import AddOrUpdate from './channel-add-or-update'
  import AddOrUpdate2 from './channelAdmin-add-or-update'
  import AddOrUpdate3 from './channelAdmin-user-add-or-update'
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        dataForm: {
          channelName: null,
          saleUserName: null,
          createTime: null,
          channelId:null
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataForm2: {
          channelName: null,
          saleUserName: null,
          createTime: null
        },
        dataList2: [],
        pageIndex2: 1,
        pageSize2: 10,
        totalPage2: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dataListLoading2: false,
        dataListSelections2: [],
        addOrUpdateVisible2: false,
        addOrUpdateVisible3: false,
        allList:['合计']
      }
    },
    components: {
      AddOrUpdate,
      AddOrUpdate2,
      AddOrUpdate3
    },
    activated () {
      this.getDataList2()
      this.getALLdataList()
      this.getDataList()

    },
    methods: {
      getSummaries(param){
        return this.allList;
      },
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
          url: this.$http.adornUrl(`/sys/channel/getRegisterCount`),
          method: 'POST',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'channelName': this.dataForm.channelName,
            'channelId': this.$store.state.user.channelId?this.$store.state.user.channelId : this.dataForm.channelId,
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
      //获取合计
      getALLdataList(){
        this.$http({
          url: this.$http.adornUrl(`/sys/channel/getSum`),
          method: 'get',
          params: this.$http.adornParams({
            'token': this.$cookie.get('token'),
          })
        }).then(({data})=>{
          if (data && data.code === 0) {
            this.allList[3] = data.list[0]
            this.allList[4] = data.list[1]
            this.allList[5] = data.list[2]
          }
        })
      },
      // 获取数据列表
      getDataList2 () {
        this.dataListLoading2 = true
        this.$http({
          url: this.$http.adornUrl(`/sys/channel/list`),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex2,
            'limit': this.pageSize2,
            'channelName': this.dataForm2.channelName,
            'saleUserName': this.dataForm2.saleUserName,
            'startTime': this.dataForm2.createTime !== null ? this.dataForm.createTime[0] : null,
            'endTime': this.dataForm2.createTime !== null ? this.dataForm.createTime[1] + 86400000 : null
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList2 = data.page.list
            this.totalPage2 = data.page.totalCount
          } else {
            this.dataList2 = []
            this.totalPage2 = 0
          }
          this.dataListLoading2 = false
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
      // 每页数
      sizeChangeHandle2 (val) {
        this.pageSize2 = val
        this.pageIndex2 = 1
        this.getDataList2()
      },
      // 当前页
      currentChangeHandle2 (val) {
        this.pageIndex2 = val
        this.getDataList2()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible2 = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate2.init(id)
        })
      },
      // 新增 / 修改
      addOrUpdateHandle2 (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 新增 / 修改
      addOrUpdateHandle3 (id) {
        this.addOrUpdateVisible3 = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate3.init(id)
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

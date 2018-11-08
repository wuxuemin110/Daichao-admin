<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <!--<el-form-item>-->
        <!--<el-input v-model="dataForm.loadName" placeholder="代超名称" clearable></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <!--<el-button @click="getDataList()">查询</el-button>-->
        <el-button v-if="isAuth('zwj:adlist:add')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
        header-align="center"
        align="center"
        label="产品编号">
        <template slot-scope="scope">
          <span>{{scope.row.companyId + '-' + scope.row.productNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="picUrl"
        header-align="center"
        align="center"
        label="图标">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>
      <el-table-column
        prop="app"
        header-align="center"
        align="center"
        label="设备">
      </el-table-column>
      <el-table-column
        prop="showTime"
        header-align="center"
        align="center"
        width="180"
        :formatter="dateFormat"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="hideTime"
        header-align="center"
        align="center"
        width="180"
        :formatter="dateFormat"
        label="结束时间">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="createTime"-->
        <!--header-align="center"-->
        <!--:formatter="dateFormat"-->
        <!--align="center"-->
        <!--label="创建时间">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="linkUrl"
        header-align="center"
        align="center"
        label="跳转地址">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==0">上架</span>
          <span v-if="scope.row.status==2">下架</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('zwj:adlist:edit')" type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button v-if="isAuth('zwj:adlist:del')" type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
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
  import AddOrUpdate from '../zwj/ad-add-or-update'
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
          url: this.$http.adornUrl(`/generation/openScreen/list`),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize
          })
        }).then(({data}) => {
          console.log(data)
          if (data && data.code == 0) {
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
      deleteHandle (item) {
        console.log(item)
        this.$confirm(`确定对[${item.title}]进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generation/openScreen/delete'),
            method: 'post',
            data: [item.id]
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

<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="姓名">
        <el-input v-model="dataForm.name" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="dataForm.phone" placeholder="电话" clearable></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="dataForm.tag" placeholder="标签" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        header-align="center"
        align="center"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="tags"
        header-align="center"
        align="center"
        label="互联网标签">
      </el-table-column>
      <el-table-column
        prop="company"
        header-align="center"
        align="center"
        label="公司">
      </el-table-column>
      <el-table-column
        prop="job"
        header-align="center"
        align="center"
        label="职位">
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          name: null,
          phone: null,
          tag: null
        },
        userId: 0,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    methods: {
      init (userId) {
        if (this.userId !== userId) {
          this.userId = userId || 0
          this.dataList = []
          this.getDataList()
        }
      },
      // 获取数据列表
      getDataList () {
        this.$nextTick(() => {
          if (this.userId) {
            this.dataListLoading = true
            this.$http({
              url: this.$http.adornUrl(`/sys/userphonebook/list`),
              method: 'get',
              params: this.$http.adornParams({
                'page': this.pageIndex,
                'limit': this.pageSize,
                'userId': this.userId,
                'name': this.dataForm.name,
                'phone': this.dataForm.phone,
                'tag': this.dataForm.tag
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
          }
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
      // 弹窗关闭，清除数据
      clear () {
        this.userId = 0
      }
    }
  }
</script>

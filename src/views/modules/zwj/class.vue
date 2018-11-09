<template>
  <div class="mod-config">
    <el-form :inline="true"  @keyup.enter.native="getDataList()">
      <!--<el-form-item>-->
        <!--<el-input placeholder="分类名称" clearable></el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <!--<el-button @click="getDataList()">查询</el-button>-->
        <el-button v-if="isAuth('zwj:class:add')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <!--<el-button v-if="isAuth('generation:banner:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
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
        prop="typeName"
        header-align="center"
        align="center"
        label="分类名称">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('zwj:class:edit')" type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
          <el-button v-if="isAuth('zwj:class:del')" type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<el-pagination-->
      <!--@size-change="sizeChangeHandle"-->
      <!--@current-change="currentChangeHandle"-->
      <!--:current-page="pageIndex"-->
      <!--:page-sizes="[10, 20, 50, 100]"-->
      <!--:page-size="pageSize"-->
      <!--:total="totalPage"-->
      <!--layout="total, sizes, prev, pager, next, jumper">-->
    <!--</el-pagination>-->
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" :dataList = 'dataList' ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './class-add-or-update'
  export default {
    name: 'class',
    data () {
      return {
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 100,
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
      // 新增 / 修改
      addOrUpdateHandle (item) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(item)
        })
      },
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/loanproduct/type/list'),
          method: 'get',
          params: this.$http.adornParams({
            flag:1,
          })
        }).then((res) => {
          if (res.data.code != 0) {
            this.$message.error(res.data.msg)
          } else {
            this.dataList = res.data.data
          }
        })
      },
      deleteHandle (item) {
        this.$confirm(`确定对[${item.typeName}]进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/loanproduct/type/del'),
            method: 'post',
            // data: this.$http.adornData({
            //   typeId: item.typeId,
            //   type: 'base'
            // })
            params: this.$http.adornParams({
              typeId: item.typeId,
              type: 'base'
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
          })
        })
      },
      selectionChangeHandle () {

      },
      sizeChangeHandle () {

      },
      currentChangeHandle () {

      }
    }
  }
</script>

<style scoped>

</style>

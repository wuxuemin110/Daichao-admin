<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">

      <el-form-item>
        <el-button v-if="isAuth('generation:manage:save')" type="primary" @click="addOrUpdateHandle(newArrs,true)">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="newList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="typeName"
        header-align="center"
        align="center"
        label="标签名称">
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
        prop="firstName"
        header-align="center"
        align="center"
        label="所属分类">

      </el-table-column>
      <el-table-column
        prop="recommend"
        header-align="center"
        align="center"
        label="首页显示">
        <template slot-scope="scope">
          <span v-if="scope.row.recommend== 1">是</span>
          <span v-if="scope.row.recommend== 0">否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        header-align="center"
        align="center"
        label="首页位置">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row,false)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.typeId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdate" v-if="addOrUpdateVisible" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './tag-add-or-delete'

  export default {
    data() {
      return {
        dataForm: {
          bannerTitle: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        newList: [],
        newArrs:[]
      }

    },
    components: {
      AddOrUpdate
    },
    activated() {
      this.getDataList()
    },
    methods: {
      addOrUpdateHandle(val,flag) {
        console.log(val)
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(val,flag)
        })
      },
      // 获取数据
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/sys/loanproduct/type/list`),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.newList = []
            let dataList = data.data
            var newArr = [];
            for (let i = 0; i < dataList.length; i++) {
              newArr[i] = {};
              newArr[i]['superId'] = dataList[i]['typeId'];
              newArr[i]['superName'] = dataList[i]['typeName'];
              var newDataList = dataList[i].secondTypes;
              for (let j = 0; j < newDataList.length; j++) {
                newDataList[j]['superType'] = newArr
                newDataList[j]['firstName'] = dataList[i]['typeName']

              }
              this.newList = this.newList.concat(newDataList)

            }

            this.newArrs = newArr
          }
          this.dataListLoading = false
        })
      },
      //删除
      deleteHandle (id) {
        this.$confirm(`确定要删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/generation/version/del'),
            method: 'post',
            params: this.$http.adornParams({
              typeId:id,
              type:'second'
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
      }
    }
  }
</script>

<style scoped>

</style>

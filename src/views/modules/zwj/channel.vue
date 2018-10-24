<template>
  <div class="mod-config">
    <el-form :inline="true"  @keyup.enter.native="getDataList()">
      <!--<el-form-item>-->
        <!--<el-input placeholder="注册渠道" clearable></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="注册渠道">
        <!--<el-input v-model="form.name"></el-input>-->
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
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="渠道名称">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="渠道链接">
      </el-table-column>
      <!--<el-table-column-->
        <!--fixed="right"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="渠道链接">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.bannerId)">修改</el-button>-->
          <!--<el-button type="text" size="small" @click="deleteHandle(scope.row.bannerId)">删除</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
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
  import AddOrUpdate from './class-add-or-update'
  export default {
    name: 'class',
    data () {
      return {
        dataList: [{
          name: '贷款类型',
          url:'www.baidu.com'
        },
        {
          name: '贷款金额',
          url:'www.baidu.com'
        },
        {
          name: '综合排序',
          url:'www.baidu.com'
        }],
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
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      getDataList () {

      },
      deleteHandle () {

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

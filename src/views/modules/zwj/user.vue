<template>
  <div class="mod-config">
    <el-form :inline="true"  @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input placeholder="推广渠道" clearable></el-input>
        <!--<el-button @click="getDataList()">查询</el-button>-->
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>

      </el-form-item>
      <el-form-item style="margin-left: 20px;" label="注册时间">
        <div class="block">
          <el-date-picker
            style="width: 450px;"
            v-model="value7"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>

      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      size="medium "
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
       >
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="注册时间">
      </el-table-column>
      <el-table-column
        prop="channel"
        header-align="center"
        align="center"
        label="推广渠道">
      </el-table-column>
      <el-table-column
        prop="clickNum"
        header-align="center"
        align="center"
        label="点击次数">
      </el-table-column>
      <el-table-column
        prop="finish"
        header-align="center"
        align="center"
        label="加载完成次数">
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
  import AddOrUpdate from './class-add-or-update'
  export default {
    name: 'class',
    data () {
      return {
        dataList: [{
          name: '18663245654',
          time: '2018-10-11 11:00:00 ',
          channel: '今日头条',
          clickNum: 1,
          finish: 1

        },
        {
          name: '18663245652',
          time: '2018-10-12 12:00:00 ',
          channel: '今日头条2',
          clickNum: 2,
          finish: 2
        },
        {
          name: '18663245653',
          time: '2018-10-13 13:00:00 ',
          channel: '今日头条',
          clickNum: 3,
          finish: 3
        },
        {
          name: '18663245651',
          time: '2018-10-14 14:00:00 ',
          channel: '今日头条',
          clickNum: 4,
          finish: 4
        }],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 100,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        value6: '',
        value7: ''
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

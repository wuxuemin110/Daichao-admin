<template>
   <div class="mod-config">
     <el-form :inline="true"  @keyup.enter.native="getDataList()">

       <el-form-item>
         <el-button v-if="isAuth('generation:version:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>

       </el-form-item>
     </el-form>
     <el-table
       :data="dataList"
       border
       size="medium"
       v-loading="dataListLoading"
       style="width: 100%">
       <el-table-column
         prop="version"
         label="版本号"
         width="250"
         >
       </el-table-column>
       <el-table-column
         prop="bundleId"
         label="bundleId"
         width="250"
       >
       </el-table-column>
       <el-table-column
         prop="name"
         label="版本控制"
        >
         <template slot-scope="scope">
           <el-radio-group @change="getRadio(scope.row)" v-model="scope.row.code" >
             <el-radio text-color="#17B3A3" fill="#17B3A3"  label='0'  border size="medium">贷款超市</el-radio>
             <el-radio text-color="#17B3A3" fill="#17B3A3"  label='1'  border size="medium">桔子贷款</el-radio>
           </el-radio-group>
         </template>
       </el-table-column>
       <el-table-column

         label="操作"
         fixed="right"
         header-align="center"
         align="center"
         width="250"
       >
         <template slot-scope="scope">
           <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
           <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  import AddOrUpdate from './version-add'
    export default {
      data () {
        return {
          dataList: [],
          pageIndex: 1,
          pageSize: 10,
          totalPage: 0,
          dataListLoading:false,
          dataListSelections:[],
          addOrUpdateVisible:false
        }
      },
      components:{
        AddOrUpdate
      },
      activated(){
        this.getDataList();
      },
      methods:{
        //获取数据列表
        getDataList(){
          this.dataListLoading = true;
          this.$http({
            url:this.$http.adornUrl(`/generation/version/list`),
            methods:'get',
            params:this.$http.adornParams({
              'page':this.pageIndex,
              'limit':this.pageSize
            })
          }).then(({data})=>{

             if(data && data.code === '0'){
                this.dataList = data.data
               this.totalPage = data.count
               for(let i = 0;i<this.dataList.length;i++){
                 if(this.dataList[i].code == 0){
                   this.dataList[i].code = '0'
                 }else if(this.dataList[i].code == 1){
                   this.dataList[i].code = '1'
                 }
               }
             }else {
                 this.$message.error(data.msg);
             }
            this.dataListLoading = false
          })
        },
        //修改
        getRadio(val){
          this.$http({
            url:this.$http.adornUrl(`/generation/version/modify`),
            method:'post',
            params:this.$http.adornParams({
              version:val.version,
              code:val.code,
              id:val.id
            })
          }).then(({data})=>{
            if(data && data.code === 0){
              this.$message({
                message: data.msg,
                type: 'success'
              });
            }else {
              this.$message.error(data.msg);
            }
          })
        },
        //每页数
        sizeChangeHandle (val) {
          this.pageSize = val
          this.pageIndex = 1
          this.getDataList()
        },
        //当前页
        currentChangeHandle (val) {
          this.pageIndex = val
          this.getDataList()
        },

        addOrUpdateHandle(val){
          this.addOrUpdateVisible = true
         this.$nextTick(() => {
            this.$refs.addOrUpdate.init(val)
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
                id:id
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

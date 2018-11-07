<template>
  <el-dialog
    title="新增"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="产品名称">
        <div>
          <el-autocomplete
            prop="productId"
            v-model="productId"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        productId:'',
        visible: false,
        dataForm:{
          productId:'',
        },
        dataRule: {
          productId: [
            { required: true, message: '产品不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created(){

      console.log()
    },
    methods: {
      init (item) {
        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generation/companyProduct/balance/save`),
              method: 'post',
              params: this.$http.adornParams({
                'token':this.$cookie.get('token'),
                'productId':this.dataForm.productId,
                'status':0,
                'createTime':formatDate(new Date(), 'yyyy-MM-dd')
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      //公司产品模糊查询
      getCompanyfuzzy(){
        return this.$http({
          url: this.$http.adornUrl(`/generation/companyProduct/like`),
          method: 'get',
          params: this.$http.adornParams({
            'token':this.$cookie.get('token'),
            'param':this.productId

          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.productList = data.companyProducts
            for(var i = 0;i<this.productList.length;i++){
              this.productList[i]['value'] = this.productList[i].productName
            }
            return Promise.resolve(this.productList)
          }
        })
      },
      querySearchAsync(queryString, cb) {
        this.getCompanyfuzzy().then((res)=>{
          var restaurants = res;
          cb(restaurants);
        })
      },
      handleSelect(item) {
        this.dataForm.productId = item.productId
      }
    }

  }
</script>

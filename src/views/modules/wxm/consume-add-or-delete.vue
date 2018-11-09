<template>
  <el-dialog
    :title="dataForm.productId == null ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="产品编号" prop="productDisplayNum">
        <el-input disabled v-model="dataForm.productDisplayNum" maxlength="30" placeholder="产品编号"></el-input>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input disabled v-model="dataForm.productName" maxlength="30" placeholder="产品名称"></el-input>
      </el-form-item>
      <el-form-item label="剩余点击次数" prop="adjustClick">
        <el-input v-model="dataForm.adjustClick" maxlength="30" placeholder="剩余点击次数"></el-input>
      </el-form-item>
      <el-form-item label="单日点击上限" prop="clickLimit">
        <el-input v-model="dataForm.clickLimit" maxlength="30" placeholder="单日点击上限"></el-input>
      </el-form-item>
      <el-form-item label="状态"  prop="status" >
        <template>
          <el-radio v-model="status" label="0">上架</el-radio>
          <!--<el-radio v-model="dataForm.status" label="1">自动下架</el-radio>-->
          <el-radio v-model="status" label="4">手动下架</el-radio>
        </template>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          status: '0'
        },
        status: '0',
        options: [],
        dataRule: {
          adjustClick: [
            { required: true, message: '剩余点击次数不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.getCompanyList()
  },
    methods: {
      init (item) {
        console.log(item)
        this.visible = true
        if (item) {
          this.$http({
            url: this.$http.adornUrl(`/generation/companyProduct/consume/info`),
            method: 'get',
            params: this.$http.adornParams({
              id: item.id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm = {}
              this.dataForm.id = data.companyProductConsume.id
              this.dataForm.productDisplayNum = data.companyProduct.productDisplayNum
              this.dataForm.productName = data.companyProduct.productName
              this.status = (data.companyProductConsume.status + '')
              this.dataForm.adjustClick = data.companyProductConsume.adjustClick-0
              this.dataForm.clickLimit = data.companyProductConsume.clickLimit-0
              // console.log(this.status)
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(!this.dataForm.clickLimit || this.dataForm.clickLimit==0){
              this.dataForm.clickLimit = -1
            }
            this.dataForm.status = this.status
            this.$http({
              url: this.$http.adornUrl(`/generation/companyProduct/consume/update`),
              method: 'post',
              params: this.$http.adornParams({
                'id': this.dataForm.id,
                'adjustClick': this.dataForm.adjustClick,
                'clickLimit': this.dataForm.clickLimit,
                'status' : this.status
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
      // 公司列表
      getCompanyList () {
        this.$http({
          url: this.$http.adornUrl(`/generation/companyInfo/list`),
          methods: 'get',
          params: this.$http.adornParams({
            'token': this.$cookie.get('token')
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.options = data.page.list
          } else {
            this.options = []
          }
        })
      }
    }
  }
</script>

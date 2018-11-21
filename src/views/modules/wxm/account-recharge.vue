<template>
  <el-dialog
    title="充值"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">


      <el-form-item label="产品编号" prop="recharge">
        <el-input :disabled="true" v-model="productDisplayNum" maxlength="30" placeholder="充值数"></el-input>
      </el-form-item>
      <el-form-item label="产品名称" prop="recharge">
        <el-input :disabled="true" v-model="productName" maxlength="30" placeholder="充值数"></el-input>
      </el-form-item>
      <el-form-item label="充值数" prop="recharge">
        <el-input v-model="dataForm.recharge" maxlength="30" placeholder="充值数"></el-input>
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
        productDisplayNum:'',
        productName:'',
        visible: false,
        dataForm:{
          recharge:'',
          productId:''
        },
        dataRule: {
          recharge: [
            { required: true, message: '充值数不能为空', trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      init (item) {
        this.dataForm.productId = item.productId
        this.productName = item.productName
        this.productDisplayNum = item.productDisplayNum
        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generation/companyRecharge/recharge`),
              method: 'post',
              params: this.$http.adornParams({
                'token':this.$cookie.get('token'),
                'productId':this.dataForm.productId,
                'recharge': this.dataForm.recharge,
                'uid': this.$store.state.user.id
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.dataForm.recharge = ''
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
      }
    }

  }
</script>

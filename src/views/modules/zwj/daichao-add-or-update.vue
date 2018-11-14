<template>
  <el-dialog
    :title="!dataForm.bannerId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="手机号" prop="bannerTitle">
        <el-input v-model="dataForm.phone" @blur="testPhone"  maxlength="30" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item v-if="userInfo" label="用户名" prop="bannerTitle">
        <el-input v-model="userInfo.realName" disabled maxlength="30" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="借款金额" prop="bannerTitle">
        <el-input v-model="dataForm.amount"   maxlength="30" placeholder="借款金额"></el-input>
      </el-form-item>
      <el-form-item  v-if="userInfo" label="收款银行卡" prop="bannerTitle">
        <el-input v-model="userInfo.idCardNo"  disabled  maxlength="30" placeholder="收款银行卡"></el-input>
      </el-form-item>
      <el-form-item label="借款用途" prop="bannerTitle">
        <el-radio v-model="dataForm.purpose" label="1">旅游娱乐</el-radio>
        <el-radio v-model="dataForm.purpose" label="2">生活消费</el-radio>
        <el-radio v-model="dataForm.purpose" label="3">电子数码</el-radio>
        <el-radio v-model="dataForm.purpose" label="4">租房装修</el-radio>
        <el-radio v-model="dataForm.purpose" label="5">医疗健康</el-radio>
        <el-radio v-model="dataForm.purpose" label="0">其他用途</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .el-radio.el-radio {
    margin-left: 0px;
    margin-right: 30px;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
</style>
<script>
  export default {
    data () {
      return {
        uploadUrl: '',
        iconUrl: '',
        visible: false,
        dataForm: {
          amount: '',
          phone: '',
          bankCard: '',
          purpose: '1',
          status: 0
        },
        userInfo: null
      }
    },
    methods: {
      init (id) {
        console.log(id)
        this.visible = true
      },
      testPhone  () {
        console.log(this.dataForm.phone)
        if (!(/^1[34578]\d{9}$/.test(this.dataForm.phone))) {
          this.$message({
            message: '手机号格式不对',
            type: 'warning'
          })
          return false
        }
        this.$http({
          url: this.$http.adornUrl(`/generation/user/` + this.dataForm.phone),
          method: 'get'
        }).then((res) => {
          if(res.data.user){
            this.userInfo = res.data.user
          }else {
            this.$message({
              message: '搜索不到该用户',
              type: 'warning'
            })
          }

          console.log(this.userInfo)
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$http({
          url: this.$http.adornUrl('/sys/userloan/apply'),
          method: 'post',
          params: this.$http.adornParams({
            'amount': this.dataForm.amount,
            'purpose': this.dataForm.purpose,
            'bankCardId': '1',
            'status': this.userInfo.status,
            'id': this.userInfo.id
          })
        }).then((res) => {
          if(res.data.code !=  0){
            this.$message.error(res.data.msg)
          }else {
            this.$emit('refreshDataList')
            this.visible = false
          }
        })
      }
    }
  }
</script>

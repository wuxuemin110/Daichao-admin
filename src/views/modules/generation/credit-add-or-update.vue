<template>
  <el-dialog
    :title="!dataForm.bankId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="银行名称" prop="bankName">
        <el-input v-model="dataForm.bankName"  placeholder="银行名称"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="bankIconUrl">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :before-upload="beforeUploadHandle"
          :on-success="successHandle">
          <img v-if="dataForm.bankIconUrl" :src="dataForm.bankIconUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="跳转地址" prop="linkUrl">
        <el-input v-model="dataForm.linkUrl" maxlength="250" placeholder="跳转地址"></el-input>
      </el-form-item>
	  <el-form-item label="描述" prop="describe">
        <el-input v-model="dataForm.describe" maxlength="250" placeholder="描述"></el-input>
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
          bankId: 0,
          bankName: '',
          bankIconUrl: '',
          linkUrl: '',
          describe: '',
          status: 0
        },
        dataRule: {
          bankName: [
            { required: true, message: '银行名称不能为空', trigger: 'blur' }
          ],
          bankIconUrl: [
            { required: true, message: '图标不能为空', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '跳转地址不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.uploadUrl = this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`)
        console.log(this.uploadUrl)
        this.dataForm.bankId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.bankId) {
            this.$http({
              url: this.$http.adornUrl(`/generation/credit/info/${this.dataForm.bankId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.bankId = data.credit.bankId
                this.dataForm.bankName = data.credit.bankName
                this.dataForm.bankIconUrl = data.credit.bankIconUrl
                this.dataForm.linkUrl = data.credit.linkUrl
                this.dataForm.describe = data.credit.describe
              }
            })
          }
        })
      },

      // 上传之前
      beforeUploadHandle (file) {
        const isLt2M = file.size / 1024 / 1024 < 2

        if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
          this.$message.error('只支持jpg、png、gif格式的图片！')
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
          return false
        }
      },
      // 上传成功
      successHandle (response, file, fileList) {
        this.dataForm.bankIconUrl = URL.createObjectURL(file.raw)
        this.bankIconUrl = response.url
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generation/credit/${!this.dataForm.bankId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'bankId': this.dataForm.bankId || undefined,
                'bankName': this.dataForm.bankName,
                'bankIconUrl': this.bankIconUrl,
                'linkUrl': this.dataForm.linkUrl,
                'describe': this.dataForm.describe,
                'status': this.dataForm.status
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
      }
    }
  }
</script>

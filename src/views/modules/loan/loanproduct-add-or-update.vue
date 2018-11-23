<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="dataForm.name"  placeholder="产品名称"></el-input>
      </el-form-item>
      <el-form-item label="产品图标" prop="iconUrl">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :before-upload="beforeUploadHandle"
          :on-success="successHandle">
          <img v-if="dataForm.iconUrl" :src="dataForm.iconUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="跳转地址" prop="url">
        <el-input v-model="dataForm.url" maxlength="250" placeholder="跳转地址"></el-input>
      </el-form-item>
      <el-form-item label="借款金额(元)" prop="loanAmount">
        <el-input v-model.number="dataForm.loanAmount" maxlength="11" placeholder="借款金额"></el-input>
      </el-form-item>
      <el-form-item label="手续费(元)" prop="feeAmount">
        <el-input v-model.number="dataForm.feeAmount" maxlength="11" placeholder="手续费"></el-input>
      </el-form-item>
      <el-form-item label="贷款利率(%)" prop="loanRate">
        <el-input v-model="dataForm.loanRate" maxlength="8" placeholder="贷款利率"></el-input>
      </el-form-item>
      <el-form-item label="贷款期限(天)" prop="loanLimitTime">
        <el-input v-model.number="dataForm.loanLimitTime" maxlength="10" placeholder="贷款期限"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status" size="mini">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">不推荐</el-radio>
          <el-radio :label="1">推荐</el-radio>
        </el-radio-group>
      </el-form-item>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" rows="3" maxlength="500" v-model="dataForm.remark" placeholder="备注"></el-input>
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
          id: 0,
          name: '',
          iconUrl: '',
          url: '',
          loanAmount: '',
          feeAmount: '',
          loanRate: '',
          loanLimitTime: '',
          status: 0,
          remark: ''
        },
        dataRule: {
          name: [
            { required: true, message: '产品名称不能为空', trigger: 'blur' }
          ],
          iconUrl: [
            { required: true, message: '产品图标不能为空', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '跳转地址不能为空', trigger: 'blur' }
          ],
          loanAmount: [
            { required: true, message: '借款金额不能为空', trigger: 'blur' },
            { type: 'number', message: '借款金额必须为数字值', trigger: 'blur' }
          ],
          feeAmount: [
            { required: true, message: '手续费不能为空', trigger: 'blur' },
            { type: 'number', message: '手续费必须为数字值', trigger: 'blur' }
          ],
          loanRate: [
            { required: true, message: '利率不能为空', trigger: 'blur' }
          ],
          loanLimitTime: [
            { required: true, message: '贷款期限不能为空', trigger: 'blur' },
            { type: 'number', message: '贷款期限必须为数字值', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.uploadUrl = this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`)
        console.log(this.uploadUrl)
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/loanproduct/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.userId = data.loanProduct.userId
                this.dataForm.name = data.loanProduct.name
                this.dataForm.iconUrl = data.loanProduct.iconUrl
                this.dataForm.url = data.loanProduct.url
                this.dataForm.loanAmount = data.loanProduct.loanAmount != null ? data.loanProduct.loanAmount / 100 : null
                this.dataForm.feeAmount = data.loanProduct.feeAmount != null ? data.loanProduct.feeAmount / 100 : null
                this.dataForm.loanRate = data.loanProduct.loanRate
                this.dataForm.loanLimitTime = data.loanProduct.loanLimitTime
                this.dataForm.status = data.loanProduct.status
                this.dataForm.remark = data.loanProduct.remark
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
        this.dataForm.iconUrl = URL.createObjectURL(file.raw)
        this.iconUrl = response.url
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/loanproduct/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'iconUrl': this.iconUrl,
                'url': this.dataForm.url,
                'loanAmount': this.dataForm.loanAmount != null ? this.dataForm.loanAmount * 100 : null,
                'feeAmount': this.dataForm.feeAmount != null ? this.dataForm.feeAmount * 100 : null,
                'loanRate': this.dataForm.loanRate,
                'loanLimitTime': this.dataForm.loanLimitTime,
                'status': this.dataForm.status,
                'remark': this.dataForm.remark
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

<template>
  <el-dialog
    :title="!dataForm.loanId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="标题" prop="loanName">
        <el-input v-model="dataForm.loanName"  placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="banner图" prop="loanIconUrl">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :before-upload="beforeUploadHandle"
          :on-success="successHandle">
          <img v-if="dataForm.loanIconUrl" :src="dataForm.loanIconUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="热点" prop="hotTag">
          <el-input v-model="dataForm.hotTag"  placeholder="热点"></el-input>
        </el-form-item>
      <el-form-item label="颜色编码" prop="color">
          <el-input v-model="dataForm.color"  placeholder="颜色编码"></el-input>
        </el-form-item>
      <el-form-item label="最小金额" prop="minAmount">
          <el-input v-model="dataForm.minAmount"  placeholder="最小金额"></el-input>
        </el-form-item>
      <el-form-item label="最大金额" prop="maxAmount">
          <el-input v-model="dataForm.maxAmount"  placeholder="最大金额"></el-input>

        </el-form-item><el-form-item label="最小天数" prop="minDays">
          <el-input v-model="dataForm.minDays"  placeholder="最小天数"></el-input>

        </el-form-item><el-form-item label="最大天数" prop="maxDays">
          <el-input v-model="dataForm.maxDays"  placeholder="最大天数"></el-input>

        </el-form-item><el-form-item label="成功年化率" prop="successRate">
          <el-input v-model="dataForm.successRate"  placeholder="成功年化率"></el-input>
        </el-form-item>
      <el-form-item label="成功年化率文本" prop="successRateTxt">
          <el-input v-model="dataForm.successRateTxt"  placeholder="成功年化率文本"></el-input>
        </el-form-item>


      <el-form-item label="标签" prop="label">
          <el-input v-model="dataForm.label"  placeholder="标签"></el-input>
        </el-form-item>
      	  <el-form-item label="公积金" prop="provideSecs">
          <el-input v-model="dataForm.provideSecs"  placeholder="公积金"></el-input>
        </el-form-item>
      <el-form-item label="推荐标签" prop="recommendTag">
          <el-input v-model="dataForm.recommendTag"  placeholder="推荐标签"></el-input>
        </el-form-item>
      <el-form-item label="成功次数" prop="successCount">
          <el-input v-model="dataForm.successCount"  placeholder="成功次数"></el-input>
        </el-form-item>


      <el-form-item label="日年化率" prop="dayRate">
          <el-input v-model="dataForm.dayRate"  placeholder="日年化率"></el-input>
        </el-form-item>


      <el-form-item label="描述" prop="applyCondition">
          <el-input v-model="dataForm.applyCondition"  placeholder="描述"></el-input>
        </el-form-item>
      <el-form-item label="描述2" prop="description">
          <el-input v-model="dataForm.description"  placeholder="描述"></el-input>
        </el-form-item>

      <el-form-item label="申请条件" prop="applyMaterial">
          <el-input v-model="dataForm.applyMaterial"  placeholder="申请条件"></el-input>
        </el-form-item>

        <el-form-item label="跳转地址" prop="linkUrl">
          <el-input v-model="dataForm.linkUrl" maxlength="250" placeholder="跳转地址"></el-input>
        </el-form-item>
            <el-form-item label="序号" prop="linkUrl">
          <el-input v-model="dataForm.orderNum" maxlength="250" placeholder="序号"></el-input>
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
          loanId: 0,
          loanName: '',
          loanIconUrl: '',
          linkUrl: '',
          hotTag: '',
          successFlag: 0,
          color: '',
          minAmount: '',
          maxAmount: '',
          minDays: '',
          maxDays: '',
          successRate: '',
          successRateTxt: '',
          dayRate: '',
          applyCondition: '',
          applyMaterial: '',
          recommendTag: '',
          provideSecs: '',
          successCount: 0,
          label: '',
          description: '',
          orderNum: '',
          status: 0
        },
        dataRule: {
          loanName: [
            { required: true, message: '产品名称不能为空', trigger: 'blur' }
          ],
          loanIconUrl: [
            { required: true, message: '产品图标不能为空', trigger: 'blur' }
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
        this.dataForm.loanId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.loanId) {
            this.$http({
              url: this.$http.adornUrl(`/generation/loans/info/${this.dataForm.loanId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.loanId = data.loans.loanId
                this.dataForm.loanName = data.loans.loanName
                this.dataForm.loanIconUrl = data.loans.loanIconUrl
                this.dataForm.hotTag = data.loans.hotTag
                this.dataForm.color = data.loans.color
                this.dataForm.minAmount = data.loans.minAmount
                this.dataForm.maxAmount = data.loans.maxAmount
                this.dataForm.minDays = data.loans.minDays
                this.dataForm.maxDays = data.loans.maxDays
                this.dataForm.successRate = data.loans.successRate
                this.dataForm.successRateTxt = data.loans.successRateTxt
                this.dataForm.dayRate = data.loans.dayRate
                this.dataForm.applyCondition = data.loans.applyCondition
                this.dataForm.applyMaterial = data.loans.applyMaterial
                this.dataForm.linkUrl = data.loans.linkUrl
                this.dataForm.recommendTag = data.loans.recommendTag
                this.dataForm.provideSecs = data.loans.provideSecs
                this.dataForm.successCount = data.loans.successCount
                this.dataForm.label = data.loans.label
                this.dataForm.orderNum = data.loans.orderNum
                this.dataForm.description = data.loans.description
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
        this.dataForm.loanIconUrl = URL.createObjectURL(file.raw)
        this.loanIconUrl = response.url
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generation/loans/${!this.dataForm.loanId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'loanId': this.dataForm.loanId || undefined,
                'loanName': this.dataForm.loanName,
                'loanIconUrl': this.loanIconUrl,
                'linkUrl': this.dataForm.linkUrl,
                'status': this.dataForm.status,
                'successFlag': this.dataForm.successFlag,
                'hotTag': this.dataForm.hotTag,
                'color': this.dataForm.color,
                'minAmount': this.dataForm.minAmount,
                'maxAmount': this.dataForm.maxAmount,
                'minDays': this.dataForm.minDays,
                'maxDays': this.dataForm.maxDays,
                'successRate': this.dataForm.successRate,
                'successRateTxt': this.dataForm.successRateTxt,
                'dayRate': this.dataForm.dayRate,
                'applyCondition': this.dataForm.applyCondition,
                'recommendTag': this.dataForm.recommendTag,
                'provideSecs': this.dataForm.provideSecs,
                'label': this.dataForm.label,
                'successCount': this.dataForm.successCount,
                'description': this.dataForm.description,
                'orderNum': this.dataForm.orderNum,
                'applyMaterial': this.dataForm.applyMaterial
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

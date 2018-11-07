<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="公司" >
        <el-autocomplete
          v-model="companyName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
          @blur = 'reset'
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" maxlength="30" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="广告图" prop="loanIconUrl">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :before-upload="beforeUploadHandle"
          :on-success="successHandle">
          <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="设备" >
        <template>
          <el-radio v-model="dataForm.app" label="android">android</el-radio>
          <el-radio v-model="dataForm.app" label="iOS">iOS</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="状态" >
        <template>
          <el-radio v-model="dataForm.status" label="0">上架</el-radio>
          <el-radio v-model="dataForm.status" label="2">下架</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="持续时间" >
        <el-date-picker
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
        <el-form-item label="跳转地址" prop="linkUrl">
          <el-input disabled v-model="dataForm.linkUrl" maxlength="250" placeholder="跳转地址"></el-input>
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
          picUrl: '',
          app: 'android',
          title: '',
          linkUrl: ''
        },
        dataRule: {
          title: [
            { required: true, message: '广告名称不能为空', trigger: 'blur' }
          ],
          picUrl: [
            { required: true, message: '广告图标不能为空', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '跳转地址不能为空', trigger: 'blur' }
          ]
        },
        companyName: '',
        selectProduct: {},
        time: null
      }
    },
    created () {
    },
    methods: {
      querySearchAsync (queryString, cb) {
        this.$http({
          url: this.$http.adornUrl('/generation/companyProduct/like'),
          method: 'get',
          params: this.$http.adornParams({param: queryString || ''})
        }).then((res) => {
          if (res.data.code != 0) {
            this.$message.error(res.data.msg)
          } else {
            res.data.companyProducts.forEach(function (n) {
              n.value = n.companyId + '-' + n.productNum + ' ' + n.productName
            })
            console.log(res.data)
            cb(res.data.companyProducts)
          }
        })
      },
      handleSelect (item) {
        console.log(item, this.companyName)
        this.selectProduct = item
        this.dataForm.linkUrl = item.linkUrl
      },
      reset () {
        console.log(this.selectProduct)
        if (this.selectProduct != {}) {
          if (this.selectProduct.companyId && this.selectProduct.productNum) {
            this.companyName = this.selectProduct.companyId + '-' + this.selectProduct.productNum + ' ' + this.selectProduct.productName
          } else {
            this.companyName = this.selectProduct.productName
          }
        }
      },
      init (item) {
        console.log(item, '进入')
        this.uploadUrl = this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`)
        this.visible = true
        if (item) {
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            if (item) {
              this.$http({
                url: this.$http.adornUrl(`/generation/openScreen/info/${item.id}`),
                // url: this.$http.adornUrl(`/sys/loanproduct/info/${this.dataForm.loanId}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                console.log(data)
                if (data && data.code === 0) {
                  this.dataForm = data.openScreenPic
                  this.dataForm.status = this.dataForm.status + ''
                  this.selectProduct = {}
                  this.selectProduct.productId = data.openScreenPic.productId
                  this.selectProduct.productName = data.openScreenPic.productName
                  this.selectProduct.productNum = data.openScreenPic.productNum
                  this.selectProduct.companyId = data.openScreenPic.companyId
                  this.companyName = data.openScreenPic.companyId + '-' + data.openScreenPic.productNum + ' ' + data.openScreenPic.productName
                  this.time=[]
                  this.time[0] = new Date(this.dataForm.showTime)
                  this.time[1] = new Date(this.dataForm.hideTime)
                  console.log(this.time)
                  // document.getElementsByClassName('el-range-input')[0].value=this.dataForm.showTime
                  // document.getElementsByClassName('el-range-input')[1].value=this.dataForm.showTime
                }
              })
            }
          })
        } else {
          this.dataForm = {
            picUrl: '',
            app: 'android',
            title: '',
            linkUrl: '',
            status: '0'
          }
          this.selectProduct = {}
          this.companyName = ''
          this.time=[]
        }
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
        var _this = this
        return new Promise(function (resolve, reject) {
          var reader = new FileReader()
          reader.onload = function (event) {
            var image = new Image()
            image.onload = function () {
              var width = this.width
              var height = this.height
              if (width != 290 || height != 460) {
                _this.$alert('图片尺寸必须为290*460!', '提示', {confirmButtonText: '确定'})
                reject()
              }
              resolve()
            }
            image.src = event.target.result
          }
          reader.readAsDataURL(file)
        })
      },
      // 上传成功
      successHandle (response, file, fileList) {
        console.log(response)
        if (response.code == 0) {
          this.dataForm.picUrl = response.url
          this.picUrl = response.url
        } else {
          this.$message({
            message: '上传失败',
            type: 'earning',
            duration: 1500
          })
        }
      },

      // 表单提交
      dataFormSubmit () {
        console.log(this.time)

        this.$refs['dataForm'].validate((valid) => {
          if (this.selectProduct.productId) {
            this.dataForm.loanName = this.selectProduct.productName
            this.dataForm.productId = this.selectProduct.productId
          } else {
            this.$message({
              message: '请选择公司',
              type: 'earning',
              duration: 1500
            })
            return false
          }
          this.dataForm.showTime = this.time[0].getTime()
          this.dataForm.hideTime = this.time[1].getTime()
          if (!this.dataForm.showTime || !this.dataForm.hideTime) {
            this.$message({
              message: '请选择时间段',
              type: 'earning',
              duration: 1500
            })
            return false
          }

          this.$http({
            url: this.$http.adornUrl('/generation/openScreen/' + (this.dataForm.id ? 'update' : 'save')),
            method: 'post',
            params: this.$http.adornParams(this.dataForm)
          }).then(({data}) => {
            console.log(data)
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
        })
      }
    }
  }
</script>
<style>
  .el-collapse-item__header{
    height: 38px;
    line-height: 38px;
    border: none;
  }
  .el-collapse-item__wrap{
    margin-top: 3px;
    border: 1px solid #dcdfe6;
    width: 100%;
  }
  .el-collapse-item__content{
    padding: 10px;
  }
  .el-collapse-item__content::after{
    display: block;
    content: '';
    clear: both;
  }
  .tagDiv{
    padding: 5px 0 0 5px;
    width: 100px;
  }
  .tagDiv::after{
    display: block;
    content: '';
    clear: both;
  }
  .tagDiv span{
    float: left;
  }
  .el-collapse-item__content .tagcolor{
    display: inline-block;
    width: 20px;
    height: 20px;
  }
  .el-collapse-item__content .tagname{
    display: inline-block;
    line-height: 20px;
    height: 20px;
    color: #a3a3a4;
    margin-left: 5px;
    border-bottom: 1px solid #e6e6e8;
    cursor: pointer;
  }
  .tagDiv{
    float: left;
  }
  .colorCode .el-tag{
    color: #fff;
  }

  .colorBQ .el-tag{
    color: #409eff;
  }
  .tagList{
    /*width: 90%;*/
    position: absolute;
    top: 1px;
    left: 1px;
    min-height: 38px;
    background-color: white;
  }
  .el-tag--mini{
    margin-left: 5px;
    width: auto;
  }
  .tabWrap{
    border: 1px dashed #eeeeee;
    padding-top: 22px;
    padding-right: 20px;
    margin-bottom: 22px;
  }
  .el-input{
    width: auto;
    min-width: 90%;
    margin-right: 10px;
  }
</style>

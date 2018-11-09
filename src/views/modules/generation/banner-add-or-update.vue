<template>
  <el-dialog
    :title="!dataForm.bannerId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="banner图" prop="imageUrl">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :before-upload="beforeUploadHandle"
          :on-success="successHandle">
          <img v-if="dataForm.imageUrl" :src="dataForm.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="标题" prop="bannerTitle">
        <el-input v-model="dataForm.bannerTitle"></el-input>
      </el-form-item>
      <el-form-item label="终端设备标识" prop="device">
        <el-select v-model="dataForm.device" placeholder="请选择终端设备">
          <el-option label="ios" value="ios"></el-option>
          <el-option label="android" value="android"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="productId">
        <div>
          <el-autocomplete
            v-model="productId"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </div>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio v-model="dataForm.status" label="0">上架</el-radio>
        <el-radio v-model="dataForm.status" label="1">下架</el-radio>
      </el-form-item>
      <el-form-item label="排序" prop="level">
        <el-input v-model="dataForm.level"></el-input>
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
        productId:'',
        uploadUrl: '',
        iconUrl: '',
        visible: false,
        productList:[],
        dataForm: {
          imageUrl: '',
          bannerTitle: '',
          linkUrl: '',
          device:'',
          screen:'',
          level:'',
          status:'',
          productId:''
        },
        timeout:  null,
        dataRule: {
          bannerTitle: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          imageUrl: [
            { required: true, message: 'banner不能为空', trigger: 'blur' }
          ],
          device: [
            { required: true, message: '终端设备标识不能为空', trigger: 'blur' }
          ],
          productId: [
            { required: true, message: '产品名称不能为空', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created(){
      //this.getCompanyfuzzy();
    },
    methods: {
      init (id) {
        this.uploadUrl = this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`)

        this.dataForm.bannerId = id

        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()

          if (this.dataForm.bannerId) {
            this.$http({
              url: this.$http.adornUrl(`/generation/banner/info/${this.dataForm.bannerId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.bannerId = data.banner.bannerId
                this.dataForm.bannerTitle = data.banner.bannerTitle
                this.dataForm.imageUrl = data.banner.imageUrl
                this.dataForm.linkUrl = data.banner.linkUrl
                this.dataForm.screen = data.banner.screen
                this.dataForm.level = data.banner.level
                this.dataForm.device = data.banner.device
                this.dataForm.status = data.banner.status +''
                this.productId = data.banner.productName
                this.dataForm.productId = data.banner.productId
              }
            })
          }else {
            this.dataForm.bannerId = ''
            this.dataForm.bannerTitle = ''
            this.dataForm.imageUrl = ''
            this.dataForm.linkUrl = ''
            this.dataForm.screen = 1
            this.dataForm.level =''
            this.dataForm.device = ''
            this.dataForm.status = ''
            this.dataForm.productId = ''
            this.productId = ''
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
        var _this = this
        return new Promise(function (resolve, reject) {
          var reader = new FileReader()
          reader.onload = function (event) {
            var image = new Image()
            image.onload = function () {
              var width = this.width
              var height = this.height
              if (width != 750 || height != 300) {
                _this.$alert('图片尺寸必须为750*300!', '提示', {confirmButtonText: '确定'})
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
        this.dataForm.imageUrl = URL.createObjectURL(file.raw)
        this.imageUrl = response.url
      },

      // 表单提交
      dataFormSubmit () {

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {

            if(this.dataForm.productId == ''){
              this.$message.error('请点击产品名称输入框选择~')
              return
            }
            this.$http({
              url: this.$http.adornUrl(`/generation/banner/${!this.dataForm.bannerId ? 'save' : 'update'}`),
              method: 'post',
              params: this.$http.adornParams({
                'bannerId': this.dataForm.bannerId || undefined,
                'bannerTitle': this.dataForm.bannerTitle,
                'imageUrl': this.imageUrl ||  this.dataForm.imageUrl,
                'linkUrl': this.dataForm.linkUrl,
                'device': this.dataForm.device,
                'screen': this.dataForm.screen,
                'level': this.dataForm.level,
                'status':this.dataForm.status + '',
                'productId':this.dataForm.productId
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
        this.dataForm.linkUrl = item.linkUrl
      }
    }
  }
</script>

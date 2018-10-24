<template>
  <el-dialog
    :title="!titleFlag ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="标签名称" prop="typeName">
        <el-input v-model="dataForm.typeName" maxlength="30" placeholder="标签名称"></el-input>
      </el-form-item>
      <el-form-item label="所属分类" prop="superTypeId">
        <el-select v-model="dataForm.superTypeId" placeholder="请选择">
          <el-option
            v-for="item in dataForm.superType"
            :key="item.superId"
            :label="item.superName"
            :value="item.superId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="首页显示" prop="recommend">
        <el-select v-model="dataForm.recommend" placeholder="请选择">
          <el-option label="是" value="1">

          </el-option >
          <el-option label="否" value="0">

          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图标" prop="imageUrl">
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
      <el-form-item label="首页排序" prop="level">
        <el-input v-model="dataForm.level" maxlength="30" placeholder="排序"></el-input>
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
        titleFlag:false,
        visible: false,
        dataForm: {
          typeName:'',
          superTypeId:'',
          recommend:'',
          imageUrl:'',
          level:'',
        },
        dataRule: {
          typeName: [
            { required: true, message: '标签名称不能为空', trigger: 'blur' }
          ],
          superTypeId: [
              { required: true, message: '所属分类不能为空', trigger: 'blur' }
            ],
          recommend: [
            { required: true, message: '首页显示不能为空', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '首页排序不能为空', trigger: 'blur' }
          ],
          imageUrl: [
            { required: true, message: '产品图标不能为空', trigger: 'blur' }
          ],
        },
        superType:[]

      }
    },
    methods: {
      init (val) {
        this.uploadUrl = this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`)
        this.visible = true


        if(arguments[1] == false){
          this.titleFlag = true;
          this.dataForm.typeName = val.typeName;
          this.dataForm.superTypeId = val.superTypeId;
          this.dataForm.recommend = val.recommend;
          this.dataForm.imageUrl = val.picUrl;
          this.dataForm.level = val.level;
          this.dataForm.id = val.typeId;
          this.dataForm.superType = val.superType;
        }else {
          this.titleFlag = false;
          this.dataForm.typeName = '';
          this.dataForm.superTypeId = '';
          this.dataForm.recommend = '';
          this.dataForm.imageUrl = '';
          this.dataForm.level = '';
          this.dataForm.superType = val
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
            this.$http({
              url: this.$http.adornUrl(`/sys/loanproduct/type/modify`),
              method: 'post',
              params: this.$http.adornParams({
                'id': this.dataForm.id || null,
                'superTypeId': this.dataForm.superTypeId || null,
                'picUrl': this.imageUrl || this.dataForm.imageUrl,
                'typeName':this.dataForm.typeName,
                'level':this.dataForm.level,
                'recommend':this.dataForm.recommend
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

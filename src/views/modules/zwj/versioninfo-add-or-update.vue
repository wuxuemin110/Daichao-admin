<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="版本号" prop="version">
        <el-input v-model="dataForm.version" maxlength="30" placeholder="版本号"></el-input>
      </el-form-item>

    <el-form-item label="版本描述" prop="updateDesc">
      <el-input type="textarea" v-model="dataForm.updateDesc" maxlength="30" placeholder="版本描述"></el-input>
    </el-form-item>

    <el-form-item label="强制更新" >
      <template>
        <el-radio v-model="dataForm.force" label="1">是</el-radio>
        <el-radio v-model="dataForm.force" label="0">否</el-radio>
      </template>
    </el-form-item>
      <el-form-item label="下载地址" prop="updateDesc">
        <el-input  v-model="dataForm.downloadUrl" maxlength="30" placeholder="版本描述"></el-input>
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
          version: '',
          updateDesc: '',
          force: '0',
          downloadUrl: ''

        },
        dataRule: {
          version: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' }
          ],
          downloadUrl: [
            { required: true, message: '下载地址不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    props: ['dataList'],
    methods: {
      init (item) {
        if (item) {
          this.$http({
            url: this.$http.adornUrl(`/generation/appVersion/info/${item.id}`),
            // url: this.$http.adornUrl(`/sys/loanproduct/info/${this.dataForm.loanId}`),
            method: 'get'
          }).then(({data}) => {
            console.log(data)
            if (data && data.code === 0) {
              this.dataForm = data.appVersion
              this.dataForm.force = this.dataForm.force + ''
            }
          })
        } else {
          this.dataForm = {
            version: '',
            updateDesc: '',
            force: '0',
            downloadUrl: ''

          }
        }

        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        console.log(this.dataForm)
        this.$refs['dataForm'].validate((valid) => {
          var reg = /\d+(\.\d+){0,2}/
          if (reg.test(this.dataForm.version)) {
            this.$http({
              url: this.$http.adornUrl('/generation/appVersion/' + (this.dataForm.id ? 'update' : 'save')),
              method: 'post',
              params: this.$http.adornParams(this.dataForm)
            }).then(({data}) => {
              if (data && data.code === 0) {
                console.log(data)
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              }
            })
          } else {
            this.$message({
              message: '版本号格式不正确',
              type: 'warning',
              duration: 1500
            })
          }
        })
      }
    }
  }
</script>

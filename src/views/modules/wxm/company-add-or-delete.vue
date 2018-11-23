<template>
  <el-dialog
    :title="dataForm.companyName == null ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="公司名称" prop="companyName">
        <el-input v-model="dataForm.companyName"  placeholder="公司名称"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contactName">
      <el-input v-model="dataForm.contactName"  placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系号码" prop="contactMobile">
      <el-input v-model="dataForm.contactMobile"  placeholder="联系号码"></el-input>
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
        visible: false,
        dataForm:{
          companyName:null,
          companyId:null
        },
        dataRule: {
          companyName: [
            { required: true, message: '公司名称不能为空', trigger: 'blur' }
          ],
          contactName: [
            { required: true, message: '联系人不能为空', trigger: 'blur' }
          ],
          contactMobile: [
            { required: true, message: '联系电话不能为空', trigger: 'blur' }
          ]

        }
      }
    },
    methods: {
      init (item) {
        this.visible = true
        console.log(item)
        if(item == undefined){
          this.dataForm.companyName = null
          this.dataForm.companyId = null
          this.dataForm.contactName = null
          this.dataForm.contactMobile  = null
        }else {
          this.dataForm.companyName = item.companyName
          this.dataForm.companyId = item.companyId
          this.dataForm.contactName = item.contactName
          this.dataForm.contactMobile  = item.contactMobile
        }

      },

      // 表单提交
      dataFormSubmit () {

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generation/companyInfo/${this.dataForm.companyId == null ? 'save' : 'update'}`),
              method: 'post',
              params: this.$http.adornParams({
                'token':this.$cookie.get('token'),
                'companyId':this.dataForm.companyId || null,
                'companyName': this.dataForm.companyName,
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

<template>
  <el-dialog
    :title="!dataForm.typeId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="分类名称" prop="typeName">
        <el-input v-model="dataForm.typeName" maxlength="30" placeholder="分类名称"></el-input>
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
          typeName: '',
          recommend: '0',
        },
        dataList: [],
        dataRule: {
          typeName: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    props: ['dataList'],
    methods: {
      init (item) {
        if(item){
          this.dataForm = JSON.parse(JSON.stringify(item))
        }else{
          this.dataForm = {}
        }

        this.visible = true
      },
      // 表单提交
      dataFormSubmit () {
        console.log(this.dataForm)

        if (this.dataForm.typeName) {
          if(!this.dataForm.level){
            this.dataForm.level = this.dataList[this.dataList.length - 1].level - 0 + 1
          }
          if(this.dataForm.typeId){
            this.dataForm.id = this.dataForm.typeId
          }
          this.dataForm.recommend = 0
          this.$http({
            url: this.$http.adornUrl('/sys/loanproduct/type/modify'),
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
        }
      }
    }
  }
</script>

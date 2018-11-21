<template>
  <el-dialog
    title="新增"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="版本号" prop="version">
        <el-input v-model="dataForm.version" maxlength="30" placeholder="请填写版本号"></el-input>
      </el-form-item>

      <el-form-item label="标识" prop="code">
        <el-select v-model="dataForm.code" placeholder="请选择">
          <el-option label="贷款超市" value="0"></el-option >
          <el-option label="桔子贷款" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="BundleId" prop="code">
        <el-select :disabled="dataForm.id" v-model="dataForm.bundleId" placeholder="请选择">
          <el-option   v-for="item in bundleList" :label="item.label" :key="item.value"  :value="item.value"></el-option >
        </el-select>
      </el-form-item>
      <!--<el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择">
          <el-option label="正常" value="0"></el-option >
          <el-option label="锁定" value="1"></el-option>
        </el-select>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    export default {
      data () {
        return {
          uploadUrl: '',
          iconUrl: '',
          visible: false,
          dataForm: {
            version: '',
            code: '',
            bundleId: ''
          },
          dataRule: {
            version: [
               { required: true, message: '版本号不能为空', trigger: 'blur' }
            ],
            code: [
               { required: true, message: '标识不能为空', trigger: 'blur' }
            ],
            bundleId: [
               { required: true, message: 'bundleId不能为空', trigger: 'blur' }
            ]
          },
          bundleList: []
        }
      },
      created () {
        this.getBundleList()
      },
      methods: {
        init (val) {
          this.visible = true
          if (val !== undefined) {
            this.dataForm.version = val.version + ''
            this.dataForm.code = val.code + ''
            this.dataForm.id = val.id
            this.dataForm.bundleId = val.bundleId
          } else {
            this.dataForm.version = ''
            this.dataForm.code = ''
            this.dataForm.bundleId = ''
            this.dataForm.id = null
          }
        },
        getBundleList () {
          this.$http({
            url: this.$http.adornUrl(`/generation/version/getBundleId`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              var arr = []
              data.list.forEach(function (n) {
                var obj = {}
                obj.label = n.bundleId
                obj.value = n.bundleId
                arr.push(obj)
              })
              this.bundleList = arr
              console.log(this.bundleList)
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        // 表单提交
        dataFormSubmit () {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(`/generation/version/modify`),
                method: 'post',
                params: this.$http.adornParams({
                  'version': this.dataForm.version,
                  'code': this.dataForm.code,
                  'id': this.dataForm.id ? this.dataForm.id : null,
                  'bundleId': this.dataForm.bundleId
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

<style scoped>

</style>

<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="" prop="dictId">
        <el-input v-model="dataForm.dictId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="dictCode">
        <el-input v-model="dataForm.dictCode" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="dictValue">
        <el-input v-model="dataForm.dictValue" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="showOrder">
        <el-input v-model="dataForm.showOrder" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="remark">
        <el-input v-model="dataForm.remark" placeholder=""></el-input>
      </el-form-item>
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
        visible: false,
        dataForm: {
          id: 0,
          dictId: '',
          dictCode: '',
          dictValue: '',
          showOrder: '',
          remark: ''
        },
        dataRule: {
          dictId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          dictCode: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          dictValue: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          showOrder: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/commdictdetail/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.dictId = data.commDictDetail.dictId
                this.dataForm.dictCode = data.commDictDetail.dictCode
                this.dataForm.dictValue = data.commDictDetail.dictValue
                this.dataForm.showOrder = data.commDictDetail.showOrder
                this.dataForm.remark = data.commDictDetail.remark
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/commdictdetail/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'dictId': this.dataForm.dictId,
                'dictCode': this.dataForm.dictCode,
                'dictValue': this.dataForm.dictValue,
                'showOrder': this.dataForm.showOrder,
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

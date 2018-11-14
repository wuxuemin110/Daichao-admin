<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="渠道名" prop="channelName">
        <el-input v-model="dataForm.channelName" placeholder="渠道名称" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="扣量比" prop="percent">
        <el-input v-model="dataForm.percent" placeholder="扣量比" type="num"  style="width: 200px;" ></el-input> %
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
      var checkAge = (rule, value, callback) => {
        console.log(value)
        if (!value) {
          return callback(new Error('扣量比不能为空'))
        }
        value = value - 0
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        }
      }
      return {
        visible: false,
        sales: [],
        dataForm: {
          id: 0,
          channelName: '',
          percent: 0
        },
        dataRule: {
          channelName: [
            { required: true, message: '渠道名称不能为空', trigger: 'blur' }
          ],
          percent: [
            { required: true, message: '扣量比不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (item) {
        this.dataForm = {
          id: 0,
          channelName: '',
          percent: ''
        }
        console.log(item, '二号弹窗')
        if (item) {
          this.dataForm.id = item.id
          this.dataForm.channelId = item.channelId
        } else {
          this.dataForm.id = 0
        }

        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/channel/selectOneById`),
              method: 'get',
              params: this.$http.adornParams({channelId: item.channelId, id: item.id})
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.channelName = data.channelRegisterEntity.channelName
                this.dataForm.percent = data.channelRegisterEntity.percent
              }
            })
          } else {
            this.dataForm.status = '0'
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!Number.isInteger(this.dataForm.percent - 0)) {
              this.$message({
                message: '扣量比必须为数字',
                type: 'earning'
              })
              return false
            }
            // return false
            this.$http({
              url: this.$http.adornUrl(`/sys/channel/editChannelRegister`),
              method: 'post',
              params: this.$http.adornParams({
                'id': this.dataForm.id || null,
                'channelId': this.dataForm.channelId || undefined,
                'percent': this.dataForm.percent
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

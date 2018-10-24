<template>
  <div class="mod-config">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="贷款额度(元)">
        <el-input v-model.number="dataForm.capital" maxlength="11" placeholder="" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="贷款利率(%)">
        <el-input v-model="dataForm.loanRate" maxlength="8" placeholder="" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="贷款期限(天)">
        <el-input v-model.number="dataForm.limitTime" maxlength="10" placeholder="" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" style="margin-left: 100px;">
      <!-- <el-button style="margin-right: 50px;">取消</el-button> -->
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          capital: '',
          loanRate: '',
          limitTime: ''
        },
        dataRule: {
          capital: [
            { required: true, message: '贷款金额不能为空', trigger: 'blur' },
            { type: 'number', message: '贷款金额必须为数字值', trigger: 'blur' }
          ],
          loanRate: [
            { required: true, message: '贷款利率不能为空', trigger: 'blur' }
          ],
          limitTime: [
            { required: true, message: '贷款期限不能为空', trigger: 'blur' },
            { type: 'number', message: '贷款期限必须为数字值', trigger: 'blur' }
          ]
        }
      }
    },
    activated () {
      this.getLoanInfo()
    },
    methods: {
      getLoanInfo () {
        this.$http({
          url: this.$http.adornUrl(`/sys/param/loanInfo`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.capital = data.param.capital
            this.dataForm.loanRate = data.param.loanRate
            this.dataForm.limitTime = data.param.limitTime
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/param/loanUpdate`),
              method: 'post',
              data: this.$http.adornData({
                'capital': this.dataForm.capital,
                'loanRate': this.dataForm.loanRate,
                'limitTime': this.dataForm.limitTime
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

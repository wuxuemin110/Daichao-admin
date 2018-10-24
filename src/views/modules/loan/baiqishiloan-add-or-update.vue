<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="用户姓名"></el-input>
      </el-form-item>
      <el-form-item label="用户手机号码" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="用户手机号码"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码" prop="certNo">
        <el-input v-model="dataForm.certNo" placeholder="身份证号码"></el-input>
      </el-form-item>
      <el-form-item label="用户借贷信息" prop="loanInfos">
        <el-input v-model="dataForm.loanInfos" placeholder="用户借贷信息"></el-input>
      </el-form-item>
      <el-form-item label="本次请求的流水号" prop="flowNo">
        <el-input v-model="dataForm.flowNo" placeholder="本次请求的流水号"></el-input>
      </el-form-item>
      <el-form-item label="决策结果码" prop="finalDecision">
        <el-input v-model="dataForm.finalDecision" placeholder="决策结果码"></el-input>
      </el-form-item>
      <el-form-item label="最终风险系数" prop="finalScore">
        <el-input v-model="dataForm.finalScore" placeholder="最终风险系数"></el-input>
      </el-form-item>
      <el-form-item label="获取贷款信息的状态，1表示成功，0表示失败" prop="loanStatus">
        <el-input v-model="dataForm.loanStatus" placeholder="获取贷款信息的状态，1表示成功，0表示失败"></el-input>
      </el-form-item>
      <el-form-item label="创建时间，获取交易报告的时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="创建时间，获取交易报告的时间"></el-input>
      </el-form-item>
      <el-form-item label="报告更新时间" prop="modifyTime">
        <el-input v-model="dataForm.modifyTime" placeholder="报告更新时间"></el-input>
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
          name: '',
          mobile: '',
          certNo: '',
          loanInfos: '',
          flowNo: '',
          finalDecision: '',
          finalScore: '',
          loanStatus: '',
          createTime: '',
          modifyTime: ''
        },
        dataRule: {
          name: [
            { required: true, message: '用户姓名不能为空', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '用户手机号码不能为空', trigger: 'blur' }
          ],
          certNo: [
            { required: true, message: '身份证号码不能为空', trigger: 'blur' }
          ],
          loanInfos: [
            { required: true, message: '用户借贷信息不能为空', trigger: 'blur' }
          ],
          flowNo: [
            { required: true, message: '本次请求的流水号不能为空', trigger: 'blur' }
          ],
          finalDecision: [
            { required: true, message: '决策结果码不能为空', trigger: 'blur' }
          ],
          finalScore: [
            { required: true, message: '最终风险系数不能为空', trigger: 'blur' }
          ],
          loanStatus: [
            { required: true, message: '获取贷款信息的状态，1表示成功，0表示失败不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间，获取交易报告的时间不能为空', trigger: 'blur' }
          ],
          modifyTime: [
            { required: true, message: '报告更新时间不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/sys/baiqishiloan/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.baiqishiLoan.name
                this.dataForm.mobile = data.baiqishiLoan.mobile
                this.dataForm.certNo = data.baiqishiLoan.certNo
                this.dataForm.loanInfos = data.baiqishiLoan.loanInfos
                this.dataForm.flowNo = data.baiqishiLoan.flowNo
                this.dataForm.finalDecision = data.baiqishiLoan.finalDecision
                this.dataForm.finalScore = data.baiqishiLoan.finalScore
                this.dataForm.loanStatus = data.baiqishiLoan.loanStatus
                this.dataForm.createTime = data.baiqishiLoan.createTime
                this.dataForm.modifyTime = data.baiqishiLoan.modifyTime
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
              url: this.$http.adornUrl(`/sys/baiqishiloan/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'mobile': this.dataForm.mobile,
                'certNo': this.dataForm.certNo,
                'loanInfos': this.dataForm.loanInfos,
                'flowNo': this.dataForm.flowNo,
                'finalDecision': this.dataForm.finalDecision,
                'finalScore': this.dataForm.finalScore,
                'loanStatus': this.dataForm.loanStatus,
                'createTime': this.dataForm.createTime,
                'modifyTime': this.dataForm.modifyTime
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

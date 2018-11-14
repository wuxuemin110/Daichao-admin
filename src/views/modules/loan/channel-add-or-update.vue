<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="渠道名" prop="channelName">
        <el-input v-model="dataForm.channelName" placeholder="渠道名称" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="渠道昵称" prop="channelNickName">
        <el-input :disabled="dataForm.id?true:false" v-model="dataForm.channelNickName" placeholder="渠道昵称" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="推广链接" prop="promotionLink">
        <el-input v-model="dataForm.promotionLink" placeholder="推广链接" ></el-input>
      </el-form-item>
      <el-form-item label="状态" >
        <template>
          <el-radio v-model="dataForm.status" label="0">上架</el-radio>
          <el-radio v-model="dataForm.status" label="2">下架</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" rows="4" v-model="dataForm.remark" placeholder="备注"></el-input>
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
        sales: [],
        dataForm: {
          id: 0,
          channelName: '',
          promotionLink: '',
          remark: '',
          status: '',
          channelNickName: ''
        },
        dataRule: {
          channelName: [
            { required: true, message: '渠道名称不能为空', trigger: 'blur' }
          ],
          channelNickName: [
        { required: true, message: '渠道昵称不能为空', trigger: 'blur' }
          ],
          promotionLink: [
            { required: true, message: '推广链接不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/sys/channel/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.channelName = data.channel.channelName
                this.dataForm.promotionLink = data.channel.promotionLink
                this.dataForm.remark = data.channel.remark
                this.dataForm.status = data.channel.status + ''
                this.dataForm.channelNickName = data.channel.channelNickName
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
            this.$http({
              url: this.$http.adornUrl(`/sys/channel/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'channelName': this.dataForm.channelName,
                'promotionLink': this.dataForm.promotionLink,
                'remark': this.dataForm.remark,
                'status': this.dataForm.status,
                'channelNickName': this.dataForm.channelNickName,
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

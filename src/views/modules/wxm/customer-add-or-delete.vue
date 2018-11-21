<template>
  <el-dialog
    :title="dataForm.productId == null ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="130px">
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="dataForm.productName" maxlength="30" placeholder="产品名称"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="companyId">
      <el-select v-model="dataForm.companyId" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.companyId"
          :label="item.companyName"
          :value="item.companyId">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="链接地址" prop="linkUrl">
        <el-input v-model="dataForm.linkUrl" maxlength="30" placeholder="链接地址"></el-input>
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model="dataForm.price" maxlength="30" placeholder="单价"></el-input>
      </el-form-item>
      <el-form-item label="当日点击数上限" prop="price">
        <el-input v-model="dataForm.sumClickComplete" maxlength="30" placeholder="点击数上限"></el-input>
      </el-form-item>
      <!--<el-form-item label="联系人" prop="contactName">-->
        <!--<el-input v-model="dataForm.contactName" maxlength="30" placeholder="联系人"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="联系号码" prop="contactMobile">-->
        <!--<el-input v-model="dataForm.contactMobile" maxlength="30" placeholder="联系号码"></el-input>-->
      <!--</el-form-item>-->
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
        dataForm:{
          productName:'',
          companyId:'',
          price:'',
          linkUrl:'',
          contactName:'',
          contactMobile:'',
          productId:null
        },
        options: [],
        dataRule: {
          productName: [
            { required: true, message: '产品名称不能为空', trigger: 'blur' }
          ],
          companyId: [
            { required: true, message: '公司名称不能为空', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '单价不能为空', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '连接地址不能为空', trigger: 'blur' }
          ],
          sumClickComplete: [
            { required: true, message: '当日点击上限不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    created(){
      this.getCompanyList();
    },
    methods: {
      init (item) {

        this.visible = true
        if(item == undefined){
          this.dataForm.productName = null
          this.dataForm.companyId = null
          this.dataForm.price = null
          this.dataForm.linkUrl = null
          this.dataForm.contactName = null
          this.dataForm.contactMobile = null
          this.dataForm.productId = null
          this.dataForm.sumClickComplete = null
        }else {
          this.dataForm.productName = item.productName
          this.dataForm.companyId = item.companyId
          this.dataForm.price = item.price
          this.dataForm.linkUrl = item.linkUrl
          this.dataForm.contactName = item.contactName
          this.dataForm.contactMobile = item.contactMobile
          this.dataForm.productId = item.productId
          this.dataForm.sumClickComplete = item.sumClickComplete
        }

      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generation/companyProduct/${this.dataForm.productId == null ? 'save' : 'update'}`),
              method: 'post',
              params: this.$http.adornParams({
                'token':this.$cookie.get('token'),
                'companyId':this.dataForm.companyId,
                'productName': this.dataForm.productName,
                'linkUrl':this.dataForm.linkUrl,
                'price':this.dataForm.price,
                'sumClickComplete':this.dataForm.sumClickComplete,
                // 'contactName':this.dataForm.contactName,
                // 'contactMobile':this.dataForm.contactMobile,
                'productId':this.dataForm.productId || null
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
      },
      //公司列表
      getCompanyList(){
        this.$http({
          url:this.$http.adornUrl(`/generation/companyInfo/list`),
          methods:'get',
          params:this.$http.adornParams({
            'token':this.$cookie.get('token')
          })
        }).then(({data})=>{
          if (data && data.code === 0) {
            this.options = data.page.list

          } else {
            this.options = []
          }
        })
      }
    }
  }
</script>

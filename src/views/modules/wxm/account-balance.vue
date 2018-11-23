<template>
  <el-dialog
    title="结算"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="产品编号" >
        <el-input :disabled="true" v-model="dataForm.productDisplayNum"  placeholder="产品编号"></el-input>
      </el-form-item>
      <el-form-item label="产品名字">
        <el-input :disabled="true" v-model="dataForm.productName"  placeholder="产品名字"></el-input>
      </el-form-item>
      <el-form-item label="总充值" >
        <el-input :disabled="true" v-model="dataForm.totalRecharge"  placeholder="总充值"></el-input>
      </el-form-item>
      <el-form-item label="日期" prop="companyName">
        <!--<el-date-picker
          unlink-panels
          @change="change(dataForm.date)"
          v-model="dataForm.date"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>-->

        <el-date-picker
          @change="change(dataForm.date)"
          v-model="dataForm.date"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期">
        </el-date-picker>


      </el-form-item>

      <el-form-item label="单价" prop="price">
        <el-input v-model="dataForm.price"  placeholder="单价"></el-input>
      </el-form-item>
      <el-form-item label="结算注册数" prop="settedRegistered" >
        <el-input v-model="dataForm.settedRegistered"  placeholder="结算注册数"></el-input>
      </el-form-item>
      <el-form-item label="累计点击数" >
        <el-input   :disabled="true" v-model="dataForm.clickComplete"  placeholder="累计点击数"></el-input>
      </el-form-item>
     <!-- <el-form-item label="注册转化率" >
        <el-input style="width: 80%"  :disabled="true" v-model="dataForm.conversionRate"  placeholder="注册转化率"></el-input>
        %
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        productId:'',
        visible: false,
        dataForm:{
          productId:'',//产品ID
          date:'',//时间
          clickComplete:'',//累计点击数
          price:'',//单价
          settedRegistered:'',//结算注册数
          //conversionRate:'',//注册转化率
          productDisplayNum:'',//产品编号
          productName:'',//产品名字
          totalRecharge:'',//总充值
        },
        dataRule: {
          date: [
            { required: true, message: '日期不能为空', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '单价不能为空', trigger: 'blur' }
          ],
          settedRegistered: [
          { required: true, message: '结算注册数不能为空', trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      dateFormat (row, column) {
        var date = row[column.property]
        if (date === undefined || date == null) {
          return ''
        }
        return formatDate(new Date(date), 'yyyy-MM-dd hh:mm:ss')
      },
      init (item) {
        this.visible = true
        this.dataForm.productId = item.productId;
        this.dataForm.totalRecharge = item.totalRecharge; //总充值
        this.dataForm.productDisplayNum = item.productDisplayNum;//产品编号
        this.dataForm.productName = item.productName; //产品名字
      },
      change(item){
        console.log(this.dataForm.date)
        if(item){
          this.$http({
            url: this.$http.adornUrl(`/generation/companyProduct/clickComplete/${ this.dataForm.productId}`),
            method: 'post',
            params: this.$http.adornParams({
              'token':this.$cookie.get('token'),
              'startDate':this.dataForm.date !== null ? this.dataForm.date +  ' 00:00:00' : null,
              'endDate':this.dataForm.date !== null ? this.dataForm.date + ' 23:59:59' : null,
            })
          }).then(({data})=>{
            if (data && data.code === 0){
              this.dataForm.clickComplete = data.clickComplete


            }else {
              this.$message.error(data.msg)
            }
          })
        }
      },

      // 表单提交
      dataFormSubmit () {
        if(this.dataForm.date == ''){
          this.$message.error('请先选择时间~')
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/generation/companyProduct/balance/save`),
              method: 'get',
              params: this.$http.adornParams({
                'token':this.$cookie.get('token'),
                'productId':this.dataForm.productId,
                'totalRecharge':this.dataForm.totalRecharge,
                'price':this.dataForm.price,
                'clickComplete':this.dataForm.clickComplete,
                'settedRegistered':this.dataForm.settedRegistered,
                'totalRecharge':this.dataForm.totalRecharge,
                'settedCount':this.dataForm.price * this.dataForm.settedRegistered,
                'status':1,
                'createTime':this.dataForm.date,
                'uid': this.$store.state.user.id
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

<template>
  <el-dialog
    :title="!dataForm.loanId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <!--<el-dialog title="修改阈值" :visible.sync="innervisible" append-to-body>-->
      <!--<el-input style="min-width: 200px;"  v-model="dataForm.changeoffCount" maxlength="30" placeholder="自动下架阈值"></el-input>-->
      <!--<span slot="footer" class="dialog-footer">-->
      <!--<el-button @click="innervisible = false">取消</el-button>-->
      <!--<el-button type="primary" @click="change()">确定</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="公司" >
        <el-autocomplete
          v-model="companyName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
          @blur = 'reset'
        ></el-autocomplete>
      </el-form-item>
      <!--<el-form-item label="标题" prop="loanName">-->
        <!--<el-input v-model="dataForm.loanName" maxlength="30" placeholder="标题"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="icon图" prop="loanIconUrl">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :before-upload="beforeUploadHandle"
          :on-success="successHandle">
          <img v-if="dataForm.loanIconUrl" :src="dataForm.loanIconUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <!--<el-form-item label="热点" prop="hotTag">-->
          <!--<el-input v-model="dataForm.hotTag" maxlength="30" placeholder="热点"></el-input>-->
        <!--</el-form-item>-->
      <el-form-item label="首页推荐" prop="orderNum" >
        <template>
          <el-radio v-model="dataForm.orderNum" label="1">是</el-radio>
          <el-radio v-model="dataForm.orderNum" label="0">否</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="最小金额" prop="minAmount">
          <el-input v-model="dataForm.minAmount" maxlength="30" placeholder="最小金额"></el-input>元
        </el-form-item>
      <el-form-item label="最大金额" prop="maxAmount">
          <el-input v-model="dataForm.maxAmount" maxlength="30" placeholder="最大金额"></el-input>元

        </el-form-item><el-form-item label="周期" prop="days">
          <el-input v-model="dataForm.days" maxlength="30" placeholder="周期"></el-input>天
        </el-form-item>

      <el-form-item label="标签" >
        <el-collapse style="padding: 0;" class="el-input__inner">
          <div  v-bind:style="{height:selectColor.length>6?'auto':'38px'}"  class="tagList colorBQ"><el-tag

            v-for="tag in selectTab"
            :key="tag.typeName"
            closable
            size="mini"
            @close="tabClose(tag)"
          >
            {{tag.typeName}}
          </el-tag></div>
          <el-collapse-item style="height: 38px;line-height: 38px;" title="" name="1">
            <div v-for="(item,index) in tabDataList" v-if="item.secondTypes.length>0" >
            <div class="tagDiv" style="width: 100%;" ><span class="tagname" style="border: none;color: #666;">{{item.typeName}}:</span></div>
            <div class="tagDiv"  v-for="item2 in item.secondTypes" v-on:click="getTab(item2,item)" ><span class="tagname">{{item2.typeName}}</span></div>
            </div>
          </el-collapse-item>
        </el-collapse>

        </el-form-item>
      <div class="tabWrap" v-if="selectTab.length>0">
        <el-form-item :key="item.typeId" :label="item.typeName" v-for="item in selectTab">
          <el-input v-model="item.level" maxlength="30" placeholder="排序"></el-input>
        </el-form-item>
      </div>
      	  <!--<el-form-item label="公积金" prop="provideSecs">-->
          <!--<el-input v-model="dataForm.provideSecs" maxlength="30" placeholder="公积金"></el-input>-->
        <!--</el-form-item>-->
      <el-form-item label="热门标签" prop="hotTag">
        <el-input v-model="dataForm.hotTag" maxlength="30" placeholder="多个热门标签使用逗号分隔,每个标签的字数不要超过4个"></el-input>
      </el-form-item>
      <el-form-item  label="颜色编码" prop="color">
        <el-collapse style="padding: 0;" class="el-input__inner">
          <div  v-bind:style="{height:selectColor.length>6?'auto':'38px'}"  class="tagList colorCode"><el-tag

            v-for="(tag,index) in selectColor"
            :key="tag.name"
            closable
            size="mini"
            @close="colorClose(tag)"
            v-bind:style="{background:tag.name,width:'auto'}"
          >
            {{tag.name}}
          </el-tag></div>
          <el-collapse-item style="height: 38px;line-height: 38px;" title="" name="1">
            <div class="tagDiv" v-for="item in tags"><span class="tagcolor" v-bind:style="{background:item.name}"></span><span v-on:click="getColor(item)" class="tagname">{{item.name}}</span></div>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>
      <el-form-item label="成功次数" prop="successCount">
          <el-input v-model="dataForm.successCount" maxlength="30" placeholder="成功次数"></el-input>
        </el-form-item>


      <el-form-item label="日年化率" prop="dayRate">
          <el-input v-model="dataForm.dayRate" maxlength="30" placeholder="日年化率"></el-input>%
        </el-form-item>

      <el-form-item label="状态" prop="status">
        <template>
          <el-radio v-model="dataForm.status" label="0">上架</el-radio>
          <el-radio v-model="dataForm.status" label="3">下架</el-radio>
        </template>
      </el-form-item>
        <el-form-item label="跳转地址" prop="linkUrl">
          <el-input disabled v-model="dataForm.linkUrl" maxlength="250" placeholder="跳转地址"></el-input>
        </el-form-item>
            <!--<el-form-item label="序号" prop="linkUrl">-->
          <!--<el-input v-model="dataForm.orderNum" maxlength="250" placeholder="序号"></el-input>-->
        <!--</el-form-item>-->
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
        innervisible: false,
        companyName: '',
        dataForm: {
          loanId: '',
          loanName: '',
          loanIconUrl: '',
          linkUrl: '',
          color: '',
          minAmount: '',
          maxAmount: '',
          days: '',
          successRate: '',
          dayRate: '',
          successCount: 0,
          orderNum: '1',
          status: '0'
        },
        dataRule: {
          loanIconUrl: [
            { required: true, message: '产品图标不能为空', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '跳转地址不能为空', trigger: 'blur' }
          ]
        },
        selectProduct: {},
        tags: [
          {name: '#ffb657'},
          {name: '#4ed6c2'},
          {name: '#ff4645'},
          {name: '#47c436'},
          {name: '#4e65fe'},
          {name: '#56d0fd'}
        ],
        tabDataList: [],
        selectColor: [],
        selectTab: []
      }
    },
    created () {
      var div = document.getElementById('div1')
      this.getTabDataList()

      // this.$http({
      //   url: this.$http.adornUrl('/sys/loanproduct/type/list'),
      //   method: 'get'
      // }).then(function (res) {
      //    console.log(res)
      // })
    },
    methods: {
      getColor (item) {
        var arr
        if(this.dataForm.hotTag !=  ''){
          arr = this.dataForm.hotTag.split(',')
        } else {
          arr = []
        }
        console.log(arr)
        if (this.selectColor.length < arr.length ) {
          this.selectColor.push(item)
        } else {
          this.$message({
            message: '颜色个数不能超过热门标签个数',
            type: 'warning'
          })
        }

        Array.from(new Set(this.selectColor))
      },
      colorClose (tag) {
        this.selectColor.splice(this.selectColor.indexOf(tag), 1)
      },
      getTab (item, item2) {
        var obj = Object.assign({superTypeId: item2.typeId}, item)
        var index2 = this.selectTab.findIndex((value, index3, arr) => {
          console.log(item2.typeId)
          return value.superTypeId == item2.typeId
        })
        if (index2 != -1) {
          this.$message({
            message: '每种分类下的标签只能选择一个',
            type: 'warning'
          })
        } else {
          this.selectTab.push(obj)
        }

        console.log(this.selectTab)
      },
      tabClose (tag) {
        this.selectTab.splice(this.selectTab.indexOf(tag), 1)
      },
      querySearchAsync (queryString, cb) {
        this.$http({
          url: this.$http.adornUrl('/generation/companyProduct/like'),
          method: 'get',
          params: this.$http.adornParams({param: queryString || ''})
        }).then((res) => {
          if (res.data.code != 0) {
            this.$message.error(res.data.msg)
          } else {
            res.data.companyProducts.forEach(function (n) {
              n.value = n.companyId + '-' + n.productNum + ' ' + n.productName
            })
            console.log(res.data)
            cb(res.data.companyProducts)
          }
        })
      },
      handleSelect (item) {
        console.log(item, this.companyName)
        this.selectProduct = item
        this.dataForm.linkUrl = item.linkUrl
      },
      reset () {
        console.log(this.selectProduct)
        if (this.selectProduct != {}) {
          if (this.selectProduct.companyId && this.selectProduct.productNum) {
            this.companyName = this.selectProduct.companyId + '-' + this.selectProduct.productNum + ' ' + this.selectProduct.productName
          } else {
            this.companyName = this.selectProduct.productName
          }
        }
      },
      change () {

      },
      init (id) {
        console.log(id, '进入')
        this.uploadUrl = this.$http.adornUrl(`/sys/oss/upload?token=${this.$cookie.get('token')}`)
        console.log(id)
        this.visible = true
        if (id) {
          this.dataForm.loanId = id

          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            if (this.dataForm.loanId) {
              this.$http({
                url: this.$http.adornUrl(`/generation/loans/info/${this.dataForm.loanId}`),
                // url: this.$http.adornUrl(`/sys/loanproduct/info/${this.dataForm.loanId}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                console.log(data)
                if (data && data.code === 0) {
                  this.dataForm.loanId = data.loans.loanId
                  this.dataForm.loanName = data.loans.loanName
                  this.dataForm.loanIconUrl = data.loans.loanIconUrl
                  this.dataForm.hotTag = data.loans.hotTag
                  this.dataForm.color = data.loans.color
                  this.dataForm.minAmount = data.loans.minAmount
                  this.dataForm.maxAmount = data.loans.maxAmount
                  this.dataForm.days = data.loans.days
                  this.dataForm.successRate = data.loans.successRate
                  this.dataForm.successRateTxt = data.loans.successRateTxt
                  this.dataForm.dayRate = data.loans.dayRate
                  this.dataForm.applyCondition = data.loans.applyCondition
                  this.dataForm.applyMaterial = data.loans.applyMaterial
                  this.dataForm.linkUrl = data.loans.linkUrl
                  this.dataForm.provideSecs = data.loans.provideSecs
                  this.dataForm.successCount = data.loans.successCount
                  this.dataForm.orderNum = data.loans.orderNum
                  this.dataForm.description = data.loans.description
                  this.dataForm.status = data.loans.status + ''
                  this.dataForm.offCount = data.loans.offCount
                  this.dataForm.hotTag = data.loans.hotTag
                  // this.dataForm.changeoffCount = data.loans.offCount
                  this.companyName = data.loans.loanName
                  this.selectProduct.productName = data.loans.loanName

                  this.selectProduct.productId = data.loans.productId
                  this.selectTab.length = 0
                  data.loanTypeSecond.forEach((n) => {
                    var obj = {}
                    obj.typeId = n.typeId
                    obj.level = n.level
                    obj.typeName = n.typeName
                    obj.superTypeId = n.superTypeId
                    this.selectTab.push(obj)
                  })
                  var obj = {}
                  obj.name = data.loans.color
                  this.selectColor.length = 0

                  this.selectColor.push(obj)
                }
              })
            }
          })
        } else {
          this.dataForm = {
            loanId: '',
            loanName: '',
            loanIconUrl: '',
            linkUrl: '',
            color: '',
            minAmount: '',
            maxAmount: '',
            days: '',
            successRate: '',
            dayRate: '',
            successCount: 0,
            orderNum: '1',
            status: '0',
            offCount: 10000,
            hotTag: ''
          }
          this.selectProduct = {}
          this.companyName = ''
          this.selectColor.length = 0
          this.selectTab.length = 0
        }
      },
      getTabDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/loanproduct/type/list'),
          method: 'get'
        }).then((res) => {
          if (res.data.code != 0) {
            this.$message.error(res.data.msg)
          } else {
            this.tabDataList = res.data.data
          }
        })
      },

      // 上传之前
      beforeUploadHandle (file) {
        const isLt2M = file.size / 1024 / 1024 < 2

        if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
          this.$message.error('只支持jpg、png、gif格式的图片！')
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
          return false
        }

      },
      // 上传成功
      successHandle (response, file, fileList) {
        console.log(response)
        if (response.code == 0) {
          this.dataForm.loanIconUrl = response.url
          this.loanIconUrl = response.url
        } else {
          this.$message({
            message: '上传失败',
            type: 'earning',
            duration: 1500
          })
        }
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          console.log(this.dataForm.hotTag)
          var _this = this
          if (valid) {

            if (this.selectProduct != {}) {
              this.dataForm.loanName = this.selectProduct.productName
              this.dataForm.productId = this.selectProduct.productId
            } else {
              this.$message({
                message: '请选择公司',
                type: 'earning',
                duration: 1500
              })
              return false
            }
            var data = {}
            data.loans = this.dataForm
            if (this.selectTab.length > 0) {
              var arr = []
              this.selectTab.forEach((n) => {
                var obj = {}
                obj.typeId = n.typeId
                obj.level = n.level
                arr.push(obj)
              })
              data.loansTypeLevels = arr
            } else {
              this.$message({
                message: '请选择标签',
                type: 'earning',
                duration: 1500
              })
            }
            var arr2 = []
            var str = this.dataForm.hotTag
            if(this.dataForm.hotTag !=  ''){
              arr2 = str.split(',')
            } else {
              arr2 = []
            }

            var flag = true
            if(arr2.length == 0){
              this.$message({
                message: '热门标签个数不能为0',
                type: 'earning',
                duration: 1500
              })
              return false
            }
            if(arr2.length>2){
              this.$message({
                message: '热门标签个数不能超过2个',
                type: 'earning',
                duration: 1500
              })
              return false
            }
            for (var i = 0; i < arr2.length; i++) {
              if (arr2[i].length > 4) {
                this.$message({
                  message: '热门标签字数不能超过4个',
                  type: 'earning',
                  duration: 1500
                })
                flag = false
                break
              }
            }
            if (flag) {
              data.loans.hotTag = arr2
              data.loans.hotTag =  data.loans.hotTag.join(',')
            } else {
              return false
            }
            if (this.selectColor.length == 0) {
              this.$message({
                message: '颜色个数不能为0',
                type: 'earning',
                duration: 1500
              })
              return false
            }
            if (this.selectColor.length > arr2.length) {
              this.$message({
                message: '颜色个数不能超过热门标签个数',
                type: 'earning',
                duration: 1500
              })
              return false
            } else {
              data.loans.color=[]
              this.selectColor.forEach(function (n) {
                data.loans.color.push(n.name)
              })
              data.loans.color = data.loans.color.join(',')
              // this.dataForm.color = this.selectColor[0].name
            }
            console.log(data)
            this.$http({
              url: this.$http.adornUrl('/generation/loans/save'),
              method: 'post',
              data: this.$http.adornData(data)
            }).then(({data}) => {
              console.log(data)
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
<style>
  .el-collapse-item__header{
    height: 38px;
    line-height: 38px;
    border: none;
  }
  .el-collapse-item__wrap{
    margin-top: 3px;
    border: 1px solid #dcdfe6;
    width: 100%;
  }
  .el-collapse-item__content{
    padding: 10px;
  }
  .el-collapse-item__content::after{
    display: block;
    content: '';
    clear: both;
  }
  .tagDiv{
    padding: 5px 0 0 5px;
    width: 100px;
  }
  .tagDiv::after{
    display: block;
    content: '';
    clear: both;
  }
  .tagDiv span{
    float: left;
  }
  .el-collapse-item__content .tagcolor{
    display: inline-block;
    width: 20px;
    height: 20px;
  }
  .el-collapse-item__content .tagname{
    display: inline-block;
    line-height: 20px;
    height: 20px;
    color: #a3a3a4;
    margin-left: 5px;
    border-bottom: 1px solid #e6e6e8;
    cursor: pointer;
  }
  .tagDiv{
    float: left;
  }
  .colorCode .el-tag{
    color: #fff;
  }

  .colorBQ .el-tag{
    color: #409eff;
  }
  .tagList{
    /*width: 90%;*/
    position: absolute;
    top: 1px;
    left: 1px;
    min-height: 38px;
    background-color: white;
  }
  .el-tag--mini{
    margin-left: 5px;
    width: auto;
  }
  .tabWrap{
    border: 1px dashed #eeeeee;
    padding-top: 22px;
    padding-right: 20px;
    margin-bottom: 22px;
  }
  .el-input{
    width: auto;
    min-width: 90%;
    margin-right: 10px;
  }
</style>

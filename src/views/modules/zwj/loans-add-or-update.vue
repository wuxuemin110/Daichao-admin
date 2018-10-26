<template>
  <el-dialog
    :title="!dataForm.loanId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
      <el-form-item label="标题" prop="loanName">
        <el-input v-model="dataForm.loanName" maxlength="30" placeholder="标题"></el-input>
      </el-form-item>
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
      <el-form-item label="首页推荐" >
        <template>
          <el-radio v-model="dataForm.orderNum" label="1">是</el-radio>
          <el-radio v-model="dataForm.orderNum" label="0">否</el-radio>
        </template>
      </el-form-item>
      <el-form-item v-if="dataForm.orderNum==1" label="颜色编码" prop="color">
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
      <el-form-item label="最小金额" prop="minAmount">
          <el-input v-model="dataForm.minAmount" maxlength="30" placeholder="最小金额"></el-input>元
        </el-form-item>
      <el-form-item label="最大金额" prop="maxAmount">
          <el-input v-model="dataForm.maxAmount" maxlength="30" placeholder="最大金额"></el-input>元

        </el-form-item><el-form-item label="最小天数" prop="minDays">
          <el-input v-model="dataForm.minDays" maxlength="30" placeholder="最小天数"></el-input>天

        </el-form-item><el-form-item label="最大天数" prop="maxDays">
          <el-input v-model="dataForm.maxDays" maxlength="30" placeholder="最大天数"></el-input>天

        </el-form-item><el-form-item label="成功年化率" prop="successRate">
          <el-input v-model="dataForm.successRate" maxlength="30" placeholder="成功年化率"></el-input>%
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

      <el-form-item label="成功次数" prop="successCount">
          <el-input v-model="dataForm.successCount" maxlength="30" placeholder="成功次数"></el-input>
        </el-form-item>


      <el-form-item label="日年化率" prop="dayRate">
          <el-input v-model="dataForm.dayRate" maxlength="30" placeholder="日年化率"></el-input>%
        </el-form-item>


      <!--<el-form-item label="描述" prop="applyCondition">-->
          <!--<el-input v-model="dataForm.applyCondition" maxlength="30" placeholder="描述"></el-input>-->
        <!--</el-form-item>-->
      <!--<el-form-item label="描述2" prop="description">-->
          <!--<el-input v-model="dataForm.description" maxlength="30" placeholder="描述"></el-input>-->
        <!--</el-form-item>-->

      <!--<el-form-item label="申请条件" prop="applyMaterial">-->
          <!--<el-input v-model="dataForm.applyMaterial" maxlength="30" placeholder="申请条件"></el-input>-->
        <!--</el-form-item>-->

        <el-form-item label="跳转地址" prop="linkUrl">
          <el-input v-model="dataForm.linkUrl" maxlength="250" placeholder="跳转地址"></el-input>
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
        dataForm: {
          loanId: '',
          loanName: '',
          loanIconUrl: '',
          linkUrl: '',
          color: '',
          minAmount: '',
          maxAmount: '',
          minDays: '',
          maxDays: '',
          successRate: '',
          dayRate: '',
          successCount: 0,
          orderNum: '1'
        },
        dataRule: {
          loanName: [
            { required: true, message: '标题名称不能为空', trigger: 'blur' }
          ],
          loanIconUrl: [
            { required: true, message: '产品图标不能为空', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '跳转地址不能为空', trigger: 'blur' }
          ]
        },
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
        this.selectColor = []
        this.selectColor.push(item)
        Array.from(new Set(this.selectColor))
      },
      colorClose (tag) {
        this.selectColor.splice(this.selectColor.indexOf(tag), 1)
      },
      getTab (item, item2) {
        var obj = Object.assign({superTypeId: item2.typeId}, item)
        // for
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
                  this.dataForm.minDays = data.loans.minDays
                  this.dataForm.maxDays = data.loans.maxDays
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
            minDays: '',
            maxDays: '',
            successRate: '',
            dayRate: '',
            successCount: 0,
            orderNum: '1'
          }
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
        var _this = this
        return new Promise(function (resolve, reject) {
          var reader = new FileReader()
          reader.onload = function (event) {
            var image = new Image()
            image.onload = function () {
              var width = this.width
              var height = this.height
              if (width != 52 || height != 52) {
                _this.$alert('图片尺寸必须为750*300!', '提示', {confirmButtonText: '确定'})
                reject()
              }
              resolve()
            }
            image.src = event.target.result
          }
          reader.readAsDataURL(file)
        })
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
          console.log(this.dataForm)
          if (valid) {
            if (this.dataForm.orderNum == 1) {
              if(this.selectColor.length > 0){
                this.dataForm.color = this.selectColor[0].name
              } else {
                this.$message({
                  message: '请选择颜色',
                  type: 'earning',
                  duration: 1500
                })
                return false;
              }

            }else {
              this.dataForm.color = '#fff'
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

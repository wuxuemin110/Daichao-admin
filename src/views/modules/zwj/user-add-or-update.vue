<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户手机号码" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="用户手机号码"></el-input>
      </el-form-item>
      <el-form-item label="登陆密码" prop="password">
        <el-input v-model="dataForm.password" placeholder="登陆密码"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="realName">
        <el-input v-model="dataForm.realName" placeholder="用户姓名"></el-input>
      </el-form-item>
      <el-form-item label="用户身份证号码" prop="idCardNo">
        <el-input v-model="dataForm.idCardNo" placeholder="用户身份证号码"></el-input>
      </el-form-item>
      <el-form-item label="身份证正面照" prop="idCardFrontImageUrl">
        <el-input v-model="dataForm.idCardFrontImageUrl" placeholder="身份证正面照"></el-input>
      </el-form-item>
      <el-form-item label="身份证反面照" prop="idCardReverseImageUrl">
        <el-input v-model="dataForm.idCardReverseImageUrl" placeholder="身份证反面照"></el-input>
      </el-form-item>
      <el-form-item label="用户活体检测视频或照片" prop="idCardUserImageUrl">
        <el-input v-model="dataForm.idCardUserImageUrl" placeholder="用户活体检测视频或照片"></el-input>
      </el-form-item>
      <el-form-item label="用户所在省份" prop="province">
        <el-input v-model="dataForm.province" placeholder="用户所在省份"></el-input>
      </el-form-item>
      <el-form-item label="用户所在城市" prop="city">
        <el-input v-model="dataForm.city" placeholder="用户所在城市"></el-input>
      </el-form-item>
      <el-form-item label="用户所在区域" prop="region">
        <el-input v-model="dataForm.region" placeholder="用户所在区域"></el-input>
      </el-form-item>
      <el-form-item label="用户详细地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="用户详细地址"></el-input>
      </el-form-item>
      <el-form-item label="单位名称" prop="companyName">
        <el-input v-model="dataForm.companyName" placeholder="单位名称"></el-input>
      </el-form-item>
      <el-form-item label="单位电话" prop="companyPhone">
        <el-input v-model="dataForm.companyPhone" placeholder="单位电话"></el-input>
      </el-form-item>
      <el-form-item label="单位所在省份" prop="companyProvince">
        <el-input v-model="dataForm.companyProvince" placeholder="单位所在省份"></el-input>
      </el-form-item>
      <el-form-item label="单位所在城市" prop="companyCity">
        <el-input v-model="dataForm.companyCity" placeholder="单位所在城市"></el-input>
      </el-form-item>
      <el-form-item label="单位所在地区" prop="companyRegion">
        <el-input v-model="dataForm.companyRegion" placeholder="单位所在地区"></el-input>
      </el-form-item>
      <el-form-item label="单位详细地址" prop="companyAddress">
        <el-input v-model="dataForm.companyAddress" placeholder="单位详细地址"></el-input>
      </el-form-item>
      <el-form-item label="职业" prop="profession">
        <el-input v-model="dataForm.profession" placeholder="职业"></el-input>
      </el-form-item>
      <el-form-item label="岗位" prop="job">
        <el-input v-model="dataForm.job" placeholder="岗位"></el-input>
      </el-form-item>
      <el-form-item label="运营商服务密码" prop="serviceCode">
        <el-input v-model="dataForm.serviceCode" placeholder="运营商服务密码"></el-input>
      </el-form-item>
      <el-form-item label="头像地址" prop="picture">
        <el-input v-model="dataForm.picture" placeholder="头像地址"></el-input>
      </el-form-item>
      <el-form-item label="信用额度" prop="creditAmount">
        <el-input v-model="dataForm.creditAmount" placeholder="信用额度"></el-input>
      </el-form-item>
      <el-form-item label="设备来源，是安卓还是苹果" prop="deviceSource">
        <el-input v-model="dataForm.deviceSource" placeholder="设备来源，是安卓还是苹果"></el-input>
      </el-form-item>
      <el-form-item label="应用市场（下载途径）" prop="market">
        <el-input v-model="dataForm.market" placeholder="应用市场（下载途径）"></el-input>
      </el-form-item>
      <el-form-item label="请求的设备信息" prop="deviceInfo">
        <el-input v-model="dataForm.deviceInfo" placeholder="请求的设备信息"></el-input>
      </el-form-item>
      <el-form-item label="" prop="appName">
        <el-input v-model="dataForm.appName" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="app版本号" prop="appVersion">
        <el-input v-model="dataForm.appVersion" placeholder="app版本号"></el-input>
      </el-form-item>
      <el-form-item label="请求的ip地址" prop="ip">
        <el-input v-model="dataForm.ip" placeholder="请求的ip地址"></el-input>
      </el-form-item>
      <el-form-item label="流量渠道id" prop="channelId">
        <el-input v-model="dataForm.channelId" placeholder="流量渠道id"></el-input>
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input v-model="dataForm.longitude" placeholder="经度"></el-input>
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input v-model="dataForm.latitude" placeholder="纬度"></el-input>
      </el-form-item>
      <el-form-item label="用户状态。0-未获得额度；1-审核中；2-审核成功，获得信用额度；3-审核失败，15天后才能申请；4-贷款申请处理中，5-已贷款；6-已贷款逾期；7-还款中（用户已还款，等待后台审核）" prop="status">
        <el-input v-model="dataForm.status" placeholder="用户状态。0-未获得额度；1-审核中；2-审核成功，获得信用额度；3-审核失败，15天后才能申请；4-贷款申请处理中，5-已贷款；6-已贷款逾期；7-还款中（用户已还款，等待后台审核）"></el-input>
      </el-form-item>
      <el-form-item label="" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="modifyTime">
        <el-input v-model="dataForm.modifyTime" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="identityAuthTime">
        <el-input v-model="dataForm.identityAuthTime" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="userBaseInfoAuthTime">
        <el-input v-model="dataForm.userBaseInfoAuthTime" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="" prop="syncAssistAuthTime">
        <el-input v-model="dataForm.syncAssistAuthTime" placeholder=""></el-input>
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
          mobile: '',
          password: '',
          realName: '',
          idCardNo: '',
          idCardFrontImageUrl: '',
          idCardReverseImageUrl: '',
          idCardUserImageUrl: '',
          province: '',
          city: '',
          region: '',
          address: '',
          companyName: '',
          companyPhone: '',
          companyProvince: '',
          companyCity: '',
          companyRegion: '',
          companyAddress: '',
          profession: '',
          job: '',
          serviceCode: '',
          picture: '',
          creditAmount: '',
          deviceSource: '',
          market: '',
          deviceInfo: '',
          appName: '',
          appVersion: '',
          ip: '',
          channelId: '',
          longitude: '',
          latitude: '',
          status: '',
          createTime: '',
          modifyTime: '',
          identityAuthTime: '',
          userBaseInfoAuthTime: '',
          syncAssistAuthTime: ''
        },
        dataRule: {
          mobile: [
            { required: true, message: '用户手机号码不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '登陆密码不能为空', trigger: 'blur' }
          ],
          realName: [
            { required: true, message: '用户姓名不能为空', trigger: 'blur' }
          ],
          idCardNo: [
            { required: true, message: '用户身份证号码不能为空', trigger: 'blur' }
          ],
          idCardFrontImageUrl: [
            { required: true, message: '身份证正面照不能为空', trigger: 'blur' }
          ],
          idCardReverseImageUrl: [
            { required: true, message: '身份证反面照不能为空', trigger: 'blur' }
          ],
          idCardUserImageUrl: [
            { required: true, message: '用户活体检测视频或照片不能为空', trigger: 'blur' }
          ],
          province: [
            { required: true, message: '用户所在省份不能为空', trigger: 'blur' }
          ],
          city: [
            { required: true, message: '用户所在城市不能为空', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '用户所在区域不能为空', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '用户详细地址不能为空', trigger: 'blur' }
          ],
          companyName: [
            { required: true, message: '单位名称不能为空', trigger: 'blur' }
          ],
          companyPhone: [
            { required: true, message: '单位电话不能为空', trigger: 'blur' }
          ],
          companyProvince: [
            { required: true, message: '单位所在省份不能为空', trigger: 'blur' }
          ],
          companyCity: [
            { required: true, message: '单位所在城市不能为空', trigger: 'blur' }
          ],
          companyRegion: [
            { required: true, message: '单位所在地区不能为空', trigger: 'blur' }
          ],
          companyAddress: [
            { required: true, message: '单位详细地址不能为空', trigger: 'blur' }
          ],
          profession: [
            { required: true, message: '职业不能为空', trigger: 'blur' }
          ],
          job: [
            { required: true, message: '岗位不能为空', trigger: 'blur' }
          ],
          serviceCode: [
            { required: true, message: '运营商服务密码不能为空', trigger: 'blur' }
          ],
          picture: [
            { required: true, message: '头像地址不能为空', trigger: 'blur' }
          ],
          creditAmount: [
            { required: true, message: '信用额度不能为空', trigger: 'blur' }
          ],
          deviceSource: [
            { required: true, message: '设备来源，是安卓还是苹果不能为空', trigger: 'blur' }
          ],
          market: [
            { required: true, message: '应用市场（下载途径）不能为空', trigger: 'blur' }
          ],
          deviceInfo: [
            { required: true, message: '请求的设备信息不能为空', trigger: 'blur' }
          ],
          appName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          appVersion: [
            { required: true, message: 'app版本号不能为空', trigger: 'blur' }
          ],
          ip: [
            { required: true, message: '请求的ip地址不能为空', trigger: 'blur' }
          ],
          channelId: [
            { required: true, message: '流量渠道id不能为空', trigger: 'blur' }
          ],
          longitude: [
            { required: true, message: '经度不能为空', trigger: 'blur' }
          ],
          latitude: [
            { required: true, message: '纬度不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '用户状态。0-未获得额度；1-审核中；2-审核成功，获得信用额度；3-审核失败，15天后才能申请；4-贷款申请处理中，5-已贷款；6-已贷款逾期；7-还款中（用户已还款，等待后台审核）不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          modifyTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          identityAuthTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          userBaseInfoAuthTime: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          syncAssistAuthTime: [
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
              url: this.$http.adornUrl(`/sys/appuser/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.mobile = data.user.mobile
                this.dataForm.password = data.user.password
                this.dataForm.realName = data.user.realName
                this.dataForm.idCardNo = data.user.idCardNo
                this.dataForm.idCardFrontImageUrl = data.user.idCardFrontImageUrl
                this.dataForm.idCardReverseImageUrl = data.user.idCardReverseImageUrl
                this.dataForm.idCardUserImageUrl = data.user.idCardUserImageUrl
                this.dataForm.province = data.user.province
                this.dataForm.city = data.user.city
                this.dataForm.region = data.user.region
                this.dataForm.address = data.user.address
                this.dataForm.companyName = data.user.companyName
                this.dataForm.companyPhone = data.user.companyPhone
                this.dataForm.companyProvince = data.user.companyProvince
                this.dataForm.companyCity = data.user.companyCity
                this.dataForm.companyRegion = data.user.companyRegion
                this.dataForm.companyAddress = data.user.companyAddress
                this.dataForm.profession = data.user.profession
                this.dataForm.job = data.user.job
                this.dataForm.serviceCode = data.user.serviceCode
                this.dataForm.picture = data.user.picture
                this.dataForm.creditAmount = data.user.creditAmount
                this.dataForm.deviceSource = data.user.deviceSource
                this.dataForm.market = data.user.market
                this.dataForm.deviceInfo = data.user.deviceInfo
                this.dataForm.appName = data.user.appName
                this.dataForm.appVersion = data.user.appVersion
                this.dataForm.ip = data.user.ip
                this.dataForm.channelId = data.user.channelId
                this.dataForm.longitude = data.user.longitude
                this.dataForm.latitude = data.user.latitude
                this.dataForm.status = data.user.status
                this.dataForm.createTime = data.user.createTime
                this.dataForm.modifyTime = data.user.modifyTime
                this.dataForm.identityAuthTime = data.user.identityAuthTime
                this.dataForm.userBaseInfoAuthTime = data.user.userBaseInfoAuthTime
                this.dataForm.syncAssistAuthTime = data.user.syncAssistAuthTime
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
              url: this.$http.adornUrl(`/sys/appuser/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'mobile': this.dataForm.mobile,
                'password': this.dataForm.password,
                'realName': this.dataForm.realName,
                'idCardNo': this.dataForm.idCardNo,
                'idCardFrontImageUrl': this.dataForm.idCardFrontImageUrl,
                'idCardReverseImageUrl': this.dataForm.idCardReverseImageUrl,
                'idCardUserImageUrl': this.dataForm.idCardUserImageUrl,
                'province': this.dataForm.province,
                'city': this.dataForm.city,
                'region': this.dataForm.region,
                'address': this.dataForm.address,
                'companyName': this.dataForm.companyName,
                'companyPhone': this.dataForm.companyPhone,
                'companyProvince': this.dataForm.companyProvince,
                'companyCity': this.dataForm.companyCity,
                'companyRegion': this.dataForm.companyRegion,
                'companyAddress': this.dataForm.companyAddress,
                'profession': this.dataForm.profession,
                'job': this.dataForm.job,
                'serviceCode': this.dataForm.serviceCode,
                'picture': this.dataForm.picture,
                'creditAmount': this.dataForm.creditAmount,
                'deviceSource': this.dataForm.deviceSource,
                'market': this.dataForm.market,
                'deviceInfo': this.dataForm.deviceInfo,
                'appName': this.dataForm.appName,
                'appVersion': this.dataForm.appVersion,
                'ip': this.dataForm.ip,
                'channelId': this.dataForm.channelId,
                'longitude': this.dataForm.longitude,
                'latitude': this.dataForm.latitude,
                'status': this.dataForm.status,
                'createTime': this.dataForm.createTime,
                'modifyTime': this.dataForm.modifyTime,
                'identityAuthTime': this.dataForm.identityAuthTime,
                'userBaseInfoAuthTime': this.dataForm.userBaseInfoAuthTime,
                'syncAssistAuthTime': this.dataForm.syncAssistAuthTime
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

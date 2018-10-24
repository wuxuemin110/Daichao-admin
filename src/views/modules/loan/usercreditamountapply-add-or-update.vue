<template>
  <el-dialog title="申请详情" width="80%" top="5px" :close-on-click-modal="false" :visible.sync="visible" @close="closeDialog">
    <span slot="title">
      申请详情&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-select v-model="applyStatus" placeholder="请选择状态" size="small" style="width: 120px;">
        <el-option
          v-for="item in applyStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button style="padding: 6px 20px;" type="primary" @click="applyHandle">处 理</el-button>
    </span>
    <el-dialog
      width="50%"
      title="图片"
      :visible.sync="isShowImgDialog"
      append-to-body>
      <img :src="showImgSrc" alt="" style="width: 100%;height: 100%;">
    </el-dialog>
    <el-tabs v-model="currentTab" type="border-card" @tab-click="tabHandleClick" style="margin-top: -30px;">
      <el-tab-pane label="基本信息" name="1">
        <span style="font-size: 16px;font-weight: bold;">基本信息</span>
        <el-form :model="userBaseInfo" ref="userBaseInfo" :inline="true" disabled label-width="100px">
          <el-form-item label="客户名称">
            <el-input v-model="userBaseInfo.realName"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="userBaseInfo.idCardNo"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="userBaseInfo.mobile"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-input v-model="userExtra.idGender"></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="userExtra.idAge"></el-input>
          </el-form-item>
          <el-form-item label="身份证归属地">
            <el-input v-model="userExtra.idCardAddress"></el-input>
          </el-form-item>
          <el-form-item label="手机归属地">
            <el-input v-model="userExtra.mobileAddress"></el-input>
          </el-form-item>
          <el-form-item label="住址">
            <el-input v-model="userBaseInfo.address" style="width: 480px;"></el-input>
          </el-form-item>
          <!-- <el-form-item label="GPS定位">
            <el-input v-model="userBaseInfo.name"></el-input>
          </el-form-item> -->
        </el-form>
        
        <div style="margin-left: 10px;">
          <span>该用户身份证曾经有过借贷记录：0 ；<a style="color: blue;">逾期次数：0 ；提前还款次数：0 </a> </span><br/>
          <span>该用户手机曾做为黑名单用户<a style="color: blue;">XXX</a>、用户<a style="color: blue;">XXX</a>的紧急联系人/频繁通话对象</span>
        </div>
        
        <div style="margin-top: 30px;"><span style="font-size: 16px;font-weight: bold;">身份证照片</span></div>
        <el-table
          :data="identityAuthList"
          border
          ref="identityAuthList"
          style="width: 100%;">
          <el-table-column
            prop="idCardFrontImageUrl"
            header-align="center"
            align="center"
            label="正面">
            <template slot-scope="scope">
              <img :src="scope.row.idCardFrontImageUrl" @click="showImgDialog(scope.row.idCardFrontImageUrl)" alt="" style="width: 50px;height: 50px">
            </template>
          </el-table-column>
          <el-table-column
            prop="idCardReverseImageUrl"
            header-align="center"
            align="center"
            label="反面">
            <template slot-scope="scope">
              <img :src="scope.row.idCardReverseImageUrl" @click="showImgDialog(scope.row.idCardReverseImageUrl)" alt="" style="width: 50px;height: 50px">
            </template>
          </el-table-column>
          <el-table-column
            prop="idCardUserImageUrl"
            header-align="center"
            align="center"
            label="活体识别">
            <template slot-scope="scope">
              <img :src="scope.row.idCardUserImageUrl" @click="showImgDialog(scope.row.idCardUserImageUrl)" alt="" style="width: 50px;height: 50px">
            </template>
          </el-table-column>
          <el-table-column
            prop="identityAuthTime"
            header-align="center"
            align="center"
            :formatter="dateFormat"
            label="添加时间">
          </el-table-column>
        </el-table>

        <div style="margin-top: 30px;"><span style="font-size: 16px;font-weight: bold;">职业信息</span></div>
        <el-table
          :data="companyList"
          ref="companyList"
          border
          style="width: 100%;">
          <el-table-column
            prop="companyName"
            header-align="center"
            align="center"
            label="公司名称">
          </el-table-column>
          <el-table-column
            prop="profession"
            header-align="center"
            align="center"
            label="行业">
          </el-table-column>
          <el-table-column
            prop="job"
            header-align="center"
            align="center"
            label="岗位">
          </el-table-column>
          <el-table-column
            prop="companyPhone"
            header-align="center"
            align="center"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="companyAddress"
            header-align="center"
            align="center"
            label="公司地址">
          </el-table-column>
          <!-- <el-table-column
            prop="companyGps"
            header-align="center"
            align="center"
            label="GPS定位">
          </el-table-column> -->
        </el-table>

        <div style="margin-top: 40px;">
          <span style="font-size: 16px;font-weight: bold;">同盾信息</span>
          <hr style="border: 0.5px solid #ebeef5;" />
          <div v-if="tongdunInfo !== undefined">
            <span v-if="tongdunInfo.finalDecision == 'REJECT'"><span style="font-size: 20px;color: red;">建议拒绝（{{tongdunInfo.finalScore}}）</span></span>
            <span v-if="tongdunInfo.finalDecision == 'REVIEW'"><span style="font-size: 20px;color: orange;">建议审核（{{tongdunInfo.finalScore}}）</span></span>
            <span v-if="tongdunInfo.finalDecision == 'PASS'"><span style="font-size: 20px;color: green;">建议通过（{{tongdunInfo.finalScore}}）</span></span>
            <a @click="openTongdunReport()">查看报告</a>
          </div>
          <div v-else>
            <span>暂无数据</span>
          </div>
        </div>

        <div style="margin-top: 40px;">
          <span style="font-size: 16px;font-weight: bold;">白骑士信息</span>
          <hr style="border: 0.5px solid #ebeef5;" />
          <div v-if="baiqishiRiskDecisionInfo !== undefined">
            <span v-if="baiqishiRiskDecisionInfo.finalDecision == 'Reject'"><span style="font-size: 20px;color: red;">建议拒绝（{{baiqishiRiskDecisionInfo.finalScore}}）</span></span>
            <span v-if="baiqishiRiskDecisionInfo.finalDecision == 'Review'"><span style="font-size: 20px;color: orange;">建议审核（{{baiqishiRiskDecisionInfo.finalScore}}）</span></span>
            <span v-if="baiqishiRiskDecisionInfo.finalDecision == 'Accept'"><span style="font-size: 20px;color: green;">建议通过（{{baiqishiRiskDecisionInfo.finalScore}}）</span></span>

            <el-table
              :data="baiqishiStrategySet"
              ref="baiqishiStrategySet"
              :row-key="getBaiqishiStrategySetRowKeys"
              :expand-row-keys="baiqishiStrategySetExpands"
              :row-class-name="setBaiqishiStrategyTableColor"
              border
              style="width: 100%;margin-top: 20px;">
              <el-table-column 
                type="expand">
                <template slot-scope="props">
                  <el-table
                    :data="props.row.hitRules"
                    ref="baiqishiStrategySet"
                    :row-class-name="setBaiqishiTableColor"
                    border
                    style="width: 100%;">
                    <el-table-column
                      prop="ruleName"
                      header-align="center"
                      align="center"
                      label="规则名称">
                    </el-table-column>
                    <el-table-column
                      prop="score"
                      header-align="center"
                      align="center"
                      width="150"
                      label="风险系数">
                    </el-table-column>
                    <el-table-column
                      prop="decision"
                      header-align="center"
                      align="center"
                      width="150"
                      label="决策结果">
                    </el-table-column>
                    <el-table-column
                      prop="memo"
                      header-align="center"
                      align="center"
                      label="击中信息备注">
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column
                prop="strategyName"
                header-align="center"
                align="center"
                label="策略名称">
              </el-table-column>
              <el-table-column
                prop="strategyMode"
                header-align="center"
                align="center"
                width="180"
                label="匹配模式">
                <template slot-scope="scope">
                  <span v-if="scope.row.strategyMode === 'FirstMode'">首次匹配</span>
                  <span v-if="scope.row.strategyMode === 'WorstMode'">最坏匹配</span>
                  <span v-if="scope.row.strategyMode === 'WeightMode'">权重匹配</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="strategyScore"
                header-align="center"
                align="center"
                width="180"
                label="风险系数">
              </el-table-column>
              <el-table-column
                prop="riskType"
                header-align="center"
                align="center"
                label="风险类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.riskType === 'botAction'">机器行为</span>
                  <span v-if="scope.row.riskType === 'fakeRegister'">伪冒申请</span>
                  <span v-if="scope.row.riskType === 'dynamicCode'">动码攻击</span>
                  <span v-if="scope.row.riskType === 'suspiciousAction'">异常行为</span>
                  <span v-if="scope.row.riskType === 'bruteForce'">暴力破解</span>
                  <span v-if="scope.row.riskType === 'userFraud'">本人欺诈</span>
                  <span v-if="scope.row.riskType === 'accountTakeover'">账户盗用</span>
                  <span v-if="scope.row.riskType === 'garbageRegister'">垃圾注册</span>
                  <span v-if="scope.row.riskType === 'creditRisk'">失信风险</span>
                  <span v-if="scope.row.riskType === 'agencyCash'">中介套现</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="tips"
                header-align="center"
                align="center"
                label="击中话术提示">
              </el-table-column>
            </el-table>
          </div>
          <div v-else>
            <span>暂无数据</span>
          </div>
        </div>

        <div style="margin-top: 40px;"><span style="font-size: 16px;font-weight: bold;">社会关系</span></div>
        <el-table
          :data="emergencyContacts"
          border
          style="width: 100%;">
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="typeName"
            header-align="center"
            align="center"
            label="与客户关系">
          </el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="belongTo"
            header-align="center"
            align="center"
            label="号码归属地">
          </el-table-column>
          <el-table-column
            prop="tag"
            header-align="center"
            align="center"
            label="通讯录标签">
          </el-table-column>
          <el-table-column
            prop="earliestTime"
            header-align="center"
            align="center"
            :formatter="dateFormat"
            label="最早联系时间">
          </el-table-column>
          <el-table-column
            prop="newestTime"
            header-align="center"
            align="center"
            :formatter="dateFormat"
            label="最近联系时间">
          </el-table-column>
          <el-table-column
            prop="last7daysConnectCount"
            header-align="center"
            align="center"
            label="近7天通话次数">
            <template slot-scope="scope">
              <span v-if="scope.row.last7daysConnectCount === 0" style="color: red;">{{scope.row.last7daysConnectCount}}</span>
              <span v-else>{{scope.row.last7daysConnectCount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="last1monthConnectCount"
            header-align="center"
            align="center"
            label="近一个月通话次数">
            <template slot-scope="scope">
              <span v-if="scope.row.last1monthConnectCount === 0" style="color: red;">{{scope.row.last1monthConnectCount}}</span>
              <span v-else>{{scope.row.last1monthConnectCount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="last3monthConnectCount"
            header-align="center"
            align="center"
            label="近三个月通话次数">
            <template slot-scope="scope">
              <span v-if="scope.row.last3monthConnectCount === 0" style="color: red;">{{scope.row.last3monthConnectCount}}</span>
              <span v-else>{{scope.row.last3monthConnectCount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="originatingCallCount"
            header-align="center"
            align="center"
            label="主叫次数">
            <template slot-scope="scope">
              <span v-if="scope.row.originatingCallCount === 0" style="color: red;">{{scope.row.originatingCallCount}}</span>
              <span v-else>{{scope.row.originatingCallCount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="terminatingCallCount"
            header-align="center"
            align="center"
            label="被叫次数">
            <template slot-scope="scope">
              <span v-if="scope.row.terminatingCallCount === 0" style="color: red;">{{scope.row.terminatingCallCount}}</span>
              <span v-else>{{scope.row.terminatingCallCount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="morningConnectCount"
            header-align="center"
            align="center"
            label="上午联系">
            <template slot-scope="scope">
              <span v-if="scope.row.morningConnectCount === 0" style="color: red;">{{scope.row.morningConnectCount}}</span>
              <span v-else>{{scope.row.morningConnectCount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="afternoonConnectCount"
            header-align="center"
            align="center"
            label="下午联系">
            <template slot-scope="scope">
              <span v-if="scope.row.afternoonConnectCount === 0" style="color: red;">{{scope.row.afternoonConnectCount}}</span>
              <span v-else>{{scope.row.afternoonConnectCount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="nightConnectCount"
            header-align="center"
            align="center"
            label="晚上联系">
            <template slot-scope="scope">
              <span v-if="scope.row.nightConnectCount === 0" style="color: red;">{{scope.row.nightConnectCount}}</span>
              <span v-else>{{scope.row.nightConnectCount}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="earlyMorningConnectCount"
            header-align="center"
            align="center"
            label="凌晨联系">
            <template slot-scope="scope">
              <span v-if="scope.row.earlyMorningConnectCount === 0" style="color: red;">{{scope.row.earlyMorningConnectCount}}</span>
              <span v-else>{{scope.row.earlyMorningConnectCount}}</span>
            </template>
          </el-table-column>
        </el-table>
        
        <div style="margin-top: 30px;"><span style="font-size: 16px;font-weight: bold;">注册信息</span></div>
        <el-form :model="userBaseInfo" :inline="true" disabled label-width="100px">
          <el-form-item label="注册时间">
            <el-input v-model="userBaseInfo.createTime"></el-input>
          </el-form-item>
          <el-form-item label="完件时间">
            <el-input v-model="userBaseInfo.syncAssistAuthTime"></el-input>
          </el-form-item>
          <el-form-item label="APP版本">
            <el-input v-model="userBaseInfo.appVersion"></el-input>
          </el-form-item>
          <el-form-item label="APP名字">
            <el-input v-model="userBaseInfo.appName"></el-input>
          </el-form-item>
          <el-form-item label="下载途径">
            <el-input v-model="userBaseInfo.market"></el-input>
          </el-form-item>
          <el-form-item label="申请渠道">
            <el-input v-model="userBaseInfo.channelName"></el-input>
          </el-form-item>
        </el-form>
          

      </el-tab-pane>
      <el-tab-pane label="运营商信息" name="2">
        <component is="YunYingshang" ref="yunYingshang"></component>
      </el-tab-pane>
      <el-tab-pane name="3">
        <span slot="label">
          通讯录信息（
          <b v-if="phonebookCount < 51" style="color: red;">联系人≤ 50</b>
          <b v-else>{{phonebookCount}}</b>
          ）
        </span>
        <keep-alive>
          <component is="Phonebook" ref="phonebook"></component>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="短信信息" name="4">
        <keep-alive>
          <component is="UserSms" ref="userSms"></component>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="用户手机APP安装情况" name="5">
        <keep-alive>
          <component is="AppInstalled" ref="appInstalled"></component>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="6">
        <keep-alive>
          <component is="ApplyProcess" ref="applyProcess"></component>
        </keep-alive>  
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<style>
  .el-table .error-row {
    color: red;
  }
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
<script>
  import YunYingshang from './yunyingshang'
  import Phonebook from './userphonebook'
  import UserSms from './usersms'
  import AppInstalled from './userappinstalled'
  import ApplyProcess from './usercreditamountapplyprocess'
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        visible: false,
        isShowImgDialog: false,
        showImgSrc: '',
        currentTab: '1',
        userId: 0,
        applyId: 0,
        applyStatus: 0,   // 处理状态
        applyStatusInit: 0,   // 原来的状态
        userBaseInfo: {},     // 用户基本信息
        userExtra: {},        // 用户附加信息
        identityAuthList: [],   // 身份认证信息
        companyList: [],    // 职业信息
        tongdunInfo: {},    // 同盾报告
        baiqishiFingerInfo: {},         // 白骑士设备指纹结果
        baiqishiRiskDecisionInfo: {},   // 白骑士风险决策结果
        baiqishiStrategySet: [],        // 白骑士命中策略集明细
        emergencyContacts: [],      // 社会关系
        baiqishiStrategySetExpands: [],   // 白骑士命中策略集默认展开行
        phonebookCount: 0,  // 通讯录总数
        applyStatusList: [
          {
            value: 0,
            label: '待审核'
          },
          {
            value: 1,
            label: '取消'
          },
          {
            value: 2,
            label: '审核中'
          },
          {
            value: 3,
            label: '通过'
          },
          {
            value: 4,
            label: '拒绝'
          },
          {
            value: 5,
            label: '机审通过'
          },
          {
            value: 6,
            label: '机审拒绝'
          }
        ],
        dataList: [],
        dataRule: {
          userId: [
            { required: true, message: '用户id不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      YunYingshang,
      Phonebook,
      UserSms,
      ApplyProcess,
      AppInstalled
    },
    methods: {
      getBaiqishiStrategySetRowKeys (row) {
        return row.strategyId
      },
      setBaiqishiTableColor ({row, rowIndex}) {
        if (row.decision === 'Review') {
          return 'warning-row'
        } else if (row.decision === 'Reject') {
          return 'error-row'
        }
        return ''
      },
      setBaiqishiStrategyTableColor ({row, rowIndex}) {
        return 'success-row'
      },
      tabHandleClick (tab, event) {
        if (this.currentTab === '2') {
          this.$refs.yunYingshang.init(this.userId)
        } else if (this.currentTab === '3') {
          this.$refs.phonebook.init(this.userId)
        } else if (this.currentTab === '4') {
          this.$refs.userSms.init(this.userId)
        } else if (this.currentTab === '5') {
          this.$refs.appInstalled.init(this.userId)
        } else if (this.currentTab === '6') {
          this.$refs.applyProcess.init(this.applyId)
        }
      },
      // 详情关闭处理
      closeDialog () {
        this.currentTab = '1'
        this.visible = false
        this.$refs.yunYingshang.clear()
        this.$refs.phonebook.clear()
        this.$refs.userSms.clear()
        this.$refs.appInstalled.clear()
        this.$refs.applyProcess.clear()
        this.$emit('refreshDataList')
      },
      showImgDialog (imgsrc) {
        this.isShowImgDialog = true
        this.showImgSrc = imgsrc
      },
      dateFormat (row, column) {
        var date = row[column.property]
        if (date === undefined || date == null) {
          return ''
        }
        return formatDate(new Date(date), 'yyyy-MM-dd hh:mm:ss')
      },
      certificateNoParse (certificateNo) {
        var pat = /^\d{6}(((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}([0-9]|x|X))|(\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}))$/
        if (!pat.test(certificateNo)) {
          return null
        }
        var parseInner = function (certificateNo, idxSexStart, birthYearSpan) {
          var res = {}
          var idxSex = 1 - certificateNo.substr(idxSexStart, 1) % 2
          res.sex = idxSex === '1' ? '女' : '男'

          var year = (birthYearSpan === 2 ? '19' : '') + certificateNo.substr(6, birthYearSpan)
          var month = certificateNo.substr(6 + birthYearSpan, 2)
          var day = certificateNo.substr(8 + birthYearSpan, 2)
          res.birthday = year + '-' + month + '-' + day
          var d = new Date()
          var monthFloor = ((d.getMonth() + 1) < parseInt(month, 10)) || ((d.getMonth() + 1) === parseInt(month, 10) && d.getDate() < parseInt(day, 10)) ? 1 : 0
          res.age = d.getFullYear() - parseInt(year, 10) - monthFloor
          return res
        }
        return parseInner(certificateNo, certificateNo.length === 15 ? 14 : 16, certificateNo.length === 15 ? 2 : 4)
      },
      init (userId, applyId, applyStatus) {
        this.userId = userId || 0
        this.applyId = applyId || 0
        this.applyStatus = applyStatus || 0
        this.applyStatusInit = applyStatus || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['userBaseInfo'].resetFields()
          this.userBaseInfo = {}
          this.userExtra = {}
          this.identityAuthList = []
          this.companyList = []
          this.tongdunInfo = {}
          this.phonebookCount = 0
          if (this.userId || this.applyId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/appuser/info/${this.userId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.userBaseInfo = data.user
                if (this.userBaseInfo !== undefined && this.userBaseInfo != null) {
                  if (this.userBaseInfo.userExtra !== undefined && this.userBaseInfo.userExtra != null) {
                    this.userExtra = this.userBaseInfo.userExtra
                  }
                  var address = ''
                  if (this.userBaseInfo.province !== undefined && this.userBaseInfo.province != null) {
                    address = address + this.userBaseInfo.province
                  }
                  if (this.userBaseInfo.city !== undefined && this.userBaseInfo.city != null) {
                    address = address + this.userBaseInfo.city
                  }
                  if (this.userBaseInfo.region !== undefined && this.userBaseInfo.region != null) {
                    address = address + this.userBaseInfo.province
                  }
                  if (this.userBaseInfo.address !== undefined && this.userBaseInfo.address != null) {
                    address = address + this.userBaseInfo.address
                  }
                  this.userBaseInfo.address = address

                  if (this.userBaseInfo.createTime !== undefined && this.userBaseInfo.createTime != null) {
                    this.userBaseInfo.createTime = formatDate(new Date(this.userBaseInfo.createTime), 'yyyy-MM-dd hh:mm:ss')
                  }
                  if (this.userBaseInfo.modifyTime !== undefined && this.userBaseInfo.modifyTime != null) {
                    this.userBaseInfo.modifyTime = formatDate(new Date(this.userBaseInfo.modifyTime), 'yyyy-MM-dd hh:mm:ss')
                  }
                  if (this.userBaseInfo.syncAssistAuthTime !== undefined && this.userBaseInfo.syncAssistAuthTime != null) {
                    this.userBaseInfo.syncAssistAuthTime = formatDate(new Date(this.userBaseInfo.syncAssistAuthTime), 'yyyy-MM-dd hh:mm:ss')
                  }

                  if (this.userBaseInfo.identityAuthTime !== undefined) {
                    var identityAuth = {
                      'idCardFrontImageUrl': this.userBaseInfo.idCardFrontImageUrl,
                      'idCardReverseImageUrl': this.userBaseInfo.idCardReverseImageUrl,
                      'idCardUserImageUrl': this.userBaseInfo.idCardUserImageUrl,
                      'identityAuthTime': this.userBaseInfo.identityAuthTime
                    }
                    this.identityAuthList.push(identityAuth)
                  }

                  if (this.userBaseInfo.companyName !== undefined) {
                    var company = {
                      'companyName': this.userBaseInfo.companyName,
                      'profession': this.userBaseInfo.profession,
                      'job': this.userBaseInfo.job,
                      'companyPhone': this.userBaseInfo.companyPhone,
                      'companyAddress': (this.userBaseInfo.companyCity !== undefined ? this.userBaseInfo.companyCity : '') + (this.userBaseInfo.companyRegion !== undefined ? this.userBaseInfo.companyRegion : '') + (this.userBaseInfo.companyAddress !== undefined ? this.userBaseInfo.companyAddress : ''),
                      'companyGps': this.userBaseInfo.companyGps
                    }
                    this.companyList.push(company)
                  }
                }
              }
            })
            this.getPhonebookCount()
            this.getTongdunReport()
            // this.getBaiqishiFingerReport()
            this.getBaiqishiRiskDecisionReport()
            this.getEmergencyContacts()
          }
        })
      },
      getPhonebookCount () {
        this.phonebookCount = 0
        this.$http({
          url: this.$http.adornUrl(`/sys/userphonebook/count/${this.userId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.phonebookCount = data.count
          }
        })
      },
      getTongdunReport () {
        this.tongdunInfo = {}
        this.$http({
          url: this.$http.adornUrl(`/sys/tongdunloan/info/${this.userId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tongdunInfo = data.tongdunLoan
          }
        })
      },
      openTongdunReport () {
        if (this.tongdunInfo === undefined || this.tongdunInfo.reportJson === undefined) {
          return
        }
        var reports = []
        var reportJsonData = JSON.parse(this.tongdunInfo.reportJson)
        reports.push(reportJsonData)
        var popupwin = window.open('/static/plugins/tongdun/tdreport.html')
        // onload只能执行一次，也就是如果子窗口有onload事件，可能会覆盖。
        popupwin.onload = function (e) {
          popupwin.postMessage(reports, 'http://' + window.location.host)
        }
        popupwin.onunload = function (e) {
          // 监听卸载
        }
      },
      // 获取白骑士设备指纹结果
      getBaiqishiFingerReport () {
        this.baiqishiFingerInfo = {}
        this.$http({
          url: this.$http.adornUrl(`/sys/baiqishi/fingerInfo/${this.userId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === 0) {
            this.baiqishiFingerInfo = data.fingerInfo
          }
        })
      },
      // 获取白骑士风险决策结果
      getBaiqishiRiskDecisionReport () {
        this.baiqishiRiskDecisionInfo = {}
        this.$http({
          url: this.$http.adornUrl(`/sys/baiqishi/riskDecisionInfo/${this.userId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.baiqishiRiskDecisionInfo = data.riskDecisionInfo
            if (this.baiqishiRiskDecisionInfo !== undefined && this.baiqishiRiskDecisionInfo != null) {
              if (this.baiqishiRiskDecisionInfo.loanInfos !== undefined && this.baiqishiRiskDecisionInfo.loanInfos != null) {
                this.baiqishiStrategySet = JSON.parse(this.baiqishiRiskDecisionInfo.loanInfos)
                if (this.baiqishiStrategySet !== undefined && this.baiqishiStrategySet.length > 0) {
                  for (var i = this.baiqishiStrategySet.length - 1; i >= 0; i--) {
                    this.baiqishiStrategySetExpands.push(this.baiqishiStrategySet[i].strategyId)
                  }
                }
              }
            }
          }
        })
      },
      // 紧急联系人列表，包含运营商部分信息
      getEmergencyContacts () {
        this.emergencyContacts = []
        this.$http({
          url: this.$http.adornUrl(`/sys/useremergencycontact/emergencyContacts/${this.userId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.emergencyContacts !== undefined && data.emergencyContacts != null) {
              this.emergencyContacts = data.emergencyContacts
            }
          }
        })
      },
      // 申请处理
      applyHandle () {
        if (this.applyId) {
          if (this.applyStatus === this.applyStatusInit) {
            return
          }
          this.$confirm(`确定修改状态为[${this.applyStatusList[this.applyStatus].label}]?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl(`/sys/usercreditamountapply/handle`),
              method: 'post',
              data: this.$http.adornData({
                'applyId': this.applyId,
                'applyStatus': this.applyStatus
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.applyStatusInit = this.applyStatus
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          })
        }
      }
    }
  }
</script>

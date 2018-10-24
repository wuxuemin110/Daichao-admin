<template>
  <div class="mod-config">
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="appName"
        header-align="center"
        align="center"
        label="APP名称">
      </el-table-column>
      <el-table-column
        prop="appPackage"
        header-align="center"
        align="center"
        label="APP包名">
      </el-table-column>
      <el-table-column
        prop="uniqueKey"
        header-align="center"
        align="center"
        label="APP标识">
      </el-table-column>
      <el-table-column
        prop="deviceType"
        header-align="center"
        align="center"
        label="设备类型">
        <template slot-scope="scope">
          <span v-if="scope.row.deviceType === 1">Android</span>
          <span v-if="scope.row.deviceType === 2">IOS</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        :formatter="dateFormat"
        label="查询时间">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  import { formatDate } from '@/utils/format'
  export default {
    data () {
      return {
        userId: 0,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        apps: [{'id': 'ezloan', 'name': '2345贷款王'},
          {'id': 'qihooloan', 'name': '360借条'},
          {'id': 'aishangjie', 'name': '51返呗-极速贷'},
          {'id': 'jijiaban', 'name': '安心记加班'},
          {'id': 'en51jd', 'name': '51即刻有'},
          {'id': 'en51cc', 'name': '51信用卡'},
          {'id': 'uppayback', 'name': '无忧借条'},
          {'id': 'com.renrenxin.jjd', 'name': '今借到'},
          {'id': 'Gouhua', 'name': '海尔够花'},
          {'id': 'en51lyq', 'name': '51零用钱'},
          {'id': 'en51rpd', 'name': '51人品贷'},
          {'id': 'ssd', 'name': '51闪电贷'},
          {'id': 'aixinqianbao', 'name': '51闪电购'},
          {'id': 'qianzhuang', 'name': '66钱庄'},
          {'id': 'fenqi91', 'name': '91分期'},
          {'id': 'aixinqianbao', 'name': '91极速购'},
          {'id': 'GFB', 'name': '安家趣花'},
          {'id': 'jdhh51', 'name': '爸爸钱包'},
          {'id': 'baiduloan', 'name': '百度有钱花'},
          {'id': 'xinyidai', 'name': '百途'},
          {'id': 'ppqb', 'name': '菠萝贷'},
          {'id': 'GoldTreasureTest', 'name': '财多多'},
          {'id': 'QBCS', 'name': '曹操贷'},
          {'id': 'kuai', 'name': '常花花'},
          {'id': 'ios', 'name': '钞好借'},
          {'id': 'chaokuaidai', 'name': '钞快贷'},
          {'id': 'sinaif1', 'name': '大白钱包'},
          {'id': 'dalidai', 'name': '大粒贷'},
          {'id': 'qq41eb85e0', 'name': '大小贷'},
          {'id': 'dkhelper', 'name': '贷嘛'},
          {'id': 'daishangqian', 'name': '贷上钱'},
          {'id': 'ddcash', 'name': '豆豆钱'},
          {'id': 'com.pintec.dumiao', 'name': '读秒'},
          {'id': 'com.mftcc.fanyidaiapp', 'name': '凡易贷'},
          {'id': 'fsl', 'name': '房司令-现金分期'},
          {'id': 'EasyDaifu', 'name': '分美'},
          {'id': 'fenqile', 'name': '分期乐-乐花'},
          {'id': 'myscheme', 'name': '蜂窝钱包'},
          {'id': 'DingLi.geinihua', 'name': '给你花'},
          {'id': 'zhuanyegongfudai', 'name': '功夫贷'},
          {'id': 'gsd', 'name': '光速借款'},
          {'id': 'QQ41F396DE', 'name': '海贷'},
          {'id': 'shopApp', 'name': '海豚钱包'},
          {'id': 'wb1752635441', 'name': '好好贷'},
          {'id': 'hqb', 'name': '好钱包'},
          {'id': 'QQ41E05883', 'name': '好易借'},
          {'id': 'tencent1105252877', 'name': '赫美易贷'},
          {'id': 'hicashapp', 'name': '嗨钱-快速贷'},
          {'id': 'hengyidai', 'name': '恒易贷'},
          {'id': 'QQ41E95B8B', 'name': '厚钱包'},
          {'id': 'GoldTreasureTest', 'name': '花了呗'},
          {'id': 'hwy', 'name': '花无忧'},
          {'id': 'huanqiuheika', 'name': '环球黑卡'},
          {'id': 'bajie', 'name': '惠花花'},
          {'id': 'hxj', 'name': '惠享借'},
          {'id': 'ppjidai', 'name': '及贷'},
          {'id': 'AuroraMelting', 'name': '极光融'},
          {'id': 'A6914179323922', 'name': '极速借'},
          {'id': 'schemejsqb', 'name': '极速钱包'},
          {'id': 'QQ41EB4935', 'name': '借得快'},
          {'id': 'com.jrweid.jiehuahua', 'name': '借花花钱包'},
          {'id': 'PDL2016', 'name': '借钱快'},
          {'id': 'alipay052969', 'name': '借条大师'},
          {'id': 'QQ41EDB82B', 'name': '借享钱包'},
          {'id': 'jinlianqianzhuangFaceAlipay', 'name': '金联钱庄'},
          {'id': 'jinniudaiapp', 'name': '金牛贷'},
          {'id': 'tencent1106335241', 'name': '九秒贷'},
          {'id': 'orangebag', 'name': '桔子钱袋'},
          {'id': 'kkcreditSchem', 'name': '卡卡贷'},
          {'id': 'caimikuaidai', 'name': '快贷 芝麻分贷'},
          {'id': 'kuai', 'name': '快来贷'},
          {'id': 'ksxj', 'name': '快闪现金'},
          {'id': 'hkl', 'name': '快赢优贷'},
          {'id': 'labichangxue', 'name': '蜡笔分期'},
          {'id': 'ledaikuan', 'name': '乐贷款'},
          {'id': 'LkhAPP', 'name': '乐开花'},
          {'id': 'biweeklyloan', 'name': '立即贷'},
          {'id': 'maomaoqianbaoTest', 'name': '猫猫钱包'},
          {'id': 'mimidai', 'name': '米米贷'},
          {'id': 'mimidai', 'name': '米米罐'},
          {'id': 'nmmswallet', 'name': '民生钱包'},
          {'id': 'dianrong-speedloan', 'name': '魔借'},
          {'id': 'renrenhuaPay', 'name': '莫愁花'},
          {'id': 'jiaxuedai', 'name': '你我贷'},
          {'id': 'NiuWa', 'name': '牛呗借款'},
          {'id': 'pdloan', 'name': '暖薪贷'},
          {'id': 'ppdai.loan', 'name': '拍拍贷'},
          {'id': 'QQ48f5e252', 'name': '霹雳pay'},
          {'id': 'PAYiDai', 'name': '平安i贷'},
          {'id': 'qixingmoka', 'name': '七星魔卡'},
          {'id': 'com.qdd.qdd', 'name': '钱到到'},
          {'id': 'rdloan', 'name': '钱速贷'},
          {'id': 'sinaifeasy', 'name': '轻松借'},
          {'id': 'QQ41EBE86A', 'name': '趣还钱'},
          {'id': 'QQ41e82712', 'name': '人人花'},
          {'id': 'bankproduct', 'name': '融360'},
          {'id': 'hzaodong', 'name': '三秒贷'},
          {'id': 'wecash', 'name': '闪银'},
          {'id': 'SYTianDeng', 'name': '闪银宝'},
          {'id': 'guofenqianbao', 'name': '商奇宝'},
          {'id': 'Cgtz', 'name': '宋江贷'},
          {'id': 'QQ41E4ECC1', 'name': '速贷之家'},
          {'id': 'SpeedFlower', 'name': '速易花'},
          {'id': 'tianshendai', 'name': '天神贷'},
          {'id': 'tencent1106558624', 'name': '微贷'},
          {'id': 'co.welab', 'name': '我来贷'},
          {'id': 'QQ05fc5b14', 'name': '希财贷款'},
          {'id': 'xiaqiankuai', 'name': '下钱快'},
          {'id': 'xianhuahua.yyy', 'name': '先花一亿元'},
          {'id': 'QQ41F105B6', 'name': '现金贷'},
          {'id': 'QBCS', 'name': '现金借款'},
          {'id': 'WDAlipayForCredit', 'name': '现金微贷'},
          {'id': 'CashOnline', 'name': '现金在线'},
          {'id': 'QQ41e86f6a', 'name': '向钱贷'},
          {'id': 'blackfish', 'name': '小黑鱼'},
          {'id': 'XHQBALL', 'name': '小花钱包'},
          {'id': 'miloan', 'name': '小米贷款'},
          {'id': 'QQ41EEFB01', 'name': '小牛闪贷'},
          {'id': 'QQ60af341', 'name': '小小钱贷'},
          {'id': 'Cardloan', 'name': '小赢卡贷'},
          {'id': 'xjkd', 'name': '小鱼快贷'},
          {'id': 'sinaif', 'name': '新浪有借'},
          {'id': 'crfMarket', 'name': '信而富'},
          {'id': 'xybt', 'name': '信用白条-不查征信'},
          {'id': 'credit', 'name': '信用管家'},
          {'id': 'starcreditApp', 'name': '星星钱袋'},
          {'id': 'QQ41EEFB01', 'name': '杏仁贷'},
          {'id': 'fsoapp', 'name': '宜信财富'},
          {'id': 'alisdkYMT', 'name': '银码头'},
          {'id': 'yongqiangbao', 'name': '用钱宝'},
          {'id': 'yjapp', 'name': '优借'},
          {'id': 'ygqb', 'name': '有个钱包'},
          {'id': 'R360YZD', 'name': '原子贷'},
          {'id': 'yunkedai', 'name': '云科贷'},
          {'id': 'XHQBALL', 'name': '指还王'},
          {'id': 'ZhouZhouWallet', 'name': '周周钱包'},
          {'id': 'leasePhone', 'name': '猪手机'}]
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
      appNameFormat (row, column) {
        var appPackage = row[column.property]
        if (appPackage === undefined || appPackage == null) {
          return ''
        }
        for (var i = this.apps.length - 1; i >= 0; i--) {
          var app = this.apps[i]
          if (appPackage.indexOf(app.id) !== -1) {
            return app.name
          }
        }
        return ''
      },
      init (userId) {
        if (this.userId !== userId) {
          this.userId = userId || 0
          this.dataList = []
          this.getDataList()
        }
      },
      // 获取数据列表
      getDataList () {
        this.$nextTick(() => {
          if (this.userId) {
            this.dataListLoading = true
            this.$http({
              url: this.$http.adornUrl(`/sys/userappinstalled/list`),
              method: 'get',
              params: this.$http.adornParams({
                'page': this.pageIndex,
                'limit': this.pageSize,
                'userId': this.userId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataList = data.page.list
                if (this.dataList !== undefined && this.dataList.length > 0) {
                  for (var i = this.dataList.length - 1; i >= 0; i--) {
                    if (this.dataList[i].appPackage !== undefined && this.dataList[i].appPackage !== null) {
                      for (var j = this.apps.length - 1; j >= 0; j--) {
                        var app = this.apps[j]
                        if (this.dataList[i].appPackage.indexOf(app.id) !== -1) {
                          this.dataList[i].appName = app.name
                          break
                        }
                      }
                    }
                  }
                }
                this.totalPage = data.page.totalCount
              } else {
                this.dataList = []
                this.totalPage = 0
              }
              this.dataListLoading = false
            })
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 弹窗关闭，清除数据
      clear () {
        this.userId = 0
      }
    }
  }
</script>

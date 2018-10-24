<template>
  <div id="iframeContainer" class="mod-config" v-loading="dataListLoading" style="min-height: 180px;">
    <iframe id="reportData" style="width: 100%;height: 180px;border: 0;"></iframe>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        userId: 0,
        reportHtmlData: '',
        dataListLoading: false
      }
    },
    methods: {
      init (userId) {
        if (this.userId !== userId) {
          this.userId = userId || 0
          this.reportHtmlData = ''
          this.$nextTick(() => {
            if (this.userId) {
              this.dataListLoading = true
              this.$http({
                url: this.$http.adornUrl(`/sys/yunyingshang/info/${this.userId}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                var height = '180px'
                if (data && data.code === 0) {
                  if (data.yunyingshang !== undefined) {
                    this.reportHtmlData = data.yunyingshang.url
                    height = '900px'
                  } else {
                    this.reportHtmlData = '<html><body><div style="text-align: center;color: #909399;font-size: 16px;width: 100%;">暂无数据</div></body></html>'
                  }
                  var iframe = document.getElementById('reportData')
                  var ed = document.all ? iframe.contentWindow.document : iframe.contentDocument
                  ed.open()
                  ed.write(this.reportHtmlData)
                  ed.close()
                  iframe.style.height = height
                }
                this.dataListLoading = false
              })
            }
          })
        }
      },
      // 计算页面的实际高度，iframe自适应会用到
      calcPageHeight (doc) {
        var cHeight = Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
        var sHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight)
        var height = Math.max(cHeight, sHeight)
        return height
      },
      // 弹窗关闭，清除数据
      clear () {
        this.userId = 0
      }
    }
  }
</script>

/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.118:8080';

<<<<<<< HEAD
=======
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.118:8080'
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.123:8080'; //唐杰
  // window.SITE_CONFIG['baseUrl'] = 'http://juzi.liulianggame.com:8080/loan-server';

>>>>>>> 07de2dc06c8a5fb94d6e28cb39959e90f29564a0
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()

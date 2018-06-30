//index.js
//获取应用实例
const app = getApp()
var tt = require('../../utils/test.js')
Page({
  data: {
    motto: '',
    index:0,
    timeID:0,
    fontColor:'black',
    userInfo: {},
    itemList:['网络类型:','系统信息:','服务电话:','扫一扫:','地图:','屏幕亮度:','设置屏幕亮度:'],
    itemValue:[{}],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
    print:function(words,inx) {
        this.setData({ motto: words.substring(0, inx++),index:inx})
        if(words.length<inx) {
            clearInterval(this.data.timeId)
        }
        // console.log(inx)
    },
    bindconfirm:function(res) {
        this.setData({ 'itemValue[0].screenBright': res.detail.value })
    },
  onLoad: function () {
      var that = this
      var words = 'CSDN地址:https://blog.csdn.net/Lee_woxinyiran \n简书地址:https://www.jianshu.com/u/b0bdd6db3cc8 \n\n欢迎访问o(*￣︶￣*)o'
      var color = ['#000', '#2f3192', '#c00', '#a286bd', '#9900cc']
      var id =setInterval(function () {
            var inx = that.data.index
            that.print(words, inx)
            var idx = Math.ceil(Math.random() * 4 + 0)
            that.setData({fontColor:color[idx]})
      }, 100)
    that.setData({timeId:id})

    wx.getNetworkType({
        success: function(res) {
            that.setData({"itemValue[0].netType":res.networkType})
        },
    })
    wx.getScreenBrightness({
        success: function (res) {
            console.log(res)
            that.setData({ 'itemValue[0].screenBright': res.value.toFixed(2) })
        }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

onShow:function() {
   
},

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getInfo: function (res) {
        var idx = res.currentTarget.dataset.id
        if(idx>0) {
            switch (idx) {
                case 1:
                        wx.getSystemInfo({
                            success: function(res) {
                                console.log(res)
                                wx.showModal({
                                    title: '系统信息如下:',
                                    content: '手机品牌:'+res.brand+';'+'手机型号:'+res.model+';当前系统:'+res.system+';微信版本:'+res.version+';客户端平台:'+res.platform,
                                })
                            },
                        })
                break;
                case 2:
                        wx.makePhoneCall({
                            phoneNumber: '110',
                            complete:function(res) {
                                wx.showToast({
                                    title: res.errMsg,
                                })
                            }
                        })
                break;
                case 3:
                    wx.scanCode({
                        complete:function(res) {
                            console.log(res)
                            wx.showModal({
                                title: '扫码信息如下:',
                                content: '扫码类型:' + res.scanType + ';' + '扫码结果:' + res.result,
                            })
                        }
                    })
                 break;   
                 case 4:
                        wx.navigateTo({
                            url: 'map',
                        })
                 break;
                 default:
                 break;
            }
        }
  },


})


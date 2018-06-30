//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })

    var value = wx.getStorageSync('key')
    if (value) {
        wx.showModal({
            title: '从本地缓存中同步获取数据',
            content: value,
        })
    } else {
        var data = [1, 2, 3]
        wx.setStorageSync('key', data)
    }
    
  }
})

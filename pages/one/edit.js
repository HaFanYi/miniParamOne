// pages/one/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        img_url:'',
        forward:'',
        words_info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        this.setData({
            img_url:options.img_url,
            forward: options.forward,
            words_info: options.words_info
        })
  },

/**
 * 选择本地图片
 */
    selectImg:function(res) {
        var that = this
         wx.chooseImage({
             count:1,
             sizeType: ['original'],
             success: function(res) {
                var tempFilePaths = res.tempFilePaths
                 that.setData({
                     img_url:tempFilePaths
                 })
             },
         })
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

/**
 * 输入框失去焦点时，修改forward的值
 */
  bindTextAreaBlur:function(e) {
    this.setData({
        forward:e.detail.value
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
        if(res.from==="button") {
            return {
                title: this.data.forward + "  " + this.data.words_info,
                path: '/pages/one/index',
                imageUrl: this.data.img_url
            }
        }
  }
})
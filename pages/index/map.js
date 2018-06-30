// pages/index/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[{'height':0}],
    markers: [{
        iconPath: "../../source/mark.png",
        id: 0,
        latitude: 0,
        longitude: 0,
        width: 50,
        height: 50
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
    wx.getSystemInfo({
        success: function(res) {
            that.setData({'info[0].height':res.screenHeight})
        },
    })
    wx.getLocation({
        type: 'wgs84',
        success: function (res) {
            that.setData({
                'info[0].longitude': res.longitude, 'info[0].latitude': res.latitude,
                'markers[0].longitude': res.longitude, 'markers[0].latitude': res.latitude,
                })
        }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
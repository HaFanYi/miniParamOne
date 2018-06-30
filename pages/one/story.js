// pages/one/story.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    story:[],
    Image:'',
    summary:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
      this.setData({ Image:options.img_url,summary:options.summary})
      var that = this
      wx.request({
          url: 'https://www.weifenshi.cn/tg.php/test/story?id=' +options.id ,
          dataType:'json',
          success:function(res) {
              console.log(res.data.data)
              that.setData({ story: res.data.data})
          },
          complete:function(res) {
                wx.setNavigationBarTitle({
                    title: that.data.story.title,
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
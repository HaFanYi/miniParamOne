// pages/one/index.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
	animationData:'',
	animationDay:'',
	lastPageX:0,
    conent:[],
    weather:[],
    menu:[],
    is_show_view:-1,
    date:'',
    backDate:'',
	selectDate: util.formatTimeYms(new Date()),
	endDate: util.formatTimeYms(new Date()),
	Year: util.formatYear(new Date()),
	Month: util.formatMonth(new Date()),
	Day: util.formatDay(new Date()),
    Play: app.globalData.play,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

/**
 * 时间选择
 */
  bindDateChange: function (e) {
	  var temp = e.detail.value.split('-') 
	  this.setData({
		  selectDate:e.detail.value,
		  Year: temp[0],
		  Month:temp[1],
		  Day:temp[2],
	  })
	  this.onShow(e.detail.value)
	  if (this.data.lastPageX>0) {
		  wx.pageScrollTo({
			  scrollTop: 0,
			  duration: 300
		  })
	  }
		  var animation = wx.createAnimation({
			  duration: 1000,
			  timingFunction: 'linear'
		  })
		  this.animation = animation
		  animation.translateX(-5).step()
		  this.setData({
			  animationDay: animation.export()
		  })
  },

/**
 * 头部-‘今天’按钮事件
 */
showTodayView:function(res) {
  this.setData({backDate:''})
  this.onShow()
  if (this.data.lastPageX > 0) {
	  wx.pageScrollTo({
		  scrollTop: 0,
		  duration: 300
	  })
  }
  var temp = this.data.endDate.split('-')
  this.setData({
	  Year: temp[0],
	  Month: temp[1],
	  Day: temp[2],
  })
},


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (res='') {
    var that = this,
     currentDate = '';
     console.log('test'+res);
	 if(res=='') {
         if(this.data.backDate=='') {
		    currentDate = this.data.endDate
         }else {
             currentDate = this.data.backDate 
         }
	 }else {
		 currentDate = res
	 }
     console.log('onshow:'+currentDate)
     that.setData({selectDate:currentDate})
	 var getData = wx.getStorageSync(currentDate)
	 console.log(getData)
	 if (getData!='') { 
		 if(currentDate==this.data.endDate) {
			var dates = "今天"
		 }else {
             var tmp = currentDate.split('-'),
                 dates = tmp[1].slice(1, 2) + '月' + tmp[2].slice(1, 2) + '日'
		 }
        that.setData({
            content: getData.data.content_list,
            weather: getData.data.weather,
            menu: getData.data.menu,
            date:dates
        })
    }else {
		 wx.showLoading({
			 title: '加载中...',
		 }),
        console.log('请求数据')
        wx.request({
			url: 'https://www.weifenshi.cn/tg.php/test/index?test=1' + '&date='+this.data.selectDate,
            dataType: 'json',
            success: function (res) {
                if (res.data.res == 0) {
                    if(res.data.data.content_list==null) {
                        var tempTime = util.formatYear(new Date()) + '-' + util.formatMonth(new Date())+'-'+(util.formatDay(new Date()) - 1)
                        that.onShow(tempTime)
                        var temp = tempTime.split('-')
                        that.setData({
                            selectDate: tempTime,
                            Year: temp[0],
                            Month: temp[1],
                            Day: temp[2],
                        })
                    }else {
                        console.log(res.data.data)
                        for (var i = 0; i < res.data.data.content_list.length; i++) {
                            if (res.data.data.content_list[i].category==6) {
                                res.data.data.content_list.splice(i,1)
                            }
                            if(res.data.data.content_list[i].category==2 && res.data.data.content_list[i].serial_id>0) {
                                if(res.data.data.content_list[i].serial_list!='') {
                                    wx.setStorage({
                                        key: res.data.data.content_list[i].serial_id,
                                        data: res.data.data.content_list[i].serial_list,
                                    })
                                }
                            }
                            if (i > 0) {
                                if (res.data.data.content_list[i].author != '') {
                                    var temp = res.data.data.content_list[i].author.user_name;
                                    temp = temp.split(' ');
                                    if (temp.length > 1) {
                                        res.data.data.content_list[i].author.user_name = temp[0] + temp[1];
                                    } else {
                                        res.data.data.content_list[i].author.user_name = temp[0];
                                    }
                                }
                            }
                            var sub_title = res.data.data.content_list[i].subtitle;
                            if (sub_title != '') {
                                var tmp_title = sub_title.split(':')
                                res.data.data.content_list[i].subtitle = tmp_title[1];
                            }
                        }
                        if (res.data.data.weather.date == util.formatTimeYms(new Date())) {
                            var dates = "今天",
                                storeDate = util.formatTimeYms(new Date())
                        } else {
                            var tmp = res.data.data.weather.date.split('-'),
                                dates = tmp[1].slice(1, 2) + '月' + tmp[2].slice(1, 2) + '日',
                                storeDate = res.data.data.weather.date
                        }
                        that.setData({
                            content: res.data.data.content_list,
                            weather: res.data.data.weather,
                            menu: res.data.data.menu,
                            date: dates
                        })
                        wx.setStorageSync(storeDate, res.data)
                        wx.setStorageSync('currentDate', storeDate)
                    }
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 1000)
                } else {
                    wx.showToast({
                        title: '数据加载失败',
                        icon: 'false',
                        duration: 2000
                    })
                }
            }

        })
    }
   
  },
  
  /**
   * 弹出遮罩层-查看原图
   */
  showModelView:function(e) {
    console.log(e.target.dataset.id)
    this.setData({
      is_show_view:e.target.dataset.id,
      
    })
    wx.hideTabBar({
      
    })
  },
  /**
   * 关闭遮罩层
   */
  hiddenView:function(e) {
    this.setData({
      is_show_view:-1
    })
    wx.showTabBar({
      
    });
  },
/**
 * 长按选择保存图片
 * 先下载图片获取本地临时路径
 * 再把临时路径保存到相册
 */
  saveImg:function(e) {
    var tmpPath='',
        urls = e.target.dataset.url;
    wx.downloadFile({
      url: urls,
      success: function (res) {
            if (res.statusCode === 200) {
                tmpPath=res.tempFilePath
                console.log(urls)
                console.log(tmpPath)
            }
        }
    }),
    wx.showActionSheet({
      itemList: ['保存到手机相册'],
      success: function (res) {
        if(res.tapIndex==0) {
            wx.saveImageToPhotosAlbum({
              filePath: tmpPath,
              complete: function (res) {
                if (res.errMsg =='saveImageToPhotosAlbum:ok') {
                  wx.showToast({
                    title: '保存成功',
                  })
                }else {
                  wx.showToast({
                    title: '保存失败',
                  })
                }
              }
            })
        }else {
          wx.showToast({
            title: '保存失败',
          })
        }
      }
    })
  },

  /**
   * 跳转编辑
   */
  editText:function(res) {
    var id = res.target.dataset.id,
        img_url = this.data.content[id].img_url,
        forward = this.data.content[id].forward,
        words_info= this.data.content[id].words_info
    wx.navigateTo({
        url: 'edit?img_url='+img_url+'&forward='+forward+'&words_info='+words_info,
    })
    wx.hideTabBar()
  },
  /**
   * 跳转详情页
   */
  gotoDetailPage:function(res) {
	  var id = res.currentTarget.dataset.id,
	  cateid = res.currentTarget.dataset.cateid,
	  cate = res.currentTarget.dataset.cate,
	  catename = ''
	  if (cateid == 1) {
		  if (cate == null) {
				catename = "阅读"
		  } else {
			  catename = cate.title
		  }
	  } else if (cateid == 2) {
		  catename = '连载'
	  } else if (cateid == 3) {
		  catename = '问答'
	  } else if (cateid == 4) {
		  catename = '音乐'
	  } else {
		  catename = '影视'
	  }
      console.log('goto'+this.data.selectDate)
      if(cateid!=4) {
                wx.navigateTo({
                    url: 'essay?id=' + id + '&catename=' + catename + '&cateid=' + cateid + '&date=' +                                                  this.data.selectDate + '&isPlay=' + this.data.Play[0].isPlay + 
                        '&playNow=' + this.data.Play[0].playNow+ '&playUrl=' + this.data.Play[0].playUrl,
               })
      }else {
          wx.showToast({
              title:'音乐详情暂未开发···',
          })
      }
  },

  /**
   * 播放音乐
   */
  startMusic:function(res) {
    //   var url = res.target.dataset.url
    //   console.log(url)
    //   url = 'http://music.wufazhuce.com/lkT5CTbkhLS1eyzW4XLjASbRjdG5'
    //  const innerAudioContext = wx.createInnerAudioContext('audio')
    //   innerAudioContext.autoplay = true
    //   innerAudioContext.src = url
    //   innerAudioContext.onPlay(() => {
    //       console.log('开始播放')
    //   })
    //   innerAudioContext.onError((res) => {
    //       console.log(res.errMsg)
    //       console.log(res.errCode)
    //   })
  },
  /**
    * 播放音频
    */
  playAudio: function (res) {
      var play = this.data.Play
      play[0]['isPlay'] = 1
      var url = play[0]['playUrl']
      app.audio.src = url
      app.globalData.play[0].playNow = 1
      app.audio.startTime = play[0].currentTime
      this.setData({ 'Play[0].isPlay':1,'Play[0].playNow':1})
      app.audio.play()
      console.log('start play···')
  },
  pauseAudio: function (res) {
      var play = this.data.Play
      play[0].playNow = 0
      this.setData({ Play: play })
      app.audio.pause()
      console.log('pause now···')
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
      wx.stopPullDownRefresh()
      wx.setNavigationBarTitle({
          title: '加载中···',
      })
    wx.showNavigationBarLoading()
    setTimeout(function() {
        wx.hideNavigationBarLoading()
        wx.setNavigationBarTitle({
            title: '微信小程序',
        })
    },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

/**
 * 页面滚动触发事件的处理函数
 */
  onPageScroll:function(e) {
	var  realX = e.scrollTop
		 if(realX>100) {
			 if(this.data.date=='今天') {
				 var animation = wx.createAnimation({
					 duration: 1000,
					 timingFunction: 'linear'
				 })
				 this.animation = animation
				 animation.scale(0.5,0.5).opacity(0.5).step()
				 this.setData({
					 animationData: animation.export()
				 })
				 this.animation.scale(0, 0).opacity(0).step()
				 this.setData({
					 animationData: this.animation.export(),
					 lastPageX: realX
				 })
			 }else {
				 var animation = wx.createAnimation({
					 duration: 1000,
					 timingFunction: 'linear'
				 })
				 this.animation = animation
				 animation.translateX(-(wx.getSystemInfoSync().windowWidth-120) ).step()
				 this.setData({
					 animationDay: animation.export(),
					 lastPageX:realX
				 })
			 }
		 }else {
			if(realX<=50) {
				if (this.data.date == '今天') {
					var animation = wx.createAnimation({
						duration: 1000,
						timingFunction: 'linear'
					})
					this.animation = animation
					animation.scale(0.5, 0.5).opacity(0.5).step()
					this.setData({
						animationData: animation.export()
					})
					this.animation.scale(1, 1).opacity(1).step()
					this.setData({
						animationData: this.animation.export()
					})
				}
					  if (this.data.lastPageX - realX < 100 && this.data.lastPageX - realX>50) {
						var animation = wx.createAnimation({
							duration: 1000,
							timingFunction: 'linear'
						})
						this.animation = animation
						animation.translateX(-5).step()
						this.setData({
							animationDay: animation.export()
						})
					}
			}
		 }
  },

  /**
   * 用户点击右上角分享
   * 页面内转发按钮
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      var data = this.data.content[res.target.dataset.id]
      // 来自页面内转发按钮
      return {
        title: data.forward,
        path: '/pages/one/index',
        imageUrl:data.img_url
      }
    }
  },
  /**
   * 当前页是tab页时，点击tab时触发
   */
  onTabItemTap:function(item) {
    console.log(item.index),
    console.log(item.pagePath)
  }
})
// pages/one/essay.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
        date:'',
        itemID:0,
        lastCid:0,
        catename:'',
		essay: [],
        movied:[],
		comment:[],
        Time:'0:00',
        duration:0,
        Play: app.globalData.play,
        Type:0,
        isShowSerial:false,
        isShowSerialNum:true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: options.catename,
		})
        this.setData({date:options.date,catename:options.catename})
        if(options.playUrl!='') {
            this.setData({ 'Play[0].isPlay': options.isPlay, 'Play[0].playNow': options.playNow})
        }
        wx.showLoading({
            title: '加载中···',
            mask:true
        })
		var that = this, url='',comment_url = ''
        if(options.cateid==1) {
            url = 'https://www.weifenshi.cn/tg.php/test/essay?id=' + options.id
            this.setData({Type:1})
        } else if (options.cateid == 2) {
            url = 'https://www.weifenshi.cn/tg.php/test/serial?id=' + options.id
            this.setData({ Type: 2})
        }else if(options.cateid==3) {
            url = 'https://www.weifenshi.cn/tg.php/test/question?id=' + options.id
            this.setData({ Type: 3})
        }else if(options.cateid==5) {
            url = 'https://www.weifenshi.cn/tg.php/test/movie?id=' + options.id
            this.setData({Type:5})
        }else {

        }
                    wx.request({
                        url: url,
                        dataType: 'json',
                        success: function (res) {
                            var content = ''
                            if(options.cateid==1) {
                                content = res.data.data.hp_content
                                res.data.data.naviTitle = res.data.data.hp_title
                            }else if(options.cateid==2) {
                                content = res.data.data.content
                                if(res.data.data.serial_id>0) {
                                    res.data.data.serial_list = wx.getStorageSync(res.data.data.serial_id)
                                    res.data.data.naviTitle = res.data.data.title
                                }
                                // console.log(res.data.data.serial_list)
                            }else if(options.cateid==3) {
                                content = res.data.data.answer_content
                                res.data.data.naviTitle = res.data.data.question_title
                            }else if(options.cateid==5) {
                                res.data.data.naviTitle = res.data.data.title
                                content = res.data.data.content
                                that.setData({ movied: res.data.detail.data})
                            }
                            WxParse.wxParse('content', 'html', content, that);
                            if (res.data.data.anchor != '') {
                                if (app.globalData.play[0]['currentShowTime'] == '0:00') {
                                    var second = res.data.data.audio_duration % 60,
                                        min = parseInt(res.data.data.audio_duration / 60)
                                    that.setData({ Time: min + ':' + second, duration: min + ':' + second })
                                    app.globalData.play[0].playUrl = res.data.data.audio
                                } else {
                                    that.setData({ Time: app.globalData.play[0]['currentShowTime'] })
                                }
                            }
                            that.setData({
                                essay: res.data.data
                            })
                            console.log(res.data.data)
                            var cid = 0
                            wx.request({
                                url: 'https://www.weifenshi.cn/tg.php/test/comment?id=' + options.id + '&cid=' + cid+'&type='+that.data.Type,
                                dataType: 'json',
                                success: function (result) {
                                    that.setData({
                                        comment: result.data.data.data,
                                        itemID: options.id,
                                        lastCid: result.data.data.data[result.data.data.data.length - 1].id
                                    })
                                }
                            })

                        },
                        complete: function (res) {
                            wx.hideLoading()
                            if (res.statusCode != 200) {
                                wx.showToast({
                                    title: res.errMsg,
                                })
                            } else {
                                wx.showToast({
                                    icon: 'success',
                                    title: '加载完成',
                                })
                            }
                        }
                    })

      //音频播放监听时间注册
        app.audio.onPlay(() => {
            console.log('播放开始监听...')
        })
        app.audio.onPause(() => {
            console.log('暂停播放···')
        })
        app.audio.onStop(() => {
            console.log('停止播放···')
        })
        
        app.audio.onTimeUpdate(() => {
            app.globalData.play[0].currentTime = app.audio.currentTime
            var tmp = app.audio.duration - app.audio.currentTime,
                second = Math.ceil(tmp % 60),
                min = parseInt(tmp / 60)
            if (second < 10) {
                second = '0' + second
            } else if (second == 60) {
                second = '00'
            }
            this.setData({ Time: min + ':' + second })
            app.globalData.play[0]['currentShowTime'] = min + ':' + second
        })
        app.audio.onEnded(() => {
            app.globalData.play[0]['currentShowTime'] = this.data.duration
            app.globalData.play[0]['currentTime'] = 0
            app.globalData.play[0]['playNow'] = 0
            var tmp = this.data.duration.split(':')
            this.setData({ Play: app.globalData.play, Time: tmp[0] + ":" + tmp[1]})
        })
        app.audio.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })

	},

    /**
     *  连载前一章和后一章
    */
    gotoNewPage:function(res) {
        console.log(res.currentTarget.dataset.id)
        var con = []
           con['id'] = res.currentTarget.dataset.id
           con['cateid'] = 2
           con['catename'] = '连载' 
        this.setData({isShowSerial:false})   
        this.onLoad(con)
        wx.pageScrollTo({
            scrollTop: 0,
        })
    },
    /**
     * 是否显示选择连载选项
     */
    showSerialNum:function(res) {
        this.setData({isShowSerial:true})
        console.log(this.data.isShowSerial)
    },
    
    /**
     * 电影详情
     */
    gotoStory:function(res) {
        // console.log(this.data.movied.poster)
        // console.log(this.data.essay.movie_id)
        // console.log(this.data.essay.summary)
        wx.navigateTo({
            url: 'story?img_url='+this.data.movied.poster+'&id='+this.data.essay.movie_id+'&summary='+this.data.essay.summary,
        })
    },

    /**
     * 播放音频
     */
    playAudio:function(res) {
        app.globalData.play[0]['isPlay'] = 1
        var url = app.globalData.play[0]['playUrl']
        app.audio.src = url
        app.globalData.play[0].playNow = 1
        app.audio.startTime = app.globalData.play[0].currentTime
        this.setData({ Play: app.globalData.play })
        app.audio.play()  
        console.log(app.globalData.play[0])
        console.log('start play···')
    },
    pauseAudio:function(res) {
        app.globalData.play[0].playNow = 0
        this.setData({ Play: app.globalData.play })
        app.audio.pause() 
        console.log('pause now···')
    },

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
        // this.playAudio()
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
        let pages = getCurrentPages(),
            prevPage = pages[pages.length - 2]
        //    this.pauseAudio()
        prevPage.setData({
            backDate:this.data.date,
            Play: app.globalData.play
        }) 
	},

    /**
     * 页面滚动触发事件处理
     */
    onPageScroll:function(res) {
        this.setData({ isShowSerial: false})
            if(res.scrollTop>70) {
                wx.setNavigationBarTitle({
                    title: this.data.essay.naviTitle,
                })
            }else {
                wx.setNavigationBarTitle({
                    title: this.data.catename,
                })
            }
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
            var that =this,
                id = this.data.itemID,
                cid = this.data.lastCid,
                types = this.data.Type
                console.log(id)
                console.log(cid)
        
            wx.request({
                url: 'https://www.weifenshi.cn/tg.php/test/comment?id=' + id + '&cid=' + cid+'&type='+types,
                dataType: 'json',
                success: function (result) {
                    if(result.data.data.data.length>0) {
                        var tmpArr = that.data.comment.concat(result.data.data.data)
                        that.setData({
                            comment: tmpArr,
                            lastCid: result.data.data.data[result.data.data.data.length - 1].id
                        })
                    }else {
                        wx.showToast({
                            title: '已是全部评论了···',
                            duration:2000
                        })
                    }
                },
                fail:function(result) {
                        wx.showToast({
                            title: result.errMsg,
                        })
                }
	        })
    },

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})
// pages/first/first.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articallist: [],
    articalLikeList: [],
    userInfoList: [],
    token: '',
    x: null,
    y: null,
    isloading: true,
    page: 1
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (!app.globalData.topic) {
      wx.showModal({
        title: '再等等吧',
        content: '相关话题暂未开放哦',
      })
    } else {
      var timestamp = Math.round(new Date() / 1000)
      var start_time = parseInt(app.globalData.topic.start_time)
      var end_time = parseInt(app.globalData.topic.end_time)
      if (start_time <= timestamp && timestamp <= end_time) {
        wx.showModal({
          title: app.globalData.topic.title + '话题开放',
          content: app.globalData.topic.content,
        })
        that.setData({
          topic: app.globalData.topic
        })
      } else {
        wx.showModal({
          title: '再等等吧',
          content: '相关话题暂未开放哦',
        })
      }
    }


    var width = wx.getSystemInfoSync().windowWidth
    var height = wx.getSystemInfoSync().windowHeight
    that.setData({
      x: width - 100,
      y: height - 100,
      token: app.globalData.token
    }, () => {
      util.getLikeList().then(function(articalLikeList){
        console.log(articalLikeList)
        that.setData({
          articalLikeList: articalLikeList
        }, () => {
          that.showArticalList(1).then(function (res) {
            // console.log(res)
            if (res === 'show artical done') {
              that.setData({
                isloading: false
              })
            }
          })
        })
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // var that = this
    // setTimeout(function(){
    //   that.setData({
    //     isloading: false
    //   })
    // }, 500)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    // 下拉刷新
    that.setData({
      page: 1,
      articallist: []
    }, () => {
      util.getLikeList().then(function (articalLikeList) {
        console.log(articalLikeList)
        that.setData({
          articalLikeList: articalLikeList
        }, () => {
          that.showArticalList(1).then(function (res) {
            // console.log(res)
            if (res === 'show artical done') {
              wx.showToast({
                title: '刷新成功',
              })
            }
          })
        })
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var page = this.data.page + 1
    this.showArticalList(page)
    this.setData({
      page: page
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  go_to_write_page: function() {
    wx.navigateTo({
      url: '/pages/first/write/write',
    })
  },

  showArticalList: function(page) {
    var that = this
    return new Promise(function(resolve, reject) {
      var offset = 10 * (page - 1)
      that.getArticalList(offset).then(function(res) {
        // console.log(res)
        if (res === 'get articalList done') {
          resolve('show artical done')
        }
      })
    })

  },
  getArticalList: function(offset) {
    var that = this
    return new Promise(function(resolve, reject) {
      wx.request({
        url: 'https://www.misakamiko.com/api/1.0/get_artical_list?limit=10&offset=' + offset,
        method: 'GET',
        success(res) {
          // console.log(res)
          for (var i = 0; i < res.data.data.length; i++) {
            // console.log(res.data.data[i].imgurl)
            if (res.data.data[i].imgurl == null || res.data.data[i].imgurl == '') {
              res.data.data[i].imgurl = null
            } else {
              res.data.data[i].imgurl = res.data.data[i].imgurl.split(",")
            }
          }
          var articallist = that.data.articallist
          // console.log(articallist)
          for (var i in res.data.data) {
            articallist.push(res.data.data[i])
          }
          console.log(articallist)
          if (res.data.code === "1040") {
            console.log('获取文章列表成功')
            that.setData({
              articalList: articallist
            }, () => {
              // console.log(that.data.articalList)
              wx.stopPullDownRefresh()
              resolve('get articalList done')
            })
          }
        }
      })
    })
  }

})
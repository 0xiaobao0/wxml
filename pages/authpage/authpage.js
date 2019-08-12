// pages/authpage/authpage.js
var app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')//获取用户信息是否在当前版本可用
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

  },
  bindGetUserInfo: function (e) {//点击的“拒绝”或者“允许
    // console.log(e)
    if (e.detail.userInfo) {//点击了“允许”按钮，
      var that = this;
      app.globalData.wxuserinfo = e.detail.userInfo
      util.getUsernfo(app.globalData.token).then(function (res) {
        console.log(res)
        util.afterLoginMethod(app.globalData.token)
      })
      wx.switchTab({
        url: '../service/service',
      })
    }
    else{
      wx.switchTab({
        url: '../service/service',
      })
    }
  }
})
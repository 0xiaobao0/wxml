// pages/service/myclassdesign/myclassdesign.js
var util = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myClassdesign: [],
    myClassdesignresult: null,
    isloading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var myClassdesign = wx.getStorageSync('myClassdesign')
    //获取当前周
    if (myClassdesign) {
      // 如果本地有课设缓存
      console.log('myClassdesign', myClassdesign)
      that.setData({
        myClassdesign: myClassdesign,
        isloading: false
      })
    } else {
      //本地无课设缓存，向接口请求课设
      that.getClassdesign().then(function(res) {
        console.log(res)
      })
    }
  },
  getClassdesign: function() {
    var that = this
    return new Promise(function(resolve, reject) {
      that.get_my_classdesign().then(function(result) {
        console.log(result)
        if (result.code === '200') {
          wx.showToast({
            title: '获取课设成功',
          })
          resolve('get my classdesign done')
        } else if (result.code === '1450') {
          util.login()
          if (that.data.loginResult) {
            var loginresult = that.data.loginResult
            console.log(loginresult)
            if (loginresult.code === '200') {
              that.get_my_classdesign()
            } else {
              wx.showModal({
                title: '获取课设失败',
                content: '请重新前往个人页绑定学号或检查当前网络是否能访问教务处',
              })
              that.setData({
                isloading: false
              })
            }
          } 
          else {
            that.loginResultReady = loginresult => {
              console.log(loginresult)
              if (loginresult.code === '200') {
                that.get_class()
              } else {
                wx.showModal({
                  title: '获取课设失败',
                  content: '请重新前往个人页绑定学号或检查当前网络是否能访问教务处',
                })
                that.setData({
                  isloading: false
                })
              }
            }
          }
        } else {
          wx.showToast({
            title: '获取课设失败',
            icon: 'none'
          })
          that.setData({
            isloading: false
          })
        }


      })
    })
  },

  get_my_classdesign: function() {
    var that = this
    return new Promise(function(resolve, reject) {
      wx.request({
        url: 'https://www.misakamiko.com/api/1.0/get_classdesign',
        method: 'GET',
        header: {
          'Token': app.globalData.token,
        },
        success(res) {
          console.log(res.data)
          if (res.data.code == '200') {
            console.log(res.data.msg)
            that.setData({
              myClassdesign: res.data.data
            })
            wx.setStorageSync('myClassdesign', res.data.data)
            wx.showToast({
              title: '获取课设成功',
            })
            that.setData({
              isloading: false
            })
            resolve(res.data)
          } else {
            console.log(res.data.msg)
            wx.showModal({
              title: '获取课设失败',
              content: '请重新前往个人页绑定学号或检查当前网络是否能访问教务处',
            })
            that.setData({
              isloading: false
            })
          }
        }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  back_to_service: function() {
    wx.navigateBack({
      url: '/pages/service/service',
    })
  },
})
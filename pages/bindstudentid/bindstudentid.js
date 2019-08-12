// pages/bindstudentid/bindstudentid.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentId: '',
    password: '',
    isloading: false
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
  back_to_index: function () {
    wx.navigateBack({
      url: '/pages/index/index',
    })
  },
  get_studentId_value: function (e) {
    // console.log(e.detail.value)
    this.setData({
      studentId: e.detail.value
    })
  },
  get_password_value: function (e) {
    // console.log(e.detail.value)
    this.setData({
      password: e.detail.value
    })
  },
  login: function () {
    var that = this
    that.setData({
      isloading: true
    }, () => {
      var studentId = that.data.studentId
      var password = that.data.password
      // console.log(studentId, password)
      wx.request({
        url: 'https://www.misakamiko.com/api/1.0/bind_student_id',
        method: 'POST',
        data: {
          studentId: that.data.studentId,
          password: that.data.password
        },
        header: {
          'Token': app.globalData.token,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log(res.data)
          if (res.data.code == '200') {
            that.setData({
              isloading: false
            })
            console.log(res.data.msg)
            wx.showModal({
              title: '綁定学号成功',
              content: '可以学校相关功能了',
            })
            wx.setStorage({
              key: 'studentId',
              data: studentId,
            })
            wx.setStorage({
              key: 'password',
              data: password,
            })
            wx.navigateBack({
              delta: 1
            })
          }
          else {
            console.log(res.data.msg)
            wx.showToast({
              title: '绑定失败',
              icon: 'none'
            })
          }
        }
      })
    })
  }

})
// pages/changeuserinfo/changeuserinfo.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: null,
    age: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      token: app.globalData.token
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

  },
  back_to_index: function () {
    wx.navigateBack({
      url: '/pages/index/index',
    })
  },

  get_nickname_value: function (e) {
    var that = this
    that.setData({
      nickName: e.detail.value
    })
  },

  get_age_value: function (e) {
    var that = this
    that.setData({
      age: e.detail.value
    })
  },

  submit_changge: function () {
    var that = this
    console.log(that.data.nickName, that.data.age)
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/change_user_info',
      method: 'POST',
      data: {
        nickName: that.data.nickName,
      },
      header: {
        'Token': that.data.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        if (res.data.code === "1044") {
          console.log('修改昵称成功')
          wx.showToast({
            title: '修改成功',
          })
          that.setData({
            userInfo: res.data.data
          }, () => {
            console.log(that.data.userInfo)
          })
        }
        else {
          wx.showToast({
            title: '修改失败',
            icon: 'none'
          })
        }
      }
    })
  }
})
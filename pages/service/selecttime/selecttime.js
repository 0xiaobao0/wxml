// pages/service/selecttime/selecttime.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekList: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
    dayList: [1, 2, 3, 4, 5, 6, 7],
    charactersList: ['上午', '下午', '晚上'],
    sectionList: [1,2,3,4,5,6,7,8,9,10],
    weekIndexList: [],
    dayIndexList: [],
    charactersIndexList: [],
    week_unit_color: [],
    day_unit_color: [],
    characters_unit_color: []
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
  back_to_service: function () {
    wx.navigateBack({
      url: '/pages/service/service',
    })
  },
  setWeek: function(e) {
    // console.log(e)
    var that = this
    var weekIndexList = that.data.weekIndexList
    var week_unit_color = that.data.week_unit_color
    var weekindex = e.target.dataset.weekindex
    week_unit_color[weekindex] = 'rgba(170, 170, 170, 0.76)'
    weekIndexList.push(weekindex)
    that.setData({
      weekIndexList: weekIndexList,
      week_unit_color: week_unit_color
    })
  },
  setDay: function(e) {
    var that = this
    var dayIndexList = that.data.dayIndexList
    var day_unit_color = that.data.day_unit_color
    var dayindex = e.target.dataset.dayindex
    day_unit_color[dayindex] = 'rgba(170, 170, 170, 0.76)'
    dayIndexList.push(dayindex)
    that.setData({
      dayIndexList: dayIndexList,
      day_unit_color: day_unit_color
    })
  },
  setCharacters: function(e) {
    var that = this
    var charactersIndexList = that.data.charactersIndexList
    var characters_unit_color = that.data.characters_unit_color
    var charactersindex = e.target.dataset.charactersindex
    characters_unit_color[charactersindex] = 'rgba(170, 170, 170, 0.76)'
    charactersIndexList.push(charactersindex)
    that.setData({
      charactersIndexList: charactersIndexList,
      characters_unit_color: characters_unit_color
    })
  },
  go_to_query: function () {
    var that = this
    if(that.data.weekIndexList.length == 0 || that.data.dayIndexList.length == 0 || that.data.charactersIndexList.length == 0){
      wx.showModal({
        title: '还没选择齐查询选择条件',
        content: '请先选择齐周次/星期/节次',
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/service/emptyclassroom/emptyclassroom',
      })
    }
  },
  empty_week: function() {
    this.setData({
      weekIndexList: [],
      week_unit_color: []
    })
  },
  empty_day: function() {
    this.setData({
      dayIndexList: [],
      day_unit_color: []
    })
  },
  empty_characters: function() {
    this.setData({
      charactersIndexList: [],
      characters_unit_color: []
    })
  }
})
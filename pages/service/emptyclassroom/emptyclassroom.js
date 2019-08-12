//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    emptyClassroom: [],
    weekArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    weekIndex: 0,
    myClassResult: null,
    loginResult: null,
    roomObj: {
      'cdmc': '场地名称',
      'xqmc': '校区',
      'jxlmc': '楼号',
      'zws': '座位数',
      'lch': '楼层号',
      'cdlbmc': '场地类别',
    },
    weekIndexList: [],
    dayIndexList: [],
    charactersIndexList: [],
    page: 1,
    isloading: true
  },
  onLoad: function () {
    var that = this
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2]
    var weekIndexList = prevPage.data.weekIndexList
    var dayIndexList = prevPage.data.dayIndexList
    var charactersIndexList = prevPage.data.charactersIndexList
    that.setData({
      weekIndexList: JSON.stringify(weekIndexList),
      dayIndexList: JSON.stringify(dayIndexList),
      charactersIndexList: JSON.stringify(charactersIndexList),
    })
    console.log(weekIndexList, dayIndexList, charactersIndexList)
    //获取当前周
    that.get_pre_week().then(function (res) {
      console.log(res)
      that.get_empty_classroom()
    })
  },
  get_pre_week: function () {
    var that = this
    return new Promise(function (resolve, reject) {
      wx.request({
        url: 'https://www.misakamiko.com/api/1.0/get_pre_week',
        header: {
          Token: app.globalData.token
        },
        success(res) {
          console.log(res)
          if (res.data.code === '200') {
            that.setData({
              weekIndex: res.data.data - 1
            }, () => {
              resolve('get pre week success')
            })
          }
        }
      })
    })
  },
  login: function () {
    var that = this
    var studentId = wx.getStorageSync('studentId')
    var password = wx.getStorageSync('password')
    // console.log(studentId, password)
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/bind_student_id',
      method: 'POST',
      data: {
        studentId: studentId,
        password: password
      },
      header: {
        'Token': app.globalData.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        // console.log(res.data)
        if (res.data.code == '200') {
          console.log(res.data.msg)
          that.setData({
            loginResult: res.data
          })
        }
        if (that.loginResultReady) {
          that.loginResultReady(res.data)
        }
      }
    })
  },
  query_empty_classroom: function () {
    var that = this
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/get_empty_classroom',
      method: 'POST',
      data: {
        week: that.data.weekIndexList,
        day: that.data.dayIndexList,
        characters: that.data.charactersIndexList,
        page: that.data.page
      },
      header: {
        'Token': app.globalData.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data)
        console.log(res.data.code)
        that.setData({
          emptyClassroomResult: res.data
        })
        if (res.data.code == '200') {
          console.log(res.data.msg)
          var emptyClassroom = that.data.emptyClassroom
          emptyClassroom[that.data.page] = res.data.data
          that.setData({
            emptyClassroom: emptyClassroom,
            isloading: false
          })
        }
        if (that.emptyClassroomResultReady) {
          that.emptyClassroomResultReady(res.data)
        }
      }
    })
  },

  get_empty_classroom: function () {
    var that = this
    that.query_empty_classroom()
    return new Promise(function (resolve, reject) {
      if (that.data.emptyClassroomResult) {
        console.log(that.data.emptyClassroomResult)
        var result = that.data.emptyClassroomResult
        if (result.code === '200') {
          wx.showToast({
            title: '获取空教室成功',
          })
          resolve('get empty classroom done')
        }
        else if (result.code === '1451') {
          that.login()
          if (that.data.loginResult) {
            var loginresult = that.data.loginResult
            console.log(loginresult)
            if (loginresult.code === '200') {
              that.query_empty_classroom()
            }
            else {
              wx.showModal({
                title: '获取空教室失败',
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
                that.query_empty_classroom()
              }
              else {
                wx.showModal({
                  title: '获取空教室失败',
                  content: '请重新前往个人页绑定学号或检查当前网络是否能访问教务处',
                })
                that.setData({
                  isloading: false
                })
              }
            }
          }
        }
        else {
          wx.showToast({
            title: '获取空教室失败',
            icon: 'none'
          })
          that.setData({
            isloading: false
          })
        }

      }
      else {
        that.emptyClassroomResultReady = result => {
          // console.log(result)
          if (result.code === '200') {
            wx.showToast({
              title: '获取空教室成功',
            })
            resolve('get empty classroom done')
          }
          else if (result.code === '1451') {
            that.login()
            if (that.data.loginResult) {
              var loginresult = that.data.loginResult
              console.log(loginresult)
              if (loginresult.code === '200') {
                that.query_empty_classroom()
              }
              else {
                wx.showModal({
                  title: '获取空教室失败',
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
                  that.query_empty_classroom()
                }
                else {
                  wx.showModal({
                    title: '获取空教室失败',
                    content: '请重新前往个人页绑定学号或检查当前网络是否能访问教务处',
                  })
                  that.setData({
                    isloading: false
                  })
                }
              }
            }
          }
          else {
            wx.showToast({
              title: '获取空教室失败',
              icon: 'none'
            })
            that.setData({
              isloading: false
            })
          }
        }
      }
    })

  },
  back_to_service: function () {
    wx.navigateBack({
      url: '/pages/service/selecttime/selecttime',
    })
  },
  chooseWeek: function (e) {
    var that = this
    var weekIndex = that.data.weekIndex
    that.setData({
      weekIndex: e.detail.value
    })
  },
  get_pre_page: function() {
    var that = this
    var page = that.data.page
    if(page == 1){
      wx.showModal({
        title: '提示',
        content: '无法再向前翻页',
      })
    }
    else{
      page = page-1
      that.setData({
        page: page
      }, () => {
        if (!that.data.emptyClassroom[page]) {
          that.query_empty_classroom()
        }
      })
    }
  },
  get_next_page: function() {
    var that = this
    var page = that.data.page+1
    that.setData({
      page: page
    }, () => {
      if (!that.data.emptyClassroom[page]){
        that.query_empty_classroom()
      }
    })
  }
})
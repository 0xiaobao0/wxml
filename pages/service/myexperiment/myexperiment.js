
//获取应用实例
var app = getApp()
Page({
  data: {
    colorArrays: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],
    myExperiment: [],
    weekArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    weekIndex: 0,
    myExperimentResult: null,
    loginResult: null,
    isloading: true
  },
  onLoad: function () {
    var that = this
    //获取本地课表缓存
    var myExperiment = wx.getStorageSync('myExperiment')
    // console.log(myExperiment)
    //获取当前周
    that.get_pre_week().then(function (res) {
      console.log(res)
      //如果缓存有课表，则无需重新请求课表接口
      if (myExperiment) {
        console.log('myExperiment', myExperiment)
        that.setData({
          myExperiment: myExperiment,
          isloading: false
        }, () => {
          //设置当前周的课程
          that.setWeek()
        })
      } else {
        //本地无课表缓存，向接口请求课表
        that.get_my_class().then(function (res) {
          console.log(res)
          that.setWeek()
        })
      }
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
              weekIndex: res.data.data-1
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
  get_class: function () {
    var that = this
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/get_experiment',
      method: 'GET',
      header: {
        'Token': app.globalData.token,
      },
      success(res) {
        console.log(res.data)
        console.log(res.data.code)
        that.setData({
          myExperimentResult: res.data
        })
        if (res.data.code == '200') {
          console.log(res.data.msg)
          that.setData({
            myExperiment: res.data.data,
            isloading: false
          })
          wx.setStorageSync('myExperiment', res.data.data)
        }
        if (that.myExperimentResultReady) {
          that.myExperimentResultReady(res.data)
        }
      }
    })
  },

  get_my_class: function () {
    var that = this
    that.get_class()
    return new Promise(function (resolve, reject) {
      if (that.data.myExperimentResult) {
        console.log(that.data.myExperimentResult)
        var result = that.data.myExperimentResult
        if (result.code === '200') {
          wx.showToast({
            title: '获取课表成功',
          })
          resolve('get my class done')
        }
        else if (result.code === '1451') {
          that.login()
          if (that.data.loginResult) {
            var loginresult = that.data.loginResult
            console.log(loginresult)
            if (loginresult.code === '200') {
              that.get_class()
            }
            else {
              wx.showModal({
                title: '获取课表失败',
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
              }
              else {
                wx.showModal({
                  title: '获取课表失败',
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
            title: '获取课表失败',
            icon: 'none'
          })
          that.setData({
            isloading: false
          })
        }

      }
      else {
        that.myExperimentResultReady = result => {
          // console.log(result)
          if (result.code === '200') {
            wx.showToast({
              title: '获取课表成功',
            })
            resolve('get my class done')
          }

          else if (result.code === '1451') {
            that.login()
            if (that.data.loginResult) {
              var loginresult = that.data.loginResult
              console.log(loginresult)
              if (loginresult.code === '200') {
                that.get_class()
              }
              else {
                wx.showModal({
                  title: '获取课表失败',
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
                }
                else {
                  wx.showModal({
                    title: '获取课表失败',
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
              title: '获取课表失败',
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
      url: '/pages/service/service',
    })
  },
  chooseWeek: function (e) {
    var that = this
    var weekIndex = that.data.weekIndex
    that.setData({
      weekIndex: e.detail.value
    }, () => {
      that.setWeek()
    })

  },
  setWeek: function () {
    var that = this
    var weekIndex = that.data.weekIndex
    var weeknum = that.data.weekArray[weekIndex]
    // console.log(weeknum)
    var myExperiment = wx.getStorageSync('myExperiment')
    var theWeek = []
    for (var i = 0; i < myExperiment.length; i++) {
      // console.log(myExperiment[i].week_range)
      for (var j = 0; j < myExperiment[i].week_range.length; j++) {
        // console.log(myExperiment[i].week_range[j])
        if (myExperiment[i].week_range[j].length === 2) {
          // console.log(myExperiment[i].week_range[j])
          if (weeknum >= myExperiment[i].week_range[j][0] && weeknum <= myExperiment[i].week_range[j][1]) {
            // myExperiment.splice(i,1)
            // console.log(myExperiment[i].week_range)
            theWeek.push(myExperiment[i])
          }
          // console.log(myExperiment)
        }
        else if (myExperiment[i].week_range[j].length === 1) {
          if (weeknum === myExperiment[i].week_range[j][0]) {
            console.log(myExperiment[i].week_range)
            theWeek.push(myExperiment[i])
          }
        }
      }
    }
    that.setData({
      myExperiment: theWeek
    })
  }
})
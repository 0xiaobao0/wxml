const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  regist: regist,
  getUsernfo: getUsernfo,
  afterLoginMethod: afterLoginMethod,
  addArticalFever: addArticalFever,
  login: login,
  getToken: getToken,
  getMyMessage: getMyMessage,
  getLikeList: getLikeList
}

function getToken () {
  var that = this
  return new Promise(function (resolve, reject) {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code)
        wx.request({
          url: 'https://www.misakamiko.com/api/1.0/auth',
          method: 'POST',
          data: {
            code: res.code,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            console.log(res.data)
            var token = res.data.data.token
            if (token) {
              console.log('获取到token,已从失效态/未注册态，进入登录态/半登录态')
              var app = getApp()
              app.globalData.token = token
              wx.setStorageSync('Token', token)
              resolve(token)
            }
          }
        })
      }
    })
  })
}

function login () {
  var that = this
  var app = getApp()
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
}


function addArticalFever(articalIndex) {
  var that = this
  var app = getApp()
  console.log(articalIndex)
  wx.request({
    url: 'https://www.misakamiko.com/api/1.0/add_article_fever',
    header: {
      'Token': app.globalData.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    data: {
      articalId: articalIndex
    },
    success(res) {
      console.log(res.data.msg)
    }
  })
}

function regist (token) {
  var that = this
  var app = getApp()
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      success(res) {
        // console.log(res.rawData)
        wx.request({
          url: 'https://www.misakamiko.com/api/1.0/regist',
          header: {
            'Token': token,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          data: {
            rawData: res.rawData
          },
          success(res) {
            console.log(res)
            if (res.data.code === '1001') {
              console.log('用户注册成功')
              app.globalData.userInfo = res.data.data
              wx.setStorageSync('userInfo', res.data.data)
              resolve('regist regist success')
            }
            if (res.data.code === '1404') {
              resolve('user has exist')
              console.log('用户已存在')
            }
            if (res.data.code === '1405') {
              resolve('user exist faild')
              console.log('用户注册失败')
            }
          }
        })
      },
      fail(res) {
        wx.showModal({
          title: '获取用户信息失败',
          content: '请先前往【个人】页授权小程序获取您的基本信息',
        })
      }
    })
  })
}

function getUsernfo (token) {
  var that = this
  var app = getApp()
  return new Promise(function (resolve, reject) {
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/get_user_info',
      header: {
        'Token': token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success(res) {
        console.log(res)
        if (res.data.code === '1002') {
          console.log('获取用户信息成功，进入登录态')
          // console.log(app)
          app.globalData.userInfo = res.data.data
          wx.setStorageSync('userInfo', res.data.data)
          resolve('get userinfo sucess')
          if (that.userInfoReadyCallback) {
            that.userInfoReadyCallback(res.data.data)
          }
        }
        if (res.data.code === '1043') {
          // 用户尚未注册
          console.log('用户尚未注册')
          that.regist(token).then(function (res) {
            console.log(res)

            wx.request({
              url: 'https://www.misakamiko.com/api/1.0/get_user_info',
              header: {
                'Token': token,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success(res) {
                if (res.data.code === '1002') {
                  console.log('获取用户信息成功，进入登录态')
                  app.globalData.userInfo = res.data.data
                  wx.setStorageSync('userInfo', res.data.data)
                  resolve('regist regist success get userinfo success')
                }
              }
            })
          })
        }
        if (res.data.code === '1042') {
          // 获取用户信息失败
          resolve('get userinfo fail')
          console.log('获取用户信息失败')
        }

      }
    })
  })
}

function afterLoginMethod(token) {
  var that = this
  var app = getApp()
  //保存首次登陆用户信息后，建立socket连接，否则不建立socket连接
  var tokenList = []
  tokenList.push(token)
  var connectServerSocket = wx.connectSocket({
    url: 'wss://www.misakamiko.com:8001/ws/',
    protocols: tokenList,
    success: function (res) {
      console.log('WebSocket连接创建', res)
    },
    fail: function (err) {
      wx.showToast({
        title: '网络异常！',
      })
      console.log(err)
    },
  })
  // console.log(app.globalData)
  connectServerSocket.onMessage(function (res) {
    var data = JSON.parse(res.data)
    console.log(data)
    if(data.message_type === 'topic'){
      wx.showModal({
        title: data.message.title + '话题开放',
        content: data.message.content,
      })
    }
    if (data.message_type === 'artical_pass'){
      wx.showModal({
        title: '通知',
        content: '您的帖子已通过审核',
      })
    }
    if (data.message_type === 'comment_pass') {
      wx.showModal({
        title: '通知',
        content: '您的评论给已通过审核',
      })
    }
    app.globalData.myMessage.push(data)
    console.log(app.globalData.myMessage)
    // wx.setStorageSync('likeMessage', app.globalData.likeMessage)
  })
  connectServerSocket.onClose(function (res) {
    console.log('与服务器断开连接')
    app.globalData.connectServerSocket = 'close'
  })
  app.globalData.connectServerSocket = connectServerSocket
  // console.log(token)
  
}

function getMyMessage(){
  var that = this
  return new Promise(function(resolve, reject){
    var app = getApp()
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/get_my_message',
      method: 'GET',
      header: {
        'Token': app.globalData.token
      },
      success(res) {
        console.log('获取我的消息列表')
        // console.log(res.data.data)
        app.globalData.myMessage = res.data.data
        resolve(res.data.data)
      }
    })
  })
}

function getLikeList(){
  var that = this
  var app = getApp()
  return new Promise(function(resolve, reject){
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/like',
      method: 'GET',
      header: {
        'Token': app.globalData.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        // console.log(res.data)
        if (res.data.code === "1043") {
          console.log('获取用户点赞信息成功')
          app.globalData.articalLikeList = res.data.data
          resolve(res.data.data)
        }
        else {
          wx.showToast({
            title: '获取点赞失败',
            icon: 'none'
          })
        }
      }
    })
  })
}
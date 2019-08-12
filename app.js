//app.js
var util = require('/utils/util.js')
App({
  get_topic: function() {
    var that = this
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/topic',
      success(res){
        console.log(res.data.data)
        that.globalData.topic = res.data.data
      }
    }) 
  },

  reconnect: function() {
    console.log('尝试重新连接服务器')
    var that = this
    var tokenList = []
    tokenList.push(that.globalData.token)
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
    connectServerSocket.onMessage(function (res) {
      var data = JSON.parse(res.data)
      console.log(data)
      if (data.message_type === 'topic') {
        wx.showModal({
          title: data.message.title + '话题开放',
          content: data.message.content,
        })
      }
      if (data.message_type === 'artical_pass') {
        wx.showModal({
          title: data.message.title + '通知',
          content: '您的帖子已通过审核',
        })
      }
      if (data.message_type === 'comment_pass') {
        wx.showModal({
          title: data.message.title + '通知',
          content: '您的评论给已通过审核',
        })
      }
      app.globalData.myMessage.push(data)
      console.log(app.globalData.myMessage)
    })
    connectServerSocket.onClose(function (res) {
      console.log('与服务器断开连接')
      that.globalData.connectServerSocket = 'close'
    })
    that.globalData.connectServerSocket = connectServerSocket
  },

  verity_token: function(token) {
    var that = this
    return new Promise(function(resolve, reject){
      wx.request({
        url: 'https://www.misakamiko.com/api/1.0/verity_token',
        header: {
          'Token': token
        },
        success(res) {
          if (res.data.code === '1400') {
            console.log('token有效')
            that.globalData.token = token
            resolve(token)
          }
          if (res.data.code === '1401') {
            console.log('token失效，尝试重新获取')
            util.getToken().then(function (token) {
              console.log('重新获取成功,新的token为', token)
              resolve(token)
            })
          }
        }
      })
    })
  },

  main: function() {
    
    var that = this
    // that.globalData.likeMessage = wx.getStorageSync('likeMessage')
    var token = wx.getStorageSync('Token')
    console.log('本地缓存的token为' + token)
    that.get_topic()
    if (!token) {
      console.log('本地无token，重新获取token')
      // 登录
      util.getToken().then(function(token) {
        console.log(token)
        that.judgeauth().then(function (res) {
          console.log(res)
          util.getUsernfo(token).then(function(res){
            console.log(res)
            util.afterLoginMethod(token)
          })
        })
      })
    }
    else{
      // 验证本地token的有效性,验证完成后app.globalData.token即为有效的token
      that.verity_token(token).then(function(token){
        // 判断是否已经授权
        that.judgeauth().then(function (res) {
          console.log(res)
          util.getUsernfo(that.globalData.token).then(function (res) {
            console.log(res)
            util.afterLoginMethod(that.globalData.token)
          })
        })
      })
    }
  },
  judgeauth: function(){
    var that = this
    return new Promise(function(resolve, reject) {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {//授权了，可以获取用户信息了
            console.log('已授权')
            wx.getUserInfo({
              success: (res) => {
                console.log('获取到用户基本信息', res)
                that.globalData.wxuserinfo = res
                resolve('user has auth')
              }
            })
          } else {//未授权，跳到授权页面
            console.log('未授权')
            wx.reLaunch({
              url: '/pages/authpage/authpage',//授权页面
            })
          }
        },
        fail(res){
          console.log(res)
        }
      })
    })
  },


  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var that = this
    that.main()
  },

  onShow: function () {
    var that = this
    console.log('App onShow');
    if (that.globalData.connectServerSocket === 'close'){
      that.reconnect()
    }
  },

  onHide: function () {
    console.log('App onHide');

  },
  onError: function () {
    console.log('App onError');

  },
  
  globalData: {
    isready: false,
    wxuserinfo: null,
    isregist: false,
    userInfo: null,
    token: null,
    connectServerSocket: null,
    myMessage: [],
    articalLikeList: null,
    store: null,
    topic: null
  },

})
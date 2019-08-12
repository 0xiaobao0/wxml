const qiniuUploader = require("../../utils/qiniuUploader");
var util = require('../../utils/util.js')
var app = getApp()


// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'NCN', // 华北区
    uptokenURL: 'https://www.misakamiko.com/api/1.0/get_upload_token',
    // uptoken: 'xxx',
    domain: 'http://img.misakamiko.com',
    shouldUseQiniuFileName: false,
    token: '',
    key: '',
    navbarItemColor: 'white',
  };
  options.token = app.globalData.token
  qiniuUploader.init(options);
}

Page({
  data: {
    SettingImgUrl: '/images/setting.png',
    token: null,
    // motto: '这家伙很懒，什么也没留下',
    userInfo: {},
    articalList: null,
    hasUserInfo: false,
    hasArtical: false,
    hasMessage: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navbarActiveIndex: 0,
    navbarTitle: [
      "动态",
      "消息",
      "设置"
    ],
    img_arr: [],
    sexindex: 0,
    sexarray: ['未设置', '男', '女'],
    //院系数组
    multiArray: [
      ['计算机与通信工程学院', '经济学院', '管理学院', '控制工程学院', '外国语言文化学院', '数学与统计学院', '资源与材料学院'],
      ['计算机科学与技术', '通信工程', '电子信息工程', '物联网工程', '生物医学工程', '电子信息类', '计算机类']
    ],
    multiIndex: [0, 0],
    testList: '',
    windowWidth: null,
    navbarContainerHeight: [
      600,
      600,
      600
    ],
    college: null,
    major: null,

    // privateMessageObj: {
    //   message: '系统测试消息，当长度超出可显示范围后，显示省略号'
    // },
    // pravateUserObj: {
    //   avatarUrl: '/images/message/private_logo.png'
    // },
    sysMessageObj: {
      message: '系统通知测试'
    },
    sysUserObj: {
      avatarUrl: '/images/message/notice.png'
    },
    myMessage: [],
    articalLikeList: null,
    ageList: []
  },

  bindMultiPickerChange: function(e) {
    var that = this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/change_user_info',
      method: 'POST',
      data: {
        college_and_major: that.data.college + ' ' + that.data.major
      },
      header: {
        'Token': that.data.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        if (res.data.code === "1044") {
          console.log('修改院系成功')
          wx.showToast({
            title: '修改院系成功',
          })
          that.setData({
            userInfo: res.data.data
          }, () => {
            console.log(that.data.userInfo)
          })
        } else {
          wx.showToast({
            title: '修改院系失败',
          })
        }
      }
    })
  },
  bindMultiPickerColumnChange: function(e) {
    var that = this
    // console.log(e)
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['计算机科学与技术', '通信工程', '电子信息工程', '物联网工程', '生物医学工程', '电子信息类', '计算机类'];
            break;
          case 1:
            data.multiArray[1] = ['经济学', '金融学', '国际经济与贸易', '经济学类', ];
            break;
          case 2:
            data.multiArray[1] = ['信息管理与信息系统', '工商管理', '市场营销', '会计学', '行政管理', '工业工程', '电子商务', '工商管理类'];
            break;
          case 3:
            data.multiArray[1] = ['机械工程', '过程装备与控制', '车辆工程', '测控技术与仪器', '电气工程及其自动化', '自动化', '自动化类', '机械类'];
            break;
          case 4:
            data.multiArray[1] = ['英语', '日语', '外国语言与应用'];
            break;
          case 5:
            data.multiArray[1] = ['数学与应用数学', '信息与计算科学', '应用统计学', '数学类'];
            break;
          case 6:
            data.multiArray[1] = ['材料成型与控制工程', '材料科学与工程', '冶金工程', '功能材料', '资源勘查工程', '环境工程', '环境科学', '材料类'];
            break;
        }
        data.multiIndex[1] = 0;
        that.setData({
          college: data.multiArray[0][e.detail.value],
          major: data.multiArray[1][0]
        }, () => {
          console.log(that.data.college, that.data.major)
        })
        break;
      case 1:
        that.setData({
          major: data.multiArray[1][e.detail.value]
        }, () => {
          console.log(that.data.college, that.data.major)
        })
    }
    // console.log(data.multiArray)
    if (!that.data.college) {
      that.setData({
        college: data.multiArray[0][0]
      }, () => {
        console.log(that.data.college, that.data.major)
      })
    }
    if (!that.data.major) {
      that.setData({
        major: data.multiArray[1][0]
      }, () => {
        console.log(that.data.college, that.data.major)
      })
    }
    this.setData(data)
    // console.log(that.data);


  },
  main: function(){
    var that = this
    var ageList = []
    var page = 1
    for (var i = 0; i < 100; i++) {
      ageList[i] = i
    }
    that.setData({
      ageList: ageList
    })

    if (app.globalData.userInfo) {
      console.log('从本地缓存获取用户信息')
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        hasUserInfo: true
      })
    }
    else {
      console.log('未获取到用户信息')
      var that = this;
      util.getUsernfo(app.globalData.token).then(function (res) {
        console.log(res)
        if (res == 'regist regist success get userinfo success' || res == 'get userinfo sucess') {
          that.setData({
            hasUserInfo: true,
            userInfo: app.globalData.userInfo
          })
        }
        util.afterLoginMethod(app.globalData.token)
      })
    }

    var token = app.globalData.token
    that.setData({
      token: token
    })
    util.getLikeList().then(function (articalLikeList) {
      console.log(articalLikeList)
      that.setData({
        articalLikeList: articalLikeList
      }, () => {
        that.getArticalList(page)
      })
    })
    util.getMyMessage().then(function (myMessage){
      // console.log(myMessage)
      if(myMessage.length>0){
        console.log('有消息')
        that.setData({
          myMessage: myMessage,
          hasMessage: true
        })
      }
      else {
        that.setData({
          myMessage: [],
          hasMessage: false
        })
      }
    })
  },
  onLoad: function(options) {
    var that = this
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          that.main()
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    var page = 1
    var token = app.globalData.token
    that.refreshUserinfo()
    util.getLikeList().then(function (articalLikeList) {
      console.log(articalLikeList)
      that.setData({
        articalLikeList: articalLikeList
      }, () => {
        that.getArticalList(page)
      })
    })
    util.getMyMessage().then(function (myMessage) {
      console.log(myMessage)
      if (myMessage.length > 0) {
        console.log('有消息')
        that.setData({
          myMessage: myMessage,
          hasMessage: true
        })
      }
      else{
        that.setData({
          myMessage: [],
          hasMessage: false
        })
      }
    })
  },


  getUserInfo: function(e) {
    console.log(e)
    if (e.detail.userInfo) {//点击了“允许”按钮，
      var that = this;
      app.globalData.wxuserinfo = e.detail.userInfo
      util.getUsernfo(app.globalData.token).then(function (res) {
        console.log(res)
        if(res == 'regist regist success get userinfo success' || res == 'get userinfo sucess'){
          that.setData({
            hasUserInfo: true,
            userInfo: app.globalData.userInfo,
          })
        }
        util.afterLoginMethod(app.globalData.token)
        that.main()
      })
    }
  },

  onNavBarTap: function(event) {
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: navbarTapIndex,
      navbarItemColor: '#fafafa'
    })
  },
  onBindAnimationFinish: function({
    detail
  }) {
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: detail.current
    })
  },


  refreshUserinfo: function() {
    var that = this
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/get_user_info',
      header: {
        'Token': app.globalData.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success(res) {
        // console.log(res.data.data)
        if (res.data.code === '1002') {
          console.log('刷新用户信息成功')
          app.globalData.userInfo = res.data.data
          wx.setStorageSync('userInfo', res.data.data)
          that.setData({
            userInfo: res.data.data
          }, () => {
            wx.stopPullDownRefresh()
          })
        }
        if (res.data.code === '1042') {
          console.log('刷新用户信息失败')
          wx.stopPullDownRefresh()
        }

      }
    })
  },
  getArticalList: function (page) {
    var that = this
    var offset = 12*(page -1)
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/get_my_artical_list?limit=12&&offset=' + offset,
      method: 'GET',
      header: {
        'Token': app.globalData.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code === "1041") {
          console.log(res.data.data)
          console.log('获取我的文章列表成功')
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].imgurl == '' || res.data.data[i].imgurl == null) {
              res.data.data[i].imgurl = null
            }
            else {
              res.data.data[i].imgurl = res.data.data[i].imgurl.split(",")
            }
          }
          if (res.data.data.length != 0) {
            that.setData({
              hasArtical: true,
            })
          }
          that.setData({
            articalList: res.data.data,
            testList: 'asd'
          }, () => {
            wx.getSystemInfo({
              success: function(res) {
                // console.log(res.windowWidth) // 获取可使用窗口高度
                // console.log(typeof (that.data.articalList))
                // console.log(that.data.articalList)
                var query = wx.createSelectorQuery();
                //选中需要改变区域对应的class名称

                query.select('.myArtical').boundingClientRect(function(rect) {
                  // console.log('当前myArtical宽度为：' + rect.width)
                  // console.log('当前myArtical高度为：' + rect.bottom)
                  // console.log(rect)
                  var navbarContainerHeight = that.data.navbarContainerHeight
                  if (rect.bottom != 0) {
                    navbarContainerHeight[0] = (rect.bottom) * 750 / res.windowWidth
                    that.setData({
                      navbarContainerHeight: navbarContainerHeight,
                    })
                  }

                }).exec();
                query.select('.my-message').boundingClientRect(function(rect) {
                  // console.log('my-message' + rect.height)
                  var item = that.data.navbarContainerHeight
                  item[1] = rect.height * 750 / res.windowWidth
                  if (item[1] > 600) {
                    that.setData({
                      navbarContainerHeight: item
                    })
                  }

                }).exec();

              }
            })

          })
        }
      }
    })
  },
  go_to_change_page: function() {
    wx.navigateTo({
      url: '/pages/changeuserinfo/changeuserinfo',
    })
  },
  go_to_bind_studentid_page: function() {
    wx.navigateTo({
      url: '/pages/bindstudentid/bindstudentid'
    })
  },
  sexPickerChange: function(e) {
    var that = this
    console.log(e.detail)
    // console.log(that.data.token)
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/change_user_info',
      method: 'POST',
      data: {
        gender: parseInt(e.detail.value)
      },
      header: {
        'Token': that.data.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        if (res.data.code === "1044") {
          console.log('修改性别成功')
          wx.showToast({
            title: '修改性别成功',
          })
          that.setData({
            userInfo: res.data.data
          }, () => {
            console.log(that.data.userInfo)
          })
        } else {
          wx.showToast({
            title: '修改性别失败',
          })
        }
      }
    })

  },
  changeimgurl: function() {
    initQiniu();
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {

              wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                success: function (res) {
                  that.setData({
                    img_arr: that.data.img_arr.concat(res.tempFilePaths),
                  }, () => {
                    that.uploadimg()
                  })

                }
              })

          }
          else if (res.tapIndex == 1) {

              wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['camera'],
                success: function(res) {
                  console.log(that.data.img_arr)
                  that.setData({
                    img_arr: that.data.img_arr.concat(res.tempFilePaths)
                  }, () => {
                    console.log(that.data.img_arr)
                    that.uploadimg()
                  })
                }
              })

          }
        }
      }
    })

  },
  uploadimg: function() {
    var that = this
    var filePath = that.data.img_arr;
    console.log(filePath)
    var state = 0;
    var imageUrl = []
    // 交给七牛上传
    for (var i = 0; i < filePath.length; i++) {
      qiniuUploader.upload(filePath[i], (res) => {
        // console.log('第'+ i +'张图片上传完成')
        state++;
        imageUrl.push(res.imageURL)
        if (state == filePath.length) {
          console.log(imageUrl)
          wx.request({
            url: 'https://www.misakamiko.com/api/1.0/change_user_info',
            method: 'POST',
            data: {
              avatarUrl: imageUrl,
            },
            header: {
              'Token': that.data.token,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log(res)
              if (res.data.code === "1044") {
                wx.showToast({
                  title: '修改头像成功'
                })
                // console.log('asd')
                that.setData({
                  userInfo: res.data.data,
                  img_arr: []
                })
              }
            }
          })
        }

        // console.log(imageUrl)
      }, (error) => {
        console.error('error: ' + JSON.stringify(error));
        wx.showModal({
          title: '图片上传失败',
          content: '请重新尝试',
          showCancel: false,
        })
      },
        null, // 可以使用上述参数，或者使用 null 作为参数占位符
        (progress) => {
          console.log('上传进度', progress.progress)
          console.log('已经上传的数据长度', progress.totalBytesSent)
          console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
        },
      );
    }
  },

  write: function() {
    if(!app.globalData.topic){
      wx.showModal({
        title: '再等等吧',
        content: '相关话题暂未开放，再等等吧'
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/first/write/write'
      })
    }
  },
  changeAge: function(e) {
    var that = this
    console.log('修改年龄为：', e.detail.value)
    // console.log(that.data.token)
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/change_user_info',
      method: 'POST',
      data: {
        age: parseInt(e.detail.value)
      },
      header: {
        'Token': that.data.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        if (res.data.code === "1044") {
          console.log('修改年龄成功')
          wx.showToast({
            title: '修改年龄成功',
          })
          that.setData({
            userInfo: res.data.data
          }, () => {
            console.log(that.data.userInfo)
          })
        } else {
          wx.showToast({
            title: '修改年龄失败',
          })
        }
      }
    })
  },
  clean_storage: function() {
    wx.showModal({
      title: '确定清除吗',
      content: '该操作将清除本地课表，课设，实验课表缓存',
      success(res){
        if (res.confirm) {
          wx.setStorageSync('logs', null)
          wx.setStorageSync('myClass', null)
          wx.setStorageSync('myClassdesign', null)
          wx.setStorageSync('myExperiment', null)
        }
      }
    })
  }
})
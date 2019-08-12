const qiniuUploader = require("../../../utils/qiniuUploader");
// pages/write/write.js
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
    isloading: false
  };
  options.token = app.globalData.token
  qiniuUploader.init(options);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    token: '',
    img_wrapper: 0,
    title: '',
    artical: '',
    artical_ength: 0,
    imageObject: {},
    img_arr: [],
    uploadimg: null,
    tag: '',
    public: 0,
    formdata: {},
    loading: false,
    topic: '',
    // artical_height: 0,
    // keyboard_height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var query = wx.createSelectorQuery();
    //选中需要改变区域对应的class名称
    var that = this;

    query.select('.img-area').boundingClientRect(function (rect) {
      console.log('当前img-area高度为：' + rect.height)
      that.setData({
        img_wrapper: rect.height * 0.9,
        userinfo: app.globalData.userInfo,
        token: app.globalData.token
      })
    }).exec();
    that.setData({
      topic: app.globalData.topic
    })

  },
  didPressChooesImage: function () {
    var that = this;
    didPressChooesImage(that);
  },
  didCancelTask: function () {
    this.data.cancelTask()
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

  /**
   * 将软键盘页面底部撑起
   */
  rise_bottom: function(event) {
    //获取软键盘的高度
    console.log(event)
    console.log('软键盘高度为：' + event.detail.height)
    var query = wx.createSelectorQuery();
    //选中需要改变区域对应的class名称
    var that = this;
    query.select('.artical-area').boundingClientRect(function(rect) {
      that.setData({
        artical_height: rect.height - event.detail.height,
        keyboard_height: event.detail.height
      })
    }).exec();
  },

  reduce_bottom: function(event) {
    console.log(event)
    var query = wx.createSelectorQuery();
    //选中需要改变区域对应的class名称
    var that = this;
    query.select('.artical-area').boundingClientRect(function(rect) {

      var keyboard_height = that.data.keyboard_height
      console.log('获取的软键盘高度为：' + keyboard_height)
      that.setData({
        artical_height: rect.height + keyboard_height,
      })
    }).exec();
  },

  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  chooseimage: function () {
    initQiniu();
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            if (that.data.img_arr.length < 6){
              wx.chooseImage({
                count: 6,
                sizeType: ['original', 'compressed'],
                success: function (res) {
                  that.setData({
                    img_arr: that.data.img_arr.concat(res.tempFilePaths),
                    imageObject: res
                  })
                  
                }
              })
            } else {
              wx.showToast({
                title: '最多上传6张图片',
                icon: 'loading',
                duration: 3000
              });
            }
          } else if (res.tapIndex == 1) {
            if (that.data.img_arr.length < 6) {
              wx.chooseImage({
                count: 6,
                sizeType: ['original', 'compressed'],
                sourceType: ['camera'],
                success: function (res) {
                  that.setData({
                    img_arr: that.data.img_arr.concat(res.tempFilePaths)
                  })
                }
              })
            } else {
              wx.showToast({
                title: '最多上传6张图片',
                icon: 'loading',
                duration: 3000
              });
            }
          }
        }
      }
    })

  },


  // add_img: function() {
  //   var that = this;
  //   if (this.data.img_arr.length < 6) {
  //     wx.chooseImage({
  //       count: 6,
  //       sizeType: ['original', 'compressed'],
  //       sourceType: ['album', 'camera'],
  //       success: function(res) {
  //         that.setData({
  //           img_arr: that.data.img_arr.concat(res.tempFilePaths)
  //         })
  //       }
  //     })
  //   } else {
  //     wx.showToast({
  //       title: '最多上传6张图片',
  //       icon: 'loading',
  //       duration: 3000
  //     });
  //   }
  // },
  cancelImg: function (e) {
    var that = this;
    var imgs = that.data.img_arr;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    console.log('第'+ index +'张图片');
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          imgs.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          img_arr: imgs
        });
      }
    })
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var that = this;
    var imgs = that.data.img_arr;

    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  // switchChange: function (e) {
  //   var that = this
  //   // console.log(e.detail.value)
  //   if (e.detail.value === true) {
  //     that.setData({
  //       public: 0
  //     })
  //   }
  //   if (e.detail.value === false) {
  //     that.setData({
  //       public: 1
  //     })
  //   }
  // },

  // titleInput: function(e) {
  //   var that = this
  //   that.setData({
  //     title: e.detail.value
  //   })
  // },

  articalInput: function (e) {
    var that = this
    that.setData({
      artical: e.detail.value,
      artical_ength: e.detail.value.length
    })
  },

  // tagInput: function (e) {
  //   var that = this
  //   that.setData({
  //     tag: e.detail.value
  //   })
  // },

  postartical: function() {
    var that = this
    var data = []
    if (that.data.uploadimg){
      data = {
        title: that.data.title,
        artical: that.data.artical,
        imgurl: that.data.uploadimg,
        // tag: that.data.tag,
        // public: that.data.public
      }
    }
    else{
      data = {
        title: that.data.title,
        artical: that.data.artical,
      }
    }
    wx.request({
      url: 'https://www.misakamiko.com/api/1.0/artical',
      method: 'POST',
      data: data,
      header: {
        'Token': that.data.token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        if (res.data.code === "1010") {
          wx.showModal({
            title: '发表成功！',
            content: '请等待审核，我们会在一个工作日内给您答复',
            showCancel: false,
          })
          that.setData({
            isloading:false
          })
        }
      }
    })
  },

  commit: function () {
    var that = this
    that.setData({
      isloading: true
    }, () => {
      if (that.data.artical === '') {
        wx.showModal({
          title: '小贴士',
          content: '在正文区写点什么吧',
          showCancel: false,
        })
      }
      else {
        var filePath = that.data.img_arr;
        // console.log(filePath)
        if (filePath.length > 0) {
          var state = 0;
          var imageUrl = []
          // 交给七牛上传
          for (var i = 0; i < filePath.length; i++) {
            qiniuUploader.upload(filePath[i], (res) => {
              // console.log('第'+ i +'张图片上传完成')
              state++;
              imageUrl.push(res.imageURL)
              if (state == filePath.length) {
                that.setData({
                  uploadimg: imageUrl
                }, () => {
                  that.postartical()
                })
                console.log(imageUrl)
              }
              // console.log(imageUrl)
            }, (error) => {
              console.error('error: ' + JSON.stringify(error));
              wx.showModal({
                title: '图片上传失败',
                content: '请重新尝试',
                showCancel: false,
              })
              that.setData({
                isloading: false
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
        }
        else {
          that.setData({
            uploadimg: null
          }, () => {
            that.postartical()
          })

        }
      }
    })

  }
})


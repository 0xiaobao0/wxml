var util = require('../../utils/util.js')
// components /articalDisplay/articalDisplay.js
Component({
  /**
   * 组件的属性列表
   * 可以理解为通过组件示例绑定的数据
   */
  properties: {
    articalObj: {
      type: Object,
      value: {}
    },
    articalIndex:{
      type: Number,
      value: null
    },
    testStr: {
      type: String,
      value: '',
    },
    token: {
      type: String,
      value: ''
    },
    articalLikeList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   * 可以理解为组件本身的数据
   */
  data: {
    articalObj: {},
    testStr: '',
    articalIndex: null,
    like: 0,
    likeImgUrl: '/images/like.png',
    articalLikeList: null,
    showCommentArea: false,
    articalComment: [],
    comment_content: '',
    showImageArea: true,
    topic: '',
    // maxheight: '125rpx'
  },


  /**
   * 组件生命周期
   */
  lifetimes: {
    created() {
      // var that = this
      // console.log(that.properties.articalIndex)
      

    },
    attached() {
      // 在组件实例进入页面节点树时执行
      var that =this
      var that = this
      var app = getApp()
      // console.log(app.globalData.topic)
      that.setData({
        topic: app.globalData.topic
      })

      // console.log(that.properties.articalObj)
      // console.log(that.properties.articalLikeList)
      for (var i = 0; i < that.properties.articalLikeList.length; i++){
        // console.log(that.properties.articalLikeList[i])
        if (that.properties.articalLikeList[i] === that.properties.articalIndex) {
          that.setData({
            like: 1,
            likeImgUrl: '/images/likes.png'
          })
          
        }
      }
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached() {
    // 在组件实例进入页面节点树时执行
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },


  /**
   * 组件的方法列表
   */
  methods: {
    show_image_error: function (event) {
      console.log(event.errMsg)
    },
    previewImg: function (e) {
      //获取当前图片的下标
      var that = this
      console.log(e)
      var articalIndex = e.currentTarget.dataset.articalindex;
      var imgIndex = e.currentTarget.dataset.imgindex;
      console.log('第' + articalIndex + '篇文章' + '第' + imgIndex + '张图片')
      //所有图片
      var that = this;
      console.log(that.data.articalObj)
      var imgs = that.data.articalObj.imgurl;
      // console.log(imgs)

      wx.previewImage({
        //当前显示图片
        current: imgs[imgIndex],
        //所有图片
        urls: imgs
      })
      util.addArticalFever(that.data.articalIndex)
      
    },
    like_function: function (e) {
      // console.log(e.currentTarget.dataset)
      var that = this  
      // console.log(that.properties)
      var articalId = e.currentTarget.dataset.articalid
      
      if (that.data.like === 0) {
        that.setData({
          like: 1,
          likeImgUrl: '/images/likes.png'
        }, () => {
          var likeState = that.data.like
          wx.request({
            url: 'https://www.misakamiko.com/api/1.0/like',
            method: 'POST',
            data: {
              articalId: articalId,
              likeState: likeState
            },
            header: {
              'Token': that.properties.token,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log(res.data)
              if(res.data.code === "1042"){
                wx.showToast({
                  title: '点赞成功',
                })
                util.addArticalFever(that.data.articalIndex)
              }
              else{
                wx.showModal({
                  title: '点赞失败',
                  content: '请稍后再试',
                })
              }
            }
          })
        })
      }
      else if (that.data.like === 1) {
        that.setData({
          like: 0,
          likeImgUrl: '/images/like.png'
        }, () => {
          var likeState = that.data.like
          // console.log(likeState)
          wx.request({
            url: 'https://www.misakamiko.com/api/1.0/like',
            method: 'POST',
            data: {
              articalId: articalId,
              likeState: likeState
            },
            header: {
              'Token': that.properties.token,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log(res.data)
              if(res.data.code === "1042"){
                wx.showToast({
                  title: '取消点赞成功',
                })
              }
              else{
                wx.showModal({
                  title: '取消点赞失败',
                  content: '请稍后再试',
                })
              }
            }
          })
        })
      }
      
    },
    open_comment_function: function (e) {
      var that = this
      var articalId = that.properties.articalIndex
      wx.request({
        url: 'https://www.misakamiko.com/api/1.0/get_comment',
        method: 'POST',
        data: {
          articalId: articalId,
        },
        header: {
          'Token': that.properties.token,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success(res){
          console.log(res.data)
          if(res.data.code === '1041'){
            that.setData({
              articalComment: res.data.data
            }, () => {
              console.log(that.data.articalComment)
            })
          }
          else{
            wx.showModal({
              title: '获取文章评论失败',
              content: '请稍后再试',
            })
          }
        }
      })
      that.setData({
        showCommentArea: true
      })
    },

    get_comment_value: function (e) {
      var that = this
      that.setData({
        comment_content: e.detail.value
      })
    },

    comment_function: function (e) {
      var that = this
      var articalId = that.properties.articalIndex
      if (that.data.comment_content){
        wx.request({
          url: 'https://www.misakamiko.com/api/1.0/post_comment',
          method: 'POST',
          data: {
            belong_to: articalId,
            comment_type: 0,
            comment_to_obj: articalId,
            content: that.data.comment_content
          },
          header: {
            'Token': that.properties.token,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            console.log(res.data)
            if (res.data.code === '1030') {
              wx.showModal({
                title: '评论发表成功',
                content: '请等待审核，我们会在一个工作日内给您答复',
              })
              that.setData({
                comment_content: ''
              })
              util.addArticalFever(that.data.articalIndex)
            }
            else {
              wx.showModal({
                title: '发表评论失败',
                content: '请稍后再试',
              })
            }
          }
        })
      }
      else{
        wx.showToast({
          title: '请输入评论',
          icon: 'none'
        })
      }

    },

    close_comment_function: function (e) {
      console.log(e)
      var that = this
      that.setData({
        showCommentArea: false
      })
    },

    onShareAppMessage: function (ops) {
      console.log(ops.target)
      if (ops.from === 'button') {
        // 来自页面内转发按钮
        console.log(ops.target)
      }
      return {
        title: '测试转发',
        path: 'pages/first/first',
        success: function (res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }

    },
    // show_all_content: function() {
    //   this.setData({
    //     maxheight: 'auto'
    //   })
    //   util.addArticalFever(this.data.articalIndex)
    // }
  }
})

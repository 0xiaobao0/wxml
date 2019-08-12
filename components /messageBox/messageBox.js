// components /messageBox/messageBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageType: {
      type: String,
      value: ''
    },
    messageObj: {
      type: String,
      value: null
    },
    userObj: {
      type: Object,
      value: null
    },
    messageIndex: {
      type: Number,
      value: null
    },
    createTime: {
      type: String,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    messageType: 'test',
  },

  lifetimes: {
    created() {


    },
    attached() {
      // 在组件实例进入页面节点树时执行
      var that = this
      // console.log(that.properties.userObj)
      // console.log(that.properties)
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

  }
})

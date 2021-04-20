import wxbarcode from 'wxbarcode'

// components/code/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    async getQrcode(code, width, height) {
      if (!width) {
        width = 420
      }
      if (!height) {
        height = 420
      }
      wxbarcode.qrcode('qrcode', code, 420, 420)
    },
  },
})

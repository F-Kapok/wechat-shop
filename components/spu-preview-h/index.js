// components/spu-preview-h/index.js
Component({
  externalClasses: ['l-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    spu: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onItemTap(event) {
      wx.navigateTo({
        url: `/pages/detail/detail?pid=${this.properties.spu.id}`
      });
    }
  }
})

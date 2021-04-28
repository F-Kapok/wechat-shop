// components/my-banner/index.js
import { User } from '../../models/user'
import { promisic } from '../../utils/util'
import { showToast } from '../../utils/ui'
import { config } from '../../config/config'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    couponCount: Number,
    integral: Number,
    count: Number,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showLoginBtn: false,
    couponCount: Number,
    integral: Number,
    count: Number,
  },

  lifetimes: {
    async attached() {
      console.log(this.hasAuthUserInfo())
      if (!(await this.hasAuthUserInfo())) {
        this.setData({
          showLoginBtn: true,
        })
      }
    },
  },

  observers: {
    couponCount: function (couponCount) {},
    integral: function (integral) {},
    count: function (count) {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async onAuthUserInfo(event) {
      // console.log(event.detail);
      if (event.detail.userInfo) {
        const success = await User.updateUserInfo(event.detail.userInfo)
        this.setData({
          showLoginBtn: false,
        })
      }
    },

    async getPhoneNumber(event) {
      if (event.detail.errMsg === 'getPhoneNumber:fail user deny') {
        showToast('user deny')
      } else {
        const r = await wx.login()
        const code = r.code
        const res = await promisic(wx.request)({
          url: config.apiBaseUrl + '/token/mobile',
          method: 'POST',
          data: {
            code: code,
            data: event.detail.encryptedData,
            iv: event.detail.iv,
          },
        })
        wx.navigateTo({
          url: `/pages/code/code?mobile=` + res.data.phone_number,
        })
      }
    },

    onGotoQrcode(event) {
      wx.navigateTo({
        url: `/pages/code/code`,
      })
    },

    async hasAuthUserInfo() {
      const setting = await promisic(wx.getSetting)()
      const userInfo = setting.authSetting['scope.userInfo']
      return !!userInfo
    },

    onGotoMyCoupon(event) {
      wx.navigateTo({
        url: `/pages/my-coupon/my-coupon`,
      })
    },

    aboutUs(event) {
      // wx.navigateTo({
      //   url: `/pages/about/about`
      // });
    },
  },
})

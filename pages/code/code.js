// pages/code/code.js
var wxbarcode = require('../../utils/code/index.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    mobile: '',
    setInter: '',
    text: '本会员码60s自动刷新一次',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let time = this.nowTime() + ' '
    this.setData({
      mobile: options.mobile,
      code: options.mobile + time,
    })
    wxbarcode.barcode('barcode', this.data.mobile + time, 680, 200)
    wxbarcode.qrcode('qrcode', this.data.mobile + time, 420, 420)
    this.data.setInter = setInterval(() => {
      time = this.nowTime() + ' '
      this.setData({
        code: this.data.mobile + time,
      })
      wxbarcode.barcode('barcode', this.data.mobile + time, 680, 200)
      wxbarcode.qrcode('qrcode', this.data.mobile + time, 420, 420)
    }, 60000)
  },

  nowTime() {
    //获取当前时间
    let now = new Date()
    let _month =
      10 > now.getMonth() + 1 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
    let _day = 10 > now.getDate() ? '0' + now.getDate() : now.getDate()
    let _hour = 10 > now.getHours() ? '0' + now.getHours() : now.getHours()
    let _minute =
      10 > now.getMinutes() ? '0' + now.getMinutes() : now.getMinutes()
    let _second =
      10 > now.getSeconds() ? '0' + now.getSeconds() : now.getSeconds()
    return now.getFullYear() + _month + _day + _hour + _minute + _second
    // (
    //   now.getFullYear() +
    //   '-' +
    //   _month +
    //   '-' +
    //   _day +
    //   ' ' +
    //   _hour +
    //   ':' +
    //   _minute +
    //   ':' +
    //   _second
    // )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.setInter)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.setInter)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})

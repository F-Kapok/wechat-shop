import { Theme } from "../../models/theme";

// pages/theme/theme.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _noResource: false,
    _theme: null,
    _tplName: '',
    forYouData: null,
    logo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const tname = options.tname;
    // console.log(tname);
    wx.lin.showLoading({
      color: '#157658',
      type: 'flash',
      fullScreen: true
    });
    const theme = await Theme.getThemeSpuByName(tname)
    const forYouData = await Theme.getForYou();
    wx.lin.renderWaterFlow(forYouData.spu_list, true);
    this.setData({
      _theme: theme,
      _tplName: theme.tpl_name,
      forYouData
    });
    wx.lin.hideLoading();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      logo: true
    });
  }
})
// pages/theme-spu-list/theme-spu-list.js
import { Theme } from "../../models/theme";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    empty: false,
    paging: null,
    loading: true,
    loadingType: 'loading',
    topImg: String,
    logo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.lin.showLoading({
      color: '#157658',
      type: 'flash',
      fullScreen: true
    });
    const tName = options.tname;
    this.initThemeData(tName);
    wx.lin.hideLoading();
  },

  async initThemeData(tName) {
    const data = await Theme.getThemeSpuByName(tName);
    if (data && data.spu_list.length !== 0) {
      // console.log(data.spu_list);
      wx.lin.renderWaterFlow(data.spu_list);
      this.setData({
        loadingType: 'end',
        topImg: data.internal_top_img,
        descriptions: this.splitDescription(data.description)
      });
    } else {
      this.empty();
    }
  },

  empty() {
    wx.lin.showEmptyScreen({
      text: '该分类暂时还没有商品'
    });
  },

  splitDescription(description) {
    if (!description) {
      return [];
    }
    // console.log(description.split('#'));
    return description.split('#');
  },

  onLoadImg(event) {
    const { height, width } = event.detail;
    // console.log(height, width);
    this.setData({
      h: height,
      w: width,
    });
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
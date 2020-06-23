import { Cart } from "../../models/cart";
import { Calculator } from "../../models/caculator";
import { SpuPaging } from "../../models/spu-paging";

// pages/cart/cart.js
const cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartItems: [],
    isEmpty: false,
    allChecked: false,
    totalPrice: 0,
    totalSkuCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const cartData = await cart.getAllSkuFromServer();
    this.setData({
      cartItems: cartData.items
    });
    this.initBottomSpuList();
  },

  async initBottomSpuList() {
    const paging = SpuPaging.getLatestPaging();
    //FIXME const paging = SpuPaging.getHotPaging();
    this.data.spuPaging = paging;
    const data = await paging.getMoreData();
    if (!data) {
      return;
    }
    wx.lin.renderWaterFlow(data.items);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const cartItems = cart.getAllCartItemFromLocal().items;
    if (cart.isEmpty()) {
      this.empty();
      return;
    }
    this.setData({
      cartItems: cartItems
    });
    this.notEmpty();
    this.isAllChecked();
    this.refreshCartData();
  },
  /**
   * 实时计算购物车中的商品总价
   */
  refreshCartData() {
    const checkedItems = cart.getCheckedItems();
    const calculator = new Calculator(checkedItems);
    calculator.calc();
    this.setCalcData(calculator);
  },
  /**
   * 监听修改数量后价格实时更新
   * @param {Event} event 
   */
  onCountFloat(event) {
    this.refreshCartData();
  },
  /**
   * 设置计算价格
   * @param {Calculator} calculator 
   */
  setCalcData(calculator) {
    const totalPrice = calculator.getTotalPrice()
    const totalSkuCount = calculator.getTotalSkuCount()
    this.setData({
      totalPrice,
      totalSkuCount
    })
  },
  /**
   * 是否全选
   */
  isAllChecked() {
    const allChecked = cart.isAllChecked();
    this.setData({
      allChecked
    });
  },
  /**
   * 单个checkBox判断是否全选
   * @param {Event} event 
   */
  onSingleCheck(event) {
    this.isAllChecked();
    this.refreshCartData();
  },
  /**
   * 删除item判断是否全选
   * @param {Event} event 
   */
  onDeleteItem(event) {
    this.isAllChecked();
    this.refreshCartData();
  },
  /**
   * 将购物车中的商品进行全选或非全选
   * @param {Boolean} checked 
   */
  onCheckAll(event) {
    const checked = event.detail.checked;
    cart.checkAll(checked);
    this.setData({
      cartItems: this.data.cartItems
    });
    this.refreshCartData();
  },
  empty() {
    this.setData({
      isEmpty: true
    });
    wx.hideTabBarRedDot({
      index: 2
    })
  },
  notEmpty() {
    this.setData({
      isEmpty: false
    });
    wx.showTabBarRedDot({
      index: 2
    })
  },
  onSettle(event) {
    if (this.data.totalSkuCount <= 0) {
      return;
    }
    wx.navigateTo({
      url: `/pages/order/order`
    });
  },
  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: async function () {
    const data = await this.data.spuPaging.getMoreData();
    if (!data) {
      return;
    }
    wx.lin.renderWaterFlow(data.items);
    if (!data.moreData) {
      this.setData({
        loadingType: 'end'
      })
    }
  },
})
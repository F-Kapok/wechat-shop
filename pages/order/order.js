// pages/order/order.js
import { Cart } from "../../models/cart";
import { Sku } from "../../models/sku";
import { Order } from "../../models/order";
import { Coupon } from "../../models/coupon";
import { OrderItem } from "../../models/order-item";
import { CouponBO } from "../../models/coupon-bo";
import { CouponOperate, ShoppingWay } from "../../core/enum";
import { OrderPost } from "../../models/order-post";
import { Payment } from "../../models/payment";
import { showToast } from "../../utils/ui";

const cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentCouponId: null,
    order: null,
    totalPrice: 0,
    finalTotalPrice: 0,
    discountMoney: 0,
    address: null,
    submitBtnDisable: false,
    orderFail: false,
    orderFailMsg: '',
    shoppingWay: ShoppingWay.BUY,
    isOk: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let orderItems;
    let localItemCount;
    const shoppingWay = options.way;
    this.data.shoppingWay = shoppingWay;
    if (shoppingWay === ShoppingWay.BUY) {
      const skuId = options.sku_id;
      const count = options.count;
      orderItems = await this.getSingleOrderItems(skuId, count);
      localItemCount = 1;
    } else {
      const skuIds = cart.getCheckedSkuIds();
      orderItems = await this.getCartOrderItems(skuIds);
      localItemCount = skuIds.length;
    }
    const order = new Order(orderItems, localItemCount);
    this.data.order = order;
    try {
      order.checkOrderIsOk();
    } catch (e) {
      console.error(e);
      this.setData({
        isOk: false
      });
      return;
    }
    const coupons = await Coupon.getMySelfWithCategory();
    const couponBOList = this.packageCouponBOList(coupons, order);
    this.setData({
      orderItems,
      couponBOList,
      totalPrice: order.getTotalPrice(),
      finalTotalPrice: order.getTotalPrice()
    });
  },

  async getSingleOrderItems(skuId, count) {
    const skus = await Sku.getSkusByIds(skuId);
    return [new OrderItem(skus[0], count)];
  },

  async getCartOrderItems(skuIds) {
    // 同步最新的SKU数据
    const skus = await Sku.getSkusByIds(skuIds)
    const orderItems = this.packageOrderItems(skus)
    return orderItems
  },

  packageOrderItems(skus) {
    return skus.map(sku => {
      const count = cart.getSkuCountBySkuId(sku.id);
      return new OrderItem(sku, count);
    });
  },

  packageCouponBOList(coupons, order) {
    return coupons.map(coupon => {
      const couponBO = new CouponBO(coupon);
      couponBO.meetCondition(order);
      return couponBO;
    })
  },

  onChooseCoupon(event) {
    const couponObj = event.detail.coupon;
    const couponOperate = event.detail.operate;

    if (couponOperate === CouponOperate.PICK) {
      this.data.currentCouponId = couponObj.id;
      const priceObj = CouponBO.getFinalPrice(this.data.order.getTotalPrice(), couponObj);
      this.setData({
        finalTotalPrice: priceObj.finalPrice,
        discountMoney: priceObj.discountMoney
      });
    } else {
      this.data.currentCouponId = null;
      this.setData({
        finalTotalPrice: this.data.order.getTotalPrice(),
        discountMoney: 0
      });
    }
  },

  onChooseAddress(event) {
    const address = event.detail.address;
    this.data.address = address;
  },

  async onSubmit(event) {
    if (!this.data.address) {
      showToast('请选择收获地址');
      return;
    }

    this.disableSubmitBtn();
    const order = this.data.order;
    const orderPost = new OrderPost(
      this.data.totalPrice,
      this.data.finalTotalPrice,
      this.data.currentCouponId,
      order.getOrderSkuInfoList(),
      this.data.address
    );
    const oid = await this.postOrder(orderPost);
    if (!oid) {
      this.enableSubmitBtn();
      return;
    }
    //立即购买不触发
    if (this.data.shoppingWay === ShoppingWay.CART) {
      cart.removeCheckedItems()
    }
    wx.lin.showLoading({
      type: "flash",
      fullScreen: true,
      color: "#157658"
    });
    const payParams = await Payment.getPayParams(oid);
    if (!payParams) {
      return;
    }
    try {
      const res = await wx.requestPayment(payParams)
      wx.redirectTo({
        url: `/pages/pay-success/pay-success?oid=${oid}`
      })
    } catch (e) {
      wx.redirectTo({
        url: `/pages/my-order/my-order?key=${1}`
      })
    }
  },

  disableSubmitBtn() {
    this.setData({
      submitBtnDisable: true
    });
  },
  enableSubmitBtn() {
    this.setData({
      submitBtnDisable: false
    });
  },

  async postOrder(orderPost) {
    try {
      const serverOrder = await Order.postOrderToServer(orderPost);
      if (serverOrder) {
        return serverOrder.id;
      }
    } catch (e) {
      this.setData({
        orderFail: true,
        orderFailMsg: e.message
      });
    }
  },

})
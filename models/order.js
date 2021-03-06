import { OrderExceptionType, OrderStatus } from "../core/enum";
import { OrderException } from "../core/order-exception";
import { accAdd } from "../utils/number";
import { Http } from "../utils/http";
import { Paging } from "../utils/paging";

class Order {
    orderItems;
    localItemCount;

    constructor(orderItems, localItemCount) {
        this.orderItems = orderItems;
        this.localItemCount = localItemCount;
    }

    checkOrderIsOk() {
        this.orderItems.forEach(item => {
            item.isOk();
        });
    }

    _orderIsOk() {
        this._emptyOrder();
        this._containNotOnSaleItem();
    }

    _emptyOrder() {
        if (this.orderItems.length === 0) {
            throw new OrderException('订单中没有任何商品', OrderExceptionType.EMPTY);
        }
    }

    _containNotOnSaleItem() {
        if (this.orderItems.length !== this.localItemCount) {
            throw new OrderException('服务器返回订单商品数量与实际不相符，可能是有商品已下架', OrderExceptionType.NOT_ON_SALE)
        }
    }
    /**
     * 获取订单列表中所有商品总价格
     */
    getTotalPrice() {
        return this.orderItems.reduce((pre, item) => {
            const price = accAdd(pre, item.finalPrice);
            return price;
        }, 0);
    }
    /**
     * 根据分类Id集合来计算指定商品总价格
     * @param {List} categoryIdList 
     */
    getTotalPriceByCategoryIdList(categoryIdList) {
        if (categoryIdList.length === 0) {
            return 0;
        }
        // 衣服、鞋子、书籍
        const price = categoryIdList.reduce((pre, cur) => {
            const eachPrice = this.getTotalPriceEachCategory(cur);
            return accAdd(pre, eachPrice);
        }, 0);
        return price;
    }
    /**
     * 一个分类的商品总价
     * @param {Integer} categoryId 
     */
    getTotalPriceEachCategory(categoryId) {
        const price = this.orderItems.reduce((pre, orderItem) => {
            const itemCategoryId = this._isItemInCategories(orderItem, categoryId);
            if (itemCategoryId) {
                return accAdd(pre, orderItem.finalPrice);
            }
            return pre;
        }, 0);
        return price;
    }
    /**
     * 判断商品是否在某个分类
     * @param {OrderItem} orderItem 
     * @param {Integer} categoryId 
     */
    _isItemInCategories(orderItem, categoryId) {
        if (orderItem.categoryId === categoryId) {
            return true;
        }
        if (orderItem.rootCategoryId === categoryId) {
            return true;
        }
        return false;
    }
    /**
     * 获取订单中的sku列表
     */
    getOrderSkuInfoList() {
        return this.orderItems.map(item => {
            return {
                id: item.skuId,
                count: item.count
            };
        });
    }
    /**
     * 向服务器发送提交订单请求
     * @param {Object} orderPost 
     */
    static async postOrderToServer(orderPost) {
        return await Http.request({
            url: '/order',
            method: 'POST',
            data: orderPost,
            throwError: true
        });
    }
    /**
     * 获取已支付的订单数量
     */
    static async getPaidCount() {
        const orderPage = await Http.request({
            url: `/order/by/status/${OrderStatus.PAID}`,
            data: {
                start: 0,
                count: 1
            }
        });
        return orderPage.total;
    }
    /**
     * 获取未支付的订单数量
     */
    static async getUnpaidCount() {
        const orderPage = await Http.request({
            url: `/order/status/unpaid`,
            data: {
                start: 0,
                count: 1
            }
        });
        return orderPage.total;
    }
    /**
     * 获取已发货的订单数量
     */
    static async getDeliveredCount() {
        const orderPage = await Http.request({
            url: `/order/by/status/${OrderStatus.DELIVERED}`,
            data: {
                start: 0,
                count: 1
            }
        });
        return orderPage.total;
    }
    /**
     * 获取已完成的订单数量
     */
    static async getFinishedCount() {
        const orderPage = await Http.request({
            url: `/order/by/status/${OrderStatus.FINISHED}`,
            data: {
                start: 0,
                count: 1
            }
        });
        return orderPage.total;
    }
    /**
     * 获取已取消的订单数量
     */
    static getPagingCanceled() {
        return new Paging({
            url: `/order/status/canceled`
        })
    }
    /**
     * 获取订单详情
     */
    static async getDetail(oid) {
        return Http.request({
            url: `/order/detail/${oid}`
        })
    }
    /**
     * 获取指定状态的订单列表
     * @param {Integer} status 
     */
    static getPagingByStatus(status) {
        return new Paging({
            url: `/order/by/status/${status}`
        });
    }
    /**
     * 获取未支付的订单列表
     */
    static getPagingUnpaid() {
        return new Paging({
            url: `/order/status/unpaid`
        });
    }
}

export {
    Order
}
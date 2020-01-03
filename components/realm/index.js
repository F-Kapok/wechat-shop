import { FenceGroup } from "../models/fence-group";
import { Judger } from "../models/judger";
import { Spu } from "../../models/spu";
import { Cell } from "../models/cell";
import { Cart } from "../../models/cart";

// components/realm/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        spu: Object,
        orderWay: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        judger: Object,
        previewImg: String,
        title: String,
        noSpecStock: Number,
        currentSkuCount: Cart.SKU_MIN_COUNT
    },

    observers: {
        'spu': function (spu) {
            if (!spu) {
                return;
            }
            //无规格数据绑定
            if (Spu.isNoSpec(spu)) {
                this.processNoSpec(spu);
            } else {
                //有规格数据绑定
                this.processHasSpec(spu);
            }
            this.triggerSpecEvent();
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        processNoSpec(spu) {
            this.setData({
                noSpec: true,
                noSpecStock: spu.sku_list[0].stock
            });
            this.bindSkuData(spu.sku_list[0]);
        },
        processHasSpec(spu) {
            const fenceGroup = new FenceGroup(spu);
            fenceGroup.initFences();
            const judger = new Judger(fenceGroup);
            this.data.judger = judger;
            // fenceGroup.initFences1();
            const defaultSku = fenceGroup.getDefaultSku();
            if (defaultSku) {
                this.bindSkuData(defaultSku);
                this.setStockStatus(defaultSku.stock);
            } else {
                this.bindSpuData();
            }
            this.bindTipData();
            this.bindFenceGroupData(fenceGroup);
        },
        bindSpuData() {
            const spu = this.properties.spu;
            this.setData({
                previewImg: spu.img,
                title: spu.title,
                price: spu.price,
                discountPrice: spu.discount_price
            });
        },

        triggerSpecEvent() {
            const noSpec = Spu.isNoSpec(this.properties.spu);
            if (noSpec) {
                this.triggerEvent('specchange', {
                    noSpec
                });
            } else {
                this.triggerEvent('specchange', {
                    noSpec: Spu.isNoSpec(this.properties.spu),
                    skuIntact: this.data.judger.isSkuIntact(),
                    currentValues: this.data.judger.getCurrentValues(),
                    missingKeys: this.data.judger.getMissingKeys()
                });
            }
        },

        bindSkuData(sku) {
            this.setData({
                previewImg: sku.img,
                title: sku.title,
                price: sku.price,
                discountPrice: sku.discount_price,
                stock: sku.stock
            });
        },

        bindTipData() {
            this.setData({
                skuIntact: this.data.judger.isSkuIntact(),
                currentValues: this.data.judger.getCurrentValues(),
                missingKeys: this.data.judger.getMissingKeys()
            });
        },

        bindFenceGroupData(fenceGroup) {
            this.setData({
                fences: fenceGroup.fences
            })
        },

        setStockStatus(stock) {
            this.setData({
                outStock: this.isOutOfStock(stock)
            });
        },

        isOutOfStock(stock) {
            return stock < this.data.currentSkuCount;
        },

        onSelectCount(event) {
            const currentCount = event.detail.count;
            this.data.currentSkuCount = currentCount;
            if (this.data.noSpec) {
                this.setStockStatus(this.data.noSpecStock)
            } else if (this.data.judger.isSkuIntact()) {
                const sku = this.data.judger.getDeterminateSku()
                this.setStockStatus(sku.stock)
            }
        },

        onCellTap(event) {
            const data = event.detail.cell;
            const x = event.detail.x;
            const y = event.detail.y;
            const cell = new Cell(data.spec);
            cell.status = data.status;
            const judger = this.data.judger;
            judger.judge(cell, x, y);
            const skuIntact = judger.isSkuIntact();
            if (skuIntact) {
                const currentSku = judger.getDeterminateSku();
                this.bindSkuData(currentSku);
                this.setStockStatus(currentSku.stock)
            }
            this.bindTipData();
            this.bindFenceGroupData(judger.fenceGroup);
            this.triggerSpecEvent();
        }
    }
})
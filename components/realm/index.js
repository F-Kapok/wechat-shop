import { FenceGroup } from "../models/fence-group";
import { Judger } from "../models/judger";

// components/realm/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        spu: Object,
        previewImg: String,
        title: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        judger: Object
    },

    observers: {
        'spu': function(spu) {
            if (!spu) {
                return;
            }
            const fenceGroup = new FenceGroup(spu);
            fenceGroup.initFences();
            const judger = new Judger(fenceGroup);
            this.data.judger = judger;
            // fenceGroup.initFences1();
            const defaultSku = fenceGroup.getDefaultSku();
            if (defaultSku) {
                this.bindSkuData(defaultSku);
            } else {
                this.bindSpuData();
            }
            this.bindInitData(fenceGroup);
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        bindSpuData() {
            const spu = this.properties.spu;
            this.setData({
                previewImg: spu.img,
                title: spu.title,
                price: spu.price,
                discountPrice: spu.discount_price
            });
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

        bindInitData(fenceGroup) {
            this.setData({
                fences: fenceGroup.fences
            })
        },

        onCellTap(event) {
            const cell = event.detail.cell;
            const x = event.detail.x;
            const y = event.detail.y;
            const judger = this.data.judger;
            judger.judge(cell, x, y);
            this.setData({
                fences: judger.fenceGroup.fences
            });
        }
    }
})
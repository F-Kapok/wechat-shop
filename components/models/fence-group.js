import { Fence } from "./fence";
import { Martrix } from "./matrix";

class FenceGroup {
    spu;
    skuList = [];
    fences = [];
    constructor(spu) {
        this.spu = spu;
        this.skuList = spu.sku_list;
    }

    initFences() {
        const matrix = this._createMatrix(this.skuList);
        const fences = [];
        const AT = matrix.transpose();
        console.log(AT);
        AT.forEach(r => {
            const fence = new Fence(r);
            fence.init();
            fences.push(fence);
        });
        this.fences = fences;
        console.log(fences);
    }

    _createFence() {
        return new Fence();
    }

    _createMatrix(skuList) {
        const m = [];
        skuList.forEach(sku => {
            m.push(sku.specs);
        })
        return new Martrix(m);
    }
}

export {
    FenceGroup
}
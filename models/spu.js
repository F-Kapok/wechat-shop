import { Http } from "../utils/http";

class Spu {

    static isNoSpec(spu) {
        if (spu.sku_list.length === 1 && spu.sku_list[0].specs.length === 0) {
            return true;
        }
        return false;
    }

    static getDetail(pid) {
        return Http.request({
            url: `/spu/id/${pid}/detail`
        })
    }
}

export {
    Spu
}
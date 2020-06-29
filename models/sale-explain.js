import { Http } from "../utils/http";

class SaleExplain {
    static async getFixed(spuId) {
        const explains = await Http.request({
            url: `/sale_explain/fixed?spuId=${spuId}`
        })
        return explains.map(e => {
            return e.text;
        })
    }
}

export {
    SaleExplain
}
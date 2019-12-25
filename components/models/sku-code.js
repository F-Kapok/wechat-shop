import { combination } from "../../utils/util"
class SkuCode {
    code;
    spuId;
    totalSeqments = [];
    constructor(code) {
        this.code = code;
        this._splitToSeqments();
    }

    _splitToSeqments() {
        // 2$1-44#3-9#4-14
        const spuAndSpec = this.code.split('$');
        this.spuId = spuAndSpec[0];

        const specCodeArray = spuAndSpec[1].split('#');
        const length = specCodeArray.length;
        for (let i = 1; i <= length; i++) {
            const seqments = combination(specCodeArray, i);
            const newSeqments = seqments.map(segs => {
                return segs.join('#');
            });
            this.totalSeqments = this.totalSeqments.concat(newSeqments);
            // console.log(seqments);
            console.log(newSeqments);
        }
    }
}

export {
    SkuCode
}
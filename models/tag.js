import { Http } from "../utils/http"
import { TagType } from "../core/enum";

class Tag {
    static getSearchTags() {
        return Http.request({
            url: `/tag/type/` + TagType.HOT_SEARCH
        });
    }
}

export {
    Tag
}
const CellStatus = {
    FORBIDDEN: 'forbidden',
    SELECTED: 'selected',
    WAITING: 'waiting '
}

const ShoppingWay = {
    CART: 'cart',
    BUY: 'buy'
}

const SpuListType = {
    THEME: 'theme',
    ROOT_CATEGORY: 'root_category',
    SUB_CATEGORY: 'sub_category',
    LATEST: 'latest'
}

const TagType = {
    HOT_SEARCH: 1
}

const BannerItemType = {
    SPU: 1,
    THEME: 2,
    SPU_LIST: 3
}

const AuthAddress = {
    DENY: 'deny',
    NOT_AUTH: 'not_auth',
    AUTHORIZED: 'authorized'
}

const OrderExceptionType = {
    BEYOND_STOCK: 'beyond_stock',
    BEYOND_SKU_MAX_COUNT: 'beyond_sku_max_count',
    BEYOND_ITEM_MAX_COUNT: 'beyond_item_max_count',
    SOLD_OUT: 'sold_out',
    NOT_ON_SALE: 'not_on_sale',
    EMPTY: 'empty'
}

const CouponCenterType = {
    ACTIVITY: 'activity',
    SPU_CATEGORY: 'spu_category'
}

export {
    CellStatus,
    ShoppingWay,
    SpuListType,
    TagType,
    BannerItemType,
    AuthAddress,
    OrderExceptionType,
    CouponCenterType
}
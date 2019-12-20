import { Http } from "./http";

class Paging {

    start;
    count;
    req;
    locker = false;
    url;
    isMoreData = true;
    accumulator = [];

    constructor(req, count = 10, start = 0) {
        this.start = start;
        this.count = count;
        this.req = req;
        this.url = req.url;
    }

    async getMoreData() {
        if (!this.isMoreData) {
            return;
        }
        //是否可以获取锁
        if (!this._getLocker()) {
            return;
        }
        //获取锁了执行获取数据方法
        const data = await this._actualGetData();
        //释放锁
        this._releaseLocaker();
        return data;

    }

    async _actualGetData() {
        const req = this._getCurrentReq();
        let paging = await Http.request(req);
        //请求失败
        if (!paging) {
            return null;
        }

        //数据为空的情况
        if (paging.total === 0) {
            return {
                empty: true,
                items: [],
                moreData: false,
                accumulator: []
            };
        }
        //判断是否有下一页
        this.isMoreData = Paging._isMoreData(paging.total_page, paging.page);
        if (this.isMoreData) {
            this.start += this.count;
        }
        this._accumulate(paging.items);
        return {
            empty: false,
            items: paging.items,
            moreData: this.isMoreData,
            accumulator: this.accumulator
        };

    }

    _accumulate(items) {
        this.accumulator = this.accumulator.concat(items);
    }

    static _isMoreData(totalPage, pageNum) {
        return pageNum < totalPage - 1;
    }
    _getCurrentReq() {
        let url = this.url;
        const params = `start=${this.start}&count=${this.count}`;
        if (url.includes('?')) {
            url += '&' + params;
        } else {
            url += '?' + params;
        }
        this.req.url = url;
        return this.req;
    }

    _getLocker() {
        if (this.locker) {
            return false;
        }
        this.locker = true;
        return true;
    }

    _releaseLocaker() {
        this.locker = false;
    }
}

export {
    Paging
}
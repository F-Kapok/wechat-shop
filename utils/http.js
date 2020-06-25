import { config } from "../config/config"
import { promisic } from "./util"
import { Token } from "../models/token";
import { codes } from "../config/exception-config";
import { HttpException } from "../core/http-exception";

class Http {
    static async request({
        url,
        data,
        method = 'GET',
        refetch = true,
        throwError = false }) {
        let res;
        try {
            res = await promisic(wx.request)({
                url: `${config.apiBaseUrl}${url}`,
                data,
                method,
                header: {
                    'content-type': 'application/json',
                    appkey: config.appkey,
                    'authorization': `Bearer ${wx.getStorageSync('token')}`
                }
            });
        } catch (e) {
            if (throwError) {
                throw new HttpException(-1, codes[-1]);
            }
            //未请求到api会捕捉
            Http.showError(-1);
            return null;
        }
        const code = res.statusCode.toString();
        if (code.startsWith('2')) {
            return res.data;
        } else {
            //token失效 二次重发
            if (code === '401') {
                if (data.refetch) {
                    Http._refetch({
                        url,
                        data,
                        method
                    });
                }
            } else {
                if (throwError) {
                    throw new HttpException(res.data.code, res.data.msg, code);
                }
                if (code === '404') {
                    if (res.data.code !== undefined) {
                        return null;
                    }
                    return res.data;
                }
                const error_code = res.data.code;
                Http.showError(error_code, res.data);
                return null;
            }
        }
        return res.data
    }

    static async _refetch(data) {
        const token = new Token();
        await token.getTokenFromServer();
        data.refetch = false;
        return await Http.request(data);
    }

    static showError(error_code, serverError) {
        let tip;
        if (!error_code) {
            tip = codes[9999];
        } else {
            if (codes[error_code] === undefined) {
                tip = serverError.msg;
            } else {
                tip = codes[error_code];
            }
        }
        wx.showToast({
            icon: "none",
            title: tip,
            duration: 3000
        });
    }

}

export {
    Http
}
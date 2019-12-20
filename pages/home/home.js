import { Theme } from "../../models/theme"
import { Banner } from "../../models/banner"
import { Category } from "../../models/category"
import { Activity } from "../../models/activity"
import { SpuPaging } from "../../models/spu-paging"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        themeA: null,
        themeE: null,
        themeF: null,
        themeESpu: null,
        bannerB: null,
        grid: [],
        activity: null,
        bannerG: null,
        themeH: null,
        spuPaging: null,
        loadingType: 'loading'

    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        this.initAllData();
        this.initBottomSpuList();
    },

    async initBottomSpuList() {
        const paging = SpuPaging.getLatestPaging();
        this.data.spuPaging = paging;
        const data = await paging.getMoreData();
        if (!data) {
            return;
        }
        wx.lin.renderWaterFlow(data.items);
    },

    async initAllData() {
        const theme = new Theme();
        await theme.getThemes();
        const themeA = theme.getHomeLocationA();
        const themeE = theme.getHomeLocationE();
        const themeF = theme.getHomeLocationF();
        const themeH = theme.getHomeLocationH();
        let themeESpu = [];
        if (themeE.online) {
            const data = await Theme.getHomeLocationESpu();
            if (data) {
                themeESpu = data.spu_list.slice(0, 8);
            }
        }
        const bannerB = await Banner.getHomeLocationB();
        const bannerG = await Banner.getHomeLocationG();
        const grid = await Category.getHomeLocationC();
        const activity = await Activity.getHomeLocationD();
        this.setData({
            themeA,
            bannerB,
            themeE,
            themeESpu,
            themeF,
            grid,
            activity,
            bannerG,
            themeH
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: async function() {
        const data = await this.data.spuPaging.getMoreData();
        if (!data) {
            return;
        }
        wx.lin.renderWaterFlow(data.items);
        if (!data.moreData) {
            this.setData({
                loadingType: 'end'
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})
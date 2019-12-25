// components/cell/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        cell: Object
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onTap(event){
            this.triggerEvent('celltap',{
                //子组件 父组件
                cell:this.properties.cell
            },{
                bubbles:true,
                composed:true
            })
        }
    }
})
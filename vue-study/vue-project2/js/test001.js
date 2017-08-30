new Vue({
    el: '.container',                              // 控制的范围
    data: {
        productList: [],
        checkAllFlag: false,
        totalPrice: 0,
        curProduct: ''
    },
    filters: {                                     // 过滤器，将数据处理后得带新的想要的东西,例如19过滤后成￥19.00
        formatMoney: function(value,type) {
            return "￥" + value.toFixed(2) + type;
        }
    },
    mounted: function() {                         // 相当于初始化，初始调用函数渲染页面
        this.$nextTick(function() {
            this.cartView();
        });
    },
    methods: {                                    // 方法，里面主要是要用的函数
        cartView: function() {
            this.$http.get('data/data.json').then(function(res) {
                this.productList = res.data.result.list;
            });
        },
        changeMoney: function(product,way) {    // 加减的函数
            if (way > 0) {
                product.productQuentity++;
            } else {
                product.productQuentity--;
                if (product.productQuentity < 1) {
                    product.productQuentity = 1;
                }
            }
            this.calaTotalPrice();
        },
        selectProduct: function(item) {
            if (typeof item.checked == 'undefined') {   //  如果item.checked未定义则添加在json中的item添加checked这个字段
                Vue.set(item, "checked", true);
                // this.$set(item, "checked", true);
            } else {
                item.checked = !item.checked;
            }
            this.calaTotalPrice();
        },
        checkAll: function(flag) {                      // 全选的函数
            this.checkAllFlag = flag;
            var _this = this;                           // 这样定义是为了和全局this区分_this是这个函数的区域
            this.productList.forEach(function(item, index) {
                if (typeof item.checked == 'undefined') {
                    _this.$set(item, 'checked', _this.checkAllFlag);
                } else {
                    item.checked = _this.checkAllFlag;
                }
            });
            this.calaTotalPrice();
        },
        calaTotalPrice: function() {
            this.totalPrice = 0;
            var _this = this;
            this.productList.forEach(function(item, index) {
                if (item.checked) {
                    _this.totalPrice += item.productPrice*item.productQuentity;
                }
            });
        },
        confirm:function(item) {
            this.curProduct = item;                         // 当点击页面删除时将item赋值给当前元素
        },
        delProduct: function() {                           // 删除利用删除数组元素的方法index是当前点击的这个元素的下标
            var index = this.productList.indexOf(this.curProduct);  // 获取当前点击元素下标
            this.productList.splice(index,1);                        // 删除从这个下标开始的一个元素
        }
    }
});

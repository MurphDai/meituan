(function(){

    // 顶部模版字符串
    var itemTopTmpl =  '<div class="choose-content hide">'+
                          '<div class="content-top">'+
                            '<div class="clear-car">清空购物车</div>'+
                          '</div>'+
                      '</div>';

    // 底部模版字符串
    var itemBottomTmpl = '<div class="bottom-content">'+
                            '<div class="shop-icon">'+
                              '<div class="dot-num hide"></div>'+
                            '</div>'+
                            '<div class="price-content">'+
                                '<p class="total-price">¥<span class="total-price-span">0</span></p>'+
                                '<p class="other-price">另需配送&nbsp;¥<span class="shipping-fee">0</span></p>'+
                            '</div>'+
                            '<div class="submit-btn">去结算</div>'+
                        '</div>';


    var $strBottom = $(itemBottomTmpl);
    var $strTop = $(itemTopTmpl);


    function changeShippingPrice(str){
        $strBottom.find('.shipping-fee').text(str);
    }
      function changeTotalPrice(str){
        $strBottom.find('.total-price-span').text(str);
    }


    /**
     * 渲染购物车顶部
     * param 
     */

       function cartRemove(){
        $('.choose-content').on('click','.clear-car', function(){
          $('.mask').hide();
            $('.choose-content').hide();

            // 移除购物车的选中项
            $strTop.find('.choose-item').remove();
            // 找到所有选项卡内容，赋给变量list
            var list = window.food_spu_tags || [];
            // 找到右侧选项卡放数量的div
            var $counts = $('.count');
            // 这里的list指的是左侧所有的选项卡内容
            // item指list中的每个选项卡
            list.forEach(function(item){
                // item.spus指的是左侧每一个选项卡对应的右侧所有商品的内容信息
                // _item是右侧每一条商品的数据
                item.spus.forEach(function(_item){
                    // 后台数据设为0
                    _item.chooseCount = 0;
                    // 页面数据设为0
                    $counts.text(0);
                })
                // 改变总价，让总价为0
                changeTotalPrice(0);
                // 改变红点个数
                changeDot();
            });
        });        
    }
    function renderItems(){
      $strTop.find('.choose-item').remove();
      var list = window.food_spu_tags || [];
      console.log(list)
      var tmpl = '<div class="choose-item">'+
                     '<div class="item-name">$name</div>'+
                     '<div class="price">¥<span class="total">$price</span></div>'+
                    '<div class="select-content">'+
                          '<div class="minus"></div>'+
                          '<div class="count">$chooseCount</div>'+
                          '<div class="plus"></div>'+
                      '</div>';
      var totalPrice = 0;

      list.forEach(function(item){
          item.spus.forEach(function(_item){

              // 如果有菜品数量大于0就开始渲染这条数据
              if (_item.chooseCount > 0) {

                  // 计算每个菜品的总价 就是 单价*数量
                  var price = _item.min_price*_item.chooseCount;
                  var row = tmpl.replace('$name',_item.name)
                            .replace('$price',price)
                            .replace('$chooseCount',_item.chooseCount)
                  
                  // 计算整个总价
                  totalPrice += price;

                  var $row = $(row);

                  $row.data('itemData',_item);



                  $strTop.append($row);
              }
          })

          // 改变总价
          changeTotalPrice(totalPrice);

          // 改变红点个数
          changeDot();

      });



    }

    /**
     * 渲染数量红点
     * param 
     */
    function changeDot(){

       // 先拿到所有的counts
       var $counts = $strTop.find('.count');

       var total = 0;


       // 遍历每个count 相加
       for (var i = 0 ; i < $counts.length ; i++) {
          total += parseInt($($counts[i]).text());
       }

       if (total > 0) {
        $('.dot-num').show().text(total)
       } else {
        $('.dot-num').hide();
       }
    }


    function addClick(){

        $('.shop-bar').on('click', '.shop-icon', function(){
            $('.mask').toggle();
            $strTop.toggle();
        });
        $strTop.on('click','.plus', function(e){
            var $count = $(e.currentTarget).parent().find('.count');

            $count.text(parseInt($count.text()||'0')+1);

            var $item = $(e.currentTarget).parents('.choose-item').first();

            var itemData = $item.data('itemData');

            itemData.chooseCount = itemData.chooseCount + 1;


            renderItems();


            // 找到当前的右侧详情的数据，进行联动
            $('.left-item.active').click();

        });

        $strTop.on('click','.minus', function(e){
            var $count = $(e.currentTarget).parent().find('.count');


            if ($count.text() == 0) return;
            $count.text(parseInt($count.text()||'0')-1);

            var $item = $(e.currentTarget).parents('.choose-item').first();

            var itemData = $item.data('itemData');

            itemData.chooseCount = itemData.chooseCount - 1;


            renderItems();


            // 找到当前的右侧详情的数据，进行联动
            $('.left-item.active').click();

        });
    }


    function init(data){
      $('.shop-bar').append($strTop);
      $('.shop-bar').append($strBottom);
      addClick();
      cartRemove();
    }

    init();

    window.ShopBar = {
        renderItems: renderItems,
        changeShippingPrice:changeShippingPrice
    }


})();



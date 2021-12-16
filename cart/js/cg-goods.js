class Goods{
    constructor(){
        this.cont=document.querySelector('#cont') //1.拿到div,要把商品追加进去 2.给商品的加入购物车按钮绑定事件功能
        this.getGoods()
    }
//把商品追加到页面
   async getGoods(){   //发送ajax获取json文件数组里的商品对象,把商品追加到页面
      let data=await axios.get({url:'js/goods.json',data:{}})  //注意地址是相对html的地址.ajax里面数据默认是json格式的,会把数据转为数组,元素为对象.这里如果传了dataType:'',会被解析为json字符串,不能使用forEach
     // console.log(data);
      let html='';
      data.forEach(goods => {   //遍历数组,追加到页面 .商品元素格式去成品处复制  以后会学mvc/mv思想把视图和js分开写
          html+=`<div class="box"><img src="${goods.src}" alt=""><p>${goods.name}</p><span class="goods_item_price" data-price-id="100004222715" style="">¥${goods.price}</span><a href="#none" id="InitCartUrl" class="btn-special1 btn-lg" onclick="Goods.addCart(${goods.id},1)">加入购物车</a></div>`
      });  //这里 形参.属性 就是代表属性变量,如果把这个属性再作为其他对象的属性,也可以 对象['属性'] =对象[形参.属性]
      this.cont.innerHTML=html;
    };
//绑定加入购物车
    //2.页面有了商品,就要给加入购物车按钮绑定事件功能,商品要调用class里的方法要使用this,但是行内的this指向标签,所以不能使用this,除了用this,还可以把方法用static修饰,调用时直接 类名.方法()
    static addCart(id,num){
       // console.log(id,num);//点击一下加入购物车会跳一下,是链接的默认跳转行为,设置 href='#none'
       let cartGoods=localStorage.getItem('cart') //不管local里面有没有保存cart,都要取出来操作,没有就构造一个存进去,有就转换格式操作完又存进去.反正最终都要改变local里的数据
       if(cartGoods){  
           cartGoods=JSON.parse(cartGoods) //json字符串转为对象
           for(let key in cartGoods){   //遍历每一个对象,当当前点击传进来的id和对象里面的属性id一样时,就改变这个对象的数量
             // if(key==id){
                key==id && ( num=num+cartGoods[key])
            //  }
           }
          cartGoods[id]=num
          localStorage.setItem('cart',JSON.stringify(cartGoods))

       }else{ //没有,为空,就赋值一个存进去.2种方法:1.把一个商品的图片,名字,数量,单价全部存进去.2.只存id和num,因为有json数组对象,之后要操作其他属性可以把存的id拿出来比对找到商品对象,找到对象就可以找到对象的属性进行操作
        cartGoods={[id]:num} //直接赋值,属性是变量要加[]  对象里只存了一个属性,就是id
        localStorage.setItem('cart',JSON.stringify(cartGoods))//转为json字符串存入本地存储器
       }
    }

//接下来就要把加入购物车的商品渲染到购物车页面,现在购物车页面可以拿数据的地方:1.通过数据库拿到点击加入购物车的商品的id,num  2.通过发送ajax拿到json商品数据  
//所以我们根据json里的商品比对数据库里点击存入的id,然后根据id把json里对应id的商品组成的数组,再把数组渲染嵌套到购物车页面表格
//再写一个cart.js用js操作购物车页面.
}

new Goods; //注意一定要调用啊
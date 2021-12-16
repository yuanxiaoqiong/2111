//购物车获取数据的两个地方:1.locaStorage,里面保存了点击加入购物车的商品的id:num 2.发送ajax可以获取json里的所有商品
//比对两个数据的id,把对应id的商品的
class Cart {
    constructor() {
        this.getCartGoods(); //把加入cart的商品渲染到购物车页面
        this.checkAll() ;//实现全选功能
    }
    //1.获取那些应该被放到购物车页面的商品
    async getCartGoods() {
        let carGoods = localStorage.getItem('cart'); //1.从数据库里取cart数据
        if (!carGoods) return; //取local里的cart数据是为了拿里面的id去json里拿这个id商品的其他数据,如果local里面没有保存任何数据,也就不用对比,就直接结束就可以了.
        carGoods = JSON.parse(carGoods) //有cart {'id':1}就把它转为对象{id:1},因为要拿去json对比,而发送ajax要以对象形式
        let goodsData = await axios.get({
            url: 'js/goods.json'
        }) //2.从json取数据. 查看ajax里封装时要求传什么,这里json文件里的数据类型就是ajax里默认的json格式.ajax会把数据转为对象返回出来.
        //console.log(goodsData);  //[{…}, {…}, {…},...]拿到了json里面的全部商品 ,接下来就通过local拿的数据的id比对json里拿的数据的id

        //3.通过id相同,拿到被加入了cart的商品. 遍历json里拿过来的所有商品数据,拿着商品数据的id属性,去取local里的cart购物车里取id属性的值,如果能取到值num,说明这个商品已经在cart里了.因为cart保存数据值就是以id为属性存的.{[id]:num}
        let existsCartGoods = goodsData.filter(item => {
            //console.log(carGoods[item.id]); //商品的id属性作为cart的id属性,对象[属性]如果有值,值就是num,cart里没这个item商品,值就是undefined.属性是变量时加[]
            return carGoods[item.id]; // filter遍历数组,返回满足条件的元素组成的数组
        })
        // console.log(existsCartGoods); //拿到的就是json里的那些,已经在local的cart里保存了的商品
        this.render(existsCartGoods,carGoods); //把拿到的商品渲染到购物车页面,把cart数据也传过去方便拿里面的num计算价格  //render 提供
    }

    //2.把被加入购物车的json商品追加渲染到购物车页面
    render(cartGoods,cg) {
        let template='';  //template 样板 
        cartGoods.forEach(item => {
            template+=`<tr>
            <td class="checkbox"><input class="check-one check" type="checkbox"/></td>
            <td class="goods"><img src="${item.src}" alt=""/><span>${item.name}</span></td>
            <td class="price">${item.price}</td>
            <td class="count">
                <span class="reduce"></span>
                <input class="count-input" type="text" value="${cg[item.id]}"/>
                <span class="add">+</span></td>
            <td class="subtotal">${item.price}*${cg[item.id]}</td>
            <td class="operation"><span class="delete">删除</span></td>
        </tr>`
        });
        this.$('#cartTable tbody').innerHTML=template; //注意调用class里的方法要加this
    }

    //购物车显示出了商品,就要进行里面可操作的功能的实现

    //3.实现全选功能--当点击两个全选按钮其中一个,就把当前这个全选的选中状态赋值给另外一个,同时赋值给每一个单选
    checkAll(){
        let all=this.$$('.check-all') //拿到两个全选按钮,绑定点击事件
        all[0].addEventListener('click',this.allClickFn.bind(this,1)); //在点击事件里要使用到class的方法,这里的this还在checkAll里面,所以这个this指向的class,把class传进去.也可以把方法修饰成class的.
        all[1].addEventListener('click',this.allClickFn.bind(this,0)); //把另外一个全选的下标传进去,拿到当前点击的全选的状态,通过下标获取另外一个节点,把当前点击的全选的状态同步赋值给另外一个
    }
    allClickFn(allIndex,e){   //同时使用bind和event时,把bind传的参数放在前面,event放在后面
        let status=e.target.checked;      //要拿到全选的状态给其他节点,就要先拿到节点,然后把状态保存起来
        this.$$('.check-all')[allIndex].checked=status //赋值给其他节点的状态
    }





    $(ele){   // 获取节点  没有jQuery,使用一个$就可以
        return document.querySelector(ele)
    }
    $$(ele){
        return document.querySelectorAll(ele)
    }

}
new Cart;
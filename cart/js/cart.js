class Cart {
  constructor() { //构造方法在new Cart时自动执行
    this.getCartGoods(); //1.取出localStorage里保存的数据(id,num),发送ajax请求获取json里保存的商品.对比id名,把商品的图片,名字,单价渲染到购物车列表,有了id属性就有了num值
    this.checkAll(); //2.全选
    this.$('#cartTable tbody').addEventListener('click', this.clickBubbleFn.bind(this)) // 3.单选  给tbody绑定点击事件
  }
  /****判断当前点击的是单选节点****/
  clickBubbleFn(event) {
    let tar = event.target; //给每个单选按钮绑定事件
    tar.classList.contains('check-one') && this.oneCheckFn(tar) //classList.contains() 表示类名清单里包含某个类名  把当前节点传进去判断当前节点的类名
  }

  /******1.获取local里保存的数据保存为购物车数据(id,num)*****/
  async getCartGoods() {
    let cartGoods = localStorage.getItem('cart'); // 1. 取出local数据用一个购物车数据保存,是json字符串
    if (!cartGoods) return; //购物车数据为空则停止
    cartGoods = JSON.parse(cartGoods) //购物车里有数据就转换为对象

    let goodsData = await axios.get({
      url: './js/goods.json'
    }); // 2. 发送ajax获取json里保存的商品数据.根据axios.js里封装的情况判断需要传哪些参数.记得在html里引入axios.js,在本文件的引入前引入
    //注意:请求的地址是本文件被引入html后的相对地址
    //filter遍历,条件为true时,返回一个由满足条件的item组成的数组   //3.遍历商品列表里的商品,返回一个当商品列表里的商品的id的值是购物车里的商品的id值是的商品组成的数组
    let existsCartGoods = goodsData.filter(item => { //遍历商品列表,因为id被设置为了商品的属性,就可以根据商品的id属性去购物车里取值,可以取到值,说明这个商品在购物车里,取到值就返回
      // console.log(item.id);
      // console.log(cartGoods[item.id]);  //输出购物车的item的id属性的值,当购物车中的商品,存在商品列表中商品的属性id,输出的就是num值,不存在会返回undefined
      return cartGoods[item.id]; //返回一个满足条件的item组成的数组                   (结果为num值就表示为true,结果为undefined就表示是false)
    });
    // console.log(existsCartGoods);   
    this.render(existsCartGoods, cartGoods) //4.把满足条件是商品渲染到购物车列表页面,把购物车数据也传过去,因为会需要计算num*价格,而num是用id为键保存在local的购物车数据里的,从json里获取的商品数据没有num属性
  }

  /****把购物车数据渲染为购物车列表******/
  render(goodsData, cg) { //goodsData接收的是传下来的满足条件的商品,cg就是购物车数据cartGoods,用来获取里面的mun属性值,实现num*单价
    // console.log(goodsData); //[{..},{..},{..}]
    let template = '';
    goodsData.forEach(ele => { // 1.遍历满足条件的商品,一条商品一个tr,追加到购物车列表里面呈现
      // console.log(ele);

      template += `<tr goods-id="${ele.id}>
      <td class="checkbox">
        <input class="check-one check" type="checkbox" />
      </td>
      <td class="goods">
        <img src="${ele.src}" alt="" />
        <span>${ele.name}</span>
      </td>
      <td class="price">${ele.price}</td>
      <td class="count">
        <span class="reduce"></span>
        <input class="count-input" type="text" value="${cg[ele.id]}" />
        <span class="add">+</span>
      </td>
      <td class="subtotal">${ele.price * cg[ele.id]}</td>  
      <td class="operation">
        <span class="delete">删除</span>
      </td>
    </tr>`
    });

    this.$('#cartTable tbody').innerHTML = template; //把遍历完的数据追加到表格的tbody里
  }

  /*********全选实现********/
  checkAll() { //在constructor里调用
    let allObj = this.$$('.check-all'); //1 调用获取节点伪数组方法获取到两个全选按钮,绑定点击事件
    // console.log(allObj);

    // 2 给两个全选按钮绑定同一个事件,事件回调函数的this指向节点对象,使用bind      //两个全选只有单独绑定,tbody里的点击事件可以只委托给tbody,里面的所有点击都由tbody里面用各种class分发操作
    allObj[0].addEventListener('click', this.allClickFn.bind(this, 1)) //事件回调函数里会使用class里的方法,所以要使回调函数里的this指向class,因为class里调用class的方法必须使用this
    allObj[1].addEventListener('click', this.allClickFn.bind(this, 0)) //把对方的下标也传进去,点击自己时,获取对方节点,然后把自己的选中状态也赋值给对方的状态
  }
  allClickFn(checkAllIndex, event) { // 使用bind和event时,bind传递的参数在前
    // console.log(checkAllIndex);  //1 0
    // console.log(event);
    let status = event.target.checked; //获取当前点击的全选按钮的状态,因为this已经改变了指向不再表示当前操作的节点,所以需要使用event
    this.$$('.check-all')[checkAllIndex].checked = status; // 把自己的状态设置为对方全选按钮的状态
    this.oneChecked(status); //还要把当前全选按钮的状态,传递给每个单选按钮
  }
  oneChecked(status) { //所有的单选跟随全选的状态
    this.$$('.check-one').forEach(one => {
      one.checked = status;
    })
  }

  /****单选实现***/
  oneCheckFn(target) {
    this.subTotal();  //在return前面调用计算数量和价格
    // console.log(target);
    // console.log(this.$$('.check-one'));
    // if (target.checked) {  //如果是选中状态
    //   // some 遇见第一个true直接终止遍历返回true,遍历完还没有true就返回false
    //   let res = Array.from(this.$$('.check-one')).some(one => {   //some是数组的方法,伪数组不能使用
    //     // console.log(one.checked); //如果所以单选,只有部分是选中状态就是true,全部处于选中状态为false
    //     return !one.checked;   //
    //   })
    //   // console.log(res);
    //   // 所有单选都被选中,返回false,让全选选中
    //   if (!res) {
    //     this.$$('.check-all')[0].checked = true;
    //     this.$$('.check-all')[1].checked = true;
    //   }
    // } else {
    //   this.$$('.check-all')[0].checked = false;
    //   this.$$('.check-all')[1].checked = false;
    // }

    // 优化层级
    if (!target.checked) { // tbody里,如果当前点击的按钮没有被选中
      this.$$('.check-all')[0].checked = false; //那么两个选中按钮也同时取消选中
      this.$$('.check-all')[1].checked = false;
      return;   //代码终止
    }
    // 选中,
    // let res = Array.from(this.$$('.check-one')).some(one => {
    //   // console.log(one.checked);
    //   // 未选中是false,取反为true,循环结束
    //   return !one.checked;
    // })
    // // console.log(arr);
    // // 所有单选都被选中,返回false,让全选选中
    // if (!res) {
    //   this.$$('.check-all')[0].checked = true;
    //   this.$$('.check-all')[1].checked = true;
    // }

    let count = 0;
    this.$$('.check-one').forEach(one => { //遍历处于选中状态的单选
      one.checked && count++; //数量自增1,有几个选中count自增的结果就是几
    })
    // console.log(count);
    if (count == this.$$('.check-one').length) { // 如果选中的数量==购物车商品数量,则全选选中
      this.$$('.check-all')[0].checked = true;
      this.$$('.check-all')[1].checked = true;
    }
  }

  /******统计价格和数量******/ 
  subTotal(sta = true) {   // 全选和单个商品的input框选中时,都要调用它去计算数量和价格
    let totalNum = 0,  totalPrice = 0;    // 1 先拿到总价和数量,默认值是0,用变量保存,后面要操作他们的值
    sta && this.$$('.check-one').forEach(ele => {   // 2 要统计数量和价格,就要找到单个商品中哪些是处于选中状态.遍历所有商品查看商品状态(方法2,在单个被选中的地方去动态给tr加一个类名,false就删除这个类名,最后拿到所有这个类名的tr,虽然少遍历节约性能,但比较麻烦)
      if (ele.checked) {
        let trObj = ele.parentNode.parentNode;  // 3 通过拿到被选中的单选input框的tr
        totalNum += (trObj.querySelector('.count input').value - 0); // 4 获取里面的数量和小计的值
        // console.log(trObj.querySelector('.subtotal').innerHTML);
        totalPrice += (trObj.querySelector('.subtotal').innerHTML - 0); //值是字符串,计算结果是拼接,要拿来进行数学计算,必须转为数字 通过-0或*1 ,隐式转换,但不会改变值
        // console.log(totalNum, totalPrice);
      }

    })
    // 5 放入页面中
    this._$('#priceTotal').innerHTML = totalPrice;
    this._$('#selectedTotal').innerHTML = totalNum;
  }

  /******增加数量******/
  addClickFn(target) {
    // console.log(target);
    // 1 获取数量,上一个兄弟节点
    let num = target.previousElementSibling;
    // console.log(num);
    num.value = num.value - 0 + 1;
    // 2 获取小计
    let sub = target.parentNode.nextElementSibling;
    let price = target.parentNode.previousElementSibling.innerHTML;
    // 123.484   121.485
    // sub.innerHTML = (num.value * price).toFixed(2);
    sub.innerHTML = parseInt((num.value * price) * 100) / 100;
    // 3 当input是选中时,统计价格和数量
    target.parentNode.parentNode.querySelector('.check-one').checked && this.subTotal();
  }

  /****删除商品****/
  delClickFn(target) {
    let that = this;
    // 确认删除框
    layer.open({
      title: '确认删除框',
      content: '确认抛弃奴家吗?',
      btn: ['取消', '确认'],
      btn2: function (index, layero) {
        //按钮【按钮二】的回调
        //return false 开启该代码可禁止点击该按钮关闭
        console.log(target);
        // 删除当前商品节点
        target.parentNode.parentNode.remove();

        // 处于选中状态,则重新计算总价格和数量
        target.parentNode.parentNode.querySelector('.check-one').checked && that.subTotal();
      }
    });
    this.modifyLocal(tr.getAttribute('goods-id'))
  }

  /******修改数量,num为0则删除****/
  modifyLocal (id, num = 0) {
    console.log(id, num);

    // 1 取出local数据
    let cartGoods = localStorage.getItem('cart');
    // console.log(cartGoods);
    if (!cartGoods) return;
    // 使用json解析
    cartGoods = JSON.parse(cartGoods);
    // console.log(cartGoods, id);
    // 删除对象属性
    num == 0 && delete cartGoods[id];
    // console.log(cartGoods);
    // 修改商品的数量
    num != 0 && (cartGoods[id] = num);
    localStorage.setItem('cart', JSON.stringify(cartGoods));
  }

 
  $(ele) {
    return document.querySelector(ele) //获取单个节点
  }
  $$(ele) {
    return document.querySelectorAll(ele) //获取节点伪数组
  }


}

new Cart;
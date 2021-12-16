class Goods {
  constructor() {
    this.cont = document.querySelector('#cont') //获取div, constructor里获取节点可以不用声明
    this.getGoods();   // 调用方法,向json文件发送数据请求,把json里的内容追加到页面div里
  }
  async getGoods () {   // 1.发送请求,获取json文件里的数据
    let data = await axios.get({ url: './js/goods.json', data: '' }); //获取到请求的返回值再继续执行下面的代码,使同步执行
    let html = '';
    data.forEach(goods => {    // 遍历追加到div页面中,点击把goods.json里的goods.id传进去
      html += `<div class="box"><img src="${goods.src}" alt=""><p>${goods.name}</p><span class="goods_item_price" data-price-id="100004222715" style="">¥${goods.price}</span><a href="#none" id="InitCartUrl" class="btn-special1 btn-lg" onclick="Goods.addCart(${goods.id},1)">加入购物车</a></div>`;
    });
    this.cont.innerHTML = html;
  }
  static addCart (id, num) {    // 点击加入购物车,接收id   static修饰,在行内直接加类名调用
    let cartGoods = localStorage.getItem('cart');  // 1 取出local中的值
    if (cartGoods) {    // 2 判断是否有数据
      cartGoods = JSON.parse(cartGoods);  // 3-1 有数据就转化数据操作里面的数量
      for (let key in cartGoods) { // 3-3 遍历数据,判断当前点击添加的id,是否已经存在于购物车中
        // if (attr == id) {
          key == id && (num = num + cartGoods[key]); // 3-4 存在,则修改数量
        // }
      }
      cartGoods[id] = num;  // 3-5 修改数量
      localStorage.setItem('cart', JSON.stringify(cartGoods)) //修改完再存入本地存储器
    } else { // 4-1 没有值就存入值
      //4-2 把数据保存数组再转为json存入
      // cartGoods = { goodsId: id, goodsNum: num };
      // localStorage.setItem('cart', JSON.stringify([cartGoods])) // [{},{},{}]

      // 4-2 以id为key,数量为val形式存储 ,转为json存入本地存储器
      cartGoods = { [id]: num };
      localStorage.setItem('cart', JSON.stringify(cartGoods))
    }

  }
}

new Goods;
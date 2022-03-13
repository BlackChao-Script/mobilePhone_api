const Router = require('koa-router')
const cart = new Router()
const { auth } = require('../middleware/auth.middleware')
const { validatorCart } = require('../middleware/cart.middleware')
const {
  addCart,
  getCart,
  updateCart,
} = require('../controller/cart.controller')

// 加入购物车
cart.post('/addcart', auth, validatorCart({ goods_id: 'number' }), addCart)

// 获取购物车列表
cart.get('/', auth, getCart)
// 更新购物车
cart.patch(
  '/:id',
  auth,
  validatorCart({
    number: { type: 'number', required: false },
    selected: { type: 'boolean', required: false },
  }),
  updateCart
)

module.exports = cart

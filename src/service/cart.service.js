const { Op } = require('sequelize')
const Cart = require('../model/cart.model')
const Goods = require('../model/goods.model')
const { BASE_PATH } = require('../constant/data')
class CartService {
  // 添加购物车
  async addServiceCart(user_id, goods_id) {
    const res = await Cart.findOne({
      where: {
        // 查找user_id与goods_id
        [Op.and]: {
          user_id,
          goods_id,
        },
      },
    })
    if (res) {
      // number递增
      await res.increment('number')
      // 重新加载数据库数据
      return await res.reload()
    } else {
      return await Cart.create({
        user_id,
        goods_id,
      })
    }
  }
  // 获取购物车
  async getServiceCart(user_id, pageNum, pageSzie) {
    const offset = (pageNum - 1) * pageSzie
    const { count, rows } = await Cart.findAndCountAll({
      attributes: ['id', 'number', 'selected'],
      where: { user_id },
      offset,
      limit: pageSzie * 1,
      include: {
        model: Goods,
        as: 'goods_info',
        attributes: ['id', 'goods_name', 'goods_price', 'goods_img'],
      },
    })
    rows.forEach((element) => {
      element.dataValues.goods_info.goods_img =
        BASE_PATH + element.dataValues.goods_info.goods_img
    })
    return {
      pageNum,
      pageSzie,
      total: count,
      list: rows,
    }
  }
  // 更新购物车
  async updateServiceCart(...params) {
    const [id, number, selected] = params
    const res = await Cart.findByPk(id)
    if (!res) return ''
    number !== undefined ? (res.number = number) : ''
    selected !== undefined ? (res.selected = selected) : ''
    return await res.save()
  }
  // 删除购物车
  async deleteServiceCart(id) {
    let res = []
    if (id.indexOf(',') != -1) {
      let data = []
      data = id.split(',')
      for (let i of data) {
        console.log(i)
        res = await Cart.destroy({ where: { id:i } })
      }
    } else {
      res = await Cart.destroy({ where: { id } })
    }
    return res[0] > 0 ? true : false
  }
  // 全选与取消全选
  async selectServiceAllCarts(user_id, selected) {
    return await Cart.update(
      { selected },
      {
        where: {
          user_id,
        },
      }
    )
  }
}

module.exports = new CartService()

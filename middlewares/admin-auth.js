const { User } = require('../models');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../utils/errors')
const { success, failure } = require('../utils/responses')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {
    const { token } = req.headers
    if(!token) {
      throw new UnauthorizedError('当前接口需要认证才能访问。')
    }

    const decoded = jwt.verify(token, process.env.SECRET)

    const { userId } = decoded

    const user = await User.findByPk(userId)
    if(!user) {
      throw new UnauthorizedError('用户不存在。')
    }

    if(user.role !== 100) {
      throw new UnauthorizedError('您没有权限使用当前接口')
    }

    // 验证通过，将 user 对象挂载到 req 上, 方便后续中间件和路由使用
    req.user = user

    next()
  } catch (error) {
    failure(res, error)
  }
}
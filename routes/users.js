const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { success, failure } = require('../utils/responses')
const { NotFoundError, BadRequestError } = require('../utils/errors')
const bcrypt = require('bcryptjs')

// 查询当前登录用户详情
router.get('/me', async function(req, res, next) {
  try {
    const user = await getUser(req)

    success(res, '查询当前登录用户信息成功', { user })
  } catch (error) {
    failure(res, error)
  }
});


// 更新用户信息
router.put('/info', async function(req, res, next) {
  try {
    const body = {
      nickname: req.body.nickname,
      sex: req.body.sex,
      company: req.body.company,
      introduce: req.body.introduce,
      avatar: req.body.avatar,
    }

    const user = await getUser(req)
    await user.update(body)

    success(res, '更新用户信息成功', { user })
  } catch (error) {
    failure(res, error)
  }
});

// 更新账户信息
router.put('/account', async function(req, res, next) {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      current_password: req.body.current_password,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    }

    if(!body.current_password) {
      throw new BadRequestError('当前密码必须填写')
    }

    if(body.password !== body.passwordConfirmation) {
      throw new BadRequestError('两次输入密码不一致')
    }

    const user = await getUser(req, true)
    
    const isPasswordVaild = bcrypt.compareSync(body.current_password, user.password)
    if(!isPasswordVaild) {
      throw new BadRequestError('当前密码不正确')
    }

    await user.update(body)
    delete user.dataValues.password

    success(res, '更新用户信息成功', { user })
  } catch (error) {
    failure(res, error)
  }
});

// 公共方法：查询当前用户 
async function getUser(req, showPassword = false) {
  const id = req.userId

  let condition = {}
  if(!showPassword) {
    condition = {
      attributes: { exclude: ['password'] }
    }
  }

  const user = await User.findByPk(id, condition)

  if(!user) {
    throw new NotFoundError(`ID: ${ id }的用户未找到`)
  }

  return user
}

module.exports = router;

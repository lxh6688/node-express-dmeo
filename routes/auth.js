const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../utils/errors')
const { success, failure } = require('../utils/responses')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

router.post('/sign_up', async function (req, res, next) {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      nickname: req.body.nickname,
      password: req.body.password,
      sex: 2,
      role: 0,
    }

    const user = await User.create(body)
    delete user.dataValues.password

    success(res, '创建用户成功', { user }, 201);
  } catch (error) {
    failure(res, error)
  }
});

router.post('/sign_in', async function (req, res, next) {
  try {
    const { login, password } = req.body

    if(!login) {
      throw new BadRequestError('邮箱/用户名必须填写')
    }

    if(!password) {
      throw new BadRequestError('密码必须填写')
    }

    const condition = {
      where: {
        [Op.or]: [
          { email: login },
          { username: login }
        ]
      }
    }

    // 通过 email 或 username，查询用户是否存在
    const user = await User.findOne(condition)
    if(!user) {
      throw new NotFoundError('用户不存在，无法登录。')
    }

    // 验证密码
    const isPasswordVaild = bcrypt.compareSync(password, user.password)
    if(!isPasswordVaild) {
      throw new UnauthorizedError('密码错误。')
    }

    const token = jwt.sign({
      userId: user.id
    }, process.env.SECRET, { expiresIn: '30d' })

    success(res, '登录成功', { token });
  } catch (error) {
    failure(res, error)
  }
});

module.exports = router;
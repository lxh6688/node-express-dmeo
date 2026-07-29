const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {
  NotFoundError,
  success,
  failure
} = require('../../utils/response')

const { User } = require('../../models')

//查询用户列表
router.get('/', async function (req, res, next) {
  try {
    const query = req.query

    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    const condition =  {
      order: [['id', 'desc']],
      limit: pageSize,
      offset: offset
    }

    if(query.email){
      condition.where = {
        email: {
          [Op.eq]: query.email
        }
      }
    }

    if(query.username){
      condition.where = {
        username: {
          [Op.eq]: query.username
        }
      }
    }

    if(query.nickname){
      condition.where = {
        nickname: {
          [Op.like]: `%${query.nickname}%`
        }
      }
    }

    if(query.role){
      condition.where = {
        role: {
          [Op.eq]: query.role
        }
      }
    }

    const { count, rows } = await User.findAndCountAll(condition)

    success(res, '查询用户列表成功', { 
      users: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize
      }
    });
  } catch (error) {
    failure(res, error)
  }
});

//查询用户详情
router.get('/:id', async function (req, res, next) {
  try {
    const user = await getUser(req);
    success(res, '查询用户成功', { user })
  } catch (error) {
    failure(res, error)
  }
});

//创建用户
router.post('/', async function (req, res, next) {
  try {
    const body = filterBody(req)
    const user = await User.create(body)
    success(res, '创建用户成功', { user }, 201)
  } catch (error) {
    failure(res, error)
  }
});

//更新用户
router.put('/:id', async function (req, res, next) {
  try {
    const user = await getUser(req)
    const body = filterBody(req)

    await user.update(body)

    success(res, '更新用户成功')
  } catch (error) {
    failure(res, error)
  }
});

async function getUser(req) {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if(!user){
    throw new NotFoundError(`ID: ${ id } 的用户未找到。`)
  }

  return user
} 

function filterBody(req) {
  // 强参数过滤
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar,
  }
}

module.exports = router;

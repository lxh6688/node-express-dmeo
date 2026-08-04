const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors')
const { success, failure } = require('../../utils/responses')

const { Setting } = require('../../models')

//查询系统设置详情
router.get('/', async function (req, res, next) {
  try {
    const setting = await getSetting();
    success(res, '查询系统设置成功', { setting })
  } catch (error) {
    failure(res, error)
  }
});

//更新系统设置
router.put('/', async function (req, res, next) {
  try {
    const setting = await getSetting()
    const body = filterBody(req)

    await setting.update(body)

    success(res, '更新系统设置成功')
  } catch (error) {
    failure(res, error)
  }
});

async function getSetting() {
  const setting = await Setting.findOne();

  if(!setting){
    throw new NotFoundError(`初始系统设置未找到`)
  }

  return setting
} 

function filterBody(req) {
  // 强参数过滤
  const body = {
    name: req.body.name,
    icp: req.body.icp,
    copyright: req.body.copyright
  }
  return body
}

module.exports = router;

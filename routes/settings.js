const express = require('express');
const router = express.Router();
const { Setting } = require('../models');
const { success, failure } = require('../utils/responses')
const { NotFoundError } = require('../utils/errors')

router.get('/', async function(req, res, next) {
  try {
    const setting = await Setting.findOne()

    if(!setting) {
      throw new NotFoundError('未找到系统信息设置, 请联系管理员。')
    }

    success(res, '查询系统信息成功', { setting })
  } catch (error) {
    failure(res, error)
  }
});

module.exports = router;

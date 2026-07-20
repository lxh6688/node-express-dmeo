const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { Article } = require('../../models')

//查询文章列表
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

    if(query.title){
      condition.where = {
        title: {
          [Op.like]:  `%${query.title}%`
        }
      }
    }

    const { count, rows } = await Article.findAndCountAll(condition)

    res.json({ 
      status: true,
      message: '查询文章列表成功',
      data: { 
        articles: rows,
        pagination: {
          total: count,
          currentPage,
          pageSize
        }
      } 
    });
  } catch (error) {
    res.status(500).json({
      status:false,
      message: '查询文章列表失败',
      error: [error.message]
    })
  }
});

//查询文章详情
router.get('/:id', async function (req, res, next) {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);

    if(article){
      res.json({ 
        status: true,
        message: '查询文章成功',
        data: article
      });
    }else {
      res.status(404).json({
        status: false,
        message: '查询文章未找到'
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '查询文章列表失败',
      error: [error.message]
    })
  }
});

//创建文章
router.post('/', async function (req, res, next) {
  try {
    const body = filterBody(req)
    const article = await Article.create(body)

    res.status(201).json({
      status: true,
      message: '创建文章成功',
      data: article
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '创建文章失败',
      error: [error.message]
    })
  }
});

//删除文章
router.delete('/:id', async function (req, res, next) {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);

    if(article){
      article.destroy()

      res.json({ 
        status: true,
        message: '删除文章成功'
      });
    }else {
      res.status(404).json({
        status: false,
        message: '查询文章未找到'
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '查询文章列表失败',
      error: [error.message]
    })
  }
});

//更新文章
router.put('/:id', async function (req, res, next) {
  try {
    const { id } = req.params;
    const body = filterBody(req)

    const article = await Article.findByPk(id);

    if(article){
      article.update(body)

      res.json({ 
        status: true,
        message: '更新文章成功'
      });
    }else {
      res.status(404).json({
        status: false,
        message: '文章未找到'
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '更新文章列表失败',
      error: [error.message]
    })
  }
});

function filterBody(req) {
  // 强参数过滤
  const body = {
    title: req.body.title,
    content: req.body.content
  }
}

module.exports = router;

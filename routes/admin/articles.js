const express = require('express');
const router = express.Router();

const { Article } = require('../../models')

router.get('/', async function (req, res, next) {
  try {
    const condition =  {
      order: [['id', 'desc']]
    }

    const articles = await Article.findAll(condition)
    res.json({ 
      status: true,
      message: '查询文章列表成功',
      data: { 
        articles 
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

router.post('/', async function (req, res, next) {
  try {
    const article = await Article.create(req.body)

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

module.exports = router;

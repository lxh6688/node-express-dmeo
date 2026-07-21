const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {
  NotFoundError,
  success,
  failure
} = require('../../utils/response')

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
          [Op.like]: `%${query.title}%`
        }
      }
    }

    const { count, rows } = await Article.findAndCountAll(condition)

    success(res, '查询文章列表成功', { 
      articles: rows,
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

//查询文章详情
router.get('/:id', async function (req, res, next) {
  try {
    const article = await getArticle(req);
    success(res, '查询文章成功', { article })
  } catch (error) {
    failure(res, error)
  }
});

//创建文章
router.post('/', async function (req, res, next) {
  try {
    const body = filterBody(req)
    const article = await Article.create(body)
    success(res, '创建文章成功', { article }, 201)
  } catch (error) {
    failure(res, error)
  }
});

//删除文章
router.delete('/:id', async function (req, res, next) {
  try {
    const article = await getArticle(req);
    await article.destroy()
    success(res, '删除文章成功')
  } catch (error) {
    failure(res, error)
  }
});

//更新文章
router.put('/:id', async function (req, res, next) {
  try {
    const body = filterBody(req)
    const article = await Article.create(body)

    article.update(body)

    success(res, '更新文章成功')
  } catch (error) {
    failure(res, error)
  }
});

async function getArticle(req) {
  const { id } = req.params;

  const article = await Article.findByPk(id);

  if(!article){
    throw new NotFoundError(`ID: ${ id } 的文章未找到。`)
  }

  return article
} 

function filterBody(req) {
  // 强参数过滤
  const body = {
    title: req.body.title,
    content: req.body.content
  }
  return body
}

module.exports = router;

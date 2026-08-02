const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {
  NotFoundError,
  success,
  failure
} = require('../../utils/response')

const { Chapter, Course } = require('../../models')

//查询章节列表
router.get('/', async function (req, res, next) {
  try {
    const query = req.query

    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    if(!query.courseId){
      throw new Error('获取章节列表失败，课程ID不能为空')
    }

    const condition =  {
      ...getCondition(),
      order: [['rank', 'ASC'], ['id', 'ASC']],
      limit: pageSize,
      offset: offset
    }

    if(query.courseId){
      condition.where = {
        courseId: {
          [Op.eq]: query.courseId
        }
      }
    }

    if(query.title){
      condition.where = {
        title: {
          [Op.like]: `%${query.title}%`
        }
      }
    }

    const { count, rows } = await Chapter.findAndCountAll(condition)

    success(res, '查询章节列表成功', { 
      chapters: rows,
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

//查询章节详情
router.get('/:id', async function (req, res, next) {
  try {
    const chapter = await getChapter(req);
    success(res, '查询章节成功', { chapter })
  } catch (error) {
    failure(res, error)
  }
});

//创建章节
router.post('/', async function (req, res, next) {
  try {
    const body = filterBody(req)
    const chapter = await Chapter.create(body)
    success(res, '创建章节成功', { chapter }, 201)
  } catch (error) {
    failure(res, error)
  }
});

//删除章节
router.delete('/:id', async function (req, res, next) {
  try {
    const chapter = await getChapter(req);
    await chapter.destroy()
    success(res, '删除章节成功')
  } catch (error) {
    failure(res, error)
  }
});

//更新章节
router.put('/:id', async function (req, res, next) {
  try {
    const chapter = await getChapter(req)
    const body = filterBody(req)

    await chapter.update(body)

    success(res, '更新章节成功')
  } catch (error) {
    failure(res, error)
  }
});

function getCondition(){
  return {
    attributes: { excude: ['CategoryId'] },
    include: [
      {
        model: Course,
        as: 'course',
        attributes: ['id', 'name']
      },
    ],
  }
}

async function getChapter(req) {
  const { id } = req.params;

  const condition = getCondition()
  const chapter = await Course.findByPk(id, condition);

  if(!chapter){
    throw new NotFoundError(`ID: ${ id } 的章节未找到。`)
  }

  return chapter
} 

function filterBody(req) {
  // 强参数过滤
  const body = {
    courseId: req.body.courseId,
    title: req.body.title,
    content: req.body.content,
    video: req.body.video,
    rank: req.body.rank,
  }
  return body
}

module.exports = router;

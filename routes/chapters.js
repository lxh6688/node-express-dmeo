const express = require('express');
const router = express.Router();
const { Chapter, User, Course } = require('../models');
const { success, failure } = require('../utils/responses');

router.get('/:id', async function(req, res, next) {
  try {
    const { id } = req.params

    const chapter = await Chapter.findByPk(id, {
      attributes: { exclude: ['CategoryId'] }
    })

    // 查询章节关联的课程
    const course = await chapter.getCourse({
      attributes: ['id', 'name', 'userId']
    })

    const user = await course.getUser({
      attributes: ['id', 'username', 'nickname', 'avatar', 'company']
    })


    if(!chapter) {
      throw new NotFoundError(`ID: ${ id }的章节未找到`)
    }

    const chapters = await Chapter.findAll({
      attributes: { exclude: ['CourseId', 'content' ] },
      where: { courseId: chapter.courseId },
      order: [['rank', 'ASC'], ['id', 'DESC']],
    })

    success(res, '查询章节成功', { chapter, course, user, chapters })
  } catch (error) {
    failure(res, error)
  }
});

module.exports = router;

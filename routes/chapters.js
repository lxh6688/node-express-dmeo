const express = require('express');
const router = express.Router();
const { Chapter, User, Course } = require('../models');
const { success, failure } = require('../utils/responses');

router.get('/:id', async function(req, res, next) {
  try {
    const { id } = req.params
    const condition = {
      attributes: { exclude: ['CategoryId'] },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'nickname', 'avatar', 'company'],
            },
          ]
        },
      ],
    }

    const chapter = await Chapter.findByPk(id, condition)
    if(!chapter) {
      throw new NotFoundError(`ID: ${ id }的章节未找到`)
    }

    const chapters = await Chapter.findAll({
      attributes: { exclude: ['CourseId', 'content' ] },
      where: { courseId: chapter.courseId },
      order: [['rank', 'ASC'], ['id', 'DESC']],
    })

    success(res, '查询章节成功', { chapter, chapters })
  } catch (error) {
    failure(res, error)
  }
});

module.exports = router;

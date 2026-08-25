const express = require('express');
const router = express.Router();
const { Like, User, Course } = require('../models');
const { success, failure } = require('../utils/responses')
const { NotFoundError } = require('../utils/errors')

router.post('/', async function(req, res, next) {
  try {
    const userId = req.userId
    const { courseId } = req.body

    const course = await Course.findByPk(courseId)
    if(!course) {
      throw new NotFoundError('课程不存在。')
    }

    const like = await Like.findOne({
      where: {
        courseId,
        userId
      }
    })
    if(!like) {
      await Like.create({courseId, userId})
      await course.increment('likesCount')
      success(res, '点赞成功')
    } else {
      await like.destroy()
      await course.decrement('likesCount')
      success(res, '取消点赞成功')
    }

  } catch (error) {
    failure(res, error)
  }
});

// 查询用户点赞的课程
router.get('/', async function(req, res, next) {
  try {
    const query = req.query
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    const user = await User.findByPk(req.userId)

    // 查询当前用户点赞过的课程
    const courses = await user.getLikeCourses({
      joinTableAttributes: [],
      attributes: { exclude: ['CategoryId', 'UserId', 'content'] },
      order: [['id', 'Desc']],
      limit: pageSize,
      offset: offset
    })

    const count = await user.countLikeCourses()

    success(res, '查询用户点赞的课程成功', {
      courses,
      pagination: {
        total: count,
        currentPage,
        pageSize
      }
    })

  } catch (error) {
    failure(res, error)
  }
});

module.exports = router;

const { Lecturer, Review, School, User, Course } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

async function list(req, res) {
  const search = req.query.search ? req.query.search.toLowerCase() : '';

  try {
    const lecturers = await Lecturer.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      include: [
        {
          model: Review,
          as: 'reviews',
          attributes: [],
        },
        {
          model: School,
          attributes: ['name'],
        },
      ],
      attributes: [
        'id',
        'name',
        [fn('COUNT', col('reviews.id')), 'totalReviews'],
        [fn('AVG', col('reviews.rating')), 'averageRating'],
      ],
      order: [[literal('totalReviews'), 'DESC']],
      group: ['Lecturer.id'],
    });

    return res.send(lecturers);
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

async function get(req, res) {
  try {
    const lecturer = await Lecturer.find({
      where: { id: req.params.id },
      include: [
        {
          model: School,
          attributes: ['id', 'name'],
        },
        {
          model: Review,
          as: 'reviews',
          attributes: [],
        },
      ],
      attributes: [
        'id',
        'name',
        [fn('COUNT', col('reviews.id')), 'totalReviews'],
        [fn('AVG', col('reviews.rating')), 'averageRating'],
      ],
    });

    return res.send(lecturer);
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

async function courses(req, res) {
  try {
    const courses = await Review.findAll({
      where: { lecturerId: req.params.id },
      include: [
        {
          model: Course,
          attributes: ['id', 'code', 'name'],
          group: ['Course.id'],
        },
      ],
      attributes: [],
    });

    return res.send(reduceCourses(courses));
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

async function create(req, res) {
  try {
    const lecturer = await Lecturer.create({
      schoolId: req.body.school_id,
      name: req.body.name,
      avatar: req.body.avatar,
    });

    return res.send(lecturer);
  } catch (error) {
    switch (error.name) {
      case 'SequelizeValidationError':
        return res.boom.badData('', {
          errors: error.errors.map(a => a.message),
        });
      default:
        return res.boom.serverUnavailable();
    }
  }
}

async function update({ body, params }, res) {
  try {
    const lecturer = await Lecturer.findById(params.id);

    await lecturer.update({
      schoolId: body.school_id || lecturer.schoolId,
      name: body.name || lecturer.name,
    });

    return res.send(lecturer);
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

function reduceCourses(array) {
  const courses = array.map(a => a.get({ plain: true }));

  const results = courses
    .reduce((array, cur) => {
      if (array.filter(b => b.Course.code === cur.Course.code).length === 0) {
        return [...array, { Course: { ...cur.Course, reviews: 1 } }];
      } else {
        return array.map(
          a =>
            a.Course.code === cur.Course.code
              ? {
                  Course: {
                    ...a.Course,
                    reviews: a.Course.reviews + 1,
                  },
                }
              : a
        );
      }
    }, [])
    .map(a => a.Course);

  return {
    count: results.length,
    rows: results,
  };
}

module.exports = {
  list,
  courses,
  create,
  get,
  update,
};

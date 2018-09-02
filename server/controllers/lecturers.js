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

function get(req, res) {
  Lecturer.find({
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
  })
    .then(lecturer => {
      if (!lecturer) {
        return res.boom.notFound(`Lecturer with id not found`);
      }

      return res.send(lecturer);
    })
    .catch(() => res.boom.serverUnavailable());
}

function reviews(req, res) {
  Lecturer.findById(req.params.id)
    .then(lecturer => {
      if (!lecturer) {
        return res.boom.notFound(`Lecturer with id not found`);
      }

      Review.findAndCount({
        order: [['id', 'DESC']],
        where: { lecturerId: req.params.id },
        include: [
          {
            model: User,
            attributes: ['name', 'avatar'],
          },
          {
            model: Course,
            attributes: ['code', 'name'],
          },
        ],
        attributes: ['id', 'semester', 'year', 'rating', 'comment'],
      })
        .then(reviews => {
          res.status(200).send(reviews);
        })
        .catch(() => res.boom.serverUnavailable());
    })
    .catch(() => res.boom.serverUnavailable());
}

function reviewsForCourse(req, res) {
  Lecturer.findById(req.params.id)
    .then(lecturer => {
      if (!lecturer) {
        return res.boom.notFound(`Lecturer with id not found`);
      }

      Review.findAll({
        order: [['id', 'DESC']],
        where: { lecturerId: req.params.id, courseId: req.params.courseId },
        include: [
          {
            model: User,
            attributes: ['name', 'avatar'],
          },
        ],
        attributes: ['id', 'semester', 'year', 'rating', 'comment'],
      })
        .then(reviews => {
          res.status(200).send(reviews);
        })
        .catch(() => res.boom.serverUnavailable());
    })
    .catch(() => res.boom.serverUnavailable());
}

function courses(req, res) {
  Lecturer.findById(req.params.id)
    .then(lecturer => {
      if (!lecturer) {
        return res.boom.notFound(`Lecturer with id not found`);
      }

      return Review.findAll({
        where: { lecturerId: req.params.id },
        include: [
          {
            model: Course,
            attributes: ['id', 'code', 'name'],
            group: ['Course.id'],
          },
        ],
        attributes: [],
      })
        .then(reviews => res.status(200).send(reduceCourses(reviews)))
        .catch(() => res.boom.serverUnavailable());
    })
    .catch(() => res.boom.serverUnavailable());
}

function create(req, res) {
  Lecturer.create({
    schoolId: req.body.school_id,
    name: req.body.name,
    avatar: req.body.avatar,
  })
    .then(lecturer => res.status(200).send(lecturer))
    .catch(error => {
      switch (error.name) {
        case 'SequelizeValidationError':
          return res.boom.badData('', {
            errors: error.errors.map(a => a.message),
          });
        default:
          return res.boom.serverUnavailable();
      }
    });
}

function update({ body, params }, res) {
  Lecturer.findById(params.id)
    .then(lecturer => {
      if (!lecturer) {
        return res.boom.notFound(`Lecturer with id not found`);
      }

      return lecturer
        .update({
          schoolId: body.school_id || lecturer.schoolId,
          name: body.name || lecturer.name,
        })
        .then(() => res.status(200).send(lecturer))
        .catch(() => res.boom.serverUnavailable());
    })
    .catch(() => res.boom.serverUnavailable());
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
  reviews,
  reviewsForCourse,
  courses,
  create,
  get,
  update,
};

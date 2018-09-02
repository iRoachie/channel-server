const { Lecturer, Review, School, User, Course } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

function list(req, res) {
  const search = req.query.search ? req.query.search.toLowerCase() : '';

  Lecturer.findAll({
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
        model: School,
        attributes: ['name'],
      },
    ],
    attributes: ['id', 'name'],
  })
    .then(lecturer => res.status(200).send(lecturer))
    .catch(() => res.boom.serverUnavailable());
}

function listWithReviews(req, res) {
  const search = req.query.search ? req.query.search.toLowerCase() : '';

  Lecturer.findAll({
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
    attributes: {
      include: [
        [fn('COUNT', col('reviews.id')), 'totalReviews'],
        [fn('SUM', col('reviews.rating')), 'totalRatings'],
      ],
    },
    order: [[literal('totalReviews'), 'DESC']],
    group: ['Lecturer.id'],
  })
    .then(lecturers =>
      res.status(200).send(
        lecturers.map(a => {
          a.dataValues.averageRating =
            a.dataValues.totalRatings / a.dataValues.totalReviews;

          delete a.dataValues.totalRatings;
          return a;
        })
      )
    )
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

function get(req, res) {
  Lecturer.find({
    where: { id: req.params.id },
    include: [
      {
        model: School,
        attributes: ['id', 'name'],
      },
    ],
    attributes: ['id', 'name'],
  })
    .then(lecturer => {
      if (!lecturer) {
        return res.boom.notFound(`Lecturer with id not found`);
      }

      return res.status(200).send(lecturer);
    })
    .catch(() => res.boom.serverUnavailable());
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
  listWithReviews,
  reviews,
  reviewsForCourse,
  courses,
  create,
  get,
  update,
};

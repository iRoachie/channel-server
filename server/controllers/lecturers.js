const Lecturer = require("../models").Lecturer;
const Review = require("../models").Review;
const School = require("../models").School;
const models = require("../models");

function list(req, res) {
  const search = req.query.search ? req.query.search.toLowerCase() : "";

  Lecturer.findAll({
    where: {
      [models.sequelize.Op.or]: [
        {
          name: {
            [models.sequelize.Op.like]: `%${search}%`,
          },
        },
      ],
    },
    include: [
      {
        model: Review,
        as: "reviews",
        attributes: [],
      },
      {
        model: School,
        attributes: ["name"],
      },
    ],
    attributes: {
      include: [
        [
          models.sequelize.fn("COUNT", models.sequelize.col("reviews.id")),
          "totalReviews",
        ],
        [
          models.sequelize.fn("SUM", models.sequelize.col("reviews.rating")),
          "totalRatings",
        ],
      ],
    },
    group: ["Lecturer.id"],
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
    .catch(error => {
      res.status(400).send(error);
      throw new Error(error);
    });
}

function reviews(req, res) {
  Lecturer.findById(req.params.id)
    .then(lecturer => {
      if (!lecturer) {
        return res.status(404).send({
          message: "Lecturer with id not found",
        });
      }

      Review.findAndCount({
        order: [["id", "DESC"]],
        where: { lecturerId: req.params.id },
        include: [
          {
            model: models.User,
            attributes: ["name", "avatar"],
          },
          {
            model: models.Course,
            attributes: ["code", "name"],
          },
        ],
        attributes: ["id", "semester", "year", "rating", "comment"],
      })
        .then(reviews => {
          res.status(200).send(reviews);
        })
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
}

function reviewsForCourse(req, res) {
  Lecturer.findById(req.params.id)
    .then(lecturer => {
      if (!lecturer) {
        return res.status(404).send({
          message: "Lecturer with id not found",
        });
      }

      Review.findAll({
        order: [["id", "DESC"]],
        where: { lecturerId: req.params.id, courseId: req.params.courseId },
        include: [
          {
            model: models.User,
            attributes: ["name", "avatar"],
          },
        ],
        attributes: ["id", "semester", "year", "rating", "comment"],
      })
        .then(reviews => {
          res.status(200).send(reviews);
        })
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
}

function courses(req, res) {
  Lecturer.findById(req.params.id)
    .then(lecturer => {
      if (!lecturer) {
        return res.status(404).send({
          message: "Lecturer with id not found",
        });
      }

      return Review.findAll({
        where: { lecturerId: req.params.id },
        include: [
          {
            model: models.Course,
            attributes: ["id", "code", "name"],
            group: ["Course.id"],
          },
        ],
        attributes: [],
      })
        .then(reviews => res.status(200).send(reduceCourses(reviews)))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(404).send(error));
}

function create(req, res) {
  Lecturer.create({
    schoolId: req.body.school_id,
    name: req.body.name,
    avatar: req.body.avatar,
  })
    .then(lecturer => res.status(200).send(lecturer))
    .catch(error => res.status(400).send(error));
}

function get(req, res) {
  Lecturer.findAll({
    where: { id: req.params.id },
    include: [
      {
        model: School,
      },
    ],
    attributes: ["id", "name"],
  })
    .then(lecturer => {
      if (!lecturer) {
        return res.status(404).send({
          message: "Lecturer with id not found",
        });
      }

      return res.status(200).send(lecturer);
    })
    .catch(error => res.status(400).send(error));
}

function update(req, res) {
  Lecturer.findById(req.params.id)
    .then(lecturer => {
      if (!lecturer) {
        return res.status(404).send({
          message: "Lecturer with id not found",
        });
      }

      return lecturer
        .update({
          schoolId: req.body.school_id || lecturer.schoolId,
          name: req.body.name || lecturer.name,
        })
        .then(() => res.status(200).send(lecturer))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
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

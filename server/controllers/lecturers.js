const Lecturer = require("../models").Lecturer;
const Review = require("../models").Review;
const School = require("../models").School;
const models = require("../models");

module.exports = {
  list(req, res) {
    Lecturer.findAll({
      include: [
        {
          model: Review,
          as: "reviews",
          attributes: [],
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
        throw new Error(error);
        res.status(400).send(error);
      });
  },
  reviews(req, res) {
    Lecturer.findById(req.params.id)
      .then(lecturer => {
        if (!lecturer) {
          return res.status(404).send({
            message: "Lecturer with id not found",
          });
        }

        Review.findAll({ where: { lecturerId: req.params.id } })
          .then(reviews => {
            res.status(200).send(reviews);
          })
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
  create(req, res) {
    Lecturer.create({
      schoolId: req.body.school_id,
      name: req.body.name,
      avatar: req.body.avatar,
    })
      .then(lecturer => res.status(200).send(lecturer))
      .catch(error => res.status(400).send(error));
  },
  get(req, res) {
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
  },
  update(req, res) {
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
  },
};

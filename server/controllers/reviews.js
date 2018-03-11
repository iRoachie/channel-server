const Review = require("../models").Review;

module.exports = {
  list(req, res) {
    return Review.all()
      .then(reviews => res.status(200).send(reviews))
      .catch(error => res.status(400).send(error));
  },
  create(req, res) {
    Review.findAll({
      where: {
        userId: req.body.user_id,
        lecturerId: req.body.lecturer_id,
        courseId: req.body.course_id,
      },
    })
      .then(reviews => {
        if (reviews) {
          return res.status(400).send({
            message:
              "User has already made a review for this course and lecturer",
          });
        }

        Review.create({
          userId: req.body.user_id,
          lecturerId: req.body.lecturer_id,
          courseId: req.body.course_id,
          semester: req.body.semester,
          year: req.body.year,
          rating: req.body.rating,
        })
          .then(review => {
            res.status(200).send(review);
          })
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};

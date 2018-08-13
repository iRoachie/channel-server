const { Review } = require('../models');

function list(_, res) {
  return Review.all()
    .then(reviews => res.send(reviews))
    .catch(() => res.boom.serverUnavailable());
}

function create(req, res) {
  Review.findAll({
    where: {
      userId: req.body.user_id,
      lecturerId: req.body.lecturer_id,
      courseId: req.body.course_id,
    },
  })
    .then(reviews => {
      if (reviews.length > 0) {
        return res.boom.conflict(
          `You've already made a review for this course and lecturer.`
        );
      }

      return Review.create({
        userId: req.body.user_id,
        lecturerId: req.body.lecturer_id,
        courseId: req.body.course_id,
        semester: req.body.semester,
        year: req.body.year,
        rating: req.body.rating,
        comment: req.body.comment,
      })
        .then(review => {
          res.send(review);
        })
        .catch(error => res.boom.badRequest(error));
    })
    .catch(error => res.boom.badRequest(error));
}

module.exports = {
  list,
  create,
};

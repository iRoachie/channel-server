const { Course, Review, sequelize } = require('../models');
const { Op, fn, col } = require('sequelize');

function list(req, res) {
  const search = req.query.search ? req.query.search.toLowerCase() : '';

  return Course.findAll({
    where: {
      [Op.or]: [
        {
          code: {
            [Op.like]: `%${search}%`,
          },
        },
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
        attributes: [],
      },
    ],
    attributes: {
      include: [[fn('COUNT', col('Reviews.id')), 'totalReviews']],
    },
    group: ['Course.id'],
  })
    .then(courses => res.status(200).send(courses))
    .catch(error => res.status(400).send(error));
}

function get(req, res) {
  return Course.findOne({ where: { id: req.params.courseId } })
    .then(course => {
      if (!course) {
        return res.status(404).send({
          message: 'No course with that id',
        });
      }

      return res.status(200).send(course);
    })
    .catch(error => res.status(400).send(error));
}

function create(req, res) {
  return Course.create({
    code: req.body.code,
    name: req.body.name,
  })
    .then(course => res.status(200).send(course))
    .catch(error => res.status(400).send(error));
}

function listReviewedLecturers(req, res) {
  const courseId = req.params.courseId;
  return sequelize
    .query(
      `SELECT l.id, l.name, l.schoolId, s.name as schoolName, COUNT(r.id) as totalReviews FROM Lecturers l
  INNER JOIN Reviews r
  on r.lecturerId = l.id
  INNER JOIN Schools s
  on l.schoolId = s.id
  where r.courseId = ?
  GROUP BY r.courseId, r.lecturerId
  ORDER BY totalReviews DESC;`,
      { replacements: [courseId], type: sequelize.QueryTypes.SELECT }
    )
    .then(results => {
      res.send(
        results.map(a => ({
          id: a.id,
          name: a.name,
          totalReviews: a.totalReviews,
          School: {
            name: a.schoolName,
          },
        }))
      );
    })
    .catch(() => {
      res.boom.serverUnavailable();
    });
}

module.exports = {
  list,
  get,
  create,
  listReviewedLecturers,
};

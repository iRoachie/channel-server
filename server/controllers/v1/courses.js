const { Course, Review, sequelize } = require('../../models');
const { Op, fn, col } = require('sequelize');

async function list(req, res) {
  const search = req.query.search ? req.query.search.toLowerCase() : '';

  try {
    const courses = await Course.findAll({
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
      attributes: [
        'id',
        'code',
        'name',
        [fn('COUNT', col('Reviews.id')), 'totalReviews'],
      ],
      group: ['Course.id'],
    });

    res.send(courses);
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

async function get(req, res) {
  try {
    const course = await Course.findOne({
      where: { id: req.params.courseId },
      attributes: ['id', 'code', 'name'],
    });

    if (!course) {
      return res.boom.notFound('No course with that id');
    }

    return res.status(200).send(course);
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

async function create(req, res) {
  try {
    const course = await Course.create({
      code: req.body.code,
      name: req.body.name,
    });

    return res.send(course);
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

async function listReviewedLecturers(req, res) {
  const courseId = req.params.courseId;

  try {
    const results = await sequelize.query(
      `SELECT l.id, l.name, l.schoolId, s.name as schoolName, COUNT(r.id) as totalReviews FROM Lecturers l
  INNER JOIN Reviews r
  on r.lecturerId = l.id
  INNER JOIN Schools s
  on l.schoolId = s.id
  where r.courseId = ?
  GROUP BY r.courseId, r.lecturerId
  ORDER BY totalReviews DESC;`,
      { replacements: [courseId], type: sequelize.QueryTypes.SELECT }
    );

    return res.send(
      results.map(a => ({
        id: a.id,
        name: a.name,
        totalReviews: a.totalReviews,
        School: {
          name: a.schoolName,
        },
      }))
    );
  } catch (error) {
    return res.boom.serverUnavailable();
  }
}

module.exports = {
  list,
  get,
  create,
  listReviewedLecturers,
};

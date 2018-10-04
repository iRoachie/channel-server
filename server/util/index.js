const validateParams = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 25;
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;
  const search = req.query.search ? req.query.search.toLowerCase() : ``;

  if (isNaN(limit)) {
    res.boom.badRequest(`limit should be a number`);
    return false;
  }

  if (isNaN(skip)) {
    res.boom.badRequest(`skip should be a number`);
    return false;
  }

  if (limit === 0) {
    limit = undefined;
  }

  return { limit, skip, search };
};

const paginateResults = ({ count, limit, skip, rows }) => {
  /**
   * Necessary because of https://github.com/sequelize/sequelize/issues/6148
   */
  const realCount = Array.isArray(count) ? count.length : count;

  const response = {
    pageInfo: {
      totalResults: realCount,
      resultsPerPage: limit ? limit : realCount,
      skip,
    },
  };

  if (realCount - (skip + limit) > 0) {
    response.pageInfo.nextSkip = skip + limit;
  }

  response.results = rows;

  return response;
};

module.exports = {
  paginateResults,
  validateParams,
};

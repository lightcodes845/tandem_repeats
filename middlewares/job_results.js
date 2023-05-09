const jobResults = (model) => {
  return async (req, res, next) => {
    const sortVariable = req.query.sort ? req.query.sort : "createdAt";
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 2;
    const page =
      req.query.page && req.query.page !== "0"
        ? parseInt(req.query.page, 10)
        : 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = await model.aggregate([
      { $match: { user: user._id } },
      { $sort: { [sortVariable]: -1 } },
      {
        $project: {
          _id: 1,
          status: 1,
          job_name: 1,
          createdAt: 1,
        },
      },
      {
        $facet: {
          count: [{ $group: { _id: null, count: { $sum: 1 } } }],
          sample: [{ $skip: startIndex }, { $limit: limit }],
        },
      },
      { $unwind: "$count" },
      {
        $project: {
          count: "$count.count",
          data: "$sample",
        },
      },
    ]);

    if (result[0]) {
      const { count, data } = result[0];

      const pagination = {};

      if (endIndex < count) {
        pagination.next = { page: page + 1, limit };
      }

      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit,
        };
      }
      //
      res.jobResults = {
        success: true,
        count: data.length,
        total: count,
        pagination,
        data,
      };
    }
    res.jobResults = {
      success: true,
      count: 0,
      total: 0,
      data: [],
    };
    next();
  };
};

module.exports = jobResults;

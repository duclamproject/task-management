const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

// [Get] /api/v1/task/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // End: Search

  // Pagination
  // Công thức phân trang (Skip)= (CurrentPage - 1) * LimtIems;
  let initPagination = {
    currentPage: 1,
    limitItems: 2,
  };

  const countTasks = await Task.countDocuments(find);
  const objectPagination = paginationHelper(
    initPagination,
    req.query,
    countTasks
  );
  // End Pagination

  // Sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  // End Sort

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  res.json(tasks);
};

// [GET] /api/v1/task/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({ _id: id, deleted: false });
    res.json(task);
  } catch (error) {
    res.json("Không tìm thấy");
  }
};

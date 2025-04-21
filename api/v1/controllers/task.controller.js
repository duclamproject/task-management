const Task = require("../models/task.model");

// [Get] /api/v1/task/
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Pagination
  // Công thức phân trang (Skip)= (CurrentPage - 1) * LimtIems;
  //   let initPagination = {
  //     currentPage: 1,
  //     limitItems: 4,
  //   };
  //   const countTasks = await Task.countDocuments(find);
  //   const objectPagination = paginationHelper(
  //     initPagination,
  //     req.query,
  //     countTasks
  //   );
  // End Pagination

  // Sort
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  // End Sort

  const tasks = await Task.find(find).sort(sort);
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

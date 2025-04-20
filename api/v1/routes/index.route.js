const taskRoute = require("./task.route");
module.exports = (app) => {
  const version = "/api/v1";
  app.use(version + "/task", taskRoute);
};

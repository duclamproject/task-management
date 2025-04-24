const express = require("express");
const router = express.Router();
const controller = require("../controllers/task.controller");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.post("/create", controller.create);

router.patch("/delete/:id", controller.delete);

router.patch("/edit/:id", controller.edit);

module.exports = router;

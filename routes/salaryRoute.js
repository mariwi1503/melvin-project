const router = require("express").Router(),
  salaryController = require("../controllers/salaryController"),
  auth = require("../middleware/auth");

router.get("/salaries", auth.user, salaryController.getAllSalaryData);
router.get("/salaries/:exportType", auth.user, salaryController.exportToExcel);
router.post("/salary", auth.user, salaryController.insertSalaryData);
router.get("/salary/:id", auth.user, salaryController.getSalaryDataById);
router.put("/salary/:id", auth.user, salaryController.updateSalaryData);
router.delete("/salary/:id", auth.user, salaryController.deleteSalaryData);

module.exports = router;

const { createCategory, listCategories, updateCategory, deleteCategory, detailCategory } = require("../controller/categories-controller");
const { protect } = require("../middleware/jwt");

const app = require("express");
const router = app.Router();

router.post("/category/create", protect, createCategory);
router.get("/category/list", listCategories);
router.put("/category/:id/update", protect, updateCategory);
router.delete("/category/:id/delete", protect, deleteCategory);
router.get("/category/:id/detail", detailCategory);

module.exports = router;

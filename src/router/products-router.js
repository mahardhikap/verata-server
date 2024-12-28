const {
  createProduct,
  listProducts,
  updateProduct,
  deleteProduct,
  detailProduct,
  searchProducts
} = require("../controller/products-controller");
const { protect } = require("../middleware/jwt");

const app = require("express");
const router = app.Router();

router.post("/product/create", protect, createProduct);
router.get("/product/list", listProducts);
router.get("/product/filtered", searchProducts);
router.get("/product/:id/detail", detailProduct);
router.put("/product/:id/update", protect, updateProduct);
router.delete("/product/:id/delete", protect, deleteProduct);

module.exports = router;

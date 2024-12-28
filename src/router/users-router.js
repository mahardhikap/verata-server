const {
  registerUser,
  createUser,
  listUsers,
  loginUser,
  deleteUser,
  detailUser,
  updateUser
} = require("../controller/users-controller");
const { protect } = require("../middleware/jwt");

const app = require("express");
const router = app.Router();

router.post("/user/register", registerUser);
router.post("/user/create", protect, createUser);
router.post("/user/login", loginUser);
router.get("/user/list", protect, listUsers);
router.delete("/user/delete", protect, deleteUser);
router.get("/user/detail", protect, detailUser)
router.put("/user/:id/update", protect, updateUser);

module.exports = router;

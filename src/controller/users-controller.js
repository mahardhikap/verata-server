const {
  postRegister,
  getUserByUsername,
  getUsers,
  deleteUserById,
  updateUserById,
  getUserById,
} = require("../model/users-model");
const { hashPassword, verifyPassword } = require("../middleware/bcrypt");
const { responseMessage } = require("../utils/response-message");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../middleware/jwt");

const usersController = {
  registerUser: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.json(responseMessage("badRequest"));
      }

      let post = {
        id: uuidv4(),
        username,
        password: await hashPassword(password),
        roles: "superadmin",
      };

      const result = await postRegister(post);
      if (result.affectedRows > 0) {
        return res.json(responseMessage("created", result.affectedRows));
      }
      return res.json(responseMessage("notFound"));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  createUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const { roles: userRoles } = req.payload;
      if (userRoles !== "superadmin") {
        return res.json(responseMessage("forbidden"));
      }
      if (!username || !password) {
        return res.json(responseMessage("badRequest"));
      }

      let post = {
        id: uuidv4(),
        username,
        password: await hashPassword(password),
        roles: "admin",
      };

      const result = await postRegister(post);
      if (result.affectedRows > 0) {
        return res.json(responseMessage("created", result.affectedRows));
      }
      return res.json(responseMessage("notFound"));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.json(responseMessage("badRequest"));
      }
      const checkUsername = await getUserByUsername(username);
      if (!checkUsername[0]) {
        return res.json(responseMessage("notFound"));
      }
      let user = checkUsername[0];
      const checkPassword = await verifyPassword(password, user.password);
      if (checkPassword) {
        delete user.password;
        const token = generateToken(user);
        user.token = token;
        return res.json(responseMessage("loginSuccess", user));
      } else {
        return res.json(responseMessage("loginFailed"));
      }
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  listUsers: async (req, res) => {
    try {
      const { roles } = req.payload;
      if (roles !== "superadmin") {
        return res.json(responseMessage("unauthorized"));
      } else {
        const result = await getUsers();
        return res.json(responseMessage("success", result));
      }
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.payload;
      if (!id) {
        return res.json(responseMessage("unauthorized"));
      } else {
        const result = await deleteUserById(id);
        return res.json(responseMessage("deleted", result.affectedRows));
      }
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  detailUser: async (req, res) => {
    try {
      const { id } = req.payload;
      const result = await getUserById(id);
      if (result.length > 0) {
        return res.json(responseMessage("success", result[0]));
      }
      return res.json(responseMessage("notFound"));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  updateUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const { id } = req.params;
      const { id: userId } = req.payload;
      if (id !== userId) {
        return res.json(responseMessage("forbidden"));
      }

      const dataBefore = await getUserById(id);
      let userData = dataBefore[0];

      let update = {
        id: userData.id,
        username: username || userData.username,
        password:
          password !== "" ? await hashPassword(password) : userData.password,
      };

      const result = await updateUserById(update);
      if (result.affectedRows > 0) {
        return res.json(responseMessage("updated", result.affectedRows));
      }
      return res.json(responseMessage("notFound"));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
};

module.exports = usersController;

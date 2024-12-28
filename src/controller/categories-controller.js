const { responseMessage } = require("../utils/response-message");
const {
  postCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
} = require("../model/categories-model");
const { v4: uuidv4 } = require("uuid");

const categoriesController = {
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const { roles } = req.payload;

      if (roles !== "admin" && roles !== "superadmin") {
        return res.json(responseMessage("forbidden"));
      }
      if (!name) {
        return res.json(responseMessage("emptyField"));
      }
      let post = {
        id: uuidv4(),
        name,
      };
      const result = await postCategory(post);
      if (result) {
        return res.json(responseMessage("created", result.affectedRows));
      }
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  listCategories: async (req, res) => {
    try {
      const result = await getCategories();
      return res.json(responseMessage("success", result));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const { id } = req.params;
      const { roles } = req.payload;
      if (roles !== "admin" && roles !== "superadmin") {
        return res.json(responseMessage("forbidden"));
      }

      const dataBefore = await getCategoryById(id);
      let categoryData = dataBefore[0];

      let update = {
        id: categoryData.id,
        name: name || categoryData.name,
      };

      const result = await updateCategoryById(update);
      if (result.affectedRows > 0) {
        return res.json(responseMessage("updated", result.affectedRows));
      }
      return res.json(responseMessage("notFound"));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { roles } = req.payload;
      if (roles !== "admin" && roles !== "superadmin") {
        return res.json(responseMessage("unauthorized"));
      }
      const result = await deleteCategoryById(id);
      return res.json(responseMessage("deleted", result.affectedRows));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  detailCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await getCategoryById(id);
      if (result.length > 0) {
        return res.json(responseMessage("success", result[0]));
      }
      return res.json(responseMessage("notFound"));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  }
};

module.exports = categoriesController;

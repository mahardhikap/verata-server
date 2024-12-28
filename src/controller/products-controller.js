const { responseMessage } = require("../utils/response-message");
const {
  postProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductCount,
  getFilterProduct,
} = require("../model/products-model");
const { v4: uuidv4 } = require("uuid");

const productsController = {
  createProduct: async (req, res) => {
    try {
      const { roles } = req.payload;
      const { product, disc, description, price, image, stock, category_id } =
        req.body;
      if (roles !== "admin" && roles !== "superadmin") {
        return res.json(responseMessage("forbidden"));
      }
      if (!product || !category_id) {
        return res.json(responseMessage("emptyField"));
      }

      let post = {
        id: uuidv4(),
        product,
        disc,
        description,
        price,
        image,
        stock,
        category_id,
      };
      const result = await postProduct(post);
      if (result.affectedRows > 0) {
        return res.json(responseMessage("created", result.affectedRows));
      }
      return res.json(responseMessage("badRequest"));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  listProducts: async (req, res) => {
    try {
      const result = await getProducts();
      const formattedResult = result.map((product) => ({
        ...product,
        stock: product.stock === 1,
      }));
      return res.json(responseMessage("success", formattedResult));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { roles } = req.payload;
      const { product, disc, description, price, image, stock, category_id } =
        req.body;

      if (roles !== "admin" && roles !== "superadmin") {
        return res.json(responseMessage("forbidden"));
      }

      const dataBefore = await getProductById(id);
      let productData = dataBefore[0];

      let update = {
        id: productData.id,
        product: product || productData.product,
        disc: disc,
        description: description,
        price: price,
        image:
          Array.isArray(image) && image.length > 0 ? image : productData.image,
        stock: stock !== undefined ? stock : productData.stock,
        category_id: category_id || productData.category_id,
      };

      const result = await updateProductById(update);
      if (result.affectedRows > 0) {
        return res.json(responseMessage("updated", result.affectedRows));
      }
      return res.json(responseMessage("notFound"));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { roles } = req.payload;
      if (roles !== "admin" && roles !== "superadmin") {
        return res.json(responseMessage("unauthorized"));
      }
      const result = await deleteProductById(id);
      return res.json(responseMessage("deleted", result.affectedRows));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  detailProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await getProductById(id);
      if (result.length > 0) {
        return res.json(responseMessage("success", result[0]));
      }
      return res.json(responseMessage("notFound"));
    } catch (error) {
      return res.json(responseMessage("internalError", error.message));
    }
  },
  searchProducts: async (req, res) => {
    try {
      const { searchby, search, sortby, sort, limit } = req.query;
      let page = parseInt(req.query.page) || 1;
      let limiter = parseInt(limit) || 5;

      let post = {
        sortby: sortby || "created_at",
        sort: sort || "DESC",
        limit: limiter, // Use limiter here for consistency
        offset: (page - 1) * limiter,
        searchby: searchby || "product",
        search: search || "", // Ensure search is defined
      };

      const result = await getFilterProduct(post);
      const resultCount = await getProductCount(post);

      const list = result.map((product) => ({
        ...product,
        stock: product.stock === 1,
      }));
      // Check if resultCount is valid
      if (!resultCount || typeof resultCount !== "number") {
        throw new Error("Failed to retrieve product count");
      }

      let pagination = {
        totalPage: Math.ceil(resultCount / limiter), // Use resultCount directly
        totalData: result.length,
        pageNow: page,
      };

      let detailData = {
        list,
        pagination,
      };

      if (result.length > 0) {
        return res.json(responseMessage("success", detailData));
      } else {
        return res.json(responseMessage("notFound"));
      }
    } catch (error) {
      console.log(error)
      return res.json(responseMessage("internalError", error.message));
    }
  },
};

module.exports = productsController;

const GET_API = [
  "/shopping/orders/list",
  "/shopping/orders/delete",
  "/shopping/customers/list",
  "/shopping/customers/delete",
  "/shopping/products/list",
  "/shopping/products/delete",
  "/shopping/product_types/list",
  "/shopping/product_types/delete",
  "/shopping/product_specs/list",
  "/shopping/product_specs/delete",
  "/shopping/product_brands/list",
  "/shopping/product_brands/delete"
];
const POST_API = [
  "/shopping/orders/create",
  "/shopping/orders/update",
  "/shopping/customers/create",
  "/shopping/customers/update",
  "/shopping/products/create",
  "/shopping/products/update",
  "/shopping/product_types/create",
  "/shopping/product_types/update",
  "/shopping/product_specs/create",
  "/shopping/product_specs/update",
  "/shopping/product_brands/create",
  "/shopping/product_brands/update"
];

module.exports = {
  GET_API,
  POST_API
};

import request from "@/utils/request";

export function fetchProductList(query) {
  return request({
    url: "/shopping/products/list",
    method: "get",
    params: query
  });
}

export function createProduct(query) {
  return request({
    url: "/shopping/products/create",
    method: "post",
    params: query
  });
}

export function updateProduct(query) {
  return request({
    url: "/shopping/products/update",
    method: "post",
    params: query
  });
}

export function fetchProductTypeList(query) {
  return request({
    url: "/shopping/product_types/list",
    method: "get",
    params: query
  });
}

export function createProductType(query) {
  return request({
    url: "/shopping/product_types/create",
    method: "post",
    params: query
  });
}

export function updateProductType(query) {
  return request({
    url: "/shopping/product_types/update",
    method: "post",
    params: query
  });
}

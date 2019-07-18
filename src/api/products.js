import request from "@/utils/request";
const URL_PREFIX = "/shopping/products";

export function fetchProductList(query) {
  return request({
    url: `${URL_PREFIX}/list`,
    method: "get",
    params: query
  });
}

export function createProduct(query) {
  return request({
    url: `${URL_PREFIX}/create`,
    method: "post",
    data: query
  });
}

export function updateProduct(query) {
  return request({
    url: `${URL_PREFIX}/update`,
    method: "post",
    data: query
  });
}

export function deleteProduct(query) {
  return request({
    url: `${URL_PREFIX}/delete`,
    method: "get",
    params: query
  });
}

export function fetchProductKV(query) {
  return request({
    url: `${URL_PREFIX}/kv`,
    method: "get",
    params: query
  });
}

export function searchProduct(query) {
  return request({
    url: `${URL_PREFIX}/search`,
    method: "get",
    params: query
  });
}

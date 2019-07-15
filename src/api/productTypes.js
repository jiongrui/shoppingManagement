import request from "@/utils/request";
const URL_PREFIX = "/shopping/product_types";

export function fetchProductTypeList(query) {
  return request({
    url: `${URL_PREFIX}/list`,
    method: "get",
    params: query
  });
}

export function createProductType(query) {
  return request({
    url: `${URL_PREFIX}/create`,
    method: "post",
    params: query
  });
}

export function updateProductType(query) {
  return request({
    url: `${URL_PREFIX}/update`,
    method: "post",
    params: query
  });
}

export function deleteProductType(query) {
  return request({
    url: `${URL_PREFIX}/delete`,
    method: "get",
    params: query
  });
}

export function fetchProductTypeKV(query) {
  return request({
    url: `${URL_PREFIX}/kv`,
    method: "get",
    params: query
  });
}

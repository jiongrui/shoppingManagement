import request from "@/utils/request";
const URL_PREFIX = "/shopping/product_specs";

export function fetchProductSpecList(query) {
  return request({
    url: `${URL_PREFIX}/list`,
    method: "get",
    params: query
  });
}

export function createProductSpec(query) {
  return request({
    url: `${URL_PREFIX}/create`,
    method: "post",
    params: query
  });
}

export function updateProductSpec(query) {
  return request({
    url: `${URL_PREFIX}/update`,
    method: "post",
    params: query
  });
}

export function deleteProductSpec(query) {
  return request({
    url: `${URL_PREFIX}/delete`,
    method: "get",
    params: query
  });
}

export function fetchProductSpecKV(query) {
  return request({
    url: `${URL_PREFIX}/kv`,
    method: "get",
    params: query
  });
}

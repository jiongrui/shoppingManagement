import request from "@/utils/request";
const URL_PREFIX = "/shopping/product_brands";

export function fetchProductBrandList(query) {
  return request({
    url: `${URL_PREFIX}/list`,
    method: "get",
    params: query
  });
}

export function createProductBrand(query) {
  return request({
    url: `${URL_PREFIX}/create`,
    method: "post",
    params: query
  });
}

export function updateProductBrand(query) {
  return request({
    url: `${URL_PREFIX}/update`,
    method: "post",
    params: query
  });
}

export function deleteProductBrand(query) {
  return request({
    url: `${URL_PREFIX}/delete`,
    method: "get",
    params: query
  });
}

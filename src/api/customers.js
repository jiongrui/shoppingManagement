import request from "@/utils/request";
const URL_PREFIX = "/shopping/customers";

export function fetchCustomerList(query) {
  return request({
    url: `${URL_PREFIX}/list`,
    method: "get",
    params: query
  });
}

export function createCustomer(query) {
  return request({
    url: `${URL_PREFIX}/create`,
    method: "post",
    params: query
  });
}

export function updateCustomer(query) {
  return request({
    url: `${URL_PREFIX}/update`,
    method: "post",
    params: query
  });
}

export function deleteCustomer(query) {
  return request({
    url: `${URL_PREFIX}/delete`,
    method: "get",
    params: query
  });
}

export function fetchCustomerKV(query) {
  return request({
    url: `${URL_PREFIX}/kv`,
    method: "get",
    params: query
  });
}

export function searchCustomer(query) {
  return request({
    url: `${URL_PREFIX}/search`,
    method: "get",
    params: query
  });
}

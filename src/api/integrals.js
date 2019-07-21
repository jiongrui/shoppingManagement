import request from "@/utils/request";
const URL_PREFIX = "/shopping/integrals";

export function fetchIntegralList(query) {
  return request({
    url: `${URL_PREFIX}/list`,
    method: "get",
    params: query
  });
}

export function createIntegral(query) {
  return request({
    url: `${URL_PREFIX}/create`,
    method: "post",
    data: query
  });
}

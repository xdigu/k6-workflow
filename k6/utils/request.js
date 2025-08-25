import http from "k6/http"
import { check } from "k6"

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Cache-Control": "no-cache, no-store, must-revalidate",
}

export class Request {
  #_request(
    method,
    endpoint,
    testid = "default",
    validations = { statusToValidate: [], acceptableResponseTime: 800 },
    body,
  ) {
    const { statusToValidate = [], acceptableResponseTime = 800 } = validations

    const shouldValidateStatusCode = Boolean(statusToValidate.length)

    const checkStatusMessage = `Expected status ${
      shouldValidateStatusCode
        ? `${statusToValidate.join(", ").replace(/\,(?=[^,]*$)/g, " or")}`
        : "start with 2"
    }`

    const response = http.request(method, endpoint, body, {
      headers,
      tags: { testid },
    })

    check(response, {
      [checkStatusMessage]: (responseCheck) => {
        if (shouldValidateStatusCode) {
          return statusToValidate.includes(responseCheck.status)
        }

        return String(responseCheck.status).startsWith("2")
      },
      [`Acceptable response time (<${acceptableResponseTime}ms)`]: (
        responseCheck,
      ) => {
        return responseCheck.timings.duration < acceptableResponseTime
      },
    })
  }

  get(endpoint, testid, validation) {
    return this.#_request("GET", endpoint, testid, validation, null)
  }

  post(endpoint, body, testid, validation) {
    return this.#_request("POST", endpoint, testid, validation, body)
  }

  put(endpoint, body, testid, validation) {
    return this.#_request("PUT", endpoint, testid, validation, body)
  }

  patch(endpoint, body, testid, validation) {
    return this.#_request("PATCH", endpoint, testid, validation, body)
  }

  delete(endpoint, testid, validation) {
    return this.#_request("DELETE", endpoint, testid, validation, body)
  }
}

import { group } from "k6"

import URLS from "./utils/urls.js"
import { stages } from "./config/stages.js"
import { Request } from "./utils/request.js"
import Report from "./utils/report.js"

const request = new Request()

export const options = {
  stages,
}

export default function () {
  group("default", function () {
    request.get(URLS.checkoutUrl, "checkout")
  })
}

export function handleSummary(data) {
  return {
    [Report.fileName]: JSON.stringify(data),
  }
}

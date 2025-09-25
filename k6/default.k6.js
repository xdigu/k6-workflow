import { group } from "k6"
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js"

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
    [Report.fileName]: htmlReport(data),
  }
}

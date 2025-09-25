import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js"

export default class Report {
  static basePath = __ENV.REPORTS_PATH

  static get fileName() {
    return `${this.basePath}/report-${uuidv4()}.html`
  }
}

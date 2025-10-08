export default class Report {
  static basePath = __ENV.REPORTS_PATH

  static get fileName() {
    return `${this.basePath}/report-default.html`
  }
}

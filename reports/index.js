import { readFileSync, readdirSync, writeFileSync } from "fs"
import parser from "./bundle.js"

const { htmlReport } = parser
const REPORTS_PATH = process.env.REPORTS_PATH
const EXPORT_REPORT_PATH = process.env.EXPORT_REPORT_PATH

function validateIfFileIsReport(fielName) {
  const validateRegex = new RegExp(/^report(.*).json$/gm)

  const isReport = validateRegex.test(fielName)

  return isReport
}

function openFile(fileName) {
  const data = readFileSync(`${REPORTS_PATH}/${fileName}`).toString()
  const parsedData = JSON.parse(data)

  return parsedData
}

function getMinValue(firstValue, secoundValue) {
  if (firstValue < secoundValue) {
    return firstValue
  }

  return secoundValue
}

function getMaxValue(firstValue, secoundValue) {
  if (firstValue > secoundValue) {
    return firstValue
  }

  return secoundValue
}

function getAverageValue(firstValue, secoundValue) {
  return (firstValue + secoundValue) / 2
}

function getSumValues(firstValue, secoundValue) {
  return firstValue + secoundValue
}

function mergeTrendTime(currentValues, newValues) {
  return {
    "p(90)": getAverageValue(currentValues["p(90)"], newValues["p(90)"]),
    "p(95)": getAverageValue(currentValues["p(95)"], newValues["p(95)"]),
    avg: getAverageValue(currentValues.avg, newValues.avg),
    min: getMinValue(currentValues.min, newValues.min),
    med: getAverageValue(currentValues.med, newValues.med),
    max: getMaxValue(currentValues.max, newValues.max),
  }
}

function mergeDefaultRate(currentValues, newValues) {
  return {
    passes: getSumValues(currentValues.passes, newValues.passes),
    fails: getSumValues(currentValues.fails, newValues.fails),
    rate: getSumValues(currentValues.rate, newValues.rate),
  }
}

function mergeCounterData(currentValues, newValues) {
  return {
    count: getSumValues(currentValues.count, newValues.count),
    rate: getSumValues(currentValues.rate, newValues.rate),
  }
}

function mergeGaugeDefault(currentValues, newValues) {
  return {
    min: getMinValue(currentValues.min, newValues.min),
    max: getMaxValue(currentValues.max, newValues.max),
    value: getAverageValue(currentValues.value, newValues.value),
  }
}

function mergeReports(lastReport, currentReport) {
  if (!lastReport) {
    return currentReport
  }

  const currentReportRootGroup = currentReport.root_group
  const lasteReportMetrics = lastReport.metrics
  const currentReportMetrics = currentReport.metrics
  const newReport = { ...lastReport }
  const newMetrics = { ...newReport.metrics }

  newReport.root_group.groups.push(...currentReportRootGroup.groups)
  newReport.state.testRunDurationMs += currentReport.state.testRunDurationMs

  newMetrics.http_req_blocked.values = mergeTrendTime(
    lasteReportMetrics.http_req_blocked.values,
    currentReportMetrics.http_req_blocked.values
  )

  newMetrics.http_req_connecting.values = mergeTrendTime(
    lasteReportMetrics.http_req_connecting.values,
    currentReportMetrics.http_req_connecting.values
  )

  newMetrics.group_duration.values = mergeTrendTime(
    lasteReportMetrics.group_duration.values,
    currentReportMetrics.group_duration.values
  )

  newMetrics.http_req_failed.values = mergeDefaultRate(
    lasteReportMetrics.http_req_failed.values,
    currentReportMetrics.http_req_failed.values
  )

  newMetrics.data_sent.values = mergeCounterData(
    lasteReportMetrics.data_sent.values,
    currentReportMetrics.data_sent.values
  )

  newMetrics.iteration_duration.values = mergeTrendTime(
    lasteReportMetrics.iteration_duration.values,
    currentReportMetrics.iteration_duration.values
  )

  newMetrics.iterations.values = mergeCounterData(
    lasteReportMetrics.iterations.values,
    currentReportMetrics.iterations.values
  )

  newMetrics.vus.values = mergeGaugeDefault(
    lasteReportMetrics.vus.values,
    currentReportMetrics.vus.values
  )

  newMetrics.http_req_duration.values = mergeTrendTime(
    lasteReportMetrics.http_req_duration.values,
    currentReportMetrics.http_req_duration.values
  )

  newMetrics.http_req_waiting.values = mergeTrendTime(
    lasteReportMetrics.http_req_waiting.values,
    currentReportMetrics.http_req_waiting.values
  )

  newMetrics.vus_max.values = mergeGaugeDefault(
    lasteReportMetrics.vus_max.values,
    currentReportMetrics.vus_max.values
  )

  newMetrics.http_req_receiving.values = mergeTrendTime(
    lasteReportMetrics.http_req_receiving.values,
    currentReportMetrics.http_req_receiving.values
  )

  newMetrics["http_req_duration{expected_response:true}"].values =
    mergeTrendTime(
      lasteReportMetrics["http_req_duration{expected_response:true}"].values,
      currentReportMetrics["http_req_duration{expected_response:true}"].values
    )

  newMetrics.data_received.values = mergeCounterData(
    lasteReportMetrics.data_received.values,
    currentReportMetrics.data_received.values
  )

  newMetrics.http_reqs.values = mergeCounterData(
    lasteReportMetrics.http_reqs.values,
    currentReportMetrics.http_reqs.values
  )

  newMetrics.checks.values = mergeDefaultRate(
    lasteReportMetrics.checks.values,
    currentReportMetrics.checks.values
  )

  newMetrics.http_req_sending.values = mergeTrendTime(
    lasteReportMetrics.http_req_sending.values,
    currentReportMetrics.http_req_sending.values
  )

  newMetrics.http_req_tls_handshaking.values = mergeTrendTime(
    lasteReportMetrics.http_req_tls_handshaking.values,
    currentReportMetrics.http_req_tls_handshaking.values
  )

  newReport.metrics = newMetrics

  return newReport
}

;(function main() {
  console.log(REPORTS_PATH)
  const filesName = readdirSync(REPORTS_PATH)

  const reportsFileName = filesName.filter(validateIfFileIsReport)

  const mergedReports = reportsFileName.map(openFile).reduce(mergeReports, null)

  writeFileSync(`${EXPORT_REPORT_PATH}/dash.html`, htmlReport(mergedReports))
})()

const dayjs = require('dayjs')
require('dayjs/locale/zh-cn')
const relativeTime = require('dayjs/plugin/relativeTime')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = {
  currentYear: () => dayjs().year(),
  currentMonth: () => dayjs().month() + 1,
  utcTimeFormat: (time) => dayjs(time).utc().format(),
  parseDate: (time) => dayjs(time).tz('Asia/Taipei').format('MM/DD'),
  parseDay: (time) => dayjs(time).tz('Asia/Taipei').locale('zh-cn').format('dd'),
  parseTime: (time) => dayjs(time).tz('Asia/Taipei').format('HH:mm'),
  relativeTimeFromNow: time => dayjs(time).tz('Asia/Taipei').fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  compareMonthYear: function (a, b, c, options) {
    return a === b + '-' + c ? options.fn(this) : options.inverse(this)
  }

}

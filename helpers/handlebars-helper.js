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
  parseDate: (time) => dayjs(time).tz('Asia/Taipei').format('MM/DD'),
  parseDay: (time) => dayjs(time).tz('Asia/Taipei').locale('zh-cn').format('dd'),
  parseTime: (time) => dayjs(time).tz('Asia/Taipei').format('HH:mm'),
  relativeTimeFromNow: time => dayjs(time).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}

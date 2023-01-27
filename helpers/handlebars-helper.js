const dayjs = require('dayjs')
require('dayjs/locale/zh-cn')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(),
  parseDate: (time) => dayjs(time).format('MM/DD'),
  parseDay: (time) => dayjs(time).locale('zh-cn').format('dd'),
  parseTime: (time) => dayjs(time).format('HH:mm'),
  relativeTimeFromNow: time => dayjs(time).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}

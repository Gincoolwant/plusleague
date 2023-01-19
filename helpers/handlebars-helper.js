const dayjs = require('dayjs')
require('dayjs/locale/zh-cn')

module.exports = {
  currentYear: () => dayjs().year(),
  parseDate: (time) => dayjs(time).format('MM/DD'),
  parseDay: (time) => dayjs(time).locale('zh-cn').format('dd'),
  parseTime: (time) => dayjs(time).format('HH:mm')
}

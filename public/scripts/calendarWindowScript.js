function showWindow () {
  const calendarWindow = document.getElementById('calendar-window')
  const openButton = document.getElementById('open-window-button')
  calendarWindow.style.display = 'block'
  openButton.style.display = 'none'
}

function closeWindow () {
  const calendarWindow = document.getElementById('calendar-window')
  const openButton = document.getElementById('open-window-button')
  calendarWindow.style.display = 'none'
  openButton.style.display = 'block'
}

module.exports = {
  showWindow,
  closeWindow
}

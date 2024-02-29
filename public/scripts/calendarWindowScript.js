function showWindow () {
  closeDonateWindow()
  const calendarWindow = document.getElementById('calendar-window')
  const openButton = document.getElementById('open-window-button')
  calendarWindow.style.display = 'block'
  openButton.style.display = 'none'
}

function closeWindow () {
  const calendarWindow = document.getElementById('calendar-window')
  const openButton = document.getElementById('open-window-button')
  if (!calendarWindow) return
  calendarWindow.style.display = 'none'
  openButton.style.display = 'block'
}

function showDonateWindow () {
  closeWindow()
  const donateWindow = document.getElementById('donate-window')
  donateWindow.style.display = 'block'
}

function closeDonateWindow () {
  const donateWindow = document.getElementById('donate-window')
  donateWindow.style.display = 'none'
}

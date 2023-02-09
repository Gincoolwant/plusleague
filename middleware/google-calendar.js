const { google } = require('googleapis')
const scopes = [
  'https://www.googleapis.com/auth/calendar'
]

const checkOauth = (oauth2Client) => {
  return (req, res, next) => {
    if (oauth2Client.credentials.access_token) return next()
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    })
    res.redirect(url)
  }
}

const setCredentials = (oauth2Client) => {
  return async (req, res, next) => {
    const { tokens } = await oauth2Client.getToken(req.query.code)
    oauth2Client.setCredentials(tokens)
    next()
  }
}

const checkCalendar = (oauth2Client) => {
  return (req, res, next) => {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    return calendar.calendars.get({
      calendarId: '0tcv5ugkuss95ng6nch1l8is4o@group.calendar.google.com'
    })
      .then(res => {
        req.calendarId = '0tcv5ugkuss95ng6nch1l8is4o@group.calendar.google.com'
        return next()
      })
      .catch(err => {
        if (err.code === 404) {
          const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
          return calendar.calendars.insert({
            resource: {
              kind: 'calendar#calendar',
              summary: 'P+報哩災',
              description: 'New calendar for P+報哩災',
              location: 'P+報哩災',
              timeZone: 'Asia/Taipei'
            }
          })
        }
        console.log(err)
      })
      .then(clientCalendar => {
        req.calendarId = clientCalendar.data.id
        return next()
      })
      .catch(err => console.log(err))
  }
}

const insertEvent = (oauth2Client) => {
  return (req, res, next) => {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    return calendar.events.insert({
      // calendarId: req.calendarId,
      calendarId: 'primary',
      resource: req.event
    })
      .then(() => {
        return next()
      })
      .catch(err => console.log(err))
  }
}

module.exports = {
  checkOauth,
  setCredentials,
  checkCalendar,
  insertEvent
}

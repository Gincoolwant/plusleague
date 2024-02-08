// PLG: app name
// C for client, A for admin, B for Both
// 1: match model related issue
// 2: user model related issue
// 3: Authentication related issue
// 4: Google service related issue
const errorCode = {
  MATCH_NOT_FOUND: {
    code: 'PLG-A1001',
    statusCode: 404
  },
  DELETE_MATCH_FAILED: {
    code: 'PLG-A1002',
    statusCode: 404
  },
  RESTORE_MATCH_FAILED: {
    code: 'PLG-A1003',
    statusCode: 404
  },
  USER_NOT_FOUND: {
    code: 'PLG-A2001',
    statusCode: 404
  },
  INVALID_AUTO_LOGIN: {
    code: 'PLG-A3001',
    statusCode: 401
  },
  INVALID_JWT_TOKEN: {
    code: 'PLG-B3001',
    statusCode: 401
  },
  LOG_OUT_FAIL: {
    code: 'PLG-B3002',
    statusCode: 401
  },
  INSERT_EVENT_FAILED: {
    code: 'PLG-C4001',
    statusCode: 401
  }
}

module.exports = errorCode

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const { Team, Match } = require('../models')
const request = require('supertest')
const app = require('../app')
const db = require('../models')
const { utcTimeFormat } = require('../helpers/handlebars-helper.js')

const SECONDS = 1000
jest.setTimeout(70 * SECONDS)

const mockTeamList = [
  { teamId: 1, logo: '對伍1的logo', name: '測試對伍1', englishName: 'team1' },
  { teamId: 2, logo: '對伍2的logo', name: '測試對伍2', englishName: 'team2' }
]

const mockMatchList = [
  { gameId: 1, type: 'REGULAR', gameTime: utcTimeFormat('2020-01-01 15:00:00'), arena: '測試體育館1', guestId: mockTeamList[1].teamId, homeId: mockTeamList[0].teamId },
  { gameId: 2, type: 'PLAYOFFS', gameTime: utcTimeFormat('2020-01-02 07:00:00'), arena: '測試體育館2', guestId: mockTeamList[1].teamId, homeId: mockTeamList[0].teamId },
  { gameId: 3, type: 'FINALS', gameTime: utcTimeFormat('2020-01-03 12:00:00'), arena: '測試體育館1', guestId: mockTeamList[1].teamId, homeId: mockTeamList[0].teamId }
]

describe('Index Router: Get index', () => {
  beforeAll(async () => {
    // 清除測試資料庫資料
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
    await db.Team.destroy({ where: {}, truncate: true, force: true })
    await db.Match.destroy({ where: {}, truncate: true, force: true })
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

    // 在測試資料庫中，新增 mock 資料
    await db.Team.create(mockTeamList[0])
    await db.Team.create(mockTeamList[1])
    await db.Match.create(mockMatchList[0])
    await db.Match.create(mockMatchList[1])
    await db.Match.create(mockMatchList[2])
  })

  it('should get all teams', async () => {
    const teamList = await Team.findAll({ raw: true })
    expect(teamList).toEqual(expect.any(Array))
    expect(teamList).toHaveLength(mockTeamList.length)
    for (let i = 0; i < mockTeamList.length; i++) {
      expect(mockTeamList[i]).toEqual(expect.any(Object))
      expect(mockTeamList[i]).toHaveProperty('name', mockTeamList[i].name)
      expect(mockTeamList[i]).toHaveProperty('logo', mockTeamList[i].logo)
      expect(mockTeamList[i]).toHaveProperty('englishName', mockTeamList[i].englishName)
    }
  })

  it('should get all game matches', async () => {
    const matchList = await Match.findAll({ raw: true })
    expect(matchList).toEqual(expect.any(Array))
    expect(matchList).toHaveLength(mockMatchList.length)
    for (let i = 0; i < matchList.length; i++) {
      expect(matchList[i]).toEqual(expect.any(Object))
      expect(matchList[i]).toHaveProperty('guestId', mockMatchList[i].guestId)
      expect(matchList[i]).toHaveProperty('homeId', mockMatchList[i].homeId)
      expect(matchList[i]).toHaveProperty('type', mockMatchList[i].type)
      expect(matchList[i]).toHaveProperty('arena', mockMatchList[i].arena)
      expect(utcTimeFormat(matchList[i].gameTime)).toBe(mockMatchList[i].gameTime)
    }
  })

  it('should render index', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toBe(200)
    expect(res.header['content-type']).toContain('text/html')
    expect(res.text).toContain('P+報哩災')
  })

  it('should render index with query', async () => {
    const res = await request(app).get('/').query({ searchTeamId: 1, searchArena: '測試體育館1' })
    expect(res.statusCode).toBe(200)
    expect(res.header['content-type']).toContain('text/html')
    expect(res.text).toContain('P+報哩災')
  })

  afterAll(async () => {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
    await db.Team.destroy({ where: {}, truncate: true, force: true })
    await db.Match.destroy({ where: {}, truncate: true, force: true })
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
  })
})

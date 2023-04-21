const { Team, Match } = require('../models')
const request = require('supertest')
const app = require('../app')
const db = require('../models')

const SECONDS = 1000
jest.setTimeout(70 * SECONDS)

describe('Index Router: Get index', () => {
  beforeAll(async () => {
    // 清除測試資料庫資料
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
    await db.Team.destroy({ where: {}, truncate: true, force: true })
    await db.Match.destroy({ where: {}, truncate: true, force: true })
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })

    // 在測試資料庫中，新增 mock 資料
    await db.Team.create({ teamId: 1, logo: '對伍1的logo', name: '測試對伍1', englishName: 'team1' })
    await db.Team.create({ teamId: 2, logo: '對伍2的logo', name: '測試對伍2', englishName: 'team2' })
    await db.Match.create({ gameId: 1, gameTime: '2020-01-01', arena: '測試體育館', guestId: '1', homeId: '2' })
  })

  it('should get all teams', async () => {
    const teamList = await Team.findAll({ raw: true })
    expect(teamList).toEqual(expect.any(Array))
    expect(teamList).toHaveLength(2)
    expect(teamList[0].name).toBe('測試對伍1')
    expect(teamList[1].name).toBe('測試對伍2')
  })

  it('should get all game matches', async () => {
    const matchList = await Match.findOne({ where: { gameId: 1 }, raw: true })
    expect(matchList).toEqual(expect.any(Object))
    expect(matchList).toHaveProperty('guestId', 1)
    expect(matchList).toHaveProperty('homeId', 2)
  })

  it('should render index', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toBe(200)
    expect(res.header['content-type']).toContain('text/html')
  })

  it('should render index with query', async () => {
    const res = await request(app).get('/').query({ searchTeamId: 1, searchArena: '測試體育館' })
    expect(res.statusCode).toBe(200)
    expect(res.header['content-type']).toContain('text/html')
  })

  afterAll(async () => {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
    await db.Team.destroy({ where: {}, truncate: true, force: true })
    await db.Match.destroy({ where: {}, truncate: true, force: true })
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
  })
})

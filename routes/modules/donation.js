const express = require('express')
const Ecpay = require('ecpay_aio_nodejs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const router = express.Router()

const { MERCHANTID, HASHKEY, HASHIV, HOST } = process.env

const options = {
  OperationMode: 'Test',
  MercProfile: {
    MerchantID: MERCHANTID,
    HashKey: HASHKEY,
    HashIV: HASHIV
  },
  IgnorePayment: [
    // 'Credit', // 信用卡及銀聯卡(需申請開通)
    // 'TWQR', // 歐付寶TWQR行動支付(需申請開通)
    // 'WebATM', // 網路ATM
    'ATM', // 自動櫃員機
    'CVS', // 超商代碼
    'BARCODE', // 超商條碼
    'ApplePay', // Apple Pay(僅支援手機支付)
    'BNPL' // 裕富無卡分期(需申請開通)
  ],
  IsProjectContractor: false
}

router.get('/', (req, res) => {
  const { amount } = req.query
  const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  })

  const TradeNo = 'test' + new Date().getTime()
  const baseParam = {
    MerchantTradeNo: TradeNo,
    MerchantTradeDate,
    TotalAmount: amount,
    TradeDesc: '測試交易描述',
    ItemName: '請CK喝杯咖啡',
    ReturnURL: `${HOST}/donation/return`,
    ClientBackURL: `${HOST}/donation/clientReturn`,
    Remark: 'p+ schedule'
  }
  const create = new Ecpay(options)

  // 提供 form(html + js)直接從前端submit觸發付款
  const html = create.payment_client.aio_check_out_all(baseParam)
  res.send(html)
})

// 交易送出ReturnURL
router.post('/return', async (req, res) => {
  const { CheckMacValue } = req.body
  const data = { ...req.body }
  delete data.CheckMacValue

  const create = new Ecpay(options)
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data)
  if (CheckMacValue === checkValue) {
    res.send('1|OK')// 交易成功後，需要回傳 1|OK 給綠界
  }
})

// 交易結果確認頁面中 - 返回商店轉址
router.get('/clientReturn', (req, res) => {
  req.flash('donation_messages', '收到贊助囉，感謝乾爹乾媽~')
  res.redirect('/')
})

module.exports = router

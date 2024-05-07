import { Request, Response, NextFunction } from 'express'
import { verifyEmailFormat } from '../services/verifyEmailFormat.service'
import { resolveMXRecords } from '../services/resolveMXRecord.service'
import { MxRecord } from 'dns'
import { TTestInboxResult, testInboxOnServver } from '../services/testInboxOnServer.service'
import { randomBytes } from 'crypto'

export const validateEmail = async (req: Request, res: Response, next: NextFunction) => {

    if (!(req?.body?.email)) {
        res.status(400).json({ error: 'Missing Email Id' })
        return next()
    }
    const email_Format_Valid = verifyEmailFormat(req?.body?.email)
    if (!(email_Format_Valid)) {
        res.status(400).json({ error: 'inValid Email Address' })
        return next()
    }

    const [, domain] = req?.body?.email.split('@')
    const MxRecord = await resolveMXRecords(domain)
    const sortedMxRecord = MxRecord.sort((a: MxRecord, b: MxRecord) => a.priority - b.priority)
    let hostIndex = 0
    let stmpResult: TTestInboxResult = {
        connection_succeeded: false,
        inbox_exists: false
    }

    while (hostIndex < MxRecord.length) {
        try {
            stmpResult = await testInboxOnServver(MxRecord[0].exchange, req?.body?.email)
            if (!(stmpResult?.connection_succeeded)) {
                hostIndex++
            } else {
                break
            }
        } catch (error) {
            console.log(error)
        }

    }

  let useCatchAll = false;
  try{
    const catchResult = await testInboxOnServver(MxRecord[0].exchange,`${randomBytes(20).toString('hex')}@${domain}`)
    useCatchAll = catchResult.inbox_exists
  }catch(error){
 console.log(error)
  }
  
  res.json({
    email_Format_Valid:email_Format_Valid,
    usesCatchAll:useCatchAll,
    ...stmpResult
  })

}

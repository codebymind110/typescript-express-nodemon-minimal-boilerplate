import { resolveMx , MxRecord, promises } from 'node:dns'

export const resolveMXRecords = async (domainName:string):Promise<MxRecord[]> => {
   try {
     return await promises.resolveMx(domainName)
   } catch (error) {
    console.log(error)
    return []
   }
}
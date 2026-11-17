import {doc,getDocFromServer,runTransaction,serverTimestamp,type Firestore} from 'firebase/firestore';
import {emptyJournal,journalSchema,type Journal} from './journal';
export function createJournalStore(db:Firestore,uid:string){
 const ref=doc(db,'journals',uid);
 return {
  async read(){
   const snap=await getDocFromServer(ref);
   if(!snap.exists())return {data:emptyJournal,version:0,updatedAt:null};
   const value=snap.data();
   if(typeof value.content!=='string'||!Number.isSafeInteger(value.version)||value.version<1)throw new Error('雲端資料格式不完整，請先保留備份再重試。');
   const data=journalSchema.parse(JSON.parse(value.content));
   return {data,version:value.version as number,updatedAt:value.updatedAt?.toDate().toISOString()||null};
  },
  async save(input:Journal,expectedVersion:number){
   const data=journalSchema.parse(input),content=JSON.stringify(data);
   if(!Number.isSafeInteger(expectedVersion)||expectedVersion<0)throw new Error('儲存版本不正確，請重新讀取。');
   // Conservative UTF-16 limit: also stays below the Rules character limit and document byte limit.
   if(content.length>200000)throw new Error('手記已接近目前版本的容量上限，這次尚未儲存。請先匯出備份，再聯絡協助擴充容量。');
   return runTransaction(db,async tx=>{
    const snapshot=await tx.get(ref),current=snapshot.exists()?snapshot.data().version:0;
    if(current!==expectedVersion)throw new Error('另一個分頁已更新資料。請先複製正在編輯的內容，再重新讀取後存入。');
    const version=expectedVersion+1;
    tx.set(ref,{content,version,updatedAt:serverTimestamp()});
    return {version};
   });
  }
 };
}

import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut, type User} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
export const ownerEmail='ronwang82@gmail.com';
export const firebaseConfig={
  apiKey:'AIzaSyChDQ1V1AvHXq53CDgii3z88HtLrn8qOWA',
  authDomain:'ron-care-journal.firebaseapp.com',
  projectId:'ron-care-journal',
  storageBucket:'ron-care-journal.firebasestorage.app',
  messagingSenderId:'392854609937',
  appId:'1:392854609937:web:8dee4f3a83c9c6619251b0'
};
export const app=initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const db=getFirestore(app);
export function isOwner(user:User|null){return !!user && user.email===ownerEmail && user.emailVerified;}
export async function login(){
  const provider=new GoogleAuthProvider();
  provider.setCustomParameters({prompt:'select_account'});
  const result=await signInWithPopup(auth,provider);
  if(!isOwner(result.user)){await signOut(auth);throw new Error('這是品軒的私人關懷手記，請改用擁有者的 Google 帳號登入。');}
}
export function friendlyError(error:unknown):string {
  const e=error as {code?:string,message?:string};
  const messages:Record<string,string>={
    'auth/popup-closed-by-user':'登入視窗已關閉，可以再試一次。',
    'auth/cancelled-popup-request':'登入視窗已開啟，請完成該視窗的登入。',
    'auth/popup-blocked':'瀏覽器擋住了登入視窗，請允許彈出視窗後重試。',
    'auth/unauthorized-domain':'此網址尚未加入 Firebase 登入的授權網域，請到 Authentication → 設定 → 授權網域新增目前的網域。',
    'auth/network-request-failed':'目前無法連線，請檢查網路後重試。',
    'auth/invalid-api-key':'Firebase 網站設定有誤，請核對專案設定中的 apiKey。',
    'permission-denied':'沒有存取權限。請確認登入帳號，以及 Firestore 規則已發布。',
    'unavailable':'目前無法連上 Firebase。內容尚未儲存，請保留畫面並稍後重試。'
  };
  return messages[e?.code||'']||e?.message||'操作未完成，請稍後重試。';
}

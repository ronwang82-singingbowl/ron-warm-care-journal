import {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {onAuthStateChanged,signOut,type User} from 'firebase/auth';
import {Leaf,ArrowRight,ShieldCheck} from 'lucide-react';
import {auth,isOwner,login,friendlyError} from './lib/firebase';
import Workspace from './Workspace';
import './style.css';
function App(){
 const [user,setUser]=useState<User|null>(null),[ready,setReady]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const demo=new URLSearchParams(location.search).get('demo')==='1';
 useEffect(()=>onAuthStateChanged(auth,u=>{setUser(u);setReady(true);},e=>{setError(friendlyError(e));setReady(true);}),[]);
 async function enter(){setBusy(true);setError('');try{await login();}catch(e){setError(friendlyError(e));}finally{setBusy(false);}}
 if(!ready)return <div className="loginpage"><div className="logincard"><Leaf/><p>正在打開你的關懷手記…</p></div></div>;
 if(isOwner(user)||demo)return <Workspace key={user?.uid||'guest'} user={isOwner(user)?user:null}/>;
 return <div className="loginpage"><section className="logincard"><div className="brandmark"><Leaf size={29}/></div><div className="eyebrow">CARE & CONNECTION</div><h1>暖心同行</h1><p className="loginintro">把關心，放進日常。</p><p className="muted">記下一點近況，留下一點心意。<br/>讓下一次的問候，多一點理解。</p>{error&&<div className="error" role="alert">{error}</div>}{user&&!isOwner(user)&&<p className="error">目前帳號沒有存取權限，請切換帳號。</p>}<button className="primary" disabled={busy} onClick={()=>void enter()}>{busy?'正在登入…':'使用 Google 登入'}<ArrowRight size={16}/></button>{user&&<button className="quiet" onClick={()=>void signOut(auth).catch(e=>setError(friendlyError(e)))}>登出目前帳號</button>}<a className="textbtn" href={import.meta.env.BASE_URL+'?demo=1'}>先看看示範</a><small className="loginprivacy"><ShieldCheck size={13}/>私人關懷空間 · 紀錄儲存於 Firebase</small></section></div>;
}
createRoot(document.getElementById('root')!).render(<App/>);

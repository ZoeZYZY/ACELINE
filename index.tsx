
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// Pre-configured Super Admin Keys
const MASTER_KEYS = ['ACE-7788', 'ACE-9922', 'ACE-1155', 'ACE-3344', 'ACE-5566'];

type CloudProvider = 'Baidu' | 'Weiyun' | 'Aliyun' | 'Google' | 'OneDrive' | 'Dropbox' | 'None';

interface CloudConfig {
  provider: CloudProvider;
  connected: boolean;
  usedSpaceGB: number;
  totalSpaceGB: number;
  lastSync: number;
}

// Localized Strings
const TRANSLATIONS = {
  en: {
    appName: "AceLine",
    tagline: "Relive Every Match Point",
    albums: "Albums",
    members: "Members",
    profile: "Profile",
    storage: "Cloud Storage",
    handshake: "OAuth Handshake",
    ownerView: "Global Management",
    community: "Community",
    admin: "Admin",
    status: "Status",
    logout: "Logout",
    login: "Login",
    back: "Back",
    register: "Join AceLine",
    inviteCode: "Invite Code",
    shareInvite: "Share Invite Link",
    riskNotice: "Privacy Notice: AceLine only accesses the /Apps/AceLine folder in your cloud drive.",
    connectSuccess: "Handshake verified!",
    copyLink: "Invite link copied to clipboard",
    loginError: "Login Failed",
    username: "Username",
    password: "Password"
  },
  cn: {
    appName: "网球相册 AceLine",
    tagline: "记录每一个制胜分",
    albums: "相册集",
    members: "成员",
    profile: "个人中心",
    storage: "云盘管理",
    handshake: "云端授权握手",
    ownerView: "全局概览",
    community: "社区",
    admin: "管理员",
    status: "状态",
    logout: "退出登录",
    login: "登录",
    back: "返回",
    register: "加入 AceLine",
    inviteCode: "邀请码",
    shareInvite: "分享邀请链接",
    riskNotice: "隐私告知：AceLine 仅拥有对您云盘中 /Apps/AceLine 文件夹的读写权限。",
    connectSuccess: "云端握手校验成功！",
    copyLink: "邀请链接已复制到剪贴板",
    loginError: "登录失败",
    username: "用户名",
    password: "密码"
  }
};

const TennisBallIcon = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#A3E635"/>
    <path d="M5 12C5 12 8 11 12 12C16 13 19 12 19 12" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 6C7 6 10 9 10 12C10 15 7 18 7 18" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 6C17 6 14 9 14 12C14 15 17 18 17 18" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

type Role = 'user' | 'admin' | 'super' | 'owner';
type Screen = 'auth' | 'login_form' | 'register_form' | 'albums' | 'settings' | 'members' | 'gallery_view' | 'owner_dashboard' | 'cloud_setup';

interface User {
  username: string;
  password: string;
  role: Role;
  email: string;
  communityId: string;
  inviteCode?: string;
  cloudConfig?: CloudConfig;
}

const APP_OWNER_USER: User = {
    username: "Zoe Zhou",
    password: "ACE-7788",
    email: "zoezhou85@hotmail.com",
    role: "owner",
    communityId: "SYSTEM_ROOT"
};

const CLOUD_PROVIDERS: { id: CloudProvider, name: string, color: string }[] = [
    { id: 'Baidu', name: '百度网盘', color: '#2b32b2' },
    { id: 'Weiyun', name: '腾讯微云', color: '#0052d4' },
    { id: 'Aliyun', name: '阿里云盘', color: '#ff6a00' },
    { id: 'Google', name: 'Google Drive', color: '#34a853' },
    { id: 'OneDrive', name: 'OneDrive', color: '#0078d4' },
    { id: 'Dropbox', name: 'Dropbox', color: '#0061ff' }
];

const App = () => {
  const [lang, setLang] = useState<'en' | 'cn'>('cn');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>('auth');
  const [loginU, setLoginU] = useState('');
  const [loginP, setLoginP] = useState('');
  
  // Registration / Invite logic
  const [regU, setRegU] = useState('');
  const [regP, setRegP] = useState('');
  const [regI, setRegI] = useState('');

  const [userDb, setUserDb] = useState<User[]>(() => {
    const saved = localStorage.getItem('ace_users_v3');
    let users = saved ? JSON.parse(saved) : [];
    if (!users.find((u:any) => u.username === APP_OWNER_USER.username)) users.push(APP_OWNER_USER);
    return users;
  });

  useEffect(() => {
    localStorage.setItem('ace_users_v3', JSON.stringify(userDb));
    
    // Auto-parse invite code from URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('inviteCode');
    if (code) {
        setRegI(code);
        setScreen('register_form');
    }
  }, [userDb]);

  const t = TRANSLATIONS[lang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = userDb.find(u => u.username.toLowerCase() === loginU.toLowerCase() && u.password === loginP);
    if (found) {
        setCurrentUser(found);
        setScreen(found.role === 'owner' ? 'owner_dashboard' : 'albums');
    } else alert(t.loginError);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, we verify regI against valid invite codes in DB
    const isMasterKey = MASTER_KEYS.includes(regI);
    const newUser: User = {
        username: regU,
        password: regP,
        email: `${regU}@example.com`,
        role: isMasterKey ? 'super' : 'user',
        communityId: isMasterKey ? `COMM_${Math.random().toString(36).substr(2, 6).toUpperCase()}` : 'GUEST_POOL',
        inviteCode: Math.random().toString(36).substr(2, 8).toUpperCase()
    };
    setUserDb([...userDb, newUser]);
    setCurrentUser(newUser);
    setScreen(newUser.role === 'super' ? 'cloud_setup' : 'albums');
  };

  const generateInviteLink = () => {
    if (!currentUser) return;
    const link = `${window.location.origin}${window.location.pathname}?inviteCode=${currentUser.inviteCode}&cid=${currentUser.communityId}`;
    navigator.clipboard.writeText(link);
    alert(`${t.copyLink}: ${link}`);
  };

  const OwnerDashboard = () => (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-40 animate-fade">
        <header className="px-8 pt-20 pb-8 bg-white border-b">
            <h1 className="text-4xl font-black text-blue-950 italic uppercase tracking-tighter">{t.ownerView}</h1>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Platform Oversight Panel</p>
        </header>
        <div className="p-6 space-y-4">
            {userDb.filter(u => u.role === 'super').map(u => (
                <div key={u.username} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-lime-400 rounded-2xl flex items-center justify-center font-black italic">S</div>
                            <div>
                                <h3 className="font-black text-blue-950 italic uppercase">{u.username}</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">ID: {u.communityId}</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${u.cloudConfig?.connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {u.cloudConfig?.connected ? u.cloudConfig.provider : 'No Link'}
                        </span>
                    </div>
                    {u.cloudConfig?.connected && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
                                <span>Cloud Usage</span>
                                <span>{((u.cloudConfig.usedSpaceGB/u.cloudConfig.totalSpaceGB)*100).toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600" style={{ width: `${(u.cloudConfig.usedSpaceGB/u.cloudConfig.totalSpaceGB)*100}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );

  const CloudHandshakeScreen = () => {
    const [selectedP, setSelectedP] = useState<CloudProvider>('None');
    const [step, setStep] = useState(1);

    const startHandshake = () => {
        setStep(2);
        setTimeout(() => {
            if (!currentUser) return;
            const config: CloudConfig = {
                provider: selectedP,
                connected: true,
                usedSpaceGB: Math.random() * 500,
                totalSpaceGB: 2048,
                lastSync: Date.now()
            };
            const updated = userDb.map(u => u.username === currentUser.username ? { ...u, cloudConfig: config } : u);
            setUserDb(updated);
            setCurrentUser({ ...currentUser, cloudConfig: config });
            setStep(3);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full bg-white p-8 animate-slide">
            <header className="mb-10">
                <h2 className="text-4xl font-black text-blue-950 italic uppercase tracking-tighter">{t.handshake}</h2>
                <div className="flex items-center gap-2 mt-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-lime-400' : 'bg-slate-100'}`}></div>
                    ))}
                </div>
            </header>

            {step === 1 && (
                <div className="space-y-6">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.riskNotice}</p>
                    <div className="grid grid-cols-2 gap-3">
                        {CLOUD_PROVIDERS.map(p => (
                            <button 
                                key={p.id} 
                                onClick={() => setSelectedP(p.id)}
                                className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${selectedP === p.id ? 'border-lime-400 bg-lime-50' : 'border-slate-50 bg-slate-50'}`}
                            >
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-xs" style={{ color: p.color }}>{p.id[0]}</div>
                                <span className="text-[10px] font-black uppercase">{p.name}</span>
                            </button>
                        ))}
                    </div>
                    <button disabled={selectedP === 'None'} onClick={startHandshake} className="w-full py-6 bg-blue-950 text-white rounded-full font-black uppercase text-xl disabled:opacity-20">Start Handshake</button>
                </div>
            )}

            {step === 2 && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                    <div className="w-20 h-20 border-4 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-blue-950 uppercase italic tracking-widest">Handshaking with {selectedP}...</p>
                </div>
            )}

            {step === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade">
                    <div className="w-24 h-24 bg-lime-400 rounded-full flex items-center justify-center text-4xl shadow-xl shadow-lime-100">✓</div>
                    <h3 className="text-2xl font-black text-blue-950 uppercase italic text-center">{t.connectSuccess}</h3>
                    <button onClick={() => setScreen('albums')} className="w-full py-6 bg-blue-950 text-white rounded-full font-black uppercase text-xl">Enter Community</button>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#CBD5E1]">
      <div className="w-full max-w-md h-full bg-white overflow-hidden flex flex-col shadow-2xl relative">
        
        {screen === 'auth' && (
          <div className="h-full bg-[#0F172A] p-10 flex flex-col justify-center items-center text-center space-y-12 animate-fade">
             <div className="w-36 h-36 bg-[#A3E635] rounded-[4rem] flex items-center justify-center shadow-2xl border-b-8 border-lime-600"><TennisBallIcon className="w-24 h-24" /></div>
             <h1 className="text-7xl font-black text-white tracking-tighter italic uppercase leading-none">AceLine</h1>
             <div className="w-full space-y-4">
                <button onClick={() => setScreen('login_form')} className="w-full py-7 bg-[#A3E635] text-blue-950 font-black rounded-full text-2xl shadow-2xl uppercase italic border-b-8 border-lime-600 active:translate-y-1">{t.login}</button>
                <button onClick={() => setScreen('register_form')} className="w-full py-5 bg-white/10 text-white font-black rounded-full text-xl uppercase italic hover:bg-white/20">{t.register}</button>
             </div>
          </div>
        )}

        {screen === 'login_form' && (
            <div className="flex flex-col h-full bg-white p-10 justify-center animate-slide">
                <h2 className="text-[38px] font-black text-blue-950 mb-10 tracking-tighter uppercase italic text-center">LOGIN</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input value={loginU} onChange={e => setLoginU(e.target.value)} placeholder={t.username} className="w-full bg-slate-50 p-6 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900" />
                    <input type="password" value={loginP} onChange={e => setLoginP(e.target.value)} placeholder={t.password} className="w-full bg-slate-50 p-6 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900" />
                    <button type="submit" className="w-full py-7 bg-blue-950 text-white font-black rounded-full text-xl shadow-xl uppercase italic border-b-8 border-slate-700 active:translate-y-1">ENTER</button>
                    <button onClick={() => setScreen('auth')} className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest">{t.back}</button>
                </form>
            </div>
        )}

        {screen === 'register_form' && (
            <div className="flex flex-col h-full bg-white p-10 justify-center animate-slide">
                <h2 className="text-[38px] font-black text-blue-950 mb-10 tracking-tighter uppercase italic text-center">{t.register}</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input value={regU} onChange={e => setRegU(e.target.value)} placeholder={t.username} className="w-full bg-slate-50 p-6 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900 shadow-inner" />
                    <input type="password" value={regP} onChange={e => setRegP(e.target.value)} placeholder={t.password} className="w-full bg-slate-50 p-6 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900 shadow-inner" />
                    <input value={regI} onChange={e => setRegI(e.target.value)} placeholder={t.inviteCode} className="w-full bg-lime-50 p-6 rounded-2xl font-black outline-none border-2 border-lime-400 shadow-inner italic" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase text-center px-4">Master Keys for Super Admin, or Invite Code for Members.</p>
                    <button type="submit" className="w-full py-7 bg-[#A3E635] text-blue-950 font-black rounded-full text-xl shadow-xl uppercase italic border-b-8 border-lime-600 active:translate-y-1">REGISTER</button>
                    <button onClick={() => setScreen('auth')} className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest">{t.back}</button>
                </form>
            </div>
        )}

        {screen === 'cloud_setup' && <CloudHandshakeScreen />}
        {screen === 'owner_dashboard' && <OwnerDashboard />}
        
        {screen === 'settings' && (
            <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-40 animate-fade">
                <header className="px-8 pt-20 pb-8 bg-white border-b flex justify-between items-center">
                    <h2 className="text-2xl font-black text-blue-950 tracking-tighter italic uppercase">PROFILE</h2>
                    <button className="text-[10px] font-black bg-slate-100 px-3 py-1.5 rounded-full uppercase" onClick={() => setLang(lang === 'cn' ? 'en' : 'cn')}>{lang.toUpperCase()}</button>
                </header>
                <div className="p-8 space-y-6">
                    <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 text-center">
                        <div className="w-24 h-24 rounded-3xl bg-[#A3E635] mx-auto flex items-center justify-center text-4xl shadow-lg mb-6 border-b-4 border-lime-600">🎾</div>
                        <h3 className="text-2xl font-black text-blue-950 italic uppercase">{currentUser?.username}</h3>
                        <p className="text-[10px] font-black text-lime-600 uppercase tracking-widest">{currentUser?.role} @ {currentUser?.communityId}</p>
                    </div>

                    <div className="bg-blue-950 rounded-[2.5rem] p-8 text-white shadow-2xl space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">Invite Management</h4>
                        <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
                            <p className="text-[8px] font-black uppercase opacity-40 mb-1">Your Personal Invite Code</p>
                            <p className="text-xl font-black italic tracking-widest">{currentUser?.inviteCode || 'N/A'}</p>
                        </div>
                        <button onClick={generateInviteLink} className="w-full py-4 bg-lime-400 text-blue-950 rounded-2xl font-black uppercase text-xs shadow-lg">{t.shareInvite}</button>
                    </div>

                    {currentUser?.cloudConfig?.connected && (
                        <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border border-slate-100">
                             <div className="flex justify-between items-center mb-4">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 italic">{t.storage}</h4>
                                <span className="text-[8px] font-black px-2 py-1 rounded bg-green-100 text-green-700 uppercase">
                                    {currentUser.cloudConfig.provider} LINKED
                                </span>
                             </div>
                             <div className="space-y-2">
                                <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                                    <div 
                                        className="h-full bg-lime-400 rounded-full shadow-sm" 
                                        style={{ width: `${(currentUser.cloudConfig.usedSpaceGB / currentUser.cloudConfig.totalSpaceGB) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                                    <span>{currentUser.cloudConfig.usedSpaceGB.toFixed(1)} GB USED</span>
                                    <span>{currentUser.cloudConfig.totalSpaceGB} GB TOTAL</span>
                                </div>
                             </div>
                        </div>
                    )}

                    <button onClick={() => {setCurrentUser(null); setScreen('auth');}} className="w-full py-6 bg-white text-red-500 rounded-[3rem] font-black text-xs shadow-sm border border-red-50 uppercase tracking-[0.4em]">{t.logout}</button>
                </div>
            </div>
        )}

        {/* Navigation Bar */}
        {['albums', 'owner_dashboard', 'settings'].includes(screen) && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[94%] bg-blue-950/98 backdrop-blur-3xl rounded-[4rem] flex items-center justify-around py-8 px-6 shadow-2xl border border-white/10 z-50">
            {currentUser?.role === 'owner' ? (
                <button onClick={() => setScreen('owner_dashboard')} className={`flex flex-col items-center ${screen === 'owner_dashboard' ? 'text-lime-400' : 'text-slate-500'}`}>
                    <div className="text-2xl">🛡️</div>
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1">Admin</span>
                </button>
            ) : (
                <button onClick={() => setScreen('albums')} className={`flex flex-col items-center ${screen === 'albums' ? 'text-lime-400' : 'text-slate-500'}`}>
                    <div className="text-2xl">📂</div>
                    <span className="text-[8px] font-black uppercase tracking-widest mt-1">Albums</span>
                </button>
            )}
            <button onClick={() => setScreen('settings')} className={`flex flex-col items-center ${screen === 'settings' ? 'text-lime-400' : 'text-slate-500'}`}>
                <div className="text-2xl">👤</div>
                <span className="text-[8px] font-black uppercase tracking-widest mt-1">Profile</span>
            </button>
          </div>
        )}

        {screen === 'albums' && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fade">
                <div className="text-6xl mb-6 opacity-20">🎾</div>
                <h2 className="text-3xl font-black text-blue-950 uppercase italic tracking-tighter mb-4">Welcome to {currentUser?.communityId}</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-loose">
                    Your community drive is ready.<br/>Start uploading highlights to the cloud drive!
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

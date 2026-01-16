
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// Pre-configured Super Admin Keys for initial community bootstrapping
const MASTER_KEYS = ['ACE-7788', 'ACE-9922', 'ACE-1155', 'ACE-3344', 'ACE-5566'];

// Localized Strings
const TRANSLATIONS = {
  en: {
    appName: "AceLine",
    tagline: "Relive Every Match Point",
    feed: "Feed",
    sync: "Sync",
    albums: "Albums",
    settings: "Settings",
    members: "Members",
    profile: "Profile",
    favorites: "Favorites",
    myUploads: "My Uploads",
    membersMgmt: "Member Management",
    uploadAlbum: "Upload Album",
    create: "Create",
    name: "Name",
    coverUrl: "Cover Image URL",
    description: "Description",
    category: "Category",
    role: "Current Role",
    user: "Member",
    admin: "Admin",
    super: "Super Admin",
    owner: "App Owner",
    logout: "Logout",
    login: "Login",
    register: "Register",
    username: "Username",
    password: "Password",
    email: "Email Address",
    communityId: "Community ID",
    joinCommunity: "Join Community",
    createCommunity: "Create Community",
    invitationCode: "Invitation Code",
    codesList: "Keys List",
    required: "Required",
    copySuccess: "Invite info copied!",
    sendVerify: "Send Code",
    counting: "s left",
    verifyCode: "Verify Code",
    forgotPass: "Forgot Password?",
    kickConfirm: "Are you sure you want to remove this member?",
    joined: "Joined",
    globalView: "Global Oversight",
    noFavs: "No favorites yet",
    successUpload: "Album uploaded successfully!"
  },
  cn: {
    appName: "网球相册 AceLine",
    tagline: "记录每一个制胜分",
    feed: "动态",
    sync: "同步",
    albums: "相册集",
    settings: "设置",
    members: "成员",
    profile: "个人中心",
    favorites: "我的收藏",
    myUploads: "我的上传",
    membersMgmt: "成员管理",
    uploadAlbum: "上传相册",
    create: "立即发布",
    name: "相册名称",
    coverUrl: "封面图片链接",
    description: "相册描述",
    category: "分类标签",
    role: "当前身份",
    user: "正式成员",
    admin: "管理员",
    super: "超级管理员",
    owner: "平台主管理员",
    logout: "退出登录",
    login: "登录",
    register: "注册",
    username: "用户名",
    password: "密码",
    email: "电子邮箱",
    communityId: "社区 ID",
    joinCommunity: "加入现有社区",
    createCommunity: "创建新社区",
    invitationCode: "邀请验证码",
    codesList: "密钥列表",
    required: "必填",
    copySuccess: "邀请信息已复制！",
    sendVerify: "发送验证码",
    counting: "秒后重发",
    verifyCode: "验证码",
    forgotPass: "忘记密码？",
    kickConfirm: "确定要移除该成员吗？",
    joined: "加入时间",
    globalView: "全平台管理概览",
    noFavs: "暂无收藏内容",
    successUpload: "相册上传成功！"
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

const EyeIcon = ({ show }: { show: boolean }) => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {show ? (
      <>
        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
  </svg>
);

type Role = 'user' | 'admin' | 'super' | 'owner';
type Screen = 'auth' | 'login_form' | 'forgot_form' | 'register_choice' | 'register_form' | 'albums' | 'feed' | 'sync' | 'settings' | 'members' | 'keys_mgmt' | 'upload_form';

interface User {
  username: string;
  password: string;
  role: Role;
  email: string;
  communityId: string;
  createdAt: number;
}

interface Album {
  id: string;
  name: string;
  cover: string;
  desc: string;
  category: string;
  createdAt: number;
  owner: string;
  communityId: string;
}

interface InviteCode {
  id: string;
  code: string;
  role: Role;
  communityId: string;
  used: boolean;
}

const APP_OWNER: User = {
    username: "Zoe Zhou",
    password: "ACE-7788",
    email: "zoezhou85@hotmail.com",
    role: "owner",
    communityId: "GLOBAL",
    createdAt: Date.now()
};

const App = () => {
  const [lang, setLang] = useState<'en' | 'cn'>('cn');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>('auth');
  const [regMode, setRegMode] = useState<'create' | 'join'>('join');
  
  const [userDb, setUserDb] = useState<User[]>(() => {
      const saved = localStorage.getItem('ace_users');
      const users: User[] = saved ? JSON.parse(saved) : [];
      if (!users.some(u => u.username === APP_OWNER.username)) {
          users.push(APP_OWNER);
      }
      return users;
  });

  const [albums, setAlbums] = useState<Album[]>(() => JSON.parse(localStorage.getItem('ace_albums') || '[]'));
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>(() => JSON.parse(localStorage.getItem('ace_invites') || '[]'));
  const [userLikes, setUserLikes] = useState<Record<string, string[]>>(() => JSON.parse(localStorage.getItem('ace_likes') || '{}'));
  
  const [usedMasterKeys, setUsedMasterKeys] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('ace_used_master_keys') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('ace_users', JSON.stringify(userDb));
    localStorage.setItem('ace_albums', JSON.stringify(albums));
    localStorage.setItem('ace_invites', JSON.stringify(inviteCodes));
    localStorage.setItem('ace_likes', JSON.stringify(userLikes));
    localStorage.setItem('ace_used_master_keys', JSON.stringify(usedMasterKeys));
  }, [userDb, albums, inviteCodes, userLikes, usedMasterKeys]);

  const t = TRANSLATIONS[lang];
  
  const communityAlbums = useMemo(() => 
    currentUser?.role === 'owner' ? albums : albums.filter(a => a.communityId === currentUser?.communityId), 
    [albums, currentUser]
  );

  const visibleMembers = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'owner') return userDb;
    return userDb.filter(u => u.communityId === currentUser.communityId);
  }, [userDb, currentUser]);

  const toggleLike = (albumId: string) => {
    if (!currentUser) return;
    const currentLikes = userLikes[currentUser.username] || [];
    const newLikes = currentLikes.includes(albumId) 
        ? currentLikes.filter(id => id !== albumId)
        : [...currentLikes, albumId];
    setUserLikes({ ...userLikes, [currentUser.username]: newLikes });
  };

  // Fix: Implemented RegisterForm component
  const RegisterForm = () => {
    const [u, setU] = useState('');
    const [p, setP] = useState('');
    const [e, setE] = useState('');
    const [cid, setCid] = useState('');
    const [key, setKey] = useState('');

    const handleRegister = () => {
      if (!u || !p || !e || !cid) return alert(t.required);
      
      let role: Role = 'user';
      if (regMode === 'create') {
        if (!MASTER_KEYS.includes(key)) return alert("Invalid Master Key");
        if (usedMasterKeys.includes(key)) return alert("Key already used");
        role = 'super';
        setUsedMasterKeys([...usedMasterKeys, key]);
      } else {
        const invite = inviteCodes.find(i => i.code === key && i.communityId === cid && !i.used);
        if (invite) {
          role = invite.role;
          setInviteCodes(inviteCodes.map(i => i.id === invite.id ? { ...i, used: true } : i));
        } else if (key) {
           return alert("Invalid or used invitation code");
        }
      }

      const newUser: User = {
        username: u,
        password: p,
        email: e,
        communityId: cid,
        role,
        createdAt: Date.now()
      };
      
      setUserDb([...userDb, newUser]);
      setCurrentUser(newUser);
      setScreen('albums');
    };

    return (
      <div className="flex flex-col h-full bg-white p-10 justify-center animate-slide overflow-y-auto">
        <h2 className="text-[32px] font-black text-blue-950 mb-8 tracking-tighter italic uppercase text-center leading-none">
          {regMode === 'create' ? t.createCommunity : t.joinCommunity}
        </h2>
        <div className="space-y-4">
          <input placeholder={t.username} value={u} onChange={e => setU(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900" />
          <input placeholder={t.email} value={e} onChange={e => setE(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900" />
          <input type="password" placeholder={t.password} value={p} onChange={e => setP(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900" />
          <input placeholder={t.communityId} value={cid} onChange={e => setCid(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900" />
          <input placeholder={regMode === 'create' ? "Master Key (ACE-XXXX)" : t.invitationCode + " (Optional)"} value={key} onChange={e => setKey(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900" />
          
          <button onClick={handleRegister} className="w-full py-6 bg-[#A3E635] text-blue-950 font-black rounded-full text-xl shadow-xl mt-4 uppercase italic border-b-8 border-lime-600 active:translate-y-1">{t.register}</button>
          <button onClick={() => setScreen('register_choice')} className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Back</button>
        </div>
      </div>
    );
  };

  // Fix: Implemented KeysMgmtScreen component
  const KeysMgmtScreen = () => {
    const handleGenKey = (role: Role) => {
      const newKey: InviteCode = {
        id: Math.random().toString(36).substr(2, 9),
        code: 'ACE-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        role,
        communityId: currentUser!.communityId,
        used: false
      };
      setInviteCodes([newKey, ...inviteCodes]);
    };

    const myCommunityKeys = inviteCodes.filter(k => k.communityId === currentUser?.communityId);

    return (
      <div className="flex flex-col h-full bg-white animate-fade overflow-y-auto pb-48">
        <header className="px-8 pt-16 pb-6 bg-white sticky top-0 z-20 border-b">
          <h2 className="text-4xl font-black text-blue-950 tracking-tighter italic uppercase">{t.codesList}</h2>
        </header>
        <div className="p-8 space-y-6">
          <div className="flex gap-2">
            <button onClick={() => handleGenKey('admin')} className="flex-1 py-4 bg-blue-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Gen Admin Key</button>
            <button onClick={() => handleGenKey('user')} className="flex-1 py-4 bg-lime-400 text-blue-950 rounded-2xl font-black text-[10px] uppercase tracking-widest">Gen Member Key</button>
          </div>
          <div className="space-y-3">
            {myCommunityKeys.map(k => (
              <div key={k.id} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-black text-blue-950 font-mono text-lg">{k.code}</p>
                  <p className="text-[8px] font-black uppercase text-slate-400">{k.role} • {k.used ? "USED" : "ACTIVE"}</p>
                </div>
                {!k.used && <button onClick={() => {navigator.clipboard.writeText(k.code); alert(t.copySuccess);}} className="text-xs font-black text-lime-600 uppercase">Copy</button>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const LoginForm = () => {
    const [u, setU] = useState('');
    const [p, setP] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleLogin = () => {
      const found = userDb.find(user => (user.username === u || user.email === u) && user.password === p);
      if (found) { 
          setCurrentUser(found); 
          setScreen('albums'); 
      }
      else alert("Invalid Credentials");
    };
    return (
      <div className="flex flex-col h-full bg-white p-10 justify-center animate-slide">
        <TennisBallIcon className="w-14 h-14 mb-8 self-center" />
        <h2 className="text-[38px] font-black text-[#1E293B] mb-10 tracking-tighter uppercase italic text-center leading-none">LOGIN</h2>
        <div className="space-y-4">
          <input placeholder="Username or Email" value={u} onChange={e => setU(e.target.value)} className="w-full bg-slate-50 p-6 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900 transition-all" />
          <div className="relative">
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Password" 
              value={p} 
              onChange={e => setP(e.target.value)} 
              className="w-full bg-slate-50 p-6 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900 transition-all" 
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-950">
              <EyeIcon show={showPass} />
            </button>
          </div>
          <button onClick={handleLogin} className="w-full py-7 bg-[#A3E635] text-blue-950 font-black rounded-full text-xl shadow-xl mt-4 uppercase italic tracking-tighter border-b-8 border-lime-600 active:translate-y-1 transition-all">Enter AceLine</button>
          <button onClick={() => setScreen('auth')} className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-2">Cancel</button>
        </div>
      </div>
    );
  };

  const UploadForm = () => {
      const [n, setN] = useState('');
      const [c, setC] = useState('https://images.unsplash.com/photo-1595435066359-e1a04b1e5645?q=80&w=1000&auto=format&fit=crop');
      const [d, setD] = useState('');
      const [cat, setCat] = useState('Match');

      const handleUpload = () => {
          if(!n) return alert(t.required);
          const newAlbum: Album = {
              id: Math.random().toString(36).substr(2, 9),
              name: n,
              cover: c,
              desc: d,
              category: cat,
              createdAt: Date.now(),
              owner: currentUser!.username,
              communityId: currentUser!.communityId
          };
          setAlbums([newAlbum, ...albums]);
          alert(t.successUpload);
          setScreen('albums');
      };

      return (
          <div className="flex flex-col h-full bg-white p-10 pt-16 animate-slide overflow-y-auto pb-40">
              <h2 className="text-[32px] font-black text-blue-950 mb-8 tracking-tighter italic uppercase">{t.uploadAlbum}</h2>
              <div className="space-y-6">
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t.name}*</label><input value={n} onChange={e => setN(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-950 transition-all" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t.coverUrl}</label><input value={c} onChange={e => setC(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-950 transition-all text-xs" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t.description}</label><textarea value={d} onChange={e => setD(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none h-32 resize-none" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t.category}</label>
                      <div className="flex flex-wrap gap-2">
                          {['Match', 'Training', 'Clubs', 'Social'].map(s => (
                              <button key={s} onClick={() => setCat(s)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${cat === s ? 'bg-blue-950 text-white' : 'bg-slate-100 text-slate-400'}`}>{s}</button>
                          ))}
                      </div>
                  </div>
              </div>
              <button onClick={handleUpload} className="w-full py-6 bg-[#A3E635] text-blue-950 font-black rounded-full text-xl shadow-xl mt-12 uppercase italic border-b-8 border-lime-600 active:translate-y-1">{t.create}</button>
              <button onClick={() => setScreen('albums')} className="w-full py-4 text-slate-400 font-bold text-xs uppercase mt-4">Cancel</button>
          </div>
      )
  }

  const MembersScreen = () => {
    const kickMember = (username: string) => {
        if(window.confirm(t.kickConfirm)) {
            setUserDb(userDb.filter(u => u.username !== username));
        }
    };

    return (
        <div className="flex flex-col h-full bg-white animate-fade overflow-y-auto pb-48">
            <header className="px-8 pt-16 pb-6 bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-50">
                <p className="text-[10px] font-black text-lime-600 uppercase tracking-[0.4em] mb-2 italic">
                    {currentUser?.role === 'owner' ? "PLATFORM" : currentUser?.communityId}
                </p>
                <h2 className="text-5xl font-black text-blue-950 tracking-tighter italic leading-none">
                    {currentUser?.role === 'owner' ? t.globalView : (currentUser?.role === 'super' || currentUser?.role === 'admin' ? t.membersMgmt : t.members)}
                </h2>
            </header>
            <div className="px-8 mt-8 space-y-4">
                {visibleMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-xl group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-950 rounded-2xl flex items-center justify-center text-xl font-black text-lime-400 shadow-lg">
                                {member.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-black text-blue-950 uppercase italic tracking-tighter">
                                    {member.username} {currentUser?.role === 'owner' && <span className="text-slate-300 font-normal">@{member.communityId}</span>}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest ${
                                        member.role === 'owner' ? 'bg-black text-white' :
                                        member.role === 'super' ? 'bg-lime-400 text-blue-950' : 
                                        member.role === 'admin' ? 'bg-blue-200 text-blue-900' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                        {TRANSLATIONS[lang][member.role as keyof typeof TRANSLATIONS.en]}
                                    </span>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t.joined}: {new Date(member.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        {((currentUser?.role === 'super' && member.role !== 'super') || (currentUser?.role === 'owner' && member.role !== 'owner')) && (
                            <button onClick={() => kickMember(member.username)} className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const SettingsScreen = () => {
    const userLikesArr = userLikes[currentUser?.username || ""] || [];
    const likedAlbums = albums.filter(a => userLikesArr.includes(a.id));
    const userUploads = albums.filter(a => a.owner === currentUser?.username);

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-48 animate-fade">
          <header className="px-8 pt-20 pb-8 bg-white border-b flex justify-between items-center">
            <div className="flex items-center gap-3"><TennisBallIcon className="w-8 h-8" /><h2 className="text-2xl font-black text-blue-950 tracking-tighter italic uppercase leading-none">ACELINE</h2></div>
            <button className="text-[10px] font-black bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest" onClick={() => setLang(lang === 'cn' ? 'en' : 'cn')}>{lang.toUpperCase()}</button>
          </header>
          <div className="p-8 space-y-6">
            <div className="bg-white rounded-[3.5rem] p-8 shadow-xl border border-slate-100">
                <div className="flex items-center gap-5">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl border-b-4 ${currentUser?.role === 'owner' ? 'bg-black border-slate-800' : 'bg-[#A3E635] border-lime-600'}`}>
                        {currentUser?.role === 'owner' ? "👑" : "🎾"}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter">{currentUser?.username}</h3>
                        <p className="text-[10px] font-black text-lime-600 uppercase tracking-widest">
                            {TRANSLATIONS[lang][currentUser?.role as keyof typeof TRANSLATIONS.en]} @ {currentUser?.communityId}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-slate-50 p-6 rounded-[2rem] text-center border border-slate-100">
                        <p className="text-2xl font-black text-blue-950 italic">{userUploads.length}</p>
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{t.myUploads}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[2rem] text-center border border-slate-100">
                        <p className="text-2xl font-black text-blue-950 italic">{likedAlbums.length}</p>
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{t.favorites}</p>
                    </div>
                </div>
            </div>

            <section className="space-y-4">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 ml-4 italic">{t.favorites}</h4>
                {likedAlbums.length === 0 ? (
                    <div className="p-12 text-center opacity-30 italic font-bold uppercase text-xs">{t.noFavs}</div>
                ) : (
                    <div className="space-y-4">
                        {likedAlbums.map(album => (
                            <div key={album.id} className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
                                <img src={album.cover} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                                <div className="flex-1">
                                    <h5 className="font-black text-blue-950 uppercase text-xs italic">{album.name}</h5>
                                    <p className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">@{album.owner}</p>
                                </div>
                                <button onClick={() => toggleLike(album.id)} className="w-10 h-10 text-red-500 bg-red-50 rounded-full flex items-center justify-center">❤</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {currentUser?.role === 'super' && <button onClick={() => setScreen('keys_mgmt')} className="w-full p-8 bg-blue-950 text-white rounded-[3.5rem] shadow-2xl flex items-center justify-between group active:scale-95 border-b-8 border-slate-800"><p className="font-black text-lg uppercase tracking-tighter italic">{t.codesList}</p><div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🔑</div></button>}
            <button onClick={() => {setCurrentUser(null); setScreen('auth');}} className="w-full py-6 bg-white text-red-500 rounded-[3rem] font-black text-xs shadow-sm border border-red-50 uppercase tracking-[0.4em]">Logout</button>
          </div>
        </div>
    );
  }

  const AlbumsScreen = () => {
    const currentLikes = userLikes[currentUser?.username || ""] || [];
    return (
        <div className="flex flex-col h-full bg-white animate-fade overflow-y-auto pb-48">
          <header className="px-8 pt-16 pb-6 bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-50 flex justify-between items-end">
            <div>
                <p className="text-[10px] font-black text-lime-600 uppercase tracking-[0.4em] mb-2 italic">
                    {currentUser?.role === 'owner' ? "SYSTEM" : currentUser?.communityId}
                </p>
                <h2 className="text-5xl font-black text-blue-950 tracking-tighter italic leading-none">{t.albums}</h2>
            </div>
            <button onClick={() => setScreen('upload_form')} className="w-16 h-16 bg-[#A3E635] text-blue-950 rounded-3xl shadow-xl flex items-center justify-center text-4xl font-black border-b-4 border-lime-600 active:translate-y-1 transition-all">
                +
            </button>
          </header>
          <div className="px-8 space-y-10 mt-8">
            {communityAlbums.length === 0 ? <div className="py-32 text-center opacity-20 italic font-black text-2xl uppercase tracking-tighter">Vault is Empty</div> : communityAlbums.map(album => (
                <div key={album.id} className="relative bg-white rounded-[4rem] overflow-hidden shadow-2xl p-4 border border-slate-50 group">
                    <div className="h-72 rounded-[3.5rem] overflow-hidden relative">
                        <img src={album.cover} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent"></div>
                        
                        <button onClick={() => toggleLike(album.id)} className={`absolute top-8 right-8 w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-xl transition-all ${currentLikes.includes(album.id) ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 backdrop-blur-md text-white/60 hover:text-white'}`}>
                            ❤
                        </button>

                        <div className="absolute bottom-10 left-10 text-white">
                            <span className="bg-lime-400 text-blue-950 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 inline-block shadow-lg">#{album.category}</span>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter">{album.name}</h3>
                            <div className="flex items-center gap-2 opacity-60">
                                <span className="text-[9px] font-bold">BY {album.owner.toUpperCase()}</span>
                                {currentUser?.role === 'owner' && <span className="text-[9px]">@{album.communityId}</span>}
                            </div>
                        </div>
                    </div>
                </div>
              ))}
          </div>
        </div>
      );
  }

  const isManagementView = currentUser?.role && ['super', 'admin', 'owner'].includes(currentUser.role);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#CBD5E1]">
      <div className="w-full max-w-md h-full bg-white overflow-hidden flex flex-col shadow-2xl relative">
        {screen === 'auth' && (
          <div className="h-full bg-[#0F172A] p-10 flex flex-col justify-center items-center text-center space-y-12">
            <div className="w-36 h-36 bg-[#A3E635] rounded-[4rem] flex items-center justify-center shadow-2xl animate-pulse border-b-8 border-lime-600"><TennisBallIcon className="w-24 h-24" /></div>
            <div className="space-y-4"><h1 className="text-7xl font-black text-white tracking-tighter italic uppercase leading-none">AceLine</h1><p className="text-slate-500 font-bold tracking-widest text-xs uppercase opacity-80">{t.tagline}</p></div>
            <div className="w-full space-y-4 max-w-xs pt-8">
                <button onClick={() => setScreen('login_form')} className="w-full py-7 bg-[#A3E635] text-blue-950 font-black rounded-full text-2xl shadow-2xl uppercase italic border-b-8 border-lime-600">{t.login}</button>
                <button onClick={() => setScreen('register_choice')} className="w-full py-4 bg-white/5 text-white rounded-2xl font-black text-[11px] border border-white/10 uppercase tracking-[0.2em]">{t.register}</button>
            </div>
          </div>
        )}
        {screen === 'register_choice' && (
          <div className="h-full bg-white p-10 flex flex-col justify-center space-y-8 animate-slide">
            <h2 className="text-[42px] font-black text-[#1E293B] mb-2 tracking-tighter uppercase italic text-center leading-none">JOIN THE COURT</h2>
            <div className="space-y-5">
               <button onClick={() => {setRegMode('create'); setScreen('register_form');}} className="w-full p-8 bg-blue-950 text-white rounded-[3.5rem] text-left shadow-2xl active:scale-95 border-b-8 border-slate-800"><p className="font-black text-2xl italic uppercase tracking-tighter mb-1">{t.createCommunity}</p></button>
               <button onClick={() => {setRegMode('join'); setScreen('register_form');}} className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[3.5rem] text-left shadow-sm active:scale-95"><p className="font-black text-2xl text-blue-950 italic uppercase tracking-tighter mb-1">{t.joinCommunity}</p></button>
            </div>
            <button onClick={() => setScreen('auth')} className="py-4 text-slate-300 font-black uppercase text-xs text-center tracking-widest mt-4">Return</button>
          </div>
        )}
        {screen === 'login_form' && <LoginForm />}
        {screen === 'register_form' && <RegisterForm />}
        {screen === 'upload_form' && <UploadForm />}
        {screen === 'albums' && <AlbumsScreen />}
        {screen === 'members' && <MembersScreen />}
        {screen === 'settings' && <SettingsScreen />}
        {screen === 'keys_mgmt' && <KeysMgmtScreen />}
        {/* Basic placeholders for Feed and Sync screens */}
        {screen === 'feed' && (
          <div className="flex flex-col h-full bg-white animate-fade items-center justify-center p-10 text-center">
            <div className="text-6xl mb-6">⚡</div>
            <h2 className="text-4xl font-black text-blue-950 italic uppercase tracking-tighter">{t.feed}</h2>
            <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-widest">Global match highlights coming soon</p>
          </div>
        )}
        {screen === 'sync' && (
          <div className="flex flex-col h-full bg-white animate-fade items-center justify-center p-10 text-center">
            <div className="text-6xl mb-6">🔄</div>
            <h2 className="text-4xl font-black text-blue-950 italic uppercase tracking-tighter">{t.sync}</h2>
            <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-widest">Syncing with your device gallery...</p>
          </div>
        )}
        {['albums', 'feed', 'sync', 'settings', 'members', 'keys_mgmt', 'upload_form'].includes(screen) && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[94%] bg-blue-950/98 backdrop-blur-3xl rounded-[4rem] flex items-center justify-around py-8 px-6 shadow-2xl border border-white/10 z-50 transition-transform">
            <button onClick={() => setScreen('albums')} className={`flex flex-col items-center transition-all ${screen === 'albums' || screen === 'upload_form' ? 'text-lime-400' : 'text-slate-500'}`}><div className="text-3xl">📂</div><span className="text-[8px] font-black uppercase tracking-widest mt-1">{t.albums}</span></button>
            <button onClick={() => setScreen('members')} className={`flex flex-col items-center transition-all ${screen === 'members' ? 'text-lime-400' : 'text-slate-500'}`}>
                <div className="text-3xl">{isManagementView ? "👥" : "🛡️"}</div>
                <span className="text-[8px] font-black uppercase tracking-widest mt-1">{isManagementView ? t.members : t.profile}</span>
            </button>
            <button onClick={() => setScreen('feed')} className={`flex flex-col items-center transition-all ${screen === 'feed' ? 'text-lime-400' : 'text-slate-500'}`}><div className="text-3xl">⚡</div><span className="text-[8px] font-black uppercase tracking-widest mt-1">{t.feed}</span></button>
            <button onClick={() => setScreen('sync')} className={`flex flex-col items-center transition-all ${screen === 'sync' ? 'text-lime-400' : 'text-slate-500'}`}><div className="text-3xl">🔄</div><span className="text-[8px] font-black uppercase tracking-widest mt-1">{t.sync}</span></button>
            <button onClick={() => setScreen('settings')} className={`flex flex-col items-center transition-all ${screen === 'settings' || screen === 'keys_mgmt' ? 'text-lime-400' : 'text-slate-500'}`}><div className="text-3xl">⚙️</div><span className="text-[8px] font-black uppercase tracking-widest mt-1">{t.settings}</span></button>
          </div>
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

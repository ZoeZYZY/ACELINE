import React, { useState, useEffect, useMemo, useRef } from 'react';
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
    uploadAlbum: "Create Album",
    create: "Publish",
    name: "Name",
    coverUrl: "Select Cover",
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
    successUpload: "Album created!",
    addPhotos: "Add Photos",
    download: "Download",
    back: "Back",
    loginError: "Login failed. Please check credentials."
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
    uploadAlbum: "新建相册",
    create: "立即发布",
    name: "相册名称",
    coverUrl: "选择封面",
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
    successUpload: "相册创建成功！",
    addPhotos: "上传照片",
    download: "保存到本地",
    back: "返回",
    loginError: "登录失败，请检查用户名和密码"
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
type Screen = 'auth' | 'login_form' | 'forgot_form' | 'register_choice' | 'register_form' | 'albums' | 'feed' | 'sync' | 'settings' | 'members' | 'keys_mgmt' | 'upload_form' | 'gallery_view';

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
  photos: string[]; 
}

const APP_OWNER: User = {
    username: "Zoe Zhou",
    password: "ACE-7788",
    email: "zoezhou85@hotmail.com",
    role: "owner",
    communityId: "GLOBAL",
    createdAt: 1714560000000
};

const App = () => {
  const [lang, setLang] = useState<'en' | 'cn'>('cn');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>('auth');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [regMode, setRegMode] = useState<'create' | 'join'>('join');
  const [filterMode, setFilterMode] = useState<'all' | 'mine'>('all');
  
  const [loginU, setLoginU] = useState('');
  const [loginP, setLoginP] = useState('');
  const [showP, setShowP] = useState(false);

  // Hardened Database initialization
  const [userDb, setUserDb] = useState<User[]>(() => {
      const saved = localStorage.getItem('ace_users');
      let users: User[] = saved ? JSON.parse(saved) : [];
      // Force refresh App Owner to prevent old cached object corruption
      users = users.filter(u => u.username.toLowerCase() !== APP_OWNER.username.toLowerCase());
      users.push(APP_OWNER);
      return users;
  });

  const [albums, setAlbums] = useState<Album[]>(() => JSON.parse(localStorage.getItem('ace_albums') || '[]'));
  const [userLikes, setUserLikes] = useState<Record<string, string[]>>(() => JSON.parse(localStorage.getItem('ace_likes') || '{}'));

  useEffect(() => {
    localStorage.setItem('ace_users', JSON.stringify(userDb));
    localStorage.setItem('ace_albums', JSON.stringify(albums));
    localStorage.setItem('ace_likes', JSON.stringify(userLikes));
  }, [userDb, albums, userLikes]);

  const t = TRANSLATIONS[lang];
  
  // Safe derivation of community list
  const communityAlbums = useMemo(() => {
    if (!currentUser) return [];
    let list = currentUser.role === 'owner' ? albums : albums.filter(a => a.communityId === currentUser.communityId);
    if (filterMode === 'mine') list = list.filter(a => a.owner === currentUser.username);
    return list;
  }, [albums, currentUser, filterMode]);

  const selectedAlbum = useMemo(() => albums.find(a => a.id === selectedAlbumId), [albums, selectedAlbumId]);

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginU.trim() || !loginP.trim()) return alert(t.required);
    
    // Normalize input for comparison
    const searchU = loginU.trim().toLowerCase();
    const searchP = loginP.trim();

    const found = userDb.find(u => 
        (u.username.toLowerCase() === searchU || u.email.toLowerCase() === searchU) && 
        u.password === searchP
    );

    if (found) {
        // Atomic update to prevent partial render
        setCurrentUser(found);
        setScreen('albums');
        setLoginU('');
        setLoginP('');
        setShowP(false);
    } else {
        alert(t.loginError);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  };

  const toggleLike = (albumId: string) => {
    if (!currentUser) return;
    const currentLikes = userLikes[currentUser.username] || [];
    const newLikes = currentLikes.includes(albumId) ? currentLikes.filter(id => id !== albumId) : [...currentLikes, albumId];
    setUserLikes({ ...userLikes, [currentUser.username]: newLikes });
  };

  const UploadForm = () => {
    const [n, setN] = useState('');
    const [c, setC] = useState('');
    const [d, setD] = useState('');
    const [cat, setCat] = useState('Match');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = () => {
        if(!n || !c) return alert(t.required);
        const newAlbum: Album = {
            id: Math.random().toString(36).substr(2, 9),
            name: n, cover: c, desc: d, category: cat,
            createdAt: Date.now(),
            owner: currentUser!.username,
            communityId: currentUser!.communityId,
            photos: []
        };
        setAlbums([newAlbum, ...albums]);
        setScreen('albums');
    };

    return (
        <div className="flex flex-col h-full bg-white p-10 pt-16 animate-slide overflow-y-auto pb-40">
            <h2 className="text-[32px] font-black text-blue-950 mb-8 tracking-tighter italic uppercase">{t.uploadAlbum}</h2>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t.name}*</label>
                    <input value={n} onChange={e => setN(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-950" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t.coverUrl}*</label>
                    <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
                        {c ? <img src={c} className="w-full h-full object-cover" /> : <div className="text-center"><span className="text-3xl">📷</span><p className="text-[10px] font-bold text-slate-400 mt-2">TAP TO SELECT</p></div>}
                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={async (e) => {
                            if (e.target.files?.[0]) setC(await fileToBase64(e.target.files[0]));
                        }} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{t.description}</label>
                    <textarea value={d} onChange={e => setD(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none h-24 resize-none" />
                </div>
            </div>
            <button onClick={handleUpload} className="w-full py-6 bg-[#A3E635] text-blue-950 font-black rounded-full text-xl shadow-xl mt-12 uppercase italic border-b-8 border-lime-600 active:translate-y-1">{t.create}</button>
        </div>
    );
  };

  const GalleryView = () => {
    const photoInputRef = useRef<HTMLInputElement>(null);
    if (!selectedAlbum) return null;

    return (
        <div className="flex flex-col h-full bg-white animate-fade overflow-y-auto pb-48">
            <header className="px-8 pt-16 pb-6 bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => setScreen('albums')} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black">←</button>
                    <div>
                        <h2 className="text-2xl font-black text-blue-950 tracking-tighter italic uppercase">{selectedAlbum.name}</h2>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">{selectedAlbum.photos.length} PHOTOS</p>
                    </div>
                </div>
                {(currentUser?.username === selectedAlbum.owner || currentUser?.role === 'owner') && (
                    <button onClick={() => photoInputRef.current?.click()} className="bg-blue-950 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {t.addPhotos}
                        <input type="file" multiple accept="image/*" ref={photoInputRef} className="hidden" onChange={async (e) => {
                            if (e.target.files) {
                                const newPhotos = await Promise.all(Array.from(e.target.files).map(f => fileToBase64(f)));
                                setAlbums(prev => prev.map(a => a.id === selectedAlbumId ? { ...a, photos: [...a.photos, ...newPhotos] } : a));
                            }
                        }} />
                    </button>
                )}
            </header>
            <div className="p-4 grid grid-cols-3 gap-1">
                {selectedAlbum.photos.map((p, i) => (
                    <div key={i} className="aspect-square bg-slate-100 relative group overflow-hidden">
                        <img src={p} className="w-full h-full object-cover" />
                        <a href={p} download={`ace_${selectedAlbum.name}_${i}.jpg`} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[10px] font-black text-white uppercase bg-blue-950/50 px-2 py-1 rounded">{t.download}</span>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const ProfileScreen = () => {
    if (!currentUser) return null;
    const userLikesArr = userLikes[currentUser.username] || [];
    const likedAlbumsCount = albums.filter(a => userLikesArr.includes(a.id)).length;
    const userUploadsCount = albums.filter(a => a.owner === currentUser.username).length;

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-48 animate-fade">
          <header className="px-8 pt-20 pb-8 bg-white border-b flex justify-between items-center">
            <div className="flex items-center gap-3"><TennisBallIcon className="w-8 h-8" /><h2 className="text-2xl font-black text-blue-950 tracking-tighter italic uppercase leading-none">ACELINE</h2></div>
            <button className="text-[10px] font-black bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest" onClick={() => setLang(lang === 'cn' ? 'en' : 'cn')}>{lang.toUpperCase()}</button>
          </header>
          <div className="p-8 space-y-6">
            <div className="bg-white rounded-[3.5rem] p-8 shadow-xl border border-slate-100">
                <div className="flex items-center gap-5">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl border-b-4 ${currentUser.role === 'owner' ? 'bg-black border-slate-800' : 'bg-[#A3E635] border-lime-600'}`}>
                        {currentUser.role === 'owner' ? "👑" : "🎾"}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-blue-950 uppercase italic tracking-tighter leading-tight">{currentUser.username}</h3>
                        <p className="text-[10px] font-black text-lime-600 uppercase tracking-widest mt-1">{currentUser.role.toUpperCase()} @ {currentUser.communityId}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button onClick={() => { setFilterMode('mine'); setScreen('albums'); }} className="bg-slate-50 p-6 rounded-[2rem] text-center border border-slate-100 active:bg-blue-950 active:text-white group transition-all">
                        <p className="text-2xl font-black text-blue-950 italic group-active:text-white">{userUploadsCount}</p>
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{t.myUploads}</p>
                    </button>
                    <div className="bg-slate-50 p-6 rounded-[2rem] text-center border border-slate-100">
                        <p className="text-2xl font-black text-blue-950 italic">{likedAlbumsCount}</p>
                        <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{t.favorites}</p>
                    </div>
                </div>
            </div>
            <button onClick={() => {setCurrentUser(null); setScreen('auth');}} className="w-full py-6 bg-white text-red-500 rounded-[3rem] font-black text-xs shadow-sm border border-red-50 uppercase tracking-[0.4em]">Logout</button>
          </div>
        </div>
    );
  };

  const AlbumsScreen = () => {
    if (!currentUser) return null;
    const currentLikes = userLikes[currentUser.username] || [];
    return (
        <div className="flex flex-col h-full bg-white animate-fade overflow-y-auto pb-48">
          <header className="px-8 pt-16 pb-6 bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b flex justify-between items-end">
            <div>
                <p className="text-[10px] font-black text-lime-600 uppercase tracking-[0.4em] mb-2 italic">
                    {filterMode === 'mine' ? t.myUploads : (currentUser.communityId || 'GLOBAL')}
                </p>
                <div className="flex items-center gap-2">
                    <h2 className="text-5xl font-black text-blue-950 tracking-tighter italic leading-none">{t.albums}</h2>
                    {filterMode === 'mine' && <button onClick={() => setFilterMode('all')} className="bg-slate-100 text-[10px] font-black px-2 py-1 rounded-full uppercase ml-2 shadow-sm">RESET</button>}
                </div>
            </div>
            <button onClick={() => setScreen('upload_form')} className="w-16 h-16 bg-[#A3E635] text-blue-950 rounded-3xl shadow-xl flex items-center justify-center text-4xl font-black border-b-4 border-lime-600 active:translate-y-1">+</button>
          </header>
          <div className="px-8 space-y-10 mt-8">
            {communityAlbums.map(album => (
                <div key={album.id} className="relative bg-white rounded-[4rem] overflow-hidden shadow-2xl p-4 border border-slate-50 group">
                    <div className="h-72 rounded-[3.5rem] overflow-hidden relative cursor-pointer" onClick={() => { setSelectedAlbumId(album.id); setScreen('gallery_view'); }}>
                        <img src={album.cover} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent"></div>
                        <button onClick={(e) => { e.stopPropagation(); toggleLike(album.id); }} className={`absolute top-8 right-8 w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-xl transition-all ${currentLikes.includes(album.id) ? 'bg-red-500 text-white' : 'bg-white/20 backdrop-blur-md text-white'}`}>❤</button>
                        <div className="absolute bottom-10 left-10 text-white">
                            <span className="bg-lime-400 text-blue-950 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 inline-block shadow-lg">#{album.category}</span>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter">{album.name}</h3>
                            <div className="flex items-center gap-2 opacity-60">
                                <span className="text-[9px] font-bold">BY {album.owner.toUpperCase()} • {album.photos.length} PHOTOS</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {communityAlbums.length === 0 && <div className="py-32 text-center opacity-20 italic font-black text-2xl uppercase tracking-tighter">No Albums Found</div>}
          </div>
        </div>
      );
  };

  const isManagementView = currentUser?.role && ['super', 'admin', 'owner'].includes(currentUser.role);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#CBD5E1]">
      <div className="w-full max-w-md h-full bg-white overflow-hidden flex flex-col shadow-2xl relative">
        {screen === 'auth' && (
          <div className="h-full bg-[#0F172A] p-10 flex flex-col justify-center items-center text-center space-y-12 relative">
            <button className="absolute top-10 right-10 text-[10px] font-black bg-white/10 text-white px-3 py-1.5 rounded-full uppercase tracking-widest" onClick={() => setLang(lang === 'cn' ? 'en' : 'cn')}>{lang.toUpperCase()}</button>
            <div className="w-36 h-36 bg-[#A3E635] rounded-[4rem] flex items-center justify-center shadow-2xl border-b-8 border-lime-600"><TennisBallIcon className="w-24 h-24" /></div>
            <div className="space-y-4"><h1 className="text-7xl font-black text-white tracking-tighter italic uppercase leading-none">AceLine</h1><p className="text-slate-500 font-bold tracking-widest text-xs uppercase opacity-80">{t.tagline}</p></div>
            <div className="w-full space-y-4 max-w-xs pt-8">
                <button onClick={() => setScreen('login_form')} className="w-full py-7 bg-[#A3E635] text-blue-950 font-black rounded-full text-2xl shadow-2xl uppercase italic border-b-8 border-lime-600 active:translate-y-1">{t.login}</button>
                <button onClick={() => setScreen('register_choice')} className="w-full py-4 bg-white/5 text-white rounded-2xl font-black text-[11px] border border-white/10 uppercase tracking-[0.2em]">{t.register}</button>
            </div>
          </div>
        )}

        {screen === 'login_form' && (
            <div className="flex flex-col h-full bg-white p-10 justify-center animate-slide">
                <TennisBallIcon className="w-14 h-14 mb-8 self-center" />
                <h2 className="text-[38px] font-black text-[#1E293B] mb-10 tracking-tighter uppercase italic text-center leading-none">LOGIN</h2>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="relative">
                        <input value={loginU} onChange={e => setLoginU(e.target.value)} placeholder={t.username} className="w-full bg-slate-50 p-6 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900 transition-all shadow-inner" />
                    </div>
                    <div className="relative flex items-center">
                        <input type={showP ? "text" : "password"} value={loginP} onChange={e => setLoginP(e.target.value)} placeholder={t.password} className="w-full bg-slate-50 p-6 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-900 transition-all pr-14 shadow-inner" />
                        <button type="button" onClick={() => setShowP(!showP)} className="absolute right-5 text-xl opacity-40 hover:opacity-100 transition-opacity">
                            {showP ? "👁️" : "🫣"}
                        </button>
                    </div>
                    <button type="submit" className="w-full py-7 bg-[#A3E635] text-blue-950 font-black rounded-full text-xl shadow-xl mt-4 uppercase italic tracking-tighter border-b-8 border-lime-600 active:translate-y-1">
                        {t.login}
                    </button>
                    <button type="button" onClick={() => { setScreen('auth'); setLoginU(''); setLoginP(''); }} className="w-full py-4 text-slate-400 font-bold text-xs uppercase text-center tracking-widest">
                        {t.back}
                    </button>
                </form>
            </div>
        )}

        {screen === 'register_choice' && (
            <div className="h-full bg-white p-10 flex flex-col justify-center space-y-8 animate-slide">
                <h2 className="text-[42px] font-black text-[#1E293B] mb-2 tracking-tighter uppercase italic text-center leading-none">JOIN THE COURT</h2>
                <button onClick={() => {setRegMode('create'); setScreen('register_form');}} className="w-full p-8 bg-blue-950 text-white rounded-[3.5rem] text-left shadow-2xl border-b-8 border-slate-800 font-black text-2xl italic uppercase">{t.createCommunity}</button>
                <button onClick={() => {setRegMode('join'); setScreen('register_form');}} className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[3.5rem] text-left text-blue-950 font-black text-2xl italic uppercase">{t.joinCommunity}</button>
                <button onClick={() => setScreen('auth')} className="py-4 text-slate-300 font-black uppercase text-xs text-center tracking-widest">{t.back}</button>
            </div>
        )}

        {screen === 'register_form' && <div className="h-full bg-white p-10 pt-20 animate-slide">
            <button onClick={() => setScreen('register_choice')} className="mb-10 text-xs font-black uppercase">← {t.back}</button>
            <h2 className="text-3xl font-black mb-8 italic uppercase">{regMode === 'create' ? t.createCommunity : t.joinCommunity}</h2>
            <div className="space-y-4">
                <input id="reg-u" placeholder={t.username} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none" />
                <input id="reg-p" type="password" placeholder={t.password} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none" />
                <input id="reg-key" placeholder={regMode === 'create' ? "Master Key" : t.invitationCode} className="w-full bg-slate-50 p-5 rounded-2xl font-bold outline-none" />
                <button onClick={() => {
                    const u = (document.getElementById('reg-u') as HTMLInputElement).value;
                    const p = (document.getElementById('reg-p') as HTMLInputElement).value;
                    const k = (document.getElementById('reg-key') as HTMLInputElement).value;
                    if(!u || !p || !k) return alert(t.required);
                    if(regMode === 'create') {
                        if(!MASTER_KEYS.includes(k)) return alert("Invalid Master Key");
                        const newUser: User = { username: u, password: p, email: '', role: 'owner', communityId: 'COMM-' + Math.floor(Math.random()*1000), createdAt: Date.now() };
                        setUserDb([...userDb, newUser]);
                        setCurrentUser(newUser);
                        setScreen('albums');
                    } else {
                        alert("Registration demo: Please use Zoe Zhou/ACE-7788 to login.");
                    }
                }} className="w-full py-6 bg-[#A3E635] text-blue-950 font-black rounded-full text-xl shadow-xl mt-8 italic uppercase border-b-8 border-lime-600 active:translate-y-1">{t.register}</button>
            </div>
        </div>}
        
        {screen === 'upload_form' && <UploadForm />}
        {screen === 'gallery_view' && <GalleryView />}
        {screen === 'albums' && <AlbumsScreen />}
        {screen === 'settings' && <ProfileScreen />}
        
        {['albums', 'settings', 'upload_form', 'gallery_view'].includes(screen) && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[94%] bg-blue-950/98 backdrop-blur-3xl rounded-[4rem] flex items-center justify-around py-8 px-6 shadow-2xl border border-white/10 z-50 transition-transform">
            <button onClick={() => { setFilterMode('all'); setScreen('albums'); }} className={`flex flex-col items-center transition-all ${screen === 'albums' || screen === 'gallery_view' || screen === 'upload_form' ? 'text-lime-400' : 'text-slate-500'}`}><div className="text-3xl">📂</div><span className="text-[8px] font-black uppercase tracking-widest mt-1">{t.albums}</span></button>
            <button onClick={() => setScreen('settings')} className={`flex flex-col items-center transition-all ${screen === 'settings' ? 'text-lime-400' : 'text-slate-500'}`}>
                <div className="text-3xl">🛡️</div>
                <span className="text-[8px] font-black uppercase tracking-widest mt-1">{t.profile}</span>
            </button>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl text-white">🎾</div>
          </div>
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

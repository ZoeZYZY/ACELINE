
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

type Role = 'OWNER' | 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER';

// ✅ 外部定义 LoginView：语言按钮移至右上
const LoginView = ({ lang, setLang, formData, setFormData, showPassword, setShowPassword, onLogin, goRegister }: any) => {
  return (
    <div className="w-full bg-[#FDFDFD] px-10 animate-fade pb-40 relative">
      {/* 语言切换按钮 - 移至右上方 */}
      <div className="absolute top-12 right-10 z-10">
        <button 
          type="button" 
          onClick={() => setLang(lang === 'cn' ? 'en' : 'cn')}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-200 shadow-sm active:scale-90 transition-transform"
        >
          {lang === 'cn' ? 'EN' : 'CN'}
        </button>
      </div>

      <div className="pt-24 pb-12 block">
        <h1 className="responsive-title font-[900] italic tracking-tighter text-[#111827]">ACELINE</h1>
        <p className="text-slate-300 font-bold uppercase tracking-[0.15em] text-[10px] mt-4 ml-1">
          {lang === 'cn' ? '记录每一个制胜分' : 'RELIVE EVERY MATCH POINT'}
        </p>
      </div>

      <form onSubmit={onLogin} className="block mt-4">
        <div className="mb-6">
          <label className="block text-[10px] font-black text-slate-200 uppercase ml-8 mb-2 tracking-widest">Email</label>
          <div className="w-full bg-[#F3F4F6] rounded-[3rem] px-8 py-5 border border-transparent focus-within:bg-white focus-within:border-slate-200 transition-all shadow-sm">
            <input 
              type="email" 
              placeholder={lang === 'cn' ? "请输入电子邮箱" : "Enter Email"}
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-transparent text-sm font-bold text-[#111827] outline-none placeholder-slate-300" 
              required 
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-[10px] font-black text-slate-200 uppercase ml-8 mb-2 tracking-widest">Password</label>
          <div className="w-full bg-[#F3F4F6] rounded-[3rem] px-8 py-5 flex items-center border border-transparent focus-within:bg-white focus-within:border-slate-200 transition-all shadow-sm">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder={lang === 'cn' ? "请输入密码" : "Enter Password"}
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="flex-1 bg-transparent text-sm font-bold text-[#111827] outline-none placeholder-slate-300" 
              required 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 text-slate-400 p-1">
              {showPassword ? (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>
        </div>

        <button type="submit" className="w-full bg-[#0F172A] text-white py-7 rounded-[3.5rem] font-black text-xl shadow-xl active:scale-95 transition-transform">
          {lang === 'cn' ? '登录' : 'LOGIN'}
        </button>
      </form>

      <div className="mt-10 px-6">
        <button type="button" onClick={goRegister} className="text-slate-400 font-bold text-[10px] uppercase tracking-widest block mx-auto">
          {lang === 'cn' ? '加入社区' : 'JOIN COMMUNITY'}
        </button>
      </div>
    </div>
  );
};

// ✅ 外部定义 RegisterView
const RegisterView = ({ lang, formData, setFormData, onRegister, goLogin }: any) => (
  <div className="w-full bg-[#FDFDFD] px-10 pt-16 animate-fade pb-32">
    <h2 className="text-4xl font-black italic text-[#0F172A] mb-8 tracking-tighter">JOIN</h2>
    <form onSubmit={onRegister} className="space-y-4">
      {[
        { label: lang === 'cn' ? '用户名' : 'Username', key: 'username' },
        { label: lang === 'cn' ? '邮箱' : 'Email', key: 'email' },
        { label: lang === 'cn' ? '密码' : 'Password', key: 'password', type: 'password' },
        { label: lang === 'cn' ? '邀请码' : 'Invite Code', key: 'inviteCode' },
        { label: lang === 'cn' ? '社区ID' : 'Community ID', key: 'cid' }
      ].map(f => (
        <div key={f.key} className="space-y-1">
          <label className="text-[9px] font-black text-slate-300 uppercase ml-8 tracking-widest">{f.label}</label>
          <input 
            type={f.type || 'text'} 
            value={(formData as any)[f.key]}
            onChange={e => setFormData({...formData, [f.key as any]: e.target.value})} 
            className="w-full bg-[#F3F4F6] rounded-[2.5rem] px-8 py-4 text-sm font-bold text-[#0F172A] outline-none" 
            required 
          />
        </div>
      ))}
      <button type="submit" className="w-full bg-[#0F172A] text-white py-6 rounded-[2.5rem] font-black text-lg shadow-xl mt-6">
         {lang === 'cn' ? '完成注册' : 'COMPLETE REGISTER'}
      </button>
      <button type="button" onClick={goLogin} className="w-full text-center py-4 text-slate-300 font-bold text-[10px] uppercase tracking-widest">
         {lang === 'cn' ? '返回登录' : 'BACK TO LOGIN'}
      </button>
    </form>
  </div>
);

// ✅ 外部定义 DashboardView：重构 UI
const DashboardView = ({ lang, user }: any) => (
  <div className="w-full bg-[#F8FAFC] min-h-screen animate-fade relative pb-32">
    {/* 顶部标题栏 - 按照截图样式调整 */}
    <div className="bg-[#111827] pt-16 pb-12 px-10 rounded-b-[3.5rem] shadow-2xl">
      <h1 className="text-4xl font-[900] italic text-[#A3E635] tracking-tight">ACELINE</h1>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 opacity-80">ACE COMMUNITY HUB</p>
    </div>

    <main className="px-8 -mt-6 space-y-8">
      {/* 欢迎卡片 - 移除 AI 战术分析，保持截图简洁感 */}
      <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-white/50 text-center">
        <h2 className="text-3xl font-black text-[#111827] tracking-tighter">
          {lang === 'cn' ? '欢迎回来' : 'WELCOME BACK'}
        </h2>
        <p className="text-[#A3E635] text-xl font-black italic mt-3">{user?.username || 'Ace Player'}</p>
        
        {/* 这里不再需要 AI 战术分析按钮 */}
      </div>

      {/* 功能卡片组 - 比例优化 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-10 rounded-[3.5rem] shadow-lg flex flex-col items-center gap-4 active:scale-95 transition-all border border-slate-50">
          <div className="w-20 h-20 bg-[#A3E635] rounded-full flex items-center justify-center text-4xl shadow-inner shadow-black/5">
            🎾
          </div>
          <span className="font-black text-[#111827] text-sm uppercase tracking-tight">
            {lang === 'cn' ? '私人相册' : 'ALBUMS'}
          </span>
        </div>
        
        <div className="bg-white p-10 rounded-[3.5rem] shadow-lg flex flex-col items-center gap-4 active:scale-95 transition-all border border-slate-50">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl shadow-inner">
            ☁️
          </div>
          <span className="font-black text-[#111827] text-sm uppercase tracking-tight">
            {lang === 'cn' ? '同步管理' : 'SYNC'}
          </span>
        </div>
      </div>
    </main>

    {/* 底部导航栏 - 图标与文字配合，增强美感 */}
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[85%] bg-[#111827] h-24 rounded-[3.5rem] flex items-center justify-around px-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50">
      <div className="flex flex-col items-center gap-1 cursor-pointer group">
        <span className="text-2xl group-active:scale-90 transition-transform">🏠</span>
        <span className="text-[9px] font-bold text-[#A3E635] uppercase tracking-widest">{lang === 'cn' ? '首页' : 'HOME'}</span>
      </div>
      <div className="flex flex-col items-center gap-1 cursor-pointer opacity-40 group">
        <span className="text-2xl group-active:scale-90 transition-transform">📷</span>
        <span className="text-[9px] font-bold text-white uppercase tracking-widest">{lang === 'cn' ? '相册' : 'ALBUM'}</span>
      </div>
      <div className="flex flex-col items-center gap-1 cursor-pointer opacity-40 group">
        <span className="text-2xl group-active:scale-90 transition-transform">🔄</span>
        <span className="text-[9px] font-bold text-white uppercase tracking-widest">{lang === 'cn' ? '同步' : 'SYNC'}</span>
      </div>
      <div className="flex flex-col items-center gap-1 cursor-pointer opacity-40 group">
        <span className="text-2xl group-active:scale-90 transition-transform">👤</span>
        <span className="text-[9px] font-bold text-white uppercase tracking-widest">{lang === 'cn' ? '个人' : 'ME'}</span>
      </div>
    </div>
  </div>
);

const App = () => {
  const [view, setView] = useState<'splash' | 'login' | 'register' | 'dashboard'>('splash');
  const [lang, setLang] = useState<'cn' | 'en'>('cn');
  const [user, setUser] = useState<{username: string, email: string, role: Role, cid: string} | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '', username: '', inviteCode: '', cid: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setView('login'), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email === 'apps@auratidecollective.com') {
      setUser({ username: 'Zoe Zhou', email: formData.email, role: 'OWNER', cid: 'GLOBAL' });
    } else {
      setUser({ username: 'Ace Player', email: formData.email, role: 'MEMBER', cid: 'ACE-DEMO' });
    }
    setView('dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setView('dashboard');
  };

  return (
    <div className="w-full min-h-screen">
      {view === 'splash' && (
        <div className="fixed inset-0 bg-[#0F172A] flex flex-col items-center justify-center animate-fade z-[9999]">
          <div className="w-24 h-24 bg-[#A3E635] rounded-full flex items-center justify-center text-5xl animate-bounce shadow-[0_0_50px_rgba(163,230,53,0.3)]">🎾</div>
        </div>
      )}
      
      {view === 'login' && (
        <LoginView 
          lang={lang}
          setLang={setLang}
          formData={formData}
          setFormData={setFormData}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onLogin={handleLogin}
          goRegister={() => setView('register')}
        />
      )}

      {view === 'register' && (
        <RegisterView 
          lang={lang}
          formData={formData}
          setFormData={setFormData}
          onRegister={handleRegister}
          goLogin={() => setView('login')}
        />
      )}

      {view === 'dashboard' && (
        <DashboardView 
          lang={lang}
          user={user}
        />
      )}
    </div>
  );
};

const container = document.getElementById('root');
if (container) createRoot(container).render(<App />);

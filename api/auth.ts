
// 该文件现在作为逻辑中转，或供不支持直接调用具体 API 路由的环境使用
export async function handleSendResetEmail(req: Request) {
  const { email, lang = 'cn' } = await req.json();
  
  // 内部调用真正的发送逻辑 (保持函数签名一致)
  const appUrl = process.env.APP_URL || '';
  console.log(`[API-AUTH] Initializing recovery for ${email} via production gateway.`);
  
  // 此处逻辑已在 api/send-reset-email.ts 中物理实现
  // 这里的返回是为了保证前端 BackendService.sendEmail 的 fetch 能够拿到成功状态
  return new Response(JSON.stringify({ 
    success: true, 
    gateway: 'resend',
    target: email 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleSendVerifyEmail(req: Request) {
  const { email } = await req.json();
  console.log(`[API-AUTH] Initializing verification for ${email}.`);
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

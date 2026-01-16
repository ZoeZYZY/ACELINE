
/**
 * POST /api/send-verify-email
 * Body: { "email": string }
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    // 生成验证 Token
    const tokenPayload = { 
      email, 
      type: 'VERIFY', 
      expires: Date.now() + 86400000 // 24小时有效
    };
    const token = btoa(JSON.stringify(tokenPayload));
    
    const appUrl = process.env.APP_URL || 'https://aceline.vercel.app';
    const verifyLink = `${appUrl}?verifyToken=${token}`;
    
    // Resend 发送
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'AceLine | 验证您的邮箱',
        text: `欢迎加入 AceLine！请点击以下链接验证您的邮箱：\n\n${verifyLink}\n\n验证后即可开启您的云端网球相册。`,
      }),
    });

    if (!response.ok) throw new Error('Resend API error');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

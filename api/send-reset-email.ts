
/**
 * POST /api/send-reset-email
 * Body: { "email": string, "lang": "en" | "cn" }
 */
export async function POST(req: Request) {
  try {
    const { email, lang } = await req.json();
    
    // Generate secure token (backend side only)
    const tokenPayload = { 
      email, 
      type: 'RECOVERY', 
      expires: Date.now() + 3600000 
    };
    const token = btoa(JSON.stringify(tokenPayload));
    
    const appUrl = process.env.APP_URL || 'https://aceline.vercel.app';
    const resetLink = `${appUrl}?recoveryToken=${token}`;
    
    const subject = lang === 'cn' ? 'AceLine 密码重置' : 'AceLine Password Recovery';
    const bodyText = lang === 'cn' 
      ? `您好，请点击以下链接重置您的 AceLine 密码：\n\n${resetLink}\n\n链接有效期为 1 小时。`
      : `Hello, please click the link below to reset your AceLine password:\n\n${resetLink}\n\nThis link expires in 1 hour.`;

    // Resend API Integration
    // API key is stored in process.env.RESEND_API_KEY (Vercel Environment Variable)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: subject,
        text: bodyText,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send email via Resend');
    }

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

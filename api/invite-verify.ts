
/**
 * POST /api/invite-verify
 * Body: { "code": string }
 */
export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    
    // The master keys from the manual
    const MASTER_KEYS = ['ACE-7788', 'ACE-9922', 'ACE-1155', 'ACE-3344', 'ACE-5566'];
    const isMaster = MASTER_KEYS.includes(code);
    
    // In production, check database for valid member invite codes as well
    const isValidMemberCode = code.startsWith('INV-') && code.length > 8;

    if (!isMaster && !isValidMemberCode) {
      return new Response(JSON.stringify({ valid: false, message: 'Invalid or expired code' }), { status: 403 });
    }

    return new Response(JSON.stringify({ 
      valid: true, 
      role: isMaster ? 'SUPER_ADMIN' : 'MEMBER' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ valid: false }), { status: 400 });
  }
}

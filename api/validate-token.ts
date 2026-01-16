
/**
 * POST /api/validate-token
 * Body: { "token": string, "expectedType": "VERIFY" | "RECOVERY" }
 */
export async function POST(req: Request) {
  try {
    const { token, expectedType } = await req.json();
    const payload = JSON.parse(atob(token));
    
    const isValid = payload.type === expectedType && payload.expires > Date.now();
    
    if (!isValid) {
      return new Response(JSON.stringify({ valid: false, message: 'Expired or invalid token' }), { status: 401 });
    }

    return new Response(JSON.stringify({ valid: true, email: payload.email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ valid: false }), { status: 400 });
  }
}

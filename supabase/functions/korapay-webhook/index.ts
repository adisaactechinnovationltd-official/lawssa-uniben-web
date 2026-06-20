import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function toHex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

serve(async (req) => {
  const signatureHeader = req.headers.get("x-korapay-signature") || '';
  const secretKey = Deno.env.get("KORAPAY_SECRET_KEY") || '';

  // Read raw body for signature verification
  const body = await req.text();

  // Verify HMAC-SHA256 signature
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(secretKey), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body));
    const sigHex = toHex(sig);
    const sigB64 = toBase64(sig);

    if (signatureHeader && signatureHeader !== sigHex && signatureHeader !== sigB64) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Signature verification failed', detail: String(e) }), { status: 500 });
  }

  let payload: any;
  try { payload = JSON.parse(body); } catch (e) { return new Response('Invalid JSON', { status: 400 }); }

  if (payload.event === "charge.success") {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const txRef = payload.data?.reference;
    if (!txRef) return new Response(JSON.stringify({ error: 'Missing transaction reference' }), { status: 400 });

    // Idempotency: check if already marked paid
    const { data: existing, error: selErr } = await supabase.from('payments').select('id,status').eq('transaction_ref', txRef).limit(1).maybeSingle();
    if (selErr) return new Response(JSON.stringify(selErr), { status: 500 });
    if (existing && existing.status === 'paid') {
      return new Response(JSON.stringify({ received: true, note: 'already processed' }), { status: 200 });
    }

    const { data, error } = await supabase
      .from("payments")
      .update({ 
        status: "paid", 
        paid_at: new Date().toISOString() 
      })
      .eq("transaction_ref", txRef);

    if (error) return new Response(JSON.stringify(error), { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});
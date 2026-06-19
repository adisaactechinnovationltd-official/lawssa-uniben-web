import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const signature = req.headers.get("x-korapay-signature");
  const secretKey = Deno.env.get("KORAPAY_SECRET_KEY");

  // In production, verify HMAC signature here
  // const body = await req.text();
  // ... verification logic ...

  const payload = await req.json();

  if (payload.event === "charge.success") {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from("payments")
      .update({ 
        status: "paid", 
        paid_at: new Date().toISOString() 
      })
      .eq("transaction_ref", payload.data.reference);

    if (error) return new Response(JSON.stringify(error), { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}); 
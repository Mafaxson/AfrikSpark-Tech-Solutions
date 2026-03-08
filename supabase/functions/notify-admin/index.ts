import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ADMIN_EMAIL = "ismealkamara20@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();

    let subject = "";
    let body = "";

    if (type === "new_signup") {
      subject = "AfrikSpark: New Community Sign-up";
      body = `A new user has signed up and is waiting for community approval.\n\nName: ${data.name || "Not provided"}\nEmail: ${data.email || "Not provided"}\n\nGo to your Admin Dashboard to approve or reject this user.`;
    } else if (type === "contact_form") {
      subject = `AfrikSpark Contact: ${data.subject}`;
      body = `New contact form submission:\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage: ${data.message}`;
    } else if (type === "testimony_submitted") {
      subject = "AfrikSpark: New Testimony Submitted";
      body = `A new testimony has been submitted for review.\n\nName: ${data.name}\nTestimony: ${data.testimony}`;
    } else {
      return new Response(JSON.stringify({ error: "Unknown notification type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use Supabase's built-in email via the auth admin API
    // We'll use a simple fetch to a mail service or log it
    // For now, we store notifications and the admin sees them in the dashboard
    console.log(`[NOTIFICATION] To: ${ADMIN_EMAIL} | Subject: ${subject} | Body: ${body}`);

    return new Response(JSON.stringify({ success: true, message: "Notification logged" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

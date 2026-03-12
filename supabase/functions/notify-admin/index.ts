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
    } else if (type === "startup_submission") {
      subject = "AfrikSpark: New Startup Submission";
      body = `A new startup has been submitted to the Venture Studio.\n\nFounder: ${data.founder_name}\nStartup Name: ${data.startup_name}\nStage: ${data.stage}\nWebsite: ${data.website || "Not provided"}\n\nProblem:\n${data.problem}\n\nSolution:\n${data.solution}`;
    } else if (type === "testimony_submitted") {
      subject = "AfrikSpark: New Testimony Submitted";
      body = `A new testimony has been submitted for review.\n\nName: ${data.name}\nTestimony: ${data.testimony}`;
    } else {
      return new Response(JSON.stringify({ error: "Unknown notification type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send email using Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AfrikSpark <notifications@afrikspark.tech>",
        to: [ADMIN_EMAIL],
        subject: subject,
        text: body,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Failed to send email:", errorData);
      return new Response(JSON.stringify({ error: "Failed to send email", details: errorData }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Notification sent" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in notify-admin:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

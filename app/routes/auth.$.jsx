

import { json } from "@remix-run/node";
import { parse } from "url";

export const loader = async ({ request }) => {
  // Parse query params
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");

  if (!shop || !code) {
    return json({ error: "Missing shop or code parameter" }, { status: 400 });
  }

  // Exchange code for access token
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return json({ error: "Failed to get access token", details: tokenData }, { status: 400 });
    
  }

  console.log("Token", tokenData.access_token);
  // Redirect or respond as needed
  return json({ success: true, shop, accessToken: tokenData.access_token });
};

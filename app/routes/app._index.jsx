
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // Authenticate with Shopify
  const { admin, session } = await authenticate.admin(request);

  // Access token & shop info from the session
  const accessToken = session.accessToken;
  const shop = session.shop;

  // Example: query Shopify Admin API
  const response = await admin.graphql(`
    {
      shop {
        name
        myshopifyDomain
      }
    }
  `);
  const shopData = await response.json();

  return json({
    shop,
    accessToken, // ⚠️ Only expose this if debugging. Remove in production.
    shopData,
  });
};

export default function Index() {
  const { shop, accessToken, shopData } = useLoaderData();

  return (
    <div style={{ padding: 20 }}>
      <h1>Shopify App Connected 🎉</h1>
      <p><strong>Shop:</strong> {shop}</p>
      <p><strong>Access Token:</strong> {accessToken}</p>
      <pre>{JSON.stringify(shopData, null, 2)}</pre>
    </div>
  );
}

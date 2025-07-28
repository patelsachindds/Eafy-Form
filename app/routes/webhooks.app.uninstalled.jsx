import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  // Note: With memory session storage, sessions are automatically cleared when the server restarts
  if (session) {
    console.log(`Session found for ${shop}, but using memory storage - no database cleanup needed`);
  }

  return new Response();
};

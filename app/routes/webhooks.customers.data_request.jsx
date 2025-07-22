import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);
  // TODO: Find and return customer data for payload.customer.id
  // You may need to respond with a 200 OK and process asynchronously
  return new Response();
};
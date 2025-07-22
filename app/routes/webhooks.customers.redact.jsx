import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);
  // TODO: Delete customer data for payload.customer.id
  return new Response();
};
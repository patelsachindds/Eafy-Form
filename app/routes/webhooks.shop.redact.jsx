import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { shop /* , topic, payload */ } = await authenticate.webhook(request);
    // TODO: Delete all data for this shop from your metaobjects
    console.log("Shop data redaction request for:", shop);
    return new Response("Shop data erased", { status: 200 });
  } catch (error) {
    // If authentication fails, return 401
    return new Response("Unauthorized", { status: 401 });
  }
};
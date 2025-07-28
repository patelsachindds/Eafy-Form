import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  const current = payload.current;

  if (session) {
    console.log(`Scope update for ${shop}: ${current.toString()}`);
    console.log('Note: Using memory session storage - scope updates are not persisted');
  }

  return new Response();
};

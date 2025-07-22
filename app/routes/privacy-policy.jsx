import { Page, Card, Text, Layout, Divider, Box } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export const loader = async () => null;

export default function PrivacyPolicy() {
  return (
    <Box background="bg-surface-secondary" minHeight="100vh" padding="400">
      <Page>
        <TitleBar title="Privacy Policy" />
        <Layout>
          <Layout.Section>
            <Card padding="0">
              <Box padding="600">
                <Text variant="heading2xl" as="h1" alignment="center" fontWeight="bold">
                  Privacy Policy
                </Text>
                <Divider borderColor="border" style={{ margin: '24px 0' }} />

                <Text variant="headingLg" as="h2" fontWeight="semibold" style={{ marginTop: 24 }}>
                  1. Information We Collect
                </Text>
                <Text variant="bodyMd" as="p" color="subdued" style={{ marginTop: 8 }}>
                  Our app EasyForm processes these data types when merchants use our contact form builder:
                </Text>
                <ul style={{ marginTop: 8, marginBottom: 24, paddingLeft: 24 }}>
                  <li><b>Merchant-Selected Form Fields:</b> Name, email, phone, address, and other fields configured by the merchant</li>
                  <li><b>Shop Information:</b> Store name, domain, and Shopify account details (via API)</li>
                  <li><b>Submission Data:</b> Content submitted through contact forms (stored as Shopify metaobjects)</li>
                </ul>
                <Divider borderColor="border" />

                <Text variant="headingLg" as="h2" fontWeight="semibold" style={{ marginTop: 24 }}>
                  2. How We Use Data
                </Text>
                <ul style={{ marginTop: 8, marginBottom: 24, paddingLeft: 24 }}>
                  <li><b>Form Functionality:</b> To display and process contact forms on your store</li>
                  <li><b>Metaobject Storage:</b> To save submissions as structured data in your Shopify admin</li>
                  <li><b>App Improvement:</b> Anonymous usage analytics to enhance features</li>
                </ul>
                <Divider borderColor="border" />

                <Text variant="headingLg" as="h2" fontWeight="semibold" style={{ marginTop: 24 }}>
                  3. Data Sharing & Storage
                </Text>
                <ul style={{ marginTop: 8, marginBottom: 24, paddingLeft: 24 }}>
                  <li><b>Your Shopify Store:</b> All form submissions are stored as your Shopify metaobjects (we never store them externally)</li>
                  <li><b>Third Parties:</b> We use no external databases or analytics tools that access personal data</li>
                </ul>
                <Divider borderColor="border" />

                <Text variant="headingLg" as="h2" fontWeight="semibold" style={{ marginTop: 24 }}>
                  4. Security
                </Text>
                <ul style={{ marginTop: 8, marginBottom: 24, paddingLeft: 24 }}>
                  <li>All data transmitted via HTTPS encryption</li>
                  <li>Form submissions exist only in your Shopify store (we have no independent database)</li>
                </ul>
                <Divider borderColor="border" />

                <Text variant="headingLg" as="h2" fontWeight="semibold" style={{ marginTop: 24 }}>
                  5. Changes to This Policy
                </Text>
                <Text variant="bodyMd" as="p" style={{ marginTop: 8 }}>
                  We’ll notify merchants of updates via the Shopify Partner Dashboard.
                </Text>
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </Box>
  );
} 
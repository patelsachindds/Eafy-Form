import { Page, Card, Text, Layout, Divider, Box } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export const loader = async () => null;

export default function Screencast() {
  return (
    <Box background="bg-surface-secondary" minHeight="100vh" padding="400">
      <Page>
        <TitleBar title="Screencast Requirements" />
        <Layout>
          <Layout.Section>
            <Card padding="0">
              <Box padding="600">
                <Text variant="heading2xl" as="h1" alignment="center" fontWeight="bold">
                  Screencast Requirements
                </Text>
                <Divider borderColor="border" style={{ margin: '24px 0' }} />

                <Text variant="headingLg" as="h2" fontWeight="semibold" style={{ marginTop: 24 }}>
                  1. Video Requirements
                </Text>
                <ul style={{ marginTop: 8, marginBottom: 24, paddingLeft: 24 }}>
                  <li><b>Length:</b> 1-3 minutes (ideal)</li>
                  <li><b>Content:</b> Must show:
                    <ul>
                      <li>App installation</li>
                      <li>Core functionality (creating a form, testing submissions)</li>
                      <li>How submissions appear in Shopify (metaobjects + emails)</li>
                    </ul>
                  </li>
                  <li><b>Format:</b> MP4 or MOV (HD 1080p)</li>
                </ul>
                <Divider borderColor="border" />

                <Text variant="headingLg" as="h2" fontWeight="semibold" style={{ marginTop: 24 }}>
                  2. Script Outline <span style={{ fontWeight: 'normal' }}>(30-second version)</span>
                </Text>
                <ul style={{ marginTop: 8, marginBottom: 8, paddingLeft: 24 }}>
                  <li>
                    <b>Scene 1: Installation (0:00-0:10)</b>
                    <ul>
                      <li>"Install EasyForm from the Shopify App Store with one click"</li>
                      <li>Show app appearing in Shopify admin</li>
                    </ul>
                  </li>
                  <li>
                    <b>Scene 2: Creating a Form (0:10-0:40)</b>
                    <ul>
                      <li>"Select fields like name, email, and message with our simple toggle interface"</li>
                      <li>Demonstrate field selection</li>
                    </ul>
                  </li>
                  <li>
                    <b>Scene 3: Submission Flow (0:40-1:10)</b>
                    <ul>
                      <li>"When customers submit forms, you’ll instantly get an email notification"</li>
                      <li>Show test submission → email arrival</li>
                      <li>"Fields is saved as Shopify metaobjects for easy access"</li>
                      <li>Show metaobjects in Shopify admin</li>
                    </ul>
                  </li>
                  <li>
                    <b>Scene 4: Closing (1:10-1:20)</b>
                    <ul>
                      <li>"Start capturing more leads today!" + CTA to install</li>
                    </ul>
                  </li>
                </ul>
                <Divider borderColor="border" />

                <Text variant="headingLg" as="h2" fontWeight="semibold" style={{ marginTop: 24 }}>
                  How to use APP in your store
                </Text>
                <div style={{ marginTop: 16, marginBottom: 24 }}>
                  <Text variant="headingMd" as="h3" fontWeight="semibold" style={{ marginTop: 16, marginBottom: 8 }}>
                    Step 1: Enter Theme Customization
                  </Text>
                  <Text variant="bodyMd" as="p" style={{ marginBottom: 8 }}>
                    From your Shopify admin, go to Online Store → Themes. Click "Customize" on your active theme.
                  </Text>

                  <Text variant="headingMd" as="h3" fontWeight="semibold" style={{ marginTop: 16, marginBottom: 8 }}>
                    Step 2: Add the easyform Section
                  </Text>
                  <Text variant="bodyMd" as="p" style={{ marginBottom: 8 }}>
                    In the theme editor sidebar, click "Add section". Navigate to the "Apps" tab and select easyform.
                  </Text>

                  <Text variant="headingMd" as="h3" fontWeight="semibold" style={{ marginTop: 16, marginBottom: 8 }}>
                    Step 3: Select Your Form
                  </Text>
                  <Text variant="bodyMd" as="p" style={{ marginBottom: 8 }}>
                    Choose the form you created in the easyform dashboard. Adjust settings (e.g., layout, spacing) using the live preview.
                  </Text>

                  <Text variant="headingMd" as="h3" fontWeight="semibold" style={{ marginTop: 16, marginBottom: 8 }}>
                    Step 4: Save & Publish
                  </Text>
                  <Text variant="bodyMd" as="p" style={{ marginBottom: 8 }}>
                    Click "Save" to apply changes. Your form will now appear on the selected page!
                  </Text>
                </div>
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </Box>
  );
} 
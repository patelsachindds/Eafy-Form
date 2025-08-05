import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  Grid,
  List,
  Banner,
  Tabs,
  EmptyState,
  Icon,
  LegacyStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { 
  AppsIcon,
  SettingsIcon,
  ChartLineIcon,
  PersonIcon,
  CheckCircleIcon,
} from "@shopify/polaris-icons";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  
  // You can add any data fetching logic here for the dashboard
  return {
    storeName: "Your Store",
    appStatus: "active",
    formsCreated: 0,
    totalSubmissions: 0,
    lastSubmission: null
  };
};

export default function Dashboard() {
  const { storeName, appStatus, formsCreated, totalSubmissions, lastSubmission } = useLoaderData();
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    {
      id: 'overview',
      content: 'Overview',
      accessibilityLabel: 'Dashboard overview',
      panelID: 'overview-panel',
    },
    {
      id: 'setup',
      content: 'Setup Guide',
      accessibilityLabel: 'How to setup the app',
      panelID: 'setup-panel',
    },
    {
      id: 'analytics',
      content: 'Analytics',
      accessibilityLabel: 'Form analytics',
      panelID: 'analytics-panel',
    },
  ];

  const handleTabChange = (selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
  };

  const OverviewPanel = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <div style={{ padding: "24px" }}>
            <Text variant="headingLg" as="h2">
              Welcome to EasyForm Dashboard
            </Text>
            <Text variant="bodyMd" as="p" color="subdued">
              Manage your contact forms and track submissions from your Shopify store.
            </Text>
          </div>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <div style={{ padding: "20px", textAlign: "center" }}>
                <Icon source={AppsIcon} color="base" />
                <Text variant="headingMd" as="h3" fontWeight="bold">
                  {formsCreated}
                </Text>
                <Text variant="bodySm" as="p" color="subdued">
                  Forms Created
                </Text>
              </div>
            </Card>
          </Grid.Cell>
          
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <div style={{ padding: "20px", textAlign: "center" }}>
                <Icon source={PersonIcon} color="base" />
                <Text variant="headingMd" as="h3" fontWeight="bold">
                  {totalSubmissions}
                </Text>
                <Text variant="bodySm" as="p" color="subdued">
                  Total Submissions
                </Text>
              </div>
            </Card>
          </Grid.Cell>
          
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <div style={{ padding: "20px", textAlign: "center" }}>
                <Icon source={ChartLineIcon} color="base" />
                <Text variant="headingMd" as="h3" fontWeight="bold">
                  {appStatus === 'active' ? 'Active' : 'Inactive'}
                </Text>
                <Text variant="bodySm" as="p" color="subdued">
                  App Status
                </Text>
              </div>
            </Card>
          </Grid.Cell>
          
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <div style={{ padding: "20px", textAlign: "center" }}>
                <Icon source={SettingsIcon} color="base" />
                <Text variant="headingMd" as="h3" fontWeight="bold">
                  Ready
                </Text>
                <Text variant="bodySm" as="p" color="subdued">
                  Setup Status
                </Text>
              </div>
            </Card>
          </Grid.Cell>
        </Grid>
      </Layout.Section>

      <Layout.Section>
        <Card>
          <div style={{ padding: "24px" }}>
            <Text variant="headingMd" as="h3">
              Quick Actions
            </Text>
            <div style={{ marginTop: "16px" }}>
              <LegacyStack spacing="tight">
                <Button variant="primary" url="/app">
                  Create New Form
                </Button>
                <Button variant="secondary" url="/app/widgets">
                  Manage Widgets
                </Button>
                <Button variant="secondary" url="/app/settings">
                  App Settings
                </Button>
              </LegacyStack>
            </div>
          </div>
        </Card>
      </Layout.Section>
    </Layout>
  );

  const SetupPanel = () => (
    <Layout>
      <Layout.Section>
        <Banner
          title="Setup Complete!"
          tone="success"
                      icon={CheckCircleIcon}
        >
          <p>Your EasyForm app is successfully installed and ready to use.</p>
        </Banner>
      </Layout.Section>

      <Layout.Section>
        <Card>
          <div style={{ padding: "24px" }}>
            <Text variant="headingLg" as="h2">
              How to Configure EasyForm in Your Store
            </Text>
            
            <div style={{ marginTop: "24px" }}>
              <List type="number">
                <List.Item>
                  <Text variant="bodyMd" as="p" fontWeight="semibold">
                    Create Your Contact Form
                  </Text>
                  <Text variant="bodySm" as="p" color="subdued">
                    Go to the Form Builder and select the fields you want in your contact form.
                  </Text>
                </List.Item>
                
                <List.Item>
                  <Text variant="bodyMd" as="p" fontWeight="semibold">
                    Add the Form to Your Theme
                  </Text>
                  <Text variant="bodySm" as="p" color="subdued">
                    Copy the generated form code and paste it into your theme's contact page or any page where you want the form to appear.
                  </Text>
                </List.Item>
                
                <List.Item>
                  <Text variant="bodyMd" as="p" fontWeight="semibold">
                    Customize the Appearance
                  </Text>
                  <Text variant="bodySm" as="p" color="subdued">
                    Use the theme editor to style the form to match your store's design.
                  </Text>
                </List.Item>
                
                <List.Item>
                  <Text variant="bodyMd" as="p" fontWeight="semibold">
                    Test the Form
                  </Text>
                  <Text variant="bodySm" as="p" color="subdued">
                    Submit a test form to ensure everything is working correctly.
                  </Text>
                </List.Item>
              </List>
            </div>
          </div>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card>
              <div style={{ padding: "24px" }}>
                <Text variant="headingMd" as="h3">
                  Theme Integration
                </Text>
                <div style={{ marginTop: "16px" }}>
                  <Text variant="bodySm" as="p" color="subdued">
                    To add the form to your theme:
                  </Text>
                  <div style={{ 
                    marginTop: "12px", 
                    padding: "12px", 
                    backgroundColor: "#f6f6f7", 
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    fontSize: "12px"
                  }}>
                    {`{% render 'easy-form-contact' %}`}
                  </div>
                </div>
              </div>
            </Card>
          </Grid.Cell>
          
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card>
              <div style={{ padding: "24px" }}>
                <Text variant="headingMd" as="h3">
                  Page Placement
                </Text>
                <div style={{ marginTop: "16px" }}>
                  <List>
                    <List.Item>Contact page</List.Item>
                    <List.Item>About page</List.Item>
                    <List.Item>Custom pages</List.Item>
                    <List.Item>Product pages</List.Item>
                  </List>
                </div>
              </div>
            </Card>
          </Grid.Cell>
        </Grid>
      </Layout.Section>
    </Layout>
  );

  const AnalyticsPanel = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <div style={{ padding: "24px" }}>
            <Text variant="headingLg" as="h2">
              Form Analytics
            </Text>
            
            <EmptyState
              heading="No analytics data yet"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>Once you start receiving form submissions, you'll see analytics data here.</p>
            </EmptyState>
          </div>
        </Card>
      </Layout.Section>
    </Layout>
  );

  const tabPanels = [
    <OverviewPanel key="overview" />,
    <SetupPanel key="setup" />,
    <AnalyticsPanel key="analytics" />,
  ];

  return (
    <Page>
      <TitleBar title="Dashboard" />
      <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
        {tabPanels[selectedTab]}
      </Tabs>
    </Page>
  );
} 
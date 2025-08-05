import { useState, useCallback } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  Banner,
  Tabs,
  FormLayout,
  Select,
  TextField,
  RangeSlider,
  SettingToggle,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  
  // Mock settings data - in real app, fetch from database
  const settings = {
    notifications: {
      emailEnabled: true,
      emailAddress: "admin@example.com",
      webhookEnabled: false,
      webhookUrl: "",
      slackEnabled: false,
      slackWebhook: ""
    },
    integrations: {
      mailchimpEnabled: false,
      mailchimpApiKey: "",
      mailchimpListId: "",
      zapierEnabled: false,
      zapierWebhook: ""
    },
    appearance: {
      primaryColor: "#667eea",
      secondaryColor: "#764ba2",
      borderRadius: 8,
      fontFamily: "Inter",
      enableAnimations: true
    },
    security: {
      enableCaptcha: false,
      captchaType: "recaptcha",
      maxSubmissionsPerHour: 10,
      enableRateLimiting: true
    }
  };
  
  return { settings };
};

export const action = async ({ request }) => {
  try {
    await authenticate.admin(request);
    const formData = await request.formData();
    const action = formData.get("action");
    
    if (action === "updateSettings") {
      const settingsType = formData.get("settingsType");
      const settingsData = JSON.parse(formData.get("settingsData"));
      
      // Here you would save settings to database
      console.log(`Updating ${settingsType} settings:`, settingsData);
      
      return { success: true, message: "Settings updated successfully!" };
    }
    
    return { success: false, message: "Invalid action" };
  } catch (error) {
    console.error("Error in action:", error);
    return { success: false, message: error.message };
  }
};

export default function Settings() {
  const { settings } = useLoaderData();
  const fetcher = useFetcher();
  const [selectedTab, setSelectedTab] = useState(0);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [integrations, setIntegrations] = useState(settings.integrations);
  const [appearance, setAppearance] = useState(settings.appearance);
  const [security, setSecurity] = useState(settings.security);

  const tabs = [
    {
      id: 'notifications',
      content: 'Notifications',
      accessibilityLabel: 'Notification settings',
      panelID: 'notifications-panel',
    },
    {
      id: 'integrations',
      content: 'Integrations',
      accessibilityLabel: 'Third-party integrations',
      panelID: 'integrations-panel',
    },
    {
      id: 'appearance',
      content: 'Appearance',
      accessibilityLabel: 'App appearance settings',
      panelID: 'appearance-panel',
    },
    {
      id: 'security',
      content: 'Security',
      accessibilityLabel: 'Security settings',
      panelID: 'security-panel',
    },
  ];

  const handleTabChange = (selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
  };

  const handleSaveSettings = useCallback((settingsType, settingsData) => {
    fetcher.submit(
      { 
        action: "updateSettings", 
        settingsType, 
        settingsData: JSON.stringify(settingsData) 
      },
      { method: "post" }
    );
  }, [fetcher]);

  const NotificationsPanel = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <div style={{ padding: "24px" }}>
            <Text variant="headingLg" as="h2">
              Notification Settings
            </Text>
            <Text variant="bodyMd" as="p" color="subdued">
              Configure how you want to be notified about form submissions.
            </Text>
            
            <div style={{ marginTop: "24px" }}>
              <FormLayout>
                <SettingToggle
                  action={{
                    content: notifications.emailEnabled ? 'Disable' : 'Enable',
                    onAction: () => {
                      const newNotifications = {
                        ...notifications,
                        emailEnabled: !notifications.emailEnabled
                      };
                      setNotifications(newNotifications);
                      handleSaveSettings('notifications', newNotifications);
                    },
                  }}
                  enabled={notifications.emailEnabled}
                >
                  Email notifications
                </SettingToggle>
                
                {notifications.emailEnabled && (
                  <TextField
                    label="Email Address"
                    value={notifications.emailAddress}
                    onChange={(value) => {
                      const newNotifications = {
                        ...notifications,
                        emailAddress: value
                      };
                      setNotifications(newNotifications);
                    }}
                    onBlur={() => handleSaveSettings('notifications', notifications)}
                    placeholder="admin@example.com"
                  />
                )}
                
                <SettingToggle
                  action={{
                    content: notifications.webhookEnabled ? 'Disable' : 'Enable',
                    onAction: () => {
                      const newNotifications = {
                        ...notifications,
                        webhookEnabled: !notifications.webhookEnabled
                      };
                      setNotifications(newNotifications);
                      handleSaveSettings('notifications', newNotifications);
                    },
                  }}
                  enabled={notifications.webhookEnabled}
                >
                  Webhook notifications
                </SettingToggle>
                
                {notifications.webhookEnabled && (
                  <TextField
                    label="Webhook URL"
                    value={notifications.webhookUrl}
                    onChange={(value) => {
                      const newNotifications = {
                        ...notifications,
                        webhookUrl: value
                      };
                      setNotifications(newNotifications);
                    }}
                    onBlur={() => handleSaveSettings('notifications', notifications)}
                    placeholder="https://your-webhook-url.com"
                  />
                )}
                
                <SettingToggle
                  action={{
                    content: notifications.slackEnabled ? 'Disable' : 'Enable',
                    onAction: () => {
                      const newNotifications = {
                        ...notifications,
                        slackEnabled: !notifications.slackEnabled
                      };
                      setNotifications(newNotifications);
                      handleSaveSettings('notifications', newNotifications);
                    },
                  }}
                  enabled={notifications.slackEnabled}
                >
                  Slack notifications
                </SettingToggle>
                
                {notifications.slackEnabled && (
                  <TextField
                    label="Slack Webhook URL"
                    value={notifications.slackWebhook}
                    onChange={(value) => {
                      const newNotifications = {
                        ...notifications,
                        slackWebhook: value
                      };
                      setNotifications(newNotifications);
                    }}
                    onBlur={() => handleSaveSettings('notifications', notifications)}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                )}
              </FormLayout>
            </div>
          </div>
        </Card>
      </Layout.Section>
    </Layout>
  );

  const IntegrationsPanel = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <div style={{ padding: "24px" }}>
            <Text variant="headingLg" as="h2">
              Third-Party Integrations
            </Text>
            <Text variant="bodyMd" as="p" color="subdued">
              Connect EasyForm with your favorite tools and services.
            </Text>
            
            <div style={{ marginTop: "24px" }}>
              <FormLayout>
                <SettingToggle
                  action={{
                    content: integrations.mailchimpEnabled ? 'Disable' : 'Enable',
                    onAction: () => {
                      const newIntegrations = {
                        ...integrations,
                        mailchimpEnabled: !integrations.mailchimpEnabled
                      };
                      setIntegrations(newIntegrations);
                      handleSaveSettings('integrations', newIntegrations);
                    },
                  }}
                  enabled={integrations.mailchimpEnabled}
                >
                  Mailchimp integration
                </SettingToggle>
                
                {integrations.mailchimpEnabled && (
                  <>
                    <TextField
                      label="Mailchimp API Key"
                      value={integrations.mailchimpApiKey}
                      onChange={(value) => {
                        const newIntegrations = {
                          ...integrations,
                          mailchimpApiKey: value
                        };
                        setIntegrations(newIntegrations);
                      }}
                      onBlur={() => handleSaveSettings('integrations', integrations)}
                      placeholder="Your Mailchimp API key"
                    />
                    <TextField
                      label="Mailchimp List ID"
                      value={integrations.mailchimpListId}
                      onChange={(value) => {
                        const newIntegrations = {
                          ...integrations,
                          mailchimpListId: value
                        };
                        setIntegrations(newIntegrations);
                      }}
                      onBlur={() => handleSaveSettings('integrations', integrations)}
                      placeholder="Your Mailchimp list ID"
                    />
                  </>
                )}
                
                <SettingToggle
                  action={{
                    content: integrations.zapierEnabled ? 'Disable' : 'Enable',
                    onAction: () => {
                      const newIntegrations = {
                        ...integrations,
                        zapierEnabled: !integrations.zapierEnabled
                      };
                      setIntegrations(newIntegrations);
                      handleSaveSettings('integrations', newIntegrations);
                    },
                  }}
                  enabled={integrations.zapierEnabled}
                >
                  Zapier integration
                </SettingToggle>
                
                {integrations.zapierEnabled && (
                  <TextField
                    label="Zapier Webhook URL"
                    value={integrations.zapierWebhook}
                    onChange={(value) => {
                      const newIntegrations = {
                        ...integrations,
                        zapierWebhook: value
                      };
                      setIntegrations(newIntegrations);
                    }}
                    onBlur={() => handleSaveSettings('integrations', integrations)}
                    placeholder="Your Zapier webhook URL"
                  />
                )}
              </FormLayout>
            </div>
          </div>
        </Card>
      </Layout.Section>
    </Layout>
  );

  const AppearancePanel = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <div style={{ padding: "24px" }}>
            <Text variant="headingLg" as="h2">
              Appearance Settings
            </Text>
            <Text variant="bodyMd" as="p" color="subdued">
              Customize the look and feel of your forms.
            </Text>
            
            <div style={{ marginTop: "24px" }}>
              <FormLayout>
                <TextField
                  label="Primary Color"
                  value={appearance.primaryColor}
                  onChange={(value) => {
                    const newAppearance = {
                      ...appearance,
                      primaryColor: value
                    };
                    setAppearance(newAppearance);
                  }}
                  onBlur={() => handleSaveSettings('appearance', appearance)}
                  placeholder="#667eea"
                />
                
                <TextField
                  label="Secondary Color"
                  value={appearance.secondaryColor}
                  onChange={(value) => {
                    const newAppearance = {
                      ...appearance,
                      secondaryColor: value
                    };
                    setAppearance(newAppearance);
                  }}
                  onBlur={() => handleSaveSettings('appearance', appearance)}
                  placeholder="#764ba2"
                />
                
                <RangeSlider
                  label="Border Radius"
                  value={appearance.borderRadius}
                  min={0}
                  max={20}
                  step={1}
                  onChange={(value) => {
                    const newAppearance = {
                      ...appearance,
                      borderRadius: value
                    };
                    setAppearance(newAppearance);
                  }}
                  onBlur={() => handleSaveSettings('appearance', appearance)}
                  output
                />
                
                <Select
                  label="Font Family"
                  options={[
                    {label: "Inter", value: "Inter"},
                    {label: "Roboto", value: "Roboto"},
                    {label: "Open Sans", value: "Open Sans"},
                    {label: "Lato", value: "Lato"},
                    {label: "Poppins", value: "Poppins"}
                  ]}
                  value={appearance.fontFamily}
                  onChange={(value) => {
                    const newAppearance = {
                      ...appearance,
                      fontFamily: value
                    };
                    setAppearance(newAppearance);
                    handleSaveSettings('appearance', newAppearance);
                  }}
                />
                
                <SettingToggle
                  action={{
                    content: appearance.enableAnimations ? 'Disable' : 'Enable',
                    onAction: () => {
                      const newAppearance = {
                        ...appearance,
                        enableAnimations: !appearance.enableAnimations
                      };
                      setAppearance(newAppearance);
                      handleSaveSettings('appearance', newAppearance);
                    },
                  }}
                  enabled={appearance.enableAnimations}
                >
                  Enable animations
                </SettingToggle>
              </FormLayout>
            </div>
          </div>
        </Card>
      </Layout.Section>
    </Layout>
  );

  const SecurityPanel = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <div style={{ padding: "24px" }}>
            <Text variant="headingLg" as="h2">
              Security Settings
            </Text>
            <Text variant="bodyMd" as="p" color="subdued">
              Configure security measures to protect your forms from spam and abuse.
            </Text>
            
            <div style={{ marginTop: "24px" }}>
              <FormLayout>
                <SettingToggle
                  action={{
                    content: security.enableCaptcha ? 'Disable' : 'Enable',
                    onAction: () => {
                      const newSecurity = {
                        ...security,
                        enableCaptcha: !security.enableCaptcha
                      };
                      setSecurity(newSecurity);
                      handleSaveSettings('security', newSecurity);
                    },
                  }}
                  enabled={security.enableCaptcha}
                >
                  Enable CAPTCHA
                </SettingToggle>
                
                {security.enableCaptcha && (
                  <Select
                    label="CAPTCHA Type"
                    options={[
                      {label: "reCAPTCHA v2", value: "recaptcha"},
                      {label: "hCaptcha", value: "hcaptcha"},
                      {label: "Simple Math", value: "math"}
                    ]}
                    value={security.captchaType}
                    onChange={(value) => {
                      const newSecurity = {
                        ...security,
                        captchaType: value
                      };
                      setSecurity(newSecurity);
                      handleSaveSettings('security', newSecurity);
                    }}
                  />
                )}
                
                <SettingToggle
                  action={{
                    content: security.enableRateLimiting ? 'Disable' : 'Enable',
                    onAction: () => {
                      const newSecurity = {
                        ...security,
                        enableRateLimiting: !security.enableRateLimiting
                      };
                      setSecurity(newSecurity);
                      handleSaveSettings('security', newSecurity);
                    },
                  }}
                  enabled={security.enableRateLimiting}
                >
                  Enable rate limiting
                </SettingToggle>
                
                {security.enableRateLimiting && (
                  <TextField
                    label="Max Submissions Per Hour"
                    type="number"
                    value={security.maxSubmissionsPerHour.toString()}
                    onChange={(value) => {
                      const newSecurity = {
                        ...security,
                        maxSubmissionsPerHour: parseInt(value) || 10
                      };
                      setSecurity(newSecurity);
                    }}
                    onBlur={() => handleSaveSettings('security', security)}
                    placeholder="10"
                  />
                )}
              </FormLayout>
            </div>
          </div>
        </Card>
      </Layout.Section>
    </Layout>
  );

  const tabPanels = [
    <NotificationsPanel key="notifications" />,
    <IntegrationsPanel key="integrations" />,
    <AppearancePanel key="appearance" />,
    <SecurityPanel key="security" />,
  ];

  return (
    <Page>
      <TitleBar title="App Settings" />
      <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
        {tabPanels[selectedTab]}
      </Tabs>
      
      {/* Success/Error Messages */}
      {fetcher.data && (
        <Banner
          title={fetcher.data.success ? "Success!" : "Error"}
          tone={fetcher.data.success ? "success" : "critical"}
        >
          <p>{fetcher.data.message}</p>
        </Banner>
      )}
    </Page>
  );
} 
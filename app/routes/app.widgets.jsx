import { useState, useCallback } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  Grid,
  Banner,
  Tabs,
  Modal,
  FormLayout,
  Select,
  TextField,
  RangeSlider,
  EmptyState,
  Badge,
  LegacyStack,
  ChoiceList,
} from "@shopify/polaris";
import { 
  PlusIcon,
  ViewIcon,
  EditIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  
  // Mock data for widgets - in real app, fetch from database
  const widgets = [
    {
      id: "1",
      name: "Contact Form Widget",
      type: "contact",
      status: "active",
      style: "modern",
      color: "#667eea",
      borderRadius: 8,
      createdAt: "2024-01-15",
      submissions: 25
    },
    {
      id: "2", 
      name: "Newsletter Signup",
      type: "newsletter",
      status: "draft",
      style: "minimal",
      color: "#764ba2",
      borderRadius: 4,
      createdAt: "2024-01-10",
      submissions: 0
    }
  ];
  
  return { widgets };
};

export const action = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const action = formData.get("action");
    
    if (action === "create") {
      // Handle widget creation
      const name = formData.get("name");
      const type = formData.get("type");
      const style = formData.get("style");
      const color = formData.get("color");
      const borderRadius = formData.get("borderRadius");
      
      // Here you would save to database
      return { success: true, message: "Widget created successfully!" };
    }
    
    if (action === "update") {
      // Handle widget update
      const id = formData.get("id");
      const name = formData.get("name");
      const style = formData.get("style");
      const color = formData.get("color");
      const borderRadius = formData.get("borderRadius");
      
      // Here you would update in database
      return { success: true, message: "Widget updated successfully!" };
    }
    
    if (action === "delete") {
      // Handle widget deletion
      const id = formData.get("id");
      
      // Here you would delete from database
      return { success: true, message: "Widget deleted successfully!" };
    }
    
    return { success: false, message: "Invalid action" };
  } catch (error) {
    console.error("Error in action:", error);
    return { success: false, message: error.message };
  }
};

export default function Widgets() {
  const { widgets } = useLoaderData();
  const fetcher = useFetcher();
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [editingWidget, setEditingWidget] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "contact",
    style: "modern",
    color: "#667eea",
    borderRadius: 8,
    showLabels: true,
    showPlaceholders: true,
    enableValidation: true
  });

  const tabs = [
    {
      id: 'widgets',
      content: 'My Widgets',
      accessibilityLabel: 'Manage widgets',
      panelID: 'widgets-panel',
    },
    {
      id: 'templates',
      content: 'Templates',
      accessibilityLabel: 'Widget templates',
      panelID: 'templates-panel',
    },
    {
      id: 'settings',
      content: 'Widget Settings',
      accessibilityLabel: 'Global widget settings',
      panelID: 'settings-panel',
    },
  ];

  const handleTabChange = (selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
  };

  const handleCreateWidget = useCallback(() => {
    setEditingWidget(null);
    setFormData({
      name: "",
      type: "contact",
      style: "modern",
      color: "#667eea",
      borderRadius: 8,
      showLabels: true,
      showPlaceholders: true,
      enableValidation: true
    });
    setActiveModal("create");
  }, []);

  const handleEditWidget = useCallback((widget) => {
    setEditingWidget(widget);
    setFormData({
      name: widget.name,
      type: widget.type,
      style: widget.style,
      color: widget.color,
      borderRadius: widget.borderRadius,
      showLabels: true,
      showPlaceholders: true,
      enableValidation: true
    });
    setActiveModal("edit");
  }, []);

  const handleDeleteWidget = useCallback((widgetId) => {
    if (confirm("Are you sure you want to delete this widget?")) {
      fetcher.submit(
        { action: "delete", id: widgetId },
        { method: "post" }
      );
    }
  }, [fetcher]);

  const handleSubmit = useCallback(() => {
    const action = editingWidget ? "update" : "create";
    const submitData = {
      action,
      ...formData
    };
    
    if (editingWidget) {
      submitData.id = editingWidget.id;
    }
    
    fetcher.submit(submitData, { method: "post" });
    setActiveModal(null);
  }, [formData, editingWidget, fetcher]);

  const WidgetsPanel = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <Text variant="headingLg" as="h2">
                Form Widgets
              </Text>
              <Button 
                variant="primary" 
                icon={PlusIcon}
                onClick={handleCreateWidget}
              >
                Create Widget
              </Button>
            </div>
            
            {widgets.length === 0 ? (
              <EmptyState
                heading="No widgets created yet"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>Create your first form widget to start collecting customer information.</p>
                <Button variant="primary" onClick={handleCreateWidget}>
                  Create Widget
                </Button>
              </EmptyState>
            ) : (
              <Grid>
                {widgets.map((widget) => (
                  <Grid.Cell key={widget.id} columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
                    <Card>
                      <div style={{ padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                          <Text variant="headingMd" as="h3" fontWeight="semibold">
                            {widget.name}
                          </Text>
                          <Badge tone={widget.status === "active" ? "success" : "warning"}>
                            {widget.status}
                          </Badge>
                        </div>
                        
                        <div style={{ marginBottom: "16px" }}>
                          <Text variant="bodySm" as="p" color="subdued">
                            Type: {widget.type}
                          </Text>
                          <Text variant="bodySm" as="p" color="subdued">
                            Style: {widget.style}
                          </Text>
                          <Text variant="bodySm" as="p" color="subdued">
                            Submissions: {widget.submissions}
                          </Text>
                        </div>
                        
                        <div style={{ 
                          height: "60px", 
                          backgroundColor: widget.color, 
                          borderRadius: `${widget.borderRadius}px`,
                          marginBottom: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <Text variant="bodySm" as="p" color="white" fontWeight="semibold">
                            Preview
                          </Text>
                        </div>
                        
                        <LegacyStack spacing="tight">
                          <Button 
                            size="slim" 
                            icon={ViewIcon}
                            variant="secondary"
                            url={`/app/widgets/${widget.id}`}
                          >
                            View
                          </Button>
                          <Button 
                            size="slim" 
                            icon={EditIcon}
                            variant="secondary"
                            onClick={() => handleEditWidget(widget)}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="slim" 
                            icon={DeleteIcon}
                            variant="secondary"
                            tone="critical"
                            onClick={() => handleDeleteWidget(widget.id)}
                          >
                            Delete
                          </Button>
                        </LegacyStack>
                      </div>
                    </Card>
                  </Grid.Cell>
                ))}
              </Grid>
            )}
          </div>
        </Card>
      </Layout.Section>
    </Layout>
  );

  const TemplatesPanel = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <div style={{ padding: "24px" }}>
            <Text variant="headingLg" as="h2">
              Widget Templates
            </Text>
            <Text variant="bodyMd" as="p" color="subdued">
              Choose from pre-designed templates to quickly create beautiful forms.
            </Text>
            
            <div style={{ marginTop: "24px" }}>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
                  <Card>
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      <div style={{ 
                        height: "120px", 
                        backgroundColor: "#667eea", 
                        borderRadius: "8px",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Text variant="bodyMd" as="p" color="white" fontWeight="semibold">
                          Modern Contact
                        </Text>
                      </div>
                      <Text variant="headingSm" as="h3">
                        Modern Contact Form
                      </Text>
                      <Text variant="bodySm" as="p" color="subdued">
                        Clean, modern design with gradient styling
                      </Text>
                      <Button 
                        variant="primary" 
                        size="slim"
                        style={{ marginTop: "12px" }}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            name: "Modern Contact Form",
                            style: "modern",
                            color: "#667eea"
                          });
                          setActiveModal("create");
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </Card>
                </Grid.Cell>
                
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
                  <Card>
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      <div style={{ 
                        height: "120px", 
                        backgroundColor: "#764ba2", 
                        borderRadius: "4px",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Text variant="bodyMd" as="p" color="white" fontWeight="semibold">
                          Minimal Newsletter
                        </Text>
                      </div>
                      <Text variant="headingSm" as="h3">
                        Minimal Newsletter
                      </Text>
                      <Text variant="bodySm" as="p" color="subdued">
                        Simple, clean design for newsletter signups
                      </Text>
                      <Button 
                        variant="primary" 
                        size="slim"
                        style={{ marginTop: "12px" }}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            name: "Minimal Newsletter",
                            type: "newsletter",
                            style: "minimal",
                            color: "#764ba2"
                          });
                          setActiveModal("create");
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </Card>
                </Grid.Cell>
                
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
                  <Card>
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      <div style={{ 
                        height: "120px", 
                        backgroundColor: "#f093fb", 
                        borderRadius: "12px",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Text variant="bodyMd" as="p" color="white" fontWeight="semibold">
                          Rounded Feedback
                        </Text>
                      </div>
                      <Text variant="headingSm" as="h3">
                        Rounded Feedback
                      </Text>
                      <Text variant="bodySm" as="p" color="subdued">
                        Soft, rounded design for feedback forms
                      </Text>
                      <Button 
                        variant="primary" 
                        size="slim"
                        style={{ marginTop: "12px" }}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            name: "Rounded Feedback",
                            type: "feedback",
                            style: "rounded",
                            color: "#f093fb",
                            borderRadius: 12
                          });
                          setActiveModal("create");
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  </Card>
                </Grid.Cell>
              </Grid>
            </div>
          </div>
        </Card>
      </Layout.Section>
    </Layout>
  );

  const SettingsPanel = () => (
    <Layout>
      <Layout.Section>
        <Card>
          <div style={{ padding: "24px" }}>
            <Text variant="headingLg" as="h2">
              Global Widget Settings
            </Text>
            <Text variant="bodyMd" as="p" color="subdued">
              Configure default settings for all your form widgets.
            </Text>
            
            <div style={{ marginTop: "24px" }}>
              <FormLayout>
                <Select
                  label="Default Form Type"
                  options={[
                    {label: "Contact Form", value: "contact"},
                    {label: "Newsletter Signup", value: "newsletter"},
                    {label: "Feedback Form", value: "feedback"},
                    {label: "Survey", value: "survey"}
                  ]}
                  value={formData.type}
                  onChange={(value) => setFormData({...formData, type: value})}
                />
                
                <Select
                  label="Default Style"
                  options={[
                    {label: "Modern", value: "modern"},
                    {label: "Minimal", value: "minimal"},
                    {label: "Classic", value: "classic"},
                    {label: "Rounded", value: "rounded"}
                  ]}
                  value={formData.style}
                  onChange={(value) => setFormData({...formData, style: value})}
                />
                
                <TextField
                  label="Default Primary Color"
                  value={formData.color}
                  onChange={(value) => setFormData({...formData, color: value})}
                  placeholder="#667eea"
                />
                
                <RangeSlider
                  label="Default Border Radius"
                  value={formData.borderRadius}
                  min={0}
                  max={20}
                  step={1}
                  onChange={(value) => setFormData({...formData, borderRadius: value})}
                  output
                />
                
                <ChoiceList
                  title="Default Form Options"
                  choices={[
                    {label: "Show field labels", value: "showLabels"},
                    {label: "Show placeholder text", value: "showPlaceholders"},
                    {label: "Enable form validation", value: "enableValidation"},
                    {label: "Auto-focus first field", value: "autoFocus"}
                  ]}
                  selected={Object.keys(formData).filter(key => formData[key] === true)}
                  onChange={(value) => {
                    const newFormData = {...formData};
                    ["showLabels", "showPlaceholders", "enableValidation", "autoFocus"].forEach(key => {
                      newFormData[key] = value.includes(key);
                    });
                    setFormData(newFormData);
                  }}
                />
              </FormLayout>
            </div>
          </div>
        </Card>
      </Layout.Section>
    </Layout>
  );

  const tabPanels = [
    <WidgetsPanel key="widgets" />,
    <TemplatesPanel key="templates" />,
    <SettingsPanel key="settings" />,
  ];

  return (
    <Page>
      <TitleBar title="Form Widgets" />
      <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
        {tabPanels[selectedTab]}
      </Tabs>
      
      {/* Create/Edit Widget Modal */}
      <Modal
        open={activeModal === "create" || activeModal === "edit"}
        onClose={() => setActiveModal(null)}
        title={editingWidget ? "Edit Widget" : "Create New Widget"}
        primaryAction={{
          content: editingWidget ? "Update Widget" : "Create Widget",
          onAction: handleSubmit,
          loading: fetcher.state === "submitting"
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setActiveModal(null)
          }
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Widget Name"
              value={formData.name}
              onChange={(value) => setFormData({...formData, name: value})}
              placeholder="Enter widget name"
            />
            
            <Select
              label="Form Type"
              options={[
                {label: "Contact Form", value: "contact"},
                {label: "Newsletter Signup", value: "newsletter"},
                {label: "Feedback Form", value: "feedback"},
                {label: "Survey", value: "survey"}
              ]}
              value={formData.type}
              onChange={(value) => setFormData({...formData, type: value})}
            />
            
            <Select
              label="Style"
              options={[
                {label: "Modern", value: "modern"},
                {label: "Minimal", value: "minimal"},
                {label: "Classic", value: "classic"},
                {label: "Rounded", value: "rounded"}
              ]}
              value={formData.style}
              onChange={(value) => setFormData({...formData, style: value})}
            />
            
            <TextField
              label="Primary Color"
              value={formData.color}
              onChange={(value) => setFormData({...formData, color: value})}
              placeholder="#667eea"
            />
            
            <RangeSlider
              label="Border Radius"
              value={formData.borderRadius}
              min={0}
              max={20}
              step={1}
              onChange={(value) => setFormData({...formData, borderRadius: value})}
              output
            />
            
            <ChoiceList
              title="Form Options"
              choices={[
                {label: "Show field labels", value: "showLabels"},
                {label: "Show placeholder text", value: "showPlaceholders"},
                {label: "Enable form validation", value: "enableValidation"}
              ]}
              selected={Object.keys(formData).filter(key => formData[key] === true)}
              onChange={(value) => {
                const newFormData = {...formData};
                ["showLabels", "showPlaceholders", "enableValidation"].forEach(key => {
                  newFormData[key] = value.includes(key);
                });
                setFormData(newFormData);
              }}
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
      
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
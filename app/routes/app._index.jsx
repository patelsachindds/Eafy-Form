
import { useEffect, useState, useCallback, useRef } from "react";
import { useFetcher } from "@remix-run/react";

import {
  Page,
  Layout,
  Card,
  Button,
  Form,
  FormLayout,
  Text,
  Grid,
  LegacyStack,
  Icon,
} from "@shopify/polaris";
import { 
   AppsIcon,
  SettingsIcon,
  ChartLineIcon,
} from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  // Fetch the existing metaobject
  const getMetaobjectQuery = `
    query {
      metaobjects(type: "contact_form", first: 1) {
        nodes {
          id
          fields {
            key
            value
          }
        }
      }
    }
  `;
  const { admin } = await authenticate.admin(request);
  const getResponse = await admin.graphql(getMetaobjectQuery);
  const getResult = await getResponse.json();

  const existing = getResult.data.metaobjects.nodes[0];
  return { existingFields: existing ? existing.fields : [] };
};

export const action = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const formData = await request.json();
    const selectedFields = JSON.parse(formData.fields);


    // 0. First, check existing metaobject definitions and their fields
    const definitionQuery = `
      query {
        metaobjectDefinitions(first: 10) {
          nodes {
            type
            name
            id
            fieldDefinitions {
              key
              name
            }
          }
        }
      }
    `;
    const definitionResponse = await admin.graphql(definitionQuery);
    const definitionResult = await definitionResponse.json();
  
    let contactFormDefinition = definitionResult.data.metaobjectDefinitions.nodes.find(
      def => def.type === "contact_form"
    );

        // Check if we need to create the definition
    // const needsDefinition = !contactFormDefinition;

    if (!contactFormDefinition) {
      // Create the metaobject definition
      const createDefinitionMutation = `
        mutation metaobjectDefinitionCreate($definition: MetaobjectDefinitionCreateInput!) {
          metaobjectDefinitionCreate(definition: $definition) {
            metaobjectDefinition {
              id
              type
              name
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      // Create definition with all fields
      const definitionFields = [
        { key: "firstName", name: "First Name", type: "single_line_text_field" },
        { key: "lastName", name: "Last Name", type: "single_line_text_field" },
        { key: "email", name: "Email", type: "single_line_text_field" },
        { key: "phone", name: "Phone", type: "single_line_text_field" },
        { key: "address", name: "Address", type: "single_line_text_field" },
        { key: "city", name: "City", type: "single_line_text_field" },
        { key: "state", name: "State", type: "single_line_text_field" },
        { key: "country", name: "Country", type: "single_line_text_field" },
        { key: "zipCode", name: "Zip Code", type: "single_line_text_field" },
        { key: "subject", name: "Subject", type: "single_line_text_field" },
        { key: "message", name: "Message", type: "single_line_text_field" }
      ];

      console.log("Creating definition with ALL fields:", definitionFields);

      const definitionVars = {
        definition: {
          name: "Contact Form",
          type: "contact_form",
          fieldDefinitions: definitionFields
        }
      };

     
      const createDefResponse = await admin.graphql(createDefinitionMutation, { variables: definitionVars });
      const createDefResult = await createDefResponse.json();

          if (createDefResult.data.metaobjectDefinitionCreate.userErrors.length > 0) {
      
      // Try creating a simpler definition with just basic fields
      const simpleDefinitionFields = [
        { key: "firstName", name: "First Name", type: "single_line_text_field" },
        { key: "lastName", name: "Last Name", type: "single_line_text_field" },
        { key: "email", name: "Email", type: "single_line_text_field" },
        { key: "phone", name: "Phone", type: "single_line_text_field" },
        { key: "address", name: "Address", type: "single_line_text_field" },
        { key: "city", name: "City", type: "single_line_text_field" },
        { key: "state", name: "State", type: "single_line_text_field" },
        { key: "country", name: "Country", type: "single_line_text_field" },
        { key: "zipCode", name: "Zip Code", type: "single_line_text_field" },
        { key: "subject", name: "Subject", type: "single_line_text_field" },
        { key: "message", name: "Message", type: "single_line_text_field" }
      ];

      const simpleDefinitionVars = {
        definition: {
          name: "Contact Form",
          type: "contact_form",
          fieldDefinitions: simpleDefinitionFields
        }
      };

  
      const simpleDefResponse = await admin.graphql(createDefinitionMutation, { variables: simpleDefinitionVars });
      const simpleDefResult = await simpleDefResponse.json();


      if (simpleDefResult.data.metaobjectDefinitionCreate.userErrors.length > 0) {
        return { success: false, error: simpleDefResult.data.metaobjectDefinitionCreate.userErrors };
      }
    }

      // Wait a moment for the definition to be fully created
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify the definition was created
      const verifyDefinitionQuery = `
        query {
          metaobjectDefinitions(first: 10) {
            nodes {
              type
              name
              id
              fieldDefinitions {
                key
                name
              }
            }
          }
        }
      `;
      const verifyResponse = await admin.graphql(verifyDefinitionQuery);
      const verifyResult = await verifyResponse.json();
      

      const verifiedDefinition = verifyResult.data.metaobjectDefinitions.nodes.find(
        def => def.type === "contact_form"
      );

      if (!verifiedDefinition) {
        return { success: false, error: "Failed to create metaobject definition" };
      }

    }

    // 1. Query for existing metaobject
    const getMetaobjectQuery = `
      query {
        metaobjects(type: "contact_form", first: 1) {
          nodes {
            id
            fields {
              key
              value
            }
          }
        }
      }
    `;
    
    const getResponse = await admin.graphql(getMetaobjectQuery);
    const getResult = await getResponse.json();
    
    // 2. Check if metaobject exists
    const existing = getResult.data.metaobjects.nodes[0];

      // 3. Prepare fields data - use only fields that exist in the definition
    let availableFieldKeys = [];
    
    if (contactFormDefinition && contactFormDefinition.fieldDefinitions) {
      availableFieldKeys = contactFormDefinition.fieldDefinitions.map(field => field.key);
      
    } else {
      // Fallback to basic fields if no definition found
      availableFieldKeys = ["firstName", "lastName", "email"];
     
    }
    
    // Filter selected fields to only include those that exist in the definition
    const validSelectedFields = selectedFields.filter(field => availableFieldKeys.includes(field));
    
    
    let fields;
    if (existing) {
      // If metaobject exists, merge existing fields with new selections
      const existingFields = existing.fields.reduce((acc, field) => {
        acc[field.key] = field.value;
        return acc;
      }, {});
      
      fields = availableFieldKeys.map((field) => ({
        key: field,
        value: validSelectedFields.includes(field) ? "true" : "false",
      }));
      
    } else {
      // If no existing metaobject, use available fields from definition
      fields = availableFieldKeys.map((field) => ({
        key: field,
        value: validSelectedFields.includes(field) ? "true" : "false",
      }));
     
    }

  if (existing) {
    // 4a. UPDATE existing metaobject
    const updateMutation = `
      mutation metaobjectUpdate($id: ID!, $metaobject: MetaobjectUpdateInput!) {
        metaobjectUpdate(id: $id, metaobject: $metaobject) {
          metaobject {
            id
            fields { key value }
          }
          userErrors { field message }
        }
      }
    `;
    const updateVars = { id: existing.id, metaobject: { fields } };
    const updateResponse = await admin.graphql(updateMutation, { variables: updateVars });
    const updateResult = await updateResponse.json();
    
    if (updateResult.data.metaobjectUpdate.userErrors.length > 0) {
      return { success: false, error: updateResult.data.metaobjectUpdate.userErrors };
    }
    return { success: true, metaobject: updateResult.data.metaobjectUpdate.metaobject };
  } else {
    // 4b. CREATE new metaobject
    const createMutation = `
      mutation metaobjectCreate($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject {
            id
            fields { key value }
          }
          userErrors { field message }
        }
      }
    `;
    const createVars = { metaobject: { type: "contact_form", fields } };
    
    const createResponse = await admin.graphql(createMutation, { variables: createVars });
    const createResult = await createResponse.json();
    
    if (createResult.data.metaobjectCreate.userErrors.length > 0) {
      return { success: false, error: createResult.data.metaobjectCreate.userErrors };
    }
    return { success: true, metaobject: createResult.data.metaobjectCreate.metaobject };
  }
  } catch (error) {
    console.error("Error in action:", error);
    return { success: false, error: error.message };
  }
};



export default function Index() {
  // Ref for the form builder section
  const formBuilderRef = useRef(null);
  // State to control showing the form builder widget
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const fetcher = useFetcher();
  const { existingFields } = useLoaderData();

  const [fields, setFields] = useState(() => {
    const defaultFields = {
      firstName: false,
      lastName: false,
      email: true, // Always true
      phone: false,
      address: false,
      city: false,
      state: false,
      country: false,
      zipCode: false,
      subject: false,
      message: false,
    };
    if (existingFields && existingFields.length > 0) {
      existingFields.forEach(f => {
        if (f.key === "email") {
          defaultFields.email = true; // Always true
        } else if (f.value === "true") {
          defaultFields[f.key] = true;
        }
      });
    }
    return defaultFields;
  });

  const handleChange = useCallback(
    (field) => (value) => {
      if (field === "email") return; // Prevent changing email
      setFields((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    const selectedFields = Object.keys(fields).filter((key) => fields[key]);
    fetcher.submit(
      { fields: JSON.stringify(selectedFields) },
      {
        method: "post",
        action: ".", // This ensures the request goes to app/_index, which has the action
        encType: "application/json",
      }
    );
  }, [fields, fetcher]);

  // Show form and scroll to it
  const handleShowFormBuilder = () => {
    setShowFormBuilder(true);
    setTimeout(() => {
      if (formBuilderRef.current) {
        formBuilderRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Wait for render
  };

  // Back button handler
  const handleBack = () => {
    setShowFormBuilder(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <Page>
      <TitleBar title="EasyForm - Contact Form Builder" />
      <Layout>
        {/* Show instructions only if form builder is hidden */}
        {!showFormBuilder && (
          <Layout.Section>
            <TitleBar title="EasyForm" />
            <Layout>
              <Layout.Section>
                <Card>
                  <div
                    style={{
                      padding: "48px 32px 40px 32px",
                      borderRadius: 20,
                      maxWidth: 640,
                      margin: "0 auto"
                    }}
                  >
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "linear-gradient(135deg, #5c6ac4 0%, #aee9f7 100%)",
                          borderRadius: "50%",
                          width: 80,
                          height: 80,
                          boxShadow: "0 4px 16px rgba(44, 62, 80, 0.12)",
                          marginBottom: 12
                        }}
                      >
                        <Icon source={AppsIcon} color="inverse" backdrop={false} style={{ width: 44, height: 44 }} />
                      </span>
                      <div style={{ fontWeight: 700, fontSize: 30, color: "#202223", marginTop: 10, letterSpacing: -1 }}>Welcome to EasyForm</div>
                      <div style={{ fontWeight: 500, fontSize: 18, color: "#5c6ac4", marginTop: 30 }}>Quick Start Guide</div>
                    </div>
                    <ul
                      style={{
                        background: "#fff",
                        borderRadius: 14,
                        boxShadow: "0 2px 8px rgba(44, 62, 80, 0.06)",
                        padding: "32px 36px 28px 36px",
                        margin: "0 auto 12px auto",
                        maxWidth: 500,
                        color: "#31373d",
                        fontSize: 17,
                        lineHeight: 1.8,
                        listStyle: "none"
                      }}
                    >
                      <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 18 }}>
                        <span style={{ color: '#5c6ac4', marginRight: 14, marginTop: 2, fontSize: 20 }}>✔</span>
                        <span>Select the fields you want to include in your contact form in the <b>Widget</b> section.</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 18 }}>
                        <span style={{ color: '#5c6ac4', marginRight: 14, marginTop: 2, fontSize: 20 }}>✔</span>
                        <span>Click <b>Create Contact Form</b> to save your selection.</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 18 }}>
                        <span style={{ color: '#5c6ac4', marginRight: 14, marginTop: 2, fontSize: 20 }}>✔</span>
                        <span>Go to your Shopify admin, open <b>Online Store &gt; Themes &gt; Customize</b>, and add the EasyForm block to your desired page/section.</span>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <span style={{ color: '#5c6ac4', marginRight: 14, marginTop: 2, fontSize: 20 }}>✔</span>
                        <span>Publish your changes. Your contact form will now appear on your store with the selected fields.</span>
                      </li>
                    </ul>
                    <button style={{ 
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff"
                    }} 
                      className="form_widget"
                      variant="primary"
                      onClick={handleShowFormBuilder}
                    >Form Widget</button>
                  </div>
                </Card>
              </Layout.Section>
            </Layout>
          </Layout.Section>
        )}

        {/* Show form builder only if showFormBuilder is true */}
        {showFormBuilder && (
          <Layout.Section ref={formBuilderRef}>
            <Card>
              <div style={{ padding: "24px" }}>
                {/* Back Button */}
                <div style={{ marginBottom: "16px" }}>
                  <Button variant="secondary" onClick={handleBack}>
                    ← Back
                  </Button>
                </div>
                <div class="contact_form_details">
                  <Text variant="headingMd" as="h3" alignment="center" className="heading_form_fields">
                    Contact Form Builder
                  </Text>
                  <Text variant="bodyMd" as="p" alignment="center" color="subdued">
                    Select which fields you want to include in your contact form
                  </Text>
                </div>
                <div class="form_row">
                  <Form onSubmit={handleSubmit}>
                    <FormLayout>
                      <div class="form_grid">
                        <Grid>
                          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                            <Text variant="headingMd" as="h3" alignment="center">
                              Personal Information
                            </Text>
                            <div class="form_button_col">
                              <Button
                                style={{
                                  background: fields.firstName 
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                    : undefined,
                                  border: fields.firstName ? "none" : undefined,
                                  marginBottom: "12px"
                                }}
                                variant={fields.firstName ? "primary" : "secondary"}
                                onClick={() => handleChange("firstName")(!fields.firstName)}
                                fullWidth
                                size="large"
                              >
                                First Name
                              </Button>
                              <Button
                                style={{
                                  background: fields.lastName 
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                    : undefined,
                                  border: fields.lastName ? "none" : undefined
                                }}
                                variant={fields.lastName ? "primary" : "secondary"}
                                onClick={() => handleChange("lastName")(!fields.lastName)}
                                fullWidth
                                size="large"
                              >
                                Last Name
                              </Button>
                            </div>
                          </Grid.Cell>
                          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                            <Text variant="headingMd" as="h3" alignment="center">
                              Contact Information
                            </Text>
                            <div class="form_button_col">
                              <Button
                                style={{
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  border: "none",
                                  marginBottom: "12px"
                                }}
                                variant="primary"
                                fullWidth
                                size="large"
                                disabled
                              >
                                Email Address (Required)
                              </Button>
                              <Button
                                style={{
                                  background: fields.phone 
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                    : undefined,
                                  border: fields.phone ? "none" : undefined
                                }}
                                variant={fields.phone ? "primary" : "secondary"}
                                onClick={() => handleChange("phone")(!fields.phone)}
                                fullWidth
                                size="large"
                              >
                                Phone Number
                              </Button>
                            </div>
                          </Grid.Cell>
                        </Grid>
                      </div>
                      <div style={{ marginBottom: "32px" }}>
                        <Grid>
                          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                            <Text variant="headingMd" as="h3" alignment="center">
                              Address Information
                            </Text>
                            <div class="form_button_col">
                              <Button
                                style={{
                                  background: fields.address 
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                    : undefined,
                                  border: fields.address ? "none" : undefined,
                                  marginBottom: "12px"
                                }}
                                variant={fields.address ? "primary" : "secondary"}
                                onClick={() => handleChange("address")(!fields.address)}
                                fullWidth
                                size="large"
                              >
                                Street Address
                              </Button>
                              <Button
                                style={{
                                  background: fields.city 
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                    : undefined,
                                  border: fields.city ? "none" : undefined,
                                  marginBottom: "12px"
                                }}
                                variant={fields.city ? "primary" : "secondary"}
                                onClick={() => handleChange("city")(!fields.city)}
                                fullWidth
                                size="large"
                              >
                                City
                              </Button>
                              <Button
                                style={{
                                  background: fields.state 
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                    : undefined,
                                  border: fields.state ? "none" : undefined,
                                  marginBottom: "12px"
                                }}
                                variant={fields.state ? "primary" : "secondary"}
                                onClick={() => handleChange("state")(!fields.state)}
                                fullWidth
                                size="large"
                              >
                                State/Province
                              </Button>
                              <Button
                                style={{
                                  background: fields.country 
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                    : undefined,
                                  border: fields.country ? "none" : undefined,
                                  marginBottom: "12px"
                                }}
                                variant={fields.country ? "primary" : "secondary"}
                                onClick={() => handleChange("country")(!fields.country)}
                                fullWidth
                                size="large"
                              >
                                Country
                              </Button>
                              <Button
                                style={{
                                  background: fields.zipCode 
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                    : undefined,
                                  border: fields.zipCode ? "none" : undefined
                                }}
                                variant={fields.zipCode ? "primary" : "secondary"}
                                onClick={() => handleChange("zipCode")(!fields.zipCode)}
                                fullWidth
                                size="large"
                              >
                                Zip/Postal Code
                              </Button>
                            </div>
                          </Grid.Cell>
                          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                            <Text variant="headingMd" as="h3" alignment="center">
                              Message Details
                            </Text>
                            <div class="form_button_col">
                              <Button
                                style={{
                                  background: fields.subject 
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                    : undefined,
                                  border: fields.subject ? "none" : undefined,
                                  marginBottom: "12px"
                                }}
                                variant={fields.subject ? "primary" : "secondary"}
                                onClick={() => handleChange("subject")(!fields.subject)}
                                fullWidth
                                size="large"
                              >
                                Subject
                              </Button>
                              <Button
                                style={{
                                  background: fields.message 
                                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                                    : undefined,
                                  border: fields.message ? "none" : undefined
                                }}
                                variant={fields.message ? "primary" : "secondary"}
                                onClick={() => handleChange("message")(!fields.message)}
                                fullWidth
                                size="large"
                              >
                                Message
                              </Button>
                            </div>
                          </Grid.Cell>
                        </Grid>
                      </div>
                      {/* <div style={{ 
                        marginTop: "32px", 
                        padding: "24px", 
                        backgroundColor: "#f6f6f7", 
                        borderRadius: "8px",
                        textAlign: "center"
                      }}>
                        <Text variant="bodyMd" as="p" color="subdued">
                          Selected fields: {Object.keys(fields).filter(key => fields[key]).join(", ")}
                        </Text>
                      </div> */}
                      <Text className="information_note"><b>Note:</b> Each time a customer fills out and submits the EasyForm, their details are instantly delivered to the store owner's email inbox for safe keeping and quick follow-up.</Text>
                      <div class="save_field_button">
                        <Button variant="primary" submit size="large" loading={fetcher.state === "submitting"}>
                          {fetcher.state === "submitting" ? "Creating..." : "Create Contact Form"}
                        </Button>
                      </div>
                      {fetcher.data && (
                        <div style={{ 
                          marginTop: "16px", 
                          padding: "16px", 
                          backgroundColor: fetcher.data.success ? "#d4edda" : "#f8d7da", 
                          borderRadius: "8px",
                          textAlign: "center"
                        }}>
                          <Text variant="bodyMd" color={fetcher.data.success ? "success" : "critical"}>
                            {fetcher.data.success 
                              ? "✅ Contact form created/updated successfully!" 
                              : `❌ Error: ${JSON.stringify(fetcher.data.error)}`
                            }
                          </Text>
                        </div>
                      )}
                    </FormLayout>
                  </Form>
                </div>
              </div>
            </Card>
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
}


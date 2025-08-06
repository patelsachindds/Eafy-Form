import { useFetcher, useLoaderData } from "@remix-run/react";
import { useState, useCallback, useMemo } from "react";
import { Card, Button, Form, FormLayout, Text, Grid, Icon } from "@shopify/polaris";
import { AppsIcon } from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";

import { json } from '@remix-run/node';

export const action = async ({ request }) => {
  const { admin } = await authenticate(request);
  let selectedFields = [];
  if (request.headers.get('content-type')?.includes('application/json')) {
    const body = await request.json();
    selectedFields = JSON.parse(body.fields || '[]');
  } else {
    const formData = await request.formData();
    selectedFields = JSON.parse(formData.get('fields') || '[]');
  }

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
  const needsDefinition = !contactFormDefinition;

  if (needsDefinition) {
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
        return json({ success: false, error: simpleDefResult.data.metaobjectDefinitionCreate.userErrors });
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
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
    contactFormDefinition = verifyResult.data.metaobjectDefinitions.nodes.find(
      def => def.type === "contact_form"
    );
    if (!contactFormDefinition) {
      return json({ success: false, error: "Failed to create metaobject definition" });
    }
  }
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
  const existing = getResult.data.metaobjects.nodes[0];
  let availableFieldKeys = [];
  if (contactFormDefinition && contactFormDefinition.fieldDefinitions) {
    availableFieldKeys = contactFormDefinition.fieldDefinitions.map(field => field.key);
  } else {
    availableFieldKeys = ["firstName", "lastName", "email"];
  }
  const validSelectedFields = selectedFields.filter(field => availableFieldKeys.includes(field));
  let fields;
  fields = availableFieldKeys.map((field) => ({
    key: field,
    value: validSelectedFields.includes(field) ? "true" : "false",
  }));
  if (existing) {
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
      return json({ success: false, error: updateResult.data.metaobjectUpdate.userErrors });
    }
    return json({ success: true, metaobject: updateResult.data.metaobjectUpdate.metaobject });
  } else {
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
      return json({ success: false, error: createResult.data.metaobjectCreate.userErrors });
    }
    return json({ success: true, metaobject: createResult.data.metaobjectCreate.metaobject });
  }
};


export const loader = async ({ request }) => {
  const { admin } = await authenticate(request);
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
  const getResponse = await admin.graphql(getMetaobjectQuery);
  const getResult = await getResponse.json();
  const existing = getResult.data.metaobjects.nodes[0];
  return json({ metaobject: existing ? existing : null });

}

export default function Widget() {
  const fetcher = useFetcher();
  const loaderData = useLoaderData() || {};
  const metaobject = loaderData.metaobject || null;
  // Build initial field state from metaobject.fields (only on first render)
  const initialFields = useMemo(() => {
    const defaults = {
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
    if (metaobject && Array.isArray(metaobject.fields)) {
      metaobject.fields.forEach(({ key, value }) => {
        if (key in defaults) {
          if (value === "true" || value === true) {
            defaults[key] = true;
          }
        }
      });
    }
    return defaults;
  }, [metaobject]);
  const [fields, setFields] = useState(initialFields);

  const handleChange = useCallback(
    (field) => (value) => {
      if (field === "email") return;
      setFields((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    const selectedFields = Object.keys(fields).filter((key) => fields[key]);
    const formData = new FormData();
    formData.append('fields', JSON.stringify(selectedFields));
    fetcher.submit(formData, {
      method: "post",
      action: ".",
      encType: "multipart/form-data",
    });
  }, [fields, fetcher]);

  // Optionally, you can use metaobject.fields to pre-select fields if needed
  return (
    <Card>
      
      <div style={{ padding: "32px" }}>
        <Text variant="headingLg" as="h2" alignment="center" style={{ marginBottom: "16px" }}>
          Widget
        </Text>
        <Text variant="bodyMd" as="p" alignment="center" color="subdued" style={{ marginBottom: "24px" }}>
          Select which fields you want to include in your contact form:
        </Text>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                <Text variant="headingMd" as="h3" alignment="center">
                  Personal Information
                </Text>
                <div className="form_button_col">
                  <Button
                    style={{
                      background: fields.firstName
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : undefined,
                      border: fields.firstName ? "none" : undefined,
                      marginBottom: "12px",
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
                      border: fields.lastName ? "none" : undefined,
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
                <div className="form_button_col">
                  <Button
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      marginBottom: "12px",
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
                      border: fields.phone ? "none" : undefined,
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
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                <Text variant="headingMd" as="h3" alignment="center">
                  Address Information
                </Text>
                <div className="form_button_col">
                  <Button
                    style={{
                      background: fields.address
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : undefined,
                      border: fields.address ? "none" : undefined,
                      marginBottom: "12px",
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
                      marginBottom: "12px",
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
                      marginBottom: "12px",
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
                      marginBottom: "12px",
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
                      border: fields.zipCode ? "none" : undefined,
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
                <div className="form_button_col">
                  <Button
                    style={{
                      background: fields.subject
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : undefined,
                      border: fields.subject ? "none" : undefined,
                      marginBottom: "12px",
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
                      border: fields.message ? "none" : undefined,
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
            <div className="save_field_button" style={{ marginTop: 32 }}>
              <Button variant="primary" submit size="large" loading={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "Creating..." : "Create Contact Form"}
              </Button>
            </div>
            {fetcher.data && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "16px",
                  backgroundColor: fetcher.data.success ? "#d4edda" : "#f8d7da",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <Text variant="bodyMd" color={fetcher.data.success ? "success" : "critical"}>
                  {fetcher.data.success
                    ? "✅ Contact form created/updated successfully!"
                    : (
                        Array.isArray(fetcher.data.error)
                          ? fetcher.data.error.map((err, idx) => (
                              <span key={idx}>{`❌ ${err.message || err}`}</span>
                            ))
                          : `❌ Error: ${fetcher.data.error}`
                      )}
                </Text>
              </div>
            )}
            
            {metaobject && Array.isArray(metaobject.fields) && metaobject.fields.length > 0 ? (
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {metaobject.fields.map((field) => (
                  <li key={field.key} style={{ margin: "8px 0" }}>
                    <Text variant="bodyMd">
                      {field.value ? "✅" : "❌"} {field.key}
                    </Text>
                  </li>
                ))}
              </ul>
            ) : (
              <Text variant="bodyMd" color="subdued">
                No fields configured
              </Text>
            )}
             
          </FormLayout>
        </Form>
      </div>
    </Card>
  );
}
// import { Page, Card, Text, Layout, Divider, Box } from "@shopify/polaris";
// import { TitleBar } from "@shopify/app-bridge-react";

// export const loader = async () => null;

// export default function Screencast() {
//   return (
//     <Box background="bg-surface-secondary" minHeight="100vh" padding="400">
//       <Page>
//         <TitleBar title="Screencast Requirements" />
//         <Layout>
//           <Layout.Section>
//             <Card padding="0">
//               <ul
//                       style={{
//                         background: "#fff",
//                         borderRadius: 14,
//                         boxShadow: "0 2px 8px rgba(44, 62, 80, 0.06)",
//                         padding: "32px 36px 28px 36px",
//                         margin: "0 auto 12px auto",
//                         maxWidth: 500,
//                         color: "#31373d",
//                         fontSize: 17,
//                         lineHeight: 1.8,
//                         listStyle: "none"
//                       }}
//                     >
//                       <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 18 }}>
//                         <span style={{ color: '#5c6ac4', marginRight: 14, marginTop: 2, fontSize: 20 }}>✔</span>
//                         <span>Select the fields you want to include in your contact form in the <b>Widget</b> section.</span>
//                       </li>
//                       <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 18 }}>
//                         <span style={{ color: '#5c6ac4', marginRight: 14, marginTop: 2, fontSize: 20 }}>✔</span>
//                         <span>Click <b>Create Contact Form</b> to save your selection.</span>
//                       </li>
//                       <li style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 18 }}>
//                         <span style={{ color: '#5c6ac4', marginRight: 14, marginTop: 2, fontSize: 20 }}>✔</span>
//                         <span>Go to your Shopify admin, open <b>Online Store &gt; Themes &gt; Customize</b>, and add the EasyForm block to your desired page/section.</span>
//                       </li>
//                       <li style={{ display: 'flex', alignItems: 'flex-start' }}>
//                         <span style={{ color: '#5c6ac4', marginRight: 14, marginTop: 2, fontSize: 20 }}>✔</span>
//                         <span>Publish your changes. Your contact form will now appear on your store with the selected fields.</span>
//                       </li>
//                     </ul>
//             </Card>
//           </Layout.Section>
//         </Layout>
//       </Page>
//     </Box>
//   );
// } 

import { Page, Card, Layout, Box } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export const loader = async () => null;

export default function Screencast() {
  return (
    <Box background="bg-surface-secondary" minHeight="100vh" padding="400">
      <Page>
        <TitleBar title="Screencast Requirements" />
        <Layout>
          <Layout.Section>
            <Card padding="0" sectioned>
              {/* ✅ Instructions */}
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
                  listStyle: "none",
                }}
              >
                <li style={{ display: "flex", alignItems: "flex-start", marginBottom: 18 }}>
                  <span style={{ color: "#5c6ac4", marginRight: 14, marginTop: 2, fontSize: 20 }}>✔</span>
                  <span>Select the fields you want to include in your contact form in the <b>Widget</b> section.</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", marginBottom: 18 }}>
                  <span style={{ color: "#5c6ac4", marginRight: 14, marginTop: 2, fontSize: 20 }}>✔</span>
                  <span>Click <b>Create Contact Form</b> to save your selection.</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", marginBottom: 18 }}>
                  <span style={{ color: "#5c6ac4", marginRight: 14, marginTop: 2, fontSize: 20 }}>✔</span>
                  <span>Go to your Shopify admin, open <b>Online Store &gt; Themes &gt; Customize</b>, and add the EasyForm block to your desired page/section.</span>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start" }}>
                  <span style={{ color: "#5c6ac4", marginRight: 14, marginTop: 2, fontSize: 20 }}>✔</span>
                  <span>Publish your changes. Your contact form will now appear on your store with the selected fields.</span>
                </li>
              </ul>
                            {/* ✅ Video Section */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h3>Can you please check the following video on how to set-up the APP:</h3>
                <video
                  width="100%"
                  height="auto"
                  controls
                  style={{
                    maxWidth: "600px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(44,62,80,0.15)",
                    marginBottom: "20px",
                  }}
                >
                  <source src="https://cdn.shopify.com/videos/c/o/v/68845530bc3e464987b7d89cca950f59.mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </Box>
  );
}

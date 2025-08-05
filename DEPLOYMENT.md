# EasyForm Deployment Guide

## Vercel Deployment

### Prerequisites
1. A Vercel account
2. Your Shopify app credentials

### Environment Variables Setup

Set the following environment variables in your Vercel project:

```bash
# Shopify App Configuration
SHOPIFY_API_KEY="your_shopify_api_key"
SHOPIFY_API_SECRET="your_shopify_api_secret"
SHOPIFY_APP_URL="https://your-app-url.vercel.app"
SCOPES="write_products,read_products,read_metaobjects,write_metaobjects,write_metaobject_definitions,read_metaobject_definitions"

# Environment
NODE_ENV="production"
```

### Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy the app
4. Update your Shopify app configuration with the new URL

### Local Development

For local development:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Troubleshooting

If you encounter "Application Error":

1. Check that all environment variables are set correctly
2. Check Vercel function logs for specific error messages
3. Ensure the Shopify app URLs are updated in your Shopify Partner dashboard

### Common Issues

1. **Environment Variables**: Double-check all environment variables are set in Vercel
2. **Shopify App URLs**: Update your app URLs in the Shopify Partner dashboard after deployment
3. **CORS Issues**: The app should handle CORS automatically, but check if your domain is whitelisted

### Notes

- This app uses memory session storage, so sessions will be lost when the server restarts
- No database is required for this application
- The app stores form configurations using Shopify's metaobjects API 
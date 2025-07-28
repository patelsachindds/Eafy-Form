# EasyForm Deployment Guide

## Vercel Deployment

### Prerequisites
1. A Vercel account
2. A PostgreSQL database (you can use Vercel Postgres, Supabase, or any other PostgreSQL provider)
3. Your Shopify app credentials

### Environment Variables Setup

Set the following environment variables in your Vercel project:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Shopify App Configuration
SHOPIFY_API_KEY=d137260ff0f9eb2a82f4539487dfb9ec
SHOPIFY_API_SECRET=3abc37d2e13756a4ddeb87d1ca73133e
SHOPIFY_APP_URL="https://eafy-form.vercel.app/"
SCOPES="write_products,read_products,read_metaobjects,write_metaobjects,write_metaobject_definitions,read_metaobject_definitions"

# Environment
NODE_ENV="production"
```

### Database Setup

1. Create a PostgreSQL database
2. Get the connection string
3. Set the `DATABASE_URL` environment variable in Vercel
4. The app will automatically run migrations on deployment

### Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy the app
4. Update your Shopify app configuration with the new URL

### Local Development

For local development, you can use SQLite:

```bash
# Install dependencies
npm install

# Set up development database
npm run dev:db

# Start development server
npm run dev
```

### Troubleshooting

If you encounter "Application Error":

1. Check that all environment variables are set correctly
2. Verify the database connection
3. Check Vercel function logs for specific error messages
4. Ensure the Shopify app URLs are updated in your Shopify Partner dashboard

### Common Issues

1. **Database Connection**: Make sure your PostgreSQL database is accessible from Vercel
2. **Environment Variables**: Double-check all environment variables are set in Vercel
3. **Shopify App URLs**: Update your app URLs in the Shopify Partner dashboard after deployment
4. **CORS Issues**: The app should handle CORS automatically, but check if your domain is whitelisted 
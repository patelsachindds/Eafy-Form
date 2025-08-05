# EasyForm Deployment Guide

## Vercel Deployment

### Prerequisites
1. A Vercel account
2. Your Shopify app credentials
3. A PostgreSQL database (recommended: Vercel Postgres, Railway, or PlanetScale)

### Environment Variables Setup

Set the following environment variables in your Vercel project:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:5432/database_name"

# Shopify App Configuration
SHOPIFY_API_KEY="your_shopify_api_key"
SHOPIFY_API_SECRET="your_shopify_api_secret"
SHOPIFY_APP_URL="https://your-app-url.vercel.app"
SCOPES="write_products,read_products,read_metaobjects,write_metaobjects,write_metaobject_definitions,read_metaobject_definitions"

# Environment
NODE_ENV="production"
```

### Database Setup

This app uses Prisma with PostgreSQL for session storage. You'll need to:

1. Create a PostgreSQL database
2. Set the `DATABASE_URL` environment variable
3. Run database migrations on deployment

### Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Add build command override in Vercel: `npm run setup && npm run build`
4. Deploy the app
5. Update your Shopify app configuration with the new URL

### Local Development

For local development:

```bash
# Install dependencies
npm install

# Set up database (make sure DATABASE_URL is configured)
npm run setup

# Start development server
npm run dev
```

### Database Commands

```bash
# Generate Prisma client and push schema to database
npm run setup

# Create and apply migrations
npm run db:migrate

# Reset database
npm run db:reset

# Open Prisma Studio
npm run db:studio
```

### Troubleshooting

If you encounter "Application Error":

1. Check that all environment variables are set correctly
2. Check Vercel function logs for specific error messages
3. Ensure the Shopify app URLs are updated in your Shopify Partner dashboard
4. Verify DATABASE_URL is correctly formatted and accessible

### Common Issues

1. **Environment Variables**: Double-check all environment variables are set in Vercel
2. **Database Connection**: Ensure DATABASE_URL is correct and the database is accessible from Vercel
3. **Shopify App URLs**: Update your app URLs in the Shopify Partner dashboard after deployment
4. **CORS Issues**: The app should handle CORS automatically, but check if your domain is whitelisted
5. **Prisma Client**: If you get Prisma client errors, ensure `prisma generate` was run during build

### Notes

- This app now uses Prisma with PostgreSQL for session storage
- Sessions will persist across server restarts
- The app stores form configurations using Shopify's metaobjects API 
- Database migrations are automatically applied during deployment 
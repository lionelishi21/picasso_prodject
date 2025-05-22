# AI-Driven E-commerce Platform

A multi-tenant e-commerce platform with AI-powered features and dynamic storefronts.

## Project Structure

```
.
├── packages/
│   ├── api-server/        # Backend API server
│   ├── component-lib/     # Shared component library
│   └── web-app/          # Frontend web application
```

## Setup Instructions

1. Install dependencies:
```bash
yarn install
```

2. Set up environment variables:

Create a `.env` file in the `packages/api-server` directory with the following variables:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ai-driven-ecommerce
NODE_ENV=development
```

3. Start MongoDB:
```bash
mongod
```

4. Seed the database:
```bash
cd packages/api-server
yarn seed
```

5. Start the development servers:

In separate terminals:
```bash
# Start API server
cd packages/api-server
yarn dev

# Start web app
cd packages/web-app
yarn dev
```

## Features

- Dynamic storefront generation
- AI-powered product recommendations
- Real-time inventory management
- Multi-tenant architecture
- Responsive component library

## Development

### Component Library

The component library is built using Lit and TypeScript. Components are designed to be:
- Reusable across different storefronts
- Customizable through properties
- Responsive and accessible
- Theme-aware

### API Server

The API server provides:
- RESTful endpoints for managing components and storefronts
- MongoDB integration for data persistence
- Multi-tenant support
- Authentication and authorization

### Web Application

The web application features:
- Dynamic storefront rendering
- Component customization interface
- Real-time preview
- Responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request




## License

MIT 
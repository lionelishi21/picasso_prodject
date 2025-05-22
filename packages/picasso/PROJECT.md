## E-commerce Storefront Builder Project Structure
* /client
* /src
    /components
      /atoms          # Basic UI elements
      /molecules      # Composite components
      /organisms      # Complex UI sections
      /templates      # Page templates
    /context          # React context providers
    /pages            # Application pages
    /utils            # Utility functions
    /editor           # Builder/editor components
    /styles           # Global styles and theming
    App.js            # Main application component
    index.js          # Entry point

/server
  /src
    /models           # Mongoose schemas
    /controllers      # API endpoint handlers
    /routes           # API routes
    /config           # Configuration
    /middleware       # Express middleware
    app.js            # Express application
    server.js         # Server entry point

/shared              # Shared types and utilities
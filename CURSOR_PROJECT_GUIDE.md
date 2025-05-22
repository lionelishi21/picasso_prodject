

```markdown
# CURSOR AI PROJECT GUIDE: AI-Driven Tenant E-commerce Platform

**Last Updated:** YYYY-MM-DD

## 1. Project Overview

**Project Name:** [Your Project Name - e.g., "AuraStore", "TenantSpark"]
**Core Goal:** To build an AI-driven, multi-tenant e-commerce platform.
**Key Differentiator:** Tenants (users who own stores) can customize their storefront's landing page using:
    1.  AI-driven predefined and custom text prompts.
    2.  A visual drag-and-drop interface for arranging components.
    3.  Scraping an existing e-commerce website to inspire layout and design (not direct copy).

## 2. Core Architecture Principles

*   **Multi-Tenancy:** The system must support multiple isolated tenants. Each tenant has their own store, products, orders, and storefront configuration.
*   **Tenant Identification:** Primarily via subdomain (e.g., `tenant1.yourplatform.com`) or a custom header in API requests. Database queries must be scoped to the current tenant.
*   **API-First:** The backend will expose a RESTful API that the frontend (and potentially other services) will consume.
*   **Dynamic Storefront Rendering:** Storefronts are not statically built per tenant. They are dynamically rendered based on a JSON configuration specific to each tenant.
*   **Modularity:** Aim for modular components and services for better maintainability and scalability.

## 3. Technology Stack

*   **Frontend Framework:** **Lit Library** (Web Components)
    *   Language: TypeScript (preferred) or JavaScript.
    *   Focus: Reusable, performant, customizable components.
*   **Backend Framework:** **Node.js with Express.js** (or specify if different, e.g., NestJS)
    *   Language: TypeScript (preferred) or JavaScript.
*   **Database:** **PostgreSQL** (or specify if different, e.g., MongoDB)
    *   Schema should enforce tenant isolation (e.g., `tenant_id` foreign keys).
*   **AI Integration:**
    *   **LLM Provider:** OpenAI API (e.g., GPT-3.5/4)
    *   **Usage:**
        *   Translating user text prompts into structured JSON layout configurations.
        *   Interpreting scraped website data into layout suggestions.
        *   Potentially for generating product descriptions, marketing copy, etc. (future).
*   **Website Scraping:** **Puppeteer** or **Playwright** (Node.js libraries).
*   **Drag & Drop:** A suitable JS library compatible with Lit (e.g., `SortableJS`, `interact.js`).
*   **Authentication:** JWT-based authentication for tenant admins.

## 4. Key Data Models (Conceptual)

*   `Tenant`: (id, store_name, subdomain, owner_user_id, configuration_id, api_key, created_at, updated_at)
*   `User`: (id, tenant_id (nullable for platform admins), email, password_hash, role ['tenant_admin', 'platform_admin'], created_at, updated_at)
*   `StorefrontConfiguration`: (id, tenant_id, layout_json, custom_css, ai_prompt_history, active_theme_id, created_at, updated_at)
    *   `layout_json`: The core JSON defining the order and properties of Lit components for the storefront.
*   `Product`: (id, tenant_id, name, description, price, images_json, categories_json, stock_quantity, created_at, updated_at)
*   `Order`: (id, tenant_id, customer_user_id (or guest details), product_details_json, total_price, status, shipping_address_json, created_at, updated_at)
*   `LitComponentDefinition`: (id, component_name, available_props_schema_json, default_props_json) - *For defining what components are available in D&D and their configurable props.*

## 5. Core Storefront Customization Mechanisms

### 5.1. AI Prompts:
*   Tenant provides a text prompt (e.g., "modern minimalist for a luxury watch brand").
*   Backend uses LLM to generate a `layout_json` for the `StorefrontConfiguration`.
*   LLM should be guided to output JSON compatible with predefined Lit component names and their expected props.

### 5.2. Drag & Drop Interface:
*   Visual editor for tenants to arrange predefined Lit components (Hero, ProductGrid, CTA, etc.).
*   Tenants can customize properties of each component instance (text, images, colors, etc.).
*   The state of the D&D editor serializes to/from the `layout_json`.

### 5.3. Website Scraping (for Inspiration):
*   Tenant provides a URL of an e-commerce site.
*   Backend scrapes the site for structural elements (sections, columns), dominant colors, and font styles.
*   **Crucially, this is for INSPIRATION.** The scraped data is then fed to an LLM to suggest a `layout_json` using *our* platform's Lit components, not to directly copy HTML/CSS.
*   Focus on layout structure, color palette, and typography style rather than exact replication.

## 6. Key Lit Component Responsibilities

*   **`LayoutEngine` (or similar):** A master Lit component that takes the `layout_json` and dynamically renders the specified child Lit components with their given props.
*   **Standard E-commerce Components:** `Header`, `Footer`, `HeroSection`, `ProductCard`, `ProductGrid`, `CallToAction`, `TestimonialSection`, `FeatureList`, etc. These should be designed to be highly configurable via props.
*   **Styling:** Components should be stylable via CSS Custom Properties and potentially through props that map to styles. Tenants might also have a `custom_css` field in their `StorefrontConfiguration`.

## 7. Important Considerations / Guiding Principles

*   **Tenant Data Isolation:** This is paramount. No tenant should ever be able to access another tenant's data.
*   **Performance:** Lit is chosen for performance. Keep components lean and efficient. Lazy load where appropriate.
*   **User Experience (for Tenants):** The customization tools should be intuitive and powerful.
*   **Scalability:** Design with potential growth in mind, both in terms of tenants and traffic.
*   **Security:** Implement standard security best practices (input validation, XSS prevention, CSRF protection, secure API endpoints).
*   **Maintainability:** Write clean, well-documented code.

## How to Use This Guide with Cursor AI

 When starting a new development session or tackling a complex feature, please refer to this document. You can say:
*"I'm working on the AI-Driven Tenant E-commerce Platform. Please remember the context from `CURSOR_PROJECT_GUIDE.md`."*
Or, copy-paste relevant sections if needed. Key areas to remind the AI about:
*   The core multi-tenant architecture.
*   The use of Lit and dynamic JSON-based layouts.
*   The specific roles of AI in prompt-to-layout and scrape-to-layout.

---

**Instructions for you (the user):**

1.  **Fill in the Blanks:** Replace `Picasso`, specify your database MongodbL.
2.  **Save it:** Save this as `CURSOR_PROJECT_GUIDE.md` (or a similar name) in your project's root directory.
3.  **Use it with Cursor:**
    *   At the start of a new chat session in Cursor, you can paste the content of this file or say something like: "I'm going to provide you with my project guide document. Please use this as context for our conversation." Then paste the content.
    *   For subsequent prompts, you can refer back to it: "Based on our project guide (`CURSOR_PROJECT_GUIDE.md`), how should I implement the tenant identification middleware?"
    *   If Cursor seems to forget or go off-track, remind it by referencing specific sections of this guide.
4.  **Keep it Updated:** As your project evolves (e.g., you decide on a different database, add a major new feature area), update this document.

This guide will help Cursor stay aligned with your project's specific requirements and architecture, leading to more relevant and useful code suggestions and explanations.



## 8. Tenant Admin Dashboard Entitlements

This dashboard is the control center for a tenant (store owner) to manage their individual e-commerce store and customize its appearance.

### 8.1. Dashboard / Overview
  **Purpose:** Provide a quick snapshot of store performance and important notifications.
    *   **Key Features:**
        *   Quick Stats (Sales, Orders, Customers).
        *   Recent Activity Feeds.
        *   Actionable Insights & Notifications.
        *   Quick Links to common tasks.

### 8.2. Storefront Design & Customization (Core AI/Lit Focus)
  **Purpose:** Allow tenants to visually design and customize their landing page and overall store theme using Lit components.
    *   **Key Features:**
        *   **Visual Editor (Drag & Drop):**
            *   Interactive canvas for arranging Lit components.
            *   Sidebar/Palette of draggable predefined Lit components (Hero, ProductGrid, CTA, TextBlock, Image, etc.).
            *   Reordering, adding, and removing components.
            *   **Dynamic Component Properties Panel:** Contextual panel to edit props of the selected Lit component (text, images, colors, links, component-specific settings).
            *   Save/Publish/Revert layout functionality.
            **AI Design Studio:**
            *   **Text Prompt Input:** For custom AI design instructions.
            *   **Predefined Prompts:** Selectable list of curated design themes/styles.
            *   **AI Generation Controls:** "Generate Design" button.
            *   **Suggestion Preview:** Mechanism to visualize AI-generated layout (e.g., in D&D canvas, or a separate preview).
            *   **Apply Suggestion:** To adopt the AI-generated layout.
            *   (Optional) AI Prompt History.
            **Website Scraper Tool (Design Inspiration):**
            *   **URL Input:** For target e-commerce site.
            *   **Scrape & Analyze Functionality.**
            *   **Inspiration Output:** Displays extracted dominant colors, font styles, and identified structural layout.
            *   **Apply as AI Prompt:** Option to convert scraped insights into an AI prompt for layout generation using platform's Lit components.
             **Theme & Global Styles:**
            *   Logo & Favicon uploader.
            *   Global Color Palette editor (primary, secondary, accent for CSS Custom Properties).
            *   Global Typography settings (font families for headings, body).
            *   (Optional) Custom CSS input area.
            **Storefront Preview:** Link to view the live or staging version of their store.

### 8.2.1. Lit Component Library Details for Storefront Design & Customization.

 This section details the Lit components required for both rendering the live storefront and powering the tenant admin customization tools.

#### A. Storefront Components (Draggable & Renderable on Live Site & in Editor)

These are the building blocks of the tenant's e-commerce landing page. They must be highly configurable via props, stylable (CSS Custom Properties & props), responsive, and accessible.

**`page-layout` / `storefront-shell`**
*   **Purpose:** Outermost container for a page (slots for header, footer, main content).
*   **Key Props:** `showHeader`, `showFooter`.
**`section-container`**
*   **Purpose:** Generic wrapper for content sections (background, padding, width).
*   **Key Props:** `backgroundColor`, `backgroundImageUrl`, `paddingTop`, `paddingBottom`, `maxWidth`, `fullWidth`.
*   **`grid-layout` / `column-layout`**
    *   **Purpose:** Creates multi-column layouts within a section.
    *   **Key Props:** `columns` (e.g., "2", "3", "1-2"), `gap`, `alignmentItems`, `justifyContent`.
    *   **Slots:** `column-1`, `column-2`, etc.
*   **`header-component`**
    *   **Purpose:** Site header.
    *   **Key Props:** `logoSrc`, `logoAlt`, `navigationItems` (array), `showSearch`, `showCartIcon`, `showLoginLink`, `sticky`.
    *   **Slots:** For custom header content.
*   **`footer-component`**
    *   **Purpose:** Site footer.
    *   **Key Props:** `copyrightText`, `linksColumns` (array), `socialMediaLinks` (array).
    *   **Slots:** For custom footer content.
*   **`hero-section`**
    *   **Purpose:** Prominent introductory section.
    *   **Key Props:** `backgroundImageUrl`, `backgroundColor`, `overlayColor`, `headlineText`, `subheadlineText`, `ctaButtonText`, `ctaButtonLink`, `textAlign`, `contentAlignment`, `imagePlacement`.
*   **`text-block`**
    *   **Purpose:** Displaying formatted text content.
    *   **Key Props:** `htmlContent` (or `markdownContent`), `textAlign`, `fontSize`, `textColor`.
*   **`image-component`**
    *   **Purpose:** Displaying a single image.
    *   **Key Props:** `src`, `alt`, `caption`, `linkUrl`, `aspectRatio`, `objectFit`.
*   **`button-component`**
    *   **Purpose:** A clickable button.
    *   **Key Props:** `text`, `linkUrl`, `style` ('primary', 'secondary'), `size`, `iconName`.
*   **`product-card`**
    *   **Purpose:** Displays a single product's summary.
    *   **Key Props:** `productId` (if fetching), or `productName`, `productImageUrl`, `productPrice`, `productSalePrice`, `productLink`, `showAddToCartButton`.
*   **`product-grid` / `product-listing`**
    *   **Purpose:** Displays a collection of `product-card` components.
    *   **Key Props:** `categoryFilter`, `tagFilter`, `collectionId`, `numberOfProducts`, `columns`, `sortBy`, `pagination`.
*   **`product-carousel`**
    *   **Purpose:** A sliding carousel of `product-card` components.
    *   **Key Props:** Similar to `product-grid`, plus `autoplay`, `showArrows`, `showDots`.
*   **`featured-products-section`**
    *   **Purpose:** Highlights key products with a section title.
    *   **Key Props:** `sectionTitle`, `productIds` (array), `layoutStyle`.
*   **`category-list` / `collection-list`**
    *   **Purpose:** Displays links (often with images) to product categories/collections.
    *   **Key Props:** `layoutStyle` ('grid', 'list', 'carousel'), `showImage`, `showTitle`.
*   **`call-to-action-section` (CTA)**
    *   **Purpose:** Section to encourage a specific user action.
    *   **Key Props:** `headlineText`, `bodyText`, `buttonText`, `buttonLink`, `backgroundImageUrl`, `backgroundColor`, `layout`.
*   **`testimonial-card`**
    *   **Purpose:** Displays a single customer testimonial.
    *   **Key Props:** `quoteText`, `authorName`, `authorTitle`, `authorImageSrc`, `rating`.
*   **`testimonial-section` / `testimonial-carousel`**
    *   **Purpose:** Displays multiple `testimonial-card` components.
    *   **Key Props:** `sectionTitle`, `testimonialsData` (array), `layoutStyle`.
*   **`feature-list-item`**
    *   **Purpose:** A single item in a list of features/benefits.
    *   **Key Props:** `iconName` (or `iconSrc`), `titleText`, `descriptionText`.
*   **`feature-list-section`**
    *   **Purpose:** Displays multiple `feature-list-item` components.
    *   **Key Props:** `sectionTitle`, `featuresData` (array), `columns`.
*   **`image-with-text-section`**
    *   **Purpose:** Layout with an image on one side and text on the other.
    *   **Key Props:** `imageUrl`, `imageAlt`, `imagePosition` ('left', 'right'), `headlineText`, `bodyText`, `ctaButtonText`, `ctaButtonLink`, `verticalAlignment`.
*   **`video-embed`**
    *   **Purpose:** Embed a video (e.g., YouTube, Vimeo).
    *   **Key Props:** `videoUrl` (or `videoId`, `platform`), `aspectRatio`, `autoplay`, `showControls`.
*   **`map-embed`**
    *   **Purpose:** Embed a map (e.g., Google Maps).
    *   **Key Props:** `address` or `coordinates`, `zoomLevel`, `apiKey`.
*   **`newsletter-signup-form`**
    *   **Purpose:** Simple form to collect email addresses.
    *   **Key Props:** `formActionUrl`, `placeholderText`, `submitButtonText`, `successMessage`.
*   **`banner-component`**
    *   **Purpose:** Promotional messages, announcements.
    *   **Key Props:** `text`, `backgroundColor`, `textColor`, `closable`, `linkUrl`.
*   **`spacer-component` / `divider-component`**
    *   **Purpose:** Adds vertical space or a visual line.
    *   **Key Props:** `height` (spacer), `color`, `thickness` (divider).
*   **`html-block` / `custom-code-block` (Use with extreme caution)**
    *   **Purpose:** Allows tenants to insert arbitrary HTML/JS/CSS.
    *   **Key Props:** `htmlContent`.

#### B. Editor UI Components (Tenant Admin Dashboard Only)

These components form the user interface of the customization tools themselves.

*   **Visual Editor (Drag & Drop) Interface:**
    *   **`storefront-editor-layout`**: Main wrapper for the visual editor.
    *   **`component-palette`**: Sidebar displaying draggable Storefront Components.
        *   **Sub-component:** `palette-item`.
    *   **`editor-canvas`**: Main area for D&D, rendering component instances.
        *   **Sub-component:** `editable-component-wrapper` (wraps Storefront Components on canvas, provides D&D handles, selection, etc.).
    *   **`properties-panel`**: Dynamically displays input fields to edit props of the selected Storefront Component.
        *   **Sub-components:** `property-input-text`, `property-input-textarea`, `property-input-number`, `property-input-colorpicker`, `property-input-image-uploader`, `property-input-select`, `property-input-toggle`, `property-input-repeater`.

*   **AI Design Studio Interface:**
    *   **`ai-design-studio-panel`**: Container for AI prompt input and controls.
        *   **Sub-components:** `ai-prompt-input`, `predefined-prompts-selector`, `ai-generate-button`, `ai-preview-area`, `ai-apply-suggestion-button`.

*   **Website Scraper Tool Interface:**
    *   **`website-scraper-panel`**: UI for the website scraping feature.
        *   **Sub-components:** `url-input-field`, `scrape-button`, `scraped-data-display`, `apply-scraped-inspiration-button`.

*   **Theme & Global Styles Interface:**
    *   **`theme-settings-panel`**: UI for managing global theme settings.
        *   **Sub-components:** `logo-uploader`, `favicon-uploader`, `color-palette-editor` (for CSS Custom Properties), `font-selector`, `custom-css-editor`.

*   **Shared Editor UI Utility Components:**
    *   **`modal-dialog`**
    *   **`button-bar`**
    *   **`loading-indicator`**
    *   **`notification-toast`**
    *   **`tabs-component`**
    *   **`accordion-component`**

**Key Considerations for Component Implementation:**
*   **Prop Schemas:** Define clear schemas for Storefront Component props to drive the `properties-panel`.
*   **State Management:** Carefully manage the `editor-canvas` state (`layout_json`).
*   **Communication:** Utilize Lit's event system or shared state for inter-component communication in the editor.
```

Okay, this is a fantastic and detailed frontend specification! Let's translate this into a robust backend design using MongoDB.


# Backend for Storefront Design & Customization (MongoDB)

## 1. Overview

This document outlines the backend design for enabling tenants to visually design and customize their storefronts. The backend will be responsible for storing storefront layouts, theme configurations, AI-generated design suggestions, managing versions, and serving the appropriate storefront data to the frontend. MongoDB is the chosen database.

## 2. Guiding Principles

*   **Tenant Isolation:** All data MUST be strictly scoped to a `tenantId`include a default tenant so it can be test locally.
*   **Flexibility:** The schema should accommodate a dynamic list of components and their properties.
*   **Versioning:** Allow tenants to save, publish, and revert designs.
*   **Performance:** Efficiently query and serve storefront configurations.
*   **Security:** Sanitize inputs, especially for custom HTML/CSS, and manage asset uploads securely.

## 3. Core Data Models (MongoDB Collections)

### 3.1. `StorefrontDesigns` Collection

This collection stores the primary design and configuration for each tenant's storefront. Typically, a tenant will have one active "landing page" design, but the model can support multiple named designs if needed in the future (e.g., for different campaign pages).

**Schema:**

```javascript
{
  _id: ObjectId(),
  tenantId: ObjectId(), // Indexed, Foreign Key to Tenants collection
  name: String, // e.g., "Default Landing Page", "Spring Sale 2024"
  layout: [ // Ordered array representing the visual editor canvas
    {
      instanceId: String, // Unique ID for this component instance on the page (e.g., UUID)
      componentType: String, // Name of the Lit component (e.g., "hero-section", "product-grid")
      props: {
        // Dynamic key-value pairs specific to the componentType
        // Example for "hero-section":
        // headlineText: "Welcome to Our Store!",
        // ctaButtonText: "Shop Now",
        // backgroundImageUrl: "url/to/image.jpg",
        // ... other props as defined in 8.2.1.A
      },
      // For container components like grid-layout, section-container:
      children: [ /* recursive layout structure */ ] // Optional: Array of nested component objects
    }
  ],
  globalStyles: {
    logoUrl: String,
    faviconUrl: String,
    colorPalette: {
      primary: String, // #RRGGBB
      secondary: String,
      accent: String,
      text: String,
      background: String,
      // ... any other globally defined colors
    },
    typography: {
      headingFontFamily: String, // e.g., "'Roboto', sans-serif"
      bodyFontFamily: String,   // e.g., "'Open Sans', sans-serif"
    },
    customCss: String // (Optional) Tenant-provided custom CSS
  },
  status: String, // "draft", "published"
  version: Number, // Incremental version number for this design
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date, // Timestamp of last publish
  // (Optional) AI Design Related Fields:
  // lastAIPrompt: String,
  // lastAIGeneratedLayout: [ /* layout structure */ ], // if we store last suggestion
}
```

**Indexes:**

*   `{ tenantId: 1 }`
*   `{ tenantId: 1, name: 1 }` (if multiple named designs are supported per tenant)
*   `{ tenantId: 1, status: 1 }`

### 3.2. `StorefrontDesignVersions` Collection

This collection stores historical snapshots of `StorefrontDesigns` to enable reverting.

**Schema:**

```javascript
{
  _id: ObjectId(),
  designId: ObjectId(), // Foreign Key to StorefrontDesigns._id
  tenantId: ObjectId(), // Denormalized for easier querying
  version: Number, // The version number this snapshot represents
  name: String, // Copied from original design for context
  layout: [ /* same structure as StorefrontDesigns.layout */ ],
  globalStyles: { /* same structure as StorefrontDesigns.globalStyles */ },
  createdAt: Date, // Timestamp when this version was saved (i.e., when the original was updated/published)
  // (Optional) Notes/reason for this version
}
```

**Indexes:**

*   `{ designId: 1, version: -1 }`
*   `{ tenantId: 1, designId: 1 }`

### 3.3. `AIPromptHistories` Collection (Optional)

If AI prompt history needs to be persisted long-term and is extensive.

**Schema:**

```javascript
{
  _id: ObjectId(),
  tenantId: ObjectId(),
  userId: ObjectId(), // User who initiated the AI generation
  promptType: String, // "text_input", "predefined_theme", "scraped_inspiration"
  promptData: { // Flexible field based on promptType
    // For "text_input": { text: "Modern and clean design for a coffee shop" }
    // For "predefined_theme": { themeName: "Earthy Tones" }
    // For "scraped_inspiration": {
    //   url: "https://example.com",
    //   extractedColors: ["#...", "#..."],
    //   extractedFonts: ["FontA", "FontB"],
    //   extractedLayoutStructure: { /* simplified structure */ }
    // }
  },
  // (Optional) generatedLayoutSuggestionHash: String, // Hash of the suggested layout to avoid storing full duplicates
  // (Optional) appliedToDesignId: ObjectId(), // If this suggestion was applied to a design
  createdAt: Date
}
```

**Indexes:**

*   `{ tenantId: 1, userId: 1 }`
*   `{ tenantId: 1, createdAt: -1 }`

### 3.4. `LitComponentDefinitions` Collection (Alternative to Hardcoding)

While the frontend defines Lit components, the backend needs to know about them for validation and potentially for populating the editor palette if it's dynamically driven.
Alternatively, this can be a configuration file within the backend service. A collection is useful if platform admins can define new components without code deploys. For simplicity, **a backend configuration file is often preferred for this.**

If using a collection:
**Schema:**
```javascript
{
    _id: ObjectId(),
    componentType: String, // Unique name, e.g., "hero-section"
    displayName: String, // "Hero Section"
    description: String,
    category: String, // "Layout", "Content", "Product"
    defaultProps: { /* default values for props */ },
    expectedProps: [ // For validation
        { name: "headlineText", type: "String", required: false, label: "Headline" },
        { name: "backgroundImageUrl", type: "String", required: false, label: "Background Image URL" },
        // ... more prop definitions including type, constraints, editor UI hints
    ],
    isContainer: Boolean, // Can this component host children?
    createdAt: Date,
    updatedAt: Date
}
```
**Note:** For most implementations, having a static configuration (e.g., a JSON or JS object) in the backend code defining these components and their props is simpler and sufficient. This config would mirror the details in `8.2.1.A`.

## 4. API Endpoints

All endpoints require authentication and tenant context (e.g., via JWT containing `tenantId` or a path parameter).

### 4.1. Storefront Design Management

*   **`GET /api/v1/storefront/designs`**
    *   **Purpose:** List available designs for the tenant (if multiple named designs are supported).
    *   **Response:** Array of `StorefrontDesign` summaries (e.g., `_id`, `name`, `status`, `updatedAt`).
*   **`POST /api/v1/storefront/designs`**
    *   **Purpose:** Create a new storefront design (e.g., for a campaign page).
    *   **Request Body:** `{ name: "New Campaign Page" }` (initial layout can be empty or default).
    *   **Response:** The created `StorefrontDesign` object.
*   **`GET /api/v1/storefront/designs/{designIdOrName}`**
    *   **Purpose:** Retrieve the current state (latest draft or published) of a specific storefront design.
    *   **Response:** The `StorefrontDesign` object.
*   **`PUT /api/v1/storefront/designs/{designIdOrName}`**
    *   **Purpose:** Save changes to a storefront design (updates the `draft` or main record).
    *   **Request Body:** Full `StorefrontDesign` object or a partial update with layout and globalStyles.
    *   **Logic:**
        1.  Increment `version` on the `StorefrontDesign` document.
        2.  Update `layout` and `globalStyles`.
        3.  Set `status` to "draft" (if not already published and being modified).
        4.  Update `updatedAt`.
    *   **Response:** The updated `StorefrontDesign` object.
*   **`POST /api/v1/storefront/designs/{designIdOrName}/publish`**
    *   **Purpose:** Publish the current design, making it live.
    *   **Logic:**
        1.  Retrieve the current `StorefrontDesign`.
        2.  Create a snapshot in `StorefrontDesignVersions` with the current `version`, `layout`, and `globalStyles`.
        3.  Update the `StorefrontDesign` document: set `status` to "published", update `publishedAt`.
    *   **Response:** Success message or the updated `StorefrontDesign` object.
*   **`GET /api/v1/storefront/designs/{designIdOrName}/versions`**
    *   **Purpose:** List available versions for a design to revert to.
    *   **Response:** Array of `StorefrontDesignVersion` summaries (e.g., `version`, `createdAt`).
*   **`POST /api/v1/storefront/designs/{designIdOrName}/revert/{versionNumber}`**
    *   **Purpose:** Revert the design to a specific previous version.
    *   **Logic:**
        1.  Fetch the specified `versionNumber` from `StorefrontDesignVersions`.
        2.  Update the main `StorefrontDesign` document's `layout` and `globalStyles` with the data from the version.
        3.  Increment the `version` on the main `StorefrontDesign` document.
        4.  Set `status` to "draft".
        5.  (Optional) Create a new entry in `StorefrontDesignVersions` for this "reverted state" before applying, or simply mark the main design as a draft.
    *   **Response:** The updated (reverted) `StorefrontDesign` object.

### 4.2. AI Design Studio

*   **`POST /api/v1/storefront/ai/generate-design`**
    *   **Purpose:** Generate a design layout based on a prompt.
    *   **Request Body:**
        ```json
        {
          "promptType": "text_input" | "predefined_theme" | "scraped_inspiration",
          "promptData": { /* structure depends on promptType */ },
          "currentLayout": [ /* optional: current layout to base suggestions on */ ]
        }
        ```
    *   **Logic:**
        1.  (Optional) Save prompt to `AIPromptHistories`.
        2.  Pass the prompt and component definitions (from backend config or `LitComponentDefinitions`) to the AI service.
        3.  The AI service should return a structured layout compatible with the `StorefrontDesigns.layout` schema.
        4.  Validate the AI-generated layout against known components and prop types.
    *   **Response:**
        ```json
        {
          "suggestedLayout": [ /* AI-generated layout structure */ ],
          "previewId": "temp_preview_id" // (Optional) if suggestions are stored temporarily
        }
        ```
*   **`GET /api/v1/storefront/ai/prompt-history`**
    *   **Purpose:** Retrieve the tenant's AI prompt history.
    *   **Response:** Paginated list of `AIPromptHistory` entries.

### 4.3. Website Scraper Tool

*   **`POST /api/v1/tools/scrape-website`**
    *   **Purpose:** Scrape a target website for design inspiration.
    *   **Request Body:** `{ "url": "https://example.com" }`
    *   **Logic:**
        1.  Backend service makes a request to the URL.
        2.  Parses HTML/CSS to extract dominant colors, font styles, and attempts to identify a structural layout.
        3.  This is a complex task; may involve headless browsers or specialized parsing libraries.
    *   **Response:**
        ```json
        {
          "url": "https://example.com",
          "dominantColors": ["#RRGGBB", ...],
          "fontStyles": [{ "fontFamily": "...", "elements": ["h1", "p"] }, ...],
          "identifiedStructure": { /* simplified representation of layout elements */ }
        }
        ```

### 4.4. Asset Management (Logo, Favicon)

*   **`POST /api/v1/storefront/assets/upload`**
    *   **Purpose:** Upload logo, favicon, or other images for components.
    *   **Request Type:** `multipart/form-data`
    *   **Request Body:** File data, `assetType: "logo" | "favicon" | "componentImage"`.
    *   **Logic:**
        1.  Upload file to a designated storage (e.g., S3, GCS, local disk if simple).
        2.  Generate a public URL for the asset.
        3.  The frontend would then use this URL when updating the `StorefrontDesign` (e.g., in `globalStyles.logoUrl` or a component's `backgroundImageUrl` prop).
    *   **Response:** `{ "url": "https://cdn.example.com/tenantId/asset_name.png" }`

### 4.5. Public Storefront Data Endpoint

This is the endpoint the live/staging storefront will hit to get its configuration.

*   **`GET /public/v1/storefront/{tenantIdOrSlug}`** (or similar public path)
    *   **Purpose:** Fetch the **published** storefront design for a given tenant.
    *   **Logic:**
        1.  Find the `StorefrontDesign` for the `tenantId` (or resolve `tenantSlug` to `tenantId`).
        2.  Ensure `status` is "published".
        3.  Return the `layout` and `globalStyles`.
    *   **Response:**
        ```json
        {
          "layout": [ /* ... */ ],
          "globalStyles": { /* ... */ }
          // (Optional) other tenant-specific public info
        }
        ```

## 5. Backend Component Knowledge

The backend needs a way to "know" about the available Lit components (as listed in `8.2.1.A`) and their expected `props` with types. This is crucial for:

1.  **Validation:** When a tenant saves a design, validate that `componentType` is valid and `props` match the expected schema (name, type).
2.  **AI Interaction:** Provide the AI with a "manifest" of available components and their capabilities so it can generate valid layouts.
3.  **Editor Population (Optional):** If the sidebar/palette of draggable components in the editor is dynamically populated from the backend.

This "knowledge" can be maintained as:

*   **Configuration Files:** JSON or JavaScript/TypeScript objects directly in the backend codebase. This is often the simplest and most maintainable for a fixed set of components.
    *   Example (`component.config.js`):
        ```javascript
        export const LIT_COMPONENTS = {
          "hero-section": {
            displayName: "Hero Section",
            props: {
              backgroundImageUrl: { type: "string", editorType: "image-picker" },
              headlineText: { type: "string", editorType: "text-input" },
              // ... other props with types and optional editor hints
            }
          },
          "product-grid": { /* ... */ }
          // ... all components from 8.2.1.A
        };
        ```
*   **`LitComponentDefinitions` Collection:** (As described in 3.4) if more dynamic management is needed.

## 6. Key Backend Logic Points

*   **Validation Service:**
    *   Validate incoming `layout` structures against the known component definitions.
    *   Check prop types, required props, etc.
    *   Sanitize `htmlContent` for `html-block` and `customCss` to prevent XSS (e.g., using a library like `DOMPurify` if the HTML is to be rendered, or very strict validation if it's just for structure).
*   **AI Service Integration:**
    *   Abstract the actual AI model interaction behind a service interface.
    *   Prepare prompts for the AI, including the list of available components and their props.
    *   Parse and validate the AI's response.
*   **Asset Storage Integration:**
    *   Service for handling file uploads (logo, favicon, component images) to cloud storage (S3, GCS) or local disk.
    *   Ensure files are stored in a tenant-specific manner (e.g., `bucket/tenantId/filename`).
*   **Security:**
    *   Strict `tenantId` scoping on all database queries.
    *   Role-based access control (ensure only tenant admins can modify their design).
    *   Rate limiting on AI generation and scraper endpoints.

## 7. Future Considerations

*   **Multiple Designs per Tenant:** The `name` field in `StorefrontDesigns` allows for this. API endpoints might need adjustments (e.g., `POST /api/v1/tenants/{tenantId}/designs`).
*   **A/B Testing Designs:** Could involve linking multiple `StorefrontDesign` versions to an A/B test configuration.
*   **Analytics on Component Usage:** Track which components are most popular.
*   **Theme Marketplace:** If tenants could share/sell themes.

This backend structure provides a solid foundation for the ambitious storefront customization features outlined. Remember to prioritize tenant data security and input validation at every step.
```

### 8.3. E-commerce Operations
    *   **Purpose:** Manage the core business aspects of the e-commerce store.
    *   **Key Features:**
        *   **Product Management:**
            *   CRUD operations for products (name, description, price, images, SKU, categories, tags, inventory, variants).
            *   Category management.
            *   Inventory tracking.
        *   **Order Management:**
            *   View and filter orders.
            *   View order details.
            *   Update order status (Pending, Processing, Shipped, Delivered, Canceled, Refunded).
            *   Print invoices/packing slips.
            *   Basic refund/return processing.
        *   **Customer Management (Basic):**
            *   View customer list and basic order history.

### 8.4. Store Settings
    *   **Purpose:** Configure store-specific operational parameters.
    *   **Key Features:**
        *   **General Settings:** Store name, contact info, currency, timezone, units.
        *   **Payment Gateway Integration:** Configure Stripe, PayPal, etc.
        *   **Shipping & Delivery:** Zones, rates, methods, local pickup.
        *   **Tax Configuration:** Basic tax settings.
        *   **Domain Management:** Instructions/settings for custom domains.
        *   **Legal Pages:** Editors for Privacy Policy, ToS, Refund Policy.
        *   **(Advanced)** API Keys / Third-party Integrations.

### 8.5. Analytics & Reports (MVP: Basic)
    *   **Purpose:** Provide insights into store performance.
    *   **Key Features:**
        *   Basic Sales Reports.
        *   (Optional) Traffic Reports (if integrated).
        *   (Optional) Top Products.

### 8.6. Account & Billing (Tenant's account with *Your* Platform)
    *   **Purpose:** Manage the tenant's relationship and subscription with the platform.
    *   **Key Features:**
        *   Profile management (admin user details).
        *   Subscription plan details and management.
        *   Billing history and invoices from the platform.
        *   (Optional) User management for their own store staff.

### 8.7. Help & Support
    *   **Purpose:** Provide assistance to tenants.
    *   **Key Features:**
        *   Links to FAQs / Knowledge Base.
        *   Contact support mechanism.



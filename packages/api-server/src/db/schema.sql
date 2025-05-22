-- Component Types Table
CREATE TABLE component_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Component Designs Table
CREATE TABLE component_designs (
    id SERIAL PRIMARY KEY,
    component_type_id INTEGER REFERENCES component_types(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    properties JSONB NOT NULL DEFAULT '{}',
    styles JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Storefronts Table
CREATE TABLE storefronts (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Storefront Components Table (for storing which components are used in each storefront)
CREATE TABLE storefront_components (
    id SERIAL PRIMARY KEY,
    storefront_id INTEGER REFERENCES storefronts(id),
    component_design_id INTEGER REFERENCES component_designs(id),
    position INTEGER NOT NULL,
    properties JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default component types
INSERT INTO component_types (name, description) VALUES
    ('hero-banner', 'Hero banner component for storefronts'),
    ('product-grid', 'Product grid component for displaying products'),
    ('navigation-bar', 'Navigation bar component for storefronts'),
    ('search-bar', 'Search bar component for storefronts'),
    ('notification', 'Notification component for storefronts');

-- Insert some default designs for each component type
INSERT INTO component_designs (component_type_id, name, description, properties, styles) VALUES
    (1, 'Modern Hero', 'Modern hero banner with gradient background', 
    '{"title": "Welcome", "description": "Discover our products", "ctaText": "Shop Now", "ctaLink": "/shop"}',
    '{"background": "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)", "textColor": "white", "padding": "6rem"}'),
    
    (2, 'Grid Layout', 'Product grid with 4 columns',
    '{"layout": "grid", "columns": 4}',
    '{"gap": "2rem", "cardStyle": "shadow"}'),
    
    (3, 'Dark Navigation', 'Dark themed navigation bar',
    '{"logoUrl": "/logo.png", "items": [{"label": "Home", "href": "/"}, {"label": "Shop", "href": "/shop"}]}',
    '{"background": "#1a1a1a", "textColor": "white"}'); 
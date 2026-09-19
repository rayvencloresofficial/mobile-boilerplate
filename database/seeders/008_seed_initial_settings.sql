-- Seed Default Application Settings
INSERT INTO settings (
    id,
    key,
    value,
    category,
    description,
    is_public,
    is_encrypted
) VALUES
    -- Appearance: Theme Colors & Presets
    (
        '70000000-0000-0000-0000-000000000013',
        'appearance.theme_preset',
        '"sunset-terracotta"'::jsonb,
        'appearance',
        'Active design system color preset identifier',
        TRUE,
        FALSE
    ),
    (
        '70000000-0000-0000-0000-000000000014',
        'appearance.brand_color',
        '"#da5019"'::jsonb,
        'appearance',
        'Primary call-to-action brand accent hex color code',
        TRUE,
        FALSE
    ),
    (
        '70000000-0000-0000-0000-000000000015',
        'appearance.theme_presets',
        '[
            {
                "id": "modern-azure",
                "name": "Ocean Azure",
                "description": "Slate neutral canvas, deep navy structural headers, and electric azure CTAs.",
                "light": { "dominant": "#f8fafc", "secondary": "#334155", "accent": "#0284c7", "surface": "#ffffff" },
                "dark": { "dominant": "#0b0f19", "secondary": "#94a3b8", "accent": "#38bdf8", "surface": "#111827" }
            },
            {
                "id": "sunset-terracotta",
                "name": "Sunset Terracotta",
                "description": "Warm neutral ivory, structural stone bronze, and bold terracotta orange.",
                "light": { "dominant": "#faf8f5", "secondary": "#44403c", "accent": "#da5019", "surface": "#ffffff" },
                "dark": { "dominant": "#120f0d", "secondary": "#a8a29e", "accent": "#ff6b3d", "surface": "#1c1714" }
            },
            {
                "id": "emerald-sanctuary",
                "name": "Emerald Lagoon",
                "description": "Gentle sage mint canvas, deep pine structural accents, and radiant emerald highlights.",
                "light": { "dominant": "#f6faf7", "secondary": "#1e3a2b", "accent": "#059669", "surface": "#ffffff" },
                "dark": { "dominant": "#09140f", "secondary": "#6ee7b7", "accent": "#10b981", "surface": "#102018" }
            },
            {
                "id": "royal-indigo",
                "name": "Royal Indigo",
                "description": "Pearl lavender canvas, midnight indigo structural headers, and electric violet-indigo.",
                "light": { "dominant": "#f8f9ff", "secondary": "#1e1b4b", "accent": "#4f46e5", "surface": "#ffffff" },
                "dark": { "dominant": "#0c0c17", "secondary": "#a5b4fc", "accent": "#818cf8", "surface": "#151426" }
            },
            {
                "id": "island-amber",
                "name": "Island Amber",
                "description": "Warm sand neutral canvas, dark espresso headers, and rich sunrise amber gold.",
                "light": { "dominant": "#fafaf9", "secondary": "#292524", "accent": "#d97706", "surface": "#ffffff" },
                "dark": { "dominant": "#14120f", "secondary": "#d6d3d1", "accent": "#f59e0b", "surface": "#1f1b16" }
            },
            {
                "id": "tropical-coral",
                "name": "Tropical Coral",
                "description": "Porcelain blush canvas, dark garnet structural headers, and dynamic crimson coral.",
                "light": { "dominant": "#fff8f8", "secondary": "#3b1219", "accent": "#e11d48", "surface": "#ffffff" },
                "dark": { "dominant": "#170b0e", "secondary": "#fda4af", "accent": "#fb7185", "surface": "#241217" }
            },
            {
                "id": "forest-pine",
                "name": "Forest Pine",
                "description": "Crisp mint off-white canvas, deep evergreen structure, and vivid spring green.",
                "light": { "dominant": "#f5f8f5", "secondary": "#14331d", "accent": "#15803d", "surface": "#ffffff" },
                "dark": { "dominant": "#09120b", "secondary": "#86efac", "accent": "#4ade80", "surface": "#111c13" }
            },
            {
                "id": "plum-orchid",
                "name": "Plum Orchid",
                "description": "Lavender pearl canvas, midnight plum structure, and luminous neon orchid.",
                "light": { "dominant": "#faf7fd", "secondary": "#3b1359", "accent": "#9333ea", "surface": "#ffffff" },
                "dark": { "dominant": "#130a1c", "secondary": "#d8b4fe", "accent": "#c084fc", "surface": "#1e112b" }
            }
        ]'::jsonb,
        'appearance',
        'Available preset color schemes for dominant, secondary, accent, and surface tokens',
        TRUE,
        FALSE
    ),

    -- Appearance: Typography & Font Presets
    (
        '70000000-0000-0000-0000-000000000016',
        'appearance.font_family',
        '"Plus Jakarta Sans"'::jsonb,
        'appearance',
        'Primary body and interface font family',
        TRUE,
        FALSE
    ),
    (
        '70000000-0000-0000-0000-000000000017',
        'appearance.heading_font_family',
        '"Plus Jakarta Sans"'::jsonb,
        'appearance',
        'Display and section heading font family',
        TRUE,
        FALSE
    ),
    (
        '70000000-0000-0000-0000-000000000018',
        'appearance.font_scale',
        '1.0'::jsonb,
        'appearance',
        'Global typography scaling multiplier (0.85 to 1.25)',
        TRUE,
        FALSE
    ),
    (
        '70000000-0000-0000-0000-000000000019',
        'appearance.typography_preset',
        '"modern-saas"'::jsonb,
        'appearance',
        'Active typography pairing preset identifier',
        TRUE,
        FALSE
    ),
    (
        '70000000-0000-0000-0000-000000000020',
        'appearance.typography_presets',
        '[
            {
                "id": "modern-saas",
                "name": "Modern SaaS (Default)",
                "description": "Plus Jakarta Sans for both headings and body. Clean, contemporary, and cohesive.",
                "primaryFont": "Plus Jakarta Sans",
                "headingFont": "Plus Jakarta Sans",
                "fontScale": 1.0
            },
            {
                "id": "clean-minimalist",
                "name": "Clean Minimalist",
                "description": "Inter throughout the entire UI. Neutral, surgical, and maximum data legibility.",
                "primaryFont": "Inter",
                "headingFont": "Inter",
                "fontScale": 1.0
            },
            {
                "id": "tech-startup",
                "name": "Tech Startup",
                "description": "Distinctive Space Grotesk headings paired with ultra-crisp Inter body copy.",
                "primaryFont": "Inter",
                "headingFont": "Space Grotesk",
                "fontScale": 1.0
            },
            {
                "id": "editorial-prestige",
                "name": "Editorial Prestige",
                "description": "Sophisticated Playfair Display titles with Plus Jakarta Sans body ergonomics.",
                "primaryFont": "Plus Jakarta Sans",
                "headingFont": "Playfair Display",
                "fontScale": 1.02
            },
            {
                "id": "friendly-brand",
                "name": "Friendly Geometric",
                "description": "Rounded, welcoming Poppins headings paired with warm, accessible DM Sans body.",
                "primaryFont": "DM Sans",
                "headingFont": "Poppins",
                "fontScale": 1.0
            },
            {
                "id": "futuristic-studio",
                "name": "Futuristic Studio",
                "description": "Cutting-edge Outfit headings anchored by versatile Manrope body typography.",
                "primaryFont": "Manrope",
                "headingFont": "Outfit",
                "fontScale": 1.0
            },
            {
                "id": "developer-terminal",
                "name": "Developer Terminal",
                "description": "JetBrains Mono for titles and code paired with Inter for interface clarity.",
                "primaryFont": "Inter",
                "headingFont": "JetBrains Mono",
                "fontScale": 0.98
            }
        ]'::jsonb,
        'appearance',
        'Available typography pairing presets for UI fonts and headings',
        TRUE,
        FALSE
    )
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    is_public = EXCLUDED.is_public,
    is_encrypted = EXCLUDED.is_encrypted,
    updated_at = NOW();

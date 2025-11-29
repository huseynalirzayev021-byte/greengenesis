# Environmental Awareness App - Design Guidelines

## Design Approach

**Reference-Based with Modern Environmental Focus**
Drawing inspiration from: Ecosia (clean, trust-focused), Patagonia (authentic environmental messaging), and Notion (approachable interface). Azerbaijan's rich natural landscapes should be central to the visual identity.

## Layout & Structure

**Spacing System**: Use Tailwind spacing units of 3, 4, 6, 8, 12, 16, and 24 for consistent rhythm throughout.

**Container Strategy**:
- Full-width hero sections with inner max-w-7xl containers
- Content sections: max-w-6xl for comfortable reading
- Form areas: max-w-2xl for focused interaction

## Typography Hierarchy

**Font Selection**: 
- Headings: Outfit or Space Grotesk (modern, approachable)
- Body: Inter or DM Sans (clean readability)

**Scale**:
- Hero Headlines: text-5xl lg:text-6xl font-bold
- Section Headers: text-3xl lg:text-4xl font-semibold
- Subsections: text-xl lg:text-2xl font-medium
- Body Text: text-base lg:text-lg
- Small Text: text-sm

## Icons

Use Heroicons via CDN for consistent, modern iconography (leaf, globe, heart, photo, currency icons).

## Page-Specific Structures

### 1. Home Page
**Hero Section** (80vh):
- Large background image: Azerbaijan's nature (Caspian coastline, Caucasus mountains, or Gobustan landscapes)
- Centered headline + subtitle introducing the environmental mission
- Primary CTA button with blur backdrop

**10 Facts Section**:
- Masonry grid layout (2 columns on tablet, 3 on desktop)
- Each fact card: icon, statistic headline, explanatory text
- Alternating card heights for visual interest
- Staggered reveal on scroll

**Call-to-Action Band**: Encouraging tree purchases with statistics (trees planted, CO2 offset)

### 2. Environmental Impact Calculator
**Interactive Hero** (60vh):
- Split layout: Calculator input on left, visual impact display on right
- Real-time calculation updates
- Progress bars and equivalency visualizations

**Content Grid** (2-column on desktop):
- Left: Impact comparisons with icons (car emissions = X trees)
- Right: Azerbaijan-specific environmental challenges
- Infographic-style data presentation

### 3. Tree & Plant Rewards Program
**Program Explanation** (3-column feature grid):
- How it works: Purchase → Upload → Earn
- Partner vendors showcase
- Rewards benefits

**Receipt Upload Zone**:
- Prominent drag-drop area with preview
- Mobile-optimized camera upload
- Progress indicator for upload status

**Rewards Dashboard**:
- Large points display with conversion rate
- Transaction history table
- Redemption options

### 4. Support Us (Donation Page)
**Impact Story Section** (full-width):
- Background image: Environmental projects in action
- Overlay text explaining fund usage
- Transparency statement

**Donation Form** (centered, max-w-2xl):
- Pre-set amount buttons + custom input
- Stripe payment integration
- Trust indicators (secure payment badges)

**Impact Tracker**:
- Progress toward funding goals
- Recent contributions (anonymized)
- Project milestones achieved

### 5. About Us
**Team Introduction** (4-column grid on desktop, 2 on tablet):
- Student founder photos (authentic, casual)
- Name, role, school
- Personal environmental commitment statement

**Mission Statement**: Single column, centered, generous padding

## Component Library

**Navigation**:
- Fixed header with transparent-to-solid transition on scroll
- Logo left, nav links center, CTA button right
- Mobile: Hamburger menu with slide-in panel

**Cards**:
- Rounded corners (rounded-xl)
- Subtle shadows (shadow-lg on hover)
- Padding: p-6 to p-8
- White background with border or subtle gradient

**Forms**:
- Input fields: rounded-lg, p-4, border with focus ring
- Labels: text-sm font-medium, mb-2
- Upload zones: Dashed border, p-12, hover state

**Buttons**:
- Primary: Large (px-8 py-4), rounded-full, font-semibold
- Secondary: Outlined variant, same sizing
- Icon buttons: rounded-lg, p-3
- Blur backdrop when over images

**Footer**:
- 4-column layout: About, Quick Links, Contact, Newsletter signup
- Social media links
- Partnership logos
- Copyright and student attribution

## Images

**Hero Images Required**:
- Home page: Azerbaijan nature landscape (mountains/Caspian Sea)
- Impact calculator: Environmental contrast (polluted vs. clean)
- Donation page: Community environmental action

**Supporting Images**:
- Team photos for About Us (authentic student photos)
- Partner vendor logos
- Environmental infographics for facts section

## Animations

**Minimal, purposeful only**:
- Scroll-triggered fade-ins for fact cards
- Number counting animation for statistics
- Upload progress indicators
- Smooth transitions on navigation

## Responsive Behavior

- Mobile-first approach
- Receipt upload optimized for mobile camera
- Touch-friendly button sizes (min 44px height)
- Collapsible sections for dense content
- Stack columns to single column on mobile

## Accessibility

- High contrast text on image backgrounds
- Form labels and ARIA attributes
- Keyboard navigation throughout
- Focus indicators on interactive elements
- Alt text for all environmental imagery

**Trust & Credibility Focus**: Clean, professional design that builds confidence in donation handling and partnership legitimacy while maintaining youthful energy appropriate for student founders.
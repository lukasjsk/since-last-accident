# Page Layout and Container Width Conventions

## Overview
This document defines the unified container width and responsive padding standards implemented across the "Since Last Accident" application to ensure consistent, professional page layouts.

## Container Width Standards

### Semantic Container Types

| **Container Type** | **Max Width** | **Pixel Width** | **Usage** | **Applied To** |
|-------------------|---------------|-----------------|-----------|----------------|
| **Wide Container** | `max-w-7xl` | 1280px | Dashboard and listing pages | Home, Issues Index, Categories Index |
| **Content Container** | `max-w-4xl` | 896px | Content display pages | Issues Detail |
| **Large Content Container** | `max-w-6xl` | 1152px | Wide content display with statistics | Categories Detail |
| **Form Container** | `max-w-2xl` | 672px | Create and edit forms | Issues New, Issues Edit |
| **Auth Container** | `max-w-md` | 448px | Authentication pages | Login, Register |

## Responsive Padding Standards

### Progressive Responsive Padding
All non-authentication pages use progressive responsive padding:

```css
px-4 sm:px-6 lg:px-8
```

**Breakpoint Behavior:**
- **Mobile** (`px-4`): 16px horizontal padding
- **Small screens** (`sm:px-6`): 24px horizontal padding  
- **Large screens** (`lg:px-8`): 32px horizontal padding

### Authentication Pages
Authentication pages use minimal padding for mobile:

```css
px-4
```

## Standard Container Implementation

### Wide Container Pattern
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Dashboard or listing content */}
</div>
```

### Content Container Pattern  
```tsx
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Content display */}
</div>
```

### Form Container Pattern
```tsx
<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Form content */}
</div>
```

### Auth Container Pattern
```tsx
<div className="flex justify-center items-center min-h-screen px-4">
  <div className="w-full max-w-md">
    {/* Auth form */}
  </div>
</div>
```

## Implementation Guidelines

### When to Use Each Container

#### Wide Container (`max-w-7xl`)
- **Dashboard pages** with multiple cards/widgets
- **Listing pages** with tables or grids
- **Overview pages** with comprehensive information
- **Examples**: Home dashboard, Issues index, Categories index

#### Content Container (`max-w-4xl`)  
- **Detail pages** for reading content
- **Single-item display** pages
- **Documentation** or article-style content
- **Examples**: Issue detail pages

#### Large Content Container (`max-w-6xl`)
- **Statistics dashboards** with multiple metrics
- **Wide content display** with charts or extensive data
- **Category detail** pages with comprehensive stats
- **Examples**: Category detail pages

#### Form Container (`max-w-2xl`)
- **Create/edit forms** for data entry
- **Settings pages** with form controls
- **Narrow-focused** input interfaces
- **Examples**: Issue creation, Issue editing

#### Auth Container (`max-w-md`)
- **Login/register** forms
- **Authentication-related** pages
- **Error pages** with simple messages
- **Examples**: Login, Register

### Vertical Spacing Standards

- **Main content**: `py-8` (32px top/bottom)
- **Header sections**: `py-6` (24px top/bottom)
- **Card spacing**: `mb-6` or `mb-8` between major sections

## Responsive Behavior

### Mobile First Approach
All containers are designed mobile-first with progressive enhancement:

1. **Mobile** (0-640px): Comfortable padding, full-width content
2. **Tablet** (640px+): Increased padding for better visual hierarchy  
3. **Desktop** (1024px+): Maximum padding and optimal reading widths

### Content Optimization
- **Reading width**: 60-80 characters per line for optimal readability
- **Form width**: Narrow enough to feel focused but wide enough for complex forms
- **Dashboard width**: Wide enough to show multiple cards without crowding

## Benefits

### User Experience
- **Consistent visual hierarchy** across all pages
- **Optimal readability** for different content types
- **Professional appearance** with unified spacing
- **Mobile-friendly** responsive behavior

### Developer Experience  
- **Clear guidelines** for new page creation
- **Semantic naming** makes purpose obvious
- **Consistent patterns** reduce decision fatigue
- **Easy maintenance** with standardized approach

## Migration Notes

When creating new pages or updating existing ones:

1. **Identify page purpose** (dashboard, content, form, auth)
2. **Apply appropriate container** pattern from above
3. **Use consistent spacing** with py-8 for main content
4. **Test responsive behavior** at all breakpoints
5. **Ensure accessibility** with proper focus states

## Examples in Codebase

### Current Implementation
All route files have been updated to follow these conventions:

- `app/routes/home.tsx` - Wide container
- `app/routes/issues._index.tsx` - Wide container  
- `app/routes/issues.$id.tsx` - Content container
- `app/routes/issues.new.tsx` - Form container
- `app/routes/issues.$id.edit.tsx` - Form container
- `app/routes/categories._index.tsx` - Wide container
- `app/routes/categories.$id.tsx` - Large content container
- `app/routes/login.tsx` - Auth container
- `app/routes/register.tsx` - Auth container

This convention system ensures consistent, professional page layouts while maintaining optimal user experience across all device types.
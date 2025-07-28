# 🎨 Divider Components Documentation

## Overview
Komponen divider yang telah ditambahkan ke halaman utama untuk memberikan struktur visual yang lebih baik dan memisahkan setiap section dengan professional.

## 📦 Components

### 1. **Divider** (`src/components/ui/Divider.tsx`)
Komponen divider dasar dengan berbagai variant dan animasi.

#### Props:
```typescript
interface DividerProps {
  variant?: 'default' | 'gradient' | 'dotted' | 'thick' | 'minimal' | 'casino' | 'neon' | 'animated';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children?: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}
```

#### Variants:
- **default**: Border subtle dengan warna casino
- **gradient**: Gradient dari transparent ke neon green
- **dotted**: Border dotted style
- **thick**: Border tebal dengan warna neon green
- **minimal**: Border tipis dengan warna gray
- **casino**: Border dengan shadow neon green
- **neon**: Solid neon green dengan shadow glow
- **animated**: Divider dengan animasi scale

#### Usage:
```jsx
// Basic divider
<Divider variant="default" spacing="lg" />

// Divider with text
<Divider variant="gradient" spacing="xl">
  Section Title
</Divider>

// Animated divider
<Divider variant="casino" spacing="lg" animated />
```

### 2. **SectionDivider** (`src/components/ui/SectionDivider.tsx`)
Komponen divider yang lebih advanced dengan title, subtitle, dan icon.

#### Props:
```typescript
interface SectionDividerProps {
  title?: string;
  subtitle?: string;
  icon?: 'star' | 'sparkles' | 'crown' | 'trophy' | 'gift' | 'none';
  variant?: 'default' | 'premium' | 'casino' | 'minimal';
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}
```

#### Variants:
- **default**: Style standar dengan gradient line
- **premium**: Background gradient dengan styling premium
- **casino**: Background casino dengan border neon
- **minimal**: Style minimal tanpa background

#### Icons:
- **star**: Bintang (untuk highlight sections)
- **sparkles**: Kilauan (untuk partner sections)
- **crown**: Mahkota (untuk premium content)
- **trophy**: Trofi (untuk leaderboard/top content)
- **gift**: Hadiah (untuk bonus/FAQ sections)

#### Usage:
```jsx
<SectionDivider 
  title="Why Choose CGSG?"
  subtitle="Your trusted partner for safe and exciting online gambling"
  icon="star"
  variant="premium"
  spacing="xl"
/>
```

## 🎯 Implementation pada Halaman Utama

### Struktur Divider di IndexPage:

1. **Hero Banner → Promo Banner**
   ```jsx
   <Divider variant="gradient" spacing="lg" animated />
   ```

2. **Promo Banner → Hero Section**
   ```jsx
   <Divider variant="default" spacing="lg" />
   ```

3. **Hero Section → Banner Info**
   ```jsx
   <SectionDivider 
     title="Why Choose CGSG?"
     subtitle="Your trusted partner for safe and exciting online gambling"
     icon="star"
     variant="premium"
     spacing="xl"
   />
   ```

4. **Banner Info → Hero Slider**
   ```jsx
   <SectionDivider 
     title="Top Casinos"
     subtitle="Discover our handpicked selection of the best online casinos"
     icon="trophy"
     variant="casino"
     spacing="lg"
   />
   ```

5. **Hero Slider → FAQ Section**
   ```jsx
   <SectionDivider 
     title="Frequently Asked Questions"
     subtitle="Everything you need to know about FWF bonuses and rewards"
     icon="gift"
     variant="default"
     spacing="xl"
   />
   ```

6. **FAQ Section → Logo Slider**
   ```jsx
   <SectionDivider 
     title="Our Partners"
     subtitle="Trusted casino brands we work with"
     icon="sparkles"
     variant="minimal"
     spacing="xl"
   />
   ```

7. **Logo Slider → Chart**
   ```jsx
   <SectionDivider 
     title="Statistics & Analytics"
     subtitle="Data-driven insights for better gaming decisions"
     icon="crown"
     variant="minimal"
     spacing="lg"
   />
   ```

8. **Chart → Footer**
   ```jsx
   <Divider variant="minimal" spacing="xl" />
   ```

## 🎨 Design Features

### Animations:
- **Scale Animation**: Divider lines scale dari 0 ke 1
- **Fade Animation**: Text dan icons fade in dengan delay
- **Stagger Effect**: Left dan right lines animate secara berurutan

### Responsive Design:
- **Mobile**: Text size dan spacing disesuaikan
- **Desktop**: Full width dengan spacing optimal
- **Tablet**: Balanced layout untuk medium screens

### Color Scheme:
- **Primary**: Casino neon green (#00ff99)
- **Secondary**: Casino border subtle
- **Text**: White untuk titles, gray untuk subtitles
- **Background**: Casino card background dengan opacity

## 🚀 Benefits

1. **Visual Hierarchy**: Jelas memisahkan setiap section
2. **Professional Look**: Tampilan yang lebih terstruktur dan modern
3. **User Experience**: Memudahkan navigasi visual
4. **Consistency**: Design system yang konsisten
5. **Accessibility**: Proper semantic structure
6. **Performance**: Optimized animations dengan viewport detection

## 📱 Mobile Optimization

- Responsive spacing dan typography
- Touch-friendly interactive elements
- Optimized animation performance
- Proper contrast ratios
- Accessible color combinations

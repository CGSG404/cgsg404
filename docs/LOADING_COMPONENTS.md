# 🎰 **LOADING COMPONENTS DOCUMENTATION**

## 📋 **Overview**

Comprehensive loading system for CGSG Casino Guide with multiple variants and use cases. All components are optimized for casino theme with neon effects and smooth animations.

## 🎯 **Components Created**

### **1. Global Loading Page (`app/loading.tsx`)**
- **Purpose:** Next.js App Router global loading page
- **When shown:** During page navigation and initial loads
- **Features:** 
  - Animated dice rotation
  - Dynamic loading text
  - Floating particles
  - Progress bar
  - Casino-themed design

### **2. Enhanced Loading Spinner (`src/components/ui/loading-spinner.tsx`)**
- **Purpose:** Versatile spinner component with multiple variants
- **Variants:**
  - `default` - Simple spinner
  - `casino` - Casino themed with sparkles
  - `dice` - Animated dice rotation
  - `neon` - Neon glow effects
  - `minimal` - Clean minimal design

### **3. Loading Screen (`src/components/LoadingScreen.tsx`)**
- **Purpose:** Full-screen loading with multiple components
- **Components:**
  - `LoadingScreen` - Main wrapper component
  - `LoadingOverlay` - Quick overlay for modals
  - `InlineLoading` - For content areas
  - `CardLoadingSkeleton` - For card layouts

### **4. Updated PageLoader (`src/components/PageLoader.tsx`)**
- **Purpose:** Route change loading indicator
- **Features:** Uses new LoadingOverlay component

## 🎨 **Design System**

### **Color Scheme**
```css
Primary: #00ff99 (casino-neon-green)
Secondary: #9333ea (casino-neon-purple)
Background: #0e181c (casino-dark)
Cards: #1a2332 (casino-card-bg)
Borders: #2a3441 (casino-border-subtle)
```

### **Animation Principles**
- **Smooth transitions** - 0.3s duration
- **Easing functions** - easeInOut for natural feel
- **Staggered animations** - 0.1s delays for lists
- **Infinite loops** - For continuous loading states

## 🚀 **Usage Examples**

### **1. Global Loading (Automatic)**
```typescript
// app/loading.tsx - Automatically used by Next.js
export default function Loading() {
  // Casino-themed loading with dice and particles
}
```

### **2. Loading Spinner Variants**
```typescript
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';

// Basic usage
<LoadingSpinner size="md" />

// Casino themed
<LoadingSpinner 
  variant="casino" 
  size="lg" 
  text="Loading games..." 
  showText={true} 
/>

// Dice animation
<LoadingSpinner 
  variant="dice" 
  size="xl" 
  text="Rolling dice..." 
  showText={true} 
/>

// Neon effects
<LoadingSpinner 
  variant="neon" 
  size="lg" 
  text="Preparing casino..." 
  showText={true} 
/>
```

### **3. Loading Screen Wrapper**
```typescript
import { LoadingScreen } from '@/src/components/LoadingScreen';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <LoadingScreen
      isLoading={isLoading}
      variant="casino"
      text="Loading casino data..."
      showProgress={true}
      progress={75}
    >
      <YourContent />
    </LoadingScreen>
  );
}
```

### **4. Loading Overlay**
```typescript
import { LoadingOverlay } from '@/src/components/LoadingScreen';

function Modal() {
  const [saving, setSaving] = useState(false);
  
  return (
    <div>
      <YourModalContent />
      <LoadingOverlay 
        isLoading={saving} 
        text="Saving..." 
        variant="casino" 
      />
    </div>
  );
}
```

### **5. Inline Loading**
```typescript
import { InlineLoading } from '@/src/components/LoadingScreen';

function ContentArea() {
  const { data, isLoading } = useQuery(['data'], fetchData);
  
  if (isLoading) {
    return <InlineLoading text="Loading content..." variant="casino" />;
  }
  
  return <YourContent data={data} />;
}
```

### **6. Card Loading Skeleton**
```typescript
import { CardLoadingSkeleton } from '@/src/components/LoadingScreen';

function CasinoGrid() {
  const { data: casinos, isLoading } = useQuery(['casinos'], fetchCasinos);
  
  if (isLoading) {
    return <CardLoadingSkeleton count={6} />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {casinos.map(casino => <CasinoCard key={casino.id} casino={casino} />)}
    </div>
  );
}
```

## 🎛️ **Component Props**

### **LoadingSpinner Props**
```typescript
interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'casino' | 'dice' | 'neon' | 'minimal';
  text?: string;
  showText?: boolean;
}
```

### **LoadingScreen Props**
```typescript
interface LoadingScreenProps {
  isLoading: boolean;
  children: ReactNode;
  variant?: 'default' | 'casino' | 'dice' | 'neon' | 'minimal';
  text?: string;
  showProgress?: boolean;
  progress?: number;
  overlay?: boolean;
  className?: string;
}
```

## 🎯 **Best Practices**

### **1. Choose Right Variant**
- **`casino`** - Main loading screens, important actions
- **`dice`** - Game-related loading
- **`neon`** - Premium features, special effects
- **`minimal`** - Quick actions, secondary loading
- **`default`** - Fallback, simple cases

### **2. Performance Considerations**
- Use `CardLoadingSkeleton` for lists/grids
- Prefer `InlineLoading` over full overlays when possible
- Disable animations on low-end devices (handled automatically)
- Use `minimal` variant for frequent loading states

### **3. UX Guidelines**
- Always provide meaningful loading text
- Show progress bars for long operations (>3 seconds)
- Use consistent variants across similar features
- Avoid nested loading states

## 🔧 **Technical Features**

### **1. Server-Side Rendering Safe**
- All components handle `window` undefined gracefully
- No hydration mismatches
- Proper SSR/CSR compatibility

### **2. Performance Optimized**
- Framer Motion for smooth animations
- Conditional rendering to avoid unnecessary work
- Optimized for mobile devices
- Reduced motion support

### **3. Accessibility**
- Proper ARIA labels and roles
- Screen reader compatible
- Keyboard navigation support
- High contrast support

### **4. Responsive Design**
- Mobile-first approach
- Adaptive sizing based on screen size
- Touch-friendly interactions
- Optimized for all devices

## 📱 **Mobile Optimizations**

### **1. Performance**
- Reduced animation complexity on mobile
- Optimized particle counts
- Efficient rendering loops

### **2. Design**
- Appropriate sizing for touch screens
- Readable text at all sizes
- Proper spacing for mobile UI

### **3. Battery Efficiency**
- Conditional animations based on device capabilities
- Optimized frame rates
- Reduced GPU usage

## 🎨 **Customization**

### **1. Theme Integration**
All components use CSS custom properties:
```css
--casino-neon-green: #00ff99
--casino-neon-purple: #9333ea
--casino-dark: #0e181c
--casino-card-bg: #1a2332
--casino-border-subtle: #2a3441
```

### **2. Animation Customization**
Modify animation durations and effects:
```typescript
// Custom animation timing
<LoadingSpinner 
  className="[&>*]:animate-duration-500" 
  variant="casino" 
/>
```

### **3. Size Customization**
```typescript
// Custom sizes
<LoadingSpinner 
  className="w-20 h-20" 
  variant="neon" 
/>
```

## 🚀 **Production Ready**

✅ **Build Status:** All components build successfully  
✅ **SSR Compatible:** No hydration issues  
✅ **Performance:** Optimized for production  
✅ **Accessibility:** WCAG compliant  
✅ **Mobile:** Responsive and touch-friendly  
✅ **Browser Support:** Modern browsers  

All loading components are ready for production deployment and provide a consistent, professional loading experience across the entire CGSG Casino Guide application.

# 📋 List Report Page Documentation

## Overview
Halaman List Report telah berhasil ditampilkan kembali pada project ini. Halaman ini berfungsi untuk menampilkan daftar casino yang dilaporkan oleh komunitas dengan berbagai masalah seperti scam, unlicensed, atau fraud.

## 🎯 Features

### **Main Features:**
- **Search Functionality**: Pencarian casino berdasarkan nama
- **Report Cards**: Card display untuk setiap report
- **Mobile Responsive**: Swiper slider untuk mobile, grid untuk desktop
- **Report Dialog**: Form untuk submit report baru
- **Back to Top**: Floating button untuk scroll ke atas
- **Status Indicators**: Badge untuk status casino (Unlicensed, Scam, etc.)

### **Data Structure:**
```typescript
interface ReportData {
  id: string;
  casinoName: string;
  status: 'Unlicensed' | 'Scam Indicated' | 'Many Users Reported';
  lastReported: string;
  summary: string;
  url: string;
}
```

## 📁 File Structure

### **Route Handler:**
- **`app/list-report/page.tsx`** - Next.js route handler dengan metadata

### **Components:**
- **`src/components/ListReportPage.tsx`** - Main page component
- **`src/components/ReportCard.tsx`** - Individual report card
- **`src/components/ReportDialog.tsx`** - Report submission dialog
- **`src/components/BackToTop.tsx`** - Back to top button

### **Data:**
- **`src/data/reportData.ts`** - Report data dan interface

## 🎨 UI Components

### **1. Hero Section:**
```tsx
<section className="relative overflow-hidden pt-16 pb-12 sm:pb-20">
  <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
    {/* Breadcrumb Navigation */}
    {/* Title & Description */}
    {/* Author Info */}
    {/* Hero Image */}
  </div>
</section>
```

### **2. Search Bar:**
```tsx
<div className="relative w-full max-w-md">
  <input
    type="text"
    placeholder="Search for a casino report by name..."
    className="w-full px-6 py-4 pl-16 text-lg bg-casino-card-bg border border-casino-border-subtle rounded-full"
  />
  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
</div>
```

### **3. Mobile Slider:**
```tsx
<Swiper
  modules={[Pagination]}
  pagination={{ clickable: true }}
  spaceBetween={16}
  slidesPerView={1}
  className="pb-8"
>
  {/* Report Cards */}
</Swiper>
```

### **4. Desktop Grid:**
```tsx
<div className="hidden sm:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {filteredReports.map((report) => (
    <ReportCard key={report.id} {...report} />
  ))}
</div>
```

## 🎭 Report Card Features

### **Card Structure:**
- **Casino Name**: Dengan emoji warning 🟥
- **Status Badge**: Color-coded berdasarkan severity
- **Report Date**: Tanggal laporan terakhir
- **Issue Summary**: Ringkasan masalah (truncated)
- **Action Buttons**: Read More, Report Issue

### **Status Colors:**
- **Unlicensed**: Yellow badge (warning)
- **Scam Indicated**: Red badge (danger)
- **Many Users Reported**: Orange badge (alert)

### **Animations:**
- **Hover Effects**: Scale dan border color changes
- **Framer Motion**: Smooth animations untuk card interactions
- **Loading States**: Skeleton loading untuk better UX

## 🔧 Functionality

### **Search Feature:**
```typescript
const filteredReports = useMemo(() => {
  const term = search.trim().toLowerCase();
  return term 
    ? reports.filter((r) => r.casinoName.toLowerCase().includes(term)) 
    : reports;
}, [search, reports]);
```

### **Mobile Chunking:**
```typescript
const chunkedReports = useMemo(() => {
  const result: ReportData[][] = [];
  for (let i = 0; i < filteredReports.length; i += 5) {
    result.push(filteredReports.slice(i, i + 5));
  }
  return result;
}, [filteredReports]);
```

### **Scroll Detection:**
```typescript
useEffect(() => {
  const onScroll = () => {
    setShowBackTop(window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll);
  return () => window.removeEventListener('scroll', onScroll);
}, []);
```

## 📱 Responsive Design

### **Mobile (< 640px):**
- **Swiper Slider**: 1 slide per view dengan pagination
- **Stacked Layout**: Vertical card layout
- **Touch Friendly**: Large touch targets
- **Compact Spacing**: Optimized untuk small screens

### **Tablet (640px - 1024px):**
- **Grid Layout**: 2 columns
- **Balanced Spacing**: Medium spacing values
- **Hover States**: Enhanced interactions

### **Desktop (> 1024px):**
- **Grid Layout**: 3 columns
- **Full Features**: All hover effects dan animations
- **Optimal Spacing**: Large spacing untuk better readability

## 🚀 Navigation Integration

### **Navbar Links:**
- **Mobile Menu**: List Report link dengan icon
- **Desktop Menu**: Accessible dari main navigation

### **Footer Links:**
- **Community Section**: Added List Report link
- **Consistent Styling**: Matches other footer links

### **Search Integration:**
- **SearchBar Component**: List Report suggestions
- **SearchResults**: Direct links ke /list-report

## 📊 Sample Data

### **Current Reports:**
1. **ScamCasino Example** - Unlicensed
2. **FakeBet Casino** - Scam Indicated  
3. **NoPayCasino** - Many Users Reported
4. **FraudGaming Site** - Unlicensed
5. **BadLuck Casino** - Scam Indicated
6. **TrickyCasino** - Many Users Reported

### **Report Categories:**
- **Withdrawal Issues**: Delayed atau refused payments
- **Unlicensed Operations**: No valid gambling license
- **Rigged Games**: Manipulated game outcomes
- **Customer Service**: Poor atau non-existent support
- **Hidden Fees**: Unexpected charges
- **Identity Theft**: Personal data misuse

## 🔒 Security Features

### **Report Submission:**
- **Email Integration**: EmailJS untuk report submissions
- **Form Validation**: Required fields dan format checking
- **Toast Notifications**: Success/error feedback
- **Spam Protection**: Rate limiting dan validation

### **Data Protection:**
- **No Personal Data**: Reports don't store personal info
- **Anonymous Reporting**: Users can report anonymously
- **Secure Transmission**: HTTPS untuk all communications

## 📈 SEO Optimization

### **Metadata:**
```typescript
export const metadata: Metadata = {
  title: 'Casino List Report - Community Warnings & Trusted Insights | CGSG',
  description: 'List of online casinos reported by the community...',
  keywords: 'casino report, scam casino, blacklist casino...',
  openGraph: { /* Open Graph tags */ },
  twitter: { /* Twitter cards */ },
  alternates: { canonical: 'https://gurusingapore.com/list-report' }
};
```

### **Structured Data:**
- **Breadcrumb Navigation**: Proper hierarchy
- **Author Information**: GuruSG attribution
- **Date Information**: Last updated timestamps
- **Content Categories**: Proper categorization

## 🎯 Future Enhancements

### **Planned Features:**
1. **User Authentication**: Login untuk submit reports
2. **Report Voting**: Community voting on report validity
3. **Advanced Filtering**: Filter by status, date, severity
4. **Report Details**: Dedicated pages untuk each report
5. **Admin Panel**: Moderation tools untuk reports
6. **API Integration**: Real-time data dari external sources

### **Performance Optimizations:**
1. **Lazy Loading**: Images dan components
2. **Virtual Scrolling**: Untuk large datasets
3. **Caching**: Report data caching
4. **CDN Integration**: Static asset optimization

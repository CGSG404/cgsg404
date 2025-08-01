// types/next-image-fix.d.ts
import type { StaticImageData } from 'next/image';

declare module 'next/image' {
  import * as React from 'react';
  const Image: React.FC<React.ComponentProps<'img'> & {
    src: string | StaticImageData;
    width?: number | `${number}`;
    height?: number | `${number}`;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    quality?: number;
    sizes?: string;
    style?: React.CSSProperties;
    className?: string;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    onLoadingComplete?: (img: HTMLImageElement) => void;
  }>;
  export default Image;
}
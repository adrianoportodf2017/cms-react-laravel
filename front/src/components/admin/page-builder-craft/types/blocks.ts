// src/pageBuilder/types/blocks.ts
import { ReactNode } from 'react';

export interface ContainerProps {
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  background?: string;
  padding?: number;
}

export interface TextProps {
  text?: string;
  width?: number | string;
  height?: number | string;
  fontSize?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export interface ImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ButtonProps {
  text?: string;
  background?: string;
  color?: string;
  padding?: string;
  borderRadius?: number;
}

export interface HeroProps {
  title?: string;
  subtitle?: string;
  background?: string;
  textColor?: string;
}

export interface CardProps {
  title?: string;
  content?: string;
  background?: string;
  shadow?: string;
}

// src/App.tsx
import { useEffect } from 'react';
import { AppRouter } from './routes';
import { initDropdownController, initDefaultOpenDropdowns } from './lib/dropdonw-controller';
 
export default function App() {
  useEffect(() => {
    initDropdownController();
    initDefaultOpenDropdowns();
  }, []);
  
  return <AppRouter />;
}
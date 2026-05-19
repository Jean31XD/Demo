import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '@/features/cart/components/CartDrawer';
import SearchModal from '@/components/common/SearchModal';

interface MainLayoutProps { children: React.ReactNode; }

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
    <Header />
    <main style={{ flex: 1, maxWidth: 1320, margin: '0 auto', width: '100%', padding: '28px 28px 0', boxSizing: 'border-box' }}>
      {children}
    </main>
    <Footer />
    <CartDrawer />
    <SearchModal />
  </div>
);

export default MainLayout;

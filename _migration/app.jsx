/* global React, ReactDOM, Header, Home, PLP, PDP, Account, Footer, CartDrawer, QuickView, CompareBar, CompareModal, SearchModal, PRODUCTS, useTweaks, TweaksPanel, TweakSection, TweakColor */

const { useState, useEffect, useRef } = React;

function App() {
  // ----- Tweaks -----
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "#DC2B31",
    "accent2": "#2E3293"
  }/*EDITMODE-END*/;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
    document.documentElement.style.setProperty('--accent-2', t.accent2);
  }, [t.accent, t.accent2]);

  // ----- Routing state -----
  const [route, setRoute] = useState({ name: 'home' });
  const [history, setHistory] = useState(['home']);

  const navigate = (name, params = {}) => {
    setRoute({ name, ...params });
    setHistory(h => [...h, name]);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // ----- Cart -----
  const [cart, setCart] = useState([
    { id: 'p005', qty: 2 },
    { id: 'p008', qty: 1 },
  ]);
  const [cartOpen, setCartOpen] = useState(false);
  const [bumpKey, setBumpKey] = useState(0);

  const addToCart = (id, qty = 1) => {
    setCart(c => {
      const ex = c.find(x => x.id === id);
      if (ex) return c.map(x => x.id === id ? { ...x, qty: x.qty + qty } : x);
      return [...c, { id, qty }];
    });
    setCartOpen(true);
    setBumpKey(k => k+1);
  };
  const updateQty = (id, qty) => setCart(c => c.map(x => x.id === id ? { ...x, qty } : x));
  const removeFromCart = (id) => setCart(c => c.filter(x => x.id !== id));

  // ----- Quick view -----
  const [quickId, setQuickId] = useState(null);

  // ----- Compare -----
  const [compareIds, setCompareIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const toggleCompare = (id) => setCompareIds(prev => {
    if (prev.includes(id)) return prev.filter(x => x !== id);
    if (prev.length >= 4) return prev;
    return [...prev, id];
  });

  // ----- Search -----
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ----- Compute cart count -----
  const cartCount = cart.reduce((s,c) => s + c.qty, 0);

  // ----- Page render -----
  const page = () => {
    switch (route.name) {
      case 'home':
        return <Home onNav={navigate} onOpenProduct={(id)=>navigate('product', { productId: id })} onAddToCart={addToCart} onQuickView={(id)=>setQuickId(id)}/>;
      case 'catalog':
        return <PLP filter={{ category: route.category, onlyOffer: route.onlyOffer, brand: route.brand }} onOpenProduct={(id)=>navigate('product', { productId: id })} onAddToCart={addToCart} onQuickView={(id)=>setQuickId(id)} compareIds={compareIds} onCompareToggle={toggleCompare}/>;
      case 'product':
        return <PDP productId={route.productId} onNav={navigate} onAddToCart={addToCart} onOpenProduct={(id)=>navigate('product', { productId: id })} onCompareToggle={toggleCompare} compareIds={compareIds}/>;
      case 'brands':
        return <BrandsPage onNav={navigate} onOpenProduct={(id)=>navigate('product', { productId: id })}/>;
      case 'support':
        return <SupportPage onNav={navigate}/>;
      case 'account':
        return <Account onOpenProduct={(id)=>navigate('product', { productId: id })} onNav={navigate}/>;
      default:
        return <Home onNav={navigate}/>;
    }
  };

  return (
    <div className="app">
      <Header
        nav={route.name}
        onNav={navigate}
        cartCount={cartCount}
        bumpKey={bumpKey}
        onOpenCart={()=>setCartOpen(true)}
        onOpenSearch={()=>setSearchOpen(true)}
        compareCount={compareIds.length}
        onOpenCompare={()=>setCompareOpen(true)}
      />
      <main className="main">{page()}</main>
      <Footer onNav={navigate}/>

      <CartDrawer
        open={cartOpen}
        onClose={()=>setCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onCheckout={()=>{ setCartOpen(false); alert('Checkout · prototipo'); }}
        onOpenProduct={(id)=>navigate('product', { productId: id })}
      />

      {quickId && (
        <QuickView
          productId={quickId}
          onClose={()=>setQuickId(null)}
          onAddToCart={addToCart}
          onOpenProduct={(id)=>navigate('product', { productId: id })}
          onCompareToggle={toggleCompare}
          compareIds={compareIds}
        />
      )}

      <CompareBar
        compareIds={compareIds}
        onOpen={()=>setCompareOpen(true)}
        onClear={()=>setCompareIds([])}
        onRemove={(id)=>toggleCompare(id)}
      />
      {compareOpen && (
        <CompareModal
          compareIds={compareIds}
          onClose={()=>setCompareOpen(false)}
          onAddToCart={addToCart}
          onOpenProduct={(id)=>navigate('product', { productId: id })}
          onRemove={(id)=>toggleCompare(id)}
        />
      )}

      <SearchModal
        open={searchOpen}
        onClose={()=>setSearchOpen(false)}
        onOpenProduct={(id)=>navigate('product', { productId: id })}
        onNav={navigate}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Acento primario">
          <TweakColor
            label="Acento"
            value={t.accent}
            onChange={(v)=>setTweak('accent', v)}
            options={['#DC2B31', '#2E3293', '#0A0A0A', '#E2552C', '#0E7C5A', '#D9A21B']}
          />
          <div className="mono mono--xs mono--dim" style={{padding:'8px 0'}}>
            Rojo marca · Indigo marca · Mono ink · Naranja · Forest · Yellow
          </div>
        </TweakSection>
        <TweakSection title="Acento secundario">
          <TweakColor
            label="Secundario"
            value={t.accent2}
            onChange={(v)=>setTweak('accent2', v)}
            options={['#2E3293', '#DC2B31', '#0A0A0A', '#0E7C5A']}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

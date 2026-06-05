/* Kwise World — app shell: router, cart, tweaks, transitions. */
const { useState: useStateApp, useEffect: useEffectApp, useCallback, useRef: useRefApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "homepage": "editorial",
  "blue": "#1A56E8",
  "orange": "#FF6A1A",
  "font": "Sora + Manrope",
  "radius": 14,
  "density": "regular"
}/*EDITMODE-END*/;

const FONT_MAP = {
  "Sora + Manrope": { head: "'Sora', sans-serif", body: "'Manrope', sans-serif" },
  "Space Grotesk": { head: "'Space Grotesk', sans-serif", body: "'Manrope', sans-serif" },
  "Manrope only": { head: "'Manrope', sans-serif", body: "'Manrope', sans-serif" },
  "Plus Jakarta": { head: "'Plus Jakarta Sans', sans-serif", body: "'Plus Jakarta Sans', sans-serif" },
};

/* ---- routing helpers ---- */
function parseHash() {
  const h = (location.hash || "#/").replace(/^#/, "");
  const [path, qs] = h.split("?");
  const parts = path.split("/").filter(Boolean); // e.g. ["category","phones"]
  const query = {};
  if (qs) qs.split("&").forEach((kv) => { const [k, v] = kv.split("="); if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || ""); });
  const page = parts[0] || "home";
  const param = parts[1] || null;
  return { page, param, query };
}
function buildHash(page, param, query) {
  let h = "#/" + (page === "home" ? "" : page);
  if (param) h += "/" + param;
  const q = query && Object.keys(query).length ? "?" + Object.entries(query).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&") : "";
  return h + q;
}

/* ---- Checkout confirmation (completes the flow) ---- */
function CheckoutPage({ onNav, clearCart }) {
  useEffectApp(() => { clearCart(); window.scrollTo(0, 0); }, []);
  const ref = "KW-" + Math.floor(100000 + Math.random() * 900000);
  return (
    <div className="page"><div className="container">
      <div className="checkout-done">
        <span className="cd-check"><Icon name="check" size={40} /></span>
        <h1>Order placed!</h1>
        <p>Thank you for shopping with Kwise World. A confirmation has been sent and we'll reach out on WhatsApp to arrange delivery.</p>
        <div className="cd-ref">Order reference <strong>{ref}</strong></div>
        <div className="cd-btns">
          <Btn kind="primary" size="lg" iconAfter="arrowRight" onClick={() => onNav("home")}>Back to home</Btn>
          <Btn kind="ghost" size="lg" onClick={() => onNav("category", "all")}>Keep shopping</Btn>
        </div>
      </div>
    </div></div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="toast" key={toast.id}>
      <span className="toast-ic"><Icon name="check" size={16} /></span>
      <span>{toast.msg}</span>
    </div>
  );
}

function App() {
  const { PRODUCTS } = window.KW;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useStateApp(parseHash());
  const [items, setItems] = useStateApp(() => {
    try { return JSON.parse(localStorage.getItem("kw_cart") || "[]"); } catch (e) { return []; }
  });
  const [cartOpen, setCartOpen] = useStateApp(false);
  const [toast, setToast] = useStateApp(null);
  const [search, setSearch] = useStateApp("");
  const toastTimer = useRefApp(null);

  /* persist cart */
  useEffectApp(() => { localStorage.setItem("kw_cart", JSON.stringify(items)); }, [items]);

  /* hash sync */
  useEffectApp(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const onNav = useCallback((page, param = null, query = {}) => {
    const newHash = buildHash(page, param, query);
    if (location.hash === newHash) setRoute(parseHash()); // re-trigger if same
    else location.hash = newHash;
    if (page !== "product" && page !== "category") window.scrollTo({ top: 0, behavior: "auto" });
    else window.scrollTo({ top: 0 });
  }, []);

  const showToast = useCallback((msg) => {
    const id = Date.now();
    setToast({ id, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const onAdd = useCallback((product, qty = 1) => {
    if (product.oneTime && product.stock <= 0) return;
    setItems((prev) => {
      const ex = prev.find((i) => i.id === product.id);
      const cap = product.oneTime ? 1 : 99;
      if (ex) return prev.map((i) => i.id === product.id ? { ...i, qty: Math.min(cap, i.qty + qty) } : i);
      return [...prev, { id: product.id, qty: Math.min(cap, qty) }];
    });
    showToast(product.name + " added to cart");
    setCartOpen(true);
  }, [showToast]);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) => qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => i.id === id ? { ...i, qty } : i));
  }, []);
  const removeItem = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clearCart = useCallback(() => setItems([]), []);

  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  /* apply tweaks → CSS vars */
  const fonts = FONT_MAP[t.font] || FONT_MAP["Sora + Manrope"];
  const dens = { compact: 0.85, regular: 1, comfy: 1.15 }[t.density] || 1;
  const rootStyle = {
    "--blue": t.blue,
    "--orange": t.orange,
    "--font-head": fonts.head,
    "--font-body": fonts.body,
    "--radius": t.radius + "px",
    "--dens": dens,
  };

  let pageEl;
  switch (route.page) {
    case "category": pageEl = <CategoryPage onNav={onNav} onAdd={onAdd} route={route} search={search} />; break;
    case "product": pageEl = <ProductPage onNav={onNav} onAdd={onAdd} route={route} />; break;
    case "offers": pageEl = <OffersPage onNav={onNav} onAdd={onAdd} />; break;
    case "cart": pageEl = <CartPage onNav={onNav} items={items} products={PRODUCTS} updateQty={updateQty} removeItem={removeItem} />; break;
    case "checkout": pageEl = <CheckoutPage onNav={onNav} clearCart={clearCart} />; break;
    case "about": pageEl = <AboutPage onNav={onNav} />; break;
    case "login": pageEl = <AuthPage mode="login" onNav={onNav} />; break;
    case "signup": pageEl = <AuthPage mode="signup" onNav={onNav} />; break;
    default: pageEl = <HomePage onNav={onNav} onAdd={onAdd} heroVariant={t.homepage} />;
  }

  const isAuth = route.page === "login" || route.page === "signup";
  const routeKey = route.page + (route.param || "") + JSON.stringify(route.query);

  return (
    <div className="app" style={rootStyle}>
      {!isAuth && <Header route={route} onNav={onNav} cartCount={cartCount} onOpenCart={() => setCartOpen(true)} search={search} setSearch={setSearch} />}
      <main className="main" key={routeKey}>{pageEl}</main>
      {!isAuth && <Footer onNav={onNav} />}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={items} products={PRODUCTS} onNav={onNav} updateQty={updateQty} removeItem={removeItem} />
      <Toast toast={toast} />

      <TweaksPanel>
        <TweakSection label="Homepage direction" />
        <TweakRadio label="Hero layout" value={t.homepage} options={["editorial", "split"]} onChange={(v) => setTweak("homepage", v)} />
        <TweakSection label="Brand colors" />
        <TweakColor label="Primary blue" value={t.blue} options={["#1A56E8", "#0E47C8", "#1F6FEB", "#2342B8"]} onChange={(v) => setTweak("blue", v)} />
        <TweakColor label="Accent orange" value={t.orange} options={["#FF6A1A", "#FF7A33", "#F25C05", "#FF8A00"]} onChange={(v) => setTweak("orange", v)} />
        <TweakSection label="Typography" />
        <TweakSelect label="Font pairing" value={t.font} options={Object.keys(FONT_MAP)} onChange={(v) => setTweak("font", v)} />
        <TweakSection label="Layout" />
        <TweakSlider label="Card roundness" value={t.radius} min={4} max={24} step={1} unit="px" onChange={(v) => setTweak("radius", v)} />
        <TweakRadio label="Density" value={t.density} options={["compact", "regular", "comfy"]} onChange={(v) => setTweak("density", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

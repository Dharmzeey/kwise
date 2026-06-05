/* Kwise World — cart, about, auth pages + cart drawer. Exports to window. */
const { useState: useStateA } = React;

/* ===================== CART DRAWER ===================== */
function CartDrawer({ open, onClose, items, products, onNav, updateQty, removeItem }) {
  const { formatNaira } = window.KW;
  const lines = items.map((it) => ({ ...it, product: products.find((p) => p.id === it.id) })).filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  return (
    <div className={"drawer" + (open ? " open" : "")}>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer-panel" role="dialog" aria-label="Cart">
        <div className="drawer-head">
          <h3><Icon name="cart" size={20} /> Your cart <span className="drawer-count">{lines.reduce((s, l) => s + l.qty, 0)}</span></h3>
          <button className="iconbtn" onClick={onClose} aria-label="Close cart"><Icon name="close" /></button>
        </div>
        {lines.length === 0 ? (
          <div className="drawer-empty">
            <Icon name="cart" size={48} stroke={1.2} />
            <p>Your cart is empty.</p>
            <Btn kind="primary" onClick={() => { onClose(); onNav("category", "all"); }}>Start shopping</Btn>
          </div>
        ) : (
          <>
            <div className="drawer-lines">
              {lines.map((l) => (
                <div className="cart-line" key={l.id}>
                  <button className="cart-line-media" onClick={() => { onClose(); onNav("product", l.id); }}>
                    <Thumb product={l.product} size="card" />
                  </button>
                  <div className="cart-line-info">
                    <div className="cart-line-top">
                      <strong onClick={() => { onClose(); onNav("product", l.id); }}>{l.product.name}</strong>
                      <button className="iconbtn-sm" onClick={() => removeItem(l.id)} aria-label="Remove"><Icon name="trash" size={16} /></button>
                    </div>
                    <StatusPill status={l.product.status} />
                    <div className="cart-line-bot">
                      <div className="qty qty-sm">
                        <button onClick={() => updateQty(l.id, l.qty - 1)}><Icon name="minus" size={14} /></button>
                        <span>{l.qty}</span>
                        <button onClick={() => updateQty(l.id, l.qty + 1)} disabled={l.product.oneTime}><Icon name="plus" size={14} /></button>
                      </div>
                      <span className="cart-line-price">{formatNaira(l.product.price * l.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="drawer-sub"><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div>
              <p className="drawer-note">Delivery calculated at checkout.</p>
              <Btn kind="primary" size="lg" full iconAfter="arrowRight" onClick={() => { onClose(); onNav("cart"); }}>View cart &amp; checkout</Btn>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* ===================== CART PAGE ===================== */
function CartPage({ onNav, items, products, updateQty, removeItem }) {
  const { formatNaira } = window.KW;
  const lines = items.map((it) => ({ ...it, product: products.find((p) => p.id === it.id) })).filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const delivery = subtotal === 0 ? 0 : subtotal >= 500000 ? 0 : 5000;
  const total = subtotal + delivery;

  if (lines.length === 0) {
    return (
      <div className="page"><div className="container">
        <div className="empty empty-lg">
          <Icon name="cart" size={56} stroke={1.2} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Btn kind="primary" size="lg" iconAfter="arrowRight" onClick={() => onNav("category", "all")}>Browse products</Btn>
        </div>
      </div></div>
    );
  }
  return (
    <div className="page"><div className="container">
      <nav className="crumbs"><button onClick={() => onNav("home")}>Home</button><Icon name="chevron" size={13} /><span>Cart</span></nav>
      <h1 className="page-title">Your cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {lines.map((l) => (
            <div className="cart-row" key={l.id}>
              <button className="cart-row-media" onClick={() => onNav("product", l.id)}><Thumb product={l.product} size="card" /></button>
              <div className="cart-row-main">
                <div className="cart-row-head">
                  <div>
                    <strong onClick={() => onNav("product", l.id)}>{l.product.name}</strong>
                    <div className="cart-row-pills"><StatusPill status={l.product.status} />{l.product.oneTime && <span className="badge badge-ot"><Icon name="bolt" size={11} stroke={0} /> One-Time</span>}</div>
                  </div>
                  <button className="iconbtn-sm" onClick={() => removeItem(l.id)} aria-label="Remove"><Icon name="trash" size={17} /></button>
                </div>
                <div className="cart-row-bot">
                  <div className="qty">
                    <button onClick={() => updateQty(l.id, l.qty - 1)}><Icon name="minus" size={15} /></button>
                    <span>{l.qty}</span>
                    <button onClick={() => updateQty(l.id, l.qty + 1)} disabled={l.product.oneTime}><Icon name="plus" size={15} /></button>
                  </div>
                  <span className="cart-row-price">{formatNaira(l.product.price * l.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h3>Order summary</h3>
          <div className="sum-row"><span>Subtotal</span><span>{formatNaira(subtotal)}</span></div>
          <div className="sum-row"><span>Delivery</span><span>{delivery === 0 ? "Free" : formatNaira(delivery)}</span></div>
          {delivery > 0 && <p className="sum-hint">Add {formatNaira(500000 - subtotal)} more for free Lagos delivery.</p>}
          <div className="sum-row sum-total"><span>Total</span><strong>{formatNaira(total)}</strong></div>
          <Btn kind="primary" size="lg" full iconAfter="arrowRight" onClick={() => onNav("checkout")}>Checkout</Btn>
          <div className="sum-pay"><Icon name="shieldCheck" size={15} /> Secure checkout · transfer, card or USSD</div>
          <button className="link-btn cart-continue" onClick={() => onNav("category", "all")}>Continue shopping</button>
        </aside>
      </div>
    </div></div>
  );
}

/* ===================== ABOUT ===================== */
function AboutPage({ onNav }) {
  const values = [
    { icon: "shieldCheck", t: "Honest grading", d: "Brand New, UK-Used, Nigeria-Used — we label it plainly and disclose every flaw." },
    { icon: "bolt", t: "Real value", d: "Fair prices on quality tech, plus single-unit deals you won't find twice." },
    { icon: "whatsapp", t: "Human support", d: "Talk to a real person before and after you buy. We're here for the long run." },
    { icon: "refresh", t: "Fair returns", d: "If it isn't what we said it was, send it back within 7 days. Simple." },
  ];
  return (
    <div className="page">
      <section className="about-hero">
        <div className="container about-hero-in">
          <span className="eyebrow"><Icon name="shieldCheck" size={15} /> About Kwise World</span>
          <h1>Integrity — we mean<br />what we say.</h1>
          <p>Kwise World started in Computer Village with one rule: describe every device honestly, price it fairly, and stand behind it. From sealed flagships to carefully-graded used gadgets, what you read is what you get.</p>
        </div>
      </section>
      <div className="container">
        <div className="about-stats">
          <div><strong>8,000+</strong><span>Devices delivered</span></div>
          <div><strong>4.8★</strong><span>Average rating</span></div>
          <div><strong>36</strong><span>States reached</span></div>
          <div><strong>7-day</strong><span>Returns, no drama</span></div>
        </div>
        <section className="section">
          <div className="sec-head sec-head-center"><h2>What we stand for</h2></div>
          <div className="value-grid">
            {values.map((v) => (
              <div className="value-card" key={v.t}>
                <span className="value-ic"><Icon name={v.icon} size={24} /></span>
                <h3>{v.t}</h3><p>{v.d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="about-cta">
          <div className="about-cta-in">
            <div>
              <h2>Questions before you buy?</h2>
              <p>Chat with a real person on WhatsApp. We'll help you pick the right device.</p>
            </div>
            <div className="about-cta-btns">
              <Btn kind="orange" size="lg" icon="whatsapp">Chat on WhatsApp</Btn>
              <Btn kind="ghost" size="lg" iconAfter="arrowRight" onClick={() => onNav("category", "all")}>Shop now</Btn>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ===================== AUTH (Login + Sign up) ===================== */
function AuthPage({ mode, onNav }) {
  const isSignup = mode === "signup";
  const [show, setShow] = useStateA(false);
  const perks = [
    "Track your orders in real time",
    "Save addresses for faster checkout",
    "Get first dibs on One-Time Offers",
    "Build a wishlist of gadgets you love",
  ];
  return (
    <div className="page auth-page">
      <div className="auth-split">
        <div className="auth-aside">
          <a className="logo" onClick={() => onNav("home")}>
            <span className="logo-mark logo-mark-light">K<span className="logo-dot" /></span>
            <span className="logo-text logo-text-light">Kwise<span> World</span></span>
          </a>
          <h2>{isSignup ? "Join Kwise World." : "Welcome back."}</h2>
          <p className="auth-aside-tag">Integrity — we mean what we say.</p>
          <ul className="auth-perks">
            {perks.map((p) => <li key={p}><span className="perk-check"><Icon name="check" size={13} /></span>{p}</li>)}
          </ul>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-form">
            <div className="auth-tabs">
              <button className={!isSignup ? "on" : ""} onClick={() => onNav("login")}>Log in</button>
              <button className={isSignup ? "on" : ""} onClick={() => onNav("signup")}>Sign up</button>
            </div>
            <h1>{isSignup ? "Create your account" : "Log in to your account"}</h1>
            <form onSubmit={(e) => { e.preventDefault(); onNav("home"); }}>
              {isSignup && (
                <div className="field-row">
                  <label className="field"><span>First name</span><input type="text" placeholder="Ada" required /></label>
                  <label className="field"><span>Last name</span><input type="text" placeholder="Okafor" required /></label>
                </div>
              )}
              <label className="field"><span>Email or phone</span><input type="text" placeholder="you@example.com" required /></label>
              <label className="field">
                <span>Password</span>
                <div className="field-pass">
                  <input type={show ? "text" : "password"} placeholder="••••••••" required />
                  <button type="button" onClick={() => setShow(v => !v)}>{show ? "Hide" : "Show"}</button>
                </div>
              </label>
              {!isSignup && <div className="auth-row"><label className="check check-inline"><input type="checkbox" /><span className="check-box"><Icon name="check" size={12} /></span>Remember me</label><button type="button" className="link-btn">Forgot password?</button></div>}
              {isSignup && <label className="check check-inline auth-terms"><input type="checkbox" required /><span className="check-box"><Icon name="check" size={12} /></span>I agree to the Terms & Privacy Policy</label>}
              <Btn kind="primary" size="lg" full type="submit" iconAfter="arrowRight">{isSignup ? "Create account" : "Log in"}</Btn>
            </form>
            <div className="auth-or"><span>or continue with</span></div>
            <div className="auth-social">
              <button>Google</button><button>Apple</button>
            </div>
            <p className="auth-switch">
              {isSignup ? "Already have an account? " : "New to Kwise World? "}
              <button className="link-btn" onClick={() => onNav(isSignup ? "login" : "signup")}>{isSignup ? "Log in" : "Create one"}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CartDrawer, CartPage, AboutPage, AuthPage });

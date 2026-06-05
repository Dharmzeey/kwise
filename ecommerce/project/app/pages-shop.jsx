/* Kwise World — shop pages. Exports to window. */
const { useState: useStateS, useMemo, useEffect: useEffectS } = React;

/* ===================== HOME ===================== */
function HeroEditorial({ onNav }) {
  return (
    <section className="hero hero-editorial">
      <div className="container hero-in">
        <div className="hero-copy">
          <span className="eyebrow"><Icon name="shieldCheck" size={15} /> Integrity, every single sale</span>
          <h1>Gadgets you can <em>actually</em> trust.</h1>
          <p>iPhone &amp; Samsung, HP &amp; Lenovo, plus every accessory in between — brand new and clean UK-used, tested before it reaches you.</p>
          <div className="hero-cta">
            <Btn kind="primary" size="lg" iconAfter="arrowRight" onClick={() => onNav("category", "phones")}>Shop phones</Btn>
            <Btn kind="ghost" size="lg" onClick={() => onNav("offers")}><Icon name="bolt" size={18} stroke={0} /> One-Time Offers</Btn>
          </div>
          <div className="hero-stats">
            <div><strong>4.8★</strong><span>2,400+ reviews</span></div>
            <div><strong>24h</strong><span>Lagos delivery</span></div>
            <div><strong>100%</strong><span>Tested units</span></div>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-card hero-card-main">
            <Thumb product={{ thumb: "phone", tint: "blue" }} size="hero" />
            <div className="hero-card-tag"><span>iPhone 15 Pro Max</span><strong>₦1,850,000</strong></div>
          </div>
          <div className="hero-card hero-card-float hf1">
            <Thumb product={{ thumb: "laptop", tint: "indigo" }} size="card" />
          </div>
          <div className="hero-card hero-card-float hf2">
            <Thumb product={{ thumb: "powerbank", tint: "orange" }} size="card" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSplit({ onNav }) {
  const { PRODUCTS, formatNaira } = window.KW;
  const deal = PRODUCTS.find((p) => p.id === "ot-iphone-14-promax");
  return (
    <section className="hero hero-split">
      <div className="container hero-split-in">
        <div className="hs-left">
          <span className="eyebrow"><Icon name="bolt" size={15} stroke={0} /> Deal of the moment</span>
          <h1>Premium tech,<br />honest prices.</h1>
          <p>From sealed flagships to single-unit specials you won't see twice. This is Kwise World.</p>
          <div className="hero-cta">
            <Btn kind="primary" size="lg" iconAfter="arrowRight" onClick={() => onNav("category", "all")}>Start shopping</Btn>
            <Btn kind="ghost" size="lg" onClick={() => onNav("about")}>Our promise</Btn>
          </div>
        </div>
        <button className="hs-right" onClick={() => onNav("product", deal.id)}>
          <span className="hs-deal-badge"><Icon name="bolt" size={13} stroke={0} /> One-Time Offer · 1 left</span>
          <Thumb product={deal} size="hero" />
          <div className="hs-deal-info">
            <StatusPill status={deal.status} />
            <h3>{deal.name}</h3>
            <div className="hs-deal-price"><strong>{formatNaira(deal.price)}</strong><span>{formatNaira(deal.oldPrice)}</span></div>
          </div>
        </button>
      </div>
    </section>
  );
}

function CategoryTiles({ onNav }) {
  const { CATEGORIES } = window.KW;
  return (
    <section className="section">
      <div className="container">
        <div className="sec-head">
          <h2>Shop by category</h2>
          <button className="link-btn" onClick={() => onNav("category", "all")}>Browse all <Icon name="arrowRight" size={15} /></button>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((c) => (
            <button key={c.slug} className={"cat-tile ct-" + c.icon} onClick={() => onNav("category", c.slug)}>
              <Icon name={c.icon} size={42} stroke={1.3} />
              <div>
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
              </div>
              <Icon name="arrowRight" size={18} className="cat-arrow" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedRow({ onNav, onAdd }) {
  const { PRODUCTS } = window.KW;
  const feat = PRODUCTS.filter((p) => p.featured && !p.oneTime).slice(0, 8);
  return (
    <section className="section section-soft">
      <div className="container">
        <div className="sec-head">
          <h2>Best sellers</h2>
          <button className="link-btn" onClick={() => onNav("category", "all")}>See all <Icon name="arrowRight" size={15} /></button>
        </div>
        <div className="pgrid">
          {feat.map((p) => <ProductCard key={p.id} product={p} onNav={onNav} onAdd={onAdd} />)}
        </div>
      </div>
    </section>
  );
}

function OffersSpotlight({ onNav, onAdd }) {
  const { PRODUCTS, formatNaira } = window.KW;
  const offers = PRODUCTS.filter((p) => p.oneTime).slice(0, 3);
  return (
    <section className="section">
      <div className="container">
        <div className="ot-band">
          <div className="ot-band-copy">
            <span className="eyebrow eyebrow-orange"><Icon name="bolt" size={15} stroke={0} /> One-Time Offers</span>
            <h2>One unit. One price. Then it's gone.</h2>
            <p>Single pieces — a Nigeria-used gem, a UK-used flagship with a tiny mark. Honestly described, sharply priced, never restocked.</p>
            <Btn kind="orange" size="lg" iconAfter="arrowRight" onClick={() => onNav("offers")}>See all deals</Btn>
          </div>
          <div className="ot-band-cards">
            {offers.map((p) => <ProductCard key={p.id} product={p} onNav={onNav} onAdd={onAdd} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandStrip() {
  const brands = ["Apple", "Samsung", "HP", "Lenovo", "Anker", "Oraimo"];
  return (
    <section className="brandstrip">
      <div className="container brandstrip-in">
        <span>Trusted brands we stock</span>
        <div className="brand-logos">{brands.map((b) => <span key={b} className="brand-logo">{b}</span>)}</div>
      </div>
    </section>
  );
}

function TrustBand() {
  const items = [
    { icon: "shieldCheck", t: "Tested & verified", d: "Every device checked before it ships." },
    { icon: "truck", t: "Fast delivery", d: "24h in Lagos, nationwide in 2–4 days." },
    { icon: "refresh", t: "7-day returns", d: "Not as described? Send it back." },
    { icon: "whatsapp", t: "Real human support", d: "Chat with us before and after you buy." },
  ];
  return (
    <section className="section">
      <div className="container trust-grid">
        {items.map((i) => (
          <div className="trust-item" key={i.t}>
            <span className="trust-ic"><Icon name={i.icon} size={22} /></span>
            <div><strong>{i.t}</strong><p>{i.d}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomePage({ onNav, onAdd, heroVariant }) {
  return (
    <div className="page">
      {heroVariant === "split" ? <HeroSplit onNav={onNav} /> : <HeroEditorial onNav={onNav} />}
      <TrustBand />
      <CategoryTiles onNav={onNav} />
      <FeaturedRow onNav={onNav} onAdd={onAdd} />
      <OffersSpotlight onNav={onNav} onAdd={onAdd} />
      <BrandStrip />
    </div>
  );
}

/* ===================== CATEGORY / LISTING ===================== */
function CategoryPage({ onNav, onAdd, route, search }) {
  const { CATEGORIES, PRODUCTS } = window.KW;
  const catSlug = route.param === "all" ? null : route.param;
  const cat = CATEGORIES.find((c) => c.slug === catSlug);
  const initBrand = route.query.brand || null;
  const q = (route.query.q || search || "").trim().toLowerCase();

  const [brand, setBrand] = useStateS(initBrand);
  const [statuses, setStatuses] = useStateS([]);
  const [sort, setSort] = useStateS("featured");
  const [maxPrice, setMaxPrice] = useStateS(2000000);
  const [showFilters, setShowFilters] = useStateS(false);

  useEffectS(() => { setBrand(route.query.brand || null); setStatuses([]); }, [route.param, route.query.brand]);

  let list = PRODUCTS.filter((p) => !p.oneTime);
  if (catSlug) list = list.filter((p) => p.cat === catSlug);
  if (brand) list = list.filter((p) => p.brand === brand);
  if (statuses.length) list = list.filter((p) => statuses.includes(p.status));
  if (q) list = list.filter((p) => (p.name + " " + p.cat + " " + p.brand).toLowerCase().includes(q));
  list = list.filter((p) => p.price <= maxPrice);

  list = [...list];
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  else if (sort === "high") list.sort((a, b) => b.price - a.price);
  else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
  else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const allStatuses = ["Brand New", "UK-Used", "Nigeria-Used"];
  const toggleStatus = (s) => setStatuses((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const title = q ? `Results for "${route.query.q || search}"` : cat ? cat.name : "All products";

  return (
    <div className="page">
      <div className="container">
        <nav className="crumbs">
          <button onClick={() => onNav("home")}>Home</button><Icon name="chevron" size={13} />
          <span>{title}</span>
        </nav>
        <div className="cat-head">
          <div>
            <h1>{title}</h1>
            <p>{list.length} {list.length === 1 ? "item" : "items"}{cat ? ` · ${cat.blurb}` : ""}</p>
          </div>
          <div className="cat-tools">
            <button className="filter-toggle" onClick={() => setShowFilters(v => !v)}><Icon name="tag" size={16} /> Filters</button>
            <label className="sort">
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
        </div>

        <div className="cat-layout">
          <aside className={"filters" + (showFilters ? " open" : "")}>
            {cat && cat.brands.length > 0 && (
              <div className="filter-group">
                <h4>Brand</h4>
                <button className={"chip" + (!brand ? " on" : "")} onClick={() => setBrand(null)}>All</button>
                {cat.brands.map((b) => (
                  <button key={b.slug} className={"chip" + (brand === b.slug ? " on" : "")} onClick={() => setBrand(b.slug)}>{b.name}</button>
                ))}
              </div>
            )}
            <div className="filter-group">
              <h4>Condition</h4>
              {allStatuses.map((s) => (
                <label key={s} className="check">
                  <input type="checkbox" checked={statuses.includes(s)} onChange={() => toggleStatus(s)} />
                  <span className="check-box"><Icon name="check" size={13} /></span>{s}
                </label>
              ))}
            </div>
            <div className="filter-group">
              <h4>Max price</h4>
              <input className="range" type="range" min="50000" max="2000000" step="50000"
                value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} />
              <div className="range-val">Up to {window.KW.formatNaira(maxPrice)}</div>
            </div>
          </aside>

          <div className="cat-results">
            {list.length === 0 ? (
              <div className="empty">
                <Icon name="search" size={40} stroke={1.3} />
                <h3>Nothing matches yet</h3>
                <p>Try removing a filter or widening your price.</p>
              </div>
            ) : (
              <div className="pgrid pgrid-3">
                {list.map((p) => <ProductCard key={p.id} product={p} onNav={onNav} onAdd={onAdd} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== PRODUCT DETAIL ===================== */
function ProductPage({ onNav, onAdd, route }) {
  const { PRODUCTS, REVIEWS, formatNaira } = window.KW;
  const product = PRODUCTS.find((p) => p.id === route.param) || PRODUCTS[0];
  const [qty, setQty] = useStateS(1);
  const [color, setColor] = useStateS(product.colors && product.colors[0]);
  const [tab, setTab] = useStateS("specs");
  const soldOut = product.oneTime && product.stock <= 0;

  useEffectS(() => { setQty(1); setColor(product.colors && product.colors[0]); setTab("specs"); window.scrollTo(0, 0); }, [route.param]);

  const related = PRODUCTS.filter((p) => p.cat === product.cat && p.id !== product.id && !p.oneTime).slice(0, 4);
  const reviews = REVIEWS.slice(0, Math.min(REVIEWS.length, Math.max(2, product.reviews ? 4 : 2)));

  return (
    <div className="page">
      <div className="container">
        <nav className="crumbs">
          <button onClick={() => onNav("home")}>Home</button><Icon name="chevron" size={13} />
          <button onClick={() => onNav("category", product.cat)}>{(window.KW.CATEGORIES.find(c => c.slug === product.cat) || {}).name}</button>
          <Icon name="chevron" size={13} /><span>{product.name}</span>
        </nav>

        <div className="pdp">
          <div className="pdp-media">
            <div className="pdp-main"><Thumb product={product} size="hero" />
              {product.oneTime && <span className="badge badge-ot pdp-ot"><Icon name="bolt" size={13} stroke={0} /> One-Time Offer</span>}
            </div>
            <div className="pdp-thumbs">
              {[0, 1, 2, 3].map((i) => <div key={i} className={"pdp-thumb" + (i === 0 ? " on" : "")}><Thumb product={product} size="card" /></div>)}
            </div>
          </div>

          <div className="pdp-info">
            <div className="pdp-top"><StatusPill status={product.status} /><Stars value={product.rating} size={15} showNum count={product.reviews} /></div>
            <h1>{product.name}</h1>
            <p className="pdp-desc">{product.desc}</p>
            <div className="pdp-price">
              <span className="price-now">{formatNaira(product.price)}</span>
              {product.oldPrice && <span className="price-old">{formatNaira(product.oldPrice)}</span>}
              {product.oldPrice && <span className="badge badge-save">Save {formatNaira(product.oldPrice - product.price)}</span>}
            </div>

            {product.oneTime && (
              <div className="pdp-otnote">
                <Icon name="bolt" size={16} stroke={0} />
                <div><strong>Single unit — {soldOut ? "now sold out." : "only 1 available."}</strong>
                  {product.note && <p>{product.note}</p>}</div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="pdp-opt">
                <span className="opt-label">Colour: <strong>{color}</strong></span>
                <div className="opt-chips">
                  {product.colors.map((c) => (
                    <button key={c} className={"chip" + (color === c ? " on" : "")} onClick={() => setColor(c)}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="pdp-buy">
              <div className="qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={soldOut}><Icon name="minus" size={16} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => product.oneTime ? 1 : q + 1)} disabled={soldOut}><Icon name="plus" size={16} /></button>
              </div>
              <Btn kind={product.oneTime ? "orange" : "primary"} size="lg" full disabled={soldOut}
                icon={soldOut ? "close" : "cart"} onClick={() => onAdd(product, qty)}>
                {soldOut ? "Sold out" : "Add to cart"}
              </Btn>
            </div>

            <div className="pdp-assure">
              <span><Icon name="shieldCheck" size={16} /> Tested &amp; verified</span>
              <span><Icon name="truck" size={16} /> 24h Lagos delivery</span>
              <span><Icon name="refresh" size={16} /> 7-day returns</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pdp-tabs">
          <div className="tabbar">
            {["specs", "details", "reviews"].map((t) => (
              <button key={t} className={"tab" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>
                {t === "specs" ? "Specifications" : t === "details" ? "Details" : `Reviews (${product.reviews})`}
              </button>
            ))}
          </div>
          <div className="tabpanel">
            {tab === "specs" && (
              <table className="spec-table">
                <tbody>
                  {Object.entries(product.specs || {}).map(([k, v]) => (
                    <tr key={k}><th>{k}</th><td>{v}</td></tr>
                  ))}
                  <tr><th>Condition</th><td>{product.status}</td></tr>
                </tbody>
              </table>
            )}
            {tab === "details" && (
              <div className="details-copy">
                <p>{product.desc}</p>
                <p>Every Kwise World device is inspected and function-tested before listing. {product.status === "Brand New" ? "This unit is sealed with full manufacturer warranty." : "This is a pre-owned unit, honestly graded — what you see is what you get."}</p>
                <ul>
                  <li>Function-tested: screen, battery, cameras, speakers, ports</li>
                  <li>Comes with a compatible charging cable</li>
                  <li>7-day return window if it isn't as described</li>
                </ul>
              </div>
            )}
            {tab === "reviews" && (
              <div className="reviews">
                <div className="rev-summary">
                  <div className="rev-big"><strong>{product.rating.toFixed(1)}</strong><Stars value={product.rating} size={16} /><span>{product.reviews} reviews</span></div>
                </div>
                <div className="rev-list">
                  {reviews.map((r, i) => (
                    <div className="rev" key={i}>
                      <div className="rev-head">
                        <span className="rev-av">{r.name[0]}</span>
                        <div><strong>{r.name}{r.verified && <span className="rev-verified"><Icon name="check" size={11} /> Verified</span>}</strong>
                          <span className="rev-date">{r.date}</span></div>
                        <Stars value={r.rating} size={13} />
                      </div>
                      <p>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="section">
            <div className="sec-head"><h2>You may also like</h2></div>
            <div className="pgrid pgrid-4">
              {related.map((p) => <ProductCard key={p.id} product={p} onNav={onNav} onAdd={onAdd} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ===================== ONE-TIME OFFERS ===================== */
function OffersPage({ onNav, onAdd }) {
  const { PRODUCTS } = window.KW;
  const offers = PRODUCTS.filter((p) => p.oneTime);
  const available = offers.filter((p) => p.stock > 0);
  return (
    <div className="page">
      <section className="ot-hero">
        <div className="container ot-hero-in">
          <span className="eyebrow eyebrow-orange"><Icon name="bolt" size={16} stroke={0} /> One-Time Offers</span>
          <h1>One unit. One price.<br />Then it's gone for good.</h1>
          <p>These are single pieces — a Nigeria-used gem, a UK-used flagship with a tiny mark. Each is honestly described and sharply priced. When it sells, it disappears. No restocks.</p>
          <div className="ot-hero-meta">
            <span><Icon name="bolt" size={15} stroke={0} /> {available.length} live now</span>
            <span><Icon name="shieldCheck" size={15} /> Every flaw disclosed</span>
          </div>
        </div>
      </section>
      <div className="container">
        <div className="pgrid pgrid-3">
          {offers.map((p) => <ProductCard key={p.id} product={p} onNav={onNav} onAdd={onAdd} />)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomePage, CategoryPage, ProductPage, OffersPage });

const BRANDS = ["Apple", "Samsung", "HP", "Lenovo", "DELL", "Oraimo"];

export default function BrandStrip() {
  return (
    <section className="brandstrip">
      <div className="container brandstrip-in">
        <span>Trusted brands we stock</span>
        <div className="brand-logos">
          {BRANDS.map((b) => <span key={b} className="brand-logo">{b}</span>)}
        </div>
      </div>
    </section>
  );
}

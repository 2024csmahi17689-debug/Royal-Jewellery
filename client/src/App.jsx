
import { useMemo, useState } from "react";
import "./App.css";

const products = [
  { id: 1, name: "The Maharani Necklace", category: "Necklaces", price: 12999, oldPrice: 15999, tag: "Bestseller", metal: "Gold plated", occasion: "Wedding", image: "photo-1599643478518-a784e5dc4c8f", description: "A regal statement necklace inspired by timeless Indian craftsmanship." },
  { id: 2, name: "Noor Pearl Drops", category: "Earrings", price: 2499, oldPrice: 3199, tag: "New arrival", metal: "Gold plated", occasion: "Party", image: "photo-1535632066927-ab7c9ab60908", description: "Elegant pearl drops made for evenings worth remembering." },
  { id: 3, name: "Rajwada Kundan Set", category: "Necklaces", price: 8999, oldPrice: 10999, tag: "Royal edit", metal: "Kundan", occasion: "Wedding", image: "photo-1611652022419-a9419f74343d", description: "Traditional kundan-inspired beauty for your most special occasions." },
  { id: 4, name: "Gulabi Gold Bangles", category: "Bangles", price: 3499, oldPrice: 4299, tag: "Popular", metal: "Gold plated", occasion: "Festive", image: "photo-1617038220319-276d3cfab638", description: "A graceful pair that brings festive charm to every outfit." },
  { id: 5, name: "The Sitara Ring", category: "Rings", price: 1799, oldPrice: 2299, tag: "Everyday luxury", metal: "Gold plated", occasion: "Everyday", image: "photo-1605100804763-247f67b3557e", description: "A delicate sparkle for your everyday moments." },
  { id: 6, name: "Chandbali Earrings", category: "Earrings", price: 2899, oldPrice: 3599, tag: "Bestseller", metal: "Kundan", occasion: "Wedding", image: "photo-1630019852942-f89202989a59", description: "Statement chandbalis with a festive, heirloom-inspired look." },
  { id: 7, name: "Gulnaar Pendant", category: "Necklaces", price: 2199, oldPrice: 2799, tag: "New arrival", metal: "Gold plated", occasion: "Everyday", image: "photo-1611591437281-460bfbe1220a", description: "A minimal pendant that adds a little luxury to daily dressing." },
  { id: 8, name: "Meher Statement Ring", category: "Rings", price: 3299, oldPrice: 3999, tag: "Limited edit", metal: "Kundan", occasion: "Party", image: "photo-1603561596112-db6a9d1e8a9e", description: "A bold ring designed to become the centre of attention." },
];

const categories = ["All Jewellery", "Necklaces", "Earrings", "Bangles", "Rings"];
const money = (n) => "₹" + n.toLocaleString("en-IN");
const photo = (id, width = 700) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export default function App() {
  const [category, setCategory] = useState("All Jewellery");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [drawer, setDrawer] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [quizStep, setQuizStep] = useState(0);
  const [quizChoice, setQuizChoice] = useState("");
  const [quizResult, setQuizResult] = useState(false);
  const [email, setEmail] = useState("");
  const [accountMode, setAccountMode] = useState("Login");
  const [recent, setRecent] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const toast = (message) => {
    setNotice(message);
    window.clearTimeout(window.__rajsiToast);
    window.__rajsiToast = window.setTimeout(() => setNotice(""), 2400);
  };

  const shownProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchCategory = category === "All Jewellery" || p.category === category;
      const text = `${p.name} ${p.category} ${p.occasion} ${p.metal}`.toLowerCase();
      return matchCategory && text.includes(search.toLowerCase());
    });
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [category, search, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const addToCart = (product) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      return found
        ? current.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
        : [...current, { ...product, qty: 1 }];
    });
    toast(`${product.name} added to your bag`);
  };

  const changeQty = (id, amount) => {
    setCart((current) =>
      current
        .map((item) => item.id === id ? { ...item, qty: item.qty + amount } : item)
        .filter((item) => item.qty > 0)
    );
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.includes(product.id);
    setWishlist((current) =>
      exists ? current.filter((id) => id !== product.id) : [...current, product.id]
    );
    toast(exists ? "Removed from your wishlist" : "Saved to your wishlist ♡");
  };

  const openProduct = (product) => {
    setActiveProduct(product);
    setRecent((current) => [product.id, ...current.filter((id) => id !== product.id)].slice(0, 4));
  };

  const jumpToShop = () => {
    setDrawer("");
    setMenuOpen(false);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  const chooseCategory = (value) => {
    setCategory(value);
    setMenuOpen(false);
    jumpToShop();
  };

  const closeOverlays = () => {
    setDrawer("");
    setActiveProduct(null);
  };

  const quizProducts = products.filter((p) =>
    quizChoice === "Wedding" ? p.occasion === "Wedding" :
    quizChoice === "Everyday" ? p.occasion === "Everyday" :
    quizChoice === "Festive" ? ["Festive", "Party"].includes(p.occasion) :
    p.category === "Earrings" || p.category === "Rings"
  );

  return (
    <div className="rajsi">
      <div className="announcement">
        <span>✦</span> A little royal, a little you. &nbsp; Free shipping on orders above ₹2,999 <span>✦</span>
      </div>

      <header className="site-header">
        <button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">☰</button>
        <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">R</span>
          <span className="brand-name">RAJSI<small>JEWELS OF HERITAGE</small></span>
        </a>

        <nav className={menuOpen ? "main-nav nav-open" : "main-nav"}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <button onClick={() => chooseCategory("All Jewellery")}>Shop All</button>
          <button onClick={() => chooseCategory("Necklaces")}>Necklaces</button>
          <button onClick={() => chooseCategory("Earrings")}>Earrings</button>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our Story</a>
        </nav>

        <div className="header-actions">
          <button className="icon-button search-toggle" onClick={() => document.getElementById("product-search")?.focus()} aria-label="Search">⌕</button>
          <button className="icon-button" onClick={() => setDrawer("wishlist")} aria-label="Wishlist">♡<span className="action-count">{wishlist.length || ""}</span></button>
          <button className="icon-button bag-button" onClick={() => setDrawer("cart")} aria-label="Shopping bag">♧<span className="action-count">{cartCount || ""}</span></button>
          <button className="icon-button account-button" onClick={() => setDrawer("account")} aria-label="Account">♙</button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <img className="hero-image" src={photo("photo-1617038220319-276d3cfab638", 1800)} alt="Elegant gold jewellery" />
          <div className="hero-shade" />
          <div className="hero-content">
            <span className="eyebrow light-eyebrow">THE ROYAL COLLECTION · EST. WITH LOVE</span>
            <h1>Wear your<br /><em>own</em> kind of royalty.</h1>
            <p>Jewellery that celebrates your story, your roots, and every beautiful version of you.</p>
            <button className="button button-gold" onClick={jumpToShop}>EXPLORE THE COLLECTION <span>↗</span></button>
            <div className="hero-note"><span>✧</span> Made for moments that become memories</div>
          </div>
          <div className="hero-side-note">TIMELESS · PERSONAL · ROYAL</div>
        </section>

        <section className="trust-strip">
          <div><span>✧</span><p>Thoughtfully curated<small>Pieces with personality</small></p></div>
          <div><span>♧</span><p>Gift-ready packaging<small>Beautiful down to the details</small></p></div>
          <div><span>◇</span><p>Everyday elegance<small>Made to be worn and loved</small></p></div>
        </section>

        <section className="category-section section-pad">
          <div className="section-heading centered">
            <span className="eyebrow">FIND YOUR SIGNATURE</span>
            <h2>A world of <em>beautiful things.</em></h2>
            <p>For every mood, every moment, every you.</p>
          </div>
          <div className="category-grid">
            {[
              { name: "Necklaces", image: "photo-1599643478518-a784e5dc4c8f", label: "THE STATEMENT" },
              { name: "Earrings", image: "photo-1535632066927-ab7c9ab60908", label: "THE SPARKLE" },
              { name: "Bangles", image: "photo-1617038220319-276d3cfab638", label: "THE TRADITION" },
              { name: "Rings", image: "photo-1605100804763-247f67b3557e", label: "THE LITTLE LUXURY" },
            ].map((item) => (
              <button className="category-card" key={item.name} onClick={() => chooseCategory(item.name)}>
                <img src={photo(item.image)} alt={item.name} loading="lazy" />
                <span className="category-label">{item.label}</span>
                <span className="category-bottom"><strong>{item.name}</strong><span>↗</span></span>
              </button>
            ))}
          </div>
        </section>

        <section className="shop-section section-pad" id="shop">
          <div className="section-heading shop-heading">
            <div><span className="eyebrow">THE RAJSI EDIT</span><h2>Pieces to <em>fall for.</em></h2></div>
            <p>Find the one that feels like you.</p>
          </div>

          <div className="shop-toolbar">
            <div className="category-pills">
              {categories.map((item) => (
                <button key={item} className={category === item ? "pill active" : "pill"} onClick={() => setCategory(item)}>{item}</button>
              ))}
            </div>
            <div className="shop-controls">
              <label className="search-box"><span>⌕</span><input id="product-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find your favourite..." /></label>
              <select aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name A–Z</option>
              </select>
            </div>
          </div>

          <div className="result-count">{shownProducts.length} beautiful {shownProducts.length === 1 ? "piece" : "pieces"} to discover</div>
          <div className="product-grid">
            {shownProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <button className="product-image-button" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}>
                    <img src={photo(product.image)} alt={product.name} loading="lazy" />
                  </button>
                  <span className="product-tag">{product.tag}</span>
                  <button className={wishlist.includes(product.id) ? "heart-button saved" : "heart-button"} onClick={() => toggleWishlist(product)} aria-label="Toggle wishlist">{wishlist.includes(product.id) ? "♥" : "♡"}</button>
                  <button className="quick-view" onClick={() => openProduct(product)}>QUICK VIEW <span>↗</span></button>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category} · {product.metal}</div>
                  <button className="product-name" onClick={() => openProduct(product)}>{product.name}</button>
                  <div className="product-price"><strong>{money(product.price)}</strong><del>{money(product.oldPrice)}</del><span>{Math.round((1 - product.price / product.oldPrice) * 100)}% off</span></div>
                  <button className="add-button" onClick={() => addToCart(product)}>ADD TO BAG <span>＋</span></button>
                </div>
              </article>
            ))}
          </div>
          {shownProducts.length === 0 && <div className="empty-results"><span>♡</span><h3>No pieces found just yet.</h3><p>Try another search or explore the full collection.</p><button className="button button-dark" onClick={() => { setSearch(""); setCategory("All Jewellery"); }}>VIEW ALL JEWELLERY</button></div>}
        </section>

        <section className="quiz-section">
          <div className="quiz-image"><img src={photo("photo-1611652022419-a9419f74343d", 1000)} alt="Jewellery styling inspiration" loading="lazy" /></div>
          <div className="quiz-content">
            <span className="eyebrow">YOUR PERSONAL JEWELLERY EDIT</span>
            <h2>Not sure what<br />to choose? <em>We got you.</em></h2>
            {!quizResult ? (
              <>
                <p>Tell us what you are dressing up for, and we’ll find a few pieces to match your moment.</p>
                <div className="quiz-options">
                  {["Wedding", "Festive", "Everyday", "Party"].map((value) => <button key={value} className={quizChoice === value ? "quiz-option selected" : "quiz-option"} onClick={() => setQuizChoice(value)}>{value}<span>{quizChoice === value ? "✓" : "↗"}</span></button>)}
                </div>
                <button className="button button-dark" disabled={!quizChoice} onClick={() => { setQuizResult(true); setQuizStep(1); }}>FIND MY PIECES ↗</button>
              </>
            ) : (
              <div className="quiz-result">
                <p>Your {quizChoice.toLowerCase()} edit is ready. Here are some pieces we think you’ll love.</p>
                <div className="quiz-result-list">{quizProducts.slice(0, 3).map((p) => <button key={p.id} onClick={() => openProduct(p)}>{p.name}<span>{money(p.price)} ↗</span></button>)}</div>
                <button className="text-link" onClick={() => { setQuizResult(false); setQuizChoice(""); }}>START AGAIN ↺</button>
              </div>
            )}
          </div>
        </section>

        <section className="story-section section-pad" id="story">
          <div className="story-image"><img src={photo("photo-1617038220319-276d3cfab638", 1100)} alt="Gold jewellery detail" loading="lazy" /><span className="story-stamp">A LITTLE<br />ROYAL<br /><b>♡</b></span></div>
          <div className="story-copy">
            <span className="eyebrow">MORE THAN AN ORNAMENT</span>
            <h2>Some things are<br />worn. Others are <em>felt.</em></h2>
            <p>At RAJSI, we believe jewellery is more than the finishing touch. It is the confidence you carry, the memories you keep, and the traditions you make your own.</p>
            <p>Inspired by the richness of Indian artistry and made for the woman writing her own story.</p>
            <a className="text-link" href="#shop">DISCOVER OUR WORLD <span>↗</span></a>
            <div className="story-signature">With love, <em>RAJSI</em></div>
          </div>
        </section>

        <section className="values-strip">
          <div><span>01</span><h3>Timeless by design</h3><p>Pieces chosen to outlast a passing trend.</p></div>
          <div><span>02</span><h3>Made for your moments</h3><p>From everyday rituals to once-in-a-lifetime days.</p></div>
          <div><span>03</span><h3>Gifting, reimagined</h3><p>A little box of joy for someone you adore.</p></div>
        </section>

        <section className="newsletter-section">
          <div className="newsletter-mark">R</div>
          <span className="eyebrow">A NOTE FROM RAJSI</span>
          <h2>A little sparkle in<br /><em>your inbox.</em></h2>
          <p>Be the first to discover new edits, styling inspiration and special surprises.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); if (email.trim()) { toast("Thank you for joining the RAJSI list!"); setEmail(""); } }}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address" />
            <button type="submit">COUNT ME IN ↗</button>
          </form>
          <small>By subscribing, you agree to receive updates from RAJSI.</small>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand"><a className="brand footer-logo" href="#home"><span className="brand-mark">R</span><span className="brand-name">RAJSI<small>JEWELS OF HERITAGE</small></span></a><p>For the woman who carries her own crown.</p><div className="social-links"><a href="#story" aria-label="Instagram">ig</a><a href="#story" aria-label="Pinterest">p</a><a href="#story" aria-label="Facebook">f</a></div></div>
          <div><h4>EXPLORE</h4><a href="#shop" onClick={() => setCategory("All Jewellery")}>Shop All</a><a href="#shop" onClick={() => setCategory("Necklaces")}>Necklaces</a><a href="#shop" onClick={() => setCategory("Earrings")}>Earrings</a><a href="#shop" onClick={() => setCategory("Rings")}>Rings</a></div>
          <div><h4>THE RAJSI WORLD</h4><a href="#story">Our Story</a><a href="#shop">New Arrivals</a><a href="#shop">Bestsellers</a><button onClick={() => setDrawer("wishlist")}>Your Wishlist</button></div>
          <div><h4>HERE TO HELP</h4><button onClick={() => toast("Customer care details will be connected soon.")}>Contact Us</button><button onClick={() => toast("Shipping information will be added with the backend.")}>Shipping & Returns</button><button onClick={() => toast("Care guide coming soon.")}>Jewellery Care</button><button onClick={() => setDrawer("account")}>My Account</button></div>
        </div>
        <div className="footer-bottom"><span>© 2026 RAJSI. Made with love and a little sparkle.</span><span>PRIVACY · TERMS · INDIA</span></div>
      </footer>

      {notice && <div className="toast-message" role="status"><span>✧</span>{notice}</div>}

      {(drawer || activeProduct) && <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) closeOverlays(); }}>
        {activeProduct && (
          <div className="product-modal" role="dialog" aria-modal="true" aria-label={activeProduct.name}>
            <button className="close-button" onClick={() => setActiveProduct(null)} aria-label="Close">×</button>
            <div className="modal-image"><img src={photo(activeProduct.image, 1000)} alt={activeProduct.name} /></div>
            <div className="modal-details"><span className="eyebrow">{activeProduct.category} · {activeProduct.metal}</span><h2>{activeProduct.name}</h2><div className="modal-price">{money(activeProduct.price)} <del>{money(activeProduct.oldPrice)}</del></div><p>{activeProduct.description}</p><div className="detail-note"><span>✧</span> Gift-ready packaging <span>✧</span> Thoughtfully curated</div><button className="button button-dark full-button" onClick={() => { addToCart(activeProduct); setActiveProduct(null); }}>ADD TO BAG — {money(activeProduct.price)}</button><button className="text-link modal-wishlist" onClick={() => toggleWishlist(activeProduct)}>{wishlist.includes(activeProduct.id) ? "♥ SAVED TO WISHLIST" : "♡ ADD TO WISHLIST"}</button><small className="demo-note">Product details and availability shown here are demo content.</small></div>
          </div>
        )}

        {drawer && (
          <aside className="side-drawer" role="dialog" aria-modal="true" aria-label={drawer}>
            <div className="drawer-heading"><div><span className="eyebrow">THE RAJSI EXPERIENCE</span><h2>{drawer === "cart" ? "Your bag" : drawer === "wishlist" ? "Your wishlist" : drawer === "account" ? "Welcome, lovely." : "Checkout"}</h2></div><button className="close-button" onClick={() => setDrawer("")} aria-label="Close">×</button></div>

            {drawer === "cart" && <div className="drawer-body">
              {cart.length === 0 ? <div className="drawer-empty"><span>♧</span><h3>Your bag is waiting.</h3><p>There is something beautiful with your name on it.</p><button className="button button-dark" onClick={jumpToShop}>EXPLORE JEWELLERY</button></div> : <>
                <div className="free-shipping-note">{subtotal >= 2999 ? "✧ You've unlocked free shipping!" : `Add ${money(2999 - subtotal)} more for free shipping.`}</div>
                {cart.map((item) => <div className="drawer-product" key={item.id}><img src={photo(item.image, 250)} alt={item.name} /><div className="drawer-product-info"><h4>{item.name}</h4><p>{money(item.price)}</p><div className="quantity-control"><button onClick={() => changeQty(item.id, -1)} aria-label="Decrease quantity">−</button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)} aria-label="Increase quantity">+</button></div></div><button className="remove-item" onClick={() => setCart((current) => current.filter((p) => p.id !== item.id))} aria-label="Remove item">×</button></div>)}
                <div className="coupon-box"><input value={coupon} onChange={(e) => { setCoupon(e.target.value); setCouponApplied(false); }} placeholder="Try RAJSI10" aria-label="Coupon code" /><button onClick={() => { if (coupon.trim().toUpperCase() === "RAJSI10") { setCouponApplied(true); toast("10% demo discount applied"); } else { setCouponApplied(false); toast("Try code RAJSI10 for a demo discount"); } }}>APPLY</button></div>
                <div className="totals"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>{couponApplied && <div><span>RAJSI10 discount</span><strong>−{money(discount)}</strong></div>}<div><span>Shipping</span><strong>{subtotal >= 2999 ? "FREE" : "Calculated later"}</strong></div><div className="total-row"><span>Total</span><strong>{money(total)}</strong></div></div>
                <button className="button button-dark full-button" onClick={() => setDrawer("checkout")}>CONTINUE TO CHECKOUT ↗</button><p className="demo-note">Demo checkout only. No payment will be taken.</p>
              </>}
            </div>}

            {drawer === "wishlist" && <div className="drawer-body">
              {wishlist.length === 0 ? <div className="drawer-empty"><span>♡</span><h3>Keep the ones you love.</h3><p>Save your favourites here so they are easy to find later.</p><button className="button button-dark" onClick={jumpToShop}>DISCOVER YOUR FAVOURITES</button></div> : products.filter((p) => wishlist.includes(p.id)).map((item) => <div className="drawer-product" key={item.id}><img src={photo(item.image, 250)} alt={item.name} /><div className="drawer-product-info"><h4>{item.name}</h4><p>{money(item.price)}</p><button className="mini-action" onClick={() => { addToCart(item); setDrawer("cart"); }}>ADD TO BAG ↗</button></div><button className="remove-item" onClick={() => toggleWishlist(item)} aria-label="Remove from wishlist">×</button></div>)}
            </div>}

            {drawer === "account" && <div className="drawer-body account-body"><div className="account-tabs"><button className={accountMode === "Login" ? "active" : ""} onClick={() => setAccountMode("Login")}>LOGIN</button><button className={accountMode === "Sign up" ? "active" : ""} onClick={() => setAccountMode("Sign up")}>CREATE ACCOUNT</button></div><p>{accountMode === "Login" ? "Welcome back. Your favourites are waiting." : "Create your account for a more personal RAJSI experience."}</p><form onSubmit={(e) => { e.preventDefault(); toast("Account UI is ready — backend authentication comes next."); }}><label>Email address<input type="email" required placeholder="you@example.com" /></label><label>Password<input type="password" required minLength="6" placeholder="At least 6 characters" /></label><button className="button button-dark full-button" type="submit">{accountMode === "Login" ? "LOGIN" : "CREATE MY ACCOUNT"} ↗</button></form><small className="demo-note">This is a frontend demo. Your details are not sent to a server.</small></div>}

            {drawer === "checkout" && <div className="drawer-body account-body"><div className="checkout-demo"><span>✧</span><h3>Almost yours.</h3><p>Your bag total is <strong>{money(total)}</strong>. This checkout preview is ready for the backend integration.</p></div><form onSubmit={(e) => { e.preventDefault(); toast("Checkout preview complete. Payment integration comes next."); setDrawer(""); }}><label>Full name<input required placeholder="Your name" /></label><label>Email address<input type="email" required placeholder="you@example.com" /></label><label>Delivery address<textarea required rows="3" placeholder="House, street, city, PIN code" /></label><button type="submit" className="button button-dark full-button">PREVIEW ORDER ↗</button></form><small className="demo-note">No order is placed and no payment is collected in this demo.</small></div>}
          </aside>
        )}
      </div>}
    </div>
  );
}

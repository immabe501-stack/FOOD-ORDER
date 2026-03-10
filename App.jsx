import { useState, useEffect, useRef } from "react";

const menuData = {
  "精選推薦": [
    { id: 1, name: "招牌牛肉麵", desc: "精燉12小時濃郁湯頭，厚切牛腱", price: 180, tag: "SIGNATURE" },
    { id: 2, name: "脆皮烤鴨飯", desc: "皮脆肉嫩烤鴨，搭配香Q白飯", price: 220, tag: "CHEF'S PICK" },
    { id: 3, name: "紅燒獅子頭", desc: "手工肉丸，慢燉入味", price: 160, tag: "POPULAR" },
  ],
  "主食": [
    { id: 4, name: "三杯雞腿飯", desc: "香氣四溢的台式三杯醬料", price: 150 },
    { id: 5, name: "叉燒炒飯", desc: "大火翻炒，粒粒分明", price: 130 },
    { id: 6, name: "番茄牛肉義麵", desc: "慢熬番茄肉醬，義式風味", price: 170 },
  ],
  "小吃": [
    { id: 7, name: "蔥油餅", desc: "酥脆外皮，層層分明", price: 50 },
    { id: 8, name: "水晶餃", desc: "薄皮多汁，手工製作（6入）", price: 80 },
    { id: 9, name: "滷味拼盤", desc: "豆乾、海帶、豬耳朵各一份", price: 120 },
  ],
  "飲品": [
    { id: 10, name: "珍珠奶茶", desc: "特選阿薩姆紅茶，Q彈珍珠", price: 70 },
    { id: 11, name: "冬瓜檸檬", desc: "清爽消暑，酸甜平衡", price: 55 },
    { id: 12, name: "溫熱豆漿", desc: "非基改黃豆，濃醇香", price: 40 },
  ],
};

const EMOJIS = { 1:"🍜",2:"🍱",3:"🥘",4:"🍚",5:"🍳",6:"🍝",7:"🫓",8:"🥟",9:"🫙",10:"🧋",11:"🍋",12:"🥛" };

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [activeCategory, setActiveCategory] = useState("精選推薦");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", address:"", note:"", payment:"credit" });
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHover, setCursorHover] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 8) + 3;
      if (count >= 100) { count = 100; clearInterval(interval); }
      if (counterRef.current) counterRef.current.textContent = count;
    }, 40);
    setTimeout(() => { setLoaded(true); }, 2800);
    setTimeout(() => { setPreloaderDone(true); }, 3600);
  }, []);

  useEffect(() => {
    const move = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const addItem = (item) => setCart(p => ({ ...p, [item.id]: { ...item, qty: (p[item.id]?.qty||0)+1 } }));
  const removeItem = (id) => setCart(p => {
    const u = { ...p };
    if (u[id].qty <= 1) delete u[id]; else u[id] = { ...u[id], qty: u[id].qty - 1 };
    return u;
  });

  const cartItems = Object.values(cart);
  const totalQty = cartItems.reduce((s,i) => s+i.qty, 0);
  const totalPrice = cartItems.reduce((s,i) => s+i.price*i.qty, 0);
  const categories = Object.keys(menuData);

  return (
    <div style={{ background: "#080808", minHeight: "100vh", color: "#f0ece4", fontFamily: "'Cormorant Garamond', Georgia, serif", overflow: preloaderDone ? "auto" : "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #c9a96e33; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-thumb { background: #c9a96e44; }
        * { cursor: none !important; }
        .preloader { position: fixed; inset: 0; background: #080808; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.76,0,0.24,1); }
        .preloader.hide { opacity: 0; transform: translateY(-100%); pointer-events: none; }
        .preloader-bar-wrap { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #ffffff0f; }
        .preloader-bar { height: 100%; background: #c9a96e; transition: width 0.1s linear; }
        .preloader-counter { font-size: clamp(80px, 15vw, 160px); font-weight: 300; letter-spacing: -4px; color: #f0ece4; line-height: 1; }
        .gold-line { height: 1px; background: linear-gradient(90deg, transparent, #c9a96e, transparent); animation: shimmer 3s ease infinite; background-size: 200%; }
        @keyframes shimmer { 0%,100%{background-position:0%} 50%{background-position:200%} }
        .nav-link { font-family: 'Montserrat'; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #f0ece4aa; text-decoration: none; transition: color 0.3s; background: none; border: none; }
        .nav-link:hover { color: #c9a96e; }
        .cat-btn { font-family: 'Montserrat'; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; background: none; border: none; color: #f0ece466; padding: 8px 0; transition: color 0.3s; border-bottom: 1px solid transparent; }
        .cat-btn.active { color: #c9a96e; border-bottom-color: #c9a96e44; }
        .cat-btn:hover { color: #f0ece4; }
        .menu-card { border: 1px solid #f0ece408; transition: border-color 0.4s, background 0.4s; position: relative; overflow: hidden; }
        .menu-card::before { content:''; position:absolute; inset:0; background: linear-gradient(135deg, #c9a96e08, transparent); opacity:0; transition: opacity 0.4s; }
        .menu-card:hover { border-color: #c9a96e22; }
        .menu-card:hover::before { opacity: 1; }
        .add-btn { font-family: 'Montserrat'; font-size: 9px; letter-spacing: 3px; text-transform: uppercase; background: transparent; border: 1px solid #f0ece420; color: #f0ece466; padding: 8px 16px; transition: all 0.3s; }
        .add-btn:hover, .add-btn.active { border-color: #c9a96e; color: #c9a96e; background: #c9a96e0d; }
        .cart-drawer { position: fixed; top: 0; right: 0; width: 420px; height: 100vh; background: #0e0e0e; border-left: 1px solid #f0ece40a; z-index: 500; transform: translateX(100%); transition: transform 0.6s cubic-bezier(0.76,0,0.24,1); display: flex; flex-direction: column; }
        .cart-drawer.open { transform: translateX(0); }
        .modal-bg { position: fixed; inset: 0; background: #000000cc; backdrop-filter: blur(8px); z-index: 600; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal { background: #0e0e0e; border: 1px solid #f0ece40a; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
        input, textarea { background: transparent; border: none; border-bottom: 1px solid #f0ece415; color: #f0ece4; font-family: 'Montserrat'; font-size: 13px; letter-spacing: 1px; padding: 12px 0; width: 100%; outline: none; transition: border-color 0.3s; }
        input:focus, textarea:focus { border-bottom-color: #c9a96e; }
        input::placeholder, textarea::placeholder { color: #f0ece433; font-size: 11px; letter-spacing: 2px; }
        textarea { resize: none; }
        .pay-option { border: 1px solid #f0ece410; padding: 12px; text-align: center; transition: all 0.3s; }
        .pay-option.selected { border-color: #c9a96e44; background: #c9a96e0a; }
        .confirm-btn { width: 100%; background: #c9a96e; color: #080808; border: none; font-family: 'Montserrat'; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; padding: 18px; transition: all 0.3s; }
        .confirm-btn:hover:not(:disabled) { background: #d4b47a; }
        .confirm-btn:disabled { background: #f0ece415; color: #f0ece433; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .overlay { position: fixed; inset: 0; background: #00000066; z-index: 400; opacity: 0; pointer-events: none; transition: opacity 0.4s; }
        .overlay.show { opacity: 1; pointer-events: all; }
      `}</style>

      {/* Custom Cursor */}
      <div style={{ position: "fixed", left: cursorPos.x, top: cursorPos.y, width: cursorHover ? 48 : 8, height: cursorHover ? 48 : 8, borderRadius: "50%", border: "1px solid #c9a96e", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 99999, transition: "width 0.3s, height 0.3s", background: cursorHover ? "#c9a96e11" : "#c9a96e" }} />

      {/* Preloader */}
      <div className={`preloader${loaded ? " hide" : ""}`}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Montserrat'", fontSize: 10, letterSpacing: 8, color: "#c9a96e", marginBottom: 24 }}>味鮮小館</div>
          <div className="preloader-counter" ref={counterRef}>0</div>
          <div style={{ fontFamily: "'Montserrat'", fontSize: 10, letterSpacing: 6, color: "#c9a96e", marginTop: 12 }}>Loading Experience</div>
        </div>
        <div className="preloader-bar-wrap"><div className="preloader-bar" /></div>
      </div>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, padding: "24px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f0ece408" }}>
        <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 22, fontWeight: 300, letterSpacing: 6 }}>
          味鮮 <span style={{ color: "#c9a96e", fontSize: 14 }}>小館</span>
        </div>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          <span style={{ fontFamily: "'Montserrat'", fontSize: 10, letterSpacing: 3, color: "#f0ece444", textTransform: "uppercase" }}>台中市西區</span>
          <button className="nav-link" onClick={() => setCartOpen(true)} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}>
            Cart {totalQty > 0 && <span style={{ color: "#c9a96e" }}>({totalQty})</span>}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 60%, #c9a96e0a 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, border: "1px solid #c9a96e08", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, border: "1px solid #c9a96e05", borderRadius: "50%" }} />
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "'Montserrat'", fontSize: 10, letterSpacing: 8, color: "#c9a96e", marginBottom: 24, opacity: preloaderDone ? 1 : 0, transition: "opacity 1s 0.2s" }}>SINCE 2010 · TAICHUNG</div>
          <h1 style={{ fontSize: "clamp(60px, 10vw, 120px)", fontWeight: 300, lineHeight: 0.9, letterSpacing: -2, marginBottom: 24, opacity: preloaderDone ? 1 : 0, transform: preloaderDone ? "translateY(0)" : "translateY(40px)", transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>
            道地<br /><em style={{ fontStyle: "italic", color: "#c9a96e" }}>台灣</em><br />好味道
          </h1>
          <div className="gold-line" style={{ width: 80, margin: "0 auto 24px", opacity: preloaderDone ? 1 : 0, transition: "opacity 1s 0.8s" }} />
          <p style={{ fontFamily: "'Montserrat'", fontSize: 11, letterSpacing: 3, color: "#f0ece466", opacity: preloaderDone ? 1 : 0, transition: "opacity 1s 1s" }}>每日新鮮現做 · 外送 30–45 分鐘</p>
          <button onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}
            className="add-btn" style={{ marginTop: 48, opacity: preloaderDone ? 1 : 0, transition: "opacity 1s 1.2s" }}>
            探索菜單
          </button>
        </div>
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", opacity: preloaderDone ? 1 : 0, transition: "opacity 1s 1.4s" }}>
          <div style={{ width: 1, height: 60, background: "linear-gradient(to bottom, #c9a96e, transparent)", margin: "0 auto" }} />
        </div>
      </div>

      {/* Menu Section */}
      <div id="menu" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px 120px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 48 }}>
          <h2 style={{ fontSize: 56, fontWeight: 300, letterSpacing: -1 }}>Menu</h2>
          <div style={{ flex: 1, height: 1, background: "#f0ece408" }} />
          <span style={{ fontFamily: "'Montserrat'", fontSize: 10, letterSpacing: 3, color: "#f0ece433" }}>2024 COLLECTION</span>
        </div>
        <div style={{ display: "flex", gap: 32, marginBottom: 48, borderBottom: "1px solid #f0ece408" }}>
          {categories.map(cat => (
            <button key={cat} className={`cat-btn${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}>
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 1, background: "#f0ece408" }}>
          {menuData[activeCategory].map((item, i) => (
            <div key={item.id} className="menu-card fade-in" style={{ background: "#080808", padding: "32px", animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ fontSize: 40 }}>{EMOJIS[item.id]}</div>
                {item.tag && <span style={{ fontFamily: "'Montserrat'", fontSize: 8, letterSpacing: 3, color: "#c9a96e", border: "1px solid #c9a96e33", padding: "4px 8px" }}>{item.tag}</span>}
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 400, letterSpacing: 1, marginBottom: 8 }}>{item.name}</h3>
              <p style={{ fontFamily: "'Montserrat'", fontSize: 11, color: "#f0ece455", letterSpacing: 1, lineHeight: 1.8, marginBottom: 24 }}>{item.desc}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 28, fontWeight: 300, color: "#c9a96e" }}>
                  <span style={{ fontFamily: "'Montserrat'", fontSize: 10, letterSpacing: 1, color: "#f0ece444" }}>NT$ </span>{item.price}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {cart[item.id] && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button className="add-btn" onClick={() => removeItem(item.id)} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)} style={{ padding: "6px 12px" }}>−</button>
                      <span style={{ fontFamily: "'Montserrat'", fontSize: 12, color: "#c9a96e" }}>{cart[item.id].qty}</span>
                    </div>
                  )}
                  <button className={`add-btn${cart[item.id] ? " active" : ""}`} onClick={() => addItem(item)} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}>
                    {cart[item.id] ? "+" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`overlay${cartOpen ? " show" : ""}`} onClick={() => setCartOpen(false)} />

      {/* Cart Drawer */}
      <div className={`cart-drawer${cartOpen ? " open" : ""}`}>
        <div style={{ padding: "32px", borderBottom: "1px solid #f0ece408", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Montserrat'", fontSize: 9, letterSpacing: 5, color: "#c9a96e", marginBottom: 4 }}>YOUR ORDER</div>
            <div style={{ fontSize: 28, fontWeight: 300 }}>購物車</div>
          </div>
          <button className="nav-link" onClick={() => setCartOpen(false)} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}>Close</button>
        </div>
        {cartItems.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ width: 60, height: 60, border: "1px solid #f0ece410", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🛒</div>
            <div style={{ fontFamily: "'Montserrat'", fontSize: 10, letterSpacing: 3, color: "#f0ece433" }}>CART IS EMPTY</div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: "flex", gap: 16, padding: "20px 0", borderBottom: "1px solid #f0ece408" }}>
                  <span style={{ fontSize: 28 }}>{EMOJIS[item.id]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontFamily: "'Montserrat'", fontSize: 10, color: "#f0ece444", letterSpacing: 1 }}>NT$ {item.price} × {item.qty}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <span style={{ color: "#c9a96e", fontSize: 18 }}>NT$ {item.price * item.qty}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="add-btn" onClick={() => removeItem(item.id)} style={{ padding: "4px 10px" }} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}>−</button>
                      <span style={{ fontFamily: "'Montserrat'", fontSize: 12, padding: "4px 8px", color: "#c9a96e" }}>{item.qty}</span>
                      <button className="add-btn active" onClick={() => addItem(item)} style={{ padding: "4px 10px" }} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "24px 32px 32px", borderTop: "1px solid #f0ece408" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: "'Montserrat'", fontSize: 11, color: "#f0ece444" }}><span>SUBTOTAL</span><span>NT$ {totalPrice}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontFamily: "'Montserrat'", fontSize: 11, color: "#f0ece444" }}><span>DELIVERY</span><span>NT$ 30</span></div>
              <div className="gold-line" style={{ marginBottom: 20 }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, fontSize: 24, fontWeight: 300 }}><span>Total</span><span style={{ color: "#c9a96e" }}>NT$ {totalPrice + 30}</span></div>
              <button className="confirm-btn" onClick={() => { setCartOpen(false); setCheckout(true); }} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Checkout Modal */}
      {checkout && (
        <div className="modal-bg">
          <div className="modal">
            {!orderDone ? (
              <>
                <div style={{ padding: "32px 36px", borderBottom: "1px solid #f0ece408", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontFamily: "'Montserrat'", fontSize: 9, letterSpacing: 5, color: "#c9a96e", marginBottom: 8 }}>CHECKOUT</div>
                    <div style={{ fontSize: 32, fontWeight: 300 }}>訂購資料</div>
                  </div>
                  <button className="nav-link" onClick={() => setCheckout(false)} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}>✕</button>
                </div>
                <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: 24 }}>
                  {[["姓名 NAME","name","text","Your name"],["電話 PHONE","phone","tel","0912-345-678"],["地址 ADDRESS","address","text","台中市..."]].map(([label,key,type,ph]) => (
                    <div key={key}>
                      <div style={{ fontFamily: "'Montserrat'", fontSize: 9, letterSpacing: 4, color: "#c9a96e", marginBottom: 8 }}>{label}</div>
                      <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontFamily: "'Montserrat'", fontSize: 9, letterSpacing: 4, color: "#c9a96e", marginBottom: 8 }}>備註 NOTE</div>
                    <textarea placeholder="特殊需求..." value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} rows={2} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Montserrat'", fontSize: 9, letterSpacing: 4, color: "#c9a96e", marginBottom: 12 }}>付款 PAYMENT</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {[["credit","💳","信用卡"],["linepay","💚","LINE Pay"],["cash","💵","貨到付款"]].map(([val,icon,label]) => (
                        <div key={val} className={`pay-option${form.payment === val ? " selected" : ""}`} onClick={() => setForm(p => ({ ...p, payment: val }))} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)} style={{ cursor: "none" }}>
                          <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                          <div style={{ fontFamily: "'Montserrat'", fontSize: 9, letterSpacing: 2, color: form.payment === val ? "#c9a96e" : "#f0ece455" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid #f0ece408", paddingTop: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 22, fontWeight: 300 }}>
                      <span style={{ fontFamily: "'Montserrat'", fontSize: 10, letterSpacing: 2, color: "#f0ece466", alignSelf: "center" }}>TOTAL</span>
                      <span style={{ color: "#c9a96e" }}>NT$ {totalPrice + 30}</span>
                    </div>
                    <button className="confirm-btn" onClick={() => { if (form.name && form.phone && form.address) setOrderDone(true); }} disabled={!form.name || !form.phone || !form.address} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}>
                      確認下單 · Confirm Order
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: "64px 48px", textAlign: "center" }}>
                <div style={{ width: 80, height: 80, border: "1px solid #c9a96e44", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 32px" }}>✓</div>
                <div style={{ fontFamily: "'Montserrat'", fontSize: 9, letterSpacing: 6, color: "#c9a96e", marginBottom: 16 }}>ORDER CONFIRMED</div>
                <div style={{ fontSize: 40, fontWeight: 300, marginBottom: 12 }}>訂單成立</div>
                <div className="gold-line" style={{ width: 60, margin: "0 auto 24px" }} />
                <p style={{ fontFamily: "'Montserrat'", fontSize: 11, color: "#f0ece466", letterSpacing: 1, lineHeight: 2, marginBottom: 8 }}>感謝您，{form.name}<br />預計 30–45 分鐘送達</p>
                <p style={{ fontFamily: "'Montserrat'", fontSize: 10, color: "#c9a96e55", letterSpacing: 2, marginBottom: 40 }}>#ORD-{Math.floor(Math.random()*90000)+10000}</p>
                <button className="confirm-btn" onClick={() => { setCheckout(false); setOrderDone(false); setCart({}); setForm({ name:"", phone:"", address:"", note:"", payment:"credit" }); }} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}>
                  繼續點餐 · Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {totalQty > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)} onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}
          style={{ position: "fixed", bottom: 40, right: 40, background: "#c9a96e", color: "#080808", border: "none", borderRadius: "50%", width: 64, height: 64, fontFamily: "'Montserrat'", fontSize: 9, letterSpacing: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 350, boxShadow: "0 0 40px #c9a96e33" }}>
          <span style={{ fontSize: 20 }}>🛒</span>
          <span>{totalQty}</span>
        </button>
      )}

      <div style={{ borderTop: "1px solid #f0ece408", padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, fontWeight: 300, letterSpacing: 4 }}>味鮮小館</div>
        <div style={{ fontFamily: "'Montserrat'", fontSize: 9, letterSpacing: 3, color: "#f0ece433" }}>© 2024 · TAICHUNG</div>
        <div style={{ fontFamily: "'Montserrat'", fontSize: 9, letterSpacing: 2, color: "#f0ece433" }}>11:00 – 21:00 DAILY</div>
      </div>
    </div>
  );
}

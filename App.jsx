import { useState } from "react";

const menuData = {
  熱門推薦: [
    { id: 1, name: "招牌牛肉麵", desc: "精燉12小時的濃郁湯頭，搭配厚切牛腱", price: 180, emoji: "🍜", tag: "熱銷" },
    { id: 2, name: "脆皮烤鴨飯", desc: "皮脆肉嫩的烤鴨，搭配香Q白飯", price: 220, emoji: "🍱", tag: "主廚推薦" },
    { id: 3, name: "紅燒獅子頭", desc: "手工捏製肉丸，慢燉入味", price: 160, emoji: "🥘", tag: "人氣" },
  ],
  主食: [
    { id: 4, name: "三杯雞腿飯", desc: "香氣四溢的台式三杯醬料", price: 150, emoji: "🍚" },
    { id: 5, name: "叉燒炒飯", desc: "大火翻炒、粒粒分明", price: 130, emoji: "🍳" },
    { id: 6, name: "番茄牛肉義麵", desc: "慢熬番茄肉醬，義式風味", price: 170, emoji: "🍝" },
  ],
  小吃: [
    { id: 7, name: "蔥油餅", desc: "酥脆外皮，層層分明", price: 50, emoji: "🫓" },
    { id: 8, name: "水晶餃（6入）", desc: "薄皮多汁，手工製作", price: 80, emoji: "🥟" },
    { id: 9, name: "滷味拼盤", desc: "豆乾、海帶、豬耳朵各一份", price: 120, emoji: "🫙" },
  ],
  飲料: [
    { id: 10, name: "台灣珍珠奶茶", desc: "特選阿薩姆紅茶，Q彈珍珠", price: 70, emoji: "🧋" },
    { id: 11, name: "冬瓜檸檬", desc: "清爽消暑，酸甜平衡", price: 55, emoji: "🍋" },
    { id: 12, name: "溫熱豆漿", desc: "非基改黃豆，濃醇香", price: 40, emoji: "🥛" },
  ],
};

export default function FoodOrderApp() {
  const [activeCategory, setActiveCategory] = useState("熱門推薦");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(() => Math.floor(Math.random() * 90000) + 10000);
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "", payment: "credit" });

  const categories = Object.keys(menuData);
  const items = menuData[activeCategory];

  const addItem = (item) => setCart(prev => ({ ...prev, [item.id]: { ...item, qty: (prev[item.id]?.qty || 0) + 1 } }));
  const removeItem = (id) => setCart(prev => {
    const updated = { ...prev };
    if (updated[id].qty <= 1) delete updated[id];
    else updated[id] = { ...updated[id], qty: updated[id].qty - 1 };
    return updated;
  });

  const cartItems = Object.values(cart);
  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const handleOrder = () => {
    if (!form.name || !form.phone || !form.address) return;
    setOrderPlaced(true);
  };

  return (
    <div style={{ fontFamily: "'Noto Serif TC', Georgia, serif", background: "#FAFAF7", minHeight: "100vh", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #c8a96e; border-radius: 2px; }
        .item-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .item-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.1); }
        .add-btn { transition: all 0.15s ease; border: none; cursor: pointer; }
        .add-btn:hover { background: #a07840 !important; }
        .cat-btn { transition: all 0.2s ease; cursor: pointer; border: none; background: none; }
        .cart-drawer { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); }
        .qty-btn { transition: background 0.15s; cursor: pointer; border: none; }
        .qty-btn:hover { background: #e8e0d0 !important; }
        input, textarea { outline: none; font-family: 'DM Sans', sans-serif; }
        input:focus, textarea:focus { border-color: #c8a96e !important; }
        .pay-btn { transition: all 0.2s ease; cursor: pointer; border: none; }
        .pay-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        @keyframes fadeIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease forwards; opacity: 0; }
        @keyframes pop { 0%{transform:scale(0.85);opacity:0} 100%{transform:scale(1);opacity:1} }
        .pop { animation: pop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .float-btn { transition: all 0.2s ease; }
        .float-btn:hover { transform: translateY(-2px); }
      `}</style>

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #ece8df", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }}>🏮</span>
          <div>
            <div style={{ fontFamily: "'Noto Serif TC'", fontWeight: 700, fontSize: 17, letterSpacing: 2 }}>味鮮小館</div>
            <div style={{ fontSize: 10, color: "#aaa", letterSpacing: 1, fontFamily: "'DM Sans'" }}>FRESH · HANDMADE · DAILY</div>
          </div>
        </div>
        <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 28, padding: "9px 18px", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          🛒 購物車
          {totalQty > 0 && <span style={{ background: "#c8a96e", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{totalQty}</span>}
        </button>
      </header>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2416 100%)", color: "#fff", padding: "32px 20px 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(200,169,110,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(200,169,110,0.1) 0%, transparent 40%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 12, letterSpacing: 4, color: "#c8a96e", marginBottom: 6, fontFamily: "'DM Sans'", fontWeight: 500 }}>TODAY'S SPECIAL</div>
          <h1 style={{ fontFamily: "'Noto Serif TC'", fontSize: 26, fontWeight: 700, marginBottom: 6, letterSpacing: 2 }}>道地台灣好味道</h1>
          <p style={{ color: "#bbb", fontSize: 13, fontFamily: "'DM Sans'", marginBottom: 12 }}>每日新鮮現做 · 外送時間 30–45 分鐘</p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#c8a96e", fontFamily: "'DM Sans'" }}>
            <span>⭐ 4.9 評價</span><span>·</span><span>🕐 11:00–21:00</span><span>·</span><span>🚚 外送費 NT$30</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ece8df", padding: "0 20px", display: "flex", overflowX: "auto", position: "sticky", top: 60, zIndex: 90 }}>
        {categories.map(cat => (
          <button key={cat} className="cat-btn" onClick={() => setActiveCategory(cat)}
            style={{ padding: "14px 20px", fontFamily: "'Noto Serif TC'", fontSize: 14, fontWeight: activeCategory === cat ? 600 : 400, color: activeCategory === cat ? "#c8a96e" : "#666", borderBottom: `2px solid ${activeCategory === cat ? "#c8a96e" : "transparent"}`, whiteSpace: "nowrap", letterSpacing: 1 }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Menu */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
          {items.map((item, i) => (
            <div key={item.id} className="item-card fade-in" style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #ece8df", animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}>
              <div style={{ background: "linear-gradient(135deg, #fdf6ec, #f5ede0)", height: 110, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, position: "relative" }}>
                {item.emoji}
                {item.tag && <span style={{ position: "absolute", top: 10, right: 10, background: "#c8a96e", color: "#fff", fontSize: 10, padding: "3px 8px", borderRadius: 20, fontFamily: "'DM Sans'", fontWeight: 600 }}>{item.tag}</span>}
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <h3 style={{ fontFamily: "'Noto Serif TC'", fontSize: 15, fontWeight: 600, marginBottom: 4, letterSpacing: 1 }}>{item.name}</h3>
                <p style={{ fontSize: 12, color: "#aaa", fontFamily: "'DM Sans'", lineHeight: 1.6, marginBottom: 12 }}>{item.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: 17 }}>
                    <span style={{ fontSize: 11, color: "#aaa", fontWeight: 400 }}>NT$ </span>{item.price}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {cart[item.id] && <>
                      <button className="qty-btn" onClick={() => removeItem(item.id)} style={{ width: 26, height: 26, borderRadius: "50%", background: "#f0ede6", color: "#555", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <span style={{ fontFamily: "'DM Sans'", fontWeight: 700, minWidth: 16, textAlign: "center", fontSize: 14 }}>{cart[item.id].qty}</span>
                    </>}
                    <button className="add-btn" onClick={() => addItem(item)} style={{ background: "#1a1a1a", color: "#fff", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontFamily: "'DM Sans'", fontWeight: 500 }}>
                      {cart[item.id] ? "+" : "加入"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Overlay */}
      {cartOpen && <div onClick={() => setCartOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />}

      {/* Cart Drawer */}
      <div className="cart-drawer" style={{ position: "fixed", top: 0, right: 0, width: 360, height: "100vh", background: "#fff", zIndex: 300, transform: cartOpen ? "translateX(0)" : "translateX(100%)", display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #ece8df", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Noto Serif TC'", fontSize: 17, fontWeight: 700, letterSpacing: 1 }}>您的訂單</div>
          <button onClick={() => setCartOpen(false)} style={{ background: "#f0ede6", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>
        {cartItems.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#ccc" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🛒</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 14 }}>購物車是空的</div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 22px" }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: "1px solid #f5f2ec" }}>
                  <span style={{ fontSize: 28 }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Noto Serif TC'", fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#aaa" }}>NT$ {item.price} × {item.qty}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button className="qty-btn" onClick={() => removeItem(item.id)} style={{ width: 24, height: 24, borderRadius: "50%", background: "#f0ede6", color: "#666", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>−</button>
                    <span style={{ fontFamily: "'DM Sans'", fontWeight: 700, minWidth: 18, textAlign: "center", fontSize: 13 }}>{item.qty}</span>
                    <button className="qty-btn" onClick={() => addItem(item)} style={{ width: 24, height: 24, borderRadius: "50%", background: "#f0ede6", color: "#666", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>+</button>
                  </div>
                  <div style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: 13, minWidth: 52, textAlign: "right" }}>NT$ {item.price * item.qty}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 22px 22px", borderTop: "1px solid #ece8df" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontFamily: "'DM Sans'", fontSize: 12, color: "#aaa" }}><span>小計</span><span>NT$ {totalPrice}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontFamily: "'DM Sans'", fontSize: 12, color: "#aaa" }}><span>外送費</span><span>NT$ 30</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontFamily: "'Noto Serif TC'", fontWeight: 700, fontSize: 17 }}><span>合計</span><span style={{ color: "#c8a96e" }}>NT$ {totalPrice + 30}</span></div>
              <button className="pay-btn" onClick={() => { setCartOpen(false); setCheckout(true); }} style={{ width: "100%", background: "#c8a96e", color: "#fff", borderRadius: 12, padding: "14px", fontFamily: "'Noto Serif TC'", fontSize: 15, fontWeight: 600, letterSpacing: 2 }}>
                前往結帳 →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Checkout Modal */}
      {checkout && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="pop" style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
            {!orderPlaced ? (
              <>
                <div style={{ padding: "22px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontFamily: "'Noto Serif TC'", fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>填寫訂購資料</div>
                  <button onClick={() => setCheckout(false)} style={{ background: "#f0ede6", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 14 }}>✕</button>
                </div>
                <div style={{ padding: "18px 24px 24px", display: "flex", flexDirection: "column", gap: 13 }}>
                  {[["姓名 *", "name", "text", "您的大名"], ["電話 *", "phone", "tel", "0912-345-678"], ["外送地址 *", "address", "text", "台中市西區..."]].map(([label, key, type, ph]) => (
                    <div key={key}>
                      <label style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#999", display: "block", marginBottom: 5, letterSpacing: 1 }}>{label}</label>
                      <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        style={{ width: "100%", border: "1.5px solid #ece8df", borderRadius: 10, padding: "10px 13px", fontSize: 14, background: "#fafaf7", transition: "border-color 0.2s" }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#999", display: "block", marginBottom: 5, letterSpacing: 1 }}>備註</label>
                    <textarea placeholder="過敏食材、特殊需求..." value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} rows={2}
                      style={{ width: "100%", border: "1.5px solid #ece8df", borderRadius: 10, padding: "10px 13px", fontSize: 14, resize: "none", background: "#fafaf7", transition: "border-color 0.2s" }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'DM Sans'", fontSize: 11, color: "#999", display: "block", marginBottom: 8, letterSpacing: 1 }}>付款方式</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {[["credit", "💳", "信用卡"], ["linepay", "💚", "LINE Pay"], ["cash", "💵", "貨到付款"]].map(([val, icon, label]) => (
                        <button key={val} onClick={() => setForm(p => ({ ...p, payment: val }))} style={{ padding: "10px 6px", borderRadius: 10, border: `2px solid ${form.payment === val ? "#c8a96e" : "#ece8df"}`, background: form.payment === val ? "#fdf6ec" : "#fff", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                          <div style={{ fontSize: 18, marginBottom: 3 }}>{icon}</div>
                          <div style={{ fontFamily: "'DM Sans'", fontSize: 11, color: form.payment === val ? "#c8a96e" : "#888", fontWeight: form.payment === val ? 600 : 400 }}>{label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: "#fafaf7", borderRadius: 12, padding: "12px 16px", border: "1px solid #ece8df" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans'", fontSize: 12, color: "#aaa", marginBottom: 4 }}><span>商品小計</span><span>NT$ {totalPrice}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans'", fontSize: 12, color: "#aaa", marginBottom: 8 }}><span>外送費</span><span>NT$ 30</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Noto Serif TC'", fontWeight: 700, fontSize: 15 }}><span>應付金額</span><span style={{ color: "#c8a96e" }}>NT$ {totalPrice + 30}</span></div>
                  </div>
                  <button className="pay-btn" onClick={handleOrder}
                    style={{ background: (!form.name || !form.phone || !form.address) ? "#ddd" : "#c8a96e", color: "#fff", borderRadius: 12, padding: "14px", fontFamily: "'Noto Serif TC'", fontSize: 15, fontWeight: 600, letterSpacing: 2, marginTop: 2, cursor: (!form.name || !form.phone || !form.address) ? "not-allowed" : "pointer" }}>
                    確認下單 ✓
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: "48px 28px", textAlign: "center" }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>🎉</div>
                <div style={{ fontFamily: "'Noto Serif TC'", fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: 2 }}>訂單成立！</div>
                <div style={{ fontFamily: "'DM Sans'", color: "#888", fontSize: 14, lineHeight: 1.8, marginBottom: 6 }}>感謝您的訂購，{form.name} 您好！</div>
                <div style={{ fontFamily: "'DM Sans'", color: "#aaa", fontSize: 13, marginBottom: 22 }}>預計 30–45 分鐘送達<br />📍 {form.address}</div>
                <div style={{ background: "#fdf6ec", borderRadius: 12, padding: "12px 20px", marginBottom: 22, fontFamily: "'DM Sans'", fontSize: 13, color: "#c8a96e", fontWeight: 600 }}>
                  訂單編號：#ORD-{orderNumber}
                </div>
                <button className="pay-btn" onClick={() => { setCheckout(false); setOrderPlaced(false); setCart({}); setForm({ name: "", phone: "", address: "", note: "", payment: "credit" }); }}
                  style={{ background: "#1a1a1a", color: "#fff", borderRadius: 12, padding: "13px 30px", fontFamily: "'Noto Serif TC'", fontSize: 14, letterSpacing: 2 }}>
                  繼續點餐
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Cart */}
      {totalQty > 0 && !cartOpen && (
        <button className="float-btn" onClick={() => setCartOpen(true)} style={{ position: "fixed", bottom: 24, right: 24, background: "#c8a96e", color: "#fff", border: "none", borderRadius: 50, padding: "13px 22px", fontSize: 14, fontFamily: "'Noto Serif TC'", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 28px rgba(200,169,110,0.45)", display: "flex", alignItems: "center", gap: 8, zIndex: 150, letterSpacing: 1 }}>
          🛒 查看訂單
          <span style={{ background: "#fff", color: "#c8a96e", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{totalQty}</span>
          <span style={{ fontSize: 13 }}>NT$ {totalPrice + 30}</span>
        </button>
      )}
    </div>
  );
}

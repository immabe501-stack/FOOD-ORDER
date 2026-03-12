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
const EMOJIS = {1:"🍜",2:"🍱",3:"🥘",4:"🍚",5:"🍳",6:"🍝",7:"🫓",8:"🥟",9:"🫙",10:"🧋",11:"🍋",12:"🥛"};

const CREAM = "#F5F2ED";
const DARK = "#232323";

export default function App() {
  const [phase, setPhase] = useState("loading"); // loading → reveal → done
  const [progress, setProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState("精選推薦");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", address:"", note:"", payment:"credit" });
  const [cursor, setCursor] = useState({ x:-100, y:-100, big:false });
  const [heroVisible, setHeroVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);

  // Preloader
  useEffect(() => {
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 6 + 2;
      if (p >= 100) { p = 100; clearInterval(t); }
      setProgress(Math.floor(p));
    }, 45);
    setTimeout(() => setPhase("reveal"), 2600);
    setTimeout(() => { setPhase("done"); setHeroVisible(true); }, 3500);
  }, []);

  // Scroll reveal for menu
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setMenuVisible(true); }, { threshold: 0.1 });
    if (menuRef.current) obs.observe(menuRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const fn = e => setCursor(c => ({ ...c, x: e.clientX, y: e.clientY }));
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const addItem = (item) => setCart(p => ({ ...p, [item.id]: { ...item, qty:(p[item.id]?.qty||0)+1 } }));
  const removeItem = (id) => setCart(p => {
    const u = {...p};
    if (u[id].qty <= 1) delete u[id]; else u[id] = {...u[id], qty: u[id].qty-1};
    return u;
  });
  const cartItems = Object.values(cart);
  const totalQty = cartItems.reduce((s,i)=>s+i.qty,0);
  const totalPrice = cartItems.reduce((s,i)=>s+i.price*i.qty,0);

  const big = (v=true) => setCursor(c=>({...c,big:v}));

  return (
    <div style={{background:CREAM,minHeight:"100vh",color:DARK,fontFamily:"'Cormorant Garamond',Georgia,serif",overflow:phase!=="done"?"hidden":"auto"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        *{cursor:none!important;}
        ::selection{background:${DARK}22;}
        ::-webkit-scrollbar{width:1px;}
        ::-webkit-scrollbar-thumb{background:${DARK}44;}

        /* Preloader */
        .preloader{
          position:fixed;inset:0;background:${CREAM};z-index:9000;
          display:flex;flex-direction:column;
          transition:clip-path 1s cubic-bezier(0.76,0,0.24,1);
          clip-path:inset(0 0 0 0);
        }
        .preloader.out{clip-path:inset(0 0 100% 0);}

        /* Thin progress line at top */
        .progress-line{
          position:absolute;top:0;left:0;height:1px;
          background:${DARK};
          transition:width 0.1s linear;
        }

        /* Nav */
        .nav-item{
          font-family:'Jost';font-size:11px;letter-spacing:3px;text-transform:uppercase;
          color:${DARK}88;background:none;border:none;text-decoration:none;
          transition:color 0.3s;padding:0;
        }
        .nav-item:hover{color:${DARK};}

        /* Category */
        .cat-btn{
          font-family:'Jost';font-size:10px;letter-spacing:4px;text-transform:uppercase;
          background:none;border:none;color:${DARK}44;
          padding:12px 0;border-bottom:1px solid transparent;
          transition:all 0.3s;
        }
        .cat-btn:hover{color:${DARK}88;}
        .cat-btn.on{color:${DARK};border-bottom-color:${DARK}33;}

        /* Menu card */
        .mcard{
          border-bottom:1px solid ${DARK}10;
          padding:32px 0;
          transition:background 0.3s;
          position:relative;
        }
        .mcard::after{
          content:'';position:absolute;bottom:0;left:0;right:0;
          height:1px;background:${DARK};
          transform:scaleX(0);transform-origin:left;
          transition:transform 0.5s cubic-bezier(0.76,0,0.24,1);
        }
        .mcard:hover::after{transform:scaleX(1);}

        /* Add btn */
        .add-btn{
          font-family:'Jost';font-size:9px;letter-spacing:3px;text-transform:uppercase;
          background:transparent;border:1px solid ${DARK}22;
          color:${DARK}55;padding:8px 18px;
          transition:all 0.25s;
        }
        .add-btn:hover,.add-btn.on{
          background:${DARK};color:${CREAM};border-color:${DARK};
        }

        /* Cart drawer */
        .cart-panel{
          position:fixed;top:0;right:0;width:400px;height:100vh;
          background:${CREAM};border-left:1px solid ${DARK}10;
          z-index:600;
          transform:translateX(100%);
          transition:transform 0.75s cubic-bezier(0.76,0,0.24,1);
          display:flex;flex-direction:column;
        }
        .cart-panel.open{transform:translateX(0);}

        /* Overlay */
        .overlay{
          position:fixed;inset:0;background:${DARK}44;
          backdrop-filter:blur(2px);
          z-index:500;opacity:0;pointer-events:none;
          transition:opacity 0.4s;
        }
        .overlay.on{opacity:1;pointer-events:all;}

        /* Modal */
        .modal-wrap{
          position:fixed;inset:0;background:${DARK}55;
          backdrop-filter:blur(6px);
          z-index:700;display:flex;align-items:center;justify-content:center;padding:20px;
        }
        .modal{
          background:${CREAM};border:1px solid ${DARK}10;
          width:100%;max-width:460px;max-height:90vh;overflow-y:auto;
        }
        input,textarea{
          background:transparent;border:none;border-bottom:1px solid ${DARK}15;
          color:${DARK};font-family:'Jost';font-size:13px;letter-spacing:1px;
          padding:12px 0;width:100%;outline:none;transition:border-color 0.3s;
        }
        input:focus,textarea:focus{border-bottom-color:${DARK};}
        input::placeholder,textarea::placeholder{color:${DARK}33;font-size:11px;letter-spacing:2px;}
        textarea{resize:none;}
        .pay-opt{
          border:1px solid ${DARK}10;padding:14px 10px;text-align:center;
          transition:all 0.25s;
        }
        .pay-opt.on{border-color:${DARK}44;background:${DARK}06;}
        .submit-btn{
          width:100%;background:${DARK};color:${CREAM};border:none;
          font-family:'Jost';font-size:10px;letter-spacing:4px;text-transform:uppercase;
          padding:18px;transition:all 0.3s;
        }
        .submit-btn:hover:not(:disabled){background:#444;}
        .submit-btn:disabled{background:${DARK}11;color:${DARK}33;}

        /* Animations */
        @keyframes slideUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        .slide-up{animation:slideUp 1s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0;}
        .fade-in-card{animation:fadeIn 0.6s ease forwards;opacity:0;}

        /* Divider line */
        .thin-line{height:1px;background:${DARK}10;}
      `}</style>

      {/* Custom cursor */}
      <div style={{
        position:"fixed",left:cursor.x,top:cursor.y,zIndex:99999,pointerEvents:"none",
        transform:"translate(-50%,-50%)",transition:"width 0.3s,height 0.3s,background 0.3s,border-color 0.3s",
        width:cursor.big?40:6,height:cursor.big?40:6,borderRadius:"50%",
        border:`1px solid ${DARK}${cursor.big?"":"00"}`,
        background:cursor.big?`${DARK}11`:DARK,
        mixBlendMode:"multiply",
      }}/>

      {/* PRELOADER */}
      <div className={`preloader${phase==="reveal"||phase==="done"?" out":""}`}>
        <div className="progress-line" style={{width:`${progress}%`}}/>

        {/* Big counter */}
        <div style={{
          flex:1,display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center",
          gap:0,
        }}>
          <div style={{
            fontFamily:"'Cormorant Garamond'",
            fontSize:"clamp(100px,18vw,200px)",
            fontWeight:300,lineHeight:1,letterSpacing:-6,
            color:DARK,
            fontVariantNumeric:"tabular-nums",
          }}>{String(progress).padStart(2,"0")}</div>
          <div style={{
            fontFamily:"'Jost'",fontSize:10,letterSpacing:8,
            color:`${DARK}55`,textTransform:"uppercase",marginTop:8,
          }}>Loading</div>
        </div>

        {/* Bottom name */}
        <div style={{
          padding:"32px 48px",display:"flex",justifyContent:"space-between",
          borderTop:`1px solid ${DARK}10`,
        }}>
          <span style={{fontFamily:"'Cormorant Garamond'",fontSize:18,letterSpacing:4,fontWeight:300}}>味鮮小館</span>
          <span style={{fontFamily:"'Jost'",fontSize:10,letterSpacing:3,color:`${DARK}44`,alignSelf:"center"}}>TAICHUNG · EST. 2010</span>
        </div>
      </div>

      {/* NAV */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:400,
        padding:"0 48px",height:64,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        background:CREAM,borderBottom:`1px solid ${DARK}08`,
      }}>
        <div style={{fontFamily:"'Cormorant Garamond'",fontSize:20,fontWeight:300,letterSpacing:5}}>
          味鮮<span style={{fontStyle:"italic",color:`${DARK}55`}}>小館</span>
        </div>
        <div style={{display:"flex",gap:40,alignItems:"center"}}>
          <span className="nav-item">台中 · 11:00–21:00</span>
          <button className="nav-item" onClick={()=>setCartOpen(true)} onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}>
            Order {totalQty>0&&<span style={{fontStyle:"italic"}}>({totalQty})</span>}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        height:"100vh",display:"flex",flexDirection:"column",
        justifyContent:"flex-end",padding:"0 48px 60px",
        borderBottom:`1px solid ${DARK}10`,
        position:"relative",overflow:"hidden",
      }}>
        {/* Subtle background texture */}
        <div style={{
          position:"absolute",inset:0,
          backgroundImage:`radial-gradient(ellipse 60% 70% at 70% 40%, ${DARK}04 0%, transparent 60%)`,
        }}/>

        {/* Floating label top-right */}
        <div style={{
          position:"absolute",top:90,right:48,
          fontFamily:"'Jost'",fontSize:9,letterSpacing:5,color:`${DARK}44`,
          textTransform:"uppercase",
          opacity:heroVisible?1:0,transition:"opacity 1.2s 0.8s",
        }}>
          台灣料理 · Fresh Daily
        </div>

        {/* Main headline */}
        <div style={{position:"relative",zIndex:1}}>
          <div style={{
            fontFamily:"'Jost'",fontSize:10,letterSpacing:7,
            color:`${DARK}55`,textTransform:"uppercase",marginBottom:24,
            opacity:heroVisible?1:0,
            transform:heroVisible?"translateY(0)":"translateY(20px)",
            transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }}>
            Since 2010
          </div>

          <h1 style={{
            fontSize:"clamp(56px,9vw,130px)",
            fontWeight:300,lineHeight:0.88,
            letterSpacing:-3,
            marginBottom:40,
            opacity:heroVisible?1:0,
            transform:heroVisible?"translateY(0)":"translateY(40px)",
            transition:"all 1.1s cubic-bezier(0.16,1,0.3,1) 0.25s",
          }}>
            道地<br/>
            <em style={{fontStyle:"italic",fontWeight:300,color:`${DARK}55`}}>台灣</em><br/>
            好味道
          </h1>

          <div style={{
            display:"flex",alignItems:"center",gap:48,
            opacity:heroVisible?1:0,
            transform:heroVisible?"translateY(0)":"translateY(20px)",
            transition:"all 0.9s cubic-bezier(0.16,1,0.3,1) 0.6s",
          }}>
            <button className="add-btn on" onClick={()=>document.getElementById("menu").scrollIntoView({behavior:"smooth"})}
              onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}
              style={{padding:"12px 32px",fontSize:10,letterSpacing:4}}>
              探索菜單
            </button>
            <span style={{fontFamily:"'Jost'",fontSize:11,color:`${DARK}44`,letterSpacing:2}}>
              外送 30–45 分鐘 · NT$30 外送費
            </span>
          </div>
        </div>

        {/* Bottom right star rating */}
        <div style={{
          position:"absolute",bottom:60,right:48,
          textAlign:"right",
          opacity:heroVisible?1:0,transition:"opacity 1s 1s",
        }}>
          <div style={{fontFamily:"'Cormorant Garamond'",fontSize:40,fontWeight:300}}>4.9</div>
          <div style={{fontFamily:"'Jost'",fontSize:9,letterSpacing:3,color:`${DARK}44`}}>RATING</div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position:"absolute",bottom:60,left:"50%",transform:"translateX(-50%)",
          opacity:heroVisible?1:0,transition:"opacity 1s 1.2s",
        }}>
          <div style={{
            width:1,height:50,
            background:`linear-gradient(to bottom,${DARK},transparent)`,
            margin:"0 auto",
          }}/>
        </div>
      </div>

      {/* MENU SECTION */}
      <div id="menu" ref={menuRef} style={{maxWidth:1100,margin:"0 auto",padding:"80px 48px 120px"}}>
        {/* Section header */}
        <div style={{
          display:"flex",alignItems:"baseline",gap:20,marginBottom:56,
          opacity:menuVisible?1:0,transform:menuVisible?"translateY(0)":"translateY(30px)",
          transition:"all 1s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <h2 style={{fontSize:"clamp(40px,6vw,80px)",fontWeight:300,letterSpacing:-2}}>Menu</h2>
          <div style={{flex:1,height:1,background:`${DARK}10`,alignSelf:"center"}}/>
          <span style={{fontFamily:"'Jost'",fontSize:10,letterSpacing:3,color:`${DARK}33`}}>2024</span>
        </div>

        {/* Category tabs */}
        <div style={{
          display:"flex",gap:28,marginBottom:48,
          borderBottom:`1px solid ${DARK}10`,
          opacity:menuVisible?1:0,transition:"opacity 0.8s 0.2s",
        }}>
          {Object.keys(menuData).map(cat=>(
            <button key={cat} className={`cat-btn${activeCategory===cat?" on":""}`}
              onClick={()=>setActiveCategory(cat)}
              onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Items */}
        <div>
          {menuData[activeCategory].map((item,i)=>(
            <div key={item.id} className="mcard fade-in-card"
              style={{animationDelay:`${i*0.1}s`,animationFillMode:"both",
                display:"grid",gridTemplateColumns:"80px 1fr auto",gap:"0 32px",alignItems:"center"}}>
              {/* Emoji / number */}
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <span style={{fontSize:36}}>{EMOJIS[item.id]}</span>
                <span style={{fontFamily:"'Jost'",fontSize:9,letterSpacing:2,color:`${DARK}33`}}>
                  {String(i+1).padStart(2,"0")}
                </span>
              </div>

              {/* Name + desc */}
              <div>
                <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6}}>
                  <h3 style={{fontSize:24,fontWeight:400,letterSpacing:0.5}}>{item.name}</h3>
                  {item.tag&&<span style={{fontFamily:"'Jost'",fontSize:8,letterSpacing:3,color:`${DARK}44`,border:`1px solid ${DARK}20`,padding:"3px 8px"}}>{item.tag}</span>}
                </div>
                <p style={{fontFamily:"'Jost'",fontSize:12,color:`${DARK}44`,letterSpacing:1,lineHeight:1.7}}>{item.desc}</p>
              </div>

              {/* Price + add */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:12}}>
                <span style={{fontSize:22,fontWeight:300}}>
                  <span style={{fontFamily:"'Jost'",fontSize:10,color:`${DARK}44`}}>NT$</span> {item.price}
                </span>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {cart[item.id]&&<>
                    <button className="add-btn" onClick={()=>removeItem(item.id)}
                      onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}
                      style={{padding:"6px 12px"}}>−</button>
                    <span style={{fontFamily:"'Jost'",fontSize:13,minWidth:16,textAlign:"center"}}>{cart[item.id].qty}</span>
                  </>}
                  <button className={`add-btn${cart[item.id]?" on":""}`}
                    onClick={()=>addItem(item)}
                    onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}>
                    {cart[item.id]?"+":"Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OVERLAY */}
      <div className={`overlay${cartOpen?" on":""}`} onClick={()=>setCartOpen(false)}/>

      {/* CART PANEL */}
      <div className={`cart-panel${cartOpen?" open":""}`}>
        <div style={{padding:"24px 32px",borderBottom:`1px solid ${DARK}08`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"'Jost'",fontSize:9,letterSpacing:5,color:`${DARK}44`,marginBottom:4}}>YOUR ORDER</div>
            <div style={{fontSize:26,fontWeight:300}}>購物車</div>
          </div>
          <button className="nav-item" onClick={()=>setCartOpen(false)}
            onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}>Close</button>
        </div>

        {cartItems.length===0?(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
            <div style={{fontSize:36}}>🛒</div>
            <div style={{fontFamily:"'Jost'",fontSize:10,letterSpacing:3,color:`${DARK}33`}}>CART IS EMPTY</div>
          </div>
        ):(
          <>
            <div style={{flex:1,overflowY:"auto",padding:"20px 32px"}}>
              {cartItems.map(item=>(
                <div key={item.id} style={{display:"flex",gap:14,padding:"18px 0",borderBottom:`1px solid ${DARK}08`}}>
                  <span style={{fontSize:26}}>{EMOJIS[item.id]}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:16,marginBottom:3}}>{item.name}</div>
                    <div style={{fontFamily:"'Jost'",fontSize:10,color:`${DARK}44`,letterSpacing:1}}>NT$ {item.price} × {item.qty}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
                    <span style={{fontSize:17}}>NT$ {item.price*item.qty}</span>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <button className="add-btn" onClick={()=>removeItem(item.id)} style={{padding:"4px 10px"}}
                        onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}>−</button>
                      <span style={{fontFamily:"'Jost'",fontSize:12,minWidth:18,textAlign:"center"}}>{item.qty}</span>
                      <button className="add-btn on" onClick={()=>addItem(item)} style={{padding:"4px 10px"}}
                        onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:"20px 32px 28px",borderTop:`1px solid ${DARK}08`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontFamily:"'Jost'",fontSize:11,color:`${DARK}44`}}>
                <span>SUBTOTAL</span><span>NT$ {totalPrice}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:18,fontFamily:"'Jost'",fontSize:11,color:`${DARK}44`}}>
                <span>DELIVERY</span><span>NT$ 30</span>
              </div>
              <div style={{height:1,background:`${DARK}10`,marginBottom:18}}/>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:20,fontSize:22,fontWeight:300}}>
                <span>Total</span><span>NT$ {totalPrice+30}</span>
              </div>
              <button className="submit-btn" onClick={()=>{setCartOpen(false);setCheckout(true);}}
                onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}>
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>

      {/* CHECKOUT MODAL */}
      {checkout&&(
        <div className="modal-wrap">
          <div className="modal">
            {!orderDone?(
              <>
                <div style={{padding:"28px 32px",borderBottom:`1px solid ${DARK}08`,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontFamily:"'Jost'",fontSize:9,letterSpacing:5,color:`${DARK}44`,marginBottom:8}}>CHECKOUT</div>
                    <div style={{fontSize:28,fontWeight:300}}>訂購資料</div>
                  </div>
                  <button className="nav-item" onClick={()=>setCheckout(false)}
                    onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}>✕</button>
                </div>
                <div style={{padding:"28px 32px",display:"flex",flexDirection:"column",gap:22}}>
                  {[["姓名 NAME","name","text","Your name"],["電話 PHONE","phone","tel","0912-345-678"],["地址 ADDRESS","address","text","台中市..."]].map(([label,key,type,ph])=>(
                    <div key={key}>
                      <div style={{fontFamily:"'Jost'",fontSize:9,letterSpacing:4,color:`${DARK}44`,marginBottom:6}}>{label}</div>
                      <input type={type} placeholder={ph} value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))}/>
                    </div>
                  ))}
                  <div>
                    <div style={{fontFamily:"'Jost'",fontSize:9,letterSpacing:4,color:`${DARK}44`,marginBottom:6}}>備註 NOTE</div>
                    <textarea placeholder="特殊需求..." value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} rows={2}/>
                  </div>
                  <div>
                    <div style={{fontFamily:"'Jost'",fontSize:9,letterSpacing:4,color:`${DARK}44`,marginBottom:10}}>付款 PAYMENT</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                      {[["credit","💳","信用卡"],["linepay","💚","LINE Pay"],["cash","💵","貨到付款"]].map(([val,icon,label])=>(
                        <div key={val} className={`pay-opt${form.payment===val?" on":""}`}
                          onClick={()=>setForm(p=>({...p,payment:val}))}
                          onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}
                          style={{cursor:"none"}}>
                          <div style={{fontSize:18,marginBottom:5}}>{icon}</div>
                          <div style={{fontFamily:"'Jost'",fontSize:9,letterSpacing:2,color:form.payment===val?DARK:`${DARK}44`}}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{borderTop:`1px solid ${DARK}08`,paddingTop:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,fontSize:20,fontWeight:300}}>
                      <span style={{fontFamily:"'Jost'",fontSize:10,letterSpacing:2,color:`${DARK}55`,alignSelf:"center"}}>TOTAL</span>
                      <span>NT$ {totalPrice+30}</span>
                    </div>
                    <button className="submit-btn"
                      disabled={!form.name||!form.phone||!form.address}
                      onClick={()=>{if(form.name&&form.phone&&form.address)setOrderDone(true);}}
                      onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}>
                      確認下單 · Confirm Order
                    </button>
                  </div>
                </div>
              </>
            ):(
              <div style={{padding:"60px 40px",textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:20}}>✓</div>
                <div style={{fontFamily:"'Jost'",fontSize:9,letterSpacing:6,color:`${DARK}44`,marginBottom:12}}>ORDER CONFIRMED</div>
                <div style={{fontSize:36,fontWeight:300,marginBottom:10}}>訂單成立</div>
                <div style={{height:1,background:`${DARK}10`,width:60,margin:"16px auto"}}/>
                <p style={{fontFamily:"'Jost'",fontSize:11,color:`${DARK}55`,letterSpacing:1,lineHeight:2,marginBottom:6}}>
                  感謝您，{form.name}<br/>預計 30–45 分鐘送達
                </p>
                <p style={{fontFamily:"'Jost'",fontSize:10,color:`${DARK}33`,letterSpacing:2,marginBottom:36}}>
                  #ORD-{Math.floor(Math.random()*90000)+10000}
                </p>
                <button className="submit-btn"
                  onClick={()=>{setCheckout(false);setOrderDone(false);setCart({});setForm({name:"",phone:"",address:"",note:"",payment:"credit"});}}
                  onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}>
                  繼續點餐 · Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating cart */}
      {totalQty>0&&!cartOpen&&(
        <button onClick={()=>setCartOpen(true)}
          onMouseEnter={()=>big()} onMouseLeave={()=>big(false)}
          style={{
            position:"fixed",bottom:36,right:36,
            background:DARK,color:CREAM,border:"none",
            borderRadius:"50%",width:60,height:60,
            fontFamily:"'Jost'",fontSize:9,letterSpacing:2,
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            zIndex:450,boxShadow:`0 8px 32px ${DARK}22`,
          }}>
          <span style={{fontSize:18}}>🛒</span>
          <span>{totalQty}</span>
        </button>
      )}

      {/* Footer */}
      <div style={{borderTop:`1px solid ${DARK}08`,padding:"32px 48px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:"'Cormorant Garamond'",fontSize:18,fontWeight:300,letterSpacing:4}}>味鮮小館</span>
        <span style={{fontFamily:"'Jost'",fontSize:9,letterSpacing:3,color:`${DARK}33`}}>© 2024 · TAICHUNG</span>
        <span style={{fontFamily:"'Jost'",fontSize:9,letterSpacing:2,color:`${DARK}33`}}>11:00–21:00 DAILY</span>
      </div>
    </div>
  );
}

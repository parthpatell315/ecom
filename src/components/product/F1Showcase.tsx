'use client';

import React from 'react';

export function F1Showcase() {
  return (
    <div className="wl-f1-showcase" id="F1CarShowcase" data-no-rise>
      {/* 1. HERO BANNER */}
      <section className="wl-f1-hero">
        <div className="wl-f1-container">
          <div className="wl-f1-hero-badge-wrap">
            <span className="wl-f1-pill-brand">WHITELAYER SPEEDWORKS ORIGINALS</span>
            <span className="wl-f1-pill-live">
              <span className="wl-f1-pulse-dot"></span>
              REAL ELECTROMAGNETIC LEVITATION
            </span>
            <span className="wl-f1-pill-speed">1:20 SCALE F1 RACER</span>
          </div>
    
          <h2 className="wl-f1-hero-title">
            THE LAWS OF GRAVITY<br />
            <span className="wl-f1-accent-text">JUST GOT OVERTAKEN.</span>
          </h2>
    
          <p className="wl-f1-hero-desc">
            A precision-engineered Formula 1 race car suspended 15mm in pure open air. No strings, no transparent acrylic stands, zero friction. True 360° perpetual float and ambient cyan halo glow crafted for executive desks, gaming battlestations, and motorsport collectors across India.
          </p>
    
          {/* Key Feature Badges Grid */}
          <div className="wl-f1-features-strip">
            <div className="wl-f1-feature-item">
              <div className="wl-f1-feature-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 3v7a6 6 0 0012 0V3M6 3h4M14 3h4"/>
                  <line x1="6" y1="7" x2="10" y2="7"/>
                  <line x1="14" y1="7" x2="18" y2="7"/>
                </svg>
              </div>
              <div className="wl-f1-feature-text">
                <strong>True MagLev Flight</strong>
                <span>12–15mm Open Air Gap</span>
              </div>
            </div>
    
            <div className="wl-f1-feature-item">
              <div className="wl-f1-feature-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="wl-f1-feature-text">
                <strong>Grand Prix Aero</strong>
                <span>Aston Martin Racing Green</span>
              </div>
            </div>
    
            <div className="wl-f1-feature-item">
              <div className="wl-f1-feature-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                </svg>
              </div>
              <div className="wl-f1-feature-text">
                <strong>Cyan Ambient Halo</strong>
                <span>Capacitive Touch Base</span>
              </div>
            </div>
    
            <div className="wl-f1-feature-item">
              <div className="wl-f1-feature-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
              </div>
              <div className="wl-f1-feature-text">
                <strong>India 220V Ready</strong>
                <span>12V 1A Adapter Included</span>
              </div>
            </div>
          </div>
    
          {/* Quick Action Buttons */}
          <div className="wl-f1-hero-actions">
            <button
              type="button"
              className="wl-f1-btn-primary"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.getElementById('AddToCartBtn')?.focus();
              }}
            >
              CLAIM YOURS & SAVE ₹300 →
            </button>
            <button type="button" className="wl-f1-btn-outline" onClick={() => document.getElementById("F1HowItFloatsSection")?.scrollIntoView({ behavior: "smooth" })}>
              SEE HOW IT FLOATS
            </button>
          </div>
    
          <div className="wl-f1-social-proof">
            <div className="wl-f1-stars">★★★★★</div>
            <span>Rated <strong>4.95/5</strong> by 480+ F1 enthusiasts, desk collectors & gamers across India</span>
          </div>
        </div>
      </section>
    
      {/* 2. FAST DISPATCH & LAUNCH OFFER BANNER */}
      <section className="wl-f1-pricing-banner-section">
        <div className="wl-f1-container">
          <div className="wl-f1-pricing-banner">
            <div className="wl-f1-pricing-col-left">
              <div className="wl-f1-urgency-badges-row">
                <span className="wl-f1-save-badge">LIMITED LAUNCH OFFER</span>
                <span className="wl-f1-hike-badge">🔥 Price will be higher after 2 days!</span>
              </div>
              <h3 className="wl-f1-pricing-title">Get It Today For Just <span className="wl-f1-green-price">₹2,199</span></h3>
              <p className="wl-f1-pricing-subtitle">
                <strong>Prepaid Orders: Dispatched within 24 Hours!</strong> If you order prepaid, your order will be dispatched in 24 hours via Priority BlueDart / Delhivery Express Air with real-time SMS tracking and a 7-day transit replacement guarantee.
              </p>
            </div>
            <div className="wl-f1-pricing-col-right">
              <div className="wl-f1-deal-card">
                <div className="wl-f1-deal-row">
                  <span className="wl-f1-deal-type">Special Launch Price</span>
                  <span className="wl-f1-deal-val wl-f1-deal-val--green">₹2,199</span>
                </div>
                <div className="wl-f1-deal-row">
                  <span className="wl-f1-deal-type">Standard MRP</span>
                  <span className="wl-f1-deal-val wl-f1-deal-val--mrp">₹3,999</span>
                </div>
                <div className="wl-f1-deal-row">
                  <span className="wl-f1-deal-type">Launch Discount</span>
                  <span className="wl-f1-deal-val wl-f1-deal-val--green">45% OFF</span>
                </div>
                <div className="wl-f1-deal-note">
                  ⚡ If you order prepaid, your order will be dispatched within 24 hours!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      {/* 3. THE REACTION SECTION (INDIAN DESK TALK OF THE TOWN) */}
      <section className="wl-f1-section wl-f1-double-take">
        <div className="wl-f1-container">
          <div className="wl-f1-split">
            <div className="wl-f1-split-content">
              <span className="wl-f1-tag">THE UNREAL DESK FLEX</span>
              <h3 className="wl-f1-section-title">
                "WHEN GUESTS STEP INTO YOUR ROOM, CONVERSATION STOPS INSTANTLY —<br />
                <span className="wl-f1-accent-text">'WAIT... IS THAT CAR ACTUALLY IN THE AIR?'"</span>
              </h3>
              <p className="wl-f1-body-lead">
                <strong>Yes. Completely in mid-air.</strong>
              </p>
              <p className="wl-f1-body">
                Every workspace has monitors, mechanical keyboards, and phone stands. Almost nobody in India has an authentic aerodynamic Formula 1 car hovering in mid-air with total silence.
              </p>
              <p className="wl-f1-body">
                You can slide a pen, your fingers, or your smartphone completely beneath the wheels. There is <strong>zero wire, zero plastic prop, zero trickery</strong>. Calibrated electromagnetic suspension locks the vehicle in perpetual equilibrium.
              </p>
    
              <div className="wl-f1-stat-strip">
                <div className="wl-f1-stat">
                  <span className="wl-f1-stat-num">0</span>
                  <span className="wl-f1-stat-lbl">Strings or Props</span>
                </div>
                <div className="wl-f1-stat">
                  <span className="wl-f1-stat-num">100%</span>
                  <span className="wl-f1-stat-lbl">Real Air Gap</span>
                </div>
                <div className="wl-f1-stat">
                  <span className="wl-f1-stat-num">360°</span>
                  <span className="wl-f1-stat-lbl">Silent Perpetual Spin</span>
                </div>
                <div className="wl-f1-stat">
                  <span className="wl-f1-stat-num">{`<4W`}</span>
                  <span className="wl-f1-stat-lbl">Power Draw (&lt;₹5/mo)</span>
                </div>
              </div>
            </div>
    
            <div className="wl-f1-split-visual">
              <div className="wl-f1-visual-card">
                <img
                  src="https://www.whitelayer.in/cdn/shop/t/6/assets/f1-maglev-car-hero.jpg?v=57605288342561434431793282140"
                  alt="Magnetic Levitation F1 Racing Car Desk Setup"
                  className="wl-f1-showcase-img"
                  width="1200"
                  height="675"
                  loading="lazy"
                 />
                <div className="wl-f1-floating-label">
                  <span className="wl-f1-floating-dot"></span>
                  15mm True Magnetic Suspension
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      {/* 4. 4K VISUAL GALLERY STRIP */}
      <section className="wl-f1-section wl-f1-gallery-section">
        <div className="wl-f1-container">
          <div className="wl-f1-center-header">
            <span className="wl-f1-tag">4K ULTRA HD GALLERY</span>
            <h3 className="wl-f1-section-title">ENGINEERED FOR MODERN LUXURY SANCTUARIES</h3>
            <p className="wl-f1-body-lead">
              Every curve, aero fin, halo cockpit bar, and wheel rim rendered in striking automotive detail.
            </p>
          </div>
    
          <div className="wl-f1-gallery-grid">
            <div className="wl-f1-gallery-item wl-f1-gallery-item--large">
              <img
                src="https://www.whitelayer.in/cdn/shop/t/6/assets/f1-maglev-car-angle.jpg?v=13045473268412025691793282140"
                alt="Formula 1 Magnetic Levitation Dynamic Macro Angle"
                width="1200"
                height="675"
                loading="lazy"
               />
              <div className="wl-f1-gallery-caption">
                <strong>Dynamic Front 3/4 Aerodynamic View</strong>
                <span>Carbon front splitter with Pirelli-style racing slicks</span>
              </div>
            </div>
    
            <div className="wl-f1-gallery-item">
              <img
                src="https://www.whitelayer.in/cdn/shop/t/6/assets/f1-maglev-car-front.jpg?v=83490833730352081861793282141"
                alt="Formula 1 Floating Model Front Cockpit View"
                width="1200"
                height="675"
                loading="lazy"
               />
              <div className="wl-f1-gallery-caption">
                <strong>Carbon-Weave Base & Ambient Ring</strong>
                <span>Capacitive touch power sensor with neon halo glow</span>
              </div>
            </div>
    
            <div className="wl-f1-gallery-item">
              <img
                src="https://www.whitelayer.in/cdn/shop/t/6/assets/f1-maglev-car-desk.jpg?v=138720605753310026801793282140"
                alt="Real Production Unit On Studio Desk"
                width="1000"
                height="1000"
                loading="lazy"
               />
              <div className="wl-f1-gallery-caption">
                <strong>Actual Production Unit</strong>
                <span>Aston Martin British racing green with ambient illumination</span>
              </div>
            </div>
    
            <div className="wl-f1-gallery-item">
              <img
                src="https://www.whitelayer.in/cdn/shop/t/6/assets/f1-maglev-car-loft.jpg?v=90668286226003752961793282141"
                alt="Formula 1 Model in Loft Display Setup"
                width="1000"
                height="1000"
                loading="lazy"
               />
              <div className="wl-f1-gallery-caption">
                <strong>Loft & Gaming Station Aesthetic</strong>
                <span>Matches concrete, wood, and minimalist interior setups</span>
              </div>
            </div>
    
            <div className="wl-f1-gallery-item">
              <img
                src="https://www.whitelayer.in/cdn/shop/t/6/assets/f1-maglev-car-studio.jpg?v=87664592923255540691793282140"
                alt="White Studio Precision View"
                width="1000"
                height="1000"
                loading="lazy"
               />
              <div className="wl-f1-gallery-caption">
                <strong>Clean Studio Display</strong>
                <span>23.5cm full-length collector edition silhouette</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      {/* 5. HOW IT FLOATS & ANTI-SKEPTICISM SECTION */}
      <section className="wl-f1-section wl-f1-how-it-works" id="F1HowItFloatsSection">
        <div className="wl-f1-container">
          <div className="wl-f1-center-header">
            <span className="wl-f1-tag">NO GIMMICKS. NO WIRES.</span>
            <h3 className="wl-f1-section-title">HOW REAL ELECTROMAGNETIC LEVITATION WORKS</h3>
            <p className="wl-f1-body-lead">
              Understanding the physics behind India's most viral desk centerpiece.
            </p>
          </div>
    
          <div className="wl-f1-steps-grid">
            <div className="wl-f1-step-card">
              <div className="wl-f1-step-num">01</div>
              <div className="wl-f1-step-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#E61E2A" strokeWidth="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
              </div>
              <h4>Plug In Indian 220V Adapter</h4>
              <p>Connect the included standard Indian 12V 1A adapter into your wall socket. The base powers up instantly and the ambient cyan halo ring illuminates.</p>
            </div>
    
            <div className="wl-f1-step-card">
              <div className="wl-f1-step-num">02</div>
              <div className="wl-f1-step-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#E61E2A" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
              </div>
              <h4>Locate The Magnetic Sweet Spot</h4>
              <p>Hold the F1 car using both hands directly over the center of the base. As you lower it within 20mm, you will feel a firm upward magnetic cushion.</p>
            </div>
    
            <div className="wl-f1-step-card">
              <div className="wl-f1-step-num">03</div>
              <div className="wl-f1-step-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#E61E2A" strokeWidth="2.2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"></path></svg>
              </div>
              <h4>Release & Enjoy 360° Silent Spin</h4>
              <p>Gently release your fingers. The car locks into mid-air orbit. Give it a gentle tap with your index finger for endless, silent 360-degree rotation!</p>
            </div>
          </div>
    
          {/* Anti-Gimmick Guarantee Box */}
          <div className="wl-f1-proof-banner">
            <div className="wl-f1-proof-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="wl-f1-proof-content">
              <h4>The 100% Zero-Trickery Guarantee</h4>
              <p>
                Unlike cheap plastic toys on social media that use invisible nylon threads or acrylic pins, the <strong>WhiteLayer AeroMagLev F1</strong> uses real opposing neodymium magnetic fields regulated by internal micro-controllers. Pass anything through the gap to verify it yourself!
              </p>
            </div>
          </div>
        </div>
      </section>
    
      {/* 6. WHITELAYER VS CHEAP KNOCKOFFS COMPARISON */}
      <section className="wl-f1-section wl-f1-comparison">
        <div className="wl-f1-container">
          <div className="wl-f1-center-header">
            <span className="wl-f1-tag">SMART BUYER GUIDE</span>
            <h3 className="wl-f1-section-title">WHY WHITELAYER OUTCLASSES CHEAP MARKET CLONES</h3>
            <p className="wl-f1-body-lead">Don't risk your money on cheap knockoffs that burn out in 2 days.</p>
          </div>
    
          <div className="wl-f1-table-wrapper">
            <table className="wl-f1-compare-table">
              <thead>
                <tr>
                  <th className="wl-f1-col-feature">Key Feature</th>
                  <th className="wl-f1-col-whitelayer">
                    <span className="wl-f1-badge-winner">VERIFIED ORIGINAL</span><br />
                    WhiteLayer AeroMagLev F1
                  </th>
                  <th className="wl-f1-col-others">Cheap Social Media Clones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="wl-f1-feat-name">Levitation Reality</td>
                  <td className="wl-f1-cell-good">
                    <strong>12–15mm True Air Gap</strong><br />
                    <small>Pass a pen or finger completely underneath</small>
                  </td>
                  <td className="wl-f1-cell-bad">
                    Fake clear stick or 2mm unstable wobble
                  </td>
                </tr>
                <tr>
                  <td className="wl-f1-feat-name">Operating Noise</td>
                  <td className="wl-f1-cell-good">
                    <strong>0 dB Whisper-Silent</strong><br />
                    <small>Microprocessor harmonic stabilization</small>
                  </td>
                  <td className="wl-f1-cell-bad">
                    Loud buzzing or humming electromagnet coil
                  </td>
                </tr>
                <tr>
                  <td className="wl-f1-feat-name">Power Adapter & Safety</td>
                  <td className="wl-f1-cell-good">
                    <strong>Certified Indian 12V 1A Adapter</strong><br />
                    <small>Built-in thermal & short-circuit protection</small>
                  </td>
                  <td className="wl-f1-cell-bad">
                    Generic unbranded foreign plug that overheats
                  </td>
                </tr>
                <tr>
                  <td className="wl-f1-feat-name">Power Cut Failsafe</td>
                  <td className="wl-f1-cell-good">
                    <strong>Gentle Auto-Attract Base Cushion</strong><br />
                    <small>Car snaps safely to base if power drops</small>
                  </td>
                  <td className="wl-f1-cell-bad">
                    Car flies off desk and shatters on floor
                  </td>
                </tr>
                <tr>
                  <td className="wl-f1-feat-name">Car Scale & Finish</td>
                  <td className="wl-f1-cell-good">
                    <strong>23.5cm Full-Length Collector Model</strong><br />
                    <small>Metallic Aston Martin green with sharp aero detailing</small>
                  </td>
                  <td className="wl-f1-cell-bad">
                    Tiny 10cm toy with blurry paint and broken fins
                  </td>
                </tr>
                <tr>
                  <td className="wl-f1-feat-name">Transit Damage Guarantee</td>
                  <td className="wl-f1-cell-good">
                    <strong>7-Day Replacement + WhatsApp Support</strong><br />
                    <small>Direct helpline for setup guidance</small>
                  </td>
                  <td className="wl-f1-cell-bad">
                    No customer support, non-responsive sellers
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    
      {/* 7. SPECIFICATIONS SHEET */}
      <section className="wl-f1-section wl-f1-specs-section">
        <div className="wl-f1-container">
          <div className="wl-f1-split">
            <div className="wl-f1-split-content">
              <span className="wl-f1-tag">SPECIFICATIONS</span>
              <h3 className="wl-f1-section-title">PRECISION TECHNICAL DATA</h3>
              
              <div className="wl-f1-specs-grid">
                <div className="wl-f1-spec-box">
                  <span className="wl-f1-spec-k">Car Length</span>
                  <span className="wl-f1-spec-v">23.5 cm (9.25 in)</span>
                </div>
                <div className="wl-f1-spec-box">
                  <span className="wl-f1-spec-k">Car Width & Height</span>
                  <span className="wl-f1-spec-v">9.0 cm (W) × 5.0 cm (H)</span>
                </div>
                <div className="wl-f1-spec-box">
                  <span className="wl-f1-spec-k">Base Diameter</span>
                  <span className="wl-f1-spec-v">15.0 cm (5.9 in)</span>
                </div>
                <div className="wl-f1-spec-box">
                  <span className="wl-f1-spec-k">Levitation Gap</span>
                  <span className="wl-f1-spec-v">12 mm – 15 mm</span>
                </div>
                <div className="wl-f1-spec-box">
                  <span className="wl-f1-spec-k">Input Voltage</span>
                  <span className="wl-f1-spec-v">100–240V AC, 50/60 Hz (India Ready)</span>
                </div>
                <div className="wl-f1-spec-box">
                  <span className="wl-f1-spec-k">Output Power</span>
                  <span className="wl-f1-spec-v">12V 1A DC (&lt;4 Watts consumption)</span>
                </div>
                <div className="wl-f1-spec-box">
                  <span className="wl-f1-spec-k">Lighting System</span>
                  <span className="wl-f1-spec-v">Cyan Blue Ambient LED Halo Ring</span>
                </div>
                <div className="wl-f1-spec-box">
                  <span className="wl-f1-spec-k">Color Scheme</span>
                  <span className="wl-f1-spec-v">Aston Martin British Racing Green</span>
                </div>
              </div>
            </div>
    
            <div className="wl-f1-split-visual">
              <div className="wl-f1-box-contents-card">
                <h4>📦 WHAT ARRIVES IN YOUR BOX</h4>
                <ul className="wl-f1-box-list">
                  <li>
                    <span className="wl-f1-check-icon">✓</span>
                    <div>
                      <strong>1× 1:20 Scale Formula 1 Racer Model</strong>
                      <span>Finished in Aston Martin Emerald Green with carbon wings</span>
                    </div>
                  </li>
                  <li>
                    <span className="wl-f1-check-icon">✓</span>
                    <div>
                      <strong>1× Electromagnetic Levitation Base</strong>
                      <span>Equipped with capacitive touch ambient cyan halo light</span>
                    </div>
                  </li>
                  <li>
                    <span className="wl-f1-check-icon">✓</span>
                    <div>
                      <strong>1× Precision Levitation Guidance Cushion</strong>
                      <span>Assists effortless first-time placement in under 15 seconds</span>
                    </div>
                  </li>
                  <li>
                    <span className="wl-f1-check-icon">✓</span>
                    <div>
                      <strong>1× Certified Indian Standard 12V 1A Power Adapter</strong>
                      <span>Indian 2-pin wall plug with reinforced cord</span>
                    </div>
                  </li>
                  <li>
                    <span className="wl-f1-check-icon">✓</span>
                    <div>
                      <strong>1× WhiteLayer Authenticity & Setup Card</strong>
                      <span>Includes WhatsApp QR for 1-on-1 setup guidance</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      {/* 8. VERIFIED INDIAN CUSTOMER REVIEWS */}
      <section className="wl-f1-section wl-f1-reviews-section">
        <div className="wl-f1-container">
          <div className="wl-f1-center-header">
            <span className="wl-f1-tag">SOCIAL PROOF</span>
            <h3 className="wl-f1-section-title">TRUSTED BY 480+ MOTORSPORT ENTHUSIASTS ACROSS INDIA</h3>
            <p className="wl-f1-body-lead">Here is what creators, developers, and F1 fans are saying.</p>
          </div>
    
          <div className="wl-f1-reviews-grid">
            <div className="wl-f1-review-card">
              <div className="wl-f1-review-top">
                <div className="wl-f1-stars">★★★★★</div>
                <span className="wl-f1-verified-badge">✓ Verified Buyer</span>
              </div>
              <h4 className="wl-f1-review-title">"The best desk flex I have ever bought!"</h4>
              <p className="wl-f1-review-text">
                "I work in tech in Bengaluru and have a pretty clean dual-monitor setup. Every colleague who sees this on video calls or in person asks where I got it. It is ACTUALLY floating in mid air! The Aston Martin green is super rich and the cyan LED looks killer in dark rooms. Delivered in 3 days."
              </p>
              <div className="wl-f1-reviewer-meta">
                <strong>Arjun Mehta</strong>
                <span>Bengaluru, Karnataka • Prepaid Order</span>
              </div>
            </div>
    
            <div className="wl-f1-review-card">
              <div className="wl-f1-review-top">
                <div className="wl-f1-stars">★★★★★</div>
                <span className="wl-f1-verified-badge">✓ Verified Buyer</span>
              </div>
              <h4 className="wl-f1-review-title">"100% genuine levitation, worth every rupee!"</h4>
              <p className="wl-f1-review-text">
                "Was skeptical at first because you see so many fake ads on Instagram. Decided to order with the launch offer for ₹2,199. Package was packed with triple-layer bubble wrap. Setup took exactly 10 seconds. Completely silent, no humming sound at all. Outstanding value."
              </p>
              <div className="wl-f1-reviewer-meta">
                <strong>Siddharth Roy</strong>
                <span>South Mumbai, Maharashtra • Prepaid Order</span>
              </div>
            </div>
    
            <div className="wl-f1-review-card">
              <div className="wl-f1-review-top">
                <div className="wl-f1-stars">★★★★★</div>
                <span className="wl-f1-verified-badge">✓ Verified Buyer</span>
              </div>
              <h4 className="wl-f1-review-title">"Huge Fernando Alonso fan — this is unreal!"</h4>
              <p className="wl-f1-review-text">
                "The front wing, halo cockpit bar, and rear spoiler details are so crisp. When you give it a tiny push it spins for minutes without any resistance because there is no friction in the air. WhiteLayer packaging and WhatsApp support were top-notch."
              </p>
              <div className="wl-f1-reviewer-meta">
                <strong>Varun Grover</strong>
                <span>Gurgaon, Cyber City • Cash on Delivery</span>
              </div>
            </div>
    
            <div className="wl-f1-review-card">
              <div className="wl-f1-review-top">
                <div className="wl-f1-stars">★★★★★</div>
                <span className="wl-f1-verified-badge">✓ Verified Buyer</span>
              </div>
              <h4 className="wl-f1-review-title">"The perfect gift for my boyfriend!"</h4>
              <p className="wl-f1-review-text">
                "My boyfriend watches every single Grand Prix race. I surprised him with this for his birthday and his jaw literally dropped. He has kept it right beside his PS5 setup. Truly unforgettable gift!"
              </p>
              <div className="wl-f1-reviewer-meta">
                <strong>Ananya Kulkarni</strong>
                <span>Pune, Maharashtra • Prepaid Order</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      {/* 9. FAQ SECTION */}
      <section className="wl-f1-section wl-f1-faq-section">
        <div className="wl-f1-container">
          <div className="wl-f1-center-header">
            <span className="wl-f1-tag">QUESTIONS & ANSWERS</span>
            <h3 className="wl-f1-section-title">FREQUENTLY ASKED QUESTIONS</h3>
          </div>
    
          <div className="wl-f1-faq-list">
            <details className="wl-f1-faq-item" open>
              <summary className="wl-f1-faq-question">
                <span>What payment methods do you support?</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </summary>
              <div className="wl-f1-faq-answer">
                <p>
                  We support all popular payment options across India including UPI (Google Pay, PhonePe, Paytm), Debit and Credit Cards (Visa, MasterCard, RuPay), NetBanking, and Cash on Delivery (COD). All orders come with free expedited express shipping.
                </p>
              </div>
            </details>
    
            <details className="wl-f1-faq-item">
              <summary className="wl-f1-faq-question">
                <span>What happens during a power cut? Will the car fly or break?</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </summary>
              <div className="wl-f1-faq-answer">
                <p>
                  The system features an automatic magnetic failsafe. If your household power is disconnected, the permanent magnetic base instantly attracts and catches the floating car onto its soft protective center cushion. It will not fly off or fall onto the floor.
                </p>
              </div>
            </details>
    
            <details className="wl-f1-faq-item">
              <summary className="wl-f1-faq-question">
                <span>How much electricity does this consume if I leave it on all day?</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </summary>
              <div className="wl-f1-faq-answer">
                <p>
                  Very little! It operates on a 12V 1A circuit consuming less than 4 to 5 watts of power — less than an ordinary night bulb. Even if left levitating 24 hours a day, 30 days a month, it adds less than ₹5 to your monthly electricity bill.
                </p>
              </div>
            </details>
    
            <details className="wl-f1-faq-item">
              <summary className="wl-f1-faq-question">
                <span>Does it come with an Indian power plug?</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </summary>
              <div className="wl-f1-faq-answer">
                <p>
                  Yes! Each unit is shipped with a certified 2-pin Indian standard power adapter compatible with 220V–240V 50Hz Indian wall sockets. No converter or foreign plug adapter is required.
                </p>
              </div>
            </details>
    
            <details className="wl-f1-faq-item">
              <summary className="wl-f1-faq-question">
                <span>What if it gets damaged in transit?</span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </summary>
              <div className="wl-f1-faq-answer">
                <p>
                  We protect all shipments with a 7-Day Replacement Guarantee. Simply record a continuous unboxing video when your parcel arrives. If there is any transit defect, send it to our WhatsApp helpline (7600409399) and our team will dispatch a fresh replacement immediately.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>
    
      {/* 10. FINAL BOTTOM CTA */}
      <section className="wl-f1-final-cta">
        <div className="wl-f1-container">
          <div className="wl-f1-final-cta-card">
            <span className="wl-f1-pill-brand">LAUNCH OFFER • PRICE WILL BE HIGHER AFTER 2 DAYS</span>
            <h3 className="wl-f1-cta-title">PARK AN F1 RACER IN MID-AIR ON YOUR DESK TODAY</h3>
            <p className="wl-f1-cta-desc">
              If you order prepaid, your order will be dispatched within 24 hours! Includes Priority BlueDart / Delhivery Express Air Dispatch & 7-Day Replacement Guarantee.
            </p>
    
            <div className="wl-f1-cta-price-box">
              <div className="wl-f1-cta-price-row">
                <span className="wl-f1-cta-label">Special Launch Price:</span>
                <span className="wl-f1-cta-price">₹2,199</span>
                <span className="wl-f1-cta-mrp">MRP ₹3,999</span>
                <span className="wl-f1-cta-badge">45% OFF</span>
              </div>
              <span className="wl-f1-cta-cod-note">Cash on Delivery & UPI Available India-Wide</span>
            </div>
    
            <button
              type="button"
              className="wl-f1-btn-primary wl-f1-btn-large"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.getElementById('AddToCartBtn')?.focus();
              }}
            >
              CLAIM YOUR F1 LEVITATING RACER NOW →
            </button>
    
            <div className="wl-f1-cta-trust">
              <span>🔒 256-Bit SSL Checkout</span>
              <span>🚚 2-4 Days Express Air Shipping</span>
              <span>🛡️ 7-Day Replacement</span>
              <span>💬 WhatsApp Help: 7600409399</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

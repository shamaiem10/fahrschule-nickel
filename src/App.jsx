import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const URLS = {
  hero: 'https://www.fs-nickel.de/wp-content/uploads/2024/12/PHOTO-2024-12-08-14-06-39.jpg',
  contact: 'https://www.fs-nickel.de/wp-content/uploads/2023/09/PHOTO-2023-09-04-12-31-27_opt.png',
  locations: 'https://www.fs-nickel.de/wp-content/uploads/2023/04/fahrschule-nickel-klewe-kalkar-emmerich-9.jpg',
  fleet: 'https://www.fs-nickel.de/wp-content/uploads/2023/04/fahrschule-nickel-klewe-kalkar-emmerich-11.jpg',
  arabic: 'https://www.fs-nickel.de/wp-content/uploads/2023/04/fahrschule-nickel-klewe-kalkar-emmerich-12-e1682514232255.jpg',
  gallery: 'https://www.fs-nickel.de/wp-content/uploads/2023/04/fahrschule-nickel-klewe-kalkar-emmerich-7.jpg',
  school: 'https://www.fs-nickel.de/wp-content/uploads/2023/04/driving-school.svg',
  wheel: 'https://www.fs-nickel.de/wp-content/uploads/2023/04/steering-wheel.svg',
  classIcon: 'https://www.fs-nickel.de/wp-content/uploads/2023/04/class.svg',
  bot: 'https://ai.berendsohn.com/media/chatbot/chat_bubble_imgs/nickel-bot-2_20241001_083556_wxVMnRe.png',
  club: 'https://www.fs-nickel.de/wp-content/uploads/2024/07/AdobeStock_740283372-web.png',
  road: 'https://www.fs-nickel.de/wp-content/uploads/photo-1562618817-4c48e063c39a-scaled.jpg',
  editorial: 'https://www.fs-nickel.de/wp-content/uploads/photo-1532004252750-b411a84c8a41-scaled.jpg',
  be: 'https://www.fs-nickel.de/wp-content/uploads/2023/04/fuehrerschein-klasse-be.svg'
};

const easePremium = [0.16, 1, 0.3, 1];
const external = {
  contact: 'https://www.fs-nickel.de/kontakt/',
  registration: 'https://www.fs-nickel.de/anmeldung/',
  classes: 'https://www.fs-nickel.de/ausbildungsklassen/',
  vehicles: 'https://www.fs-nickel.de/fahrzeuge/',
  locations: 'https://www.fs-nickel.de/filialen/',
  guide: 'https://www.fs-nickel.de/ratgeber/',
  whatsapp: 'https://wa.me/+4915129006501'
};

function Reveal({ children, className = '', delay = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0.2 : 0.6, delay: reduced ? 0 : delay, ease: reduced ? 'easeOut' : easePremium }}
    >
      {children}
    </motion.div>
  );
}

function ImageFrame({ src, alt, className = '', hero = false, children }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`image-frame ${className}`}
      initial={{ opacity: 0, scale: reduced ? 1 : 1.03 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0.2 : 0.6, ease: 'easeOut' }}
    >
      <div className="image-fallback" aria-hidden="true"><i className="bi bi-signpost-2"></i></div>
      <motion.img
        src={src}
        alt={alt}
        loading={hero ? 'eager' : 'lazy'}
        decoding="async"
        onError={(event) => { event.currentTarget.style.display = 'none'; }}
        whileHover={reduced ? undefined : { scale: 1.06, x: -5 }}
        transition={{ duration: 0.5, ease: easePremium }}
      />
      <span className="image-overlay" aria-hidden="true"></span>
      {children}
    </motion.div>
  );
}

function ActionLink({ href, children, variant = 'primary', icon = 'bi bi-arrow-right', className = '' }) {
  const reduced = useReducedMotion();
  return (
    <motion.a
      className={`button button-${variant} ${className}`}
      href={href}
      whileHover={reduced ? undefined : { y: -3, scale: 1.03 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.22, ease: easePremium }}
    >
      <span>{children}</span><i className={icon || 'bi bi-arrow-right'}></i>
    </motion.a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ['Start', '#start'], ['Klassen', '#klassen'], ['Fahrzeuge', '#fahrzeuge'],
    ['Filialen', '#filialen'], ['Anmeldung', '#anmeldung'], ['Ratgeber', '#ratgeber'], ['Kontakt', '#kontakt']
  ];
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">Zum Hauptinhalt springen</a>
      <div className="nav-shell">
        <a className="brand" href="#start" aria-label="Fahrschule Nickel Startseite">
          <span className="brand-mark">N</span><span>Fahrschule <strong>Nickel</strong></span>
        </a>
        <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Navigation öffnen">
          <i className={open ? 'bi bi-x-lg' : 'bi bi-list'}></i>
        </button>
        <nav className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Hauptnavigation">
          {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="nav-whatsapp" href={external.whatsapp}><i className="bi bi-whatsapp"></i> WhatsApp</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const [city, setCity] = useState(0);
  const cities = ['Emmerich', 'Kleve', 'Kalkar'];
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 36]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.03]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -24]);
  const markerClip = useTransform(scrollYProgress, [0, 0.8], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);

  useEffect(() => {
    if (reduced) return undefined;
    const timer = window.setInterval(() => setCity((value) => (value + 1) % cities.length), 2500);
    return () => window.clearInterval(timer);
  }, [reduced, cities.length]);

  return (
    <section id="start" className="hero" ref={sectionRef}>
      <motion.div className="hero-photo" style={{ y: imageY, scale: imageScale }}>
        <div className="image-fallback hero-fallback" aria-hidden="true"><i className="bi bi-car-front"></i></div>
        <motion.img
          src={URLS.hero}
          alt="Fahrschule Nickel"
          decoding="async"
          initial={{ opacity: 0, scale: reduced ? 1 : 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0.2 : 0.6, ease: 'easeOut' }}
          whileHover={reduced ? undefined : { scale: 1.04 }}
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />
        <motion.span className="hero-duotone" whileHover={reduced ? undefined : { opacity: 0.18 }}></motion.span>
      </motion.div>
      <div className="hero-asphalt"></div>
      <motion.div className="hero-mesh mesh-one" animate={reduced ? undefined : { x: [-20, 24], y: [0, 18], rotate: [0, 8] }} transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}></motion.div>
      <div className="container hero-grid">
        <motion.div className="hero-copy" style={{ y: copyY }}>
          <motion.p className="eyebrow light" initial={{ opacity: 0, y: reduced ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0.2 : 0.55, ease: easePremium }}>Fahrschule Nickel · Emmerich – Kleve – Kalkar</motion.p>
          <h1 aria-label="Führerschein machen, so einfach, so schnell, so gut.">
            {['Führerschein machen,', 'so einfach,', 'so schnell,', 'so gut.'].map((line, index) => (
              <motion.span key={line} initial={{ opacity: 0, y: reduced ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0.2 : 0.5, delay: reduced ? 0 : index * 0.07, ease: easePremium }}>{line}</motion.span>
            ))}
          </h1>
          <motion.p className="hero-lead" initial={{ opacity: 0, y: reduced ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0.2 : 0.55, delay: reduced ? 0 : 0.36, ease: easePremium }}>Dein Start in die Freiheit beginnt hier!</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, x: reduced ? 0 : 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0.2 : 0.4, delay: reduced ? 0 : 0.46, ease: 'easeOut' }}>
            <ActionLink href="#kontakt" icon="bi bi-signpost-2">Beratung</ActionLink>
            <ActionLink href="#anmeldung" variant="outline-light" icon="bi bi-lightning-charge">Anmeldung</ActionLink>
          </motion.div>
        </motion.div>
      </div>
      <motion.div className="road-line" initial={{ scaleX: reduced ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.15, ease: 'easeInOut' }}>
        <motion.span className="lane-markers" style={{ clipPath: reduced ? 'none' : markerClip }}></motion.span>
      </motion.div>
      <motion.div className="city-ticker" whileHover={reduced ? undefined : { y: -2, borderColor: '#F6C700', boxShadow: '0 8px 24px rgba(246,199,0,0.22)' }}>
        <i className="bi bi-signpost-2"></i>
        <span className="ticker-label">Nächste Ausfahrt</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.strong key={reduced ? 'Emmerich' : cities[city]} initial={{ y: reduced ? 0 : '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduced ? 0 : '-100%', opacity: 0 }} transition={{ duration: reduced ? 0.2 : 0.3, ease: 'easeInOut' }}>{reduced ? 'Emmerich' : cities[city]}</motion.strong>
        </AnimatePresence>
        <span className="ticker-dots">{cities.map((name, index) => <i key={name} className={index === city ? 'active' : ''}></i>)}</span>
      </motion.div>
    </section>
  );
}

const values = [
  { icon: 'bi bi-calendar-check', title: 'Flexible Zeiten', text: 'Flexible Unterrichtszeiten, die sich an Deine Verfügbarkeit anpassen lassen.' },
  { icon: 'bi bi-shield-check', title: 'Strukturierte Praxis', text: 'Erfahrene Fahrlehrer begleiten Dich Schritt für Schritt durch Deine Fahrausbildung.' },
  { icon: 'bi bi-emoji-smile', title: 'Familiäre Betreuung', text: 'Individuelle Betreuung in einer familiären Lernumgebung.' }
];

function Values() {
  return (
    <section className="section values-section">
      <div className="container narrow">
        <Reveal className="section-heading centered"><p className="eyebrow">Dein Weg zum Erfolg</p><h2>Schnell. Sicher. Sympathisch.</h2></Reveal>
        <div className="value-grid">
          {values.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.11}>
              <motion.article className="value-card" whileHover={{ y: -8, scale: 1.02, borderColor: '#F6C700', backgroundColor: '#FFFDF2', boxShadow: '0 18px 42px rgba(246,199,0,0.20)' }} transition={{ duration: 0.28, ease: easePremium }}>
                <motion.span className="icon-box" whileHover={{ rotate: 3, scale: 1.1, backgroundColor: '#F6C700' }}><i className={item.icon || 'bi bi-grid'}></i></motion.span>
                <h3>{item.title}</h3><p>{item.text}</p><span className="card-underline"></span>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  ['bi bi-pencil-square', '1', 'Anmeldung'], ['bi bi-journal-bookmark', '2', 'Theorie'], ['bi bi-steering-wheel', '3', 'Praxis'], ['bi bi-patch-check-fill', '4', 'Prüfung'], ['bi bi-award', '5', 'Glückwunsch']
];

function LicenseLane() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end center'] });
  const progress = useTransform(scrollYProgress, [0.1, 0.85], [0, 1]);
  return (
    <section className="section lane-section" ref={ref}>
      <div className="container">
        <Reveal className="section-heading"><p className="eyebrow">Der Weg zum Erfolg</p><h2>Dein Weg zum Führerschein</h2></Reveal>
        <div className="steps-track">
          <div className="track-dash"></div><motion.div className="track-progress" style={{ scaleX: reduced ? 1 : progress }}></motion.div>
          {steps.map(([icon, number, label], index) => (
            <Reveal key={label} className="step-wrap" delay={index * 0.1}>
              <motion.article className="step-card" whileHover={reduced ? undefined : { y: -6, scale: 1.04, borderColor: '#F6C700', backgroundColor: '#FFF9D9', boxShadow: '0 12px 30px rgba(246,199,0,0.28)' }}>
                <span className="step-number">{number}</span><span className="step-icon"><i className={icon || 'bi bi-circle'}></i></span><h3>{label}</h3>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Fleet() {
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const captions = ['Automatik & Schaltung', 'Anhänger & Motorräder', 'E-Autos wie Tesla & VW ID.4'];
  useEffect(() => {
    if (reduced || paused) return undefined;
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % captions.length), 5500);
    return () => window.clearInterval(timer);
  }, [paused, reduced, captions.length]);
  return (
    <section id="fahrzeuge" className="section fleet-section">
      <div className="container narrow fleet-grid">
        <Reveal className="fleet-copy"><p className="eyebrow">Unsere Fahrzeugflotte</p><h2>Modern & elektrisch</h2><p>Unsere topmoderne Fahrzeugflotte bereitet Dich auf vielfältige Anforderungen im Straßenverkehr vor.</p><div className="fleet-badges"><span><i className="bi bi-car-front"></i> Vielfalt</span><span><i className="bi bi-ev-station"></i> E-Mobilität</span></div><ActionLink href={external.vehicles} variant="dark">Fahrzeuge ansehen</ActionLink></Reveal>
        <motion.div className="fleet-carousel" onHoverStart={() => setPaused(true)} onHoverEnd={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <ImageFrame src={URLS.fleet} alt="Fahrzeugflotte der Fahrschule Nickel" className="fleet-frame">
            <div className="frame-caption"><AnimatePresence mode="wait"><motion.strong key={captions[slide]} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{captions[slide]}</motion.strong></AnimatePresence></div>
          </ImageFrame>
          <div className="carousel-controls"><button type="button" onClick={() => setSlide((slide + captions.length - 1) % captions.length)} aria-label="Vorheriger Eintrag"><i className="bi bi-arrow-left"></i></button><div className="pagination">{captions.map((caption, index) => <button key={caption} type="button" className={index === slide ? 'active' : ''} onClick={() => setSlide(index)} aria-label={caption}></button>)}</div><button type="button" onClick={() => setSlide((slide + 1) % captions.length)} aria-label="Nächster Eintrag"><i className="bi bi-arrow-right"></i></button></div>
        </motion.div>
      </div>
    </section>
  );
}

function TriCity() {
  const reduced = useReducedMotion();
  return (
    <section className="section route-section">
      <motion.div className="route-image" whileHover={reduced ? undefined : { scale: 1.09 }}>
        <div className="image-fallback" aria-hidden="true"><i className="bi bi-route"></i></div>
        <img src={URLS.road} alt="Straße zwischen den drei Standorten" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
      </motion.div>
      <div className="route-overlay"></div>
      <div className="container route-content">
        <Reveal><p className="eyebrow light">Immer in Deiner Nähe</p><h2>Emmerich <span>•</span> Kleve <span>•</span> Kalkar</h2></Reveal>
        <div className="route-map"><motion.div className="route-path" initial={{ scaleX: reduced ? 1 : 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: reduced ? 0 : 1.2, ease: 'easeInOut' }}></motion.div>{['Emmerich', 'Kleve', 'Kalkar'].map((name, index) => <motion.div key={name} className="route-marker" initial={{ opacity: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : 0.7 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: reduced ? 0 : index * 0.18, duration: reduced ? 0.2 : 0.45 }} whileHover={reduced ? undefined : { y: -7, scale: 1.08, backgroundColor: '#FFF5BD', borderColor: '#F6C700', boxShadow: '0 14px 34px rgba(246,199,0,0.36)' }}><i className="bi bi-geo-alt"></i><strong>{name}</strong></motion.div>)}</div>
        <ActionLink href="#filialen">Filialen ansehen</ActionLink>
      </div>
    </section>
  );
}

function WhatsAppBand() {
  const reduced = useReducedMotion();
  return (
    <section className="whatsapp-wrap">
      <div className="container compact">
        <motion.div className="whatsapp-band" initial={{ opacity: 0, x: reduced ? 0 : -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }} whileHover={reduced ? undefined : { y: -4, backgroundColor: '#FFD52B', borderColor: '#1F2328', boxShadow: '0 20px 44px rgba(246,199,0,0.36)' }}>
          <motion.span className="wa-icon" animate={reduced ? undefined : { scale: [1, 1.12, 1], boxShadow: ['0 0 0 0 rgba(27,158,75,.34)', '0 0 0 12px rgba(27,158,75,0)', '0 0 0 0 rgba(27,158,75,0)'] }} transition={{ duration: 1.8, repeat: Infinity }}><i className="bi bi-whatsapp"></i></motion.span>
          <div><span className="quick-badge"><i></i> Antwort schnell</span><h2>WhatsApp-Sofortberatung</h2><p>WA: 0151/29006501 – Schreibe uns jetzt</p></div>
          <ActionLink href={external.whatsapp} variant="wa" icon="bi bi-chat-dots">Nachricht senden</ActionLink>
        </motion.div>
      </div>
    </section>
  );
}

function Arabic() {
  const schedules = [['Kleve', 'Triftstr. 72 · 47533 Kleve', 'Donnerstag, 18:00–20:00 Uhr'], ['Emmerich am Rhein', 'Görrestr. 2 · 46446 Emmerich am Rhein', 'Mittwoch, 18:00–20:00 Uhr']];
  return (
    <section className="section arabic-section">
      <div className="container narrow split-grid">
        <Reveal className="arabic-visual"><ImageFrame src={URLS.arabic} alt="Fahrschule Nickel – mehrsprachige Beratung" className="keyline-frame" /></Reveal>
        <Reveal className="arabic-copy"><p className="eyebrow"><i className="bi bi-translate"></i> Wir sind mehrsprachig</p><h2>Beratung auf Arabisch</h2><p className="arabic-text" lang="ar" dir="rtl">للمهتمين بتعلم القيادة باللغة العربية الرجاء إرسال رسالة نصية او صوتية على الرقم التالي</p><div className="schedule-list">{schedules.map(([city, address, time], index) => <motion.article key={city} className="schedule-item" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ x: 5, backgroundColor: '#FFF9D9', borderColor: '#F6C700', boxShadow: '0 10px 24px rgba(246,199,0,0.18)' }}><i className="bi bi-clock"></i><div><strong>{city}</strong><span>{address}</span><span>{time}</span></div></motion.article>)}</div><ActionLink href={external.whatsapp} variant="success" icon="bi bi-whatsapp">0151/29006501</ActionLink></Reveal>
      </div>
    </section>
  );
}

const articles = [
  'Elektrisch durchstarten: Fahrtraining mit E-Autos bei der Fahrschule Nickel',
  'Bußgelder und Punkte vermeiden: aktuelle Regeln im Straßenverkehr',
  'Fahrangst überwinden: Strategien und Tipps für entspannteres Fahren'
];

function Guide() {
  return (
    <section id="ratgeber" className="section guide-section">
      <div className="container">
        <Reveal className="section-heading guide-heading"><div><p className="eyebrow">Tipps & Updates</p><h2>Ratgeber</h2></div><ActionLink href={external.guide} variant="dark">Alle Artikel</ActionLink></Reveal>
        <ImageFrame src={URLS.editorial} alt="Ratgeber der Fahrschule Nickel" className="editorial-image" />
        <div className="article-grid">{articles.map((title, index) => <Reveal key={title} delay={index * 0.12}><motion.article className="article-card" whileHover={{ y: -9, scale: 1.015, borderColor: '#1E6EEB', backgroundColor: '#F8FBFF', boxShadow: '0 20px 44px rgba(30,110,235,0.18)' }}><span className="article-chip">Ratgeber</span><i className="bi bi-journal-text article-icon"></i><h3>{title}</h3><a href={external.guide}>Lesen <i className="bi bi-chevron-right"></i></a></motion.article></Reveal>)}</div>
      </div>
    </section>
  );
}

const classes = ['B', 'BE', 'B96', 'A', 'A2', 'A1', 'AM', 'Mofa'];
function Classes() {
  return (
    <section id="klassen" className="section classes-section">
      <div className="container">
        <Reveal className="section-heading"><p className="eyebrow">Auto, Motorrad oder Mofa</p><h2>Die Führerscheinklassen im Überblick</h2></Reveal>
        <div className="class-grid">{classes.map((name, index) => <Reveal key={name} delay={index * 0.09}><motion.article className="class-card" whileHover={{ y: -8, scale: 1.02, borderColor: '#F6C700', backgroundColor: '#FFFDF5', boxShadow: '0 18px 38px rgba(30,110,235,0.16)' }}><span className="class-tag">{name}</span><span className="class-card-icon"><i className={index > 2 ? 'bi bi-motorcycle' : 'bi bi-car-front'}></i></span><h3>Klasse {name}</h3><p>Informationen zur Führerscheinklasse bei Fahrschule Nickel.</p><a href={external.classes}>Details ansehen <i className="bi bi-arrow-right"></i></a><span className="class-lane"></span></motion.article></Reveal>)}</div>
      </div>
    </section>
  );
}

function BEFeature() {
  return (
    <section className="section be-section">
      <div className="container compact be-grid">
        <Reveal><motion.div className="be-chip" whileHover={{ y: -7, rotate: 0, borderColor: '#1E6EEB', backgroundColor: '#263544', boxShadow: '0 22px 48px rgba(30,110,235,0.24)' }}><div className="image-fallback"><i className="bi bi-truck"></i></div><motion.img src={URLS.be} alt="Führerscheinklasse BE" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = 'none'; }} whileHover={{ scale: 1.08, x: 6, filter: 'drop-shadow(0 8px 12px rgba(246,199,0,0.32))' }} /></motion.div></Reveal>
        <Reveal className="be-copy"><span className="class-tag">BE</span><h2>Klasse BE</h2><p><strong>Mindestalter:</strong> 18 / BF 17 Jahre</p><p><strong>Voraussetzung:</strong> Führerschein Klasse B. Die BE-Klasse ermöglicht das Führen von Fahrzeugkombinationen mit Anhänger.</p><ActionLink href="https://www.fs-nickel.de/klasse-be/">Alle Details zur Klasse BE</ActionLink></Reveal>
      </div>
    </section>
  );
}

function Gallery() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  return (
    <section className="section gallery-section">
      <div className="container">
        <Reveal className="section-heading"><p className="eyebrow"><i className="bi bi-collection"></i> Unsere Flotte</p><h2>Automatik, Schaltung, Anhänger, Motorrad & E-Auto</h2></Reveal>
        <Reveal><motion.button className="gallery-card" type="button" onClick={() => setOpen(true)} whileHover={reduced ? undefined : { y: -8, rotate: 0.5, borderColor: '#1E6EEB', backgroundColor: '#F7FAFF', boxShadow: '0 20px 42px rgba(30,110,235,0.20)' }}><ImageFrame src={URLS.gallery} alt="Fahrzeug der Fahrschule Nickel" className="gallery-image" /><span className="gallery-caption"><strong>Unsere Fahrzeugflotte</strong><span>Bild öffnen <i className="bi bi-arrows-fullscreen"></i></span></span></motion.button></Reveal>
      </div>
      <AnimatePresence>{open && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Fahrzeugbild" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}><motion.div className="lightbox-panel" initial={{ opacity: 0, scale: reduced ? 1 : 0.9, y: reduced ? 0 : 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }} onClick={(event) => event.stopPropagation()}><button type="button" onClick={() => setOpen(false)} aria-label="Schließen"><i className="bi bi-x-lg"></i></button><div className="image-fallback"><i className="bi bi-car-front"></i></div><img src={URLS.school} alt="Fahrschule" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><span>Fahrschule Nickel · 1 / 1</span></motion.div></motion.div>}</AnimatePresence>
    </section>
  );
}

const locations = [['Kleve', 'Triftstr. 72', '47533 Kleve'], ['Emmerich', 'Görrestr. 2', '46446 Emmerich'], ['Kalkar', 'Altkalkarerstr. 12', '47546 Kalkar']];
function Locations() {
  return (
    <section id="filialen" className="section locations-section">
      <div className="container">
        <Reveal className="location-hero"><ImageFrame src={URLS.locations} alt="Fahrschule Nickel Standort" className="location-image"><div className="location-hero-label"><i className="bi bi-route"></i><strong>Standorte & Anmeldung vor Ort</strong></div></ImageFrame></Reveal>
        <div className="location-route"></div>
        <div className="location-grid">{locations.map(([city, street, postal], index) => <Reveal key={city} delay={index * 0.13}><motion.article className="location-card" whileHover={{ y: -8, scale: 1.02, borderColor: '#F6C700', backgroundColor: '#FFFDF2', boxShadow: '0 20px 42px rgba(246,199,0,0.22)' }}><motion.span className="pin" initial={{ opacity: 0, y: -24, scale: 0.65 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}><i className="bi bi-geo-alt"></i></motion.span><h3>{city}</h3><p>{street}<br />{postal}</p><span className="on-site">Anmeldung vor Ort möglich</span><a href={external.locations}>Filiale ansehen <i className="bi bi-route"></i></a></motion.article></Reveal>)}</div>
      </div>
    </section>
  );
}

function Registration() {
  return (
    <section id="anmeldung" className="section registration-section">
      <div className="container form-width">
        <Reveal><motion.article className="registration-card" whileHover={{ y: -5, scale: 1.01, borderColor: '#F6C700', backgroundColor: '#FFFDF7', boxShadow: '0 24px 54px rgba(246,199,0,0.20)' }}><div className="progress-dots"><i></i><i></i><i></i></div><span className="registration-icon"><i className="bi bi-clipboard-check"></i></span><p className="eyebrow">Stressfrei starten</p><h2>Jetzt anmelden</h2><p>Starte Deine Führerscheinausbildung bei Fahrschule Nickel in Kleve, Emmerich oder Kalkar.</p><ActionLink href={external.registration} icon="bi bi-send">Anmeldung starten</ActionLink></motion.article></Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const contacts = [
    ['bi bi-telephone', 'Telefon', '0170 1605060', 'tel:+491701605060'],
    ['bi bi-envelope', 'E-Mail', 'info@fs-nickel.de', 'mailto:info@fs-nickel.de'],
    ['bi bi-whatsapp', 'WhatsApp', '0151/29006501', external.whatsapp]
  ];
  return (
    <section id="kontakt" className="section contact-section">
      <div className="container narrow split-grid contact-grid">
        <Reveal className="contact-copy"><p className="eyebrow">Direkter Draht</p><h2>Kontakt & Beratung</h2><p>Nimm jetzt Kontakt zu uns auf, lass Dir alle Fragen beantworten oder vereinbare einen Termin für ein unverbindliches Beratungsgespräch.</p><div className="contact-list">{contacts.map(([icon, label, value, href], index) => <motion.a key={label} href={href} className={label === 'WhatsApp' ? 'contact-chip whatsapp-chip' : 'contact-chip'} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ x: 6, scale: 1.015, backgroundColor: label === 'WhatsApp' ? '#EAF8EF' : '#EEF5FF', borderColor: label === 'WhatsApp' ? '#1B9E4B' : '#1E6EEB', boxShadow: label === 'WhatsApp' ? '0 12px 24px rgba(27,158,75,0.22)' : '0 12px 26px rgba(30,110,235,0.18)' }}><i className={icon || 'bi bi-chat'}></i><span><small>{label}</small><strong>{value}</strong></span><i className="bi bi-arrow-up-right"></i></motion.a>)}</div></Reveal>
        <Reveal><ImageFrame src={URLS.contact} alt="Fahrschule Nickel – Kontakt und Beratung" className="contact-image" /></Reveal>
      </div>
    </section>
  );
}

function ArticleListing() {
  return (
    <section className="section article-listing">
      <div className="container">
        <Reveal className="section-heading"><p className="eyebrow"><i className="bi bi-journal"></i> Lernen & Nachlesen</p><h2>Weitere Artikel</h2></Reveal>
        <div className="listing-layout"><ImageFrame src={URLS.road} alt="Unterwegs mit der Fahrschule Nickel" className="listing-image" /><div className="listing-grid">{articles.map((title, index) => <Reveal key={title} delay={index * 0.095}><motion.article className="listing-card" whileHover={{ y: -8, scale: 1.015, borderColor: '#1E6EEB', backgroundColor: '#F8FBFF', boxShadow: '0 20px 42px rgba(30,110,235,0.18)' }}><span className="corner-notch"><i className="bi bi-chevron-right"></i></span><span className="article-chip">Ratgeber</span><h3>{title}</h3><p>Tipps und Informationen der Fahrschule Nickel.</p><a href={external.guide}>Lesen <i className="bi bi-arrow-right"></i></a></motion.article></Reveal>)}</div></div>
      </div>
    </section>
  );
}

function ExtraImages() {
  const items = [
    [URLS.wheel, 'Strukturierte praktische Ausbildung', 'bi bi-steering-wheel'],
    [URLS.classIcon, 'Wir sind mehrsprachig', 'bi bi-translate'],
    [URLS.bot, 'Hey, wie kann ich dir helfen?', 'bi bi-chat-dots'],
    [URLS.club, 'Du bist in einem Verein?', 'bi bi-people']
  ];
  return (
    <section className="section extras-section">
      <div className="container">
        <Reveal className="section-heading centered"><p className="eyebrow">Fahrschule Nickel</p><h2>Wir begleiten Dich</h2></Reveal>
        <div className="extras-grid">{items.map(([src, title, icon], index) => <Reveal key={title} delay={index * 0.08}><article className="extra-card"><div className="extra-image"><div className="image-fallback"><i className={icon || 'bi bi-star'}></i></div><img src={src} alt={title} loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = 'none'; }} /></div><i className={icon || 'bi bi-star'}></i><h3>{title}</h3>{title === 'Du bist in einem Verein?' ? <p>Wir würden diesen Verein gern unterstützen. Information bei der Anmeldung vor Ort. Nicht nur für Basketballvereine!</p> : <p>Deine Fahrschule Nickel</p>}</article></Reveal>)}</div>
      </div>
    </section>
  );
}

function CtaFooter() {
  return (
    <section className="cta-section">
      <div className="container narrow">
        <motion.div className="cta-band" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} whileHover={{ y: -4, backgroundColor: '#273746', borderColor: 'rgba(246,199,0,0.52)', boxShadow: '0 24px 56px rgba(30,110,235,0.20)' }}><div><i className="bi bi-speedometer2 cta-icon"></i><p className="eyebrow light">Dein Start in die Freiheit</p><h2>Bereit? Losfahren!</h2></div><div className="cta-actions"><ActionLink href="#kontakt">Beratung vereinbaren</ActionLink><ActionLink href="#anmeldung" variant="outline-light">Anmeldung starten</ActionLink></div></motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid"><div><a className="brand footer-brand" href="#start"><span className="brand-mark">N</span><span>Fahrschule <strong>Nickel</strong></span></a><p>Emmerich – Kleve – Kalkar</p></div><div><strong>Kontakt</strong><a href="tel:+491701605060">0170 1605060</a><a href="mailto:info@fs-nickel.de">info@fs-nickel.de</a><a href={external.whatsapp}>WhatsApp 0151/29006501</a></div><div><strong>Standorte</strong><span>Triftstraße 72, 47533 Kleve</span><span>Görrestr. 2, 46446 Emmerich</span><span>Altkalkarerstr. 12, 47546 Kalkar</span></div><div><strong>Rechtliches</strong><a href="https://www.fs-nickel.de/impressum/">Impressum</a><a href="https://www.fs-nickel.de/datenschutz/">Datenschutz</a><span>Inhaber: Klaus-Peter Nickel</span></div></div>
    </footer>
  );
}

export default function App() {
  return <><Header /><main id="main"><Hero /><Values /><LicenseLane /><Fleet /><TriCity /><WhatsAppBand /><Arabic /><Guide /><Classes /><BEFeature /><Gallery /><Locations /><Registration /><Contact /><ArticleListing /><ExtraImages /><CtaFooter /></main><Footer /></>;
}

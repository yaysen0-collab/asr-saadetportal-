// build.js — Firestore'dan statik şahsiyet sayfaları + sitemap.xml üretir.
// Gereksinim: Node 18+ (yerleşik fetch). Ek paket gerekmez.
// Çalıştırma: FIREBASE_PROJECT_ID=xxx node build.js

const fs = require('fs');
const path = require('path');

// ================== AYARLAR (kendinize göre düzenleyin) ==================
const CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'tarihizatlar', // Açık koleksiyon; gerekirse Vercel değişkeniyle geçersiz kılınabilir
  collection: 'zatlar',                        // 'zatlar' mı 'people' mı? Kontrol edin
  siteUrl: 'https://asrisaadetportali.vercel.app',
  outDir: 'public/sahabe',                     // statik sayfalar Astro public alanına yazılır
  urlPath: 'sahabe',                           // canlı URL yolu
  cssHref: '/style.css',                       // sitenizin CSS dosyaları (kökte)
  premiumHref: '/premium.css',
  nameFields: ['ad', 'isim', 'name'],          // isim hangi alandaysa o (sırayla denenir)
  bioField: 'bilgi',
  sourceField: null,                           // kaynak alanı varsa adı, yoksa null
  minWords: 80,                                // bu kadar kelimeden azsa noindex
  staticPages: ['/', '/archive', '/timeline', '/genealogy', '/articles', '/faq', '/sources'],
};
// ==========================================================================

if (!CONFIG.projectId && !process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('FIREBASE_SERVICE_ACCOUNT veya FIREBASE_PROJECT_ID ortam değişkeni gerekli.');
  process.exit(1);
}

// ---- Firestore REST değerlerini düz JS'e çevir ----
function fromValue(v) {
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromValue);
  if ('mapValue' in v) return fromFields(v.mapValue.fields || {});
  return null;
}
function fromFields(fields) {
  const o = {};
  for (const k of Object.keys(fields)) o[k] = fromValue(fields[k]);
  return o;
}

async function fetchAll(collection = CONFIG.collection) {
  // Yol 1: service account varsa firebase-admin ile oku (kurallardan bağımsız)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      const creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({ credential: admin.credential.cert(creds) });
    }
    const snap = await admin.firestore().collection(collection).get();
    console.log('Service account ile okundu.');
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // Yol 2: herkese açık REST API
  const base = `https://firestore.googleapis.com/v1/projects/${CONFIG.projectId}/databases/(default)/documents/${collection}`;
  const docs = [];
  let pageToken = '';
  do {
    const url = `${base}?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Firestore okunamadı (${res.status}). Güvenlik kuralları herkese okumaya açık mı? ${await res.text()}`);
    }
    const json = await res.json();
    for (const d of json.documents || []) {
      docs.push({ id: d.name.split('/').pop(), ...fromFields(d.fields || {}) });
    }
    pageToken = json.nextPageToken || '';
  } while (pageToken);
  return docs;
}

// ---- Yardımcılar ----
const clean = (s) => {
  if (s == null) return '';
  const t = String(s).trim();
  return t === '?' ? '' : t;
};
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function bioText(s) {
  return String(s || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/\s+/g, ' ').trim();
}
function bioHtml(s) {
  const source = clean(s);
  if (!source) return '';
  if (!/<\/?[a-z][^>]*>/i.test(source)) {
    return source.split(/\n+/).filter(Boolean).map((line) => `<p>${esc(line)}</p>`).join('\n');
  }
  const allowed = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'blockquote', 'h3', 'h4', 'span', 'div', 'a']);
  return source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|svg|math)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<(script|style|iframe|object|embed|svg|math)\b[^>]*\/?>/gi, '')
    .replace(/<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi, (tagText, rawName, attrs) => {
      const tag = rawName.toLowerCase();
      if (!allowed.has(tag)) return '';
      if (tag === 'br') return '<br>';
      if (tagText.startsWith('</')) return `</${tag}>`;
      if (tag !== 'a') return `<${tag}>`;
      const hrefMatch = attrs.match(/\bhref\s*=\s*(["'])(.*?)\1/i);
      if (!hrefMatch) return '<a>';
      const href = hrefMatch[2].trim();
      if (!/^(https?:\/\/|mailto:|\/|#)/i.test(href)) return '<a>';
      return `<a href="${esc(href)}" rel="noopener noreferrer">`;
    });
}

function slugify(text) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u', Ç: 'c', Ğ: 'g', İ: 'i', I: 'i', Ö: 'o', Ş: 's', Ü: 'u', Â: 'a', Î: 'i', Û: 'u' };
  return text
    .replace(/\(.*?\)/g, '')            // (ra) gibi ekleri at
    .replace(/['’‘´`ʿʾʻ]/g, '')         // apostrof/ayın işaretlerini sil (Mus’ab → musab)
    .replace(/[çğıöşüâîûÇĞİIÖŞÜÂÎÛ]/g, (c) => map[c])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getName(p) {
  for (const f of CONFIG.nameFields) if (clean(p[f])) return clean(p[f]);
  return '';
}
const wordCount = (s) => (s ? s.split(/\s+/).filter(Boolean).length : 0);
const shorten = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');

// ---- Sayfa şablonu ----
function renderPage(p, ctx) {
  const name = p._name;
  const bio = clean(p[CONFIG.bioField]);
  const readableBio = bioText(bio);
  const url = `${CONFIG.siteUrl}/${CONFIG.urlPath}/${p._slug}`;
  const title = `${name.replace(/\s*\(.*?\)\s*/g, ' ').trim()}: Hayatı ve Nesebi | Asr-ı Saadet Portalı`;
  const description = shorten(readableBio || `${name} hakkında Asr-ı Saadet Portalı'nda bilgi.`, 155);

  const link = (id, fallbackText) => {
    const rel = id && ctx.byId.get(id);
    if (rel) return `<a href="/${CONFIG.urlPath}/${rel._slug}">${esc(rel._name)}</a>`;
    return fallbackText ? esc(fallbackText) : '';
  };
  const list = (ids) =>
    (Array.isArray(ids) ? ids : [])
      .map((id) => link(id))
      .filter(Boolean)
      .join(', ');

  const rows = [
    ['Dönem', esc(clean(p.devir))],
    ['Baba', link(p.babaId, clean(p.baba))],
    ['Anne', link(p.anneId, clean(p.anne))],
    ['Eş(ler)', list(p.esIds) || esc(clean(p.es))],
    ['Çocuklar', list(p.cocukIds)],
  ].filter(([, v]) => v);

  const paragraphs = bioHtml(bio);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description,
    url,
    mainEntityOfPage: url,
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: CONFIG.siteUrl + '/' },
      { '@type': 'ListItem', position: 2, name: 'Arşiv', item: CONFIG.siteUrl + '/archive' },
      { '@type': 'ListItem', position: 3, name, item: url },
    ],
  };

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${p._indexable ? 'index, follow' : 'noindex, follow'}">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta name="theme-color" content="#f3efe5">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${CONFIG.cssHref}">
<link rel="stylesheet" href="${CONFIG.premiumHref}">
<style>
.person-page{width:min(820px,100%);margin:0 auto;padding:clamp(2rem,5vw,4rem) clamp(1.25rem,4vw,2rem) clamp(3rem,6vw,5rem)}
.person-crumbs{margin:0 0 1.5rem;color:var(--muted);font-size:.74rem;letter-spacing:.04em}
.person-crumbs a{color:var(--brass-text);text-decoration:none}
.person-crumbs a:hover{text-decoration:underline}
.person-page h1{margin:0 0 1.5rem;color:var(--forest);font-family:var(--display);font-size:clamp(2rem,5vw,3.2rem);font-weight:600;line-height:1.15}
.person-meta{display:grid;grid-template-columns:max-content 1fr;gap:.55rem 1.5rem;margin:0 0 2rem;padding:1.2rem 1.4rem;background:var(--paper-light);border:1px solid var(--line)}
.person-meta dt{color:var(--brass-text);font-size:.66rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding-top:.2rem}
.person-meta dd{margin:0;color:var(--ink);font-size:.92rem}
.person-meta a,.person-bio a{color:var(--brass-text);text-underline-offset:3px}
.person-bio p{margin:0 0 1.15rem;color:var(--ink);font-size:1rem;line-height:1.85}
.person-back{display:inline-block;margin-top:1.5rem;color:var(--brass-text);font-size:.74rem;letter-spacing:.1em;text-decoration:none;text-transform:uppercase}
</style>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
</head>
<body>
<header class="site-nav">
  <div class="nav-row">
    <a class="brand" href="/">
      <span class="brand-mark"><img src="/images/logo-mark.svg" alt="" width="38" height="44"></span>
      <span class="brand-copy"><strong>Asr-ı Saadet Portalı</strong><small>İslam tarihi ve Ashab-ı Kiram arşivi</small></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-links"><span></span><span></span><span></span><b>Menü</b></button>
    <nav class="nav-links" id="nav-links" aria-label="Ana menü">
      <a href="/">Ana Sayfa</a>
      <a href="/archive">Arşiv</a>
      <a href="/timeline">Zaman Çizelgesi</a>
      <a href="/genealogy">Soyağacı</a>
      <a href="/random">Rastgele Şahsiyet</a>
      <a href="/articles">Makaleler</a>
    </nav>
  </div>
</header>
<main class="person-page">
  <nav class="person-crumbs" aria-label="breadcrumb"><a href="/">Ana Sayfa</a> › <a href="/archive">Arşiv</a> › ${esc(name)}</nav>
  <article>
    <h1>${esc(name)}</h1>
    ${rows.length ? `<dl class="person-meta">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>` : ''}
    <div class="person-bio">
    ${paragraphs || '<p>Bu şahsiyet için içerik hazırlanıyor.</p>'}
    </div>
  </article>
  <a class="person-back" href="/archive">← Arşive dön</a>
</main>
<footer class="site-footer">
  <div class="footer-half footer-intro">
    <div>
      <p class="brand">Asr-ı Saadet Portalı</p>
      <p>Ashâb-ı Kirâm'ın hayatlarını, nesep bağlarını ve çağın izlerini belgeleyen bağımsız dijital arşiv.</p>
    </div>
    <small>© 2026 · Tüm hakları saklıdır</small>
  </div>
  <div class="footer-half footer-links">
    <div>
      <h3>Hızlı Erişim</h3>
      <a href="/">Ana Sayfa</a>
      <a href="/archive">Arşiv</a>
      <a href="/timeline">Zaman Çizelgesi</a>
      <a href="/genealogy">Soyağacı</a>
      <a href="/random">Rastgele Şahsiyet</a>
      <a href="/articles">Makaleler</a>
      <a href="/faq">S.S.S.</a>
    </div>
    <div>
      <h3>Hakkında</h3>
      <p>Klasik İslâm kaynaklarından derlenen açık erişimli arşiv.</p>
    </div>
  </div>
</footer>
<script>
(function(){var n=document.querySelector('.site-nav'),b=document.querySelector('.menu-toggle');
if(n&&b)b.addEventListener('click',function(){var o=n.classList.toggle('menu-open');b.setAttribute('aria-expanded',o?'true':'false');});})();
</script>
<script defer src="/metin-duzelt.js"></script>
</body>
</html>`;
}

// ---- Ana akış ----
(async () => {
  const docs = await fetchAll();
  const events = await fetchAll('olaylar');
  console.log(`${docs.length} kayıt okundu.`);

  const people = docs.filter((d) => getName(d));
  const skipped = docs.length - people.length;
  if (skipped) console.warn(`UYARI: ${skipped} kaydın ismi bulunamadı (nameFields kontrol edin), atlandı.`);

  // Slug üret, çakışmada id'nin başını ekle
  const used = new Set();
  for (const p of people) {
    p._name = getName(p);
    let slug = slugify(p._name) || p.id.toLowerCase();
    if (used.has(slug)) slug = `${slug}-${p.id.slice(0, 4).toLowerCase()}`;
    used.add(slug);
    p._slug = slug;

    const bio = clean(p[CONFIG.bioField]);
    const hasSource = CONFIG.sourceField ? !!clean(p[CONFIG.sourceField]) : true;
    p._indexable = wordCount(bioText(bio)) >= CONFIG.minWords && hasSource;
  }

  // İstemci arşivindeki kayıt kimliklerini bu statik biyografi sayfalarına bağlar.
  fs.mkdirSync('public', { recursive: true });
  fs.writeFileSync(path.join('public', 'sahabe-index.json'), JSON.stringify(
    Object.fromEntries(people.map((p) => [p.id, p._slug]))
  ));
  fs.writeFileSync(path.join('public', 'site-data.json'), JSON.stringify({
    zatlar: docs,
    olaylar: events,
    sahabeSayfaYollari: Object.fromEntries(people.map((p) => [p.id, p._slug])),
  }));

  const ctx = { byId: new Map(people.map((p) => [p.id, p])) };

  fs.rmSync(CONFIG.outDir, { recursive: true, force: true });
  fs.mkdirSync(CONFIG.outDir, { recursive: true });
  for (const p of people) {
    fs.writeFileSync(path.join(CONFIG.outDir, `${p._slug}.html`), renderPage(p, ctx));
  }

  // sitemap.xml — sadece yeterli içeriği olan sayfalar
  const today = new Date().toISOString().slice(0, 10);
  const articlesPath = path.join(__dirname, 'src', 'data', 'articles.json');
  if (!fs.existsSync(articlesPath)) {
    fs.mkdirSync(path.dirname(articlesPath), { recursive: true });
    fs.writeFileSync(articlesPath, JSON.stringify([{"etiket":"İtikat","foto":"manuscript","baslik":"Ashab-ı Kiram'ın İzinde","ozet":"İslam’ın kuvvetli olduğu zamanlarda doğduk. Kuran-ı Kerim'i bize öğretenler oldu. Maalesef ki yeni nesil elimizden kayıp gidiyor...","govde":"<p>İslam’ın kuvvetli olduğu zamanlarda doğduk. Kuran-ı Kerim'i bize öğretenler oldu. Maalesef ki yeni nesil elimizden kayıp gidiyor. Bunları nerede kaybettik? Hangi mezhebe ait olduğunu bilmeyen, peygamberimizi tanımayan birine nasıl namaz kıl diyebiliriz?</p>\n<p>Hangi mezhepteniz, mezhep neden var, zorunda mıyız biz? <em>\"El ilmü ferizatin ala küllü müslimin ve müslimetin\"</em>. İlim öğrenmek her Müslüman erkek ve kadın üzerine farzdır. Burada kastedilen nasıl amel etmesi gerektiğini öğrenmektir. İtikadını bilmektir. Herkese tek tek vaciptir. Selam verse birisi, alsa diğerlerinden hüküm kalkar ama 5 vakit namaz herkese tek tek farzdır. İtikat konusunda da herkesin tek tek, fert fert kendisinin yapması lazımdır. İman ne demek? Hz. Allah’a, O'nun peygamberine, O'nun kulu ve resulü olduğuna iman etmektir.</p>\n<p>Amel imandan bir cüz müdür? Günümüzde çok fazla var; Müslümanım diyor, namaz kılmıyor, zekât vermiyor. Peki, biz ona \"Sen Müslüman değilsin\" dersek ne olur? Dinden çıkmış oluruz. Amelinde eksik vardır evet ama Allah’a iman ettim diyordur; amelinde kusur vardır bizi alakadar etmez. İman asıldır, amel onu kuvvetlendirmek içindir. Rabbim bize kâmil iman versin.</p>\n<p>Şimdi bir tane mumu yaksak onun sönmesi kolaydır ama biz iman ettik, <em>La ilahe illallah Muhammeden rasulullah</em> dedik. Namazla, rabıtayla, hatimle, zekât ve sadakayla o ateşi güçlendireceğiz. Zayıf olan muma bir kere üflesek söner ama kuvvetli olan ateşe üflesen de su atsan da sönmez. Kimisinin ki ampul gibi, kimisinin ki projektör gibidir. Evet, imanı biliyoruz ama güçlendirmek için çabalamamız gerek. Nasıl güçlendireceğiz? Ne ile? Amel-i Saliha ile.</p>\n<p>Peygamber efendimiz de yıllar öncesinden ehlisünnete ve bu dört mezhepten birine uyulması hususunda şöyle buyurmuştur; <em>“Din, iman sahipleri yılanın deliğine, yuvasına çekilmesi gibi elbette Hicaz’a ve Medine-i Münevvere’ye çekilir, sığınır ve toplanır. İslam dini garip olarak başlayıp, yayıldığı gibi yakın zamanda da garip olarak döner. O zaman müjde ve saadet garip olanlar içindir.”</em> Buyurmuşlardır. Bunun üzerine <em>“Ya Rasulallah garip olanlar kimlerdir?”</em> diye soruldu. <em>“Benden sonra benim sünnetimden insanların bozduğu şeyleri düzeltenlerdir.“</em> cevabını verdi. Buradaki garipler kimlerdir? Yani ehlisünnet vel cemaat mezhebi üzerine olanlardır.</p>\n<p>Peygamber efendimiz <em>“Yakında ümmetim 73 fırkaya ayrılacaktır. Onlardan biri hariç hepsi cehennemliktir.”</em> buyurdu. Ashab-ı Kiram <em>“Ya Rasulallah onlar kimlerdir?”</em> dedi. Peygamber efendimiz <em>“Onlar benim ve Ashabımın yolu üzerine olanlardır.”</em> buyurmuşlardır.</p>\n<p class=\"art-son\">Hazreti Allah bu yol üzerine bizleri daim etsin.</p>","slug":"ashab-i-kiram-in-izinde","image":"1720701574998-d68020bce2bd"},{"etiket":"İlim","foto":"calligraphy","baslik":"Neden Bu İlimleri Öğreniyoruz?","ozet":"İslam dini, okuyup ilim sahibi olmaya çok önem vermiştir. Hatta Peygamber Efendimize indirilen ilk ayeti kerime “Oku” emri ile başlar...","govde":"<p>İslam dini, okuyup ilim sahibi olmaya çok önem vermiştir. Hatta Peygamber Efendimize indirilen ilk ayeti kerime “Oku” emri ile başlar. Cenabı Hak Kuran-ı Keriminde; <em>“Ey Habibim! Yaratan Rabbinin adı ile oku”</em> buyurmuştur.</p>\n<p>Kur’an-ı Kerim’e bakacak olursak, Allah lafzından sonra en çok geçen kelimelerden biri de ilim ve ilim manasını ifade eden kelimeler olduğunu görürüz. Yine Cenabı Hak Kuran-ı Keriminde: <em>“Habibim! De ki: Hiç bilenler ile bilmeyenler bir olur mu?\"</em> buyurarak ilmin ve âlimin üstünlüğünü bildirmiştir.</p>\n<p>Yine Hz. Allah bütün peygamberlerini âlim yapmıştır. Ümmetleri için öğretmen kılmıştır. Eğer ilimden daha yüce bir mertebe, daha güzel bir meslek olsaydı, Hz. Allah seçerek gönderdiği peygamberlerine o mesleği verirdi.</p>\n<p>Abdullah bin Mübarek Hazretleri’ne sordular:</p>\n<blockquote>— “Eğer Cenabı-ı Hak, sana öleceğin anı bildirse idi ne ile meşgul olurdun?”<br>— “İlim ile meşgul olurdum.\" dedi.<br>— “İlimden daha üstün bir ibadet yok mu ki, onunla meşgul olsanız?”<br>— “Evet. İlimden daha üstün bir ibadet yoktur.” dedi. Yanındakiler:<br>— “İlme çalışmanın her türlü ibadetten üstün olduğunu ne ile ispat edersiniz?” deyince,</blockquote>\n<p>Abdullah bin Mübarek Hazretleri şöyle cevap verdi:</p>\n<blockquote>— “İlim her şeyden üstündür. Çünkü Cenabı-ı Hak (c.c.) Peygamber Efendimize (s.a.v.) her şeyi verdi. Fazlasını istemekle emir buyurmadı. İlim hakkında ise: ‘Ey Habibim! De ki: Rabbim benim ilmimi artır.’ Eğer ilimden daha üstün bir şey olsa idi, Rasulullah Efendimiz (s.a.v.), onun artmasını istemekle emrolunurdu. Bundan dolayı ben ilimden daha üstün bir amel göremiyorum.”</blockquote>\n<p>İslam dini ilme o kadar değer ve kıymet vermiştir ki, Bedir harbi esirlerinin okuryazar olanlarına, Müslümanlardan on kişiye okuyup yazmayı öğrettikleri takdirde serbest bırakılacakları, Fahr-i Kâinat Efendimiz tarafından va’d edilmiş ve esirler denileni yaptıkları zaman serbest bırakılmışlardır.</p>\n<p>Bir milletin en büyük düşmanı cehalettir. Onu imha etmeden diğer düşmanlara karşı zafer mümkün değildir.</p>\n<p class=\"art-son\">Hiç kimse hakikati anlayacak ilimle doğmamıştır. Bu yüzden bu ilimleri okumaya ve anlamaya önem göstermeliyiz.</p>","slug":"neden-bu-ilimleri-ogreniyoruz","image":"1696513553729-17129c427356"},{"etiket":"Siyer","foto":"ornate","baslik":"Rasulullah Sevgisi ve Kur'an Eğitimi","ozet":"Resulullah efendimiz bir hadisi şeriflerinde şöyle buyuruyor; \"Evlatlarınızı üç haslet üzerine edeplendiriniz...\"","govde":"<p>Resulullah efendimiz bir hadisi şeriflerinde şöyle buyuruyor;</p>\n<blockquote>”Evlatlarınızı üç haslet üzerine edeplendiriniz:</blockquote>\n<ul><li><strong>1. Rasulullah sevgisi</strong></li><li><strong>2. Rasulullah’ın ehlibeytinin sevgisi</strong></li><li><strong>3. Kur'an-ı Kerim okumak</strong></li></ul>\n<p>Çünkü Kur'an-ı Kerim okuyan, okutan ve onun hizmetinde bulunanlar hiçbir gölgenin bulunmadığı o kıyamet gününde evliya ve esfiya ile beraber Allah’ımızın Arşının gölgesinde bulunacaklardır.</p>\n<h3>Kur'an-ı Kerim ilk olarak nerede ve nasıl öğretilmeye başlandı?</h3>\n<p>Peygamber Efendimiz (s.a.v.), nübüvvetin ilk yıllarında Müslümanlar ile Safa tepesi eteklerindeki Hazret-i Erkam’ın (r.a.) evinde gizlice toplanır, onlara İslâm’ın emir ve hükümlerini bildirir, Kur’an-ı Kerim'in nazil olan Ayet-i Kerimelerini okur ve öğretirlerdi. <strong>Dârü'l-Erkam</strong> ismi verilen bu hane, İslam tarihinde ilk eğitim-öğretim yapılan ilim müessesesi olarak kabul edilir.</p>\n<p>Rasulullah Efendimiz (s.a.v.), Medine-i Münevvere‘ye hicretlerinin ardından Mescid-i Nebevi ve ona bitişik olarak da Hücre-i Saadet'i inşa ettirdiler. Mescidin kuzey tarafına, bir suffa (gölgelik) yaptırdılar. Sahabe-i Kiramdan burada ikamet edenlere <strong>Ashab-ı Suffe</strong> denilirdi. Onların ihtiyaçlarıyla bizzat Efendimiz (s.a.v.) ilgilenir, eğitimiyle de yine kendileri alakadar olurlardı. Ayrıca onlara yazı yazmayı ve Kur’an-ı Kerim okumayı öğretmek üzere Ubâde b. Sâmit, Mus'ab bin Umeyr (r.anhüma) gibi hocalar tayin etmişlerdi.</p>","slug":"rasulullah-sevgisi-ve-kur-an-egitimi","image":"1720700955600-a21cd215d1a3"}]), 'utf8');
    console.log('Eksik articles.json dosyası dahili içerik yedeğinden oluşturuldu.');
  }
  const articles = require(articlesPath);
  const urls = [
    ...CONFIG.staticPages.map((u) => CONFIG.siteUrl + u),
    ...articles.map((article) => `${CONFIG.siteUrl}/makaleler/${article.slug}`),
    ...people.filter((p) => p._indexable).map((p) => `${CONFIG.siteUrl}/${CONFIG.urlPath}/${p._slug}`),
  ];
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`;
  fs.mkdirSync('public', { recursive: true });
  fs.writeFileSync(path.join('public', 'sitemap.xml'), sitemap);

  const idx = people.filter((p) => p._indexable).length;
  console.log(`${people.length} sayfa üretildi: ${idx} index, ${people.length - idx} noindex (içerik yetersiz).`);
  console.log(`sitemap.xml: ${urls.length} URL.`);
})().catch((e) => {
  // Firebase verisi okunamadıysa eksik sitemap ve biyografi sayfaları yayımlama.
  console.warn('UYARI: Şahsiyet sayfaları üretilemedi; eksik sürümün yayımlanmasını önlemek için derleme durduruluyor.');
  console.warn(String(e && e.message ? e.message : e));
  process.exit(1);
});

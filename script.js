import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCrrD1XRInE3Er47ZRl28rUo_Pk7FZAyss",
  authDomain: "tarihizatlar.firebaseapp.com",
  projectId: "tarihizatlar",
  storageBucket: "tarihizatlar.firebasestorage.app",
  messagingSenderId: "930648787998",
  appId: "1:930648787998:web:db163d0f3811786610b20f",
  measurementId: "G-N2DE9B17T0",
};

const PHOTOS = {
  dome: "https://images.unsplash.com/photo-1776893761976-03f46ce701df?w=1200&h=1400&fit=crop&auto=format",
  manuscript:
    "https://images.unsplash.com/photo-1720701574998-d68020bce2bd?w=1200&h=1400&fit=crop&auto=format",
  calligraphy:
    "https://images.unsplash.com/photo-1696513553729-17129c427356?w=1200&h=1400&fit=crop&auto=format",
  tiles:
    "https://images.unsplash.com/photo-1558114965-eeb97aa84c3b?w=1200&h=1400&fit=crop&auto=format",
  manuscript2:
    "https://images.unsplash.com/photo-1720701575003-51dafcf39cb4?w=1200&h=1400&fit=crop&auto=format",
  ornate:
    "https://images.unsplash.com/photo-1720700955600-a21cd215d1a3?w=1200&h=1400&fit=crop&auto=format",
};

const ARTICLES = [
  {
    title: "Ashâb-ı Kirâm'ın İzinde",
    excerpt:
      "Ehl-i Sünnet vel-Cemâat yolunda sahâbenin ilim ve ihlâs mirası üzerine.",
    tag: "Akide",
    photo: PHOTOS.manuscript,
  },
  {
    title: "Neden Bu İlimleri Öğreniyoruz?",
    excerpt:
      'Kur’ân’ın “Oku!” emrinden Bedir esirlerinin öğretmenliğine uzanan ilim geleneği.',
    tag: "İlim",
    photo: PHOTOS.calligraphy,
  },
  {
    title: "Rasûlullah Sevgisi ve Kur’ân Eğitimi",
    excerpt:
      "Dâru’l-Erkam’dan Mescid-i Nebevî Suffe’sine Kur’ân öğretiminin tarihi.",
    tag: "Tarih",
    photo: PHOTOS.ornate,
  },
];

const FAQS = [
  [
    "Bu arşiv hangi kaynakları esas almaktadır?",
    "Şemâil-i Şerife Yazar:	Muhammed bin İsa et-Tirmizî (R.a) Fazilet Neşriyat, Ashâb-ı Kirâm Hakkında Müslümanların Nezih İtikâdları Fazilet Neşriyat Yazar:	Ömer Nasuhi Bilmen, Peygamber Efendimiz'in (Sav) Hayatı Çamlıca Basım Yayın Yazar:	Ahmed Cevdet Paşa, Herkes İçin Peygamber Efendimizin Hayatı Çamlıca Basım Yayın Yazar: Ahmed Cevdet Paşa, Peygamberimiz ve Peygamberler (a.s.) Çamlıca Basım Yayın Yazar:	Ahmed Cevdet Paşa,  500 Hadîs-i Şerîf Fazilet Neşriyat Yazar:Ömer Nasuhi Bilmen",
  ],
  [
    "Akademik çalışmalarımda bu siteye atıf yapabilir miyim?",
    "Evet. Her kaydın altında kaynak bilgisi ile birlikte atıf formatı sunulmaktadır.",
  ],
  [
    "Yeni bilgi veya düzeltme önerisi nasıl iletilir?",
    "İletişim formu aracılığıyla veya katkı bölümünden doğrudan editörlere ulaşabilirsiniz.",
  ],
  [
    "Aile ağacı görselleştirmesi nasıl kullanılır?",
    "Şecere bölümünde bir isim seçtiğinizde ilişkili sahâbîlerin ağaç yapısı otomatik olarak açılır.",
  ],
  [
    "Site kaç kişiyi kapsamaktadır?",
    "Arşiv düzenli olarak genişletilmektedir; güncel kayıt sayısı ana sayfada gösterilmektedir.",
  ],
  [
    "Türkçe dışında dil desteği var mı?",
    "İngilizce arayüz aktif geliştirilmekte olup bazı bölümlerde TR/EN geçişi mevcuttur.",
  ],
];

// Panele kimlerin erişebileceğini burada belirleyin.
// Firebase Authentication'da kayıtlı, giriş yapacak yönetici e-postalarını yazın.
const ADMIN_EMAILS = ["admin@example.com"];

const ERA_OPTIONS = [
  "Asr-ı Saadet",
  "Hulefâ-yi Râşidîn",
  "Emeviler",
  "Abbasiler",
  "Endülüs",
  "Diğer",
];

const state = {
  zatlar: [],
  people: [],
  olaylar: [],
  loaded: new Set(),
  errors: [],
  search: "",
  era: "Tümü",
  genealogyId: "",
  randomId: "",
  user: null,
  authReady: false,
  loginError: "",
  adminTab: "zat",
  editingZatId: "",
  editingZatCol: "",
  editingOlayId: "",
  editingOlayCol: "",
  zatFormError: "",
  olayFormError: "",
};

const isAdmin = () =>
  Boolean(state.user?.email && ADMIN_EMAILS.includes(state.user.email));

const appElement = document.querySelector("#app");
const db = getFirestore(initializeApp(firebaseConfig));
const auth = getAuth();

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const field = (item, ...names) => {
  const value = names.find((name) => item[name] !== undefined && item[name] !== "");
  return value ? item[value] : "";
};

const plainText = (value) => {
  const container = document.createElement("div");
  container.innerHTML = String(value || "");
  return container.textContent || "";
};

const nameOf = (item) => field(item, "name", "isim", "ad");
const titleOf = (item) => field(item, "title", "unvan");
const eraOf = (item) => field(item, "era", "donem", "devir");
const hijriOf = (item) =>
  field(item, "hijri", "hicri", "d_hicri", "v_hicri");
const descriptionOf = (item) =>
  plainText(field(item, "desc", "aciklama", "bilgi"));
const eventLabel = (item) => field(item, "label", "baslik", "title", "ad");
const eventYear = (item) =>
  field(item, "year", "yil", "tarih", "miladi", "hicri");
const eventDetail = (item) =>
  plainText(field(item, "detail", "aciklama", "desc", "bilgi"));
const allFigures = () => [...state.zatlar, ...state.people];
const isLoading = () => state.loaded.size < 3 && state.errors.length === 0;

function statusMarkup(emptyText) {
  if (isLoading()) return '<p class="loading">Yükleniyor…</p>';
  if (state.errors.length) {
    return `<p class="error">Veriler alınamadı. Firestore public read kurallarını ve internet bağlantısını kontrol edin.</p>`;
  }
  return `<p class="empty">${emptyText}</p>`;
}

function recordMarkup(item, showEra = false) {
  return `
    <article class="record">
      <div class="record-head">
        <div>
          <h3>${escapeHtml(nameOf(item))}</h3>
          <p>${escapeHtml(descriptionOf(item))}</p>
          <small>${escapeHtml(hijriOf(item))}</small>
        </div>
        <div>
          <div class="title">${escapeHtml(titleOf(item))}</div>
          ${showEra ? `<div class="era">${escapeHtml(eraOf(item))}</div>` : ""}
        </div>
      </div>
    </article>`;
}

function homePage() {
  const figures = allFigures();
  const featured = figures.slice(0, 4);
  const featuredMarkup = featured.length
    ? featured.map((item) => recordMarkup(item)).join("")
    : statusMarkup("Henüz kayıt yok.");

  return `
    <section class="split">
      <div class="half visual">
        <img src="${PHOTOS.dome}" alt="Cami kubbesi iç mimarisi">
        <div class="visual-content">
          <p class="eyebrow">Hadisi Şerifte</p>
          <h1>Ashabım, yıldızlar gibidir. Hangisine tabi olursanız hidayete erersiniz.</h1>
          <p class="quote-source">— Peygamber Efendimiz (s.a.v.)</p>
          <div class="brass-rule"></div>
        </div>
      </div>
      <div class="half content">
        <p class="eyebrow">Dijital Siyer Arşivi</p>
        <h2 class="content-title">Ashab-ı Kiram'ın hayatlarını, birbirleriyle ilişkilerini ve tarihi olayları belgeleyen kapsamlı dijital arşiv.</h2>
        <p class="lead">Klasik kaynaklardan derlenen sahabi kayıtları, tarihi olaylar, aile ağacı ve kronoloji görselleştirmeleriyle.</p>
        <div class="stats">
          <div class="stat"><strong>${isLoading() ? "…" : figures.length}</strong><span>Sahâbî</span></div>
          <div class="stat"><strong>${isLoading() ? "…" : state.olaylar.length}</strong><span>Olay</span></div>
          <div class="stat"><strong>3</strong><span>Koleksiyon</span></div>
        </div>
        <div class="actions">
          <a class="button primary" href="#archive">Arşivi Keşfet</a>
          <a class="button" href="#timeline">Kronoloji</a>
        </div>
      </div>
    </section>
    <section class="split medium">
      <div class="half visual middle">
        <img src="${PHOTOS.tiles}" alt="İslâm geometrik çini desenleri">
        <div class="visual-content">
          <p class="eyebrow">Öne Çıkan</p>
          <h2>Dört Büyük Halife</h2>
          <p class="visual-copy">İslâm medeniyetinin temellerini atan Hulefâ-i Râşidîn'in ilk dördü.</p>
          <div class="brass-rule"></div>
        </div>
      </div>
      <div class="half content">
        <div class="record-list">${featuredMarkup}</div>
        <a class="text-link" href="#archive" style="margin-top:1.5rem">Tüm Arşivi Görüntüle →</a>
      </div>
    </section>
    <section class="split short">
      <div class="half content dark-content">
        <p class="eyebrow">Okuma Köşesi</p>
        <h2 class="serif-title">Tarihî Arka Plân ve Akademik Makaleler</h2>
        <p class="lead">Uzman editörler tarafından hazırlanan makaleler, birincil İslâm kaynaklarına dayalı tarihî analizler sunar.</p>
        <a class="text-link" href="#articles">Makaleleri Oku →</a>
      </div>
      <div class="half visual">
        <img src="${PHOTOS.manuscript2}" alt="Eski Arapça el yazması">
        <div class="visual-content article-lines">
          ${ARTICLES.map(
            (article) => `
              <div class="article-line">
                <span class="article-tag">${article.tag}</span>
                <p>${article.title}</p>
              </div>`,
          ).join("")}
        </div>
      </div>
    </section>`;
}

function archivePage() {
  const figures = allFigures();
  const eras = ["Tümü", ...new Set(figures.map(eraOf).filter(Boolean))];
  const query = state.search.toLocaleLowerCase("tr");
  const filtered = figures.filter((item) => {
    const searchable = `${nameOf(item)} ${titleOf(item)}`.toLocaleLowerCase("tr");
    return (
      (!query || searchable.includes(query)) &&
      (state.era === "Tümü" || eraOf(item) === state.era)
    );
  });
  const list = filtered.length
    ? filtered.map((item) => recordMarkup(item, true)).join("")
    : statusMarkup("Sonuç bulunamadı.");

  return `
    <section class="split">
      <div class="half visual sticky">
        <img src="${PHOTOS.manuscript}" alt="Eski el yazması">
        <div class="visual-content">
          <p class="eyebrow">Dijital Arşiv</p>
          <h1>Sahâbe<br>Kataloğu</h1>
          <p class="visual-copy">Ömer Nasuhi Bilmen, Ahmed Cevdet Paşa ve birçok tarihi isimlerin kitaplarından toplanan bilgiler ışığında...</p>
          <div class="mini-stats">
            <h3>İstatistikler</h3>
            <div class="mini-stat"><span>Toplam Kayıt</span><strong>${figures.length}</strong></div>
            <div class="mini-stat"><span>Tarihî Olay</span><strong>${state.olaylar.length}</strong></div>
            <div class="mini-stat"><span>Dönem</span><strong>${Math.max(0, eras.length - 1)}</strong></div>
          </div>
        </div>
      </div>
      <div class="half content">
        <div class="archive-tools">
          <input class="search" id="archive-search" type="search" value="${escapeHtml(state.search)}" placeholder="İsim ara…" aria-label="Arşivde ara">
          <div class="filters" aria-label="Dönem filtreleri">
            ${eras
              .map(
                (era) =>
                  `<button class="filter ${state.era === era ? "active" : ""}" data-era="${escapeHtml(era)}">${escapeHtml(era)}</button>`,
              )
              .join("")}
          </div>
          <div class="quick-tags">
            ${["Ebu Bekir", "Ömer", "Osman", "Ali", "Bilâl", "Hamza"]
              .map(
                (tag) =>
                  `<button class="quick-tag" data-search="${tag}">${tag}</button>`,
              )
              .join("")}
          </div>
        </div>
        <div class="record-list">${list}</div>
      </div>
    </section>`;
}

function timelinePage() {
  const timelineItems = [
    ...state.olaylar.map((item) => ({
      ...item,
      timelineType: "Tarihî Olay",
      timelineYear: field(item, "miladi", "year", "yil", "tarih", "hicri"),
      timelineIsHicri: !field(item, "miladi", "year", "yil", "tarih") && Boolean(item.hicri),
      timelineLabel: eventLabel(item),
      timelineDetail: eventDetail(item),
    })),
    ...allFigures()
      .filter((item) => {
        const year = field(item, "d_miladi", "birthYear", "dogumYili");
        return year && year !== "?";
      })
      .map((item) => ({
        ...item,
        timelineType: "Doğum",
        timelineYear: field(item, "d_miladi", "birthYear", "dogumYili"),
        timelineIsHicri: false,
        timelineLabel: nameOf(item),
        timelineDetail: `${titleOf(item) || "Şahsiyet"} — doğum kaydı`,
      })),
  ].sort(
    (a, b) =>
      (Number.parseInt(a.timelineYear, 10) || 99999) -
      (Number.parseInt(b.timelineYear, 10) || 99999),
  );

  const events = timelineItems
    .map((item) => {
      const rawYear = item.timelineYear;
      const displayYear = rawYear
        ? `${item.timelineIsHicri ? "H." : "M."} ${rawYear}`
        : "";
      return `
        <article class="event">
          <time>${escapeHtml(displayYear)}</time>
          <h3>${escapeHtml(item.timelineLabel)}</h3>
          <p><span class="article-tag">${escapeHtml(item.timelineType)}</span><br>${escapeHtml(item.timelineDetail)}</p>
        </article>`;
    })
    .join("");

  return `
    <section class="split">
      <div class="half visual sticky">
        <img src="${PHOTOS.tiles}" alt="İslâm geometrik mimari">
        <div class="visual-content">
          <p class="eyebrow">Tarih Şeridi</p>
          <h1>Asr-ı Saadet<br>Kronolojisi</h1>
          <p class="visual-copy">Cahiliye Karanlığından Günümüze:İslam ve Medeniyet Tarihi</p>
        </div>
      </div>
      <div class="half content">
        <div class="timeline">${events || statusMarkup("Henüz olay kaydı yok.")}</div>
      </div>
    </section>`;
}

function loginPage() {
  if (!state.authReady) {
    return `
      <section class="split">
        <div class="half visual"><img src="${PHOTOS.ornate}" alt="Süslü el yazması"><div class="visual-content"><p class="eyebrow">Üyelik</p><h1>Portal<br>Girişi</h1></div></div>
        <div class="half content"><p class="loading">Oturum bilgisi kontrol ediliyor…</p></div>
      </section>`;
  }

  return `
    <section class="split">
      <div class="half visual">
        <img src="${PHOTOS.ornate}" alt="Süslü el yazması">
        <div class="visual-content">
          <p class="eyebrow">Üyelik</p>
          <h1>Portal<br>Girişi</h1>
          <p class="visual-copy">Kayıtlı hesabınızla giriş yapın. Yönetici yetkileri Firebase hesabınıza göre uygulanır.</p>
        </div>
      </div>
      <div class="half content">
        <div class="login-panel">
          ${
            state.user
              ? `<p class="eyebrow">Oturum Açık</p>
                 <h2>Hoş geldiniz</h2>
                 <div class="login-user">${escapeHtml(state.user.displayName || state.user.email || "Kullanıcı")}</div>
                 <button class="button" id="logout-button" type="button">Çıkış Yap</button>`
              : `<p class="eyebrow">Hesabınıza Erişin</p>
                 <h2>Giriş Yap</h2>
                 <p>E-posta adresiniz ve Firebase Authentication hesabınızın şifresiyle giriş yapabilirsiniz.</p>
                 <form id="login-form">
                   <div class="login-field">
                     <label for="login-email">E-posta</label>
                     <input id="login-email" type="email" autocomplete="email" required>
                   </div>
                   <div class="login-field">
                     <label for="login-password">Şifre</label>
                     <input id="login-password" type="password" autocomplete="current-password" required>
                   </div>
                   <div class="login-actions">
                     <button class="button primary" type="submit">Giriş Yap</button>
                     <button class="button" id="google-login" type="button">Google ile Giriş</button>
                   </div>
                   <p class="login-message" id="login-message" role="alert">${escapeHtml(state.loginError)}</p>
                 </form>`
          }
        </div>
      </div>
    </section>`;
}

function eraSelectOptions(selected) {
  return ERA_OPTIONS.map(
    (era) =>
      `<option value="${escapeHtml(era)}" ${era === selected ? "selected" : ""}>${escapeHtml(era)}</option>`,
  ).join("");
}

function richEditor(targetId, initialHtml) {
  return `
    <div class="editor-wrap" data-target="${targetId}">
      <div class="editor-toolbar">
        <button type="button" data-cmd="bold" title="Kalın"><b>K</b></button>
        <button type="button" data-cmd="italic" title="İtalik"><i>İ</i></button>
        <button type="button" data-cmd="underline" title="Altı çizili"><u>A</u></button>
        <button type="button" data-cmd="insertUnorderedList" title="Madde işaretli liste">☰•</button>
        <button type="button" data-cmd="insertOrderedList" title="Numaralı liste">☰1</button>
      </div>
      <div class="rich-editor" id="${targetId}" contenteditable="true">${initialHtml || ""}</div>
    </div>`;
}

function adminZatForm() {
  const editing = state.editingZatId
    ? allFigures().find((item) => item.id === state.editingZatId)
    : null;

  return `
    <form id="zat-form" class="admin-form">
      <h3>${editing ? "Şahsiyeti Düzenle" : "Yeni Şahsiyet Ekle"}</h3>
      ${state.zatFormError ? `<p class="form-error">${escapeHtml(state.zatFormError)}</p>` : ""}
      <div class="form-field">
        <label for="zat-name">İsim</label>
        <input id="zat-name" type="text" value="${escapeHtml(editing ? nameOf(editing) : "")}" required>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="zat-title">Ünvan</label>
          <input id="zat-title" type="text" value="${escapeHtml(editing ? titleOf(editing) : "")}">
        </div>
        <div class="form-field">
          <label for="zat-era">Yaşadığı Devir</label>
          <select id="zat-era">${eraSelectOptions(editing ? eraOf(editing) : ERA_OPTIONS[0])}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="zat-father">Baba</label>
          <input id="zat-father" type="text" value="${escapeHtml(editing ? relationOf(editing, "father", "baba", "babaAdi", "baba_adi") : "")}">
        </div>
        <div class="form-field">
          <label for="zat-mother">Anne</label>
          <input id="zat-mother" type="text" value="${escapeHtml(editing ? relationOf(editing, "mother", "anne", "anneAdi", "anne_adi") : "")}">
        </div>
      </div>
      <div class="form-field">
        <label for="zat-spouse">Eşi / Eşleri</label>
        <input id="zat-spouse" type="text" value="${escapeHtml(editing ? relationOf(editing, "spouse", "es", "eş", "esler", "eşler") : "")}">
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="zat-children">Çocukları</label>
          <input id="zat-children" type="text" placeholder="Virgülle ayırın" value="${escapeHtml(editing ? relationOf(editing, "children", "cocuklar", "çocuklar", "evlatlar") : "")}">
        </div>
        <div class="form-field">
          <label for="zat-siblings">Kardeşleri</label>
          <input id="zat-siblings" type="text" placeholder="Virgülle ayırın" value="${escapeHtml(editing ? relationOf(editing, "siblings", "kardesler", "kardeşler") : "")}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="zat-tribe">Kabile</label>
          <input id="zat-tribe" type="text" value="${escapeHtml(editing ? relationOf(editing, "tribe", "kabile", "boy") : "")}">
        </div>
        <div class="form-field">
          <label for="zat-family">Aile / Nesep</label>
          <input id="zat-family" type="text" value="${escapeHtml(editing ? relationOf(editing, "family", "aile", "soy", "nesep") : "")}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="zat-d-hicri">Doğum (Hicri)</label>
          <input id="zat-d-hicri" type="text" value="${escapeHtml(editing ? field(editing, "d_hicri") : "")}">
        </div>
        <div class="form-field">
          <label for="zat-d-miladi">Doğum (Miladi)</label>
          <input id="zat-d-miladi" type="text" value="${escapeHtml(editing ? field(editing, "d_miladi") : "")}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="zat-v-hicri">Vefat (Hicri)</label>
          <input id="zat-v-hicri" type="text" value="${escapeHtml(editing ? field(editing, "v_hicri") : "")}">
        </div>
        <div class="form-field">
          <label for="zat-v-miladi">Vefat (Miladi)</label>
          <input id="zat-v-miladi" type="text" value="${escapeHtml(editing ? field(editing, "v_miladi") : "")}">
        </div>
      </div>
      <div class="form-field">
        <label for="zat-desc">Biyografi / Bilgi</label>
        ${richEditor("zat-desc", editing ? field(editing, "desc", "aciklama", "bilgi") : "")}
      </div>
      <div class="form-field">
        <label for="zat-source">Kaynak / Sayfa No</label>
        <input id="zat-source" type="text" value="${escapeHtml(editing ? field(editing, "source", "kaynak") : "")}">
      </div>
      <div class="form-actions">
        <button class="button primary" type="submit">${editing ? "Güncelle" : "Kaydet"}</button>
        ${editing ? `<button class="button" type="button" id="zat-cancel">İptal</button>` : ""}
      </div>
    </form>`;
}

function adminOlayForm() {
  const editing = state.editingOlayId
    ? state.olaylar.find((item) => item.id === state.editingOlayId)
    : null;

  return `
    <form id="olay-form" class="admin-form">
      <h3>${editing ? "Olayı Düzenle" : "Yeni Olay Ekle"}</h3>
      ${state.olayFormError ? `<p class="form-error">${escapeHtml(state.olayFormError)}</p>` : ""}
      <div class="form-field">
        <label for="olay-label">Olay Başlığı</label>
        <input id="olay-label" type="text" value="${escapeHtml(editing ? eventLabel(editing) : "")}" required>
      </div>
      <div class="form-field">
        <label for="olay-era">Dönem</label>
        <select id="olay-era">${eraSelectOptions(editing ? eraOf(editing) : ERA_OPTIONS[0])}</select>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label for="olay-hicri">Hicri (Örn: 2)</label>
          <input id="olay-hicri" type="text" value="${escapeHtml(editing ? field(editing, "hicri") : "")}">
        </div>
        <div class="form-field">
          <label for="olay-miladi">Miladi (Örn: 624)</label>
          <input id="olay-miladi" type="text" value="${escapeHtml(editing ? field(editing, "miladi") : "")}">
        </div>
      </div>
      <div class="form-field">
        <label for="olay-detail">Olayın Metni</label>
        ${richEditor("olay-detail", editing ? field(editing, "detail", "aciklama", "desc", "bilgi") : "")}
      </div>
      <div class="form-field">
        <label for="olay-source">Kaynak / Sayfa No</label>
        <input id="olay-source" type="text" value="${escapeHtml(editing ? field(editing, "source", "kaynak") : "")}">
      </div>
      <div class="form-actions">
        <button class="button primary" type="submit">${editing ? "Güncelle" : "Kaydet"}</button>
        ${editing ? `<button class="button" type="button" id="olay-cancel">İptal</button>` : ""}
      </div>
    </form>`;
}

function adminListItem(item, type) {
  const label = type === "olay" ? eventLabel(item) : nameOf(item);
  const meta = type === "olay" ? eventYear(item) : eraOf(item);
  return `
    <div class="admin-list-item">
      <div>
        <h4>${escapeHtml(label || "İsimsiz kayıt")}</h4>
        <span>${escapeHtml(meta || "")}</span>
      </div>
      <div class="admin-list-actions">
        <button type="button" class="btn-small" data-edit="${type}" data-id="${escapeHtml(item.id)}" data-col="${escapeHtml(item._col || "")}">Düzenle</button>
        <button type="button" class="btn-small btn-danger" data-delete="${type}" data-id="${escapeHtml(item.id)}" data-col="${escapeHtml(item._col || "")}">Sil</button>
      </div>
    </div>`;
}

function adminPage() {
  if (!state.authReady) {
    return `<section class="admin-page"><p class="loading">Oturum bilgisi kontrol ediliyor…</p></section>`;
  }

  if (!isAdmin()) {
    return `
      <section class="admin-page admin-denied">
        <p class="eyebrow">Yönetim</p>
        <h1>Erişim Yok</h1>
        <p>Bu sayfayı görüntülemek için yönetici hesabıyla giriş yapmalısınız.</p>
        <a class="button primary" href="#login">Giriş Yap</a>
      </section>`;
  }

  const zatItems = allFigures();
  const zatList = zatItems.length
    ? zatItems.map((item) => adminListItem(item, "zat")).join("")
    : `<p class="empty">Henüz şahsiyet kaydı yok.</p>`;
  const olayList = state.olaylar.length
    ? state.olaylar.map((item) => adminListItem(item, "olay")).join("")
    : `<p class="empty">Henüz olay kaydı yok.</p>`;

  return `
    <section class="admin-page">
      <div class="admin-top">
        <div>
          <p class="eyebrow">Yönetim</p>
          <h1>Kontrol Paneli</h1>
        </div>
        <div class="admin-top-actions">
          <a class="button" href="#home">Siteyi Gör</a>
          <button class="button" id="admin-logout" type="button">Çıkış Yap</button>
        </div>
      </div>

      <div class="admin-tabs">
        <button type="button" class="tab-btn ${state.adminTab === "zat" ? "active" : ""}" data-admin-tab="zat">Şahsiyetler (${zatItems.length})</button>
        <button type="button" class="tab-btn ${state.adminTab === "olay" ? "active" : ""}" data-admin-tab="olay">Olaylar (${state.olaylar.length})</button>
      </div>

      ${
        state.adminTab === "zat"
          ? `<div class="admin-grid">
               <div class="admin-col-list">${zatList}</div>
               <div class="admin-col-form">${adminZatForm()}</div>
             </div>`
          : `<div class="admin-grid">
               <div class="admin-col-list">${olayList}</div>
               <div class="admin-col-form">${adminOlayForm()}</div>
             </div>`
      }
    </section>`;
}

function collectZatPayload() {
  return {
    name: document.querySelector("#zat-name").value.trim(),
    title: document.querySelector("#zat-title").value.trim(),
    era: document.querySelector("#zat-era").value,
    father: document.querySelector("#zat-father").value.trim(),
    mother: document.querySelector("#zat-mother").value.trim(),
    spouse: document.querySelector("#zat-spouse").value.trim(),
    children: document.querySelector("#zat-children").value.trim(),
    siblings: document.querySelector("#zat-siblings").value.trim(),
    tribe: document.querySelector("#zat-tribe").value.trim(),
    family: document.querySelector("#zat-family").value.trim(),
    d_hicri: document.querySelector("#zat-d-hicri").value.trim(),
    d_miladi: document.querySelector("#zat-d-miladi").value.trim(),
    v_hicri: document.querySelector("#zat-v-hicri").value.trim(),
    v_miladi: document.querySelector("#zat-v-miladi").value.trim(),
    desc: document.querySelector("#zat-desc").innerHTML.trim(),
    source: document.querySelector("#zat-source").value.trim(),
    updatedAt: serverTimestamp(),
  };
}

function collectOlayPayload() {
  return {
    label: document.querySelector("#olay-label").value.trim(),
    era: document.querySelector("#olay-era").value,
    hicri: document.querySelector("#olay-hicri").value.trim(),
    miladi: document.querySelector("#olay-miladi").value.trim(),
    detail: document.querySelector("#olay-detail").innerHTML.trim(),
    source: document.querySelector("#olay-source").value.trim(),
    updatedAt: serverTimestamp(),
  };
}

async function handleZatSubmit(event) {
  event.preventDefault();
  const payload = collectZatPayload();
  if (!payload.name) {
    state.zatFormError = "İsim alanı zorunludur.";
    render();
    return;
  }
  state.zatFormError = "";
  try {
    if (state.editingZatId) {
      await updateDoc(doc(db, state.editingZatCol || "zatlar", state.editingZatId), payload);
    } else {
      await addDoc(collection(db, "zatlar"), payload);
    }
    state.editingZatId = "";
    state.editingZatCol = "";
    render();
  } catch (error) {
    console.error("Zat kaydedilemedi:", error);
    state.zatFormError = `Kayıt sırasında bir hata oluştu (${error.code || error.message}).`;
    render();
  }
}

async function handleOlaySubmit(event) {
  event.preventDefault();
  const payload = collectOlayPayload();
  if (!payload.label) {
    state.olayFormError = "Olay başlığı zorunludur.";
    render();
    return;
  }
  state.olayFormError = "";
  try {
    if (state.editingOlayId) {
      await updateDoc(doc(db, state.editingOlayCol || "olaylar", state.editingOlayId), payload);
    } else {
      await addDoc(collection(db, "olaylar"), payload);
    }
    state.editingOlayId = "";
    state.editingOlayCol = "";
    render();
  } catch (error) {
    console.error("Olay kaydedilemedi:", error);
    state.olayFormError = `Kayıt sırasında bir hata oluştu (${error.code || error.message}).`;
    render();
  }
}

async function deleteAdminRecord(type, id, col) {
  if (!col || !id) return;
  const confirmed = window.confirm("Bu kaydı silmek istediğinize emin misiniz?");
  if (!confirmed) return;
  try {
    await deleteDoc(doc(db, col, id));
    if (type === "zat" && state.editingZatId === id) {
      state.editingZatId = "";
      state.editingZatCol = "";
    }
    if (type === "olay" && state.editingOlayId === id) {
      state.editingOlayId = "";
      state.editingOlayCol = "";
    }
    render();
  } catch (error) {
    console.error("Kayıt silinemedi:", error);
    alert("Kayıt silinirken bir hata oluştu. Firestore güvenlik kurallarını kontrol edin.");
  }
}

function bindAdminEditorToolbar() {
  document.querySelectorAll(".editor-wrap").forEach((wrap) => {
    const targetId = wrap.dataset.target;
    const editable = document.getElementById(targetId);
    wrap.querySelectorAll("[data-cmd]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editable?.focus();
        document.execCommand(btn.dataset.cmd, false, null);
      });
    });
  });
}

function bindAdminPageEvents() {
  document.querySelectorAll("[data-admin-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.adminTab = btn.dataset.adminTab;
      state.zatFormError = "";
      state.olayFormError = "";
      render();
    });
  });

  document.querySelector("#admin-logout")?.addEventListener("click", () => {
    signOut(auth);
  });

  document.querySelector("#zat-form")?.addEventListener("submit", handleZatSubmit);
  document.querySelector("#olay-form")?.addEventListener("submit", handleOlaySubmit);

  document.querySelector("#zat-cancel")?.addEventListener("click", () => {
    state.editingZatId = "";
    state.editingZatCol = "";
    state.zatFormError = "";
    render();
  });

  document.querySelector("#olay-cancel")?.addEventListener("click", () => {
    state.editingOlayId = "";
    state.editingOlayCol = "";
    state.olayFormError = "";
    render();
  });

  document.querySelectorAll('[data-edit="zat"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      state.editingZatId = btn.dataset.id;
      state.editingZatCol = btn.dataset.col;
      state.zatFormError = "";
      render();
    });
  });

  document.querySelectorAll('[data-edit="olay"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      state.editingOlayId = btn.dataset.id;
      state.editingOlayCol = btn.dataset.col;
      state.olayFormError = "";
      render();
    });
  });

  document.querySelectorAll('[data-delete="zat"]').forEach((btn) => {
    btn.addEventListener("click", () => deleteAdminRecord("zat", btn.dataset.id, btn.dataset.col));
  });

  document.querySelectorAll('[data-delete="olay"]').forEach((btn) => {
    btn.addEventListener("click", () => deleteAdminRecord("olay", btn.dataset.id, btn.dataset.col));
  });

  bindAdminEditorToolbar();
}

function valueList(value) {
  if (!value) return "";
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string" || typeof item === "number") return item;
        return item?.name || item?.isim || item?.ad || "";
      })
      .filter(Boolean)
      .join(", ");
  }
  if (typeof value === "object") {
    return value.name || value.isim || value.ad || value.path || "";
  }
  return String(value);
}

function relationOf(person, ...names) {
  const key = names.find(
    (name) => person?.[name] !== undefined && person?.[name] !== "",
  );
  return key ? valueList(person[key]) : "";
}

function familyNode(relation, personName, fallback) {
  return `
    <article class="family-node">
      <span class="relation">${relation}</span>
      <h3>${escapeHtml(personName || "Bilgi eklenmemiş")}</h3>
      <p>${personName ? "Kayıtta belirtilen aile bağı" : fallback}</p>
    </article>`;
}

function genealogyPage() {
  const figures = allFigures();
  if (!state.genealogyId && figures.length) state.genealogyId = figures[0].id;
  const person =
    figures.find((item) => item.id === state.genealogyId) || figures[0];

  const options = figures
    .slice()
    .sort((a, b) => nameOf(a).localeCompare(nameOf(b), "tr"))
    .map(
      (item) =>
        `<option value="${escapeHtml(item.id)}" ${item.id === person?.id ? "selected" : ""}>${escapeHtml(nameOf(item) || "İsimsiz kayıt")}</option>`,
    )
    .join("");

  if (!person) {
    return `
      <section class="split">
        <div class="half visual">
          <img src="${PHOTOS.calligraphy}" alt="İslâm hat sanatı">
          <div class="visual-content"><p class="eyebrow">Nesep Arşivi</p><h1>Soy Ağacı</h1></div>
        </div>
        <div class="half content">${statusMarkup("Soy ağacında gösterilecek kayıt bulunamadı.")}</div>
      </section>`;
  }

  const father = relationOf(person, "father", "baba", "babaAdi", "baba_adi");
  const mother = relationOf(person, "mother", "anne", "anneAdi", "anne_adi");
  const spouse = relationOf(person, "spouse", "es", "eş", "esler", "eşler");
  const children = relationOf(person, "children", "cocuklar", "çocuklar", "evlatlar");
  const siblings = relationOf(person, "siblings", "kardesler", "kardeşler");
  const tribe = relationOf(person, "tribe", "kabile", "boy");
  const family = relationOf(person, "family", "aile", "soy", "nesep");

  return `
    <section class="split">
      <div class="half visual sticky">
        <img src="${PHOTOS.calligraphy}" alt="İslâm hat sanatı">
        <div class="visual-content">
          <p class="eyebrow">Nesep Arşivi</p>
          <h1>Sahâbe<br>Soy Ağacı</h1>
          <p class="visual-copy">Kayıtlarda bulunan anne, baba, eş, çocuk ve kabile bağlarını birlikte inceleyin.</p>
        </div>
      </div>
      <div class="half content">
        <div class="genealogy-tools">
          <label for="person-select">Şahsiyet seçin</label>
          <select class="person-select" id="person-select">${options}</select>
        </div>
        <div class="family-tree">
          ${familyNode("Baba", father, "Firestore kaydına baba bilgisi eklenebilir.")}
          ${familyNode("Anne", mother, "Firestore kaydına anne bilgisi eklenebilir.")}
          <article class="family-node main">
            <span class="relation">Seçili Şahsiyet</span>
            <h3>${escapeHtml(nameOf(person))}</h3>
            <p>${escapeHtml(titleOf(person) || descriptionOf(person))}</p>
          </article>
        </div>
        <div class="family-details">
          <div class="family-detail"><span>Eş / Eşler</span><strong>${escapeHtml(spouse || "Bilgi eklenmemiş")}</strong></div>
          <div class="family-detail"><span>Çocuklar</span><strong>${escapeHtml(children || "Bilgi eklenmemiş")}</strong></div>
          <div class="family-detail"><span>Kardeşler</span><strong>${escapeHtml(siblings || "Bilgi eklenmemiş")}</strong></div>
          <div class="family-detail"><span>Kabile</span><strong>${escapeHtml(tribe || "Bilgi eklenmemiş")}</strong></div>
          <div class="family-detail"><span>Aile / Nesep</span><strong>${escapeHtml(family || "Bilgi eklenmemiş")}</strong></div>
        </div>
      </div>
    </section>`;
}

function chooseRandomPerson(forceNew = false) {
  const figures = allFigures();
  if (!figures.length) return null;

  let person = figures.find((item) => item.id === state.randomId);
  if (!person || forceNew) {
    const alternatives =
      figures.length > 1
        ? figures.filter((item) => item.id !== state.randomId)
        : figures;
    person = alternatives[Math.floor(Math.random() * alternatives.length)];
    state.randomId = person.id;
  }
  return person;
}

function randomPage() {
  const person = chooseRandomPerson();

  return `
    <section class="split">
      <div class="half visual">
        <img src="${PHOTOS.manuscript2}" alt="Tarihî el yazması">
        <div class="visual-content">
          <p class="eyebrow">Arşivden Bir İsim</p>
          <h1>Rastgele<br>Şahsiyet</h1>
          <p class="visual-copy">Her seçimde arşivde kayıtlı başka bir sahâbînin hayatına kısa bir pencere açın.</p>
        </div>
      </div>
      <div class="half content">
        ${
          person
            ? `<article class="random-card">
                <p class="eyebrow">Bugünün Kaydı</p>
                <h2>${escapeHtml(nameOf(person))}</h2>
                <div class="person-title">${escapeHtml(titleOf(person) || "Sahâbî Kaydı")}</div>
                <p>${escapeHtml(descriptionOf(person) || "Bu şahsiyet için henüz açıklama eklenmemiş.")}</p>
                <div class="random-meta">
                  ${eraOf(person) ? `<span>Dönem: ${escapeHtml(eraOf(person))}</span>` : ""}
                  ${hijriOf(person) ? `<span>${escapeHtml(hijriOf(person))}</span>` : ""}
                </div>
                <button class="button primary" id="new-random-person" type="button">Başka Bir Şahsiyet</button>
              </article>`
            : statusMarkup("Rastgele gösterilecek şahsiyet kaydı bulunamadı.")
        }
      </div>
    </section>`;
}

function articlesPage() {
  return ARTICLES.map(
    (article, index) => `
      <section class="split article-section">
        ${
          index % 2 === 0
            ? articleVisual(article) + articleContent(article)
            : articleContent(article) + articleVisual(article)
        }
      </section>`,
  ).join("");
}

function articleVisual(article) {
  return `
    <div class="half visual">
      <img src="${article.photo}" alt="${escapeHtml(article.title)}">
      <div class="visual-content">
        <span class="article-tag">${article.tag}</span>
        <h2>${article.title}</h2>
      </div>
    </div>`;
}

function articleContent(article) {
  return `
    <div class="half content">
      <p>${article.excerpt}</p>
      <button class="text-link" type="button">Devamını Oku →</button>
    </div>`;
}

function faqPage() {
  return `
    <section class="split">
      <div class="half visual sticky">
        <img src="${PHOTOS.ornate}" alt="Süslü elyazması sayfası">
        <div class="visual-content">
          <p class="eyebrow">Yardım</p>
          <h1>Sıkça Sorulan<br>Sorular</h1>
          <p class="visual-copy">Arşivin kullanımı, kaynaklar ve akademik atıf hakkında merak edilenler.</p>
        </div>
      </div>
      <div class="half content">
        <div class="faq-list">
          ${FAQS.map(
            ([question, answer], index) => `
              <div class="faq-item">
                <button class="faq-question" data-faq="${index}" aria-expanded="false">
                  <span>${question}</span><span class="faq-icon">+</span>
                </button>
                <div class="faq-answer" id="faq-${index}" hidden>${answer}</div>
              </div>`,
          ).join("")}
        </div>
        <div class="contact-box">
          <h3>Sorunuzu bulamadınız mı?</h3>
          <p>Editör ekibimize doğrudan iletişim formu aracılığıyla ulaşabilirsiniz.</p>
          <button class="text-link" type="button">İletişime Geç →</button>
        </div>
      </div>
    </section>`;
}

const pages = {
  home: homePage,
  archive: archivePage,
  timeline: timelinePage,
  genealogy: genealogyPage,
  random: randomPage,
  articles: articlesPage,
  faq: faqPage,
  login: loginPage,
  admin: adminPage,
};

function activeSection() {
  const section = window.location.hash.slice(1);
  return pages[section] ? section : "home";
}

function render() {
  const section = activeSection();
  appElement.innerHTML = pages[section]();
  document.querySelectorAll("[data-section]").forEach((link) => {
    const active = link.dataset.section === section;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  const adminLink = document.querySelector("#admin-nav-link");
  if (adminLink) adminLink.style.display = isAdmin() ? "" : "none";
  bindPageEvents(section);
}

function bindPageEvents(section) {
  if (section === "archive") {
    document.querySelector("#archive-search")?.addEventListener("input", (event) => {
      state.search = event.target.value;
      render();
      const input = document.querySelector("#archive-search");
      input?.focus();
      input?.setSelectionRange(state.search.length, state.search.length);
    });
    document.querySelectorAll("[data-era]").forEach((button) => {
      button.addEventListener("click", () => {
        state.era = button.dataset.era;
        render();
      });
    });
    document.querySelectorAll("[data-search]").forEach((button) => {
      button.addEventListener("click", () => {
        state.search = button.dataset.search;
        render();
      });
    });
  }

  if (section === "genealogy") {
    document.querySelector("#person-select")?.addEventListener("change", (event) => {
      state.genealogyId = event.target.value;
      render();
    });
  }

  if (section === "random") {
    document
      .querySelector("#new-random-person")
      ?.addEventListener("click", () => {
        chooseRandomPerson(true);
        render();
      });
  }

  if (section === "login") {
    document.querySelector("#login-form")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.querySelector("#login-email").value.trim();
      const password = document.querySelector("#login-password").value;
      state.loginError = "";
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        state.loginError = loginErrorMessage(error.code);
        render();
      }
    });

    document.querySelector("#google-login")?.addEventListener("click", async () => {
      state.loginError = "";
      try {
        await signInWithPopup(auth, new GoogleAuthProvider());
      } catch (error) {
        state.loginError = loginErrorMessage(error.code);
        render();
      }
    });

    document.querySelector("#logout-button")?.addEventListener("click", () => {
      signOut(auth);
    });
  }

  if (section === "admin") {
    bindAdminPageEvents();
  }

  if (section === "faq") {
    document.querySelectorAll("[data-faq]").forEach((button) => {
      button.addEventListener("click", () => {
        const answer = document.querySelector(`#faq-${button.dataset.faq}`);
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
        button.querySelector(".faq-icon").textContent = isOpen ? "+" : "−";
        answer.hidden = isOpen;
      });
    });
  }
}

function subscribe(collectionName) {
  onSnapshot(
    collection(db, collectionName),
    (snapshot) => {
      state[collectionName] = snapshot.docs.map((document) => ({
        id: document.id,
        _col: collectionName,
        ...document.data(),
      }));
      state.loaded.add(collectionName);
      render();
    },
    (error) => {
      console.error(`${collectionName} koleksiyonu okunamadı:`, error.code);
      state.errors.push(collectionName);
      state.loaded.add(collectionName);
      render();
    },
  );
}

function loginErrorMessage(code) {
  const messages = {
    "auth/invalid-credential": "E-posta adresi veya şifre hatalı.",
    "auth/invalid-email": "Geçerli bir e-posta adresi girin.",
    "auth/too-many-requests": "Çok fazla giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.",
    "auth/popup-closed-by-user": "Google giriş penceresi tamamlanmadan kapatıldı.",
    "auth/operation-not-allowed": "Bu giriş yöntemi Firebase Authentication ayarlarında etkin değil.",
  };
  return messages[code] || "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.";
}

window.addEventListener("hashchange", () => {
  render();
  window.scrollTo({ top: 0, behavior: "auto" });
});

if (!window.location.hash) {
  window.history.replaceState(null, "", "#home");
}

render();
onAuthStateChanged(auth, (user) => {
  state.user = user;
  state.authReady = true;
  state.loginError = "";
  const loginLink = document.querySelector("#login-nav-link");
  if (loginLink) loginLink.textContent = user ? "Hesabım" : "Giriş";
  render();
});
subscribe("zatlar");
subscribe("people");
subscribe("olaylar");

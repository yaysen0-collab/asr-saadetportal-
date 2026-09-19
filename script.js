/* ==========================================================================
   Asr-ı Saadet Portalı — script.js  (yeni tasarım için)
   - index.html içindeki <main id="app"> alanına tüm sayfaları çizer.
   - Firebase'i kendisi yükler (ayrıca <script> eklemenize gerek yok).
   - Veri: Firestore "zatlar" ve "olaylar" koleksiyonları (eski alan adlarıyla).
   - Sayfalar: #home #archive #timeline #genealogy #random #articles #faq #login #admin
   ========================================================================== */

const FIREBASE_SURUM = "10.8.0";
const FB = (p) => `https://www.gstatic.com/firebasejs/${FIREBASE_SURUM}/${p}.js`;
const yukle = (url) => import(url);

const firebaseConfig = {
  apiKey: "AIzaSyCrrD1XRInE3Er47ZRl28rUo_Pk7FZAyss",
  authDomain: "tarihizatlar.firebaseapp.com",
  projectId: "tarihizatlar",
  storageBucket: "tarihizatlar.firebasestorage.app",
  messagingSenderId: "930648787998",
  appId: "1:930648787998:web:db163d0f3811786610b20f",
};
const ADMIN_EMAILS = ["asrisaadetportali@gmail.com", "zeynepglfm@gmail.com"];

const HOSGELDIN_MESAJLARI = {
  "asrisaadetportali@gmail.com": "Hoşgeldin patron, koltuk hazır, ekip hazır, başarı zaten seninle geliyor. Her şeyin üstesinden gelebilirsin.",
  "zeynepglfm@gmail.com": "Hoş geldin ortak! Enerjini topladıysan sahne senin. Birlikte bu projeyi yukarılara taşıyalım. (Not: Seni çok seviyorum)"
};
const FORMSPREE_URL = "https://formspree.io/f/xaeygoey";

/* Firebase nesneleri baslat() içinde doldurulur */
let FS = null, AU = null, db = null, auth = null;

/* ---------- Sabit içerik ---------- */
const FOTO = {
  dome: "1776893761976-03f46ce701df",
  manuscript: "1720701574998-d68020bce2bd",
  calligraphy: "1696513553729-17129c427356",
  tiles: "1558114965-eeb97aa84c3b",
  manuscript2: "1720701575003-51dafcf39cb4",
  ornate: "1720700955600-a21cd215d1a3",
};
const foto = (k) => `https://images.unsplash.com/photo-${FOTO[k]}?w=1400&q=70&auto=format&fit=crop`;

const DEVIRLER = ["Asr-ı Saadet", "Hulefâ-yi Râşidîn", "Emeviler", "Abbasiler", "Endülüs", "Diğer"];
const HIZLI_ETIKETLER = ["Ebu Bekir", "Ömer", "Osman", "Ali", "Bedir", "Hamza"];

const SSS = [
  ["Bu projenin temel amacı nedir?", "Asr-ı Saadet döneminde yaşamış Ashab-ı Kiram'a ait biyografik bilgileri, akrabalık ve sosyal ilişkileri sistemli bir yapıda sunarak tarihsel bilginin daha anlaşılır ve erişilebilir hâle getirilmesini sağlamaktır."],
  ["Asr-ı Saadet Portalı hangi ihtiyaca cevap vermektedir?", "Ashab-ı Kiram'ın sayıca fazla olması ve bilgilerin farklı kaynaklara dağılmış olması nedeniyle oluşan bilgi karmaşasını gidermeyi amaçlar. Portal, bu bilgileri tek bir dijital platformda toplayarak düzenli ve bütüncül bir yapı sunar."],
  ["Proje hangi tarihsel dönemi kapsamaktadır?", "Proje, Asr-ı Saadet olarak adlandırılan ve Peygamber Efendimiz Muhammed Mustafa (s.a.v.)'in yaşadığı dönemi esas alır. Arşivde Hulefâ-yi Râşidîn, Emeviler, Abbasiler ve Endülüs dönemlerine ait kayıtlar da yer alabilir."],
  ["Portalda yer alan bilgiler hangi kaynaklara dayanmaktadır?", "Klasik İslam tarihi eserleri, siyer kaynakları ve güvenilir akademik çalışmalara dayanır. Her kaydın altında, varsa kaynak bilgisi gösterilir."],
  ["Bilgilerin doğruluğu nasıl sağlanmaktadır?", "Bilgiler birden fazla güvenilir kaynaktan karşılaştırmalı olarak incelenir. Şüpheli veya kesinlik içermeyen bilgiler akademik yaklaşım gereği dikkatle ele alınır."],
  ["Portal nasıl kullanılmaktadır?", "Arşiv sayfasından şahsiyet ve olayları arayabilir, dönemlere göre süzebilir ve kayıtları açarak okuyabilirsiniz. Soy Ağacı sayfasında bir isim seçerek anne, baba, eş ve diğer akrabalık bağlarını görebilirsiniz."],
  ["Sahabeler arası akrabalık ve sosyal ilişkiler nasıl gösterilmektedir?", "Sistem; nesep bağlarını, evlilikleri ve diğer ilişkileri kayıtlar üzerinden ilişkilendirerek Soy Ağacı sayfasında gösterir."],
  ["Portal akademik çalışmalarda kaynak olarak kullanılabilir mi?", "Portal doğrudan birincil kaynak olma iddiası taşımaz; ancak araştırmacılar için yardımcı ve yönlendirici bir dijital referans olarak kullanılabilir."],
  ["Proje kimlere hitap etmektedir?", "Öğrencilere, akademisyenlere, araştırmacılara ve İslam tarihiyle ilgilenen herkese."],
  ["İçerik genel kullanıcılar için anlaşılır mıdır?", "Evet. İçerikler akademik temele dayanmakla birlikte sade ve anlaşılır bir dille hazırlanmıştır."],
  ["Portalın gelecekte geliştirilmesi planlanmakta mıdır?", "Evet. İçeriklerin genişletilmesi, yeni sahabelerin eklenmesi ve görselleştirme araçlarının geliştirilmesi planlanmaktadır."],
  ["Portal eğitim amaçlı kullanılabilir mi?", "Evet. Portal, eğitim kurumlarında yardımcı bir kaynak olarak kullanılabilecek niteliktedir."],
];

const MAKALELER = [
  {
    etiket: "İtikat", foto: "manuscript",
    baslik: "Ashab-ı Kiram'ın İzinde",
    ozet: "İslam’ın kuvvetli olduğu zamanlarda doğduk. Kuran-ı Kerim'i bize öğretenler oldu. Maalesef ki yeni nesil elimizden kayıp gidiyor...",
    govde: `<p>İslam’ın kuvvetli olduğu zamanlarda doğduk. Kuran-ı Kerim'i bize öğretenler oldu. Maalesef ki yeni nesil elimizden kayıp gidiyor. Bunları nerede kaybettik? Hangi mezhebe ait olduğunu bilmeyen, peygamberimizi tanımayan birine nasıl namaz kıl diyebiliriz?</p>
<p>Hangi mezhepteniz, mezhep neden var, zorunda mıyız biz? <em>"El ilmü ferizatin ala küllü müslimin ve müslimetin"</em>. İlim öğrenmek her Müslüman erkek ve kadın üzerine farzdır. Burada kastedilen nasıl amel etmesi gerektiğini öğrenmektir. İtikadını bilmektir. Herkese tek tek vaciptir. Selam verse birisi, alsa diğerlerinden hüküm kalkar ama 5 vakit namaz herkese tek tek farzdır. İtikat konusunda da herkesin tek tek, fert fert kendisinin yapması lazımdır. İman ne demek? Hz. Allah’a, O'nun peygamberine, O'nun kulu ve resulü olduğuna iman etmektir.</p>
<p>Amel imandan bir cüz müdür? Günümüzde çok fazla var; Müslümanım diyor, namaz kılmıyor, zekât vermiyor. Peki, biz ona "Sen Müslüman değilsin" dersek ne olur? Dinden çıkmış oluruz. Amelinde eksik vardır evet ama Allah’a iman ettim diyordur; amelinde kusur vardır bizi alakadar etmez. İman asıldır, amel onu kuvvetlendirmek içindir. Rabbim bize kâmil iman versin.</p>
<p>Şimdi bir tane mumu yaksak onun sönmesi kolaydır ama biz iman ettik, <em>La ilahe illallah Muhammeden rasulullah</em> dedik. Namazla, rabıtayla, hatimle, zekât ve sadakayla o ateşi güçlendireceğiz. Zayıf olan muma bir kere üflesek söner ama kuvvetli olan ateşe üflesen de su atsan da sönmez. Kimisinin ki ampul gibi, kimisinin ki projektör gibidir. Evet, imanı biliyoruz ama güçlendirmek için çabalamamız gerek. Nasıl güçlendireceğiz? Ne ile? Amel-i Saliha ile.</p>
<p>Peygamber efendimiz de yıllar öncesinden ehlisünnete ve bu dört mezhepten birine uyulması hususunda şöyle buyurmuştur; <em>“Din, iman sahipleri yılanın deliğine, yuvasına çekilmesi gibi elbette Hicaz’a ve Medine-i Münevvere’ye çekilir, sığınır ve toplanır. İslam dini garip olarak başlayıp, yayıldığı gibi yakın zamanda da garip olarak döner. O zaman müjde ve saadet garip olanlar içindir.”</em> Buyurmuşlardır. Bunun üzerine <em>“Ya Rasulallah garip olanlar kimlerdir?”</em> diye soruldu. <em>“Benden sonra benim sünnetimden insanların bozduğu şeyleri düzeltenlerdir.“</em> cevabını verdi. Buradaki garipler kimlerdir? Yani ehlisünnet vel cemaat mezhebi üzerine olanlardır.</p>
<p>Peygamber efendimiz <em>“Yakında ümmetim 73 fırkaya ayrılacaktır. Onlardan biri hariç hepsi cehennemliktir.”</em> buyurdu. Ashab-ı Kiram <em>“Ya Rasulallah onlar kimlerdir?”</em> dedi. Peygamber efendimiz <em>“Onlar benim ve Ashabımın yolu üzerine olanlardır.”</em> buyurmuşlardır.</p>
<p class="art-son">Hazreti Allah bu yol üzerine bizleri daim etsin.</p>`,
  },
  {
    etiket: "İlim", foto: "calligraphy",
    baslik: "Neden Bu İlimleri Öğreniyoruz?",
    ozet: "İslam dini, okuyup ilim sahibi olmaya çok önem vermiştir. Hatta Peygamber Efendimize indirilen ilk ayeti kerime “Oku” emri ile başlar...",
    govde: `<p>İslam dini, okuyup ilim sahibi olmaya çok önem vermiştir. Hatta Peygamber Efendimize indirilen ilk ayeti kerime “Oku” emri ile başlar. Cenabı Hak Kuran-ı Keriminde; <em>“Ey Habibim! Yaratan Rabbinin adı ile oku”</em> buyurmuştur.</p>
<p>Kur’an-ı Kerim’e bakacak olursak, Allah lafzından sonra en çok geçen kelimelerden biri de ilim ve ilim manasını ifade eden kelimeler olduğunu görürüz. Yine Cenabı Hak Kuran-ı Keriminde: <em>“Habibim! De ki: Hiç bilenler ile bilmeyenler bir olur mu?"</em> buyurarak ilmin ve âlimin üstünlüğünü bildirmiştir.</p>
<p>Yine Hz. Allah bütün peygamberlerini âlim yapmıştır. Ümmetleri için öğretmen kılmıştır. Eğer ilimden daha yüce bir mertebe, daha güzel bir meslek olsaydı, Hz. Allah seçerek gönderdiği peygamberlerine o mesleği verirdi.</p>
<p>Abdullah bin Mübarek Hazretleri’ne sordular:</p>
<blockquote>— “Eğer Cenabı-ı Hak, sana öleceğin anı bildirse idi ne ile meşgul olurdun?”<br>— “İlim ile meşgul olurdum." dedi.<br>— “İlimden daha üstün bir ibadet yok mu ki, onunla meşgul olsanız?”<br>— “Evet. İlimden daha üstün bir ibadet yoktur.” dedi. Yanındakiler:<br>— “İlme çalışmanın her türlü ibadetten üstün olduğunu ne ile ispat edersiniz?” deyince,</blockquote>
<p>Abdullah bin Mübarek Hazretleri şöyle cevap verdi:</p>
<blockquote>— “İlim her şeyden üstündür. Çünkü Cenabı-ı Hak (c.c.) Peygamber Efendimize (s.a.v.) her şeyi verdi. Fazlasını istemekle emir buyurmadı. İlim hakkında ise: ‘Ey Habibim! De ki: Rabbim benim ilmimi artır.’ Eğer ilimden daha üstün bir şey olsa idi, Rasulullah Efendimiz (s.a.v.), onun artmasını istemekle emrolunurdu. Bundan dolayı ben ilimden daha üstün bir amel göremiyorum.”</blockquote>
<p>İslam dini ilme o kadar değer ve kıymet vermiştir ki, Bedir harbi esirlerinin okuryazar olanlarına, Müslümanlardan on kişiye okuyup yazmayı öğrettikleri takdirde serbest bırakılacakları, Fahr-i Kâinat Efendimiz tarafından va’d edilmiş ve esirler denileni yaptıkları zaman serbest bırakılmışlardır.</p>
<p>Bir milletin en büyük düşmanı cehalettir. Onu imha etmeden diğer düşmanlara karşı zafer mümkün değildir.</p>
<p class="art-son">Hiç kimse hakikati anlayacak ilimle doğmamıştır. Bu yüzden bu ilimleri okumaya ve anlamaya önem göstermeliyiz.</p>`,
  },
  {
    etiket: "Siyer", foto: "ornate",
    baslik: "Rasulullah Sevgisi ve Kur'an Eğitimi",
    ozet: "Resulullah efendimiz bir hadisi şeriflerinde şöyle buyuruyor; \"Evlatlarınızı üç haslet üzerine edeplendiriniz...\"",
    govde: `<p>Resulullah efendimiz bir hadisi şeriflerinde şöyle buyuruyor;</p>
<blockquote>”Evlatlarınızı üç haslet üzerine edeplendiriniz:</blockquote>
<ul><li><strong>1. Rasulullah sevgisi</strong></li><li><strong>2. Rasulullah’ın ehlibeytinin sevgisi</strong></li><li><strong>3. Kur'an-ı Kerim okumak</strong></li></ul>
<p>Çünkü Kur'an-ı Kerim okuyan, okutan ve onun hizmetinde bulunanlar hiçbir gölgenin bulunmadığı o kıyamet gününde evliya ve esfiya ile beraber Allah’ımızın Arşının gölgesinde bulunacaklardır.</p>
<h3>Kur'an-ı Kerim ilk olarak nerede ve nasıl öğretilmeye başlandı?</h3>
<p>Peygamber Efendimiz (s.a.v.), nübüvvetin ilk yıllarında Müslümanlar ile Safa tepesi eteklerindeki Hazret-i Erkam’ın (r.a.) evinde gizlice toplanır, onlara İslâm’ın emir ve hükümlerini bildirir, Kur’an-ı Kerim'in nazil olan Ayet-i Kerimelerini okur ve öğretirlerdi. <strong>Dârü'l-Erkam</strong> ismi verilen bu hane, İslam tarihinde ilk eğitim-öğretim yapılan ilim müessesesi olarak kabul edilir.</p>
<p>Rasulullah Efendimiz (s.a.v.), Medine-i Münevvere‘ye hicretlerinin ardından Mescid-i Nebevi ve ona bitişik olarak da Hücre-i Saadet'i inşa ettirdiler. Mescidin kuzey tarafına, bir suffa (gölgelik) yaptırdılar. Sahabe-i Kiramdan burada ikamet edenlere <strong>Ashab-ı Suffe</strong> denilirdi. Onların ihtiyaçlarıyla bizzat Efendimiz (s.a.v.) ilgilenir, eğitimiyle de yine kendileri alakadar olurlardı. Ayrıca onlara yazı yazmayı ve Kur’an-ı Kerim okumayı öğretmek üzere Ubâde b. Sâmit, Mus'ab bin Umeyr (r.anhüma) gibi hocalar tayin etmişlerdi.</p>`,
  },
];

/* ---------- Durum ---------- */
const durum = {
  zatlar: [], olaylar: [],
  yuklendi: { zat: false, olay: false },
  hata: null,
  kullanici: null,
  arama: "", devir: "tumu", tur: "tumu", limit: 50, acik: new Set(), kaydirHedef: null,
  rastgeleId: null,
  faqAcik: null,
  makaleAcik: new Set(),
  loginMod: "giris",
  admin: { sekme: "zat", duzenleId: null },
  favoriler: {}, notlar: {}, notTaslak: {}, kullaniciDinleyici: [], kisiselHata: null,
};

/* ---------- Yardımcılar ---------- */
const $ = (s, k) => (k || document).querySelector(s);
const esc = (s) => s == null ? "" : String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const bos = (v) => v == null || String(v).trim() === "" || String(v).trim() === "?";
const trKucuk = (s) => String(s || "").toLocaleLowerCase("tr");
const devirOf = (k) => k.devir || "Asr-ı Saadet";
const adSirala = (a, b) => trKucuk(a.isim || a.ad).localeCompare(trKucuk(b.isim || b.ad), "tr");

function duzMetin(ham) {
  if (!ham) return "";
  return String(ham).replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}
function ozet(ham, n) {
  const m = duzMetin(ham);
  return m.length > n ? m.slice(0, n).trimEnd() + "…" : m;
}
function baslikBuyut(metin) {
  if (!metin || metin === "?") return metin;
  return metin.split(" ").map((k) => k.charAt(0).toLocaleUpperCase("tr") + k.slice(1)).join(" ");
}
function yilSayi(v) {
  const m = String(v == null ? "" : v).match(/\d+/);
  return m ? parseInt(m[0], 10) : NaN;
}
/* "Ebu Bekir (ra)" ve "Ebu Bekir" aynı kişi sayılsın */
function adTemiz(ad) {
  return String(ad || "").replace(/\((r\.?\s?a\.?|r\.?\s?anh[a-zü]*\.?|s\.a\.v\.?)\)/gi, "").replace(/\s+/g, " ").trim();
}
const adAnahtar = (ad) => trKucuk(adTemiz(ad));
const birlestir = (...p) => p.filter((x) => !bos(x)).join(" / ");

/* Firestore'dan gelen (yönetici tarafından yazılmış) HTML'i güvenli hâle getirir */
const IZINLI = new Set(["P", "BR", "B", "STRONG", "I", "EM", "U", "UL", "OL", "LI", "H3", "H4", "BLOCKQUOTE", "A", "DIV", "SPAN"]);
const SILINECEK = new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "LINK", "META", "FORM", "INPUT", "BUTTON", "SVG"]);
function temizHtml(ham) {
  if (bos(ham)) return "";
  const metin = String(ham);
  if (!/<[a-z][\s\S]*>/i.test(metin)) return esc(metin).replace(/\n/g, "<br>");
  if (typeof DOMParser === "undefined") return esc(duzMetin(metin));
  const d = new DOMParser().parseFromString(metin, "text/html");
  const yuru = (dugum) => {
    Array.from(dugum.childNodes).forEach((c) => {
      if (c.nodeType === 3) return;
      if (c.nodeType !== 1) { c.remove(); return; }
      if (SILINECEK.has(c.tagName.toUpperCase())) { c.remove(); return; }
      yuru(c);
      if (!IZINLI.has(c.tagName)) { c.replaceWith(...Array.from(c.childNodes)); return; }
      Array.from(c.attributes).forEach((a) => {
        const ad = a.name.toLowerCase(), deger = a.value.trim();
        if (c.tagName === "A" && ad === "href" && /^(https?:|mailto:)/i.test(deger)) return;
        if (ad === "style") {
          const m = deger.match(/(?:^|;)\s*text-align:\s*(left|right|center|justify)\s*(?:;|$)/i);
          if (m) { c.setAttribute("style", "text-align:" + m[1].toLowerCase()); return; }
        }
        c.removeAttribute(a.name);
      });
      if (c.tagName === "A") { c.setAttribute("target", "_blank"); c.setAttribute("rel", "noopener noreferrer"); }
    });
  };
  yuru(d.body);
  return d.body.innerHTML;
}
const bilgiHtml = (ham) => bos(ham) ? "<p>Bu kayıt için henüz bilgi girilmemiş.</p>" : temizHtml(ham);

/* Favori / not anahtarı: "zat_ID" veya "olay_ID" (eski sitedekiyle aynı) */
const favAnahtar = (tip, id) => tip + "_" + id;
const kayitBul = (tip, id) => (tip === "zat" ? durum.zatlar : durum.olaylar).find((k) => k.id === id);
const kayitAdi = (tip, k) => (k ? (tip === "zat" ? k.isim : k.ad) || "" : "");

function adminMi() {
  const u = durum.kullanici;
  return !!(u && u.email && ADMIN_EMAILS.some(function(email) {
    return email.toLocaleLowerCase("tr") === u.email.toLocaleLowerCase("tr");
}));
   function hosgeldinBildirimGoster(email) {
  const mesaj = HOSGELDIN_MESAJLARI[trKucuk(email)];
  if (!mesaj) return;

  const kutu = document.createElement("div");
  kutu.className = "welcome-toast";
  kutu.textContent = mesaj;
  document.body.appendChild(kutu);

  requestAnimationFrame(() => kutu.classList.add("goster"));

  setTimeout(() => {
    kutu.classList.remove("goster");
    setTimeout(() => kutu.remove(), 500);
  }, 5000);
}

/* ---------- Ek stiller (style.css'e dokunmadan) ---------- */
function ekStilEkle() {
  if (document.getElementById("ek-stil")) return;
  const s = document.createElement("style");
  s.id = "ek-stil";
  s.textContent = `
a.record{display:block;color:inherit;text-decoration:none}
a.button,button.button{display:inline-block}
.text-link{display:inline-block}
.content > .text-link{align-self:flex-start;margin-top:1.5rem}
.ark-icerik{justify-content:flex-start}
.kayit-ust{cursor:pointer}
.kayit-ust:focus-visible{outline:2px solid var(--brass);outline-offset:4px}
.kayit-detay{margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(184,147,74,.2)}
.kayit-metin{color:var(--ink);font-size:.88rem;line-height:1.75}
.kayit-metin p{margin:0 0 .8rem;color:var(--ink);font-size:.88rem;line-height:1.75}
.kayit-metin h3{margin:1rem 0 .5rem}
.kayit-metin ul,.kayit-metin ol{margin:0 0 .8rem;padding-left:1.3rem}
.kayit-metin blockquote,.article-full blockquote{margin:.8rem 0;padding-left:1rem;border-left:2px solid var(--brass);color:var(--muted);font-style:italic}
.kayit-metin a,.article-full a{color:var(--brass)}
.kayit-bilgi{margin:1rem 0 0;display:grid;gap:.4rem}
.kayit-bilgi div{display:flex;gap:1rem;font-size:.78rem}
.kayit-bilgi dt{min-width:7rem;color:var(--brass);letter-spacing:.06em}
.kayit-bilgi dd{margin:0;color:var(--muted)}
.kayit-detay .text-link{margin-top:1rem}
.more-wrap{margin-top:1.25rem}
.event h3 a{color:inherit;text-decoration:none}
.event h3 a:hover{text-decoration:underline;text-decoration-color:var(--brass);text-underline-offset:4px}
.family-node a,.family-detail a{color:inherit;text-decoration:underline;text-decoration-color:var(--brass);text-underline-offset:3px}
.family-detail strong{max-width:70%}
.article-full{margin-bottom:1rem}
.article-full h3{margin:1.5rem 0 .6rem;color:var(--forest);font-family:"Lora",Georgia,serif;font-size:1.05rem;font-weight:500}
.article-full ul{color:var(--muted);font-size:.9rem;line-height:1.75}
.article-full .art-son{margin-top:1.5rem;color:var(--forest);font-family:"Lora",Georgia,serif;font-style:italic}
.form-field textarea,.login-field textarea{width:100%;padding:.7rem .85rem;color:var(--ink);background:var(--bone);border:1px solid rgba(26,22,18,.2);font:inherit;resize:vertical}
.form-hint{margin:.3rem 0 0;color:var(--quiet);font-size:.7rem}
.form-ok{margin:0 0 1rem;padding:.6rem .85rem;color:#2f6b4f;background:rgba(47,107,79,.08);border-left:2px solid #2f6b4f;font-size:.78rem}
.check-satir{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;color:var(--muted);font-size:.78rem}
.login-message.ok{color:#2f6b4f}
.contact-box .login-message{margin:1rem 0 0;color:#8c3d2f}
.contact-box .login-message.ok{color:#2f6b4f}
.contact-box .login-field input,.contact-box .login-field textarea{background:var(--bone)}
.login-panel .login-actions .button{flex:0 0 auto}
.rich-editor:empty::before{content:attr(data-placeholder);color:var(--quiet)}
.admin-page .admin-liste-bos{padding:1.2rem;color:var(--quiet);font-size:.8rem}
.kisisel{margin-top:1.25rem;padding-top:1rem;border-top:1px dashed rgba(184,147,74,.3)}
.kisisel-ust{margin-bottom:.9rem}
.kisisel-etiket{display:block;margin-bottom:.4rem;color:var(--brass);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase}
.kisisel-etiket span{margin-left:.5rem;color:var(--quiet);letter-spacing:0;text-transform:none}
.not-alani{width:100%;box-sizing:border-box;padding:.7rem .85rem;color:var(--ink);background:var(--bone);border:1px solid rgba(26,22,18,.2);font:inherit;font-size:.85rem;line-height:1.6;resize:vertical}
.kisisel-alt{display:flex;align-items:center;gap:.9rem;margin-top:.6rem}
.not-durum{color:#2f6b4f;font-size:.72rem}
.not-durum.hata{color:#8c3d2f}
.kayit-giris{margin:1.2rem 0 0;color:var(--muted);font-size:.78rem}
.kayit-giris a{color:var(--brass)}
.fav-dolu{border-color:var(--brass)!important;color:var(--brass)!important}
.fav-isaret{margin-left:.35rem;color:var(--brass);font-size:.8em}
a.btn-small{display:inline-block;text-decoration:none}
.hesap-bolum{margin:0 0 .8rem;color:var(--forest);font-family:"Lora",Georgia,serif;font-size:1.25rem;font-weight:500}
.hesap-bolum ~ .hesap-bolum{margin-top:2.2rem}
.fav-satir{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem}
.fav-satir > a,.fav-satir > div{flex:1;color:inherit;text-decoration:none}
.not-metin{white-space:pre-wrap}
.hesap-araclar{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.8rem}
`;
  document.head.appendChild(s);
}

/* ---------- Ortak parçalar ---------- */
function durumMesaji() {
  if (durum.hata) return `<div class="error">Kayıtlar yüklenemedi: ${esc(durum.hata)}<br>İnternet bağlantınızı ve Firestore kurallarını kontrol edin.</div>`;
  if (!(durum.yuklendi.zat && durum.yuklendi.olay)) return `<div class="loading">Kayıtlar yükleniyor…</div>`;
  return "";
}
const zatTarih = (k) => {
  const d = birlestir(k.d_hicri, k.d_miladi), v = birlestir(k.v_hicri, k.v_miladi);
  return [d && `Doğum: ${d}`, v && `Vefat: ${v}`].filter(Boolean).join("  ·  ");
};
const olayTarih = (o) => birlestir(o.hicri, o.miladi);

function gorselYari({ f, alt, sticky = false, ortada = false, icerik }) {
  return `<div class="half visual${sticky ? " sticky" : ""}${ortada ? " middle" : ""}">
    <img src="${foto(f)}" alt="${esc(alt)}" loading="lazy">
    <div class="visual-content">${icerik}</div>
  </div>`;
}

function linkKart(k, tur) {
  const ad = tur === "zat" ? k.isim : k.ad;
  const tarih = tur === "zat" ? zatTarih(k) : olayTarih(k);
  return `<a class="record" href="#archive/${tur}-${esc(k.id)}">
    <div class="record-head"><h3>${esc(ad)}</h3><span class="title">${esc(devirOf(k))}</span></div>
    <p>${esc(bos(k.bilgi) ? "Bu kayıt için henüz bilgi girilmemiş." : ozet(k.bilgi, 140))}</p>
    ${tarih ? `<small>${esc(tarih)}</small>` : ""}
  </a>`;
}

/* ---------- ANA SAYFA ---------- */
function sayfaHome() {
  const hazir = durum.yuklendi.zat && durum.yuklendi.olay && !durum.hata;
  const n = (x) => (hazir ? x : "…");
  const bagli = durum.zatlar.filter((z) => !bos(z.baba) || !bos(z.anne) || !bos(z.baglar)).length;
  const one = durum.zatlar.filter((z) => !bos(z.bilgi))
    .map((z) => [z, duzMetin(z.bilgi).length]).sort((a, b) => b[1] - a[1]).slice(0, 5).map((x) => x[0]);
  const yeni = durum.olaylar.slice().sort((a, b) => (b.eklenmeTarihi || 0) - (a.eklenmeTarihi || 0)).slice(0, 3);
  const dm = durumMesaji();

  return `
  <section class="split">
    ${gorselYari({ f: "dome", alt: "Cami kubbesinin iç mimarisi", icerik: `
      <h1>“Ashabım, yıldızlar gibidir. Hangisine tabi olursanız hidayete erersiniz.”</h1>
      <p class="quote-source">— Peygamber Efendimiz (s.a.v.)</p>
      <div class="brass-rule"></div>` })}
    <div class="half content">
      <p class="eyebrow">Dijital Siyer Arşivi</p>
      <h2 class="content-title">Ashab-ı Kiram'ın hayatlarını, nesep bağlarını ve dönemin olaylarını tek yerde okuyun.</h2>
      <p class="lead">Kayıtlar klasik siyer ve tarih kaynaklarına dayanır. Bir şahsiyetten akrabalarına, bir olaydan zaman çizelgesindeki yerine geçebilirsiniz.</p>
      <div class="stats">
        <div class="stat"><strong>${n(durum.zatlar.length)}</strong><span>Şahsiyet</span></div>
        <div class="stat"><strong>${n(durum.olaylar.length)}</strong><span>Olay</span></div>
        <div class="stat"><strong>${n(bagli)}</strong><span>Bağlantı</span></div>
      </div>
      <div class="actions">
        <a class="button primary" href="#archive">Arşivi Keşfet</a>
        <a class="button" href="#timeline">Zaman Çizelgesi</a>
      </div>
    </div>
  </section>

  <section class="split medium">
    ${gorselYari({ f: "tiles", alt: "İslam sanatında geometrik çini deseni", ortada: true, icerik: `
      <h2>Öne Çıkan Şahsiyetler</h2>
      <p class="visual-copy">Arşivde en kapsamlı kaydı bulunan isimler.</p>
      <div class="brass-rule"></div>` })}
    <div class="half content">
      ${dm || (one.length ? `<div class="record-list">${one.map((z) => linkKart(z, "zat")).join("")}</div>` : `<div class="empty">Henüz bilgi girilmiş bir şahsiyet yok.</div>`)}
      <a class="text-link" href="#archive">Tüm arşivi görüntüle →</a>
    </div>
  </section>

  <section class="split medium">
    ${gorselYari({ f: "manuscript2", alt: "Eski bir Arapça el yazması", ortada: true, icerik: `
      <h2>Son Eklenen Olaylar</h2>
      <p class="visual-copy">Zaman çizelgesine en son giren tarihî olaylar.</p>
      <div class="brass-rule"></div>` })}
    <div class="half content">
      ${dm || (yeni.length ? `<div class="record-list">${yeni.map((o) => linkKart(o, "olay")).join("")}</div>` : `<div class="empty">Henüz olay kaydı yok.</div>`)}
      <a class="text-link" href="#timeline">Zaman çizelgesine git →</a>
    </div>
  </section>

  <section class="split short">
    <div class="half content dark-content">
      <p class="eyebrow">Temel Okumalar</p>
      <h2 class="serif-title">Ashab-ı Kiram'ı ve ilim geleneğini anlatan üç okuma.</h2>
      <p class="lead">İtikat, ilim ve Kur'an eğitimi üzerine hazırlanmış kısa yazılar.</p>
      <a class="text-link" href="#articles">Makaleleri oku →</a>
    </div>
    ${gorselYari({ f: "manuscript2", alt: "Eski bir Arapça el yazması", icerik: `
      <div class="article-lines">${MAKALELER.map((m) => `<div class="article-line"><span class="article-tag">${esc(m.etiket)}</span><p>${esc(m.baslik)}</p></div>`).join("")}</div>` })}
  </section>`;
}

/* ---------- ARŞİV ---------- */
function sayfaArsiv() {
  return `
  <section class="split">
    ${gorselYari({ f: "manuscript", alt: "Eski bir el yazması", sticky: true, icerik: `
      <p class="eyebrow">Dijital Arşiv</p>
      <h1>Sahâbe<br>Kataloğu</h1>
      <p class="visual-copy">Klasik siyer ve tarih kaynaklarından derlenen şahsiyet ve olay kayıtları.</p>
      <div class="mini-stats" id="arsiv-istatistik"></div>` })}
    <div class="half content ark-icerik">
      <div class="archive-tools">
        <input id="arama" class="search" type="search" placeholder="İsim veya içerik ara…" value="${esc(durum.arama)}" autocomplete="off" aria-label="Arşivde ara">
        <div class="filters" id="arsiv-tur"></div>
        <div class="filters" id="arsiv-devir"></div>
        <div class="quick-tags">${HIZLI_ETIKETLER.map((t) => `<button type="button" class="quick-tag" data-action="etiket" data-deger="${esc(t)}">${esc(t)}</button>`).join("")}</div>
      </div>
      <div id="arsiv-alan"></div>
    </div>
  </section>`;
}

function arsivFiltrele() {
  const q = trKucuk(durum.arama.trim());
  const uygun = (k) => (durum.devir === "tumu" || devirOf(k) === durum.devir) && (!q || (k._ara || "").includes(q));
  return {
    z: durum.tur === "olay" ? [] : durum.zatlar.filter(uygun),
    o: durum.tur === "zat" ? [] : durum.olaylar.filter(uygun),
  };
}

/* ---------- Favori + kişisel not alanı (kayıt detayında) ---------- */
function kisiselAlan(tur, k) {
  if (!durum.kullanici) {
    return `<p class="kayit-giris">Favorilere eklemek ve kişisel not almak için <a href="#login">giriş yapın</a>.</p>`;
  }
  const key = favAnahtar(tur, k.id);
  const fav = !!durum.favoriler[key];
  const kayitli = durum.notlar[key] ? durum.notlar[key].metin : "";
  const metin = key in durum.notTaslak ? durum.notTaslak[key] : kayitli;
  return `<div class="kisisel">
    ${durum.kisiselHata ? `<div class="error">Favori ve notlar okunamadı: ${esc(durum.kisiselHata)}</div>` : ""}
    <div class="kisisel-ust">
      <button type="button" class="btn-small${fav ? " fav-dolu" : ""}" data-action="fav" data-tip="${tur}" data-id="${esc(k.id)}" aria-pressed="${fav}">${fav ? "★ Favorilerde" : "☆ Favorilere ekle"}</button>
    </div>
    <label class="kisisel-etiket" for="not-${esc(key)}">Kişisel notum <span>yalnızca siz görürsünüz</span></label>
    <textarea id="not-${esc(key)}" class="not-alani" rows="3" data-anahtar="${esc(key)}" placeholder="Bu kayıtla ilgili kendinize not alın…">${esc(metin)}</textarea>
    <div class="kisisel-alt">
      <button type="button" class="btn-small" data-action="not-kaydet" data-tip="${tur}" data-id="${esc(k.id)}">Notu kaydet</button>
      <span class="not-durum" data-anahtar="${esc(key)}" role="status"></span>
    </div>
  </div>`;
}

function kayitKarti(k, tur) {
  const ad = tur === "zat" ? k.isim : k.ad;
  const anahtar = `${tur}-${k.id}`;
  const acik = durum.acik.has(anahtar);
  const tarih = tur === "zat" ? zatTarih(k) : olayTarih(k);
  let detay = "";
  if (acik) {
    const satirlar = tur === "zat"
      ? [["Anne", k.anne], ["Baba", k.baba], ["Eşi / Eşleri", k.es], ["Diğer bağlar", k.baglar]].filter(([, v]) => !bos(v))
      : [];
    detay = `<div class="kayit-detay">
      <div class="kayit-metin">${bilgiHtml(k.bilgi)}</div>
      ${satirlar.length ? `<dl class="kayit-bilgi">${satirlar.map(([a, v]) => `<div><dt>${a}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
      ${!bos(k.kaynak) ? `<small>Kaynak: ${esc(k.kaynak)}</small>` : ""}
      ${tur === "zat" ? `<a class="text-link" href="#genealogy/${esc(k.id)}">Soy ağacında gör →</a>` : ""}
      ${kisiselAlan(tur, k)}
    </div>`;
  }
  return `<article class="record" id="kayit-${esc(anahtar)}">
    <div class="kayit-ust" role="button" tabindex="0" aria-expanded="${acik}" data-action="kayit" data-anahtar="${esc(anahtar)}">
      <div class="record-head"><h3>${esc(ad)}${durum.favoriler[favAnahtar(tur, k.id)] ? ` <span class="fav-isaret" title="Favorilerinizde">★</span>` : ""}</h3><span class="era">${esc(devirOf(k))}</span></div>
      ${acik ? "" : `<p>${esc(bos(k.bilgi) ? "Bu kayıt için henüz bilgi girilmemiş." : ozet(k.bilgi, 150))}</p>`}
      ${tarih ? `<small>${esc(tarih)}</small>` : ""}
    </div>
    ${detay}
  </article>`;
}

function arsivGuncelle() {
  const alan = $("#arsiv-alan");
  if (!alan) return;
  const btn = (islem, deger, etiket, aktif) =>
    `<button type="button" class="filter${aktif ? " active" : ""}" data-action="${islem}" data-deger="${esc(deger)}">${esc(etiket)}</button>`;
  $("#arsiv-tur").innerHTML = [["tumu", "Tümü"], ["zat", "Şahsiyetler"], ["olay", "Olaylar"]]
    .map(([k, l]) => btn("tur", k, l, durum.tur === k)).join("");
  $("#arsiv-devir").innerHTML = [["tumu", "Tüm devirler"], ...DEVIRLER.map((d) => [d, d])]
    .map(([k, l]) => btn("devir", k, l, durum.devir === k)).join("");

  const { z, o } = arsivFiltrele();
  const hepsi = [...z.map((k) => ["zat", k]), ...o.map((k) => ["olay", k])];

  const ist = $("#arsiv-istatistik");
  if (ist) ist.innerHTML = `<h3>Arşiv durumu</h3>
    <div class="mini-stat"><span>Şahsiyet</span><strong>${durum.zatlar.length}</strong></div>
    <div class="mini-stat"><span>Olay</span><strong>${durum.olaylar.length}</strong></div>
    <div class="mini-stat"><span>Gösterilen</span><strong>${hepsi.length}</strong></div>`;

  const dm = durumMesaji();
  if (dm) { alan.innerHTML = dm; return; }
  if (!hepsi.length) { alan.innerHTML = `<div class="empty">Aramanızla eşleşen kayıt bulunamadı.</div>`; return; }

  const gosterilen = hepsi.slice(0, durum.limit);
  alan.innerHTML = `<div class="record-list">${gosterilen.map(([t, k]) => kayitKarti(k, t)).join("")}</div>` +
    (hepsi.length > durum.limit
      ? `<div class="more-wrap"><button type="button" class="button" data-action="daha">Daha fazla göster (${hepsi.length - durum.limit})</button></div>` : "");

  if (durum.kaydirHedef) {
    const el = document.getElementById("kayit-" + durum.kaydirHedef);
    if (el) { el.scrollIntoView({ block: "center" }); durum.kaydirHedef = null; }
  }
}

/* ---------- ZAMAN ÇİZELGESİ ---------- */
function sayfaCizelge() {
  const ogeler = [];
  durum.olaylar.forEach((o) => { const y = yilSayi(o.miladi); if (!isNaN(y)) ogeler.push({ y, ad: o.ad, tur: "olay", id: o.id, etiket: "Olay", bilgi: o.bilgi }); });
  durum.zatlar.forEach((z) => { const y = yilSayi(z.d_miladi); if (!isNaN(y)) ogeler.push({ y, ad: z.isim, tur: "zat", id: z.id, etiket: "Doğum", bilgi: z.bilgi }); });
  ogeler.sort((a, b) => a.y - b.y);
  const dm = durumMesaji();
  const aralik = ogeler.length ? `M. ${ogeler[0].y} – M. ${ogeler[ogeler.length - 1].y} arasında ${ogeler.length} kayıt.` : "Miladi tarihi girilmiş kayıtlar burada sıralanır.";
  return `
  <section class="split">
    ${gorselYari({ f: "tiles", alt: "İslam mimarisinde geometrik desen", sticky: true, icerik: `
      <p class="eyebrow">Tarih Şeridi</p>
      <h1>Zaman<br>Çizelgesi</h1>
      <p class="visual-copy">${esc(aralik)}</p>` })}
    <div class="half content ark-icerik">
      ${dm || (ogeler.length ? `<div class="timeline">${ogeler.map((i) => `
        <div class="event">
          <time>M. ${i.y} · ${i.etiket}</time>
          <h3><a href="#archive/${i.tur}-${esc(i.id)}">${esc(i.ad)}</a></h3>
          ${!bos(i.bilgi) ? `<p>${esc(ozet(i.bilgi, 160))}</p>` : ""}
        </div>`).join("")}</div>` : `<div class="empty">Henüz miladi tarihi girilmiş kayıt yok.</div>`)}
    </div>
  </section>`;
}

/* ---------- SOY AĞACI ---------- */
function adIndeks() {
  const m = new Map();
  durum.zatlar.forEach((z) => { const a = adAnahtar(z.isim); if (a && !m.has(a)) m.set(a, z); });
  return m;
}
function adLink(ad, idx) {
  if (bos(ad)) return "";
  const b = idx.get(adAnahtar(ad));
  return b ? `<a href="#genealogy/${esc(b.id)}">${esc(adTemiz(ad) || ad)}</a>` : esc(ad);
}
function baglariAyir(baglar) {
  if (bos(baglar)) return [];
  return String(baglar).split(/\s*,\s*/).map((p) => {
    const m = p.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (!m || /^r\.?\s?a/i.test(m[2].trim())) return { ad: p.trim(), tur: "" };
    return { ad: m[1].trim(), tur: m[2].trim() };
  }).filter((b) => b.ad);
}

function soyAgaci(k) {
  const idx = adIndeks();
  const dugum = (iliski, ad) => {
    if (bos(ad)) return `<div class="family-node"><span class="relation">${iliski}</span><h3>Kayıtlı değil</h3><p>Bu bilgi arşive girilmemiş.</p></div>`;
    const b = idx.get(adAnahtar(ad));
    return `<div class="family-node"><span class="relation">${iliski}</span><h3>${adLink(ad, idx)}</h3><p>${b ? esc(devirOf(b)) : "Arşivde ayrı bir kaydı yok."}</p></div>`;
  };
  const anah = adAnahtar(k.isim);
  const bag = baglariAyir(k.baglar);

  const cocukKayit = durum.zatlar.filter((z) => z.id !== k.id &&
    ((!bos(z.baba) && adAnahtar(z.baba) === anah) || (!bos(z.anne) && adAnahtar(z.anne) === anah)));
  const kardesKayit = durum.zatlar.filter((z) => z.id !== k.id &&
    ((!bos(k.baba) && !bos(z.baba) && adAnahtar(z.baba) === adAnahtar(k.baba)) ||
     (!bos(k.anne) && !bos(z.anne) && adAnahtar(z.anne) === adAnahtar(k.anne))));

  const liste = (kayitlar, bagTur) => {
    const goruldu = new Set(), cikti = [];
    kayitlar.forEach((z) => { goruldu.add(adAnahtar(z.isim)); cikti.push(adLink(z.isim, idx)); });
    bag.filter((b) => trKucuk(b.tur) === bagTur).forEach((b) => {
      const a = adAnahtar(b.ad);
      if (!goruldu.has(a)) { goruldu.add(a); cikti.push(adLink(b.ad, idx)); }
    });
    return cikti;
  };
  const cocuklar = liste(cocukKayit, "çocuk");
  const kardesler = liste(kardesKayit, "kardeş");
  const diger = bag.filter((b) => !["çocuk", "kardeş"].includes(trKucuk(b.tur)))
    .map((b) => adLink(b.ad, idx) + (b.tur ? ` (${esc(b.tur)})` : ""));
  const esler = bos(k.es) ? [] : String(k.es).split(/\s*,\s*/).filter(Boolean).map((e) => adLink(e, idx));

  const satir = (e, h) => (h ? `<div class="family-detail"><span>${e}</span><strong>${h}</strong></div>` : "");
  const tarih = zatTarih(k);
  return `
    <div class="family-tree">
      ${dugum("Baba", k.baba)}
      ${dugum("Anne", k.anne)}
      <div class="family-node main"><span class="relation">Seçilen şahsiyet</span><h3>${esc(k.isim)}</h3><p>${esc(devirOf(k))}${tarih ? " · " + esc(tarih) : ""}</p></div>
    </div>
    <div class="family-details">
      ${satir("Eşi / Eşleri", esler.join(", "))}
      ${satir("Çocukları", cocuklar.join(", "))}
      ${satir("Kardeşleri", kardesler.join(", "))}
      ${satir("Diğer akrabalar", diger.join(", "))}
      ${satir("Kaynak", bos(k.kaynak) ? "" : esc(k.kaynak))}
      ${!esler.length && !cocuklar.length && !kardesler.length && !diger.length ? `<div class="family-detail"><span>Bağlantı</span><strong>Başka bağlantı kaydı yok</strong></div>` : ""}
    </div>
    <a class="text-link" href="#archive/zat-${esc(k.id)}">Tam kaydı arşivde oku →</a>`;
}

function sayfaSoy(param) {
  const secili = durum.zatlar.find((z) => z.id === param);
  const dm = durumMesaji();
  const secenekler = `<option value="">Bir şahsiyet seçin…</option>` +
    durum.zatlar.map((z) => `<option value="${esc(z.id)}"${secili && secili.id === z.id ? " selected" : ""}>${esc(z.isim)}</option>`).join("");
  return `
  <section class="split">
    ${gorselYari({ f: "ornate", alt: "Süslemeli bir el yazması sayfası", sticky: true, icerik: `
      <p class="eyebrow">Nesep ve Akrabalık</p>
      <h1>Soy<br>Ağacı</h1>
      <p class="visual-copy">Bir isim seçin; anne, baba, eş, çocuk ve kardeş bağlarını görün.</p>` })}
    <div class="half content ark-icerik">
      <div class="genealogy-tools">
        <label for="soy-sec">Şahsiyet</label>
        <select id="soy-sec" class="person-select">${secenekler}</select>
      </div>
      ${dm && !durum.zatlar.length ? dm : secili ? soyAgaci(secili) : `<div class="empty">Ağacını görmek için yukarıdan bir isim seçin.</div>`}
    </div>
  </section>`;
}

/* ---------- RASTGELE ŞAHSİYET ---------- */
function sayfaRastgele() {
  const dm = durumMesaji();
  const adaylar = durum.zatlar.filter((z) => !bos(z.bilgi));
  let k = adaylar.find((z) => z.id === durum.rastgeleId);
  if (!k && adaylar.length) { k = adaylar[Math.floor(Math.random() * adaylar.length)]; durum.rastgeleId = k.id; }
  const meta = k ? [
    !bos(k.anne) && `Anne: ${k.anne}`, !bos(k.baba) && `Baba: ${k.baba}`,
    birlestir(k.d_hicri, k.d_miladi) && `Doğum: ${birlestir(k.d_hicri, k.d_miladi)}`,
    birlestir(k.v_hicri, k.v_miladi) && `Vefat: ${birlestir(k.v_hicri, k.v_miladi)}`,
  ].filter(Boolean) : [];
  return `
  <section class="split">
    ${gorselYari({ f: "dome", alt: "Cami kubbesinin iç mimarisi", sticky: true, icerik: `
      <p class="eyebrow">Keşfet</p>
      <h1>Rastgele<br>Şahsiyet</h1>
      <p class="visual-copy">Arşivden bilgisi girilmiş bir isim seçilir.</p>` })}
    <div class="half content">
      ${dm && !k ? dm : k ? `
      <div class="random-card">
        <h2>${esc(k.isim)}</h2>
        <p class="person-title">${esc(devirOf(k))}</p>
        <p>${esc(ozet(k.bilgi, 700))}</p>
        ${meta.length ? `<div class="random-meta">${meta.map((m) => `<span>${esc(m)}</span>`).join("")}</div>` : ""}
        <div class="actions">
          <a class="button primary" href="#archive/zat-${esc(k.id)}">Tam kaydı oku</a>
          ${durum.kullanici ? `<button type="button" class="button${durum.favoriler[favAnahtar("zat", k.id)] ? " fav-dolu" : ""}" data-action="fav" data-tip="zat" data-id="${esc(k.id)}">${durum.favoriler[favAnahtar("zat", k.id)] ? "★ Favorilerde" : "☆ Favorilere ekle"}</button>` : ""}
          <button type="button" class="button" data-action="rastgele">Başka bir şahsiyet</button>
        </div>
      </div>` : `<div class="empty">Henüz bilgisi girilmiş bir şahsiyet yok.</div>`}
    </div>
  </section>`;
}

/* ---------- MAKALELER ---------- */
function sayfaMakaleler() {
  return MAKALELER.map((m, i) => {
    const acik = durum.makaleAcik.has(i);
    const gorsel = gorselYari({ f: m.foto, alt: m.baslik, icerik: `<span class="article-tag">${esc(m.etiket)}</span><h2>${esc(m.baslik)}</h2>` });
    const icerik = `<div class="half content">
      ${acik ? `<div class="article-full">${m.govde}</div>` : `<p>${esc(m.ozet)}</p>`}
      <button type="button" class="text-link" data-action="makale" data-i="${i}">${acik ? "Daha az göster ↑" : "Devamını oku →"}</button>
    </div>`;
    return `<section class="split article-section">${i % 2 === 0 ? gorsel + icerik : icerik + gorsel}</section>`;
  }).join("");
}

/* ---------- S.S.S. ve İLETİŞİM ---------- */
function faqListe() {
  return `<div class="faq-list">${SSS.map(([q, a], i) => {
    const acik = durum.faqAcik === i;
    return `<div class="faq-item">
      <button type="button" class="faq-question" data-action="faq" data-i="${i}" aria-expanded="${acik}">
        <span>${esc(q)}</span><span class="faq-icon">${acik ? "−" : "+"}</span>
      </button>
      ${acik ? `<div class="faq-answer">${esc(a)}</div>` : ""}
    </div>`;
  }).join("")}</div>`;
}

function sayfaSss() {
  return `
  <section class="split">
    ${gorselYari({ f: "calligraphy", alt: "Arap hattı örneği", sticky: true, icerik: `
      <p class="eyebrow">Yardım</p>
      <h1>Sıkça Sorulan<br>Sorular</h1>
      <p class="visual-copy">Arşivin kullanımı, kaynaklar ve içerik hakkında merak edilenler.</p>` })}
    <div class="half content ark-icerik">
      <div id="faq-alan">${faqListe()}</div>
      <div class="contact-box">
        <h3>Sorunuzu bulamadınız mı?</h3>
        <p>Soru, öneri veya düzeltme bildirimlerinizi aşağıdaki formla iletebilirsiniz.</p>
        <div class="login-field"><label for="ilt-isim">Adınız</label><input id="ilt-isim" type="text" autocomplete="name"></div>
        <div class="login-field"><label for="ilt-eposta">E-posta</label><input id="ilt-eposta" type="email" autocomplete="email"></div>
        <div class="login-field"><label for="ilt-konu">Konu</label><input id="ilt-konu" type="text"></div>
        <div class="login-field"><label for="ilt-mesaj">Mesajınız</label><textarea id="ilt-mesaj" rows="4"></textarea></div>
        <button type="button" class="button primary" data-action="iletisim">Mesajı gönder</button>
        <p class="login-message" id="iletisim-durum" role="status"></p>
      </div>
    </div>
  </section>`;
}

/* ---------- GİRİŞ ---------- */
function sayfaGiris() {
  const u = durum.kullanici;
  let govde;
  if (u) {
    govde = `<h2>Hesabınız</h2>
      <p>Giriş yaptınız.</p>
      <div class="login-user">${esc(u.email || u.displayName || "")}${adminMi() ? "<br>Yönetici hesabı" : ""}</div>
      <div class="login-actions">
        <a class="button primary" href="#account">Favorilerim ve notlarım</a>
        ${adminMi() ? `<a class="button" href="#admin">Yönetim paneli</a>` : ""}
        <button type="button" class="button" data-action="cikis">Çıkış yap</button>
      </div>`;
  } else {
    const kayit = durum.loginMod === "kayit";
    govde = `<h2>${kayit ? "Üye ol" : "Giriş yap"}</h2>
      <p>${kayit ? "E-posta ve şifrenizle hesap oluşturun." : "Hesabınızla giriş yapın. Yönetim paneli yalnızca yönetici hesabına açıktır."}</p>
      <div class="login-field"><label for="giris-eposta">E-posta</label><input id="giris-eposta" type="email" autocomplete="email"></div>
      <div class="login-field"><label for="giris-sifre">Şifre</label><input id="giris-sifre" type="password" autocomplete="${kayit ? "new-password" : "current-password"}"></div>
      <p class="login-message" id="giris-mesaj" role="alert"></p>
      <div class="login-actions">
        <button type="button" class="button primary" data-action="${kayit ? "kayit-ol" : "giris"}">${kayit ? "Üye ol" : "Giriş yap"}</button>
        <button type="button" class="button" data-action="google">Google ile devam et</button>
      </div>
      <p style="margin:1.25rem 0 0"><button type="button" class="text-link" data-action="login-mod" data-mod="${kayit ? "giris" : "kayit"}">${kayit ? "Zaten hesabım var" : "Hesabım yok, üye olmak istiyorum"}</button></p>`;
  }
  return `
  <section class="split">
    ${gorselYari({ f: "dome", alt: "Cami kubbesinin iç mimarisi", sticky: true, icerik: `
      <p class="eyebrow">Hesap</p>
      <h1>${u ? "Hoş geldiniz" : "Giriş"}</h1>
      <p class="visual-copy">Yönetici hesabıyla giriş yaparak arşive kayıt ekleyebilir ve düzenleyebilirsiniz.</p>` })}
    <div class="half content" style="align-items:flex-start"><div class="login-panel">${govde}</div></div>
  </section>`;
}

/* ---------- YÖNETİCİ PANELİ ---------- */
function sayfaAdmin() {
  if (!adminMi()) {
    return `<section class="admin-page admin-denied">
      <h1>Yönetici alanı</h1>
      <p>${durum.kullanici ? `${esc(durum.kullanici.email)} hesabının bu bölüme erişim yetkisi yok.` : "Bu bölüm yalnızca yönetici hesabına açıktır. Devam etmek için giriş yapın."}</p>
      <a class="button primary" href="#login">${durum.kullanici ? "Hesap sayfasına git" : "Giriş yap"}</a>
    </section>`;
  }
  return `<section class="admin-page">
    <div class="admin-top">
      <h1>Yönetici Paneli</h1>
      <div class="admin-top-actions">
        <a class="button" href="#home">Siteyi gör</a>
        <button type="button" class="button" data-action="cikis">Çıkış yap</button>
      </div>
    </div>
    <div class="admin-tabs" id="admin-sekmeler"></div>
    <div class="admin-grid">
      <div class="admin-col-list" id="admin-liste"></div>
      <div class="admin-col-form" id="admin-form"></div>
    </div>
  </section>`;
}

function adminSekmeleriGuncelle() {
  const el = $("#admin-sekmeler");
  if (!el) return;
  const s = durum.admin.sekme;
  el.innerHTML = `<button type="button" class="tab-btn${s === "zat" ? " active" : ""}" data-action="admin-sekme" data-sekme="zat">Şahsiyetler (${durum.zatlar.length})</button>
    <button type="button" class="tab-btn${s === "olay" ? " active" : ""}" data-action="admin-sekme" data-sekme="olay">Olaylar (${durum.olaylar.length})</button>`;
}

function adminListeGuncelle() {
  const el = $("#admin-liste");
  if (!el) return;
  adminSekmeleriGuncelle();
  if (durum.hata) { el.innerHTML = `<div class="admin-liste-bos">Kayıtlar yüklenemedi: ${esc(durum.hata)}</div>`; return; }
  const yuk = durum.admin.sekme === "zat" ? durum.yuklendi.zat : durum.yuklendi.olay;
  const liste = durum.admin.sekme === "zat" ? durum.zatlar : durum.olaylar;
  if (!yuk) { el.innerHTML = `<div class="admin-liste-bos">Yükleniyor…</div>`; return; }
  el.innerHTML = liste.length ? liste.map((k) => `<div class="admin-list-item">
      <div><h4>${esc(k.isim || k.ad)}</h4><span>${esc(devirOf(k))}</span></div>
      <div class="admin-list-actions">
        <button type="button" class="btn-small" data-action="admin-duzenle" data-id="${esc(k.id)}">Düzenle</button>
        <button type="button" class="btn-small btn-danger" data-action="admin-sil" data-id="${esc(k.id)}">Sil</button>
      </div>
    </div>`).join("") : `<div class="admin-liste-bos">Henüz kayıt yok.</div>`;
}

const EDITOR_HTML = `<div class="form-field"><label>Bilgi</label>
  <div class="editor-wrap">
    <div class="editor-toolbar">
      <button type="button" data-action="komut" data-komut="bold" title="Kalın"><b>B</b></button>
      <button type="button" data-action="komut" data-komut="italic" title="İtalik"><i>I</i></button>
      <button type="button" data-action="komut" data-komut="underline" title="Altı çizili"><u>U</u></button>
      <button type="button" data-action="komut" data-komut="insertUnorderedList" title="Madde işaretli liste">•</button>
      <button type="button" data-action="komut" data-komut="insertOrderedList" title="Numaralı liste">1.</button>
      <button type="button" data-action="komut" data-komut="formatBlock" data-deger="h3" title="Başlık">H</button>
      <button type="button" data-action="komut" data-komut="formatBlock" data-deger="blockquote" title="Alıntı">“</button>
      <button type="button" data-action="komut" data-komut="createLink" title="Bağlantı ekle">↗</button>
    </div>
    <div id="f-bilgi" class="rich-editor" contenteditable="true" data-placeholder="Metni buraya yazın…"></div>
  </div></div>`;

function adminFormuKur() {
  const el = $("#admin-form");
  if (!el) return;
  durum.admin.duzenleId = null;
  const devirSecenek = DEVIRLER.map((d) => `<option value="${esc(d)}">${esc(d)}</option>`).join("");
  if (durum.admin.sekme === "zat") {
    el.innerHTML = `<div class="admin-form">
      <h3 id="f-baslik">Yeni şahsiyet</h3>
      <div id="f-mesaj"></div>
      <div class="form-field"><label for="f-isim">İsim</label><input id="f-isim" type="text" autocomplete="off"></div>
      <div class="check-satir"><input type="checkbox" id="f-ra" checked><label for="f-ra">İsmin sonuna (ra) ekle</label></div>
      <div class="form-field"><label for="f-devir">Yaşadığı devir</label><select id="f-devir">${devirSecenek}</select></div>
      <div class="form-row">
        <div class="form-field"><label for="f-anne">Anne</label><input id="f-anne" type="text"></div>
        <div class="form-field"><label for="f-baba">Baba</label><input id="f-baba" type="text"></div>
      </div>
      <div class="form-field"><label for="f-es">Eşi / Eşleri</label><input id="f-es" type="text"><p class="form-hint">Birden fazla ise virgülle ayırın.</p></div>
      <div class="form-field"><label for="f-baglar">Diğer bağlar</label><input id="f-baglar" type="text" placeholder="Ali (Çocuk), Fatıma (Kardeş)">
        <p class="form-hint">Biçim: İsim (Tür), İsim (Tür). Türler: Çocuk, Kardeş, Dede, Nine, Torun, Amca, Hala, Dayı, Teyze, Yeğen.</p></div>
      <div class="form-row">
        <div class="form-field"><label for="f-d-hicri">Doğum (Hicri)</label><input id="f-d-hicri" type="text"></div>
        <div class="form-field"><label for="f-d-miladi">Doğum (Miladi)</label><input id="f-d-miladi" type="text"></div>
      </div>
      <div class="form-row">
        <div class="form-field"><label for="f-v-hicri">Vefat (Hicri)</label><input id="f-v-hicri" type="text"></div>
        <div class="form-field"><label for="f-v-miladi">Vefat (Miladi)</label><input id="f-v-miladi" type="text"></div>
      </div>
      ${EDITOR_HTML}
      <div class="form-field"><label for="f-kaynak">Kaynak / sayfa no</label><input id="f-kaynak" type="text"></div>
      <div class="form-actions">
        <button type="button" class="button primary" data-action="admin-kaydet">Kaydet</button>
        <button type="button" class="button" data-action="admin-iptal">Temizle</button>
      </div>
    </div>`;
  } else {
    el.innerHTML = `<div class="admin-form">
      <h3 id="f-baslik">Yeni olay</h3>
      <div id="f-mesaj"></div>
      <div class="form-field"><label for="f-ad">Olay başlığı</label><input id="f-ad" type="text" autocomplete="off"></div>
      <div class="form-field"><label for="f-devir">Dönem</label><select id="f-devir">${devirSecenek}</select></div>
      <div class="form-row">
        <div class="form-field"><label for="f-hicri">Hicri</label><input id="f-hicri" type="text" placeholder="H. 2"></div>
        <div class="form-field"><label for="f-miladi">Miladi</label><input id="f-miladi" type="text" placeholder="624"></div>
      </div>
      ${EDITOR_HTML}
      <div class="form-field"><label for="f-kaynak">Kaynak / sayfa no</label><input id="f-kaynak" type="text"></div>
      <div class="form-actions">
        <button type="button" class="button primary" data-action="admin-kaydet">Kaydet</button>
        <button type="button" class="button" data-action="admin-iptal">Temizle</button>
      </div>
    </div>`;
  }
}

function formMesaj(metin, hata) {
  const el = $("#f-mesaj");
  if (el) el.innerHTML = metin ? `<p class="${hata ? "form-error" : "form-ok"}">${esc(metin)}</p>` : "";
}

function adminFormuDoldur(k) {
  const zat = durum.admin.sekme === "zat";
  const set = (id, v) => { const e = $("#" + id); if (e) e.value = bos(v) ? "" : v; };
  durum.admin.duzenleId = k.id;
  if (zat) {
    set("f-isim", k.isim); set("f-anne", k.anne); set("f-baba", k.baba); set("f-es", k.es); set("f-baglar", k.baglar);
    set("f-d-hicri", k.d_hicri); set("f-d-miladi", k.d_miladi); set("f-v-hicri", k.v_hicri); set("f-v-miladi", k.v_miladi);
    const ra = $("#f-ra"); if (ra) ra.checked = /\((r\.?\s?a|r\.?\s?anh)/i.test(k.isim || "");
  } else {
    set("f-ad", k.ad); set("f-hicri", k.hicri); set("f-miladi", k.miladi);
  }
  set("f-devir", devirOf(k)); set("f-kaynak", k.kaynak);
  const ed = $("#f-bilgi"); if (ed) ed.innerHTML = bos(k.bilgi) ? "" : temizHtml(k.bilgi);
  const b = $("#f-baslik"); if (b) b.textContent = zat ? "Şahsiyeti düzenle" : "Olayı düzenle";
  formMesaj("", false);
  const f = $("#admin-form"); if (f && f.scrollIntoView) f.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function adminKaydet() {
  if (!adminMi()) return formMesaj("Bu işlem için yönetici hesabıyla giriş yapmalısınız.", true);
  const zat = durum.admin.sekme === "zat";
  const id = durum.admin.duzenleId;
  const v = (i) => { const e = $("#" + i); return e ? e.value.trim() : ""; };
  const q = (x) => (x === "" || x == null ? "?" : x);
  const editor = $("#f-bilgi");
  const bilgi = editor && duzMetin(editor.innerHTML) ? temizHtml(editor.innerHTML) : "";

  try {
    if (zat) {
      let ad = baslikBuyut(v("f-isim"));
      if (!ad) return formMesaj("İsim alanı boş bırakılamaz.", true);
      const ra = $("#f-ra");
      if (ra && ra.checked) {
        const kucuk = trKucuk(ad);
        if (!kucuk.includes("(ra)") && !kucuk.includes("(r.a.)") && !kucuk.includes("(r.a)")) ad += " (ra)";
      }
      const obj = {
        isim: ad, devir: v("f-devir"),
        anne: q(baslikBuyut(v("f-anne"))), baba: q(baslikBuyut(v("f-baba"))), es: q(baslikBuyut(v("f-es"))),
        baglar: q(v("f-baglar")),
        d_hicri: q(v("f-d-hicri")), d_miladi: q(v("f-d-miladi")), v_hicri: q(v("f-v-hicri")), v_miladi: q(v("f-v-miladi")),
        bilgi, kaynak: q(v("f-kaynak")), guncellemeTarihi: Date.now(),
      };
      if (id) await FS.updateDoc(FS.doc(db, "zatlar", id), obj); else await FS.addDoc(FS.collection(db, "zatlar"), obj);
    } else {
      const ad = baslikBuyut(v("f-ad"));
      if (!ad) return formMesaj("Olay başlığı boş bırakılamaz.", true);
      const obj = {
        ad, devir: v("f-devir"), hicri: q(v("f-hicri")), miladi: q(v("f-miladi")),
        bilgi, kaynak: q(v("f-kaynak")), eklenmeTarihi: Date.now(), guncellemeTarihi: Date.now(),
      };
      if (id) {
        const mevcut = durum.olaylar.find((o) => o.id === id);
        if (mevcut && mevcut.eklenmeTarihi) obj.eklenmeTarihi = mevcut.eklenmeTarihi;
        await FS.updateDoc(FS.doc(db, "olaylar", id), obj);
      } else await FS.addDoc(FS.collection(db, "olaylar"), obj);
    }
    adminFormuKur();
    formMesaj(id ? "Kayıt güncellendi." : "Kayıt eklendi.", false);
  } catch (e) {
    console.error("kaydetme hatası:", e);
    formMesaj("Kaydedilemedi: " + (e && e.message ? e.message : e) + " (Firestore yazma izinlerini kontrol edin.)", true);
  }
}

async function adminSil(id) {
  if (!adminMi()) return;
  if (!confirm("Bu kayıt kalıcı olarak silinsin mi?")) return;
  const kol = durum.admin.sekme === "zat" ? "zatlar" : "olaylar";
  try {
    await FS.deleteDoc(FS.doc(db, kol, id));
    if (durum.admin.duzenleId === id) adminFormuKur();
  } catch (e) {
    console.error("silme hatası:", e);
    formMesaj("Silinemedi: " + (e && e.message ? e.message : e), true);
  }
}

/* ---------- HESABIM (favoriler + notlar) ---------- */
function sayfaHesap() {
  const u = durum.kullanici;
  if (!u) {
    return `<section class="split">
      ${gorselYari({ f: "dome", alt: "Cami kubbesinin iç mimarisi", sticky: true, icerik: `<p class="eyebrow">Hesap</p><h1>Hesabım</h1>` })}
      <div class="half content" style="align-items:flex-start"><div class="login-panel">
        <h2>Giriş gerekli</h2>
        <p>Favorilerinizi ve notlarınızı görmek için giriş yapın.</p>
        <a class="button primary" href="#login">Giriş yap</a>
      </div></div>
    </section>`;
  }
  const yuk = durum.yuklendi.zat && durum.yuklendi.olay;
  const favler = Object.values(durum.favoriler).sort((a, b) => (b.eklenmeTarihi || 0) - (a.eklenmeTarihi || 0));
  const notlar = Object.values(durum.notlar).filter((n) => n.metin && n.metin.trim())
    .sort((a, b) => (b.guncellemeTarihi || 0) - (a.guncellemeTarihi || 0));
  const turAdi = (t) => (t === "zat" ? "Şahsiyet" : "Olay");

  const favSatir = (f) => {
    const k = kayitBul(f.tip, f.itemId);
    const ad = kayitAdi(f.tip, k) || f.ad || "İsimsiz kayıt";
    const var_ = !!k || !yuk;
    const ic = `<div class="record-head"><h3>${esc(ad)}</h3><span class="era">${turAdi(f.tip)}</span></div>${var_ ? "" : "<small>Bu kayıt arşivden kaldırılmış.</small>"}`;
    return `<article class="record fav-satir">
      ${var_ ? `<a href="#archive/${f.tip}-${esc(f.itemId)}">${ic}</a>` : `<div>${ic}</div>`}
      <button type="button" class="btn-small btn-danger" data-action="fav" data-tip="${f.tip}" data-id="${esc(f.itemId)}">Kaldır</button>
    </article>`;
  };
  const notSatir = (n) => {
    const k = kayitBul(n.tip, n.itemId);
    const ad = kayitAdi(n.tip, k) || n.ad || "İsimsiz kayıt";
    return `<article class="record">
      <div class="record-head"><h3>${esc(ad)}</h3><span class="era">${turAdi(n.tip)}</span></div>
      <p class="not-metin">${esc(n.metin)}</p>
      <div class="hesap-araclar">
        ${k || !yuk ? `<a class="btn-small" href="#archive/${n.tip}-${esc(n.itemId)}">Kayıtta düzenle</a>` : ""}
        <button type="button" class="btn-small btn-danger" data-action="not-sil" data-tip="${n.tip}" data-id="${esc(n.itemId)}">Notu sil</button>
      </div>
    </article>`;
  };

  return `<section class="split">
    ${gorselYari({ f: "dome", alt: "Cami kubbesinin iç mimarisi", sticky: true, icerik: `
      <p class="eyebrow">Hesap</p>
      <h1>Hesabım</h1>
      <p class="visual-copy">${esc(u.displayName || u.email || "")}</p>` })}
    <div class="half content ark-icerik">
      ${durum.kisiselHata ? `<div class="error">Favori ve notlar okunamadı: ${esc(durum.kisiselHata)}<br>Firestore kurallarında "favoriler" ve "notlar" koleksiyonlarına giriş yapmış kullanıcı için izin verildiğinden emin olun.</div>` : ""}
      <h3 class="hesap-bolum">Favorilerim (${favler.length})</h3>
      ${favler.length ? `<div class="record-list">${favler.map(favSatir).join("")}</div>` : `<div class="empty">Henüz favori eklemediniz. Arşivde bir kaydı açıp “Favorilere ekle”ye basın.</div>`}
      <h3 class="hesap-bolum">Notlarım (${notlar.length})</h3>
      ${notlar.length ? `<div class="record-list">${notlar.map(notSatir).join("")}</div>` : `<div class="empty">Henüz not almadınız. Arşivde bir kaydı açıp “Kişisel notum” alanına yazabilirsiniz.</div>`}
      <div class="hesap-araclar" style="margin-top:2rem">
        ${adminMi() ? `<a class="button" href="#admin">Yönetim paneli</a>` : ""}
        <button type="button" class="button" data-action="cikis">Çıkış yap</button>
      </div>
    </div>
  </section>`;
}

/* ---------- Kimlik doğrulama işlemleri ---------- */
function girisMesaji(m, ok) {
  const e = $("#giris-mesaj");
  if (e) { e.textContent = m || ""; e.classList.toggle("ok", !!ok); }
}
function hataMetni(err) {
  const kod = (err && err.code) || "";
  const alan = (typeof location !== "undefined" && location.hostname) || "bu adres";
  switch (kod) {
    case "auth/invalid-credential": case "auth/wrong-password": case "auth/user-not-found": case "auth/invalid-login-credentials":
      return "E-posta veya şifre hatalı.";
    case "auth/email-already-in-use": return "Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin.";
    case "auth/weak-password": return "Şifre en az 6 karakter olmalı.";
    case "auth/invalid-email": return "Geçerli bir e-posta adresi girin.";
    case "auth/too-many-requests": return "Çok fazla deneme yapıldı. Biraz bekleyip tekrar deneyin.";
    case "auth/network-request-failed": return "Bağlantı hatası. İnternetinizi kontrol edin.";
    case "auth/unauthorized-domain":
      return `Bu site adresi ("${alan}") Firebase'te yetkili alan adları arasında değil. Firebase Console → Authentication → Settings → Authorized domains bölümüne "${alan}" ekleyin. (${kod})`;
    case "auth/operation-not-allowed":
      return `Google ile giriş Firebase'te etkin değil. Firebase Console → Authentication → Sign-in method bölümünde Google'ı etkinleştirin. (${kod})`;
    case "auth/popup-blocked":
      return "Tarayıcı Google penceresini engelledi. Adres çubuğundaki engel simgesinden bu site için açılır pencerelere izin verip tekrar deneyin.";
    case "auth/popup-closed-by-user":
      return "Giriş penceresi kapatıldı. Tekrar deneyebilirsiniz.";
    case "auth/cancelled-popup-request": return "";
    case "auth/operation-not-supported-in-this-environment": case "auth/web-storage-unsupported":
      return `Bu ortamda Google girişi çalışmıyor (dosyadan açılmış sayfa, uygulama içi tarayıcı veya çerezleri kapalı tarayıcı olabilir). Siteyi Chrome ya da Safari'de https adresinden açın. (${kod})`;
    case "auth/internal-error": case "auth/invalid-api-key": case "auth/app-not-authorized":
      return `Firebase yapılandırma hatası. (${kod})`;
    default:
      return ((err && err.message) || "Bir hata oluştu.") + (kod ? ` (${kod})` : "");
  }
}
function girisAlanlari() {
  const e = $("#giris-eposta"), s = $("#giris-sifre");
  return { eposta: e ? e.value.trim() : "", sifre: s ? s.value : "" };
}
async function girisYap() {
  if (!AU) return girisMesaji("Kimlik doğrulama servisi yüklenemedi. Sayfayı yenileyin.");
  const { eposta, sifre } = girisAlanlari();
  if (!eposta || !sifre) return girisMesaji("E-posta ve şifre gerekli.");
  girisMesaji("Giriş yapılıyor…", true);
  durum.girisIstendi = true;
  try { await AU.signInWithEmailAndPassword(auth, eposta, sifre); }
  catch (err) { durum.girisIstendi = false; console.error("Giriş hatası:", err && err.code, err); girisMesaji(hataMetni(err)); }
}
async function kayitOl() {
  if (!AU) return girisMesaji("Kimlik doğrulama servisi yüklenemedi. Sayfayı yenileyin.");
  const { eposta, sifre } = girisAlanlari();
  if (!eposta || !sifre) return girisMesaji("E-posta ve şifre gerekli.");
  if (sifre.length < 6) return girisMesaji("Şifre en az 6 karakter olmalı.");
  girisMesaji("Hesap oluşturuluyor…", true);
  durum.girisIstendi = true;
  try { await AU.createUserWithEmailAndPassword(auth, eposta, sifre); }
  catch (err) { durum.girisIstendi = false; girisMesaji(hataMetni(err)); }
}
async function googleGiris() {
  if (typeof location !== "undefined" && location.protocol === "file:")
    return girisMesaji("Google girişi dosyadan açılan sayfada çalışmaz. Siteyi https adresinden açın.");
  if (!AU) return girisMesaji("Kimlik doğrulama servisi yüklenemedi. Sayfayı yenileyin.");
  girisMesaji("Google penceresi açılıyor…", true);
  durum.girisIstendi = true;
  try {
    const saglayici = new AU.GoogleAuthProvider();
    saglayici.setCustomParameters({ prompt: "select_account" });
    await AU.signInWithPopup(auth, saglayici);
  } catch (err) {
    durum.girisIstendi = false;
    console.error("Google giriş hatası:", err && err.code, err);
    girisMesaji(hataMetni(err));
  }
}
async function cikisYap() {
  try { if (AU) await AU.signOut(auth); } catch (e) { console.error(e); }
  if (rota.sec === "admin" || rota.sec === "account") location.hash = "#home";
}

/* ---------- Favoriler ve kişisel notlar (yorum özelliği bilerek yok) ---------- */
function kisiselDurum(key, metin, hata) {
  const el = document.querySelector('.not-durum[data-anahtar="' + String(key).replace(/"/g, "") + '"]');
  if (!el) { if (hata) alert(metin); return; }
  el.textContent = metin;
  el.classList.toggle("hata", !!hata);
  if (!hata) setTimeout(() => { if (el.textContent === metin) el.textContent = ""; }, 2200);
}
const hataYazi = (e) => (e && e.code === "permission-denied")
  ? "İzin verilmedi. Firestore kurallarında bu koleksiyon için giriş yapmış kullanıcıya izin verin."
  : ((e && e.message) || String(e));

async function favToggle(tip, id) {
  if (!durum.kullanici) { location.hash = "#login"; return; }
  const key = favAnahtar(tip, id);
  const mevcut = durum.favoriler[key];
  try {
    if (mevcut) {
      await Promise.all(mevcut.docIds.map((d) => FS.deleteDoc(FS.doc(db, "favoriler", d))));
    } else {
      await FS.addDoc(FS.collection(db, "favoriler"), {
        uid: durum.kullanici.uid, tip, itemId: id, ad: kayitAdi(tip, kayitBul(tip, id)), eklenmeTarihi: Date.now(),
      });
    }
  } catch (e) {
    console.error("favori hatası:", e);
    kisiselDurum(key, "Favori güncellenemedi: " + hataYazi(e), true);
  }
}

async function notKaydet(tip, id) {
  if (!durum.kullanici) return;
  const key = favAnahtar(tip, id);
  const alan = document.getElementById("not-" + key);
  if (!alan) return;
  const metin = alan.value;
  const mevcut = durum.notlar[key];
  const docId = mevcut ? mevcut.docId : durum.kullanici.uid + "_" + tip + "_" + id;
  const ad = kayitAdi(tip, kayitBul(tip, id));
  try {
    if (!metin.trim()) {
      if (mevcut) await FS.deleteDoc(FS.doc(db, "notlar", docId));
      delete durum.notlar[key]; delete durum.notTaslak[key]; alan.value = "";
      kisiselDurum(key, "Not silindi.");
    } else {
      const zaman = Date.now();
      await FS.setDoc(FS.doc(db, "notlar", docId), { uid: durum.kullanici.uid, tip, itemId: id, ad, metin, guncellemeTarihi: zaman });
      durum.notlar[key] = { docId, ad, tip, itemId: id, metin, guncellemeTarihi: zaman };
      delete durum.notTaslak[key];
      kisiselDurum(key, "Kaydedildi ✓");
    }
  } catch (e) {
    console.error("not hatası:", e);
    kisiselDurum(key, "Not kaydedilemedi: " + hataYazi(e), true);
  }
}

async function notSil(tip, id) {
  const key = favAnahtar(tip, id);
  const mevcut = durum.notlar[key];
  if (!durum.kullanici || !mevcut) return;
  if (!confirm("Bu not silinsin mi?")) return;
  try { await FS.deleteDoc(FS.doc(db, "notlar", mevcut.docId)); }
  catch (e) { console.error("not silme hatası:", e); alert("Not silinemedi: " + hataYazi(e)); }
}

/* Giriş yapan kullanıcının favori ve notlarını dinle (yalnızca kendi kayıtları) */
function kullaniciVerisiniBagla(user) {
  durum.kullaniciDinleyici.forEach((f) => { try { f(); } catch (e) { /* önemsiz */ } });
  durum.kullaniciDinleyici = [];
  durum.favoriler = {}; durum.notlar = {}; durum.notTaslak = {}; durum.kisiselHata = null;
  if (!user || !FS) return;
  const sorgu = (kol) => FS.query(FS.collection(db, kol), FS.where("uid", "==", user.uid));
  const hata = (kol) => (err) => {
    console.error(kol + " dinleme hatası:", err);
    durum.kisiselHata = hataYazi(err);
    planla();
  };
  durum.kullaniciDinleyici.push(FS.onSnapshot(sorgu("favoriler"), (snap) => {
    const m = {};
    snap.docs.forEach((d) => {
      const v = d.data(), key = favAnahtar(v.tip, v.itemId);
      if (!m[key]) m[key] = { docIds: [], ad: v.ad, tip: v.tip, itemId: v.itemId, eklenmeTarihi: v.eklenmeTarihi };
      m[key].docIds.push(d.id);
    });
    durum.favoriler = m; durum.kisiselHata = null;
    planla();
  }, hata("favoriler")));
  durum.kullaniciDinleyici.push(FS.onSnapshot(sorgu("notlar"), (snap) => {
    const m = {};
    snap.docs.forEach((d) => {
      const v = d.data();
      m[favAnahtar(v.tip, v.itemId)] = { docId: d.id, ad: v.ad, tip: v.tip, itemId: v.itemId, metin: v.metin, guncellemeTarihi: v.guncellemeTarihi };
    });
    durum.notlar = m;
    if (rota.sec === "account") planla(); /* arşivde yazarken sayfayı yenileme */
  }, hata("notlar")));
}

/* ---------- İletişim formu ---------- */
async function iletisimGonder() {
  const g = (i) => { const e = $("#" + i); return e ? e.value.trim() : ""; };
  const d = $("#iletisim-durum");
  const yaz = (m, ok) => { if (d) { d.textContent = m; d.classList.toggle("ok", !!ok); } };
  const isim = g("ilt-isim"), email = g("ilt-eposta"), konu = g("ilt-konu"), mesaj = g("ilt-mesaj");
  if (!isim || !email || !mesaj) return yaz("Ad, e-posta ve mesaj alanları gerekli.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return yaz("Geçerli bir e-posta adresi girin.");
  yaz("Gönderiliyor…", true);
  try {
    const r = await fetch(FORMSPREE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ isim, email, konu, mesaj }),
    });
    if (r.ok) {
      yaz("Mesajınız iletildi. Teşekkür ederiz.", true);
      ["ilt-isim", "ilt-eposta", "ilt-konu", "ilt-mesaj"].forEach((i) => { const e = $("#" + i); if (e) e.value = ""; });
    } else yaz("Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.");
  } catch (e) { yaz("Bağlantı hatası. Lütfen daha sonra tekrar deneyin."); }
}

/* ---------- Yönlendirme (hash tabanlı) ---------- */
let rota = { sec: "home", param: "" };
const SAYFALAR = {
  home: sayfaHome, archive: sayfaArsiv, timeline: sayfaCizelge, genealogy: sayfaSoy,
  random: sayfaRastgele, articles: sayfaMakaleler, faq: sayfaSss, login: sayfaGiris, admin: sayfaAdmin, account: sayfaHesap,
};
const BASLIKLAR = {
  home: "Ana Sayfa", archive: "Arşiv", timeline: "Zaman Çizelgesi", genealogy: "Soy Ağacı",
  random: "Rastgele Şahsiyet", articles: "Makaleler", faq: "Sıkça Sorulan Sorular", login: "Giriş", admin: "Yönetici Paneli", account: "Hesabım",
};

function rotaOku() {
  const h = (location.hash || "").replace(/^#\/?/, "");
  const i = h.indexOf("/");
  const sec = i < 0 ? h : h.slice(0, i);
  let param = i < 0 ? "" : h.slice(i + 1);
  try { param = decodeURIComponent(param); } catch (e) { /* olduğu gibi kalsın */ }
  return { sec: SAYFALAR[sec] ? sec : "home", param };
}

function rotaHazirla(eski) {
  if (rota.sec === "random" && eski.sec !== "random") durum.rastgeleId = null;
  if (rota.sec === "archive") {
    if (rota.param) {
      durum.arama = ""; durum.devir = "tumu"; durum.tur = "tumu"; durum.limit = 100000;
      durum.acik.add(rota.param); durum.kaydirHedef = rota.param;
    } else if (eski.sec !== "archive") durum.limit = 50;
  }
}

function navGuncelle() {
  const giris = $("#login-nav-link");
  if (giris) {
    giris.textContent = durum.kullanici ? "Hesabım" : "Giriş";
    giris.setAttribute("href", durum.kullanici ? "#account" : "#login");
    giris.dataset.section = durum.kullanici ? "account" : "login";
  }
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const aktif = a.dataset.section === rota.sec;
    a.classList.toggle("active", aktif);
    if (aktif) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  const panel = $("#admin-nav-link");
  if (panel) panel.style.display = adminMi() ? "" : "none";
}

function render(secenek) {
  const scroll = !secenek || secenek.scroll !== false;
  const app = document.getElementById("app");
  if (!app) return;
  const { sec, param } = rota;
  app.innerHTML = SAYFALAR[sec](param);
  if (scroll) window.scrollTo(0, 0);
  if (sec === "archive") arsivGuncelle();
  if (sec === "admin" && adminMi()) { adminListeGuncelle(); adminFormuKur(); }
  navGuncelle();
  document.title = `${BASLIKLAR[sec]} | Asr-ı Saadet Portalı`;
}

/* Veri değişince: yazı yazılan sayfalarda sadece ilgili bölümü güncelle */
function veriGuncelle() {
  navGuncelle();
  switch (rota.sec) {
    case "archive": arsivGuncelle(); break;
    case "admin": if (adminMi()) adminListeGuncelle(); break;
    case "faq": case "login": case "articles": break;
    default: render({ scroll: false });
  }
}
let planli = null;
function planla() {
  if (planli) return;
  planli = setTimeout(() => { planli = null; veriGuncelle(); }, 30);
}

function authDegisti(user) {
  durum.kullanici = user;
  kullaniciVerisiniBagla(user);
  navGuncelle();
  if (user && durum.girisIstendi && rota.sec === "login") {
    durum.girisIstendi = false;
    location.hash = adminMi() ? "#admin" : "#account";
    return;
  }
  durum.girisIstendi = false;
  if (["login", "admin", "account", "random"].includes(rota.sec)) render({ scroll: false });
  else if (rota.sec === "archive") arsivGuncelle();
}

/* ---------- Olaylar (tek yerden, olay delegasyonu) ---------- */
const islem = {
  kayit(el) {
    const a = el.dataset.anahtar;
    if (durum.acik.has(a)) durum.acik.delete(a); else durum.acik.add(a);
    arsivGuncelle();
  },
  tur(el) { durum.tur = el.dataset.deger; durum.limit = 50; arsivGuncelle(); },
  devir(el) { durum.devir = el.dataset.deger; durum.limit = 50; arsivGuncelle(); },
  etiket(el) {
    durum.arama = el.dataset.deger; durum.limit = 50;
    const i = $("#arama"); if (i) i.value = durum.arama;
    arsivGuncelle();
  },
  daha() { durum.limit += 50; arsivGuncelle(); },
  faq(el) {
    const i = Number(el.dataset.i);
    durum.faqAcik = durum.faqAcik === i ? null : i;
    const a = $("#faq-alan"); if (a) a.innerHTML = faqListe();
  },
  makale(el) {
    const i = Number(el.dataset.i);
    if (durum.makaleAcik.has(i)) durum.makaleAcik.delete(i); else durum.makaleAcik.add(i);
    render({ scroll: false });
  },
  rastgele() { durum.rastgeleId = null; render({ scroll: false }); },
  "login-mod"(el) { durum.loginMod = el.dataset.mod; render({ scroll: false }); },
  giris: girisYap,
  "kayit-ol": kayitOl,
  google: googleGiris,
  cikis: cikisYap,
  iletisim: iletisimGonder,
  fav(el) { favToggle(el.dataset.tip, el.dataset.id); },
  "not-kaydet"(el) { notKaydet(el.dataset.tip, el.dataset.id); },
  "not-sil"(el) { notSil(el.dataset.tip, el.dataset.id); },
  "admin-sekme"(el) { durum.admin.sekme = el.dataset.sekme; adminListeGuncelle(); adminFormuKur(); },
  "admin-duzenle"(el) {
    const liste = durum.admin.sekme === "zat" ? durum.zatlar : durum.olaylar;
    const k = liste.find((x) => x.id === el.dataset.id);
    if (k) adminFormuDoldur(k);
  },
  "admin-sil"(el) { adminSil(el.dataset.id); },
  "admin-kaydet": adminKaydet,
  "admin-iptal"() { adminFormuKur(); },
  komut(el) {
    const ed = $("#f-bilgi");
    if (!ed) return;
    ed.focus();
    const k = el.dataset.komut;
    if (k === "createLink") {
      const url = prompt("Bağlantı adresi (https://…)");
      if (url && /^(https?:\/\/|mailto:)/i.test(url.trim())) document.execCommand("createLink", false, url.trim());
    } else if (k === "formatBlock") document.execCommand("formatBlock", false, el.dataset.deger);
    else document.execCommand(k, false, null);
  },
};

function olayBagla() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest ? e.target.closest("[data-action]") : null;
    if (!el) return;
    const f = islem[el.dataset.action];
    if (f) f(el, e);
  });
  document.addEventListener("keydown", (e) => {
    const hedef = e.target;
    if ((e.key === "Enter" || e.key === " ") && hedef.matches && hedef.matches('[role="button"][data-action]')) {
      e.preventDefault(); hedef.click(); return;
    }
    if (e.key === "Enter" && hedef.id && (hedef.id === "giris-eposta" || hedef.id === "giris-sifre")) {
      e.preventDefault();
      if (durum.loginMod === "kayit") kayitOl(); else girisYap();
    }
  });
  document.addEventListener("mousedown", (e) => {
    if (e.target.closest && e.target.closest(".editor-toolbar button")) e.preventDefault(); /* seçim kaybolmasın */
  });
  document.addEventListener("input", (e) => {
    if (e.target.classList && e.target.classList.contains("not-alani")) durum.notTaslak[e.target.dataset.anahtar] = e.target.value;
    if (e.target.id === "arama") { durum.arama = e.target.value; durum.limit = 50; arsivGuncelle(); }
  });
  document.addEventListener("change", (e) => {
    if (e.target.id === "soy-sec") location.hash = e.target.value ? "#genealogy/" + encodeURIComponent(e.target.value) : "#genealogy";
  });
  window.addEventListener("hashchange", () => {
    const eski = rota;
    rota = rotaOku();
    rotaHazirla(eski);
    render();
  });
}

/* ---------- Veri dinleme ve başlatma ---------- */
function dinle(koleksiyon, tur) {
  FS.onSnapshot(FS.collection(db, koleksiyon), (snap) => {
    const liste = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    liste.forEach((k) => { k._ara = trKucuk((k.isim || k.ad || "") + " " + duzMetin(k.bilgi)); });
    liste.sort(adSirala);
    if (tur === "zat") durum.zatlar = liste; else durum.olaylar = liste;
    durum.yuklendi[tur] = true;
    planla();
  }, (err) => {
    console.error(koleksiyon + " dinleme hatası:", err);
    durum.hata = (err && err.message) || String(err);
    durum.yuklendi[tur] = true;
    planla();
  });
}

async function baslat() {
  ekStilEkle();
  rota = rotaOku();
  rotaHazirla({ sec: "" });
  render();
  olayBagla();
  try {
    const [appM, fsM, auM] = await Promise.all([yukle(FB("firebase-app")), yukle(FB("firebase-firestore")), yukle(FB("firebase-auth"))]);
    FS = fsM; AU = auM;
    const uygulama = appM.initializeApp(firebaseConfig);
    db = FS.getFirestore(uygulama);
    auth = AU.getAuth(uygulama);
  } catch (e) {
    console.error("Firebase yüklenemedi:", e);
    durum.hata = "Firebase yüklenemedi (" + ((e && e.message) || e) + ")";
    durum.yuklendi.zat = durum.yuklendi.olay = true;
    veriGuncelle();
    return;
  }
  AU.onAuthStateChanged(auth, authDegisti);
  dinle("zatlar", "zat");
  dinle("olaylar", "olay");
}

baslat();

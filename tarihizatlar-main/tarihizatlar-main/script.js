function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function bilgiyiGoster(ham) {
    if (!ham || !ham.trim() || ham.trim() === "?") return t('no_content');
    return /<[a-z][\s\S]*>/i.test(ham) ? ham : escapeHtml(ham).replace(/\n/g, '<br><br>');
}

function duzMetneCevir(ham) {
    if (!ham) return "";
    return ham.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function metniEditoreYukle(elId, ham) {
    const el = document.getElementById(elId);
    if (!el) return;
    const deger = ham || "";
    el.innerHTML = /<[a-z][\s\S]*>/i.test(deger) ? deger : escapeHtml(deger).replace(/\n/g, '<br>');
}

const I18N = {
    tr: {
        page_title: "Asr-ı Saadet Portalı | Sahabeler, Siyer ve İslam Tarihi",
        tagline: "İslam tarihi ve Ashab-ı Kiram arşivi.",
        nav_home: "Ana Sayfa", nav_archive: "Arşiv & Olaylar", nav_timeline: "Çizelge", nav_tree: "Soyağacı", nav_random: "Rastgele Şahsiyet", nav_panel: "Panel",
        ph_global_search: "Portalda Ara...", ph_archive_search: "İsim veya içerik...",
        quote_text: "\"Ashabım, yıldızlar gibidir. Hangisine tabi olursanız hidayete erersiniz.\"",
        quote_attr: "- Peygamber Efendimiz (s.a.v.)",
        stat_person: "Şahsiyet", stat_event: "Olay", stat_link: "Bağlantı",
        btn_explore: "Tüm Arşivi Keşfet ➔", h_featured_persons: "Öne Çıkan Şahsiyetler", h_latest_events: "Son Eklenen Tarihi Olaylar", h_core_readings: "Temel Okumalar",
        h_mini_timeline: "Mini Zaman Çizelgesi", btn_full_timeline: "Tüm Çizelgeyi Gör",
        cat_itikad: "İtikat", cat_ilim: "İlim", cat_siyer: "Siyer", read_more: "Devamını Oku ➔",
        art1_title: "Ashab-ı Kiram'ın İzinde", art1_teaser: "İslam’ın kuvvetli olduğu zamanlarda doğduk. Kuran-ı Kerim'i bize öğretenler oldu. Maalesef ki yeni nesil elimizden kayıp gidiyor...",
        art2_title: "Neden Bu İlimleri Öğreniyoruz?", art2_teaser: "İslam dini, okuyup ilim sahibi olmaya çok önem vermiştir. Hatta Peygamber Efendimize indirilen ilk ayeti kerime “Oku” emri ile başlar...",
        art3_title: "Rasulullah Sevgisi ve Kur'an Eğitimi", art3_teaser: "Resulullah efendimiz bir hadisi şeriflerinde şöyle buyuruyor; \"Evlatlarınızı üç haslet üzerine edeplendiriniz...\"",
        guide_title: "Arşiv Rehberi", guide_p1: "Asr-ı Saadet döneminden Endülüs'e uzanan bilgi bankasına hoş geldiniz.",
        guide_p2: "Geniş orta alanda tarihi detayları okuyabilir, sağ paneldeki filtrelerle zaman yolculuğunuzu daraltabilirsiniz.",
        search_archive_title: "Arşivde Ara", type_filter: "Tür Filtresi", era_filter: "Devir Filtresi",
        filter_all: "Tümü (Karışık)", filter_persons: "Tarihi Şahsiyetler", filter_events: "Önemli Olaylar",
        era_all: "Tüm Devirler", era_asri: "Asr-ı Saadet", era_rashidun: "Hulefâ-yi Râşidîn", era_umayyad: "Emeviler Devri", era_abbasid: "Abbasiler Devri", era_andalus: "Endülüs Dönemi", era_other: "Diğer",
        era_asri_short: "Asr-ı Saadet", era_rashidun_short: "Hulefâ-yi Râşidîn", era_umayyad_short: "Emeviler", era_abbasid_short: "Abbasiler", era_andalus_short: "Endülüs", era_other_short: "Diğer",
        back_archive: "← Arşive Dön", back_home: "← Ana Sayfaya Dön",
        h_purpose: "Proje Amacı", h_faq: "Sıkça Sorulan Sorular", h_contact: "İletişim", h_contribute: "Katkıda Bulun", h_privacy: "Gizlilik Politikası",
        h_changelog: "Sürüm Notları ve Güncellemeler", h_sources: "Kaynakça ve Temel Eserler", h_login: "Yönetici Girişi", h_timeline: "Zaman Çizelgesi", h_tree: "Soyağacı Grupları",
        h_admin: "Yönetici Kontrol Merkezi", btn_view_site: "Siteyi Gör", btn_logout: "Çıkış Yap",
        contact_intro: "Sorularınız, önerileriniz veya katkıda bulunmak istediğiniz konular için aşağıdaki formu kullanarak bize ulaşabilirsiniz.",
        ph_name: "Adınız Soyadınız", ph_email: "E-posta Adresiniz", ph_subject: "Konu", ph_message: "Mesajınız...", btn_send: "MESAJI GÖNDER",
        sources_intro: "Portalımızda yer alan bilgilerin doğrulanmasında ve derlenmesinde temel alınan başlıca eserler aşağıda sınıflandırılmıştır.",
        src_sira: "Siyer ve Peygamber Efendimiz'in (s.a.v.) Hayatı", src_hadith: "Şemail ve Hadis Kaynakları", src_companions: "Ashâb-ı Kirâm ve İtikad",
        ph_login_email: "E-posta Adresiniz", ph_login_pass: "Şifreniz", btn_login: "Giriş Yap",
        h_event_form: "Olay Ekle / Düzenle", h_person_form: "Zat Ekle / Düzenle", h_records: "Mevcut Kayıtlar",
        btn_save: "KAYDET", btn_cancel: "İPTAL", btn_add: "Ekle", chk_ra: "İsmin sonuna (ra) ekle",
        ph_event_title: "Olay Başlığı", ph_hijri: "Hicri (Örn: H. 2)", ph_ce: "Miladi (Örn: M. 624)", ph_event_text: "Olayın metni...",
        ph_source: "Kaynak / Sayfa No (Örn: Peygamberimizin Hayatı, s. 45)", ph_name_person: "İsim", ph_mother: "Anne", ph_father: "Baba", ph_spouse: "Eşi / Eşleri",
        ph_link_name: "İsim Yaz", ph_links: "Eklenen Bağlar", ph_birth_hijri: "Doğum Hicri", ph_birth_ce: "Doğum Miladi", ph_death_hijri: "Vefat Hicri", ph_death_ce: "Vefat Miladi", ph_bio: "Bilgi",
        opt_era_asri_event: "Dönem: Asr-ı Saadet", opt_era_rashidun_event: "Dönem: Hulefâ-yi Râşidîn", opt_era_umayyad_event: "Dönem: Emeviler", opt_era_abbasid_event: "Dönem: Abbasiler", opt_era_andalus_event: "Dönem: Endülüs", opt_era_other_event: "Dönem: Diğer / Genel",
        opt_era_asri_person: "Yaşadığı Devir: Asr-ı Saadet", opt_era_rashidun_person: "Yaşadığı Devir: Hulefâ-yi Râşidîn", opt_era_umayyad_person: "Yaşadığı Devir: Emeviler", opt_era_abbasid_person: "Yaşadığı Devir: Abbasiler", opt_era_andalus_person: "Yaşadığı Devir: Endülüs", opt_era_other_person: "Yaşadığı Devir: Diğer / Bilinmiyor",
        opt_link_type: "Bağlantı Türü...", rel_child: "Çocuk", rel_sibling: "Kardeş", rel_grandfather: "Dede", rel_grandmother: "Nine", rel_grandchild: "Torun", rel_paternal_uncle: "Amca", rel_paternal_aunt: "Hala", rel_maternal_uncle: "Dayı", rel_maternal_aunt: "Teyze", rel_nephew: "Yeğen",
        foot_quick: "HIZLI ERİŞİM", foot_about: "HAKKINDA", foot_admin: "YÖNETİM", foot_archive: "Tüm Arşiv", foot_timeline: "Zaman Çizelgesi", foot_trees: "Soyağaçları", foot_sources: "Kaynakça", foot_changelog: "Sürüm Notları",
        life_info: "YAŞAM BİLGİSİ:", birth: "Doğum:", death: "Vefat:", father: "Baba", mother: "Anne", spouses: "Eş(ler)", family_ties: "Aile ve Soy Bağları",
        years_old: "Yaşında", linked_history: "Bağlantılı Tarihi Gör", hide_links: "Bağlantıları Kapat",
        intersecting: "Kesişen Şahsiyetler", related_events: "İlgili Olaylar", contemporaries: "Aynı Dönemde Yaşayanlar",
        no_intersection: "Şu an için sistemde kesişim verisi bulunamadı.",
        hist_event: "Tarihi Olay", read_article: "Makaleyi Oku", no_events: "Henüz olay bulunmuyor.", no_data: "Henüz veri bulunmuyor.",
        admin_total: "Toplam: {zat} Zat, {olay} Olay", persons: "Zatlar", events: "Olaylar", letter_of: "{h} Harfi ({n} Kayıt)",
        edit: "Düzenle", del: "Sil", type_person: "Zat", type_event: "Olay", mini_birth: "Doğum",
        unknown_father: "Soy Bilgisi Beklenenler", father_prefix: "Baba:", mother_prefix: "Anne:", spouse_prefix: "Eş:", other_ties: "Diğer Bağlar:",
        source: "Kaynak:", date_unknown: "Tarih Belirtilmemiş", no_content: "İçerik bulunamadı.",
        no_bio_random: "Henüz bilgi girilmiş şahsiyet bulunmuyor.", confirm_del: "Silinsin mi?", need_name: "Lütfen isim girin!", need_event: "Lütfen olay ismi girin!",
        similar_names: "Sistemde benzer isimler var: {list}", similar_events: "Sistemde benzer olaylar var: {list}",
        login_error: "Hata: ", theme_dark: "Koyu Mod", theme_light: "Aydınlık Mod",
        save_error: "Kayıt başarısız oldu: ", perm_error_hint: " (Bu genellikle Firebase Firestore güvenlik kurallarının yazmaya izin vermediği veya giriş yapan e-postanın ADMIN_EMAIL ile eşleşmediği anlamına gelir.)"
    },
    en: {
        page_title: "Asr-ı Saadet Portal | Companions, Sīrah and Islamic History",
        tagline: "An archive of Islamic history and the noble Companions.",
        nav_home: "Home", nav_archive: "Archive & Events", nav_timeline: "Timeline", nav_tree: "Family Tree", nav_random: "Random Figure", nav_panel: "Panel",
        ph_global_search: "Search the portal...", ph_archive_search: "Name or content...",
        quote_text: "\"My Companions are like stars; whichever of them you follow, you will be rightly guided.\"",
        quote_attr: "- The Prophet (peace be upon him)",
        stat_person: "Figure", stat_event: "Event", stat_link: "Link",
        btn_explore: "Explore the Full Archive ➔", h_featured_persons: "Featured Figures", h_latest_events: "Latest Historical Events", h_core_readings: "Core Readings",
        h_mini_timeline: "Mini Timeline", btn_full_timeline: "View Full Timeline",
        cat_itikad: "Creed", cat_ilim: "Knowledge", cat_siyer: "Sīrah", read_more: "Read More ➔",
        art1_title: "In the Footsteps of the Noble Companions", art1_teaser: "We were born in an era when Islam was strong, taught the Qur'an by those who came before us. Sadly, the new generation is slipping away from us...",
        art2_title: "Why Do We Study These Sciences?", art2_teaser: "Islam places great importance on reading and acquiring knowledge. In fact, the first verse revealed to the Prophet begins with the command \"Read\"...",
        art3_title: "Love for the Messenger and Qur'anic Education", art3_teaser: "The Messenger of Allah said in one of his noble hadiths: \"Discipline your children in three qualities...\"",
        guide_title: "Archive Guide", guide_p1: "Welcome to a knowledge bank spanning from the Age of Happiness to Andalusia.",
        guide_p2: "You can read historical details in the wide central area and narrow your journey through time using the filters on the right panel.",
        search_archive_title: "Search Archive", type_filter: "Type Filter", era_filter: "Era Filter",
        filter_all: "All (Mixed)", filter_persons: "Historical Figures", filter_events: "Notable Events",
        era_all: "All Eras", era_asri: "Age of Happiness", era_rashidun: "Rightly Guided Caliphs", era_umayyad: "Umayyad Era", era_abbasid: "Abbasid Era", era_andalus: "Andalusian Era", era_other: "Other",
        era_asri_short: "Age of Happiness", era_rashidun_short: "Rightly Guided", era_umayyad_short: "Umayyad", era_abbasid_short: "Abbasid", era_andalus_short: "Andalusia", era_other_short: "Other",
        back_archive: "← Back to Archive", back_home: "← Back to Home",
        h_purpose: "Project Purpose", h_faq: "Frequently Asked Questions", h_contact: "Contact", h_contribute: "Contribute", h_privacy: "Privacy Policy",
        h_changelog: "Release Notes & Updates", h_sources: "Bibliography & Core Works", h_login: "Administrator Login", h_timeline: "Timeline", h_tree: "Family Tree Groups",
        h_admin: "Administrator Control Center", btn_view_site: "View Site", btn_logout: "Log Out",
        contact_intro: "You can reach us using the form below for your questions, suggestions, or topics you'd like to contribute to.",
        ph_name: "Your Full Name", ph_email: "Your Email Address", ph_subject: "Subject", ph_message: "Your Message...", btn_send: "SEND MESSAGE",
        sources_intro: "The main works used as a basis for verifying and compiling the information on our portal are classified below.",
        src_sira: "Sīrah and the Life of the Prophet (peace be upon him)", src_hadith: "Shamā'il and Hadith Sources", src_companions: "The Noble Companions and Creed",
        ph_login_email: "Your Email Address", ph_login_pass: "Your Password", btn_login: "Log In",
        h_event_form: "Add / Edit Event", h_person_form: "Add / Edit Figure", h_records: "Existing Records",
        btn_save: "SAVE", btn_cancel: "CANCEL", btn_add: "Add", chk_ra: "Append (ra) to the name",
        ph_event_title: "Event Title", ph_hijri: "Hijri (e.g. H. 2)", ph_ce: "CE (e.g. CE 624)", ph_event_text: "Event text...",
        ph_source: "Source / Page No. (e.g. The Prophet's Life, p. 45)", ph_name_person: "Name", ph_mother: "Mother", ph_father: "Father", ph_spouse: "Spouse(s)",
        ph_link_name: "Enter Name", ph_links: "Added Links", ph_birth_hijri: "Birth (Hijri)", ph_birth_ce: "Birth (CE)", ph_death_hijri: "Death (Hijri)", ph_death_ce: "Death (CE)", ph_bio: "Information",
        opt_era_asri_event: "Era: Age of Happiness", opt_era_rashidun_event: "Era: Rightly Guided Caliphs", opt_era_umayyad_event: "Era: Umayyad", opt_era_abbasid_event: "Era: Abbasid", opt_era_andalus_event: "Era: Andalusia", opt_era_other_event: "Era: Other / General",
        opt_era_asri_person: "Era Lived In: Age of Happiness", opt_era_rashidun_person: "Era Lived In: Rightly Guided Caliphs", opt_era_umayyad_person: "Era Lived In: Umayyad", opt_era_abbasid_person: "Era Lived In: Abbasid", opt_era_andalus_person: "Era Lived In: Andalusia", opt_era_other_person: "Era Lived In: Other / Unknown",
        opt_link_type: "Link Type...", rel_child: "Child", rel_sibling: "Sibling", rel_grandfather: "Grandfather", rel_grandmother: "Grandmother", rel_grandchild: "Grandchild", rel_paternal_uncle: "Paternal Uncle", rel_paternal_aunt: "Paternal Aunt", rel_maternal_uncle: "Maternal Uncle", rel_maternal_aunt: "Maternal Aunt", rel_nephew: "Nephew/Niece",
        foot_quick: "QUICK ACCESS", foot_about: "ABOUT", foot_admin: "ADMIN", foot_archive: "Full Archive", foot_timeline: "Timeline", foot_trees: "Family Trees", foot_sources: "Bibliography", foot_changelog: "Release Notes",
        life_info: "LIFE INFORMATION:", birth: "Born:", death: "Died:", father: "Father", mother: "Mother", spouses: "Spouse(s)", family_ties: "Family and Lineage Ties",
        years_old: "years old", linked_history: "View Linked History", hide_links: "Hide Links",
        intersecting: "Intersecting Figures", related_events: "Related Events", contemporaries: "Contemporaries",
        no_intersection: "No intersection data found in the system at this time.",
        hist_event: "Historical Event", read_article: "Read Article", no_events: "No events yet.", no_data: "No data yet.",
        admin_total: "Total: {zat} Figures, {olay} Events", persons: "Figures", events: "Events", letter_of: "Letter {h} ({n} Records)",
        edit: "Edit", del: "Delete", type_person: "Figure", type_event: "Event", mini_birth: "Born",
        unknown_father: "Lineage Info Pending", father_prefix: "Father:", mother_prefix: "Mother:", spouse_prefix: "Spouse:", other_ties: "Other Ties:",
        source: "Source:", date_unknown: "Date Not Specified", no_content: "No content found.",
        no_bio_random: "No figure with information entered yet.", confirm_del: "Delete this?", need_name: "Please enter a name!", need_event: "Please enter an event name!",
        similar_names: "Similar names exist in the system: {list}", similar_events: "Similar events exist in the system: {list}",
        login_error: "Error: ", theme_dark: "Dark Mode", theme_light: "Light Mode",
        save_error: "Save failed: ", perm_error_hint: " (This usually means Firestore security rules are blocking the write, or the signed-in email doesn't match ADMIN_EMAIL.)"
    }
};

let aktifDil = localStorage.getItem('aktifDil') || 'tr';

function t(key, vars) {
    let s = (I18N[aktifDil] && I18N[aktifDil][key]) || I18N.tr[key] || key;
    if (vars) Object.keys(vars).forEach(k => { s = String(s).split('{' + k + '}').join(vars[k]); });
    return s;
}

function cevirDevir(d) {
    return d;
}

function uygulaDil() {
    document.title = t('page_title');
    document.documentElement.lang = aktifDil;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
    document.querySelectorAll('.lang-btn').forEach(el => { el.classList.toggle('active-lang', el.getAttribute('data-lang') === aktifDil); });
    temaButonuGuncelle();
}

function dilDegistir(lang) {
    if (!I18N[lang] || lang === aktifDil) return;
    aktifDil = lang;
    localStorage.setItem('aktifDil', lang);
    uygulaDil();
    ekranaBas();
}

let aktifTema = localStorage.getItem('aktifTema') || 'light';

function temaButonuGuncelle() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    btn.innerHTML = aktifTema === 'dark' ? '☀️' : '🌙';
    btn.title = t(aktifTema === 'dark' ? 'theme_light' : 'theme_dark');
}

function temaUygula() {
    if (aktifTema === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    temaButonuGuncelle();
}

function temaDegistir() {
    aktifTema = aktifTema === 'dark' ? 'light' : 'dark';
    localStorage.setItem('aktifTema', aktifTema);
    temaUygula();
}

const firebaseConfig = {
    apiKey: "AIzaSyCrrD1XRInE3Er47ZRl28rUo_Pk7FZAyss",
    authDomain: "tarihizatlar.firebaseapp.com",
    projectId: "tarihizatlar",
    storageBucket: "tarihizatlar.firebasestorage.app",
    messagingSenderId: "930648787998",
    appId: "1:930648787998:web:db163d0f3811786610b20f"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
// ÖNEMLİ: Aşağıdaki e-postayı kendi yönetici e-postanla değiştir. Sadece bu e-posta ile giriş yapan kişi Yönetici Panelini kullanabilir.
const ADMIN_EMAIL = "yaysen0@gmail.com";

let girisliKullanici = null;
let kullaniciFavorileri = {};
let kullaniciNotlari = {};
let favoriUnsub = null, notUnsub = null;

let veriler = [];
let olaylar = [];
let aktifFiltre = 'tumu';
let aktifDevir = 'tumu';

window.addEventListener('popstate', function(event) {
    let hashId = window.location.hash.substring(1);
    if (!hashId) hashId = 'home';
    sayfaDegistir(hashId, false);
});

window.onload = function() {
    temaUygula();
    uygulaDil();
    let baslangicSayfasi = 'home';
    if (window.location.hash) baslangicSayfasi = window.location.hash.substring(1);
    else if (localStorage.getItem('aktifSayfa')) baslangicSayfasi = localStorage.getItem('aktifSayfa');
    sayfaDegistir(baslangicSayfasi, false);

    const otoInputs = ['in_anne', 'in_baba', 'in_es', 'in_baglar_isim'];
    otoInputs.forEach(id => {
        const inp = document.getElementById(id);
        if(inp) {
            inp.addEventListener('input', () => gosterOto(inp));
            inp.addEventListener('focus', () => gosterOto(inp));
            inp.addEventListener('blur', () => setTimeout(() => {
                const kutu = document.getElementById('oto-kutu');
                if(kutu) kutu.style.display = 'none';
            }, 250));
        }
    });

    window.addEventListener('scroll', () => {
        const kutu = document.getElementById('oto-kutu');
        if(kutu) kutu.style.display = 'none';
        const aKutu = document.getElementById('arama-oto-kutu');
        if(aKutu) aKutu.style.display = 'none';
    });
};

auth.onAuthStateChanged(user => {
    girisliKullanici = user;
    const adminMi = !!(user && user.email && user.email.toLocaleLowerCase('tr') === ADMIN_EMAIL.toLocaleLowerCase('tr'));
    document.getElementById('nav-admin-btn').style.display = adminMi ? 'inline-block' : 'none';
    const girisBtn = document.getElementById('nav-uye-giris-btn');
    const hesapBtn = document.getElementById('nav-uye-hesap-btn');
    if (girisBtn) girisBtn.style.display = user ? 'none' : 'inline-block';
    if (hesapBtn) hesapBtn.style.display = user ? 'flex' : 'none';
    const avatarHarf = document.getElementById('header-avatar-harf');
    if (avatarHarf && user) avatarHarf.innerText = (user.displayName || user.email || '?').trim().charAt(0).toLocaleUpperCase('tr');

    if (!user) {
        kullaniciFavorileri = {}; kullaniciNotlari = {};
        if (favoriUnsub) { favoriUnsub(); favoriUnsub = null; }
        if (notUnsub) { notUnsub(); notUnsub = null; }
        if (localStorage.getItem('aktifSayfa') === 'admin' || localStorage.getItem('aktifSayfa') === 'hesabim') sayfaDegistir('login');
    } else {
        if (localStorage.getItem('aktifSayfa') === 'login' || localStorage.getItem('aktifSayfa') === 'uye-giris') { sayfaDegistir(adminMi ? 'admin' : 'hesabim'); }
        favoriVeNotDinleyiciBaslat(user.uid);
        hesapBilgiGuncelle();
    }
    ekranaBas();
});

db.collection("zatlar").onSnapshot(s => { veriler = s.docs.map(d => ({ id: d.id, ...d.data() })); ekranaBas(); }, err => {
    console.error("zatlar dinleme hatası:", err);
    alert(t('save_error') + err.message + t('perm_error_hint'));
});
db.collection("olaylar").onSnapshot(s => { olaylar = s.docs.map(d => ({ id: d.id, ...d.data() })); ekranaBas(); }, err => {
    console.error("olaylar dinleme hatası:", err);
    alert(t('save_error') + err.message + t('perm_error_hint'));
});

document.querySelectorAll('.editor-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const toolbar = btn.closest('.editor-toolbar');
        const hedef = document.getElementById(toolbar.dataset.hedef);
        hedef.focus();
        const komut = btn.dataset.komut;
        if (komut === 'link') {
            const url = prompt('Bağlantı adresi girin (https://...)');
            if (url) document.execCommand('createLink', false, url);
        } else {
            document.execCommand(komut, false, null);
        }
        hedef.dispatchEvent(new Event('input'));
    });
});
document.querySelectorAll('.editor-format').forEach(sel => {
    sel.addEventListener('change', function() {
        const hedef = document.getElementById(sel.dataset.hedef);
        hedef.focus();
        document.execCommand('formatBlock', false, sel.value);
        sel.value = 'p';
        hedef.dispatchEvent(new Event('input'));
    });
});

function arsiveGitVeBul(isim) {
    if(!isim || isim === "?") return;
    const temizIsim = isim.split('(')[0].trim();
    sayfaDegistir('arsiv');
    document.getElementById('ara').value = temizIsim;
    aramaYap();
}

function rastgeleSahsiyet() {
    const doluZatlar = veriler.filter(z => z.bilgi && z.bilgi.trim() !== "" && z.bilgi.trim() !== "?");
    if (doluZatlar.length === 0) { alert(t('no_bio_random')); return; }
    const secilen = doluZatlar[Math.floor(Math.random() * doluZatlar.length)];

    aktifFiltre = 'tumu';
    aktifDevir = 'tumu';

    const filterCols = document.querySelectorAll('.filter-col');
    if(filterCols.length > 0) {
        filterCols[0].querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active-filter'));
        filterCols[0].querySelector('.filter-btn').classList.add('active-filter');
    }
    if(filterCols.length > 1) {
        filterCols[1].querySelectorAll('.devir-btn').forEach(b => b.classList.remove('active-filter'));
        filterCols[1].querySelector('.devir-btn').classList.add('active-filter');
    }

    arsiveGitVeBul(secilen.isim);

    setTimeout(() => {
        document.querySelectorAll('.arsiv-detay').forEach(el => {
            if (el.style.display !== 'none' && el.querySelector('summary').innerText.includes(secilen.isim.split('(')[0].trim())) {
                el.open = true;
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const btnId = 'btn-bag-' + secilen.id;
                const kutu = document.getElementById('baglanti-kutu-' + secilen.id);
                if (kutu && kutu.style.display !== 'flex') {
                    baglantilariYukle(secilen.id, btnId);
                }
            }
        });
    }, 300);
}

function oneCikanGit(isim) {
    const secilen = veriler.find(z => z.isim === isim);

    aktifFiltre = 'tumu';
    aktifDevir = 'tumu';

    const filterCols = document.querySelectorAll('.filter-col');
    if(filterCols.length > 0) {
        filterCols[0].querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active-filter'));
        filterCols[0].querySelector('.filter-btn').classList.add('active-filter');
    }
    if(filterCols.length > 1) {
        filterCols[1].querySelectorAll('.devir-btn').forEach(b => b.classList.remove('active-filter'));
        filterCols[1].querySelector('.devir-btn').classList.add('active-filter');
    }

    arsiveGitVeBul(isim);
    const temizIsim = isim.split('(')[0].trim();

    setTimeout(() => {
        document.querySelectorAll('.arsiv-detay').forEach(el => {
            if (el.style.display !== 'none' && el.querySelector('summary').innerText.includes(temizIsim)) {
                el.open = true;
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (secilen) {
                    const btnId = 'btn-bag-' + secilen.id;
                    const kutu = document.getElementById('baglanti-kutu-' + secilen.id);
                    if (kutu && kutu.style.display !== 'flex') baglantilariYukle(secilen.id, btnId);
                }
            }
        });
    }, 300);
}

function baglantilariYukle(id, btnId) {
    const btn = document.getElementById(btnId);
    const kutu = document.getElementById('baglanti-kutu-' + id);

    if (kutu.style.display === 'flex') {
        kutu.style.display = 'none';
        btn.innerHTML = t('linked_history');
        return;
    }

    const z = veriler.find(v => v.id === id);
    if(!z) return;

    const kisaIsim = z.isim.split('(')[0].trim();
    const ilgiliOlaylar = olaylar.filter(o => (o.bilgi || "").includes(kisaIsim) || (o.ad || "").includes(kisaIsim));
    const ilgiliKisiler = veriler.filter(v => v.id !== z.id && (((v.bilgi || "").includes(kisaIsim)) || ((z.bilgi || "").includes(v.isim.split('(')[0].trim()))));

    let zd = parseInt(z.d_miladi);
    let zv = parseInt(z.v_miladi);
    let donemdaslar = [];
    if(!isNaN(zd) && !isNaN(zv)) {
        donemdaslar = veriler.filter(v => {
            if(v.id === z.id) return false;
            let vd = parseInt(v.d_miladi); let vv = parseInt(v.v_miladi);
            if(isNaN(vd) || isNaN(vv)) return false;
            return (zd <= vv && zv >= vd);
        }).slice(0, 15);
    }

    let html = '';
    if(ilgiliKisiler.length > 0) html += `<div class="sistem-grup"><div class="sistem-baslik">${t('intersecting')}</div><div>${ilgiliKisiler.map(k => `<span class="smart-link" onclick="arsiveGitVeBul('${k.isim.replace(/'/g, "\\'")}')">${escapeHtml(k.isim)}</span>`).join(', ')}</div></div>`;
    if(ilgiliOlaylar.length > 0) html += `<div class="sistem-grup"><div class="sistem-baslik">${t('related_events')}</div><div>${ilgiliOlaylar.map(o => `<span class="smart-link" onclick="olayOku('${o.id}')">${escapeHtml(o.ad)}</span>`).join(', ')}</div></div>`;
    if(donemdaslar.length > 0) html += `<div class="sistem-grup"><div class="sistem-baslik">${t('contemporaries')}</div><div>${donemdaslar.map(k => `<span class="smart-link" onclick="arsiveGitVeBul('${k.isim.replace(/'/g, "\\'")}')">${escapeHtml(k.isim)}</span>`).join(', ')}</div></div>`;

    if(html === '') html = `<div style="color: var(--text-muted); font-style:italic; font-size:0.95rem; text-align:center;">${t('no_intersection')}</div>`;

    kutu.innerHTML = html;
    kutu.style.display = 'flex';
    btn.innerHTML = t('hide_links');
}

function gosterAramaOto(inp) {
    const val = inp.value.toLocaleLowerCase('tr').trim();
    const kutu = document.getElementById('arama-oto-kutu');
    if (val.length < 2) { kutu.style.display = 'none'; return; }

    let html = '';
    let count = 0;

    if (aktifFiltre === 'tumu' || aktifFiltre === 'zat') {
        veriler.forEach(v => {
            let d = v.devir || "Asr-ı Saadet";
            if(aktifDevir !== 'tumu' && d !== aktifDevir) return;
            if(count > 8) return;
            if((v.isim || "").toLocaleLowerCase('tr').includes(val)) {
                html += `<div onclick="document.getElementById('ara').value = '${v.isim.replace(/'/g, "\\'")}'; document.getElementById('arama-oto-kutu').style.display='none'; aramaYap();">${escapeHtml(v.isim)}</div>`;
                count++;
            }
        });
    }
    if (aktifFiltre === 'tumu' || aktifFiltre === 'olay') {
        olaylar.forEach(o => {
            let d = o.devir || "Asr-ı Saadet";
            if(aktifDevir !== 'tumu' && d !== aktifDevir) return;
            if(count > 15) return;
            if((o.ad || "").toLocaleLowerCase('tr').includes(val)) {
                html += `<div onclick="document.getElementById('ara').value = '${o.ad.replace(/'/g, "\\'")}'; document.getElementById('arama-oto-kutu').style.display='none'; aramaYap();">${escapeHtml(o.ad)}</div>`;
                count++;
            }
        });
    }
    if(html === '') { kutu.style.display = 'none'; return; }
    kutu.innerHTML = html;
    const rect = inp.getBoundingClientRect();
    kutu.style.left = (rect.left + window.scrollX) + 'px';
    kutu.style.top = (rect.bottom + window.scrollY + 5) + 'px';
    kutu.style.width = rect.width + 'px';
    kutu.style.display = 'block';
}

function gosterOto(inp) {
    const val = inp.value.toLocaleLowerCase('tr');
    let html = '';
    let count = 0;
    veriler.forEach(v => {
        if(count > 40) return;
        if(v.isim.toLocaleLowerCase('tr').includes(val)) {
            html += `<div onclick="document.getElementById('${inp.id}').value = '${v.isim.replace(/'/g, "\\'")}'; document.getElementById('oto-kutu').style.display='none';">${escapeHtml(v.isim)}</div>`;
            count++;
        }
    });
    const kutu = document.getElementById('oto-kutu');
    if(html === '') { kutu.style.display = 'none'; return; }
    kutu.innerHTML = html;
    const rect = inp.getBoundingClientRect();
    kutu.style.left = (rect.left + window.scrollX) + 'px';
    kutu.style.top = (rect.bottom + window.scrollY + 5) + 'px';
    kutu.style.width = rect.width + 'px';
    kutu.style.display = 'block';
}

function sayfaDegistir(id, urlGuncelle = true) {
    const hedefSayfa = document.getElementById(id);
    if (!hedefSayfa) id = 'home';

    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    localStorage.setItem('aktifSayfa', id);
    window.scrollTo(0, 0);

    if (urlGuncelle) history.pushState({ sayfa: id }, null, '#' + id);

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active-nav'));
    if(id === 'home' || id === 'arsiv' || id === 'cizelge' || id === 'soy') {
        document.querySelectorAll(`.nav-btn[onclick="sayfaDegistir('${id}')"]`).forEach(b => b.classList.add('active-nav'));
    }

    if (id === 'admin') {
        document.getElementById('main-header').style.display = 'none';
        document.getElementById('main-footer').style.display = 'none';
        document.querySelector('.container').classList.add('container-genis');
        ipucuGoster();
        onizlemeGuncelle('zat');
        sonDuzenlenenlerGuncelle();
    } else {
        document.getElementById('main-header').style.display = 'flex';
        document.getElementById('main-footer').style.display = 'block';
        document.querySelector('.container').classList.remove('container-genis');
        if (id === 'hesabim') { hesapBilgiGuncelle(); favorilerSayfasiGuncelle(); notlarSayfasiGuncelle(); }
    }

    if (id !== 'arsiv') {
        const gs = document.getElementById('global-search');
        if (gs) gs.value = '';
        const araInput = document.getElementById('ara');
        if (araInput) { araInput.value = ''; aramaYap(); }
    }
}

function olayOku(id) {
    const o = olaylar.find(v => v.id === id);
    if(!o) return;
    document.getElementById('okuma-baslik').innerText = o.ad;
    let oH = (o.hicri && o.hicri !== "?") ? "H. " + o.hicri : "";
    let oM = (o.miladi && o.miladi !== "?") ? " M. " + o.miladi : "";
    let tamTarih = (oH || oM) ? `${oH} ${oM}` : t('date_unknown');
    document.getElementById('okuma-tarih').innerText = tamTarih;
    document.getElementById('okuma-favori-alan').innerHTML = favoriBtnHtml('olay', o.id, o.ad);
    let formatliBilgi = bilgiyiGoster(o.bilgi);
    if (o.kaynak && o.kaynak !== "?") {
        formatliBilgi += `<div style="margin-top:25px; font-size:0.85rem; color: var(--text-placeholder); font-style:italic; text-align:center;">${t('source')} ${escapeHtml(o.kaynak)}</div>`;
    }
    document.getElementById('okuma-icerik').innerHTML = formatliBilgi;
    document.getElementById('okuma-not-yorum').innerHTML = notYorumPaneliHtml('olay', o.id);
    yorumlariYukle('olay', o.id);
    sayfaDegistir('olay-okuma');
}

function globalArama() {
    const val = document.getElementById('global-search').value;
    if (!document.getElementById('arsiv').classList.contains('active')) {
        sayfaDegistir('arsiv');
        document.getElementById('global-search').focus();
    }
    document.getElementById('ara').value = val;
    aramaYap();
}

async function girisYap() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    try { await auth.signInWithEmailAndPassword(email, pass); sayfaDegistir('admin'); } catch (e) { alert(t('login_error') + e.message); }
}
function cikisYap() { auth.signOut(); sayfaDegistir('home'); }

function uyeSekmeDegistir(tip) {
    document.getElementById('uye-sekme-giris').style.display = tip === 'giris' ? 'block' : 'none';
    document.getElementById('uye-sekme-kayit').style.display = tip === 'kayit' ? 'block' : 'none';
    document.getElementById('sekme-giris-btn').classList.toggle('uye-sekme-aktif', tip === 'giris');
    document.getElementById('sekme-kayit-btn').classList.toggle('uye-sekme-aktif', tip === 'kayit');
}

async function uyeGirisYap() {
    const hata = document.getElementById('uye-giris-hata');
    hata.style.display = 'none';
    const email = document.getElementById('uye-giris-email').value.trim();
    const sifre = document.getElementById('uye-giris-sifre').value;
    if (!email || !sifre) { hata.innerText = 'E-posta ve şifre gerekli.'; hata.style.display = 'block'; return; }
    try {
        await auth.signInWithEmailAndPassword(email, sifre);
        sayfaDegistir('hesabim');
    } catch (e) { hata.innerText = 'Giriş başarısız: ' + e.message; hata.style.display = 'block'; }
}

async function uyeKayitOl() {
    const hata = document.getElementById('uye-kayit-hata');
    hata.style.display = 'none';
    const ad = document.getElementById('uye-kayit-ad').value.trim();
    const email = document.getElementById('uye-kayit-email').value.trim();
    const sifre = document.getElementById('uye-kayit-sifre').value;
    if (!ad || !email || !sifre) { hata.innerText = 'Tüm alanları doldur.'; hata.style.display = 'block'; return; }
    if (sifre.length < 6) { hata.innerText = 'Şifre en az 6 karakter olmalı.'; hata.style.display = 'block'; return; }
    try {
        const sonuc = await auth.createUserWithEmailAndPassword(email, sifre);
        await sonuc.user.updateProfile({ displayName: ad });
        girisliKullanici = sonuc.user;
        sayfaDegistir('hesabim');
    } catch (e) { hata.innerText = 'Üyelik oluşturulamadı: ' + e.message; hata.style.display = 'block'; }
}

async function googleIleGiris() {
    try {
        await auth.signInWithPopup(googleProvider);
        sayfaDegistir('hesabim');
    } catch (e) { alert('Google ile giriş başarısız: ' + e.message); }
}

function uyeCikisYap() { auth.signOut(); sayfaDegistir('home'); }

function hesapBilgiGuncelle() {
    const el = document.getElementById('hesap-bilgi');
    if (el && girisliKullanici) el.innerText = (girisliKullanici.displayName || girisliKullanici.email) + ' olarak giriş yaptın.';
}

function favoriVeNotDinleyiciBaslat(uid) {
    if (favoriUnsub) favoriUnsub();
    if (notUnsub) notUnsub();
    favoriUnsub = db.collection('favoriler').where('uid', '==', uid).onSnapshot(s => {
        kullaniciFavorileri = {};
        s.docs.forEach(d => { const v = d.data(); kullaniciFavorileri[v.tip + '_' + v.itemId] = { docId: d.id, ad: v.ad, tip: v.tip, itemId: v.itemId }; });
        favorilerSayfasiGuncelle();
        ekranaBas();
    });
    notUnsub = db.collection('notlar').where('uid', '==', uid).onSnapshot(s => {
        kullaniciNotlari = {};
        s.docs.forEach(d => { const v = d.data(); kullaniciNotlari[v.tip + '_' + v.itemId] = { docId: d.id, ad: v.ad, metin: v.metin, tip: v.tip, itemId: v.itemId }; });
        notlarSayfasiGuncelle();
    });
}

async function favoriTogle(tip, itemId, ad) {
    if (!girisliKullanici) { sayfaDegistir('uye-giris'); return; }
    const anahtar = tip + '_' + itemId;
    const mevcut = kullaniciFavorileri[anahtar];
    try {
        if (mevcut) { await db.collection('favoriler').doc(mevcut.docId).delete(); }
        else { await db.collection('favoriler').add({ uid: girisliKullanici.uid, tip, itemId, ad, eklenmeTarihi: Date.now() }); }
    } catch (e) {
        console.error("favoriTogle hatası:", e);
        alert(t('save_error') + e.message);
    }
}

function favoriBtnHtml(tip, itemId, ad) {
    const dolu = !!kullaniciFavorileri[tip + '_' + itemId];
    return `<button class="favori-btn ${dolu ? 'favori-dolu' : ''}" onclick="event.stopPropagation(); favoriTogle('${tip}','${itemId}','${(ad || '').replace(/'/g, "\\'")}')" title="${dolu ? 'Favorilerden çıkar' : 'Favorilere ekle'}">${dolu ? '♥' : '♡'}</button>`;
}

function favorilerSayfasiGuncelle() {
    const kutu = document.getElementById('favorilerim-liste');
    if (!kutu) return;
    const liste = Object.values(kullaniciFavorileri);
    if (liste.length === 0) { kutu.innerHTML = `<p class="onizleme-bos">Henüz favori eklemedin.</p>`; return; }
    kutu.innerHTML = liste.map(f => `<div class="kayit-mini" style="padding:10px;" onclick="${f.tip === 'zat' ? `arsiveGitVeBul('${(f.ad || '').replace(/'/g, "\\'")}')` : `olayOku('${f.itemId}')`}"><div class="kayit-mini-avatar">${escapeHtml((f.ad || '?').charAt(0).toLocaleUpperCase('tr'))}</div><div class="kayit-mini-metin">${escapeHtml(f.ad || '')}</div><div class="kayit-mini-tip">${f.tip === 'zat' ? 'Zat' : 'Olay'}</div><button class="kayit-btn kayit-btn-sil" onclick="event.stopPropagation(); favoriTogle('${f.tip}','${f.itemId}','${(f.ad || '').replace(/'/g, "\\'")}')">Kaldır</button></div>`).join('');
}

function notlarSayfasiGuncelle() {
    const kutu = document.getElementById('notlarim-liste');
    if (!kutu) return;
    const liste = Object.values(kullaniciNotlari).filter(n => n.metin && n.metin.trim());
    if (liste.length === 0) { kutu.innerHTML = `<p class="onizleme-bos">Henüz not almadın.</p>`; return; }
    kutu.innerHTML = liste.map(n => `<div class="kayit-mini" style="align-items:flex-start; padding:10px; cursor:pointer;" onclick="${n.tip === 'zat' ? `arsiveGitVeBul('${(n.ad || '').replace(/'/g, "\\'")}')` : `olayOku('${n.itemId}')`}"><div class="kayit-mini-avatar">${escapeHtml((n.ad || '?').charAt(0).toLocaleUpperCase('tr'))}</div><div class="kayit-mini-metin" style="white-space:normal;"><strong>${escapeHtml(n.ad || '')}</strong><br><span style="font-size:0.8rem; color:var(--text-secondary);">${escapeHtml(n.metin.substring(0, 140))}${n.metin.length > 140 ? '...' : ''}</span></div></div>`).join('');
}

function notYorumPaneliHtml(tip, itemId) {
    const notKey = tip + '_' + itemId;
    const notMevcut = kullaniciNotlari[notKey] ? kullaniciNotlari[notKey].metin : '';
    const notPanel = girisliKullanici ?
        `<div class="not-panel">
            <h4 class="not-panel-baslik">📝 Kişisel Notum <span class="not-ozel-etiket">sadece sen görürsün</span></h4>
            <textarea id="not-alani-${tip}-${itemId}" class="not-textarea" placeholder="Bu kayıtla ilgili kendine özel bir not al...">${escapeHtml(notMevcut)}</textarea>
            <button class="btn-not-kaydet" onclick="notKaydet('${tip}','${itemId}')">Notu Kaydet</button>
        </div>` :
        `<div class="not-panel not-panel-kilitli">📝 Kişisel not almak için <span class="smart-link" onclick="sayfaDegistir('uye-giris')">giriş yap</span>.</div>`;

    const yorumForm = girisliKullanici ?
        `<div class="yorum-form"><textarea id="yorum-alani-giris-${tip}-${itemId}" class="not-textarea" placeholder="Bir yorum yaz..."></textarea><button class="btn-not-kaydet" onclick="yorumGonder('${tip}','${itemId}')">Yorum Yap</button></div>` :
        `<p class="onizleme-bos">Yorum yapmak için <span class="smart-link" onclick="sayfaDegistir('uye-giris')">giriş yap</span>.</p>`;

    return `<div class="not-yorum-blok">
        ${notPanel}
        <div class="yorum-blok">
            <h4 class="not-panel-baslik">💬 Yorumlar</h4>
            <div id="yorum-liste-${tip}-${itemId}" class="yorum-liste"><p class="onizleme-bos">Yükleniyor...</p></div>
            ${yorumForm}
        </div>
    </div>`;
}

async function notKaydet(tip, itemId) {
    if (!girisliKullanici) return;
    const alan = document.getElementById(`not-alani-${tip}-${itemId}`);
    const metin = alan.value;
    const docId = girisliKullanici.uid + '_' + tip + '_' + itemId;
    const kaynakListe = tip === 'zat' ? veriler : olaylar;
    const kaynakKayit = kaynakListe.find(k => k.id === itemId);
    const ad = kaynakKayit ? (tip === 'zat' ? kaynakKayit.isim : kaynakKayit.ad) : '';
    try {
        if (!metin.trim()) { await db.collection('notlar').doc(docId).delete(); }
        else { await db.collection('notlar').doc(docId).set({ uid: girisliKullanici.uid, tip, itemId, ad, metin, guncellemeTarihi: Date.now() }); }
        const btn = alan.nextElementSibling;
        if (btn) { const eski = btn.innerText; btn.innerText = 'Kaydedildi ✓'; setTimeout(() => btn.innerText = eski, 1500); }
    } catch (e) {
        console.error("notKaydet hatası:", e);
        alert(t('save_error') + e.message);
    }
}

async function yorumlariYukle(tip, itemId) {
    const kutu = document.getElementById(`yorum-liste-${tip}-${itemId}`);
    if (!kutu) return;
    try {
        const snap = await db.collection('yorumlar').where('tip', '==', tip).where('itemId', '==', itemId).orderBy('tarih', 'desc').limit(50).get();
        if (snap.empty) { kutu.innerHTML = `<p class="onizleme-bos">Henüz yorum yok. İlk yorumu sen yaz.</p>`; return; }
        kutu.innerHTML = snap.docs.map(d => {
            const v = d.data();
            return `<div class="yorum-item"><div class="yorum-item-ust"><strong>${escapeHtml(v.adSoyad || 'Üye')}</strong><span class="yorum-tarih">${new Date(v.tarih).toLocaleDateString('tr-TR')}</span></div><div class="yorum-metin">${escapeHtml(v.metin)}</div></div>`;
        }).join('');
    } catch (e) { kutu.innerHTML = `<p class="onizleme-bos">Yorumlar yüklenemedi.</p>`; }
}

async function yorumGonder(tip, itemId) {
    if (!girisliKullanici) return;
    const alan = document.getElementById(`yorum-alani-giris-${tip}-${itemId}`);
    const metin = alan.value.trim();
    if (!metin) return;
    const adSoyad = girisliKullanici.displayName || girisliKullanici.email.split('@')[0];
    try {
        await db.collection('yorumlar').add({ tip, itemId, uid: girisliKullanici.uid, adSoyad, metin, tarih: Date.now() });
        alan.value = '';
        yorumlariYukle(tip, itemId);
    } catch (e) {
        console.error("yorumGonder hatası:", e);
        alert(t('save_error') + e.message);
    }
}

function kelimeBaslariniBuyut(metin) {
    if (!metin || metin === "?") return metin;
    return metin.split(' ').map(k => k.charAt(0).toLocaleUpperCase('tr') + k.slice(1)).join(' ');
}

function benzerZatKontrol() {
    const metin = document.getElementById('in_ad').value.trim().toLocaleLowerCase('tr');
    const uyariKutusu = document.getElementById('zat-uyari');
    if (metin.length < 2 || document.getElementById('edit-id').value !== "") { uyariKutusu.style.display = 'none'; return; }
    const benzerler = veriler.filter(v => (v.isim || "").toLocaleLowerCase('tr').includes(metin));
    if (benzerler.length > 0) {
        uyariKutusu.innerHTML = t('similar_names', { list: benzerler.map(b => escapeHtml(b.isim)).slice(0, 3).join(', ') });
        uyariKutusu.style.display = 'block';
    } else uyariKutusu.style.display = 'none';
}

function oneriGoster(inputId) {
    const girdi = document.getElementById(inputId);
    const kutu = document.getElementById(inputId + '_oneri');
    if (!girdi || !kutu) return;
    const deger = girdi.value.trim().toLocaleLowerCase('tr');
    if (deger.length < 1) { kutu.classList.remove('oneri-liste-acik'); kutu.innerHTML = ''; return; }
    const isimler = [...new Set((veriler || []).map(z => z.isim).filter(Boolean))];
    const eslesenler = isimler.filter(isim => isim.toLocaleLowerCase('tr').includes(deger) && isim.toLocaleLowerCase('tr') !== deger).sort((a,b) => a.localeCompare(b, 'tr')).slice(0, 8);
    if (eslesenler.length === 0) { kutu.classList.remove('oneri-liste-acik'); kutu.innerHTML = ''; return; }
    kutu.innerHTML = eslesenler.map(isim => `<div class="oneri-item" onclick="oneriSec('${inputId}', '${isim.replace(/'/g, "\\'")}')">${escapeHtml(isim)}</div>`).join('');
    kutu.classList.add('oneri-liste-acik');
}

function oneriSec(inputId, isim) {
    const girdi = document.getElementById(inputId);
    if (!girdi) return;
    girdi.value = isim;
    oneriGizle(inputId);
    if (inputId === 'in_ad') benzerZatKontrol();
    girdi.focus();
}

function oneriGizle(inputId) {
    const kutu = document.getElementById(inputId + '_oneri');
    if (kutu) { kutu.classList.remove('oneri-liste-acik'); kutu.innerHTML = ''; }
}

function oneriGizleGecikmeli(inputId) { setTimeout(() => oneriGizle(inputId), 150); }

function odaklan(inputId) {
    const girdi = document.getElementById(inputId);
    if (!girdi) return;
    girdi.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => girdi.focus(), 300);
}

function onizlemeGuncelle(tip) {
    const kutu = document.getElementById('canliOnizleme');
    if (!kutu) return;
    if (tip === 'olay') {
        const baslik = (document.getElementById('ol_ad').value || "").trim();
        const bilgiEl = document.getElementById('ol_bilgi');
        const bilgiMetin = (bilgiEl.innerText || "").trim();
        const devir = document.getElementById('ol_devir').value;
        if (!baslik && !bilgiMetin) { kutu.innerHTML = `<p class="onizleme-bos">Yazmaya başladığında burada canlı önizlemesini göreceksin.</p>`; return; }
        kutu.innerHTML = `<div class="onizleme-kart"><span class="devir-tag">${escapeHtml(devir)}</span><h5 class="onizleme-baslik">${escapeHtml(baslik || "(Başlıksız Olay)")}</h5><div class="onizleme-metin">${bilgiEl.innerHTML || "(Henüz metin yok)"}</div></div>`;
    } else {
        const isim = (document.getElementById('in_ad').value || "").trim();
        const bilgiEl = document.getElementById('in_bilgi');
        const bilgiMetin = (bilgiEl.innerText || "").trim();
        const devir = document.getElementById('in_devir').value;
        if (!isim && !bilgiMetin) { kutu.innerHTML = `<p class="onizleme-bos">Yazmaya başladığında burada canlı önizlemesini göreceksin.</p>`; return; }
        kutu.innerHTML = `<div class="onizleme-kart"><span class="devir-tag">${escapeHtml(devir)}</span><h5 class="onizleme-baslik">${escapeHtml(isim || "(İsimsiz Zat)")}</h5><div class="onizleme-metin">${bilgiEl.innerHTML || "(Henüz metin yok)"}</div></div>`;
    }
}

function sonDuzenlenenlerGuncelle() {
    const kutu = document.getElementById('sonDuzenlenenler');
    if (!kutu) return;
    const hepsi = [
        ...veriler.map(z => ({ id: z.id, ad: z.isim, tip: 'zat', zaman: z.guncellemeTarihi || 0 })),
        ...olaylar.map(o => ({ id: o.id, ad: o.ad, tip: 'olay', zaman: o.guncellemeTarihi || 0 }))
    ].filter(k => k.zaman > 0).sort((a, b) => b.zaman - a.zaman).slice(0, 6);
    if (hepsi.length === 0) { kutu.innerHTML = `<p class="onizleme-bos">Henüz düzenleme yapılmadı.</p>`; return; }
    kutu.innerHTML = hepsi.map(k => `<div class="kayit-mini" onclick="${k.tip === 'zat' ? `duzenle('${k.id}')` : `duzenleOlay('${k.id}')`}"><div class="kayit-mini-avatar">${escapeHtml((k.ad || "?").charAt(0).toLocaleUpperCase('tr'))}</div><div class="kayit-mini-metin">${escapeHtml(k.ad || "")}</div><div class="kayit-mini-tip">${k.tip === 'zat' ? 'Zat' : 'Olay'}</div></div>`).join('');
}

const ADMIN_IPUCLARI = [
    "Bilgi kutusunun sağ alt köşesinden tutup aşağı doğru sürükleyerek kutuyu büyütebilirsin.",
    "İsim, anne ve baba alanlarına yazarken sistem kayıtlı isimler arasından öneri sunar.",
    "Aynı isimde bir kayıt zaten varsa, isim yazarken seni otomatik uyarır.",
    "Sol taraftaki listeden bir kayda tıklayarak hızlıca düzenleyebilirsin.",
    "Kaydetmeden önce sağdaki canlı önizlemeden nasıl görüneceğini kontrol edebilirsin."
];
function ipucuGoster() {
    const el = document.getElementById('admin-ipucu-metin');
    if (el) el.innerText = ADMIN_IPUCLARI[Math.floor(Math.random() * ADMIN_IPUCLARI.length)];
}

function benzerOlayKontrol() {
    const metin = document.getElementById('ol_ad').value.trim().toLocaleLowerCase('tr');
    const uyariKutusu = document.getElementById('olay-uyari');
    if (metin.length < 2 || document.getElementById('edit-olay-id').value !== "") { uyariKutusu.style.display = 'none'; return; }
    const benzerler = olaylar.filter(o => (o.ad || "").toLocaleLowerCase('tr').includes(metin));
    if (benzerler.length > 0) {
        uyariKutusu.innerHTML = t('similar_events', { list: benzerler.map(b => escapeHtml(b.ad)).slice(0, 3).join(', ') });
        uyariKutusu.style.display = 'block';
    } else uyariKutusu.style.display = 'none';
}

function ekranaBas() {
    const arsiv = document.getElementById('arsivList');
    const cizelge = document.getElementById('cizelgeList');
    const soy = document.getElementById('soyList');
    const adminL = document.getElementById('adminList');

    let bagliKisi = 0;

    veriler.forEach(z => {
        if((z.baba && z.baba !== "?") || (z.anne && z.anne !== "?") || (z.baglar && z.baglar !== "?")) bagliKisi++;
    });

    if(document.getElementById('home-stat-zat')) document.getElementById('home-stat-zat').innerText = veriler.length;
    if(document.getElementById('home-stat-olay')) document.getElementById('home-stat-olay').innerText = olaylar.length;
    if(document.getElementById('home-stat-bag')) document.getElementById('home-stat-bag').innerText = bagliKisi;

    veriler.sort((a, b) => (a.isim || "").toLocaleLowerCase('tr').localeCompare((b.isim || "").toLocaleLowerCase('tr'), 'tr'));

    let aHtml = "";
    veriler.forEach(z => {
        const aramaMetni = escapeHtml(((z.isim || "") + " " + duzMetneCevir(z.bilgi)).toLocaleLowerCase('tr'));
        let dM = parseInt(z.d_miladi), vM = parseInt(z.v_miladi);
        let devirStr = z.devir || "Asr-ı Saadet";
        let devirRozet = `<span class="devir-tag">${escapeHtml(devirStr)}</span>`;
        let yasStr = (!isNaN(dM) && !isNaN(vM)) ? `<span class="yas-badge">${vM - dM} ${t('years_old')}</span>` : "";

        let dH = (z.d_hicri && z.d_hicri !== "?") ? "H. " + z.d_hicri : ""; let dMil = (z.d_miladi && z.d_miladi !== "?") ? " (M. " + z.d_miladi + ")" : "";
        let vH = (z.v_hicri && z.v_hicri !== "?") ? "H. " + z.v_hicri : ""; let vMil = (z.v_miladi && z.v_miladi !== "?") ? " (M. " + z.v_miladi + ")" : "";

        let bilgiHTML = (z.bilgi && z.bilgi.trim() !== "" && z.bilgi.trim() !== "?") ?
            `<div class="buyuk-kutu">
                ${bilgiyiGoster(z.bilgi)}
                ${(z.kaynak && z.kaynak !== "?") ? `<div style="margin-top:15px; font-size:0.8rem; color: var(--text-placeholder); font-style:italic;">${t('source')} ${escapeHtml(z.kaynak)}</div>` : ""}
            </div>` : "";

        let kucukKutular = `<div class="relation-grid">`;

        if (dH || dMil || vH || vMil) {
            kucukKutular += `<div class="rel-box rel-box-wide">
                 <strong style="color: var(--text-placeholder); margin:0; font-size:0.8rem;">${t('life_info')}</strong>
                 ${(dH||dMil) ? `<span style="color: var(--text-label);">${t('birth')} ${escapeHtml(dH+dMil)}</span>` : ""}
                 ${(vH||vMil) ? `<span style="color: var(--text-label);">${t('death')} ${escapeHtml(vH+vMil)}</span>` : ""}
            </div>`;
        }

        if (z.baba && z.baba !== "?") kucukKutular += `<div class="rel-box"><strong>${t('father')}</strong><span class="smart-link" onclick="arsiveGitVeBul('${z.baba.replace(/'/g, "\\'")}')">${escapeHtml(z.baba)}</span></div>`;
        if (z.anne && z.anne !== "?") kucukKutular += `<div class="rel-box"><strong>${t('mother')}</strong><span class="smart-link" onclick="arsiveGitVeBul('${z.anne.replace(/'/g, "\\'")}')">${escapeHtml(z.anne)}</span></div>`;
        if (z.es && z.es !== "?") kucukKutular += `<div class="rel-box" style="grid-column: span 2;"><strong>${t('spouses')}</strong>` + z.es.split(',').map(e => `<span class="smart-link" onclick="arsiveGitVeBul('${e.trim().replace(/'/g, "\\'")}')">${escapeHtml(e.trim())}</span>`).join(', ') + `</div>`;
        if (z.baglar && z.baglar !== "?") kucukKutular += `<div class="rel-box" style="grid-column: span 2;"><strong>${t('family_ties')}</strong>` + z.baglar.split(',').map(b => `<span class="smart-link" onclick="arsiveGitVeBul('${b.split('(')[0].trim().replace(/'/g, "\\'")}')">${escapeHtml(b.trim())}</span>`).join(' • ') + `</div>`;

        kucukKutular += `</div>`;

        let sistemButonu = `
        <div>
            <button id="btn-bag-${z.id}" onclick="baglantilariYukle('${z.id}', 'btn-bag-${z.id}')" class="btn-sistem">${t('linked_history')}</button>
            <div id="baglanti-kutu-${z.id}" class="sistem-container" style="display:none;"></div>
        </div>`;

        let ilkHarf = z.isim.charAt(0).toLocaleUpperCase('tr');

        aHtml += `
        <details class="arsiv-kart search-item arsiv-detay" data-search="${aramaMetni}" data-type="zat" data-devir="${escapeHtml(devirStr)}" ontoggle="if(this.open) yorumlariYukle('zat','${z.id}')">
            <summary>
                <div class="kart-baslik-isim">
                    <div class="kart-ikon">${escapeHtml(ilkHarf)}</div>
                    <div style="flex:1;"><h3 class="kart-isim-metin">${escapeHtml(z.isim)}</h3><div>${devirRozet} ${yasStr}</div></div>
                    ${favoriBtnHtml('zat', z.id, z.isim)}
                </div>
            </summary>
            <div class="arsiv-icerik-yeni">
                ${bilgiHTML}
                ${kucukKutular}
                ${sistemButonu}
                ${notYorumPaneliHtml('zat', z.id)}
            </div>
        </details>`;
    });

    let aOlayHtml = "";
    let hOlayHtml = "";

    let siraliOlaylar = [...olaylar].sort((a, b) => (b.eklenmeTarihi || 0) - (a.eklenmeTarihi || 0));

    siraliOlaylar.forEach((o, index) => {
        const aramaMetniOlay = escapeHtml(((o.ad || "") + " " + duzMetneCevir(o.bilgi)).toLocaleLowerCase('tr'));
        let oH = (o.hicri && o.hicri !== "?") ? "H. " + o.hicri : "";
        let oM = (o.miladi && o.miladi !== "?") ? " M. " + o.miladi : "";
        let kisaBilgiDuz = duzMetneCevir(o.bilgi);
        let kisaBilgi = (kisaBilgiDuz.length > 200) ? kisaBilgiDuz.substring(0, 200) + "..." : (kisaBilgiDuz || t('no_content'));

        let devirStr = o.devir || "Asr-ı Saadet";
        let devirRozet = `<span class="devir-tag">${escapeHtml(devirStr)}</span>`;

        let kartHtml = `
        <div class="article-card search-item" data-search="${aramaMetniOlay}" data-type="olay" data-devir="${escapeHtml(devirStr)}" onclick="olayOku('${o.id}')">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span class="category-tag">${t('hist_event')}</span>
                <div style="display:flex; align-items:center; gap:8px;">${devirRozet}${favoriBtnHtml('olay', o.id, o.ad)}</div>
            </div>
            <div>
                <h3>${escapeHtml(o.ad)}</h3>
                <p>${escapeHtml(kisaBilgi)}</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color-soft); padding-top: 15px; margin-top: 15px;">
                <span style="font-size: 0.85rem; color: var(--text-faint);">${oH}${oM}</span>
                <span class="read-more">${t('read_article')}</span>
            </div>
        </div>`;

        aOlayHtml += kartHtml;
        if (index < 3) hOlayHtml += kartHtml;
    });

    arsiv.innerHTML = aHtml + aOlayHtml;

    const homeOlaylarGrid = document.getElementById('home-olaylar-grid');
    if(homeOlaylarGrid) homeOlaylarGrid.innerHTML = hOlayHtml === "" ? `<p style="text-align: center; color: var(--text-muted); width: 100%;">${t('no_events')}</p>` : hOlayHtml;

    const homeOneCikan = document.getElementById('home-one-cikan');
    if (homeOneCikan) {
        const enCokYazili = veriler
            .filter(z => z.bilgi && z.bilgi.trim() !== "" && z.bilgi.trim() !== "?")
            .slice()
            .sort((a, b) => b.bilgi.trim().length - a.bilgi.trim().length)
            .slice(0, 8);
        homeOneCikan.innerHTML = enCokYazili.length === 0 ? `<p style="text-align: center; width: 100%; color: var(--text-muted);">${t('no_data')}</p>` : enCokYazili.map(z => {
            let ilkHarf = (z.isim || "?").charAt(0).toLocaleUpperCase('tr');
            let devirStr = z.devir || "Asr-ı Saadet";
            let ozetMetin = duzMetneCevir(z.bilgi);
            let ozet = ozetMetin.length > 110 ? ozetMetin.substring(0, 110) + "..." : ozetMetin;
            return `<div class="on-cikan-kart" onclick="oneCikanGit('${z.isim.replace(/'/g, "\\'")}')">
                <div class="on-cikan-avatar">${escapeHtml(ilkHarf)}</div>
                <div class="on-cikan-isim">${escapeHtml(z.isim)}</div>
                <span class="devir-tag">${escapeHtml(devirStr)}</span>
                <div class="on-cikan-ozet">${escapeHtml(ozet)}</div>
            </div>`;
        }).join('');
    }

    const toplamKayitEl = document.getElementById('admin-toplam-kayit');
    if (toplamKayitEl) toplamKayitEl.innerText = t('admin_total', { zat: veriler.length, olay: olaylar.length });

    let admHtml = `<h4 style="color: var(--brand-text); margin-top:0;">${t('persons')}</h4>`;
    const azZatlar = {};
    veriler.forEach(z => { let harf = (z.isim || "İ").charAt(0).toLocaleUpperCase('tr'); if (!azZatlar[harf]) azZatlar[harf] = []; azZatlar[harf].push(z); });
    Object.keys(azZatlar).sort((a,b) => a.localeCompare(b, 'tr')).forEach(h => {
        admHtml += `<details class="soy-klasor"><summary class="soy-baslik">${t('letter_of', { h: escapeHtml(h), n: azZatlar[h].length })}</summary><div class="soy-icerik">`;
        azZatlar[h].forEach(z => { admHtml += `<div class="kayit-satir"><div class="kayit-avatar">${escapeHtml((z.isim||"?").charAt(0).toLocaleUpperCase('tr'))}</div><div class="kayit-isim">${escapeHtml(z.isim)}</div><div class="kayit-aksiyonlar"><button class="kayit-btn kayit-btn-duzenle" onclick="duzenle('${z.id}')">${t('edit')}</button><button class="kayit-btn kayit-btn-sil" onclick="sil('${z.id}', 'zatlar')">${t('del')}</button></div></div>`; });
        admHtml += `</div></details>`;
    });

    admHtml += `<h4 style="color: var(--brand-text); margin-top:20px;">${t('events')}</h4>`;
    const azOlaylar = {};
    olaylar.forEach(o => { let harf = (o.ad || "İ").charAt(0).toLocaleUpperCase('tr'); if (!azOlaylar[harf]) azOlaylar[harf] = []; azOlaylar[harf].push(o); });
    Object.keys(azOlaylar).sort((a,b) => a.localeCompare(b, 'tr')).forEach(h => {
        admHtml += `<details class="soy-klasor"><summary class="soy-baslik">${t('letter_of', { h: escapeHtml(h), n: azOlaylar[h].length })}</summary><div class="soy-icerik">`;
        azOlaylar[h].forEach(o => { admHtml += `<div class="kayit-satir"><div class="kayit-avatar">${escapeHtml((o.ad||"?").charAt(0).toLocaleUpperCase('tr'))}</div><div class="kayit-isim">${escapeHtml(o.ad)}</div><div class="kayit-aksiyonlar"><button class="kayit-btn kayit-btn-duzenle" onclick="duzenleOlay('${o.id}')">${t('edit')}</button><button class="kayit-btn kayit-btn-sil" onclick="sil('${o.id}', 'olaylar')">${t('del')}</button></div></div>`; });
        admHtml += `</div></details>`;
    });
    adminL.innerHTML = admHtml;

    const bil = [];
    veriler.forEach(z => { if(!isNaN(parseInt(z.d_miladi))) bil.push({s: parseInt(z.d_miladi), ad: z.isim, t: 'Zat'}); });
    olaylar.forEach(o => { if(!isNaN(parseInt(o.miladi))) bil.push({s: parseInt(o.miladi), ad: o.ad, t: 'Olay'}); });
    bil.sort((a,b) => a.s - b.s);
    cizelge.innerHTML = bil.map(i => {
        let tRenk = i.t === 'Olay' ? 'var(--danger)' : 'var(--accent-blue)';
        return `<div style="padding:15px; border-bottom: 1px solid var(--border-color); background: var(--bg-card); margin-bottom: 5px; border-radius: 6px;"><b>M. ${i.s}</b>: <span class="smart-link" onclick="arsiveGitVeBul('${i.ad.replace(/'/g, "\\'")}')">${escapeHtml(i.ad)}</span> <small style="color:${tRenk}; font-weight:500; margin-left: 10px;">[${i.t}]</small></div>`;
    }).join('');

    const homeMiniTimeline = document.getElementById('home-mini-timeline');
    if (homeMiniTimeline) {
        homeMiniTimeline.innerHTML = bil.length === 0 ? `<p style="text-align: center; width: 100%; color: var(--text-muted);">${t('no_data')}</p>` : bil.slice(0, 12).map(i => `<div class="mini-timeline-kart"><div><div class="mini-timeline-yil">M. ${i.s}</div><div class="mini-timeline-isim"><span class="smart-link" onclick="arsiveGitVeBul('${i.ad.replace(/'/g, "\\'")}')">${escapeHtml(i.ad)}</span></div></div><div style="color: var(--text-muted); font-size:0.8rem; margin-top:15px;">${i.t === 'Olay' ? t('type_event') : t('mini_birth')}</div></div>`).join('');
    }

    const gruplar = {};
    veriler.forEach(z => {
        let b = (z.baba && z.baba.trim() !== "" && z.baba.trim() !== "?") ? z.baba.trim() : t('unknown_father');
        if (b !== t('unknown_father')) b = b.split(' ').map(k => k.charAt(0).toLocaleUpperCase('tr') + k.slice(1).toLocaleLowerCase('tr')).join(' ');
        if(b === "Abdülmuttalip" || b === "Abdulmuttalib" || b === "Abdülmuttalib") b = "Abdulmuttalip";
        if(b === "Ebu Talib" || b === "Ebutalip") b = "Ebu Talip";
        if (!gruplar[b]) gruplar[b] = [];
        gruplar[b].push(z);
    });

    soy.innerHTML = Object.keys(gruplar).sort((a, b) => a.toLocaleLowerCase('tr').localeCompare(b.toLocaleLowerCase('tr'), 'tr')).map(baba => {
        let babaBaslik = baba === t('unknown_father') ? t('unknown_father') : `${t('father_prefix')} <span class="smart-link" onclick="event.stopPropagation(); arsiveGitVeBul('${baba.replace(/'/g, "\\'")}')">${escapeHtml(baba)}</span>`;
        const kisilerHtml = gruplar[baba].map(k => `<div class="soy-kart"><strong><span class="smart-link" onclick="arsiveGitVeBul('${k.isim.replace(/'/g, "\\'")}')">${escapeHtml(k.isim)}</span></strong><br>${k.anne && k.anne !== "?" ? `<small style="color: var(--text-secondary);">${t('mother_prefix')} <span class="smart-link" onclick="arsiveGitVeBul('${k.anne.replace(/'/g, "\\'")}')">${escapeHtml(k.anne)}</span></small>` : ""}${k.es && k.es !== "?" ? `<br><small style="color: var(--text-secondary);">${t('spouse_prefix')} ` + k.es.split(',').map(e => `<span class="smart-link" onclick="arsiveGitVeBul('${e.trim().replace(/'/g, "\\'")}')">${escapeHtml(e.trim())}</span>`).join(', ') + `</small>` : ""}${k.baglar && k.baglar !== "?" ? `<br><small style="color: var(--text-secondary);">${t('other_ties')} ` + k.baglar.split(',').map(b => `<span class="smart-link" onclick="arsiveGitVeBul('${b.split('(')[0].trim().replace(/'/g, "\\'")}')">${escapeHtml(b.trim())}</span>`).join(', ') + `</small>` : ""}</div>`).join('');
        return `<details class="soy-klasor"><summary class="soy-baslik">${babaBaslik}</summary><div class="soy-icerik">${kisilerHtml}</div></details>`;
    }).join('');
    aramaYap();
    sonDuzenlenenlerGuncelle();
}

function girisliAdminMi() { return !!(auth.currentUser && auth.currentUser.email && auth.currentUser.email.toLocaleLowerCase('tr') === ADMIN_EMAIL.toLocaleLowerCase('tr')); }

async function kaydet() {
    if (!girisliAdminMi()) {
        alert("Bu işlemi yapmak için ADMIN_EMAIL ile eşleşen bir hesapla giriş yapmış olmalısın. (Şu an giriş yapan hesap: " + (auth.currentUser ? auth.currentUser.email : "yok") + ")");
        return;
    }
    let ad = kelimeBaslariniBuyut(document.getElementById('in_ad').value.trim());
    if (!ad) { alert(t('need_name')); return; }
    if (document.getElementById('oto_ra').checked) { const kucukAd = ad.toLocaleLowerCase('tr'); if (!kucukAd.includes("(ra)") && !kucukAd.includes("(r.a.)") && !kucukAd.includes("(r.a)")) ad += " (ra)"; }

    const id = document.getElementById('edit-id').value;
    const obj = {
        isim: ad, devir: document.getElementById('in_devir').value, anne: kelimeBaslariniBuyut(document.getElementById('in_anne').value) || "?",
        baba: kelimeBaslariniBuyut(document.getElementById('in_baba').value) || "?", es: kelimeBaslariniBuyut(document.getElementById('in_es').value) || "?",
        baglar: document.getElementById('in_baglar_liste').value || "?", d_hicri: document.getElementById('in_d_hicri').value || "?",
        d_miladi: document.getElementById('in_d_miladi').value || "?", v_hicri: document.getElementById('in_v_hicri').value || "?",
        v_miladi: document.getElementById('in_v_miladi').value || "?", bilgi: document.getElementById('in_bilgi').innerHTML || "",
        kaynak: document.getElementById('in_kaynak').value || "?", guncellemeTarihi: Date.now()
    };
    try {
        if(id) await db.collection("zatlar").doc(id).update(obj); else await db.collection("zatlar").add(obj);
        temizle();
    } catch (e) {
        console.error("kaydet hatası:", e);
        alert(t('save_error') + e.message + t('perm_error_hint'));
    }
}

async function olayKaydet() {
    if (!girisliAdminMi()) {
        alert("Bu işlemi yapmak için ADMIN_EMAIL ile eşleşen bir hesapla giriş yapmış olmalısın. (Şu an giriş yapan hesap: " + (auth.currentUser ? auth.currentUser.email : "yok") + ")");
        return;
    }
    const ad = kelimeBaslariniBuyut(document.getElementById('ol_ad').value.trim());
    if (!ad) { alert(t('need_event')); return; }
    const id = document.getElementById('edit-olay-id').value;
    const obj = { ad: ad, devir: document.getElementById('ol_devir').value, hicri: document.getElementById('ol_hicri').value || "?", miladi: document.getElementById('ol_miladi').value || "?", bilgi: document.getElementById('ol_bilgi').innerHTML || "", kaynak: document.getElementById('ol_kaynak').value || "?", eklenmeTarihi: Date.now(), guncellemeTarihi: Date.now() };

    try {
        if(id) {
            const mevcutOlay = olaylar.find(v => v.id === id);
            if (mevcutOlay && mevcutOlay.eklenmeTarihi) obj.eklenmeTarihi = mevcutOlay.eklenmeTarihi;
            await db.collection("olaylar").doc(id).update(obj);
        } else await db.collection("olaylar").add(obj);
        temizleOlay();
    } catch (e) {
        console.error("olayKaydet hatası:", e);
        alert(t('save_error') + e.message + t('perm_error_hint'));
    }
}

function bagEkle() {
    const isim = kelimeBaslariniBuyut(document.getElementById('in_baglar_isim').value.trim());
    const tip = document.getElementById('in_baglar_secenek').value;
    if (!isim) return;
    const txt = document.getElementById('in_baglar_liste');
    txt.value += (txt.value ? ", " : "") + isim + (tip ? ` (${tip})` : "");
    document.getElementById('in_baglar_isim').value = "";
}

function sayacGuncelle(taId, sayacId) {
    const ta = document.getElementById(taId); const el = document.getElementById(sayacId);
    if (!ta || !el) return;
    const ham = (ta.innerText !== undefined) ? ta.innerText : ta.value;
    const metin = ham.trim();
    const karakter = metin.length;
    const kelime = metin ? metin.split(/\s+/).length : 0;
    el.textContent = `${karakter} karakter · ${kelime} kelime`;
}

async function sil(id, kol) {
    if (!girisliAdminMi()) {
        alert("Bu işlemi yapmak için ADMIN_EMAIL ile eşleşen bir hesapla giriş yapmış olmalısın.");
        return;
    }
    if(confirm(t('confirm_del'))) {
        try {
            await db.collection(kol).doc(id).delete();
        } catch (e) {
            console.error("sil hatası:", e);
            alert(t('save_error') + e.message + t('perm_error_hint'));
        }
    }
}

function duzenle(id) {
    const z = veriler.find(v => v.id === id);
    document.getElementById('edit-id').value = id; document.getElementById('in_devir').value = z.devir || "Asr-ı Saadet";
    document.getElementById('in_ad').value = z.isim; document.getElementById('in_anne').value = z.anne; document.getElementById('in_baba').value = z.baba; document.getElementById('in_es').value = z.es; document.getElementById('in_baglar_liste').value = z.baglar; document.getElementById('in_d_hicri').value = z.d_hicri; document.getElementById('in_d_miladi').value = z.d_miladi; document.getElementById('in_v_hicri').value = z.v_hicri; document.getElementById('in_v_miladi').value = z.v_miladi; metniEditoreYukle('in_bilgi', z.bilgi); document.getElementById('in_kaynak').value = z.kaynak || "";
    document.getElementById('cancel-btn').style.display = "inline-block"; document.getElementById('zat-uyari').style.display = "none";
    document.getElementById('oto_ra').checked = !(!z.isim.toLocaleLowerCase('tr').includes("(ra)") && !z.isim.toLocaleLowerCase('tr').includes("(r.a.)"));
    sayacGuncelle('in_bilgi','in_bilgi_sayac');
    onizlemeGuncelle('zat');
    window.scrollTo(0,0);
}

function duzenleOlay(id) {
    const o = olaylar.find(v => v.id === id);
    document.getElementById('edit-olay-id').value = id; document.getElementById('ol_devir').value = o.devir || "Asr-ı Saadet";
    document.getElementById('ol_ad').value = o.ad; document.getElementById('ol_hicri').value = o.hicri; document.getElementById('ol_miladi').value = o.miladi; metniEditoreYukle('ol_bilgi', o.bilgi); document.getElementById('ol_kaynak').value = o.kaynak || "";
    document.getElementById('olay-cancel-btn').style.display = "inline-block"; document.getElementById('olay-uyari').style.display = "none";
    sayacGuncelle('ol_bilgi','ol_bilgi_sayac');
    onizlemeGuncelle('olay');
    window.scrollTo(0,0);
}

function temizle() { document.querySelectorAll('input[id^="in_"], textarea[id^="in_"]').forEach(i => i.value = ""); document.getElementById('in_bilgi').innerHTML = ""; document.getElementById('in_devir').value = "Asr-ı Saadet"; document.getElementById('edit-id').value = ""; document.getElementById('cancel-btn').style.display = "none"; document.getElementById('zat-uyari').style.display = "none"; if(document.getElementById('oto_ra')) document.getElementById('oto_ra').checked = true; sayacGuncelle('in_bilgi','in_bilgi_sayac'); onizlemeGuncelle('zat'); }
function temizleOlay() { document.querySelectorAll('input[id^="ol_"], textarea[id^="ol_"]').forEach(i => i.value = ""); document.getElementById('ol_bilgi').innerHTML = ""; document.getElementById('ol_devir').value = "Asr-ı Saadet"; document.getElementById('edit-olay-id').value = ""; document.getElementById('olay-cancel-btn').style.display = "none"; document.getElementById('olay-uyari').style.display = "none"; sayacGuncelle('ol_bilgi','ol_bilgi_sayac'); onizlemeGuncelle('olay'); }

function aramaYap() {
    const val = document.getElementById('ara').value;
    const m = val.toLocaleLowerCase('tr');
    const gs = document.getElementById('global-search');
    if (gs && document.activeElement === document.getElementById('ara')) gs.value = val;

    document.querySelectorAll('.search-item').forEach(k => {
        const uyarArama = k.getAttribute('data-search').includes(m);
        const uyarTip = (aktifFiltre === 'tumu' || aktifFiltre === k.getAttribute('data-type'));
        const uyarDevir = (aktifDevir === 'tumu' || aktifDevir === k.getAttribute('data-devir'));
        k.style.display = (uyarArama && uyarTip && uyarDevir) ? 'block' : 'none';
    });
}

function filtreDegistir(tur, btn) {
    aktifFiltre = tur;
    btn.closest('.filter-col').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active-filter'));
    btn.classList.add('active-filter');
    aramaYap();
}

function devirFiltreDegistir(devir, btn) {
    aktifDevir = devir;
    btn.closest('.filter-col').querySelectorAll('.devir-btn').forEach(b => b.classList.remove('active-filter'));
    btn.classList.add('active-filter');
    aramaYap();
}

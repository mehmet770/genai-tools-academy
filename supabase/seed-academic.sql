-- ============================================================
-- GENAI Tools Academy — Akademik Araç Genişletme v2
-- Run AFTER main schema.sql in Supabase SQL Editor
-- ============================================================

-- 1. Kategori kısıtlamasını güncelle
ALTER TABLE tools DROP CONSTRAINT IF EXISTS tools_category_check;
ALTER TABLE tools ADD CONSTRAINT tools_category_check
  CHECK (category IN ('text','image','audio','video','code','data','multimodal','research','writing'));

-- 2. Profil alanları
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS educator_mode boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS institution text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS discipline text;

-- ============================================================
-- ARAŞTIRMA ARAÇLARI (research)
-- ============================================================
INSERT INTO tools (slug, name, tagline, description, category, website_url, features, robot_options) VALUES
(
  'elicit',
  'Elicit',
  'PRISMA uyumlu sistematik literatür tarama ve otomatik veri çıkarımı platformu.',
  'Elicit, Claude ve GPT altyapısını Semantic Scholar''ın 200 milyonluk makale veri tabanıyla birleştirerek araştırma sorularına bilimsel yanıtlar üretir. PICO formatındaki sorular için ilgili makaleleri otomatik filtreler, metodoloji, örneklem ve bulgular gibi yapılandırılmış verileri makalelerden çıkarır; sonuçları CSV olarak dışa aktarır. Sistematik derleme ve meta-analiz sürecini haftalardan günlere indirmesiyle akademisyenler arasında hızla benimsenmektedir.',
  'research',
  'https://elicit.com',
  ARRAY['Sistematik Tarama','PICO Sorguları','Otomatik Veri Çıkarımı','Meta-Analiz Tablosu','CSV Export','Dahil/Dışlama Kriterleri'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Elicit, Semantic Scholar veri tabanındaki 200 milyondan fazla makaleyi AI ile tarayan, PRISMA uyumlu sistematik derleme asistanıdır. Soru girince ilgili makaleleri bulur, veri çıkarır ve tablo oluşturur."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Sistematik derleme, meta-analiz ve kanıta dayalı uygulama araştırmaları için vazgeçilmez. PICO formatında soru gir → dahil/dışlama kriterleri tanımla → her makaleden metodoloji, örneklem, etki büyüklüğü otomatik çıkar → CSV indir ve PRISMA akış şemanı oluştur."},
    {"id":"prompt","label":"Prompt Örneği","content":"Elicit arama kutusu: Does formative feedback improve academic achievement in higher education? | Filtreler: Last 10 years, peer-reviewed only, sample size > 50 | Veri çıkarımı için işaretle: study design, sample size, outcome measure, effect size, country | Sonra: Extract data → CSV export → meta-analiz tablona yapıştır."},
    {"id":"start","label":"Nasıl başlarım?","content":"elicit.com adresine git → Google veya email ile ücretsiz kayıt ol → ''New Notebook'' oluştur → soruyu İngilizce yaz → ''Find Papers'' ile taramayı başlat. İlk 5.000 kredi ücretsiz."}
  ]'::jsonb
),
(
  'consensus',
  'Consensus',
  'Bilimsel topluluğun bir konudaki uzlaşı oranını anlık gösteren AI arama motoru.',
  'Consensus, evet/hayır formatında sorulan araştırma sorularına bilimsel topluluktan kaç makalenin destek verdiğini yüzde olarak gösterir. Sorgu sonuçlarını ''Strongly Supports'', ''Partially Supports'', ''Contradicts'' gibi kategorilere ayırarak kanıt gücünü ölçer. Randomize kontrollü çalışmaları vurgular, sistematik derlemeleri önce sıralar. Eğitim, tıp, psikoloji ve sosyal bilim araştırmalarında müdahale etkililik kararları için güçlü bir başlangıç noktasıdır.',
  'research',
  'https://consensus.app',
  ARRAY['Uzlaşı Yüzdesi','Kanıt Gücü Sıralaması','RCT Önceliği','Makale Filtreleme','Çelişki Tespiti','Ücretsiz Temel Plan'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Consensus, araştırma sorularına bilimsel topluluğun kaçta kaçının destek verdiğini yüzde olarak gösteren AI tabanlı akademik arama motorudur. Her yanıt gerçek makalelere dayanır."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Müdahale çalışmaları için kanıt sentezi, sistematik derleme öncesi hızlı tarama ve ders tasarımında kanıta dayalı yöntem seçimi için kullan. ''Does X improve Y?'' formatında sorular en iyi sonucu verir."},
    {"id":"prompt","label":"Prompt Örneği","content":"Consensus arama kutusu: Does spaced repetition improve long-term retention compared to massed practice? | Çıkan ''Consensus Meter''ı oku → %74 Supports görüyorsan, destekleyen 8 makaleyi tıkla → etki büyüklüklerini karşılaştır → Zıt bulunan 3 makaleyi ayrı dosyaya al → Tartışma bölümün için ''Limitations and Contrary Evidence'' alt başlığı oluştur."},
    {"id":"start","label":"Nasıl başlarım?","content":"consensus.app''e git → ücretsiz hesap oluştur → soruyu İngilizce soru cümlesi formatında yaz → Consensus Meter ile uzlaşı oranını gör → destekleyen ve çürüten makaleleri filtrele."}
  ]'::jsonb
),
(
  'researchrabbit',
  'ResearchRabbit',
  'Görsel atıf ağı ile ilgili makaleleri ve yazarları interaktif haritada keşfet.',
  'ResearchRabbit, temel makaleleri merkeze alarak aralarındaki atıf ilişkilerini interaktif bir ağ haritasında görselleştirir. ''Similar Papers'' algoritması, kullanıcının koleksiyonuna göre önerileri kişiselleştirir; ''Prior Works'' ile alanın köklü referanslarına, ''Derivative Works'' ile son çalışmalara ulaşılır. Araştırmacıların yeni bir alana girişte harcadığı keşif süresini önemli ölçüde kısaltan ücretsiz bir araçtır.',
  'research',
  'https://researchrabbitapp.com',
  ARRAY['Görsel Atıf Ağı','Kişiselleştirilmiş Öneri','Zotero Entegrasyonu','Yazar Ağı','Takip Bildirimleri','Ücretsiz'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"ResearchRabbit, makaleler arasındaki atıf ilişkilerini görsel ağ haritasında gösteren ücretsiz bir araştırma keşif aracıdır. Bir makaleyi ekle, ağı genişlet."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Tez literatür taraması için ideal başlangıç noktası: Alanın 1-2 seminal makalesini ekle → ''All Connected Papers'' görünümünde kümeleri incele → Her kümede hangi alt problem ele alınıyor tespit et → Zotero ile senkronize et."},
    {"id":"prompt","label":"Nasıl Kullanılır?","content":"1) researchrabbitapp.com''a giriş yap → 2) ''+ Add Papers'' → DOI veya makale adı ile temel makaleyi ekle → 3) ''Similar Papers'' sekmesini aç → 4) Ağdaki büyük düğümler = çok atıf alan çalışmalar → 5) Zaman filtresiyle alanın nasıl evrildiğini gör → 6) İlgilileri işaretle → Zotero''ya aktar."},
    {"id":"start","label":"Nasıl başlarım?","content":"researchrabbitapp.com → ücretsiz hesap oluştur → Zotero bağlantısını kur → İlk koleksiyonu oluştur → Temel makaleni DOI ile ekle."}
  ]'::jsonb
),
(
  'semantic-scholar',
  'Semantic Scholar',
  'Allen Institute''un AI destekli, 200 milyondan fazla akademik makaleye ücretsiz erişim motoru.',
  'Allen Institute for AI tarafından geliştirilen Semantic Scholar, anlamsal anlama teknolojisiyle arama kalitesini artırır. Her makale için AI üretimi TL;DR özeti, etki faktörü, atıf ağı ve erişilebilir PDF bağlantısı sunar. Semantic Reader özelliği, makaleyi okurken terminoloji tanımları, referans önizlemeleri ve TLDR bölümleriyle etkileşimli okuma deneyimi sağlar.',
  'research',
  'https://semanticscholar.org',
  ARRAY['200M+ Makale','AI TL;DR Özet','Semantic Reader','Atıf Ağı','Ücretsiz PDF','h-index Analizi'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Semantic Scholar, Allen Institute for AI''ın geliştirdiği, 200 milyondan fazla makaleye erişim sağlayan AI destekli akademik arama motorudur. Her makale için otomatik özet ve etki analizi içerir."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Bir araştırmacının yayın etkisini ölç: Yazar adını ara → h-index, atıf sayısı ve yıllara göre etki eğrisini incele → ''Highly Influential Papers'' listesini gör. Literatür tarama için ''Topics'' filtresini kullan."},
    {"id":"prompt","label":"Arama Stratejisi","content":"Etkili arama örneği: semanticscholar.org → Arama: ''formative assessment higher education meta-analysis'' → Filtreler: Year 2018-2024, Review Articles, Computer Science + Education → Çıkan ilk 10 makaleyi ''Save'' ile koleksiyona al → Her makalenin ''References'' sekmesinden temel kaynakları bul → Semantic Reader ile makaleyi aç ve AI özetini oku."},
    {"id":"start","label":"Nasıl başlarım?","content":"semanticscholar.org → ücretsiz hesap oluştur → kütüphaneyi kur → makale uyarıları ayarla. Yeni atıf bildirimleri için abone ol."}
  ]'::jsonb
),
(
  'notebooklm',
  'NotebookLM',
  'Google''ın kaynaklarına dayalı AI araştırma asistanı — halüsinasyon riski sıfır.',
  'NotebookLM, yüklenen PDF, Google Docs, YouTube videosu veya web sayfalarına dayalı olarak yanıt verir; kaynak dışından bilgi uydurmaz. 50 kaynak ve 25 milyon kelimeye kadar proje kapasitesiyle tez veya derleme çalışmaları için dev bir araştırma defteri görevi görür. ''Audio Overview'' özelliğiyle kaynakları podcast formatında özetler; ''Study Guide'' ile sınav hazırlık materyali üretir.',
  'research',
  'https://notebooklm.google.com',
  ARRAY['Kaynak Bazlı Yanıt','Audio Overview','Study Guide','50 Kaynak','25M Kelime','Ücretsiz'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"NotebookLM, yüklediğin kaynaklara dayalı yanıt veren Google''ın AI araştırma asistanıdır. Kaynak dışına çıkmaz — her yanıt belgendeki gerçek metne dayanır, halüsinasyon riski yoktur."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Tez literatür taraması için: 15-20 ilgili makaleyi PDF olarak yükle → ''Bu kaynakların ortak bulguları ve çelişkileri nelerdir?'' diye sor → kaynak atıflı yanıt al → ''Study Guide'' üret → ''Audio Overview'' ile dinleyerek not al."},
    {"id":"prompt","label":"Prompt Örneği","content":"NotebookLM''de 10 makale yükledikten sonra sıraya sor: 1) ''Bu makalelerde kullanılan araştırma yöntemlerini karşılaştır ve ortak metodolojik sınırlılıkları listele.'' 2) ''Hangi makaleler birbiriyle çelişen bulgular sunuyor? Nedenleri neler olabilir?'' 3) ''Bu literatürdeki en önemli araştırma boşluğunu tespit et ve gelecek çalışma için 3 öneri sun.'' Her yanıtta kaynak numarası verecektir."},
    {"id":"start","label":"Nasıl başlarım?","content":"notebooklm.google.com → Google hesabınla giriş → ''New Notebook'' → PDF veya bağlantı ekle → ''Chat'' bölümünden araştırma sorularını sor. Tamamen ücretsiz."}
  ]'::jsonb
),
(
  'connected-papers',
  'Connected Papers',
  'Görsel literatür haritası — makalenin atıf ağını ve tarihsel evrimini grafikte gör.',
  'Connected Papers, bir merkez makaleyi temel alarak ilgili tüm çalışmaları görsel bir grafikte sunar. Düğümlerin boyutu makale etkisini, kenarlar ise alıntı ilişkilerini temsil eder. ''Prior Works'' bölümü temel referansları, ''Derivative Works'' bölümü ise merkez makaleye sonradan atıfta bulunan çalışmaları listeler. Yeni bir alana girerken ''hangi makaleleri okuyayım?'' sorusunu birkaç dakikada yanıtlar.',
  'research',
  'https://connectedpapers.com',
  ARRAY['Görsel Graf','Prior Works','Derivative Works','Yıl Filtresi','Atıf Yoğunluğu','PDF Bağlantısı'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Connected Papers, bir makaleyi merkez alarak ilgili tüm çalışmaları görsel ağ grafiğinde gösteren araştırma keşif aracıdır. Büyük düğümler = yüksek etki."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Sistematik derleme öncesi alan haritası çıkarmak için ideal. Alanın en etkili 1-2 makalesini gir → grafikteki kümeleri incele → her küme bir alt araştırma sorusuna karşılık gelir → ''Prior Works''ten alanın tarihsel kökenlerini → ''Derivative Works''ten son gelişmeleri oku."},
    {"id":"prompt","label":"Nasıl Kullanılır?","content":"connectedpapers.com → ''Build a graph for'' kutusuna makale başlığını veya DOI''yi yapıştır → Graf yüklenince: a) En büyük düğümleri önce oku (yüksek etki), b) Renk = yıl: sarı=eski, mavi=yeni, c) ''Prior Works'' ile temel kaynaklara ulaş, d) ''Derivative Works'' ile son gelişmeleri bul. Aylık 5 ücretsiz graf hakkın var."},
    {"id":"start","label":"Nasıl başlarım?","content":"connectedpapers.com → ücretsiz hesap → makale başlığı veya DOI ile ilk grafı oluştur. Ayda 5 graf ücretsiz; $3/ay planı sınırsız graf sunar."}
  ]'::jsonb
),
(
  'scite',
  'Scite.ai',
  'Alıntı bağlamını gösteren platform — makaleye destek mi itiraz mı? Atıfta söylüyor.',
  'Scite.ai, geleneksel atıf sayımının ötesine geçerek her atıfın bağlamını gösterir: Atıf yapan makale, kaynak çalışmayı destekliyor mu (Supporting), çürütüyor mu (Contrasting) yoksa salt bahsediyor mu (Mentioning)? Bu sayede bir makalenin bilimsel sağlamlığı "kaç atıf aldı?" yerine "kaç destekleyici / itiraz edici atıf aldı?" sorusuyla değerlendirilir. Geri çekilmiş veya ciddi itiraz almış çalışmaları tespit etmek için kritiktir.',
  'research',
  'https://scite.ai',
  ARRAY['Atıf Bağlamı','Destek/İtiraz Ayrımı','Geri Çekilme Uyarısı','Asistan Modu','Tarayıcı Eklentisi','API'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Scite.ai, makalelere yapılan atıfların bağlamını analiz eden platformdur. Her atıfın ''destekliyor mu, çürütüyor mu?'' sorusunu yanıtlar. Sahte veya güvenilmez kaynakları tespit etmek için kritik."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Başvurduğun makalenin bilimsel itibarını ölç: scite.ai''da ara → Supporting vs Contrasting atıf oranına bak → Contrasting atıfları tıkla, itiraz gerekçelerini oku → Geri çekilmiş ise uyarı görünür. Kaynaklarının güvenilirliğini 5 dakikada doğrula."},
    {"id":"prompt","label":"Doğrulama Stratejisi","content":"Eleştirel kaynak değerlendirmesi için adımlar: 1) scite.ai''a makale DOI''sini gir, 2) Supporting: X, Contrasting: Y oranına bak (X >> Y ise güvenilir), 3) En çok itiraz eden 3 makaleyi oku ve itiraz gerekçelerini not al, 4) Scite Assistant''da sor: ''What are the main criticisms of [makale adı] according to citing literature?'' → Yanıtı tartışma bölümüne ekle."},
    {"id":"start","label":"Nasıl başlarım?","content":"scite.ai → ücretsiz tarayıcı eklentisini kur → makale okurken atıf bağlamlarını anında gör. Derinlemeli analiz için $20/ay planı gerekli."}
  ]'::jsonb
),
(
  'litmaps',
  'Litmaps',
  'Zaman çizelgeli atıf haritası — alanın tarihsel gelişimini canlı olarak izle.',
  'Litmaps, makaleleri zaman çizelgesi boyunca görselleştirerek alanın nasıl evrildiğini kronolojik olarak gösterir. Yeni makale yayımlandıkça otomatik bildirim gönderir; kişisel koleksiyonla haritalar güncellenir. ''Discover'' özelliği, mevcut koleksiyona göre henüz keşfedilmemiş ilgili makaleleri önerir. Tez çalışmasında alanın tarihsel anlatısını kurmak için son derece etkilidir.',
  'research',
  'https://app.litmaps.com',
  ARRAY['Zaman Çizelgesi Haritası','Otomatik Bildirim','Yeni Makale Keşfi','Koleksiyon Takibi','İşbirliği','PDF Entegrasyonu'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Litmaps, araştırma alanının tarihsel gelişimini zaman çizelgesi üzerinde görsel olarak gösteren atıf haritası aracıdır. Yeni makale eklenince seni otomatik bilgilendirir."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Tezin tarihsel bağlamını kurmak için: Temel makalelerini Litmaps''e ekle → Zaman çizelgesinde alan nasıl gelişmiş? → 2010''da başlayan bir tartışma 2020''de nereye geldi? → ''Discover'' ile henüz görmediğin ilgili makaleleri bul."},
    {"id":"prompt","label":"Kullanım Akışı","content":"Adım adım tez literatür analizi: 1) app.litmaps.com → yeni harita oluştur, 2) Tezinle ilgili 5-10 makalenin DOI''sini ekle, 3) Zaman çizelgesini görüntüle → hangi yılda atıf patlaması yaşandı?, 4) O yıldaki makaleleri incele — neden bu kadar etkiliydi?, 5) ''Alerts'' açık bırak → yeni ilgili yayın çıkınca email al."},
    {"id":"start","label":"Nasıl başlarım?","content":"app.litmaps.com → ücretsiz hesap → ''New Seed Map'' → DOI veya makale adı ile ilk haritanı oluştur. Temel özellikler ücretsiz."}
  ]'::jsonb
),
(
  'scispace',
  'SciSpace (Typeset)',
  'AI ile PDF makaleler üzerinde soru-cevap, tablo okuma ve terminoloji açıklama.',
  'SciSpace, araştırma makalelerini etkileşimli okuma deneyimine dönüştürür. Makale metnindeki herhangi bir cümleyi veya tabloyu seçerek açıklamasını, denklemlerin anlamını veya metodolojik adımların gerekçesini sorabilirsiniz. Copilot özelliği, makale içindeki sorulara kaynak göstererek yanıt verir. Yüzlerce PDF arasında arama yapabilen ''Literature Review'' modu, araştırma genelinde kalıpları tespit eder.',
  'research',
  'https://typeset.io',
  ARRAY['PDF Soru-Cevap','Tablo Açıklama','Denklem Yorumlama','Literatür Tarama','Terminoloji Sözlüğü','Çoklu Makale Analizi'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"SciSpace, araştırma makalelerini etkileşimli okuma deneyimine dönüştürür. Anlamadığın cümleyi veya tabloyu seçin, AI ile konuşarak anlayın."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Karmaşık metodoloji bölümlerini anlamak için: Makaleyi SciSpace''e yükle → İstatistik tablosunu seç → ''Bu tabloda p < 0.05 olan değerlerin anlamı ne?'' diye sor → Denklemlerin bağlamını öğren → Metodoloji bölümündeki teknik terimleri anında aç."},
    {"id":"prompt","label":"Prompt Örneği","content":"SciSpace''e makale yükledikten sonra: 1) ''Bu çalışmanın araştırma tasarımı neden bu hipotezi test etmek için uygun?'' 2) ''Tablo 3''teki regresyon katsayılarını sıradan bir dille açıkla.'' 3) ''Bu çalışmanın iç geçerliğini tehdit eden faktörler neler?'' 4) ''Metodolojide hangi alternatif yaklaşım kullanılabilirdi?'' — Yanıtlar makaledeki gerçek metne atıfla gelir."},
    {"id":"start","label":"Nasıl başlarım?","content":"typeset.io → ücretsiz hesap oluştur → PDF yükle veya DOI gir → sağ panelde Copilot ile konuşmaya başla. Günlük 5 soru ücretsiz."}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  description   = excluded.description,
  features      = excluded.features,
  robot_options = excluded.robot_options,
  tagline       = excluded.tagline;

-- ============================================================
-- YAZIM VE DİL ARAÇLARI (writing)
-- ============================================================
INSERT INTO tools (slug, name, tagline, description, category, website_url, features, robot_options) VALUES
(
  'grammarly',
  'Grammarly',
  'AI destekli dilbilgisi, ton ve akademik yazım kalitesi denetçisi.',
  'Grammarly, dilbilgisi ve yazım hatalarının ötesinde netlik, ton, argüman tutarlılığı ve akademik üslup konularında geri bildirim verir. Akademik yazım modunda pasif cümle oranı, jargon yoğunluğu ve paragraf akışı analiz edilir. Inlining özellikleriyle Google Docs, Word ve web editörlerinde gerçek zamanlı düzeltme yapar. Premium planda intihal kontrolü, kaynak önerisi ve kitleye özel ton ayarı bulunur.',
  'writing',
  'https://grammarly.com',
  ARRAY['Dilbilgisi Denetimi','Ton Analizi','Akademik Mod','Plagiarism Checker','Netlik Puanı','Word/Docs Entegrasyonu'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Grammarly, dilbilgisi düzeltmenin ötesinde ton, netlik ve akademik uygunluk konularında gerçek zamanlı geri bildirim veren AI yazım asistanıdır."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Akademik makale revizyonu için: hedef kitleyi ''Academic'' olarak ayarla → Clarity önerilerinde karmaşık cümleleri basitleştir → Engagement''ta tekrarlanan kelimeler → Delivery''de pasif/aktif cümle dengesine bak → teslim öncesi Plagiarism Checker çalıştır."},
    {"id":"prompt","label":"Kullanım Stratejisi","content":"Grammarly Writing Assistant kullanım akışı: 1) Goals → Audience: Expert, Formality: Formal, Domain: Academic 2) Makale bölümünü yapıştır 3) Sarı uyarılar = anlaşılırlık sorunu → her birini oku ve karar ver 4) Kırmızı = dilbilgisi hatası → mutlaka düzelt 5) Score → 90 üstü hedefle 6) Plagiarism → teslimden önce mutlaka çalıştır. NOT: Önerileri körü körüne kabul etme; her değişikliği gerekçesiyle değerlendir."},
    {"id":"start","label":"Nasıl başlarım?","content":"grammarly.com → ücretsiz plan → Chrome eklentisi + Word eklentisi kur. Akademik yazım için Premium ($12/ay) gerekli. Öğrenci indirimi için edu email ile kayıt ol."}
  ]'::jsonb
),
(
  'deepl',
  'DeepL',
  'Akademik terminoloji ve bağlamı en iyi koruyan AI çeviri motoru.',
  'DeepL, nöral makine çeviri teknolojisinde rakiplerinin önündedir. Akademik metinlerdeki terminolojiyi, pasif cümle yapılarını ve disiplin özgül ifadeleri büyük ölçüde doğru çevirir. Glossary özelliği ile kullanıcı tanımlı terim sözlükleri oluşturularak teknik terminoloji tutarlılığı sağlanır. PDF, Word ve PowerPoint dosyalarını biçimlendirmeyi koruyarak çevirir. 29 dili destekler.',
  'writing',
  'https://deepl.com',
  ARRAY['Akademik Terminoloji','Glossary Özelliği','PDF/Word Çeviri','29 Dil','Bağlam Koruması','API Erişimi'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"DeepL, akademik metinlerdeki terminoloji ve bağlamı en doğru şekilde çeviren AI çeviri motorudur. Glossary ile alan terminolojini kalıcı olarak tanımlarsın."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Yabancı dil makale çevirisi için: Glossary oluştur (alan terminolojisi: ''scaffolding'' = ''iskele kurama'') → PDF''i yükle → biçimlendirme korunarak çevir → kritik bölümlerde terminoloji tutarlılığını elle kontrol et → çevirilen metni kaynak makaleyle yan yana karşılaştır."},
    {"id":"prompt","label":"Glossary Oluşturma","content":"Pedagoji alanı için örnek DeepL Glossary girişleri: scaffolding → iskele kurama | formative assessment → biçimlendirici değerlendirme | metacognition → üstbiliş | differentiated instruction → farklılaştırılmış öğretim | zone of proximal development → yakın gelişim alanı. Bu terimler Glossary''e eklendikten sonra tüm çevirilerinizde tutarlı kullanılır. Makale çevirisi öncesi mutlaka alan Glossary''ini kur."},
    {"id":"start","label":"Nasıl başlarım?","content":"deepl.com → ücretsiz hesap → Glossary oluştur → PDF yükle ve çevir. Ücretsiz planda aylık 3 PDF. DeepL Pro Academic plan öğrencilere indirimli."}
  ]'::jsonb
),
(
  'quillbot',
  'QuillBot',
  'Akademik parafraza, özet ve dilbilgisi denetimi için AI yazım asistanı.',
  'QuillBot, akademisyenlerin en çok kullandığı parafraz aracıdır. ''Academic'' modunda orijinal anlamı koruyarak ifadeyi akademik üsluba uygun biçimde yeniden yazarken terminoloji seçimine müdahale edilebilir. Özet aracı uzun metinleri belirli kelime sayısına indirir; dilbilgisi denetleyicisi özgün geri bildirim üretir. Alıntı üretici APA, MLA ve Chicago formatlarında anında kaynak formatlar.',
  'writing',
  'https://quillbot.com',
  ARRAY['Akademik Parafraz','7 Yazım Modu','Özet Aracı','Alıntı Üretici','Dilbilgisi Denetimi','Word Entegrasyonu'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"QuillBot, akademik metinleri yeniden ifade etmek, özetlemek ve kaynak formatlamak için kullanılan AI yazım asistanıdır. Akademik mod, ifadeyi bilimsel üsluba taşır."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Metin yeniden ifade: Modu ''Formal'' veya ''Academic'' yap → Paragrafı yapıştır → Değiştirilmesini istemediğin teknik terimleri kilitle → Üretilen metni orijinalle karşılaştır. Özetleme: Makale metodoloji bölümünü yapıştır → kelime sayısını %40''a düşür → ana bulguları koru."},
    {"id":"prompt","label":"Doğru Kullanım Rehberi","content":"UYARI: QuillBot akademik dürüstlük riski taşır. Etik kullanım: 1) Kendi yazdığın metni iyileştirmek için kullan 2) Anladığın bir kaynağı kendi kelimelerinle ifade et, SONRA QuillBot ile netleştir 3) Her paragrafı kaynakla karşılaştır — anlam kayması var mı? 4) Kurumun AI kullanım politikasını oku 5) Alıntı Üretici: DOI gir → APA 7 formatını al → kaynakçana ekle."},
    {"id":"start","label":"Nasıl başlarım?","content":"quillbot.com → ücretsiz hesap → Paraphraser''da Academic modunu seç. Premium ($9.95/ay) tüm modları ve Word eklentisini açar."}
  ]'::jsonb
),
(
  'writefull',
  'Writefull',
  'Akademik yayın veri tabanına dayalı, bilimsel yazım için AI dil düzeltici.',
  'Writefull, Wiley, Springer ve Elsevier''den gelen milyarlarca akademik cümleyi karşılaştırma veri tabanı olarak kullanarak yazar metni için en uygun akademik ifadeleri önerir. ''Revise & Resubmit'' gibi hakem yorumlarına yanıt yazmaya yardımcı olur. "Bu ifade akademik metinlerde ne sıklıkla kullanılıyor?" sorusunu veri tabanı frekansıyla yanıtlar. Overleaf entegrasyonu LaTeX kullanıcıları için kritik bir özelliktir.',
  'writing',
  'https://writefull.com',
  ARRAY['Akademik Veri Tabanı','Overleaf Entegrasyonu','Hakem Yanıtı','Frekans Analizi','Parafraz','Dilbilgisi'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Writefull, milyarlarca akademik yayından oluşan veri tabanına göre bilimsel yazımı iyileştiren AI dil asistanıdır. Her önerisi gerçek akademik kullanım örneklerine dayanır."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Overleaf''te LaTeX makale yazıyorsan Writefull eklentisi doğrudan entegre olur. Sonuçlar bölümün için: ''The results indicate...'' yerine veri tabanında en sık kullanılan ifadeyi önerir. Hakem yorumlarına yanıt yazarken ''We have revised the section in response to your concern about...'' gibi standart akademik kalıpları öğretir."},
    {"id":"prompt","label":"Hakem Yanıtı Örneği","content":"Writefull''de Reviewer Response Generator kullanımı: 1) Hakem yorumunu yapıştır: ''The theoretical framework is not clearly articulated'' 2) ''Generate response'' tıkla 3) Üretilen yanıt: ''We thank Reviewer 2 for this insightful comment. We have substantially revised Section 2.1 to provide a more explicit account of our theoretical framework, adding [X] to page [Y].'' 4) Kendi değişikliklerini ekle → profesyonel yanıt hazır."},
    {"id":"start","label":"Nasıl başlarım?","content":"writefull.com → ücretsiz plan (Overleaf + Word eklentisi) → akademik yazıya entegre et. Tam özellikler için $9.99/ay. Kurumsal lisans için üniversite kütüphanesine danış."}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  description   = excluded.description,
  features      = excluded.features,
  robot_options = excluded.robot_options,
  tagline       = excluded.tagline;

-- ============================================================
-- ÇOKLU MODLU / METİN ARAÇLARI (multimodal / text)
-- ============================================================
INSERT INTO tools (slug, name, tagline, description, category, website_url, features, robot_options) VALUES
(
  'gemini',
  'Gemini',
  'Google''ın çok modlu AI modeli — metin, görüntü, ses ve video anlayan asistan.',
  'Gemini, Google DeepMind tarafından geliştirilen çok modlu büyük dil modelidir. Gemini 1.5 Pro versiyonu 1 milyon token bağlam penceresiyle uzun belgeleri, tam kitapları veya çok saatlik konuşma kayıtlarını tek seferde analiz edebilir. Google Workspace''le derin entegrasyon (Docs, Sheets, Slides, Gmail) akademik iş akışlarına doğrudan uygulanır. Gerçek zamanlı web araması ve Google Lens görüntü analizi ile çok modlu akademik kullanım senaryoları için kapsamlı bir platformdur.',
  'multimodal',
  'https://gemini.google.com',
  ARRAY['1M Token Bağlam','Google Workspace','Gerçek Zamanlı Arama','Görüntü Analizi','Çok Dilli','Kod Üretimi'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Gemini, Google''ın 1 milyon token bağlam penceresine sahip çok modlu AI modelidir. Metin, görüntü, ses ve videoyu anlayan Gemini, Google Docs ve Sheets''le doğrudan entegre çalışır."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Tam kitap analizi: PDF veya Google Drive''daki belgeni yükle → ''Bu kitabın metodoloji yaklaşımını eleştirel olarak değerlendir'' de. Sheets entegrasyonu: Araştırma verisini Sheets''e yükle → Gemini ile ''Bu veri için hangi istatistiksel test uygun?'' diye sor."},
    {"id":"prompt","label":"Prompt Örneği","content":"Google Docs''ta makale taslağı yazarken Gemini yan panel kullanımı: ''Yazdığım bu giriş bölümünü oku ve şunları söyle: 1) Araştırma sorusu yeterince net mi? 2) Literatür bağlamı eksik olan hangi boyutlar var? 3) Metodoloji ön-açıklaması mantıksal sırayla mı sunuluyor? 4) Bu bölümde hangi 3 kaynağa atıf yapılmalı? APA 7 formatında öner.'' — Gemini doğrudan Docs metnini okuyarak yanıt verir."},
    {"id":"start","label":"Nasıl başlarım?","content":"gemini.google.com → Google hesabınla giriş yap. Gemini Advanced için Google One AI Premium ($19.99/ay). Eğitim kurumları Google Workspace for Education üzerinden erişim sağlayabilir."}
  ]'::jsonb
),
(
  'perplexity',
  'Perplexity AI',
  'Her yanıtta kaynak belirten, gerçek zamanlı web erişimli araştırma asistanı.',
  'Perplexity AI, GPT-4 ve Claude altyapılarını gerçek zamanlı web aramasıyla birleştirerek kaynaklı yanıtlar üretir. ''Academic'' modunda yalnızca hakemli makalelere başvurur. Her iddiayı atıf numarasıyla destekler; numaraya tıklandığında kaynak makale açılır. Pro plan, ''Spaces'' özelliğiyle araştırma projesine özel bilgi tabanı oluşturur. Akademisyenler için ChatGPT''ye kıyasla en önemli fark: üretilen her bilginin anında doğrulanabilir kaynağa sahip olmasıdır.',
  'text',
  'https://perplexity.ai',
  ARRAY['Kaynaklı Yanıt','Akademik Mod','Gerçek Zamanlı Arama','Spaces','Pro Arama','DOI Desteği'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Perplexity AI, her yanıtta kaynaklarını belirten gerçek zamanlı web araştırma asistanıdır. Academic modunda yalnızca hakemli makalelere başvurur."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Güncel literatür özeti için: Perplexity''de Academic mod seç → ''Son 3 yılda [konu]''da yapılan meta-analiz çalışmalarını özetle ve her iddiayı kaynak ver'' → Her atıf numarasını tıkla ve kaynağı doğrula → Şüpheli bilgileri CrossRef''te kontrol et."},
    {"id":"prompt","label":"Prompt Örneği","content":"Perplexity Academic modunda örnek sorgu: ''What does recent empirical research (2020-2024) say about the effectiveness of retrieval practice compared to re-reading for long-term retention in higher education? Summarize findings with effect sizes, note any contradictory evidence, and cite each claim with DOI or URL.'' — Yanıttaki her atıf numarasını tıklayarak kaynağı doğrula. Güvenilmez kaynak içeriyorsa ''Not: Bu kaynağı Semantic Scholar''da doğrula'' notunu ekle."},
    {"id":"start","label":"Nasıl başlarım?","content":"perplexity.ai → ücretsiz hesap → sağ üst köşeden ''Academic'' modunu seç. Pro ($20/ay) ile sınırsız GPT-4 araması ve Spaces erişimi açılır."}
  ]'::jsonb
),
(
  'microsoft-copilot',
  'Microsoft Copilot',
  'Office 365 uygulamalarına entegre AI asistanı — akademik iş akışlarını otomatikleştir.',
  'Microsoft Copilot, Word, Excel, PowerPoint, Outlook ve Teams''i AI ile güçlendirir. Word''de makale taslağı oluşturur, mevcut metni özetler veya yeniden yapılandırır. Excel''de veri analizi kodu yazar ve formüller üretir. PowerPoint''te içerikten otomatik sunum tasarlar. Teams''de toplantı özetleri üretir ve görev listesi çıkarır. GPT-4 altyapısıyla Bing arama entegre olup kullanıcı kurumsal verilerine Microsoft güvenlik politikalarıyla korunarak erişir.',
  'multimodal',
  'https://copilot.microsoft.com',
  ARRAY['Word Entegrasyonu','Excel Analizi','PowerPoint Üretimi','Teams Özeti','Bing Arama','Kurumsal Güvenlik'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Microsoft Copilot, Office 365 uygulamalarına entegre AI asistanıdır. Word''de metin üretir, Excel''de analiz yapar, PowerPoint''te sunum tasarlar. Kurumsal veri güvenliği Microsoft altyapısında korunur."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Word''de makale revizyonu: Metin seç → ''Revise'' → ''Make more formal and academic'' → değişiklikleri karşılaştır. Excel''de anket verisi: Satır verilerini yükle → ''Describe the distribution and highlight outliers'' → pivot tablo otomatik oluşsun. PowerPoint''te konferans sunumu: Outline yapıştır → ''Create a professional 12-slide presentation'' → template seç."},
    {"id":"prompt","label":"Word''de Prompt Örneği","content":"Word''de Copilot yan panelini aç → ''Draft with Copilot'' → şu talimatı gir: ''Bu makale taslağımın giriş bölümünü oku. Araştırma boşluğunu daha belirgin hale getir, katkı ifadesini son paragrafa taşı ve akademik bir okuyucu için daha ikna edici bir açılış cümlesi yaz. Referans listemi APA 7''ye uygun mu diye kontrol et.'' — Copilot dokümanı okuyarak spesifik geri bildirim verir."},
    {"id":"start","label":"Nasıl başlarım?","content":"Microsoft 365 aboneliğine Copilot eklentisi gerekli. Üniversiteler Microsoft 365 Education lisansını IT biriminden sağlayabilir. copilot.microsoft.com ücretsiz web sürümünü de sunar."}
  ]'::jsonb
),
(
  'notion-ai',
  'Notion AI',
  'Araştırma notları, literatür takvimi ve proje yönetimini AI ile entegre eden platform.',
  'Notion AI, Notion''ın kapsamlı not alma ve proje yönetimi platformunu AI ile güçlendirir. Araştırma notlarını otomatik özetler, toplantı tutanaklarından görev listesi çıkarır ve tüm çalışma alanında arama yaparak bağlantılar kurar. Akademisyenler için literatür takvimi, araştırma günlüğü ve tez yazım takibi şablonları mevcuttur. Q&A özelliği, tüm Notion sayfaları üzerinde ChatGPT benzeri soru-cevap yapılmasını sağlar.',
  'text',
  'https://notion.so',
  ARRAY['Not Özetleme','Görev Listesi','Q&A Araması','Şablonlar','Veritabanı','İşbirliği'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Notion AI, araştırma notlarını, proje takibini ve literatür organizasyonunu AI ile bütünleştiren çalışma ortamıdır. Tüm notlar üzerinde doğal dil araması ve otomatik özet yapabilirsiniz."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Tez araştırma sistemi kur: Her makale için Notion''da kart oluştur (başlık, özet, metodoloji, bulgular, alıntı) → AI ile ''Bu 20 makalenin ortak temalarını özetle'' → Proje takvimini Gantt görünümüne al → Günlük araştırma günlüğü tut → Tez yazım ilerleme göstergesini izle."},
    {"id":"prompt","label":"Q&A Prompt Örneği","content":"Notion Q&A kullanımı için tüm literatür notlarını Notion''a aktardıktan sonra: ''/ask Bu notlarda hangi yazarlar sosyal yapılandırmacı teoriyi eleştiriyor ve hangi alternatif çerçeveleri öneriyorlar?'' → Notion AI tüm sayfalarınızı tarayarak kaynaklı yanıt üretir. Aynı şekilde: ''/ask Tezimde henüz ele almadığım ama notlarımda geçen araştırma soruları hangileri?'' ile boşlukları tespit edin."},
    {"id":"start","label":"Nasıl başlarım?","content":"notion.so → ücretsiz plan (bireysel kullanım) → Notion AI için Plus planı ($8/ay). Akademik şablonlar için ''Notion for Students'' sayfasını ziyaret et."}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  description   = excluded.description,
  features      = excluded.features,
  robot_options = excluded.robot_options,
  tagline       = excluded.tagline;

-- ============================================================
-- VERİ ANALİZİ ARAÇLARI (data)
-- ============================================================
INSERT INTO tools (slug, name, tagline, description, category, website_url, features, robot_options) VALUES
(
  'julius-ai',
  'Julius AI',
  'Kod yazmadan istatistiksel analiz, görselleştirme ve veri yorumlama.',
  'Julius AI, veri bilimi bilgisi olmayan araştırmacıların sohbet arayüzüyle istatistiksel analiz yapmasını sağlar. Excel, CSV, SPSS ve R veri dosyalarını kabul eder; Python ve R kodu otomatik oluşturur, sonuçları akademik dil ve görselleştirmeyle sunar. Regresyon, ANOVA, faktör analizi, Cronbach alfa ve ki-kare gibi temel testleri destekler. Üretilen kodu açık kaynaklı ortamlarda (Jupyter, R) bağımsız olarak doğrulamak mümkündür.',
  'data',
  'https://julius.ai',
  ARRAY['Excel/CSV/SPSS','Regresyon Analizi','ANOVA','Faktör Analizi','Cronbach Alfa','Görselleştirme','Python/R Kodu'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Julius AI, kod yazmadan sohbet arayüzüyle istatistiksel analiz yapmanı sağlar. Veriyi yükle, ne istediğini söyle, sonuçları yorumla."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Eğitim araştırması için anket verisi analizi: CSV yükle → ''Bu Likert ölçeği verisi için Cronbach alfa ve faktör analizi yap'' → APA tablosu üret → ''Cinsiyet ve başarı puanı arasında istatistiksel fark var mı?'' → bağımsız örneklem t-testi otomatik çalışır."},
    {"id":"prompt","label":"Prompt Örneği","content":"Julius AI''a veriyi yükledikten sonra adım adım: 1) ''Bu veri setinin temel betimsel istatistiklerini (ortalama, SS, çarpıklık, basıklık) hesapla ve normallik varsayımını test et.'' 2) ''Sonuçlara göre parametrik mi yoksa parametrik dışı test mi uygulamalıyım?'' 3) ''[Test adı] analizi yap ve sonuçları APA 7 formatında tablo olarak sun.'' 4) ''Bu bulguları doktora tezi metodoloji bölümü için 100 kelimeyle yorumla.'' — Her adımda üretilen Python kodunu da görebilirsiniz."},
    {"id":"start","label":"Nasıl başlarım?","content":"julius.ai → ücretsiz deneme (sınırlı) → Pro plan $20/ay, akademik indirim için edu email ile kayıt. Veriyi CSV olarak hazırla ve yükle."}
  ]'::jsonb
),
(
  'wolfram-alpha',
  'Wolfram Alpha',
  'Hesaplama bilgisi motoru — matematik, istatistik ve bilimsel hesaplamalar için otorite.',
  'Wolfram Alpha, sembolik hesaplama, istatistik, matematik, fizik, kimya ve mühendislik konularında adım adım çözüm üretir. Wolfram|Alpha Pro ile fotoğraf ve PDF üzerinden hesaplama, veri görselleştirme ve özel çözüm süreci incelenebilir. ChatGPT''nin sayısal hatalara karşı aksine, Wolfram hesaplamaları deterministik ve doğrulanabilirdir. Akademik çalışmalarda diferansiyel denklemler, hipotez testleri ve küresel veri sorguları için referans noktasıdır.',
  'data',
  'https://wolframalpha.com',
  ARRAY['Sembolik Hesaplama','Adım Adım Çözüm','İstatistik','Grafikler','Veri Sorgulama','API'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Wolfram Alpha, matematik, istatistik ve bilimden ekonomiye kadar hesaplama sorularını adım adım çözen bilgi motorudur. Doğruluğu AI tahmininden değil deterministik hesaplamadan gelir."},
    {"id":"akademik","label":"Akademik Kullanım","content":"İstatistik doğrulama: Julius AI''ın ürettiği sonucu Wolfram''da doğrula → ''t-test with n=45, mean1=3.2, mean2=2.8, SD1=0.6, SD2=0.7'' → t değeri, p değeri ve güven aralığı hesaplanır. Matematik: Diferansiyel denklem çöz → her adımı gör → anlayarak not al."},
    {"id":"prompt","label":"Hesaplama Örnekleri","content":"Wolfram Alpha''ya doğrudan yazılabilecek akademik sorgular: • ''t-test p-value for t=2.34, df=48'' • ''95% confidence interval for proportion 0.62, n=150'' • ''Cohen''s d for mean difference 0.8, pooled SD 1.2'' • ''chi-square test contingency table {{30,20},{15,35}}'' • ''pearson correlation r=0.65, n=80, significance test'' — Her sorgu adım adım çözüm ve akademik yorumla gelir."},
    {"id":"start","label":"Nasıl başlarım?","content":"wolframalpha.com → ücretsiz temel kullanım → Adım adım çözümler için Pro ($5/ay öğrenci). Mobil uygulamayı indir; sınav hazırlığı için güçlü."}
  ]'::jsonb
),
(
  'tableau-ai',
  'Tableau (Pulse AI)',
  'Akademik veri görselleştirmesi ve keşif analitiği için endüstri standardı platform.',
  'Tableau, interaktif veri görselleştirmeleri ve gösterge panelleri oluşturmak için kullanılan önde gelen analitik platformdur. Pulse AI özelliği, verilen hedeflere göre önemli değişimleri otomatik tespit eder ve doğal dil açıklamaları üretir. Akademisyenler için araştırma bulgularını dinamik görsel raporlara dönüştürme, büyük ölçekli eğitim verisini keşif analitiğiyle inceleme ve konferans sunumları için etkileşimli grafikler hazırlama imkânı sunar. Tableau Public ücretsiz olarak kamuya paylaşılabilir görselleştirmeler oluşturur.',
  'data',
  'https://tableau.com',
  ARRAY['İnteraktif Görselleştirme','Pulse AI','Büyük Veri','Tableau Public','Dashboard','LMS Entegrasyonu'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Tableau, araştırma verilerini interaktif görselleştirmelere dönüştüren endüstri standardı analitik platformdur. Pulse AI, önemli değişimleri otomatik tespit eder."},
    {"id":"akademik","label":"Akademik Kullanım","content":"PISA/TIMSS gibi büyük ölçekli eğitim veri setlerini Tableau''ya yükle → ülke karşılaştırmalı harita oluştur → yıl bazlı trend grafikleri → gelir düzeyi ile başarı ilişkisini scatter plot''ta görselleştir → Tableau Public''e yayımla → makale ekine bağlantı ver."},
    {"id":"prompt","label":"Analiz Akışı","content":"Tableau''da keşif analitiği için adımlar: 1) Excel veri kaynağını bağla 2) ''Show Me'' ile veri türüne uygun grafik önerisi al 3) Drag-and-drop: Yatay eksen = bağımsız değişken, dikey = bağımlı 4) Filters''e demografik değişkeni sürükle → alt grup karşılaştırması 5) Annotations → ''Bu noktada pandemi etkisi'' gibi akademik not ekle 6) Dashboard''a topla → PDF export → makale eki."},
    {"id":"start","label":"Nasıl başlarım?","content":"Tableau Public ücretsiz. Tam platform için tableau.com → Academic program → öğrenci/eğitimci için ücretsiz 1 yıllık lisans. Coursera''daki resmi kurs sertifika için."}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  description   = excluded.description,
  features      = excluded.features,
  robot_options = excluded.robot_options,
  tagline       = excluded.tagline;

-- ============================================================
-- GÖRSEL ARAÇLAR (image)
-- ============================================================
INSERT INTO tools (slug, name, tagline, description, category, website_url, features, robot_options) VALUES
(
  'dalle-3',
  'DALL-E 3',
  'OpenAI''ın en gelişmiş metin-görüntü modeli — prompt''u tam anlayan üretken AI.',
  'DALL-E 3, OpenAI''ın metin açıklamalarından gerçekçi ve yaratıcı görüntüler üreten modelidir. ChatGPT ile entegrasyonu sayesinde doğal konuşma arayüzüyle görsel üretilir ve refinement döngüsüyle istenen özelliklere ulaşılır. Akademik kullanımda kavram görselleştirme, ders materyali illüstrasyonu ve veri diyagramları için güçlü bir araçtır. Üretilen görseller üzerinde OpenAI kullanım politikası geçerlidir; ticari kullanım için lisans koşulları incelenmelidir.',
  'image',
  'https://openai.com/dall-e-3',
  ARRAY['Yüksek Kalite','ChatGPT Entegrasyonu','Iterative Refinement','Stil Seçenekleri','API Erişimi'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"DALL-E 3, OpenAI''ın metin açıklamalarından yüksek kaliteli görüntüler üreten AI modelidir. ChatGPT üzerinden konuşma arayüzüyle görsel üretimi ve iyileştirmesi yapılır."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Ders materyali için: ChatGPT''de ''Create an educational diagram showing the process of DNA replication for high school students, clean infographic style, labeled, white background'' → Sonucu gör → ''Add a mistake in step 3 for students to identify'' ile aktif öğrenme materyali üret."},
    {"id":"prompt","label":"Eğitim Görseli Promptu","content":"ChatGPT''de DALL-E için örnek akademik prompt: ''Create a detailed educational cross-section diagram of a mitochondria showing the inner membrane, cristae, matrix, and electron transport chain. Style: clean scientific illustration, labeled in Turkish, white background, suitable for a university biology textbook. Include a small scale reference. Make it accurate but visually engaging for students.'' — Üretilen görseli PowerPoint''e aktar, altına kaynak olarak ''Üretici AI (DALL-E 3, 2024)'' yaz."},
    {"id":"start","label":"Nasıl başlarım?","content":"ChatGPT Plus (aylık $20) içinde DALL-E 3 dahil. chat.openai.com → görsel üretmek istediğini söyle → prompt yaz. API ile uygulamaya entegrasyon için ayrı faturalandırma."}
  ]'::jsonb
),
(
  'adobe-firefly',
  'Adobe Firefly',
  'Adobe''ın lisanslı içerikle eğitilmiş, ticari kullanıma güvenli AI görsel üretici.',
  'Adobe Firefly, yalnızca lisanslı ve telif hakkı serbest içeriklerle eğitildiğinden ticari ve eğitim kullanımında hukuki güvence sunar. Creative Cloud entegrasyonuyla Photoshop, Illustrator ve Express''te doğrudan kullanılabilir. ''Generative Fill'' ile mevcut görseller genişletilir veya değiştirilir; ''Text Effects'' ile yazı üzerinde görsel efektler üretilir. Eğitim materyalleri için üretilen görseller telif hakkı endişesi taşımaz.',
  'image',
  'https://firefly.adobe.com',
  ARRAY['Ticari Lisans','Creative Cloud','Generative Fill','Text Effects','Stok Entegrasyonu','Eğitim Dostu'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Adobe Firefly, yalnızca lisanslı içeriklerle eğitilmiş AI görsel üreticisidir. Üretilen görseller ticari ve eğitim kullanımına tamamen güvenlidir. Creative Cloud ile tam entegre."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Ders kitabı ve sunum için telif hakkı güvenli görsel üretimi: Firefly.adobe.com''da ''Styles → Educational/Scientific'' seç → kavramı detaylı tanımla → üretilen görseli Illustrator''da düzenle → PDF''e al. Konferans sunumu için de Firefly ile özgün görseller üret."},
    {"id":"prompt","label":"Prompt Stratejisi","content":"Adobe Firefly''da eğitim içeriği için örnek promptlar: ''Photorealistic cross-section of a plant cell showing organelles, educational illustration style, labeled, clean white background, suitable for K-12 biology'' veya ''Abstract concept visualization of cognitive dissonance, modern flat design, muted academic color palette, suitable for psychology course presentation'' — Her promptta style, audience ve use case belirt. Sonucu Photoshop''ta metin açıklamaları ekleyerek tamamla."},
    {"id":"start","label":"Nasıl başlarım?","content":"firefly.adobe.com → ücretsiz Adobe hesabıyla 25 kredi/ay. Creative Cloud abonesi iseniz kredi sınırı yüksek. Öğrenci Adobe CC indirimi için okul IT birimini ara."}
  ]'::jsonb
),
(
  'canva-ai',
  'Canva AI',
  'Tasarım bilgisi gerektirmeden akademik sunum, infografik ve poster oluşturma.',
  'Canva, AI özellikleriyle zenginleştirilerek akademik görseller için güçlü bir platforma dönüşmüştür. Magic Design, verilen içerikten otomatik sunum tasarımı üretir; Magic Write metin içeriği oluşturur; Text to Image görsel üretir. Akademisyenler için konferans posteri, ders materyali infografiği, araştırma slayt destesi ve öğrenci projesi görselleştirme şablonları hazırdır. Eğitim kurumları için Canva for Education ücretsiz premium erişim sunar.',
  'image',
  'https://canva.com',
  ARRAY['Magic Design','Text to Image','Konferans Posteri','Şablonlar','Eğitim Ücretsiz','Ekip İşbirliği'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Canva AI, Magic Design ve Text to Image özellikleriyle akademik sunum, konferans posteri ve infografik oluşturmayı sürükle-bırak kolaylığına indiren tasarım platformudur."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Konferans posteri: Canva → ''Research Poster'' şablonu → Magic Design ile alanın rengine uygun düzen seç → Metin bölümlerine içerik yapıştır → Grafik ve tabloları yükle → PDF/print kalitesinde indir. Öğrenci sunumu: Magic Design''a araştırma özetini yapıştır → otomatik slayt tasarımı al."},
    {"id":"prompt","label":"Konferans Posteri Rehberi","content":"Canva''da akademik poster oluşturma adımları: 1) New Design → Custom size → A0 (841x1189mm) 2) Şablonlar → ''Academic'' veya ''Scientific'' ara 3) Bölümler: Introduction | Methods | Results | Discussion | References 4) Magic Design → taslağı yapıştır → tasarım önerisi al 5) Renk paleti: kurumun kurumsal renklerini ekle 6) DPI kontrolü: Print → ayarlar → 300 DPI seç 7) Download → PDF Print → Baskıya gönder."},
    {"id":"start","label":"Nasıl başlarım?","content":"canva.com → edu email ile kayıt → Canva for Education ücretsiz premium erişim. Öğrenci veya öğretmen doğrulaması 24 saat içinde onaylanır."}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  description   = excluded.description,
  features      = excluded.features,
  robot_options = excluded.robot_options,
  tagline       = excluded.tagline;

-- ============================================================
-- SES ARAÇLARI (audio)
-- ============================================================
INSERT INTO tools (slug, name, tagline, description, category, website_url, features, robot_options) VALUES
(
  'whisper',
  'Whisper (OpenAI)',
  'Neredeyse insan doğruluğunda ses transkripsiyonu — 99 dilde konuşmayı metne çevir.',
  'Whisper, OpenAI''ın açık kaynaklı otomatik konuşma tanıma modelidir. 680.000 saat çok dilli veriyle eğitilmiş olan model, gürültülü ortam kayıtlarında bile yüksek doğruluk gösterir. Akademik konferans kaydı, odak grubu görüşmesi, saha araştırması ve ders kaydı transkripsiyonunda kullanılır. Yerel olarak çalıştırılabilmesi, araştırma verilerinin gizliliği açısından kritik avantaj sağlar. Qualitative araştırmada görüşme transkripsiyonu için standart araç haline gelmiştir.',
  'audio',
  'https://openai.com/research/whisper',
  ARRAY['99 Dil','Açık Kaynak','Yerel Çalışma','Gürültü Toleransı','Konuşmacı Tanıma','SRT Altyazı'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Whisper, OpenAI''ın 99 dilde konuşmayı metne çeviren açık kaynaklı ses transkripsiyonu modelidir. Yerel çalıştırılabildiği için araştırma verisi gizliliği korunur."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Nitel araştırma görüşmesi transkripsiyonu: Ses dosyasını Whisper''a ver → metne dönüştür → konuşmacı etiketleri ekle → NVivo veya Atlas.ti''ye aktar → tematik analiz başlat. Ders kaydı için: Whisper → SRT altyazı üret → videoya ekle → erişilebilir ders materyali."},
    {"id":"prompt","label":"Kullanım Yöntemleri","content":"Whisper''ı kullanmanın 3 yolu: 1) Yerel kurulum (gizlilik için ideal): pip install openai-whisper → whisper ses_dosyasi.mp3 --model medium --language tr → transkript.txt 2) OpenAI API üzerinden: $0.006/dakika ücretle direkt API çağrısı 3) Arayüz araçları: Whisper Web (tarayıcıda), Descript veya Otter.ai gibi Whisper tabanlı uygulamalar. Araştırma için yerel kurulum önerilir — veri kuruma ait kalır."},
    {"id":"start","label":"Nasıl başlarım?","content":"Teknik değilseniz: Whisper tabanlı uygulama kullanın (otter.ai, descript). Teknik iseniz: github.com/openai/whisper → README → pip install → ilk transkripsiyon. Tamamen ücretsiz yerel kullanım."}
  ]'::jsonb
),
(
  'otter-ai',
  'Otter.ai',
  'Gerçek zamanlı toplantı transkripsiyonu, konuşmacı tanıma ve araştırma görüşmesi için AI not asistanı.',
  'Otter.ai, toplantı ve görüşmeleri gerçek zamanlı metne dönüştürür, konuşmacıları otomatik ayırt eder ve önemli noktaları özetler. Zoom, Teams ve Meet ile entegre çalışır. Akademik araştırmalarda odak grubu görüşmesi, derinlemeli mülakat ve ders kaydı için tercih edilir. ''AI Chat'' özelliğiyle transkript üzerinde soru-cevap yapılabilir. FERPA ve HIPAA uyum seçenekleri eğitim ve sağlık araştırması için ek güvence sağlar.',
  'audio',
  'https://otter.ai',
  ARRAY['Gerçek Zamanlı Transkript','Konuşmacı Tanıma','Özet','Zoom/Teams Entegrasyonu','FERPA Uyumlu','AI Chat'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Otter.ai, toplantı ve görüşmeleri gerçek zamanlı metne dönüştüren, konuşmacıları ayırt eden ve özetleyen AI not asistanıdır. Zoom, Teams ve Meet ile entegre çalışır."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Nitel araştırmada derinlemeli mülakat: Otter''ı Zoom''a bağla → görüşme otomatik transkribe edilsin → konuşmacı etiketleri düzelt (katılımcı adı/K1/K2) → AI Chat ile ''Bu transkriptte hangi temalar öne çıkıyor?'' diye sor → NVivo''ya aktar."},
    {"id":"prompt","label":"Araştırma Görüşmesi Akışı","content":"Odak grubu araştırması için Otter.ai akışı: 1) Zoom görüşmesi öncesi: Otter''ı hesaba bağla → Otomatik kayıt ayarla 2) Görüşme sırasında: Gerçek zamanlı transkripti katılımcılarla paylaş (şeffaflık) 3) Sonra: Transkripti düzenle → Konuşmacıları doğru etiketle 4) AI Chat: ''Bu görüşmede en çok vurgulanan 5 temayı çıkar'' 5) Export: .docx veya .txt → NVivo''ya aktar → tematik kodlama başlat. UYARI: Veri işleme izinlerini görüşme öncesi katılımcılardan al."},
    {"id":"start","label":"Nasıl başlarım?","content":"otter.ai → ücretsiz hesap (ayda 300 dakika) → Zoom uygulamasında ''Otter.ai Notetaker'' ekle. Eğitim kurumları FERPA uyumlu kurumsal plan için otter.ai/education sayfasına bak."}
  ]'::jsonb
),
(
  'descript',
  'Descript',
  'Metin düzenler gibi ses ve video düzenle — transkript bazlı AI medya editörü.',
  'Descript, ses ve video dosyalarını önce metne çevirir; ardından metni düzenleyerek medyayı otomatik olarak keser ve yapılandırır. "Overdub" özelliğiyle ses klonlama ile yazılan metin seslendirilir. Akademik podcast üretimi, ders videosu hazırlama ve konferans konuşması düzenleme için yüksek verimlilik sağlar. "Studio Sound" filtresi, kötü akustikli ortamlarda kaydedilen sesleri stüdyo kalitesine yükseltir.',
  'audio',
  'https://descript.com',
  ARRAY['Metin Bazlı Düzenleme','Ses Klonlama','Studio Sound','Ekran Kaydı','Podcast Üretimi','Altyazı'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Descript, ses ve videouyu önce metne çeviren, ardından metin düzenler gibi medya düzenlemeyi sağlayan AI editördür. Silinen metin → silinen ses/video."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Ders kaydı düzenleme: Kaydı Descript''e yükle → transkript otomatik üretilsin → ''um'', ''uh'' gibi dolgu kelimeleri toplu sil → sessizlik bölümlerini kırp → Studio Sound ile ses kalitesini artır → altyazı ekle → YouTube''a yükle."},
    {"id":"prompt","label":"Podcast Üretim Akışı","content":"Akademik podcast üretimi için Descript akışı: 1) Kaydı yükle → Whisper tabanlı transkript al 2) Transkriptte hataları düzelt 3) Edit → Remove Filler Words (uh, um, like) → tek tıkla temizle 4) Studio Sound → gürültüyü gider 5) Chapters → Bölüm başlıklarını transkripte ekle 6) Audiogram → sosyal medya klibini otomatik oluştur 7) Export → MP3 (podcast) + SRT (altyazı) + Transcript (erişilebilirlik)."},
    {"id":"start","label":"Nasıl başlarım?","content":"descript.com → ücretsiz plan (1 saat transkripsiyon/ay) → Creator plan $12/ay. Podcast başlangıcı için ücretsiz plan yeterli."}
  ]'::jsonb
),
(
  'elevenlabs',
  'ElevenLabs',
  'İnsan sesine en yakın TTS kalitesi — ses klonlama ve çok dilli içerik üretimi.',
  'ElevenLabs, nöral ses sentezi teknolojisinde sektörün öncüsüdür. Türkçe dahil 29+ dilde doğal, duygusal tonlama ile metin-ses dönüşümü yapar. Ses klonlama özelliği, bir eğitimcinin kendi sesini veri tabanına ekleyerek içerik üretmesini sağlar. Akademik podcast üretimi, sesli ders materyali, görme engelli öğrenciler için erişilebilir içerik ve çok dilli ders sesi üretiminde yaygın kullanılır. API ile LMS entegrasyonu mümkündür.',
  'audio',
  'https://elevenlabs.io',
  ARRAY['Ses Klonlama','29+ Dil','Duygusal Ton','API','LMS Entegrasyonu','Erişilebilirlik'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"ElevenLabs, 29+ dilde insan sesine en yakın kalitede ses üretimi ve klonlama yapan AI ses platformudur. Ders materyalleri için sesli anlatım, erişilebilir içerik ve çok dilli ders üretiminde standart araç."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Sesli ders materyali: Ders metnini yapıştır → ''Academic Narrator'' sesini seç → Türkçe ses üret → MP3 indir → LMS''e yükle. Erişilebilirlik: Görme engelli öğrenciler için tüm PDF materyallerini sese dönüştür. Çok dilli: Aynı ders içeriğini İngilizce, Türkçe ve Arapça olarak seslendir."},
    {"id":"prompt","label":"Akademik İçerik Üretimi","content":"ElevenLabs ile profesyonel sesli ders üretimi: 1) elevenlabs.io → Speech Synthesis 2) Ses seçimi: ''Rachel'' (İngilizce, akademik) veya ''Bella'' (doğal anlatım) 3) Stability: 0.65 | Clarity: 0.75 → doğal ses için ayar 4) Uzun metin: Bölümlere böl (500 kelime altı) → her bölümü ayrı ses olarak üret 5) Birleştir: Descript veya Audacity ile ses dosyalarını birleştir 6) UYARI: Ses klonlama için etik onay ve katılımcı rızası şart."},
    {"id":"start","label":"Nasıl başlarım?","content":"elevenlabs.io → ücretsiz hesap → aylık 10.000 karakter. Creator plan $5/ay ile 30.000 karakter. API anahtarı ile Python entegrasyonu mümkün."}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  description   = excluded.description,
  features      = excluded.features,
  robot_options = excluded.robot_options,
  tagline       = excluded.tagline;

-- ============================================================
-- VIDEO ARAÇLARI (video)
-- ============================================================
INSERT INTO tools (slug, name, tagline, description, category, website_url, features, robot_options) VALUES
(
  'synthesia',
  'Synthesia',
  'Kamera olmadan profesyonel AI avatar ders videosu — 140+ dilde otomatik seslendirme.',
  'Synthesia, metin senaryosundan gerçekçi AI avatar videoları üreten bir platform. Kamera gerektirmez; 140 dilde otomatik seslendirme ile aynı ders içeriği farklı dillere kolayca uyarlanabilir. LMS (Moodle, Canvas, Blackboard) entegrasyonu ve SCORM paketi oluşturma desteğiyle kurumsal e-öğrenme ekosistemi içinde kullanılabilir. Senaryo güncellendiğinde tüm video saniyeler içinde yeniden üretilir; bu özellik ders içeriği güncellemelerini dramatik biçimde kolaylaştırır.',
  'video',
  'https://synthesia.io',
  ARRAY['AI Avatar','140 Dil','LMS Entegrasyonu','SCORM','Ekran Paylaşımı','Otomatik Güncelleme'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Synthesia, metin senaryosundan AI avatar ile ders videosu üreten platformdur. 140 dil, kamera gerekmez, senaryo değişince video dakikalar içinde güncellenir."},
    {"id":"akademik","label":"Akademik Kullanım","content":"MOOC ders videosu üretimi: Ders senaryosunu bölümlere ayır → Her bölüm için Synthesia''da video üret → Slide entegrasyonuyla ekran paylaşımı ekle → 140 dilde çeviri üret → SCORM paketi oluştur → Canvas/Moodle''a yükle. Güncelleme: Sadece metni değiştir → Video otomatik yenilenir."},
    {"id":"prompt","label":"Senaryo Yazım Rehberi","content":"Synthesia için etkili video senaryosu: [Giriş - 30 sn] ''Merhaba, bu videoda [konu]''yu ele alacağız. [Ana içerik - 3-5 dk] Her kavramı 60-90 saniyede tamamla. Teknik terimleri ilk kullanımda tanımla. Soru formatı kullan: ''Peki neden bu önemli?'' [Özet - 30 sn] ''Bu derste öğrendikleriniz: 1)... 2)... 3)...'' [Kapanış] ''Sonraki videoda...'' KURAL: Cümleleri kısa tut (max 20 kelime). Sayıları harf yazarak yaz (''yüzde elli'' değil ''%50'')."},
    {"id":"start","label":"Nasıl başlarım?","content":"synthesia.io → ücretsiz 3 dakika video dene. Starter $22/ay (10 dk/ay). Kurumsal eğitim için fiyat teklifi al. LMS entegrasyonu için IT birimi ile çalış."}
  ]'::jsonb
),
(
  'heygen',
  'HeyGen',
  'Fotoğraftan gerçekçi AI avatar videoları — çok dilli ders ve sunum üretimi.',
  'HeyGen, tek bir fotoğraftan kişiselleştirilmiş AI avatar videoları oluşturur. Dudak hareketi senkronizasyonu teknolojisiyle birden fazla dilde aynı kişi görünümünde video üretilebilir. "Video Translation" özelliği mevcut videoları farklı dillere senkronize ses ve dudak hareketleriyle çevirir. Akademik sunumlar ve konferans videolarını uluslararası dağıtım için yerelleştirmede güçlü bir araçtır.',
  'video',
  'https://heygen.com',
  ARRAY['Fotoğraftan Avatar','Video Çeviri','Dudak Senkronizasyonu','Çok Dilli','Özel Avatar','Ses Klonlama'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"HeyGen, tek fotoğraftan AI avatar videosu oluşturan ve mevcut videoları farklı dillere dudak senkronizasyonuyla çeviren platformdur."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Uluslararası konferans için: Türkçe sunum videonu HeyGen''e yükle → Video Translation → İngilizce seç → senkronize dudak hareketi ile İngilizce versiyon üret → konferans web sitesine yükle. Çok dilli kurs: Aynı ders videosunu 5 farklı dile çevir → dünya çapında öğrenci erişimi."},
    {"id":"prompt","label":"Video Çeviri Akışı","content":"HeyGen Video Translation kullanımı: 1) Kaynak videoyu yükle (kaliteli mikrofon kaydı önemli) 2) Translate → Hedef dil seç (İngilizce, Arapça, Çince vb.) 3) Ses kalitesi: Orijinal sesi koru veya AI sesi seç 4) Dudak senkronizasyon kalitesini önizlemede kontrol et 5) Teknik terimler doğru çevrildi mi? → Transcript editörde düzelt 6) Export → YouTube''a yükle → altyazı dosyasını da ekle. NOT: Her çevirinin içeriğini alanda uzman birine kontrol ettir."},
    {"id":"start","label":"Nasıl başlarım?","content":"heygen.com → ücretsiz 1 dakika video. Creator $29/ay ile 15 kredi. Video Translation dakika başı ücretlendirme. Akademik kullanım için yıllık plan daha ekonomik."}
  ]'::jsonb
),
(
  'gamma-app',
  'Gamma',
  'AI ile dakikalar içinde akademik sunum, rapor ve ders materyali oluştur.',
  'Gamma, metinden veya taslaktan profesyonel görünümlü sunumlar, belgeler ve web sayfaları üretir. ''Generate'' özelliğiyle konu başlığından tam bir slayt destesi saniyeler içinde hazırlanır. Akademik içerik için önceden tasarlanmış şablonlar, LaTeX matematik desteği ve grafik entegrasyonu mevcuttur. Oluşturulan içerikler PowerPoint, PDF veya web bağlantısı olarak paylaşılır. Öğrenci sunumlarından araştırma özetlerine kadar geniş kullanım alanı vardır.',
  'video',
  'https://gamma.app',
  ARRAY['AI Sunum Üretimi','LaTeX Matematik','Grafik Entegrasyonu','Web Paylaşımı','PDF Export','PowerPoint Export'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Gamma, konu başlığı veya taslaktan dakikalar içinde profesyonel akademik sunum, rapor ve web sayfası üreten AI platformudur."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Araştırma özeti sunumu: Gamma''ya makale özetini yapıştır → ''Create presentation'' → 10-12 slayt otomatik üretilir → Her slaydı özelleştir → LaTeX formatında denklem ekle → PDF export → konferansa gönder."},
    {"id":"prompt","label":"Prompt Örneği","content":"Gamma''da etkili akademik sunum için prompt: ''Create a 10-slide academic conference presentation about [araştırma konusu]. Include: Title slide with author info, Research gap and objectives, Theoretical framework (with diagram), Methodology (participants, instruments, procedure), Results (include placeholder for 2 charts), Discussion of key findings, Limitations, Future research directions, Conclusions, References slide. Use academic formal tone, minimal text per slide, space for speaker notes.'' → Oluşan taslağı içerikle doldur."},
    {"id":"start","label":"Nasıl başlarım?","content":"gamma.app → ücretsiz hesap → 400 AI kredisi hediye. Her sunum ~40 kredi. Pro $10/ay ile sınırsız AI üretimi. Edu email ile ek kredi alınabiliyor."}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  description   = excluded.description,
  features      = excluded.features,
  robot_options = excluded.robot_options,
  tagline       = excluded.tagline;

-- ============================================================
-- KOD ARAÇLARI (code)
-- ============================================================
INSERT INTO tools (slug, name, tagline, description, category, website_url, features, robot_options) VALUES
(
  'cursor',
  'Cursor',
  'Tüm proje bağlamını anlayan AI-first kod editörü — araştırma kodu ve analiz betikleri için.',
  'Cursor, VS Code mimarisini temel alarak tüm proje dosyalarını AI bağlamına dahil eden bir kod editörüdür. ''Composer'' özelliği birden fazla dosyayı aynı anda düzenler; ''Chat'' özelliği mevcut kodu anlayarak geliştirme önerileri sunar. Akademik araştırmacılar için veri analizi betikleri, simülasyon modelleri ve araştırma otomasyon araçları yazmak; öğretmenler için eğitim uygulaması prototipleri geliştirmek amacıyla kullanılır. GPT-4 ve Claude Sonnet altyapısı ile güçlüdür.',
  'code',
  'https://cursor.com',
  ARRAY['Proje Bağlamı','Composer','Hata Ayıklama','Python/R/Julia','Refactoring','VS Code Uyumlu'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Cursor, tüm proje dosyalarını bağlam olarak kullanan AI-first kod editörüdür. VS Code''dan tanıdık, AI''dan güçlü. Araştırma kodu için özellikle değerli."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Veri analizi: Python script''inde veri dosyasını yükle → Cursor Chat''te ''Bu veriye uygun ANOVA analizi yaz, varsayımları test et, APA tablosu üret'' → kodu anında çalıştır → hatayı Cursor''a sor. Otomasyon: ''Bu 50 PDF''den abstract''ları çıkaran ve Excel''e yazan script yaz.''"},
    {"id":"prompt","label":"Araştırma Kodu Örneği","content":"Cursor Chat''te araştırma veri analizi için örnek prompt: ''Bu CSV dosyasında öğrenci başarı verileri var (columns: student_id, pre_test, post_test, group, gender). Şunları yap: 1) Betimsel istatistikler tablosu (group''a göre), 2) Normallik testleri (Shapiro-Wilk), 3) Gruplar arası fark için uygun test seç (parametrik/non-parametrik karar ver), 4) Etki büyüklüğü hesapla (Cohen''s d), 5) Matplotlib ile kutu grafiği çiz, 6) Sonuçları APA 7 formatında metin olarak yaz.'' — Cursor tüm kodu üretir, çalıştırır ve hataları düzeltir."},
    {"id":"start","label":"Nasıl başlarım?","content":"cursor.com → indir (Mac/Windows/Linux) → VS Code eklentilerin otomatik gelir. Ücretsiz plan 50 AI sorgu/ay. Pro $20/ay sınırsız. Akademik lisans için cursor.com/education."}
  ]'::jsonb
),
(
  'replit-ai',
  'Replit AI',
  'Tarayıcıda kurulum gerektirmeden çalışan bulut tabanlı AI kodlama ortamı.',
  'Replit AI, tarayıcıda çalışan, kurulum gerektirmeyen bulut kodlama platformudur. AI Ghostwriter özelliği kod tamamlar, hataları açıklar ve ödev yönlendirmesi sağlar. Eğitimde özellikle kritik avantajı: öğrenciler Chromebook dahil herhangi bir cihazdan kod çalıştırabilir. Teams for Education ile öğretmen ödevleri oluşturur, otomatik test yapar ve öğrenci kodunu gözden geçirir. 50''den fazla programlama dili desteklenir.',
  'code',
  'https://replit.com',
  ARRAY['Tarayıcı Tabanlı','AI Ghostwriter','Teams for Education','50+ Dil','Gerçek Zamanlı İşbirliği','Otomatik Test'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Replit AI, kurulum gerektirmeden tarayıcıda kod yazıp çalıştırmayı sağlayan bulut kodlama platformudur. AI Ghostwriter kod tamamlar ve hataları açıklar."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Kodlama dersi için: Teams for Education kur → Ödev oluştur → Öğrenciler tarayıcıda kod yazar → AI Ghostwriter takılınca yardım eder → Otomatik test öğrencinin kodunu değerlendirir → Öğretmen tüm ödevleri tek panelden görür."},
    {"id":"prompt","label":"Ghostwriter Kullanımı","content":"Replit AI Ghostwriter ile öğrenme destekli kodlama: Kod yazarken hata çıktığında: 1) Hata mesajını seç → ''Explain this error'' → sıradan dilde açıklama gelir 2) ''How do I fix this?'' → adım adım çözüm 3) Kod yazmadan önce: ''# Write a function that reads a CSV and calculates descriptive statistics'' yorumunu yaz → Ghostwriter otomatik tamamlar 4) Anlamadığın kod bloğunu seç → ''Explain this code'' → her satırın ne yaptığını öğren. NOT: Ödevin amacını anlamadan Ghostwriter''a yazdırma — öğrenme hedefleri kaybolur."},
    {"id":"start","label":"Nasıl başlarım?","content":"replit.com → ücretsiz hesap → Replit → eğitimciler için Teams for Education ücretsiz. Sınıf kurulumu için replit.com/teams-for-education sayfasını ziyaret et."}
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  description   = excluded.description,
  features      = excluded.features,
  robot_options = excluded.robot_options,
  tagline       = excluded.tagline;

-- ============================================================
-- Mevcut ana araçları da güncelle (chatgpt, claude, midjourney vb.)
-- robot_options''a akademik prompt örneği ekle
-- ============================================================
UPDATE tools SET
  robot_options = '[
    {"id":"intro","label":"Bu nedir?","content":"ChatGPT, OpenAI tarafından geliştirilen GPT-4o mimarili büyük dil modelidir. Metin anlama, kod yazma, analiz ve yaratıcı içerik üretiminde geniş yetenek yelpaзesiyle dünyanın en yaygın kullanılan AI asistanıdır."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Akademik kullanım alanları: Bloom Taksonomisine dayalı ders planı, sınav sorusu üretimi, makale taslağı oluşturma, araştırma bulgularını yorumlama, istatistik sonuçlarını sıradan dile çevirme, atıf formatı düzenleme. Verimli kullanım için net talimat + bağlam + çıktı formatı belirt."},
    {"id":"prompt","label":"Prompt Örneği","content":"Sen deneyimli bir eğitim araştırmacısısın ve istatistik uzmanısın. Aşağıdaki ANOVA bulgularını önce teknik olarak açıkla, sonra bu sonuçları pedagoji alanında uzman olmayan bir okul yöneticisinin anlayacağı biçimde yorumla. Son olarak bulguların pratik eğitimsel çıkarımlarını 3 madde halinde listele. Bulgular: F(2,87) = 4.32, p = .016, η² = .09. Gruplar: geleneksel öğretim (n=30, M=72.4, SD=8.2), karma öğrenme (n=30, M=78.6, SD=7.9), tam çevrimiçi (n=29, M=75.1, SD=9.4)."},
    {"id":"start","label":"Nasıl başlarım?","content":"chat.openai.com → ücretsiz hesap (GPT-3.5). ChatGPT Plus ($20/ay) ile GPT-4o, dosya yükleme ve gelişmiş analiz. Eğitim kurumları için ChatGPT Edu planını inceleyin."}
  ]'::jsonb,
  description = 'ChatGPT, OpenAI tarafından geliştirilen GPT-4o mimarili büyük dil modelidir. Metin anlama, sohbet, kod yazma, veri analizi ve içerik üretiminde geniş bir yetenek yelpazesi sunar. Akademik kullanımda ders planı hazırlama, sınav sorusu üretimi, makale taslağı oluşturma ve araştırma bulgularını yorumlamada güçlü performans gösterir. Özelleştirilebilir GPT mağazası ile alana özgü asistanlar oluşturulabilir; Türkçe dahil 50''den fazla dili destekler.'
WHERE slug = 'chatgpt';

UPDATE tools SET
  robot_options = '[
    {"id":"intro","label":"Bu nedir?","content":"Claude, Anthropic tarafından Constitutional AI yöntemiyle geliştirilen güvenlik odaklı bir AI asistanıdır. 200.000 token bağlam penceresiyle tam tez, rapor veya kitap analizi yapabilir. Akademik ton ve hassasiyette sektördeki en güçlü modellerden biridir."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Claude''un 200K token avantajı: Tam tez metnini tek seferde yükle → metodoloji tutarlılığını değerlendirmesini iste → savunma için zayıf noktaları tespit ettir → bölüm bazlı revizyon önerileri al. Karşılaştırmalı kuram analizi ve araştırma etiği değerlendirmesinde rakipsiz."},
    {"id":"prompt","label":"Tez Analizi Promptu","content":"[Tez bölümünü yapıştır] Bu tez bölümünü şu kriterlere göre değerlendir: 1) Araştırma sorusu ile metodoloji arasındaki uyum — tutarlı mı? 2) Örneklem seçim gerekçesi yeterli mi, temsil edilebilirlik tartışılmış mı? 3) İç geçerliği tehdit eden faktörler neler? 4) Literatürle bağlantı güçlü mü, yoksa yüzeysel mi kalıyor? 5) Savunmada bu bölüm için hazırlanmam gereken 3 kritik soru ne olabilir? Her madde için spesifik metin kanıtı göster."},
    {"id":"start","label":"Nasıl başlarım?","content":"claude.ai → ücretsiz hesap (günlük limit). Claude Pro ($20/ay) ile sınırsız mesaj ve uzun belge yükleme. API ile kurumsal entegrasyon mümkün. GDPR uyumu Anthropic tarafından belgelenmiştir."}
  ]'::jsonb,
  description = 'Claude, Anthropic''in Constitutional AI metodolojisiyle geliştirdiği güvenlik odaklı, yüksek performanslı bir yapay zeka asistanıdır. 200.000 token bağlam penceresi ile tam tez, kitap veya uzun araştırma raporlarını tek seferde analiz edebilir. Akademik yazım revizyonu, karmaşık argüman analizi ve etik değerlendirme konularında rakiplerinden öne çıkan bir performans gösterir. Alıntı tutarlılığı ve kaynak atfı konusundaki hassasiyetiyle akademisyenler tarafından tercih edilmektedir.'
WHERE slug = 'claude';

UPDATE tools SET
  robot_options = '[
    {"id":"intro","label":"Bu nedir?","content":"Midjourney, Discord üzerinden metin komutlarıyla nefes kesici sanatsal ve gerçekçi görseller üreten AI görsel platformudur. Eğitim materyali illüstrasyonu, tarihsel ortam görseli ve kavram görselleştirme için yüksek kalite sunar."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Ders materyali görseli: Discord''da /imagine → ''educational diagram showing [kavram], clean infographic style, labeled, white background, scientific illustration'' → 4 varyasyondan seç → upscale → PowerPoint''e aktar. Tarih dersi için: ''Ottoman Istanbul 16th century, historically accurate, detailed cityscape, warm lighting''."},
    {"id":"prompt","label":"Eğitim Görseli Promptu","content":"Midjourney''de akademik ders görseli için örnek prompt: /imagine prompt: detailed anatomical cross-section of a human neuron showing dendrites, axon, myelin sheath, and synaptic terminals, medical textbook illustration style, labeled, white background, clean vector aesthetic, educational, high detail --ar 16:9 --v 6 --style raw — Ardından: ''Türkçe etiketler eklemek için Photoshop veya Canva''da üst katman oluştur.'' Telif hakkı notu: Midjourney Pro planında üretilen görseller ticari kullanıma açıktır."},
    {"id":"start","label":"Nasıl başlarım?","content":"midjourney.com → Discord hesabına bağlan → Midjourney sunucusuna katıl → /subscribe komutuyla Basic plan seç ($10/ay). /imagine komutuyla üretmeye başla."}
  ]'::jsonb
WHERE slug = 'midjourney';

UPDATE tools SET
  robot_options = '[
    {"id":"intro","label":"Bu nedir?","content":"GitHub Copilot, OpenAI Codex modeli üzerine kurulu, IDE içinde satır ve fonksiyon bazlı kod önerileri sunan AI programlama asistanıdır. VS Code ve JetBrains ürünleriyle derin entegrasyon sağlar."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Araştırma veri analizi için: Python ortamında veri dosyasını yükle → Copilot yorumunu yaz: ''# İki grup için Mann-Whitney U testi ve etki büyüklüğü'' → Copilot kodu tamamlar → Sonuçları incele → ''# Bu sonuçları APA formatında yaz'' yorumu ile çıktıyı formatla."},
    {"id":"prompt","label":"Araştırma Kodu Akışı","content":"GitHub Copilot ile araştırma analiz kodu yazma: 1) VS Code''da yeni .py dosyası aç 2) Yorumla başla: # Araştırma sorusu: Deney ve kontrol grubu öğrencilerinin başarı puanları arasında anlamlı fark var mı? 3) Copilot otomatik tamamlar: import, veri yükleme, normallik testi, uygun istatistik test, görselleştirme 4) Her öneriyi anla, değiştirmeden kabul etme 5) Copilot Chat''te: ''Bu kodda hangi varsayımlar kontrol edilmeli?'' diye sor."},
    {"id":"start","label":"Nasıl başlarım?","content":"github.com/features/copilot → Bireysel $10/ay, kurumsal $19/ay. Öğrenci ve öğretmenler için GitHub Education paketi ücretsiz Copilot içerir: education.github.com."}
  ]'::jsonb
WHERE slug = 'github-copilot';

UPDATE tools SET
  robot_options = '[
    {"id":"intro","label":"Bu nedir?","content":"Runway, Gen-3 Alpha modeli ile metin ve görüntüden yüksek kaliteli video üreten yaratıcı AI platformudur. Eğitim videosu prodüksiyonu, kavram animasyonu ve interaktif içerik üretiminde profesyonel kalite sunar."},
    {"id":"akademik","label":"Akademik Kullanım","content":"Ders videosu için kavram animasyonu: ''Text to Video'' modunda → kavramı tanımlayan metin gir → 4-18 saniyelik animasyon üret → Ders videosuna entegre et. Tarih dersi: ''Ancient Rome forum, citizens walking, realistic, cinematic'' → tarihsel ortam canlandırması."},
    {"id":"prompt","label":"Eğitim Videosu Promptu","content":"Runway Gen-3''te eğitim içeriği için örnek prompt: ''A detailed 3D animation of blood flowing through a human heart, showing the four chambers, valves opening and closing, oxygenated blood in red and deoxygenated in blue, medical education style, clean white background, slow motion, highly detailed'' --duration 8s --ratio 16:9. Üretilen klibi Descript''te diğer ders segmentleriyle birleştir. Telif hakkı notu: Runway''de üretilen videolar abonelik planına göre farklı lisans koşullarına tabidir."},
    {"id":"start","label":"Nasıl başlarım?","content":"runwayml.com → ücretsiz 125 kredi → Basic $15/ay (625 kredi). Her 4 saniyelik video ~5 kredi. Eğitim içeriği için Standard plan ($35/ay) ekonomik."}
  ]'::jsonb
WHERE slug = 'runway';

-- ============================================================
-- Son kontrol: Tüm araçlarda robot_options dolu mu?
-- ============================================================
-- SELECT slug, name, jsonb_array_length(robot_options) as option_count FROM tools ORDER BY name;

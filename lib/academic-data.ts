import type { AcademicScenario, ProConData, LearningPath } from './types'

// ─── ACADEMIC SCENARIOS PER TOOL ──────────────────────────────────────────────

export const ACADEMIC_SCENARIOS: Record<string, AcademicScenario[]> = {
  chatgpt: [
    {
      id: 'lesson-plan',
      title: 'Ders Planı Hazırlama',
      description: 'Bloom Taksonomisi\'ne dayalı, ölçülebilir hedefler içeren haftalık ders planı üretimi.',
      steps: [
        'Sınıf düzeyi, konu ve süreyi belirt (örn. "10. sınıf, Newton\'un hareket yasaları, 45 dk")',
        '"Bloom Taksonomisi\'nin 6 basamağına göre öğrenme hedefleri yaz" talimatını ekle',
        'Giriş aktivitesi, açıklama, grup çalışması ve değerlendirme bölümlerini talep et',
        'Çıktıyı öğrenci farklılıklarına (görsel/işitsel/kinestetik) göre özelleştir',
      ],
      promptExample: 'Sen deneyimli bir eğitim uzmanısın. 10. sınıf fizik dersinde Newton\'un 3 hareket yasasını anlatan, Bloom Taksonomisi\'ne göre yapılandırılmış, 45 dakikalık bir ders planı hazırla. Her bölüm için tahmini süreyi belirt. Başlangıç aktivitesi olarak sınıfı düşündürecek bir gerçek hayat sorusu kullan.',
      difficulty: 'Başlangıç',
      discipline: 'Tüm Disiplinler',
    },
    {
      id: 'exam-questions',
      title: 'Sınav Sorusu Oluşturma',
      description: 'Bilgi düzeyinden sentez düzeyine uzanan, akademik standartlarda sınav soruları üretimi.',
      steps: [
        'Ünite kazanımlarını ve hedef sınıf düzeyini belirt',
        'Soru tiplerini belirt: çoktan seçmeli, açık uçlu, durum analizi',
        '"Yanlış cevapların mantıklı çeldirici olmasını" talep et',
        'Cevap anahtarı ve açıklama rubriği de iste',
      ],
      promptExample: 'Türk Edebiyatı dersinde "Servet-i Fünun" dönemini kapsayan, 20 soruluk çoktan seçmeli test hazırla. Soruların %30\'u bilgi, %40\'ı kavrama, %30\'u uygulama düzeyinde olsun. Her soru için 4 şık ve cevap anahtarı ekle.',
      difficulty: 'Başlangıç',
      discipline: 'Tüm Disiplinler',
    },
    {
      id: 'paper-analysis',
      title: 'Akademik Makale Analizi',
      description: 'Makalelerin metodoloji, bulgular ve sınırlılıklarının sistematik olarak çıkarılması.',
      steps: [
        'Makale metnini veya özetini yapıştır',
        '"Araştırma sorusu, yöntem, örneklem, bulgular, sınırlılıklar" başlıklarında özetle',
        '"Bu makalenin metodolojik zayıf noktaları neler?" sorusunu sor',
        '"Hangi araştırma boşluklarını tespit ediyor?" ile literatür katkısını değerlendir',
      ],
      promptExample: 'Aşağıdaki makaleyi şu başlıklara göre analiz et: 1) Araştırma sorusu ve hipotez, 2) Kullanılan metodoloji ve örneklem özellikleri, 3) Temel bulgular ve istatistiksel güç, 4) Sınırlılıklar, 5) Alan yazına katkısı. Son olarak metodolojik eleştirileri sırala: [MAKALE METNİ]',
      difficulty: 'Orta',
      discipline: 'Akademik Araştırma',
    },
    {
      id: 'student-assessment',
      title: 'Öğrenci Değerlendirme Rubriği',
      description: 'Kriterleri net ve ölçülebilir rubrikler ile formül ödevleri için geri bildirim şablonları.',
      steps: [
        'Ödev türünü ve öğrenme hedeflerini belirt',
        '"4 düzeyli (Başlangıç/Gelişmekte/Yeterli/Üstün) rubrik" oluşturmasını iste',
        'Her kritere ağırlık puanı atanmasını talep et',
        'Öğrenciye formül geri bildirim şablonu da üret',
      ],
      promptExample: 'Lise öğrencilerinin hazırladığı 5 dakikalık araştırma sunumunu değerlendirmek için 4 düzeyli rubrik oluştur. Kriterler: İçerik doğruluğu (%40), Sunum becerileri (%30), Kaynak kullanımı (%20), Görsel malzemeler (%10). Her düzeyi tanımla ve puan aralıklarını belirt.',
      difficulty: 'Başlangıç',
      discipline: 'Tüm Disiplinler',
    },
    {
      id: 'differentiation',
      title: 'Farklılaştırılmış Öğretim',
      description: 'Aynı konuyu farklı öğrenme profilleri için uyarlama ve destekleyici materyaller üretme.',
      steps: [
        'Hedef konuyu ve standart açıklamayı paylaş',
        '"3 farklı öğrenme düzeyi (güçlendirme, standart, zenginleştirme) için materyaller üret" de',
        'Her düzey için aktivite, soru seti ve değerlendirme iste',
        'Üstün yetenekli öğrenciler için ek araştırma soruları eklet',
      ],
      difficulty: 'Orta',
      discipline: 'Özel Eğitim / Kapsayıcı Eğitim',
    },
  ],

  claude: [
    {
      id: 'long-doc-analysis',
      title: 'Uzun Belge ve Tez Analizi',
      description: '200.000 token bağlam penceresiyle tez, rapor veya derleme makale analizleri.',
      steps: [
        'Tezin veya raporun tam metnini (PDF içerikli) paylaş',
        '"Metodoloji tutarlılığı, istatistiksel yorumlar ve sonuçların geçerliliği" üzerine soru sor',
        '"Savunma için en zayıf noktalar neler?" sorusunu yönelt',
        'Revizyon önerileri için bölüm bazlı geri bildirim iste',
      ],
      difficulty: 'İleri',
      discipline: 'Akademik Danışmanlık',
    },
    {
      id: 'writing-revision',
      title: 'Akademik Yazı Revizyonu',
      description: 'Akademik ton, atıf formatı ve argüman tutarlılığı için kapsamlı metin revizyonu.',
      steps: [
        'Bölümü yapıştır ve "APA 7 / Chicago / MLA formatında" stilini belirt',
        '"Pasif/aktif cümle dengesi, akademik kelime seçimi ve argüman akışı" üzerine geri bildirim iste',
        'Özgünlük korunaraktan yeniden yazmasını iste',
        'Revize metni orijinal ile karşılaştırmasını talep et',
      ],
      difficulty: 'Orta',
      discipline: 'Tüm Akademik Yazım',
    },
    {
      id: 'research-ethics',
      title: 'Araştırma Etiği Değerlendirme',
      description: 'Araştırma tasarımının etik ilkeler açısından kapsamlı incelemesi.',
      steps: [
        'Araştırma protokolünü ve yöntemini paylaş',
        '"Helsinki Bildirisi ve APA Etik İlkeleri çerçevesinde değerlendir" talimati ver',
        'Potansiyel etik riskler ve önlemler için analiz iste',
        'IRB/Etik Kurul başvurusu için öneriler talep et',
      ],
      difficulty: 'İleri',
      discipline: 'Sağlık / Sosyal Bilimler Araştırması',
    },
    {
      id: 'comparative-analysis',
      title: 'Karşılaştırmalı Kuram Analizi',
      description: 'Birden fazla teorik çerçeveyi sistematik olarak karşılaştırma ve sentezleme.',
      steps: [
        'Karşılaştırılacak teorileri veya yaklaşımları listele',
        '"Varsayımlar, kapsam, güçlü yanlar ve sınırlılıklar" ekseninde tablo oluşturmasını iste',
        'Hangi bağlamda hangi teorinin geçerli olduğunu sorgulatır',
        'Sentez bölümü için taslak oluşturmasını talep et',
      ],
      difficulty: 'İleri',
      discipline: 'Sosyal Bilimler / Felsefe',
    },
  ],

  gemini: [
    {
      id: 'multimodal-lesson',
      title: 'Çok Ortamlı Ders Materyali',
      description: 'Görsel ve metin entegre ders materyalleri üretimi, grafik ve şema önerileri.',
      steps: [
        'Konuyu ve öğrenci yaş grubunu belirt',
        'Fotoğraf, grafik veya diyagram yükle ve bunları açıklamasını iste',
        '"Bu görseli ders materyaline nasıl entegre edebilirim?" sorusunu sor',
        'Google Workspace araçlarıyla entegrasyonu için talimatlara sor',
      ],
      difficulty: 'Başlangıç',
      discipline: 'STEM Eğitimi',
    },
    {
      id: 'real-time-research',
      title: 'Güncel Araştırma Taraması',
      description: 'İnternet erişimiyle gerçek zamanlı kaynaklara dayalı bilgi toplama.',
      steps: [
        'Araştırma sorununu açık biçimde yaz',
        '"Kaynakları belirterek" yanıt vermesini talep et',
        'Güvenilirliği sorgulanabilir kaynaklara itiraz et',
        'Bulguları özetle ve temel referansları kaydet',
      ],
      difficulty: 'Başlangıç',
      discipline: 'Tüm Disiplinler',
    },
    {
      id: 'code-data',
      title: 'Veri Analizi Kodu Üretme',
      description: 'Python / R kodu üretme ve veri setlerini Gemini ile analiz etme.',
      steps: [
        'Veri setini CSV olarak yükle veya yapısını tanımla',
        '"Bu veriyi analiz eden Python kodu yaz" talimatı ver',
        'Görselleştirme için matplotlib/ggplot kodu iste',
        'Kodun yorumunu sıradan dilde açıklamasını talep et',
      ],
      difficulty: 'Orta',
      discipline: 'Veri Bilimi / Eğitim Araştırması',
    },
  ],

  perplexity: [
    {
      id: 'literature-search',
      title: 'Gerçek Zamanlı Literatür Arama',
      description: 'Anlık web erişimi ile güncel araştırma makalelerine kaynaklı erişim.',
      steps: [
        'Araştırma sorusunu soru cümlesi olarak yaz',
        '"Academic sources only" veya "son 5 yıl" gibi kısıtlamaları ekle',
        'Her iddiayı atıfla desteklemesini iste',
        'Bulduğu kaynakları DOI numaralarıyla listelet',
      ],
      difficulty: 'Başlangıç',
      discipline: 'Tüm Akademik Alanlar',
    },
    {
      id: 'fact-verification',
      title: 'Akademik Kaynak Doğrulama',
      description: 'İddia edilen bulgular ve istatistiklerin anlık kaynak doğrulaması.',
      steps: [
        'Doğrulanmasını istediğin iddiayı yapıştır',
        '"Bu iddiayı destekleyen ve çürüten akademik kaynakları bul" talimati ver',
        'Kaynakların güvenilirlik derecesini değerlendirmesini iste',
        'Çelişkili bulgular varsa bunları da listelet',
      ],
      difficulty: 'Orta',
      discipline: 'Araştırma Metodolojisi',
    },
  ],

  elicit: [
    {
      id: 'systematic-review',
      title: 'Sistematik Literatür Taraması',
      description: 'PRISMA protokolüne uygun, otomatik makale tarama ve veri çıkarımı.',
      steps: [
        'Araştırma sorusunu PICO formatında gir (Popülasyon, Müdahale, Karşılaştırma, Sonuç)',
        'Dahil/dışlama kriterlerini tanımla',
        'Elicit\'in önerdiği makaleleri incele ve uygunluğu değerlendir',
        '"Extract data" ile makalelerden otomatik veri çıkar',
      ],
      difficulty: 'Orta',
      discipline: 'Tıp / Sağlık / Eğitim Araştırması',
    },
    {
      id: 'hypothesis-testing',
      title: 'Hipotez Destekleme Araştırması',
      description: 'Verilen hipotezi destekleyen ya da çürüten makalelerin otomatik tespiti.',
      steps: [
        'Hipotezini soru formatında yaz',
        'Elicit\'in bulduğu makale başlıklarını ve özetlerini tarayın',
        '"Abstract highlights" özelliğiyle ilgili bölümleri hızlıca analiz et',
        'Zıt bulgular içeren makaleleri ayrı bir listeye al',
      ],
      difficulty: 'Orta',
      discipline: 'Sosyal Bilimler / Psikoloji',
    },
  ],

  consensus: [
    {
      id: 'consensus-mapping',
      title: 'Bilimsel Uzlaşı Haritası',
      description: 'Belirli bir konuda bilimsel topluluğun genel kanısını yüzdesel olarak görme.',
      steps: [
        'Araştırma sorusunu evet/hayır formatında yaz',
        '"Consensus meter" ile bilimsel uzlaşı oranını gör',
        'Destekleyen ve karşı çıkan makaleleri ayrı filtrele',
        'Çalışma kalitesine (etki büyüklüğü, örneklem) göre sırala',
      ],
      difficulty: 'Başlangıç',
      discipline: 'Kanıta Dayalı Eğitim / Tıp',
    },
  ],

  notebooklm: [
    {
      id: 'research-notebook',
      title: 'Araştırma Defteri Oluşturma',
      description: 'PDF makaleler yükleyerek kaynak bazlı soru-cevap ve not defteri oluşturma.',
      steps: [
        '5-15 ilgili makale veya kitap bölümünü PDF olarak yükle',
        '"Kaynaklar bazında" sorular sor (hangi makalede ne söyleniyor)',
        'Otomatik özet ve "Study Guide" özelliğini kullan',
        'Podcast formatında audio özet oluştur ve tekrar için kullan',
      ],
      difficulty: 'Başlangıç',
      discipline: 'Tüm Akademik Alanlar',
    },
    {
      id: 'collaborative-study',
      title: 'Öğrenci Çalışma Grubu Materyali',
      description: 'Ders kitabı ve notlardan otomatik çalışma materyali ve test soruları üretimi.',
      steps: [
        'Ders notları ve kaynak kitap bölümlerini yükle',
        '"FAQ" özelliğiyle sıkça sorulan soruları otomatik üret',
        'Sınav için alıştırma soruları oluştur',
        'Audio summary ile farklı öğrenme stillerine hitap et',
      ],
      difficulty: 'Başlangıç',
      discipline: 'Tüm Disiplinler',
    },
  ],

  'julius-ai': [
    {
      id: 'educational-data',
      title: 'Eğitim Verisi Analizi',
      description: 'Sınıf sınav puanları, devamsızlık verisi ve başarı analizleri.',
      steps: [
        'Excel/CSV formatındaki sınıf verisini yükle',
        '"Sınıf ortalaması, standart sapma ve dağılım grafiği" iste',
        'Başarısız öğrenci örüntülerini tespit ettir',
        '"Bu veriyi yöneticiye sunmak için hangi grafiği kullanmalıyım?" diye sor',
      ],
      difficulty: 'Orta',
      discipline: 'Eğitim Yönetimi / Araştırma',
    },
    {
      id: 'survey-analysis',
      title: 'Anket Veri Analizi',
      description: 'Likert ölçeği, faktör analizi ve güvenilirlik katsayısı hesaplama.',
      steps: [
        'Anket verisini CSV olarak yükle',
        '"Cronbach alpha ve faktör analizi hesapla" talimatı ver',
        'Demografik gruplara göre karşılaştırmalı analiz iste',
        'APA formatında sonuç tablosu oluşturmasını talep et',
      ],
      difficulty: 'İleri',
      discipline: 'Eğitim Araştırması / Psikoloji',
    },
  ],

  'researchrabbit': [
    {
      id: 'citation-network',
      title: 'Atıf Ağı Haritalama',
      description: 'Temel makaleden genişleyerek ilgili literatürü görsel ağ haritası olarak keşfetme.',
      steps: [
        'Konundaki temel (seminal) makaleyi ekle',
        '"Similar Papers" ve "References" grafiğini incele',
        'Zaman çizelgesinde alanın nasıl geliştiğini gözlemle',
        'Clustered kümelerden alanın alt disiplinlerini tespit et',
      ],
      difficulty: 'Orta',
      discipline: 'Bibliyometri / Alan Araştırması',
    },
  ],

  grammarly: [
    {
      id: 'academic-writing',
      title: 'Akademik Yazı Standartlarına Uyum',
      description: 'Akademik ton, tekrar ve pasif/aktif cümle dengesi için otomatik düzeltme.',
      steps: [
        'Makale bölümünü yapıştır',
        'Hedef kitleyi "Academic" olarak ayarla',
        'Clarity ve Engagement önerilerini filtrele',
        'Plagiarism checker ile özgünlük kontrolü yap',
      ],
      difficulty: 'Başlangıç',
      discipline: 'Akademik Yazım',
    },
  ],

  deepl: [
    {
      id: 'paper-translation',
      title: 'Akademik Makale Çevirisi',
      description: 'Bağlam ve terminoloji korumalı, yüksek kaliteli akademik çeviri.',
      steps: [
        'PDF veya metni yükle',
        'Hedef dili seç ve akademik alandaki teknik terimleri belirt',
        '"Glossary" özelliği ile alan terminolojisini kaydet',
        'Çevirinin tutarlılığını kritik bölümlerde manuel kontrol et',
      ],
      difficulty: 'Başlangıç',
      discipline: 'Uluslararası Akademik Yazışma',
    },
  ],

  midjourney: [
    {
      id: 'educational-visuals',
      title: 'Eğitim Materyali Görselleri',
      description: 'Ders kitabı kalitesinde diyagram, infografik ve kavram görselleri üretimi.',
      steps: [
        'Görsel anlatmak istediğin kavramı detaylı tanımla',
        '"educational diagram, infographic style, clean, white background" parametrelerini ekle',
        'Farklı varyasyonlar arasından pedagojik en uygun olanı seç',
        'Upscale ile yüksek çözünürlüklü sınıf materyali elde et',
      ],
      difficulty: 'Orta',
      discipline: 'Görsel Tasarım / STEM Eğitimi',
    },
    {
      id: 'historical-imagery',
      title: 'Tarihsel ve Kültürel Görseller',
      description: 'Tarih ve sosyal bilimler derslerinde tarihi ortam ve dönem görselleri üretimi.',
      steps: [
        'Dönem, coğrafya ve konuyu belirt',
        '"historically accurate, [dönem] period, [bölge]" gibi parametreler kullan',
        'Birden fazla varyasyon üret ve en doğru olanı seç',
        'Görsellerin sınıfta kullanımı için telif hakkı durumunu değerlendir',
      ],
      difficulty: 'Orta',
      discipline: 'Tarih / Sosyal Bilimler',
    },
  ],

  elevenlabs: [
    {
      id: 'audio-content',
      title: 'Sesli Ders İçeriği Üretimi',
      description: 'Ders notlarından profesyonel kalitede sesli anlatım ve podcast oluşturma.',
      steps: [
        'Ders metnini yapıştır ve hedef kitleyi belirt',
        'Doğal, akademik bir ses ve tempo seç',
        '"Bölüm geçişleri" için ses seviyesi ve ton ayarla',
        'Farklı dillerde çoklu ses versiyonu oluştur',
      ],
      difficulty: 'Başlangıç',
      discipline: 'Uzaktan Eğitim / Erişilebilirlik',
    },
    {
      id: 'accessibility',
      title: 'Erişilebilir Öğrenme Materyali',
      description: 'Görme engelli öğrenciler için metin-ses dönüşümü ve çok dilli içerik.',
      steps: [
        'Tüm ders materyallerini metin formatına dönüştür',
        'Farklı dil seçenekleri ile seslendirme yap',
        'Ses dosyalarını öğrenme yönetim sistemine yükle',
        'Öğrencilerin kendi hızlarında dinleyebileceği bölümlere ayır',
      ],
      difficulty: 'Başlangıç',
      discipline: 'Özel Eğitim / Kapsayıcı Eğitim',
    },
  ],

  synthesia: [
    {
      id: 'instructional-video',
      title: 'AI Avatar Ders Videosu',
      description: 'Kamera önüne geçmeden profesyonel ders videosu üretimi.',
      steps: [
        'Ders senaryosunu ve bölüm başlıklarını hazırla',
        'Hedef dil ve avatar seç (çoklu dil desteği mevcuttur)',
        'Slayda dayalı ekran paylaşımı ile avatarı entegre et',
        'Öğrenci geri bildirimine göre spesifik bölümleri kolayca güncelle',
      ],
      difficulty: 'Orta',
      discipline: 'e-Öğrenme / MOOC Üretimi',
    },
  ],

  'dalle-3': [
    {
      id: 'concept-illustration',
      title: 'Kavram İllüstrasyonu',
      description: 'Soyut kavramları somutlaştıran özgün illüstrasyon üretimi.',
      steps: [
        'Kavramı ve öğrenci düzeyini belirt',
        '"simple illustration, educational, age-appropriate" direktiflerini kullan',
        'ChatGPT\'nin DALL-E entegrasyonuyla doğrudan üret',
        'Creative Commons benzeri üretilen içeriği telif hakkı riski olmadan kullan',
      ],
      difficulty: 'Başlangıç',
      discipline: 'İlköğretim / Görsel Sanatlar',
    },
  ],

  'semantic-scholar': [
    {
      id: 'citation-analysis',
      title: 'Atıf Analizi ve Etki Ölçümü',
      description: 'Makalelerin etki faktörü, h-index ve atıf ağı analizi.',
      steps: [
        'Yazar adını veya makale başlığını arama kutusuna yaz',
        '"Highly Cited" filtresini kullanarak alandaki temel makaleleri bul',
        'Yıla göre atıf eğilimini incele (alan büyüyor mu, küçülüyor mu?)',
        'Semantic Reader ile makaleyi AI destekli okuma modunda incele',
      ],
      difficulty: 'Orta',
      discipline: 'Bibliyometri / Akademik Kariyer',
    },
  ],

  'connected-papers': [
    {
      id: 'field-mapping',
      title: 'Alan Haritası Çıkarma',
      description: 'Yeni bir alana girerken temel makalelerin atıf ağından alt disiplinleri ve boşlukları tespit etme.',
      steps: [
        'Alandaki en çok atıf alan 1-2 makaleyi bul (Google Scholar veya Semantic Scholar\'dan)',
        'connectedpapers.com\'a git → DOI veya başlık gir → ağ grafiğini üret',
        'Büyük düğümler (= yüksek etki) = muhakkak okunması gerekenler',
        'Renk tonlarıyla yılları oku: sarı = eski temel, mavi = güncel',
        '"Prior Works" listesinden tarihsel kökleri → "Derivative Works" ile son gelişmeleri al',
        'Birbirine bağlı kümeleri tespit et → her küme bir alt araştırma sorusu temsil eder',
      ],
      promptExample: 'Connected Papers\'da self-determination theory eğitim alanındaki temel makaleyi (örn. Ryan & Deci, 2000) girdikten sonra: 1) Kaç farklı küme var? 2) Her kümede hangi disiplin hakimiyet kuruyor? 3) Hangi alt konu son 3 yılda en çok gelişmiş? 4) Tezimin araştırma sorusuyla en çok örtüşen kümeyi belirle ve o kümedeki tüm büyük düğümleri Zotero koleksiyonuna ekle.',
      difficulty: 'Başlangıç',
      discipline: 'Tüm Akademik Alanlar',
    },
    {
      id: 'gap-identification',
      title: 'Araştırma Boşluğu Tespiti',
      description: 'Ağ grafiğindeki izole düğümler ve köprü makaleler aracılığıyla keşfedilmemiş bağlantıları bulma.',
      steps: [
        'Birden fazla temel makaleyle ayrı grafikler oluştur',
        'Hangi makalelerin her iki ağda da tekrar ettiğine bak (merkezi köprü çalışmalar)',
        'Ağda izi olmayan ama alaka düzeyi yüksek bir konu tespit et',
        'Bu boşluğu tez araştırma sorusu olarak yeniden çerçevele',
      ],
      promptExample: 'ChatGPT\'ye: "Connected Papers\'da [Konu A] ve [Konu B] için ayrı ağlar oluşturdum. Konu A\'nın ağında şu makaleler var: [liste]. Konu B\'ninki: [liste]. Bu iki ağın kesişim noktası olan makaleleri ve her iki ağda da bulunmayan ama bağlantı kurabilecek potansiyel araştırma konularını tespit et. Bunu yaparken her ağın 2020 sonrası Derivative Works bölümünü özellikle dikkate al." — Bu yaklaşım çift-literatür tezlerde araştırma özgünlüğü kazandırır.',
      difficulty: 'Orta',
      discipline: 'Araştırma Metodolojisi',
    },
  ],

  'scite': [
    {
      id: 'source-credibility',
      title: 'Kaynak Güvenilirlik Doğrulaması',
      description: 'Tezde kullanılan kaynakların destekleyici ve itiraz edici atıf oranı ile geri çekilme durumunu kontrol etme.',
      steps: [
        'scite.ai\'a her önemli kaynağın DOI\'sini gir',
        '"Supporting" vs "Contrasting" atıf oranlarını kaydet',
        'Contrasting atıfları tıkla ve itiraz gerekçelerini oku',
        '"Retracted" veya "Correction" uyarısı olan kaynakları listeden çıkar veya uyarıyla belirt',
        'Tartışma bölümünde "Bu bulguya itiraz eden çalışmalar da mevcuttur: [kaynak]" şeklinde dürüst atıf yap',
      ],
      promptExample: 'Scite Assistant\'a sor: "What are the main criticisms and contradictions of Hattie\'s Visible Learning meta-analysis (2009) according to citing literature? Summarize the top 5 contrasting studies and their specific methodological objections." — Bu sorgu tezin eleştirel literatür bölümü için hazır malzeme üretir ve Hattie\'nin çalışmasına körü körüne atıf yapmaktan kaçınmayı sağlar.',
      difficulty: 'Orta',
      discipline: 'Tüm Akademik Alanlar',
    },
  ],

  'scispace': [
    {
      id: 'paper-comprehension',
      title: 'Karmaşık Makale Anlama ve Analiz',
      description: 'Metodoloji, istatistik ve teknik terminoloji içeren makaleleri SciSpace Copilot ile adım adım anlama.',
      steps: [
        'PDF\'i SciSpace\'e yükle veya DOI ile aç',
        'Anlaşılmayan cümleyi veya tabloyu fare ile seç → "Explain" tıkla',
        '"What does this table show in simple terms?" ile istatistik tablolarını yorumlat',
        '"What are the limitations of this study?" ile zayıf noktaları tespit et',
        '"How does this connect to [diğer makale]?" ile literatür bağlantısı kur',
      ],
      promptExample: 'SciSpace\'e yüklediğin makaleye sor: "1) Bu çalışmanın teorik çerçevesi hangi varsayımlara dayanıyor ve bunların en tartışmalısı hangisi? 2) Tablo 2\'deki regresyon katsayılarını yorumla — β=0.34 ne anlama geliyor pratik açıdan? 3) Örneklem büyüklüğü (n=112) bu tür regresyon analizi için yeterli mi? Neden? 4) Bu çalışmanın sonuçlarını [ülke/kültür bağlamına] genellemek için hangi koşullar gerekir?" — Her yanıt makaledeki gerçek metne atıf içerir.',
      difficulty: 'Orta',
      discipline: 'Tüm Akademik Alanlar',
    },
    {
      id: 'literature-synthesis',
      title: 'Çoklu Makale Sentezi',
      description: 'Birden fazla makaleyi SciSpace\'e yükleyerek karşılaştırmalı analiz ve sentez oluşturma.',
      steps: [
        '5-10 ilgili makaleyi SciSpace kütüphanesine yükle',
        '"Literature Review" modunu aç',
        '"Bu makalelerin metodolojilerini karşılaştır" sorusunu sor',
        '"Ortak bulgular ve çelişkili sonuçlar neler?" ile sentez malzemesi çıkar',
        'Yanıtları kopyala → Claude veya ChatGPT\'de literatür bölümü taslağına dönüştür',
      ],
      promptExample: 'SciSpace Literature Review\'da 10 makale yükledikten sonra: "Compare the research designs used across these studies. For each study note: (1) design type, (2) sample characteristics, (3) key measures, (4) major findings, (5) limitations. Then identify: which two studies have the most contradictory findings, and what methodological differences might explain this?" — Üretilen tabloyu tezin metodoloji karşılaştırma tablosuna yapıştır.',
      difficulty: 'İleri',
      discipline: 'Akademik Araştırma',
    },
  ],

  'writefull': [
    {
      id: 'academic-language',
      title: 'Akademik Dil Standardına Yükseltme',
      description: 'Kendi yazdığın metnin akademik yayın veri tabanına kıyasla dil kalitesini ölçme ve iyileştirme.',
      steps: [
        'Makale bölümünü Writefull editörüne yapıştır',
        '"Language Check" ile akademik dil sorunlarını listele',
        '"Paraphrase" ile belirsiz veya gayri-resmi ifadeleri yeniden yaz',
        'Frekans göstergesinde nadiren kullanılan ifadeleri daha yaygın alternatiflerle değiştir',
        'Overleaf kullanıyorsan: Writefull eklentisini bağla → LaTeX içinde gerçek zamanlı öneri al',
      ],
      promptExample: 'Writefull Academizer\'a şu cümleleri ver: "The results show that the method works better. Many students find it hard to understand. We think this is because of how the brain works." → Writefull bu ifadeleri akademik veri tabanındaki en sık kullanılan karşılıklara çevirir: "The findings demonstrate a significant improvement in methodological efficacy. A substantial proportion of students encounter difficulty in comprehending the material. This may be attributed to underlying cognitive processing constraints." — Ardından her önerinin uygun olup olmadığını kendi alanın açısından değerlendir.',
      difficulty: 'Başlangıç',
      discipline: 'Akademik Yazım',
    },
    {
      id: 'reviewer-response',
      title: 'Hakem Değerlendirmesine Yanıt Yazma',
      description: 'Dergi hakem yorumlarına profesyonel ve standart akademik dilde yanıt oluşturma.',
      steps: [
        'Writefull\'de "Reviewer Response" modunu aç',
        'Hakem yorumunu yapıştır',
        '"Generate response" ile standart yanıt taslağı üret',
        'Taslağa kendi revizyonlarını ve değişiklik açıklamalarını ekle',
        'Yanıtın öfkeli veya savunmacı ton içermediğini kontrol et',
      ],
      promptExample: 'Writefull Reviewer Response Generator: Hakem yorumu: "The sample size is insufficient to support the broad claims made in the conclusion. The authors should either limit their conclusions or justify the sample adequacy." Üretilen yanıt taslağı: "We thank Reviewer 1 for this important methodological concern. We have revised the conclusion section (p. 18) to limit the scope of our claims to the specific population and context of this study. We have also added a dedicated limitations paragraph discussing sample size constraints and their implications for generalizability." — Bu taslağa yaptığın spesifik değişikliklerin sayfa ve satır numaralarını ekle.',
      difficulty: 'İleri',
      discipline: 'Akademik Yayın Süreci',
    },
  ],

  'microsoft-copilot': [
    {
      id: 'word-revision',
      title: 'Word\'de Makale Revizyonu',
      description: 'Microsoft Word\'de Copilot ile akademik makale bölümlerini yeniden yapılandırma ve geliştirme.',
      steps: [
        'Word\'de Copilot yan panelini aç (sağ üst köşe)',
        'Revize edilecek bölümü seç',
        '"Make this more academic and formal" talimatını ver',
        'Copilot\'un önerisini orijinalle yan yana karşılaştır',
        '"Suggest a stronger opening sentence for this paragraph" ile spesifik iyileştirmeler iste',
      ],
      promptExample: 'Word\'de Copilot\'a: "Seçili tartışma paragrafımı oku. Şunları yap: 1) Argümanın mantıksal akışını değerlendir — eksik bir adım var mı? 2) Bu paragrafın bağlama en iyi bağlandığı ve en zayıf kaldığı cümleyi işaretle. 3) Son cümleyi bir sonraki paragrafa geçiş köprüsü olarak yeniden yaz. 4) APA 7\'de yazılmış, bu argümanı destekleyecek 2-3 anahtar kelime öner ki Google Scholar\'da arama yapabileyim." — Copilot dokümanı okuyarak bağlama dayalı yanıt verir.',
      difficulty: 'Başlangıç',
      discipline: 'Tüm Akademik Yazım',
    },
  ],

  'notion-ai': [
    {
      id: 'research-system',
      title: 'Araştırma Yönetim Sistemi Kurma',
      description: 'Notion\'da tüm literatür notlarını, araştırma sürecini ve tez yazımını AI destekli sistemle yönetme.',
      steps: [
        'Notion\'da "Literatür Veritabanı" adlı bir database oluştur',
        'Her makale için: Başlık, Yazar, Yıl, DOI, Metodoloji, Bulgular, Alıntılar sütunları ekle',
        'Her makaleyi okuduktan sonra notlarını Notion\'da ilgili karta yaz',
        'Notion AI Q&A\'yı aç → "Bu veritabanındaki makalelerde hangi metodolojik yaklaşımlar baskın?" diye sor',
        'Tez taslağında boş kalan bölüm için: "Bu konuya hangi kartlardaki bilgiler uygulanabilir?" sorusunu sor',
      ],
      promptExample: 'Notion\'da /ask komutuyla: "Veritabanımdaki tüm kartları tara. Sosyal yapılandırmacılık teorisini temel alan çalışmaları listele ve her birinin örneklem grubunu karşılaştır. Örneklem grupları arasındaki en önemli farkı 2 cümlede özetle." → Yanıt tüm Notion sayfalarınızı tarar ve kaynaklı özet üretir. Bunu tezin teorik çerçeve bölümüne başlangıç malzemesi olarak kullan.',
      difficulty: 'Başlangıç',
      discipline: 'Tüm Akademik Alanlar',
    },
  ],

  'wolfram-alpha': [
    {
      id: 'stats-verification',
      title: 'İstatistiksel Sonuç Doğrulama',
      description: 'AI araçlarının ürettiği istatistik sonuçlarını Wolfram\'ın deterministik hesaplama motoruyla doğrulama.',
      steps: [
        'Julius AI veya ChatGPT\'nin ürettiği istatistik sonucunu al',
        'Wolfram Alpha\'ya hesaplama parametrelerini gir',
        'Sonuçları karşılaştır — uyuşmazlık varsa Wolfram\'ı esas al',
        'Adım adım çözüm görünümünden hangi formülün kullanıldığını doğrula',
      ],
      promptExample: 'Wolfram Alpha arama kutusuna doğrudan: "independent samples t-test, group1: mean=4.2, SD=0.8, n=35; group2: mean=3.6, SD=0.9, n=32; two-tailed" → t istatistiği, serbestlik derecesi, p değeri ve %95 güven aralığı hesaplanır. Sonucu Julius AI çıktısıyla karşılaştır. Ayrıca: "Cohen\'s d effect size calculator, mean difference=0.6, pooled SD=0.85" → pratik anlam derecesini hesapla.',
      difficulty: 'Orta',
      discipline: 'Araştırma Metodolojisi / İstatistik',
    },
  ],

  'cursor': [
    {
      id: 'research-analysis-code',
      title: 'Araştırma Analiz Kodu Üretimi',
      description: 'Doğal dil talimatlarıyla Python veya R\'da tam istatistiksel analiz kodu üretme ve çalıştırma.',
      steps: [
        'Cursor\'da yeni .py dosyası aç',
        'Yorumla bağlamı tanımla: # Araştırma sorusu, veri yapısı, kullanılan ölçekler',
        'Chat panelinde ne istediğini tam olarak açıkla',
        'Üretilen kodu çalıştır → hatayı Chat\'e kopyala → Cursor düzeltir',
        'Kodu anlamadan teslim etme: "Bu kodun her adımını açıkla" ile öğren',
      ],
      promptExample: 'Cursor Chat\'te: "data.csv dosyam var. Sütunlar: student_id, pre_score (0-100), post_score (0-100), group (intervention/control), gender (M/F/Other). Şunları yap: 1) Her grup için pre ve post puan değişimini hesapla (gain score). 2) Gain score\'ların normal dağılımını Shapiro-Wilk ile test et. 3) Gruplar arası gain score farkı için en uygun testi seç ve uygula (parametrik/non-parametrik karar ver, gerekçesini açıkla). 4) Etki büyüklüğünü hesapla (r veya d). 5) matplotlib ile grup başına box plot çiz. 6) Tüm sonuçları APA 7 formatında bir metin olarak yaz." — Cursor tüm kodu tek seferde üretir ve test eder.',
      difficulty: 'Orta',
      discipline: 'Eğitim Araştırması / Veri Bilimi',
    },
  ],

  'whisper': [
    {
      id: 'interview-transcription',
      title: 'Araştırma Görüşmesi Transkripsiyonu',
      description: 'Nitel araştırma görüşmelerini yerel Whisper kurulumla gizlilik güvenli şekilde metne dönüştürme.',
      steps: [
        'Yerel kurulum: pip install openai-whisper ffmpeg',
        'Ses dosyasını Türkçe için çalıştır: whisper gorushme.mp3 --model medium --language tr',
        'Üretilen transkripti düzenle: konuşmacı etiketleri ekle (K1:, K2:, Araştırmacı:)',
        'Kişisel bilgileri anonimleştir: isimleri kaldır, K1/K2 etiketleriyle değiştir',
        'NVivo veya Atlas.ti\'ye aktar → tematik kodlama başlat',
      ],
      promptExample: 'Yerel terminalde: whisper odak_grubu.mp3 --model large-v3 --language tr --output_format all --output_dir ./transkriptler → Dosyalar: .txt (düz metin), .srt (altyazı), .tsv (zaman damgalı). Ardından Claude\'a: "Bu görüşme transkripsiyonunda [araştırma sorusu] açısından öne çıkan temaları kodla ve her tema için 2-3 doğrudan alıntı sun. Kodlama sürecini tematik analiz metodolojisine (Braun & Clarke, 2006) uygun şekilde açıkla."',
      difficulty: 'Orta',
      discipline: 'Nitel Araştırma Metodolojisi',
    },
  ],

  'otter-ai': [
    {
      id: 'focus-group',
      title: 'Odak Grubu Görüşmesi Analizi',
      description: 'Otter.ai ile odak grubu görüşmesini gerçek zamanlı transkribe etme ve tematik analiz hazırlığı yapma.',
      steps: [
        'Otter.ai Zoom entegrasyonunu kur: Zoom ayarları → "Otter Notetaker" ekle',
        'Görüşme öncesi: Katılımcılardan transkripsiyon için yazılı izin al',
        'Görüşme sırasında: Konuşmacı adlarını tanımla (A, B yerine K1, K2)',
        'Görüşme sonrası: Transkripti düzenle, konuşmacı etiketlerini doğrula',
        'AI Chat: "Bu görüşmede [araştırma sorusuna] ilişkin 5 ana tema nedir?" sorusunu sor',
      ],
      promptExample: 'Otter.ai\'da transkript tamamlandıktan sonra AI Chat\'e: "Bu odak grubu görüşme transkriptini tematik analiz için incele. Katılımcıların [konuyu] yorumlama biçimleri açısından: 1) Ortak deneyimler ve mutabık kalınan noktalar, 2) Görüş ayrılıkları ve çelişkili ifadeler, 3) Duygusal yükü yüksek ifadeler, 4) Araştırma sorusuna yanıt niteliğindeki 5 doğrudan alıntı. Yanıtları zaman damgalarıyla ver ki ses dosyasında doğrulayabileyim." — Bu çıktıyı NVivo\'ya aktarmadan önce ön kodlama çalışması olarak kullan.',
      difficulty: 'Orta',
      discipline: 'Nitel Araştırma / Odak Grubu',
    },
  ],

  'gamma-app': [
    {
      id: 'conference-presentation',
      title: 'Konferans Sunumu Hazırlama',
      description: 'Araştırma makalesinden Gamma ile 20 dakikalık akademik konferans sunumu oluşturma.',
      steps: [
        'Gamma\'ya makale özetini veya ana bulgularını yapıştır',
        '"Create presentation" → "Academic/Research" şablonunu seç',
        'Otomatik oluşan slayt yapısını incele: Giriş, Yöntem, Bulgular, Tartışma, Sonuç',
        'Her slayda maksimum 5 nokta kuralını uygula — fazlasını konuşmacı notlarına taşı',
        'Grafikler için: verileri yapıştır → Gamma otomatik görselleştirme üretir',
        'PDF veya PowerPoint olarak dışa aktar → konuşmacı notlarını tamamla',
      ],
      promptExample: 'Gamma\'da "Generate" → şu metni gir: "Create a 12-slide academic conference presentation for a 20-minute slot. Topic: [araştırma konusu]. Structure: Title (1 slide), Research Problem & Gap (2 slides), Theoretical Framework with diagram (2 slides), Methodology: participants/instruments/procedure (2 slides), Key Results with 2 data visualizations (2 slides), Discussion & Implications (2 slides), Limitations & Future Research + References (1 slide). Use formal academic tone, minimal bullet points, include space for speaker notes, color scheme: professional navy and white." → Oluşan taslağı kendi içerikle doldur.',
      difficulty: 'Başlangıç',
      discipline: 'Tüm Akademik Alanlar',
    },
  ],
}

// ─── PRO/CON DATA PER TOOL ─────────────────────────────────────────────────────

export const PRO_CON_DATA: Record<string, ProConData> = {
  chatgpt: {
    pros: [
      'Türkçe dahil 50+ dil desteği',
      'Geniş görev yelpazesi (yazı, kod, analiz)',
      'GPT-4o ile görsel anlama kapasitesi',
      'Özelleştirilebilir GPT mağazası',
      'Kullanıcı dostu arayüz, düşük öğrenme eğrisi',
    ],
    cons: [
      'Ücretsiz sürümde GPT-4 erişimi kısıtlı',
      '2021 öncesi eğitim verisi (eski bilgi riski)',
      'Halüsinasyon riski — kaynak doğrulama zorunlu',
      'Uzun bağlamlarda tutarsızlık',
      'Hassas verilerin platform dışı paylaşım riski',
    ],
    bestFor: ['Ders planı', 'Sınav sorusu', 'Metin üretimi', 'Bireysel geri bildirim'],
    costModel: 'Ücretsiz (GPT-3.5) / Aylık $20 (ChatGPT Plus)',
    privacyNote: 'Konuşma geçmişi varsayılan olarak OpenAI\'a iletilir. Kurumsal kullanımda Data Privacy ayarlarını etkinleştir.',
  },
  claude: {
    pros: [
      '200K token bağlam — tam tez analizi yapabilir',
      'Akademik ton ve hassasiyet konusunda üstün',
      'Kaynak bildirme tutarlılığı yüksek',
      'Constitutional AI ile güvenli içerik',
      'Uzun belge karşılaştırmasında rakipsiz',
    ],
    cons: [
      'Web erişimi yok (internet araması yapamaz)',
      'Görsel üretme kapasitesi yok',
      'Ücretsiz plan günlük mesaj limiti içeriyor',
      'Bazı uzmanlık alanlarında ChatGPT\'ye göre daha az pratik bilgi',
    ],
    bestFor: ['Tez analizi', 'Uzun belge inceleme', 'Akademik yazı revizyonu', 'Etik değerlendirme'],
    costModel: 'Ücretsiz (Claude.ai) / Aylık $20 (Claude Pro)',
    privacyNote: 'Anthropic, konuşmaları model eğitiminde kullanmayabilir (tercih edilebilir). Kurumsal API planı için GDPR uyumu mevcuttur.',
  },
  gemini: {
    pros: [
      'Google Workspace entegrasyonu (Docs, Slides, Sheets)',
      'Gerçek zamanlı Google arama ile güncel bilgi',
      'Çok modlu (metin, görüntü, ses, video)',
      'Uzun bağlam desteği (1M token)',
    ],
    cons: [
      'Türkçe performansı İngilizce\'ye göre zayıf',
      'Akademik kaynak gösterimi hâlâ güvenilir değil',
      'Google bağımlılığı oluşturabilir',
    ],
    bestFor: ['Google Workspace kullanıcıları', 'Çok modlu ders materyali', 'Güncel bilgi taraması'],
    costModel: 'Ücretsiz (Gemini) / Aylık $19.99 (Gemini Advanced)',
    privacyNote: 'Google hesabınıza bağlıdır. Eğitim kurumları Google Workspace for Education planını inceleyin.',
  },
  perplexity: {
    pros: [
      'Her yanıtta kaynak atfı zorunlu',
      'Gerçek zamanlı web erişimi',
      'Akademik filter ile yalnızca bilimsel kaynaklar',
      'Ücretsiz temel kullanım',
    ],
    cons: [
      'Derin analiz yapma kapasitesi GPT-4/Claude\'dan zayıf',
      'Kaynak kalitesi değişkenlik gösterebilir',
      'Ücretli planda tam potansiyel açılıyor',
    ],
    bestFor: ['Kaynak tarama', 'Güncel araştırma', 'Hızlı literatür özeti'],
    costModel: 'Ücretsiz (5 Pro Aramaya Kadar) / Aylık $20 (Pro)',
    privacyNote: 'Arama geçmişi saklanır. Gizli mod seçeneği mevcuttur.',
  },
  elicit: {
    pros: [
      'PRISMA\'ya uygun sistematik tarama',
      'Makalelerden otomatik veri çıkarımı',
      'Meta-analiz için tablo exportu',
      'Ücretsiz başlangıç planı',
    ],
    cons: [
      'Türkçe makale desteği sınırlı',
      'Yalnızca Semantic Scholar indeksindeki makaleler',
      'Karmaşık araştırma sorularında eksik kalabilir',
    ],
    bestFor: ['Sistematik derleme', 'Meta-analiz', 'PICO bazlı soru'],
    costModel: 'Ücretsiz (5K kredi) / Aylık $12 (Plus)',
    privacyNote: 'Araştırma verileriniz Elicit sunucularında işlenir. Hassas veriler için şifreleme protokollerini inceleyin.',
  },
  notebooklm: {
    pros: [
      'Yüklenen kaynaklara dayalı yanıt (halüsinasyon yok)',
      'Podcast audio özet üretimi',
      'Ücretsiz (Google hesabı yeterli)',
      'Kaynak bazlı atıf sistemi',
    ],
    cons: [
      'Kaynak olmadan yanıt veremiyor',
      'Dışarıdan web erişimi yok',
      'Yalnızca yüklenen belgeler kapsamında',
    ],
    bestFor: ['Ders materyali analizi', 'Araştırma defteri', 'Çalışma grubu hazırlığı'],
    costModel: 'Ücretsiz (Google hesabıyla)',
    privacyNote: 'Google\'ın veri işleme politikaları geçerlidir. Kurumsal kullanımda Google Workspace for Education tercih edin.',
  },
  'julius-ai': {
    pros: [
      'Kod yazmadan istatistiksel analiz',
      'Python/R kodu görme ve düzenleme seçeneği',
      'Görselleştirme otomatik üretimi',
      'SPSS/Excel verisi doğrudan yüklenebilir',
    ],
    cons: [
      'Büyük veri setlerinde yavaşlama',
      'İleri istatistik (SEM, çok düzeyli model) için ek validasyon gerekli',
      'Ücretli plan gerektiriyor',
    ],
    bestFor: ['Eğitim araştırması', 'Anket analizi', 'PISA/TIMSS veri analizi'],
    costModel: 'Aylık $20 (Pro) — Akademik indirim mevcut',
    privacyNote: 'Yüklenen veri şifrelenir. FERPA uyumluluğu araştırılmalı.',
  },
  midjourney: {
    pros: [
      'Eğitim illüstrasyonu kalitesi çok yüksek',
      'Stil tutarlılığı (--sref ile)',
      'Büyük akademik proje görsel üretiminde verimli',
    ],
    cons: [
      'Discord üzerinden kullanım — kurumsal engel olabilir',
      'Telif hakkı politikası muğlak',
      'Ücretsiz plan yok, minimum $10/ay',
    ],
    bestFor: ['Ders kitabı illüstrasyonu', 'Konsept görselleştirme', 'Tarihsel ortam görseli'],
    costModel: 'Aylık $10 (Basic) / $30 (Standard)',
    privacyNote: 'Üretilen görseller varsayılan olarak kamuya açık. --no-public parametresi Pro/Stealth modda kullanılabilir.',
  },
  elevenlabs: {
    pros: [
      'İnsan sesine en yakın TTS kalitesi',
      'Türkçe dahil 29 dil desteği',
      'Ses klonlama (eğitimci kendi sesini kullanabilir)',
      'API ile LMS entegrasyonu mümkün',
    ],
    cons: [
      'Ses klonlama etik risk taşır',
      'Ücretsiz planda 10.000 karakter/ay',
      'Yüksek özelleştirme ücretli',
    ],
    bestFor: ['Sesli ders materyali', 'Erişilebilirlik', 'Çok dilli içerik'],
    costModel: 'Ücretsiz (10K karakter) / Aylık $5-$330 arası',
    privacyNote: 'Ses klonlama için açık rıza zorunludur. GDPR kapsamında işlenen veriler.',
  },
  synthesia: {
    pros: [
      '140+ dilde otomatik seslendirme',
      'Kamera gerektirmez',
      'Kurumsal LMS entegrasyonu',
      'Kolay script güncelleme',
    ],
    cons: [
      'Avatar gerçekçiliği gelişiyor ama hâlâ yapay hissettiriyor',
      'Yüksek maliyet ($22/ay başlangıç)',
      'Uzun videolarda render süresi',
    ],
    bestFor: ['MOOC video üretimi', 'Çok dilli ders', 'Kurumsal eğitim'],
    costModel: 'Aylık $22 (Starter) / $67 (Creator)',
    privacyNote: 'Avatar görüntüleri Synthesia sunucularında işlenir. GDPR uyumlu.',
  },
  'connected-papers': {
    pros: [
      'Görsel atıf haritasıyla alan bağlamı hızla kavranır',
      'Prior Works / Derivative Works ayrımı tarihsel çizgi sağlar',
      'Ücretsiz temel kullanım (5 graf/ay)',
      'Yeni araştırmacılar için giriş eşiği çok düşük',
      'Zotero ile birlikte kullanıldığında sistematik taramayı tamamlar',
    ],
    cons: [
      'Aylık 5 ücretsiz grafla sınırlı',
      'Türkçe kaynak içeriği sınırlı — İngilizce literatürde daha etkili',
      'Nicel atıf analizi için Semantic Scholar veya Scite gerekli',
      'Graflar büyük, ayrıntılı okuma zaman alabilir',
    ],
    bestFor: ['Alana yeni giriş', 'Sistematik tarama başlangıcı', 'Tez literatürü keşfi'],
    costModel: 'Ücretsiz (5 graf/ay) / $3/ay (sınırsız)',
    privacyNote: 'Arama geçmişi kaydedilir. Kurumsal veriler için hesap gizlilik ayarlarını incele.',
  },
  'scite': {
    pros: [
      'Atıfın "destekliyor mu / çürütüyor mu?" ayrımı benzersiz',
      'Geri çekilmiş makale uyarısı kritik güvenlik katmanı',
      'Tarayıcı eklentisiyle okuma sırasında anlık atıf bağlamı',
      'Akademik dürüstlük açısından öğrencilere kaynak eleştirisi öğretir',
    ],
    cons: [
      'Derin analiz ücretli ($20/ay)',
      'Türkçe yayın indeksleme kapsamı kısıtlı',
      'Tüm dergileri kapsamıyor — indeks dışı yayınlar görünmez',
    ],
    bestFor: ['Kaynak doğrulama', 'Tartışma bölümü için eleştirel atıf', 'Geri çekilmiş kaynak tespiti'],
    costModel: 'Ücretsiz (sınırlı) / $20/ay (tam erişim)',
    privacyNote: 'Arama verileri Scite sunucularında işlenir. Kurumsal lisans için kurumla görüş.',
  },
  'scispace': {
    pros: [
      'Makale içinde cümle bazlı AI soru-cevap — benzersiz özellik',
      'Tablo ve denklem açıklama pedagojik değeri yüksek',
      'Çoklu makale karşılaştırması için pratik',
      'Ücretsiz temel kullanım mevcut',
    ],
    cons: [
      'Günlük ücretsiz soru sayısı kısıtlı',
      'Karmaşık istatistiksel yorumlarda hata yapabilir — doğrulama şart',
      'Tüm PDF formatlarını okuyamayabiliyor (özellikle eski tarama)',
    ],
    bestFor: ['Metodoloji bölümünü anlama', 'İstatistik tabloları yorumlama', 'Çok makale sentezi'],
    costModel: 'Ücretsiz (5 soru/gün) / $12/ay (Premium)',
    privacyNote: 'Yüklenen PDF\'ler SciSpace sunucularında işlenir. Gizli veri içeren belgeler için yerel alternatif kullan.',
  },
  'writefull': {
    pros: [
      'Akademik yayın veri tabanına dayalı öneriler — güvenilir kaynak',
      'Overleaf entegrasyonu LaTeX kullanıcıları için paha biçilmez',
      'Hakem yanıt yazımı için pratik şablon üretimi',
      'Ücretsiz temel plan mevcut',
    ],
    cons: [
      'Türkçe akademik yazım için veri tabanı zayıf (İngilizce odaklı)',
      'Öneriler körü körüne takip edilirse özgün ses kaybolabilir',
      'Parafraz özelliği kötü kullanılırsa akademik dürüstlük riski',
    ],
    bestFor: ['İngilizce akademik makale yazımı', 'Hakem yanıtı', 'Overleaf LaTeX kullanıcıları'],
    costModel: 'Ücretsiz (temel) / $9.99/ay (tam)',
    privacyNote: 'Metin verileri Writefull tarafından işlenir. Gizli araştırma içerikleri için koşulları incele.',
  },
  'microsoft-copilot': {
    pros: [
      'Office 365 entegrasyonu mevcut iş akışına sorunsuz eklemlenir',
      'Word, Excel, PowerPoint, Teams — tek abonelikte dört araç',
      'Kurumsal veri güvenliği Microsoft altyapısında korunur',
      'FERPA ve kurumsal uyum politikaları mevcuttur',
    ],
    cons: [
      'Microsoft 365 aboneliği + Copilot eklentisi ayrıca ücretli ($30/kullanıcı/ay kurumsal)',
      'Türkçe performansı İngilizce\'ye kıyasla daha az optimize',
      'Verimli kullanım için prompt mühendisliği öğrenme eğrisi',
    ],
    bestFor: ['Office 365 kullanan akademisyenler', 'Toplantı özeti', 'Excel veri analizi'],
    costModel: 'Microsoft 365 + Copilot eklentisi / Kurumsal lisans',
    privacyNote: 'Microsoft Enterprise Privacy ilkeleri geçerli. GDPR ve FERPA uyumlu seçenekler mevcuttur.',
  },
  'notion-ai': {
    pros: [
      'Tüm araştırma notları tek yerde — AI ile aranabilir',
      'Özelleştirilebilir veritabanı şablonları: literatür, tez takvimi, görev takibi',
      'Takım işbirliği özelliği araştırma grubu çalışmaları için ideal',
      'Ücretsiz plan bireysel akademik kullanım için yeterli',
    ],
    cons: [
      'AI özelliği Plus planı gerektiriyor ($8/ay)',
      'Başlangıç sistemi kurulumu zaman alabilir',
      'Offline çalışmaz — internet bağlantısı şart',
    ],
    bestFor: ['Tez organizasyonu', 'Literatür not yönetimi', 'Araştırma proje takibi'],
    costModel: 'Ücretsiz (bireysel) / $8/ay (Plus, AI dahil)',
    privacyNote: 'Notion ABD sunucularında çalışır. GDPR uyumu için veri konumu ayarlarını kontrol et.',
  },
  'wolfram-alpha': {
    pros: [
      'Deterministik hesaplama — AI tahmin değil, matematiksel kesinlik',
      'Adım adım çözüm öğretici ve doğrulanabilir',
      'İstatistik, matematik, fizik, kimya — çok alan kapsamı',
      'Ücretsiz temel kullanım mevcut',
    ],
    cons: [
      'Metin anlama veya analiz yapamaz — sadece hesaplama',
      'Adım adım çözümler için Pro gerekli ($5/ay)',
      'Arayüz ilk bakışta karmaşık gelebilir',
    ],
    bestFor: ['İstatistik doğrulama', 'Matematik çözümü', 'Bilimsel hesaplama'],
    costModel: 'Ücretsiz (temel) / $5/ay (Pro, adım adım çözüm)',
    privacyNote: 'Sorgular Wolfram sunucularında işlenir. Hassas araştırma verisi girmekten kaçın.',
  },
  'cursor': {
    pros: [
      'Tüm proje bağlamını anlayan AI — tek dosya odaklı araçlardan üstün',
      'VS Code eklentileri çalışır — tanıdık ortam',
      'Araştırma kodu üretme ve hata ayıklamada çok verimli',
      'GPT-4 ve Claude modellerine erişim tek platformdan',
    ],
    cons: [
      'Ücretsiz planda aylık 50 sorgu limiti',
      'Kod bilgisi sıfır olanlar için öğrenme eğrisi var',
      'Üretilen kodu anlamadan kullanmak akademik riski artırır',
    ],
    bestFor: ['Araştırma veri analizi kodu', 'Otomasyon betikleri', 'Eğitim uygulaması prototipi'],
    costModel: 'Ücretsiz (50 sorgu/ay) / $20/ay (Pro, sınırsız)',
    privacyNote: 'Kod ve dosyalar Cursor/Anthropic/OpenAI sunucularına iletilir. Gizli veri için Privacy Mode\'u aktif et.',
  },
  'whisper': {
    pros: [
      'Yerel çalışma — araştırma verisi hiçbir sunucuya gitmez',
      'Açık kaynak — ücretsiz, sınırsız kullanım',
      'Türkçe dahil 99 dil desteği',
      'Gürültülü ortam kayıtlarında yüksek doğruluk',
    ],
    cons: [
      'Kurulum teknik bilgi gerektiriyor (Python, komut satırı)',
      'Konuşmacı ayrımı (diarization) için ek araç gerekli',
      'Büyük modeller yavaş çalışabilir — GPU faydalı',
    ],
    bestFor: ['Görüşme transkripsiyonu', 'Gizlilik gerektiren araştırma verisi', 'Çok dilli transkripsiyon'],
    costModel: 'Tamamen ücretsiz (açık kaynak) / OpenAI API üzerinden $0.006/dk',
    privacyNote: 'Yerel kurulumda veri dışarı çıkmaz — nitel araştırma verisi için en güvenli seçenek.',
  },
  'otter-ai': {
    pros: [
      'Gerçek zamanlı transkripsiyon ve konuşmacı tanıma',
      'Zoom/Teams/Meet ile sorunsuz entegrasyon',
      'FERPA ve HIPAA uyum seçenekleri',
      'AI Chat ile transkript üzerinde soru-cevap',
    ],
    cons: [
      'Ücretsiz planda aylık 300 dakika limiti',
      'Türkçe konuşma tanıma kalitesi İngilizce\'nin altında',
      'Veri ABD sunucularında işlenir — uluslararası veri koruma sorunu olabilir',
    ],
    bestFor: ['Odak grubu', 'Derinlemeli mülakat', 'Araştırma toplantısı'],
    costModel: 'Ücretsiz (300 dk/ay) / $8.33/ay (Pro, 1200 dk)',
    privacyNote: 'FERPA uyumlu kurumsal plan için otter.ai/enterprise. Katılımcı rızası yasal zorunluluktur.',
  },
  'gamma-app': {
    pros: [
      'Taslaktan dakikalar içinde tam sunum — zaman tasarrufu büyük',
      'LaTeX matematik desteği akademik içerik için kritik',
      'Web paylaşımı konferans linkiyle anında erişim',
      'Ücretsiz başlangıç kredisi yeterli',
    ],
    cons: [
      'Gamma tasarımları birbirine benziyor — kurumsal kimlik farklılaşması zor',
      'Karmaşık veri görselleştirme sınırlı — Tableau ile tamamlanmalı',
      'PDF export\'ta bazı formatlama kayıpları',
    ],
    bestFor: ['Konferans sunumu', 'Araştırma özeti', 'Hızlı ders materyali'],
    costModel: 'Ücretsiz (400 kredi hediye) / $10/ay (Pro, sınırsız AI)',
    privacyNote: 'İçerik Gamma sunucularında işlenir. Gizli araştırma verisi içeren sunumlar için yerel PowerPoint tercih edin.',
  },
  'heygen': {
    pros: [
      'Tek fotoğraftan gerçekçi avatar videosu',
      'Video Translation ile mevcut videoları çok dile çevirme',
      'Dudak senkronizasyon kalitesi rakiplerinin önünde',
      'Konferans videosu uluslararasılaştırma için pratik',
    ],
    cons: [
      'Ücretsiz plan yalnızca 1 dakika',
      'Yanlış çevirilmiş teknik terimler uzman kontrolü gerektirir',
      'Ses klonlama etik sorumluluk gerektirir',
    ],
    bestFor: ['Uluslararası konferans videosu', 'Çok dilli kurs', 'Kişiselleştirilmiş ders içeriği'],
    costModel: 'Ücretsiz (1 dk) / Creator $29/ay',
    privacyNote: 'Ses ve görüntü verileri HeyGen\'e yüklenir. Kişisel görüntü kullanımı için açık rıza şarttır.',
  },
}

// ─── LEARNING PATHS ───────────────────────────────────────────────────────────

export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: 'akademik-uretkenlik',
    title: 'Akademik Üretkenlik',
    subtitle: 'Araştırmadan yayına 5 adımda',
    description:
      'Araştırma sorusu belirleme, literatür tarama, analiz, yazım ve sunum aşamalarının her birinde doğru AI aracını kullanarak akademik verimliliği maksimize et.',
    duration: '4–6 saat',
    level: 'Orta',
    targetAudience: 'Araştırmacılar, yüksek lisans/doktora öğrencileri, akademisyenler',
    icon: '🎓',
    color: 'indigo',
    prerequisites: ['Temel AI araç kullanımı', 'Akademik yazım temelleri'],
    steps: [
      {
        toolSlug: 'perplexity',
        toolName: 'Perplexity AI',
        action: 'Araştırma sorusunu netleştir ve ön literatür taraması yap',
        duration: '30 dk',
        outcome: 'Alana hakim olmak için temel kaynak listesi',
        promptHint: '"[Konu] alanında son 5 yılın en çok atıf alan çalışmaları hangileri?" diye sor',
      },
      {
        toolSlug: 'researchrabbit',
        toolName: 'ResearchRabbit',
        action: 'Temel makaleleri girerek atıf ağını ve alt konuları keşfet',
        duration: '45 dk',
        outcome: 'Görsel literatür haritası ve önemli yazarlar listesi',
      },
      {
        toolSlug: 'notebooklm',
        toolName: 'NotebookLM',
        action: 'İncelenen makaleleri yükle, kaynak bazlı notlar al',
        duration: '90 dk',
        outcome: 'Organize araştırma defteri ve karşılaştırmalı özetler',
        promptHint: '"Bu makalelerin ortak sınırlılıkları neler?" sorusunu kaynaklara sor',
      },
      {
        toolSlug: 'claude',
        toolName: 'Claude',
        action: 'Notları sentezle, metodoloji tasarla ve taslak yaz',
        duration: '90 dk',
        outcome: 'Makale taslağı ve metodoloji bölümü',
        promptHint: 'Tüm notlarını yapıştır ve "bu bulgulardan bir literatür bölümü taslağı oluştur" de',
      },
      {
        toolSlug: 'grammarly',
        toolName: 'Grammarly',
        action: 'Akademik dil, ton ve dilbilgisi revizyonu yap',
        duration: '45 dk',
        outcome: 'Yayına hazır, akademik standartta metin',
      },
    ],
    outcomes: [
      'Sistematik literatür tarama sürecini AI ile hızlandırmak',
      'Kaynaklara dayalı, doğrulanabilir araştırma notu defteri oluşturmak',
      'Akademik yazım kalitesini standart altına düşürmeden verimlilik sağlamak',
      'Tekrarlayan araştırma görevlerini otomatikleştirmek',
    ],
  },
  {
    slug: 'bilimsel-arastirma-yontemleri',
    title: 'Bilimsel Araştırma Yöntemleri',
    subtitle: 'Hipotezden veri analizine bilimsel süreç',
    description:
      'PICO formatında araştırma sorusu oluşturmaktan sistematik tarama, veri analizi ve sonuç yorumlamaya kadar tüm bilimsel süreç AI desteğiyle nasıl yürütülür?',
    duration: '6–10 saat',
    level: 'İleri',
    targetAudience: 'Doktora öğrencileri, kıdemli araştırmacılar, kanıta dayalı uygulama ekipleri',
    icon: '🔬',
    color: 'violet',
    prerequisites: ['Araştırma metodolojisi temelleri', 'İstatistik temelleri'],
    steps: [
      {
        toolSlug: 'chatgpt',
        toolName: 'ChatGPT',
        action: 'Araştırma sorusunu PICO formatında yapılandır ve hipotez oluştur',
        duration: '30 dk',
        outcome: 'Net PICO sorusu, ana ve alt hipotezler',
        promptHint: '"Bu araştırma sorusunu PICO formatına çevir ve test edilebilir hipotezler üret" de',
      },
      {
        toolSlug: 'elicit',
        toolName: 'Elicit',
        action: 'PRISMA kriterlerine göre sistematik literatür taraması yap',
        duration: '120 dk',
        outcome: 'PRISMA akış şeması ve dahil edilen makale listesi',
      },
      {
        toolSlug: 'consensus',
        toolName: 'Consensus',
        action: 'Hipotez konusundaki bilimsel uzlaşıyı ölç',
        duration: '30 dk',
        outcome: 'Uzlaşı yüzdesi ve çelişkili bulguların listesi',
      },
      {
        toolSlug: 'julius-ai',
        toolName: 'Julius AI',
        action: 'Toplanan veriyi istatistiksel olarak analiz et',
        duration: '120 dk',
        outcome: 'Tanımlayıcı ve çıkarımsal istatistik tabloları',
        promptHint: '"Bu veri için uygun parametrik/parametrik dışı test hangisi?" diye sor',
      },
      {
        toolSlug: 'claude',
        toolName: 'Claude',
        action: 'Bulguları yorumla, tartışma bölümü yaz ve sınırlılıkları belirle',
        duration: '90 dk',
        outcome: 'Tartışma ve sonuç bölümü taslağı',
      },
    ],
    outcomes: [
      'Bilimsel araştırma sürecini AI destekli olarak yürütebilme',
      'Sistematik derleme için PRISMA protokolünü uygulayabilme',
      'İstatistiksel analizi kod bilgisi olmadan yapabilme',
      'Bulguları akademik standartta raporlayabilme',
    ],
  },
  {
    slug: 'yaratici-mufredat-tasarimi',
    title: 'Yaratıcı Müfredat Tasarımı',
    subtitle: 'Hedef belirleme\'den zengin ders içeriğine',
    description:
      'Bloom Taksonomisi\'ne dayalı öğrenme hedefleri belirlemekten, görsel materyaller, sesli anlatımlar ve interaktif değerlendirme araçlarına kadar eksiksiz bir müfredat üretim süreci.',
    duration: '3–5 saat',
    level: 'Başlangıç',
    targetAudience: 'Öğretmenler, öğretim tasarımcıları, müfredat geliştirme uzmanları',
    icon: '🎨',
    color: 'pink',
    prerequisites: ['Temel bilgisayar yetkinliği'],
    steps: [
      {
        toolSlug: 'chatgpt',
        toolName: 'ChatGPT',
        action: 'Ünite öğrenme hedeflerini Bloom\'a göre yaz ve ders planını oluştur',
        duration: '45 dk',
        outcome: 'Ölçülebilir hedefler ve haftalık ders planı',
        promptHint: '"Bloom\'un 6 basamağına göre, her basamaktan en az 2 eylem fiili kullan" talimati ekle',
      },
      {
        toolSlug: 'midjourney',
        toolName: 'Midjourney',
        action: 'Ders için özgün illüstrasyon ve kavram görselleri üret',
        duration: '60 dk',
        outcome: 'Telif hakkı endişesi olmayan, özgün görsel seti',
      },
      {
        toolSlug: 'elevenlabs',
        toolName: 'ElevenLabs',
        action: 'Ders özetlerinden sesli anlatım kayıtları oluştur',
        duration: '30 dk',
        outcome: 'Podcast formatında dinlenebilir ders içeriği',
      },
      {
        toolSlug: 'chatgpt',
        toolName: 'ChatGPT',
        action: 'Değerlendirme rubriği ve sınav soruları oluştur',
        duration: '45 dk',
        outcome: 'Farklılaştırılmış değerlendirme araçları seti',
      },
      {
        toolSlug: 'notebooklm',
        toolName: 'NotebookLM',
        action: 'Tüm materyalleri yükle ve öğrenci çalışma rehberi oluştur',
        duration: '30 dk',
        outcome: 'Kaynakları bağlı, kapsamlı öğrenci rehberi',
      },
    ],
    outcomes: [
      'AI destekli müfredat tasarım sürecini uygulamaya alabilme',
      'Çoklu formatta (görsel, ses, metin) ders materyali üretebilme',
      'Farklı öğrenme stillerine hitap eden içerik geliştirebilme',
      'Değerlendirme araçlarını öğrenme hedefleriyle hizalayabilme',
    ],
  },
  {
    slug: 'dijital-pedagoji-arastirmasi',
    title: 'Dijital Pedagoji Araştırması',
    subtitle: 'Eğitim teknolojilerini bilimsel gözle değerlendirme',
    description:
      'Eğitim araştırmacılarının AI araçlarının pedagojik etkisini ölçmek, öğrenci verilerini analiz etmek ve kanıta dayalı öneriler geliştirmek için kullanabileceği bir süreç tasarımı.',
    duration: '5–8 saat',
    level: 'İleri',
    targetAudience: 'Eğitim araştırmacıları, okul yöneticileri, politika yapıcılar',
    icon: '📊',
    color: 'emerald',
    prerequisites: ['Araştırma metodolojisi', 'Temel veri analizi bilgisi'],
    steps: [
      {
        toolSlug: 'semantic-scholar',
        toolName: 'Semantic Scholar',
        action: 'Eğitim teknolojisi araştırmasındaki temel çalışmaları tarayın',
        duration: '60 dk',
        outcome: 'Alanın temel referans listesi ve h-index değerleri',
      },
      {
        toolSlug: 'elicit',
        toolName: 'Elicit',
        action: 'Pedagojik müdahale çalışmalarını sistematik olarak derle',
        duration: '90 dk',
        outcome: 'Etki büyüklüğü ve örneklem bilgileri içeren tablo',
      },
      {
        toolSlug: 'julius-ai',
        toolName: 'Julius AI',
        action: 'Öğrenci başarı ve devamsızlık verilerini analiz et',
        duration: '90 dk',
        outcome: 'İstatistiksel bulgular ve görselleştirmeler',
      },
      {
        toolSlug: 'claude',
        toolName: 'Claude',
        action: 'Araştırma bulgularını politika önerilerine dönüştür',
        duration: '60 dk',
        outcome: 'Yönetici özeti ve eylem planı taslağı',
      },
    ],
    outcomes: [
      'Eğitim araştırmasında AI\'ı metodolojik bir araç olarak kullanabilme',
      'Öğrenci veri analizini etik çerçevede yürütebilme',
      'Kanıta dayalı politika önerileri geliştirebilme',
    ],
  },
]

// ─── EDUCATOR TIPS BY CATEGORY ─────────────────────────────────────────────────

export const EDUCATOR_TIPS: Record<string, string[]> = {
  text: [
    'Akademik dürüstlük için AI çıktısını her zaman kritik süzgeçten geçir',
    'Öğrencilere AI ile etik kullanım protokollerini öğret',
    'ChatGPT\'nin bilgi kesim tarihini göz önünde bulundur',
  ],
  research: [
    'Elicit ve Consensus\'u sistematik derleme için birlikte kullan',
    'AI\'ın bulamadığı kaynakları Google Scholar ile tamamla',
    'Her makalenin tam metnine erişimi doğrula',
  ],
  image: [
    'Telif hakkı politikasını yayın öncesi kontrol et',
    'Eğitim amaçlı görseller için "educational use" parametresini kullan',
    'Öğrencilere görsel üretimde prompt yazma becerisini öğret',
  ],
  data: [
    'Julius AI çıktısını SPSS/R ile çapraz doğrula',
    'Veri gizliliği için FERPA/KVKK uyumluluğunu kontrol et',
    'İstatistiksel yorumlama için uzman danışmanlığı al',
  ],
  audio: [
    'Ses klonlama kullanmadan önce etik onay al',
    'Erişilebilirlik için her sesli içeriğin transkriptini de sun',
    'Öğrencilere farklı dinleme hızı seçeneği sun',
  ],
  video: [
    'Synthesia avatarlarının otantiklik sorununu öğrencilerle tartış',
    'Video içeriğini altyazıyla destekle',
    'AI video üretimini öğrencilerin eleştirel değerlendirmesi için materyal olarak kullan',
  ],
}

import type { Locale } from "@/i18n/dictionaries";
import type { SeoLocaleSlug } from "@/lib/seo-locales";

export type ResponsibleGamblingCopy = {
  title: string;
  first: string;
  second: string;
  closing: string;
  link: string;
};

export const responsibleGamblingCopy: Record<Locale, ResponsibleGamblingCopy> = {
  en: {
    title: "18+ Responsible Gambling",
    first: "Predictions Sports Prime promotes responsible gambling and encourages users to make informed decisions. Betting should be treated as entertainment, never as a guaranteed way to make money.",
    second: "You must be 18 years old or over to use betting services. Never bet more than you can afford to lose, and seek professional support if gambling stops being enjoyable or becomes difficult to control.",
    closing: "Please gamble responsibly.",
    link: "Learn more about responsible gambling",
  },
  "pt-BR": {
    title: "18+ Jogo responsável",
    first: "O Predictions Sports Prime promove o jogo responsável e incentiva decisões conscientes. As apostas devem ser tratadas como entretenimento, nunca como uma forma garantida de ganhar dinheiro.",
    second: "Você deve ter 18 anos ou mais para usar serviços de apostas. Nunca aposte mais do que pode perder e procure apoio profissional se apostar deixar de ser algo agradável ou se tornar difícil de controlar.",
    closing: "Aposte com responsabilidade.",
    link: "Saiba mais sobre jogo responsável",
  },
  es: {
    title: "18+ Juego responsable",
    first: "Predictions Sports Prime promueve el juego responsable y anima a tomar decisiones informadas. Las apuestas deben considerarse entretenimiento, nunca una forma garantizada de ganar dinero.",
    second: "Debes tener 18 años o más para utilizar servicios de apuestas. Nunca apuestes más de lo que puedas permitirte perder y busca apoyo profesional si apostar deja de ser agradable o resulta difícil de controlar.",
    closing: "Apuesta con responsabilidad.",
    link: "Más información sobre juego responsable",
  },
  fr: {
    title: "18+ Jeu responsable",
    first: "Predictions Sports Prime encourage le jeu responsable et les décisions éclairées. Les paris doivent rester un divertissement et ne constituent jamais un moyen garanti de gagner de l’argent.",
    second: "Vous devez avoir au moins 18 ans pour utiliser des services de paris. Ne misez jamais plus que ce que vous pouvez vous permettre de perdre et demandez une aide professionnelle si le jeu cesse d’être agréable ou devient difficile à contrôler.",
    closing: "Jouez de manière responsable.",
    link: "En savoir plus sur le jeu responsable",
  },
  de: {
    title: "18+ Verantwortungsvolles Spielen",
    first: "Predictions Sports Prime fördert verantwortungsvolles Spielen und bewusste Entscheidungen. Wetten sollten als Unterhaltung betrachtet werden, niemals als garantierte Möglichkeit, Geld zu verdienen.",
    second: "Sie müssen mindestens 18 Jahre alt sein, um Wettangebote zu nutzen. Setzen Sie nie mehr, als Sie verlieren können, und suchen Sie professionelle Hilfe, wenn das Spielen keine Freude mehr macht oder schwer zu kontrollieren ist.",
    closing: "Bitte spielen Sie verantwortungsvoll.",
    link: "Mehr über verantwortungsvolles Spielen erfahren",
  },
  it: {
    title: "18+ Gioco responsabile",
    first: "Predictions Sports Prime promuove il gioco responsabile e invita a prendere decisioni consapevoli. Le scommesse devono essere considerate intrattenimento, mai un modo garantito per guadagnare denaro.",
    second: "Devi avere almeno 18 anni per utilizzare servizi di scommesse. Non scommettere mai più di quanto puoi permetterti di perdere e cerca supporto professionale se il gioco non è più piacevole o diventa difficile da controllare.",
    closing: "Gioca responsabilmente.",
    link: "Scopri di più sul gioco responsabile",
  },
  nl: {
    title: "18+ Verantwoord gokken",
    first: "Predictions Sports Prime bevordert verantwoord gokken en moedigt weloverwogen beslissingen aan. Wedden moet als entertainment worden gezien, nooit als een gegarandeerde manier om geld te verdienen.",
    second: "Je moet 18 jaar of ouder zijn om gokdiensten te gebruiken. Zet nooit meer in dan je kunt missen en zoek professionele hulp als gokken niet meer plezierig is of moeilijk te beheersen wordt.",
    closing: "Gok verantwoord.",
    link: "Lees meer over verantwoord gokken",
  },
  tr: {
    title: "18+ Sorumlu bahis",
    first: "Predictions Sports Prime sorumlu bahsi destekler ve kullanıcıları bilinçli kararlar almaya teşvik eder. Bahis, para kazanmanın garantili bir yolu değil, yalnızca eğlence olarak görülmelidir.",
    second: "Bahis hizmetlerini kullanmak için en az 18 yaşında olmalısınız. Kaybetmeyi göze alabileceğinizden fazlasını yatırmayın; bahis keyif vermemeye veya kontrol edilmesi zorlaşmaya başlarsa profesyonel destek alın.",
    closing: "Lütfen sorumlu bahis oynayın.",
    link: "Sorumlu bahis hakkında daha fazla bilgi",
  },
  ar: { title: "18+ المقامرة المسؤولة", first: "يشجع Predictions Sports Prime المقامرة المسؤولة واتخاذ قرارات واعية. يجب التعامل مع الرهان كوسيلة ترفيه، وليس كطريقة مضمونة لكسب المال.", second: "يجب أن يكون عمرك 18 عامًا أو أكثر لاستخدام خدمات الرهان. لا تراهن بأكثر مما يمكنك تحمل خسارته، واطلب دعمًا مهنيًا إذا لم تعد المقامرة ممتعة أو أصبح التحكم فيها صعبًا.", closing: "يرجى المقامرة بمسؤولية.", link: "اعرف المزيد عن المقامرة المسؤولة" },
  hi: { title: "18+ जिम्मेदार सट्टेबाजी", first: "Predictions Sports Prime जिम्मेदार सट्टेबाजी और सोच-समझकर निर्णय लेने को बढ़ावा देता है। सट्टेबाजी को मनोरंजन की तरह लें, पैसे कमाने के गारंटीकृत तरीके की तरह नहीं।", second: "सट्टेबाजी सेवाओं के उपयोग के लिए आपकी आयु कम से कम 18 वर्ष होनी चाहिए। जितना खो सकते हैं उससे अधिक दांव न लगाएँ और यदि इसे नियंत्रित करना कठिन हो जाए तो पेशेवर सहायता लें।", closing: "कृपया जिम्मेदारी से खेलें।", link: "जिम्मेदार सट्टेबाजी के बारे में और जानें" },
  bn: { title: "18+ দায়িত্বশীল বাজি", first: "Predictions Sports Prime দায়িত্বশীল বাজি ও সচেতন সিদ্ধান্তকে উৎসাহিত করে। বাজিকে বিনোদন হিসেবে দেখুন, অর্থ উপার্জনের নিশ্চিত উপায় হিসেবে নয়।", second: "বেটিং সেবা ব্যবহারের জন্য আপনার বয়স কমপক্ষে ১৮ বছর হতে হবে। হারানোর সামর্থ্যের বেশি বাজি ধরবেন না এবং নিয়ন্ত্রণ কঠিন হলে পেশাদার সহায়তা নিন।", closing: "দায়িত্বশীলভাবে বাজি ধরুন।", link: "দায়িত্বশীল বাজি সম্পর্কে আরও জানুন" },
  ur: { title: "18+ ذمہ دارانہ بیٹنگ", first: "Predictions Sports Prime ذمہ دارانہ بیٹنگ اور باخبر فیصلوں کی حوصلہ افزائی کرتا ہے۔ بیٹنگ کو تفریح سمجھیں، پیسہ کمانے کا یقینی طریقہ نہیں۔", second: "بیٹنگ خدمات استعمال کرنے کے لیے آپ کی عمر کم از کم 18 سال ہونی چاہیے۔ اپنی برداشت سے زیادہ رقم نہ لگائیں اور اگر قابو رکھنا مشکل ہو جائے تو پیشہ ورانہ مدد حاصل کریں۔", closing: "براہ کرم ذمہ داری سے کھیلیں۔", link: "ذمہ دارانہ بیٹنگ کے بارے میں مزید جانیں" },
  ru: { title: "18+ Ответственная игра", first: "Predictions Sports Prime поддерживает ответственную игру и осознанные решения. Ставки следует воспринимать как развлечение, а не как гарантированный способ заработка.", second: "Для использования букмекерских услуг вам должно быть не менее 18 лет. Не ставьте больше, чем можете позволить себе потерять, и обратитесь за профессиональной помощью, если игру становится трудно контролировать.", closing: "Играйте ответственно.", link: "Подробнее об ответственной игре" },
  zh: { title: "18+ 负责任博彩", first: "Predictions Sports Prime 倡导负责任博彩和理性决策。投注应被视为娱乐，而不是保证赚钱的方式。", second: "您必须年满18岁才能使用投注服务。切勿投注超过自己能够承受损失的金额；如果投注不再令人愉快或难以控制，请寻求专业帮助。", closing: "请负责任地参与博彩。", link: "了解更多负责任博彩信息" },
  ja: { title: "18+ 責任あるギャンブル", first: "Predictions Sports Prime は責任あるギャンブルと十分な情報に基づく判断を推奨します。賭けは娯楽として扱い、確実にお金を稼ぐ方法とは考えないでください。", second: "賭けサービスの利用には18歳以上である必要があります。失っても困らない額を超えて賭けず、楽しめなくなったり制御が難しくなった場合は専門家の支援を求めてください。", closing: "責任を持って楽しんでください。", link: "責任あるギャンブルについて詳しく見る" },
  ko: { title: "18+ 책임 있는 도박", first: "Predictions Sports Prime은 책임 있는 도박과 신중한 결정을 권장합니다. 베팅은 오락으로만 여기고 돈을 벌 수 있는 확실한 방법으로 생각해서는 안 됩니다.", second: "베팅 서비스를 이용하려면 만 18세 이상이어야 합니다. 감당할 수 있는 손실보다 많이 베팅하지 말고 통제가 어려워지면 전문가의 도움을 받으세요.", closing: "책임감 있게 이용하세요.", link: "책임 있는 도박에 대해 자세히 알아보기" },
  id: { title: "18+ Perjudian bertanggung jawab", first: "Predictions Sports Prime mendukung perjudian yang bertanggung jawab dan keputusan yang matang. Taruhan harus dipandang sebagai hiburan, bukan cara pasti untuk menghasilkan uang.", second: "Anda harus berusia 18 tahun atau lebih untuk menggunakan layanan taruhan. Jangan pernah bertaruh melebihi kemampuan Anda untuk menanggung kerugian dan cari bantuan profesional jika sulit dikendalikan.", closing: "Berjudilah secara bertanggung jawab.", link: "Pelajari perjudian bertanggung jawab" },
  ms: { title: "18+ Perjudian bertanggungjawab", first: "Predictions Sports Prime menggalakkan perjudian bertanggungjawab dan keputusan yang teliti. Pertaruhan harus dianggap sebagai hiburan, bukan cara terjamin untuk mendapatkan wang.", second: "Anda mestilah berumur 18 tahun ke atas untuk menggunakan perkhidmatan pertaruhan. Jangan bertaruh melebihi kemampuan menanggung kerugian dan dapatkan bantuan profesional jika sukar dikawal.", closing: "Berjudilah secara bertanggungjawab.", link: "Ketahui lebih lanjut tentang perjudian bertanggungjawab" },
  th: { title: "18+ การพนันอย่างรับผิดชอบ", first: "Predictions Sports Prime สนับสนุนการพนันอย่างรับผิดชอบและการตัดสินใจโดยมีข้อมูล ควรมองการเดิมพันเป็นความบันเทิง ไม่ใช่วิธีหาเงินที่รับประกันผล", second: "คุณต้องมีอายุ 18 ปีขึ้นไปจึงจะใช้บริการเดิมพันได้ อย่าเดิมพันเกินกว่าที่คุณสามารถเสียได้ และขอความช่วยเหลือจากผู้เชี่ยวชาญหากควบคุมได้ยาก", closing: "โปรดเล่นพนันอย่างรับผิดชอบ", link: "เรียนรู้เพิ่มเติมเกี่ยวกับการพนันอย่างรับผิดชอบ" },
  vi: { title: "18+ Cá cược có trách nhiệm", first: "Predictions Sports Prime khuyến khích cá cược có trách nhiệm và đưa ra quyết định có cân nhắc. Cá cược nên được xem là giải trí, không phải cách kiếm tiền được bảo đảm.", second: "Bạn phải từ 18 tuổi trở lên để sử dụng dịch vụ cá cược. Không bao giờ cược quá số tiền bạn có thể chấp nhận mất và hãy tìm hỗ trợ chuyên môn nếu trở nên khó kiểm soát.", closing: "Hãy cá cược có trách nhiệm.", link: "Tìm hiểu thêm về cá cược có trách nhiệm" },
  pl: { title: "18+ Odpowiedzialna gra", first: "Predictions Sports Prime promuje odpowiedzialną grę i świadome decyzje. Zakłady powinny być traktowane jako rozrywka, nigdy jako gwarantowany sposób zarabiania pieniędzy.", second: "Aby korzystać z usług bukmacherskich, musisz mieć co najmniej 18 lat. Nie stawiaj więcej, niż możesz stracić, i poszukaj profesjonalnego wsparcia, jeśli gra staje się trudna do kontrolowania.", closing: "Graj odpowiedzialnie.", link: "Dowiedz się więcej o odpowiedzialnej grze" },
  fa: { title: "۱۸+ شرط‌بندی مسئولانه", first: "Predictions Sports Prime شرط‌بندی مسئولانه و تصمیم‌گیری آگاهانه را تشویق می‌کند. شرط‌بندی باید سرگرمی باشد، نه راهی تضمینی برای کسب درآمد.", second: "برای استفاده از خدمات شرط‌بندی باید حداقل ۱۸ سال داشته باشید. بیش از توان مالی خود شرط نبندید و اگر کنترل آن دشوار شد از متخصص کمک بگیرید.", closing: "لطفاً مسئولانه شرط‌بندی کنید.", link: "اطلاعات بیشتر درباره شرط‌بندی مسئولانه" },
  he: { title: "18+ הימורים באחריות", first: "Predictions Sports Prime מעודד הימורים באחריות וקבלת החלטות מושכלת. יש להתייחס להימורים כבידור, ולעולם לא כדרך מובטחת להרוויח כסף.", second: "יש להיות בני 18 ומעלה כדי להשתמש בשירותי הימורים. אל תהמרו מעבר לסכום שאתם יכולים להרשות לעצמכם להפסיד ופנו לעזרה מקצועית אם קשה לשלוט בכך.", closing: "אנא הימרו באחריות.", link: "מידע נוסף על הימורים באחריות" },
};

const seoLocaleToLocale: Record<SeoLocaleSlug, Locale> = {
  "pt-br": "pt-BR", es: "es", fr: "fr", de: "de", it: "it", nl: "nl", tr: "tr",
};

export function responsibleCopyForSeoLocale(locale: SeoLocaleSlug) {
  return responsibleGamblingCopy[seoLocaleToLocale[locale]];
}

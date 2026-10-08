/**
 * Kruti Dev 010 <-> Unicode Devanagari Bidirectional Converter
 * 
 * Used widely across Indian District Courts, High Courts, Notary Offices,
 * and Deed Typist Booths for Hindi and Marathi legal documents.
 */

// KrutiDev 010 to Unicode Devanagari mappings
const KRUTI_TO_UNICODE_MAP: [string, string][] = [
  ['ñ', 'Z'],
  ['Q+Z', 'र्फ़'],
  ['sas', 'सैल'],
  ['aa', 'आ'],
  [')Z', 'र्द्ध'],
  ['ZZ', '्र'],
  ['å', '०'],
  ['ƒ', '१'],
  ['„', '२'],
  ['…', '३'],
  ['†', '४'],
  ['‡', '५'],
  ['ˆ', '६'],
  ['‰', '७'],
  ['Š', '८'],
  ['‹', '९'],
  ['¶+', 'फ़्'],
  ['d+', 'क़'],
  ['[+k', 'ख़'],
  ['[+', 'ख़्'],
  ['x+', 'ग़'],
  ['T+', 'ज़्'],
  ['t+', 'ज़'],
  ['M+', 'ड़'],
  ['<+', 'ढ़'],
  ['Q+', 'फ़'],
  [';+', 'य़'],
  ['j+', 'ऱ'],
  ['u+', 'ऩ'],
  ['Ùk', 'त्त'],
  ['Ù', 'त्त्'],
  ['ä', 'क्त'],
  ['–', 'दृ'],
  ['—', 'कृ'],
  ['é', 'श्व'],
  ['™', 'ह्न'],
  ['=kk', 'ह्य'],
  ['f=k', 'हृ'],
  ['à', 'ह्म'],
  ['á', 'ह्र'],
  ['â', 'ह्'],
  ['ã', 'द्द'],
  ['ºz', 'क्ष्'],
  ['º', 'क्ष'],
  ['í', 'त्र्'],
  ['{k', 'त्र'],
  ['{', 'ज्ञ'],
  ['=', 'छ्य'],
  ['«', 'ट्य'],
  ['Nî', 'ठ्य'],
  ['Vî', 'ड्य'],
  ['Bî', 'ढ्य'],
  ['Mî', 'द्य'],
  ['<î', 'द्व'],
  ['|', 'श्र'],
  ['K', 'ट्र'],
  ['}', 'ड्र'],
  ['J', 'ढ्र'],
  ['Vª', 'छ्र'],
  ['Mª', 'क्र'],
  ['<ªª', 'फ्र'],
  ['Nª', 'द्र'],
  ['Ø', 'प्र'],
  ['Ý', 'ग्र'],
  ['nzZ', 'रु'],
  ['æ', 'रू'],
  ['ç', '्र'],
  ['Á', 'ओ'],
  ['xz', 'औ'],
  ['#', 'आ'],
  [':', 'अ'],
  ['v‚', 'ई'],
  ['vks', 'ओ'],
  ['vkS', 'औ'],
  ['vk', 'आ'],
  ['v', 'अ'],
  ['b±', 'ई'],
  ['Ã', 'ई'],
  ['bZ', 'ई'],
  ['b', 'इ'],
  ['m', 'उ'],
  ['Å', 'ऊ'],
  [',s', 'ऐ'],
  [',', 'ए'],
  ['_', 'ऋ'],
  ['ô', 'क्'],
  ['d', 'क'],
  ['Dk', 'क्क'],
  ['D', 'क्'],
  ['£', 'ख्'],
  ['[k', 'ख'],
  ['[', 'ख्'],
  ['x', 'ग'],
  ['Xk', 'ग्ग'],
  ['X', 'ग्'],
  ['Ä', 'घ'],
  ['?k', 'घ'],
  ['?', 'घ्'],
  ['³', 'ङ'],
  ['p', 'च'],
  ['Pk', 'च्च'],
  ['P', 'च्'],
  ['N', 'छ'],
  ['t', 'ज'],
  ['Tk', 'ज्ज'],
  ['T', 'ज्'],
  ['>', 'झ'],
  ['÷', 'झ्'],
  ['¥', 'ञ'],
  ['ê', 'ट्ट'],
  ['ë', 'ट्ठ'],
  ['V', 'ट'],
  ['B', 'ठ'],
  ['ì', 'ड्ड'],
  ['ï', 'ड्ढ'],
  ['M', 'ड'],
  ['<', 'ढ'],
  ['.k', 'ण'],
  ['.', 'ण्'],
  ['r', 'त'],
  ['Rk', 'त्त'],
  ['R', 'त्'],
  ['Fk', 'थ'],
  ['F', 'थ्'],
  [')', 'द्ध'],
  ['n', 'द'],
  ['/k', 'ध'],
  ['èk', 'ध'],
  ['/', 'ध्'],
  ['Ë', 'ध्'],
  ['è', 'ध्'],
  ['u', 'न'],
  ['Uk', 'न्न'],
  ['U', 'न्'],
  ['i', 'प'],
  ['Ik', 'प्प'],
  ['I', 'प्'],
  ['Q', 'फ'],
  ['¶', 'फ्'],
  ['c', 'ब'],
  ['Ck', 'ब्ब'],
  ['C', 'ब्'],
  ['Hk', 'भ'],
  ['H', 'भ्'],
  ['e', 'म'],
  ['Ek', 'म्म'],
  ['E', 'म्'],
  [';', 'य'],
  ['¸', 'य्'],
  ['j', 'र'],
  ['y', 'ल'],
  ['Yk', 'ल्ल'],
  ['Y', 'ल्'],
  ['G', 'ळ'],
  ['o', 'व'],
  ['Ok', 'व्व'],
  ['O', 'व्'],
  ["'k", 'श'],
  ["'", 'श्'],
  ['"k', 'ष'],
  ['"', 'ष्'],
  ['l', 'स'],
  ['Lk', 'स्स'],
  ['L', 'स्'],
  ['g', 'ह'],
  ['È', 'ऑ'],
  ['z', '्र'],
  ['Ì', 'ॄ'],
  ['Í', 'ॅ'],
  ['Î', 'ऽ'],
  ['Ï', '्'],
  ['Ñ', '्'],
  ['k', 'ा'],
  ['h', 'ी'],
  ['q', 'ु'],
  ['w', 'ू'],
  ['`', 'ृ'],
  ['s', 'े'],
  ['S', 'ै'],
  ['a', 'ं'],
  ['¡', 'ँ'],
  ['%', 'ः'],
  ['W', 'ॉ'],
  ['•', '॰'],
  ['·', '।'],
  ['~', '्'],
];

// Unicode Devanagari to KrutiDev 010 mappings
const UNICODE_TO_KRUTI_MAP: [string, string][] = [
  ['०', 'å'],
  ['१', 'ƒ'],
  ['२', '„'],
  ['३', '…'],
  ['४', '†'],
  ['५', '‡'],
  ['६', 'ˆ'],
  ['७', '‰'],
  ['८', 'Š'],
  ['९', '‹'],
  ['फ़्', '¶+'],
  ['क़', 'd+'],
  ['ख़्', '[+'],
  ['ख़', '[+k'],
  ['ग़', 'x+'],
  ['ज़्', 'T+'],
  ['ज़', 't+'],
  ['ड़', 'M+'],
  ['ढ़', '<+'],
  ['फ़', 'Q+'],
  ['य़', ';+'],
  ['ऱ', 'j+'],
  ['ऩ', 'u+'],
  ['त्त', 'Ùk'],
  ['त्त्', 'Ù'],
  ['क्त', 'ä'],
  ['दृ', '–'],
  ['कृ', '—'],
  ['श्व', 'é'],
  ['ह्न', '™'],
  ['ह्य', '=kk'],
  ['हृ', 'f=k'],
  ['ह्म', 'à'],
  ['ह्र', 'á'],
  ['ह्', 'â'],
  ['द्द', 'ã'],
  ['क्ष्', 'ºz'],
  ['क्ष', 'º'],
  ['त्र्', 'í'],
  ['त्र', '{k'],
  ['ज्ञ', '{'],
  ['छ्य', '='],
  ['ट्य', '«'],
  ['ठ्य', 'Nî'],
  ['ड्य', 'Vî'],
  ['ढ्य', 'Bî'],
  ['द्य', 'Mî'],
  ['द्व', '<î'],
  ['श्र', '|'],
  ['ट्र', 'K'],
  ['ड्र', '}'],
  ['ढ्र', 'J'],
  ['छ्र', 'Vª'],
  ['क्र', 'Mª'],
  ['फ्र', '<ªª'],
  ['द्र', 'Nª'],
  ['प्र', 'Ø'],
  ['ग्र', 'Ý'],
  ['रु', 'nzZ'],
  ['रू', 'æ'],
  ['ओ', 'vks'],
  ['औ', 'vkS'],
  ['आ', 'vk'],
  ['अ', 'v'],
  ['ई', 'bZ'],
  ['इ', 'b'],
  ['उ', 'm'],
  ['ऊ', 'Å'],
  ['ऐ', ',s'],
  ['ए', ','],
  ['ऋ', '_'],
  ['क्क', 'Dk'],
  ['क्', 'D'],
  ['क', 'd'],
  ['ख्', '['],
  ['ख', '[k'],
  ['ग्ग', 'Xk'],
  ['ग्', 'X'],
  ['ग', 'x'],
  ['घ्', '?'],
  ['घ', '?k'],
  ['ङ', '³'],
  ['च्च', 'Pk'],
  ['च्', 'P'],
  ['च', 'p'],
  ['छ', 'N'],
  ['ज्ज', 'Tk'],
  ['ज्', 'T'],
  ['ज', 't'],
  ['झ्', '÷'],
  ['झ', '>'],
  ['ञ', '¥'],
  ['ट्ट', 'ê'],
  ['ट्ठ', 'ë'],
  ['ट', 'V'],
  ['ठ', 'B'],
  ['ड्ड', 'ì'],
  ['ड्ढ', 'ï'],
  ['ड', 'M'],
  ['ढ', '<'],
  ['ण्', '.'],
  ['ण', '.k'],
  ['त्त', 'Rk'],
  ['त्', 'R'],
  ['त', 'r'],
  ['थ्', 'F'],
  ['थ', 'Fk'],
  ['द्ध', ')'],
  ['द', 'n'],
  ['ध्', '/'],
  ['ध', '/k'],
  ['न्न', 'Uk'],
  ['न्', 'U'],
  ['न', 'u'],
  ['प्प', 'Ik'],
  ['प्', 'I'],
  ['प', 'i'],
  ['फ्', '¶'],
  ['फ', 'Q'],
  ['ब्ब', 'Ck'],
  ['ब्', 'C'],
  ['ब', 'c'],
  ['भ्', 'H'],
  ['भ', 'Hk'],
  ['म्म', 'Ek'],
  ['म्', 'E'],
  ['म', 'e'],
  ['य्', '¸'],
  ['य', ';'],
  ['र', 'j'],
  ['ल्ल', 'Yk'],
  ['ल्', 'Y'],
  ['ल', 'y'],
  ['ळ', 'G'],
  ['व्व', 'Ok'],
  ['व्', 'O'],
  ['व', 'o'],
  ['श्', "'"],
  ['श', "'k"],
  ['ष्', '"'],
  ['ष', '"k'],
  ['स्स', 'Lk'],
  ['स्', 'L'],
  ['स', 'l'],
  ['ह', 'g'],
  ['ॉ', 'W'],
  ['ो', 'ks'],
  ['ौ', 'kS'],
  ['ा', 'k'],
  ['ी', 'h'],
  ['ु', 'q'],
  ['ू', 'w'],
  ['ृ', '`'],
  ['े', 's'],
  ['ै', 'S'],
  ['ं', 'a'],
  ['ँ', '¡'],
  ['ः', '%'],
  ['्', '~'],
  ['।', '·'],
  ['॰', '•'],
];

export class KrutiDevService {
  /**
   * Convert Kruti Dev 010 encoded text into Unicode Devanagari (Hindi/Marathi)
   */
  public static krutiDevToUnicode(krutiText: string): string {
    if (!krutiText) return '';

    let text = krutiText;

    // Normalise apostrophes
    text = text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

    // Handle composite and special positional glyphs first
    // In KrutiDev, 'f' represents 'ि' (choti ee ki matra) which precedes the consonant in typing
    // e.g. "fd" in KrutiDev is "कि" in Devanagari
    
    // Reposition choti-ee matra 'f'
    // Pattern: f + [consonant cluster] -> consonant cluster + ि
    text = text.replace(/f([a-zA-Z\~_\[\]\|\>\{\}\<\?\.\/\,\;\'\"`\!@\#\$\%\^\&\*\(\)\=\+\-\_\:]+)/g, (_match, p1) => {
      return p1 + 'f_matra';
    });

    // 1-to-1 Table substitutions
    for (const [kruti, unicode] of KRUTI_TO_UNICODE_MAP) {
      if (kruti && text.includes(kruti)) {
        text = text.split(kruti).join(unicode);
      }
    }

    // Replace the preserved choti ee matra placeholder
    text = text.replace(/f_matra/g, 'ि');

    // Handle reph 'Z' (र half consonant on top, e.g. धर्म)
    // In Kruti Dev, 'Z' comes after the consonant, but in Unicode it goes before with halant 'र्'
    text = text.replace(/([क-ह]़?्?[क-ह]?़?[ा-ौ]?ं?)Z/g, 'र्$1');

    return text;
  }

  /**
   * Convert standard Unicode Devanagari text into Kruti Dev 010
   */
  public static unicodeToKrutiDev(unicodeText: string): string {
    if (!unicodeText) return '';

    let text = unicodeText;

    // Pre-processing: Move choti ee matra 'ि' before its consonant/conjunct
    // In Unicode: [क] + [ि] -> in Kruti: f + [d]
    // Regex matches consonant + optional halant + consonant + 'ि'
    text = text.replace(/([क-ह]़?्?[क-ह]?़?)ि/g, 'f$1');

    // Handle reph 'र्' (half ra before consonant) -> moved after the consonant with 'Z'
    text = text.replace(/र्([क-ह]़?[ा-ौ]?ं?)/g, '$1Z');

    // 1-to-1 Table substitutions (longest matches first)
    for (const [unicode, kruti] of UNICODE_TO_KRUTI_MAP) {
      if (unicode && text.includes(unicode)) {
        text = text.split(unicode).join(kruti);
      }
    }

    return text;
  }

  /**
   * Sample Kruti Dev Affidavit Text for court testing
   */
  public static getSampleKrutiDevText(): string {
    return `'kiFki= 
¼/kkjk 139 flfoy izfdz;k lafgrk rFkk uksVjh vf/kfu;e 1952½

le{k % Jheku~ uksVjh ifCyd egksn;] Hkkjr ljdkj

eSa 'kiFkiwoZd c;ku djrk gw¡ fd %
1- ;g fd eSa Hkkjr dk ewy fuoklh gw¡ rFkk 'kiFki= esa of.kZr irs ij fuokl djrk gw¡A
2- ;g fd mDr nLrkost@'kiFki= esa fn, x, leLr rF; esjs futh Kku o fo'okl ds vuqlkj lR; o lgh gSaA
3- ;g fd blesa dksbZ Hkh rF; fNik;k ugha x;k gSA

'kiFkxzghrk ¼Deponent½`;
  }
}

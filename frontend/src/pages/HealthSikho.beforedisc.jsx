import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../App";

const UI = {
  en: {
    title: "Health Sikho", sub: "Simple, reliable information about women's health. Pick a topic to learn.",
    pick: "Choose a topic", back: "All topics", basics: "Key points", see: "See a doctor if",
    mf: "Myth or fact", myth: "Myth", fact: "Fact", quiz: "Quick quiz", check: "Check answers",
    again: "Try again", score: "Your score", of: "out of", right: "Correct", wrong: "Not quite",
    listen: "Listen", stop: "Stop",
    noVoice: "No voice found for this language on this device. Windows: Settings > Time & language > Speech > Add voices.",
    help: "Not sure about something? Ask your nearest ASHA, ANM or doctor. You are never alone.",
    note: "Information for awareness only, not a diagnosis. In an emergency go to the nearest hospital.",
  },
  hi: {
    title: "स्वास्थ्य सीखो", sub: "महिला स्वास्थ्य की आसान और भरोसेमंद जानकारी। एक विषय चुनें और सीखें।",
    pick: "विषय चुनें", back: "सभी विषय", basics: "ज़रूरी बातें", see: "डॉक्टर को दिखाएँ अगर",
    mf: "मिथक या सच", myth: "मिथक", fact: "सच", quiz: "छोटा क्विज़", check: "जवाब जाँचें",
    again: "फिर कोशिश करें", score: "आपका स्कोर", of: "में से", right: "सही", wrong: "ठीक नहीं",
    listen: "सुनें", stop: "रोकें",
    noVoice: "इस डिवाइस में इस भाषा की आवाज़ नहीं मिली। Windows: Settings > Time & language > Speech > Add voices।",
    help: "किसी बात पर शक है? अपनी नज़दीकी आशा, एएनएम या डॉक्टर से पूछें। आप अकेली नहीं हैं।",
    note: "सिर्फ़ जानकारी के लिए, निदान नहीं। आपात स्थिति में नज़दीकी अस्पताल जाएँ।",
  },
};

const META = [
  { id: "periods", icon: "🌸", bg: "#FCE4EE" },
  { id: "pcos", icon: "🌀", bg: "#EFE7F7" },
  { id: "breast", icon: "💗", bg: "#F7E8F0" },
  { id: "anemia", icon: "🩸", bg: "#FDE9E4" },
  { id: "thyroid", icon: "🦋", bg: "#E4EFF7" },
  { id: "contraception", icon: "🛡️", bg: "#E6F4ED" },
  { id: "condoms", icon: "✅", bg: "#FFF1D6" },
  { id: "hygiene", icon: "💧", bg: "#E2F3F2" },
];

const EN = {
  periods: {
    title: "Periods (Menstruation)",
    intro: "A period is monthly bleeding from the uterus. It is a normal sign that the body is working well.",
    points: ["A normal cycle is usually 21 to 35 days. Bleeding usually lasts 2 to 7 days.", "In the first 1 to 2 years after the first period, cycles can be irregular.", "Mild cramps are common. Pain that stops your daily work should not be ignored.", "Write down your period dates. This helps the doctor understand your pattern."],
    see: ["Periods stop for 3 months or more (and you are not pregnant)", "Very heavy bleeding, a pad soaked every hour or two", "Severe pain that stops daily work", "Bleeding between periods or after sex"],
    myths: [{ m: "Women are impure during periods.", f: "Periods are a natural body process. You can cook, pray and do normal work." }, { m: "Very bad pain is normal for every woman.", f: "Mild cramps are common, but severe pain needs a doctor." }],
    quiz: [{ q: "How long is a normal cycle usually?", o: ["7 to 10 days", "21 to 35 days", "50 to 60 days"], a: 1, e: "Most cycles are 21 to 35 days." }, { q: "A pad soaked every hour or two means:", o: ["It is normal", "Wait a week", "Get medical help soon"], a: 2, e: "Very heavy bleeding needs medical help quickly." }],
  },
  pcos: {
    title: "PCOS (Polycystic Ovary Syndrome)",
    intro: "PCOS is a hormone condition that is common in women of childbearing age. It can be managed with the right care.",
    points: ["Common signs: irregular or missed periods, acne, extra hair on face or body, hair thinning.", "Weight gain, especially around the belly, can happen.", "It can make pregnancy harder, but many women with PCOS become mothers with doctor's care.", "Only a doctor's tests can confirm PCOS. Symptoms alone cannot.", "Healthy food and daily activity help. Treatment should be guided by a doctor."],
    see: ["Periods are irregular for several months", "Trying for a baby for a year without success", "Sudden changes in hair, skin or weight"],
    myths: [{ m: "PCOS means you can never have a baby.", f: "Many women with PCOS conceive, often with medical guidance." }, { m: "Only overweight women get PCOS.", f: "Women of any weight can have PCOS." }],
    quiz: [{ q: "Can symptoms alone confirm PCOS?", o: ["Yes, always", "No, a doctor's tests are needed", "Yes, if there is acne"], a: 1, e: "Diagnosis needs a doctor's examination and tests." }, { q: "Only overweight women get PCOS. True or false?", o: ["True", "False"], a: 1, e: "Women of any body weight can have PCOS." }],
  },
  breast: {
    title: "Breast Health",
    intro: "Breast health means knowing how your breasts normally look and feel, so you notice a change early.",
    points: ["Look at and feel your breasts once a month, a few days after your period ends.", "Notice any lump, skin dimpling, change in shape, or a nipple that turns inward.", "Blood-stained nipple discharge or pain that does not go away needs a check.", "Most lumps are not cancer, but every new lump should be examined.", "Ask your doctor or health worker when to start screening for your age."],
    see: ["A new lump in the breast or armpit", "Bloody discharge from the nipple", "Skin redness, dimpling or swelling that does not go away"],
    myths: [{ m: "Breast cancer happens only to older women.", f: "It is more common with age, but can happen earlier. Notice changes at any age." }, { m: "Every lump means cancer.", f: "Most lumps are harmless, but they must be checked by a doctor." }],
    quiz: [{ q: "What should you do about a new breast lump?", o: ["Wait and watch for a year", "Get it examined by a doctor", "Ignore it if painless"], a: 1, e: "Every new lump should be examined, even if it does not hurt." }, { q: "How often can you check your own breasts?", o: ["Once a month", "Once in 5 years", "Never"], a: 0, e: "A monthly self-check helps you know what is normal for you." }],
  },
  anemia: {
    title: "Anemia (Low Blood)",
    intro: "Anemia means low hemoglobin (Hb) in the blood, so the body gets less oxygen. It is very common in women.",
    points: ["Signs: feeling tired, weak, dizzy, pale skin, breathless on light work.", "Heavy periods and pregnancy raise the risk.", "Iron-rich foods help: green leafy vegetables, dal, chana, jaggery. Lemon with meals helps the body use iron.", "A simple blood test (Hb) confirms anemia.", "Any iron or other treatment should be taken only as advised by a doctor or health worker."],
    see: ["Constant tiredness or weakness", "Breathless or dizzy on light work", "Very pale skin, nails or inside of eyelids", "You are pregnant and feel weak"],
    myths: [{ m: "Anemia is just weakness and goes by itself.", f: "It needs a blood test and proper care." }, { m: "Only pregnant women get anemia.", f: "Any woman or girl can have anemia." }],
    quiz: [{ q: "Which test confirms anemia?", o: ["Hb blood test", "X-ray", "Urine smell"], a: 0, e: "A hemoglobin (Hb) blood test confirms anemia." }, { q: "Which food can help?", o: ["Only sweets", "Green leafy vegetables and dal", "Cold drinks"], a: 1, e: "Leafy vegetables, dal and chana are good iron sources." }],
  },
  thyroid: {
    title: "Thyroid",
    intro: "The thyroid is a small gland in the neck that controls how your body uses energy. Problems are more common in women.",
    points: ["Too little thyroid hormone: tiredness, weight gain, feeling cold, dry skin, constipation, heavy or irregular periods.", "Too much: weight loss, fast heartbeat, sweating, feeling anxious, lighter periods.", "A swelling in the front of the neck should always be checked.", "A simple blood test (TSH) helps find thyroid problems.", "Thyroid problems can be managed with regular doctor follow-up."],
    see: ["Swelling in the front of the neck", "Unexplained weight change with tiredness", "Irregular periods with the above signs", "You are planning a pregnancy"],
    myths: [{ m: "Thyroid always causes weight gain.", f: "It can cause weight gain or weight loss, depending on the problem." }, { m: "Thyroid is only an old-age problem.", f: "It can happen at any age, including young women." }],
    quiz: [{ q: "Where is the thyroid gland?", o: ["In the neck", "In the knee", "In the foot"], a: 0, e: "The thyroid sits at the front of the neck." }, { q: "Which blood test is commonly used?", o: ["TSH", "ESR only", "None, it cannot be tested"], a: 0, e: "TSH is the common first blood test for thyroid." }],
  },
  contraception: {
    title: "Contraception (Family Planning)",
    intro: "Contraception means ways to prevent pregnancy. You have the right to choose if and when to have a child.",
    points: ["There are many methods: condoms, pills, injections, copper-T (IUD), and permanent methods.", "Only condoms protect against both pregnancy and many infections.", "The best method depends on your health and wishes. Ask a doctor, ASHA or ANM.", "Government health centres give family planning services, often free of cost.", "If sex happened without protection, ask a health worker or pharmacist about emergency contraception as soon as possible."],
    see: ["You want to choose a method and need advice", "Period is late after unprotected sex", "A method causes side effects that worry you"],
    myths: [{ m: "Contraception causes permanent infertility.", f: "Most methods are reversible. Fertility returns after stopping." }, { m: "You cannot get pregnant the first time.", f: "Pregnancy can happen the very first time." }],
    quiz: [{ q: "Which method also protects against infections?", o: ["Condom", "Injection", "Copper-T"], a: 0, e: "Condoms protect against pregnancy and many infections." }, { q: "Who can advise you on a method?", o: ["Only neighbours", "Doctor, ASHA or ANM", "Nobody"], a: 1, e: "A health worker can help you choose safely." }],
  },
  condoms: {
    title: "Condoms",
    intro: "A condom is a thin cover that prevents pregnancy and protects against many infections when used correctly.",
    points: ["Use a new condom every time, from start to finish.", "Check the expiry date and that the packet is not torn.", "Put it on before any contact. Hold the base while pulling out.", "Never use two condoms together and never reuse one.", "Oil, cream or petroleum jelly can damage condoms. Use only water-based lubricant.", "Throw it in a dustbin, not in the toilet."],
    see: ["The condom broke or slipped", "Worried about infection or pregnancy after sex", "Itching, sores or unusual discharge"],
    myths: [{ m: "Washing and reusing a condom is fine.", f: "Never reuse a condom. Use a new one every time." }, { m: "Using two condoms is safer.", f: "Two condoms rub and can tear. Use only one." }],
    quiz: [{ q: "How often should a condom be used?", o: ["A new one every time", "Wash and reuse", "Only sometimes"], a: 0, e: "Use a new condom every time." }, { q: "What can damage a condom?", o: ["Water-based gel", "Oil or petroleum jelly", "Nothing"], a: 1, e: "Oil-based products can weaken a condom." }],
  },
  hygiene: {
    title: "Reproductive Health and Hygiene",
    intro: "Reproductive health means a healthy body, safe relationships and the right information to take care of yourself.",
    points: ["Change a pad every 4 to 6 hours. If you use cloth, wash it well and dry it in the sun.", "Wash only the outside area with clean water. Do not wash inside the vagina.", "Clear or white mild discharge is normal. Bad smell, itching or colour change may mean infection.", "Wash hands before and after using the toilet or changing a pad.", "Ask your doctor about cervical screening and vaccines for girls."],
    see: ["Smelly or unusual discharge", "Burning while passing urine", "Pain in the lower belly", "Sores, itching or bleeding after sex"],
    myths: [{ m: "Washing inside the vagina keeps it clean.", f: "The vagina cleans itself. Washing inside can cause harm." }, { m: "Any discharge means disease.", f: "Mild clear or white discharge is normal and healthy." }],
    quiz: [{ q: "How often should a pad be changed?", o: ["Once a day", "Every 4 to 6 hours", "Once a week"], a: 1, e: "Change a pad every 4 to 6 hours to prevent infection." }, { q: "Should you wash inside the vagina?", o: ["Yes, with soap", "No, it cleans itself", "Yes, daily"], a: 1, e: "Washing inside can upset natural balance." }],
  },
};

const HG = {
  periods: {
    title: "Periods (Mahwari)",
    intro: "Period har mahine bachchedani se aane wala khoon hai. Ye body ke theek chalne ki normal nishani hai.",
    points: ["Aam taur par cycle 21 se 35 din ka hota hai. Khoon 2 se 7 din tak aa sakta hai.", "Pehle period ke shuru ke 1-2 saal me cycle upar-neeche ho sakta hai.", "Halka dard aam hai. Jo dard roz ka kaam rok de, use ignore mat karo.", "Apne period ki dates likh kar rakho. Isse doctor ko samajhne me madad milti hai."],
    see: ["3 mahine ya zyada period na aaye (aur pregnancy na ho)", "Bahut zyada khoon, har 1-2 ghante me pad bhig jaye", "Bahut tez dard jo roz ka kaam rok de", "Do periods ke beech ya relation ke baad khoon aaye"],
    myths: [{ m: "Period me aurat ashuddh hoti hai.", f: "Period body ki natural process hai. Aap khana bana sakti ho, pooja aur roz ke kaam kar sakti ho." }, { m: "Bahut tez dard har aurat ke liye normal hai.", f: "Halka dard aam hai, par bahut tez dard me doctor ko dikhao." }],
    quiz: [{ q: "Normal period cycle aam taur par kitne din ka hota hai?", o: ["7 se 10 din", "21 se 35 din", "50 se 60 din"], a: 1, e: "Zyadatar cycle 21 se 35 din ke hote hain." }, { q: "Har 1-2 ghante me pad bhig jaye to iska matlab hai:", o: ["Ye normal hai", "Ek hafta ruko", "Jaldi doctor se madad lo"], a: 2, e: "Bahut zyada khoon me jaldi medical madad lo." }],
  },
  pcos: {
    title: "PCOS",
    intro: "PCOS hormone se juda masla hai jo bachche paida karne ki umar ki auraton me aam hai. Sahi dekhbhal se ise sambhala ja sakta hai.",
    points: ["Aam lakshan: period late ya band, pimples, chehre ya body par zyada baal, baal patle hona.", "Wajan badh sakta hai, khaaskar pet ke aas-paas.", "Pregnancy me dikkat ho sakti hai, par bahut si auratein doctor ki dekhrekh me maa banti hain.", "PCOS ki pakki jaanch sirf doctor ke tests se hoti hai, sirf lakshanon se nahi.", "Healthy khana aur roz chalna-phirna madad karta hai. Ilaaj doctor ki salah se ho."],
    see: ["Kai mahino se period irregular hain", "Ek saal se baby ki koshish me kaamyabi nahi mili", "Baal, skin ya wajan me achanak badlav"],
    myths: [{ m: "PCOS me kabhi baby nahi ho sakta.", f: "Bahut si auraton ko PCOS ke saath bhi baby hota hai, aksar doctor ki salah se." }, { m: "PCOS sirf mote logon ko hota hai.", f: "Kisi bhi wajan ki aurat ko PCOS ho sakta hai." }],
    quiz: [{ q: "Kya sirf lakshanon se PCOS pakka ho jata hai?", o: ["Haan, hamesha", "Nahi, doctor ki jaanch zaroori hai", "Haan, agar pimples ho"], a: 1, e: "Pakka karne ke liye doctor ki jaanch zaroori hai." }, { q: "PCOS sirf mote logon ko hota hai. Sahi ya galat?", o: ["Sahi", "Galat"], a: 1, e: "Kisi bhi wajan ki aurat ko PCOS ho sakta hai." }],
  },
  breast: {
    title: "Breast Health",
    intro: "Breast health ka matlab hai ye jaanna ki aapke breast aam taur par kaise dikhte aur mehsoos hote hain, taaki badlav jaldi pakad me aaye.",
    points: ["Mahine me ek baar, period khatam hone ke kuch din baad, apne breast ko dekho aur haath se check karo.", "Gaanth, skin me gaddha, shape me badlav ya nipple ka andar dhasna dhyan se dekho.", "Nipple se khoon jaisa paani nikalna ya jo dard theek na ho, uski jaanch karao.", "Zyadatar gaanth cancer nahi hoti, par har nayi gaanth ki jaanch honi chahiye.", "Apni umar me screening kab shuru karni hai, ye doctor ya health worker se poochho."],
    see: ["Breast ya bagal me nayi gaanth", "Nipple se khoon jaisa discharge", "Skin me laali, gaddha ya sujan jo theek na ho"],
    myths: [{ m: "Breast cancer sirf badi umar ki auraton ko hota hai.", f: "Umar ke saath badhta hai, par pehle bhi ho sakta hai. Kisi bhi umar me badlav par dhyan do." }, { m: "Har gaanth ka matlab cancer hai.", f: "Zyadatar gaanth nuksaan nahi karti, par doctor se jaanch zaroori hai." }],
    quiz: [{ q: "Breast me nayi gaanth dikhe to kya karein?", o: ["Ek saal dekhte rahein", "Doctor se jaanch karayein", "Dard na ho to ignore karein"], a: 1, e: "Har nayi gaanth ki jaanch honi chahiye, chahe dard na ho." }, { q: "Apne breast ki khud jaanch kitni baar kar sakti ho?", o: ["Mahine me ek baar", "5 saal me ek baar", "Kabhi nahi"], a: 0, e: "Har mahine ki jaanch se aap apna normal jaan paati ho." }],
  },
  anemia: {
    title: "Anemia (Khoon ki kami)",
    intro: "Anemia me khoon me hemoglobin (Hb) kam hota hai, isliye body ko oxygen kam milti hai. Ye auraton me bahut aam hai.",
    points: ["Lakshan: thakan, kamzori, chakkar, skin peeli padna, halke kaam me saans phoolna.", "Zyada period aur pregnancy me risk badhta hai.", "Iron wala khana madad karta hai: hari patedar sabzi, dal, chana, gud. Khane ke saath nimbu lene se iron behtar kaam karta hai.", "Ek aasaan blood test (Hb) se anemia pata chalta hai.", "Iron ya koi bhi ilaaj sirf doctor ya health worker ki salah se lo."],
    see: ["Lagataar thakan ya kamzori", "Halke kaam me saans phoolna ya chakkar", "Skin, nakhoon ya palkon ke andar bahut peelapan", "Pregnant ho aur kamzori lag rahi hai"],
    myths: [{ m: "Anemia bas kamzori hai, apne aap theek ho jata hai.", f: "Iski jaanch aur sahi dekhbhal zaroori hai." }, { m: "Anemia sirf pregnant auraton ko hota hai.", f: "Kisi bhi aurat ya ladki ko ho sakta hai." }],
    quiz: [{ q: "Anemia kis jaanch se pata chalta hai?", o: ["Hemoglobin (Hb) blood test", "X-ray", "Peshab ki gandh"], a: 0, e: "Hemoglobin blood test se anemia pata chalta hai." }, { q: "Kaunsa khana madad kar sakta hai?", o: ["Sirf mithai", "Hari patedar sabzi aur dal", "Cold drink"], a: 1, e: "Patedar sabzi, dal aur chana iron ke achhe source hain." }],
  },
  thyroid: {
    title: "Thyroid",
    intro: "Thyroid gardan me ek chhoti gland hai jo tay karti hai ki body kitni energy use kare. Ye masla auraton me zyada aam hai.",
    points: ["Thyroid hormone kam ho to: thakan, wajan badhna, thand lagna, rukhi skin, kabz, zyada ya irregular period.", "Zyada ho to: wajan ghatna, dil tez dhadkna, pasina, ghabrahat, kam period.", "Gardan ke aage sujan ki hamesha jaanch karao.", "Ek aasaan blood test (TSH) se thyroid ki dikkat pata chalti hai.", "Doctor ki regular dekhrekh se thyroid ko sambhala ja sakta hai."],
    see: ["Gardan ke aage sujan", "Bina wajah wajan me badlav aur thakan", "Upar ke lakshanon ke saath irregular period", "Pregnancy plan kar rahi ho"],
    myths: [{ m: "Thyroid me hamesha wajan badhta hai.", f: "Problem ke hisaab se wajan badh ya ghat sakta hai." }, { m: "Thyroid sirf budhape ki bimari hai.", f: "Ye kisi bhi umar me ho sakta hai, jawan auraton me bhi." }],
    quiz: [{ q: "Thyroid gland kahan hoti hai?", o: ["Gardan me", "Ghutne me", "Pair me"], a: 0, e: "Thyroid gardan ke aage hota hai." }, { q: "Aam taur par kaunsa blood test hota hai?", o: ["TSH", "Sirf ESR", "Koi test nahi hota"], a: 0, e: "Thyroid ke liye TSH aam pehla test hai." }],
  },
  contraception: {
    title: "Contraception (Family Planning)",
    intro: "Contraception ka matlab hai pregnancy rokne ke tareeke. Baby kab ho, ya ho ya na ho, ye chunne ka aapko poora haq hai.",
    points: ["Kai tareeke hain: condom, goliyan, injection, copper-T (IUD) aur permanent tareeke.", "Sirf condom pregnancy aur kai infections, dono se bachata hai.", "Kaunsa tareeka theek hai, ye aapki health aur pasand par depend karta hai. Doctor, ASHA ya ANM se poochho.", "Sarkari health centre me family planning services aksar free milti hain.", "Bina protection ke relation hua ho to jaldi se jaldi health worker ya pharmacist se emergency contraception ke baare me poochho."],
    see: ["Koi tareeka chunna hai aur salah chahiye", "Bina protection relation ke baad period late aaye", "Kisi tareeke se aise asar ho jo chinta de"],
    myths: [{ m: "Contraception se hamesha ke liye baanjhpan ho jata hai.", f: "Zyadatar tareeke palte ja sakte hain. Rokne ke baad pregnancy ki kshamta wapas aa jati hai." }, { m: "Pehli baar me pregnancy nahi hoti.", f: "Pehli hi baar me pregnancy ho sakti hai." }],
    quiz: [{ q: "Kaunsa tareeka infection se bhi bachata hai?", o: ["Condom", "Injection", "Copper-T"], a: 0, e: "Condom pregnancy aur kai infections se bachata hai." }, { q: "Tareeka chunne me kaun salah de sakta hai?", o: ["Sirf padosi", "Doctor, ASHA ya ANM", "Koi nahi"], a: 1, e: "Health worker safe choice me madad karte hain." }],
  },
  condoms: {
    title: "Condom",
    intro: "Condom ek patla cover hai jo sahi use par pregnancy aur kai infections se bachata hai.",
    points: ["Har baar naya condom use karo, shuru se aakhir tak.", "Expiry date dekho aur packet fata na ho.", "Kisi bhi contact se pehle pehno. Nikalte waqt neeche se pakdo.", "Do condom ek saath kabhi mat pehno aur ek condom dobara use mat karo.", "Tel, cream ya vaseline condom ko kamzor kar sakte hain. Sirf paani wala gel use karo.", "Use ke baad dustbin me daalo, toilet me nahi."],
    see: ["Condom fat gaya ya khisak gaya", "Relation ke baad infection ya pregnancy ki chinta hai", "Khujli, ghaav ya alag tarah ka discharge"],
    myths: [{ m: "Condom dhokar dobara use kar sakte hain.", f: "Condom dobara use mat karo. Har baar naya lo." }, { m: "Do condom pehenna zyada safe hai.", f: "Do condom aapas me ghis kar fat sakte hain. Sirf ek pehno." }],
    quiz: [{ q: "Condom kitni baar use karna chahiye?", o: ["Har baar naya", "Dhokar dobara", "Kabhi-kabhi"], a: 0, e: "Har baar naya condom use karo." }, { q: "Condom ko kya nuksaan pahuncha sakta hai?", o: ["Paani wala gel", "Tel ya vaseline", "Kuch nahi"], a: 1, e: "Tel wali cheezein condom ko kamzor karti hain." }],
  },
  hygiene: {
    title: "Reproductive Health aur Safai",
    intro: "Reproductive health ka matlab hai healthy body, safe rishte aur apni dekhbhal ki sahi jaankari.",
    points: ["Har 4 se 6 ghante me pad badlo. Kapda use karo to achhe se dho kar dhoop me sukhao.", "Sirf bahar ki jagah saaf paani se dho. Andar mat dhoyo.", "Halka saaf ya safed discharge normal hai. Badbu, khujli ya rang badalna infection ka sanket ho sakta hai.", "Toilet ya pad badalne se pehle aur baad me haath dho.", "Cervical screening aur ladkiyon ke teekon ke baare me doctor se poochho."],
    see: ["Badbudar ya alag tarah ka discharge", "Peshab me jalan", "Pet ke neeche ke hisse me dard", "Ghaav, khujli ya relation ke baad khoon"],
    myths: [{ m: "Andar dhone se safai rehti hai.", f: "Body khud ko saaf rakhti hai. Andar dhone se nuksaan ho sakta hai." }, { m: "Koi bhi discharge bimari hai.", f: "Halka saaf ya safed discharge normal aur healthy hai." }],
    quiz: [{ q: "Pad kitni der me badalna chahiye?", o: ["Din me ek baar", "Har 4 se 6 ghante me", "Hafte me ek baar"], a: 1, e: "Infection se bachne ke liye har 4 se 6 ghante me pad badlo." }, { q: "Kya andar dhona chahiye?", o: ["Haan, sabun se", "Nahi, body khud saaf rakhti hai", "Haan, roz"], a: 1, e: "Andar dhone se natural balance bigad sakta hai." }],
  },
};

const D = { en: EN, hg: HG };

const EASY = {
  en: {
    periods: ["Every month, a woman's body gets ready for a baby.", "If no baby comes, the body lets out the extra blood. This is called a period.", "It is natural and healthy. It is not dirty and there is no shame in it.", "If the pain or bleeding is too much, tell a doctor."],
    pcos: ["Inside the body, some hormones go out of balance.", "Because of this, periods can come late, or not come at all.", "Some women also get pimples or extra hair on the face.", "It is common and it can be managed. Only a doctor can confirm it."],
    breast: ["Know how your breasts normally look and feel.", "Check once a month, gently with your fingers and in the mirror.", "If you find a new lump or any change, do not be afraid, and do not wait.", "Most lumps are not cancer, but a doctor must check each one."],
    anemia: ["Blood carries air (oxygen) to the whole body. A part of the blood called hemoglobin does this work.", "When hemoglobin is low, you feel tired and weak. This is called anemia.", "Green leafy vegetables, dal and chana can help.", "A small blood test tells if you have it."],
    thyroid: ["The thyroid is a small gland in your neck.", "It controls how much energy your body uses.", "If it works too slow or too fast, you may feel tired, or your weight and periods may change.", "A blood test called TSH can find it. A doctor can help you."],
    contraception: ["You decide if and when to have a baby.", "There are many safe ways to prevent pregnancy.", "Only condoms also protect you from infections.", "Talk to a doctor, ASHA or ANM to choose what suits you."],
    condoms: ["A condom is a thin cover that stops pregnancy and many infections.", "Use a new condom every time.", "Check the date on the packet before using.", "Never use two together, and never use one again."],
    hygiene: ["Keeping clean keeps you safe from infections.", "Change your pad every 4 to 6 hours.", "Wash only the outside with clean water.", "If there is a bad smell, itching or pain, see a doctor."],
  },
  hg: {
    periods: ["Har mahine aurat ki body baby ke liye taiyar hoti hai.", "Agar baby nahi thehrta, to body extra khoon bahar nikal deti hai. Ise period kehte hain.", "Ye natural aur healthy hai. Isme koi gandagi ya sharm nahi hai.", "Dard ya khoon bahut zyada ho to doctor ko batao."],
    pcos: ["Body ke andar kuch hormones ka balance bigad jata hai.", "Is wajah se period late aa sakte hain, ya aate hi nahi.", "Kuch auraton ko pimples ya chehre par zyada baal bhi aate hain.", "Ye aam hai aur ise sambhala ja sakta hai. Pakka sirf doctor bata sakte hain."],
    breast: ["Jaano ki aapke breast aam taur par kaise dikhte aur mehsoos hote hain.", "Mahine me ek baar, ungliyon se halke haath se aur sheeshe me dekh kar check karo.", "Nayi gaanth ya koi bhi badlav dikhe to daro mat, aur ruko bhi mat.", "Zyadatar gaanth cancer nahi hoti, par har gaanth doctor ko dikhao."],
    anemia: ["Khoon poori body me hawa (oxygen) pahunchata hai. Khoon ka ek hissa, hemoglobin, ye kaam karta hai.", "Hemoglobin kam ho to thakan aur kamzori lagti hai. Ise anemia kehte hain.", "Hari patedar sabzi, dal aur chana madad karte hain.", "Ek chhote blood test se pata chal jata hai."],
    thyroid: ["Thyroid gardan me ek chhoti gland hai.", "Ye tay karti hai ki body kitni energy use kare.", "Ye bahut dheemi ya bahut tez chale to thakan ho sakti hai, ya wajan aur period badal sakte hain.", "TSH naam ke blood test se pata chalta hai. Doctor aapki madad karenge."],
    contraception: ["Baby kab ho, ya ho ya na ho, ye aap tay karti ho.", "Pregnancy rokne ke kai safe tareeke hain.", "Sirf condom infection se bhi bachata hai.", "Kaunsa tareeka theek hai, ye doctor, ASHA ya ANM se poochho."],
    condoms: ["Condom ek patla cover hai jo pregnancy aur kai infections se bachata hai.", "Har baar naya condom use karo.", "Use se pehle packet ki date dekho.", "Do condom ek saath mat pehno, aur ek condom dobara use mat karo."],
    hygiene: ["Safai rakhne se infection se bachav hota hai.", "Har 4 se 6 ghante me pad badlo.", "Sirf bahar ki jagah saaf paani se dho.", "Badbu, khujli ya dard ho to doctor ko dikhao."],
  },
};

const UI_HG = {
  title: "Health Sikho", sub: "Auraton ki health ki aasaan aur bharosemand jaankari. Ek topic chuno aur seekho.",
  pick: "Topic chuno", back: "Saare topics", basics: "Zaroori baatein", see: "Doctor ko dikhao agar",
  mf: "Myth ya Sach", myth: "Myth", fact: "Sach", quiz: "Chhota quiz", check: "Jawab check karo",
  again: "Dobara try karo", score: "Aapka score", of: "me se", right: "Sahi", wrong: "Theek nahi",
  listen: "Suno", stop: "Roko",
  noVoice: "Is device me Hindi awaaz nahi mili. Windows: Settings > Time & language > Speech > Add voices.",
  help: "Kisi baat par shak hai? Apni najdeeki ASHA, ANM ya doctor se poochho. Aap akeli nahi ho.",
  note: "Sirf jaankari ke liye, diagnosis nahi. Emergency me najdeeki hospital jao.",
};
const UI2 = {
  en: { easy: "In very simple words", readAll: "Read full topic", pause: "Pause", resume: "Resume",
    speed: "Voice speed", slow: "Slow", normal: "Normal", fast: "Fast", hearQ: "Listen to question",
    tip: "Tap the speaker button on any part to hear it.", mode: "Language" },
  hg: { easy: "Bahut aasaan bhasha me", readAll: "Poora topic suno", pause: "Ruko", resume: "Phir shuru karo",
    speed: "Awaaz ki speed", slow: "Dheemi", normal: "Normal", fast: "Tez", hearQ: "Sawaal suno",
    tip: "Kisi bhi hisse ko sunne ke liye speaker button dabao.", mode: "Bhasha" },
};
const U = { en: { ...UI.en, ...UI2.en }, hg: { ...UI_HG, ...UI2.hg } };

const CSS = `
.hs{max-width:980px;margin:0 auto;padding:4px 4px 40px;color:var(--charcoal,#2D2630);animation:hsfade .25s ease}
@keyframes hsfade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.hs h1{font-size:2rem;font-weight:700;color:var(--plum,#6F315F);margin:0 0 6px}
.hs .sub{margin:0 0 16px;opacity:.85;line-height:1.7}
.hs .pick{font-weight:600;color:var(--plum,#6F315F);margin:0 0 12px}
.hs .mode{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 18px;font-weight:600;color:var(--plum,#6F315F)}
.hs .mode button{min-height:44px;padding:0 18px;border-radius:999px;border:2px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);font-weight:600;cursor:pointer;transition:.15s}
.hs .mode button.on{background:var(--plum,#6F315F);color:#fff}
.hs .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;margin-bottom:24px}
.hs .card{display:flex;flex-direction:column;align-items:flex-start;gap:10px;text-align:left;padding:18px;border-radius:18px;border:1px solid rgba(111,49,95,.15);cursor:pointer;font-family:inherit;color:var(--charcoal,#2D2630);transition:.18s;min-height:120px}
.hs .card:hover{transform:translateY(-4px);box-shadow:0 10px 24px rgba(111,49,95,.16);border-color:var(--rose,#D95C91)}
.hs .card.on{border:2px solid var(--plum,#6F315F);box-shadow:0 8px 20px rgba(111,49,95,.18)}
.hs .card .ic{width:46px;height:46px;border-radius:14px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:24px}
.hs .card .tt{font-weight:600;font-size:1.02rem;line-height:1.4}
.hs .panel{background:#fff;border:1px solid rgba(111,49,95,.15);border-radius:20px;box-shadow:0 4px 18px rgba(111,49,95,.07);overflow:hidden;margin-bottom:20px}
.hs .head{padding:22px;display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap}
.hs .head .ic{width:56px;height:56px;border-radius:16px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:30px;flex-shrink:0}
.hs .head h2{margin:0 0 6px;color:var(--plum,#6F315F);font-size:1.5rem}
.hs .head p{margin:0;line-height:1.7}
.hs .body{padding:22px;display:grid;gap:22px}
.hs h3{margin:0 0 10px;color:var(--plum,#6F315F);font-size:1.1rem}
.hs ul{margin:0;padding:0;list-style:none;display:grid;gap:10px}
.hs .pts li{position:relative;padding:12px 14px 12px 40px;background:#FBF8FB;border-radius:12px;line-height:1.65}
.hs .pts li::before{content:"✓";position:absolute;left:14px;top:12px;color:var(--rose,#D95C91);font-weight:700}
.hs .see{background:#FFF1D6;border-radius:14px;padding:16px}
.hs .see h3{color:#8A5A00}
.hs .see li{padding-left:22px;position:relative;line-height:1.6}
.hs .see li::before{content:"•";position:absolute;left:6px;color:#8A5A00;font-weight:700}
.hs .ez{background:#E6F4ED;border-radius:16px;padding:16px 18px;border:1px solid rgba(31,93,58,.2)}
.hs .ez h3{color:#1F5D3A}
.hs .ez ol{margin:0;padding-left:22px;display:grid;gap:8px;font-size:1.08rem;line-height:1.7}
.hs .mf{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
.hs .mfc{border-radius:14px;padding:14px;border:1px solid rgba(111,49,95,.15);background:#fff}
.hs .tag{display:inline-block;font-size:.78rem;font-weight:700;padding:3px 10px;border-radius:999px;margin-bottom:8px}
.hs .tag.m{background:#FDE3E3;color:#8E2B3A}
.hs .tag.f{background:#E6F4ED;color:#1F5D3A}
.hs .mfc p{margin:0 0 10px;line-height:1.6}
.hs button{font-family:inherit}
.hs .sec{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.hs .sec h3{margin:0}
.hs .sbtn{min-height:44px;padding:0 14px;border-radius:10px;border:1px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);cursor:pointer;font-weight:600;font-size:.92rem;transition:.15s}
.hs .sbtn:hover,.hs .sbtn.on{background:var(--plum,#6F315F);color:#fff}
.hs .player{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:14px;padding:12px;background:rgba(255,255,255,.75);border-radius:14px}
.hs .spd{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:.9rem}
.hs .spd button{min-height:40px;padding:0 12px;border-radius:999px;border:1px solid rgba(111,49,95,.3);background:#fff;color:var(--plum,#6F315F);cursor:pointer;font-weight:500}
.hs .spd button.on{background:var(--plum,#6F315F);color:#fff;border-color:var(--plum,#6F315F)}
.hs .tip{font-size:.9rem;opacity:.75;margin:0}
.hs .btn{min-height:46px;padding:0 20px;border-radius:12px;border:2px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);font-weight:600;cursor:pointer;transition:.15s}
.hs .btn:hover{background:var(--blush,#F7E8F0)}
.hs .btn.fill{background:var(--plum,#6F315F);color:#fff;box-shadow:0 4px 12px rgba(111,49,95,.25)}
.hs .btn.fill:hover:not(:disabled){background:#57254B;transform:translateY(-1px)}
.hs .btn:disabled{opacity:.5;cursor:not-allowed}
.hs .q{background:#FBF8FB;border-radius:14px;padding:14px;margin-bottom:12px}
.hs .qrow{display:flex;gap:10px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;margin-bottom:10px}
.hs .qrow p{margin:0;flex:1;min-width:200px;font-weight:600;line-height:1.5}
.hs .opt{display:flex;align-items:center;gap:10px;padding:10px 12px;margin-bottom:8px;border-radius:10px;border:1px solid rgba(111,49,95,.2);background:#fff;cursor:pointer;min-height:46px;width:100%;text-align:left;font-size:1rem;color:var(--charcoal,#2D2630)}
.hs .opt:hover{background:var(--blush,#F7E8F0)}
.hs .opt.sel{border:2px solid var(--plum,#6F315F);background:var(--blush,#F7E8F0)}
.hs .opt.ok{border:2px solid #1F5D3A;background:#E6F4ED}
.hs .opt.bad{border:2px solid #A12B4B;background:#FDE3E3}
.hs .why{font-size:.93rem;margin-top:6px;line-height:1.55}
.hs .res{background:#E6F4ED;color:#1F5D3A;border-radius:12px;padding:12px 16px;font-weight:600;margin-top:10px}
.hs .alert{border-radius:12px;padding:10px 14px;margin-top:12px;background:#FFF1D6;color:#8A5A00;font-size:.92rem}
.hs .help{background:#E6F4ED;color:#1F5D3A;border-radius:14px;padding:14px 16px;line-height:1.6;margin-top:8px}
.hs .foot{font-size:.9rem;opacity:.7;margin-top:14px}
.hs button:focus-visible{outline:2px solid var(--rose,#D95C91);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.hs{animation:none}.hs .card:hover{transform:none}}
`;

function pickVoice(code) {
  const vs = window.speechSynthesis?.getVoices?.() || [];
  const base = code.split("-")[0];
  return vs.find((v) => v.lang === code) || vs.find((v) => v.lang.toLowerCase().startsWith(base)) || null;
}
const stopPunct = (s) => (/[.?!]$/.test(String(s).trim()) ? String(s).trim() : String(s).trim() + ".");

export default function HealthSikho() {
  const { lang } = useLanguage();
  const [mode, setMode] = useState(() => {
    try { const s = localStorage.getItem("sikho_mode"); if (s === "en" || s === "hg") return s; } catch {}
    return lang === "hi" ? "hg" : "en";
  });
  const u = U[mode];
  const data = D[mode];
  const easy = EASY[mode];
  const [cur, setCur] = useState(null);
  const [ans, setAns] = useState({});
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [info, setInfo] = useState("");
  const panelRef = useRef(null);
  const rateRef = useRef(0.9);
  const tokenRef = useRef(0);

  useEffect(() => { window.speechSynthesis?.getVoices?.(); }, []);
  useEffect(() => () => { tokenRef.current++; try { window.speechSynthesis?.cancel(); } catch {} }, []);

  function stopSpeak() {
    tokenRef.current++;
    try { window.speechSynthesis?.cancel(); } catch {}
    setPlaying(null); setPaused(false);
  }
  function pickMode(m) {
    stopSpeak(); setInfo(""); setAns({}); setDone(false); setMode(m);
    try { localStorage.setItem("sikho_mode", m); } catch {}
  }
  function changeRate(r) { setRate(r); rateRef.current = r; }

  function speakText(key, text) {
    try {
      const synth = window.speechSynthesis;
      if (!synth) { setInfo(u.noVoice); return; }
      const code = mode === "en" ? "en-IN" : "hi-IN";
      const v = pickVoice(code);
      if (!v) { setInfo(u.noVoice); return; }
      stopSpeak();
      setInfo("");
      const token = ++tokenRef.current;
      const chunks = text.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
      let i = 0;
      setPlaying(key); setPaused(false);
      const next = () => {
        if (token !== tokenRef.current) return;
        if (i >= chunks.length) { setPlaying(null); return; }
        const ut = new SpeechSynthesisUtterance(chunks[i]);
        ut.lang = code; ut.voice = v; ut.rate = rateRef.current;
        ut.onend = () => { i++; next(); };
        ut.onerror = () => { if (token === tokenRef.current) setPlaying(null); };
        synth.speak(ut);
      };
      next();
    } catch { setInfo(u.noVoice); }
  }
  function pauseSpeak() { try { window.speechSynthesis.pause(); setPaused(true); } catch {} }
  function resumeSpeak() { try { window.speechSynthesis.resume(); setPaused(false); } catch {} }

  function choose(id) {
    stopSpeak(); setInfo(""); setAns({}); setDone(false); setCur(id);
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  const lb = (key, text, label) => (playing === key
    ? <button className="sbtn on" onClick={stopSpeak} aria-label={u.stop}>⏹ {u.stop}</button>
    : <button className="sbtn" onClick={() => speakText(key, text)} aria-label={label || u.listen}>🔊 {label || u.listen}</button>);

  const meta = META.find((m) => m.id === cur);
  const c = cur ? data[cur] : null;
  const ez = cur ? easy[cur] : [];
  const answeredAll = c && c.quiz.every((_, i) => ans[i] !== undefined);
  const score = c ? c.quiz.filter((q, i) => ans[i] === q.a).length : 0;

  const easyText = ez.map(stopPunct).join(" ");
  const pointsText = c ? c.points.map(stopPunct).join(" ") : "";
  const seeText = c ? stopPunct(u.see) + " " + c.see.map(stopPunct).join(" ") : "";
  const mythText = c ? c.myths.map((x) => `${u.myth}: ${stopPunct(x.m)} ${u.fact}: ${stopPunct(x.f)}`).join(" ") : "";
  const fullText = c ? [stopPunct(c.title), stopPunct(c.intro), stopPunct(u.easy), easyText, stopPunct(u.basics), pointsText, seeText, mythText].join(" ") : "";

  return (
    <div className="hs">
      <style>{CSS}</style>
      <h1>{u.title}</h1>
      <p className="sub">{u.sub}</p>

      <div className="mode" role="group" aria-label={u.mode}>
        <span>{u.mode}:</span>
        <button className={mode === "en" ? "on" : ""} onClick={() => pickMode("en")} aria-pressed={mode === "en"}>English</button>
        <button className={mode === "hg" ? "on" : ""} onClick={() => pickMode("hg")} aria-pressed={mode === "hg"}>Hinglish</button>
      </div>

      <p className="pick">{u.pick}</p>
      <div className="grid">
        {META.map((m) => (
          <button key={m.id} className={`card${cur === m.id ? " on" : ""}`} style={{ background: m.bg }}
            onClick={() => choose(m.id)} aria-pressed={cur === m.id}>
            <span className="ic" aria-hidden>{m.icon}</span>
            <span className="tt">{data[m.id].title}</span>
          </button>
        ))}
      </div>

      {c && (
        <div className="panel" ref={panelRef}>
          <div className="head" style={{ background: meta.bg }}>
            <span className="ic" aria-hidden>{meta.icon}</span>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h2>{c.title}</h2>
              <p>{c.intro}</p>
              <div className="player">
                {playing === "all"
                  ? <button className="sbtn on" onClick={stopSpeak}>⏹ {u.stop}</button>
                  : <button className="sbtn" onClick={() => speakText("all", fullText)}>🔊 {u.readAll}</button>}
                {playing && (paused
                  ? <button className="sbtn" onClick={resumeSpeak}>▶ {u.resume}</button>
                  : <button className="sbtn" onClick={pauseSpeak}>⏸ {u.pause}</button>)}
                <div className="spd" role="group" aria-label={u.speed}>
                  <span>{u.speed}:</span>
                  {[[0.7, u.slow], [0.9, u.normal], [1.15, u.fast]].map(([r, t]) => (
                    <button key={r} className={rate === r ? "on" : ""} onClick={() => changeRate(r)} aria-pressed={rate === r}>{t}</button>
                  ))}
                </div>
                <button className="sbtn" onClick={() => { stopSpeak(); setCur(null); }}>← {u.back}</button>
              </div>
              {info && <div className="alert" role="status">{info}</div>}
            </div>
          </div>

          <div className="body">
            <p className="tip">🔊 {u.tip}</p>

            <section className="ez">
              <div className="sec"><h3>{u.easy}</h3>{lb("easy", easyText)}</div>
              <ol>{ez.map((s, i) => <li key={i}>{s}</li>)}</ol>
            </section>

            <section>
              <div className="sec"><h3>{u.basics}</h3>{lb("pts", pointsText)}</div>
              <ul className="pts">{c.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </section>

            <section className="see">
              <div className="sec"><h3>{u.see}</h3>{lb("see", seeText)}</div>
              <ul>{c.see.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </section>

            <section>
              <div className="sec"><h3>{u.mf}</h3>{lb("myth", mythText)}</div>
              <div className="mf">
                {c.myths.map((x, i) => (
                  <div className="mfc" key={i}>
                    <span className="tag m">{u.myth}</span>
                    <p>{x.m}</p>
                    <span className="tag f">{u.fact}</span>
                    <p style={{ margin: 0 }}>{x.f}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="sec"><h3>{u.quiz}</h3></div>
              {c.quiz.map((q, qi) => (
                <div className="q" key={qi}>
                  <div className="qrow">
                    <p>{qi + 1}. {q.q}</p>
                    {lb("q" + qi, [stopPunct(q.q), ...q.o.map(stopPunct)].join(" "), u.hearQ)}
                  </div>
                  {q.o.map((o, oi) => {
                    let cls = "opt";
                    if (done) { if (oi === q.a) cls += " ok"; else if (ans[qi] === oi) cls += " bad"; }
                    else if (ans[qi] === oi) cls += " sel";
                    return (
                      <button key={oi} className={cls} disabled={done}
                        onClick={() => setAns((a) => ({ ...a, [qi]: oi }))}>{o}</button>
                    );
                  })}
                  {done && (
                    <div className="why">
                      <b>{ans[qi] === q.a ? u.right : u.wrong}.</b> {q.e}
                      <div style={{ marginTop: 6 }}>{lb("e" + qi, `${ans[qi] === q.a ? u.right : u.wrong}. ${stopPunct(q.e)}`)}</div>
                    </div>
                  )}
                </div>
              ))}
              {!done
                ? <button className="btn fill" disabled={!answeredAll} onClick={() => setDone(true)}>{u.check}</button>
                : (
                  <div>
                    <div className="res">{u.score}: {score} {u.of} {c.quiz.length}</div>
                    <button className="btn" style={{ marginTop: 10 }} onClick={() => { stopSpeak(); setAns({}); setDone(false); }}>{u.again}</button>
                  </div>
                )}
            </section>
          </div>
        </div>
      )}

      <div className="help">{u.help}</div>
      <p className="foot">{u.note}</p>
    </div>
  );
}

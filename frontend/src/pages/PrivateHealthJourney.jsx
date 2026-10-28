import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const UI = {
  en: {
    title: 'My Health Journey', sub: 'Answer a few simple questions. I will show what to do next and how to talk to your doctor. Your answers stay on this device.',
    pick: 'What would you like help with?', q: 'Question', of: 'of', back: 'Back', restart: 'Start again',
    resTitle: 'Your health journey summary',
    lv0: 'Looks mild right now', lv1: 'Please see a doctor soon', lv2: 'This may need urgent care',
    m0: 'Your answers look mild right now. Keep tracking, and get it checked if it continues or gets worse.',
    m1: "Some answers need a doctor's attention. Please see a doctor in the next few days and show this summary.",
    m2: 'Some answers can be serious. Please go to a doctor or hospital today. If bleeding is very heavy, you feel faint, or have chest pain, go to the nearest hospital now.',
    next: 'What to do next', home: 'What you can do at home', tell: 'How to talk to your doctor',
    tellSub: 'Read this out, or just show it to the doctor.', ask: 'Questions to ask the doctor', tools: 'Helpful tools',
    copy: 'Copy summary', copied: 'Copied', listen: 'Listen', stop: 'Stop',
    saved: 'Saved on this device. It will show in your Doctor Brief.',
    noVoice: 'No voice found on this device. Windows: Settings > Time & language > Speech > Add voices.',
    brief: 'Open Doctor Brief', concern: 'Concern',
    note: 'This is guidance, not a diagnosis. In an emergency go to the nearest hospital.',
  },
  hi: {
    title: 'मेरी स्वास्थ्य यात्रा', sub: 'कुछ आसान सवालों के जवाब दें। मैं बताऊँगी कि आगे क्या करना है और डॉक्टर से कैसे बात करें। आपके जवाब इसी डिवाइस पर रहते हैं।',
    pick: 'आप किस बारे में मदद चाहती हैं?', q: 'सवाल', of: 'में से', back: 'पीछे', restart: 'दोबारा शुरू करें',
    resTitle: 'आपकी स्वास्थ्य यात्रा का सार',
    lv0: 'अभी हल्का लग रहा है', lv1: 'कृपया जल्दी डॉक्टर को दिखाएँ', lv2: 'यह ज़रूरी हो सकता है',
    m0: 'आपके जवाब अभी हल्के लग रहे हैं। ट्रैक करती रहें, और अगर यह चलता रहे या बढ़े तो जाँच करवाएँ।',
    m1: 'कुछ जवाबों पर डॉक्टर का ध्यान ज़रूरी है। कृपया अगले कुछ दिनों में डॉक्टर को दिखाएँ और यह सार साथ ले जाएँ।',
    m2: 'कुछ जवाब गंभीर हो सकते हैं। कृपया आज ही डॉक्टर या अस्पताल जाएँ। बहुत ज़्यादा खून आए, चक्कर या बेहोशी लगे, या सीने में दर्द हो तो तुरंत नज़दीकी अस्पताल जाएँ।',
    next: 'आगे क्या करें', home: 'घर पर क्या कर सकती हैं', tell: 'डॉक्टर से कैसे बात करें',
    tellSub: 'इसे पढ़कर सुनाएँ, या सीधे डॉक्टर को दिखाएँ।', ask: 'डॉक्टर से पूछने के सवाल', tools: 'काम के टूल्स',
    copy: 'सार कॉपी करें', copied: 'कॉपी हो गया', listen: 'सुनें', stop: 'रोकें',
    saved: 'इस डिवाइस पर सेव हुआ। यह आपके डॉक्टर ब्रीफ में दिखेगा।',
    noVoice: 'इस डिवाइस में आवाज़ नहीं मिली। Windows: Settings > Time & language > Speech > Add voices।',
    brief: 'डॉक्टर ब्रीफ खोलें', concern: 'चिंता',
    note: 'यह मार्गदर्शन है, निदान नहीं। आपात स्थिति में नज़दीकी अस्पताल जाएँ।',
  },
};

const CONCERNS = [
  { id: 'periods', ic: '🩸', t: ['Periods', 'पीरियड्स'] },
  { id: 'breast', ic: '🌸', t: ['Breast changes', 'स्तन में बदलाव'] },
  { id: 'pcos', ic: '🔎', t: ['PCOS-related', 'पीसीओएस से जुड़ी बातें'] },
  { id: 'contra', ic: '🛡️', t: ['Contraception', 'गर्भनिरोध'] },
  { id: 'other', ic: '💬', t: ['Something else', 'कुछ और'] },
  { id: 'lost', ic: '🤍', t: ["I don't know what to do", 'मुझे समझ नहीं आ रहा क्या करूँ'] },
];

const QS = {
  periods: [
    { q: ['What is happening with your periods?', 'आपके पीरियड्स में क्या हो रहा है?'], o: [
      ['Irregular or late', 'अनियमित या देर से', 0], ['Very heavy bleeding', 'बहुत ज़्यादा खून', 1],
      ['Very painful cramps', 'बहुत तेज़ दर्द', 1], ['Missed for 3 months or more', '3 महीने या ज़्यादा से नहीं आए', 1]] },
    { q: ['Do you also have any of these?', 'क्या इनमें से कुछ और भी है?'], o: [
      ['None of these', 'इनमें से कुछ नहीं', 0], ['Dizzy or very weak', 'चक्कर या बहुत कमज़ोरी', 1],
      ['Bleeding between periods', 'पीरियड्स के बीच में खून', 1], ['Soaking a pad every hour, or fainting', 'हर घंटे पैड भीगना, या बेहोशी', 2]] },
  ],
  breast: [
    { q: ['What change did you notice?', 'आपने क्या बदलाव देखा?'], o: [
      ['A lump or thickness', 'गाँठ या सख़्ती', 1], ['Pain only', 'सिर्फ़ दर्द', 0],
      ['Nipple discharge or skin change', 'निप्पल से स्राव या त्वचा में बदलाव', 1], ['One breast changed in shape or size', 'एक स्तन का आकार बदला', 1]] },
    { q: ['Do you also notice any of these?', 'क्या इनमें से कुछ और भी दिखा?'], o: [
      ['None of these', 'इनमें से कुछ नहीं', 0], ['The lump is growing', 'गाँठ बढ़ रही है', 1],
      ['Swelling under the arm', 'बगल में सूजन', 1], ['Redness or skin like orange peel', 'लालिमा या संतरे के छिलके जैसी त्वचा', 1]] },
  ],
  pcos: [
    { q: ['What are you noticing?', 'आप क्या देख रही हैं?'], o: [
      ['Irregular periods', 'अनियमित पीरियड्स', 0], ['Extra hair on face or body', 'चेहरे या शरीर पर ज़्यादा बाल', 0],
      ['Acne or hair thinning', 'पिंपल्स या बाल पतले होना', 0], ['Weight gain that is hard to lose', 'वज़न बढ़ना जो घटता नहीं', 0]] },
    { q: ['Do any of these apply?', 'क्या इनमें से कुछ लागू होता है?'], o: [
      ['None of these', 'इनमें से कुछ नहीं', 0], ['I am trying to get pregnant', 'मैं गर्भधारण की कोशिश कर रही हूँ', 1],
      ['Very thirsty or urinating a lot', 'बहुत प्यास या बार-बार पेशाब', 1], ['No periods for 3 months or more', '3 महीने या ज़्यादा से पीरियड्स नहीं', 1]] },
  ],
  contra: [
    { q: ['What do you want to know?', 'आप क्या जानना चाहती हैं?'], o: [
      ['How to prevent pregnancy', 'गर्भ से कैसे बचें', 0], ['Condoms and safety', 'कंडोम और सुरक्षा', 0],
      ['I missed or forgot my method', 'मेरा तरीका छूट गया या भूल गई', 1], ['Side effects of what I use', 'जो इस्तेमाल करती हूँ उसके असर', 0]] },
    { q: ['Right now, is any of this true?', 'अभी क्या इनमें से कुछ सच है?'], o: [
      ['No, I just want information', 'नहीं, बस जानकारी चाहिए', 0], ['Unprotected sex in the last 3 days', 'पिछले 3 दिनों में बिना सुरक्षा के संबंध', 1],
      ['I think I may be pregnant', 'लगता है मैं गर्भवती हो सकती हूँ', 1], ['Strong side effects', 'तेज़ साइड इफ़ेक्ट', 1]] },
  ],
  other: [
    { q: ['Which area is it about?', 'यह किस बारे में है?'], o: [
      ['Pain in the lower belly', 'पेट के निचले हिस्से में दर्द', 0], ['Discharge or itching', 'स्राव या खुजली', 0],
      ['Burning while urinating', 'पेशाब में जलन', 0], ['Tiredness or weakness', 'थकान या कमज़ोरी', 0]] },
    { q: ['Do you also have any of these?', 'क्या इनमें से कुछ और भी है?'], o: [
      ['None of these', 'इनमें से कुछ नहीं', 0], ['Fever', 'बुखार', 1], ['Bleeding', 'खून आना', 1], ['Very severe pain', 'बहुत तेज़ दर्द', 2]] },
  ],
  lost: [
    { q: ['What worries you the most?', 'आपको सबसे ज़्यादा किस बात की चिंता है?'], o: [
      ['Periods or pain', 'पीरियड्स या दर्द', 0], ['Changes in my body', 'शरीर में बदलाव', 0],
      ['Feeling low or anxious', 'उदास या घबराहट महसूस करना', 0], ['I cannot put it into words', 'मैं शब्दों में बता नहीं पा रही', 0]] },
    { q: ['What would help you most right now?', 'अभी आपको सबसे ज़्यादा किससे मदद मिलेगी?'], o: [
      ['Understand what is happening', 'समझना कि क्या हो रहा है', 0], ['Know what to ask a doctor', 'डॉक्टर से क्या पूछें यह जानना', 0],
      ['Track my symptoms', 'अपने लक्षण ट्रैक करना', 0], ['Someone to talk to', 'किसी से बात करना', 0]] },
  ],
};

const SHARED = [
  { q: ['How long has this been going on?', 'यह कब से चल रहा है?'], o: [
    ['A few days', 'कुछ दिनों से', 0], ['A few weeks', 'कुछ हफ़्तों से', 0], ['1 to 3 months', '1 से 3 महीने से', 0], ['More than 3 months', '3 महीने से ज़्यादा', 1]] },
  { q: ['How much does it bother you?', 'यह आपको कितना परेशान करता है?'], o: [
    ['A little', 'थोड़ा', 0], ['Moderately', 'ठीक-ठाक', 0], ['A lot', 'बहुत ज़्यादा', 1]] },
  { q: ['Does it stop you from doing daily work?', 'क्या यह रोज़ के काम में रुकावट डालता है?'], o: [
    ['No', 'नहीं', 0], ['Sometimes', 'कभी-कभी', 0], ['Often', 'अक्सर', 1]] },
];

const TIPS = {
  periods: [['Note the date your period starts and ends, and how heavy it is.', 'पीरियड शुरू और ख़त्म होने की तारीख़ और खून कितना है, लिखें।'],
    ['Eat iron-rich foods like spinach, dal, jaggery and dates, and drink enough water.', 'पालक, दाल, गुड़ और खजूर जैसे आयरन वाले खाने खाएँ और पानी पर्याप्त पिएँ।'],
    ['Rest, and use a warm compress on the lower belly for cramps.', 'आराम करें और दर्द में पेट के निचले हिस्से पर गुनगुनी सिकाई करें।']],
  breast: [['Check both breasts once a month, a few days after your period ends.', 'महीने में एक बार, पीरियड ख़त्म होने के कुछ दिन बाद, दोनों स्तनों की जाँच करें।'],
    ['Note any change: lump, skin, nipple or size, with the date.', 'कोई भी बदलाव (गाँठ, त्वचा, निप्पल, आकार) तारीख़ के साथ लिखें।'],
    ['Wear comfortable, well-fitting clothes and notice when the pain comes.', 'आरामदायक, सही नाप के कपड़े पहनें और देखें कि दर्द कब होता है।']],
  pcos: [['Track your periods in the Diary so you have a clear record.', 'डायरी में पीरियड्स ट्रैक करें ताकि साफ़ रिकॉर्ड रहे।'],
    ['Regular walking or exercise and balanced meals help many women.', 'नियमित टहलना या व्यायाम और संतुलित खाना कई महिलाओं को मदद करता है।'],
    ['Note extra hair, acne and weight changes with dates.', 'ज़्यादा बाल, पिंपल्स और वज़न के बदलाव तारीख़ के साथ लिखें।']],
  contra: [['Condoms also protect against infections, so use them every time.', 'कंडोम संक्रमण से भी बचाते हैं, इसलिए हर बार इस्तेमाल करें।'],
    ['Emergency contraception works best when taken early. Ask a doctor or pharmacist the same day.', 'आपातकालीन गर्भनिरोध जल्दी लेने पर बेहतर काम करता है। उसी दिन डॉक्टर या फ़ार्मासिस्ट से पूछें।'],
    ['Ask which method suits your body and life.', 'पूछें कि कौन सा तरीका आपके शरीर और जीवन के लिए सही है।']],
  other: [['Write down when it started and what makes it better or worse.', 'लिखें कि कब शुरू हुआ और किससे बढ़ता या घटता है।'],
    ['Drink water and rest.', 'पानी पिएँ और आराम करें।'],
    ['Use the Voice Card to say it in your own words.', 'वॉइस कार्ड में अपने शब्दों में बताएँ।']],
  lost: [['It is okay not to know. Start by saying what you feel, in any words.', 'पता न होना ठीक है। जैसे भी शब्द हों, जो महसूस हो वह बताने से शुरू करें।'],
    ['Use the Voice Card: speak, and I will prepare questions for your doctor.', 'वॉइस कार्ड में बोलें, मैं डॉक्टर के लिए सवाल बना दूँगी।'],
    ['Talk to someone you trust, or an ASHA or ANM in your area.', 'किसी भरोसेमंद व्यक्ति या अपने इलाके की आशा या ANM से बात करें।']],
};

const DQS = {
  periods: [['What could be causing my period problem?', 'मेरे पीरियड की समस्या का कारण क्या हो सकता है?'], ['Which tests do I need?', 'मुझे कौन से टेस्ट कराने चाहिए?'], ['What should I track at home?', 'घर पर मुझे क्या ट्रैक करना चाहिए?'], ['When should I come back?', 'मुझे दोबारा कब आना चाहिए?']],
  breast: [['Do I need a breast examination or scan?', 'क्या मुझे स्तन की जाँच या स्कैन की ज़रूरत है?'], ['What changes should worry me?', 'किन बदलावों पर मुझे चिंता करनी चाहिए?'], ['How often should I check myself?', 'मुझे कितनी बार ख़ुद जाँच करनी चाहिए?'], ['When should I come back?', 'मुझे दोबारा कब आना चाहिए?']],
  pcos: [['Could my symptoms be related to PCOS?', 'क्या मेरे लक्षण पीसीओएस से जुड़े हो सकते हैं?'], ['Which tests do I need?', 'मुझे कौन से टेस्ट कराने चाहिए?'], ['What lifestyle changes help?', 'जीवनशैली में कौन से बदलाव मदद करेंगे?'], ['How does this affect getting pregnant?', 'इसका गर्भधारण पर क्या असर है?']],
  contra: [['Which method suits me best?', 'मेरे लिए कौन सा तरीका सबसे सही है?'], ['What are the side effects?', 'इसके साइड इफ़ेक्ट क्या हैं?'], ['What if I miss or forget it?', 'अगर छूट जाए या भूल जाऊँ तो क्या करूँ?'], ['How do I protect myself from infections?', 'संक्रमण से कैसे बचूँ?']],
  other: [['What could be causing this?', 'इसका कारण क्या हो सकता है?'], ['Which tests do I need?', 'मुझे कौन से टेस्ट कराने चाहिए?'], ['What should I watch out for?', 'मुझे किन बातों पर नज़र रखनी चाहिए?'], ['When should I come back?', 'मुझे दोबारा कब आना चाहिए?']],
  lost: [['Can you help me understand what is happening?', 'क्या आप समझा सकते हैं कि मेरे साथ क्या हो रहा है?'], ['Which tests do I need?', 'मुझे कौन से टेस्ट कराने चाहिए?'], ['Can you explain in simple words?', 'क्या आप आसान शब्दों में समझा सकते हैं?'], ['When should I come back?', 'मुझे दोबारा कब आना चाहिए?']],
};

const STEPS = {
  0: [['Track it in your Diary for a few weeks', 'कुछ हफ़्तों तक डायरी में ट्रैक करें'], ['Try the home tips below', 'नीचे दिए घरेलू सुझाव आज़माएँ'], ['Come back if anything changes', 'कुछ बदले तो दोबारा आएँ']],
  1: [['Book a doctor visit in the next few days', 'अगले कुछ दिनों में डॉक्टर से मिलने का समय लें'], ['Take this summary with you', 'यह सार साथ ले जाएँ'], ['Write down dates and what makes it better or worse', 'तारीख़ें और किससे बढ़ता या घटता है, लिख लें']],
  2: [['Go to a doctor or hospital today', 'आज ही डॉक्टर या अस्पताल जाएँ'], ['Ask someone to go with you', 'किसी को अपने साथ ले जाएँ'], ['Do not wait for it to pass', 'ठीक होने का इंतज़ार न करें']],
};

const LINKS = {
  periods: [['/diary', '📔', 'Track in Diary', 'डायरी में ट्रैक करें'], ['/voice', '🎙️', 'Voice Card', 'वॉइस कार्ड'], ['/report', '📄', 'Understand a report', 'रिपोर्ट समझें']],
  breast: [['/breast', '🌸', 'Breast Health', 'स्तन स्वास्थ्य'], ['/voice', '🎙️', 'Voice Card', 'वॉइस कार्ड'], ['/safe', '🧭', 'Safe Next Steps', 'सुरक्षित अगले कदम']],
  pcos: [['/pcos', '🔎', 'PCOS Check', 'पीसीओएस चेक'], ['/diary', '📔', 'Track in Diary', 'डायरी में ट्रैक करें'], ['/chatbot', '🌸', 'Ask Sakhi', 'सखी से पूछें']],
  contra: [['/chatbot', '🌸', 'Ask Sakhi', 'सखी से पूछें'], ['/sikho', '📚', 'Health Sikho', 'हेल्थ सीखो'], ['/safe', '🧭', 'Safe Next Steps', 'सुरक्षित अगले कदम']],
  other: [['/voice', '🎙️', 'Voice Card', 'वॉइस कार्ड'], ['/chatbot', '🌸', 'Ask Sakhi', 'सखी से पूछें'], ['/safe', '🧭', 'Safe Next Steps', 'सुरक्षित अगले कदम']],
  lost: [['/voice', '🎙️', 'Voice Card', 'वॉइस कार्ड'], ['/chatbot', '🌸', 'Ask Sakhi', 'सखी से पूछें'], ['/sikho', '📚', 'Health Sikho', 'हेल्थ सीखो']],
};

const CSS = `
.pj{max-width:900px;margin:0 auto;padding:4px 4px 40px;color:var(--charcoal,#2D2630);animation:pjf .25s ease}
@keyframes pjf{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes pji{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
.pj h1{font-size:2rem;font-weight:700;color:var(--plum,#6F315F);margin:0 0 6px}
.pj h2{font-size:1.2rem;color:var(--plum,#6F315F);margin:0 0 10px}
.pj .sub{margin:0 0 18px;opacity:.85;line-height:1.7}
.pj button{font-family:inherit}
.pj .grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}
.pj .cc{background:#fff;border:1px solid rgba(111,49,95,.15);border-radius:18px;padding:20px;display:flex;align-items:center;gap:14px;cursor:pointer;font-size:1.08rem;font-weight:600;color:var(--charcoal,#2D2630);text-align:left;transition:.15s;min-height:84px}
.pj .cc:hover{transform:translateY(-4px);box-shadow:0 10px 24px rgba(111,49,95,.16);border-color:var(--rose,#D95C91)}
.pj .cc .ic{width:50px;height:50px;border-radius:14px;background:var(--blush,#F7E8F0);display:inline-flex;align-items:center;justify-content:center;font-size:26px;flex:none;transition:.15s}
.pj .cc:hover .ic{background:var(--plum,#6F315F)}
.pj .bar{height:10px;border-radius:999px;background:var(--blush,#F7E8F0);overflow:hidden;margin:6px 0 4px}
.pj .bar i{display:block;height:100%;background:linear-gradient(90deg,#6F315F,#D95C91);border-radius:999px;transition:width .3s}
.pj .cnt{font-size:.9rem;opacity:.75;margin-bottom:14px}
.pj .qbox{animation:pji .25s ease}
.pj .qt{font-size:1.4rem;font-weight:700;color:var(--plum,#6F315F);margin:6px 0 16px;line-height:1.4}
.pj .opts{display:grid;gap:12px}
.pj .op{background:#fff;border:2px solid rgba(111,49,95,.2);border-radius:16px;padding:16px 18px;font-size:1.08rem;cursor:pointer;text-align:left;color:var(--charcoal,#2D2630);transition:.15s;min-height:56px}
.pj .op:hover{border-color:var(--plum,#6F315F);background:#FDF8FB;transform:translateX(3px)}
.pj .op.sel{background:var(--plum,#6F315F);border-color:var(--plum,#6F315F);color:#fff}
.pj .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:14px}
.pj .sbtn{min-height:46px;padding:0 18px;border-radius:12px;border:1px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);cursor:pointer;font-weight:600;transition:.15s;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
.pj .sbtn:hover,.pj .sbtn.on{background:var(--plum,#6F315F);color:#fff}
.pj .btn{min-height:50px;padding:0 24px;border-radius:12px;border:none;background:var(--plum,#6F315F);color:#fff;font-weight:600;font-size:1rem;cursor:pointer;box-shadow:0 4px 12px rgba(111,49,95,.25);text-decoration:none;display:inline-flex;align-items:center}
.pj .btn:hover{background:#57254B}
.pj .card{background:#fff;border:1px solid rgba(111,49,95,.15);border-radius:20px;padding:18px;box-shadow:0 4px 18px rgba(111,49,95,.07);margin-bottom:16px}
.pj .lv{border-radius:18px;padding:18px;margin-bottom:16px;line-height:1.7}
.pj .lv b{display:block;font-size:1.25rem;margin-bottom:6px}
.pj .lv0{background:#E6F4ED;color:#1F5D3A}
.pj .lv1{background:#FFF1D6;color:#8A5A00;border:2px solid #E8B64C}
.pj .lv2{background:#FDE3E3;color:#8E2B3A;border:2px solid #A12B4B}
.pj ul,.pj ol{margin:0;padding-left:22px;display:grid;gap:8px;line-height:1.65}
.pj .tellbox{background:var(--blush,#F7E8F0);border-radius:14px;padding:14px 16px;line-height:1.8}
.pj .tools{display:flex;gap:10px;flex-wrap:wrap}
.pj .alert{border-radius:12px;padding:10px 14px;margin-top:10px;background:#FFF1D6;color:#8A5A00;font-size:.92rem}
.pj .ok{font-size:.9rem;color:#1F5D3A;margin-top:6px}
.pj .foot{font-size:.9rem;opacity:.7;margin-top:14px}
.pj button:focus-visible,.pj a:focus-visible{outline:2px solid var(--rose,#D95C91);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.pj,.pj .qbox{animation:none}}
`;

function pickVoice(code) {
  const vs = window.speechSynthesis?.getVoices?.() || [];
  const base = code.split('-')[0];
  return vs.find((v) => v.lang === code) || vs.find((v) => v.lang.toLowerCase().startsWith(base)) || null;
}

export default function PrivateHealthJourney() {
  const { lang } = useLanguage();
  const L = lang === 'hi' ? 1 : 0;
  const u = UI[lang === 'hi' ? 'hi' : 'en'];
  const [cid, setCid] = useState(null);
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState([]);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [info, setInfo] = useState('');

  const list = cid ? [...QS[cid], ...SHARED] : [];
  const total = list.length;
  const done = cid && step > total;
  const cLabel = cid ? CONCERNS.find((c) => c.id === cid).t[L] : '';

  let level = 0;
  if (done) {
    list.forEach((q, k) => { const w = q.o[ans[k]] ? q.o[ans[k]][2] : 0; if (w > level) level = w; });
  }
  const lines = done ? list.map((q, k) => q.q[L] + ' ' + (q.o[ans[k]] ? q.o[ans[k]][L] : '')) : [];
  const tellText = done ? [u.concern + ': ' + cLabel, ...lines].join('\n') : '';

  useEffect(() => {
    if (!done) return;
    try {
      localStorage.setItem('sakhi_journey', JSON.stringify({
        concern: cLabel, answers: lines.join(' | '), level, date: new Date().toISOString(),
      }));
    } catch {}
    // eslint-disable-next-line
  }, [done]);

  useEffect(() => { window.speechSynthesis?.getVoices?.(); return () => { try { window.speechSynthesis?.cancel(); } catch {} }; }, []);

  function stopSpeak() { try { window.speechSynthesis?.cancel(); } catch {} setSpeaking(false); }

  function startConcern(id) { stopSpeak(); setCid(id); setAns([]); setStep(1); setInfo(''); }
  function choose(i) {
    const next = [...ans.slice(0, step - 1), i];
    setAns(next);
    const s = step;
    setTimeout(() => setStep(s + 1), 220);
  }
  function back() {
    stopSpeak();
    if (step <= 1) { setStep(0); setCid(null); setAns([]); } else setStep(step - 1);
  }
  function restart() { stopSpeak(); setCid(null); setStep(0); setAns([]); setCopied(false); setInfo(''); }

  async function copy() {
    try { await navigator.clipboard.writeText(tellText); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  }

  function speak() {
    try {
      const synth = window.speechSynthesis;
      const code = L ? 'hi-IN' : 'en-IN';
      const v = pickVoice(code);
      if (!synth || !v) { setInfo(u.noVoice); return; }
      stopSpeak(); setInfo('');
      const msg = level === 2 ? u.m2 : level === 1 ? u.m1 : u.m0;
      const text = [msg, ...STEPS[level].map((x) => x[L]), ...TIPS[cid].map((x) => x[L])].join('. ');
      const ut = new SpeechSynthesisUtterance(text);
      ut.lang = code; ut.voice = v; ut.rate = 0.92;
      ut.onend = () => setSpeaking(false);
      ut.onerror = () => setSpeaking(false);
      setSpeaking(true);
      synth.speak(ut);
    } catch { setInfo(u.noVoice); }
  }

  return (
    <div className="pj">
      <style>{CSS}</style>
      <h1>🧭 {u.title}</h1>

      {step === 0 && (
        <>
          <p className="sub">{u.sub}</p>
          <h2>{u.pick}</h2>
          <div className="grid">
            {CONCERNS.map((c) => (
              <button key={c.id} className="cc" onClick={() => startConcern(c.id)}>
                <span className="ic" aria-hidden>{c.ic}</span><span>{c.t[L]}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {cid && step >= 1 && step <= total && (
        <div>
          <div className="cnt">{cLabel} · {u.q} {step} {u.of} {total}</div>
          <div className="bar" role="progressbar" aria-valuemin="0" aria-valuemax={total} aria-valuenow={step - 1}>
            <i style={{ width: ((step - 1) / total) * 100 + '%' }} />
          </div>
          <div className="qbox" key={step}>
            <div className="qt">{list[step - 1].q[L]}</div>
            <div className="opts">
              {list[step - 1].o.map((o, i) => (
                <button key={i} className={'op' + (ans[step - 1] === i ? ' sel' : '')} onClick={() => choose(i)}>{o[L]}</button>
              ))}
            </div>
          </div>
          <div className="row"><button className="sbtn" onClick={back}>← {u.back}</button></div>
        </div>
      )}

      {done && (
        <div className="qbox">
          <h2>{u.resTitle}: {cLabel}</h2>

          <div className={'lv lv' + level} role={level === 2 ? 'alert' : 'status'}>
            <b>{level === 2 ? '🚨 ' : level === 1 ? '⚠️ ' : '✅ '}{u['lv' + level]}</b>
            {level === 2 ? u.m2 : level === 1 ? u.m1 : u.m0}
          </div>

          <section className="card">
            <h2>{u.next}</h2>
            <ol>{STEPS[level].map((x, i) => <li key={i}>{x[L]}</li>)}</ol>
          </section>

          <section className="card">
            <h2>{u.home}</h2>
            <ul>{TIPS[cid].map((x, i) => <li key={i}>{x[L]}</li>)}</ul>
            <div className="row">
              {speaking
                ? <button className="sbtn on" onClick={stopSpeak}>⏹ {u.stop}</button>
                : <button className="sbtn" onClick={speak}>🔊 {u.listen}</button>}
            </div>
            {info && <div className="alert" role="status">{info}</div>}
          </section>

          <section className="card">
            <h2>{u.tell}</h2>
            <p style={{ margin: '0 0 10px', opacity: 0.8 }}>{u.tellSub}</p>
            <div className="tellbox">
              <div><b>{u.concern}:</b> {cLabel}</div>
              {list.map((q, k) => (
                <div key={k}><span style={{ opacity: 0.75 }}>{q.q[L]}</span> <b>{q.o[ans[k]] ? q.o[ans[k]][L] : ''}</b></div>
              ))}
            </div>
            <div className="row">
              <button className="sbtn" onClick={copy}>{copied ? '✓ ' + u.copied : '📋 ' + u.copy}</button>
            </div>
          </section>

          <section className="card">
            <h2>{u.ask}</h2>
            <ol>{DQS[cid].map((x, i) => <li key={i}>{x[L]}</li>)}</ol>
          </section>

          <section className="card">
            <h2>{u.tools}</h2>
            <div className="tools">
              {LINKS[cid].map((x, i) => <Link key={i} to={x[0]} className="sbtn">{x[1]} {x[L + 2]}</Link>)}
              <Link to="/brief" className="btn">📄 {u.brief}</Link>
            </div>
            <div className="ok">💾 {u.saved}</div>
          </section>

          <div className="row"><button className="sbtn" onClick={back}>← {u.back}</button><button className="sbtn" onClick={restart}>↺ {u.restart}</button></div>
        </div>
      )}

      <p className="foot">{u.note}</p>
    </div>
  );
}

import type { SampleVisit } from './types'

/** Judge-facing sample vernacular visit notes (synthetic, not real PHI). */
export const SAMPLE_VISITS: SampleVisit[] = [
  {
    id: 'anc-fever',
    title: 'ANC · fever & swelling',
    programArea: 'maternal',
    lang: 'hi',
    blurb: 'Hindi notes after an antenatal home visit — classic ASHA documentation load.',
    note:
      'सीता देवी, गाँव रामपुर। गर्भावस्था लगभग 7 महीने। आज बुखार और पैर में सूजन है। सिर दर्द भी बताया। खाना कम खा रही है। पिछले चेकअप में BP थोड़ा ज्यादा था। परिवार कहता है रात को साँस फूलती है। फॉलोअप कल PHC ले जाना है?',
  },
  {
    id: 'child-diarrhea',
    title: 'Child · diarrhea & ORS',
    programArea: 'child',
    lang: 'mixed',
    blurb: 'Hinglish field note — weak network, written on phone after visit.',
    note:
      'बच्चा रवि 11 महीने। 2 दिन से दस्त (loose motion) और उल्टी। आज 3 बार watery stool। माँ ने ORS दिया लेकिन कम। बुखार नहीं। पेशाब कम हो गया। weight थोड़ा कम लग रहा। AWW को बताना है। अगर सुबह तक ठीक न हो तो PHC refer?',
  },
  {
    id: 'tb-cough',
    title: 'Adult · cough >2 weeks',
    programArea: 'infectious',
    lang: 'hi',
    blurb: 'TB symptom screening style note — needs structured referral path.',
    note:
      'रमेश, उम्र ~45। दो हफ्ते से खांसी और रात को पसीना। वजन कम हुआ है। कभी कभी खून वाली खांसी? परिवार कहता है नहीं। धूम्रपान करता है। गांव में पहले TB केस था। CHC में sputum test के लिए भेजना चाहिए।',
  },
  {
    id: 'ncd-sugar',
    title: 'NCD · sugar & foot sore',
    programArea: 'ncd',
    lang: 'en',
    blurb: 'English sample for judges — same engine, structured NCD follow-up.',
    note:
      'Patient Meena, about 55. Known diabetes. Today fasting sugar high per strip. Small wound on left foot not healing for 10 days. Feels tingling in feet. Missed last medicine refill. Needs PHC review and foot care checklist for family.',
  },
]

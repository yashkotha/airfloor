(function(){
"use strict";
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function css(v){ return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
function el(id){ return document.getElementById(id); }
function isLight(){ return document.documentElement.getAttribute('data-theme')!=='dark'; }
function setVal(node,main,unit){ node.textContent=''; node.appendChild(document.createTextNode(''+main)); if(unit){ var sm=document.createElement('small'); sm.textContent=' '+unit; node.appendChild(sm);} }

/* ============================ i18n ============================ */
var DICT={
 en:{
  brand_tag:"India | live index",
  eyebrow:"Live air quality, floor by floor",
  h1a:"Which floor should you live on?", h1b:"Ask the air.",
  dek:"The air you breathe is not the same on every floor. AirFloor scores each floor of an apartment for how clean and healthy the air is, using live pollution data and the real ground elevation for any place in India. Find the best floors to breathe before you rent or buy.",
  step1_title:"Pick your area", step2_title:"Building height", floors_suffix:"floors", gate_hint:"Pick an area and enter your building's floors to see the healthiest levels.",
  ph_search:"Area, district, city or 6-digit PIN code", btn_search:"Search", try:"Try:",
  popular:"Popular areas", combo_hint:"Open the list to browse popular areas, or start typing. One area at a time.", n_areas:"areas found",
  lab_ground:"Ground elevation", lab_aqi:"Live US AQI", lab_floors:"Building floors",
  s1_h2:"Live air readings",
  s1_lead:"Current pollutant levels at your chosen location, straight from the Copernicus atmosphere model. Not crowd-sourced guesses.",
  s1_note_l:"Reading the numbers",
  s1_note_p:"The WHO says yearly PM2.5 should stay under 5 µg/m³. Most Indian cities sit well above that, so the goal is not perfect air, it is choosing the floor that gives you the cleanest slice of what is available.",
  s2_h2:"Elevation, sea level to rooftop",
  s2_lead:"Your building is a thin sliver on top of the land. That is why oxygen barely changes with floor. The pollution that matters lives in the first 150 m above the street.",
  s2_vh:"Absolute height vs height above the street", s2_hint:"dithered | live elevation",
  lg_sea:"land to plateau", lg_plume:"street fumes", lg_inv:"night inversion lid", lg_best:"best band",
  s3_h2:"The floor-by-floor score",
  s3_lead:"One score from 0 to 100 for every floor, built from five parts. It climbs off the street, peaks in the low-to-mid 20s, then drops as high wind kills natural airflow.",
  s3_vh:"Overall score and its five parts", s3_hint:"animated",
  lg_comp:"Overall", lg_pm:"PM2.5 / inversion", lg_fumes:"Street fumes", lg_vent:"Ventilation", lg_live:"Liveability", lg_ox:"Oxygen",
  peak_a:"Best floor is", peak_m:"m up", peak_b:"The sweet-spot band is",
  peak_c:", where the score stays within 2 points of the peak while you can still open a window. Ground floors and the very top both sit well below.",
  s4_h2:"Score by tier",
  th_tier:"Tier", th_pm:"PM2.5", th_fumes:"Fumes", th_vent:"Vent", th_live:"Living", th_overall:"Overall", th_score:"Score",
  tab_curve:"Curve", tab_bars:"Bars", tab_table:"Table", tbl_floor:"Floor(s)",
  tier_ground:"Ground", tier_mid:"Mid", tier_top:"Top",
  s4_note:"Ground = lowest 5 floors | Mid = floors 12 to 25 | Top = highest floor. Each part scored 0 to 100, higher is better.",
  s5_h2:"How the score works",
  s5_lead:"Each floor's height feeds five curves. The overall score is their weighted sum. PM2.5 carries the most weight because it is the one thing that genuinely changes your health here. Oxygen carries almost none.",
  m1_n:"PM2.5 / inversion", m1_d:"Climbs with height as floors clear the trapped night air near the ground.",
  m2_n:"Street fumes", m2_d:"CO, NO₂ and diesel soot fall away fast in the first 50 m, then flatten out.",
  m3_n:"Ventilation", m3_d:"Best around the mid floors. Up high, wind forces sealed windows and full-time AC.",
  m4_n:"Liveability", m4_d:"Fewer mosquitoes and less noise with height, but harder escape and more sway.",
  m5_n:"Oxygen", m5_d:"Almost flat across any single building. Small weight on purpose, it barely matters.",
  s5_note_l:"Honest limits",
  s5_note_p:"The score is a clear guide, not a certified standard. Elevation and live air are real and sourced below. The shape of the height curves comes from standard atmospheric physics tuned to your location's pollution level. The biggest unknown is how deep the night inversion sits, which shifts the best floor by a few floors, never the overall story.",
  s6_h2:"What it means for you",
  f1_h:"Aim for a band, not one magic floor",
  f1_p:"The score is nearly flat across the sweet-spot band. Any home in it clears the street fumes, beats most inversion nights, and still lets you open a window. Buy anywhere in the band and you have already won.",
  f2_h:"The very top loses on wind, not oxygen",
  f2_p:"The highest floor has the cleanest raw air but the worst airflow, plus harder escape, sway and sun load. Its penalty is about daily life, not thin air. Oxygen is a rounding error in any building.",
  f3_h:"The ground floor loses where it counts",
  f3_p:"The lowest floors sit inside both the street fumes and the trapped night air at the exact hours you sleep and breathe deepest. No view or garden makes up for the dirtiest slice of air.",
  s6_note_l:"Bottom line",
  s6_note_p:"Pick a home in the sweet-spot band, facing away from the busiest road, confirm the windows actually open, and run a HEPA purifier in each bedroom. That beats chasing the highest floor you can afford.",
  s7_h2:"Sources and accuracy",
  s7_lead:"Every live number on this page is fetched at the moment you search, from named scientific sources, and time-stamped. No number is invented or cached from memory.",
  s7_note_l:"Why you can trust these",
  s7_note_p:"Air quality comes from the Copernicus Atmosphere Monitoring Service, a physics-based model run by the EU, not a network of cheap sensors that can drift or be gamed. Elevation comes from the Copernicus 90 m digital terrain model. PIN codes resolve through the official India Post directory. Where a single low-cost station disagrees, treat the model as the steadier reference and re-check on a second day.",
  foot:"AirFloor India | independent environmental and building-microclimate tool | not medical advice. Live air quality: Open-Meteo Air Quality API (Copernicus CAMS). Elevation: Open-Meteo Elevation API (Copernicus DEM GLO-90). Place and PIN lookup: Open-Meteo Geocoding and India Post PIN directory. The floor score is a transparent, physics-informed guide for decisions, not a site measurement.",
  st_searching:"Searching…", st_none:"No matches. Try a bigger nearby place or a PIN code.", st_loading:"Loading live data…", st_err:"Could not reach the data service. Check the connection and try again.",
  cat_good:"good", cat_mod:"moderate", cat_usg:"unhealthy for sensitive", cat_unh:"unhealthy", cat_vunh:"very unhealthy", cat_haz:"hazardous",
  aq_pm25:"PM2.5 fine dust", aq_pm10:"PM10 coarse dust", aq_no2:"NO₂ traffic gas", aq_o3:"O₃ ozone", aq_co:"CO carbon monoxide", aq_aqi:"US AQI overall",
  whox:"× WHO limit", live_at:"live", src_air:"Air quality", src_elev:"Elevation", src_geo:"Place lookup", src_pin:"PIN directory",
  verified:"verified live", fetched:"fetched",
  cv_abs:"Above sea level", cv_rel:"Above the street", cv_ground:"ground", cv_roof:"roof", cv_inv:"inversion ~150 m",
  cv_best:"best", cv_wind:"wind ~2×", cv_delta:"Oxygen change over the whole building", cv_floor:"FLOOR", cv_index:"SCORE", cv_peak:"Floor",
  sec_recent:"Recent", sec_results:"Results", clear_recent:"Clear",
  use_location:"Use my current location", loc_unavailable:"Location access unavailable",
  no_match:"No matches", no_match_hint:"Try a nearby area, landmark, or PIN code",
  not_india:"Please choose a location inside India", loc_detect:"Finding your location", loc_start:"Search any place in India to begin", loc_denied:"Location unavailable. Search a place in India.",
  floors_ph:"e.g. 24", floors_hint:"We score every floor from 1 up to this number", score_locked:"Enter your building's floor count above to score each level", loc_summary:"{city} sits near {elev} m and its air today rates {cat}.",
  kbd_move:"to move", kbd_select:"to select", kbd_close:"to close",
  attribution:"Location data from OpenStreetMap",
  aria_clear:"Clear search", aria_caret:"Browse areas", aria_use_location:"Use my current location",
  meta_pin:"PIN",
  export_pdf:"Export PDF", pdf_preparing:"Preparing…",
  fnd_good:"Best value", fnd_watch:"Worth knowing", fnd_avoid:"Weakest spot",
  adv_h:"Advice for your household", adv_lead:"Pick who you are planning for and get guidance matched to today's air and this building.",
  p_kids:"Young children", p_elder:"Elderly", p_asthma:"Asthma or COPD", p_run:"Runners",
  adv_disc:"General guidance, not medical advice.",
  fl_below:"Your floor {f} sits below the clean band. It catches the street's worst hours, especially at night; a purifier and closed windows at dawn matter most here.",
  fl_in:"Your floor {f} sits inside the healthiest band, floors {lo} to {hi}. You are in the building's sweet spot; ventilate whenever the day's air allows.",
  fl_above:"Your floor {f} rides above the sweet-spot band. Up here wind, not smoke, is the issue; on sealed-window days plan for indoor air changes.",
  cp_h:"{city} through the year",
  oss_line:"Free and open source. Made in India, for India.", oss_license:"MIT License", privacy_link:"Privacy",
  met_h:"Live conditions now", met_p:"Mixing layer about {pbl} m, wind about {wind} km/h aloft. {stab}", met_stable:"Shallow and stable, so higher floors gain the most today.", met_mixed:"Deep and well mixed, so floor-to-floor gaps are smaller today.", met_neutral:"Near-neutral conditions today.", robust_h:"How robust is this", robust_p:"In about {pct}% of the modelled scenarios, floors {lo} to {hi} still beat the ground floor. The shaded band on the curve is the 80% range for each floor score."
 },
 te:{"brand_tag":"భారతదేశం | లైవ్ ఇండెక్స్","eyebrow":"అంతస్తు అంతస్తుకీ లైవ్ గాలి నాణ్యత","h1a":"మీరు ఏ అంతస్తులో ఉండాలి?","h1b":"గాలినే అడగండి.","dek":"మీరు పీల్చే గాలి ప్రతి అంతస్తులోనూ ఒకేలా ఉండదు. భారతదేశంలో ఏ ప్రాంతానికైనా లైవ్ కాలుష్య డేటా, అసలైన నేల ఎత్తు ఆధారంగా AirFloor ఆ అపార్ట్‌మెంట్‌లోని ప్రతి అంతస్తుకీ గాలి ఎంత స్వచ్ఛంగా, ఆరోగ్యంగా ఉందో స్కోరు ఇస్తుంది. అద్దెకు తీసుకునే ముందో, కొనే ముందో గాలి బాగుండే అంతస్తులు ఏవో తెలుసుకోండి.","step1_title":"మీ ప్రాంతాన్ని ఎంచుకోండి","step2_title":"భవనం ఎత్తు","floors_suffix":"అంతస్తులు","gate_hint":"మీ ప్రాంతాన్ని ఎంచుకుని, మీ భవనంలో ఎన్ని అంతస్తులున్నాయో చెబితే, గాలి బాగుండే అంతస్తులు ఏవో చూపిస్తాం.","ph_search":"ప్రాంతం, జిల్లా, నగరం లేదా 6 అంకెల PIN కోడ్","btn_search":"వెతకండి","try":"ఇలా వెతకండి:","popular":"ప్రముఖ ప్రాంతాలు","combo_hint":"జాబితా తెరిచి ప్రముఖ ప్రాంతాలను చూడండి, లేదా టైప్ చేయడం మొదలుపెట్టండి. ఒకసారికి ఒక ప్రాంతం మాత్రమే.","n_areas":"ప్రాంతాలు దొరికాయి","floors_ph":"ఉదా. 24","floors_hint":"1 నుండి మీరు ఇచ్చిన సంఖ్య వరకు ప్రతి అంతస్తుకూ స్కోరు ఇస్తాం","score_locked":"ప్రతి అంతస్తుకూ స్కోరు కావాలంటే, పైన మీ భవనంలో ఎన్ని అంతస్తులున్నాయో చెప్పండి","lab_ground":"నేల ఎత్తు","lab_aqi":"లైవ్ US AQI","lab_floors":"భవన అంతస్తులు","loc_summary":"{city} సుమారు {elev} m ఎత్తులో ఉంది. ఈరోజు అక్కడి గాలి నాణ్యత {cat}గా ఉంది.","s1_h2":"లైవ్ గాలి కొలతలు","s1_lead":"మీరు ఎంచుకున్న చోట ప్రస్తుతం ఉన్న కాలుష్య స్థాయిలు, నేరుగా Copernicus వాతావరణ మోడల్ నుంచి. ఇవి ఎవరో ఊహించి చెప్పిన అంచనాలు కావు.","s1_note_l":"ఈ సంఖ్యల అర్థం","s1_note_p":"ఏడాదికి PM2.5 సగటు 5 µg/m³ లోపు ఉండాలని WHO చెబుతోంది. మన దేశంలో చాలా నగరాలు దాని కంటే బాగా ఎక్కువగానే ఉంటాయి. కాబట్టి లక్ష్యం పరిపూర్ణమైన గాలి కాదు, ఉన్నదాంట్లో మీకు అత్యంత స్వచ్ఛమైన భాగాన్ని అందించే అంతస్తును ఎంచుకోవడమే.","aq_pm25":"PM2.5 సూక్ష్మ దుమ్ము","aq_pm10":"PM10 ముతక దుమ్ము","aq_no2":"NO₂ ట్రాఫిక్ వాయువు","aq_o3":"O₃ ఓజోన్","aq_co":"CO కార్బన్ మోనాక్సైడ్","aq_aqi":"US AQI మొత్తం","whox":"× WHO పరిమితి","live_at":"లైవ్","cat_good":"మంచిది","cat_mod":"మధ్యస్థం","cat_usg":"సున్నితమైన వారికి హానికరం","cat_unh":"హానికరం","cat_vunh":"చాలా హానికరం","cat_haz":"ప్రమాదకరం","s2_h2":"ఎత్తు | సముద్ర మట్టం నుండి డాబా వరకు","s2_lead":"మీ భవనం నేలపై ఉన్న ఒక పలుచని పొర మాత్రమే. అందుకే మీరు ఏ అంతస్తులో ఉన్నా ఆక్సిజన్ దాదాపుగా మారదు. నిజంగా పట్టించుకోవాల్సిన కాలుష్యమంతా రోడ్డుకి పైన మొదటి 150 m లోపే ఉంటుంది.","s2_vh":"సముద్ర మట్టం నుండి ఎత్తు vs రోడ్డు నుండి ఎత్తు","s2_hint":"సుమారుగా | లైవ్ ఎత్తు","lg_sea":"నేల నుండి పీఠభూమి","lg_plume":"రోడ్డు పొగ","lg_inv":"రాత్రి గాలి నిలిచే పొర","lg_best":"గాలి బాగుండే అంతస్తులు","cv_abs":"సముద్ర మట్టం నుండి","cv_rel":"రోడ్డు నుండి","cv_ground":"నేల","cv_roof":"డాబా","cv_inv":"గాలి నిలిచే పొర ~150 m","cv_best":"మేలైనది","cv_wind":"గాలి వేగం ~2×","cv_delta":"భవనం అంతటా ఆక్సిజన్ మార్పు","cv_floor":"అంతస్తు","cv_index":"స్కోరు","cv_peak":"అంతస్తు","s3_h2":"అంతస్తుల వారీ స్కోరు","s3_lead":"ప్రతి అంతస్తుకూ 0 నుంచి 100 వరకు ఒకే స్కోరు, ఐదు అంశాలను కలిపి రూపొందించాం. రోడ్డు స్థాయి నుంచి పైకి వెళ్లేకొద్దీ ఇది పెరుగుతూ, 20ల కింది నుంచి మధ్య శ్రేణి అంతస్తుల దగ్గర గరిష్ఠానికి చేరుతుంది. ఆపైన బలమైన గాలుల వల్ల సహజ గాలి ప్రసరణ ఆగిపోయి స్కోరు మళ్ళీ తగ్గుతుంది.","s3_vh":"మొత్తం స్కోరు, దాని ఐదు అంశాలు","s3_hint":"కదులుతోంది","lg_comp":"మొత్తం","lg_pm":"PM2.5 / గాలి నిలిచిపోవడం","lg_fumes":"రోడ్డు పొగ","lg_vent":"గాలి ప్రసరణ","lg_live":"నివాస సౌకర్యం","lg_ox":"ఆక్సిజన్","peak_a":"మీకు సరైన అంతస్తు","peak_m":"m పైన","peak_b":"గాలి బాగుండే అంతస్తులు","peak_c":", ఇక్కడ కిటికీ తెరిచే వీలు ఇంకా ఉంటూనే స్కోరు గరిష్ఠ స్థాయికి 2 పాయింట్ల లోపే నిలుస్తుంది. కింది అంతస్తులూ, అత్యంత పై అంతస్తూ రెండూ దీనికంటే చాలా తక్కువగా ఉంటాయి.","s4_h2":"స్థాయుల వారీ స్కోరు","th_tier":"స్థాయి","th_pm":"PM2.5","th_fumes":"పొగ","th_vent":"ప్రసరణ","th_live":"నివాసం","th_overall":"మొత్తం","th_score":"స్కోరు","tab_curve":"వక్రరేఖ","tab_bars":"బార్‌లు","tab_table":"పట్టిక","tbl_floor":"అంతస్తులు","tier_ground":"కింది","tier_mid":"మధ్య","tier_top":"పై","s4_note":"కింది = అట్టడుగు 5 అంతస్తులు | మధ్య = 12 నుంచి 25 అంతస్తులు | పై = అత్యంత పై అంతస్తు. ప్రతి అంశానికీ 0 నుంచి 100 స్కోరు, ఎక్కువ ఉంటే మంచిది.","s5_h2":"స్కోరు ఎలా వస్తుంది","s5_lead":"ప్రతి అంతస్తు ఎత్తును బట్టి ఐదు అంశాలు మారతాయి. వాటన్నింటినీ వాటి ప్రాధాన్యం మేరకు కలిపి మొత్తం స్కోరు తయారవుతుంది. వీటిలో PM2.5కి ఎక్కువ ప్రాధాన్యం ఇస్తాం, ఎందుకంటే ఇక్కడ మీ ఆరోగ్యాన్ని నిజంగా మార్చేది అదొక్కటే. ఆక్సిజన్‌కి మాత్రం దాదాపుగా ప్రాధాన్యం ఉండదు.","m1_n":"PM2.5 | గాలి నిలిచిపోవడం","m1_d":"పై అంతస్తులు రాత్రిపూట నేల దగ్గర నిలిచిపోయే గాలిని దాటేస్తాయి కాబట్టి, ఎత్తు పెరిగే కొద్దీ మెరుగవుతుంది.","m2_n":"రోడ్డు పొగ","m2_d":"CO, NO₂, డీజిల్ మసి మొదటి 50 m లోనే వేగంగా తగ్గిపోతాయి, ఆ తర్వాత దాదాపు ఒకే స్థాయిలో ఉంటాయి.","m3_n":"గాలి ప్రసరణ","m3_d":"మధ్య అంతస్తుల్లో గాలి బాగా ఆడుతుంది. పై అంతస్తుల్లో మాత్రం బలమైన గాలుల వల్ల కిటికీలు మూసేసి, ఎప్పుడూ AC వేసుకోవాల్సి వస్తుంది.","m4_n":"నివాస సౌకర్యం","m4_d":"ఎత్తుకు వెళ్లే కొద్దీ దోమలు తగ్గుతాయి, శబ్దం కూడా తగ్గుతుంది. కానీ అత్యవసర సమయంలో బయటపడటం కష్టం, భవనం ఎక్కువగా ఊగుతుంది.","m5_n":"ఆక్సిజన్","m5_d":"ఒకే భవనంలో ఏ అంతస్తులో అయినా ఆక్సిజన్ దాదాపు ఒకేలా ఉంటుంది. అందుకే దీనికి కావాలనే తక్కువ ప్రాధాన్యం ఇచ్చాం, దీని తేడా పెద్దగా పట్టదు.","s5_note_l":"నిజాయితీగా చెప్పాలంటే","s5_note_p":"ఈ స్కోరు మీకు ఒక స్పష్టమైన మార్గదర్శి మాత్రమే, ఇదేదో అధికారికంగా ధృవీకరించిన ప్రమాణం కాదు. అంతస్తుల ఎత్తు, లైవ్ గాలి నాణ్యత మాత్రం నిజమైనవే, వీటి ఆధారాలను కింద ఇచ్చాం. ఎత్తును బట్టి గాలి ఎలా మారుతుందో లెక్కించే విధానం ప్రామాణిక వాతావరణ శాస్త్రం నుంచి వచ్చింది, దాన్ని మీ ప్రాంతపు కాలుష్య స్థాయికి తగ్గట్టు సర్దుబాటు చేశాం. అన్నింటిలో మాకు ఖచ్చితంగా తెలియనిది ఒక్కటే | రాత్రిపూట గాలి ఎంత లోతు వరకు నిలిచిపోతుందో అనేదే. దీనివల్ల మీకు సరైన అంతస్తు ఒకటి రెండు అంతస్తులు అటూఇటూ మారొచ్చు, కానీ మొత్తం సంగతి మాత్రం మారదు.","s6_h2":"ఇదంతా మీకు ఏం చెబుతుంది","f1_h":"ఒకే అంతస్తు వెంట పడకండి | ఒక మంచి శ్రేణి చాలు","f1_p":"గాలి బాగుండే అంతస్తుల్లో స్కోరు దాదాపు ఒకేలా ఉంటుంది. వాటిలో ఏ ఇల్లు తీసుకున్నా రోడ్డు పొగ మీ దాకా రాదు, గాలి నిలిచిపోయే చాలా రాత్రుల్లోనూ ఇబ్బంది ఉండదు, పైగా కిటికీ తెరిచి స్వచ్ఛమైన గాలి పీల్చే వీలుంది. ఈ శ్రేణిలో ఎక్కడ కొన్నా మీరు గెలిచినట్టే.","f2_h":"అన్నిటికన్నా పైన సమస్య గాలి ఆడకపోవడమే | ఆక్సిజన్ కాదు","f2_p":"పై అంతస్తులో బయటి గాలి అయితే అన్నిటికన్నా స్వచ్ఛంగా ఉంటుంది. కానీ అక్కడ గాలి సరిగా ఆడదు, అత్యవసరంలో కిందికి దిగడం కష్టం, భవనం కాస్త ఊగుతుంది, ఎండ వేడి కూడా ఎక్కువ. దీని ఇబ్బంది రోజువారీ జీవితంలోనే | ఆక్సిజన్ తక్కువ అవడం వల్ల కాదు. ఏ భవనంలోనైనా అంతస్తుల మధ్య ఆక్సిజన్ తేడా అసలు లెక్కలోకే రాదు.","f3_h":"గ్రౌండ్ ఫ్లోర్ ఓడిపోయేది అసలు ముఖ్యమైన చోటే","f3_p":"కింది అంతస్తులు రోడ్డు పొగలోనూ, రాత్రిపూట కిందే నిలిచిపోయే కాలుష్యంలోనూ ఇరుక్కుపోతాయి | అదీ మీరు నిద్రపోతూ లోతుగా ఊపిరి పీల్చుకునే సరిగ్గా ఆ గంటల్లోనే. అక్కడ గాలి అన్నిటికన్నా మురికిగా ఉంటుంది | మంచి వ్యూ కానీ గార్డెన్ కానీ దాన్ని పూడ్చలేవు.","s6_note_l":"మొత్తానికి","s6_note_p":"గాలి బాగుండే అంతస్తుల్లో ఒక ఇల్లు ఎంచుకోండి, రద్దీ ఎక్కువ ఉండే రోడ్డుకి అవతలి వైపు ఉండేలా చూసుకోండి, కిటికీలు నిజంగా తెరుచుకుంటాయో లేదో సరిచూసుకోండి, ప్రతి బెడ్‌రూంలో ఒక HEPA ప్యూరిఫయర్ వాడండి. మీ బడ్జెట్‌లో అందేంత పై అంతస్తు వెంట పడటం కంటే ఇదే మేలు.","s7_h2":"ఆధారాలు, కచ్చితత్వం","s7_lead":"ఈ పేజీలో కనిపించే ప్రతి లైవ్ నంబరూ మీరు వెతికిన క్షణంలోనే, పేరున్న శాస్త్రీయ ఆధారాల నుండి తీసుకున్నదే. దాన్ని ఏ సమయంలో తీసుకున్నామో కూడా నమోదవుతుంది. ఏ నంబరునూ మేము సొంతంగా ఊహించి రాయం, ముందే దాచిపెట్టిన పాత డేటాను చూపించం.","s7_note_l":"వీటిని ఎందుకు నమ్మవచ్చు","s7_note_p":"గాలి నాణ్యత సమాచారం Copernicus Atmosphere Monitoring Service నుండి వస్తుంది. ఇది EU నడిపే, భౌతికశాస్త్ర సూత్రాల ఆధారంగా పనిచేసే మోడల్. కాలక్రమేణా తప్పుడు విలువలు చూపే లేదా తారుమారు చేయగల చౌక సెన్సర్ల నెట్‌వర్క్ కాదు. నేల ఎత్తు Copernicus 90 m డిజిటల్ భూ ఉపరితల మోడల్ నుండి వస్తుంది. PIN కోడ్‌లను అధికారిక India Post డైరెక్టరీ ద్వారా సరిచూస్తాం. ఏదైనా ఒక చౌక స్టేషన్ దీనికి భిన్నంగా చూపిస్తే, ఈ మోడల్‌నే ఎక్కువ స్థిరమైన ఆధారంగా తీసుకోండి, మరో రోజు మళ్ళీ ఓసారి సరిచూసుకోండి.","foot":"AirFloor India | స్వతంత్ర పర్యావరణ, భవన సూక్ష్మవాతావరణ సాధనం | వైద్య సలహా కాదు. లైవ్ గాలి నాణ్యత: Open-Meteo Air Quality API (Copernicus CAMS). నేల ఎత్తు: Open-Meteo Elevation API (Copernicus DEM GLO-90). ప్రదేశం, PIN వివరాలు: Open-Meteo Geocoding, India Post PIN డైరెక్టరీ. అంతస్తు స్కోరు అనేది నిర్ణయాలకు తోడ్పడే పారదర్శకమైన, భౌతికశాస్త్ర ఆధారిత మార్గదర్శి మాత్రమే. ఇది నేరుగా ఆ ప్రదేశంలో తీసిన కొలత కాదు.","src_air":"గాలి నాణ్యత","src_elev":"నేల ఎత్తు","src_geo":"ప్రదేశ వివరాలు","src_pin":"PIN డైరెక్టరీ","verified":"లైవ్‌గా నిర్ధారించాం","fetched":"తీసుకున్నది","attribution":"స్థాన సమాచారం OpenStreetMap నుండి","st_searching":"వెతుకుతున్నాం…","st_none":"ఏదీ దొరకలేదు. దగ్గర్లోని పెద్ద ప్రాంతం లేదా PIN కోడ్ ప్రయత్నించండి.","st_loading":"లైవ్ డేటా వస్తోంది…","st_err":"డేటా సర్వీస్‌కి చేరలేకపోయాం. కనెక్షన్ ఒకసారి చూసుకుని మళ్లీ ప్రయత్నించండి.","sec_recent":"ఇటీవలివి","sec_results":"ఫలితాలు","clear_recent":"క్లియర్","use_location":"నా ప్రస్తుత లొకేషన్ వాడండి","loc_unavailable":"లొకేషన్ యాక్సెస్ అందుబాటులో లేదు","no_match":"ఏదీ దొరకలేదు","no_match_hint":"దగ్గర్లోని ప్రాంతం, ల్యాండ్‌మార్క్ లేదా PIN కోడ్ ప్రయత్నించండి","not_india":"దయచేసి ఇండియాలోని ప్రాంతాన్ని ఎంచుకోండి","loc_detect":"మీ లొకేషన్ కనుక్కుంటున్నాం","loc_start":"మొదలుపెట్టడానికి ఇండియాలో ఏ ప్రాంతాన్నైనా వెతకండి","loc_denied":"లొకేషన్ అందుబాటులో లేదు. ఇండియాలో ఏదైనా ప్రాంతాన్ని వెతకండి.","kbd_move":"కదలడానికి","kbd_select":"ఎంచుకోవడానికి","kbd_close":"మూసేయడానికి","aria_clear":"సెర్చ్ క్లియర్ చేయండి","aria_caret":"ప్రాంతాలను చూడండి","aria_use_location":"నా ప్రస్తుత లొకేషన్ వాడండి","meta_pin":"PIN","export_pdf":"PDF ఎగుమతి","pdf_preparing":"సిద్ధం చేస్తున్నాం…","fnd_good":"మంచి ఎంపిక","fnd_watch":"గుర్తుంచుకోండి","fnd_avoid":"బలహీన స్థానం","oss_line":"ఉచితం మరియు ఓపెన్ సోర్స్. భారతదేశంలో తయారైంది, భారతదేశం కోసం.","oss_license":"MIT లైసెన్స్","met_h":"ఇప్పటి వాతావరణం","met_p":"గాలి కలిసే పొర సుమారు {pbl} m, ఎత్తులో గాలి సుమారు {wind} km/h. {stab}","met_stable":"పొర పలుచగా, నిలకడగా ఉంది, అందుకే ఈరోజు పై అంతస్తులకే ఎక్కువ లాభం.","met_mixed":"పొర లోతుగా, బాగా కలిసిపోయి ఉంది, అందుకే ఈరోజు అంతస్తుల మధ్య తేడా తక్కువ.","met_neutral":"ఈరోజు దాదాపు సాధారణ స్థితి.","robust_h":"ఇది ఎంత నమ్మదగినది","robust_p":"మేము మోడల్ చేసిన సందర్భాల్లో సుమారు {pct}% సార్లు, {lo} నుండి {hi} అంతస్తులు నేల అంతస్తును మించే ఉంటాయి. వక్రరేఖపై నీడ ఉన్న భాగం ప్రతి అంతస్తు స్కోరుకూ 80% పరిధి.","privacy_link":"గోప్యత","adv_h":"మీ ఇంటివారికి సలహాలు","adv_lead":"ఎవరి కోసం చూస్తున్నారో ఎంచుకోండి; ఈరోజు గాలికి, ఈ భవనానికి తగ్గ సలహాలు అందుతాయి.","p_kids":"చిన్న పిల్లలు","p_elder":"పెద్దవాళ్లు","p_asthma":"ఆస్తమా లేదా COPD","p_run":"రన్నర్లు","adv_disc":"ఇది సాధారణ సమాచారం మాత్రమే, వైద్య సలహా కాదు.","fl_below":"మీ {f}వ అంతస్తు శుభ్రమైన గాలి పరిధికి దిగువన ఉంది. ముఖ్యంగా రాత్రి వేళల్లో వీధి కాలుష్యం ఇక్కడే ఎక్కువగా చేరుతుంది. ప్యూరిఫైయర్ వాడటం, తెల్లవారుజామున కిటికీలు మూసి ఉంచటం ఇక్కడ చాలా ముఖ్యం.","fl_in":"మీ {f}వ అంతస్తు భవనంలో అత్యంత ఆరోగ్యకరమైన పరిధిలో, అంటే {lo} నుంచి {hi} అంతస్తుల మధ్య ఉంది. ఇది భవనంలోని ఉత్తమ స్థానం. గాలి బాగున్నప్పుడల్లా కిటికీలు తెరిచి గాలి ఆడనివ్వండి.","fl_above":"మీ {f}వ అంతస్తు అనుకూల పరిధి కంటే పైన ఉంది. ఈ ఎత్తులో పొగ కంటే బలమైన గాలులే అసలు సమస్య. కిటికీలు మూసి ఉంచాల్సిన రోజుల్లో ఇంట్లో గాలి మారేలా ఏర్పాటు చేసుకోండి.","cp_h":"ఏడాది పొడవునా {city}"},
 kn:{"brand_tag":"ಭಾರತ | ಲೈವ್ ಸೂಚ್ಯಂಕ","eyebrow":"ಲೈವ್ ಗಾಳಿಯ ಗುಣಮಟ್ಟ, ಮಹಡಿ ಮಹಡಿಗೂ","h1a":"ನೀವು ಯಾವ ಮಹಡಿಯಲ್ಲಿ ಇರಬೇಕು?","h1b":"ಗಾಳಿಯನ್ನೇ ಕೇಳಿ.","dek":"ನೀವು ಉಸಿರಾಡುವ ಗಾಳಿ ಎಲ್ಲಾ ಮಹಡಿಗಳಲ್ಲೂ ಒಂದೇ ಆಗಿರುವುದಿಲ್ಲ. ಭಾರತದ ಯಾವುದೇ ಜಾಗದ ಲೈವ್ ಮಾಲಿನ್ಯ ಮಾಹಿತಿ ಮತ್ತು ನಿಜವಾದ ನೆಲದ ಎತ್ತರವನ್ನು ಬಳಸಿ, ಪ್ರತಿ ಮಹಡಿಯ ಗಾಳಿ ಎಷ್ಟು ಶುದ್ಧ ಹಾಗೂ ಆರೋಗ್ಯಕರ ಎಂದು AirFloor ಅಂಕ ನೀಡುತ್ತದೆ. ಬಾಡಿಗೆಗೆ ಪಡೆಯುವ ಅಥವಾ ಖರೀದಿಸುವ ಮೊದಲೇ, ಚೆನ್ನಾಗಿ ಉಸಿರಾಡಲು ಅತ್ಯುತ್ತಮ ಮಹಡಿಗಳು ಯಾವುವು ಎಂದು ತಿಳಿಯಿರಿ.","step1_title":"ನಿಮ್ಮ ಪ್ರದೇಶ ಆರಿಸಿ","step2_title":"ಕಟ್ಟಡದ ಎತ್ತರ","floors_suffix":"ಮಹಡಿಗಳು","gate_hint":"ನಿಮ್ಮ ಪ್ರದೇಶ ಆರಿಸಿ, ಕಟ್ಟಡದ ಮಹಡಿಗಳ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ | ಶುದ್ಧ ಗಾಳಿ ಸಿಗುವ ಅತ್ಯುತ್ತಮ ಮಹಡಿಗಳು ಕಾಣಿಸುತ್ತವೆ.","ph_search":"ಪ್ರದೇಶ, ಜಿಲ್ಲೆ, ನಗರ ಅಥವಾ 6-ಅಂಕಿಯ PIN ಕೋಡ್","btn_search":"ಹುಡುಕಿ","try":"ಪ್ರಯತ್ನಿಸಿ:","popular":"ಜನಪ್ರಿಯ ಪ್ರದೇಶಗಳು","combo_hint":"ಜನಪ್ರಿಯ ಪ್ರದೇಶಗಳನ್ನು ನೋಡಲು ಪಟ್ಟಿ ತೆರೆಯಿರಿ, ಇಲ್ಲವೇ ಟೈಪ್ ಮಾಡಲು ಶುರುಮಾಡಿ | ಒಮ್ಮೆಗೆ ಒಂದೇ ಪ್ರದೇಶ.","n_areas":"ಪ್ರದೇಶಗಳು ಸಿಕ್ಕಿವೆ","floors_ph":"ಉದಾ. 24","floors_hint":"1ರಿಂದ ಈ ಸಂಖ್ಯೆಯವರೆಗಿನ ಪ್ರತಿ ಮಹಡಿಗೂ ನಾವು ಸ್ಕೋರ್ ನೀಡುತ್ತೇವೆ","score_locked":"ಪ್ರತಿ ಮಹಡಿಗೂ ಸ್ಕೋರ್ ನೀಡಲು, ಮೇಲೆ ನಿಮ್ಮ ಕಟ್ಟಡದ ಮಹಡಿಗಳ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ","lab_ground":"ನೆಲದ ಎತ್ತರ","lab_aqi":"ಲೈವ್ US AQI","lab_floors":"ಕಟ್ಟಡದ ಮಹಡಿಗಳು","loc_summary":"{city} ಸುಮಾರು {elev} m ಎತ್ತರದಲ್ಲಿದೆ, ಇಲ್ಲಿನ ಇವತ್ತಿನ ಗಾಳಿಯ ಗುಣಮಟ್ಟ {cat}.","s1_h2":"ಗಾಳಿಯ ಲೈವ್ ಮಾಹಿತಿ","s1_lead":"ನೀವು ಆರಿಸಿದ ಜಾಗದಲ್ಲಿ ಈಗ ಇರುವ ಮಾಲಿನ್ಯದ ಮಟ್ಟ, ನೇರವಾಗಿ Copernicus ವಾತಾವರಣ ಮಾದರಿಯಿಂದ ಬಂದದ್ದು. ಜನ ಸೇರಿ ಮಾಡಿದ ಊಹೆಯಲ್ಲ.","s1_note_l":"ಸಂಖ್ಯೆಗಳ ಅರ್ಥ","s1_note_p":"ವಾರ್ಷಿಕ ಸರಾಸರಿ PM2.5 (ಸೂಕ್ಷ್ಮ ಧೂಳಿನ ಕಣ) 5 µg/m³ ಒಳಗೆ ಇರಬೇಕು ಎಂದು WHO ಹೇಳುತ್ತದೆ. ಭಾರತದ ಬಹುತೇಕ ನಗರಗಳು ಇದಕ್ಕಿಂತ ತುಂಬಾ ಮೇಲಿವೆ. ಹಾಗಾಗಿ ನಮ್ಮ ಗುರಿ ಪರಿಪೂರ್ಣ ಗಾಳಿ ಅಲ್ಲ, ಸಿಗುವ ಗಾಳಿಯಲ್ಲೇ ಅತ್ಯಂತ ಶುದ್ಧವಾದ ಪಾಲನ್ನು ಕೊಡುವ ಮಹಡಿಯನ್ನು ಆರಿಸಿಕೊಳ್ಳುವುದು.","aq_pm25":"PM2.5 ಸೂಕ್ಷ್ಮ ಧೂಳು","aq_pm10":"PM10 ದೊಡ್ಡ ಧೂಳು","aq_no2":"NO₂ ವಾಹನಗಳ ಅನಿಲ","aq_o3":"O₃ ಓಝೋನ್","aq_co":"CO ಕಾರ್ಬನ್ ಮೊನಾಕ್ಸೈಡ್","aq_aqi":"US AQI ಒಟ್ಟಾರೆ","whox":"× WHO ಮಿತಿ","live_at":"ಲೈವ್","cat_good":"ಉತ್ತಮ","cat_mod":"ಸಾಧಾರಣ","cat_usg":"ಸೂಕ್ಷ್ಮ ಆರೋಗ್ಯದವರಿಗೆ ಹಾನಿಕರ","cat_unh":"ಹಾನಿಕರ","cat_vunh":"ತುಂಬಾ ಹಾನಿಕರ","cat_haz":"ಅಪಾಯಕಾರಿ","s2_h2":"ಎತ್ತರ, ಸಮುದ್ರ ಮಟ್ಟದಿಂದ ತಾರಸಿಯವರೆಗೆ","s2_lead":"ನಿಮ್ಮ ಕಟ್ಟಡ ನೆಲದ ಮೇಲಿನ ಒಂದು ತೆಳ್ಳನೆಯ ಪದರ ಅಷ್ಟೇ. ಹಾಗಾಗಿ ಮಹಡಿಯಿಂದ ಮಹಡಿಗೆ ಆಕ್ಸಿಜನ್ ಬಹುತೇಕ ಬದಲಾಗುವುದಿಲ್ಲ. ನಿಜಕ್ಕೂ ಮುಖ್ಯವಾದ ಮಾಲಿನ್ಯ ಇರುವುದು ರಸ್ತೆಯ ಮೇಲಿನ ಮೊದಲ 150 m ಒಳಗೆ.","s2_vh":"ಒಟ್ಟು ಎತ್ತರ vs ರಸ್ತೆಯಿಂದ ಎತ್ತರ","s2_hint":"ಸರಿಸುಮಾರು | ಲೈವ್ ಎತ್ತರ","lg_sea":"ನೆಲದಿಂದ ಪ್ರಸ್ಥಭೂಮಿಗೆ","lg_plume":"ರಸ್ತೆಯ ಹೊಗೆ","lg_inv":"ರಾತ್ರಿಯ ಗಾಳಿ ಮುಚ್ಚಳ","lg_best":"ಹಿತವಲಯ","cv_abs":"ಸಮುದ್ರ ಮಟ್ಟದಿಂದ ಮೇಲೆ","cv_rel":"ರಸ್ತೆಯಿಂದ ಮೇಲೆ","cv_ground":"ನೆಲ","cv_roof":"ಮೇಲ್ಛಾವಣಿ","cv_inv":"ಗಾಳಿ ಮುಚ್ಚಳ ~150 m","cv_best":"ಅತ್ಯುತ್ತಮ","cv_wind":"ಗಾಳಿ ~2×","cv_delta":"ಇಡೀ ಕಟ್ಟಡದಲ್ಲಿ ಆಕ್ಸಿಜನ್ ಬದಲಾವಣೆ","cv_floor":"ಮಹಡಿ","cv_index":"ಸ್ಕೋರ್","cv_peak":"ಮಹಡಿ","s3_h2":"ಮಹಡಿ ಮಹಡಿಗೂ ಸ್ಕೋರ್","s3_lead":"ಪ್ರತಿ ಮಹಡಿಗೂ 0ರಿಂದ 100ರವರೆಗಿನ ಒಂದೇ ಸ್ಕೋರ್, ಐದು ಅಂಶಗಳಿಂದ ಲೆಕ್ಕ ಹಾಕಿದ್ದು. ರಸ್ತೆ ಮಟ್ಟದಿಂದ ಮೇಲಕ್ಕೆ ಹೋದಂತೆ ಇದು ಏರುತ್ತಾ, 20ರ ಆಸುಪಾಸಿನ ಮಹಡಿಗಳಲ್ಲಿ ಗರಿಷ್ಠ ಮಟ್ಟ ಮುಟ್ಟುತ್ತದೆ. ಆಮೇಲೆ ತೀರಾ ಎತ್ತರದಲ್ಲಿ ಜೋರು ಗಾಳಿ ಸಹಜ ಗಾಳಿಯ ಹರಿವನ್ನು ಕೆಡಿಸುವುದರಿಂದ ಸ್ಕೋರ್ ಕೆಳಗಿಳಿಯುತ್ತದೆ.","s3_vh":"ಒಟ್ಟಾರೆ ಸ್ಕೋರ್ ಮತ್ತು ಅದರ ಐದು ಅಂಶಗಳು","s3_hint":"ಚಲಿಸುತ್ತದೆ","lg_comp":"ಒಟ್ಟಾರೆ","lg_pm":"PM2.5 | ರಾತ್ರಿಯ ಗಾಳಿ ಬಂಧ","lg_fumes":"ರಸ್ತೆಯ ಹೊಗೆ","lg_vent":"ಗಾಳಿ ಆಡುವಿಕೆ","lg_live":"ವಾಸ ಹಿತ","lg_ox":"ಆಕ್ಸಿಜನ್","peak_a":"ಅತ್ಯುತ್ತಮ ಮಹಡಿ","peak_m":"m ಎತ್ತರದಲ್ಲಿ","peak_b":"ಹಿತವಾದ ಮಹಡಿಗಳ ಶ್ರೇಣಿ","peak_c":", ಇಲ್ಲಿ ಸ್ಕೋರ್ ಗರಿಷ್ಠ ಮಟ್ಟದಿಂದ 2ರ ಅಂತರದೊಳಗೇ ಇರುತ್ತದೆ, ಜೊತೆಗೆ ನೀವು ಈಗಲೂ ಕಿಟಕಿ ತೆರೆದು ಸಹಜ ಗಾಳಿ ಪಡೆಯಬಹುದು. ನೆಲ ಮಹಡಿ ಮತ್ತು ತೀರಾ ಎತ್ತರದ ಮಹಡಿ, ಎರಡೂ ಇದಕ್ಕಿಂತ ಸಾಕಷ್ಟು ಕೆಳಗಿರುತ್ತವೆ.","s4_h2":"ಹಂತವಾರು ಸ್ಕೋರ್","th_tier":"ಹಂತ","th_pm":"PM2.5","th_fumes":"ಹೊಗೆ","th_vent":"ಗಾಳಿ","th_live":"ವಾಸ","th_overall":"ಒಟ್ಟಾರೆ","th_score":"ಸ್ಕೋರ್","tab_curve":"ರೇಖೆ","tab_bars":"ಬಾರ್","tab_table":"ಕೋಷ್ಟಕ","tbl_floor":"ಮಹಡಿ(ಗಳು)","tier_ground":"ಕೆಳಗಿನ","tier_mid":"ಮಧ್ಯದ","tier_top":"ಮೇಲಿನ","s4_note":"ಕೆಳಗಿನ = ತಳದ 5 ಮಹಡಿಗಳು | ಮಧ್ಯದ = 12ರಿಂದ 25ನೇ ಮಹಡಿಗಳು | ಮೇಲಿನ = ಅತಿ ಎತ್ತರದ ಮಹಡಿ. ಪ್ರತಿ ಅಂಶಕ್ಕೂ 0ರಿಂದ 100ರವರೆಗೆ ಸ್ಕೋರ್, ಹೆಚ್ಚಿದ್ದಷ್ಟೂ ಒಳ್ಳೆಯದು.","s5_h2":"ಸ್ಕೋರ್ ಹೇಗೆ ಲೆಕ್ಕವಾಗುತ್ತದೆ","s5_lead":"ಪ್ರತಿ ಮಹಡಿಯ ಎತ್ತರ ಐದು ಕರ್ವ್‌ಗಳಿಗೆ ಆಧಾರವಾಗುತ್ತದೆ. ಈ ಐದರ ತೂಕದ ಮೊತ್ತವೇ ಒಟ್ಟಾರೆ ಸ್ಕೋರ್. ಇಲ್ಲಿ ನಿಮ್ಮ ಆರೋಗ್ಯವನ್ನು ನಿಜವಾಗಿ ಬದಲಿಸುವುದು PM2.5 ಒಂದೇ, ಹಾಗಾಗಿ ಅದಕ್ಕೆ ಅತಿ ಹೆಚ್ಚು ತೂಕ. ಆಕ್ಸಿಜನ್‌ಗೆ ಬಹುತೇಕ ತೂಕವೇ ಇಲ್ಲ.","m1_n":"PM2.5 | ರಾತ್ರಿ ಗಾಳಿ ಬಂಧನ","m1_d":"ಎತ್ತರ ಏರಿದಂತೆ ಇದೂ ಏರುತ್ತದೆ. ಮೇಲಿನ ಮಹಡಿಗಳು ರಾತ್ರಿ ನೆಲದ ಹತ್ತಿರ ಸಿಲುಕಿಕೊಳ್ಳುವ ಗಾಳಿಯಿಂದ ಪಾರಾಗುತ್ತವೆ.","m2_n":"ರಸ್ತೆಯ ಹೊಗೆ","m2_d":"CO, NO₂ ಮತ್ತು ಡೀಸೆಲ್ ಮಸಿ ಮೊದಲ 50 m ನಲ್ಲಿ ಬೇಗನೆ ಕಡಿಮೆಯಾಗುತ್ತವೆ, ಆಮೇಲೆ ಒಂದೇ ಮಟ್ಟದಲ್ಲಿ ಉಳಿಯುತ್ತವೆ.","m3_n":"ಗಾಳಿಯಾಟ","m3_d":"ಮಧ್ಯದ ಮಹಡಿಗಳಲ್ಲಿ ಗಾಳಿಯಾಟ ಅತ್ಯುತ್ತಮ. ತುಂಬಾ ಎತ್ತರದಲ್ಲಿ ಗಾಳಿಯ ರಭಸಕ್ಕೆ ಕಿಟಕಿ ಮುಚ್ಚಿಡಬೇಕು, ಇಡೀ ಹೊತ್ತೂ AC ಹಾಕಬೇಕಾಗುತ್ತದೆ.","m4_n":"ವಾಸ ಸೌಕರ್ಯ","m4_d":"ಎತ್ತರಕ್ಕೆ ಹೋದಂತೆ ಸೊಳ್ಳೆ ಕಡಿಮೆ, ಸದ್ದು ಕಡಿಮೆ. ಆದರೆ ತುರ್ತಿನಲ್ಲಿ ಇಳಿಯುವುದು ಕಷ್ಟ, ಕಟ್ಟಡದ ಅಲುಗಾಟವೂ ಹೆಚ್ಚು.","m5_n":"ಆಕ್ಸಿಜನ್","m5_d":"ಒಂದೇ ಕಟ್ಟಡದಲ್ಲಿ ಮಹಡಿಯಿಂದ ಮಹಡಿಗೆ ಆಕ್ಸಿಜನ್ ಬಹುತೇಕ ಒಂದೇ ಸಮ. ಬೇಕೆಂದೇ ಇದಕ್ಕೆ ಕಡಿಮೆ ತೂಕ ಕೊಟ್ಟಿದ್ದೇವೆ, ಏಕೆಂದರೆ ಇದರಿಂದ ಹೆಚ್ಚೇನೂ ಬದಲಾಗುವುದಿಲ್ಲ.","s5_note_l":"ಪ್ರಾಮಾಣಿಕ ಮಿತಿಗಳು","s5_note_p":"ಈ ಸ್ಕೋರ್ ಒಂದು ಸ್ಪಷ್ಟ ಮಾರ್ಗದರ್ಶಿ, ಪ್ರಮಾಣೀಕೃತ ಮಾನದಂಡ ಅಲ್ಲ. ನೆಲದ ಎತ್ತರ ಮತ್ತು ಲೈವ್ ಗಾಳಿಯ ಮಾಹಿತಿ ನಿಜವಾದದ್ದು, ಇವುಗಳ ಮೂಲಗಳನ್ನು ಕೆಳಗೆ ಕೊಟ್ಟಿದ್ದೇವೆ. ಎತ್ತರದ ಕರ್ವ್‌ಗಳ ಆಕಾರ ಪ್ರಮಾಣಿತ ವಾಯುಮಂಡಲ ಭೌತಶಾಸ್ತ್ರದಿಂದ ಬಂದದ್ದು, ಅದನ್ನು ನಿಮ್ಮ ಪ್ರದೇಶದ ಮಾಲಿನ್ಯ ಮಟ್ಟಕ್ಕೆ ಹೊಂದಿಸಲಾಗಿದೆ. ನಮಗೆ ಸರಿಯಾಗಿ ಗೊತ್ತಿಲ್ಲದ ದೊಡ್ಡ ವಿಷಯ ಎಂದರೆ, ರಾತ್ರಿ ನೆಲದ ಹತ್ತಿರ ಸಿಲುಕುವ ಗಾಳಿ ಎಷ್ಟು ಆಳಕ್ಕೆ ನೆಲೆ ನಿಲ್ಲುತ್ತದೆ ಎಂಬುದು. ಇದು ಅತ್ಯುತ್ತಮ ಮಹಡಿಯನ್ನು ಒಂದೆರಡು ಮಹಡಿ ಹಿಂದೆಮುಂದೆ ಮಾಡಬಹುದು, ಆದರೆ ಒಟ್ಟಾರೆ ಚಿತ್ರವನ್ನು ಬದಲಿಸುವುದಿಲ್ಲ.","s6_h2":"ಇದು ನಿಮಗೇನು ಹೇಳುತ್ತದೆ","f1_h":"ಒಂದೇ ಮಹಡಿ ಅಲ್ಲ | ಇಡೀ ಹಿತವಲಯವೇ ಗುರಿ","f1_p":"ಹಿತವಲಯದ ಎಲ್ಲ ಮಹಡಿಗಳಲ್ಲೂ ಸ್ಕೋರ್ ಬಹುತೇಕ ಒಂದೇ ಆಗಿರುತ್ತದೆ. ಇಲ್ಲಿನ ಯಾವ ಮನೆಯೂ ರಸ್ತೆಯ ಹೊಗೆಯಿಂದ ಪಾರಾಗುತ್ತದೆ, ಮಾಲಿನ್ಯ ನೆಲದ ಬಳಿ ಸಿಕ್ಕಿಹಾಕಿಕೊಳ್ಳುವ ಬಹುತೇಕ ರಾತ್ರಿಗಳಲ್ಲೂ ಮೇಲುಗೈ ಸಾಧಿಸುತ್ತದೆ, ಜೊತೆಗೆ ಕಿಟಕಿ ತೆರೆದು ಗಾಳಿ ಆಡಲೂ ಅವಕಾಶ ಕೊಡುತ್ತದೆ. ಈ ಹಿತವಲಯದಲ್ಲಿ ಎಲ್ಲಿ ಮನೆ ತೆಗೆದುಕೊಂಡರೂ ನೀವು ಆಗಲೇ ಗೆದ್ದಂತೆ.","f2_h":"ತೀರಾ ಮೇಲಿನ ಮಹಡಿ ಸೋಲುವುದು ಗಾಳಿಯಾಟದಲ್ಲಿ, ಆಕ್ಸಿಜನ್‌ನಲ್ಲಿ ಅಲ್ಲ","f2_p":"ಅತಿ ಮೇಲಿನ ಮಹಡಿಯಲ್ಲಿ ಕಚ್ಚಾ ಗಾಳಿ ಅತ್ಯಂತ ಶುದ್ಧವಾಗಿರುತ್ತದೆ ನಿಜ, ಆದರೆ ಗಾಳಿಯಾಟ ಮಾತ್ರ ಅಲ್ಲೇ ಅತ್ಯಂತ ಕಡಿಮೆ. ಜೊತೆಗೆ ತುರ್ತಿನಲ್ಲಿ ಕೆಳಗಿಳಿಯುವುದು ಕಷ್ಟ, ಕಟ್ಟಡ ತೂಗಾಡುವ ಅನುಭವ, ಬಿಸಿಲಿನ ಶಾಖ ಹೆಚ್ಚು. ಇದರ ಸಮಸ್ಯೆ ದಿನನಿತ್ಯದ ಜೀವನದ್ದೇ ಹೊರತು ಆಕ್ಸಿಜನ್ ಕೊರತೆಯದ್ದಲ್ಲ. ಯಾವ ಕಟ್ಟಡದಲ್ಲೂ ಆಕ್ಸಿಜನ್ ವ್ಯತ್ಯಾಸ ಲೆಕ್ಕಕ್ಕೇ ಸಿಗದಷ್ಟು ಅತ್ಯಲ್ಪ.","f3_h":"ನೆಲ ಮಹಡಿ ಸೋಲುವುದು ಮುಖ್ಯವಾದ ಕಡೆಯೇ","f3_p":"ಅತಿ ಕೆಳಗಿನ ಮಹಡಿಗಳು ರಸ್ತೆಯ ಹೊಗೆಯ ನಡುವೆಯೂ ಇರುತ್ತವೆ, ರಾತ್ರಿ ಹೊತ್ತು ನೆಲದ ಬಳಿ ಕಟ್ಟಿಕೊಳ್ಳುವ ಮಾಲಿನ್ಯದ ನಡುವೆಯೂ ಇರುತ್ತವೆ. ಅದೂ ನೀವು ನಿದ್ದೆ ಮಾಡುವ, ಆಳವಾಗಿ ಉಸಿರಾಡುವ ಅದೇ ಹೊತ್ತಿನಲ್ಲಿ. ಎಷ್ಟೇ ಚೆಂದದ ನೋಟವಾಗಲಿ, ತೋಟವಾಗಲಿ ಈ ಅತ್ಯಂತ ಕೊಳಕು ಗಾಳಿಯನ್ನು ಸರಿದೂಗಿಸಲಾರದು.","s6_note_l":"ಒಟ್ಟಿನಲ್ಲಿ","s6_note_p":"ಹಿತವಲಯದ ಒಳಗಿನ ಒಂದು ಮನೆ ಆಯ್ಕೆ ಮಾಡಿ, ದಟ್ಟಣೆ ಹೆಚ್ಚಿರುವ ರಸ್ತೆಗೆ ಬೆನ್ನು ಮಾಡಿರುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ, ಕಿಟಕಿಗಳು ನಿಜಕ್ಕೂ ತೆರೆಯುತ್ತವೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ, ಪ್ರತಿ ಮಲಗುವ ಕೋಣೆಯಲ್ಲೂ ಒಂದು HEPA ಪ್ಯೂರಿಫೈಯರ್ ಬಳಸಿ. ಕೈಗೆಟುಕುವ ಅತಿ ಎತ್ತರದ ಮಹಡಿಯ ಹಿಂದೆ ಓಡುವುದಕ್ಕಿಂತ ಇದು ಎಷ್ಟೋ ಮೇಲು.","s7_h2":"ಮೂಲಗಳು ಮತ್ತು ನಿಖರತೆ","s7_lead":"ಈ ಪುಟದಲ್ಲಿ ಕಾಣುವ ಪ್ರತಿ ಲೈವ್ ಸಂಖ್ಯೆಯೂ ನೀವು ಹುಡುಕಿದ ಕ್ಷಣದಲ್ಲೇ, ಹೆಸರು ನಮೂದಿಸಿದ ವೈಜ್ಞಾನಿಕ ಮೂಲಗಳಿಂದ ಬರುತ್ತದೆ, ಜೊತೆಗೆ ಆ ಸಮಯದ ಗುರುತೂ ಇರುತ್ತದೆ. ಯಾವ ಸಂಖ್ಯೆಯನ್ನೂ ನಾವು ಸೃಷ್ಟಿಸಿಲ್ಲ, ಹಳೆಯ ಮಾಹಿತಿಯಿಂದ ಎತ್ತಿ ತೋರಿಸಿಲ್ಲ.","s7_note_l":"ಇವನ್ನು ಏಕೆ ನಂಬಬಹುದು","s7_note_p":"ಗಾಳಿಯ ಗುಣಮಟ್ಟದ ಮಾಹಿತಿ Copernicus Atmosphere Monitoring Service ನಿಂದ ಬರುತ್ತದೆ. ಇದು EU ನಡೆಸುವ ಭೌತಶಾಸ್ತ್ರ ಆಧಾರಿತ ಮಾದರಿ, ಅಳತೆ ದಾರಿ ತಪ್ಪಬಹುದಾದ ಅಥವಾ ತಿರುಚಬಹುದಾದ ಅಗ್ಗದ ಸೆನ್ಸರ್‌ಗಳ ಜಾಲ ಅಲ್ಲ. ನೆಲದ ಎತ್ತರವು Copernicus 90 m ಡಿಜಿಟಲ್ ಭೂಪ್ರದೇಶ ಮಾದರಿಯಿಂದ ಬರುತ್ತದೆ. PIN ಕೋಡ್‌ಗಳನ್ನು ಅಧಿಕೃತ India Post ಪಟ್ಟಿಯ ಮೂಲಕ ಗುರುತಿಸಲಾಗುತ್ತದೆ. ಒಂದೇ ಅಗ್ಗದ ಸ್ಟೇಷನ್ ಬೇರೆ ಸಂಖ್ಯೆ ತೋರಿಸಿದರೆ, ಮಾದರಿಯನ್ನೇ ಹೆಚ್ಚು ಸ್ಥಿರವಾದ ಆಧಾರ ಎಂದು ನಂಬಿ, ಇನ್ನೊಂದು ದಿನ ಮತ್ತೊಮ್ಮೆ ಪರಿಶೀಲಿಸಿ.","foot":"AirFloor India | ಸ್ವತಂತ್ರ ಪರಿಸರ ಹಾಗೂ ಕಟ್ಟಡದ ಸೂಕ್ಷ್ಮ ಹವಾಮಾನ ಸಾಧನ | ವೈದ್ಯಕೀಯ ಸಲಹೆ ಅಲ್ಲ. ಲೈವ್ ಗಾಳಿಯ ಗುಣಮಟ್ಟ: Open-Meteo Air Quality API (Copernicus CAMS). ನೆಲದ ಎತ್ತರ: Open-Meteo Elevation API (Copernicus DEM GLO-90). ಸ್ಥಳ ಮತ್ತು PIN ಹುಡುಕಾಟ: Open-Meteo Geocoding ಮತ್ತು India Post PIN ಪಟ್ಟಿ. ಮಹಡಿ ಸ್ಕೋರ್ ಎಂಬುದು ನಿರ್ಧಾರಗಳಿಗೆ ನೆರವಾಗುವ ಪಾರದರ್ಶಕ, ಭೌತಶಾಸ್ತ್ರ ಆಧಾರಿತ ಮಾರ್ಗದರ್ಶಿ, ಸ್ಥಳದಲ್ಲೇ ಮಾಡಿದ ಅಳತೆ ಅಲ್ಲ.","src_air":"ಗಾಳಿಯ ಗುಣಮಟ್ಟ","src_elev":"ನೆಲದ ಎತ್ತರ","src_geo":"ಸ್ಥಳ ಹುಡುಕಾಟ","src_pin":"PIN ಪಟ್ಟಿ","verified":"ಲೈವ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ","fetched":"ಪಡೆಯಲಾಗಿದೆ","attribution":"ಸ್ಥಳ ಮಾಹಿತಿ OpenStreetMap ನಿಂದ","st_searching":"ಹುಡುಕುತ್ತಿದೆ…","st_none":"ಏನೂ ಸಿಗಲಿಲ್ಲ. ಹತ್ತಿರದ ದೊಡ್ಡ ಸ್ಥಳ ಅಥವಾ PIN ಕೋಡ್ ಹುಡುಕಿ ನೋಡಿ.","st_loading":"ಲೈವ್ ಮಾಹಿತಿ ಬರುತ್ತಿದೆ…","st_err":"ಮಾಹಿತಿ ಸೇವೆ ಸಿಗಲಿಲ್ಲ. ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.","sec_recent":"ಇತ್ತೀಚಿನವು","sec_results":"ಫಲಿತಾಂಶಗಳು","clear_recent":"ಅಳಿಸಿ","use_location":"ನನ್ನ ಈಗಿನ ಸ್ಥಳ ಬಳಸಿ","loc_unavailable":"ಸ್ಥಳದ ಮಾಹಿತಿ ಸಿಗುತ್ತಿಲ್ಲ","no_match":"ಏನೂ ಸಿಗಲಿಲ್ಲ","no_match_hint":"ಹತ್ತಿರದ ಪ್ರದೇಶ, ಹೆಗ್ಗುರುತು ಅಥವಾ PIN ಕೋಡ್ ಹುಡುಕಿ ನೋಡಿ","not_india":"ದಯವಿಟ್ಟು ಭಾರತದ ಒಳಗಿನ ಸ್ಥಳ ಆರಿಸಿ","loc_detect":"ನಿಮ್ಮ ಸ್ಥಳ ಹುಡುಕುತ್ತಿದೆ","loc_start":"ಶುರು ಮಾಡಲು ಭಾರತದ ಯಾವುದೇ ಸ್ಥಳ ಹುಡುಕಿ","loc_denied":"ಸ್ಥಳ ಸಿಗುತ್ತಿಲ್ಲ. ಭಾರತದಲ್ಲಿ ಒಂದು ಸ್ಥಳ ಹುಡುಕಿ.","kbd_move":"ಚಲಿಸಲು","kbd_select":"ಆರಿಸಲು","kbd_close":"ಮುಚ್ಚಲು","aria_clear":"ಹುಡುಕಾಟ ಅಳಿಸಿ","aria_caret":"ಪ್ರದೇಶಗಳನ್ನು ನೋಡಿ","aria_use_location":"ನನ್ನ ಈಗಿನ ಸ್ಥಳ ಬಳಸಿ","meta_pin":"PIN","export_pdf":"PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ","pdf_preparing":"ತಯಾರಾಗುತ್ತಿದೆ…","fnd_good":"ಉತ್ತಮ ಆಯ್ಕೆ","fnd_watch":"ಗಮನಿಸಿ","fnd_avoid":"ದುರ್ಬಲ ಸ್ಥಳ","oss_line":"ಉಚಿತ ಮತ್ತು ಓಪನ್ ಸೋರ್ಸ್. ಭಾರತದಲ್ಲಿ ತಯಾರಾಗಿದೆ, ಭಾರತಕ್ಕಾಗಿ.","oss_license":"MIT ಪರವಾನಗಿ","met_h":"ಈಗಿನ ಪರಿಸ್ಥಿತಿ","met_p":"ಗಾಳಿ ಬೆರೆಯುವ ಪದರ ಸುಮಾರು {pbl} m, ಎತ್ತರದಲ್ಲಿ ಗಾಳಿ ಸುಮಾರು {wind} km/h. {stab}","met_stable":"ಪದರ ತೆಳ್ಳಗೆ, ಸ್ಥಿರವಾಗಿದೆ, ಹಾಗಾಗಿ ಇಂದು ಮೇಲಿನ ಮಹಡಿಗಳಿಗೇ ಹೆಚ್ಚು ಲಾಭ.","met_mixed":"ಪದರ ಆಳವಾಗಿ, ಚೆನ್ನಾಗಿ ಬೆರೆತಿದೆ, ಹಾಗಾಗಿ ಇಂದು ಮಹಡಿಗಳ ನಡುವಿನ ವ್ಯತ್ಯಾಸ ಕಡಿಮೆ.","met_neutral":"ಇಂದು ಬಹುತೇಕ ಸಾಮಾನ್ಯ ಸ್ಥಿತಿ.","robust_h":"ಇದು ಎಷ್ಟು ವಿಶ್ವಾಸಾರ್ಹ","robust_p":"ನಾವು ಮಾದರಿ ಮಾಡಿದ ಸನ್ನಿವೇಶಗಳಲ್ಲಿ ಸುಮಾರು {pct}% ಬಾರಿ, {lo} ರಿಂದ {hi} ಮಹಡಿಗಳು ನೆಲ ಮಹಡಿಯನ್ನು ಮೀರುತ್ತವೆ. ವಕ್ರರೇಖೆಯ ಮೇಲಿನ ನೆರಳಿನ ಭಾಗ ಪ್ರತಿ ಮಹಡಿಯ ಸ್ಕೋರಿನ 80% ವ್ಯಾಪ್ತಿ.","privacy_link":"ಗೌಪ್ಯತೆ","adv_h":"ನಿಮ್ಮ ಮನೆಯವರಿಗೆ ಸಲಹೆ","adv_lead":"ಯಾರಿಗಾಗಿ ಸಲಹೆ ಬೇಕೆಂದು ಆರಿಸಿ; ಇಂದಿನ ಗಾಳಿ ಮತ್ತು ಈ ಕಟ್ಟಡಕ್ಕೆ ತಕ್ಕಂತೆ ಮಾರ್ಗದರ್ಶನ ಸಿಗುತ್ತದೆ.","p_kids":"ಚಿಕ್ಕ ಮಕ್ಕಳು","p_elder":"ಹಿರಿಯರು","p_asthma":"ಅಸ್ತಮಾ ಅಥವಾ COPD","p_run":"ಓಟಗಾರರು","adv_disc":"ಇದು ಸಾಮಾನ್ಯ ಮಾಹಿತಿ ಮಾತ್ರ, ವೈದ್ಯಕೀಯ ಸಲಹೆ ಅಲ್ಲ.","fl_below":"ನಿಮ್ಮ {f}ನೇ ಮಹಡಿ ಶುದ್ಧ ಗಾಳಿಯ ವಲಯಕ್ಕಿಂತ ಕೆಳಗಿದೆ. ರಾತ್ರಿ ಹೊತ್ತು ರಸ್ತೆಯ ಕೆಟ್ಟ ಗಾಳಿ ಇಲ್ಲಿಗೆ ಹೆಚ್ಚು ತಲುಪುವುದರಿಂದ, ಏರ್ ಪ್ಯೂರಿಫೈಯರ್ ಬಳಕೆ ಮತ್ತು ಮುಂಜಾನೆ ಕಿಟಕಿ ಮುಚ್ಚಿಡುವುದು ಬಹಳ ಮುಖ್ಯ.","fl_in":"ನಿಮ್ಮ {f}ನೇ ಮಹಡಿ {lo}ರಿಂದ {hi}ನೇ ಮಹಡಿಯವರೆಗಿನ ಆರೋಗ್ಯಕರ ವಲಯದೊಳಗಿದೆ. ಇದು ಕಟ್ಟಡದ ಅತ್ಯುತ್ತಮ ಜಾಗ. ದಿನದ ಗಾಳಿ ಚೆನ್ನಾಗಿದ್ದಾಗ ಧಾರಾಳವಾಗಿ ಕಿಟಕಿ ತೆರೆಯಿರಿ.","fl_above":"ನಿಮ್ಮ {f}ನೇ ಮಹಡಿ ಅತ್ಯುತ್ತಮ ವಲಯಕ್ಕಿಂತ ಮೇಲಿದೆ. ಇಲ್ಲಿ ಹೊಗೆಗಿಂತ ಗಾಳಿಯ ರಭಸವೇ ಸಮಸ್ಯೆ. ಕಿಟಕಿ ಮುಚ್ಚಿಡುವ ದಿನಗಳಲ್ಲಿ ಮನೆಯೊಳಗಿನ ಗಾಳಿ ಬದಲಾಗಲು ಬೇರೆ ವ್ಯವಸ್ಥೆ ಮಾಡಿಕೊಳ್ಳಿ.","cp_h":"ವರ್ಷವಿಡೀ {city}"}
};
var LANG='en';
function T(k){ var d=DICT[LANG]; return (d&&d[k]!=null)?d[k]:DICT.en[k]; }

/* ============================ model ============================ */
var PER_FLOOR=3.32;
var STATE={ groundElev:799, floors:69, buildingH:69*PER_FLOOR, pf:1.0, aq:null, met:null, lat:null, lon:null, pin:null };
/* physics knobs, refreshed from live meteorology in recompute(). Defaults = climatological fallback.
   L   = near-ground mixing scale (m), from the live boundary-layer depth
   S   = stability multiplier on the ground penalty, from the near-surface temperature lapse
   windPen = extra ventilation penalty at the very top, from live wind at height
   invH = the mixing/inversion height to draw on the elevation panel */
var MODEL={ L:55, S:1.0, windPen:0, invH:150 };

function comp(h,H,pf){
  var gPM=1-Math.exp(-h/MODEL.L);
  var PM=100 - (40*pf*MODEL.S)*(1-gPM); if(PM<25)PM=25; if(PM>100)PM=100;
  var plume=45 + 55*(1-Math.exp(-h/22)); if(plume>100)plume=100;
  var vent=15 + 80*Math.exp(-Math.pow((h-55)/95,2)) - MODEL.windPen*Math.pow(h/Math.max(H,1),2)*100;
  if(vent<5)vent=5; if(vent>100)vent=100;
  var o2=99 - (h/Math.max(H,1))*3;
  var live=60 + 30*(1-Math.exp(-h/40)) - (h/Math.max(H,1))*20;
  var index=0.35*PM + 0.20*plume + 0.20*vent + 0.05*o2 + 0.20*live;
  return {PM:PM,plume:plume,vent:vent,o2:o2,live:live,index:index};
}
/* map live meteorology (STATE.met) into the physics knobs; falls back to climatology when absent */
function setModelFromMet(){
  var m=STATE.met;
  if(!m){ MODEL.L=55; MODEL.S=1.0; MODEL.windPen=0; MODEL.invH=150; return; }
  var pbl=(isFinite(m.pbl)&&m.pbl>0)?m.pbl:275;
  MODEL.invH=Math.max(60,Math.min(900,pbl));
  MODEL.L=Math.max(30,Math.min(220,pbl*0.4));
  /* near-surface lapse in degrees C per km (negative = normal, positive = inversion) */
  var lapse=isFinite(m.lapse)?m.lapse:-6.5;
  MODEL.S=Math.max(0.8,Math.min(1.35, 1.0 + (lapse+6.5)*0.04));
  var w=(isFinite(m.wind180)?m.wind180:(isFinite(m.wind120)?m.wind120:15));
  MODEL.windPen=Math.max(0,Math.min(0.28,(w-20)/120));
}
function floorH(f){ return (f-0.5)*PER_FLOOR; }
/* shared band-average helper (same logic the on-page Table/Tier views use) */
function tierMean(lo,hi){
  lo=Math.max(1,lo); hi=Math.min(STATE.floors,hi);
  var acc={PM:0,plume:0,vent:0,o2:0,live:0,index:0}, n=0, k;
  for(var f=lo; f<=hi; f++){ var c=comp(floorH(f),STATE.buildingH,STATE.pf); for(k in acc)acc[k]+=c[k]; n++; }
  for(k in acc) acc[k]/=Math.max(1,n);
  return acc;
}
var floors=[], series=[], peakF=1, peakV=0, bandLo=1, bandHi=1;
var scoreBand=[], robust=null;
var chartHover=null, chartSel=null, chartGeom=null;
function recompute(){
  STATE.buildingH = STATE.floors*PER_FLOOR;
  chartSel=null; chartHover=null;
  setModelFromMet();
  floors=[]; series=[];
  for(var f=1; f<=STATE.floors; f++){ floors.push(f); series.push(comp(floorH(f),STATE.buildingH,STATE.pf)); }
  peakF=1; peakV=-1;
  for(var i=0;i<series.length;i++){ if(series[i].index>peakV){peakV=series[i].index;peakF=floors[i];} }
  bandLo=peakF; bandHi=peakF;
  for(var j=0;j<series.length;j++){ if(series[j].index>=peakV-2){ bandLo=Math.min(bandLo,floors[j]); bandHi=Math.max(bandHi,floors[j]); } }
  computeUncertainty();
}
/* ---- P2: index-only sampler + Monte-Carlo confidence bands ---- */
function sampleIndex(h,H,pf,L,S,wp){
  var gPM=1-Math.exp(-h/L);
  var PM=100-(40*pf*S)*(1-gPM); if(PM<25)PM=25; if(PM>100)PM=100;
  var plume=45+55*(1-Math.exp(-h/22)); if(plume>100)plume=100;
  var vent=15+80*Math.exp(-Math.pow((h-55)/95,2)) - wp*Math.pow(h/Math.max(H,1),2)*100; if(vent<5)vent=5; if(vent>100)vent=100;
  var o2=99-(h/Math.max(H,1))*3;
  var live=60+30*(1-Math.exp(-h/40))-(h/Math.max(H,1))*20;
  return 0.35*PM+0.20*plume+0.20*vent+0.05*o2+0.20*live;
}
function randn(){ var u=1-Math.random(), v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
function computeUncertainty(){
  var N=STATE.floors, H=STATE.buildingH, pf=STATE.pf, K=48;
  if(!N || !series.length){ scoreBand=[]; robust=null; return; }
  var cols=[]; for(var f=0; f<N; f++) cols.push([]);
  var beat=0, gLo=1, gHi=Math.min(3,N);
  for(var s=0;s<K;s++){
    var L=Math.max(20,Math.min(260, MODEL.L*(1+0.35*randn())));
    var Sv=Math.max(0.7,Math.min(1.5, MODEL.S*(1+0.10*randn())));
    var wp=Math.max(0,Math.min(0.4, MODEL.windPen + 0.05*Math.abs(randn())));
    var pfx=Math.max(0.6,Math.min(1.8, pf*(1+0.18*randn())));
    var micro=2.5*randn();
    var gSum=0,gN=0,bSum=0,bN=0;
    for(var fi=1; fi<=N; fi++){
      var v=sampleIndex(floorH(fi),H,pfx,L,Sv,wp)+micro+1.4*randn();
      if(v<0)v=0; if(v>100)v=100;
      cols[fi-1].push(v);
      if(fi>=gLo&&fi<=gHi){ gSum+=v; gN++; }
      if(fi>=bandLo&&fi<=bandHi){ bSum+=v; bN++; }
    }
    if(gN&&bN && (bSum/bN)-(gSum/gN) >= 2) beat++;
  }
  /* keep the SPREAD of scenarios but centre it on the deterministic curve
     (the sampler's clamps are asymmetric, so raw percentiles can sit wholly
     below the drawn line and read as a rendering bug) */
  scoreBand=cols.map(function(a,i){
    a.sort(function(x,y){return x-y;});
    var p10=a[Math.floor(0.1*a.length)], p50=a[Math.floor(0.5*a.length)], p90=a[Math.min(a.length-1,Math.floor(0.9*a.length))];
    var det=series[i].index;
    return { lo:Math.max(0,det+(p10-p50)), hi:Math.min(100,det+(p90-p50)) };
  });
  robust={ pct:Math.round(100*beat/K), lo:bandLo, hi:bandHi };
}
/* ---- P1/P2 readouts ---- */
function stabWord(){
  if(!STATE.met) return T('met_neutral');
  if(MODEL.invH<=260 && MODEL.S>=1.05) return T('met_stable');
  if(MODEL.invH>=520 && MODEL.S<=0.96) return T('met_mixed');
  return T('met_neutral');
}
function renderMet(){
  var box=el('metNote'); if(!box) return;
  if(!STATE.met || STATE.lat==null){ box.hidden=true; return; }
  box.hidden=false;
  var lb=box.querySelector('.lbl'), p=box.querySelector('p');
  if(lb) lb.textContent=T('met_h');
  var w=STATE.met.wind180; if(!isFinite(w)) w=STATE.met.wind120; if(!isFinite(w)) w=0;
  if(p) p.textContent=T('met_p').replace('{pbl}',Math.round(MODEL.invH)).replace('{wind}',Math.round(w)).replace('{stab}',stabWord());
}
function renderRobust(){
  var box=el('robustNote'); if(!box) return;
  if(!robust || STATE.floors==null){ box.hidden=true; return; }
  box.hidden=false;
  var lb=box.querySelector('.lbl'), p=box.querySelector('p');
  if(lb) lb.textContent=T('robust_h');
  if(p) p.textContent=T('robust_p').replace('{pct}',robust.pct).replace('{lo}',robust.lo).replace('{hi}',robust.hi);
}
/* ---- household advice engine (authored at build time, static at runtime) ---- */
var ADVICE={
 en:{
  "good.kids":"Genuinely clean air today. Let the kids play outside and air the house out on any floor. Floors {lo} to {hi} hold the freshest air into the evening.",
  "good.elder":"A good day for older lungs. Morning walks are fine, windows can stay open, and floors {lo} to {hi} keep the gentlest, steadiest air through the day.",
  "good.asthma":"Air this clean is rare, enjoy it. Ventilate every room now; if you use a preventer inhaler, today changes nothing. Floors {lo} to {hi} stay cleanest overnight.",
  "good.run":"Green light. Run outdoors at any hour today; the air is clean from street level to the roof. Tomorrow may differ, so check again before a dawn run.",
  "mod.kids":"Fine for most kids, but keep outdoor play to mornings and evenings when traffic dust settles. Bedrooms on floors {lo} to {hi} breathe easiest tonight.",
  "mod.elder":"Acceptable air, with care. Keep walks short and away from main roads, ventilate at midday, and prefer resting on floors {lo} to {hi} where the air stays steadier.",
  "mod.asthma":"Sensitive airways may notice today. Keep the reliever inhaler nearby, ventilate briefly at midday rather than all day, and sleep in the {lo} to {hi} band if you can.",
  "mod.run":"Runnable, not perfect. Go early morning, keep hard intervals short, and route away from arterial roads. At home, floors {lo} to {hi} give you the cleanest recovery.",
  "unh.kids":"Keep children indoors as much as you can today, windows shut on the lower floors. A purifier in the bedroom matters more than the view; floors {lo} to {hi} take the least smoke.",
  "unh.elder":"A hard day for older lungs. Skip the morning walk, keep windows closed through the night, run a purifier where they sleep, ideally on floors {lo} to {hi}.",
  "unh.asthma":"High risk of flare-ups. Stay indoors with windows shut, run the purifier, and keep the reliever within reach. Floors {lo} to {hi} sit above the worst of the trapped air.",
  "unh.run":"Move the workout indoors. Outdoor running at AQI {aqi} costs more than it gives. If you must go, go at midday, briefly, far from traffic, never at dawn.",
  "sev.kids":"Treat today like bad weather: children stay in, windows stay shut, the purifier runs all day. Ground floors take the heaviest air; floors {lo} to {hi} are the safest rooms in the building.",
  "sev.elder":"Serious air today. No outdoor time for elders, sealed windows, purifier on, and watch for breathlessness. The {lo} to {hi} band stays meaningfully lighter than the street.",
  "sev.asthma":"Flare-up weather. Do not ventilate today, run purifiers continuously, keep medication ready, and call a doctor early if symptoms build. Height helps: {lo} to {hi} escapes the worst.",
  "sev.run":"No outdoor exercise at AQI {aqi}, full stop. Even indoors, skip hard sessions if the air smells of smoke. Wait for the air to turn; it usually breaks within a few days."
 },
 te:{"good.kids":"ఈరోజు గాలి నిజంగా బాగుంది. పిల్లల్ని హాయిగా బయట ఆడనివ్వండి, ఏ అంతస్తులోనైనా కిటికీలు తెరిచి ఇంటికి గాలి ఆడనివ్వండి. {lo} నుంచి {hi} అంతస్తుల్లో సాయంత్రం దాకా గాలి తాజాగా ఉంటుంది.","good.elder":"పెద్దవాళ్ల ఊపిరితిత్తులకు ఇది మంచి రోజు. ఉదయం నడకకు వెళ్లవచ్చు, కిటికీలు తెరిచే ఉంచవచ్చు. {lo} నుంచి {hi} అంతస్తుల్లో రోజంతా గాలి హాయిగా, స్థిరంగా ఉంటుంది.","good.asthma":"ఇంత శుభ్రమైన గాలి అరుదు, హాయిగా ఆస్వాదించండి. ఇప్పుడే అన్ని గదులకు గాలి ఆడనివ్వండి; ప్రివెంటర్ ఇన్‌హేలర్ వాడుతుంటే మామూలుగానే కొనసాగించండి. రాత్రంతా {lo} నుంచి {hi} అంతస్తుల్లో గాలి శుభ్రంగా ఉంటుంది.","good.run":"ఈరోజు గ్రీన్ సిగ్నలే. ఏ సమయంలోనైనా బయట పరుగెత్తవచ్చు, కింద రోడ్డు నుంచి పైన డాబా దాకా గాలి శుభ్రంగా ఉంది. రేపు పరిస్థితి మారవచ్చు, తెల్లవారుజామున వెళ్లేముందు మళ్లీ ఒకసారి చూసుకోండి.","mod.kids":"చాలా మంది పిల్లలకు ఫర్వాలేదు, కానీ ట్రాఫిక్ దుమ్ము తగ్గే ఉదయం, సాయంత్రం వేళల్లోనే బయట ఆడనివ్వండి. ఈ రాత్రి {lo} నుంచి {hi} అంతస్తుల్లోని పడకగదుల్లో గాలి హాయిగా ఉంటుంది.","mod.elder":"గాలి ఫర్వాలేదు కానీ కాస్త జాగ్రత్త అవసరం. నడక కొద్దిసేపే, అదీ పెద్ద రోడ్లకు దూరంగా; మధ్యాహ్నం కాసేపు కిటికీలు తెరవండి. విశ్రాంతికి {lo} నుంచి {hi} అంతస్తులు మంచివి, అక్కడ గాలి స్థిరంగా ఉంటుంది.","mod.asthma":"శ్వాస సమస్యలు ఉన్నవారికి ఈరోజు కొంచెం ఇబ్బందిగా అనిపించవచ్చు. రిలీవర్ ఇన్‌హేలర్ దగ్గరే ఉంచుకోండి, రోజంతా కాకుండా మధ్యాహ్నం కాసేపే కిటికీలు తెరవండి, వీలైతే {lo} నుంచి {hi} అంతస్తుల్లో పడుకోండి.","mod.run":"పరుగుకు ఫర్వాలేదు కానీ గాలి మరీ గొప్పగా లేదు. తెల్లవారుజామునే వెళ్లండి, గట్టి ఇంటర్వల్స్ తక్కువసేపే చేయండి, పెద్ద రోడ్లు తప్పించి దారి ఎంచుకోండి. ఇంట్లో విశ్రాంతికి {lo} నుంచి {hi} అంతస్తుల్లో గాలి అన్నిటికంటే శుభ్రంగా ఉంటుంది.","unh.kids":"ఈరోజు పిల్లల్ని వీలైనంత వరకు ఇంట్లోనే ఉంచండి, కింది అంతస్తుల్లో కిటికీలు మూసే ఉంచండి. కిటికీలోంచి కనిపించే వ్యూ కంటే పడకగదిలో ప్యూరిఫయర్ ముఖ్యం; {lo} నుంచి {hi} అంతస్తులకు పొగ తక్కువగా చేరుతుంది.","unh.elder":"పెద్దవాళ్ల ఊపిరితిత్తులకు ఇది కష్టమైన రోజు. ఉదయం నడక మానేయండి, రాత్రంతా కిటికీలు మూసే ఉంచండి, వాళ్లు పడుకునే గదిలో ప్యూరిఫయర్ నడపండి; వీలైతే ఆ గది {lo} నుంచి {hi} అంతస్తుల్లో ఉండేలా చూడండి.","unh.asthma":"ఆస్తమా తిరగబెట్టే ప్రమాదం ఎక్కువగా ఉంది. కిటికీలు మూసి ఇంట్లోనే ఉండండి, ప్యూరిఫయర్ నడపండి, రిలీవర్ ఇన్‌హేలర్ చేతికందేలా ఉంచుకోండి. చెడు గాలి ఎక్కువగా కిందే నిలిచిపోతుంది; {lo} నుంచి {hi} అంతస్తులు దానికి పైన ఉంటాయి.","unh.run":"ఈరోజు వర్కవుట్ ఇంట్లోనే చేయండి. AQI {aqi} ఉన్నప్పుడు బయట పరుగెత్తితే లాభం కంటే నష్టమే ఎక్కువ. తప్పనిసరైతే మధ్యాహ్నం, కొద్దిసేపే, ట్రాఫిక్‌కు దూరంగా వెళ్లండి; తెల్లవారుజామున అస్సలు వద్దు.","sev.kids":"ఈరోజును పెద్ద తుఫాను రోజులాగే చూడండి: పిల్లలు ఇంట్లోనే ఉండాలి, కిటికీలు మూసే ఉండాలి, ప్యూరిఫయర్ రోజంతా నడుస్తూనే ఉండాలి. చెడు గాలి కింది అంతస్తులకే ఎక్కువగా చేరుతుంది; భవనంలో {lo} నుంచి {hi} అంతస్తులే సురక్షితమైన చోటు.","sev.elder":"ఈరోజు గాలి చాలా ప్రమాదకరంగా ఉంది. పెద్దవాళ్లు అస్సలు బయటకు వెళ్లొద్దు; కిటికీలు గట్టిగా మూసి, ప్యూరిఫయర్ ఆన్ చేసి, ఆయాసం వస్తుందేమో గమనిస్తూ ఉండండి. రోడ్డుతో పోలిస్తే {lo} నుంచి {hi} అంతస్తుల్లో గాలి చాలా మెరుగ్గా ఉంటుంది.","sev.asthma":"ఆస్తమా తిరగబెట్టే వాతావరణం ఇది. ఈరోజు అస్సలు కిటికీలు తెరవొద్దు, ప్యూరిఫయర్లు ఆపకుండా నడపండి, మందులు సిద్ధంగా ఉంచుకోండి; లక్షణాలు పెరుగుతుంటే ఆలస్యం చేయకుండా డాక్టర్‌కు ఫోన్ చేయండి. ఎత్తు కొంత కాపాడుతుంది: {lo} నుంచి {hi} అంతస్తులకు చెడు గాలి అంతగా చేరదు.","sev.run":"AQI {aqi} ఉన్నప్పుడు బయట వ్యాయామం అస్సలు వద్దు, ఇందులో రెండో మాటే లేదు. ఇంట్లో కూడా పొగ వాసన వస్తుంటే గట్టి వర్కవుట్లు మానేయండి. గాలి మారే వరకు ఆగండి; మామూలుగా కొద్ది రోజుల్లోనే తగ్గిపోతుంది.","fl_below":"మీ {f}వ అంతస్తు శుభ్రమైన గాలి పరిధికి దిగువన ఉంది. ముఖ్యంగా రాత్రి వేళల్లో వీధి కాలుష్యం ఇక్కడే ఎక్కువగా చేరుతుంది. ప్యూరిఫైయర్ వాడటం, తెల్లవారుజామున కిటికీలు మూసి ఉంచటం ఇక్కడ చాలా ముఖ్యం.","fl_in":"మీ {f}వ అంతస్తు భవనంలో అత్యంత ఆరోగ్యకరమైన పరిధిలో, అంటే {lo} నుంచి {hi} అంతస్తుల మధ్య ఉంది. ఇది భవనంలోని ఉత్తమ స్థానం. గాలి బాగున్నప్పుడల్లా కిటికీలు తెరిచి గాలి ఆడనివ్వండి.","fl_above":"మీ {f}వ అంతస్తు అనుకూల పరిధి కంటే పైన ఉంది. ఈ ఎత్తులో పొగ కంటే బలమైన గాలులే అసలు సమస్య. కిటికీలు మూసి ఉంచాల్సిన రోజుల్లో ఇంట్లో గాలి మారేలా ఏర్పాటు చేసుకోండి.","cp_h":"ఏడాది పొడవునా {city}"},
 kn:{"good.kids":"ಇಂದು ಗಾಳಿ ನಿಜಕ್ಕೂ ಶುದ್ಧವಾಗಿದೆ. ಮಕ್ಕಳನ್ನು ಹೊರಗೆ ಆಡಲು ಬಿಡಿ, ಯಾವ ಮಹಡಿಯಲ್ಲಿದ್ದರೂ ಕಿಟಕಿ ತೆರೆದು ಮನೆಗೆ ಗಾಳಿ ಆಡಿಸಿ. ಸಂಜೆಯವರೆಗೂ ಅತ್ಯಂತ ತಾಜಾ ಗಾಳಿ ಇರುವುದು {lo} ರಿಂದ {hi} ಮಹಡಿಗಳಲ್ಲಿ.","good.elder":"ಹಿರಿಯರ ಶ್ವಾಸಕೋಶಕ್ಕೆ ಒಳ್ಳೆಯ ದಿನ. ಬೆಳಗಿನ ವಾಕಿಂಗ್ ಧಾರಾಳವಾಗಿ ಮಾಡಬಹುದು, ಕಿಟಕಿಗಳು ತೆರೆದಿರಲಿ. ದಿನವಿಡೀ ಹಿತವಾದ, ಏರುಪೇರಿಲ್ಲದ ಗಾಳಿ ಇರುವುದು {lo} ರಿಂದ {hi} ಮಹಡಿಗಳಲ್ಲಿ.","good.asthma":"ಇಷ್ಟು ಶುದ್ಧ ಗಾಳಿ ಸಿಗುವುದು ಅಪರೂಪ, ಸದುಪಯೋಗ ಮಾಡಿಕೊಳ್ಳಿ. ಈಗಲೇ ಎಲ್ಲಾ ಕೋಣೆಗಳಿಗೆ ಗಾಳಿ ಆಡಿಸಿ; ನಿತ್ಯದ ಇನ್ಹೇಲರ್ ಬಳಸುತ್ತಿದ್ದರೆ ಇಂದು ಏನೂ ಬದಲಾಯಿಸಬೇಕಿಲ್ಲ. ರಾತ್ರಿಯಿಡೀ {lo} ರಿಂದ {hi} ಮಹಡಿಗಳ ಗಾಳಿ ಅತ್ಯಂತ ಶುದ್ಧವಾಗಿರುತ್ತದೆ.","good.run":"ಇಂದು ನಿಶ್ಚಿಂತೆಯಿಂದ ಓಡಬಹುದು. ಯಾವ ಹೊತ್ತಿನಲ್ಲಾದರೂ ಹೊರಗೆ ಓಡಿ; ರಸ್ತೆಯಿಂದ ತಾರಸಿಯವರೆಗೂ ಗಾಳಿ ಶುದ್ಧವಾಗಿದೆ. ನಾಳೆ ಹೀಗೇ ಇರುತ್ತದೆ ಎಂದೇನಿಲ್ಲ; ಬೆಳಗಿನ ಜಾವ ಓಡುವ ಮೊದಲು ಮತ್ತೊಮ್ಮೆ ನೋಡಿ.","mod.kids":"ಹೆಚ್ಚಿನ ಮಕ್ಕಳಿಗೆ ಪರವಾಗಿಲ್ಲ, ಆದರೆ ವಾಹನಗಳ ಧೂಳು ಕಡಿಮೆ ಇರುವ ಬೆಳಿಗ್ಗೆ ಮತ್ತು ಸಂಜೆ ಹೊತ್ತಿನಲ್ಲಿ ಮಾತ್ರ ಹೊರಗಿನ ಆಟ ಇರಲಿ. ಇಂದು ರಾತ್ರಿ ಮಲಗಲು {lo} ರಿಂದ {hi} ಮಹಡಿಗಳ ಕೋಣೆಗಳೇ ಉತ್ತಮ.","mod.elder":"ಗಾಳಿ ಪರವಾಗಿಲ್ಲ, ಆದರೆ ಎಚ್ಚರವಿರಲಿ. ವಾಕಿಂಗ್ ಚಿಕ್ಕದಾಗಿರಲಿ, ಮುಖ್ಯ ರಸ್ತೆಗಳಿಂದ ದೂರವಿರಲಿ, ಕಿಟಕಿ ಮಧ್ಯಾಹ್ನ ಮಾತ್ರ ತೆರೆಯಿರಿ. ವಿಶ್ರಾಂತಿಗೆ ಗಾಳಿ ಸ್ಥಿರವಾಗಿರುವ {lo} ರಿಂದ {hi} ಮಹಡಿಗಳೇ ಒಳ್ಳೆಯದು.","mod.asthma":"ಶ್ವಾಸನಾಳ ಸೂಕ್ಷ್ಮವಾಗಿರುವವರಿಗೆ ಇಂದು ಸ್ವಲ್ಪ ತೊಂದರೆ ಅನಿಸಬಹುದು. ಇನ್ಹೇಲರ್ ಹತ್ತಿರವೇ ಇರಲಿ; ದಿನವಿಡೀ ಕಿಟಕಿ ತೆರೆದಿಡುವ ಬದಲು ಮಧ್ಯಾಹ್ನ ಸ್ವಲ್ಪ ಹೊತ್ತು ಮಾತ್ರ ತೆರೆಯಿರಿ. ಸಾಧ್ಯವಾದರೆ {lo} ರಿಂದ {hi} ಮಹಡಿಗಳಲ್ಲಿ ಮಲಗಿ.","mod.run":"ಓಡಬಹುದು, ಆದರೆ ಗಾಳಿ ಪೂರ್ತಿ ಚೆನ್ನಾಗಿಲ್ಲ. ಬೆಳಗಿನ ಜಾವವೇ ಹೊರಡಿ, ಕಠಿಣ ಇಂಟರ್ವಲ್‌ಗಳು ಚಿಕ್ಕವಾಗಿರಲಿ, ದೊಡ್ಡ ರಸ್ತೆಗಳಿಂದ ದೂರದ ದಾರಿ ಹಿಡಿಯಿರಿ. ಮನೆಯಲ್ಲಿ ವಿಶ್ರಾಂತಿಗೆ {lo} ರಿಂದ {hi} ಮಹಡಿಗಳ ಗಾಳಿಯೇ ಅತ್ಯಂತ ಶುದ್ಧ.","unh.kids":"ಇಂದು ಮಕ್ಕಳನ್ನು ಆದಷ್ಟು ಮನೆಯೊಳಗೇ ಇರಿಸಿ; ಕೆಳ ಮಹಡಿಗಳಲ್ಲಂತೂ ಕಿಟಕಿ ಮುಚ್ಚಿಯೇ ಇರಲಿ. ಕಿಟಕಿಯ ನೋಟಕ್ಕಿಂತ ಮಲಗುವ ಕೋಣೆಯ ಪ್ಯೂರಿಫೈಯರ್ ಮುಖ್ಯ; ಹೊಗೆ ಅತಿ ಕಡಿಮೆ ತಲುಪುವುದು {lo} ರಿಂದ {hi} ಮಹಡಿಗಳಿಗೆ.","unh.elder":"ಹಿರಿಯರ ಶ್ವಾಸಕೋಶಕ್ಕೆ ಇಂದು ಕಷ್ಟದ ದಿನ. ಬೆಳಗಿನ ವಾಕಿಂಗ್ ಬೇಡ, ರಾತ್ರಿಯಿಡೀ ಕಿಟಕಿ ಮುಚ್ಚಿರಲಿ, ಅವರು ಮಲಗುವ ಕೋಣೆಯಲ್ಲಿ ಪ್ಯೂರಿಫೈಯರ್ ಹಾಕಿ; ಆ ಕೋಣೆ {lo} ರಿಂದ {hi} ಮಹಡಿಗಳಲ್ಲಿದ್ದರೆ ಇನ್ನೂ ಒಳ್ಳೆಯದು.","unh.asthma":"ಇಂದು ಅಸ್ತಮಾ ಉಲ್ಬಣಗೊಳ್ಳುವ ಅಪಾಯ ಹೆಚ್ಚು. ಕಿಟಕಿ ಮುಚ್ಚಿ ಮನೆಯೊಳಗೇ ಇರಿ, ಪ್ಯೂರಿಫೈಯರ್ ಹಾಕಿ, ಇನ್ಹೇಲರ್ ಕೈಗೆಟುಕುವಂತಿರಲಿ. ಕೆಟ್ಟ ಗಾಳಿ ಕೆಳಗೇ ಸಿಕ್ಕಿಹಾಕಿಕೊಳ್ಳುತ್ತದೆ; {lo} ರಿಂದ {hi} ಮಹಡಿಗಳು ಅದರ ಮೇಲಿರುತ್ತವೆ.","unh.run":"ಇಂದಿನ ವ್ಯಾಯಾಮ ಮನೆಯೊಳಗೇ ಆಗಲಿ. AQI {aqi} ಇರುವಾಗ ಹೊರಗೆ ಓಡುವುದರಿಂದ ಲಾಭಕ್ಕಿಂತ ಹಾನಿಯೇ ಹೆಚ್ಚು. ಹೋಗಲೇಬೇಕಿದ್ದರೆ ಮಧ್ಯಾಹ್ನ, ಸ್ವಲ್ಪ ಹೊತ್ತು, ಟ್ರಾಫಿಕ್‌ನಿಂದ ದೂರ; ಬೆಳಗಿನ ಜಾವ ಮಾತ್ರ ಬೇಡವೇ ಬೇಡ.","sev.kids":"ಇಂದು ಬಿರುಗಾಳಿ ಮಳೆಯ ದಿನ ಎಂದೇ ಭಾವಿಸಿ: ಮಕ್ಕಳು ಒಳಗೇ ಇರಲಿ, ಕಿಟಕಿ ಮುಚ್ಚಿರಲಿ, ಪ್ಯೂರಿಫೈಯರ್ ದಿನವಿಡೀ ಚಾಲೂ ಇರಲಿ. ಕೆಳ ಮಹಡಿಗಳಲ್ಲಿ ಗಾಳಿ ತೀರಾ ಕೆಟ್ಟದಾಗಿರುತ್ತದೆ; ಕಟ್ಟಡದಲ್ಲೇ ಅತ್ಯಂತ ಸುರಕ್ಷಿತ ಕೋಣೆಗಳು {lo} ರಿಂದ {hi} ಮಹಡಿಗಳಲ್ಲಿವೆ.","sev.elder":"ಇಂದು ಗಾಳಿ ತೀರಾ ಕೆಟ್ಟದಾಗಿದೆ. ಹಿರಿಯರು ಹೊರಗೆ ಹೋಗುವುದೇ ಬೇಡ, ಕಿಟಕಿಗಳು ಭದ್ರವಾಗಿ ಮುಚ್ಚಿರಲಿ, ಪ್ಯೂರಿಫೈಯರ್ ಚಾಲೂ ಇರಲಿ, ಉಸಿರಾಟ ಕಷ್ಟವಾಗುತ್ತಿದೆಯೇ ಎಂದು ಗಮನಿಸುತ್ತಿರಿ. ರಸ್ತೆಗೆ ಹೋಲಿಸಿದರೆ {lo} ರಿಂದ {hi} ಮಹಡಿಗಳ ಗಾಳಿ ಸಾಕಷ್ಟು ಉತ್ತಮವಾಗಿರುತ್ತದೆ.","sev.asthma":"ಅಸ್ತಮಾ ಉಲ್ಬಣವಾಗುವಂಥ ದಿನ ಇದು. ಇಂದು ಕಿಟಕಿ ತೆರೆಯಲೇಬೇಡಿ, ಪ್ಯೂರಿಫೈಯರ್ ನಿರಂತರ ಚಾಲೂ ಇರಲಿ, ಔಷಧಿ ಕೈಯಲ್ಲಿರಲಿ; ಲಕ್ಷಣಗಳು ಹೆಚ್ಚಾಗುತ್ತಿದ್ದರೆ ತಡ ಮಾಡದೆ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ. ಎತ್ತರವೇ ಇಲ್ಲಿ ರಕ್ಷಣೆ: {lo} ರಿಂದ {hi} ಮಹಡಿಗಳಿಗೆ ಅತಿ ಕೆಟ್ಟ ಗಾಳಿ ತಲುಪುವುದಿಲ್ಲ.","sev.run":"AQI {aqi} ಇರುವಾಗ ಹೊರಗಿನ ವ್ಯಾಯಾಮದ ಮಾತೇ ಬೇಡ. ಮನೆಯೊಳಗೂ ಹೊಗೆ ವಾಸನೆ ಬರುತ್ತಿದ್ದರೆ ಕಠಿಣ ವ್ಯಾಯಾಮ ಬೇಡ. ಗಾಳಿ ಸುಧಾರಿಸುವವರೆಗೆ ಕಾಯಿರಿ; ಸಾಮಾನ್ಯವಾಗಿ ಕೆಲವೇ ದಿನಗಳಲ್ಲಿ ಸರಿಹೋಗುತ್ತದೆ.","fl_below":"ನಿಮ್ಮ {f}ನೇ ಮಹಡಿ ಶುದ್ಧ ಗಾಳಿಯ ವಲಯಕ್ಕಿಂತ ಕೆಳಗಿದೆ. ರಾತ್ರಿ ಹೊತ್ತು ರಸ್ತೆಯ ಕೆಟ್ಟ ಗಾಳಿ ಇಲ್ಲಿಗೆ ಹೆಚ್ಚು ತಲುಪುವುದರಿಂದ, ಏರ್ ಪ್ಯೂರಿಫೈಯರ್ ಬಳಕೆ ಮತ್ತು ಮುಂಜಾನೆ ಕಿಟಕಿ ಮುಚ್ಚಿಡುವುದು ಬಹಳ ಮುಖ್ಯ.","fl_in":"ನಿಮ್ಮ {f}ನೇ ಮಹಡಿ {lo}ರಿಂದ {hi}ನೇ ಮಹಡಿಯವರೆಗಿನ ಆರೋಗ್ಯಕರ ವಲಯದೊಳಗಿದೆ. ಇದು ಕಟ್ಟಡದ ಅತ್ಯುತ್ತಮ ಜಾಗ. ದಿನದ ಗಾಳಿ ಚೆನ್ನಾಗಿದ್ದಾಗ ಧಾರಾಳವಾಗಿ ಕಿಟಕಿ ತೆರೆಯಿರಿ.","fl_above":"ನಿಮ್ಮ {f}ನೇ ಮಹಡಿ ಅತ್ಯುತ್ತಮ ವಲಯಕ್ಕಿಂತ ಮೇಲಿದೆ. ಇಲ್ಲಿ ಹೊಗೆಗಿಂತ ಗಾಳಿಯ ರಭಸವೇ ಸಮಸ್ಯೆ. ಕಿಟಕಿ ಮುಚ್ಚಿಡುವ ದಿನಗಳಲ್ಲಿ ಮನೆಯೊಳಗಿನ ಗಾಳಿ ಬದಲಾಗಲು ಬೇರೆ ವ್ಯವಸ್ಥೆ ಮಾಡಿಕೊಳ್ಳಿ.","cp_h":"ವರ್ಷವಿಡೀ {city}"}
};
var advPersona='kids';
function adviceBand(){
  var a=STATE.aq && STATE.aq.us_aqi!=null ? STATE.aq.us_aqi : null;
  if(a==null) return null;
  if(a<=50) return 'good'; if(a<=100) return 'mod'; if(a<=200) return 'unh'; return 'sev';
}
function renderAdvice(){
  var body=el('adviceBody'); if(!body) return;
  var box=el('adviceBox'), b=adviceBand();
  if(!b || STATE.floors==null){ if(box) box.hidden=true; return; }
  if(box) box.hidden=false;
  var key=b+'.'+advPersona;
  var t=(ADVICE[LANG]&&ADVICE[LANG][key])||ADVICE.en[key]||'';
  t=t.replace(/\{lo\}/g,bandLo).replace(/\{hi\}/g,bandHi).replace(/\{aqi\}/g,Math.round(STATE.aq.us_aqi));
  body.textContent=t;
  var lb=el('adviceLbl'); if(lb){ var pk={kids:'p_kids',elder:'p_elder',asthma:'p_asthma',run:'p_run'}[advPersona]; lb.textContent=T(pk)+' | '+T(catFor(STATE.aq.us_aqi).k); }
  /* floor-situation line: reacts to the floor tapped on the score chart */
  var fp=el('adviceFloor');
  if(fp){
    if(chartSel==null){ fp.hidden=true; fp.textContent=''; }
    else{
      var sk = chartSel<bandLo ? 'fl_below' : (chartSel<=bandHi ? 'fl_in' : 'fl_above');
      fp.textContent=T(sk).replace(/\{f\}/g,chartSel).replace(/\{lo\}/g,bandLo).replace(/\{hi\}/g,bandHi);
      fp.hidden=false;
    }
  }
}
function initAdvice(){
  document.querySelectorAll('.pchip').forEach(function(ch){
    ch.addEventListener('click', function(){
      advPersona=ch.getAttribute('data-p')||'kids';
      document.querySelectorAll('.pchip').forEach(function(c){ var on=c===ch; c.classList.toggle('active',on); c.setAttribute('aria-pressed',on?'true':'false'); });
      renderAdvice();
    });
  });
}

/* ---- city air profiles (authored at build time, season picked by date) ---- */
var CITYP; /* undefined = not loaded, false = unavailable, object = loaded */
function loadCityProfiles(){
  if(CITYP!==undefined) return Promise.resolve(CITYP);
  return fetch('cityprofiles.json').then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(j){ CITYP=(j&&j.cities)?j:false; return CITYP; })
    .catch(function(){ CITYP=false; return false; });
}
function havKm(la1,lo1,la2,lo2){
  var R=6371, dLa=(la2-la1)*Math.PI/180, dLo=(lo2-lo1)*Math.PI/180;
  var a=Math.sin(dLa/2)*Math.sin(dLa/2)+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLo/2)*Math.sin(dLo/2);
  return 2*R*Math.asin(Math.sqrt(a));
}
function seasonKey(){
  var m=new Date().getMonth()+1;
  if(m===12||m<=2) return 'winter';
  if(m<=5) return 'summer';
  if(m<=9) return 'monsoon';
  return 'postmonsoon';
}
function renderCityNote(){
  var box=el('cityNote'); if(!box) return;
  if(STATE.lat==null){ box.hidden=true; return; }
  var lat=STATE.lat, lon=STATE.lon;
  loadCityProfiles().then(function(j){
    if(!j || STATE.lat!==lat || STATE.lon!==lon){ if(!j) box.hidden=true; return; }
    var best=null, bd=1e9;
    j.cities.forEach(function(c){ var d=havKm(lat,lon,c.lat,c.lon); if(d<bd){ bd=d; best=c; } });
    if(!best || bd>60){ box.hidden=true; return; }
    var L=(best.p[LANG]?LANG:'en'), P=best.p[L], nm=(best.name&&(best.name[L]||best.name.en))||'';
    if(!P){ box.hidden=true; return; }
    box.hidden=false;
    box.querySelector('.lbl').textContent=T('cp_h').replace('{city}',nm);
    box.querySelector('p').textContent=(P.general||'')+' '+(P[seasonKey()]||'');
  });
}
function pressureHpa(altM){ return 1013.25*Math.exp(-altM/8000); }
function pio2(altM){ var P=pressureHpa(altM); return (0.2095*(P*0.750062-47)); }
function scoreColor(v){ if(v>=84) return css('--good'); if(v>=76) return css('--warn'); return css('--crit'); }

/* ============================ dither background ============================ */
var BAYER=[
 [0,32,8,40,2,34,10,42],[48,16,56,24,50,18,58,26],[12,44,4,36,14,46,6,38],[60,28,52,20,62,30,54,22],
 [3,35,11,43,1,33,9,41],[51,19,59,27,49,17,57,25],[15,47,7,39,13,45,5,37],[63,31,55,23,61,29,53,21]];
function lerp(a,b,t){ return a+(b-a)*t; }
function renderDither(phase){
  var cv=el('ditherBg'); if(!cv) return;
  phase = phase||0;
  var scale=4;
  var W=Math.max(2,Math.ceil(window.innerWidth/scale)), H=Math.max(2,Math.ceil(window.innerHeight/scale));
  cv.width=W; cv.height=H; cv.style.imageRendering='pixelated';
  var ctx=cv.getContext('2d'); var img=ctx.createImageData(W,H); var d=img.data;
  var light=isLight();
  var bg = light? [245,244,251] : [9,7,15];
  var hi = light? [206,198,230] : [34,26,58];
  var driftX = Math.sin(phase)*0.035, driftY = Math.cos(phase*0.8)*0.02;
  for(var y=0;y<H;y++){
    for(var x=0;x<W;x++){
      var ty=y/H, tx=x/W;
      var radial=Math.max(0,1-(Math.hypot(tx-0.93+driftX,ty+0.04+driftY)/0.72));
      var vert=Math.max(0,1-ty*1.9);
      var v=Math.min(1, radial*0.72 + vert*0.12); v=v*v;
      var th=(BAYER[y&7][x&7]+0.5)/64;
      var on = v>th;
      var mix = on? 1 : Math.max(0, v*0.5);
      var c = on? hi : bg;
      var i=(y*W+x)*4;
      d[i]  =Math.round(lerp(bg[0],c[0],mix));
      d[i+1]=Math.round(lerp(bg[1],c[1],mix));
      d[i+2]=Math.round(lerp(bg[2],c[2],mix));
      d[i+3]=255;
    }
  }
  ctx.putImageData(img,0,0);
}
/* gentle low-fps drift so the dither texture feels alive without burning CPU */
var ditherPhase=0, ditherRAF=null, ditherLastT=0;
function stopDitherDrift(){ if(ditherRAF){ cancelAnimationFrame(ditherRAF); ditherRAF=null; } }
function startDitherDrift(){
  stopDitherDrift();
  if(reduce){ renderDither(0); return; }
  var fpsInterval=1000/10;
  ditherLastT=0;
  function step(ts){
    ditherRAF=requestAnimationFrame(step);
    if(ts-ditherLastT<fpsInterval) return;
    ditherLastT=ts;
    ditherPhase+=0.045;
    renderDither(ditherPhase);
  }
  ditherRAF=requestAnimationFrame(step);
}

/* ============================ canvas helpers ============================ */
function setupCanvas(cv,designW,designH,mobileDesignH){
  var dpr=Math.min(window.devicePixelRatio||1,2);
  var cssW=cv.clientWidth||cv.parentNode.clientWidth||700;
  var isSmall=cssW<520;
  var effH=(isSmall && mobileDesignH)?mobileDesignH:designH;   /* taller aspect on phones so data stays readable */
  var cssH=cssW*(effH/designW);
  cv.style.height=cssH+'px';
  cv.width=Math.round(cssW*dpr); cv.height=Math.round(cssH*dpr);
  var ctx=cv.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
  return {ctx:ctx,w:cssW,h:cssH,small:isSmall};
}
function ease(t){ return t<0.5?2*t*t:1-Math.pow(-2*t+2,2)/2; }
function F(size,weight){ return (weight||'600')+' '+size+'px "Open Sans",system-ui,sans-serif'; }
function hexA(c,a){ c=(c||'').trim(); if(c.charAt(0)==='#'){ var r,g,b; if(c.length===7){r=parseInt(c.substr(1,2),16);g=parseInt(c.substr(3,2),16);b=parseInt(c.substr(5,2),16);}else{r=parseInt(c.charAt(1)+c.charAt(1),16);g=parseInt(c.charAt(2)+c.charAt(2),16);b=parseInt(c.charAt(3)+c.charAt(3),16);} return 'rgba('+r+','+g+','+b+','+a+')'; } return c; }

/* ============================ elevation chart ============================ */
function drawElevation(p){
  var cv=el('elevCanvas'); if(!cv) return;
  var s=setupCanvas(cv,1600,900,1680), ctx=s.ctx, w=s.w, h=s.h, small=s.small;
  ctx.clearRect(0,0,w,h);
  var ink=css('--ink'), soft=css('--ink-soft'), faint=css('--ink-faint'), line=css('--hair'),
      sea=css('--sea'), haze=css('--haze'), good=css('--good'), violet=css('--violet');
  var G=STATE.groundElev, BH=STATE.buildingH, roof=G+BH;
  var pad=small?30:52, fs=small?11:11.5, fs2=small?12.5:13;
  ctx.textBaseline='alphabetic'; ctx.textAlign='left'; ctx.lineWidth=1;

  /* panel rects: stacked (2 rows) on phones, side-by-side (2 cols) on wider screens */
  var aX,aY,aW,aH, bX,bY,bW,bH, titleSp=small?16:16, botSp=small?30:52;
  if(small){
    var cwM=w-pad*2, availH=h-(small?30:40)-titleSp*2-botSp*2, panelH=availH/2;
    aX=pad; aW=cwM; aY=30; aH=panelH;
    bX=pad; bW=cwM; bY=aY+aH+botSp+titleSp; bH=panelH;
  } else {
    var gap=52, cw=(w-pad*2-gap)/2, top=40, bot=h-botSp;
    aX=pad; aW=cw; aY=top; aH=bot-top;
    bX=pad+cw+gap; bW=cw; bY=top; bH=bot-top;
  }
  var aBot=aY+aH, bBot=bY+bH;

  /* ---------- Panel A: above sea level ---------- */
  var maxA=Math.ceil((roof+120)/200)*200; if(maxA<200)maxA=200;
  function ay(m){ return aBot-(m/maxA)*aH; }
  ctx.strokeStyle=line; ctx.strokeRect(aX,aY,aW,aH);
  ctx.font=F(fs); var stepA=maxA/5;
  for(var m=0;m<=maxA;m+=stepA){ var y=ay(m); ctx.globalAlpha=.6;ctx.strokeStyle=line;ctx.beginPath();ctx.moveTo(aX,y);ctx.lineTo(aX+aW,y);ctx.stroke();ctx.globalAlpha=1; ctx.fillStyle=faint; ctx.textAlign='right'; ctx.fillText(Math.round(m)+'', aX-6, y+3); ctx.textAlign='left'; }
  var gr=Math.min(1,p/0.6);
  var grd=ctx.createLinearGradient(0,aBot,0,aY); grd.addColorStop(0,sea); grd.addColorStop(1,hexA(sea,.25));
  ctx.fillStyle=grd; ctx.fillRect(aX+1,ay(G*gr),aW-2,aBot-ay(G*gr));
  if(gr>=1){
    var yG=ay(G); ctx.setLineDash([5,4]); ctx.strokeStyle=soft; ctx.beginPath();ctx.moveTo(aX,yG);ctx.lineTo(aX+aW,yG);ctx.stroke(); ctx.setLineDash([]);
    var tp=Math.max(0,Math.min(1,(p-0.6)/0.4)), rTop=G+BH*tp;
    ctx.fillStyle=hexA(violet,.9); ctx.fillRect(aX+aW*0.30, ay(rTop), aW*0.40, ay(G)-ay(rTop));
    var yRl=ay(roof)-6, yGl=Math.max(yG-6, yRl+16);
    ctx.fillStyle=ink; ctx.font=F(fs,'700'); ctx.fillText(T('cv_ground')+' '+Math.round(G)+' m', aX+5, yGl);
    if(tp>=1){ ctx.fillText(T('cv_roof')+' '+Math.round(roof)+' m', aX+5, yRl);
      ctx.fillStyle=soft; ctx.font=F(small?9.5:fs);
      ctx.fillText(Math.round(pressureHpa(roof))+' hPa | O₂ '+pio2(roof).toFixed(0), aX+aW*0.55, yRl);
      ctx.fillText(Math.round(pressureHpa(G))+' hPa | O₂ '+pio2(G).toFixed(0), aX+aW*0.55, yGl);
    }
  }
  ctx.fillStyle=soft; ctx.font=F(fs2,'700'); ctx.fillText(T('cv_abs'), aX, aY-(small?9:16));
  if(p>=1){ ctx.fillStyle=good; ctx.font=F(fs); ctx.fillText(T('cv_delta')+' ≈ '+(pio2(G)-pio2(roof)).toFixed(1)+' mmHg', aX, aBot+(small?22:30)); }

  /* ---------- Panel B: above the street (live inversion height) ---------- */
  var invLine=Math.max(60,Math.min(MODEL.invH,340));
  var maxB=Math.max(240, Math.ceil((BH+30)/40)*40, Math.ceil((invLine+40)/40)*40);
  function by(m){ return bBot-(m/maxB)*bH; }
  ctx.strokeStyle=line; ctx.strokeRect(bX,bY,bW,bH);
  ctx.font=F(fs); var stepB=maxB/6;
  for(var mb=0;mb<=maxB;mb+=stepB){ var yb=by(mb); ctx.globalAlpha=.6;ctx.strokeStyle=line;ctx.beginPath();ctx.moveTo(bX,yb);ctx.lineTo(bX+bW,yb);ctx.stroke();ctx.globalAlpha=1; ctx.fillStyle=faint; ctx.textAlign='right'; ctx.fillText(Math.round(mb)+'', bX-6, yb+3); ctx.textAlign='left'; }
  var pv=Math.min(1,p/0.5);
  var pg=ctx.createLinearGradient(0,bBot,0,by(90)); pg.addColorStop(0,hexA(haze,.5*pv)); pg.addColorStop(1,hexA(haze,0));
  ctx.fillStyle=pg; ctx.fillRect(bX+1,by(90),bW-2,bBot-by(90));
  if(p>0.5){ var yi=by(invLine); ctx.setLineDash([7,5]); ctx.strokeStyle=haze; ctx.lineWidth=2; ctx.globalAlpha=Math.min(1,(p-0.5)/0.3);
    ctx.beginPath();ctx.moveTo(bX,yi);ctx.lineTo(bX+bW,yi);ctx.stroke(); ctx.setLineDash([]);ctx.globalAlpha=1;ctx.lineWidth=1;
    ctx.fillStyle=haze; ctx.font=F(fs); ctx.fillText(T('cv_inv').replace(/\d+/, Math.round(MODEL.invH)), bX+5, yi-5); }
  var tg=ease(Math.min(1,p)), towH=BH*tg, twx=bX+bW*0.42, tww=bW*0.16;
  ctx.fillStyle=isLight()?'rgba(255,255,255,.6)':'rgba(255,255,255,.08)'; ctx.strokeStyle=css('--glass-brd');
  ctx.fillRect(twx,by(towH),tww,bBot-by(towH)); ctx.strokeRect(twx,by(towH),tww,bBot-by(towH));
  if(p>0.8){ var hLo=floorH(Math.min(bandLo,STATE.floors)), hHi=floorH(Math.min(bandHi,STATE.floors));
    ctx.fillStyle=hexA(good,.22); ctx.fillRect(twx-4,by(hHi),tww+8,by(hLo)-by(hHi));
    ctx.strokeStyle=good;ctx.lineWidth=1.5;ctx.strokeRect(twx-4,by(hHi),tww+8,by(hLo)-by(hHi));ctx.lineWidth=1;
    ctx.fillStyle=good; ctx.font=F(fs,'700'); ctx.fillText(T('cv_best')+' '+bandLo+'-'+bandHi, twx+tww+12, by((hLo+hHi)/2)+3); }
  if(tg>=1){ [[floorH(2),haze],[floorH(Math.round((bandLo+bandHi)/2)),good],[floorH(STATE.floors),violet]].forEach(function(t){
    var y=by(Math.min(t[0],maxB)); ctx.fillStyle=t[1]; ctx.beginPath();ctx.arc(twx+tww/2,y,4.5,0,Math.PI*2);ctx.fill(); }); }
  if(p>=1){ ctx.strokeStyle=violet; ctx.lineWidth=1.5; ctx.lineCap='round';
    [maxB*0.12,maxB*0.34,maxB*0.55,maxB*0.78,maxB*0.96].forEach(function(mm){ var y=by(mm),len=7+(mm/maxB)*26,x0e=twx+tww+18,x1e=x0e+len;
      ctx.beginPath();ctx.moveTo(x0e,y);ctx.lineTo(x1e,y);ctx.moveTo(x1e-4,y-3);ctx.lineTo(x1e,y);ctx.lineTo(x1e-4,y+3);ctx.stroke(); });
    ctx.lineWidth=1; ctx.fillStyle=violet; ctx.font=F(fs); ctx.fillText(T('cv_wind'), twx+tww+18, by(maxB*0.99)); }
  ctx.fillStyle=soft; ctx.font=F(fs2,'700'); ctx.fillText(T('cv_rel'), bX, bY-(small?9:16));
}

/* ============================ index chart ============================ */
function drawIndex(p){
  var cv=el('indexCanvas'); if(!cv) return;
  var s=setupCanvas(cv,1600,820,1360), ctx=s.ctx, w=s.w, h=s.h, small=s.small;
  ctx.clearRect(0,0,w,h);
  var ink=css('--ink'), soft=css('--ink-soft'), faint=css('--ink-faint'), line=css('--hair'),
      crit=css('--crit'), haze=css('--haze'), violet=css('--violet'), good=css('--good');
  var N=STATE.floors;
  var padL=small?38:46, padR=small?18:26, padT=small?44:48, padB=small?38:44;
  var x0=padL,x1=w-padR,y0=padT,y1=h-padB;
  function X(f){ return x0+(f-1)/Math.max(1,(N-1))*(x1-x0); }
  function Y(v){ return y1-(v/100)*(y1-y0); }
  ctx.textBaseline='alphabetic'; ctx.textAlign='left';
  var fs=small?10:12; ctx.font=F(fs);
  for(var v=0;v<=100;v+=20){ var y=Y(v); ctx.strokeStyle=line;ctx.globalAlpha=.7;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.globalAlpha=1; ctx.fillStyle=faint;ctx.fillText(v,x0-(small?24:30),y+4); }
  var baseTicks=[1,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160];
  var ticks= small? [1,Math.round(N/2),N] : baseTicks.filter(function(t){return t<=N;}).concat(N).filter(function(t,i,a){return a.indexOf(t)===i;});
  ctx.fillStyle=faint;
  ticks.forEach(function(f){ var x=X(f); ctx.textAlign='center'; ctx.fillText(f,x,y1+20); ctx.textAlign='left'; });
  ctx.fillStyle=soft; ctx.font=F(fs,'700'); ctx.textAlign='center'; ctx.fillText(T('cv_floor'),(x0+x1)/2,y1+(small?34:38)); ctx.textAlign='left';
  ctx.save(); ctx.translate(x0-(small?30:36),(y0+y1)/2); ctx.rotate(-Math.PI/2); ctx.textAlign='center'; ctx.fillStyle=soft; ctx.fillText(T('cv_index'),0,0); ctx.restore(); ctx.textAlign='left';

  if(p>0.9){ ctx.fillStyle=hexA(good,.12); ctx.fillRect(X(bandLo),y0,X(bandHi)-X(bandLo),y1-y0);
    ctx.strokeStyle=hexA(good,.5); ctx.setLineDash([4,4]); ctx.beginPath();ctx.moveTo(X(bandLo),y0);ctx.lineTo(X(bandLo),y1);ctx.moveTo(X(bandHi),y0);ctx.lineTo(X(bandHi),y1);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=good; ctx.font=F(small?10:11.5,'700'); ctx.textAlign='center'; ctx.fillText(T('cv_best')+' '+bandLo+'-'+bandHi,(X(bandLo)+X(bandHi))/2,y0-6); ctx.textAlign='left'; }

  /* P2: shaded 80% confidence band (p10 to p90) around the overall score */
  if(p>=1 && scoreBand && scoreBand.length===N){
    ctx.fillStyle=hexA(ink,.10); ctx.beginPath();
    for(var bi=0;bi<N;bi++){ var pxh=X(floors[bi]), pyh=Y(Math.min(100,scoreBand[bi].hi)); if(bi===0)ctx.moveTo(pxh,pyh); else ctx.lineTo(pxh,pyh); }
    for(var bj=N-1;bj>=0;bj--){ ctx.lineTo(X(floors[bj]), Y(Math.max(0,scoreBand[bj].lo))); }
    ctx.closePath(); ctx.fill();
  }

  var upTo=1+Math.floor((N-1)*Math.min(1,p));
  function lineSeries(key,color,wid,alpha){ ctx.strokeStyle=color;ctx.lineWidth=wid;ctx.globalAlpha=alpha;ctx.lineJoin='round';ctx.beginPath();
    for(var k=0;k<upTo;k++){ var px=X(floors[k]),py=Y(series[k][key]); if(k===0)ctx.moveTo(px,py);else ctx.lineTo(px,py); } ctx.stroke();ctx.globalAlpha=1; }
  lineSeries('PM',crit,2,.6); lineSeries('plume',haze,2,.6); lineSeries('vent',violet,2.2,.85); lineSeries('live',good,2,.55); lineSeries('o2',faint,1.6,.55);
  ctx.strokeStyle=ink; ctx.lineWidth=small?2.8:3.6; ctx.lineJoin='round'; ctx.beginPath();
  for(var c=0;c<upTo;c++){ var pf=floors[c],pv2=series[c].index; if(c===0)ctx.moveTo(X(pf),Y(pv2));else ctx.lineTo(X(pf),Y(pv2)); } ctx.stroke();

  if(p>=1){
    var mx=X(peakF),my=Y(peakV);
    ctx.fillStyle=good; ctx.beginPath();ctx.arc(mx,my,5.5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=css('--bg-0'); ctx.lineWidth=2; ctx.stroke(); ctx.lineWidth=1;
    ctx.font=F(small?11:12.5,'800'); ctx.fillStyle=ink;
    var lbl=T('cv_peak')+' '+peakF+'  |  '+Math.round(peakV);
    var lw=ctx.measureText(lbl).width; var lx=Math.max(x0+lw/2, Math.min(x1-lw/2, mx));
    ctx.textAlign='center'; ctx.fillText(lbl, lx, my+22); ctx.textAlign='left';
    ctx.fillStyle=crit; ctx.beginPath();ctx.arc(X(1),Y(series[0].index),3.5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=violet; ctx.beginPath();ctx.arc(X(N),Y(series[N-1].index),3.5,0,Math.PI*2);ctx.fill();
    ctx.font=F(small?10:11.5,'700'); ctx.fillStyle=soft;
    ctx.textAlign='left'; ctx.fillText('1: '+Math.round(series[0].index), X(1)+6, Y(series[0].index)+(small?14:16));
    ctx.textAlign='right'; ctx.fillText(N+': '+Math.round(series[N-1].index), X(N)-6, Y(series[N-1].index)-10); ctx.textAlign='left';
  }
  chartGeom={view:'curve', cv:cv, x0:x0, x1:x1, N:N};
  [[chartSel,true],[chartHover,false]].forEach(function(m){
    var f=m[0]; if(f==null||f<1||f>N||!series[f-1]) return;
    var mx=X(f), my=Y(series[f-1].index);
    ctx.strokeStyle=hexA(violet,.4); ctx.lineWidth=1.4; ctx.setLineDash([3,4]);
    ctx.beginPath(); ctx.moveTo(mx,y0); ctx.lineTo(mx,y1); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=violet; ctx.beginPath(); ctx.arc(mx,my,m[1]?6:5,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=css('--bg-0'); ctx.lineWidth=2; ctx.stroke(); ctx.lineWidth=1;
    if(m[1]){ ctx.font=F(small?10:11.5,'800'); ctx.fillStyle=violet; ctx.textAlign='center';
      var lb=T('cv_peak')+' '+f+'  |  '+Math.round(series[f-1].index);
      var lw=ctx.measureText(lb).width, lx=Math.max(x0+lw/2,Math.min(x1-lw/2,mx));
      ctx.fillText(lb, lx, Math.max(y0+14, my-14)); ctx.textAlign='left'; }
  });
}

/* ============================ index bar chart ============================ */
function drawBars(p){
  var cv=el('indexBars'); if(!cv) return;
  var N=STATE.floors; if(!N || !series.length){ var ctx0=cv.getContext('2d'); ctx0.clearRect(0,0,cv.width,cv.height); return; }
  var s=setupCanvas(cv,1600,760,1280), ctx=s.ctx, w=s.w, h=s.h, small=s.small;
  ctx.clearRect(0,0,w,h);
  var ink=css('--ink'), soft=css('--ink-soft'), faint=css('--ink-faint'), line=css('--hair'), good=css('--good'), violet=css('--violet');
  var padL=small?38:46, padR=small?14:20, padT=small?30:34, padB=small?38:44;
  var x0=padL,x1=w-padR,y0=padT,y1=h-padB;
  function Y(v){ return y1-(v/100)*(y1-y0); }
  ctx.textBaseline='alphabetic'; ctx.textAlign='left';
  var fs=small?10:12; ctx.font=F(fs);
  for(var v=0;v<=100;v+=20){ var gy=Y(v); ctx.strokeStyle=line;ctx.globalAlpha=.7;ctx.beginPath();ctx.moveTo(x0,gy);ctx.lineTo(x1,gy);ctx.stroke();ctx.globalAlpha=1; ctx.fillStyle=faint;ctx.fillText(v,x0-(small?24:30),gy+4); }

  var slot=(x1-x0)/N;
  function Xc(f){ return x0+(f-1)*slot; }
  var pr=Math.max(0,Math.min(1,p));
  if(pr>0.9 && bandHi>=bandLo){
    ctx.fillStyle=hexA(good,.12);
    ctx.fillRect(Xc(bandLo),y0,(bandHi-bandLo+1)*slot,y1-y0);
  }

  var gap = N>40 ? 0 : Math.min(6, slot*0.28);
  var bw = Math.max(1, slot-gap);
  for(var i=0;i<N;i++){
    var f=floors[i], val=series[i].index*pr;
    var bx=Xc(f)+gap/2, by=Y(val), bh=y1-by;
    var isPeak=(f===peakF);
    ctx.globalAlpha = isPeak?1:.82;
    ctx.fillStyle = isPeak? violet : scoreColor(series[i].index);
    ctx.fillRect(bx,by,bw,bh);
    ctx.globalAlpha=1;
  }
  if(pr>=1){
    var px=Xc(peakF)+bw/2, py=Y(peakV);
    ctx.fillStyle=ink; ctx.font=F(small?10:11.5,'800'); ctx.textAlign='center';
    ctx.fillText(T('cv_peak')+' '+peakF, px, Math.max(py-8, padT+10));
    ctx.textAlign='left';
  }

  ctx.fillStyle=faint; ctx.font=F(fs);
  var ticks = small? [1,Math.round(N/2)||1,N] : [1,Math.round(N*0.25),Math.round(N*0.5),Math.round(N*0.75),N].filter(function(t,ti,a){return t>=1 && a.indexOf(t)===ti;});
  ticks.forEach(function(f){ var x=Xc(f)+bw/2; ctx.textAlign='center'; ctx.fillText(f,x,y1+20); ctx.textAlign='left'; });
  ctx.fillStyle=soft; ctx.font=F(fs,'700'); ctx.textAlign='center'; ctx.fillText(T('cv_floor'),(x0+x1)/2,y1+(small?34:38)); ctx.textAlign='left';
  chartGeom={view:'bars', cv:cv, x0:x0, slot:slot, N:N};
  [[chartSel,true],[chartHover,false]].forEach(function(m){
    var f=m[0]; if(f==null||f<1||f>N||!series[f-1]) return;
    var cx=Xc(f)+slot/2, topY=Y(series[f-1].index);
    ctx.strokeStyle=hexA(violet,.45); ctx.lineWidth=1.4; ctx.setLineDash([3,4]);
    ctx.beginPath(); ctx.moveTo(cx,y0); ctx.lineTo(cx,y1); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle=violet; ctx.lineWidth=m[1]?2.5:1.6;
    ctx.strokeRect(Xc(f)+gap/2, topY, bw, y1-topY); ctx.lineWidth=1;
    if(m[1]){ ctx.font=F(small?10:11.5,'800'); ctx.fillStyle=violet; ctx.textAlign='center';
      ctx.fillText(T('cv_peak')+' '+f+'  |  '+Math.round(series[f-1].index), cx, Math.max(padT+10, topY-8)); ctx.textAlign='left'; }
  });
}

/* ============================ index score table ============================ */
function buildScoreTable(){
  var table=el('scoreTable'); if(!table) return;
  var thead=table.querySelector('thead tr'), tbody=table.querySelector('tbody');
  thead.textContent=''; tbody.textContent='';
  var heads=[['th_tier',null],['tbl_floor',null],['th_overall',null],['th_pm',null],['th_fumes',null],['th_vent',null],[null,'O₂'],['th_live',null]];
  heads.forEach(function(hd){ var th=document.createElement('th'); th.textContent = hd[0]?T(hd[0]):hd[1]; thead.appendChild(th); });
  if(STATE.floors==null) return;
  function meanRange(lo,hi){ lo=Math.max(1,lo);hi=Math.min(STATE.floors,hi); var acc={PM:0,plume:0,vent:0,o2:0,live:0,index:0},n=0,k;
    for(var f=lo;f<=hi;f++){ var c=comp(floorH(f),STATE.buildingH,STATE.pf); for(k in acc)acc[k]+=c[k]; n++; } for(k in acc)acc[k]/=Math.max(1,n); return acc; }
  var rows=[
    [T('tier_ground'), '1-5', meanRange(1,5)],
    [T('tier_mid'), '12-25', meanRange(12,25)],
    [T('lg_best'), bandLo+'-'+bandHi, meanRange(bandLo,bandHi)],
    [T('cv_best'), ''+peakF, comp(floorH(peakF),STATE.buildingH,STATE.pf)],
    [T('tier_top'), ''+STATE.floors, comp(floorH(STATE.floors),STATE.buildingH,STATE.pf)]
  ];
  rows.forEach(function(r){
    var d=r[2], tr=document.createElement('tr');
    var th=document.createElement('th'); th.textContent=r[0]; tr.appendChild(th);
    var tdF=document.createElement('td'); tdF.textContent=r[1]; tr.appendChild(tdF);
    /* key info first: Overall (number + bar) right after the label columns */
    var tdO=document.createElement('td');
    var wrap=document.createElement('div'); wrap.className='ov-cell';
    var sp=document.createElement('span'); sp.className='scoren'; sp.textContent=Math.round(d.index); wrap.appendChild(sp);
    var bar=document.createElement('div'); bar.className='bar';
    var ib=document.createElement('i'); ib.style.width=Math.max(0,Math.min(100,d.index)).toFixed(0)+'%'; ib.style.background=scoreColor(d.index); bar.appendChild(ib);
    wrap.appendChild(bar); tdO.appendChild(wrap); tr.appendChild(tdO);
    ['PM','plume','vent','o2','live'].forEach(function(key){ var td=document.createElement('td'); td.textContent=Math.round(d[key]); tr.appendChild(td); });
    tbody.appendChild(tr);
  });
}

/* ============================ score view tabs (Curve / Bars / Table) ============================ */
var VIEW_TABS=['curve','bars','table'];
var activeView='curve';
function drawActiveView(p){
  if(activeView==='curve') drawIndex(p==null?1:p);
  else if(activeView==='bars') drawBars(p==null?1:p);
  else buildScoreTable();
}
function refreshActiveView(){ drawActiveView(1); }
function animateActiveView(dur){
  if(activeView==='table') buildScoreTable();
  else animate(activeView==='bars'?drawBars:drawIndex, dur);
}
function setActiveView(view){
  if(VIEW_TABS.indexOf(view)<0) return;
  activeView=view;
  chartHover=null; hideChartTip();
  VIEW_TABS.forEach(function(v){
    var tabBtn=el('tab-'+v), panel=el('panel-'+v);
    var on=(v===view);
    if(tabBtn){ tabBtn.setAttribute('aria-selected', on?'true':'false'); tabBtn.tabIndex = on?0:-1; }
    if(panel){ panel.hidden=!on; panel.setAttribute('aria-hidden', on?'false':'true'); }
  });
  drawActiveView(1);
}
function initTabs(){
  var tabs=VIEW_TABS.map(function(v){ return el('tab-'+v); });
  tabs.forEach(function(btn,i){
    if(!btn) return;
    btn.addEventListener('click', function(){ setActiveView(VIEW_TABS[i]); });
    btn.addEventListener('keydown', function(e){
      var ni=-1;
      if(e.key==='ArrowRight') ni=(i+1)%tabs.length;
      else if(e.key==='ArrowLeft') ni=(i-1+tabs.length)%tabs.length;
      else if(e.key==='Home') ni=0;
      else if(e.key==='End') ni=tabs.length-1;
      if(ni>=0){ e.preventDefault(); tabs[ni].focus(); setActiveView(VIEW_TABS[ni]); }
    });
  });
}

/* ---- chart actions: scrub to read a floor + tap to select it ---- */
function chartFloorFromEvent(e){
  if(!chartGeom || !chartGeom.cv) return null;
  var cv=chartGeom.cv, rect=cv.getBoundingClientRect();
  if(rect.width<=0) return null;
  var cssX=(e.clientX-rect.left)*((cv.clientWidth||rect.width)/rect.width);
  var f;
  if(chartGeom.view==='curve'){ f=Math.round(1+(cssX-chartGeom.x0)/Math.max(1,(chartGeom.x1-chartGeom.x0))*(chartGeom.N-1)); }
  else { f=1+Math.floor((cssX-chartGeom.x0)/Math.max(1,chartGeom.slot)); }
  if(!isFinite(f)) return null;
  return Math.max(1, Math.min(chartGeom.N, f));
}
function chartTipEl(){ var t=el('chartTip'); if(!t){ t=document.createElement('div'); t.id='chartTip'; t.setAttribute('role','status'); t.setAttribute('aria-live','polite'); document.body.appendChild(t); } return t; }
function bandStatus(f){ return (f>=bandLo && f<=bandHi) ? T('lg_best') : ''; }
function showChartTip(e,f){
  var t=chartTipEl();
  if(f==null||!series[f-1]){ t.classList.remove('show'); return; }
  t.textContent='';
  var a=document.createElement('div'); a.className='ct-f'; a.textContent=T('cv_peak')+' '+f; t.appendChild(a);
  var b=document.createElement('div'); b.className='ct-s'; b.textContent=Math.round(series[f-1].index)+' / 100'; t.appendChild(b);
  var st=bandStatus(f); if(st){ var c=document.createElement('div'); c.className='ct-b'; c.textContent=st; t.appendChild(c); }
  t.classList.add('show');
  var tw=t.offsetWidth, th=t.offsetHeight, vw=window.innerWidth;
  var lx=e.clientX+14; if(lx+tw>vw-8) lx=e.clientX-14-tw;
  var ty=e.clientY-12-th; if(ty<8) ty=e.clientY+20;
  t.style.left=Math.max(8,lx)+'px'; t.style.top=Math.max(8,ty)+'px';
}
function hideChartTip(){ var t=el('chartTip'); if(t) t.classList.remove('show'); }
function renderFloorReport(){
  renderAdvice();   /* keep the floor-situation advice line in sync with the chart selection */
  var r=el('floorReport'); if(!r) return;
  var f=chartSel;
  if(f==null||!series[f-1]){ r.hidden=true; r.textContent=''; return; }
  r.hidden=false; r.textContent='';
  var d=series[f-1];
  var head=document.createElement('div'); head.className='fr-head';
  var ft=document.createElement('span'); ft.className='fr-f'; ft.textContent=T('cv_peak')+' '+f; head.appendChild(ft);
  var ov=document.createElement('span'); ov.className='fr-o'; ov.textContent=Math.round(d.index)+' / 100'; head.appendChild(ov);
  var st=bandStatus(f); if(st){ var sc=document.createElement('span'); sc.className='fr-badge'; sc.textContent=st; head.appendChild(sc); }
  var clr=document.createElement('button'); clr.type='button'; clr.className='fr-clear'; clr.setAttribute('aria-label','Clear selected floor'); clr.textContent='×';
  clr.addEventListener('click', function(){ chartSel=null; renderFloorReport(); drawActiveView(1); });
  head.appendChild(clr); r.appendChild(head);
  var parts=[[T('th_pm'),d.PM],[T('th_fumes'),d.plume],[T('th_vent'),d.vent],[T('th_live'),d.live],['O₂',d.o2]];
  var grid=document.createElement('div'); grid.className='fr-parts';
  parts.forEach(function(pp){ var cell=document.createElement('div'); cell.className='fr-part';
    var k=document.createElement('span'); k.className='fr-k'; k.textContent=pp[0];
    var v=document.createElement('span'); v.className='fr-v'; v.textContent=Math.round(pp[1]);
    cell.appendChild(k); cell.appendChild(v); grid.appendChild(cell); });
  r.appendChild(grid);
}
var chartRaf=false, chartLastEv=null;
function chartHoverMove(e){
  chartLastEv=e; if(chartRaf) return; chartRaf=true;
  (window.requestAnimationFrame||function(cb){return setTimeout(cb,16);})(function(){
    chartRaf=false; var ev=chartLastEv; if(!ev) return;
    var f=chartFloorFromEvent(ev);
    if(f!==chartHover){ chartHover=f; drawActiveView(1); }
    showChartTip(ev,f);
  });
}
function chartLeave(){ if(chartHover!=null){ chartHover=null; drawActiveView(1); } hideChartTip(); }
function chartClick(e){ var f=chartFloorFromEvent(e); if(f==null) return; chartSel=(chartSel===f)?null:f; renderFloorReport(); drawActiveView(1); }
function initChartInteract(){
  ['indexCanvas','indexBars'].forEach(function(id){
    var cv=el(id); if(!cv || cv.__ci) return; cv.__ci=true;
    cv.style.touchAction='pan-y'; cv.style.cursor='crosshair';   /* keep vertical page scroll on touch */
    cv.addEventListener('pointermove', function(e){ if(e.pointerType!=='touch') chartHoverMove(e); });
    cv.addEventListener('click', chartClick);   /* tap/click to select; does not block scrolling */
    cv.addEventListener('pointerleave', chartLeave);
    cv.addEventListener('pointercancel', chartLeave);
  });
  if(!el('floorReport')){
    var panelTable=el('panel-table');
    var fr=document.createElement('div'); fr.id='floorReport'; fr.hidden=true; fr.setAttribute('role','status'); fr.setAttribute('aria-live','polite');
    if(panelTable && panelTable.parentNode){ panelTable.parentNode.insertBefore(fr, panelTable.nextSibling); }
  }
}

/* ============================ animation ============================ */
function animate(fn,dur){ if(reduce){fn(1);return;} var st=null; function step(ts){ if(st===null)st=ts; var pr=Math.min(1,(ts-st)/dur); fn(ease(pr)); if(pr<1)requestAnimationFrame(step);} requestAnimationFrame(step); }
function redrawCharts(){ drawElevation(1); refreshActiveView(); renderFloorReport(); renderMet(); renderRobust(); renderAdvice(); }

/* ============================ UI render ============================ */
function catFor(aqi){
  if(aqi<=50) return {k:'cat_good',c:'p-good'};
  if(aqi<=100) return {k:'cat_mod',c:'p-mod'};
  if(aqi<=150) return {k:'cat_usg',c:'p-bad'};
  if(aqi<=200) return {k:'cat_unh',c:'p-bad'};
  if(aqi<=300) return {k:'cat_vunh',c:'p-bad'};
  return {k:'cat_haz',c:'p-bad'};
}
function makeCard(nameKey, valTxt, unit, sub, pillKey, pillClass){
  var c=document.createElement('div'); c.className='dcard glass';
  var k=document.createElement('div'); k.className='k'; k.textContent=T(nameKey); c.appendChild(k);
  var v=document.createElement('div'); v.className='v'; v.textContent=valTxt;
  if(unit){ var sm=document.createElement('small'); sm.textContent=' '+unit; v.appendChild(sm);} c.appendChild(v);
  var su=document.createElement('div'); su.className='sub'; su.textContent=sub; c.appendChild(su);
  if(pillKey){ var pl=document.createElement('span'); pl.className='pill-i '+pillClass; pl.textContent=T(pillKey); c.appendChild(pl); }
  return c;
}
function renderAQ(){
  var g=el('aqGrid'); g.textContent=''; if(!STATE.aq) return;
  var a=STATE.aq, tm=a.time?(T('live_at')+' '+a.time.replace('T',' ')):'';
  var pm25=a.pm2_5, whoMult=pm25!=null?(pm25/5):null;
  var pmCatK=pm25==null?null:(pm25<=15?'cat_good':pm25<=35?'cat_mod':'cat_unh');
  var pmCatC=pm25==null?'':(pm25<=15?'p-good':pm25<=35?'p-mod':'p-bad');
  var aqiCat=catFor(a.us_aqi||0);
  var rows=[
    ['aq_pm25', pm25, 'µg/m³', [whoMult!=null?(whoMult.toFixed(1)+' '+T('whox')):'', tm].filter(Boolean).join(' | '), pmCatK, pmCatC],
    ['aq_aqi', a.us_aqi, 'AQI', tm, aqiCat.k, aqiCat.c],
    ['aq_pm10', a.pm10, 'µg/m³', tm, null, null],
    ['aq_no2', a.nitrogen_dioxide, 'µg/m³', tm, null, null],
    ['aq_o3', a.ozone, 'µg/m³', tm, null, null],
    ['aq_co', a.carbon_monoxide, 'µg/m³', tm, null, null]
  ];
  rows.forEach(function(cd){ var val=cd[1]==null?'-':(''+Math.round(cd[1]*10)/10); g.appendChild(makeCard(cd[0],val,cd[2],cd[3],cd[4],cd[5])); });
}
function renderSources(){
  var g=el('srcGrid'); g.textContent=''; if(!STATE.aq) return;
  var t=STATE.aq.time?STATE.aq.time.replace('T',' '):'';
  var rows=[
    ['src_air','Copernicus CAMS | Open-Meteo','https://open-meteo.com/en/docs/air-quality-api', t],
    ['src_elev','Copernicus DEM GLO-90 | Open-Meteo','https://open-meteo.com/en/docs/elevation-api', Math.round(STATE.groundElev)+' m'],
    ['src_geo','Open-Meteo Geocoding','https://open-meteo.com/en/docs/geocoding-api', STATE.lat!=null?(STATE.lat.toFixed(3)+', '+STATE.lon.toFixed(3)):''],
    ['src_pin','India Post PIN directory','https://api.postalpincode.in/', STATE.pin||'-']
  ];
  rows.forEach(function(r){
    var c=document.createElement('div'); c.className='src glass';
    var st=document.createElement('div'); st.className='st';
    var nm=document.createElement('span'); nm.textContent=T(r[0]); st.appendChild(nm);
    var vb=document.createElement('span'); vb.className='verified'; vb.textContent=T('verified'); st.appendChild(vb);
    c.appendChild(st);
    var sv=document.createElement('div'); sv.className='sv'; sv.textContent=r[1]+(r[3]?(' | '+T('fetched')+' '+r[3]):''); c.appendChild(sv);
    var link=document.createElement('a'); link.href=r[2]; link.target='_blank'; link.rel='noopener'; link.textContent=r[2].replace('https://',''); link.style.fontSize='11.5px'; c.appendChild(link);
    g.appendChild(c);
  });
}
function renderTier(){
  var tb=document.querySelector('#tierTable tbody'); tb.textContent='';
  function mean(lo,hi){ lo=Math.max(1,lo);hi=Math.min(STATE.floors,hi); var acc={PM:0,plume:0,vent:0,o2:0,live:0,index:0},n=0,k;
    for(var f=lo;f<=hi;f++){ var c=comp(floorH(f),STATE.buildingH,STATE.pf); for(k in acc)acc[k]+=c[k]; n++; } for(k in acc)acc[k]/=Math.max(1,n); return acc; }
  var tiers=[[T('tier_ground')+' | 1-5',mean(1,5)],[T('tier_mid')+' | 12-25',mean(12,25)],[T('tier_top')+' | '+STATE.floors,comp(floorH(STATE.floors),STATE.buildingH,STATE.pf)]];
  function col(v){ if(v>=84)return css('--good'); if(v>=76)return css('--warn'); return css('--crit'); }
  tiers.forEach(function(t){ var d=t[1],v=d.index,tr=document.createElement('tr');
    var th=document.createElement('th'); th.textContent=t[0]; tr.appendChild(th);
    /* key info first: Overall then Score bar, so mobile users see it without scrolling */
    var tdc=document.createElement('td'); var sp=document.createElement('span'); sp.className='scoren'; sp.textContent=Math.round(v); tdc.appendChild(sp); tr.appendChild(tdc);
    var tdb=document.createElement('td'); var bar=document.createElement('div'); bar.className='bar'; var ib=document.createElement('i'); ib.style.width=v.toFixed(0)+'%'; ib.style.background=col(v); bar.appendChild(ib); tdb.appendChild(bar); tr.appendChild(tdb);
    ['PM','plume','vent','o2','live'].forEach(function(key){ var td=document.createElement('td'); td.textContent=Math.round(d[key]); tr.appendChild(td); });
    tb.appendChild(tr); });
}
function renderPeak(){
  el('peakScore').textContent=Math.round(peakV);
  el('peakFloor').textContent=peakF;
  el('peakH').textContent=Math.round(floorH(peakF));
  el('peakBand').textContent=bandLo+'-'+bandHi;
}
function renderAll(){ renderAQ(); renderSources(); renderCityNote(); updateGates(); if(STATE.floors!=null){ recompute(); renderTier(); renderPeak(); redrawCharts(); } }

/* ============================ data fetch ============================ */
function setStatus(msg,err){ var s=el('status'); s.textContent=msg||''; s.className='status'+(err?' err':''); }
function jget(url){ return fetch(url).then(function(r){ if(!r.ok) throw new Error('http '+r.status); return r.json(); }); }
/* ---------------- hybrid combobox (Photon-backed) ---------------- */
var POPULAR=[
 {name:'Kengeri', admin2:'Bengaluru Urban', admin1:'Karnataka', lat:12.9122, lon:77.4827, kind:'area'},
 {name:'Indiranagar', admin2:'Bengaluru Urban', admin1:'Karnataka', lat:12.9719, lon:77.6412, kind:'area'},
 {name:'Whitefield', admin2:'Bengaluru Urban', admin1:'Karnataka', lat:12.9698, lon:77.7499, kind:'area'},
 {name:'Connaught Place', admin2:'New Delhi', admin1:'Delhi', lat:28.6292, lon:77.2192, kind:'area'},
 {name:'Andheri', admin2:'Mumbai Suburban', admin1:'Maharashtra', lat:19.1197, lon:72.8468, kind:'area'},
 {name:'Bandra', admin2:'Mumbai Suburban', admin1:'Maharashtra', lat:19.0596, lon:72.8295, kind:'area'},
 {name:'Gachibowli', admin2:'Hyderabad', admin1:'Telangana', lat:17.4401, lon:78.3489, kind:'area'},
 {name:'Anna Nagar', admin2:'Chennai', admin1:'Tamil Nadu', lat:13.0850, lon:80.2101, kind:'area'},
 {name:'Koregaon Park', admin2:'Pune', admin1:'Maharashtra', lat:18.5362, lon:73.8939, kind:'area'},
 {name:'Salt Lake City', admin2:'North 24 Parganas', admin1:'West Bengal', lat:22.5697, lon:88.4172, kind:'area'}
].map(function(p){ p.secondary=[p.admin2,p.admin1].filter(Boolean).join(', '); p.cc='IN'; p.indiaVerified=true; return p; });
var RECENT_KEY='airfloor.recent';
var cEl={}, OPTS=[], acActive=-1, acOpen=false, reqSeq=0, selectSeq=0, debTimer=null, suppressInput=false;

/* ---- tiny SVG icon builder (no innerHTML, DOM only) ---- */
var SVGNS='http://www.w3.org/2000/svg';
function svgTag(name,attrs){ var e=document.createElementNS(SVGNS,name); for(var k in attrs){ e.setAttribute(k,attrs[k]); } return e; }
function iconSvg(kind,cls){
  var s=svgTag('svg',{viewBox:'0 0 24 24', width:'16', height:'16', fill:'none', stroke:'currentColor', 'stroke-width':'2', 'stroke-linecap':'round', 'stroke-linejoin':'round'});
  s.setAttribute('aria-hidden','true'); s.setAttribute('focusable','false');
  if(cls) s.setAttribute('class',cls);
  function add(tag,attrs){ s.appendChild(svgTag(tag,attrs)); }
  switch(kind){
    case 'street':
      add('path',{d:'M5 20L9 4'}); add('path',{d:'M19 20L15 4'});
      add('line',{x1:'12',y1:'4',x2:'12',y2:'20','stroke-dasharray':'2 3'});
      break;
    case 'rail':
      add('rect',{x:'5',y:'4',width:'14',height:'12',rx:'3'});
      add('line',{x1:'5',y1:'10',x2:'19',y2:'10'});
      add('circle',{cx:'8.5',cy:'19',r:'1.3',fill:'currentColor',stroke:'none'});
      add('circle',{cx:'15.5',cy:'19',r:'1.3',fill:'currentColor',stroke:'none'});
      break;
    case 'postcode':
      add('rect',{x:'3',y:'6',width:'18',height:'13',rx:'2'});
      add('path',{d:'M3 8l9 6 9-6'});
      break;
    case 'recent':
      add('circle',{cx:'12',cy:'12',r:'8'});
      add('path',{d:'M12 8v4l3 2'});
      break;
    case 'current':
      add('circle',{cx:'12',cy:'12',r:'6'});
      add('line',{x1:'12',y1:'2',x2:'12',y2:'5'}); add('line',{x1:'12',y1:'19',x2:'12',y2:'22'});
      add('line',{x1:'2',y1:'12',x2:'5',y2:'12'}); add('line',{x1:'19',y1:'12',x2:'22',y2:'12'});
      add('circle',{cx:'12',cy:'12',r:'1.4',fill:'currentColor',stroke:'none'});
      break;
    case 'search':
      add('circle',{cx:'10',cy:'10',r:'6'});
      add('line',{x1:'15',y1:'15',x2:'20',y2:'20'});
      break;
    default: /* area, city, poi */
      add('path',{d:'M12 2c-3.87 0-7 3.13-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z'});
      add('circle',{cx:'12',cy:'9',r:'2.5'});
      break;
  }
  return s;
}
function spinnerSvg(){
  var s=svgTag('svg',{viewBox:'0 0 24 24', width:'15', height:'15'}); s.setAttribute('class','spin'); s.setAttribute('aria-hidden','true');
  s.appendChild(svgTag('circle',{cx:'12',cy:'12',r:'9', fill:'none', stroke:'currentColor', 'stroke-width':'2.4', 'stroke-linecap':'round', 'stroke-dasharray':'40 56'}));
  return s;
}

/* ---- Photon geocoding ---- */
function PHOTON_URL(q,biasLat,biasLon){
  var u='https://photon.komoot.io/api/?q='+encodeURIComponent(q)+'&limit=10&lang=en&bbox=68,6.5,97.45,37.2';
  if(biasLat!=null && biasLon!=null) u+='&lat='+biasLat+'&lon='+biasLon;
  return u;
}
function PHOTON_REVERSE_URL(lat,lon){ return 'https://photon.komoot.io/reverse?lon='+lon+'&lat='+lat+'&lang=en'; }
function inIndia(lat,lon){ return isFinite(lat)&&isFinite(lon)&&lat>=6.5&&lat<=37.2&&lon>=68.0&&lon<=97.45; }
function biasCoords(){ return (STATE.lat!=null && STATE.lon!=null && inIndia(STATE.lat,STATE.lon)) ? [STATE.lat,STATE.lon] : [22.0,79.0]; }
function floorsFromField(){ if(typeof window.__floors==='number' && window.__floors>=2 && window.__floors<=120) return window.__floors; var v=parseInt(((el('pFloors')&&el('pFloors').value)||'').trim(),10); return (isFinite(v)&&v>=2&&v<=120)?v:null; }
function updateGates(){
  var loc = STATE.lat!=null && STATE.lon!=null;
  var flr = STATE.floors!=null;
  document.body.classList.toggle('no-location', !loc);
  document.body.classList.toggle('no-floors', loc && !flr);
}
function kindFor(p){
  var key=p.osm_key, val=p.osm_value, type=p.type, name=p.name||'';
  if(key==='highway' || ['residential','tertiary','secondary','primary','living_street','road','pedestrian'].indexOf(val)>=0) return 'street';
  if(val==='station' || /railway|metro|station/i.test(name)) return 'rail';
  if(val==='postcode' || type==='postcode') return 'postcode';
  if(['suburb','neighbourhood','quarter','locality','hamlet'].indexOf(val)>=0 || type==='locality' || type==='district') return 'area';
  if(['city','town','village'].indexOf(val)>=0 || type==='city') return 'city';
  return 'poi';
}
function buildSecondary(p,name){
  var toks=[(p.street && p.street!==name)?p.street:null, p.locality, p.district, p.city, p.county, p.state];
  var seen={}, out=[];
  toks.forEach(function(t){ if(!t||t===name) return; var k=t.toLowerCase(); if(seen[k]) return; seen[k]=true; out.push(t); });
  return out.join(', ');
}
function normalizeFeature(f){
  var p=(f&&f.properties)||{}, g=(f&&f.geometry)||{}, c=g.coordinates||[null,null];
  var areaName = p.locality || p.district || p.city || p.county || null;
  var nameIsDigits = /^\d{5,6}$/.test(((p.name||'')+'').trim());
  var isPostcode = (p.osm_value==='postcode' || p.type==='postcode' || nameIsDigits);
  /* for a PIN-area result, Photon sets name to the digits, so lead with the real locality instead */
  var name = isPostcode ? (areaName || p.name || p.postcode || '') : (p.name || p.street || areaName || p.postcode || '');
  var pin = p.postcode || (nameIsDigits ? (p.name+'').trim() : null);
  return {
    name:name, secondary:buildSecondary(p,name),
    lat:c[1], lon:c[0], pin:pin, kind:kindFor(p),
    cc:(p.countrycode||null),
    admin1:p.state||null, admin2:p.county||p.city||null, admin3:p.district||null
  };
}
function dedupeNormalized(items){
  var seen={}, out=[];
  items.forEach(function(it){
    if(!it.name) return;
    var key=(it.name+'|'+(it.admin2||'')).toLowerCase();
    if(seen[key]) return; seen[key]=true; out.push(it);
  });
  return out.slice(0,8);
}
function photonSearch(q){
  var b=biasCoords();
  return jget(PHOTON_URL(q,b[0],b[1])).then(function(g){
    var feats=(g&&g.features)||[];
    feats=feats.filter(function(f){ return f.properties && f.properties.countrycode==='IN'; });
    var items=feats.map(normalizeFeature).filter(function(it){ return isFinite(it.lat) && isFinite(it.lon); });
    /* favour real places (areas, cities, streets, PINs) over incidental POIs, keeping Photon's order within each rank */
    var rank={city:0, area:0, postcode:1, street:2, rail:3, poi:4};
    items.forEach(function(it,i){ it._r=(rank[it.kind]==null?4:rank[it.kind])*1000+i; });
    items.sort(function(a,c){ return a._r-c._r; });
    return dedupeNormalized(items);
  });
}
function photonReverse(lat,lon){
  return jget(PHOTON_REVERSE_URL(lat,lon)).then(function(g){
    var feats=(g&&g.features)||[];
    if(!feats.length) return {name:'Current location', secondary:'', lat:lat, lon:lon, pin:null, kind:'poi', cc:null, admin1:null, admin2:null, admin3:null};
    var it=normalizeFeature(feats[0]);
    if(!it.name) it.name='Current location';
    if(!isFinite(it.lat)) it.lat=lat; if(!isFinite(it.lon)) it.lon=lon;
    return it;
  }).catch(function(){ return {name:'Current location', secondary:'', lat:lat, lon:lon, pin:null, kind:'poi', cc:null, admin1:null, admin2:null, admin3:null}; });
}
function zippoFallback(code){
  return jget('https://api.zippopotam.us/in/'+code).then(function(z){
    var p=(z&&z.places&&z.places.length)?z.places[0]:null; if(!p) return [];
    var lat=parseFloat(p.latitude), lon=parseFloat(p.longitude);
    if(!isFinite(lat)||!isFinite(lon)) return [];
    return [{ name:(p['place name']||('PIN '+code)).trim(), secondary:[p.state].filter(Boolean).join(', ')+' '+code,
      lat:lat, lon:lon, pin:code, kind:'postcode', cc:'IN', indiaVerified:true, admin1:p.state||null, admin2:null, admin3:null }];
  }).catch(function(){ return []; });
}
function pinFrom(q){
  var qs=q.replace(/\s+/g,'');
  if(/^\d{6}$/.test(qs)) return qs;
  var m=q.match(/(?:^|[^\d.])(\d{6})(?![\d.])/);
  return m?m[1]:null;
}

/* ---- recent storage ---- */
function loadRecent(){ try{ var raw=localStorage.getItem(RECENT_KEY); var arr=raw?JSON.parse(raw):[]; return Array.isArray(arr)?arr:[]; }catch(e){ return []; } }
function saveRecent(arr){ try{ localStorage.setItem(RECENT_KEY, JSON.stringify(arr.slice(0,4))); }catch(e){} }
function pushRecent(item){
  var arr=loadRecent(); var key=(item.name+'|'+(item.admin2||'')).toLowerCase();
  arr=arr.filter(function(r){ return (r.name+'|'+(r.admin2||'')).toLowerCase()!==key; });
  arr.unshift({name:item.name, secondary:item.secondary, lat:item.lat, lon:item.lon, pin:item.pin||null, kind:item.kind, admin1:item.admin1||null, admin2:item.admin2||null, admin3:item.admin3||null});
  saveRecent(arr);
}
function clearRecentStore(){ try{ localStorage.removeItem(RECENT_KEY); }catch(e){} }

/* ---- panel plumbing ---- */
function announce(msg){ var lr=el('acLive'); if(lr) lr.textContent=msg||''; }
function capList(){
  if(!cEl.list || !cEl.input) return;
  var base=Math.min(window.innerHeight*0.6,420);
  var vv=window.visualViewport; if(!vv){ cEl.list.style.maxHeight=base+'px'; return; }
  var r=cEl.input.getBoundingClientRect(); var avail=vv.height - r.bottom - 16;
  cEl.list.style.maxHeight=Math.max(150, Math.min(base, avail))+'px';
}
function openAc(){ acOpen=true; cEl.combo.classList.add('open'); if(cEl.step) cEl.step.classList.add('raised'); cEl.input.setAttribute('aria-expanded','true'); capList(); }
function setListLoading(loading){ if(!cEl.list) return; cEl.list.setAttribute('aria-busy', loading?'true':'false'); cEl.list.classList.toggle('loading', !!loading); }
function setFieldSpinner(loading){ if(!cEl.icPin||!cEl.icSpin) return; cEl.icPin.hidden=!!loading; cEl.icSpin.hidden=!loading; }
function clearAcList(){ cEl.list.textContent=''; OPTS=[]; acActive=-1; cEl.input.removeAttribute('aria-activedescendant'); }
function closeAc(){
  acOpen=false; cEl.combo.classList.remove('open'); if(cEl.step) cEl.step.classList.remove('raised'); cEl.input.setAttribute('aria-expanded','false');
  clearTimeout(debTimer); reqSeq++; clearAcList(); if(cEl.list) cEl.list.style.maxHeight='';
  setListLoading(false); setFieldSpinner(false);
}
function assignOptionIds(){ OPTS.forEach(function(o,i){ o.el.id='ac-opt-'+i; }); }
function optionEls(){ return OPTS.map(function(o){ return o.el; }); }
function setActive(i){
  var opts=optionEls(); if(!opts.length) return;
  if(i<0) i=0; if(i>=opts.length) i=opts.length-1;
  opts.forEach(function(o){ o.classList.remove('active'); o.setAttribute('aria-selected','false'); });
  acActive=i; var o=opts[i]; o.classList.add('active'); o.setAttribute('aria-selected','true');
  cEl.input.setAttribute('aria-activedescendant',o.id); o.scrollIntoView({block:'nearest'});
}
function appendHighlighted(node,text,query){
  node.textContent='';
  if(!query){ node.appendChild(document.createTextNode(text)); return; }
  var lower=text.toLowerCase(), q=query.toLowerCase(), idx=lower.indexOf(q);
  if(idx<0){ node.appendChild(document.createTextNode(text)); return; }
  if(idx>0) node.appendChild(document.createTextNode(text.slice(0,idx)));
  var mark=document.createElement('span'); mark.className='mtch'; mark.textContent=text.slice(idx,idx+query.length);
  node.appendChild(mark);
  if(idx+query.length<text.length) node.appendChild(document.createTextNode(text.slice(idx+query.length)));
}
function buildSectionHeader(text,withClear){
  var hd=document.createElement('li'); hd.className='ghdr'; hd.setAttribute('role','presentation');
  var span=document.createElement('span'); span.textContent=text; hd.appendChild(span);
  if(withClear){
    var btn=document.createElement('button'); btn.type='button'; btn.className='ghdr-clear'; btn.textContent=T('clear_recent');
    btn.addEventListener('mousedown', function(ev){ ev.preventDefault(); });
    btn.addEventListener('click', function(ev){ ev.stopPropagation(); clearRecentStore(); renderEmptyState(); cEl.input.focus(); });
    hd.appendChild(btn);
  }
  return hd;
}
function buildOptionRow(item,kind,query){
  var li=document.createElement('li'); li.className='opt'; li.setAttribute('role','option'); li.setAttribute('aria-selected','false');
  var icWrap=document.createElement('span'); icWrap.className='opt-ic'; icWrap.appendChild(iconSvg(kind||item.kind));
  li.appendChild(icWrap);
  var body=document.createElement('div'); body.className='opt-body';
  var nm=document.createElement('div'); nm.className='nm'; appendHighlighted(nm,item.name||'',query); body.appendChild(nm);
  if(item.secondary){ var sec=document.createElement('div'); sec.className='sec'; sec.textContent=item.secondary; body.appendChild(sec); }
  li.appendChild(body);
  var meta=document.createElement('div'); meta.className='meta'; if(item.pin){ meta.textContent=T('meta_pin')+' '+item.pin; }
  li.appendChild(meta);
  li.addEventListener('mousedown', function(ev){ ev.preventDefault(); });
  li.addEventListener('click', function(){ chooseItem(item); });
  li.addEventListener('mousemove', function(){ var i=optionEls().indexOf(li); if(i>=0 && acActive!==i) setActive(i); });
  return {el:li, data:item, action:null};
}
function buildActionRow(){
  var li=document.createElement('li'); li.className='opt act'; li.setAttribute('role','option'); li.setAttribute('aria-selected','false');
  li.setAttribute('aria-label', T('aria_use_location'));
  var icWrap=document.createElement('span'); icWrap.className='opt-ic'; icWrap.appendChild(iconSvg('current'));
  li.appendChild(icWrap);
  var body=document.createElement('div'); body.className='opt-body';
  var nm=document.createElement('div'); nm.className='nm'; nm.textContent=T('use_location'); body.appendChild(nm);
  var sec=document.createElement('div'); sec.className='sec'; body.appendChild(sec);
  li.appendChild(body);
  var meta=document.createElement('div'); meta.className='meta'; li.appendChild(meta);
  var row={el:li, data:null, action:'current-location', iconWrap:icWrap, secEl:sec};
  li.addEventListener('mousedown', function(ev){ ev.preventDefault(); });
  li.addEventListener('click', function(){ triggerCurrentLocation(row); });
  li.addEventListener('mousemove', function(){ var i=optionEls().indexOf(li); if(i>=0 && acActive!==i) setActive(i); });
  return row;
}
function triggerCurrentLocation(row){
  if(!navigator.geolocation){ row.secEl.textContent=T('loc_unavailable'); return; }
  if(row.busy) return; row.busy=true;
  var lockSeq=selectSeq;
  row.iconWrap.textContent=''; row.iconWrap.appendChild(spinnerSvg()); row.secEl.textContent='';
  function restore(){ row.iconWrap.textContent=''; row.iconWrap.appendChild(iconSvg('current')); row.busy=false; }
  navigator.geolocation.getCurrentPosition(function(pos){
    var lat=pos.coords.latitude, lon=pos.coords.longitude;
    if(!inIndia(lat,lon)){ restore(); row.secEl.textContent=T('not_india'); return; }
    photonReverse(lat,lon).then(function(item){
      restore();
      if(selectSeq!==lockSeq) return; /* a newer explicit selection was made while GPS was resolving */
      if(item.cc && item.cc!=='IN'){ row.secEl.textContent=T('not_india'); return; } /* known-foreign in-box: stop before UI */
      closeAc(); cEl.input.value=item.name; updateClearBtn();
      selectPlace(item);
    });
  }, function(){
    restore(); row.secEl.textContent=T('loc_unavailable');
  }, {timeout:10000, maximumAge:60000});
}
function appendFooter(){
  var f=document.createElement('li'); f.className='ac-foot'; f.setAttribute('role','presentation'); f.setAttribute('aria-hidden','true');
  var kb=document.createElement('div'); kb.className='kbdrow';
  function chip(t){ var k=document.createElement('kbd'); k.textContent=t; return k; }
  function txt(t){ var s=document.createElement('span'); s.textContent=t; return s; }
  kb.appendChild(chip('Up')); kb.appendChild(chip('Down')); kb.appendChild(txt(' '+T('kbd_move')+'  '));
  kb.appendChild(chip('Enter')); kb.appendChild(txt(' '+T('kbd_select')+'  '));
  kb.appendChild(chip('Esc')); kb.appendChild(txt(' '+T('kbd_close')));
  f.appendChild(kb);
  var attrib=document.createElement('div'); attrib.className='attrib'; attrib.textContent=T('attribution')+' (Photon)';
  f.appendChild(attrib);
  cEl.list.appendChild(f);
}
function renderEmptyState(){
  setListLoading(false); setFieldSpinner(false);
  cEl.list.textContent=''; OPTS=[]; acActive=-1; cEl.input.removeAttribute('aria-activedescendant');
  var action=buildActionRow(); cEl.list.appendChild(action.el); OPTS.push(action);
  var recent=loadRecent();
  if(recent.length){
    cEl.list.appendChild(buildSectionHeader(T('sec_recent'), true));
    recent.slice(0,4).forEach(function(r){ var row=buildOptionRow(r,'recent',null); cEl.list.appendChild(row.el); OPTS.push(row); });
  }
  cEl.list.appendChild(buildSectionHeader(T('popular'), false));
  POPULAR.forEach(function(p){ var row=buildOptionRow(p,p.kind,null); cEl.list.appendChild(row.el); OPTS.push(row); });
  appendFooter();
  assignOptionIds();
  announce(OPTS.length+' '+T('n_areas'));
  openAc();
}
function renderNoResults(q){
  setListLoading(false); setFieldSpinner(false);
  cEl.list.textContent=''; OPTS=[]; acActive=-1; cEl.input.removeAttribute('aria-activedescendant');
  var wrap=document.createElement('li'); wrap.className='empty'; wrap.setAttribute('role','presentation');
  wrap.appendChild(iconSvg('search','empty-ic'));
  var t1=document.createElement('div'); t1.className='empty-t'; t1.textContent=T('no_match')+' "'+q+'"'; wrap.appendChild(t1);
  var t2=document.createElement('div'); t2.className='empty-h'; t2.textContent=T('no_match_hint'); wrap.appendChild(t2);
  cEl.list.appendChild(wrap);
  appendFooter();
  announce(T('st_none'));
  openAc();
}
function renderErrorState(){
  setListLoading(false); setFieldSpinner(false);
  cEl.list.textContent=''; OPTS=[]; acActive=-1; cEl.input.removeAttribute('aria-activedescendant');
  var li=document.createElement('li'); li.className='msg err'; li.setAttribute('role','presentation'); li.textContent=T('st_err');
  cEl.list.appendChild(li);
  appendFooter();
  announce(T('st_err'));
  openAc();
}
function renderResultsList(items,q){
  setListLoading(false); setFieldSpinner(false);
  cEl.list.textContent=''; OPTS=[]; acActive=-1; cEl.input.removeAttribute('aria-activedescendant');
  cEl.list.appendChild(buildSectionHeader(T('sec_results'), false));
  items.forEach(function(it){ var row=buildOptionRow(it,it.kind,q); cEl.list.appendChild(row.el); OPTS.push(row); });
  appendFooter();
  assignOptionIds();
  announce(items.length+' '+T('n_areas'));
  openAc();
}
function renderSearchLoading(){ setListLoading(true); setFieldSpinner(true); announce(T('st_searching')); openAc(); }
function chooseItem(item){ suppressInput=true; cEl.input.value=item.name; suppressInput=false; updateClearBtn(); closeAc(); selectPlace(item); }
function commitOption(opt){ if(opt.action==='current-location'){ triggerCurrentLocation(opt); return; } chooseItem(opt.data); }
function updateClearBtn(){ if(cEl.clear) cEl.clear.hidden = cEl.input.value.length===0; }
function finishResults(items,q){ if(!items.length){ renderNoResults(q); return; } renderResultsList(items,q); }
function runQuery(q){
  var seq=++reqSeq;
  photonSearch(q).then(function(items){
    if(seq!==reqSeq) return;
    if(items.length){ finishResults(items,q); return; }
    var code=pinFrom(q);
    if(code){ zippoFallback(code).then(function(fb){ if(seq!==reqSeq) return; finishResults(fb,q); }); }
    else { finishResults(items,q); }
  }).catch(function(){
    if(seq!==reqSeq) return;
    var code=pinFrom(q); /* Photon down: still try the independent PIN source */
    if(code){ zippoFallback(code).then(function(fb){ if(seq!==reqSeq) return; if(fb&&fb.length) finishResults(fb,q); else renderErrorState(); }).catch(function(){ if(seq===reqSeq) renderErrorState(); }); }
    else renderErrorState();
  });
}
function refreshPanelForValue(){
  var q=cEl.input.value.trim();
  if(q.length<2){ renderEmptyState(); } else { renderSearchLoading(); runQuery(q); }
}
function initCombo(){
  cEl.combo=el('combo'); cEl.input=el('q'); cEl.list=el('acList'); cEl.caret=el('caret'); cEl.clear=el('clearBtn'); cEl.step=cEl.combo.closest('.step');
  cEl.icPin=document.querySelector('#fieldIcon .ic-pin'); cEl.icSpin=document.querySelector('#fieldIcon .ic-spin');
  cEl.input.addEventListener('input', function(){
    if(suppressInput) return;
    updateClearBtn();
    var q=cEl.input.value.trim(); clearTimeout(debTimer);
    if(q.length<2){ renderEmptyState(); return; }
    renderSearchLoading();
    debTimer=setTimeout(function(){ runQuery(q); }, 250);
  });
  cEl.input.addEventListener('focus', function(){
    try{ cEl.input.select(); }catch(e){}
    var v=cEl.input.value.trim();
    if(v==='' || v===STATE.selectedName){ renderEmptyState(); }
    else if(OPTS.length){ openAc(); }
    else { refreshPanelForValue(); }
  });
  cEl.input.addEventListener('keydown', function(e){
    if(e.key==='ArrowDown'){ e.preventDefault(); if(!acOpen){ refreshPanelForValue(); return; } if(OPTS.length) setActive(acActive<0?0:acActive+1); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); if(acOpen && OPTS.length) setActive(acActive<0?OPTS.length-1:acActive-1); }
    else if(e.key==='Home'){ if(acOpen && OPTS.length){ e.preventDefault(); setActive(0); } }
    else if(e.key==='End'){ if(acOpen && OPTS.length){ e.preventDefault(); setActive(OPTS.length-1); } }
    else if(e.key==='Enter'){
      clearTimeout(debTimer);
      if(acOpen && acActive>=0 && OPTS[acActive]){ e.preventDefault(); commitOption(OPTS[acActive]); }
      else { var q=cEl.input.value.trim(); if(q){ e.preventDefault(); renderSearchLoading(); runQuery(q); } }
    }
    else if(e.key==='Escape'){ if(acOpen){ e.preventDefault(); closeAc(); } }
  });
  cEl.clear.addEventListener('mousedown', function(ev){ ev.preventDefault(); });
  cEl.clear.addEventListener('click', function(){ cEl.input.value=''; updateClearBtn(); cEl.input.focus(); renderEmptyState(); });
  cEl.caret.addEventListener('click', function(e){ e.preventDefault(); if(acOpen){ closeAc(); return; } cEl.input.focus(); refreshPanelForValue(); });
  cEl.combo.addEventListener('focusout', function(e){ if(!cEl.combo.contains(e.relatedTarget)) closeAc(); });
  document.addEventListener('pointerdown', function(e){ if(cEl.combo && !cEl.combo.contains(e.target)) closeAc(); });
  if(window.visualViewport){ window.visualViewport.addEventListener('resize', function(){ if(acOpen) capList(); }); }
}
function rejectNonIndia(){
  setStatus(T('not_india'),true);
  STATE.lat=null; STATE.lon=null;
  var pc=el('place'); if(pc) pc.hidden=true;
  updateGates();
}
/* Single final gate: geometry (inIndia box) AND a positive countrycode==='IN'.
   The box overlaps neighbours (Kathmandu, Dhaka, Colombo), so an in-box result with
   unknown country is reverse-verified and fails closed. Nothing reaches STATE without IN. */
function selectPlace(r){
  if(!isFinite(r.lat) || !isFinite(r.lon)){ setStatus(T('st_err'),true); return; }
  if(!inIndia(r.lat,r.lon)){ rejectNonIndia(); return; }
  if(r.cc && r.cc!=='IN'){ rejectNonIndia(); return; }
  if(r.indiaVerified===true || r.cc==='IN'){ commitPlace(r); return; }
  var vSeq=++selectSeq;
  jget(PHOTON_REVERSE_URL(r.lat,r.lon)).then(function(g){
    if(vSeq!==selectSeq) return;
    var f=g&&g.features&&g.features[0];
    var cc=f&&f.properties&&f.properties.countrycode;
    if(cc==='IN'){ r.indiaVerified=true; commitPlace(r); } else { rejectNonIndia(); }
  }).catch(function(){ if(vSeq===selectSeq) rejectNonIndia(); });
}
function commitPlace(r){
  var mySeq=++selectSeq;
  setStatus(T('st_loading'));
  STATE.lat=r.lat; STATE.lon=r.lon;
  var elevP=jget('https://api.open-meteo.com/v1/elevation?latitude='+r.lat+'&longitude='+r.lon).then(function(e){ return (e.elevation&&e.elevation[0]!=null)?e.elevation[0]:null; }).catch(function(){ return null; });
  var airP=jget('https://air-quality-api.open-meteo.com/v1/air-quality?timezone=auto&latitude='+r.lat+'&longitude='+r.lon+'&current=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone,us_aqi').then(function(a){ return a.current||null; }).catch(function(){ return null; });
  var metP=jget('https://api.open-meteo.com/v1/forecast?latitude='+r.lat+'&longitude='+r.lon+'&current=boundary_layer_height,wind_speed_120m,wind_speed_180m,temperature_1000hPa,temperature_950hPa&timezone=auto').then(function(d){
    var c=d&&d.current; if(!c) return null;
    var t1000=parseFloat(c.temperature_1000hPa), t950=parseFloat(c.temperature_950hPa);
    var lapse=(isFinite(t1000)&&isFinite(t950))?((t950-t1000)/0.43):-6.5;   /* deg C per km across ~430 m */
    return { pbl:parseFloat(c.boundary_layer_height), wind120:parseFloat(c.wind_speed_120m), wind180:parseFloat(c.wind_speed_180m), t1000:t1000, t950:t950, lapse:lapse };
  }).catch(function(){ return null; });
  Promise.all([elevP,airP,metP]).then(function(vals){
    if(mySeq!==selectSeq) return;
    STATE.selectedName = r.name;
    STATE.groundElev = (vals[0]!=null?vals[0]:800);
    STATE.aq = vals[1];
    STATE.met = vals[2];
    var aqi = STATE.aq && STATE.aq.us_aqi!=null ? STATE.aq.us_aqi : 60;
    STATE.pf = Math.max(0.7, Math.min(1.5, 0.6 + aqi/120));
    STATE.floors = floorsFromField();
    el('place').hidden=false;
    STATE.pin = r.pin || null;
    el('placeName').textContent = r.name;
    var addr = r.secondary || [r.admin3, r.admin2, r.admin1].filter(Boolean).join(', ');
    el('placeAddr').textContent = addr;
    el('placeProv').textContent = r.lat.toFixed(4)+', '+r.lon.toFixed(4);
    setVal(el('pGround'), Math.round(STATE.groundElev), 'm');
    var cat=catFor(aqi); setVal(el('pAqi'), aqi, T(cat.k));
    setStatus(''); el('q').value=r.name; updateClearBtn();
    pushRecent(r);
    renderAll();
    if(STATE.floors!=null){ animate(drawElevation,1500); animateActiveView(1600); }
  }).catch(function(){ if(mySeq===selectSeq) setStatus(T('st_err'),true); });
}

/* ============================ language ============================ */
function positionGlider(){ var active=document.querySelector('.lang .pill.active'); var glider=el('glider'); if(!active||!glider)return; glider.style.left=active.offsetLeft+'px'; glider.style.width=active.offsetWidth+'px'; }
function applyLang(lang){
  if(!DICT[lang])lang='en'; LANG=lang; document.documentElement.setAttribute('lang',lang);
  document.querySelectorAll('[data-i18n]').forEach(function(n){ var s=T(n.getAttribute('data-i18n')); if(s!=null)n.textContent=s; });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(n){ var s=T(n.getAttribute('data-i18n-ph')); if(s!=null)n.setAttribute('placeholder',s); });
  document.querySelectorAll('[data-i18n-aria]').forEach(function(n){ var s=T(n.getAttribute('data-i18n-aria')); if(s!=null)n.setAttribute('aria-label',s); });
  document.querySelectorAll('.lang .pill').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-lang')===lang); });
  window.__floorsWord = T('floors_suffix'); if(typeof window.initHeightControl==='function') window.initHeightControl();
  positionGlider(); renderTier(); renderAQ(); renderSources(); renderCityNote(); redrawCharts();
}

/* ============================ location detection (India only) ============================ */
function detectLocation(){
  var done=false;
  setStatus(T('loc_detect'));
  function promptSearch(){ if(done)return; done=true; setStatus(''); STATE.lat=null; STATE.lon=null; updateGates(); try{ cEl.input && cEl.input.focus(); }catch(e){} }
  function useCoords(lat,lon){ if(done)return; done=true; photonReverse(lat,lon).then(function(it){ if(!isFinite(it.lat)||!isFinite(it.lon)){ it.lat=lat; it.lon=lon; } selectPlace(it); }); }
  function ipFallback(){
    if(done)return;
    jget('https://ipapi.co/json/').then(function(d){
      if(done)return;
      var lat=parseFloat(d&&d.latitude), lon=parseFloat(d&&d.longitude), cc=(d&&(d.country_code||d.country))||'';
      if(cc==='IN' && inIndia(lat,lon)) useCoords(lat,lon); else promptSearch();
    }).catch(promptSearch);
  }
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      function(pos){ var la=pos.coords.latitude, lo=pos.coords.longitude; if(inIndia(la,lo)) useCoords(la,lo); else ipFallback(); },
      function(){ ipFallback(); }, {timeout:6000, maximumAge:600000});
    setTimeout(function(){ if(!done) ipFallback(); }, 6800);
  } else ipFallback();
}

/* ============================ init ============================ */
function init(){
  startDitherDrift();
  document.querySelectorAll('.lang .pill').forEach(function(b){ b.addEventListener('click', function(){ applyLang(b.getAttribute('data-lang')); }); });
  positionGlider();
  initCombo();
  initTabs();
  initChartInteract();
  initAdvice();
  window.applyFloors = function(n){
    STATE.floors = (n==null) ? null : Math.max(2, Math.min(120, Math.round(n)));
    window.__floors = STATE.floors;
    updateGates();
    if(STATE.floors!=null && STATE.lat!=null){ recompute(); renderTier(); renderPeak(); redrawCharts(); animate(drawElevation,900); animateActiveView(1000); }
  };
  if(typeof window.initHeightControl==='function') window.initHeightControl();
  var expBtn=el('exportBtn');
  if(expBtn){ expBtn.addEventListener('click', function(){
    try{
      var ph=el('printHead');
      if(ph){
        while(ph.firstChild) ph.removeChild(ph.firstChild);
        var t=document.createElement('div'); t.className='ph-title'; t.textContent='AirFloor India';
        var sub=document.createElement('div'); sub.className='ph-sub';
        var pn=el('placeName'); var loc=STATE.selectedName||(pn?(pn.textContent||'').trim():'');
        var parts=[];
        if(loc && loc!=='-') parts.push(loc);
        if(STATE.floors!=null) parts.push(STATE.floors+' '+T('floors_suffix'));
        try{ var lc=(LANG==='te')?'te-IN':(LANG==='kn'?'kn-IN':'en-IN'); parts.push(new Date().toLocaleDateString(lc,{year:'numeric',month:'short',day:'numeric'})); }
        catch(e){ parts.push(new Date().toDateString()); }
        sub.textContent=parts.join('   |   ');
        ph.appendChild(t); ph.appendChild(sub);
      }
    }catch(e){}
    window.print();
  }); }
  updateGates();
  detectLocation();
  var rt, lastW=window.innerWidth; window.addEventListener('resize', function(){ clearTimeout(rt); rt=setTimeout(function(){ positionGlider(); if(window.innerWidth!==lastW){ lastW=window.innerWidth; renderDither(ditherPhase); redrawCharts(); } },160); });
  try{ matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(){ renderDither(ditherPhase); redrawCharts(); }); }catch(e){}
  new MutationObserver(function(){ renderDither(ditherPhase); redrawCharts(); }).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();

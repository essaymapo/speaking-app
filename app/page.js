'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

function FbItem({ label, score, reason, fallback }) {
  const cls = score==='미흡'?'fb-red':score==='준수'?'fb-blue':'fb-yellow';
  const text = score || '분석 중';
  return (
    <div className="fbi">
      <span className={`fb-badge ${score?cls:'fb-yellow'}`}>{text}</span>
      <div className="fbil">{label}</div>
      <div className="fbiv">{reason || fallback}</div>
    </div>
  );
}

const stageData = {
  1:{grade:'2학년',gradeGroup:'초등학교 1~2학년군',diff:'입문',std:'[2국01-04] 자신의 경험이나 생각을 바른 자세로 발표한다',cond:'경험이나 생각이 담긴 말이 나오면 OK',k1:'자신의 경험이나 생각이 주장에 담겼는지 확인하세요.',k2:'이유가 짧더라도 경험과 연결되어 있으면 충분합니다.',p1:'바른 자세와 적절한 목소리로 말했는지 살펴보세요.',p2:'말차례를 지키며 대화에 참여하는 기초 능력을 기르고 있습니다.',a1:'듣기·말하기에 흥미를 가지고 적극적으로 참여하는 태도가 중요합니다.',now:'현재 1단계 수준입니다. 경험과 생각을 담아 말하는 연습을 시작했습니다.'},
  2:{grade:'3학년',gradeGroup:'초등학교 3~4학년군',diff:'기초',std:'[4국01-05] 목적과 주제에 알맞게 자료를 정리하여 자신감 있게 발표한다',cond:'주제에 맞는 이유가 구체적으로 나오면 OK',k1:'주장이 주제와 목적에 알맞게 구성되어 있는지 확인하세요.',k2:'이유가 주장을 뒷받침하는지, 구체적으로 제시되었는지 점검하세요.',p1:'준언어·비언어적 표현(억양, 속도, 표정)을 적절히 활용했는지 살펴보세요.',p2:'발표 내용을 점검하고 조정하는 과정에서 성장하고 있습니다.',a1:'자신감 있게 발표하려는 태도와 의지가 느껴집니다.',now:'현재 2단계 수준입니다. 목적과 주제에 맞게 이유를 구성하는 연습 중입니다.'},
  3:{grade:'4학년',gradeGroup:'초등학교 3~4학년군',diff:'중급',std:'[4국01-06] 주제에 적절한 의견과 이유를 제시하고 서로의 생각을 교환하며 토의한다',cond:'이유 + 예시 + 상대 입장 고려 표현이 모두 나오면 OK',k1:'의견이 주제에 적절하게 연결되어 있는지 확인하세요.',k2:'이유와 예시가 의견을 충분히 뒷받침하는지 점검하세요.',p1:'상대의 의견을 파악하고 입장을 고려한 표현이 나왔는지 살펴보세요.',p2:'대화 흐름에 따라 자신의 말을 수정·보완하는 능력이 성장하고 있습니다.',a1:'다른 사람의 생각을 존중하며 소통하려는 태도를 보이고 있습니다.',now:'현재 3단계 수준입니다. 의견과 이유를 갖추어 상대와 생각을 교환하는 연습 중입니다.'},
  4:{grade:'5학년',gradeGroup:'초등학교 5~6학년군',diff:'심화',std:'[6국01-02] 주장을 파악하고 이유나 근거가 타당한지 평가하며 듣는다',cond:'이유와 근거의 타당성을 스스로 점검한 흔적이 보이면 OK',k1:'주장과 이유·근거가 논리적으로 연결되어 있는지 확인하세요.',k2:'근거가 타당하고 신뢰할 수 있는 내용인지 스스로 점검했는지 살펴보세요.',p1:'상대의 반론 가능성을 고려한 표현이 나왔는지 확인하세요.',p2:'주장을 뒷받침하는 근거를 보완·수정하는 능력이 성장하고 있습니다.',a1:'타당한 근거를 바탕으로 논리적으로 소통하려는 태도가 보입니다.',now:'현재 4단계 수준입니다. 이유와 근거의 타당성을 점검하며 주장하는 연습 중입니다.'},
  5:{grade:'6학년',gradeGroup:'초등학교 5~6학년군',diff:'고급',std:'[6국01-07] 절차와 규칙을 지키고 타당한 이유와 근거를 제시하며 토론한다',cond:'타당한 근거 + 반론에 논리적 재반박까지 나오면 OK',k1:'주장이 가치 있고 실천 가능한지, 이유가 주장과 관련 있는지 확인하세요.',k2:'근거가 이유를 뒷받침하고 출처가 명확한지 점검하세요.',p1:'상대의 반론을 논리적으로 재반박하는 표현이 나왔는지 살펴보세요.',p2:'절차와 규칙을 지키며 합리적으로 소통하는 능력이 성장하고 있습니다.',a1:'상대의 의견을 존중하며 민주적으로 소통하려는 태도가 보입니다.',now:'현재 5단계 수준입니다. 타당한 근거를 바탕으로 반론까지 대응하는 토론 능력을 기르고 있습니다.'}
};

const voiceIds = {
  'Hana (여성·밝음)': 'jsCqWAovK2LkecY7zXl4',
  'Miso (여성·차분)': 'uyVNoMrnUku1dZyVEXwD',
  'Min-joon (남성·활기)': 'nCnkMoNNpGFjvNwZBPr5',
  'Jay Kim (남성·따뜻)': 'xtEAhFqPPFNpJvZDVJKm',
  'Sunhee (할머니·포근)': 'cgSgspJ2msm6clMCkdW9',
  'Seojin (남성·신뢰)': 'N2lVS1w4EtoT3dr4eOWO'
};

// 상태: idle | listening | thinking | speaking
export default function Home() {
  const [screen, setScreen] = useState(1);
  const [showAdmin, setShowAdmin] = useState(false);
  const [lessonType, setLessonType] = useState(null);
  const [grade, setGrade] = useState(null);
  const [stage, setStage] = useState(1);
  const [topic, setTopic] = useState('');
  const [character, setCharacter] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [claudeKey, setClaudeKey] = useState('');
  const [claudeMode, setClaudeMode] = useState('claude');
  const [elevenKey, setElevenKey] = useState('');
  const [voiceName, setVoiceName] = useState('Rachel');
  const [voiceMode, setVoiceMode] = useState('elevenlabs');
  const [adminSaved, setAdminSaved] = useState(false);
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [convState, setConvState] = useState('idle');
  const [showFb, setShowFb] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [paused, setPaused] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [fbScores, setFbScores] = useState(null);
  const [fbLoading, setFbLoading] = useState(false);

  const chatRef = useRef(null);
  const recRef = useRef(null);
  const audioRef = useRef(null);
  const messagesRef = useRef([]);
  const convStateRef = useRef('idle');
  const showSuccessRef = useRef(false);
  const pausedRef = useRef(false);
  const stageRef = useRef(1);
  const silenceTimerRef = useRef(null);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { convStateRef.current = convState; }, [convState]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { stageRef.current = stage; }, [stage]);
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('speaking_app_config');
      if (saved) {
        const cfg = JSON.parse(saved);
        if (cfg.claudeKey) setClaudeKey(cfg.claudeKey);
        if (cfg.elevenKey) setElevenKey(cfg.elevenKey);
        if (cfg.claudeMode) setClaudeMode(cfg.claudeMode);
        if (cfg.voiceName) setVoiceName(cfg.voiceName);
        if (cfg.voiceMode) setVoiceMode(cfg.voiceMode);
      }
    } catch(e) {}
  }, []);

  const sd = stageData[stage];
  const typeEmoji = {'설득하기':'🤝','주장하기':'📢','설명하기':'💬'};

  function saveAdmin() {
    try {
      localStorage.setItem('speaking_app_config', JSON.stringify({claudeKey,elevenKey,claudeMode,voiceName,voiceMode}));
      setAdminSaved(true);
      setTimeout(()=>{setAdminSaved(false);setShowAdmin(false);},1200);
    } catch(e){}
  }

  function buildSystemPrompt() {
    const s = stageData[stageRef.current];
    const common = `\n\n[출력 규칙] 절대 금지: 마크다운, 이모티콘, 특수기호. 일반 텍스트만. 2~3문장 이내로 짧게.`;
    const prompts = {
      '설득하기':`너는 대한민국 남자 초등학생의 설득 대상 "${character}" 역할이다.
수업: 설득하기 / 학년: ${s.grade} / 단계: ${stageRef.current}단계 / 주제: ${topic}
[말투] ${character} 특유의 자연스러운 말투. 2~3문장 이내. 강의 금지.
[대화 방식 - 핵심] 매번 이유만 묻지 마라. 아래를 상황에 맞게 섞어라:
- 공감 후 버팀: "그건 나도 이해해. 근데 엄마 입장에선..."
- 반례 제시: "근데 그렇게 되면 이건 어떻게 할 건데?"
- 조건 협상: "그 말이 맞다면, 이건 약속할 수 있어?"
- 흔들리는 척: "음... 거의 다 됐는데 한 가지만 더 말해봐"
- 감정 반응: "솔직히 그 말은 좀 마음에 걸리긴 하는데..."
이유 반복 요구 금지. 실제 대화처럼 자연스럽게.
[수락 기준] ${s.cond}
[규칙] 정답 금지. 대신 정리 금지. 처음부터 동의 금지. 조건 달성 시 따뜻하게 수락. 3회 반복 시 "한 번 더 생각해봐"로 마무리. 성공 시 수락 말을 먼저 하고 마지막에 [선생님께] 설득 성공 출력.`,
      '주장하기':`너는 대한민국 남자 초등학생이 주장을 펼치는 대상 "${character}" 역할이다.
수업: 주장하기 / 학년: ${s.grade} / 단계: ${stageRef.current}단계 / 주제: ${topic}
[말투] ${character} 특유의 전문적 말투. 2~3문장 이내. 어려운 용어 금지.
[대화 방식 - 핵심] 매번 근거만 묻지 마라. 아래를 상황에 맞게 섞어라:
- 다른 관점 제시: "반대로 생각하면 이런 문제도 있지 않나요?"
- 부분 인정 후 도전: "그 논리는 맞아요. 근데 이 경우엔?"
- 현실 문제 제기: "실제로 그렇게 하려면 어떤 어려움이 있을까요?"
- 흔들리는 모습: "음, 그 말이 꽤 설득력 있네요. 근데..."
- 감정 반응: "오, 그 부분은 나도 생각해본 적 있어요"
근거만 반복 요구 금지. 실제 토론처럼 자연스럽게.
[수락 기준] ${s.cond}
[규칙] 정답 금지. 대신 정리 금지. 처음부터 동의 금지. 조건 달성 시 전문가답게 인정. 3회 반복 시 "더 생각해봐요"로 마무리. 성공 시 인정 말을 먼저 하고 마지막에 [선생님께] 주장 성공 출력.`,
      '설명하기':`너는 대한민국 남자 초등학생이 설명하는 대상 "${character}" 역할이다.
수업: 설명하기 / 학년: ${s.grade} / 단계: ${stageRef.current}단계 / 주제: ${topic}
[말투] 진짜 모르는 것처럼 순수하게. 아는 척 금지. 1~2문장.
[대화 방식 - 핵심] 항상 "그게 뭐야?"로만 반응하지 마라. 아래를 섞어라:
- 잘못 이해한 척: "아, 그러니까 ○○란 말이지? 맞아?" (일부러 틀리게)
- 엉뚱한 연결: "그럼 그게 ○○랑 비슷한 거야?"
- 감탄하며 궁금해하기: "오 신기하다! 근데 그럼 ○○는 어떻게 돼?"
- 부분 이해: "앞부분은 알겠는데 뒷부분은 아직 모르겠어"
- 쉽게 요청: "좀 더 쉽게 말해줄 수 있어?"
"그게 뭐야?" 반복 금지. 진짜 대화처럼.
[이해 기준] ${s.cond}
[규칙] 아는 척 금지. 대신 정리 금지. 처음부터 이해하기 금지. 3회 반복 시 "다르게 설명해줄 수 있어?"로 유도. 성공 시 이해했다는 말을 먼저 하고 마지막에 [선생님께] 설명 성공 출력.`
    };
    return (prompts[lessonType]||'') + common;
  }

  async function callAPIRaw(endpoint, key, body) {
    const headers = endpoint==='/api/gpt'
      ? {'Content-Type':'application/json','x-gpt-key':key}
      : {'Content-Type':'application/json','x-claude-key':key};
    const res = await fetch(endpoint,{method:'POST',headers,body:JSON.stringify(body)});
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data.error));
    return claudeMode==='gpt' ? data.choices[0].message.content : data.content[0].text;
  }

  async function fetchCandidates() {
    if (!topic.trim()||!claudeKey) return;
    setLoadingCandidates(true); setCandidates([]);
    try {
      const typeLabel={'설득하기':'설득 대상','주장하기':'주장 대상 전문가','설명하기':'설명 대상 인물'};
      const prompt=`수업유형: ${lessonType}. 주제: "${topic}". ${typeLabel[lessonType]} 후보 3개 추천. 실제1+가상2. JSON만 출력:\n{"candidates":[{"name":"이름","type":"실제","desc":"설명"},{"name":"이름","type":"가상","desc":"설명"},{"name":"이름","type":"가상","desc":"설명"}]}`;
      const endpoint=claudeMode==='gpt'?'/api/gpt':'/api/claude';
      const text=await callAPIRaw(endpoint,claudeKey,{messages:[{role:'user',content:prompt}],system:'JSON만 출력해.'});
      setCandidates(JSON.parse(text.replace(/```json|```/g,'').trim()).candidates);
    } catch(e){setCandidates([]);}
    finally{setLoadingCandidates(false);}
  }

  // AI 응답 가져오고 음성 재생
  const callAI = useCallback(async (history) => {
    setConvState('thinking');
    try {
      const endpoint = claudeMode==='gpt'?'/api/gpt':'/api/claude';
      const text = await callAPIRaw(endpoint, claudeKey, {messages:history, system:buildSystemPrompt()});
      const newMsg = {role:'assistant', content:text};
      setMessages(prev=>[...prev, newMsg]);
      messagesRef.current = [...history, newMsg];

      if (text.includes('[선생님께] 설득 성공')||text.includes('[선생님께] 주장 성공')||text.includes('[선생님께] 설명 성공')) {
        setShowSuccess(true);
        showSuccessRef.current = true;
        setCelebrate(true);
        setTimeout(()=>setCelebrate(false), 3000);
        stopListening();
        await speakAndThenListen(text);
        return;
      }

      await speakAndThenListen(text);
    } catch(e) {
      setMessages(prev=>[...prev,{role:'assistant',content:'오류: '+e.message,type:'sys'}]);
      setConvState('listening');
      startListening();
    }
  }, [claudeKey, claudeMode, voiceMode, elevenKey, voiceName, lessonType, topic, character]);

  function stripMd(text) {
    return text.replace(/\*\*(.*?)\*\*/g,'$1').replace(/\*(.*?)\*/g,'$1').replace(/#{1,6}\s/g,'').replace(/\[선생님께\][\s\S]*$/gm,'').trim();
  }

  async function speakAndThenListen(text) {
    const clean = stripMd(text).replace(/[\u{1F300}-\u{1F9FF}]/gu,'').trim();
    if (!clean) { setConvState('listening'); startListening(); return; }

    setConvState('speaking');

    if (voiceMode==='elevenlabs'&&elevenKey) {
      try {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current=null; }
        const res = await fetch('/api/tts',{
          method:'POST',
          headers:{'Content-Type':'application/json','x-eleven-key':elevenKey},
          body:JSON.stringify({text:clean, voiceId: voiceName.startsWith('custom:') ? voiceName.replace('custom:','') : (voiceIds[voiceName] || voiceIds['Hana (여성·밝음)'])})
        });
        if (!res.ok) throw new Error('TTS error');
        const blob = await res.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audioRef.current = audio;
        audio.onended = ()=>{ if (showSuccessRef.current||pausedRef.current) { setConvState('idle'); return; } setConvState('listening'); startListening(); };
        audio.onerror = ()=>{ if (showSuccessRef.current||pausedRef.current) { setConvState('idle'); return; } setConvState('listening'); startListening(); };
        audio.play();
      } catch(e) {
        fallbackSpeak(clean, ()=>{ if (!pausedRef.current) { setConvState('listening'); startListening(); } });
      }
    } else {
      fallbackSpeak(clean, ()=>{ if (!pausedRef.current) { setConvState('listening'); startListening(); } });
    }
  }

  function fallbackSpeak(text, onEnd) {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang='ko-KR'; utt.rate=0.9; utt.pitch=1.05;
    utt.onend = onEnd;
    utt.onerror = onEnd;
    synth.speak(utt);
  }

  function stopAudio() {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current=null; }
    window.speechSynthesis?.cancel();
  }

  function startListening() {
    if (pausedRef.current) return;
    if (!('webkitSpeechRecognition' in window)&&!('SpeechRecognition' in window)) return;

    stopListening();

    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang='ko-KR';
    rec.continuous=false;
    rec.interimResults=true;

    let finalTranscript = '';

    rec.onresult = (e) => {
      // AI가 말하는 중이면 즉시 끊기
      if (convStateRef.current==='speaking') {
        stopAudio();
        setConvState('listening');
      }

      let interim = '';
      for (let i=0; i<e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript = e.results[i][0].transcript;
        } else {
          interim = e.results[i][0].transcript;
        }
      }
      setInterimText(interim || finalTranscript);
    };

    rec.onend = ()=>{
      setInterimText('');
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      if (finalTranscript.trim() && !pausedRef.current) {
        const userMsg = {role:'user', content:finalTranscript.trim()};
        const newHistory = [...messagesRef.current, userMsg];
        setMessages(newHistory);
        messagesRef.current = newHistory;
        callAI(newHistory);
      } else if (!pausedRef.current && convStateRef.current==='listening') {
        setTimeout(()=>startListening(), 200);
      }
    };

    rec.onerror = (e)=>{
      setInterimText('');
      if (!pausedRef.current && convStateRef.current==='listening') {
        setTimeout(()=>startListening(), 300);
      }
    };

    recRef.current = rec;
    try { rec.start(); } catch(e){}
  }

  function stopListening() {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    try { recRef.current?.stop(); } catch(e){}
    recRef.current = null;
    setInterimText('');
  }

  async function startChat() {
    setScreen(5);
    setMessages([]);
    messagesRef.current = [];
    setShowSuccess(false);
    setShowFb(false);
    setPaused(false);
    pausedRef.current = false;
    setConvState('thinking');

    const initMsg = `수업을 시작합니다. 당신은 "${character}" 역할입니다. 주제는 "${topic}"입니다. 지금 바로 ${character}로서 아이에게 짧고 자연스럽게 첫 마디를 건네주세요.`;
    const initHistory = [{role:'user',content:initMsg}];
    messagesRef.current = initHistory;
    await callAI(initHistory);
  }

  async function analyzeFeedback() {
    if (messagesRef.current.length < 2) return;
    setFbLoading(true);
    try {
      const s = stageData[stageRef.current];
      const conv = messagesRef.current
        .filter(m=>m.role==='user'||m.role==='assistant')
        .slice(1)
        .map(m=>`${m.role==='user'?'아이':'AI'}: ${m.content}`)
        .join('\n');

      const prompt = `다음은 초등학생 말하기 수업 대화야. 아이의 말하기를 분석해서 각 항목을 미흡/보통/준수 중 하나로 평가해줘.

수업유형: ${lessonType} / 학년: ${s.grade} / 성취기준: ${s.std}

대화 내용:
${conv}

반드시 아래 JSON 형식으로만 답해. 다른 말 금지.
{"k1":"미흡/보통/준수","k2":"미흡/보통/준수","p1":"미흡/보통/준수","p2":"미흡/보통/준수","a1":"미흡/보통/준수","reason_k1":"한줄이유","reason_k2":"한줄이유","reason_p1":"한줄이유","reason_p2":"한줄이유","reason_a1":"한줄이유"}

평가 기준:
- k1(주장 명확성): 주장이 한 문장으로 명확하게 나왔는가
- k2(이유 적절성): 이유가 주장을 뒷받침하는가
- p1(상대 고려): 상대 입장을 고려한 표현이 있는가
- p2(대화 조정): 대화 흐름에 따라 말을 수정/보완했는가
- a1(참여 태도): 적극적으로 참여했는가`;

      const endpoint = claudeMode==='gpt'?'/api/gpt':'/api/claude';
      const text = await callAPIRaw(endpoint, claudeKey, {
        messages:[{role:'user', content:prompt}],
        system:'너는 국어 교육 전문가야. JSON만 출력해.'
      });
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim());
      setFbScores(parsed);
    } catch(e) {
      setFbScores(null);
    } finally {
      setFbLoading(false);
    }
  }

  function toggleFb() {
    const next = !showFb;
    setShowFb(next);
    if (next) analyzeFeedback();
  }
    if (!paused) {
      setPaused(true);
      pausedRef.current = true;
      stopAudio();
      stopListening();
      setConvState('idle');
    } else {
      setPaused(false);
      pausedRef.current = false;
      setConvState('listening');
      startListening();
    }
  }

  async function sendTextMsg() {
    if (!textInput.trim()||convStateRef.current==='thinking') return;
    stopAudio();
    stopListening();
    const userMsg = {role:'user',content:textInput.trim()};
    const newHistory = [...messagesRef.current, userMsg];
    setMessages(newHistory);
    messagesRef.current = newHistory;
    setTextInput('');
    await callAI(newHistory);
  }

  function endChat() {
    stopAudio();
    stopListening();
    setScreen(1); setMessages([]); messagesRef.current=[];
    setLessonType(null); setGrade(null); setStage(1); stageRef.current=1;
    setTopic(''); setCharacter(''); setCandidates([]);
    setShowSuccess(false); showSuccessRef.current=false;
    setCelebrate(false); setShowFb(false); setPaused(false); pausedRef.current=false;
    setConvState('idle'); setInterimText('');
  }

  async function nextStage() {
    const ns = Math.min(stageRef.current+1,5);
    setStage(ns); stageRef.current=ns; setShowSuccess(false);
    stopListening();
    const cont=[...messagesRef.current,{role:'user',content:`${ns}단계로 올라갔습니다. 같은 주제와 인물로 이어서 진행해주세요.`}];
    setMessages(cont); messagesRef.current=cont;
    await callAI(cont);
  }

  function newTopic() {
    stopAudio(); stopListening();
    setShowSuccess(false); setScreen(3);
    setTopic(''); setCharacter(''); setCandidates([]);
    setConvState('idle');
  }

  const stateInfo = {
    idle:   {icon:'⏸', label:'대기 중',       color:'var(--g400)'},
    listening:{icon:'👂', label:'듣는 중...',    color:'#E24B4A'},
    thinking: {icon:'💭', label:'생각 중...',    color:'var(--amber)'},
    speaking: {icon:'🔊', label:'AI 말하는 중', color:'var(--blue)'}
  };
  const si = stateInfo[convState]||stateInfo.idle;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap');
        :root{--teal:#1D9E75;--teal-l:#E1F5EE;--teal-d:#0F6E56;--coral:#D85A30;--coral-l:#FAECE7;--blue:#378ADD;--blue-l:#E6F1FB;--amber:#BA7517;--amber-l:#FAEEDA;--g50:#F8F7F4;--g100:#F1EFE8;--g200:#D3D1C7;--g400:#888780;--g600:#5F5E5A;--g900:#1A1A18;--r:12px;--rs:8px;}
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Nanum Gothic',sans-serif;background:var(--g50);color:var(--g900);min-height:100vh;}
        .app{max-width:680px;margin:0 auto;padding:1.5rem 1rem;position:relative;min-height:100vh;}
        .hd{text-align:center;margin-bottom:2rem;}
        .logo{font-size:13px;font-weight:700;letter-spacing:.1em;color:var(--teal);text-transform:uppercase;margin-bottom:8px;}
        h1{font-size:24px;font-weight:800;line-height:1.3;}
        .steps{display:flex;gap:6px;margin-bottom:1.5rem;}
        .step{flex:1;height:3px;border-radius:2px;background:var(--g200);}
        .step.on{background:var(--teal);}
        .lbl{font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--g400);text-transform:uppercase;margin-bottom:10px;}
        .cards{display:grid;gap:10px;margin-bottom:1.5rem;}
        .card{background:white;border:1.5px solid var(--g200);border-radius:var(--r);padding:1rem 1.25rem;cursor:pointer;display:flex;align-items:center;gap:14px;transition:all .15s;}
        .card:hover{border-color:var(--g400);}.card.sel{border-color:var(--teal);background:var(--teal-l);}
        .icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px;}
        .icon.p{background:var(--coral-l);}.icon.a{background:var(--blue-l);}.icon.e{background:var(--teal-l);}
        .cname{font-size:15px;font-weight:700;margin-bottom:2px;}.cdesc{font-size:13px;color:var(--g600);}
        .badge{display:inline-block;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;margin-bottom:3px;}
        .bp{background:var(--coral-l);color:var(--coral);}.ba{background:var(--blue-l);color:var(--blue);}.be{background:var(--teal-l);color:var(--teal-d);}
        .grades{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:1.5rem;}
        .gb{background:white;border:1.5px solid var(--g200);border-radius:var(--rs);padding:12px 0;text-align:center;cursor:pointer;transition:all .15s;}
        .gb:hover{border-color:var(--g400);}.gb.sel{border-color:var(--teal);background:var(--teal-l);}
        .gn{font-size:20px;font-weight:800;}.gl{font-size:11px;color:var(--g600);}
        .sbox{background:white;border:1.5px solid var(--g200);border-radius:var(--r);padding:1.25rem;margin-bottom:1.5rem;}
        .stop{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
        .slbl{font-size:14px;font-weight:700;}
        .sctrl{display:flex;align-items:center;gap:10px;}
        .snum{font-size:26px;font-weight:800;color:var(--teal);min-width:32px;text-align:center;}
        .sarr{width:30px;height:30px;border:1.5px solid var(--g200);border-radius:8px;background:none;cursor:pointer;font-size:16px;color:var(--g600);display:flex;align-items:center;justify-content:center;}
        .sarr:hover{border-color:var(--teal);color:var(--teal);}
        .sinfo{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .si{background:var(--g50);border-radius:var(--rs);padding:10px 12px;}.sif{grid-column:1/-1;}
        .silbl{font-size:10px;font-weight:700;color:var(--g400);letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px;}
        .sival{font-size:13px;line-height:1.4;}.sival.t{color:var(--teal-d);font-weight:700;}
        .abox{background:white;border:1.5px solid var(--g200);border-radius:var(--r);padding:1.25rem;margin-bottom:1.5rem;}
        .arow{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;}
        .abtn{padding:10px;border:1.5px solid var(--g200);border-radius:var(--rs);background:none;font-size:13px;font-weight:700;color:var(--g600);cursor:pointer;font-family:'Nanum Gothic',sans-serif;transition:all .15s;}
        .abtn:hover{border-color:var(--g400);}.abtn.sel{border-color:var(--teal);background:var(--teal-l);color:var(--teal-d);}
        .ainp{width:100%;height:40px;padding:0 12px;border:1.5px solid var(--g200);border-radius:var(--rs);font-size:13px;font-family:'Nanum Gothic',sans-serif;background:var(--g50);color:var(--g900);margin-bottom:10px;}
        .ainp:focus{outline:none;border-color:var(--teal);}
        .tinp-big{width:100%;height:52px;padding:0 14px;border:1.5px solid var(--g200);border-radius:var(--r);font-size:15px;font-family:'Nanum Gothic',sans-serif;color:var(--g900);background:white;margin-bottom:12px;}
        .tinp-big:focus{outline:none;border-color:var(--teal);}
        .vgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
        .btnm{width:100%;padding:14px;background:var(--teal);border:none;border-radius:var(--r);color:white;font-size:15px;font-weight:700;cursor:pointer;font-family:'Nanum Gothic',sans-serif;}
        .btnm:disabled{opacity:.35;cursor:not-allowed;}.btnm:hover:not(:disabled){opacity:.9;}
        .btnm-out{width:100%;padding:12px;background:none;border:1.5px solid var(--teal);border-radius:var(--r);color:var(--teal-d);font-size:14px;font-weight:700;cursor:pointer;font-family:'Nanum Gothic',sans-serif;margin-bottom:12px;}
        .btnm-out:hover{background:var(--teal-l);}.btnm-out:disabled{opacity:.35;cursor:not-allowed;}
        .bbk{background:none;border:none;color:var(--g600);font-size:13px;cursor:pointer;margin-bottom:1.25rem;padding:0;font-family:'Nanum Gothic',sans-serif;}
        .cand-grid{display:grid;gap:8px;margin-bottom:14px;}
        .cand-card{background:white;border:1.5px solid var(--g200);border-radius:var(--r);padding:12px 14px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .15s;}
        .cand-card:hover{border-color:var(--teal);}.cand-card.sel{border-color:var(--teal);background:var(--teal-l);}
        .cand-name{font-size:14px;font-weight:700;color:var(--g900);}
        .cand-desc{font-size:12px;color:var(--g600);margin-top:2px;}
        .cand-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;flex-shrink:0;margin-left:8px;}
        .cand-real{background:var(--blue-l);color:var(--blue);}.cand-virt{background:var(--coral-l);color:var(--coral);}
        .admin-btn{position:absolute;bottom:1.2rem;right:1rem;background:none;border:none;font-size:11px;color:var(--g400);cursor:pointer;font-family:'Nanum Gothic',sans-serif;padding:4px 8px;border-radius:var(--rs);}
        .admin-btn:hover{color:var(--g600);background:var(--g100);}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:100;display:flex;align-items:center;justify-content:center;padding:1rem;}
        .modal{background:white;border-radius:var(--r);padding:1.5rem;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;}
        .modal-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;}
        .modal-ttl{font-size:16px;font-weight:800;}
        .modal-close{background:none;border:none;font-size:20px;cursor:pointer;color:var(--g400);}
        .saved-msg{background:var(--teal-l);color:var(--teal-d);border-radius:var(--rs);padding:8px 12px;font-size:13px;font-weight:700;text-align:center;margin-top:8px;}
        .chat-wrap{max-width:680px;margin:0 auto;padding:1rem;display:flex;flex-direction:column;min-height:100vh;}
        .cbar{background:white;border:1.5px solid var(--g200);border-radius:var(--r);padding:10px 14px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;gap:8px;}
        .cleft{display:flex;align-items:center;gap:10px;}
        .cav{width:34px;height:34px;border-radius:50%;background:var(--teal-l);display:flex;align-items:center;justify-content:center;font-size:16px;}
        .cn{font-size:13px;font-weight:700;}.cd{font-size:11px;color:var(--g600);}
        .cbtns{display:flex;gap:6px;}
        .cbtn{background:none;border:1.5px solid var(--g200);border-radius:var(--rs);padding:5px 10px;font-size:12px;font-weight:700;color:var(--g600);cursor:pointer;font-family:'Nanum Gothic',sans-serif;white-space:nowrap;}
        .cbtn.fb{border-color:var(--blue);color:var(--blue);}.cbtn.pa{border-color:var(--amber);color:var(--amber);}.cbtn.st{border-color:#E24B4A;color:#A32D2D;}
        .carea{background:var(--g100);border-radius:var(--r);padding:1rem;flex:1;min-height:240px;max-height:380px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;margin-bottom:12px;}
        .bbl{max-width:80%;padding:10px 14px;font-size:14px;line-height:1.6;}
        .bbl.ai{background:white;border:1px solid var(--g200);color:var(--g900);align-self:flex-start;border-radius:4px 14px 14px 14px;}
        .bbl.user{background:var(--teal);color:white;align-self:flex-end;border-radius:14px 14px 4px 14px;}
        .bbl.sys{background:var(--amber-l);border:1px solid #FAC775;color:var(--amber);align-self:center;font-size:12px;font-weight:700;text-align:center;max-width:90%;border-radius:var(--rs);}
        .bbl.interim{background:var(--g100);border:1px dashed var(--g200);color:var(--g600);align-self:flex-end;border-radius:14px 14px 4px 14px;font-style:italic;}
        .dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--g400);margin:0 2px;animation:bounce 1.2s infinite;}
        .dot:nth-child(2){animation-delay:.2s;}.dot:nth-child(3){animation-delay:.4s;}
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        .voice-status{display:flex;align-items:center;justify-content:center;gap:10px;padding:12px;background:white;border:1.5px solid var(--g200);border-radius:var(--r);margin-bottom:10px;}
        .vs-icon{font-size:20px;}
        .vs-label{font-size:14px;font-weight:700;}
        .vs-dot{width:8px;height:8px;border-radius:50%;background:var(--g200);animation:none;}
        .vs-dot.active{animation:blink .8s infinite;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        .txt-row{display:flex;gap:8px;align-items:center;}
        .tinp{flex:1;height:44px;padding:0 14px;border:1.5px solid var(--g200);border-radius:var(--r);font-size:14px;font-family:'Nanum Gothic',sans-serif;color:var(--g900);background:white;}
        .tinp:focus{outline:none;border-color:var(--teal);}
        .sndbtn{height:44px;padding:0 16px;background:var(--teal);border:none;border-radius:var(--r);color:white;font-size:14px;font-weight:700;cursor:pointer;font-family:'Nanum Gothic',sans-serif;}
        .sucbox{background:var(--teal-l);border:1.5px solid var(--teal);border-radius:var(--r);padding:1rem 1.25rem;margin-bottom:10px;}
        .sucttl{font-size:15px;font-weight:800;color:var(--teal-d);margin-bottom:10px;}
        .sucgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .sucbtn{padding:10px;border:1.5px solid var(--teal);border-radius:var(--rs);background:white;color:var(--teal-d);font-size:13px;font-weight:700;cursor:pointer;font-family:'Nanum Gothic',sans-serif;text-align:center;}
        .sucbtn.end{grid-column:1/-1;border-color:var(--g200);color:var(--g600);}
        .celebrate-overlay{position:fixed;inset:0;pointer-events:none;z-index:200;overflow:hidden;}
        .confetti{position:absolute;width:10px;height:10px;border-radius:2px;animation:fall linear forwards;}
        @keyframes fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1;}100%{transform:translateY(100vh) rotate(720deg);opacity:0;}}
        .suc-banner{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border:3px solid var(--teal);border-radius:20px;padding:1.5rem 2rem;text-align:center;z-index:201;animation:popIn .4s ease-out;}
        @keyframes popIn{0%{transform:translate(-50%,-50%) scale(0.5);opacity:0;}70%{transform:translate(-50%,-50%) scale(1.1);}100%{transform:translate(-50%,-50%) scale(1);opacity:1;}}
        .suc-banner-icon{font-size:48px;margin-bottom:8px;}
        .suc-banner-txt{font-size:22px;font-weight:800;color:var(--teal-d);}
        .fb-badge{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;margin-right:6px;flex-shrink:0;}
        .fb-red{background:#FCEBEB;color:#A32D2D;border:1px solid #F09595;}
        .fb-yellow{background:#FAEEDA;color:#854F0B;border:1px solid #FAC775;}
        .fb-blue{background:#E6F1FB;color:#185FA5;border:1px solid #85B7EB;}
        .fbp{background:white;border:1.5px solid var(--g200);border-radius:var(--r);padding:1.25rem;margin-bottom:10px;}
        .fbh{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--g100);}
        .fbht{font-size:15px;font-weight:800;}.fbclose{background:none;border:none;font-size:18px;cursor:pointer;color:var(--g400);}
        .fbmeta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;}
        .fbmi{background:var(--g50);border-radius:var(--rs);padding:8px 10px;}.fbmif{grid-column:1/-1;}
        .fbml{font-size:10px;font-weight:700;color:var(--g400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px;}
        .fbmv{font-size:13px;line-height:1.4;}
        .fbsec{margin-bottom:14px;}
        .fbsh{font-size:11px;font-weight:700;color:var(--g400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;}
        .fbi{display:flex;gap:10px;padding:8px 10px;background:var(--g50);border-radius:var(--rs);margin-bottom:6px;}
        .fbil{font-size:12px;color:var(--g600);min-width:80px;padding-top:1px;flex-shrink:0;}
        .fbiv{font-size:13px;line-height:1.5;}
        .lvl{display:flex;gap:4px;margin-bottom:10px;}
        .ls{flex:1;height:5px;border-radius:3px;background:var(--g200);}.ls.on{background:var(--teal);}
        .fbnow{background:var(--teal-l);border-radius:var(--rs);padding:10px 14px;font-size:13px;color:var(--teal-d);line-height:1.5;}
        .pbar{background:var(--amber-l);border:1.5px solid var(--amber);border-radius:var(--rs);padding:8px 14px;font-size:13px;font-weight:700;color:var(--amber);text-align:center;margin-bottom:8px;}
      `}</style>

      {showAdmin && (
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setShowAdmin(false)}>
          <div className="modal">
            <div className="modal-h">
              <div className="modal-ttl">관리자 설정</div>
              <button className="modal-close" onClick={()=>setShowAdmin(false)}>×</button>
            </div>
            <div className="lbl" style={{marginBottom:8}}>대화 AI</div>
            <div className="arow">
              <button className={`abtn${claudeMode==='claude'?' sel':''}`} onClick={()=>setClaudeMode('claude')}>Claude</button>
              <button className={`abtn${claudeMode==='gpt'?' sel':''}`} onClick={()=>setClaudeMode('gpt')}>GPT</button>
            </div>
            <div className="lbl" style={{marginBottom:8}}>{claudeMode==='claude'?'Claude API 키':'GPT API 키'}</div>
            <input className="ainp" type="password" placeholder={claudeMode==='claude'?'sk-ant-api03-...':'sk-proj-...'} value={claudeKey} onChange={e=>setClaudeKey(e.target.value)}/>
            <div className="lbl" style={{marginBottom:8}}>음성 출력</div>
            <div className="arow" style={{marginBottom:10}}>
              <button className={`abtn${voiceMode==='browser'?' sel':''}`} onClick={()=>setVoiceMode('browser')}>브라우저 기본</button>
              <button className={`abtn${voiceMode==='elevenlabs'?' sel':''}`} onClick={()=>setVoiceMode('elevenlabs')}>ElevenLabs</button>
            </div>
            {voiceMode==='elevenlabs' && <>
              <div className="lbl" style={{marginBottom:8}}>ElevenLabs API 키</div>
              <input className="ainp" type="password" placeholder="sk_..." value={elevenKey} onChange={e=>setElevenKey(e.target.value)}/>
              <div className="lbl" style={{marginBottom:8}}>목소리</div>
              <div className="vgrid" style={{marginBottom:10}}>
                {Object.keys(voiceIds).map(v=>(
                  <button key={v} className={`abtn${voiceName===v?' sel':''}`} onClick={()=>setVoiceName(v)}>{v}</button>
                ))}
              </div>
              <div className="lbl" style={{marginBottom:4}}>커스텀 Voice ID (직접 입력)</div>
              <div style={{fontSize:11,color:'var(--g400)',marginBottom:6}}>ElevenLabs 보이스 라이브러리에서 원하는 목소리 ID 직접 입력 가능</div>
              <input className="ainp" placeholder="Voice ID 입력 (예: abc123xyz...)" value={voiceName.startsWith('custom:') ? voiceName.replace('custom:','') : ''} onChange={e=>{ if(e.target.value) setVoiceName('custom:'+e.target.value); }} style={{marginBottom:0}}/>
            </>}
            <button className="btnm" onClick={saveAdmin}>저장</button>
            {adminSaved && <div className="saved-msg">저장됐어요! 다음부터 자동으로 불러와요.</div>}
          </div>
        </div>
      )}

      {screen!==5 && (
        <div className="app">
          {screen===1 && (
            <div>
              <div className="hd">
                <div className="logo">말하기 수업 AI</div>
                <h1>오늘 수업을<br/>선택해주세요</h1>
              </div>
              <div className="steps">{[1,2,3].map(i=><div key={i} className={`step${i<=1?' on':''}`}/>)}</div>
              <div className="lbl">수업 유형</div>
              <div className="cards">
                {[['설득하기','p','🤝','대상 설득하기','원하는 것을 대상에게 설득하는 상황'],
                  ['주장하기','a','📢','전문가에게 주장하기','실제·가상 전문가에게 주장을 펼치는 상황'],
                  ['설명하기','e','💬','친숙한 인물에게 설명하기','주제를 모르는 친숙한 인물에게 설명하는 상황']
                ].map(([type,cls,emoji,name,desc])=>(
                  <div key={type} className={`card${lessonType===type?' sel':''}`} onClick={()=>setLessonType(type)}>
                    <div className={`icon ${cls}`}>{emoji}</div>
                    <div>
                      <div className={`badge b${cls}`}>{type}</div>
                      <div className="cname">{name}</div>
                      <div className="cdesc">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btnm" disabled={!lessonType||!claudeKey} onClick={()=>setScreen(2)}>
                {claudeKey?'다음 →':'API 키를 먼저 설정해주세요 (우측 하단 ⚙)'}
              </button>
              <button className="admin-btn" onClick={()=>setShowAdmin(true)}>⚙ 관리자 설정</button>
            </div>
          )}

          {screen===2 && (
            <div>
              <div className="steps">{[1,2,3].map(i=><div key={i} className={`step${i<=2?' on':''}`}/>)}</div>
              <button className="bbk" onClick={()=>setScreen(1)}>← 이전</button>
              <div className="lbl">학년 선택</div>
              <div className="grades">
                {[2,3,4,5,6].map(g=>(
                  <div key={g} className={`gb${grade===g?' sel':''}`} onClick={()=>{setGrade(g);setStage(g-1);stageRef.current=g-1;}}>
                    <div className="gn">{g}</div><div className="gl">학년</div>
                  </div>
                ))}
              </div>
              {grade && (
                <div className="sbox">
                  <div className="stop">
                    <span className="slbl">단계 설정</span>
                    <div className="sctrl">
                      <button className="sarr" onClick={()=>{setStage(s=>{const n=Math.max(1,s-1);stageRef.current=n;return n;});}}>−</button>
                      <span className="snum">{stage}</span>
                      <button className="sarr" onClick={()=>{setStage(s=>{const n=Math.min(5,s+1);stageRef.current=n;return n;});}}>+</button>
                    </div>
                  </div>
                  <div className="sinfo">
                    <div className="si"><div className="silbl">기준 학년</div><div className="sival">{sd.grade}</div></div>
                    <div className="si"><div className="silbl">난이도</div><div className="sival t">{sd.diff}</div></div>
                    <div className="si sif"><div className="silbl">관련 성취기준</div><div className="sival">{sd.std}</div></div>
                    <div className="si sif"><div className="silbl">수락 조건</div><div className="sival">{sd.cond}</div></div>
                  </div>
                </div>
              )}
              <button className="btnm" disabled={!grade} onClick={()=>setScreen(3)}>다음 →</button>
            </div>
          )}

          {screen===3 && (
            <div>
              <div className="steps">{[1,2,3].map(i=><div key={i} className={`step${i<=3?' on':''}`}/>)}</div>
              <button className="bbk" onClick={()=>setScreen(2)}>← 이전</button>
              <div className="lbl">오늘 수업 주제</div>
              <input className="tinp-big"
                placeholder={lessonType==='설득하기'?'예: 닌텐도 사주세요':lessonType==='주장하기'?'예: 급식에 디저트를 추가해야 한다':'예: 태양계'}
                value={topic} onChange={e=>setTopic(e.target.value)}/>
              <button className="btnm-out" disabled={!topic.trim()||!claudeKey||loadingCandidates} onClick={fetchCandidates}>
                {loadingCandidates?'추천 중...':'AI 대화 상대 추천받기'}
              </button>
              {candidates.length>0 && <>
                <div className="lbl">대화 상대 선택</div>
                <div className="cand-grid">
                  {candidates.map((c,i)=>(
                    <div key={i} className={`cand-card${character===c.name?' sel':''}`} onClick={()=>setCharacter(c.name)}>
                      <div>
                        <div className="cand-name">{c.name}</div>
                        <div className="cand-desc">{c.desc}</div>
                      </div>
                      <span className={`cand-badge ${c.type==='실제'?'cand-real':'cand-virt'}`}>{c.type}</span>
                    </div>
                  ))}
                </div>
              </>}
              <div className="lbl">직접 입력</div>
              <input className="ainp" placeholder="대화 상대 직접 입력 (예: 구두쇠 왕)" value={character} onChange={e=>setCharacter(e.target.value)}/>
              <button className="btnm" disabled={!topic.trim()||!character.trim()} onClick={startChat}>수업 시작</button>
            </div>
          )}
        </div>
      )}

      {screen===5 && (
        <div className="chat-wrap">
          <div className="cbar">
            <div className="cleft">
              <div className="cav">{typeEmoji[lessonType]}</div>
              <div>
                <div className="cn">{character}</div>
                <div className="cd">{lessonType} · {sd.grade} · {stage}단계 · {topic}</div>
              </div>
            </div>
            <div className="cbtns">
              <button className="cbtn fb" onClick={toggleFb}>피드백</button>
              <button className="cbtn pa" onClick={togglePause}>{paused?'재개':'일시정지'}</button>
              <button className="cbtn st" onClick={endChat}>중지</button>
            </div>
          </div>

          {paused && <div className="pbar">일시정지 중 — 재개를 누르면 대화가 이어집니다</div>}

          <div className="carea" ref={chatRef}>
            {messages.map((m,i)=>(
              <div key={i} className={`bbl ${m.type==='sys'?'sys':m.role==='user'?'user':'ai'}`}>
                {m.role==='assistant'?stripMd(m.content):m.content}
              </div>
            ))}
            {convState==='thinking' && <div className="bbl ai"><span className="dot"/><span className="dot"/><span className="dot"/></div>}
            {interimText && <div className="bbl interim">{interimText}...</div>}
          </div>

      {celebrate && (
        <>
          <div className="celebrate-overlay">
            {Array.from({length:30}).map((_,i)=>(
              <div key={i} className="confetti" style={{
                left: Math.random()*100+'%',
                animationDuration: (1+Math.random()*2)+'s',
                animationDelay: Math.random()*0.5+'s',
                background: ['#1D9E75','#378ADD','#D85A30','#BA7517','#993556'][i%5],
                width: (6+Math.random()*10)+'px',
                height: (6+Math.random()*10)+'px',
              }}/>
            ))}
          </div>
          <div className="suc-banner">
            <div className="suc-banner-icon">🎉</div>
            <div className="suc-banner-txt">성공!</div>
          </div>
        </>
      )}

      {showSuccess && (
            <div className="sucbox">
              <div className="sucttl">성공! 다음을 선택해주세요.</div>
              <div className="sucgrid">
                <div className="sucbtn" onClick={nextStage}>같은 주제 다음 단계</div>
                <div className="sucbtn" onClick={newTopic}>새 주제 같은 단계</div>
                <div className="sucbtn end" onClick={endChat}>수업 종료</div>
              </div>
            </div>
          )}

          {showFb && (
            <div className="fbp">
              <div className="fbh">
                <div className="fbht">교육과정 기반 피드백</div>
                <button className="fbclose" onClick={()=>setShowFb(false)}>×</button>
              </div>
              <div className="fbmeta">
                <div className="fbmi"><div className="fbml">학년군</div><div className="fbmv">{sd.gradeGroup}</div></div>
                <div className="fbmi"><div className="fbml">영역</div><div className="fbmv">듣기·말하기</div></div>
                <div className="fbmi fbmif"><div className="fbml">관련 성취기준</div><div className="fbmv">{sd.std}</div></div>
              </div>

              {fbLoading && (
                <div style={{textAlign:'center',padding:'20px',color:'var(--g400)',fontSize:'13px'}}>
                  AI가 대화를 분석하고 있어요...
                </div>
              )}

              {!fbLoading && (
                <>
                  <div className="fbsec">
                    <div className="fbsh">지식·이해 범주</div>
                    <FbItem label="주장 명확성" score={fbScores?.k1} reason={fbScores?.reason_k1} fallback={sd.k1}/>
                    <FbItem label="이유 적절성" score={fbScores?.k2} reason={fbScores?.reason_k2} fallback={sd.k2}/>
                  </div>
                  <div className="fbsec">
                    <div className="fbsh">과정·기능 범주</div>
                    <FbItem label="상대 고려" score={fbScores?.p1} reason={fbScores?.reason_p1} fallback={sd.p1}/>
                    <FbItem label="대화 조정" score={fbScores?.p2} reason={fbScores?.reason_p2} fallback={sd.p2}/>
                  </div>
                  <div className="fbsec">
                    <div className="fbsh">가치·태도 범주</div>
                    <FbItem label="참여 태도" score={fbScores?.a1} reason={fbScores?.reason_a1} fallback={sd.a1}/>
                  </div>
                </>
              )}

              <div className="fbsec">
                <div className="fbsh">현재 수준</div>
                <div className="lvl">{[1,2,3,4,5].map(i=><div key={i} className={`ls${i<=stage?' on':''}`}/>)}</div>
                <div className="fbnow">{sd.now}</div>
              </div>
            </div>
          )}

          {/* 음성 상태 표시 */}
          <div className="voice-status">
            <span className="vs-icon">{si.icon}</span>
            <span className="vs-label" style={{color:si.color}}>{si.label}</span>
            <div className="vs-dot" style={{background:si.color}} className={`vs-dot${convState!=='idle'?' active':''}`}/>
          </div>

          {/* 텍스트 보조 입력 */}
          <div className="txt-row">
            <input className="tinp" placeholder="텍스트로도 입력 가능해요" value={textInput}
              onChange={e=>setTextInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&sendTextMsg()}/>
            <button className="sndbtn" onClick={sendTextMsg}>전송</button>
          </div>
        </div>
      )}
    </>
  );
}

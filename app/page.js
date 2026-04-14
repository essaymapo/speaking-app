'use client';
import { useState, useRef, useEffect } from 'react';

const stageData = {
  1: { grade:'2학년', gradeGroup:'초등학교 1~2학년군', diff:'입문', std:'[2국01-04] 자신의 경험이나 생각을 바른 자세로 발표한다', cond:'경험이나 생각이 담긴 말이 나오면 OK', k1:'자신의 경험이나 생각이 주장에 담겼는지 확인하세요.', k2:'이유가 짧더라도 경험과 연결되어 있으면 충분합니다.', p1:'바른 자세와 적절한 목소리로 말했는지 살펴보세요.', p2:'말차례를 지키며 대화에 참여하는 기초 능력을 기르고 있습니다.', a1:'듣기·말하기에 흥미를 가지고 적극적으로 참여하는 태도가 중요합니다.', now:'현재 1단계 수준입니다. 경험과 생각을 담아 말하는 연습을 시작했습니다.' },
  2: { grade:'3학년', gradeGroup:'초등학교 3~4학년군', diff:'기초', std:'[4국01-05] 목적과 주제에 알맞게 자료를 정리하여 자신감 있게 발표한다', cond:'주제에 맞는 이유가 구체적으로 나오면 OK', k1:'주장이 주제와 목적에 알맞게 구성되어 있는지 확인하세요.', k2:'이유가 주장을 뒷받침하는지, 구체적으로 제시되었는지 점검하세요.', p1:'준언어·비언어적 표현(억양, 속도, 표정)을 적절히 활용했는지 살펴보세요.', p2:'발표 내용을 점검하고 조정하는 과정에서 성장하고 있습니다.', a1:'자신감 있게 발표하려는 태도와 의지가 느껴집니다.', now:'현재 2단계 수준입니다. 목적과 주제에 맞게 이유를 구성하는 연습 중입니다.' },
  3: { grade:'4학년', gradeGroup:'초등학교 3~4학년군', diff:'중급', std:'[4국01-06] 주제에 적절한 의견과 이유를 제시하고 서로의 생각을 교환하며 토의한다', cond:'이유 + 예시 + 상대 입장 고려 표현이 모두 나오면 OK', k1:'의견이 주제에 적절하게 연결되어 있는지 확인하세요.', k2:'이유와 예시가 의견을 충분히 뒷받침하는지 점검하세요.', p1:'상대의 의견을 파악하고 입장을 고려한 표현이 나왔는지 살펴보세요.', p2:'대화 흐름에 따라 자신의 말을 수정·보완하는 능력이 성장하고 있습니다.', a1:'다른 사람의 생각을 존중하며 소통하려는 태도를 보이고 있습니다.', now:'현재 3단계 수준입니다. 의견과 이유를 갖추어 상대와 생각을 교환하는 연습 중입니다.' },
  4: { grade:'5학년', gradeGroup:'초등학교 5~6학년군', diff:'심화', std:'[6국01-02] 주장을 파악하고 이유나 근거가 타당한지 평가하며 듣는다', cond:'이유와 근거의 타당성을 스스로 점검한 흔적이 보이면 OK', k1:'주장과 이유·근거가 논리적으로 연결되어 있는지 확인하세요.', k2:'근거가 타당하고 신뢰할 수 있는 내용인지 스스로 점검했는지 살펴보세요.', p1:'상대의 반론 가능성을 고려한 표현이 나왔는지 확인하세요.', p2:'주장을 뒷받침하는 근거를 보완·수정하는 능력이 성장하고 있습니다.', a1:'타당한 근거를 바탕으로 논리적으로 소통하려는 태도가 보입니다.', now:'현재 4단계 수준입니다. 이유와 근거의 타당성을 점검하며 주장하는 연습 중입니다.' },
  5: { grade:'6학년', gradeGroup:'초등학교 5~6학년군', diff:'고급', std:'[6국01-07] 절차와 규칙을 지키고 타당한 이유와 근거를 제시하며 토론한다', cond:'타당한 근거 + 반론에 논리적 재반박까지 나오면 OK', k1:'주장이 가치 있고 실천 가능한지, 이유가 주장과 관련 있는지 확인하세요.', k2:'근거가 이유를 뒷받침하고 출처가 명확한지 점검하세요.', p1:'상대의 반론을 논리적으로 재반박하는 표현이 나왔는지 살펴보세요.', p2:'절차와 규칙을 지키며 합리적으로 소통하는 능력이 성장하고 있습니다.', a1:'상대의 의견을 존중하며 민주적으로 소통하려는 태도가 보입니다.', now:'현재 5단계 수준입니다. 타당한 근거를 바탕으로 반론까지 대응하는 토론 능력을 기르고 있습니다.' }
};

const voiceIds = {
  Rachel: '21m00Tcm4TlvDq8ikWAM',
  Bella: 'EXAVITQu4vr4xnSDxMaL',
  Adam: 'pNInz6obpgDQGcFmaJgB',
  Antoni: 'ErXwobaYiN019PkySvjV',
  Elli: 'MF3mGyEYCl7XYWbV9V6O',
  Josh: 'TxGEqnHWrfWFTfGW9XjX'
};

export default function Home() {
  const [screen, setScreen] = useState(1);
  const [lessonType, setLessonType] = useState(null);
  const [grade, setGrade] = useState(null);
  const [stage, setStage] = useState(1);
  const [claudeKey, setClaudeKey] = useState('');
  const [claudeMode, setClaudeMode] = useState('claude');
  const [elevenKey, setElevenKey] = useState('');
  const [voiceName, setVoiceName] = useState('Rachel');
  const [voiceMode, setVoiceMode] = useState('elevenlabs');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showFb, setShowFb] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  function buildSystemPrompt() {
    const sd = stageData[stage];
    const prompts = {
      '설득하기': `너는 대한민국 남자 초등학생의 설득 대상 역할이다.
수업 유형: 설득하기 / 학년: ${sd.grade} / 단계: ${stage}단계
[역할 결정] 대화가 시작되면 아이에게 오늘 설득할 주제가 무엇인지 먼저 물어봐라. 아이가 주제를 말하면 후보 3개를 제시한다. (실제 인물 1개 + 가상 인물 2개) 형식: "[선생님께] 주제: '○○' / 후보: ①○○(실제) ②○○(가상) ③○○(가상) / 번호 또는 직접 입력해주세요." 선생님이 선택하면 그 인물로 대화 시작.
[말투] 해당 인물 특유의 자연스러운 말투. 2~3문장 이내. 강의 금지.
[수락 기준] ${sd.cond}
[규칙] 정답 알려주기 금지. 아이 말 대신 정리 금지. 칭찬 일색 금지. 처음부터 동의 금지. 수락 조건 달성 시 자연스럽게 수락. 같은 말 3회 반복 시 "한 번 더 생각해보고 다시 말해봐"로 마무리. 성공 시 "[선생님께] 설득 성공! ①같은 주제 다음 단계 ②새 주제 같은 단계 ③종료" 출력. "피드백" 입력 시 역할 멈추고 교육과정 기반 피드백 제공 후 복귀.`,
      '주장하기': `너는 대한민국 남자 초등학생이 주장을 펼치는 대상 역할이다.
수업 유형: 주장하기 / 학년: ${sd.grade} / 단계: ${stage}단계
[역할 결정] 대화가 시작되면 아이에게 오늘 주장할 주제가 무엇인지 먼저 물어봐라. 주제를 말하면 후보 3개 제시. (실제 전문가 1개 + 가상 전문가/권위자 2개) 형식: "[선생님께] 주제: '○○' / 후보: ①○○(실제) ②○○(가상) ③○○(가상) / 번호 또는 직접 입력해주세요."
[말투] 해당 직업·인물 특유의 전문적 말투. 2~3문장 이내. 어려운 용어 금지.
[수락 기준] ${sd.cond}
[규칙] 정답 알려주기 금지. 아이 말 대신 정리 금지. 칭찬 일색 금지. 처음부터 동의 금지. 수락 조건 달성 시 자연스럽게 인정. 같은 말 3회 반복 시 "조금 더 생각해보고 다시 이야기해줘요"로 마무리. 성공 시 "[선생님께] 주장 성공! ①같은 주제 다음 단계 ②새 주제 같은 단계 ③종료" 출력. "피드백" 입력 시 역할 멈추고 교육과정 기반 피드백 제공 후 복귀.`,
      '설명하기': `너는 대한민국 남자 초등학생이 설명하는 대상 역할이다.
수업 유형: 설명하기 / 학년: ${sd.grade} / 단계: ${stage}단계
[역할 결정] 대화가 시작되면 아이에게 오늘 설명할 주제가 무엇인지 먼저 물어봐라. 주제를 말하면 후보 3개 제시. (실제 유형 인물 1개 + 가상 인물 2개. 해당 주제를 전혀 모를 법한 인물로) 형식: "[선생님께] 주제: '○○' / 후보: ①○○(실제 유형) ②○○(가상) ③○○(가상) / 번호 또는 직접 입력해주세요."
[말투] 진짜로 모르는 것처럼 순수하게 반응. 아는 척 절대 금지. 1~2문장 이내.
[이해 기준] ${sd.cond}
[규칙] 아는 척 금지. 아이 말 대신 정리 금지. 처음부터 이해하기 금지. 어려운 말 나오면 "그게 무슨 뜻이야?" 되묻기. 같은 말 3회 반복 시 "조금 다르게 설명해줄 수 있어?"로 유도. 성공 시 "[선생님께] 설명 성공! ①같은 주제 다음 단계 ②새 주제 같은 단계 ③종료" 출력. "피드백" 입력 시 역할 멈추고 교육과정 기반 피드백 제공 후 복귀.`
    };
    return prompts[lessonType];
  }

  async function callClaude(history) {
    setLoading(true);
    try {
      let text;
      if (claudeMode === 'gpt') {
        const res = await fetch('/api/gpt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-gpt-key': claudeKey },
          body: JSON.stringify({ messages: history, system: buildSystemPrompt() })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data.error));
        text = data.choices[0].message.content;
      } else {
        const res = await fetch('/api/claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-claude-key': claudeKey },
          body: JSON.stringify({ messages: history, system: buildSystemPrompt() })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data.error));
        text = data.content[0].text;
      }
      const newMsg = { role: 'assistant', content: text };
      setMessages(prev => [...prev, newMsg]);
      if (text.includes('성공!')) setShowSuccess(true);
      await speakText(text);
      return text;
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '오류: ' + e.message, type: 'sys' }]);
    } finally {
      setLoading(false);
    }
  }

  async function speakText(text) {
    const clean = text.replace(/\[선생님께\][\s\S]*$/gm, '').trim();
    if (!clean) return;
    if (voiceMode === 'elevenlabs' && elevenKey) {
      try {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-eleven-key': elevenKey },
          body: JSON.stringify({ text: clean, voiceId: voiceIds[voiceName] })
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(JSON.stringify(err));
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        audioRef.current = new Audio(url);
        audioRef.current.play();
      } catch (e) {
        setMessages(prev => [...prev, { role: 'assistant', content: '음성 오류: ' + e.message, type: 'sys' }]);
        fallbackSpeak(clean);
      }
    } else {
      fallbackSpeak(clean);
    }
  }

  function fallbackSpeak(text) {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ko-KR';
    utt.rate = 0.95;
    synth.speak(utt);
  }

  async function startChat() {
    setScreen(4);
    setMessages([]);
    setShowSuccess(false);
    setShowFb(false);
    const initHistory = [{ role: 'user', content: '수업을 시작합니다. 시스템 프롬프트대로 첫 인사를 해주세요.' }];
    await callClaude(initHistory);
  }

  async function sendMsg() {
    if (paused || !input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    await callClaude(newHistory);
  }

  function toggleMic() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('크롬 브라우저를 사용해주세요.');
      return;
    }
    if (isRecording) { recognitionRef.current?.stop(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'ko-KR';
    rec.onstart = () => setIsRecording(true);
    rec.onresult = (e) => { setInput(e.results[0][0].transcript); };
    rec.onend = () => setIsRecording(false);
    rec.onerror = () => setIsRecording(false);
    recognitionRef.current = rec;
    rec.start();
  }

  function togglePause() {
    setPaused(p => {
      if (!p) { window.speechSynthesis?.cancel(); audioRef.current?.pause(); }
      else { audioRef.current?.play(); }
      return !p;
    });
  }

  function endChat() {
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    recognitionRef.current?.stop();
    setScreen(1);
    setMessages([]);
    setLessonType(null);
    setGrade(null);
    setStage(1);
    setShowSuccess(false);
    setShowFb(false);
    setPaused(false);
  }

  async function nextStage() {
    const ns = Math.min(stage + 1, 5);
    setStage(ns);
    setShowSuccess(false);
    const cont = [...messages, { role: 'user', content: `${ns}단계로 올라갔습니다. 같은 주제로 이어서 진행해주세요.` }];
    setMessages(cont);
    await callClaude(cont);
  }

  async function newTopic() {
    setShowSuccess(false);
    const init = [{ role: 'user', content: '새로운 주제로 다시 시작합니다. 시스템 프롬프트대로 첫 인사를 해주세요.' }];
    setMessages([]);
    await callClaude(init);
  }

  const sd = stageData[stage];
  const typeEmoji = { '설득하기': '🤝', '주장하기': '📢', '설명하기': '💬' };

  const canStart = claudeKey && (voiceMode === 'browser' || elevenKey);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap');
        :root{--teal:#1D9E75;--teal-l:#E1F5EE;--teal-d:#0F6E56;--coral:#D85A30;--coral-l:#FAECE7;--blue:#378ADD;--blue-l:#E6F1FB;--amber:#BA7517;--amber-l:#FAEEDA;--g50:#F8F7F4;--g100:#F1EFE8;--g200:#D3D1C7;--g400:#888780;--g600:#5F5E5A;--g900:#1A1A18;--r:12px;--rs:8px;}
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Nanum Gothic',sans-serif;background:var(--g50);color:var(--g900);min-height:100vh;}
        .app{max-width:680px;margin:0 auto;padding:1.5rem 1rem;}
        .hd{text-align:center;margin-bottom:2rem;}
        .logo{font-size:13px;font-weight:700;letter-spacing:.1em;color:var(--teal);text-transform:uppercase;margin-bottom:8px;}
        h1{font-size:24px;font-weight:800;line-height:1.3;}
        .steps{display:flex;gap:6px;margin-bottom:1.5rem;}
        .step{flex:1;height:3px;border-radius:2px;background:var(--g200);}
        .step.on{background:var(--teal);}
        .lbl{font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--g400);text-transform:uppercase;margin-bottom:10px;}
        .cards{display:grid;gap:10px;margin-bottom:1.5rem;}
        .card{background:white;border:1.5px solid var(--g200);border-radius:var(--r);padding:1rem 1.25rem;cursor:pointer;display:flex;align-items:center;gap:14px;transition:all .15s;}
        .card:hover{border-color:var(--g400);}
        .card.sel{border-color:var(--teal);background:var(--teal-l);}
        .icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:font-size:20px;flex-shrink:0;font-size:20px;justify-content:center;}
        .icon.p{background:var(--coral-l);}
        .icon.a{background:var(--blue-l);}
        .icon.e{background:var(--teal-l);}
        .cname{font-size:15px;font-weight:700;margin-bottom:2px;}
        .cdesc{font-size:13px;color:var(--g600);}
        .badge{display:inline-block;font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;margin-bottom:3px;}
        .bp{background:var(--coral-l);color:var(--coral);}
        .ba{background:var(--blue-l);color:var(--blue);}
        .be{background:var(--teal-l);color:var(--teal-d);}
        .grades{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:1.5rem;}
        .gb{background:white;border:1.5px solid var(--g200);border-radius:var(--rs);padding:12px 0;text-align:center;cursor:pointer;transition:all .15s;}
        .gb:hover{border-color:var(--g400);}
        .gb.sel{border-color:var(--teal);background:var(--teal-l);}
        .gn{font-size:20px;font-weight:800;}
        .gl{font-size:11px;color:var(--g600);}
        .sbox{background:white;border:1.5px solid var(--g200);border-radius:var(--r);padding:1.25rem;margin-bottom:1.5rem;}
        .stop{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
        .slbl{font-size:14px;font-weight:700;}
        .sctrl{display:flex;align-items:center;gap:10px;}
        .snum{font-size:26px;font-weight:800;color:var(--teal);min-width:32px;text-align:center;}
        .sarr{width:30px;height:30px;border:1.5px solid var(--g200);border-radius:8px;background:none;cursor:pointer;font-size:16px;color:var(--g600);display:flex;align-items:center;justify-content:center;transition:all .15s;}
        .sarr:hover{border-color:var(--teal);color:var(--teal);}
        .sinfo{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .si{background:var(--g50);border-radius:var(--rs);padding:10px 12px;}
        .sif{grid-column:1/-1;}
        .silbl{font-size:10px;font-weight:700;color:var(--g400);letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px;}
        .sival{font-size:13px;line-height:1.4;}
        .sival.t{color:var(--teal-d);font-weight:700;}
        .abox{background:white;border:1.5px solid var(--g200);border-radius:var(--r);padding:1.25rem;margin-bottom:1.5rem;}
        .arow{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;}
        .abtn{padding:10px;border:1.5px solid var(--g200);border-radius:var(--rs);background:none;font-size:13px;font-weight:700;color:var(--g600);cursor:pointer;font-family:'Nanum Gothic',sans-serif;transition:all .15s;}
        .abtn:hover{border-color:var(--g400);}
        .abtn.sel{border-color:var(--teal);background:var(--teal-l);color:var(--teal-d);}
        .ainp{width:100%;height:40px;padding:0 12px;border:1.5px solid var(--g200);border-radius:var(--rs);font-size:13px;font-family:'Nanum Gothic',sans-serif;background:var(--g50);color:var(--g900);margin-bottom:10px;}
        .ainp:focus{outline:none;border-color:var(--teal);}
        .vgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
        .btnm{width:100%;padding:14px;background:var(--teal);border:none;border-radius:var(--r);color:white;font-size:15px;font-weight:700;cursor:pointer;font-family:'Nanum Gothic',sans-serif;}
        .btnm:disabled{opacity:.35;cursor:not-allowed;}
        .btnm:hover:not(:disabled){opacity:.9;}
        .bbk{background:none;border:none;color:var(--g600);font-size:13px;cursor:pointer;margin-bottom:1.25rem;padding:0;font-family:'Nanum Gothic',sans-serif;}
        .chat-wrap{max-width:680px;margin:0 auto;padding:1rem;display:flex;flex-direction:column;min-height:100vh;}
        .cbar{background:white;border:1.5px solid var(--g200);border-radius:var(--r);padding:10px 14px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;gap:8px;}
        .cleft{display:flex;align-items:center;gap:10px;}
        .cav{width:34px;height:34px;border-radius:50%;background:var(--teal-l);display:flex;align-items:center;justify-content:center;font-size:16px;}
        .cn{font-size:13px;font-weight:700;}
        .cd{font-size:11px;color:var(--g600);}
        .cbtns{display:flex;gap:6px;}
        .cbtn{background:none;border:1.5px solid var(--g200);border-radius:var(--rs);padding:5px 10px;font-size:12px;font-weight:700;color:var(--g600);cursor:pointer;font-family:'Nanum Gothic',sans-serif;white-space:nowrap;}
        .cbtn.fb{border-color:var(--blue);color:var(--blue);}
        .cbtn.pa{border-color:var(--amber);color:var(--amber);}
        .cbtn.st{border-color:#E24B4A;color:#A32D2D;}
        .carea{background:var(--g100);border-radius:var(--r);padding:1rem;min-height:340px;max-height:420px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;margin-bottom:10px;}
        .bbl{max-width:80%;padding:10px 14px;font-size:14px;line-height:1.6;}
        .bbl.ai{background:white;border:1px solid var(--g200);color:var(--g900);align-self:flex-start;border-radius:4px 14px 14px 14px;}
        .bbl.user{background:var(--teal);color:white;align-self:flex-end;border-radius:14px 14px 4px 14px;}
        .bbl.sys{background:var(--amber-l);border:1px solid #FAC775;color:var(--amber);align-self:center;font-size:12px;font-weight:700;text-align:center;max-width:90%;border-radius:var(--rs);}
        .bbl.thinking{background:white;border:1px solid var(--g200);align-self:flex-start;color:var(--g400);font-size:13px;}
        .dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--g400);margin:0 2px;animation:bounce 1.2s infinite;}
        .dot:nth-child(2){animation-delay:.2s;}
        .dot:nth-child(3){animation-delay:.4s;}
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        .irow{display:flex;gap:8px;align-items:center;margin-bottom:10px;}
        .mic{width:48px;height:48px;border-radius:50%;background:var(--teal-l);border:1.5px solid var(--teal);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;font-size:20px;}
        .mic.rec{background:#FCEBEB;border-color:#E24B4A;animation:pulse 1s infinite;}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        .tinp{flex:1;height:48px;padding:0 14px;border:1.5px solid var(--g200);border-radius:var(--r);font-size:14px;font-family:'Nanum Gothic',sans-serif;color:var(--g900);background:white;}
        .tinp:focus{outline:none;border-color:var(--teal);}
        .sndbtn{height:48px;padding:0 16px;background:var(--teal);border:none;border-radius:var(--r);color:white;font-size:14px;font-weight:700;cursor:pointer;font-family:'Nanum Gothic',sans-serif;}
        .sucbox{background:var(--teal-l);border:1.5px solid var(--teal);border-radius:var(--r);padding:1rem 1.25rem;margin-bottom:10px;}
        .sucttl{font-size:15px;font-weight:800;color:var(--teal-d);margin-bottom:10px;}
        .sucgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .sucbtn{padding:10px;border:1.5px solid var(--teal);border-radius:var(--rs);background:white;color:var(--teal-d);font-size:13px;font-weight:700;cursor:pointer;font-family:'Nanum Gothic',sans-serif;text-align:center;}
        .sucbtn.end{grid-column:1/-1;border-color:var(--g200);color:var(--g600);}
        .fbp{background:white;border:1.5px solid var(--g200);border-radius:var(--r);padding:1.25rem;margin-bottom:10px;}
        .fbh{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--g100);}
        .fbht{font-size:15px;font-weight:800;}
        .fbclose{background:none;border:none;font-size:18px;cursor:pointer;color:var(--g400);}
        .fbmeta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;}
        .fbmi{background:var(--g50);border-radius:var(--rs);padding:8px 10px;}
        .fbmif{grid-column:1/-1;}
        .fbml{font-size:10px;font-weight:700;color:var(--g400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px;}
        .fbmv{font-size:13px;line-height:1.4;}
        .fbsec{margin-bottom:14px;}
        .fbsh{font-size:11px;font-weight:700;color:var(--g400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;}
        .fbi{display:flex;gap:10px;padding:8px 10px;background:var(--g50);border-radius:var(--rs);margin-bottom:6px;}
        .fbil{font-size:12px;color:var(--g600);min-width:80px;padding-top:1px;flex-shrink:0;}
        .fbiv{font-size:13px;line-height:1.5;}
        .lvl{display:flex;gap:4px;margin-bottom:10px;}
        .ls{flex:1;height:5px;border-radius:3px;background:var(--g200);}
        .ls.on{background:var(--teal);}
        .fbnow{background:var(--teal-l);border-radius:var(--rs);padding:10px 14px;font-size:13px;color:var(--teal-d);line-height:1.5;}
        .pbar{background:var(--amber-l);border:1.5px solid var(--amber);border-radius:var(--rs);padding:8px 14px;font-size:13px;font-weight:700;color:var(--amber);text-align:center;margin-bottom:8px;}
      `}</style>

      {screen !== 4 && (
        <div className="app">
          {screen === 1 && (
            <div>
              <div className="hd">
                <div className="logo">말하기 수업 AI</div>
                <h1>오늘 수업을<br/>선택해주세요</h1>
              </div>
              <div className="steps">
                {[1,2,3,4].map(i => <div key={i} className={`step${i<=1?' on':''}`}/>)}
              </div>
              <div className="lbl">수업 유형</div>
              <div className="cards">
                {[['설득하기','p','🤝','대상 설득하기','원하는 것을 대상에게 설득하는 상황'],['주장하기','a','📢','전문가에게 주장하기','실제·가상 전문가에게 주장을 펼치는 상황'],['설명하기','e','💬','친숙한 인물에게 설명하기','주제를 모르는 친숙한 인물에게 설명하는 상황']].map(([type,cls,emoji,name,desc]) => (
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
              <button className="btnm" disabled={!lessonType} onClick={()=>setScreen(2)}>다음 →</button>
            </div>
          )}

          {screen === 2 && (
            <div>
              <div className="steps">{[1,2,3,4].map(i=><div key={i} className={`step${i<=2?' on':''}`}/>)}</div>
              <button className="bbk" onClick={()=>setScreen(1)}>← 이전</button>
              <div className="lbl">학년 선택</div>
              <div className="grades">
                {[2,3,4,5,6].map(g=>(
                  <div key={g} className={`gb${grade===g?' sel':''}`} onClick={()=>{setGrade(g);setStage(g-1);}}>
                    <div className="gn">{g}</div><div className="gl">학년</div>
                  </div>
                ))}
              </div>
              {grade && (
                <div className="sbox">
                  <div className="stop">
                    <span className="slbl">단계 설정</span>
                    <div className="sctrl">
                      <button className="sarr" onClick={()=>setStage(s=>Math.max(1,s-1))}>−</button>
                      <span className="snum">{stage}</span>
                      <button className="sarr" onClick={()=>setStage(s=>Math.min(5,s+1))}>+</button>
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

          {screen === 3 && (
            <div>
              <div className="steps">{[1,2,3,4].map(i=><div key={i} className={`step${i<=3?' on':''}`}/>)}</div>
              <button className="bbk" onClick={()=>setScreen(2)}>← 이전</button>
              <div className="lbl">AI 설정</div>
              <div className="abox">
                <div className="lbl" style={{marginBottom:8}}>대화 AI 선택</div>
                <div className="arow">
                  <button className={`abtn${claudeMode==='claude'?' sel':''}`} onClick={()=>setClaudeMode('claude')}>Claude (Anthropic)</button>
                  <button className={`abtn${claudeMode==='gpt'?' sel':''}`} onClick={()=>setClaudeMode('gpt')}>GPT (OpenAI)</button>
                </div>
                <div className="lbl" style={{marginBottom:8}}>{claudeMode==='claude'?'Claude API 키':'GPT API 키'}</div>
                <input className="ainp" type="password" placeholder={claudeMode==='claude'?'sk-ant-api03-...':'sk-proj-...'} value={claudeKey} onChange={e=>setClaudeKey(e.target.value)}/>
                <div className="lbl" style={{marginBottom:8}}>음성 출력</div>
                <div className="arow" style={{marginBottom:10}}>
                  <button className={`abtn${voiceMode==='browser'?' sel':''}`} onClick={()=>setVoiceMode('browser')}>브라우저 기본 (무료)</button>
                  <button className={`abtn${voiceMode==='elevenlabs'?' sel':''}`} onClick={()=>setVoiceMode('elevenlabs')}>ElevenLabs (자연스러운)</button>
                </div>
                {voiceMode === 'elevenlabs' && (
                  <>
                    <div className="lbl" style={{marginBottom:8}}>ElevenLabs API 키</div>
                    <input className="ainp" type="password" placeholder="sk_..." value={elevenKey} onChange={e=>setElevenKey(e.target.value)}/>
                    <div className="lbl" style={{marginBottom:8}}>목소리 선택</div>
                    <div className="vgrid">
                      {Object.keys(voiceIds).map(v=>(
                        <button key={v} className={`abtn${voiceName===v?' sel':''}`} onClick={()=>setVoiceName(v)}>{v}</button>
                      ))}
                    </div>
                    <div style={{fontSize:11,color:'var(--g400)',marginTop:8}}>※ 무료 월 10,000자 · elevenlabs.io</div>
                  </>
                )}
              </div>
              <button className="btnm" disabled={!canStart} onClick={startChat}>수업 시작</button>
            </div>
          )}
        </div>
      )}

      {screen === 4 && (
        <div className="chat-wrap">
          <div className="cbar">
            <div className="cleft">
              <div className="cav">{typeEmoji[lessonType]}</div>
              <div>
                <div className="cn">{lessonType} 대상</div>
                <div className="cd">{lessonType} · {sd.grade} · {stage}단계</div>
              </div>
            </div>
            <div className="cbtns">
              <button className="cbtn fb" onClick={()=>setShowFb(f=>!f)}>피드백</button>
              <button className="cbtn pa" onClick={togglePause}>{paused?'재개':'일시정지'}</button>
              <button className="cbtn st" onClick={endChat}>중지</button>
            </div>
          </div>

          {paused && <div className="pbar">일시정지 중 — 재개하려면 일시정지 버튼을 다시 누르세요</div>}

          <div className="carea" ref={chatRef}>
            {messages.map((m, i) => (
              <div key={i} className={`bbl ${m.type==='sys'?'sys':m.role==='user'?'user':'ai'}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bbl thinking">
                <span className="dot"/><span className="dot"/><span className="dot"/>
              </div>
            )}
          </div>

          {showSuccess && (
            <div className="sucbox">
              <div className="sucttl">🎉 성공! 다음을 선택해주세요.</div>
              <div className="sucgrid">
                <div className="sucbtn" onClick={nextStage}>같은 주제로 다음 단계</div>
                <div className="sucbtn" onClick={newTopic}>새 주제, 같은 단계</div>
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
              <div className="fbsec">
                <div className="fbsh">지식·이해 범주</div>
                <div className="fbi"><div className="fbil">주장 명확성</div><div className="fbiv">{sd.k1}</div></div>
                <div className="fbi"><div className="fbil">이유 적절성</div><div className="fbiv">{sd.k2}</div></div>
              </div>
              <div className="fbsec">
                <div className="fbsh">과정·기능 범주</div>
                <div className="fbi"><div className="fbil">상대 고려</div><div className="fbiv">{sd.p1}</div></div>
                <div className="fbi"><div className="fbil">대화 조정</div><div className="fbiv">{sd.p2}</div></div>
              </div>
              <div className="fbsec">
                <div className="fbsh">가치·태도 범주</div>
                <div className="fbi"><div className="fbil">참여 태도</div><div className="fbiv">{sd.a1}</div></div>
              </div>
              <div className="fbsec">
                <div className="fbsh">현재 수준</div>
                <div className="lvl">{[1,2,3,4,5].map(i=><div key={i} className={`ls${i<=stage?' on':''}`}/>)}</div>
                <div className="fbnow">{sd.now}</div>
              </div>
            </div>
          )}

          <div className="irow">
            <div className={`mic${isRecording?' rec':''}`} onClick={toggleMic}>🎤</div>
            <input className="tinp" placeholder="여기에 입력하거나 마이크를 눌러 말해보세요" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()}/>
            <button className="sndbtn" onClick={sendMsg}>전송</button>
          </div>
        </div>
      )}
    </>
  );
}

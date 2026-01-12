import React, { useState, useEffect } from 'react';
import { assemble } from 'es-hangul';



// --- データ定義 ---
const INITIALS = [
  { char: 'ㄱ', sound: 'k/g', kana: 'カ/ガ' },
  { char: 'ㄲ', sound: 'kk',  kana: 'ッガ' },
  { char: 'ㄴ', sound: 'n',   kana: 'ナ' },
  { char: 'ㄷ', sound: 't/d', kana: 'タ/ダ' },
  { char: 'ㄸ', sound: 'tt',  kana: 'ッタ' },
  { char: 'ㄹ', sound: 'r/l', kana: 'ラ' },
  { char: 'ㅁ', sound: 'm',   kana: 'マ' },
  { char: 'ㅂ', sound: 'p/b', kana: 'パ/バ' },
  { char: 'ㅃ', sound: 'pp',  kana: 'ッパ' },
  { char: 'ㅅ', sound: 's',   kana: 'サ' },
  { char: 'ㅆ', sound: 'ss',  kana: 'ッサ' },
  { char: 'ㅇ', sound: '-',   kana: '無' },
  { char: 'ㅈ', sound: 'ch/j',kana: 'チャ' },
  { char: 'ㅉ', sound: 'jj',  kana: 'ッチャ' },
  { char: 'ㅊ', sound: 'ch',  kana: 'チャ' },
  { char: 'ㅋ', sound: 'k',   kana: 'カ' },
  { char: 'ㅌ', sound: 't',   kana: 'タ' },
  { char: 'ㅍ', sound: 'p',   kana: 'パ' },
  { char: 'ㅎ', sound: 'h',   kana: 'ハ' }
];

const VOWELS = [
  // 基本母音
  { char: 'ㅏ', sound: 'a',   kana: 'ア', type: 'basic' },
  { char: 'ㅑ', sound: 'ya',  kana: 'ヤ', type: 'basic' },
  { char: 'ㅓ', sound: 'eo',  kana: 'オ(開)', type: 'basic' },
  { char: 'ㅕ', sound: 'yeo', kana: 'ヨ(開)', type: 'basic' },
  { char: 'ㅗ', sound: 'o',   kana: 'オ(丸)', type: 'basic' },
  { char: 'ㅛ', sound: 'yo',  kana: 'ヨ(丸)', type: 'basic' },
  { char: 'ㅜ', sound: 'u',   kana: 'ウ(丸)', type: 'basic' },
  { char: 'ㅠ', sound: 'yu',  kana: 'ユ', type: 'basic' },
  { char: 'ㅡ', sound: 'eu',  kana: 'ウ(横)', type: 'basic' },
  { char: 'ㅣ', sound: 'i',   kana: 'イ', type: 'basic' },
  // 複合母音
  { char: 'ㅐ', sound: 'ae',  kana: 'エ', type: 'complex' },
  { char: 'ㅒ', sound: 'yae', kana: 'イェ', type: 'complex' },
  { char: 'ㅔ', sound: 'e',   kana: 'エ', type: 'complex' },
  { char: 'ㅖ', sound: 'ye',  kana: 'イェ', type: 'complex' },
  { char: 'ㅘ', sound: 'wa',  kana: 'ワ', type: 'complex' },
  { char: 'ㅙ', sound: 'wae', kana: 'ウェ', type: 'complex' },
  { char: 'ㅚ', sound: 'oe',  kana: 'ウェ', type: 'complex' },
  { char: 'ㅝ', sound: 'wo',  kana: 'ウォ', type: 'complex' },
  { char: 'ㅞ', sound: 'we',  kana: 'ウェ', type: 'complex' },
  { char: 'ㅟ', sound: 'wi',  kana: 'ウィ', type: 'complex' },
  { char: 'ㅢ', sound: 'ui',  kana: 'ウイ', type: 'complex' }
];

const PATCHIMS = [
  '',
  'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ',
  'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ',
  'ㅌ', 'ㅍ', 'ㅎ'
];

const SOUND_GROUPS = {
  'k':  { color: '#ff9999', chars: ['ㄱ', 'ㄲ', 'ㅋ', 'ㄳ', 'ㄺ'], label: 'K (ック)' },
  'n':  { color: '#ffcc99', chars: ['ㄴ', 'ㄵ', 'ㄶ'], label: 'N (ン)' },
  't':  { color: '#ffff99', chars: ['ㄷ', 'ㅌ', 'ㅅ', 'ㅆ', 'ㅈ', 'ㅊ', 'ㅎ'], label: 'T (ット)' },
  'l':  { color: '#99ff99', chars: ['ㄹ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㅀ'], label: 'L (ル)' },
  'm':  { color: '#99ccff', chars: ['ㅁ', 'ㄻ'], label: 'M (ム)' },
  'p':  { color: '#cc99ff', chars: ['ㅂ', 'ㅍ', 'ㅄ', 'ㄿ'], label: 'P (ップ)' },
  'ng': { color: '#ff99cc', chars: ['ㅇ'], label: 'NG (ン)' },
  'none': { color: '#eeeeee', chars: [''], label: 'なし' }
};

const getGroupStyle = (char) => {
  for (const groupKey in SOUND_GROUPS) {
    if (SOUND_GROUPS[groupKey].chars.includes(char)) {
      return SOUND_GROUPS[groupKey];
    }
  }
  return SOUND_GROUPS['none'];
};

function App() {
  const [initial, setInitial] = useState('ㄱ');
  const [vowel, setVowel] = useState('ㅏ');
  const [patchim, setPatchim] = useState('');

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('initial');

  // 作った単語・文章を保存しておく場所
  const [sentence, setSentence] = useState('');

  const completeChar = assemble([initial, vowel, patchim]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const krVoice = voices.find(v => v.lang.includes('ko'));
    if (krVoice) utterance.voice = krVoice;
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleInitialClick = (char) => {
    setInitial(char);
    const nextText = assemble([char, vowel, patchim]);
    speak(nextText);
    if(isMobile) setTimeout(()=> setActiveTab('vowel'), 300);
  };

  const handleVowelClick = (char) => {
    setVowel(char);
    const nextText = assemble([initial, char, patchim]);
    speak(nextText);
    if(isMobile) setTimeout(()=> setActiveTab('patchim'), 300);
  };

  const handlePatchimClick = (char) => {
    setPatchim(char);
    const nextText = assemble([initial, vowel, char]);
    speak(nextText);
  };

  // 文字を文章に追加
  const addToSentence = () => {
    setSentence(prev => prev + completeChar);
  };

  // 文章を一文字消す
  const backspaceSentence = () => {
    setSentence(prev => prev.slice(0, -1));
  };

  const getButtonStyle = (isSelected, colorBase, isPatchim = false, groupColor = null) => {
    const borderColor = isPatchim && groupColor ? groupColor : (isSelected ? colorBase : '#ddd');
    const borderWidth = isPatchim ? '3px' : (isSelected ? '2px' : '1px');
    const background = isSelected ? (isPatchim && groupColor ? groupColor : colorBase) : '#fff';
    const textColor = isSelected && !isPatchim ? '#fff' : '#333';
    return {
      width: isMobile ? '50px' : '55px',
      height: isMobile ? '50px' : '55px',
      border: `${borderWidth} solid ${borderColor}`,
      background: background,
      color: textColor,
      borderRadius: '8px',
      cursor: 'pointer',
      margin: '2px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      transition: 'all 0.1s', fontSize: '13px'
    };
  };

  const tabButtonStyle = (tabName, color) => ({
    flex: 1, padding: '10px', border: 'none',
    borderBottom: activeTab === tabName ? `4px solid ${color}` : '4px solid #eee',
    background: 'white', fontWeight: 'bold', color: activeTab === tabName ? '#333' : '#bbb',
    cursor: 'pointer', fontSize: '14px'
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px', fontFamily: '"Helvetica Neue", sans-serif', textAlign: 'center', backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '20px',
        alignItems: 'flex-start'
      }}>

        {/* --- 左（上）：文字組み立てエリア --- */}
        <div style={{ flex: 1, width: '100%' }}>

          <div style={{ background: 'white', padding: '15px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '15px', position: 'sticky', top: '10px', zIndex: 100 }}>
            <div style={{ fontSize: '70px', fontWeight: 'bold', lineHeight: 1, marginBottom:'10px' }}>{completeChar}</div>

            <div style={{ display:'flex', justifyContent:'center', gap:'10px' }}>
              <button onClick={() => speak(completeChar)} style={{ padding: '8px 20px', borderRadius: '20px', border:'none', background:'#333', color:'white', cursor:'pointer', fontWeight:'bold' }}>
                🔊 再生
              </button>

              <button onClick={addToSentence} style={{ padding: '8px 20px', borderRadius: '20px', border:'none', background:'#2196f3', color:'white', cursor:'pointer', fontWeight:'bold', boxShadow:'0 4px 0 #1565c0' }}>
                ⬇️ 追加
              </button>
            </div>
          </div>

          {isMobile && (
            <div style={{ display: 'flex', marginBottom: '10px', background: 'white', borderRadius: '10px' }}>
              <button onClick={() => setActiveTab('initial')} style={tabButtonStyle('initial', '#2196f3')}>① 子音</button>
              <button onClick={() => setActiveTab('vowel')} style={tabButtonStyle('vowel', '#f44336')}>② 母音</button>
              <button onClick={() => setActiveTab('patchim')} style={tabButtonStyle('patchim', '#4caf50')}>③ パッチム</button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'column', gap: '15px' }}>
            {(!isMobile || activeTab === 'initial') && (
              <div style={{ background: '#e3f2fd', padding: '10px', borderRadius: '15px' }}>
                {!isMobile && <h3 style={{ color: '#1976d2', marginTop: 0, fontSize:'14px' }}>① 子音</h3>}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {INITIALS.map((item) => (
                    <button key={item.char} onClick={() => handleInitialClick(item.char)} style={getButtonStyle(initial === item.char, '#2196f3')}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{item.char}</span>
                      <span style={{ fontSize: '9px', opacity: 0.8 }}>{item.sound}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(!isMobile || activeTab === 'vowel') && (
              <div style={{ background: '#ffebee', padding: '10px', borderRadius: '15px' }}>
                {!isMobile && <h3 style={{ color: '#d32f2f', marginTop: 0, fontSize:'14px' }}>② 母音</h3>}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {VOWELS.map((item, index) => {
                    const isFirstComplex = index === 10;
                    return (
                      <React.Fragment key={item.char}>
                        {isFirstComplex && <div style={{ width: '100%', height: '1px', borderBottom: '2px dashed #ffcdd2', margin: '5px 0' }}></div>}
                        <button onClick={() => handleVowelClick(item.char)} style={getButtonStyle(vowel === item.char, '#f44336')}>
                          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{item.char}</span>
                          <span style={{ fontSize: '9px', opacity: 0.8 }}>{item.kana}</span>
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {(!isMobile || activeTab === 'patchim') && (
              <div style={{ background: '#f1f8e9', padding: '10px', borderRadius: '15px' }}>
                {!isMobile && <h3 style={{ color: '#388e3c', marginTop: 0, fontSize:'14px' }}>③ パッチム</h3>}
                 <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3px', marginBottom: '5px', fontSize: '9px' }}>
                  {Object.entries(SOUND_GROUPS).map(([key, group]) => ( key !== 'none' && (<div key={key} style={{ display: 'flex', alignItems: 'center', gap: '2px', background: group.color, padding:'1px 3px', borderRadius:'3px', border:'1px solid #ccc' }}><span style={{ fontWeight:'bold' }}>{group.label}</span></div>)))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {PATCHIMS.map((char) => {
                    const group = getGroupStyle(char);
                    return <button key={char} onClick={() => handlePatchimClick(char)} style={getButtonStyle(patchim === char, null, true, group.color)}><span style={{ fontSize: '16px', fontWeight: 'bold' }}>{char || '無'}</span><span style={{ fontSize: '9px', color: '#666' }}>{char ? group.label.split(' ')[0] : '-'}</span></button>
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- 右（下）：📝 単語・文章メモエリア --- */}
        <div style={{
          flex: isMobile ? 'none' : '0 0 350px',
          width: '100%',
          background: '#fff',
          borderRadius: '20px',
          border: '2px solid #eee',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ marginTop: 0, borderBottom: '2px solid #eee', paddingBottom: '10px' }}>📝 単語・文章メモ</h3>

          <div style={{ marginBottom: '20px' }}>
            <textarea
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              placeholder="ここに文字が追加されます"
              style={{
                width: '100%', height: '100px',
                fontSize: '24px', padding: '10px',
                borderRadius: '10px', border: '2px solid #b3e5fc',
                resize: 'none', fontFamily: '"Helvetica Neue", sans-serif',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => speak(sentence)} style={{ padding: '15px', borderRadius: '10px', border:'none', background:'#ffdd59', color:'#333', cursor:'pointer', fontWeight:'bold', fontSize:'18px', boxShadow:'0 3px 0 #fbc02d' }}>
              🔊 まとめて再生
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={backspaceSentence} style={{ flex: 1, padding: '10px', borderRadius: '10px', border:'none', background:'#eee', color:'#333', cursor:'pointer', fontWeight:'bold' }}>
                ⌫ 1文字消す
              </button>
              <button onClick={() => setSentence('')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border:'none', background:'#eee', color:'#d32f2f', cursor:'pointer', fontWeight:'bold' }}>
                🗑️ 全消去
              </button>
            </div>
          </div>

          <div style={{ marginTop: '20px', fontSize: '12px', color: '#888', textAlign: 'left', lineHeight: '1.5' }}>
            <p>💡 <strong>使い方：</strong></p>
            <ol style={{ paddingLeft: '20px', margin: 0 }}>
              <li>左で文字を組み立てる</li>
              <li>「⬇️ 追加」ボタンを押す</li>
              <li>文字がここに貯まっていく</li>
              <li>「まとめて再生」で発音チェック！</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { assemble } from 'es-hangul';

// --- データ定義（変更なし） ---
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
  // --- 基本母音 ---
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
  // --- 複合母音 ---
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

  // 現在の組み合わせ
  const completeChar = assemble([initial, vowel, patchim]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 音声再生関数
  const speak = (text) => {
    window.speechSynthesis.cancel(); // 前の音を消す
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  // 子音をクリックしたとき
  const handleInitialClick = (char) => {
    setInitial(char);
    // 今選ばれている他のパーツと合体させて、すぐに鳴らす！
    const nextText = assemble([char, vowel, patchim]);
    speak(nextText);

    if(isMobile) setTimeout(()=> setActiveTab('vowel'), 300);
  };

  // 母音をクリックしたとき
  const handleVowelClick = (char) => {
    setVowel(char);
    const nextText = assemble([initial, char, patchim]);
    speak(nextText);

    if(isMobile) setTimeout(()=> setActiveTab('patchim'), 300);
  };

  // パッチムをクリックしたとき
  const handlePatchimClick = (char) => {
    setPatchim(char);
    const nextText = assemble([initial, vowel, char]);
    speak(nextText);
  };

  const getButtonStyle = (isSelected, colorBase, isPatchim = false, groupColor = null) => {
    const borderColor = isPatchim && groupColor ? groupColor : (isSelected ? colorBase : '#ddd');
    const borderWidth = isPatchim ? '3px' : (isSelected ? '2px' : '1px');
    const background = isSelected ? (isPatchim && groupColor ? groupColor : colorBase) : '#fff';
    const textColor = isSelected && !isPatchim ? '#fff' : '#333';

    return {
      width: isMobile ? '55px' : '60px',
      height: isMobile ? '55px' : '60px',
      border: `${borderWidth} solid ${borderColor}`,
      background: background,
      color: textColor,
      borderRadius: '10px',
      cursor: 'pointer',
      margin: '3px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'all 0.1s',
      fontSize: '14px'
    };
  };

  const tabButtonStyle = (tabName, color) => ({
    flex: 1, padding: '12px', border: 'none',
    borderBottom: activeTab === tabName ? `4px solid ${color}` : '4px solid #eee',
    background: 'white', fontWeight: 'bold',
    color: activeTab === tabName ? '#333' : '#bbb',
    cursor: 'pointer', fontSize: '16px'
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px', fontFamily: '"Helvetica Neue", sans-serif', textAlign: 'center', backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 結果表示（常に上部に固定） */}
      <div style={{ background: 'white', padding: '10px 30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', margin: '0 auto 10px auto', position: 'sticky', top: '10px', zIndex: 100 }}>
        <div style={{ fontSize: '80px', fontWeight: 'bold', lineHeight: 1 }}>{completeChar}</div>
        <button onClick={() => speak(completeChar)} style={{ marginTop: '5px', padding: '5px 20px', borderRadius: '15px', border:'none', background:'#333', color:'white', cursor:'pointer'}}>🔊 再生</button>
      </div>

      {/* スマホ用タブ */}
      {isMobile && (
        <div style={{ display: 'flex', marginBottom: '10px', background: 'white', borderRadius: '10px' }}>
          <button onClick={() => setActiveTab('initial')} style={tabButtonStyle('initial', '#2196f3')}>① 子音</button>
          <button onClick={() => setActiveTab('vowel')} style={tabButtonStyle('vowel', '#f44336')}>② 母音</button>
          <button onClick={() => setActiveTab('patchim')} style={tabButtonStyle('patchim', '#4caf50')}>③ パッチム</button>
        </div>
      )}

      {/* コンテンツエリア */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: '20px', paddingBottom: '50px' }}>

        {/* 子音エリア */}
        {(!isMobile || activeTab === 'initial') && (
          <div style={{ background: '#e3f2fd', padding: '10px', borderRadius: '15px', flex: 1 }}>
            {!isMobile && <h3 style={{ color: '#1976d2', marginTop: 0 }}>① 子音</h3>}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {INITIALS.map((item) => (
                <button
                  key={item.char}
                  // ★ここで、さっき作った専用関数を呼ぶ
                  onClick={() => handleInitialClick(item.char)}
                  style={getButtonStyle(initial === item.char, '#2196f3')}
                >
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.char}</span>
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>{item.sound}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 母音エリア */}
        {(!isMobile || activeTab === 'vowel') && (
          <div style={{ background: '#ffebee', padding: '10px', borderRadius: '15px', flex: 1 }}>
            {!isMobile && <h3 style={{ color: '#d32f2f', marginTop: 0 }}>② 母音（基本→複合）</h3>}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {VOWELS.map((item, index) => {
                const isFirstComplex = index === 10;
                return (
                  <React.Fragment key={item.char}>
                    {isFirstComplex && (
                      <div style={{ width: '100%', height: '1px', borderBottom: '2px dashed #ffcdd2', margin: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: '#ffebee', padding: '0 10px', color: '#e57373', fontSize: '10px', fontWeight: 'bold' }}>ここから複合母音</span>
                      </div>
                    )}
                    <button
                      // ★ここも専用関数を呼ぶ
                      onClick={() => handleVowelClick(item.char)}
                      style={getButtonStyle(vowel === item.char, '#f44336')}
                    >
                      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.char}</span>
                      <span style={{ fontSize: '10px', opacity: 0.8 }}>{item.kana}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* パッチムエリア */}
        {(!isMobile || activeTab === 'patchim') && (
          <div style={{ background: '#f1f8e9', padding: '10px', borderRadius: '15px', flex: 1 }}>
            {!isMobile && <h3 style={{ color: '#388e3c', marginTop: 0 }}>③ パッチム</h3>}
             <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px', marginBottom: '10px', fontSize: '10px' }}>
              {Object.entries(SOUND_GROUPS).map(([key, group]) => (
                key !== 'none' && (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '2px', background: group.color, padding:'2px 4px', borderRadius:'4px', border:'1px solid #ccc' }}>
                    <span style={{ fontWeight:'bold' }}>{group.label}</span>
                  </div>
                )
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {PATCHIMS.map((char) => {
                const group = getGroupStyle(char);
                return (
                  <button
                    key={char}
                    // ★ここも専用関数を呼ぶ
                    onClick={() => handlePatchimClick(char)}
                    style={getButtonStyle(patchim === char, null, true, group.color)}
                  >
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{char || '無'}</span>
                    <span style={{ fontSize: '10px', color: '#666' }}>{char ? group.label.split(' ')[0] : '-'}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;

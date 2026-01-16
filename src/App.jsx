import React, { useState, useEffect } from 'react';
import { assemble } from 'es-hangul';

// --- シャッフル関数（トランプを切るようなロジック） ---
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

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

  const [isStackView, setIsStackView] = useState(window.innerWidth < 768 || window.innerHeight > window.innerWidth);
  const [activeTab, setActiveTab] = useState('initial');

  const [sentence, setSentence] = useState('');
  const [meaning, setMeaning] = useState('');

  // ★変更点：初期読み込み時にシャッフルを実行！
  const [vocabList, setVocabList] = useState(() => {
    const saved = localStorage.getItem('myVocabList');
    const initialList = saved ? JSON.parse(saved) : [];
    return shuffleArray(initialList); // ここで混ぜる！
  });

  const [revealedIds, setRevealedIds] = useState(new Set());

  const completeChar = assemble([initial, vowel, patchim]);

  useEffect(() => {
    const handleResize = () => {
      setIsStackView(window.innerWidth < 768 || window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('myVocabList', JSON.stringify(vocabList));
  }, [vocabList]);

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
    if(isStackView) setTimeout(()=> setActiveTab('vowel'), 300);
  };

  const handleVowelClick = (char) => {
    setVowel(char);
    const nextText = assemble([initial, char, patchim]);
    speak(nextText);
    if(isStackView) setTimeout(()=> setActiveTab('patchim'), 300);
  };

  const handlePatchimClick = (char) => {
    setPatchim(char);
    const nextText = assemble([initial, vowel, char]);
    speak(nextText);
  };

  const addToSentence = () => {
    setSentence(prev => prev + completeChar);
  };

  const backspaceSentence = () => {
    setSentence(prev => prev.slice(0, -1));
  };

  const saveToVocabList = () => {
    if (!sentence) return;

    const newItem = {
      id: Date.now(),
      hangul: sentence,
      meaning: meaning || '（意味なし）',
      date: new Date().toLocaleDateString()
    };

    setVocabList([newItem, ...vocabList]);
    setSentence('');
    setMeaning('');
  };

  const deleteFromVocabList = (id) => {
    if (window.confirm('この単語を削除してもいいですか？')) {
      setVocabList(vocabList.filter(item => item.id !== id));
    }
  };

  const toggleReveal = (id) => {
    const next = new Set(revealedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setRevealedIds(next);
  };

  // ★追加：手動シャッフル機能
  const handleManualShuffle = () => {
    setVocabList(prev => shuffleArray(prev));
  };

  const getButtonStyle = (isSelected, colorBase, isPatchim = false, groupColor = null) => {
    const borderColor = isPatchim && groupColor ? groupColor : (isSelected ? colorBase : '#ddd');
    const borderWidth = isPatchim ? '3px' : (isSelected ? '2px' : '1px');
    const background = isSelected ? (isPatchim && groupColor ? groupColor : colorBase) : '#fff';
    const textColor = isSelected && !isPatchim ? '#fff' : '#333';
    return {
      width: isStackView ? '45px' : '50px',
      height: isStackView ? '45px' : '50px',
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 5px', fontFamily: '"Helvetica Neue", sans-serif', textAlign: 'center', backgroundColor: '#f9f9f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <div style={{
        display: 'flex',
        flexDirection: isStackView ? 'column' : 'row',
        gap: '15px',
        alignItems: 'flex-start'
      }}>

        {/* --- 1. 文字組み立てエリア --- */}
        <div style={{ flex: 1, width: '100%' }}>

          <div style={{ background: 'white', padding: '10px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '10px', position: 'sticky', top: '5px', zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <div style={{ fontSize: '70px', fontWeight: 'bold', lineHeight: 1 }}>{completeChar}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => speak(completeChar)} style={{ padding: '8px 15px', borderRadius: '15px', border:'none', background:'#333', color:'white', cursor:'pointer', fontWeight:'bold', fontSize:'12px' }}>
                  🔊 再生
                </button>
                <button onClick={addToSentence} style={{ padding: '8px 15px', borderRadius: '15px', border:'none', background:'#2196f3', color:'white', cursor:'pointer', fontWeight:'bold', fontSize:'12px', boxShadow:'0 3px 0 #1565c0' }}>
                  ⬇️ 追加
                </button>
              </div>
            </div>
          </div>

          {isStackView && (
            <div style={{ display: 'flex', marginBottom: '10px', background: 'white', borderRadius: '10px' }}>
              <button onClick={() => setActiveTab('initial')} style={tabButtonStyle('initial', '#2196f3')}>① 子音</button>
              <button onClick={() => setActiveTab('vowel')} style={tabButtonStyle('vowel', '#f44336')}>② 母音</button>
              <button onClick={() => setActiveTab('patchim')} style={tabButtonStyle('patchim', '#4caf50')}>③ パッチム</button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(!isStackView || activeTab === 'initial') && (
              <div style={{ background: '#e3f2fd', padding: '8px', borderRadius: '15px' }}>
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

            {(!isStackView || activeTab === 'vowel') && (
              <div style={{ background: '#ffebee', padding: '8px', borderRadius: '15px' }}>
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

            {(!isStackView || activeTab === 'patchim') && (
              <div style={{ background: '#f1f8e9', padding: '8px', borderRadius: '15px' }}>
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

        {/* --- 2. 📝 マイ単語帳エリア --- */}
        <div style={{
          flex: isStackView ? 'none' : '0 0 320px',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', gap: '20px'
        }}>

          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #ddd', padding: '15px' }}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                value={sentence}
                readOnly
                placeholder="左で作った文字がここに入ります"
                style={{
                  width: '100%', padding: '10px', fontSize: '20px', textAlign: 'center',
                  borderRadius: '10px', border: '2px solid #b3e5fc', background: '#f0f8ff',
                  boxSizing: 'border-box', fontWeight: 'bold', color: '#1976d2'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
              <button onClick={backspaceSentence} style={{ flex: 1, padding: '8px', borderRadius: '8px', border:'none', background:'#eee', color:'#333', cursor:'pointer', fontSize:'12px' }}>
                ⌫ 1文字消す
              </button>
              <button onClick={() => setSentence('')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border:'none', background:'#eee', color:'#d32f2f', cursor:'pointer', fontSize:'12px' }}>
                🗑️ クリア
              </button>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="日本語の意味を入力"
                style={{
                  width: '100%', padding: '10px', fontSize: '14px',
                  borderRadius: '10px', border: '1px solid #ccc',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button onClick={saveToVocabList} disabled={!sentence} style={{ width: '100%', padding: '12px', borderRadius: '10px', border:'none', background: sentence ? '#ff9800' : '#ccc', color:'white', cursor: sentence ? 'pointer' : 'not-allowed', fontWeight:'bold', fontSize:'16px', boxShadow: sentence ? '0 3px 0 #f57c00' : 'none' }}>
              ⭐️ リストに保存する
            </button>
          </div>

          {vocabList.length > 0 && (
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #ddd', padding: '15px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>📖 暗記カード ({vocabList.length})</h3>
                {/* ★追加：シャッフルボタン */}
                <button onClick={handleManualShuffle} style={{ padding:'4px 8px', borderRadius:'5px', border:'1px solid #ddd', background:'#f0f0f0', cursor:'pointer', fontSize:'12px' }}>
                  🔀 混ぜる
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {vocabList.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff8e1', padding: '10px', borderRadius: '10px', border: '1px solid #ffecb3' }}>

                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                        {item.hangul}
                      </div>

                      <div
                        onClick={() => toggleReveal(item.id)}
                        style={{
                          fontSize: '12px',
                          color: revealedIds.has(item.id) ? '#d84315' : '#888',
                          fontWeight: revealedIds.has(item.id) ? 'bold' : 'normal',
                          background: revealedIds.has(item.id) ? 'transparent' : '#eee',
                          padding: revealedIds.has(item.id) ? '0' : '4px 8px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          cursor: 'pointer'
                        }}
                      >
                        {revealedIds.has(item.id) ? item.meaning : '🙈 答えを見る'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => speak(item.hangul)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>🔊</button>
                      <button onClick={() => deleteFromVocabList(item.id)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', opacity: 0.5 }}>❌</button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default App;

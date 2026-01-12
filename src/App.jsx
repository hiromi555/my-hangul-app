import React, { useState, useEffect } from 'react';
import { assemble } from 'es-hangul';

// --- データ定義（省略なしで入れます） ---
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

// ----------------------------------------------------------------
// データ定義（学習しやすい順序に変更！）
// ----------------------------------------------------------------

// 母音：基本(10) → 複合(11) の順に並び替え
const VOWELS = [
  // --- 基本母音 (10個) ---
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

  // --- 複合・二重母音 (11個) ---
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

  // ★追加機能：スマホかPCかを判定するフラグ
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // ★追加機能：スマホの時に「今どのタブを開いているか」
  const [activeTab, setActiveTab] = useState('initial'); // initial, vowel, patchim

  const completeChar = assemble([initial, vowel, patchim]);

  // 画面サイズが変わったら「スマホモード」か「PCモード」か切り替える（useEffect）
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    speak(completeChar);
  }, [completeChar]);

  const getButtonStyle = (isSelected, colorBase, isPatchim = false, groupColor = null) => {
    const borderColor = isPatchim && groupColor ? groupColor : (isSelected ? colorBase : '#ddd');
    const borderWidth = isPatchim ? '3px' : (isSelected ? '2px' : '1px');
    const background = isSelected ? (isPatchim && groupColor ? groupColor : colorBase) : '#fff';
    const textColor = isSelected && !isPatchim ? '#fff' : '#333';

    return {
      width: isMobile ? '55px' : '60px', // スマホなら少し小さく
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
      fontSize: '14px' // スマホで見やすいサイズ
    };
  };

  // タブボタンのスタイル
  const tabButtonStyle = (tabName, color) => ({
    flex: 1,
    padding: '10px',
    border: 'none',
    borderBottom: activeTab === tabName ? `4px solid ${color}` : '4px solid #eee',
    background: 'transparent',
    fontWeight: 'bold',
    color: activeTab === tabName ? '#333' : '#999',
    cursor: 'pointer',
    fontSize: '16px'
  });

  return (
    <div style={{
      maxWidth: '1000px', margin: '0 auto', padding: '10px',
      fontFamily: '"Helvetica Neue", sans-serif', textAlign: 'center',
      backgroundColor: '#f9f9f9', minHeight: '100vh',
      display: 'flex', flexDirection: 'column'
    }}>

      {/* 結果表示（常に表示） */}
      <div style={{
        background: 'white', padding: '10px 30px', borderRadius: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)', margin: '10px auto',
        position: 'sticky', top: '10px', zIndex: 100 // スクロールしても上についてくる
      }}>
        <div style={{ fontSize: '80px', fontWeight: 'bold', lineHeight: 1 }}>{completeChar}</div>
        <button onClick={() => speak(completeChar)} style={{ marginTop: '5px', padding: '5px 20px', borderRadius: '15px', border:'none', background:'#333', color:'white', cursor:'pointer'}}>🔊 再生</button>
      </div>

      {/* --- スマホ用：タブ切り替えボタン --- */}
      {isMobile && (
        <div style={{ display: 'flex', marginBottom: '10px', background: 'white', borderRadius: '10px' }}>
          <button onClick={() => setActiveTab('initial')} style={tabButtonStyle('initial', '#2196f3')}>① 子音</button>
          <button onClick={() => setActiveTab('vowel')} style={tabButtonStyle('vowel', '#f44336')}>② 母音</button>
          <button onClick={() => setActiveTab('patchim')} style={tabButtonStyle('patchim', '#4caf50')}>③ パッチム</button>
        </div>
      )}

      {/* コンテンツエリア（PCなら全部表示、スマホなら選んだタブだけ表示） */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row', // スマホは縦、PCは横
        justifyContent: 'center',
        gap: '20px',
        paddingBottom: '50px'
      }}>

        {/* 子音エリア */}
        {(!isMobile || activeTab === 'initial') && (
          <div style={{ background: '#e3f2fd', padding: '10px', borderRadius: '15px', flex: 1 }}>
            {!isMobile && <h3 style={{ color: '#1976d2', marginTop: 0 }}>① 子音</h3>}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {INITIALS.map((item) => (
                <button
                  key={item.char}
                  onClick={() => {
                     setInitial(item.char);
                     if(isMobile) setTimeout(()=> setActiveTab('vowel'), 300); // 親切機能：選んだら次へ
                  }}
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
      {/* 母音エリア */}
        {(!isMobile || activeTab === 'vowel') && (
          <div style={{ background: '#ffebee', padding: '10px', borderRadius: '15px', flex: 1 }}>
            {!isMobile && <h3 style={{ color: '#d32f2f', marginTop: 0 }}>② 母音（基本→複合）</h3>}

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {VOWELS.map((item, index) => {
                // 基本と複合の境目に、区切り線を入れるロジック
                const isFirstComplex = index === 10; // 11個目（配列の10番）が複合の始まり

                return (
                 <React.Fragment key={item.char}>
                    {/* 区切り線（複合母音に入る前に表示） */}
                    {isFirstComplex && (
                      <div style={{ width: '100%', height: '1px', borderBottom: '2px dashed #ffcdd2', margin: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: '#ffebee', padding: '0 10px', color: '#e57373', fontSize: '10px', fontWeight: 'bold' }}>ここから複合母音</span>
                      </div>
                    )}

                    <button
                      key={item.char}
                      onClick={() => {
                        setVowel(item.char);
                        if(isMobile) setTimeout(()=> setActiveTab('patchim'), 300);
                      }}
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
             {/* 凡例（スマホの場合は場所を取るので簡易表示か非表示にする工夫もアリ） */}
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
                    onClick={() => setPatchim(char)}
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

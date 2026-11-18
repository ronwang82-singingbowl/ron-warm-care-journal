export const encouragements = [
  ['每次多理解一點，', '關係就多一點空間。'],
  ['願意好好聽，', '就是一份珍貴的關心。'],
  ['一句真心的問候，', '也能讓人感到被惦記。'],
  ['不急著找到答案，', '先陪彼此待一會兒。'],
  ['記得他說過的小事，', '讓下次問候多一點溫度。'],
  ['關心可以很簡單，', '用你自在的方式開始。'],
  ['留一點空白，', '讓彼此都能自在呼吸。'],
  ['今天多聽懂一點，', '就是值得記下的進展。'],
  ['陪伴有不同的步調，', '慢慢來也很好。'],
  ['不用每句都很動人，', '真誠的話就有溫度。'],
  ['一個容易回答的問題，', '可以是認識彼此的開始。'],
  ['照顧自己的心力，', '也讓關心走得更長久。'],
] as const;

// Remember only the last quote index, never journal content.
export function chooseEncouragement() {
  const key = 'warm-care:last-encouragement';
  let previous = -1;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) previous = Number(raw);
  } catch { /* Storage may be disabled; a random quote still works. */ }
  const candidates = encouragements.map((_, i) => i).filter(i => i !== previous);
  const index = candidates[Math.floor(Math.random() * candidates.length)];
  try { localStorage.setItem(key, String(index)); } catch { /* Optional preference. */ }
  return encouragements[index];
}

// Pick once per page opening so navigation and form edits keep the same quote.
export const openingEncouragement = chooseEncouragement();

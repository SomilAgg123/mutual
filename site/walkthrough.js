const chapters = [
  { id: 'browse', label: 'Profile cards' },
  { id: 'matches', label: 'Matches' },
  { id: 'compare', label: 'Match details' },
  { id: 'icebreaker', label: 'Icebreakers' },
  { id: 'introductions', label: 'Introductions' },
  { id: 'profile', label: 'Profile' },
  { id: 'responses', label: 'Photos & prompts' },
];
const byId = id => document.getElementById(id);
const stepButtons = [...document.querySelectorAll('[data-step]')];
let active = 0;

function showChapter(index, updateHash = true) {
  active = Math.max(0, Math.min(chapters.length - 1, index));
  const chapter = chapters[active];
  stepButtons.forEach(button => {
    if (button.dataset.step === chapter.id) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  byId('tour-progress').textContent = `${active + 1} / ${chapters.length}`;
  byId('tour-progress').setAttribute('aria-label', `Screen ${active + 1} of ${chapters.length}`);
  byId('tour-title').textContent = chapter.label;
  const frame = byId('app-screen');
  const nextSource = `preview.html?screen=${chapter.id}`;
  // Replace the embedded page so one Back action restores one tour chapter.
  if ((frame.dataset.screen || 'browse') !== chapter.id) {
    frame.contentWindow.location.replace(new URL(nextSource, location.href).href);
    frame.dataset.screen = chapter.id;
  }
  frame.title = `Original Mutual ${chapter.label.toLowerCase()}, read-only preview`;
  byId('previous').disabled = active === 0;
  byId('next').textContent = active === chapters.length - 1 ? 'Restart' : 'Next';
  if (updateHash) history.pushState(null, '', `#tour/${chapter.id}`);
}

stepButtons.forEach((button, index) => {
  button.addEventListener('click', () => showChapter(index));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % chapters.length;
    if (event.key === 'ArrowLeft') next = (index + chapters.length - 1) % chapters.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = chapters.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    showChapter(next);
    stepButtons[next].focus();
  });
});
byId('previous').addEventListener('click', () => showChapter(active - 1));
byId('next').addEventListener('click', () => showChapter((active + 1) % chapters.length));
function restoreChapter() {
  const id = location.hash.replace(/^#tour\//, '');
  const index = chapters.findIndex(chapter => chapter.id === id);
  if (index >= 0) showChapter(index, false);
  else if (!location.hash) showChapter(0, false);
}
window.addEventListener('hashchange', restoreChapter);
restoreChapter();

const candidates = [...document.querySelectorAll('[data-candidate]')];
function showScores(index) {
  const score = window.mutualScores[index];
  candidates.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  byId('candidate-name').textContent = score.name;
  for (const kind of ['similarity', 'complementarity']) {
    const value = score[kind].value;
    const suffix = document.createElement('span');
    suffix.textContent = '%';
    byId(`${kind}-value`).replaceChildren(document.createTextNode(value.toFixed(1)), suffix);
    const meter = byId(`${kind}-meter`);
    meter.setAttribute('aria-valuenow', String(value));
    meter.firstElementChild.style.width = `${value}%`;
  }

}
candidates.forEach((button, index) => button.addEventListener('click', () => showScores(index)));
showScores(0);

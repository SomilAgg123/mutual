const sourceRoot = 'https://github.com/SomilAgg123/mutual/blob/main/frontend/src/screens/';
const chapters = [
  { id: 'browse', label: 'Profile cards', category: 'Discover', title: 'A person.\nNot just a photo.', description: "The profile card gives a matchmaker a little more to go on: a face, a place, and answers that let someone's personality come through.", noteTitle: 'The friend is the matchmaker', note: '“Find me a mutual!” leads into recommendations. The person browsing is helping make an introduction.', context: 'Jordan is a fictional profile. The card layout and prompt labels come from the original app.', source: 'Source/Source.js' },
  { id: 'matches', label: 'Find a match', category: 'Recommend', title: 'Who might\nclick with Alex?', description: 'The recommendation grid brings potential matches together. Two score circles give the matchmaker a quick sense of similarity and complementarity.', noteTitle: 'A shortlist, with a little context', note: 'The original design keeps these scores in the matchmaker’s view. Selecting a person opens a closer comparison.', context: 'Jordan, Riley, and Casey are fictional. Their scores come from the restored Python demo, rounded for the original UI.', source: 'Arrange/Arrange.js' },
  { id: 'compare', label: 'See the reasons', category: 'Understand', title: 'A little more\nthan a number.', description: 'The comparison screen pairs a profile with two scores and reasons for the introduction. A matchmaker can see the thinking before deciding to connect people.', noteTitle: 'Leave room for human judgment', note: 'The original screen lets a matchmaker edit the introduction reasons. The scores help frame the choice; the friend makes it.', context: 'This preview compares Alex and Jordan. Explanations are sample text. The lower part of the original screen continues below its initial viewport.', source: 'Arrange/Arrange2.js' },
  { id: 'icebreaker', label: 'Break the ice', category: 'Introduce', title: 'Give them\nsomething to say.', description: 'Once a pair is chosen, the matchmaker picks a question for both people to answer. The introduction starts with a conversation, not an empty chat box.', noteTitle: 'A small nudge to get things started', note: 'The original screen offers three questions and the option to draw another set. Its prompts range from everyday preferences to playful hypotheticals.', context: 'These questions come from the original app. The send control is inactive in this tour; nothing is submitted or sent.', source: 'Arrange/MatchPrompts.js' },
  { id: 'introductions', label: 'Introductions', category: 'Follow along', title: 'Keep track of\nthe connections.', description: 'The matchmaker’s activity view collects the friends they have introduced and the questions they were asked. It gives each introduction a place to live.', noteTitle: 'A shared beginning', note: 'The original product journey continued toward responses and chat. Conversation linking and messaging integrations were still unfinished.', context: 'This screen retains the original fixed sample names, questions, and dates. Portraits have been replaced with geometric placeholders.', source: 'Setup/AnsweredChats.js' },
  { id: 'profile', label: 'Your profile', category: 'Make it yours', title: 'The person\nbehind the profile.', description: 'A familiar settings screen brings account and personal information together, with a direct entry point to the visible profile.', noteTitle: 'The everyday parts matter, too', note: 'Personal information, help, and account management were part of the app’s planned experience. Several destination screens remained prototypes.', context: 'Alex is a fictional account. Authentication, account changes, and navigation inside the phone are disabled for the walkthrough.', source: 'Profile/Profile.js' },
  { id: 'responses', label: 'Photos & prompts', category: 'Express yourself', title: 'Make a profile\nsound like you.', description: 'Photos and written answers give people a way to show more of themselves. This preserved editing layout brings both together on one screen.', noteTitle: 'A glimpse of the work in progress', note: 'The repeated answer is the original placeholder copy. Keeping it visible shows where the prototype stood, alongside the more complete card and matching views.', context: 'This is the final screen in the tour. Explore the scoring example below or return to the first profile card.', source: 'Profile/Details.js' },
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
  byId('tour-progress').textContent = `Screen ${active + 1} of ${chapters.length} · ${chapter.category}`;
  byId('tour-title').textContent = chapter.title;
  byId('tour-title').style.whiteSpace = 'pre-line';
  byId('tour-description').textContent = chapter.description;
  byId('note-title').textContent = chapter.noteTitle;
  byId('note-description').textContent = chapter.note;
  byId('screen-context').textContent = chapter.context;
  byId('screen-source').href = sourceRoot + chapter.source;
  const frame = byId('app-screen');
  const nextSource = `preview.html?screen=${chapter.id}`;
  // Replace the embedded page so one Back action restores one tour chapter.
  if ((frame.dataset.screen || 'browse') !== chapter.id) {
    frame.contentWindow.location.replace(new URL(nextSource, location.href).href);
    frame.dataset.screen = chapter.id;
  }
  frame.title = `Original Mutual ${chapter.label.toLowerCase()}, read-only preview`;
  byId('previous').disabled = active === 0;
  byId('next').textContent = active === chapters.length - 1 ? 'Restart the tour' : `Next: ${chapters[active + 1].label}`;
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
  const reasons = [...score.similarity.reasons.slice(0, 2), ...score.complementarity.reasons.slice(0, 1)];
  byId('score-reasons').replaceChildren(...reasons.map(reason => {
    const item = document.createElement('li');
    item.textContent = reason;
    return item;
  }));
  byId('score-meta').textContent = `Ranking score ${score.ranking_score.toFixed(1)} · Data coverage: ${score.similarity.coverage.toFixed(0)}% similarity, ${score.complementarity.coverage.toFixed(0)}% complementarity`;
}
candidates.forEach((button, index) => button.addEventListener('click', () => showScores(index)));
showScores(0);

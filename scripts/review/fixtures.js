// Offline responses for the original screens. No request reaches the old API.
const data = window.__MUTUAL_REVIEW_DATA__;
const nativeFetch = window.fetch.bind(window);
const markError = event => {
  document.documentElement.dataset.reviewFailed = String(event.message || event.reason || 'Preview error');
};
window.addEventListener('error', markError);
window.addEventListener('unhandledrejection', markError);

const profiles = data.profiles.map((profile, index) => ({
  ...profile,
  id: index + 1,
  first_name: profile.firstName,
  lastName: 'Example', last_name: 'Example', age: 22,
  currentLocation: 'Harbor City', current_location: 'Harbor City',
  answer1: 'great coffee, better questions',
  answer2: 'you are kind and curious',
}));
const matches = data.matches.map((match, index) => ({
  ...profiles[index + 1],
  similarity_score: Math.round(match.similarity.value),
  complementarity_score: Math.round(match.complementarity.value),
}));
const json = value => new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } });
window.fetch = async (input, options = {}) => {
  const path = new URL(String(input), 'http://localhost').pathname;
  if ((options.method || 'GET') !== 'GET') throw new Error('Review captures do not allow writes');
  let match;
  if ((match = path.match(/^\/api\/photo\/profile\/(\d+)$/))) return nativeFetch(data.avatars[(Number(match[1]) - 1) % data.avatars.length]);
  if (path.startsWith('/api/profile/email/')) return json(profiles[0]);
  if (path === '/api/profile') return json(profiles);
  if ((match = path.match(/^\/api\/profile\/(\d+)$/))) return json(profiles[Number(match[1]) - 1]);
  if (path.startsWith('/api/card/stack/')) return json({ 0: profiles[1], 1: profiles[2], 2: profiles[3] });
  if ((match = path.match(/^\/api\/card\/(\d+)$/))) return json(profiles[Number(match[1]) - 1]);
  if (path.startsWith('/api/arrange/recommendations/')) return json(matches);
  if (path.startsWith('/api/friend/list/')) return json(profiles.slice(1));
  if (path.startsWith('/api/scores/reasons/prompt/')) return new Response(path.endsWith('/school') ? 'Both went to Maple College.' : 'Their traits match what each values.');
  if (path.startsWith('/api/scores/reasons/')) return json({ 0: { school: 1 }, 1: { wordsAndQualities: 2 } });
  if (path.startsWith('/api/scores/')) return json(matches[0]);
  throw new Error(`No offline fixture for ${path}`);
};

export { profiles, matches };

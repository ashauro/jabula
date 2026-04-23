// Utility: avatar color from name
export const avatarBg = (name) => {
  const hues = [18, 35, 48, 75, 145, 210, 280, 320];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const hue = hues[h % hues.length];
  return `linear-gradient(135deg, oklch(0.55 0.12 ${hue}), oklch(0.35 0.09 ${hue + 30}))`;
};
export const initials = (name) => name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

// Format helpers
export const fmtMoney = (n, cur = '€') =>
  cur + (n < 0 ? '-' : '') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
export const fmtK = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K' : String(n);
export const fmtTime = (d) => {
  const diff = (Date.now() - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 86400 * 7) return Math.floor(diff / 86400) + 'd ago';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};
export const fmtDateTime = (d) =>
  new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

// Mock data
export const HOSTS = ['Elena Vasquez', 'Marcus Chen', 'Priya Shah', 'Kenji Tanaka', 'Sofia Rossi', "Liam O'Brien"];
export const COUNTRIES = [
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
];
export const GAMES = [
  'Rise of Giza', 'Hit The Gold', 'Wild Bazaar', 'Wild-O-Tron 3000', 'Wilderland',
  'Gates of Olympus', 'Sweet Bonanza', 'Book of Dead', 'Crazy Time', 'Mega Moolah',
  'Lightning Roulette', 'Blackjack VIP', 'Dragon Tiger', 'Baccarat Squeeze',
];
export const TIERS = [
  { id: 'bronze', label: 'Bronze', min: 0 },
  { id: 'silver', label: 'Silver', min: 5000 },
  { id: 'gold', label: 'Gold', min: 25000 },
  { id: 'platinum', label: 'Platinum', min: 100000 },
];

const seed = (s) => { let x = s; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };
const rnd = seed(42);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const between = (a, b) => a + Math.floor(rnd() * (b - a));

const FIRST = ['Niko', 'Aria', 'Leon', 'Mira', 'Oskar', 'Elin', 'Finn', 'Hana', 'Kai', 'Luca', 'Nora', 'Pablo', 'Rin', 'Sasha', 'Theo', 'Vera', 'Yuki', 'Zane', 'Dmitri', 'Anya', 'Björn', 'Caleb', 'Diana', 'Evan', 'Farah', 'Georg', 'Helga', 'Ivan', 'Jade', 'Klaus'];
const LAST = ['Ahonen', 'Blake', 'Carrera', 'Dvořák', 'Eriksen', 'Fischer', 'Grewal', 'Hartmann', 'Ito', 'Jovanović', 'Kovač', 'Lindqvist', 'Müller', 'Nilsen', "O'Hara", 'Park', 'Quinn', 'Rossi', 'Silva', 'Tan', 'Udell', 'Vasiliev', 'Wen', 'Xu', 'Yamada', 'Zappa'];

const buildPlayer = (i) => {
  const firstName = FIRST[between(0, FIRST.length)];
  const lastName = LAST[between(0, LAST.length)];
  const name = `${firstName} ${lastName}`;
  const lifetimeDeposits = between(8000, 2500000);
  let tier = 'bronze';
  if (lifetimeDeposits >= 100000) tier = 'platinum';
  else if (lifetimeDeposits >= 25000) tier = 'gold';
  else if (lifetimeDeposits >= 5000) tier = 'silver';
  const country = COUNTRIES[between(0, COUNTRIES.length)];
  const host = HOSTS[between(0, HOSTS.length)];
  const lastActive = Date.now() - between(60_000, 30 * 86400_000);
  const balance = between(0, 45000);
  const bonuses = between(0, 8000);
  const ngr30 = between(-2000, 28000);
  const sessions30 = between(0, 240);
  const avgBet = between(5, 250);
  const wagered30 = between(1000, 500000);
  const favGames = [...new Set([pick(GAMES), pick(GAMES), pick(GAMES), pick(GAMES)])]
    .slice(0, 3).map((g, idx) => ({ name: g, pct: [52, 28, 20][idx] + between(-5, 5) }));
  const joined = Date.now() - between(60 * 86400_000, 6 * 365 * 86400_000);
  const flags = [];
  if (rnd() < 0.14) flags.push('bonus-abuse-review');
  if (rnd() < 0.08) flags.push('self-excluded');
  if (rnd() < 0.1) flags.push('kyc-pending');
  const status = rnd() < 0.4 ? 'online' : rnd() < 0.6 ? 'away' : 'offline';
  return {
    id: 'VIP-' + String(100000 + i).slice(1),
    name, firstName, lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, '')}@proton.me`,
    phone: `+${between(1, 99)} ${between(100, 999)} ${between(100, 999)} ${between(1000, 9999)}`,
    country, tier, host, lastActive, balance, bonuses, ngr30, sessions30, avgBet, wagered30,
    lifetimeDeposits,
    lifetimeWithdrawals: Math.round(lifetimeDeposits * (0.6 + rnd() * 0.3)),
    favGames, joined, flags, status,
    loyaltyPoints: between(500, 120000),
    vipSince: Date.now() - between(30 * 86400_000, 3 * 365 * 86400_000),
    currency: '€',
    dob: new Date(1960 + between(0, 45), between(0, 11), between(1, 28)).toISOString().slice(0, 10),
    kyc: rnd() < 0.92 ? 'verified' : 'pending',
    lastDeposit: { amount: between(100, 10000), at: Date.now() - between(0, 7 * 86400_000) },
    lastWithdrawal: { amount: between(500, 25000), at: Date.now() - between(0, 14 * 86400_000), status: pick(['completed', 'pending', 'review']) },
    depositLimit: pick([null, 1000, 5000, 10000, 25000]),
    lossLimit: pick([null, 500, 2500, 10000]),
    timezone: pick(['Europe/Berlin', 'Europe/Helsinki', 'Europe/London', 'Pacific/Auckland', 'America/Toronto']),
    language: pick(['EN', 'DE', 'FI', 'SV', 'JP']),
  };
};

export const PLAYERS = Array.from({ length: 64 }, (_, i) => buildPlayer(i));

// Hero player for profile demo
PLAYERS[0] = {
  ...PLAYERS[0],
  name: 'Niko Ahonen', firstName: 'Niko', lastName: 'Ahonen', tier: 'platinum',
  lifetimeDeposits: 1284000, lifetimeWithdrawals: 842000, ngr30: 24800, balance: 18420,
  bonuses: 2150, sessions30: 187, avgBet: 185, wagered30: 412000, status: 'online',
  country: COUNTRIES[2], host: 'Elena Vasquez', flags: [], loyaltyPoints: 94200, kyc: 'verified',
};
PLAYERS[1] = { ...PLAYERS[1], name: 'Aria Blake', tier: 'gold', flags: ['bonus-abuse-review'], status: 'away' };
PLAYERS[2] = { ...PLAYERS[2], name: 'Leon Fischer', tier: 'platinum', status: 'online' };

export const SEGMENTS = [
  { id: 'churn-risk', name: 'At-risk VIPs', desc: 'No login in 14+ days with lifetime deposits >€50K', members: 12, trend: +3, icon: 'slash', color: 'danger' },
  { id: 'high-rollers', name: 'High rollers', desc: 'Avg bet >€100 over last 30 days', members: 28, trend: +5, icon: 'trending', color: 'gold' },
  { id: 'new-platinum', name: 'Newly Platinum', desc: 'Upgraded to Platinum in last 30 days', members: 6, trend: +2, icon: 'star', color: 'gold' },
  { id: 'bday-week', name: 'Birthday this week', desc: 'Active VIPs with birthdays in next 7 days', members: 9, trend: 0, icon: 'gift', color: 'info' },
  { id: 'dormant', name: 'Dormant whales', desc: '90+ days inactive, lifetime deposits >€100K', members: 17, trend: -2, icon: 'clock', color: 'neutral' },
  { id: 'live-casino', name: 'Live casino loyalists', desc: '80%+ wagering on live tables', members: 34, trend: +1, icon: 'headphones', color: 'info' },
  { id: 'bonus-hunters', name: 'Possible bonus abuse', desc: 'Flagged by risk engine in last 7 days', members: 5, trend: +1, icon: 'shield', color: 'danger' },
  { id: 'withdrawal-spike', name: 'Large withdrawal pending', desc: 'Pending withdrawal >€10K requiring review', members: 4, trend: 0, icon: 'wallet', color: 'gold' },
];

export const THREADS = [
  {
    id: 't1', with: PLAYERS[0], channel: 'email', subject: 'Re: Your invitation to our Monaco event',
    preview: 'Thanks Elena — confirming two seats. Would love the same suite as last year if possible...',
    unread: false, when: Date.now() - 2 * 3600_000,
    messages: [
      { from: 'host', who: 'Elena Vasquez', at: Date.now() - 3 * 86400_000, text: "Hi Niko — we'd love to have you at our Monaco VIP weekend, May 16–18. Flights and accommodation covered, of course. Let me know and I'll send the itinerary." },
      { from: 'player', who: 'Niko Ahonen', at: Date.now() - 2 * 3600_000, text: 'Thanks Elena — confirming two seats. Would love the same suite as last year if possible. Also, can we add a round at the Monte-Carlo Country Club on Saturday?' },
    ],
  },
  {
    id: 't2', with: PLAYERS[1], channel: 'chat', subject: 'Withdrawal question',
    preview: "Why is my withdrawal still pending? It's been 3 days...",
    unread: true, when: Date.now() - 40 * 60_000,
    messages: [
      { from: 'player', who: 'Aria Blake', at: Date.now() - 40 * 60_000, text: "Why is my withdrawal still pending? It's been 3 days and I need the funds for a trip on Monday." },
    ],
  },
  {
    id: 't3', with: PLAYERS[2], channel: 'sms', subject: 'Birthday bonus',
    preview: 'Thanks for the 500 free spins — used half already 😄',
    unread: false, when: Date.now() - 5 * 3600_000,
    messages: [
      { from: 'host', who: 'System', at: Date.now() - 6 * 3600_000, text: "Happy birthday Leon! We've loaded 500 free spins on Gates of Olympus to your account. Enjoy, on us. 🎂" },
      { from: 'player', who: 'Leon Fischer', at: Date.now() - 5 * 3600_000, text: 'Thanks for the 500 free spins — used half already 😄' },
    ],
  },
  {
    id: 't4', with: PLAYERS[3], channel: 'email', subject: 'Re: Quarterly cashback',
    preview: 'Received, thank you. When does the next cycle start?',
    unread: false, when: Date.now() - 26 * 3600_000, messages: [],
  },
  {
    id: 't5', with: PLAYERS[4], channel: 'chat', subject: 'Tier status',
    preview: 'How close am I to Platinum? Want to push before EOM.',
    unread: true, when: Date.now() - 12 * 3600_000, messages: [],
  },
  {
    id: 't6', with: PLAYERS[5], channel: 'email', subject: 'Re: Invitation',
    preview: "Can't make it this time, but thanks for thinking of me.",
    unread: false, when: Date.now() - 2 * 86400_000, messages: [],
  },
];

export const buildTimeline = () => ([
  { type: 'deposit', icon: 'wallet', tone: 'success', title: 'Deposit €5,000', desc: 'Card ending 4421 · approved', at: Date.now() - 2 * 3600_000 },
  { type: 'session', icon: 'spin', tone: '', title: 'Active session · 2h 14m', desc: 'Wagered €18,420 on Lightning Roulette, Crazy Time', at: Date.now() - 3 * 3600_000 },
  { type: 'message', icon: 'mail', tone: 'info', title: 'Email from host', desc: 'Elena Vasquez — Re: Monaco event', at: Date.now() - 3 * 86400_000 },
  { type: 'bonus', icon: 'gift', tone: 'gold', title: 'Bonus issued: €500 + 200 FS', desc: 'Weekly loyalty reward, wagered 12× · by Elena V.', at: Date.now() - 4 * 86400_000 },
  { type: 'withdrawal', icon: 'wallet', tone: 'success', title: 'Withdrawal €12,000', desc: 'SEPA · completed in 4h 22m', at: Date.now() - 6 * 86400_000 },
  { type: 'tier', icon: 'trophy', tone: 'gold', title: 'Promoted to Platinum', desc: 'Lifetime deposits crossed €1M threshold', at: Date.now() - 48 * 86400_000 },
  { type: 'call', icon: 'phone', tone: 'info', title: 'Call from host · 18 min', desc: 'Elena Vasquez — event logistics', at: Date.now() - 5 * 86400_000 },
]);

export const NOTES = [
  { id: 'n1', pinned: true, author: 'Elena Vasquez', at: Date.now() - 12 * 86400_000,
    text: 'Prefers Lightning Roulette and Crazy Time. Plays Thursday–Sunday evenings CET. Not interested in slots tournaments.' },
  { id: 'n2', pinned: false, author: 'Marcus Chen', at: Date.now() - 4 * 86400_000,
    text: 'Confirmed return to Monaco VIP event. Requested same suite at Hotel Hermitage + golf tee time Saturday.' },
  { id: 'n3', pinned: false, author: 'Elena Vasquez', at: Date.now() - 18 * 86400_000,
    text: 'Do NOT send generic promo emails. Custom host-written comms only. Sensitive to spam.' },
];

import { useEffect, useState } from 'react';
import { getDashboardKpis, getTopPlayers, getAtRiskPlayers, getTaskQueue, getDashboardSummary } from './analytics';
import { PLAYERS } from '../data';

function buildMockData() {
  const topPlayers = PLAYERS.slice().sort((a, b) => b.ngr30 - a.ngr30).slice(0, 6);
  return {
    kpis: [
      { label: 'Active VIPs', value: '342', delta: '+18 this month', up: true, spark: [20, 22, 24, 26, 28, 30, 32, 34] },
      { label: 'NGR · this month', value: '€2.84M', delta: '+12.4%', up: true, spark: [12, 15, 14, 18, 17, 22, 26, 28] },
      { label: 'Bonuses issued', value: '€184K', delta: '−4.1% vs plan', up: false, spark: [22, 19, 20, 18, 17, 16, 17, 18] },
      { label: 'Pending withdrawals', value: '€128K', delta: '7 need review', up: false, spark: [5, 6, 8, 7, 9, 8, 10, 12] },
    ],
    tasks: [
      { icon: 'wallet', tone: 'gold', title: 'Review withdrawal — Niko Ahonen', sub: '€12,000 SEPA · flagged large', due: '2h' },
      { icon: 'message', tone: 'info', title: 'Reply to Aria Blake', sub: 'Withdrawal question · unread 40m', due: 'now' },
      { icon: 'gift', tone: 'gold', title: 'Birthday bonus — Leon Fischer', sub: 'Send within 24h', due: 'today' },
      { icon: 'phone', tone: 'info', title: 'Call — Mira Lindqvist', sub: 'Scheduled 14:30 CET', due: '3h' },
      { icon: 'trophy', tone: 'gold', title: 'Approve Platinum upgrade — Oskar Müller', sub: 'Crossed €100K threshold yesterday', due: 'today' },
      { icon: 'flag', tone: 'danger', title: 'Risk review — Hana Ito', sub: 'Possible bonus abuse pattern', due: 'today' },
    ],
    topPlayers,
    atRisk: [
      { name: 'Niko Ahonen', desc: 'No deposit in 9 days · -62% vs avg' },
      { name: 'Yuki Tan', desc: 'Reduced bet size 85% · possible churn' },
      { name: 'Sasha Udell', desc: 'Self-exclusion request pending' },
    ],
    greeting: 'Good morning',
    hostName: 'Elena',
    unreadMessages: 3,
    pendingReviews: 2,
  };
}

function normalizeKpis(raw) {
  if (!raw || !Array.isArray(raw)) return null;
  return raw;
}

function normalizeTopPlayers(raw) {
  if (!raw || !Array.isArray(raw)) return null;
  return raw;
}

function normalizeAtRisk(raw) {
  if (!raw || !Array.isArray(raw)) return null;
  return raw.map(p => ({
    name: p.name ?? p.player_name ?? 'Unknown',
    desc: p.desc ?? p.description ?? p.reason ?? '',
  }));
}

function normalizeTasks(raw) {
  if (!raw || !Array.isArray(raw)) return null;
  const iconMap = { withdrawal: 'wallet', message: 'message', bonus: 'gift', call: 'phone', upgrade: 'trophy', risk: 'flag' };
  const toneMap = { withdrawal: 'gold', message: 'info', bonus: 'gold', call: 'info', upgrade: 'gold', risk: 'danger' };
  return raw.map(t => ({
    icon: iconMap[t.type] ?? 'flag',
    tone: toneMap[t.type] ?? 'info',
    title: t.title ?? t.name ?? '',
    sub: t.sub ?? t.description ?? t.detail ?? '',
    due: t.due ?? t.due_in ?? '',
  }));
}

export function useDashboard(period = 'month') {
  const mock = buildMockData();
  const [data, setData] = useState(mock);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.allSettled([
      getDashboardKpis(period),
      getTopPlayers(6, period),
      getAtRiskPlayers(10),
      getTaskQueue(),
      getDashboardSummary(),
    ]).then(([kpisRes, topRes, riskRes, tasksRes, summaryRes]) => {
      if (cancelled) return;

      const updates = {};

      const kpis = normalizeKpis(kpisRes.value);
      if (kpis) updates.kpis = kpis;

      const topPlayers = normalizeTopPlayers(topRes.value);
      if (topPlayers) updates.topPlayers = topPlayers;

      const atRisk = normalizeAtRisk(riskRes.value);
      if (atRisk) updates.atRisk = atRisk;

      const tasks = normalizeTasks(tasksRes.value);
      if (tasks) updates.tasks = tasks;

      const summary = summaryRes.value;
      if (summary) {
        if (summary.greeting) updates.greeting = summary.greeting;
        if (summary.host_name) updates.hostName = summary.host_name;
        if (summary.unread_messages != null) updates.unreadMessages = summary.unread_messages;
        if (summary.pending_reviews != null) updates.pendingReviews = summary.pending_reviews;
      }

      const anyRealData = Object.keys(updates).length > 0;
      if (anyRealData) {
        setData(prev => ({ ...prev, ...updates }));
      }

      const anyError = [kpisRes, topRes, riskRes, tasksRes].every(r => r.status === 'rejected');
      if (anyError) setError('Analytics server unavailable — showing cached data');
      else setError(null);

      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [period]);

  return { data, loading, error };
}

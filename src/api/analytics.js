import { callTool, initialize, listTools } from './mcpClient';

let _initialized = false;
let _toolNames = null;

async function ensureInit() {
  if (_initialized) return;
  try {
    await initialize();
    const tools = await listTools();
    _toolNames = new Set(tools.map(t => t.name));
  } catch {
    _toolNames = new Set();
  }
  _initialized = true;
}

function hasTool(name) {
  return _toolNames === null || _toolNames.has(name);
}

export async function getDashboardKpis(period = 'month') {
  await ensureInit();
  return callTool('get_dashboard_kpis', { period });
}

export async function getTopPlayers(limit = 6, period = 'month') {
  await ensureInit();
  return callTool('get_top_players', { limit, period });
}

export async function getAtRiskPlayers(limit = 10) {
  await ensureInit();
  return callTool('get_at_risk_players', { limit });
}

export async function getTaskQueue() {
  await ensureInit();
  return callTool('get_task_queue', {});
}

export async function getDashboardSummary() {
  await ensureInit();
  return callTool('get_dashboard_summary', {});
}

export async function getPlayerList(params = {}) {
  await ensureInit();
  return callTool('get_players', params);
}

export async function getPlayerProfile(playerId) {
  await ensureInit();
  return callTool('get_player_profile', { player_id: playerId });
}

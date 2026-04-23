const MCP_HTTP_URL = 'http://49.13.34.78:3001/mcp';
const MCP_HTTPS_URL = 'https://49.13.34.78/mcp';
const BEARER = '7df677df3d12076e78e14ee67452ece62108238a62753b1fc6c6c6a36dbf557e';

function getUrl() {
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return MCP_HTTPS_URL;
  }
  return MCP_HTTP_URL;
}

let _reqId = 1;

async function rpc(method, params = {}) {
  const res = await fetch(getUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BEARER}`,
    },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: _reqId++ }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`MCP HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message ?? 'MCP error');
  return data.result;
}

export async function initialize() {
  return rpc('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'jabula-crm', version: '1.0' },
  });
}

export async function listTools() {
  const result = await rpc('tools/list');
  return result?.tools ?? [];
}

export async function callTool(name, args = {}) {
  const result = await rpc('tools/call', { name, arguments: args });
  const content = result?.content ?? [];
  const text = content.find(c => c.type === 'text')?.text;
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

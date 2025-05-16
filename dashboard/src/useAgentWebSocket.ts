import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  MetaData,
  Token,
} from './TokenDashboard';

const WS_URL = 'ws://localhost:8000';

export const useAgentWebSocket = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [metaData, setMetaData] = useState<MetaData>({ title: '', description: '' });
  const [agentStatus, setAgentStatus] = useState('Connecting...');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new window.WebSocket(WS_URL);
    ws.current.onopen = () => setAgentStatus('Connected to agent');
    ws.current.onclose = () => setAgentStatus('Disconnected');
    ws.current.onerror = () => setAgentStatus('WebSocket error');
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'status') setAgentStatus(data.message);
        if (data.type === 'meta') setMetaData({ title: data.title, description: data.description });
        if (data.type === 'token') setTokens(prev => {
          const exists = prev.some(t => t.name === data.token.name);
          if (exists) return prev;
          return [...prev, data.token];
        });
        if (data.type === 'tokens') setTokens(data.tokens);
      } catch (e) {
        // Ignore parse errors
      }
    };
    return () => { ws.current?.close(); };
  }, []);

  const sendCommand = (cmd: any) => {
    if (ws.current && ws.current.readyState === 1) {
      ws.current.send(JSON.stringify(cmd));
    }
  };

  return { tokens, metaData, agentStatus, sendCommand };
}; 
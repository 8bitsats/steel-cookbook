import React from 'react';

import AgentControlPanel from './AgentControlPanel';
import TokenDashboard from './TokenDashboard';
import { useAgentWebSocket } from './useAgentWebSocket';

const App: React.FC = () => {
  const { tokens, metaData, agentStatus, sendCommand } = useAgentWebSocket();

  return (
    <div className="app">
      <AgentControlPanel sendCommand={sendCommand} />
      <TokenDashboard tokens={tokens} metaData={metaData} agentStatus={agentStatus} />
    </div>
  );
};

export default App;

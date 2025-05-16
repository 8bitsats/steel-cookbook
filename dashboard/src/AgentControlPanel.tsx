import React, { useState } from 'react';

interface AgentControlPanelProps {
  sendCommand: (cmd: any) => void;
}

const AgentControlPanel: React.FC<AgentControlPanelProps> = ({ sendCommand }) => {
  const [task, setTask] = useState('');
  const [question, setQuestion] = useState('');

  return (
    <div className="p-4 bg-white rounded shadow mb-4 flex flex-col gap-4">
      <form
        onSubmit={e => {
          e.preventDefault();
          if (task.trim()) {
            sendCommand({ type: 'set_task', task });
            setTask('');
          }
        }}
        className="flex gap-2 items-center"
      >
        <input
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="Set new agent task..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button type="submit" className="btn btn-blue">Set Task</button>
      </form>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (question.trim()) {
            sendCommand({ type: 'ask', question });
            setQuestion('');
          }
        }}
        className="flex gap-2 items-center"
      >
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask the agent a question..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button type="submit" className="btn btn-green">Ask</button>
      </form>
    </div>
  );
};

export default AgentControlPanel; 
import React, { useState } from 'react';

import { Clock } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface Token {
  name: string;
  symbol: string;
  marketCap: number;
  price: number;
}

export interface MetaData {
  title: string;
  description: string;
}

interface TokenDashboardProps {
  tokens: Token[];
  metaData: MetaData;
  agentStatus: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57'];

const formatMarketCap = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
  return `$${value}`;
};

const TokenDashboard: React.FC<TokenDashboardProps> = ({ tokens, metaData, agentStatus }) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const marketCapData = [...tokens]
    .sort((a, b) => b.marketCap - a.marketCap)
    .slice(0, 10);

  const pieData = tokens.map(token => ({
    name: token.name,
    value: token.marketCap
  }));

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token === selectedToken ? null : token);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 p-4 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Token Discovery Dashboard</h1>
            <p className="text-sm">{metaData.title}</p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-700 p-2 rounded">
            <Clock className="h-5 w-5" />
            <span className="font-mono">Status: {agentStatus}</span>
          </div>
        </div>
        <p className="mt-2 text-sm opacity-80">{metaData.description}</p>
      </header>
      {/* Main content */}
      <main className="flex-grow p-4">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Tokens Discovered</h2>
            <p className="text-3xl font-bold text-blue-600">{tokens.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Total Market Cap</h2>
            <p className="text-3xl font-bold text-green-600">
              {formatMarketCap(tokens.reduce((sum, token) => sum + token.marketCap, 0))}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Average Market Cap</h2>
            <p className="text-3xl font-bold text-purple-600">
              {tokens.length > 0 ? formatMarketCap(tokens.reduce((sum, token) => sum + token.marketCap, 0) / tokens.length) : "$0"}
            </p>
          </div>
        </div>
        {/* Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Market Cap Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Market Cap Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marketCapData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis tickFormatter={formatMarketCap} />
                  <Tooltip formatter={(value) => formatMarketCap(Number(value))} />
                  <Bar dataKey="marketCap" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Percentage Distribution */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Market Share</h2>
            <div className="h-64 flex justify-center items-center">
              {tokens.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatMarketCap(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>
          </div>
        </div>
        {/* Token List */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Discovered Tokens</h2>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tokens.length > 0 ? (
                  tokens.map((token, index) => (
                    <tr key={index} className={selectedToken === token ? "bg-blue-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{token.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{token.symbol}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatMarketCap(token.marketCap)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${token.price.toFixed(6)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => handleTokenSelect(token)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {selectedToken === token ? "Hide Details" : "View Details"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Waiting for token discovery...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Selected Token Details */}
        {selectedToken && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Token Details: {selectedToken.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Symbol</h3>
                <p className="mt-1 text-lg font-semibold">{selectedToken.symbol}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Market Cap</h3>
                <p className="mt-1 text-lg font-semibold">{formatMarketCap(selectedToken.marketCap)}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                <p className="mt-1 text-lg font-semibold">${selectedToken.price.toFixed(6)}</p>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p className="text-sm">Agent Token Discovery Dashboard | Last updated: {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
};

export default TokenDashboard; 
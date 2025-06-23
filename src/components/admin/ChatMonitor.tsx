
import React from 'react';
import { MessageSquare, User, Clock, AlertTriangle } from 'lucide-react';

export const ChatMonitor: React.FC = () => {
  // TODO: Replace with real chat data from Supabase realtime
  const chatMessages = [
    {
      id: 1,
      username: 'user123',
      message: 'Has anyone tried the new casino?',
      timestamp: '2024-01-23 14:30',
      flagged: false
    },
    {
      id: 2,
      username: 'gambler_pro',
      message: 'Royal Casino has great bonuses!',
      timestamp: '2024-01-23 14:32',
      flagged: false
    },
    {
      id: 3,
      username: 'lucky_player',
      message: 'Be careful with Lucky Stars, I had issues...',
      timestamp: '2024-01-23 14:35',
      flagged: true
    },
    {
      id: 4,
      username: 'newbie',
      message: 'What are the best strategies for slots?',
      timestamp: '2024-01-23 14:38',
      flagged: false
    },
  ];

  const handleDeleteMessage = (messageId: number) => {
    // TODO: Implement delete message with Supabase
    console.log('Delete message:', messageId);
  };

  const handleFlagMessage = (messageId: number) => {
    // TODO: Implement flag message with Supabase
    console.log('Flag message:', messageId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Chat Monitor</h1>
        <p className="text-gray-400">Monitor global chat messages in real-time</p>
      </div>

      {/* Chat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Total Messages</p>
              <p className="text-xl font-bold text-white">1,234</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-xl font-bold text-white">89</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-gray-400 text-sm">Flagged Messages</p>
              <p className="text-xl font-bold text-white">23</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Messages */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Live Chat Messages</h3>
          <div className="flex items-center text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm">Live</span>
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`p-4 rounded-lg border-l-4 ${
              msg.flagged ? 'bg-red-900/20 border-red-500' : 'bg-gray-700 border-gray-600'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-white">{msg.username}</span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {msg.timestamp}
                    </div>
                    {msg.flagged && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300">{msg.message}</p>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleFlagMessage(msg.id)}
                    className={`p-1 rounded ${
                      msg.flagged 
                        ? 'text-red-400 hover:text-red-300' 
                        : 'text-yellow-400 hover:text-yellow-300'
                    }`}
                    title={msg.flagged ? 'Unflag Message' : 'Flag Message'}
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="text-red-400 hover:text-red-300 p-1 rounded"
                    title="Delete Message"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

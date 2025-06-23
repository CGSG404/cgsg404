
import React from 'react';
import { Ban, Trash2, Shield, User } from 'lucide-react';

export const UserManagement: React.FC = () => {
  // TODO: Replace with real user data from Supabase
  const users = [
    { id: 1, username: 'user123', email: 'user@example.com', role: 'user', status: 'active', joinDate: '2024-01-15' },
    { id: 2, username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active', joinDate: '2024-01-10' },
    { id: 3, username: 'testuser', email: 'test@example.com', role: 'user', status: 'blocked', joinDate: '2024-01-20' },
  ];

  const handleBlockUser = (userId: number) => {
    // TODO: Implement block user with Supabase
    console.log('Block user:', userId);
  };

  const handleDeleteUser = (userId: number) => {
    // TODO: Implement delete user with Supabase
    console.log('Delete user:', userId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">Manage users and their permissions</p>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-300" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{user.username}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.role === 'admin' ? (
                        <Shield className="h-4 w-4 text-yellow-500 mr-2" />
                      ) : (
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      <span className="text-sm text-white capitalize">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBlockUser(user.id)}
                        className="text-yellow-400 hover:text-yellow-300 p-1 rounded"
                        title="Block User"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

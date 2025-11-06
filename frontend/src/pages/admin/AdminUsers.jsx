import React, { useState } from 'react';
import { Search, Mail, Phone, Calendar } from 'lucide-react';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock users data
  const users = [
    {
      id: '1',
      name: 'John Student',
      email: 'john@student.edu',
      phone: '+1 (555) 123-4567',
      role: 'student',
      joined: '2024-01-15',
      orders: 5,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@student.edu',
      phone: '+1 (555) 987-6543',
      role: 'student',
      joined: '2024-02-20',
      orders: 3,
      status: 'active'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@campusmart.com',
      phone: '+1 (555) 555-5555',
      role: 'admin',
      joined: '2024-01-01',
      orders: 0,
      status: 'active'
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Users</h1>
        <p className="text-gray-600">View and manage user accounts</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Phone className="h-4 w-4" />
                      <span>{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.orders} orders
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(user.joined).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">{users.length}</div>
          <div className="text-gray-600">Total Users</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {users.filter(u => u.role === 'student').length}
          </div>
          <div className="text-gray-600">Students</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-gray-600">Admins</div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
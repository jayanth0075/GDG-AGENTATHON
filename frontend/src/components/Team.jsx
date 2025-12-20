import { Users, Mail, Calendar, MoreVertical } from 'lucide-react';

export default function Team() {
  const teamMembers = [
    { name: 'Sarah Chen', role: 'Data Analyst', email: 'sarah.chen@company.com', queries: 156, avatar: 'SC', color: 'bg-blue-500' },
    { name: 'Mike Ross', role: 'Product Manager', email: 'mike.ross@company.com', queries: 243, avatar: 'MR', color: 'bg-purple-500' },
    { name: 'Emma Wilson', role: 'Developer', email: 'emma.wilson@company.com', queries: 189, avatar: 'EW', color: 'bg-green-500' },
    { name: 'John Smith', role: 'Designer', email: 'john.smith@company.com', queries: 127, avatar: 'JS', color: 'bg-orange-500' },
    { name: 'Lisa Anderson', role: 'Marketing', email: 'lisa.anderson@company.com', queries: 98, avatar: 'LA', color: 'bg-pink-500' },
    { name: 'David Lee', role: 'Engineer', email: 'david.lee@company.com', queries: 201, avatar: 'DL', color: 'bg-indigo-500' },
  ];

  const projects = [
    { name: 'UX UI Design', team: ['SC', 'MR'], progress: 85, status: 'In Progress' },
    { name: 'Marketing Campaign', team: ['LA', 'JS'], progress: 60, status: 'In Progress' },
    { name: 'Development Sprint', team: ['EW', 'DL'], progress: 75, status: 'In Progress' },
    { name: 'Data Analysis', team: ['SC', 'DL'], progress: 90, status: 'Review' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Team</h1>
        <p className="text-gray-600 mt-2">Manage team members and collaboration</p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={20} />
            </div>
            <p className="text-sm text-gray-600">Total Members</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{teamMembers.length}</h3>
        </div>

        <div className="glass rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-600" size={20} />
            </div>
            <p className="text-sm text-gray-600">Active Projects</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{projects.length}</h3>
        </div>

        <div className="glass rounded-2xl p-6 soft-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="text-purple-600" size={20} />
            </div>
            <p className="text-sm text-gray-600">Total Queries</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{teamMembers.reduce((sum, m) => sum + m.queries, 0)}</h3>
        </div>
      </div>

      {/* Team Members */}
      <div className="glass rounded-2xl p-6 soft-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 ${member.color} rounded-full flex items-center justify-center text-white font-bold`}>
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{member.name}</h4>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Queries:</span>
                  <span className="font-semibold text-gray-900">{member.queries}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Projects */}
      <div className="glass rounded-2xl p-6 soft-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Active Projects</h3>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {project.team.map((avatar, i) => (
                      <div key={i} className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {avatar}
                      </div>
                    ))}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Review' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {project.status}
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span className="font-semibold">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-900 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


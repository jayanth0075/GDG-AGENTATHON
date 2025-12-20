import { Users, Clock, CheckCircle } from 'lucide-react';

export default function TeamWidget() {
  const teams = [
    {
      name: 'UI/UX Design',
      members: ['JD', 'AS', 'MK'],
      tasks: 3,
      progress: 75
    },
    {
      name: 'Marketing',
      members: ['LM', 'KP'],
      tasks: 5,
      progress: 60
    },
    {
      name: 'Development',
      members: ['TH', 'RP', 'JW', 'NK'],
      tasks: 8,
      progress: 45
    }
  ];

  const projects = [
    { name: 'Updates to flying bananas city', status: 'in-progress' },
    { name: 'Rewrites to finding', status: 'completed' },
    { name: 'Revised to college world', status: 'pending' },
    { name: 'National Black tax', status: 'in-progress' }
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Team</h3>
        <Users size={20} className="text-gray-400" />
      </div>

      <div className="space-y-4 mb-6">
        {teams.map((team, index) => (
          <div key={index} className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">{team.name}</h4>
              <span className="text-xs text-gray-500">{team.tasks} tasks</span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex -space-x-2">
                {team.members.map((member, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-medium border-2 border-gray-900"
                  >
                    {member}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium">{team.progress}%</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${team.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800/50 pt-4">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Clock size={16} />
          Recent Projects
        </h4>
        <div className="space-y-2">
          {projects.map((project, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/30 transition-colors">
              <span className="text-sm text-gray-300 truncate">{project.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                project.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                project.status === 'in-progress' ? 'bg-blue-600/20 text-blue-400' :
                'bg-yellow-600/20 text-yellow-400'
              }`}>
                {project.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


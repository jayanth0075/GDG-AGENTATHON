import { Image, Film, FileText, Music } from 'lucide-react';

export default function MediaWidget() {
  const media = [
    { type: 'image', name: 'Metropolitan Museum', count: 287, icon: Image, color: 'from-pink-600 to-rose-600' },
    { type: 'video', name: 'Movie Collection', count: 142, icon: Film, color: 'from-purple-600 to-indigo-600' },
    { type: 'document', name: 'Work Files', count: 543, icon: FileText, color: 'from-blue-600 to-cyan-600' },
    { type: 'audio', name: 'Soundcloud', count: 198, icon: Music, color: 'from-orange-600 to-red-600' }
  ];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Media Library</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {media.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-gray-600/50 transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <h4 className="font-medium text-sm mb-1">{item.name}</h4>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-xs text-gray-500">files</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}


import { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Plus } from 'lucide-react';

export default function TodoWidget() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Launch the AI workflow', completed: true, time: '18:26' },
    { id: 2, text: 'Upload content quite a lot', completed: false, time: '20:10' },
    { id: 3, text: 'Port version', completed: false, time: '6:30am' },
    { id: 4, text: 'Submit blog', completed: false, time: '5pm' }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([...todos, {
      id: Date.now(),
      text: newTodo,
      completed: false,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewTodo('');
  };

  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">To Do</h3>
        <span className="text-sm text-gray-400">Upcoming</span>
      </div>

      <div className="space-y-3 mb-4">
        {todos.map(todo => (
          <div
            key={todo.id}
            className="group flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className="flex-shrink-0"
            >
              {todo.completed ? (
                <CheckCircle2 size={20} className="text-green-500" />
              ) : (
                <Circle size={20} className="text-gray-500" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                {todo.text}
              </p>
              {todo.time && (
                <span className="text-xs text-gray-500">{todo.time}</span>
              )}
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add new task..."
          className="flex-1 px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={addTodo}
          className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}


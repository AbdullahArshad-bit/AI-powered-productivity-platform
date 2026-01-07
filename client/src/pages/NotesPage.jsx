import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import NoteModal from '../components/notes/NoteModal';
import Button from '../components/ui/Button';
import { Plus, Edit2, Trash2, Search, FileText, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/notes', config);
            setNotes(data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleSaveNote = async (noteData) => {
        setIsLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
        };

        try {
            if (currentNote) {
                const { data } = await axios.put(`http://localhost:5000/api/notes/${currentNote._id}`, noteData, config);
                setNotes(notes.map(n => n._id === data._id ? data : n));
            } else {
                const { data } = await axios.post('http://localhost:5000/api/notes', noteData, config);
                setNotes([data, ...notes]);
            }
            setIsModalOpen(false);
            setCurrentNote(null);
        } catch (error) {
            console.error('Error saving note:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`http://localhost:5000/api/notes/${noteId}`, config);
            setNotes(notes.filter(n => n._id !== noteId));
        } catch (error) {
            console.error("Error deleting note", error);
        }
    };

    const openModal = (note = null) => {
        setCurrentNote(note);
        setIsModalOpen(true);
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Knowledge Notes
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Capture, organize, and search your ideas and knowledge
                        </p>
                    </div>
                    <Button onClick={() => openModal()} className="shadow-lg shadow-purple-500/20">
                        <Plus size={20} className="mr-2" />
                        New Note
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search notes by title or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                </div>
            </div>

            {/* Notes Grid */}
            {filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map(note => (
                        <div
                            key={note._id}
                            className="glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all card-hover cursor-pointer group"
                            onClick={() => openModal(note)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        {note.title}
                                    </h3>
                                </div>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openModal(note);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNote(note._id);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-hidden text-sm text-slate-600 dark:text-slate-400 prose prose-sm max-w-none dark:prose-invert mb-4">
                                <ReactMarkdown>
                                    {note.content ? (note.content.length > 150 ? note.content.substring(0, 150) + '...' : note.content) : 'No content'}
                                </ReactMarkdown>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                                    <FileText size={14} className="mr-1.5" />
                                    {new Date(note.updatedAt).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </div>
                                {note.content && (
                                    <span className="text-xs text-slate-400 dark:text-slate-500">
                                        {note.content.length} chars
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg">
                        <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        {searchTerm ? 'No notes found' : 'No notes yet'}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {searchTerm ? 'Try a different search term' : 'Create your first note to capture your ideas'}
                    </p>
                    {!searchTerm && (
                        <Button onClick={() => openModal()}>
                            <Plus size={20} className="mr-2" />
                            Create Note
                        </Button>
                    )}
                </div>
            )}

            {/* Note Modal */}
            {isModalOpen && (
                <NoteModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setCurrentNote(null);
                    }}
                    onSubmit={handleSaveNote}
                    note={currentNote}
                    isLoading={isLoading}
                />
            )}
        </DashboardLayout>
    );
};

export default NotesPage;

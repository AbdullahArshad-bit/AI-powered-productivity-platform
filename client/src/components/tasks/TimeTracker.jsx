import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Play, Pause, Square, Clock, Coffee, Timer } from 'lucide-react';
import Button from '../ui/Button';

const TimeTracker = ({ taskId, onTimeUpdate }) => {
    const { user } = useContext(AuthContext);
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0); // in seconds
    const [activeLog, setActiveLog] = useState(null);
    const [mode, setMode] = useState('work'); // 'work' or 'break'
    const [pomodoroCount, setPomodoroCount] = useState(0);
    const [isPomodoro, setIsPomodoro] = useState(false);
    const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
    const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes in seconds

    useEffect(() => {
        fetchActiveLog();
    }, [taskId]);

    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    if (isPomodoro) {
                        const newTime = prevTime - 1;
                        if (newTime <= 0) {
                            handlePomodoroComplete();
                            return 0;
                        }
                        return newTime;
                    } else {
                        return prevTime + 1;
                    }
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, isPomodoro]);

    const fetchActiveLog = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/timelogs/active', config);
            if (data && data.task && data.task._id === taskId) {
                setActiveLog(data);
                setIsRunning(data.isActive);
                if (data.isActive) {
                    const elapsed = Math.floor((new Date() - new Date(data.startTime)) / 1000);
                    setTime(elapsed);
                }
            }
        } catch (error) {
            console.error('Error fetching active log:', error);
        }
    };

    const startTimer = async (usePomodoro = false) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/timelogs/start',
                { taskId, type: usePomodoro ? 'pomodoro' : 'work' },
                config
            );

            setActiveLog(data);
            setIsRunning(true);
            setIsPomodoro(usePomodoro);
            if (usePomodoro) {
                setTime(pomodoroTime);
                setMode('work');
            } else {
                setTime(0);
            }
        } catch (error) {
            console.error('Error starting timer:', error);
        }
    };

    const stopTimer = async () => {
        if (!activeLog) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            await axios.post(
                `http://localhost:5000/api/timelogs/stop/${activeLog._id}`,
                {},
                config
            );

            setIsRunning(false);
            setActiveLog(null);
            setTime(0);
            setIsPomodoro(false);
            if (onTimeUpdate) onTimeUpdate();
        } catch (error) {
            console.error('Error stopping timer:', error);
        }
    };

    const handlePomodoroComplete = async () => {
        setIsRunning(false);
        if (mode === 'work') {
            setPomodoroCount((prev) => prev + 1);
            setMode('break');
            setTime(breakTime);
            setIsPomodoro(true);
            // Auto-start break timer
            setTimeout(() => {
                setIsRunning(true);
            }, 1000);
        } else {
            // Break completed, ready for next work session
            setMode('work');
            setTime(pomodoroTime);
            setIsPomodoro(false);
            if (activeLog) {
                await stopTimer();
            }
        }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Time Tracker</h3>
                </div>
                {isPomodoro && (
                    <div className="flex items-center space-x-2 text-sm">
                        <Timer className="w-4 h-4 text-orange-500" />
                        <span className="text-slate-600 dark:text-slate-400">
                            {mode === 'work' ? 'Work' : 'Break'} • {pomodoroCount} completed
                        </span>
                    </div>
                )}
            </div>

            <div className="text-center mb-4">
                <div className={`text-4xl font-bold mb-2 ${
                    isPomodoro && mode === 'break' 
                        ? 'text-green-500' 
                        : isPomodoro 
                        ? 'text-orange-500' 
                        : 'text-indigo-500'
                }`}>
                    {formatTime(time)}
                </div>
                {isPomodoro && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        {mode === 'work' ? 'Focus Time' : 'Break Time'}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center space-x-2">
                {!isRunning ? (
                    <>
                        <Button
                            onClick={() => startTimer(false)}
                            variant="primary"
                            className="flex items-center space-x-2"
                        >
                            <Play size={16} />
                            <span>Start</span>
                        </Button>
                        <Button
                            onClick={() => startTimer(true)}
                            variant="secondary"
                            className="flex items-center space-x-2"
                        >
                            <Timer size={16} />
                            <span>Pomodoro</span>
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            onClick={stopTimer}
                            variant="secondary"
                            className="flex items-center space-x-2"
                        >
                            <Pause size={16} />
                            <span>Pause</span>
                        </Button>
                        <Button
                            onClick={stopTimer}
                            variant="ghost"
                            className="flex items-center space-x-2 text-red-600 dark:text-red-400"
                        >
                            <Square size={16} />
                            <span>Stop</span>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TimeTracker;

// src/pages/DashboardPage.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import PlayerAvatar from '../components/PlayerAvatar';
import LevelUpModal from '../components/LevelUpModal';
import AgentLog from '../components/AgentLog';
import './DashboardPage.css';
import GameMap from '../components/GameMap';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [quests, setQuests] = useState([]);
    const [proposedSideQuest, setProposedSideQuest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [logMessages, setLogMessages] = useState([]);
    const [newQuestTitle, setNewQuestTitle] = useState('');
    const [newQuestType, setNewQuestType] = useState('DAILY');
    const navigate = useNavigate();
    const previousLevelRef = useRef(null);

    useEffect(() => {
        const initializeDashboard = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) { navigate('/'); return; }
            try {
                const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
                const checkInResponse = await apiClient.post('/discipline/check-in', {}, authHeaders);
                const questsResponse = await apiClient.get('/quests/', authHeaders);
                setUser(checkInResponse.data);
                setQuests(questsResponse.data);
                setLoading(false);
                previousLevelRef.current = checkInResponse.data.level;
            } catch (error) {
                console.error("Failed to initialize dashboard:", error);
                localStorage.removeItem('accessToken');
                navigate('/');
            }
        };
        initializeDashboard();
    }, [navigate]);

    useEffect(() => {
        if (user && previousLevelRef.current !== null && user.level > previousLevelRef.current) {
            setShowLevelUpModal(true);
            const log = `LEVEL UP! You have reached Level ${user.level}. The journey continues!`;
            setLogMessages(prevLogs => [log, ...prevLogs.slice(0, 4)]);
        }
        if (user) {
            previousLevelRef.current = user.level;
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/');
    };

    const handleCreateQuest = async (e) => {
        e.preventDefault();
        if (!newQuestTitle.trim()) return;
        const token = localStorage.getItem('accessToken');
        if (!token) { navigate('/'); return; }
        try {
            const response = await apiClient.post('/quests/',
                { title: newQuestTitle, description: "", category: newQuestType, xp_value: 10 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const newQuest = response.data;
            setQuests(prevQuests => [...prevQuests, newQuest]);
            setNewQuestTitle('');
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const log = `${timestamp}: New quest accepted - '${newQuest.title}'.`;
            setLogMessages(prevLogs => [log, ...prevLogs.slice(0, 4)]);
        } catch (error) {
            console.error("Failed to create quest", error);
        }
    };

    const handleCompleteQuest = async (questId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        try {
            const response = await apiClient.post(`/quests/${questId}/complete`, {}, { headers: { Authorization: `Bearer ${token}` } });
            const { user: updatedUser, insight: agentInsight } = response.data;
            if (agentInsight?.dialogue) {
                const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const log = `${timestamp}: ${agentInsight.dialogue}`;
                setLogMessages(prevLogs => [log, ...prevLogs.slice(0, 4)]);
            }
            if (agentInsight?.side_quest) {
                setProposedSideQuest(agentInsight.side_quest);
            } else {
                setProposedSideQuest(null);
            }
            setUser(updatedUser);
            const questsResponse = await apiClient.get('/quests/', { headers: { Authorization: `Bearer ${token}` } });
            setQuests(questsResponse.data);
        } catch (error) {
            console.error("Failed to complete quest:", error.response?.data || error.message);
        }
    };

    const handleAcceptSideQuest = async () => {
        if (!proposedSideQuest) return;
        const token = localStorage.getItem('accessToken');
        try {
            const response = await apiClient.post('/quests/accept-side-quest', proposedSideQuest, { headers: { Authorization: `Bearer ${token}` } });
            const newQuest = response.data;
            setQuests(prevQuests => [...prevQuests, newQuest]);
            setProposedSideQuest(null);
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const log = `${timestamp}: Excellent! The new trial '${newQuest.title}' has been added to your journey.`;
            setLogMessages(prevLogs => [log, ...prevLogs.slice(0, 3)]);
        } catch (error) {
            console.error("Failed to accept side quest:", error);
        }
    };

    if (loading || !user) {
        return <div className="loading-spinner"></div>;
    }

    const xpForNextLevel = user.level * 100;
    const xpPercentage = user.xp > 0 ? (user.xp / xpForNextLevel) * 100 : 0;
    const dailyQuests = quests.filter(q => q.category === 'DAILY' && !q.is_completed_today);
    const milestoneTasks = quests.filter(q => q.category === 'TASK' && !q.is_permanently_completed);
    const completedQuests = quests.filter(q => q.is_completed_today);

    const renderQuests = (questList) => {
        if (!questList || questList.length === 0) return null;
        return questList.map(quest => (
            <div key={quest.id} className={`quest-item ${quest.is_completed_today ? 'completed' : ''}`}>
                <div className="quest-info"><h4>{quest.title}</h4><p>{quest.description || 'No description'}</p></div>
                <div className="quest-streak">🔥 {quest.streak} Day{quest.streak !== 1 ? 's' : ''}</div>
                {quest.is_permanently_completed || (quest.category === 'DAILY' && quest.is_completed_today) ? (
                    <button className="complete-quest-button done" disabled>Done!</button>
                ) : (
                    <button className="complete-quest-button" onClick={() => handleCompleteQuest(quest.id)}>Complete</button>
                )}
            </div>
        ));
    };

    return (
        <div className="dashboard-container">
            {showLevelUpModal && <LevelUpModal newLevel={user.level} onClose={() => setShowLevelUpModal(false)} />}
            <header className="dashboard-header">
                <div className="user-info"><PlayerAvatar level={user.level} /><h2>Welcome, {user.username}!</h2></div>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            <AgentLog messages={logMessages} />
            <div className="stats-card">
                <h3>Level {user.level}</h3>
                <div className="xp-bar"><div className="xp-bar-progress" style={{ width: `${xpPercentage}%` }}></div></div>
                <p className="xp-text">{user.xp} / {xpForNextLevel} XP</p>
            </div>
            <GameMap userLevel={user.level} />
            <div className="quests-section">
                <h3>Accept a New Quest</h3>
                <form onSubmit={handleCreateQuest} className="add-quest-form">
                    <input type="text" value={newQuestTitle} onChange={(e) => setNewQuestTitle(e.target.value)} placeholder="What is your next quest?" className="add-quest-input" />
                    <div className="quest-type-selector">
                        <label className={newQuestType === 'DAILY' ? 'active' : ''}><input type="radio" value="DAILY" checked={newQuestType === 'DAILY'} onChange={(e) => setNewQuestType(e.target.value)} /> Daily</label>
                        <label className={newQuestType === 'TASK' ? 'active' : ''}><input type="radio" value="TASK" checked={newQuestType === 'TASK'} onChange={(e) => setNewQuestType(e.target.value)} /> Task</label>
                    </div>
                    <button type="submit" className="add-quest-button">+</button>
                </form>

                {/* --- NEW: The Interactive Side Quest Card --- */}
                {proposedSideQuest && (
                    <div className="side-quest-card">
                        <h4>The Chronicler Proposes a New Trial!</h4>
                        <h5>{proposedSideQuest.title}</h5>
                        <p>{proposedSideQuest.description}</p>
                        {proposedSideQuest.resource_link && (
                             <a href={proposedSideQuest.resource_link} className="resource-link" target="_blank" rel="noopener noreferrer">
                                Consult the Ancient Scrolls (Resource)
                            </a>
                        )}
                        <div className="side-quest-actions">
                            <button onClick={handleAcceptSideQuest} className="accept-button">Accept (+{proposedSideQuest.xp_value} XP)</button>
                            <button onClick={() => setProposedSideQuest(null)} className="decline-button">Decline</button>
                        </div>
                    </div>
                )}

                <div className="quest-category">
                    <h4>Milestone Tasks</h4>
                    {milestoneTasks.length > 0 ? renderQuests(milestoneTasks) : <p className="no-quests-message">No pending milestone tasks.</p>}
                </div>
                <div className="quest-category">
                    <h4>Daily Rituals</h4>
                    {dailyQuests.length > 0 ? renderQuests(dailyQuests) : <p className="no-quests-message">All daily rituals complete for today!</p>}
                </div>
                {completedQuests.length > 0 && (
                    <div className="quest-category completed-section">
                        <h4>Chronicled Today</h4>
                        {renderQuests(completedQuests)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
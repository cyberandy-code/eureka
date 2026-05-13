// ✨ Golden Thread Tracker - Kawaii Edition ✨

// Daily Motivational Quotes
const motivationalQuotes = [
    "✨ You are building something extraordinary today! 🌟",
    "💪 Your brand is becoming clearer with each step!",
    "🎨 Golden Thread is taking shape beautifully!",
    "💕 Be kind to yourself, you're doing amazing!",
    "🌸 Every application is a step closer to your goal!",
    "🦋 Your professional growth is happening now!",
    "🌈 Introspection today = wisdom tomorrow!",
    "💎 You deserve success and connections!",
    "🌺 Your authentic self is your greatest asset!",
    "✨ Believe in your vision like we believe in you!",
    "🎀 You're building your legend! Keep going!",
    "💗 Growth comes from consistent action!",
    "🌟 Your networking today = tomorrow's opportunities!",
    "🦄 You're becoming the person you want to be!",
    "🌙 Rest when needed, but never quit your dreams!",
    "💫 Your potential is limitless!",
    "🎯 Consistency over perfection, always!",
    "🌸 Your personal brand matters to the world!",
    "💖 You deserve every opportunity coming your way!",
    "🌻 The best time to start was yesterday. The second best is NOW!",
    "✨ Small wins compound into excellence!",
    "💝 Your journey is uniquely beautiful!",
    "🎊 You're creating a legacy of growth!",
    "🌷 Beauty comes from persistence!",
    "💫 Your story is still being written!"
];

// Task definitions with points and descriptions
const TASKS = {
    exercise: {
        id: 'exercise',
        name: '💪 Daily Exercise',
        emoji: '💪',
        description: 'Get your body moving!',
        type: 'checkbox',
        points: 100,
        weeklyFreq: '5x per week'
    },
    jobApps: {
        id: 'jobApps',
        name: '💼 Job Applications',
        emoji: '💼',
        description: 'Apply to your next opportunity',
        type: 'counter',
        points: 150,
        weeklyFreq: 'Daily',
        goal: 3
    },
    branding: {
        id: 'branding',
        name: '🪞 Personal Brand Reflection',
        emoji: '🪞',
        description: 'What do you want your brand & online persona to be?',
        type: 'notes',
        points: 200,
        weeklyFreq: 'Daily',
        prompt: 'How do you want to be perceived? What\'s your unique value? What message do you want to share?'
    },
    goldenThread: {
        id: 'goldenThread',
        name: '✨ Golden Thread Intel',
        emoji: '✨',
        description: 'Build your signature project',
        type: 'duration',
        points: 200,
        weeklyFreq: 'Daily',
        unit: 'minutes'
    },
    profDev: {
        id: 'profDev',
        name: '📚 Professional Development',
        emoji: '📚',
        description: 'Courses, learning, skill-building',
        type: 'duration',
        points: 150,
        weeklyFreq: 'Daily',
        unit: 'minutes'
    },
    networking: {
        id: 'networking',
        name: '🤝 Networking',
        emoji: '🤝',
        description: 'Connect with people in your field',
        type: 'counter',
        points: 250,
        weeklyFreq: 'Weekly',
        goal: 1
    }
};

// Mood emojis and names
const moodData = {
    motivated: { emoji: '💪', label: 'Motivated' },
    neutral: { emoji: '😌', label: 'Neutral' },
    tired: { emoji: '😴', label: 'Tired' },
    excited: { emoji: '🤩', label: 'Excited' }
};

// Level thresholds
const LEVELS = [
    { name: '🌱 Beginner', minXP: 0, maxXP: 1000 },
    { name: '🌿 Growing', minXP: 1000, maxXP: 3000 },
    { name: '🌸 Blooming', minXP: 3000, maxXP: 6000 },
    { name: '🌺 Flourishing', minXP: 6000, maxXP: 10000 },
    { name: '🌹 Magnificent', minXP: 10000, maxXP: Infinity }
];

// Achievements
const ACHIEVEMENTS = [
    { id: 'firstStep', name: '👣 First Step', desc: 'Complete your first full day', icon: '👣', points: 50, requirement: { type: 'fullDay', count: 1 } },
    { id: 'weekWarrior', name: '⚔️ Week Warrior', desc: '7-day streak', icon: '⚔️', points: 200, requirement: { type: 'streak', count: 7 } },
    { id: 'monthMaster', name: '👑 Month Master', desc: '30-day streak', icon: '👑', points: 500, requirement: { type: 'streak', count: 30 } },
    { id: 'perfectDay', name: '⭐ Perfect Day', desc: 'Complete all tasks in one day', icon: '⭐', points: 150, requirement: { type: 'perfectDay', count: 1 } },
    { id: 'brandScholar', name: '📖 Branding Scholar', desc: '10 brand reflections', icon: '📖', points: 100, requirement: { type: 'branding', count: 10 } },
    { id: 'goldenBuilder', name: '🏗️ Golden Builder', desc: '50+ hours on Golden Thread', icon: '🏗️', points: 300, requirement: { type: 'goldenThread', count: 3000 } },
    { id: 'networking10', name: '🌐 Connector', desc: '10 networking activities', icon: '🌐', points: 150, requirement: { type: 'networking', count: 10 } },
    { id: 'level5', name: '✨ Magnificent', desc: 'Reach Level 5', icon: '✨', points: 500, requirement: { type: 'level', count: 5 } }
];

// App data structure
let appData = {
    today: new Date().toDateString(),
    totalXP: 0,
    unlockedAchievements: [],
    tasks: {
        exercise: { completed: false },
        jobApps: { count: 0, completed: false },
        branding: { notes: '', completed: false },
        goldenThread: { minutes: 0, completed: false },
        profDev: { minutes: 0, completed: false },
        networking: { count: 0, completed: false }
    },
    mood: '',
    summary: '',
    history: []
};

let progressChart = null;

// Initialize the app
function initApp() {
    loadData();
    checkNewDay();
    renderUI();
    attachEventListeners();
    displayDate();
    displayDailyQuote();
    updateAnalytics();
    updateAchievements();
}

// Check if it's a new day
function checkNewDay() {
    const today = new Date().toDateString();
    if (appData.today !== today) {
        // Save today's data to history
        const dayData = {
            date: appData.today,
            tasks: JSON.parse(JSON.stringify(appData.tasks)),
            mood: appData.mood,
            summary: appData.summary,
            pointsEarned: calculateDayPoints(appData.tasks),
            completionPercentage: calculateProgress()
        };
        appData.history.push(dayData);
        
        // Keep only last 30 days
        if (appData.history.length > 30) {
            appData.history.shift();
        }
        
        // Reset for new day
        appData.today = today;
        appData.tasks = {
            exercise: { completed: false },
            jobApps: { count: 0, completed: false },
            branding: { notes: '', completed: false },
            goldenThread: { minutes: 0, completed: false },
            profDev: { minutes: 0, completed: false },
            networking: { count: 0, completed: false }
        };
        appData.mood = '';
        appData.summary = '';
        saveData();
    }
}

// Display today's date
function displayDate() {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    document.getElementById('todayDate').textContent = `📅 ${formattedDate}`;
}

// Display daily motivational quote
function displayDailyQuote() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    document.getElementById('dailyQuote').textContent = motivationalQuotes[quoteIndex];
}

// Event Listeners
function attachEventListeners() {
    document.getElementById('moodSelect').addEventListener('change', (e) => {
        appData.mood = e.target.value;
        saveData();
        updateAnalytics();
    });
    document.getElementById('saveSummaryBtn').addEventListener('click', saveSummary);
}

// Render all tasks
function renderUI() {
    const tasksList = document.getElementById('tasksList');
    
    tasksList.innerHTML = Object.values(TASKS).map(task => {
        const taskData = appData.tasks[task.id];
        let taskHTML = `
            <div class="task-item ${isTaskCompleted(task.id) ? 'completed' : ''}">
                <div class="task-header">
        `;
        
        if (task.type === 'checkbox') {
            taskHTML += `
                    <input type="checkbox" class="task-checkbox" ${taskData.completed ? 'checked' : ''} 
                           onchange="toggleTask('${task.id}')">
                    <div class="task-info">
                        <span class="task-name">${task.name}</span>
                        <span class="task-desc">${task.description}</span>
                        <span class="task-points">+${task.points} pts</span>
                    </div>
                </div>
            `;
        } else if (task.type === 'counter') {
            const count = taskData.count || 0;
            taskHTML += `
                    <div class="task-info">
                        <span class="task-name">${task.name}</span>
                        <span class="task-desc">${task.description}</span>
                        <span class="task-points">+${task.points} pts per item</span>
                    </div>
                </div>
                <div class="task-tracking">
                    <button class="counter-btn" onclick="decrementCounter('${task.id}')">−</button>
                    <span class="counter-value">${count}</span>
                    <button class="counter-btn" onclick="incrementCounter('${task.id}')">+</button>
                    <input type="checkbox" class="task-checkbox" ${count > 0 ? 'checked' : ''} disabled 
                           style="margin-left: auto;">
                </div>
            `;
        } else if (task.type === 'notes') {
            taskHTML += `
                    <div class="task-info">
                        <span class="task-name">${task.name}</span>
                        <span class="task-desc">${task.description}</span>
                        <span class="task-points">+${task.points} pts</span>
                    </div>
                </div>
                <p class="reflection-prompt">${task.prompt}</p>
                <textarea class="task-notes" onchange="updateNotes('${task.id}', this.value)">${taskData.notes}</textarea>
                <div style="margin-top: 8px;">
                    <input type="checkbox" class="task-checkbox" ${taskData.notes.trim().length > 10 ? 'checked' : ''} disabled>
                    <label style="margin-left: 8px; color: var(--text-light); font-size: 0.9em;">Reflection recorded</label>
                </div>
            `;
        } else if (task.type === 'duration') {
            const minutes = taskData.minutes || 0;
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const displayTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
            
            taskHTML += `
                    <div class="task-info">
                        <span class="task-name">${task.name}</span>
                        <span class="task-desc">${task.description}</span>
                        <span class="task-points">+${task.points} pts</span>
                    </div>
                    <span class="duration-value">${displayTime}</span>
                </div>
                <div class="task-tracking">
                    <input type="number" min="0" placeholder="Minutes" value="${minutes}" 
                           onchange="updateDuration('${task.id}', this.value)">
                    <button class="counter-btn" onclick="addDuration('${task.id}', 15)">+15m</button>
                    <button class="counter-btn" onclick="addDuration('${task.id}', 30)">+30m</button>
                    <input type="checkbox" class="task-checkbox" ${minutes > 0 ? 'checked' : ''} disabled 
                           style="margin-left: auto;">
                </div>
            `;
        }
        
        taskHTML += `</div>`;
        return taskHTML;
    }).join('');
    
    restoreMood();
    restoreSummary();
}

// Toggle checkbox task
function toggleTask(taskId) {
    appData.tasks[taskId].completed = !appData.tasks[taskId].completed;
    saveData();
    renderUI();
    updateAnalytics();
}

// Increment counter
function incrementCounter(taskId) {
    appData.tasks[taskId].count++;
    appData.tasks[taskId].completed = appData.tasks[taskId].count >= TASKS[taskId].goal;
    saveData();
    renderUI();
    updateAnalytics();
}

// Decrement counter
function decrementCounter(taskId) {
    if (appData.tasks[taskId].count > 0) {
        appData.tasks[taskId].count--;
    }
    appData.tasks[taskId].completed = appData.tasks[taskId].count >= TASKS[taskId].goal;
    saveData();
    renderUI();
    updateAnalytics();
}

// Update notes
function updateNotes(taskId, value) {
    appData.tasks[taskId].notes = value;
    appData.tasks[taskId].completed = value.trim().length > 10;
    saveData();
    updateAnalytics();
}

// Update duration
function updateDuration(taskId, minutes) {
    const mins = parseInt(minutes) || 0;
    appData.tasks[taskId].minutes = Math.max(0, mins);
    appData.tasks[taskId].completed = mins > 0;
    saveData();
    renderUI();
    updateAnalytics();
}

// Add duration shortcut
function addDuration(taskId, minutes) {
    appData.tasks[taskId].minutes += minutes;
    appData.tasks[taskId].completed = true;
    saveData();
    renderUI();
    updateAnalytics();
}

// Is task completed
function isTaskCompleted(taskId) {
    const task = TASKS[taskId];
    const taskData = appData.tasks[taskId];
    
    if (task.type === 'checkbox') {
        return taskData.completed;
    } else if (task.type === 'counter') {
        return taskData.count >= task.goal;
    } else if (task.type === 'notes') {
        return taskData.notes.trim().length > 10;
    } else if (task.type === 'duration') {
        return taskData.minutes > 0;
    }
    return false;
}

// Save daily summary
function saveSummary() {
    const summary = document.getElementById('summaryText').value;
    appData.summary = summary;
    saveData();
    alert('Daily reflection saved! 💾✨');
}

// Calculate progress percentage
function calculateProgress() {
    const totalTasks = Object.keys(TASKS).length;
    const completedTasks = Object.keys(TASKS).filter(id => isTaskCompleted(id)).length;
    return Math.round((completedTasks / totalTasks) * 100);
}

// Calculate points for a day
function calculateDayPoints(tasks) {
    let points = 0;
    
    Object.keys(tasks).forEach(taskId => {
        const task = TASKS[taskId];
        const taskData = tasks[taskId];
        
        if (task.type === 'checkbox') {
            if (taskData.completed) points += task.points;
        } else if (task.type === 'counter') {
            points += taskData.count * task.points;
        } else if (task.type === 'notes') {
            if (taskData.notes.trim().length > 10) points += task.points;
        } else if (task.type === 'duration') {
            if (taskData.minutes > 0) points += task.points;
        }
    });
    
    return points;
}

// Calculate today's points
function calculateTodayPoints() {
    return calculateDayPoints(appData.tasks);
}

// Calculate current level
function getCurrentLevel() {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (appData.totalXP >= LEVELS[i].minXP) {
            return i + 1;
        }
    }
    return 1;
}

// Calculate current streak
function calculateStreak() {
    let streak = 0;
    
    if (calculateProgress() === 100) {
        streak = 1;
    } else {
        return 0;
    }
    
    for (let i = appData.history.length - 1; i >= 0; i--) {
        const day = appData.history[i];
        if (day.completionPercentage === 100) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

// Update analytics
function updateAnalytics() {
    const progress = calculateProgress();
    const todayPts = calculateTodayPoints();
    const currentLevel = getCurrentLevel();
    const streak = calculateStreak();
    
    // Add today's points to total
    appData.totalXP += todayPts > 0 ? todayPts - (appData.history.length > 0 ? appData.history[appData.history.length - 1].pointsEarned || 0 : 0) : 0;
    
    // Update header stats
    document.getElementById('headerLevel').textContent = currentLevel + ' ' + (LEVELS[currentLevel - 1]?.name.split(' ')[0] || '🌱');
    document.getElementById('headerPoints').textContent = appData.totalXP + ' ⭐';
    document.getElementById('headerStreak').textContent = streak + ' 🔥';
    document.getElementById('headerProgress').textContent = progress + '%';
    
    // Update level display
    updateLevelDisplay();
    
    // Update progress bar
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = progress + '%';
    
    // Update task breakdown
    updateTaskBreakdown();
    
    // Update history and mood tracker
    renderHistory();
    renderMoodTracker();
    
    // Update chart
    updateChart();
    
    saveData();
}

// Update level display
function updateLevelDisplay() {
    const currentLevel = getCurrentLevel();
    const currentLevelData = LEVELS[currentLevel - 1];
    const nextLevelData = LEVELS[currentLevel] || LEVELS[currentLevel - 1];
    
    document.getElementById('levelDisplay').textContent = currentLevel;
    document.getElementById('levelName').textContent = currentLevelData.name;
    document.getElementById('totalPoints').textContent = appData.totalXP;
    document.getElementById('todayPoints').textContent = calculateTodayPoints();
    
    // XP bar
    const currentXP = appData.totalXP - currentLevelData.minXP;
    const nextXP = nextLevelData.maxXP - currentLevelData.minXP;
    const xpPercent = Math.min(100, (currentXP / nextXP) * 100);
    
    document.getElementById('xpFill').style.width = xpPercent + '%';
    document.getElementById('currentXP').textContent = currentXP;
    document.getElementById('nextLevelXP').textContent = nextXP;
}

// Update task breakdown
function updateTaskBreakdown() {
    const breakdown = document.getElementById('taskBreakdown');
    
    breakdown.innerHTML = Object.values(TASKS).map(task => {
        const completed = isTaskCompleted(task.id);
        const emoji = completed ? '✅' : '⏳';
        return `
            <div class="breakdown-item ${completed ? 'completed' : ''}">
                <span>${emoji} ${task.name}</span>
                <span class="breakdown-status">${completed ? 'Done!' : 'Pending'}</span>
            </div>
        `;
    }).join('');
}

// Render history
function renderHistory() {
    const historyList = document.getElementById('historyList');
    
    if (appData.history.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No history yet! Start tracking today! 🌟</p>';
        return;
    }
    
    const last7Days = appData.history.slice(-7);
    historyList.innerHTML = last7Days.map(day => {
        const date = new Date(day.date);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        return `
            <div class="history-item">
                <strong>${dateStr}</strong> - ${day.completionPercentage}% | ${day.pointsEarned} pts
            </div>
        `;
    }).reverse().join('');
}

// Render mood tracker
function renderMoodTracker() {
    const moodTracker = document.getElementById('moodTracker');
    
    const moodCounts = {
        motivated: 0,
        neutral: 0,
        tired: 0,
        excited: 0
    };
    
    const last7Days = appData.history.slice(-6);
    last7Days.forEach(day => {
        if (day.mood && moodCounts.hasOwnProperty(day.mood)) {
            moodCounts[day.mood]++;
        }
    });
    
    if (appData.mood && moodCounts.hasOwnProperty(appData.mood)) {
        moodCounts[appData.mood]++;
    }
    
    const hasAnyMood = Object.values(moodCounts).some(count => count > 0);
    
    if (!hasAnyMood) {
        moodTracker.innerHTML = '<p class="empty-state">Start tracking your mood! 💕</p>';
        return;
    }
    
    moodTracker.innerHTML = Object.entries(moodCounts).map(([mood, count]) => {
        if (count === 0) return '';
        return `
            <div class="mood-item">
                <span class="mood-emoji">${moodData[mood].emoji}</span>
                <span class="mood-count">${count}</span>
            </div>
        `;
    }).join('');
}

// Update chart
function updateChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    const last7Days = [...appData.history.slice(-6)];
    
    if (calculateProgress() > 0 || appData.history.length === 0) {
        last7Days.push({
            date: new Date().toDateString(),
            completionPercentage: calculateProgress()
        });
    }
    
    const labels = last7Days.map(day => {
        const date = new Date(day.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    });
    
    const data = last7Days.map(day => day.completionPercentage);
    
    if (progressChart) {
        progressChart.destroy();
    }
    
    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Completion %',
                data: data,
                borderColor: '#FFB6D9',
                backgroundColor: 'rgba(255, 182, 217, 0.1)',
                borderWidth: 3,
                pointRadius: 6,
                pointBackgroundColor: '#FF99BF',
                pointBorderColor: '#FFFBFE',
                pointBorderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#5A5A7A',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#8A8AA0',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 182, 217, 0.1)'
                    }
                },
                x: {
                    ticks: { color: '#8A8AA0' },
                    grid: { display: false }
                }
            }
        }
    });
}

// Update achievements
function updateAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    
    let html = '';
    ACHIEVEMENTS.forEach(achievement => {
        const unlocked = appData.unlockedAchievements.includes(achievement.id);
        const meetsRequirement = checkAchievementRequirement(achievement);
        
        if (!unlocked && meetsRequirement) {
            appData.unlockedAchievements.push(achievement.id);
            appData.totalXP += achievement.points;
        }
        
        html += `
            <div class="achievement ${unlocked ? '' : 'opacity-50'}">
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-info">
                    <span class="achievement-name">${achievement.name}</span>
                    <span class="achievement-desc">${achievement.desc}</span>
                </div>
                <span class="achievement-points">+${achievement.points}</span>
            </div>
        `;
    });
    
    if (html) {
        achievementsList.innerHTML = html;
    }
}

// Check achievement requirement
function checkAchievementRequirement(achievement) {
    const req = achievement.requirement;
    
    if (req.type === 'streak') {
        return calculateStreak() >= req.count;
    } else if (req.type === 'fullDay') {
        return calculateProgress() === 100;
    } else if (req.type === 'perfectDay') {
        return calculateProgress() === 100;
    } else if (req.type === 'branding') {
        return appData.history.filter(d => d.tasks.branding.notes.length > 10).length >= req.count;
    } else if (req.type === 'goldenThread') {
        return appData.history.reduce((sum, d) => sum + (d.tasks.goldenThread?.minutes || 0), 0) >= req.count;
    } else if (req.type === 'networking') {
        return appData.history.reduce((sum, d) => sum + (d.tasks.networking?.count || 0), 0) >= req.count;
    } else if (req.type === 'level') {
        return getCurrentLevel() >= req.count;
    }
    return false;
}

// Restore mood
function restoreMood() {
    document.getElementById('moodSelect').value = appData.mood;
}

// Restore summary
function restoreSummary() {
    document.getElementById('summaryText').value = appData.summary;
}

// Data persistence
function saveData() {
    localStorage.setItem('goldenThreadData', JSON.stringify(appData));
}

function loadData() {
    const saved = localStorage.getItem('goldenThreadData');
    if (saved) {
        appData = JSON.parse(saved);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

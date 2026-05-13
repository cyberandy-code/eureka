// ✨ Daily Task Tracker - Kawaii Edition ✨

// Daily Motivational Quotes
const motivationalQuotes = [
    "✨ You are capable of amazing things! 🌟",
    "💪 Progress over perfection, always!",
    "🎨 Today is your masterpiece, create it!",
    "💕 Be kind to yourself, you're doing great!",
    "🌸 Every small step counts, keep going!",
    "🦋 You are stronger than you think!",
    "🌈 Your efforts will bloom into success!",
    "💎 You are worthy of all your dreams!",
    "🌺 Every day is a fresh start, shine bright!",
    "✨ Believe in yourself like we believe in you!",
    "🎀 You're a beautiful work in progress!",
    "💗 Your hard work is paying off!",
    "🌟 Keep going, you're almost there!",
    "🦄 You're magical, never forget that!",
    "🌙 Rest when you need to, but don't give up!",
    "💫 Your potential is limitless!",
    "🎯 Focus on progress, not perfection!",
    "🌸 Bloom where you're planted!",
    "💖 You deserve celebration today!",
    "🌻 Let today be better than yesterday!",
    "✨ Small wins are still wins, celebrate!",
    "💝 Take care of yourself first!",
    "🎊 You're doing better than you think!",
    "🌷 Beauty comes from persistence!",
    "💫 Make today count, you've got this!"
];

// Mood emojis and names
const moodData = {
    motivated: { emoji: '💪', label: 'Motivated' },
    neutral: { emoji: '😌', label: 'Neutral' },
    tired: { emoji: '😴', label: 'Tired' },
    excited: { emoji: '🤩', label: 'Excited' }
};

// Data structure
let appData = {
    today: new Date().toDateString(),
    tasks: [],
    mood: '',
    summary: '',
    history: []
};

// Chart instance
let progressChart = null;

// Initialize the app
function initApp() {
    loadData();
    renderUI();
    attachEventListeners();
    displayDate();
    displayDailyQuote();
    updateAnalytics();
    checkNewDay();
}

// Check if it's a new day
function checkNewDay() {
    const today = new Date().toDateString();
    if (appData.today !== today) {
        // Save today's data to history
        if (appData.tasks.length > 0 || appData.mood || appData.summary) {
            const dayData = {
                date: appData.today,
                tasks: appData.tasks,
                mood: appData.mood,
                summary: appData.summary,
                completedCount: appData.tasks.filter(t => t.completed).length,
                totalCount: appData.tasks.length,
                progressPercentage: calculateProgress()
            };
            appData.history.push(dayData);
            
            // Keep only last 30 days
            if (appData.history.length > 30) {
                appData.history.shift();
            }
        }
        
        // Reset for new day
        appData.today = today;
        appData.tasks = [];
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
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    document.getElementById('saveSummaryBtn').addEventListener('click', saveSummary);
    document.getElementById('moodSelect').addEventListener('change', (e) => {
        appData.mood = e.target.value;
        saveData();
        updateAnalytics();
    });
}

// Add a new task
function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task! 🌟');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleTimeString()
    };
    
    appData.tasks.push(task);
    input.value = '';
    saveData();
    renderUI();
    updateAnalytics();
}

// Toggle task completion
function toggleTask(id) {
    const task = appData.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveData();
        renderUI();
        updateAnalytics();
    }
}

// Delete a task
function deleteTask(id) {
    appData.tasks = appData.tasks.filter(t => t.id !== id);
    saveData();
    renderUI();
    updateAnalytics();
}

// Save daily summary
function saveSummary() {
    const summary = document.getElementById('summaryText').value;
    appData.summary = summary;
    saveData();
    alert('Summary saved! 💾✨');
}

// Render UI
function renderUI() {
    renderTaskList();
    restoreMoodSelection();
    restoreSummary();
}

// Render task list
function renderTaskList() {
    const taskList = document.getElementById('taskList');
    
    if (appData.tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-state">No tasks yet! Add one to get started! 🎀</li>';
        return;
    }
    
    taskList.innerHTML = appData.tasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="btn btn-delete" onclick="deleteTask(${task.id})">Delete 🗑️</button>
            </div>
        </li>
    `).join('');
}

// Restore mood selection
function restoreMoodSelection() {
    const moodSelect = document.getElementById('moodSelect');
    moodSelect.value = appData.mood;
}

// Restore summary
function restoreSummary() {
    document.getElementById('summaryText').value = appData.summary;
}

// Calculate progress percentage
function calculateProgress() {
    if (appData.tasks.length === 0) return 0;
    const completed = appData.tasks.filter(t => t.completed).length;
    return Math.round((completed / appData.tasks.length) * 100);
}

// Calculate current streak
function calculateStreak() {
    let streak = 0;
    
    // Check if today is completed (100%)
    if (appData.tasks.length > 0 && calculateProgress() === 100) {
        streak = 1;
    } else if (appData.tasks.length === 0) {
        // If no tasks today, check history
        streak = 0;
    } else {
        return 0;
    }
    
    // Count backwards in history
    for (let i = appData.history.length - 1; i >= 0; i--) {
        const day = appData.history[i];
        if (day.progressPercentage === 100 || day.totalCount === 0) {
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
    const completed = appData.tasks.filter(t => t.completed).length;
    const total = appData.tasks.length;
    
    // Update progress bar
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = progress + '%';
    
    // Update stats
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('currentStreak').textContent = calculateStreak() + ' 🔥';
    
    // Update history
    renderHistory();
    
    // Update mood tracker
    renderMoodTracker();
    
    // Update chart
    updateChart();
}

// Render history
function renderHistory() {
    const historyList = document.getElementById('historyList');
    
    if (appData.history.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No history yet! Start tracking today! 🌟</p>';
        return;
    }
    
    // Get last 7 days
    const last7Days = appData.history.slice(-7);
    
    historyList.innerHTML = last7Days.map(day => {
        const date = new Date(day.date);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        return `
            <div class="history-item">
                <strong>${dateStr}</strong> - ${day.completedCount}/${day.totalCount} tasks (${day.progressPercentage}%)
            </div>
        `;
    }).reverse().join('');
}

// Render mood tracker
function renderMoodTracker() {
    const moodTracker = document.getElementById('moodTracker');
    
    // Count moods from last 7 days + today
    const moodCounts = {
        motivated: 0,
        neutral: 0,
        tired: 0,
        excited: 0
    };
    
    // Count from history
    const last7Days = appData.history.slice(-6);
    last7Days.forEach(day => {
        if (day.mood && moodCounts.hasOwnProperty(day.mood)) {
            moodCounts[day.mood]++;
        }
    });
    
    // Count today's mood
    if (appData.mood && moodCounts.hasOwnProperty(appData.mood)) {
        moodCounts[appData.mood]++;
    }
    
    // Check if any mood has been recorded
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

// Update progress chart
function updateChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    // Get last 7 days including today
    const last7Days = [...appData.history.slice(-6)];
    
    // Add today
    if (appData.tasks.length > 0 || appData.mood || appData.summary) {
        last7Days.push({
            date: new Date().toDateString(),
            progressPercentage: calculateProgress()
        });
    }
    
    // Get labels (days of week)
    const labels = last7Days.map(day => {
        const date = new Date(day.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    });
    
    // Get data (percentages)
    const data = last7Days.map(day => day.progressPercentage);
    
    // Destroy old chart if exists
    if (progressChart) {
        progressChart.destroy();
    }
    
    // Create new chart
    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Progress %',
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

// Data persistence
function saveData() {
    localStorage.setItem('taskTrackerData', JSON.stringify(appData));
}

function loadData() {
    const saved = localStorage.getItem('taskTrackerData');
    if (saved) {
        appData = JSON.parse(saved);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

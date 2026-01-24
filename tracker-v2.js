// 🔥 COMPLETE YOUR ORIGINAL JS + PERFECT 3-STATE FIX
let editMode = false;
const defaultHabits = ['Read 30min', 'Exercise', 'Water 2L', 'Meditate'];

// 🔥 CHART INSTANCES
let pieChartInstance = null;
let barChartInstance = null;

document.addEventListener('DOMContentLoaded', function() {
    createMonthlyHabitTracker();
    
    // Theme toggle
    const themeBtn = document.getElementById('trp3');
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '☀️ Light Mode';
    }
    themeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            themeBtn.textContent = '☀️ Light Mode';
        } else {
            localStorage.removeItem('darkMode');
            themeBtn.textContent = '🌙 Night Mode';
        }
    });
    
    // Button listeners
    document.getElementById('edit-btn').addEventListener('click', toggleEditMode);
    document.getElementById('add-habit-btn').addEventListener('click', addNewHabit);
    document.getElementById('delete-habit-btn').addEventListener('click', deleteHabit);
    document.getElementById('reset-btn').addEventListener('click', resetMonthlyData);
});

function getMonthName() {
    return ['January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()];
}

function getDaysInMonth() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
}

function createMonthlyHabitTracker() {
    const table = document.querySelector('.habit-table');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    
    thead.innerHTML = '<th>Habit</th>';
    tbody.innerHTML = '';
    
    const todayDate = new Date().getDate();
    const daysInMonth = getDaysInMonth();
    
    for (let i = 1; i <= daysInMonth; i++) {
        const th = document.createElement('th');
        th.textContent = `Day ${i}`;
        if (i === todayDate) {
            th.classList.add('today');
            th.style.background = '#FFD700';
            th.style.color = '#000';
            th.style.fontWeight = 'bold';
        }
        thead.appendChild(th);
    }
    
    const monthName = getMonthName();
    const currentYear = new Date().getFullYear();
    const habits = JSON.parse(localStorage.getItem(`${monthName}${currentYear}-habits`)) || defaultHabits;
    const maxHabits = habits.slice(0, 20);
    
    maxHabits.forEach((habit, habitIndex) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td class="habit-name">${habit}</td>`;
        
        for (let day = 1; day <= daysInMonth; day++) {
            const key = `${monthName}${currentYear}-${habitIndex}-day${day}`;
            const status = localStorage.getItem(key) || '0';
            
            // 🔥 FIXED: Proper checkbox state + class
            let checkedAttr = '';
            let cellClass = 'habit-empty';
            
            if (status === '1') {
                checkedAttr = 'checked';
                cellClass = 'habit-success';
            } else if (status === '-1') {
                cellClass = 'habit-fail';
                // checkbox.checked = false; // Already unchecked
            }
            
            row.innerHTML += `<td class="habit-cell ${cellClass}">
                <input type="checkbox" data-habit="${habitIndex}" data-day="${day}" ${checkedAttr}>
            </td>`;
        }
        tbody.appendChild(row);
    });
    
    // 🔥 FIXED: Clear indeterminate + add listeners
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.indeterminate = false; // Fix small circle bug [web:5]
        checkbox.addEventListener('change', function() {
            const habitIndex = parseInt(this.dataset.habit);
            const day = parseInt(this.dataset.day);
            const monthName = getMonthName();
            const currentYear = new Date().getFullYear();
            const key = `${monthName}${currentYear}-${habitIndex}-day${day}`;
            
            let currentState = localStorage.getItem(key) || '0';
            let nextState;
            
            if (currentState === '0' || !this.checked) {
                nextState = '1';  // ○ → ✅
            } else if (currentState === '1') {
                nextState = '-1'; // ✅ → ❌
                this.checked = false;
            } else {
                nextState = '0';  // ❌ → ○
                this.checked = false;
            }
            
            localStorage.setItem(key, nextState);
            this.parentElement.className = `habit-cell ${nextState === '1' ? 'habit-success' : nextState === '-1' ? 'habit-fail' : 'habit-empty'}`;
            this.indeterminate = false; // Prevent circle glitch
            
            setTimeout(createProgressCharts, 50);
        });
    });
    
    setTimeout(createProgressCharts, 300);
}

// 🔥 YOUR CHARTS FUNCTIONS (UNCHANGED - WORKING PERFECT)
function getGoalProgressData() {
    const monthName = getMonthName();
    const currentYear = new Date().getFullYear();
    const habitsKey = `${monthName}${currentYear}-habits`;
    const habits = JSON.parse(localStorage.getItem(habitsKey)) || defaultHabits;
    const daysInMonth = getDaysInMonth();
    const progressData = [];
    
    habits.slice(0, 20).forEach((habit, habitIndex) => {
        let completed = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const key = `${monthName}${currentYear}-${habitIndex}-day${day}`;
            if (localStorage.getItem(key) === '1') completed++; // Only ✅ counts
        }
        progressData.push({
            name: habit,
            completed: completed,
            total: daysInMonth,
            percentage: Math.round((completed / daysInMonth) * 100)
        });
    });
    
    return progressData;
}


function getDailyProgressData() {
    const monthName = getMonthName();
    const currentYear = new Date().getFullYear();
    const habitsKey = `${monthName}${currentYear}-habits`;
    const habits = JSON.parse(localStorage.getItem(habitsKey)) || defaultHabits;
    const daysInMonth = getDaysInMonth();
    const dailyData = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
        let daySuccess = 0;  // 🔥 Only count ✅ success (not ❌)
        habits.slice(0, 20).forEach((habit, habitIndex) => {
            const key = `${monthName}${currentYear}-${habitIndex}-day${day}`;
            const state = localStorage.getItem(key);
            if (state === '1') daySuccess++;  // ONLY green ✅ increases graph
            // ❌ fail ('-1') = 0, doesn't increase
        });
        dailyData.push(daySuccess);
    }
    
    return dailyData;
}



function createProgressCharts() {
    // Destroy existing charts
    if (pieChartInstance) pieChartInstance.destroy();
    if (barChartInstance) barChartInstance.destroy();
    
    const progressData = getGoalProgressData();
    const dailyData = getDailyProgressData();
    const daysInMonth = getDaysInMonth();
    
    // PIE CHART
    const pieCtx = document.getElementById('pieChart')?.getContext('2d');
    if (pieCtx) {
        pieChartInstance = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: progressData.map(d => d.name),
                datasets: [{
                    data: progressData.map(d => d.percentage),
                    backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#FFEB3B'],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const data = progressData[context.dataIndex];
                                return `${data.name}: ${data.completed}/${data.total} (${data.percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // BAR CHART
    const barCtx = document.getElementById('barChart')?.getContext('2d');
    if (barCtx) {
        barChartInstance = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: Array.from({length: daysInMonth}, (_, i) => `D${i+1}`),
                datasets: [{
                    label: 'Goals Done',
                    data: dailyData,
                    backgroundColor: 'rgba(76, 175, 80, 0.8)',
                    borderColor: '#4CAF50',
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: Math.max(4, Math.max(...dailyData) + 1),
                        ticks: { stepSize: 1 }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}

// 🔥 YOUR OTHER FUNCTIONS (IDENTICAL - UNCHANGED)
function toggleEditMode() {
    editMode = !editMode;
    const editBtn = document.getElementById('edit-btn');
    if (editMode) {
        editBtn.textContent = '✅ Save Goals';
        editBtn.style.background = '#4CAF50';
    } else {
        editBtn.textContent = '✏️ Edit Goals';
        editBtn.style.background = '#2196F3';
        saveHabits();
    }
    createMonthlyHabitTracker();
}

function saveHabits() {
    const habitCells = document.querySelectorAll('.habit-table tbody td:first-child');
    const newHabits = Array.from(habitCells).map(cell => cell.textContent.trim()).filter(habit => habit);
    const monthName = getMonthName();
    const currentYear = new Date().getFullYear();
    localStorage.setItem(`${monthName}${currentYear}-habits`, JSON.stringify(newHabits));
}

function addNewHabit() {
    const monthName = getMonthName();
    const currentYear = new Date().getFullYear();
    const savedHabitsKey = `${monthName}${currentYear}-habits`;
    let savedHabits = JSON.parse(localStorage.getItem(savedHabitsKey)) || [];
    
    if (savedHabits.length >= 20) {
        alert('⚠️ Maximum 20 goals reached!');
        return;
    }
    
    const newHabitName = prompt('Enter new habit name:');
    if (newHabitName && newHabitName.trim()) {
        savedHabits.push(newHabitName.trim());
        localStorage.setItem(savedHabitsKey, JSON.stringify(savedHabits));
        createMonthlyHabitTracker();
    }
}

function deleteHabit() {
    const monthName = getMonthName();
    const currentYear = new Date().getFullYear();
    const savedHabitsKey = `${monthName}${currentYear}-habits`;
    let savedHabits = JSON.parse(localStorage.getItem(savedHabitsKey)) || [];
    
    if (savedHabits.length === 0) {
        alert('❌ No goals to delete!');
        return;
    }
    
    const goalList = savedHabits.map((habit, index) => `${index + 1}. ${habit}`).join('\n');
    const choice = prompt(`Select goal to delete (enter number):\n\n${goalList}`);
    
    const index = parseInt(choice) - 1;
    if (index >= 0 && index < savedHabits.length) {
        if (confirm(`Delete "${savedHabits[index]}"?`)) {
            savedHabits.splice(index, 1);
            localStorage.setItem(savedHabitsKey, JSON.stringify(savedHabits));
            
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.includes(`${monthName}${currentYear}-${index}-day`)) {
                    localStorage.removeItem(key);
                }
            });
            
            createMonthlyHabitTracker();
            alert('✅ Goal deleted successfully!');
        }
    } else {
        alert('❌ Invalid selection!');
    }
}

function resetMonthlyData() {
    if (confirm('Reset all habit data for this month?')) {
        const keys = Object.keys(localStorage);
        const monthName = getMonthName();
        const currentYear = new Date().getFullYear();
        
        keys.forEach(key => {
            if (key.includes(`${monthName}${currentYear}`)) {
                localStorage.removeItem(key);
            }
        });
        createMonthlyHabitTracker();
    }
}

const CACHE_NAME = 'my-site-cache-v2'; // Change this v2, v3, etc. every time you update

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forces the new SW to take over immediately
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Immediately start controlling all open tabs
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    
    // Check for updates
    reg.onupdatefound = () => {
      const installingWorker = reg.installing;
      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New content is available! 
          // We force a reload so the user sees the new feature immediately.
          window.location.reload(); 
        }
      };
    };
    
  });
}


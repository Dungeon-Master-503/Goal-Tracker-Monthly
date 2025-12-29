// COMPLETE JS - TODAY HIGHLIGHT BULLETPROOF
let editMode = false;
const defaultHabits = ['Read 30min', 'Exercise', 'Water 2L', 'Meditate'];

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
    
    document.getElementById('edit-btn').addEventListener('click', toggleEditMode);
    document.getElementById('add-habit-btn').addEventListener('click', addNewHabit);
    document.getElementById('delete-habit-btn').addEventListener('click', deleteHabit);
    document.getElementById('reset-btn').addEventListener('click', resetMonthlyData);
});

function createMonthlyHabitTracker() {
    const table = document.querySelector('.habit-table');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const todayDate = today.getDate();
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'][currentMonth];
    
    thead.innerHTML = `<th>${monthName} ${currentYear}</th>`;
    tbody.innerHTML = '';
    
    // ✅ BULLETPROOF TODAY HIGHLIGHT
    for (let i = 1; i <= daysInMonth; i++) {
        const th = document.createElement('th');
        const dateObj = new Date(currentYear, currentMonth, i);
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
        
        th.innerHTML = `${i}<br><small>${dayName}</small>`;
        
        // FORCE TODAY HIGHLIGHT - !important styles
        if (i === todayDate) {
            th.setAttribute('style', `
                background: #FFD700 !important;
                color: #000 !important;
                font-weight: bold !important;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.1) !important;
                z-index: 20 !important;
                position: sticky !important;
                top: 0 !important;
            `);
            th.classList.add('today');
        } else {
            th.style.cssText = 'font-size:12px;text-align:center;padding:8px 4px;white-space:nowrap;';
        }
        
        thead.appendChild(th);
    }
    
    // 20 GOAL LIMIT
    const savedHabitsKey = `${monthName}${currentYear}-habits`;
    let habitsArray = JSON.parse(localStorage.getItem(savedHabitsKey)) || defaultHabits;
    habitsArray.slice(0, 20).forEach((habit, habitIndex) => {
        const row = document.createElement('tr');
        const habitCell = document.createElement('td');
        habitCell.textContent = habit;
        habitCell.contentEditable = editMode;
        row.appendChild(habitCell);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'habit-check';
            
            const saved = localStorage.getItem(`${monthName}${currentYear}-${habitIndex}-day${day}`);
            checkbox.checked = saved === 'true';
            
            checkbox.addEventListener('change', () => {
                localStorage.setItem(`${monthName}${currentYear}-${habitIndex}-day${day}`, checkbox.checked);
            });
            
            cell.appendChild(checkbox);
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    });
}

// Keep all other functions exactly the same...
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
    
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()];
    const currentYear = new Date().getFullYear();
    
    localStorage.setItem(`${monthName}${currentYear}-habits`, JSON.stringify(newHabits));
}

function addNewHabit() {
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()];
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
    const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()];
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
            
            for (let i = index; i < savedHabits.length; i++) {
                for (let day = 1; day <= 31; day++) {
                    const oldKey = `${monthName}${currentYear}-${i}-day${day}`;
                    const newKey = `${monthName}${currentYear}-${(i+1)}-day${day}`;
                    const value = localStorage.getItem(oldKey);
                    if (value) {
                        localStorage.setItem(newKey, value);
                        localStorage.removeItem(oldKey);
                    }
                }
            }
            
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
        const monthName = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'][new Date().getMonth()];
        const currentYear = new Date().getFullYear();
        
        keys.forEach(key => {
            if (key.includes(`${monthName}${currentYear}`)) {
                localStorage.removeItem(key);
            }
        });
        createMonthlyHabitTracker();
    }
}

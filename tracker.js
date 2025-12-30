// COMPLETE JS - RED ❌ MARK WORKING
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
    let table = document.querySelector('.habit-table');
    if (!table) {
        table = document.createElement('table');
        table.className = 'habit-table';
        document.querySelector('.table-container').appendChild(table);
    }
    
    table.innerHTML = `
        <thead><tr></tr></thead>
        <tbody></tbody>
    `;
    
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
    
    for (let i = 1; i <= daysInMonth; i++) {
        const th = document.createElement('th');
        const dateObj = new Date(currentYear, currentMonth, i);
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
        
        th.innerHTML = `${i}<br><small>${dayName}</small>`;
        
        if (i === todayDate) {
            th.id = 'today-column';
            th.classList.add('today');
        }
        
        thead.appendChild(th);
    }
    
    tbody.innerHTML = '';
    
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
            const status = getHabitStatus(habitIndex, day, monthName, currentYear);
            cell.className = 'habit-cell';
            cell.innerHTML = createHabitMark(status);
            
            // ✅ FIXED CLICK HANDLER - WORKS NOW
            cell.addEventListener('click', function(e) {
                e.stopPropagation();
                const currentStatus = getHabitStatus(habitIndex, day, monthName, currentYear);
                const newStatus = cycleHabitStatus(currentStatus);
                setHabitStatus(habitIndex, day, newStatus, monthName, currentYear);
                cell.innerHTML = createHabitMark(newStatus);
            });
            
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    });
    
    setTimeout(() => {
        const todayCol = document.getElementById('today-column');
        if (todayCol) {
            todayCol.style.background = '#FFD700';
            todayCol.style.color = '#000';
            todayCol.style.fontWeight = 'bold';
        }
    }, 100);
}

// ✅ 3-STATE SYSTEM: empty(0), success(1), fail(-1)
function getHabitStatus(habitIndex, day, monthName, year) {
    const saved = localStorage.getItem(`${monthName}${year}-${habitIndex}-day${day}`);
    if (saved === null) return 0;
    return parseInt(saved);
}

function setHabitStatus(habitIndex, day, status, monthName, year) {
    localStorage.setItem(`${monthName}${year}-${habitIndex}-day${day}`, status.toString());
}

function cycleHabitStatus(currentStatus) {
    if (currentStatus === 0) return 1;      // ○ → ✓
    if (currentStatus === 1) return -1;     // ✓ → ❌
    if (currentStatus === -1) return 0;     // ❌ → ○
    return 0;
}

function createHabitMark(status) {
    if (status === 1) {
        return '<span class="habit-success">✓</span>';
    } else if (status === -1) {
        return '<span class="habit-fail">❌</span>';
    } else {
        return '<span class="habit-empty">○</span>';
    }
}

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

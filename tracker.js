// FINAL FIX - TODAY HIGHLIGHT GUARANTEED
let editMode = false;
const defaultHabits = ['Read 30min', 'Exercise', 'Water 2L', 'Meditate'];

document.addEventListener('DOMContentLoaded', function() {
    createMonthlyHabitTracker();a
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
    
    // DAYS WITH PERFECT TODAY HIGHLIGHT
    for (let i = 1; i <= daysInMonth; i++) {
        const th = document.createElement('th');
        const dateObj = new Date(currentYear, currentMonth, i);
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
        
        th.innerHTML = `${i}<br><small>${dayName}</small>`;
        th.className = 'day-header';
        
        // ✅ ABSOLUTE TODAY HIGHLIGHT
        if (i === todayDate) {
            th.id = 'today-column';
            th.classList.add('today');
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
    
    // ✅ FINAL HIGHLIGHT ENFORCEMENT (runs after table render)
    setTimeout(() => {
        const todayCol = document.getElementById('today-column');
        if (todayCol) {
            todayCol.style.background = '#FFD700';
            todayCol.style.color = '#000';
            todayCol.style.fontWeight = 'bold';
        }
    }, 100);
}

// Rest of functions unchanged...
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
    
    const monthName = ['January', '


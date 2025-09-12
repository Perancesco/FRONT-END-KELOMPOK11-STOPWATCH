// Referensi Logic Stopwatch dan Timer
// https://github.com/shivlalsharma/stopwatch-timer

const themeToggle = document.getElementById('ganti_tema');
const body = document.body;
const tampilin_hasil_jam = document.getElementById('tampilin_hasil_jam');
const tampilin_hasil_stopwatch = document.getElementById('tampilin_hasil_stopwatch');
const tampilin_hasil_timer = document.getElementById('tampilin_hasil_timer');
const clockSection = document.getElementById('bagian_jam_section_jam');
const stopwatchSection = document.getElementById('bagian_stopwatch_section_stopwatch');
const timerSection = document.getElementById('bagian_timer_section_timer');
const clockDisplay = document.getElementById('tampilan_jam');
const dateDisplay = document.getElementById('tampilan_tanggal');
const timeDisplay = document.getElementById('tampilan_waktu');
const tombol_stopwatch_start = document.getElementById('tombol_stopwatch_start');
const tombol_stopwatch_stop = document.getElementById('tombol_stopwatch_stop');
const tombol_stopwatch_reset = document.getElementById('tombol_stopwatch_reset');
const historyList = document.getElementById('history_rep_stopwatch');
const resetHistoryList = document.getElementById('reset-history_rep_stopwatch');
const timerDisplay = document.getElementById('tampilan_timer');
const hoursInput = document.getElementById('input_timer_jam');
const minutesInput = document.getElementById('input_timer_menit');
const secondsInput = document.getElementById('input_timer_detik');
const tombol_timer_start = document.getElementById('tombol_timer_start');
const tombol_timer_stop = document.getElementById('tombol_timer_stop');
const tombol_timer_reset = document.getElementById('tombol_timer_reset');
let mili_detik = 0, detik = 0, menit = 0, jam = 0;
let stopwatchTimeId = null;
let isStopwatchRunning = false;
let historyCounter = 1, sessionCounter = 1;
let timerInterval = null, totalSeconds = 0;

themeToggle.addEventListener('change', () => { body.classList.toggle('light-mode'); });
tampilin_hasil_jam.addEventListener('click', () => {
    clockSection.classList.remove('hidden');
    stopwatchSection.classList.add('hidden');
    timerSection.classList.add('hidden');
    tampilin_hasil_jam.classList.add('active');
    tampilin_hasil_stopwatch.classList.remove('active');
    tampilin_hasil_timer.classList.remove('active');
});
tampilin_hasil_stopwatch.addEventListener('click', () => {
    stopwatchSection.classList.remove('hidden');
    clockSection.classList.add('hidden');
    timerSection.classList.add('hidden');
    tampilin_hasil_stopwatch.classList.add('active');
    tampilin_hasil_jam.classList.remove('active');
    tampilin_hasil_timer.classList.remove('active');
});
tampilin_hasil_timer.addEventListener('click', () => {
    timerSection.classList.remove('hidden');
    clockSection.classList.add('hidden');
    stopwatchSection.classList.add('hidden');
    tampilin_hasil_timer.classList.add('active');
    tampilin_hasil_jam.classList.remove('active');
    tampilin_hasil_stopwatch.classList.remove('active');
});

function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockDisplay.innerText = `${h}:${m}:${s}`;
    const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const bulan = ['Januari', 'Febuari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const namaHari = hari[now.getDay()];
    const tanggal = now.getDate();
    const namaBulan = bulan[now.getMonth()];
    const tahun = now.getFullYear();
    dateDisplay.innerText = `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
}
updateClock();
setInterval(updateClock, 1000);

const displayStopwatchTime = () => {
    mili_detik++; 
    if (mili_detik == 100) { 
        mili_detik = 0; 
        detik++; 
    } 
    if (detik == 60) { 
        detik = 0; 
        menit++; 
    } 
    if (menit == 60) { 
        menit = 0; 
        jam++; 
    }
    if ((detik === 30 || detik === 0) && mili_detik< 2 && (menit > 0 || detik > 0 || jam > 0)) {
        stopwatchSection.classList.add('special-effect');
        setTimeout(() => { stopwatchSection.classList.remove('special-effect'); }, 700);
    }
    timeDisplay.innerText = `${String(jam).padStart(2, '0')}:${String(menit).padStart(2, '0')}:${String(detik).padStart(2, '0')}.${String(mili_detik
    
    ).padStart(2, '0')}`;
};
tombol_stopwatch_start.addEventListener('click', () => {
    if (isStopwatchRunning) 
        return; 
    isStopwatchRunning = true;
    stopwatchTimeId = setInterval(displayStopwatchTime, 10);
});
tombol_stopwatch_stop.addEventListener('click', () => {
    if (!isStopwatchRunning) 
        return; 
    isStopwatchRunning = false;
    clearInterval(stopwatchTimeId); 
    addHistory();
});
tombol_stopwatch_reset.addEventListener('click', () => {
    clearInterval(stopwatchTimeId); isStopwatchRunning = false;
    if (jam > 0 || menit > 0 || detik > 0 || mili_detik
     > 0) {
        const listItem = document.createElement('li');
        listItem.textContent = `Sesi ${sessionCounter}: ${timeDisplay.innerText}`;
        resetHistoryList.prepend(listItem); sessionCounter++;
    }
    mili_detik
 = detik = menit = jam = 0; timeDisplay.innerText = '00:00:00.00';
    historyList.innerHTML = ""; historyCounter = 1;
});
function addHistory() {
    const listItem = document.createElement('li');
    listItem.textContent = `Rep ${historyCounter}: ${timeDisplay.innerText}`;
    historyList.prepend(listItem); historyCounter++;
}

function updateTimerDisplay() {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    timerDisplay.innerText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
function startTimer() {
    if (timerInterval) return; 

    if (totalSeconds <= 0) {
        let hours = parseInt(hoursInput.value) || 0;
        let minutes = parseInt(minutesInput.value) || 0;
        let seconds = parseInt(secondsInput.value) || 0;
        totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    }

    if (totalSeconds <= 0) return; 

    timerSection.classList.remove('timer-done');
    updateTimerDisplay(); 

    timerInterval = setInterval(() => {
        totalSeconds--;
        updateTimerDisplay();
        
        if (totalSeconds < 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            totalSeconds = 0; 
            timerSection.classList.add('timer-done'); 
        }
    }, 1000);
}
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}
function resetTimer() {
    stopTimer();
    totalSeconds = 0;
    hoursInput.value = "";
    minutesInput.value = "";
    secondsInput.value = "";
    timerDisplay.innerText = '00:00:00';
    timerSection.classList.remove('timer-done');
}
tombol_timer_start.addEventListener('click', startTimer);
tombol_timer_stop.addEventListener('click', stopTimer);
tombol_timer_reset.addEventListener('click', resetTimer);
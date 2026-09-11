// ============================================
// RELÓGIO DIGITAL - JAVASCRIPT
// ============================================

class DigitalClock {
    constructor() {
        this.format24h = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAllClocks();
        // Atualizar cada segundo
        setInterval(() => this.updateAllClocks(), 1000);
    }

    setupEventListeners() {
        // Botões de formato
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFormatChange(e));
        });

        // Botão de repor
        document.querySelector('.btn-reset').addEventListener('click', () => this.reset());
    }

    handleFormatChange(e) {
        const format = e.target.dataset.format;
        this.format24h = format === '24';

        // Atualizar estado dos botões
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Mostrar/esconder período AM/PM
        this.updateAllClocks();
    }

    updateAllClocks() {
        document.querySelectorAll('.clock-card').forEach(card => {
            this.updateClock(card);
        });
    }

    updateClock(card) {
        const timezone = card.dataset.timezone;
        const now = new Date();

        // Obter hora no fuso horário especificado
        const formatter = new Intl.DateTimeFormat('pt-PT', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !this.format24h,
        });

        const parts = formatter.formatToParts(now);
        let hour = '', minute = '', second = '';

        parts.forEach(part => {
            if (part.type === 'hour') hour = part.value;
            if (part.type === 'minute') minute = part.value;
            if (part.type === 'second') second = part.value;
        });

        // Atualizar display de hora
        const timeDisplay = card.querySelector('.time');
        timeDisplay.textContent = `${hour}:${minute}:${second}`;

        // Atualizar AM/PM
        const periodElement = card.querySelector('.period');
        if (this.format24h) {
            periodElement.classList.add('hidden');
        } else {
            periodElement.classList.remove('hidden');
            const period = new Intl.DateTimeFormat('pt-PT', {
                timeZone: timezone,
                hour12: true,
            }).formatToParts(now).find(p => p.type === 'dayPeriod')?.value || '';
            periodElement.textContent = period.toUpperCase();
        }

        // Atualizar data
        this.updateDate(card, timezone, now);
    }

    updateDate(card, timezone, date) {
        const dateFormatter = new Intl.DateTimeFormat('pt-PT', {
            timeZone: timezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const dateDisplay = card.querySelector('.date-display');
        dateDisplay.textContent = dateFormatter.format(date);
    }

    reset() {
        // Repor para formato 12h
        this.format24h = false;
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-format="12"]').classList.add('active');
        this.updateAllClocks();

        // Feedback visual
        this.showResetFeedback();
    }

    showResetFeedback() {
        const controls = document.querySelector('.controls');
        controls.style.opacity = '0.5';
        setTimeout(() => {
            controls.style.opacity = '1';
        }, 200);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new DigitalClock();
});
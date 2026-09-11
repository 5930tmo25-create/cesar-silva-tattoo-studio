// ============================================
// RELÓGIO MUNDIAL - JAVASCRIPT
// ============================================

class WorldClock {
    constructor() {
        this.format24h = false;
        this.timezones = this.getTimezones();
        this.filteredTimezones = [...this.timezones];
        this.init();
    }

    getTimezones() {
        return [
            { city: 'Lisboa', timezone: 'Europe/Lisbon', country: 'Portugal', offset: 'GMT/UTC+0' },
            { city: 'Londres', timezone: 'Europe/London', country: 'Reino Unido', offset: 'GMT/UTC+0' },
            { city: 'Paris', timezone: 'Europe/Paris', country: 'França', offset: 'CET/CEST' },
            { city: 'Berlim', timezone: 'Europe/Berlin', country: 'Alemanha', offset: 'CET/CEST' },
            { city: 'Roma', timezone: 'Europe/Rome', country: 'Itália', offset: 'CET/CEST' },
            { city: 'Moscovo', timezone: 'Europe/Moscow', country: 'Rússia', offset: 'MSK' },
            { city: 'Dubai', timezone: 'Asia/Dubai', country: 'EAU', offset: 'UTC+4' },
            { city: 'Tóquio', timezone: 'Asia/Tokyo', country: 'Japão', offset: 'JST' },
            { city: 'Singapura', timezone: 'Asia/Singapore', country: 'Singapura', offset: 'SGT' },
            { city: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'China', offset: 'HKT' },
            { city: 'Bangkok', timezone: 'Asia/Bangkok', country: 'Tailândia', offset: 'ICT' },
            { city: 'Calcutá', timezone: 'Asia/Kolkata', country: 'Índia', offset: 'IST' },
            { city: 'Sydney', timezone: 'Australia/Sydney', country: 'Austrália', offset: 'AEDT/AEST' },
            { city: 'Auckland', timezone: 'Pacific/Auckland', country: 'Nova Zelândia', offset: 'NZDT/NZST' },
            { city: 'Nova Iorque', timezone: 'America/New_York', country: 'EUA', offset: 'EST/EDT' },
            { city: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'EUA', offset: 'PST/PDT' },
            { city: 'Toronto', timezone: 'America/Toronto', country: 'Canadá', offset: 'EST/EDT' },
            { city: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brasil', offset: 'BRT/BRST' },
            { city: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', country: 'Argentina', offset: 'ART' },
            { city: 'Cidade do México', timezone: 'America/Mexico_City', country: 'México', offset: 'CST/CDT' },
            { city: 'Joanesburgo', timezone: 'Africa/Johannesburg', country: 'África do Sul', offset: 'SAST' },
            { city: 'Cairo', timezone: 'Africa/Cairo', country: 'Egito', offset: 'EET' },
            { city: 'Estambul', timezone: 'Europe/Istanbul', country: 'Turquia', offset: 'EET/EEST' },
        ];
    }

    init() {
        this.renderClocks();
        this.setupEventListeners();
        this.updateAllClocks();
        
        // Atualizar a cada segundo
        setInterval(() => this.updateAllClocks(), 1000);
    }

    setupEventListeners() {
        // Botões de formato
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFormatChange(e));
        });

        // Botão de repor
        document.querySelector('.btn-reset').addEventListener('click', () => this.reset());

        // Caixa de pesquisa
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e));
    }

    renderClocks() {
        const grid = document.getElementById('clocksGrid');
        grid.innerHTML = '';

        if (this.filteredTimezones.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h2>Nenhuma correspondência encontrada</h2>
                    <p>Tente pesquisar por outra cidade ou fuso horário.</p>
                </div>
            `;
            return;
        }

        this.filteredTimezones.forEach((tz, index) => {
            const card = document.createElement('div');
            card.className = 'clock-card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="city-name">${tz.city}</div>
                    <div class="timezone-info">
                        <span class="timezone-label">${tz.country}</span>
                        <span class="timezone-offset">${tz.offset}</span>
                    </div>
                </div>
                <div class="digital-display">
                    <div class="time-display" data-timezone="${tz.timezone}">00:00:00</div>
                    <div class="period am-pm" data-timezone="${tz.timezone}">AM</div>
                </div>
                <div class="date-display" data-timezone="${tz.timezone}">
                    <div class="day-of-week"></div>
                    <div class="date-value"></div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    updateAllClocks() {
        document.querySelectorAll('.clock-card').forEach(card => {
            const timeDisplay = card.querySelector('.time-display');
            const timezone = timeDisplay.dataset.timezone;
            this.updateClock(timezone);
        });
    }

    updateClock(timezone) {
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
        const timeDisplay = document.querySelector(`[data-timezone="${timezone}"].time-display`);
        if (timeDisplay) {
            timeDisplay.textContent = `${hour}:${minute}:${second}`;
        }

        // Atualizar AM/PM
        const periodElement = document.querySelector(`[data-timezone="${timezone}"].am-pm`);
        if (periodElement) {
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
        }

        // Atualizar data
        this.updateDate(timezone, now);
    }

    updateDate(timezone, date) {
        // Dia da semana
        const dayFormatter = new Intl.DateTimeFormat('pt-PT', {
            timeZone: timezone,
            weekday: 'long',
        });
        
        const dateFormatter = new Intl.DateTimeFormat('pt-PT', {
            timeZone: timezone,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const dayOfWeek = dayFormatter.format(date);
        const dateValue = dateFormatter.format(date);

        // Capitalizar primeiro carácter do dia
        const dayCapitalized = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

        const dateDisplay = document.querySelector(`[data-timezone="${timezone}"][class*="date-display"]`);
        if (dateDisplay) {
            dateDisplay.querySelector('.day-of-week').textContent = dayCapitalized;
            dateDisplay.querySelector('.date-value').textContent = dateValue;
        }
    }

    handleFormatChange(e) {
        const format = e.target.dataset.format;
        this.format24h = format === '24';

        // Atualizar estado dos botões
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        // Atualizar todos os relógios
        this.updateAllClocks();
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (searchTerm === '') {
            this.filteredTimezones = [...this.timezones];
        } else {
            this.filteredTimezones = this.timezones.filter(tz => 
                tz.city.toLowerCase().includes(searchTerm) ||
                tz.country.toLowerCase().includes(searchTerm) ||
                tz.timezone.toLowerCase().includes(searchTerm)
            );
        }

        this.renderClocks();
        this.updateAllClocks();
    }

    reset() {
        // Repor para formato 12h
        this.format24h = false;
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-format="12"]').classList.add('active');

        // Limpar pesquisa
        document.getElementById('searchInput').value = '';
        this.filteredTimezones = [...this.timezones];

        // Renderizar e atualizar
        this.renderClocks();
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
    new WorldClock();
});
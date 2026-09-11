// ============================================
// RELÓGIO MUNDIAL PREMIUM - JAVASCRIPT
// ============================================

class WorldClock {
    constructor() {
        this.format24h = false;
        this.currentFilter = 'all';
        this.timezones = this.getTimezones();
        this.filteredTimezones = [...this.timezones];
        this.init();
    }

    getTimezones() {
        return [
            // Europa
            { city: 'Lisboa', timezone: 'Europe/Lisbon', country: 'Portugal', offset: 'GMT/UTC+0', region: 'europe', flag: '🇵🇹' },
            { city: 'Londres', timezone: 'Europe/London', country: 'Reino Unido', offset: 'GMT/UTC+0', region: 'europe', flag: '🇬🇧' },
            { city: 'Paris', timezone: 'Europe/Paris', country: 'França', offset: 'CET/CEST', region: 'europe', flag: '🇫🇷' },
            { city: 'Berlim', timezone: 'Europe/Berlin', country: 'Alemanha', offset: 'CET/CEST', region: 'europe', flag: '🇩🇪' },
            { city: 'Roma', timezone: 'Europe/Rome', country: 'Itália', offset: 'CET/CEST', region: 'europe', flag: '🇮🇹' },
            { city: 'Moscovo', timezone: 'Europe/Moscow', country: 'Rússia', offset: 'MSK', region: 'europe', flag: '🇷🇺' },
            { city: 'Estambul', timezone: 'Europe/Istanbul', country: 'Turquia', offset: 'EET/EEST', region: 'europe', flag: '🇹🇷' },

            // Ásia
            { city: 'Dubai', timezone: 'Asia/Dubai', country: 'EAU', offset: 'UTC+4', region: 'asia', flag: '🇦🇪' },
            { city: 'Tóquio', timezone: 'Asia/Tokyo', country: 'Japão', offset: 'JST', region: 'asia', flag: '🇯🇵' },
            { city: 'Singapura', timezone: 'Asia/Singapore', country: 'Singapura', offset: 'SGT', region: 'asia', flag: '🇸🇬' },
            { city: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'China', offset: 'HKT', region: 'asia', flag: '🇭🇰' },
            { city: 'Bangkok', timezone: 'Asia/Bangkok', country: 'Tailândia', offset: 'ICT', region: 'asia', flag: '🇹🇭' },
            { city: 'Calcutá', timezone: 'Asia/Kolkata', country: 'Índia', offset: 'IST', region: 'asia', flag: '🇮🇳' },

            // Oceânia
            { city: 'Sydney', timezone: 'Australia/Sydney', country: 'Austrália', offset: 'AEDT/AEST', region: 'oceania', flag: '🇦🇺' },
            { city: 'Auckland', timezone: 'Pacific/Auckland', country: 'Nova Zelândia', offset: 'NZDT/NZST', region: 'oceania', flag: '🇳🇿' },

            // Américas
            { city: 'Nova Iorque', timezone: 'America/New_York', country: 'EUA', offset: 'EST/EDT', region: 'americas', flag: '🇺🇸' },
            { city: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'EUA', offset: 'PST/PDT', region: 'americas', flag: '🇺🇸' },
            { city: 'Toronto', timezone: 'America/Toronto', country: 'Canadá', offset: 'EST/EDT', region: 'americas', flag: '🇨🇦' },
            { city: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brasil', offset: 'BRT/BRST', region: 'americas', flag: '🇧🇷' },
            { city: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', country: 'Argentina', offset: 'ART', region: 'americas', flag: '🇦🇷' },
            { city: 'Cidade do México', timezone: 'America/Mexico_City', country: 'México', offset: 'CST/CDT', region: 'americas', flag: '🇲🇽' },

            // África
            { city: 'Joanesburgo', timezone: 'Africa/Johannesburg', country: 'África do Sul', offset: 'SAST', region: 'africa', flag: '🇿🇦' },
            { city: 'Cairo', timezone: 'Africa/Cairo', country: 'Egito', offset: 'EET', region: 'africa', flag: '🇪🇬' },
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

        // Botão de limpar pesquisa
        document.getElementById('clearSearch').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            document.getElementById('searchInput').dispatchEvent(new Event('input'));
        });

        // Filtros por região
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    renderClocks() {
        const grid = document.getElementById('clocksGrid');
        const emptyState = document.getElementById('emptyState');
        grid.innerHTML = '';

        if (this.filteredTimezones.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';

        this.filteredTimezones.forEach((tz, index) => {
            const card = document.createElement('div');
            card.className = 'clock-card';
            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <div class="city-name">${tz.flag} ${tz.city}</div>
                    </div>
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
        const clearBtn = document.getElementById('clearSearch');

        // Mostrar/esconder botão de limpar
        if (searchTerm) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }

        if (searchTerm === '') {
            this.filteredTimezones = this.filterByRegion(this.timezones, this.currentFilter);
        } else {
            const allFiltered = this.filterByRegion(this.timezones, this.currentFilter);
            this.filteredTimezones = allFiltered.filter(tz => 
                tz.city.toLowerCase().includes(searchTerm) ||
                tz.country.toLowerCase().includes(searchTerm) ||
                tz.timezone.toLowerCase().includes(searchTerm)
            );
        }

        this.renderClocks();
        this.updateAllClocks();
    }

    handleFilter(e) {
        const filter = e.currentTarget.dataset.filter;
        this.currentFilter = filter;

        // Atualizar estado dos botões
        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.currentTarget.classList.add('active');

        // Aplicar filtro mantendo pesquisa
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        let filtered = this.filterByRegion(this.timezones, filter);

        if (searchTerm) {
            filtered = filtered.filter(tz =>
                tz.city.toLowerCase().includes(searchTerm) ||
                tz.country.toLowerCase().includes(searchTerm) ||
                tz.timezone.toLowerCase().includes(searchTerm)
            );
        }

        this.filteredTimezones = filtered;
        this.renderClocks();
        this.updateAllClocks();
    }

    filterByRegion(timezones, region) {
        if (region === 'all') {
            return timezones;
        }
        return timezones.filter(tz => tz.region === region);
    }

    reset() {
        // Repor para formato 12h
        this.format24h = false;
        this.currentFilter = 'all';

        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-format="12"]').classList.add('active');

        document.querySelectorAll('.tag-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-filter="all"]').classList.add('active');

        // Limpar pesquisa
        document.getElementById('searchInput').value = '';
        document.getElementById('clearSearch').style.display = 'none';
        this.filteredTimezones = [...this.timezones];

        // Renderizar e atualizar
        this.renderClocks();
        this.updateAllClocks();

        // Feedback visual
        this.showResetFeedback();
    }

    showResetFeedback() {
        const controls = document.querySelector('.controls-section');
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
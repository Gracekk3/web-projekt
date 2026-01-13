document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    loadPlayers();
    loadMatches();
    setupContactForm();
});

async function loadContent() {
    try {
        const response = await fetch('data/content.json');
        const data = await response.json();

        if (data.about) {
            document.getElementById('about-title').textContent = data.about.title;
            document.getElementById('about-text').textContent = data.about.text;
        }
        if (data.history) {
            document.getElementById('history-title').textContent = data.history.title;
            document.getElementById('history-text').textContent = data.history.text;
        }
        if (data.fanzone) {
            document.getElementById('fanzone-title').textContent = data.fanzone.title;
            document.getElementById('fanzone-text').textContent = data.fanzone.text;
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

async function loadPlayers() {
    try {
        const response = await fetch('data/players.json');
        const players = await response.json();
        const container = document.getElementById('players-grid');

        container.innerHTML = players.map(player => `
            <div class="bg-[#063672] rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-[#9C824A]">
                <div class="relative h-64 bg-gray-200">
                    <img src="${player.image}" alt="${player.name}" class="w-full h-full object-cover object-top" onerror="this.src='https://via.placeholder.com/250x250?text=Arsenal'">
                    <div class="absolute top-0 right-0 bg-[#9C824A] text-white font-bold px-3 py-1 rounded-bl-lg shadow-md">
                        ${player.number}
                    </div>
                </div>
                <div class="p-5 border-t-4 border-[#EF0107]">
                    <h3 class="text-xl font-bold text-white mb-1">${player.name}</h3>
                    <div class="flex justify-between items-center mb-3">
                         <p class="text-sm font-semibold text-[#EF0107] bg-white px-2 py-0.5 rounded uppercase tracking-wider">${player.position}</p>
                         <div class="text-xs text-gray-300 font-medium">
                            <span class="mr-2">${player.age} let</span>
                            <span>${player.nationality}</span>
                         </div>
                    </div>
                    <p class="text-gray-200 text-sm leading-relaxed">${player.description}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading players:', error);
        document.getElementById('players-grid').innerHTML = '<p class="text-center w-full text-red-500">Nepodařilo se načíst soupisku.</p>';
    }
}

async function loadMatches() {
    try {
        const response = await fetch('data/matches.json');
        const matches = await response.json();
        const resultsContainer = document.getElementById('matches-list');
        const fixturesContainer = document.getElementById('fixtures-list');

        const playedMatches = matches.filter(m => m.status === 'played');
        const upcomingMatches = matches.filter(m => m.status === 'upcoming');

        // Render Played Matches
        resultsContainer.innerHTML = playedMatches.map(match => `
            <div class="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row items-center justify-between border-l-4 ${getMatchColor(match)} mb-4 hover:shadow-lg transition">
                <div class="flex items-center space-x-4 mb-2 md:mb-0 w-full md:w-1/3">
                    <div class="text-[#063672] text-sm font-mono font-bold">${match.date}</div>
                    <span class="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600 border border-gray-200">${match.competition}</span>
                </div>
                
                <div class="flex items-center justify-center space-x-6 w-full md:w-1/3 font-bold text-xl">
                    <span class="text-[#063672] text-right w-1/3">Arsenal</span>
                    <span class="bg-[#063672] text-white px-3 py-1 rounded-lg shadow-inner whitespace-nowrap border border-[#9C824A]">${match.venue === 'Home' ? match.score : match.score.split(' - ').reverse().join(' - ')}</span>
                    <span class="text-[#063672] text-left w-1/3">${match.opponent}</span>
                </div>

                <div class="w-full md:w-1/3 text-center md:text-right mt-2 md:mt-0 text-gray-400 text-sm italic">
                    ${match.venue}
                </div>
            </div>
        `).join('');

        if (fixturesContainer) {
            fixturesContainer.innerHTML = upcomingMatches.map(match => `
                <div class="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row items-center justify-between border-l-4 border-[#9C824A] mb-4 hover:shadow-lg transition border-r-4 border-r-transparent">
                    <div class="flex items-center space-x-4 mb-2 md:mb-0 w-full md:w-1/3">
                        <div class="text-[#063672] text-sm font-mono font-bold">${match.date}</div>
                        <span class="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600 border border-gray-200">${match.competition}</span>
                    </div>
                    
                    <div class="flex items-center justify-center space-x-6 w-full md:w-1/3 font-bold text-xl text-gray-500">
                         <span class="text-[#063672] text-right w-1/3">Arsenal</span>
                         <div class="flex flex-col items-center">
                            <span class="text-[#EF0107] px-2 font-black">vs</span>
                            ${match.time ? "<span class='text-sm font-semibold text-[#9C824A] mt-1'>" + match.time + "</span>" : ''}
                         </div>
                         <span class="text-[#063672] text-left w-1/3">${match.opponent}</span>
                    </div>

                    <div class="w-full md:w-1/3 text-center md:text-right mt-2 md:mt-0 text-gray-400 text-sm italic">
                        ${match.venue}
                    </div>
                </div>
            `).join('');

            if (upcomingMatches.length === 0) {
                fixturesContainer.innerHTML = '<p class="text-center text-gray-500">Žádné nadcházející zápasy.</p>';
            }
        }

    } catch (error) {
        console.error('Error loading matches:', error);
    }
}

function getMatchColor(match) {
    if (match.status !== 'played') return 'border-gray-400';

    const parts = match.score.split(' - ');
    const arsenalScore = match.venue === 'Home' ? parseInt(parts[0]) : parseInt(parts[1]);
    const opponentScore = match.venue === 'Home' ? parseInt(parts[1]) : parseInt(parts[0]);

    if (arsenalScore > opponentScore) return 'border-green-500';
    if (arsenalScore < opponentScore) return 'border-red-500';
    return 'border-yellow-500';
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const statusDiv = document.getElementById('form-status');
        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Odesílání...';

        try {
            const response = await fetch('contact.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                statusDiv.innerHTML = `<div class='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative' role='alert'><strong class='font-bold'>Skvělé!</strong> <span class='block sm:inline'>${result.message}</span></div>`;
                form.reset();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            statusDiv.innerHTML = "<div class='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative' role='alert'><strong class='font-bold'>Info:</strong> <span class='block sm:inline'>Formulář byl odeslán (simulace), ale PHP backend není dostupný.</span></div>";
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Odeslat zprávu';
            setTimeout(() => {
                statusDiv.innerHTML = '';
            }, 5000);
        }
    });
}

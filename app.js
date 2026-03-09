// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('username');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorDiv = document.getElementById('error');
const resultsContainer = document.getElementById('results');

// Event Listeners
searchBtn.addEventListener('click', analyzeProfile);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') analyzeProfile();
});

// Main Function
async function analyzeProfile() {
    const username = usernameInput.value.trim();
    
    if (!username) {
        showError('Please enter a GitHub username');
        return;
    }

    hideError();
    hideResults();
    showLoading();

    try {
        const userData = await fetchUserData(username);
        const reposData = await fetchRepos(username);
        
        displayProfile(userData, reposData);
        hideLoading();
        showResults();
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// Fetch User Data
async function fetchUserData(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('User not found. Please check the username.');
        }
        throw new Error('Failed to fetch user data. Please try again.');
    }
    
    return response.json();
}

// Fetch Repositories
async function fetchRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch repositories');
    }
    
    return response.json();
}

// Display Profile
function displayProfile(user, repos) {
    // Profile Information
    document.getElementById('profileAvatar').src = user.avatar_url;
    document.getElementById('profileName').textContent = user.name || user.login;
    document.getElementById('profileUsername').textContent = `@${user.login}`;
    document.getElementById('profileBio').textContent = user.bio || 'No bio available';
    document.getElementById('profileLocation').innerHTML = user.location ? `📍 ${user.location}` : '';
    
    // Profile Stats
    document.getElementById('followersCount').textContent = formatNumber(user.followers);
    document.getElementById('followingCount').textContent = formatNumber(user.following);
    document.getElementById('reposCount').textContent = formatNumber(user.public_repos);
    
    // Calculate Statistics
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const languageStats = getLanguageStats(repos);
    const mostUsedLang = languageStats.length > 0 ? languageStats[0][0] : 'N/A';
    
    // Dashboard Statistics
    document.getElementById('totalRepos').textContent = formatNumber(repos.length);
    document.getElementById('mostUsedLang').textContent = mostUsedLang;
    document.getElementById('totalStars').textContent = formatNumber(totalStars);
    document.getElementById('totalForks').textContent = formatNumber(totalForks);
    
    // Display Top Repositories
    displayRepositories(repos);
    
    // Create Charts
    createLanguageChart(languageStats);
    createStarsChart(repos);
    
    // Store data for PDF download
    window.currentProfileData = { user, repos, totalStars, totalForks, mostUsedLang };
}

// Get Language Statistics
function getLanguageStats(repos) {
    const languageCount = {};
    
    repos.forEach(repo => {
        if (repo.language) {
            languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        }
    });
    
    return Object.entries(languageCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
}

// Display Repositories
function displayRepositories(repos) {
    const repoList = document.getElementById('repositoryList');
    const topRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);
    
    repoList.innerHTML = topRepos.map(repo => `
        <div class="repo-card fade-in">
            <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
            <p class="repo-description">${repo.description || 'No description available'}</p>
            <div class="repo-meta">
                ${repo.language ? `<span>💻 ${repo.language}</span>` : ''}
                <span>⭐ ${formatNumber(repo.stargazers_count)}</span>
                <span>🍴 ${formatNumber(repo.forks_count)}</span>
            </div>
        </div>
    `).join('');
}

// Create Language Chart
function createLanguageChart(languageStats) {
    const ctx = document.getElementById('languageChart');
    
    if (window.languageChartInstance) {
        window.languageChartInstance.destroy();
    }
    
    window.languageChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: languageStats.map(([lang]) => lang),
            datasets: [{
                data: languageStats.map(([, count]) => count),
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#f5576c',
                    '#4facfe',
                    '#43e97b'
                ],
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.5)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'white',
                        font: {
                            size: 12,
                            weight: 'bold'
                        },
                        padding: 15
                    }
                }
            }
        }
    });
}

// Create Stars Chart
function createStarsChart(repos) {
    const ctx = document.getElementById('starsChart');
    const topRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);
    
    if (window.starsChartInstance) {
        window.starsChartInstance.destroy();
    }
    
    window.starsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topRepos.map(repo => 
                repo.name.length > 15 ? repo.name.substring(0, 15) + '...' : repo.name
            ),
            datasets: [{
                label: 'Stars',
                data: topRepos.map(repo => repo.stargazers_count),
                backgroundColor: 'rgba(102, 126, 234, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'white',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            }
        }
    });
}

// Download PDF - FIXED VERSION WITH PDF MODE
async function downloadPDF() {
    if (!window.currentProfileData) {
        alert('Please analyze a profile first!');
        return;
    }
    
    const overlay = document.getElementById('pdfLoadingOverlay');
    overlay.classList.add('show');
    
    try {
        // Wait for overlay to render
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Step 1: Add PDF mode class to body
        document.body.classList.add('pdf-mode');
        
        // Step 2: Wait for styles to apply
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Step 3: Clone the results container
        const originalElement = document.getElementById('results');
        const clonedElement = originalElement.cloneNode(true);
        
        // Step 4: Remove download button from clone
        const downloadSection = clonedElement.querySelector('.download-section');
        if (downloadSection) {
            downloadSection.remove();
        }
        
        // Step 5: Convert charts to images
        const languageCanvas = document.getElementById('languageChart');
        const starsCanvas = document.getElementById('starsChart');
        
        if (languageCanvas) {
            const langChartClone = clonedElement.querySelector('#languageChart');
            if (langChartClone) {
                const img = document.createElement('img');
                img.src = languageCanvas.toDataURL('image/png', 1.0);
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.maxHeight = '300px';
                langChartClone.parentNode.replaceChild(img, langChartClone);
            }
        }
        
        if (starsCanvas) {
            const starsChartClone = clonedElement.querySelector('#starsChart');
            if (starsChartClone) {
                const img = document.createElement('img');
                img.src = starsCanvas.toDataURL('image/png', 1.0);
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.maxHeight = '300px';
                starsChartClone.parentNode.replaceChild(img, starsChartClone);
            }
        }
        
        // Step 6: Create a visible temporary container with PDF mode styles
        const tempContainer = document.createElement('div');
        tempContainer.id = 'pdf-temp-container';
        tempContainer.className = 'pdf-mode';
        tempContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 210mm;
            background: white;
            padding: 20px;
            z-index: 9998;
            overflow: visible;
        `;
        
        // Step 7: Apply PDF-friendly styles to cloned element
        clonedElement.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            max-width: 100%;
            padding: 0;
            background: white;
        `;
        
        // Step 8: Force solid backgrounds and readable colors
        const glassCards = clonedElement.querySelectorAll('.glass-card, .profile-card, .dashboard-card, .chart-card, .repo-card');
        glassCards.forEach(card => {
            card.style.background = 'white';
            card.style.backdropFilter = 'none';
            card.style.border = '2px solid #667eea';
            card.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
        
        // Force text colors
        const titles = clonedElement.querySelectorAll('.profile-name, .section-title, .chart-title');
        titles.forEach(el => el.style.color = '#667eea');
        
        const descriptions = clonedElement.querySelectorAll('.profile-username, .profile-bio, .detail-item, .stat-label, .card-label, .repo-description, .repo-meta');
        descriptions.forEach(el => el.style.color = '#333');
        
        const values = clonedElement.querySelectorAll('.stat-value, .card-value');
        values.forEach(el => el.style.color = '#667eea');
        
        const repoNames = clonedElement.querySelectorAll('.repo-name');
        repoNames.forEach(el => el.style.color = '#0969da');
        
        // Ensure all elements are visible
        const allElements = clonedElement.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.style) {
                el.style.visibility = 'visible';
                el.style.opacity = '1';
            }
        });
        
        tempContainer.appendChild(clonedElement);
        document.body.appendChild(tempContainer);
        
        // Step 9: Wait for images to load and DOM to settle
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 10: Ensure all images are loaded
        const images = tempContainer.querySelectorAll('img');
        await Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
                setTimeout(resolve, 2000);
            });
        }));
        
        // Step 11: Generate PDF with optimal settings
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `github-profile-${window.currentProfileData.user.login}-${new Date().toISOString().split('T')[0]}.pdf`,
            image: { 
                type: 'jpeg', 
                quality: 0.98 
            },
            html2canvas: { 
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: tempContainer.offsetWidth,
                height: tempContainer.offsetHeight,
                windowWidth: tempContainer.offsetWidth,
                windowHeight: tempContainer.offsetHeight,
                scrollX: 0,
                scrollY: 0,
                x: 0,
                y: 0
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { 
                mode: ['avoid-all', 'css', 'legacy'],
                before: '.page-break'
            }
        };
        
        // Step 12: Generate and save PDF
        await html2pdf().from(tempContainer).set(opt).save();
        
        // Step 13: Cleanup
        document.body.removeChild(tempContainer);
        document.body.classList.remove('pdf-mode');
        overlay.classList.remove('show');
        
    } catch (error) {
        console.error('PDF Generation Error:', error);
        
        // Cleanup
        document.body.classList.remove('pdf-mode');
        overlay.classList.remove('show');
        
        const tempContainer = document.getElementById('pdf-temp-container');
        if (tempContainer && document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
        }
        
        alert('Failed to generate PDF. Error: ' + error.message);
    }
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function showLoading() {
    loadingSpinner.classList.add('show');
    searchBtn.disabled = true;
}

function hideLoading() {
    loadingSpinner.classList.remove('show');
    searchBtn.disabled = false;
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}

function hideError() {
    errorDiv.classList.remove('show');
}

function showResults() {
    resultsContainer.classList.add('show');
}

function hideResults() {
    resultsContainer.classList.remove('show');
}

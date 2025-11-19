gsap.registerPlugin(ScrollTrigger);

let currentQuestion = 1;
const totalQuestions = 7;
let userResponses = {
    domain: [],
    tech: [],
    challenges: [],
    career: [],
    workstyle: [],
    learning: [],
    trends: []
};

let animationsEnabled = true;
let iconsVisible = true;

function showKeyboardHint() {
    const hint = document.getElementById('keyboardHint');
    hint.classList.add('show');
    setTimeout(() => hint.classList.remove('show'), 3000);
}

window.addEventListener('load', () => {
    gsap.fromTo('.hero h1', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 });
    gsap.fromTo('.hero p', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.3 });
    gsap.fromTo('.cta-btn', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, delay: 0.6 });
});

function toggleAnimations() {
    animationsEnabled = !animationsEnabled;
    const bg = document.getElementById('animatedBg');
    const orbs = document.querySelectorAll('.gradient-orb');
    if (!animationsEnabled) {
        bg.classList.add('reduced-motion');
        orbs.forEach(orb => orb.style.animationPlayState = 'paused');
    } else {
        bg.classList.remove('reduced-motion');
        orbs.forEach(orb => orb.style.animationPlayState = 'running');
    }
}

function toggleIcons() {
    iconsVisible = !iconsVisible;
    const icons = document.querySelectorAll('.tech-icon');
    icons.forEach(icon => {
        icon.style.opacity = iconsVisible ? '0.2' : '0';
    });
}

function goHome() {
    document.getElementById('hero').style.display = 'flex';
    document.getElementById('questionnaireContainer').style.display = 'none';
    document.getElementById('roadmapContainer').style.display = 'none';
    currentQuestion = 1;
    userResponses = { domain: [], tech: [], challenges: [], career: [], workstyle: [], learning: [], trends: [] };
    document.querySelectorAll('.option-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.question-card').forEach(card => card.classList.remove('active'));
    document.querySelector('[data-question="1"]').classList.add('active');
    updateProgress();
}

function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function getYouTubeThumbnail(videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

const careerPaths = {
    'full-stack': {
        icon: '💻',
        title: 'Full-Stack Web Developer',
        description: 'Master both frontend and backend',
        highlights: ['High Demand', 'Remote Work', '₹8-15 LPA'],
        matchKeywords: ['web-dev', 'javascript-ts', 'ui-ux', 'project-based'],
        phases: [
            {
                title: 'Frontend Foundations',
                duration: '3-4 months',
                skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Tailwind', 'Git'],
                videos: [
                    { title: 'Web Development Bootcamp', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=mU6anWqZJcc' },
                    { title: 'React Complete Guide', channel: 'Codevolution', url: 'https://www.youtube.com/watch?v=RGKi6LSPDLU' },
                    { title: 'JavaScript Mastery', channel: 'JS Mastery', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg' },
                    { title: 'Tailwind CSS Course', channel: 'Net Ninja', url: 'https://www.youtube.com/watch?v=tS7upsfuxmo' },
                    { title: 'Git & GitHub', channel: 'Kunal Kushwaha', url: 'https://www.youtube.com/watch?v=apGV9Kg7ics' },
                    { title: 'HTML CSS Projects', channel: 'Code With Harry', url: 'https://www.youtube.com/watch?v=HcOc7P5BMi4' }
                ]
            },
            {
                title: 'Backend & Databases',
                duration: '4-5 months',
                skills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'REST APIs'],
                videos: [
                    { title: 'Node.js Backend', channel: 'Traversy Media', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE' },
                    { title: 'MongoDB Tutorial', channel: 'Web Dev Simplified', url: 'https://www.youtube.com/watch?v=ofme2o29ngU' },
                    { title: 'Express.js Course', channel: 'Traversy Media', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE' },
                    { title: 'PostgreSQL Guide', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4' },
                    { title: 'REST API Design', channel: 'Fireship', url: 'https://www.youtube.com/watch?v=-MTSQjw5DrM' },
                    { title: 'JWT Authentication', channel: 'Web Dev Simplified', url: 'https://www.youtube.com/watch?v=mbsmsi7l3r4' }
                ]
            }
        ]
    },
    'ai-ml': {
        icon: '🤖',
        title: 'AI/ML Engineer',
        description: 'Build intelligent systems',
        highlights: ['Cutting-Edge', 'Research', '₹10-20 LPA'],
        matchKeywords: ['ai-ml', 'python', 'ml-models', 'data-analysis'],
        phases: [
            {
                title: 'Python & Math',
                duration: '3-4 months',
                skills: ['Python', 'NumPy', 'Pandas', 'Statistics'],
                videos: [
                    { title: 'Python for Data Science', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI' },
                    { title: 'NumPy Tutorial', channel: 'Keith Galli', url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI' },
                    { title: 'Pandas Course', channel: 'Keith Galli', url: 'https://www.youtube.com/watch?v=vmEHCJofslg' },
                    { title: 'Linear Algebra', channel: '3Blue1Brown', url: 'https://www.youtube.com/watch?v=fNk_zzaMoSs' },
                    { title: 'Statistics Course', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=xxpc-HPKN28' },
                    { title: 'Probability ML', channel: 'Krish Naik', url: 'https://www.youtube.com/watch?v=Z-Hk5hVHB6g' }
                ]
            },
            {
                title: 'Machine Learning',
                duration: '5-6 months',
                skills: ['Scikit-learn', 'ML Algorithms', 'Feature Engineering'],
                videos: [
                    { title: 'ML Full Course', channel: 'Simplilearn', url: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ' },
                    { title: 'Scikit-Learn', channel: 'codebasics', url: 'https://www.youtube.com/watch?v=0Lt9w-BxKFQ' },
                    { title: 'Supervised Learning', channel: 'StatQuest', url: 'https://www.youtube.com/watch?v=zM4VZR0px8E' },
                    { title: 'Unsupervised Learning', channel: 'Krish Naik', url: 'https://www.youtube.com/watch?v=IUn8k5zSI6g' },
                    { title: 'Feature Engineering', channel: 'Krish Naik', url: 'https://www.youtube.com/watch?v=6WDFfaYtN6s' },
                    { title: 'Model Evaluation', channel: 'StatQuest', url: 'https://www.youtube.com/watch?v=wpQiEHYkBys' }
                ]
            }
        ]
    },
    'data-science': {
        icon: '📊',
        title: 'Data Scientist',
        description: 'Extract insights from data',
        highlights: ['Analytics', 'Business Impact', '₹9-18 LPA'],
        matchKeywords: ['data-science', 'python', 'data-analysis', 'sql-nosql'],
        phases: [
            {
                title: 'Data Analysis',
                duration: '3-4 months',
                skills: ['Python', 'Pandas', 'SQL', 'Excel'],
                videos: [
                    { title: 'Python Data Analysis', channel: 'Keith Galli', url: 'https://www.youtube.com/watch?v=vmEHCJofslg' },
                    { title: 'Pandas Tutorial', channel: 'Corey Schafer', url: 'https://www.youtube.com/watch?v=ZyhVh-qRZPA' },
                    { title: 'SQL Full Course', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
                    { title: 'Data Cleaning', channel: 'Alex The Analyst', url: 'https://www.youtube.com/watch?v=bDhvCp3_lYw' },
                    { title: 'NumPy Basics', channel: 'Keith Galli', url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI' },
                    { title: 'Excel for Data', channel: 'Alex The Analyst', url: 'https://www.youtube.com/watch?v=opJgMj1IUrc' }
                ]
            }
        ]
    },
    'mobile-dev': {
        icon: '📱',
        title: 'Mobile App Developer',
        description: 'Create powerful mobile apps',
        highlights: ['High Growth', 'Creative', '₹7-14 LPA'],
        matchKeywords: ['mobile-dev', 'java-kotlin', 'ui-ux'],
        phases: [
            {
                title: 'Mobile Foundations',
                duration: '3-4 months',
                skills: ['Kotlin', 'Swift', 'UI/UX', 'Android Studio'],
                videos: [
                    { title: 'Kotlin Course', channel: 'Philipp Lackner', url: 'https://www.youtube.com/watch?v=F9UC9DY-vIU' },
                    { title: 'Swift Basics', channel: 'CodeWithChris', url: 'https://www.youtube.com/watch?v=comQ1-x2a1Q' },
                    { title: 'Android Development', channel: 'Philipp Lackner', url: 'https://www.youtube.com/watch?v=fis26HvvDII' },
                    { title: 'iOS Development', channel: 'Sean Allen', url: 'https://www.youtube.com/watch?v=09TeUXjzpKs' },
                    { title: 'Mobile UI/UX', channel: 'DesignCourse', url: 'https://www.youtube.com/watch?v=kbZejnPXyLM' },
                    { title: 'Android Studio', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=fis26HvvDII' }
                ]
            }
        ]
    },
    'devops': {
        icon: '☁️',
        title: 'DevOps Engineer',
        description: 'Automate infrastructure',
        highlights: ['Automation', 'Infrastructure', '₹10-18 LPA'],
        matchKeywords: ['cloud-devops', 'scalability', 'automation'],
        phases: [
            {
                title: 'Linux & Scripting',
                duration: '2-3 months',
                skills: ['Linux', 'Bash', 'Python', 'Networking'],
                videos: [
                    { title: 'Linux for DevOps', channel: 'TechWorld Nana', url: 'https://www.youtube.com/watch?v=rT7NwtLc9po' },
                    { title: 'Bash Scripting', channel: 'NetworkChuck', url: 'https://www.youtube.com/watch?v=qiQR5rTSshw' },
                    { title: 'Python DevOps', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=t8pPdKYpowI' },
                    { title: 'Networking Basics', channel: 'NetworkChuck', url: 'https://www.youtube.com/watch?v=qiQR5rTSshw' },
                    { title: 'Git & GitHub', channel: 'DevOps Journey', url: 'https://www.youtube.com/watch?v=hwP7WQkmECE' },
                    { title: 'SSH & Security', channel: 'TechWorld Nana', url: 'https://www.youtube.com/watch?v=hQWRp-FdTpc' }
                ]
            }
        ]
    },
    'cybersecurity': {
        icon: '🔐',
        title: 'Cybersecurity Engineer',
        description: 'Protect systems from threats',
        highlights: ['Security', 'Ethical Hacking', '₹8-16 LPA'],
        matchKeywords: ['cybersecurity', 'security', 'cpp-rust'],
        phases: [
            {
                title: 'Security Fundamentals',
                duration: '3-4 months',
                skills: ['Network Security', 'Cryptography', 'OS Security'],
                videos: [
                    { title: 'Cybersecurity Course', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=U_P23SqJaDc' },
                    { title: 'Network Security', channel: 'Professor Messer', url: 'https://www.youtube.com/watch?v=qiQR5rTSshw' },
                    { title: 'Cryptography Basics', channel: 'Computerphile', url: 'https://www.youtube.com/watch?v=jhXCTbFnK8o' },
                    { title: 'Web Security', channel: 'LiveOverflow', url: 'https://www.youtube.com/watch?v=jmgsgjPn1vs' },
                    { title: 'Linux Security', channel: 'NetworkChuck', url: 'https://www.youtube.com/watch?v=GSIDS_lvRv4' },
                    { title: 'Security+ Guide', channel: 'Professor Messer', url: 'https://www.youtube.com/watch?v=9Nm7ZYKNb5w' }
                ]
            }
        ]
    },
    'blockchain': {
        icon: '⛓️',
        title: 'Blockchain Developer',
        description: 'Build decentralized apps',
        highlights: ['Web3', 'Crypto', '₹12-25 LPA'],
        matchKeywords: ['blockchain', 'web3-defi'],
        phases: [
            {
                title: 'Blockchain Basics',
                duration: '3-4 months',
                skills: ['Blockchain', 'Cryptocurrency', 'Ethereum'],
                videos: [
                    { title: 'Blockchain Course', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=gyMwXuJrbJQ' },
                    { title: 'Blockchain Explained', channel: 'Simplilearn', url: 'https://www.youtube.com/watch?v=yubzJw0uiE4' },
                    { title: 'Bitcoin Explained', channel: '3Blue1Brown', url: 'https://www.youtube.com/watch?v=bBC-nXj3Ng4' },
                    { title: 'Ethereum Basics', channel: 'Dapp University', url: 'https://www.youtube.com/watch?v=GJGIeSCgskc' },
                    { title: 'Crypto Beginners', channel: 'Whiteboard Crypto', url: 'https://www.youtube.com/watch?v=VYWc9dFqROI' },
                    { title: 'DeFi Explained', channel: 'Whiteboard Crypto', url: 'https://www.youtube.com/watch?v=k9HYC0EJU6E' }
                ]
            }
        ]
    },
    'game-dev': {
        icon: '🎮',
        title: 'Game Developer',
        description: 'Create gaming experiences',
        highlights: ['Creative', 'Entertainment', '₹6-15 LPA'],
        matchKeywords: ['cpp-rust', 'ar-vr'],
        phases: [
            {
                title: 'Game Dev Basics',
                duration: '3-4 months',
                skills: ['Unity', 'C#', 'Game Design'],
                videos: [
                    { title: 'Unity Course', channel: 'Brackeys', url: 'https://www.youtube.com/watch?v=j48LtUkZRjU' },
                    { title: 'C# for Unity', channel: 'Code Monkey', url: 'https://www.youtube.com/watch?v=IFayQioG71A' },
                    { title: 'Game Design', channel: 'GMTK', url: 'https://www.youtube.com/watch?v=UvCri1tqIxQ' },
                    { title: '2D Game Dev', channel: 'Brackeys', url: 'https://www.youtube.com/watch?v=on9nwbZngyw' },
                    { title: '3D Game Dev', channel: 'Brackeys', url: 'https://www.youtube.com/watch?v=j48LtUkZRjU' },
                    { title: 'Unity Animation', channel: 'Code Monkey', url: 'https://www.youtube.com/watch?v=Sh2ywYPnvlw' }
                ]
            }
        ]
    },
    'product-manager': {
        icon: '📋',
        title: 'Tech Product Manager',
        description: 'Lead product strategy',
        highlights: ['Leadership', 'Strategy', '₹15-30 LPA'],
        matchKeywords: ['product-manager', 'tech-lead', 'startup'],
        phases: [
            {
                title: 'Product Fundamentals',
                duration: '3-4 months',
                skills: ['Product Strategy', 'User Research', 'Agile'],
                videos: [
                    { title: 'Product Management', channel: 'Nishant Chahar', url: 'https://www.youtube.com/watch?v=HNfVykENVrg' },
                    { title: 'PM Basics', channel: 'Product School', url: 'https://www.youtube.com/watch?v=huTSPanUlQM' },
                    { title: 'User Research', channel: 'CareerFoundry', url: 'https://www.youtube.com/watch?v=LGjOcMtvqS4' },
                    { title: 'Market Analysis', channel: 'Product School', url: 'https://www.youtube.com/watch?v=LoJDAeq6i34' },
                    { title: 'Agile PM', channel: 'The Digital Product Manager', url: 'https://www.youtube.com/watch?v=zi7uGg6FVM4' },
                    { title: 'Product Roadmaps', channel: 'saas agency', url: 'https://www.youtube.com/watch?v=b4YVHTqQPk8' }
                ]
            }
        ]
    },
    'ui-ux': {
        icon: '🎨',
        title: 'UI/UX Designer',
        description: 'Design beautiful experiences',
        highlights: ['Creative', 'Design', '₹6-12 LPA'],
        matchKeywords: ['ui-ux', 'user-experience'],
        phases: [
            {
                title: 'Design Fundamentals',
                duration: '2-3 months',
                skills: ['Design Principles', 'Color Theory', 'Typography'],
                videos: [
                    { title: 'UI/UX Course', channel: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU' },
                    { title: 'Design Principles', channel: 'The Futur', url: 'https://www.youtube.com/watch?v=a5KYlHNKQB8' },
                    { title: 'Color Theory', channel: 'DesignCourse', url: 'https://www.youtube.com/watch?v=YeI6Wqn4I78' },
                    { title: 'Typography', channel: 'The Futur', url: 'https://www.youtube.com/watch?v=sByzHoiYFX0' },
                    { title: 'Layout Design', channel: 'DesignCourse', url: 'https://www.youtube.com/watch?v=0JCUH5daCCE' },
                    { title: 'Visual Hierarchy', channel: 'Flux Academy', url: 'https://www.youtube.com/watch?v=qZWDJqY27bw' }
                ]
            }
        ]
    }
};

function startQuestionnaire() {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('questionnaireContainer').style.display = 'block';
    showKeyboardHint();
    updateProgress();
}

function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        saveCurrentAnswers();
        document.querySelector(`[data-question="${currentQuestion}"]`).classList.remove('active');
        currentQuestion++;
        document.querySelector(`[data-question="${currentQuestion}"]`).classList.add('active');
        updateProgress();
    }
}

function prevQuestion() {
    if (currentQuestion > 1) {
        document.querySelector(`[data-question="${currentQuestion}"]`).classList.remove('active');
        currentQuestion--;
        document.querySelector(`[data-question="${currentQuestion}"]`).classList.add('active');
        updateProgress();
    }
}

function saveCurrentAnswers() {
    const currentCard = document.querySelector(`[data-question="${currentQuestion}"]`);
    const checkboxes = currentCard.querySelectorAll('.option-checkbox:checked');
    checkboxes.forEach(checkbox => {
        const category = checkbox.dataset.category;
        const value = checkbox.value;
        if (!userResponses[category].includes(value)) {
            userResponses[category].push(value);
        }
    });
}

function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function calculateCareerMatches() {
    const allResponses = [...userResponses.domain, ...userResponses.tech, ...userResponses.challenges, ...userResponses.career, ...userResponses.workstyle, ...userResponses.learning, ...userResponses.trends];
    const matches = [];
    for (const [key, career] of Object.entries(careerPaths)) {
        let score = 0;
        career.matchKeywords.forEach(keyword => {
            if (allResponses.includes(keyword)) score += 20;
        });
        matches.push({ key, career, score: Math.min(score, 100) });
    }
    return matches.sort((a, b) => b.score - a.score).slice(0, 3);
}

function generateRoadmap() {
    saveCurrentAnswers();
    const careerMatches = calculateCareerMatches();
    document.getElementById('questionnaireContainer').style.display = 'none';
    document.getElementById('roadmapContainer').style.display = 'block';
    const careerOptionsContainer = document.getElementById('careerOptions');
    careerOptionsContainer.innerHTML = '';
    careerMatches.forEach((match) => {
        const card = document.createElement('div');
        card.className = 'career-option-card';
        card.innerHTML = `
            <div class="match-badge">${match.score}% Match</div>
            <div class="career-icon">${match.career.icon}</div>
            <div class="career-option-title">${match.career.title}</div>
            <div class="career-option-desc">${match.career.description}</div>
            <div class="career-highlights">${match.career.highlights.map(h => `<span class="highlight-tag">${h}</span>`).join('')}</div>
        `;
        card.onclick = () => selectCareer(match.key, card);
        careerOptionsContainer.appendChild(card);
    });
}

function selectCareer(careerKey, cardElement) {
    document.querySelectorAll('.career-option-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
    const roadmap = careerPaths[careerKey];
    document.getElementById('careerTitle').textContent = roadmap.title;
    document.getElementById('careerDescription').textContent = roadmap.description;
    const infoCardsHTML = generateInfoCards(careerKey);
    const yearRoadmapHTML = generate12MonthRoadmap(careerKey);
    const dayInLifeHTML = generateDayInLife(careerKey);
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = `${infoCardsHTML}${dayInLifeHTML}${yearRoadmapHTML}<div style="margin-top: 80px;"><h2 style="text-align: center; font-size: 2.5rem; color: var(--accent-gold); margin-bottom: 50px;">📚 Learning Path by Phases</h2></div>`;
    roadmap.phases.forEach((phase) => {
        timeline.innerHTML += `<div class="phase"><div class="phase-card"><h4 class="phase-title">${phase.title}</h4><div class="phase-duration">⏱️ ${phase.duration}</div><div class="skills-list">${phase.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}</div>${phase.videos.length > 0 ? `<div class="resources"><div class="resource-title">📚 Free Learning Resources</div><div class="video-grid">${phase.videos.map(video => {const videoId = getYouTubeVideoId(video.url);const thumbnail = getYouTubeThumbnail(videoId);return `<a href="${video.url}" target="_blank" class="video-card"><img src="${thumbnail}" alt="${video.title}" class="video-thumbnail"><div class="video-info"><div class="video-title">${video.title}</div><div class="video-channel">${video.channel}</div></div></a>`;}).join('')}</div></div>` : ''}</div></div>`;
    });
    document.getElementById('selectedRoadmap').style.display = 'block';
    document.getElementById('selectedRoadmap').scrollIntoView({ behavior: 'smooth' });
}

function generateInfoCards(careerKey) {
    const careerInfo = {
        'full-stack': { salary: '₹8-15 LPA', jobGrowth: '25% YoY', companies: '5000+', remote: '85%', tools: ['VS Code', 'Git', 'Docker', 'AWS', 'React', 'Node.js'] },
        'ai-ml': { salary: '₹10-20 LPA', jobGrowth: '40% YoY', companies: '3000+', remote: '75%', tools: ['Python', 'Jupyter', 'TensorFlow', 'PyTorch', 'Docker', 'AWS'] },
        'data-science': { salary: '₹9-18 LPA', jobGrowth: '35% YoY', companies: '4000+', remote: '80%', tools: ['Python', 'SQL', 'Tableau', 'Excel', 'R', 'Power BI'] },
        'mobile-dev': { salary: '₹7-14 LPA', jobGrowth: '30% YoY', companies: '4500+', remote: '70%', tools: ['Android Studio', 'Xcode', 'Flutter', 'React Native', 'Firebase'] },
        'devops': { salary: '₹10-18 LPA', jobGrowth: '38% YoY', companies: '3500+', remote: '90%', tools: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Ansible'] },
        'cybersecurity': { salary: '₹8-16 LPA', jobGrowth: '32% YoY', companies: '2500+', remote: '65%', tools: ['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'Nmap'] },
        'blockchain': { salary: '₹12-25 LPA', jobGrowth: '45% YoY', companies: '1500+', remote: '95%', tools: ['Solidity', 'Web3.js', 'Hardhat', 'MetaMask', 'Truffle'] },
        'game-dev': { salary: '₹6-15 LPA', jobGrowth: '28% YoY', companies: '2000+', remote: '60%', tools: ['Unity', 'Unreal Engine', 'Blender', 'Photoshop', 'C#'] },
        'product-manager': { salary: '₹15-30 LPA', jobGrowth: '30% YoY', companies: '5000+', remote: '85%', tools: ['Jira', 'Figma', 'Analytics', 'Notion', 'Miro', 'SQL'] },
        'ui-ux': { salary: '₹6-12 LPA', jobGrowth: '35% YoY', companies: '4000+', remote: '90%', tools: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator'] }
    };
    const info = careerInfo[careerKey];
    return `<div class="career-info-section"><div class="info-card"><div class="info-card-icon">💰</div><div class="info-card-title">Salary Range</div><span class="stat-number">${info.salary}</span><div class="info-card-content">Average fresher to 3 years in India</div></div><div class="info-card"><div class="info-card-icon">📈</div><div class="info-card-title">Job Growth</div><span class="stat-number">${info.jobGrowth}</span><div class="info-card-content">Year-over-year growth</div></div><div class="info-card"><div class="info-card-icon">🏢</div><div class="info-card-title">Hiring Companies</div><span class="stat-number">${info.companies}</span><div class="info-card-content">Active companies in India</div></div><div class="info-card"><div class="info-card-icon">🌍</div><div class="info-card-title">Remote Work</div><span class="stat-number">${info.remote}</span><div class="info-card-content">Jobs offering remote</div></div></div><div class="info-card" style="margin: 40px 0;"><div class="info-card-icon">🛠️</div><div class="info-card-title">Essential Tools</div><div class="tools-grid">${info.tools.map(tool => `<span class="tool-badge">${tool}</span>`).join('')}</div></div>`;
}

function generateDayInLife(careerKey) {
    const daySchedules = {
        'full-stack': [
            { time: '9:00 AM', activity: 'Stand-up meeting with team' },
            { time: '10:00 AM', activity: 'Code review and merge PRs' },
            { time: '11:30 AM', activity: 'Frontend development' },
            { time: '1:00 PM', activity: 'Lunch & learning' },
            { time: '2:00 PM', activity: 'Backend API development' },
            { time: '4:00 PM', activity: 'Debug production issues' },
            { time: '5:30 PM', activity: 'Documentation' }
        ],
        'ai-ml': [
            { time: '9:00 AM', activity: 'Review model metrics' },
            { time: '10:00 AM', activity: 'Data preprocessing' },
            { time: '11:30 AM', activity: 'Train ML models' },
            { time: '1:00 PM', activity: 'Lunch & AI research' },
            { time: '2:00 PM', activity: 'Feature engineering' },
            { time: '4:00 PM', activity: 'Deploy models' },
            { time: '5:30 PM', activity: 'Model evaluation' }
        ]
    };
    const schedule = daySchedules[careerKey] || daySchedules['full-stack'];
    return `<div class="day-in-life"><h3>📅 A Day in the Life</h3><div class="timeline-items">${schedule.map(item => `<div class="timeline-item"><div class="timeline-time">${item.time}</div><div class="timeline-activity">${item.activity}</div></div>`).join('')}</div></div>`;
}

function generate12MonthRoadmap(careerKey) {
    const roadmaps = {
        'full-stack': [
            { month: 1, title: 'HTML/CSS Mastery', goals: ['HTML5 semantics', 'CSS Grid & Flexbox', 'Build 3 websites', 'Responsive design'] },
            { month: 2, title: 'JavaScript Fundamentals', goals: ['ES6+ syntax', 'DOM manipulation', 'Async/Await', 'Build projects'] },
            { month: 3, title: 'React.js Basics', goals: ['Components & Props', 'State management', 'React Hooks', 'Build 2 apps'] },
            { month: 4, title: 'Backend with Node.js', goals: ['Express.js', 'REST API', 'JWT authentication', 'Build API'] },
            { month: 5, title: 'Database Integration', goals: ['MongoDB', 'PostgreSQL', 'CRUD operations', 'Database design'] },
            { month: 6, title: 'Full-Stack Project', goals: ['Complete app', 'Integration', 'Deploy', 'Portfolio'] },
            { month: 7, title: 'Advanced React', goals: ['Redux/Context', 'Next.js', 'TypeScript', 'Performance'] },
            { month: 8, title: 'Testing & Quality', goals: ['Jest Testing', 'API testing', 'Unit tests', 'Code quality'] },
            { month: 9, title: 'DevOps Basics', goals: ['Docker', 'CI/CD', 'AWS', 'Environment management'] },
            { month: 10, title: 'Advanced Topics', goals: ['GraphQL', 'WebSockets', 'Redis', 'Microservices'] },
            { month: 11, title: 'Major Project', goals: ['Production app', 'Best practices', 'Scale', 'Security'] },
            { month: 12, title: 'Job Preparation', goals: ['DSA problems', 'System design', 'Portfolio', 'Mock interviews'] }
        ]
    };
    const monthlyPlan = roadmaps[careerKey] || roadmaps['full-stack'];
    return `<div class="year-roadmap"><h2 class="year-roadmap-title">🗓️ 12-Month Structured Roadmap</h2><div class="months-grid">${monthlyPlan.map(month => `<div class="month-card"><div class="month-number">Month ${month.month}</div><div class="month-title">${month.title}</div><ul class="month-goals">${month.goals.map(goal => `<li>${goal}</li>`).join('')}</ul></div>`).join('')}</div></div>`;
}

function toggleChatbot() {
    document.getElementById('chatbotWindow').classList.toggle('active');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (message) {
        addMessage(message, 'user');
        input.value = '';
        setTimeout(() => addMessage(generateAIResponse(message), 'bot'), 1000);
    }
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('career') || lowerMessage.includes('path') || lowerMessage.includes('which field')) {
        return "Based on your interests: Love coding websites? Full-Stack Development. Passionate about AI? AI/ML Engineering. Good with data? Data Science. Like mobile apps? Mobile Development. Security enthusiast? Cybersecurity. Take the quiz to get your personalized roadmap!";
    }
    
    if (lowerMessage.includes('roadmap') || lowerMessage.includes('learn') || lowerMessage.includes('start')) {
        return "Your 12-month roadmap is ready! Follow month-by-month milestones. Build 3-5 projects per phase. Watch the recommended YouTube courses. Practice daily for 2-3 hours. Join communities and contribute to open-source. Consistency is key!";
    }
    
    if (lowerMessage.includes('full stack') || lowerMessage.includes('web dev') || lowerMessage.includes('mern') || lowerMessage.includes('react')) {
        return "Full-Stack Development Path: Frontend - HTML, CSS, JavaScript, React.js. Backend - Node.js, Express.js, MongoDB. Tools - Git, Docker, AWS. Salary: 8-15 LPA. Job Demand: Very High. Remote: 85% jobs offer remote. Start with HTML/CSS, then move to JavaScript!";
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('ml') || lowerMessage.includes('machine learning') || lowerMessage.includes('data science')) {
        return "AI/ML Engineering Path: Python Programming. Math: Linear Algebra, Statistics. ML: Scikit-learn, TensorFlow, PyTorch. Deep Learning: Neural Networks, CNNs, LLMs. Salary: 10-20 LPA. Job Demand: Rapidly Growing. Remote: 75% jobs offer remote. Start with Python and Math foundations!";
    }
    
    if (lowerMessage.includes('data analyst') || lowerMessage.includes('tableau') || lowerMessage.includes('sql')) {
        return "Data Science Path: Python, Pandas, NumPy. SQL and Databases. Visualization: Tableau, Power BI. Statistics and ML basics. Salary: 9-18 LPA. Job Demand: High. Remote: 80% jobs offer remote. SQL is your superpower - master it first!";
    }
    
    if (lowerMessage.includes('mobile') || lowerMessage.includes('android') || lowerMessage.includes('ios') || lowerMessage.includes('flutter')) {
        return "Mobile Development Path: Native - Kotlin (Android), Swift (iOS). Cross-platform - Flutter, React Native. Backend - Firebase, REST APIs. Salary: 7-14 LPA. Job Demand: High. Remote: 70% jobs offer remote. Flutter is easiest to start with!";
    }
    
    if (lowerMessage.includes('devops') || lowerMessage.includes('cloud') || lowerMessage.includes('kubernetes') || lowerMessage.includes('docker')) {
        return "DevOps Engineering Path: Linux and Bash Scripting. Docker and Kubernetes. CI/CD: Jenkins, GitHub Actions. Cloud: AWS, Azure. Salary: 10-18 LPA. Job Demand: Very High. Remote: 90% jobs offer remote. Start with Linux command line!";
    }
    
    if (lowerMessage.includes('security') || lowerMessage.includes('hacking') || lowerMessage.includes('penetration') || lowerMessage.includes('ethical')) {
        return "Cybersecurity Path: Networking Fundamentals. Linux Security. Ethical Hacking: Kali Linux, Metasploit. Certifications: Security+, CEH. Salary: 8-16 LPA. Job Demand: Growing. Remote: 65% jobs offer remote. Learn networking first, then move to hacking!";
    }
    
    if (lowerMessage.includes('blockchain') || lowerMessage.includes('web3') || lowerMessage.includes('solidity') || lowerMessage.includes('crypto')) {
        return "Blockchain Development Path: Blockchain Fundamentals. Solidity Programming. Smart Contracts. DApp Development: Web3.js, Hardhat. Salary: 12-25 LPA. Job Demand: Emerging. Remote: 95% jobs offer remote. High-risk, high-reward field!";
    }
    
    if (lowerMessage.includes('game') || lowerMessage.includes('unity') || lowerMessage.includes('unreal')) {
        return "Game Development Path: Unity and C#. Unreal Engine and C++. 2D/3D Game Design. Graphics and Animation. Salary: 6-15 LPA. Job Demand: Moderate. Remote: 60% jobs offer remote. Start with Unity - easier to learn!";
    }
    
    if (lowerMessage.includes('product manager') || lowerMessage.includes('pm role') || lowerMessage.includes('non coding')) {
        return "Tech Product Manager Path: Product Strategy and Roadmapping. User Research and Analytics. Agile and Scrum. Technical Knowledge (APIs, SQL). Salary: 15-30 LPA. Job Demand: High. Remote: 85% jobs offer remote. No coding required, but tech knowledge helps!";
    }
    
    if (lowerMessage.includes('ui') || lowerMessage.includes('ux') || lowerMessage.includes('design') || lowerMessage.includes('figma')) {
        return "UI/UX Design Path: Design Principles and Color Theory. Figma, Adobe XD. User Research and Testing. Prototyping and Wireframing. Salary: 6-12 LPA. Job Demand: High. Remote: 90% jobs offer remote. Figma is industry standard - master it!";
    }
    
    if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('earn')) {
        return "Average Tech Salaries in India (Fresher to 3 years): Product Manager: 15-30 LPA. Blockchain Dev: 12-25 LPA. AI/ML Engineer: 10-20 LPA. DevOps Engineer: 10-18 LPA. Data Scientist: 9-18 LPA. Full-Stack Dev: 8-15 LPA. Cybersecurity: 8-16 LPA. Mobile Dev: 7-14 LPA.";
    }
    
    if (lowerMessage.includes('job') || lowerMessage.includes('interview') || lowerMessage.includes('apply')) {
        return "Job Search Strategy: Build 3-5 portfolio projects. Master DSA (Data Structures and Algorithms). Learn System Design basics. Create a strong GitHub profile. Practice LeetCode/CodeChef. Network on LinkedIn. Apply to 50+ companies. Consistency beats talent!";
    }
    
    if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tools')) {
        return "Essential Tech Skills 2025: Programming - JavaScript, Python, TypeScript. Frontend - React.js, Next.js, Tailwind. Backend - Node.js, Express.js, Django. Database - MongoDB, PostgreSQL, Redis. Cloud - AWS, Docker, Kubernetes. Version Control - Git, GitHub. Focus on mastering ONE stack first!";
    }
    
    if (lowerMessage.includes('fresher') || lowerMessage.includes('beginner') || lowerMessage.includes('college')) {
        return "Advice for College Students: Start learning NOW - don't wait for placements. Build projects - not just watch tutorials. Contribute to open-source projects. Participate in hackathons. Maintain a strong LinkedIn and GitHub. Network with seniors and professionals. Your GitHub is your resume!";
    }
    
    if (lowerMessage.includes('remote') || lowerMessage.includes('work from home') || lowerMessage.includes('wfh')) {
        return "Best Remote-Friendly Tech Careers: Blockchain: 95% remote. DevOps: 90% remote. UI/UX Design: 90%. Full-Stack: 85%. Product Manager: 85%. Data Science: 80%. Remote work is now standard in tech!";
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('build')) {
        return "Project Ideas by Level: Beginner - Todo App, Calculator, Weather App. Intermediate - E-commerce Site, Social Media Clone, Chat Application. Advanced - Real-time Collaboration Tool, ML-powered Recommendation System, Full-stack SaaS Product. Deploy everything on GitHub!";
    }
    
    if (lowerMessage.includes('motivate') || lowerMessage.includes('give up') || lowerMessage.includes('difficult')) {
        return "You Got This! Every expert was once a beginner. Every bug you fix makes you stronger. Every project you build is progress. Keep coding, keep learning, keep building! Your future self will thank you! Need help? I'm here!";
    }
    
    return "Hey! I'm your career guidance AI! Ask me about: Career paths and roadmaps. Salary expectations. Skills to learn. Job search tips. Project ideas. Learning resources. Example: How to become a full-stack developer? Let's build your tech career!";
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('chatInput').addEventListener('keypress', e => { 
        if (e.key === 'Enter') { 
            e.preventDefault(); 
            sendMessage(); 
        } 
    });
    
    document.addEventListener('keydown', e => {
        const questionnaireVisible = document.getElementById('questionnaireContainer').style.display === 'block';
        if (questionnaireVisible) {
            if (e.key === 'Enter') { 
                e.preventDefault(); 
                if (currentQuestion < totalQuestions) {
                    nextQuestion();
                } else {
                    generateRoadmap();
                }
            }
            else if (e.key === 'ArrowLeft') { 
                e.preventDefault(); 
                if (currentQuestion > 1) prevQuestion(); 
            }
            else if (e.key === 'ArrowRight') { 
                e.preventDefault(); 
                if (currentQuestion < totalQuestions) {
                    nextQuestion();
                } else {
                    generateRoadmap();
                }
            }
        }
    });

    document.querySelectorAll('.option-btn').forEach(button => {
        const checkbox = button.querySelector('.option-checkbox');
        button.addEventListener('click', function(e) {
            if (e.target !== checkbox) checkbox.checked = !checkbox.checked;
            checkbox.checked ? this.classList.add('selected') : this.classList.remove('selected');
        });
    });
});

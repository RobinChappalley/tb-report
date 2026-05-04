 // Modal logique
        document.getElementById('btn-start').addEventListener('click', () => {
            document.getElementById('welcome-modal').classList.add('hidden');
        });

        const img = document.getElementById('demo-img');
        const badgeWindowWidth = document.getElementById('badge-window-width');
        
        const valCalculated = document.getElementById('val-calculated');
        const valCurrentSrc = document.getElementById('val-current-src');
        const valFileSize = document.getElementById('val-file-size');

        const cond0 = document.getElementById('cond-0');
        const cond1 = document.getElementById('cond-1');
        const cond2 = document.getElementById('cond-2');
        const conditions = [cond0, cond1, cond2];

        // Éléments du simulateur
        const btnAvif = document.getElementById('btn-avif');
        const btnWebp = document.getElementById('btn-webp');
        const btnJpeg = document.getElementById('btn-jpeg');
        const srcAvif = document.getElementById('src-avif');
        const srcWebp = document.getElementById('src-webp');
        const codeAvif = document.getElementById('code-avif');
        const codeWebp = document.getElementById('code-webp');

        function setSupport(level) {
            btnAvif.classList.remove('active');
            btnWebp.classList.remove('active');
            btnJpeg.classList.remove('active');
            codeAvif.classList.remove('code-disabled');
            codeWebp.classList.remove('code-disabled');

            if (level === 'avif') {
                btnAvif.classList.add('active');
                srcAvif.removeAttribute('media');
                srcWebp.removeAttribute('media');
            } else if (level === 'webp') {
                btnWebp.classList.add('active');
                srcAvif.setAttribute('media', 'not all');
                srcWebp.removeAttribute('media');
                codeAvif.classList.add('code-disabled');
            } else if (level === 'jpeg') {
                btnJpeg.classList.add('active');
                srcAvif.setAttribute('media', 'not all');
                srcWebp.setAttribute('media', 'not all');
                codeAvif.classList.add('code-disabled');
                codeWebp.classList.add('code-disabled');
            }
            
            // Forcer la récupération du poids lors du changement de support
            setTimeout(fetchFileSize, 100);
        }

        btnAvif.addEventListener('click', () => setSupport('avif'));
        btnWebp.addEventListener('click', () => setSupport('webp'));
        btnJpeg.addEventListener('click', () => setSupport('jpeg'));

        const rules = [
            { query: "(max-width: 600px)", calc: (w) => w * 1.0 },    // 100vw
            { query: "(max-width: 1200px)", calc: (w) => w * 0.8 },   // 80vw
            { query: "default", calc: (w) => 1200 }                   // 1200px fixe
        ];

        let currentKnownSrc = '';

        async function fetchFileSize() {
            if (!img.currentSrc) return;
            if (img.currentSrc === currentKnownSrc && valFileSize.textContent !== '-- KB' && valFileSize.textContent !== 'Local') return;
            
            currentKnownSrc = img.currentSrc;
            valFileSize.textContent = '...';
            valFileSize.style.fontSize = '1rem';
            
            let valFileCompare = document.getElementById('val-file-compare');
            if (!valFileCompare) {
                valFileCompare = document.createElement('div');
                valFileCompare.id = 'val-file-compare';
                valFileCompare.style.fontSize = '0.75rem';
                valFileCompare.style.marginTop = '0.2rem';
                valFileCompare.style.color = 'var(--text-muted)';
                valFileSize.parentNode.appendChild(valFileCompare);
            }
            valFileCompare.textContent = '';
            
            try {
                const response = await fetch(img.currentSrc, { method: 'HEAD', cache: 'no-cache' });
                const sizeStr = response.headers.get('content-length');
                
                if (sizeStr) {
                    const currentBytes = parseInt(sizeStr, 10);
                    const kb = (currentBytes / 1024).toFixed(1);
                    valFileSize.textContent = kb + ' KB';
                    
                    // Comparaison avec l'autre format
                    let activeFormat = 'jpeg';
                    let activeWidth = null;
                    
                    ['avif', 'webp'].forEach(fmt => {
                        const node = document.getElementById('src-' + fmt);
                        if(node && !node.getAttribute('media')) { // Si la balise est active
                            node.getAttribute('srcset').split(',').forEach(p => {
                                const parts = p.trim().split(/\s+/);
                                if (parts.length === 2 && img.currentSrc.endsWith(parts[0])) {
                                    activeFormat = fmt;
                                    activeWidth = parts[1];
                                }
                            });
                        }
                    });
                    
                    if (activeWidth && (activeFormat === 'avif' || activeFormat === 'webp')) {
                        const otherFormat = activeFormat === 'avif' ? 'webp' : 'avif';
                        let otherUrl = null;
                        
                        const otherNode = document.getElementById('src-' + otherFormat);
                        if (otherNode) {
                            otherNode.getAttribute('srcset').split(',').forEach(p => {
                                const parts = p.trim().split(/\s+/);
                                if (parts.length === 2 && parts[1] === activeWidth) {
                                    otherUrl = parts[0];
                                }
                            });
                        }
                        
                        if (otherUrl) {
                            const otherRes = await fetch(otherUrl, { method: 'HEAD', cache: 'no-cache' });
                            const otherSizeStr = otherRes.headers.get('content-length');
                            if (otherSizeStr) {
                                const otherBytes = parseInt(otherSizeStr, 10);
                                const diff = currentBytes - otherBytes;
                                const percent = (diff / otherBytes) * 100;
                                
                                if (percent < 0) {
                                    valFileCompare.innerHTML = `<span style="color: #10b981;">${percent.toFixed(0)}%</span> vs ${otherFormat.toUpperCase()}`;
                                } else if (percent > 0) {
                                    valFileCompare.innerHTML = `<span style="color: #ef4444;">+${percent.toFixed(0)}%</span> vs ${otherFormat.toUpperCase()}`;
                                } else {
                                    valFileCompare.textContent = `= vs ${otherFormat.toUpperCase()}`;
                                }
                            }
                        }
                    } else {
                        valFileCompare.textContent = "Format fallback (JPEG)";
                    }
                } else {
                    valFileSize.textContent = 'Local (sans serveur)';
                    valFileSize.style.fontSize = '0.75rem';
                }
            } catch (e) {
                valFileSize.textContent = 'Indisponible (Local)';
                valFileSize.style.fontSize = '0.75rem';
            }
        }

        function updateStats() {
            const width = window.innerWidth;
            const dpr = window.devicePixelRatio || 1;
            
            badgeWindowWidth.textContent = width;

            let activeIndex = -1;
            for (let i = 0; i < rules.length; i++) {
                if (rules[i].query === "default" || window.matchMedia(rules[i].query).matches) {
                    activeIndex = i;
                    break;
                }
            }

            conditions.forEach((el, index) => {
                if (index === activeIndex) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            });

            if (activeIndex !== -1) {
                const layoutWidth = rules[activeIndex].calc(width);
                const physicalPixels = Math.ceil(layoutWidth * dpr);
                valCalculated.textContent = physicalPixels;
            }

            let file = "En attente...";
            if (img.currentSrc) {
                file = img.currentSrc.split('/').pop();
                if (file !== valCurrentSrc.textContent) {
                    valCurrentSrc.textContent = file;
                    fetchFileSize();
                }
            }
        }

        window.addEventListener('resize', updateStats);
        img.addEventListener('load', () => {
            updateStats();
            fetchFileSize();
        });
        
        setInterval(() => {
            if (img.currentSrc) {
                const file = img.currentSrc.split('/').pop();
                if(valCurrentSrc.textContent !== file) {
                    valCurrentSrc.textContent = file;
                    fetchFileSize();
                }
            }
        }, 300);
        
        updateStats();

/**
 * Whiteout Survival - State 266 Portal Application Logic
 * Interactive UTC Clocks, Timezone Converter, Guides Filter,
 * Calculators (FC & Speedups), Ambient Audio Synth, and Copy Handlers.
 */

(function () {
  'use strict';

  // --- 1. TOAST NOTIFICATION HELPER ---
  const toastEl = document.getElementById('toast-notice');
  let toastTimer = null;

  function showToast(message, icon = '✓') {
    if (!toastEl) return;
    const msgSpan = toastEl.querySelector('.toast-msg');
    const iconSpan = toastEl.querySelector('.toast-icon');
    if (msgSpan) msgSpan.textContent = message;
    if (iconSpan) iconSpan.textContent = icon;

    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  // Copy helper
  window.copyText = function (text, label = 'Copied to clipboard') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(label);
      }).catch(() => {
        fallbackCopy(text, label);
      });
    } else {
      fallbackCopy(text, label);
    }
  };

  function fallbackCopy(text, label) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(label);
    } catch (e) {
      showToast('Copy failed, please select manually', '⚠️');
    }
    document.body.removeChild(tempInput);
  }

  // --- 2. LIVE UTC CLOCK & TIMEZONE CONVERTER ---
  const utcClockBadge = document.getElementById('utc-clock-time');
  const heroUtcClock = document.getElementById('hero-utc-clock');
  const tzSelect = document.getElementById('timezone-select');
  const tzLabel = document.getElementById('current-tz-label');

  // Offset map in hours
  const TIMEZONES = {
    'UTC': 0,
    'EST': -5,
    'EDT': -4,
    'CST': -6,
    'PST': -8,
    'PDT': -7,
    'GMT': 0,
    'BST': 1,
    'CET': 1,
    'CEST': 2,
    'EET': 2,
    'IST': 5.5,
    'CST_ASIA': 8, // China/Singapore/Perth
    'JST': 9,
    'AEST': 10
  };

  let selectedTz = 'UTC';

  function updateClocks() {
    const now = new Date();
    
    // Exact UTC strings
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    const utcTimeStr = `${utcHours}:${utcMinutes}:${utcSeconds} UTC`;

    if (utcClockBadge) utcClockBadge.textContent = utcTimeStr;

    // Timezone converted time
    const offset = TIMEZONES[selectedTz] || 0;
    const utcMillis = now.getTime() + now.getTimezoneOffset() * 60000;
    const convertedDate = new Date(utcMillis + 3600000 * offset);

    const convH = String(convertedDate.getHours()).padStart(2, '0');
    const convM = String(convertedDate.getMinutes()).padStart(2, '0');
    const convS = String(convertedDate.getSeconds()).padStart(2, '0');
    
    if (heroUtcClock) {
      heroUtcClock.textContent = `${convH}:${convM}:${convS}`;
    }
    if (tzLabel) {
      tzLabel.textContent = selectedTz;
    }

    updateCountdowns(now);
  }

  if (tzSelect) {
    tzSelect.addEventListener('change', (e) => {
      selectedTz = e.target.value;
      updateClocks();
      updateEventSlotLabels();
      showToast(`Timezone changed to ${selectedTz}`);
    });
  }

  function updateEventSlotLabels() {
    const offset = TIMEZONES[selectedTz] || 0;
    // ORA slots: 13:00 UTC and 19:00 UTC
    const slot1Ora = (13 + offset + 24) % 24;
    const slot2Ora = (19 + offset + 24) % 24;
    
    const formatHour = (h) => {
      const whole = Math.floor(h);
      const mins = (h % 1) * 60 === 30 ? ':30' : ':00';
      return `${String(whole).padStart(2, '0')}${mins}`;
    };

    const oraSlotEl = document.getElementById('ora-event-slot-label');
    if (oraSlotEl) {
      oraSlotEl.textContent = `${formatHour(slot1Ora)} & ${formatHour(slot2Ora)} (${selectedTz})`;
    }
  }

  function updateCountdowns(now) {
    const curHour = now.getUTCHours();
    const curMin = now.getUTCMinutes();
    const curSec = now.getUTCSeconds();
    const currentTotalSec = curHour * 3600 + curMin * 60 + curSec;

    // Next Bear Trap Slot (13:00 UTC or 19:00 UTC)
    const slot1Sec = 13 * 3600;
    const slot2Sec = 19 * 3600;
    let targetSec;

    if (currentTotalSec < slot1Sec) {
      targetSec = slot1Sec;
    } else if (currentTotalSec < slot2Sec) {
      targetSec = slot2Sec;
    } else {
      targetSec = slot1Sec + 86400; // Next day 13:00 UTC
    }

    let diffSec = targetSec - currentTotalSec;
    const btH = Math.floor(diffSec / 3600);
    const btM = Math.floor((diffSec % 3600) / 60);
    const btS = diffSec % 60;
    const btEl = document.getElementById('bt-countdown-val');
    if (btEl) {
      btEl.textContent = `${String(btH).padStart(2, '0')}h ${String(btM).padStart(2, '0')}m ${String(btS).padStart(2, '0')}s`;
    }

    // Daily Reset at 00:00 UTC
    const resetDiff = 86400 - currentTotalSec;
    const rH = Math.floor(resetDiff / 3600);
    const rM = Math.floor((resetDiff % 3600) / 60);
    const rS = resetDiff % 60;
    const resetEl = document.getElementById('reset-countdown-val');
    if (resetEl) {
      resetEl.textContent = `${String(rH).padStart(2, '0')}h ${String(rM).padStart(2, '0')}m ${String(rS).padStart(2, '0')}s`;
    }
  }

  setInterval(updateClocks, 1000);
  updateClocks();
  updateEventSlotLabels();

  // --- 3. ATMOSPHERIC WEATHER & AMBIENT AUDIO ENGINE ---
  const snowToggleBtn = document.getElementById('btn-toggle-snow');
  if (snowToggleBtn) {
    snowToggleBtn.addEventListener('click', () => {
      if (window.Atmosphere) {
        const active = window.Atmosphere.toggle();
        snowToggleBtn.classList.toggle('active', active);
        showToast(active ? 'Blizzard FX Enabled' : 'Blizzard FX Paused');
      }
    });
  }

  // Procedural Web Audio Ambience (Synthesizes soft arctic wind + gentle fireplace embers)
  let audioCtx = null;
  let isAudioPlaying = false;
  let windGain = null;
  let crackleNode = null;
  const audioToggleBtn = document.getElementById('btn-toggle-audio');

  function initAtmosphericAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // White noise generator for arctic wind
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for low wind howl
      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(320, audioCtx.currentTime);
      bandpass.Q.setValueAtTime(3.0, audioCtx.currentTime);

      // Lowpass for distant rumble
      const lowpass = audioCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(450, audioCtx.currentTime);

      windGain = audioCtx.createGain();
      windGain.gain.setValueAtTime(0.06, audioCtx.currentTime);

      whiteNoise.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(windGain);
      windGain.connect(audioCtx.destination);

      whiteNoise.start();

      // Subtle fire crackle synthesizer
      const crackleScript = audioCtx.createScriptProcessor(4096, 1, 1);
      crackleScript.onaudioprocess = function (e) {
        const out = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < 4096; i++) {
          if (Math.random() < 0.003) {
            out[i] = (Math.random() * 2 - 1) * 0.15;
          } else {
            out[i] = 0;
          }
        }
      };
      const fireGain = audioCtx.createGain();
      fireGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      crackleScript.connect(fireGain);
      fireGain.connect(audioCtx.destination);

      isAudioPlaying = true;
      if (audioToggleBtn) audioToggleBtn.classList.add('active');
      showToast('Glacial Ambience Playing ❄️🔥');
    } catch (err) {
      console.warn('Web Audio error:', err);
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (!audioCtx) {
        initAtmosphericAudio();
      } else {
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
          isAudioPlaying = true;
          audioToggleBtn.classList.add('active');
          showToast('Glacial Ambience Resumed');
        } else if (audioCtx.state === 'running') {
          audioCtx.suspend();
          isAudioPlaying = false;
          audioToggleBtn.classList.remove('active');
          showToast('Ambience Muted');
        }
      }
    });
  }

  // --- 4. ENDEAVOUR'S SURVIVAL ACADEMY (GUIDES FILTER) ---
  const filterBtns = document.querySelectorAll('.academy-filter-bar .filter-btn');
  const guideCards = document.querySelectorAll('.guides-grid .guide-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      guideCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 6. CALCULATORS ---
  // A. Fire Crystal Calculator (Furnace FC1 - FC8)
  const fcCurrentSelect = document.getElementById('fc-current');
  const fcTargetSelect = document.getElementById('fc-target');
  const fcResultNumber = document.getElementById('fc-result-val');
  const fcRefinedResult = document.getElementById('fc-refined-val');

  // Approximate Fire Crystals per level (Furnace only baseline, Whiteout Survival data)
  const FC_COSTS = {
    1: { fc: 650, refined: 0 },
    2: { fc: 980, refined: 0 },
    3: { fc: 1470, refined: 0 },
    4: { fc: 2200, refined: 0 },
    5: { fc: 3300, refined: 0 },
    6: { fc: 4800, refined: 80 },
    7: { fc: 6900, refined: 150 },
    8: { fc: 9800, refined: 260 },
    9: { fc: 13500, refined: 420 },
    10: { fc: 18500, refined: 650 }
  };

  function calculateFC() {
    if (!fcCurrentSelect || !fcTargetSelect || !fcResultNumber) return;
    const current = parseInt(fcCurrentSelect.value, 10);
    const target = parseInt(fcTargetSelect.value, 10);

    if (target <= current) {
      fcResultNumber.textContent = '0';
      if (fcRefinedResult) fcRefinedResult.textContent = '0';
      return;
    }

    let totalFC = 0;
    let totalRefined = 0;

    for (let lvl = current + 1; lvl <= target; lvl++) {
      if (FC_COSTS[lvl]) {
        totalFC += FC_COSTS[lvl].fc;
        totalRefined += FC_COSTS[lvl].refined;
      }
    }

    fcResultNumber.textContent = totalFC.toLocaleString();
    if (fcRefinedResult) {
      fcRefinedResult.textContent = totalRefined.toLocaleString();
    }
  }

  if (fcCurrentSelect && fcTargetSelect) {
    fcCurrentSelect.addEventListener('change', calculateFC);
    fcTargetSelect.addEventListener('change', calculateFC);
    calculateFC();
  }

  // B. Speedup SvS Prep Points Estimator
  const speedupDays = document.getElementById('sp-days');
  const speedupHours = document.getElementById('sp-hours');
  const speedupMins = document.getElementById('sp-mins');
  const speedupPointsResult = document.getElementById('sp-points-val');

  function calculateSpeedupPoints() {
    if (!speedupPointsResult) return;
    const d = parseFloat(speedupDays ? speedupDays.value : 0) || 0;
    const h = parseFloat(speedupHours ? speedupHours.value : 0) || 0;
    const m = parseFloat(speedupMins ? speedupMins.value : 0) || 0;

    const totalMinutes = d * 1440 + h * 60 + m;
    // Standard SvS speedup point rate: 30 points per minute of universal/specific speedups
    const totalPoints = totalMinutes * 30;

    speedupPointsResult.textContent = totalPoints.toLocaleString() + ' pts';
  }

  [speedupDays, speedupHours, speedupMins].forEach(input => {
    if (input) {
      input.addEventListener('input', calculateSpeedupPoints);
    }
  });
  calculateSpeedupPoints();

  // --- 7. STATE TRANSFER APPLICATION GENERATOR & DISCORD WEBHOOK ---
  const tfName = document.getElementById('tf-player-name');
  const tfOriginState = document.getElementById('tf-origin-state');
  const tfCurrentAlliance = document.getElementById('tf-current-alliance');
  const tfAlliance = document.getElementById('tf-alliance-pref');
  const tfFurnace = document.getElementById('tf-furnace');
  const tfPower = document.getElementById('tf-power');
  const tfLang = document.getElementById('tf-language');
  const tfTz = document.getElementById('tf-tz');
  const tfDiscord = document.getElementById('tf-discord');
  const tfOutput = document.getElementById('tf-letter-output');
  const btnCopyTf = document.getElementById('btn-copy-transfer');
  const btnSendDiscord = document.getElementById('btn-send-discord');
  const tfStatusMsg = document.getElementById('tf-status-msg');

  const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1558929497045209190/McmVaW2_g8z_DTg_z21OGEij54R2x9y6KuQ9FVmVb1KONgIs0hV22brzB6mvIrcFnuHB';

  function updateTransferLetter() {
    if (!tfOutput) return;
    const name = (tfName && tfName.value.trim()) || '[In-Game Name]';
    const originState = (tfOriginState && tfOriginState.value.trim()) || '[Current State]';
    const curAlliance = (tfCurrentAlliance && tfCurrentAlliance.value.trim()) || '[Current Alliance]';
    const targetAlliance = (tfAlliance && tfAlliance.value) || 'Any Top 3 (AVM / SOK / ORA)';
    const furnace = (tfFurnace && tfFurnace.value) || 'FC 5';
    const power = (tfPower && tfPower.value.trim()) || '[Current Power]';
    const lang = (tfLang && tfLang.value.trim()) || 'English';
    const tz = (tfTz && tfTz.value.trim()) || 'UTC+0';
    const discord = (tfDiscord && tfDiscord.value.trim()) || '';

    let letter = `Greetings State 266 Council & Leadership!

I would like to apply for State Transfer to State 266:
• In-Game Name: ${name}
• Current State: ${originState}
• Current Alliance: ${curAlliance}
• Target Alliance: ${targetAlliance}
• Furnace Level: ${furnace}
• Total Power: ${power}
• Spoken Language: ${lang}
• Active Timezone: ${tz}`;

    if (discord) {
      letter += `\n• Discord Handle: ${discord}`;
    }

    letter += `\n• Playstyle: Highly active, SvS Prep committed, Sunfire & Bear trap participant. Respects NAP-3 & state rules.

Looking forward to fighting alongside State 266! Thank you!`;

    tfOutput.textContent = letter;
  }

  [tfName, tfOriginState, tfCurrentAlliance, tfAlliance, tfFurnace, tfPower, tfLang, tfTz, tfDiscord].forEach(el => {
    if (el) {
      el.addEventListener('input', updateTransferLetter);
      el.addEventListener('change', updateTransferLetter);
    }
  });
  updateTransferLetter();

  if (btnCopyTf) {
    btnCopyTf.addEventListener('click', () => {
      if (tfOutput) {
        window.copyText(tfOutput.textContent, 'Transfer Application Copied! Send via Discord / In-Game Mail');
      }
    });
  }

  if (btnSendDiscord) {
    btnSendDiscord.addEventListener('click', async () => {
      const name = (tfName && tfName.value.trim()) || '';
      const originState = (tfOriginState && tfOriginState.value.trim()) || '';
      const curAlliance = (tfCurrentAlliance && tfCurrentAlliance.value.trim()) || '';
      const targetAlliance = (tfAlliance && tfAlliance.value) || 'Any Top 3 (AVM / SOK / ORA)';
      const furnace = (tfFurnace && tfFurnace.value) || 'FC 5';
      const power = (tfPower && tfPower.value.trim()) || '';
      const lang = (tfLang && tfLang.value.trim()) || 'English';
      const tz = (tfTz && tfTz.value.trim()) || 'UTC+0';
      const discord = (tfDiscord && tfDiscord.value.trim()) || '';

      if (!name) {
        if (tfStatusMsg) {
          tfStatusMsg.className = 'transfer-status-msg error';
          tfStatusMsg.style.display = 'flex';
          tfStatusMsg.textContent = '⚠️ Please enter your In-Game Name before submitting.';
        }
        if (tfName) tfName.focus();
        return;
      }

      if (!originState) {
        if (tfStatusMsg) {
          tfStatusMsg.className = 'transfer-status-msg error';
          tfStatusMsg.style.display = 'flex';
          tfStatusMsg.textContent = '⚠️ Please specify your Current State # (e.g. 150).';
        }
        if (tfOriginState) tfOriginState.focus();
        return;
      }

      btnSendDiscord.disabled = true;
      const originalText = btnSendDiscord.innerHTML;
      btnSendDiscord.innerHTML = '<span>📡 Sending to Discord...</span>';

      if (tfStatusMsg) {
        tfStatusMsg.className = 'transfer-status-msg loading';
        tfStatusMsg.style.display = 'flex';
        tfStatusMsg.textContent = 'Transmitting your application to State 266 Discord...';
      }

      const payload = {
        username: 'State 266 Transfer Desk',
        avatar_url: 'https://zcross091.github.io/StateWeb/assets/images/state266_logo.jpg',
        embeds: [
          {
            title: '📥 State Transfer Application',
            description: `**${name}** has submitted an application to transfer to **State 266**.`,
            color: 5793266, // Sleek Discord blurple #5865F2
            fields: [
              { name: '👤 In-Game Name', value: name, inline: true },
              { name: '🌍 Current State', value: originState.startsWith('State') ? originState : `State ${originState}`, inline: true },
              { name: '🛡️ Target Alliance', value: targetAlliance, inline: true },
              { name: '🏷️ Current Alliance', value: curAlliance || 'None / Solo', inline: true },
              { name: '🏰 Furnace Level', value: furnace, inline: true },
              { name: '⚡ Total Power', value: power || 'Not specified', inline: true },
              { name: '🌐 Language / Timezone', value: `${lang} • ${tz}`, inline: true },
              { name: '💬 Discord Handle', value: discord || 'Not provided', inline: true }
            ],
            footer: {
              text: 'State 266 Official Portal'
            },
            timestamp: new Date().toISOString()
          }
        ]
      };

      try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          btnSendDiscord.innerHTML = '<span>✅ Application Sent!</span>';
          if (tfStatusMsg) {
            tfStatusMsg.className = 'transfer-status-msg success';
            tfStatusMsg.style.display = 'flex';
            tfStatusMsg.textContent = '✅ Application sent successfully to our Discord channel! The leadership team will review it.';
          }
          if (typeof window.showToast === 'function') {
            window.showToast('Application sent to State 266 Discord!');
          }

          setTimeout(() => {
            btnSendDiscord.disabled = false;
            btnSendDiscord.innerHTML = originalText;
          }, 6000);
        } else {
          throw new Error(`Server returned HTTP ${response.status}`);
        }
      } catch (err) {
        console.error('Discord webhook error:', err);
        btnSendDiscord.disabled = false;
        btnSendDiscord.innerHTML = originalText;
        if (tfStatusMsg) {
          tfStatusMsg.className = 'transfer-status-msg error';
          tfStatusMsg.style.display = 'flex';
          tfStatusMsg.textContent = '⚠️ Could not send to Discord directly. Please use "Copy Application Letter" below to send manually.';
        }
      }
    });
  }

  // --- 8. ALLIANCE MODALS ---
  const allianceModalBackdrop = document.getElementById('alliance-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-alliance-title');
  const modalBody = document.getElementById('modal-alliance-body');

  const ALLIANCE_DETAILS = {
    avm: {
      title: '[AVM] ༒ SHAÐØW ༒ WØLVES ༒',
      rank: '#1 Apex Military Powerhouse',
      power: '76,108,771,766 (76.1 Billion)',
      leader: '༒Duke Ragnar༒AvM',
      recruiter: '༒ ZØRØ ༒AvM',
      members: '97 / 100 Members (97% Full)',
      languages: 'All Languages (Multi-cultural Global)',
      summary: `The reigning powerhouse of State 266. AVM leads Sunfire Castle rallies and represents the primary spearhead for State vs State (SvS) conquests. Boasting over 76 Billion power and veteran rally leaders, AVM is built for high-end combat, fortress defense, and relentless progression.`,
      whitelist: `Whitelisted players are pre-approved to rejoin without permission.`,
      contact: `In-game: ༒ ZØRØ ༒AvM or ༒Duke Ragnar༒AvM`
    },
    sok: {
      title: '[SOK] SilenceOfKittens',
      rank: '#2 High-Harmony Keystone Alliance',
      power: '43,470,849,508 (43.5 Billion)',
      leader: 'TrulyBee',
      recruiter: 'TrulyBee & SOK Officers',
      members: '73 / 100 Members (Active & Growing)',
      languages: 'All Languages',
      summary: `Maintaining peace and harmony :) watch out for the kitties! SOK is renowned for its welcoming atmosphere, zero-drama culture, and loyal community. Despite their playful name, SOK brings over 43 Billion power into state battles, providing unwavering support in castle rotations and SvS rally reinforcement.`,
      whitelist: `Whitelisted players are pre-approved to rejoin without permission.`,
      contact: `In-game: TrulyBee`
    },
    ora: {
      title: '[ORA] OriginDesAstres',
      rank: '#3 Tactical English-Speaking Elite Cadre',
      power: '34,869,766,674 (34.9 Billion)',
      leader: 'LululaKastagne',
      recruiter: 'LululaKastagne & ORA Officers',
      members: '83 / 100 Members',
      languages: 'English',
      summary: `OriginDesAstres ('Origin of the Stars') is a tightly coordinated English-speaking alliance with strict event discipline. Synchronized at 13:00 and 19:00 UTC for Bear Trap and alliance rallies. Requires Fire Crystal 5 (FC5) and 5,000,000+ power. Excellent home for players seeking scheduled events and strategic play.`,
      whitelist: `Requirements: Furnace FC5+ & Power >= 5,000,000`,
      contact: `In-game: LululaKastagne`
    }
  };

  window.openAllianceModal = function (allianceKey) {
    const data = ALLIANCE_DETAILS[allianceKey];
    if (!data || !allianceModalBackdrop) return;

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
          <span class="tag-credential veteran" style="margin-bottom: 0.5rem; display: inline-block;">${data.rank}</span>
          <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-top: 0.5rem;">${data.summary}</p>
        </div>
        <div class="ingame-stats-list" style="margin-bottom: 1.25rem;">
          <div class="ingame-stat-row">
            <span class="stat-label-with-icon">⚡ Total Power:</span>
            <span class="stat-value-bold power">${data.power}</span>
          </div>
          <div class="ingame-stat-row">
            <span class="stat-label-with-icon">👑 Alliance Leader:</span>
            <span class="stat-value-bold">${data.leader}</span>
          </div>
          <div class="ingame-stat-row">
            <span class="stat-label-with-icon">🛡️ Recruitment Officer:</span>
            <span class="stat-value-bold">${data.recruiter}</span>
          </div>
          <div class="ingame-stat-row">
            <span class="stat-label-with-icon">👥 Members:</span>
            <span class="stat-value-bold">${data.members}</span>
          </div>
          <div class="ingame-stat-row">
            <span class="stat-label-with-icon">🌐 Primary Language:</span>
            <span class="stat-value-bold">${data.languages}</span>
          </div>
        </div>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 0.75rem 1rem; color: #34d399; font-size: 0.85rem; margin-bottom: 1.5rem;">
          ✓ ${data.whitelist}
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-primary" style="flex: 1;" onclick="copyText('${data.contact}', 'Contact ID copied to clipboard!')">
            📋 Copy Contact ID
          </button>
          <button class="btn btn-secondary" onclick="closeAllianceModal()">Close</button>
        </div>
      `;
    }

    allianceModalBackdrop.classList.add('open');
  };

  window.closeAllianceModal = function () {
    if (allianceModalBackdrop) {
      allianceModalBackdrop.classList.remove('open');
    }
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeAllianceModal);
  }
  if (allianceModalBackdrop) {
    allianceModalBackdrop.addEventListener('click', (e) => {
      if (e.target === allianceModalBackdrop) closeAllianceModal();
    });
  }

  // --- 9. MOBILE MENU ---
  const mobileBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links-menu');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
})();

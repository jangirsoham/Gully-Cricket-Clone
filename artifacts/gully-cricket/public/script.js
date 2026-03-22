// ===== CONSTANTS =====
const BATTING = 'Batting';
const YET_TO_BAT = 'Yet to Bat';
const OUT = 'Out';

const BOLD = 'Bold';
const CATCH = 'Catch';
const STUMP = 'Stump';
const HIT_WICKET = 'Hit Wicket';
const RUN_OUT = 'Run Out';

// ===== MATH UTIL =====
class MathUtil {
  static getRandomNo() {
    const min = 100;
    const max = 999;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// ===== ROUTER =====
let currentPage = 'setup';

function navigateTo(page) {
  if (page === 'score') {
    window.location.hash = '#/score';
  } else {
    window.location.hash = '';
  }
  currentPage = page;
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  if (page === 'score') {
    initScoreBoard();
  } else if (page === 'setup') {
    initSetup();
  }
}

// ===== SETUP / STEPPER =====
let activeStep = 0;
const steps = ['Team', 'Overs', 'Batting'];
let formValues = { team1: '', team2: '', maxOver: '', batting: '' };

function initSetup() {
  activeStep = 0;
  formValues = { team1: '', team2: '', maxOver: '', batting: '' };
  renderStepper();
  renderStepContent();
}

function renderStepper() {
  const stepperEl = document.getElementById('stepper');
  stepperEl.innerHTML = '';
  steps.forEach((label, i) => {
    const stepEl = document.createElement('div');
    stepEl.className = 'step';

    const labelContainer = document.createElement('div');
    labelContainer.className = 'step-label-container';

    const iconEl = document.createElement('div');
    iconEl.className = 'step-icon';
    if (i < activeStep) {
      iconEl.className += ' completed';
      iconEl.innerHTML = '✓';
    } else if (i === activeStep) {
      iconEl.className += ' active';
      iconEl.textContent = i + 1;
    } else {
      iconEl.textContent = i + 1;
    }

    const textEl = document.createElement('span');
    textEl.className = 'step-label-text';
    if (i < activeStep) textEl.className += ' completed';
    if (i === activeStep) textEl.className += ' active';
    textEl.textContent = label;

    labelContainer.appendChild(iconEl);
    labelContainer.appendChild(textEl);
    stepEl.appendChild(labelContainer);

    if (i < steps.length - 1) {
      const connector = document.createElement('div');
      connector.className = 'step-connector';
      stepEl.appendChild(connector);
    }

    stepperEl.appendChild(stepEl);
  });
}

function validateStep(step) {
  const errors = {};
  if (step === 0) {
    if (!formValues.team1.trim()) errors.team1 = 'Team Name is required';
    if (!formValues.team2.trim()) errors.team2 = 'Team Name is required';
  } else if (step === 1) {
    if (!formValues.maxOver.trim()) errors.maxOver = 'Over is required';
    else if (isNaN(parseInt(formValues.maxOver)) || parseInt(formValues.maxOver) <= 0) errors.maxOver = 'Please enter a valid number of overs';
  } else if (step === 2) {
    if (!formValues.batting) errors.batting = 'Please choose who is Batting';
  }
  return errors;
}

function renderStepContent() {
  const formContainer = document.getElementById('form-content');
  formContainer.innerHTML = '';

  if (activeStep === 0) {
    formContainer.innerHTML = `
      <div class="form-group">
        <div class="text-field-wrapper">
          <label class="text-field-label ${formValues.team1 ? 'shrink' : ''}" id="label-team1">Team1 Name*</label>
          <div class="text-field-input-wrapper" id="wrapper-team1">
            <input class="text-field-input" id="input-team1" type="text" value="${escHtml(formValues.team1)}" />
          </div>
          <p class="text-field-helper error hide" id="error-team1">Team Name is required</p>
        </div>
      </div>
      <div class="center"><span class="typography-body1">VS</span></div>
      <div class="form-group" style="margin-top:2rem">
        <div class="text-field-wrapper">
          <label class="text-field-label ${formValues.team2 ? 'shrink' : ''}" id="label-team2">Team2 Name*</label>
          <div class="text-field-input-wrapper" id="wrapper-team2">
            <input class="text-field-input" id="input-team2" type="text" value="${escHtml(formValues.team2)}" />
          </div>
          <p class="text-field-helper error hide" id="error-team2">Team Name is required</p>
        </div>
      </div>
    `;
    setupTextField('team1');
    setupTextField('team2');
  } else if (activeStep === 1) {
    formContainer.innerHTML = `
      <div class="form-group" id="overs-group">
        <p style="font-weight:bold;margin:0 0 1rem 0">How many overs?</p>
        <div class="form-group">
          <div class="text-field-wrapper">
            <label class="text-field-label ${formValues.maxOver ? 'shrink' : ''}" id="label-maxOver">Overs*</label>
            <div class="text-field-input-wrapper" id="wrapper-maxOver">
              <input class="text-field-input" id="input-maxOver" type="number" min="1" value="${escHtml(formValues.maxOver)}" />
            </div>
            <p class="text-field-helper error hide" id="error-maxOver">Over is required</p>
          </div>
        </div>
      </div>
    `;
    setupTextField('maxOver');
  } else if (activeStep === 2) {
    formContainer.innerHTML = `
      <div class="form-group">
        <fieldset class="form-control-fieldset">
          <legend class="form-label-legend">Who is Batting?</legend>
          <div class="radio-group" id="batting-radio-group">
            <label class="form-control-label">
              <input class="radio-input" type="radio" name="batting" value="${escHtml(formValues.team1)}" ${formValues.batting === formValues.team1 ? 'checked' : ''} id="radio-team1" />
              <span class="radio-custom"></span>
              <span class="form-control-label-text">${escHtml(formValues.team1)}</span>
            </label>
            <label class="form-control-label">
              <input class="radio-input" type="radio" name="batting" value="${escHtml(formValues.team2)}" ${formValues.batting === formValues.team2 ? 'checked' : ''} id="radio-team2" />
              <span class="radio-custom"></span>
              <span class="form-control-label-text">${escHtml(formValues.team2)}</span>
            </label>
          </div>
          <p class="text-field-helper error hide" id="error-batting">Please choose who is Batting</p>
        </fieldset>
      </div>
    `;
    document.querySelectorAll('input[name="batting"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        formValues.batting = e.target.value;
        document.getElementById('error-batting').classList.add('hide');
      });
    });
  }

  renderNavButtons();
}

function setupTextField(fieldId) {
  const input = document.getElementById('input-' + fieldId);
  const label = document.getElementById('label-' + fieldId);
  const wrapper = document.getElementById('wrapper-' + fieldId);

  if (!input) return;

  input.addEventListener('focus', () => {
    label.classList.add('shrink', 'focused');
    wrapper.classList.add('focused');
  });

  input.addEventListener('blur', () => {
    label.classList.remove('focused');
    wrapper.classList.remove('focused');
    if (!input.value) {
      label.classList.remove('shrink');
    }
    formValues[fieldId] = input.value;
  });

  input.addEventListener('input', () => {
    formValues[fieldId] = input.value;
    if (input.value) {
      label.classList.add('shrink');
    }
  });
}

function renderNavButtons() {
  const navEl = document.getElementById('nav-buttons');
  navEl.innerHTML = `
    <button class="btn btn-contained back-button" id="btn-back" ${activeStep === 0 ? 'disabled' : ''}>Back</button>
    <button class="btn btn-contained btn-contained-primary" id="btn-next">${activeStep === steps.length - 1 ? 'Start Game' : 'Next'}</button>
  `;

  document.getElementById('btn-back').addEventListener('click', () => {
    if (activeStep > 0) {
      activeStep--;
      renderStepper();
      renderStepContent();
    }
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    // Sync form values for current step before validation
    if (activeStep === 0) {
      const t1 = document.getElementById('input-team1');
      const t2 = document.getElementById('input-team2');
      if (t1) formValues.team1 = t1.value;
      if (t2) formValues.team2 = t2.value;
    } else if (activeStep === 1) {
      const mo = document.getElementById('input-maxOver');
      if (mo) formValues.maxOver = mo.value;
    }

    const errors = validateStep(activeStep);

    if (activeStep === 0) {
      const e1 = document.getElementById('error-team1');
      const e2 = document.getElementById('error-team2');
      const w1 = document.getElementById('wrapper-team1');
      const w2 = document.getElementById('wrapper-team2');
      const l1 = document.getElementById('label-team1');
      const l2 = document.getElementById('label-team2');
      if (errors.team1) {
        e1.classList.remove('hide');
        w1.classList.add('error');
        l1.classList.add('error');
      } else {
        e1.classList.add('hide');
        w1.classList.remove('error');
        l1.classList.remove('error');
      }
      if (errors.team2) {
        e2.classList.remove('hide');
        w2.classList.add('error');
        l2.classList.add('error');
      } else {
        e2.classList.add('hide');
        w2.classList.remove('error');
        l2.classList.remove('error');
      }
      if (Object.keys(errors).length > 0) return;
    } else if (activeStep === 1) {
      const em = document.getElementById('error-maxOver');
      const wm = document.getElementById('wrapper-maxOver');
      const lm = document.getElementById('label-maxOver');
      if (errors.maxOver) {
        em.classList.remove('hide');
        wm.classList.add('error');
        lm.classList.add('error');
        return;
      } else {
        em.classList.add('hide');
        wm.classList.remove('error');
        lm.classList.remove('error');
      }
    } else if (activeStep === 2) {
      const eb = document.getElementById('error-batting');
      if (errors.batting) {
        eb.classList.remove('hide');
        return;
      } else {
        eb.classList.add('hide');
      }
    }

    if (activeStep === steps.length - 1) {
      // Submit
      localStorage.setItem('data', JSON.stringify(formValues));
      navigateTo('score');
    } else {
      activeStep++;
      renderStepper();
      renderStepContent();
    }
  });
}

// ===== SCOREBOARD =====
let state = {};

function resetState() {
  state = {
    inningNo: 1,
    match: { inning1: { batters: [], bowlers: [] }, inning2: { batters: [], bowlers: [] } },
    currentRunStack: [],
    totalRuns: 0,
    extras: { total: 0, wide: 0, noBall: 0 },
    runsByOver: 0,
    wicketCount: 0,
    totalOvers: 0,
    batters: [],
    ballCount: 0,
    overCount: 0,
    recentOvers: [],
    batter1: {},
    batter2: {},
    battingOrder: 0,
    isBatter1Edited: false,
    isBatter2Edited: false,
    isBowlerEdited: false,
    bowler: {},
    bowlers: [],
    inputBowler: '',
    isModalOpen: false,
    outType: '',
    runOutPlayerId: '',
    remainingBalls: 0,
    remainingRuns: 0,
    strikeValue: 'strike',
    isNoBall: false,
    suggestions: [],
    hasNameSuggested: false,
    hasMatchEnded: false,
  };
}

function initScoreBoard() {
  resetState();
  const data = JSON.parse(localStorage.getItem('data'));
  if (!data) { navigateTo('setup'); return; }
  state.data = data;
  state.maxOver = parseInt(data.maxOver);
  renderScoreBoard();

  document.getElementById('end-inning').disabled = true;
}

function getCRR() {
  if (state.totalOvers === 0) return 0;
  return Math.round((state.totalRuns / state.totalOvers) * 100) / 100;
}

function disableAllScoreButtons() {
  document.querySelectorAll('.score-types-button').forEach(btn => {
    btn.disabled = true;
  });
}

function enableAllScoreButtons() {
  document.querySelectorAll('.score-types-button').forEach(btn => {
    btn.disabled = false;
  });
}

function renderScoreBoard() {
  const data = state.data;
  const { team1, team2, batting } = data;
  const battingTeam = state.inningNo === 1 ? batting : (batting === team1 ? team2 : team1);
  const bowlingTeam = battingTeam === team1 ? team2 : team1;

  const app = document.getElementById('score-page-content');
  app.innerHTML = `
    <div class="inning">
      <span>Inning ${state.inningNo}: ${battingTeam} batting</span>
      <button id="end-inning">End Inning</button>
    </div>

    <div class="score-container">
      ${renderBadge()}

      <div class="score">
        <span>${state.totalRuns}-${state.wicketCount} (${state.totalOvers})</span>
        <span>CRR: ${getCRR()}</span>
      </div>

      ${state.inningNo === 2 ? renderChaseInfo() : ''}

      <div class="batting-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Batter</th>
              <th>R</th>
              <th>B</th>
              <th>4s</th>
              <th>6s</th>
              <th>SR</th>
            </tr>
          </thead>
          <tbody>
            ${renderBatterRow(1)}
            ${renderBatterRow(2)}
          </tbody>
        </table>
      </div>

      <div class="bowler">
        ${renderBowlerSection()}
      </div>

      <div class="bowler-runs">
        <span>This over: ${renderCurrentOverRuns()}</span>
      </div>

      <div class="score-types-container">
        <table>
          <tbody>
            <tr class="score-types">
              <td><button class="score-types-button" id="btn-0" data-score="0">0</button></td>
              <td><button class="score-types-button" id="btn-1" data-score="1">1</button></td>
              <td><button class="score-types-button" id="btn-2" data-score="2">2</button></td>
              <td><button class="score-types-button" id="btn-3" data-score="3">3</button></td>
            </tr>
            <tr class="score-types">
              <td><button class="score-types-button" id="btn-4" data-score="4">4</button></td>
              <td><button class="score-types-button" id="btn-6" data-score="6">6</button></td>
              <td><button class="score-types-button" id="btn-wide" data-score="wd">Wd</button></td>
              <td><button class="score-types-button score-types-button-noball" id="btn-noball" data-score="nb">Nb</button></td>
            </tr>
            <tr class="score-types">
              <td colspan="4"><button class="score-types-button" id="btn-wicket" data-score="W">Wicket</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="extras-container">
        <span>Extras: ${state.extras.total}</span>
        <span>Wide: ${state.extras.wide}</span>
        <span>No Ball: ${state.extras.noBall}</span>
      </div>

      ${renderRecentOvers()}

      ${state.hasMatchEnded ? renderScoreBoard2ndInning() : ''}
    </div>

    ${renderModal()}
  `;

  bindScoreBoardEvents();

  // Re-disable if needed
  if (!canScore()) {
    disableAllScoreButtons();
  }

  // Re-disable end inning if state requires
  const endBtn = document.getElementById('end-inning');
  if (state.hasMatchEnded) {
    endBtn.textContent = 'Reset';
    endBtn.disabled = false;
  } else if (state.overCount < state.maxOver && state.wicketCount < 10) {
    endBtn.disabled = true;
  }
}

function canScore() {
  return state.batter1.id !== undefined && state.batter2.id !== undefined && state.bowler.id !== undefined;
}

function renderBadge() {
  if (state.inningNo !== 2) return '';
  const data = state.data;
  const { team1, team2, batting } = data;
  const battingTeam = batting === team1 ? team2 : team1;
  const rrr = state.remainingBalls > 0 ?
    Math.round((state.remainingRuns / (state.remainingBalls / 6)) * 100) / 100 : 0;
  return `<div class="badge">
    <div class="badge-flex">
      <span>${battingTeam} needs ${state.remainingRuns} runs from ${state.remainingBalls} balls</span>
      <span>RRR: ${rrr}</span>
    </div>
  </div>`;
}

function renderChaseInfo() {
  return '';
}

function renderBatterRow(batterNo) {
  const batter = batterNo === 1 ? state.batter1 : state.batter2;
  const isOnStrike = batter.onStrike;

  const strikeBtn = isOnStrike !== undefined ? `
    <button class="strike-icon-button" id="strike-btn-${batterNo}" title="Toggle strike">
      <span class="material-icons icon-size" style="color:${isOnStrike ? '#3f51b5' : 'rgba(0,0,0,0.38)'};font-size:1rem">swap_horiz</span>
    </button>` : '';

  const editBtn = batter.id ? `<button class="icon-button" id="edit-batter${batterNo}" title="Edit"><span class="material-icons icon-size">edit</span></button>` : '';
  const deleteBtn = batter.id ? `<button class="icon-button" id="delete-batter${batterNo}" title="Remove"><span class="material-icons delete-icon-size" style="color:#e91e63">delete</span></button>` : '';

  return `<tr>
    <td>${strikeBtn}</td>
    <td>
      ${editBtn}
      ${deleteBtn}
      <input class="batter-input" id="batter${batterNo}Name" placeholder="Batter ${batterNo}" value="${batter.name ? escHtml(batter.name) : ''}" ${batter.name ? 'disabled' : ''} />
    </td>
    <td>${batter.run !== undefined ? batter.run : ''}</td>
    <td>${batter.ball !== undefined ? batter.ball : ''}</td>
    <td>${batter.four !== undefined ? batter.four : ''}</td>
    <td>${batter.six !== undefined ? batter.six : ''}</td>
    <td>${batter.strikeRate !== undefined ? batter.strikeRate : ''}</td>
  </tr>`;
}

function renderBowlerSection() {
  const inputValue = state.inputBowler || '';
  return `
    <div class="react-autosuggest__container">
      <input class="react-autosuggest__input" id="bowlerNameInput" placeholder="Bowler" value="${escHtml(inputValue)}" />
      <ul class="react-autosuggest__suggestions-container" id="bowler-suggestions"></ul>
    </div>
    <div style="margin-left:auto;display:flex;align-items:center;gap:4px">
      ${state.bowler.id ? `<button class="icon-button" id="edit-bowler" title="Edit bowler"><span class="material-icons icon-size">edit</span></button>` : ''}
      ${state.bowler.id ? `<button class="icon-button" id="delete-bowler" title="Remove bowler"><span class="material-icons delete-icon-size" style="color:#e91e63">delete</span></button>` : ''}
    </div>
  `;
}

function renderCurrentOverRuns() {
  return state.currentRunStack.map(r => {
    if (r === 'W') return '<b>W</b>';
    return r;
  }).join(', ') || '-';
}

function renderRecentOvers() {
  if (state.recentOvers.length === 0) return '';
  return `
    <div class="recent-over-container">
      <div class="recent-over-text"><b>Recent Overs</b></div>
      <div class="recent-over-details">
        <table>
          ${state.recentOvers.map(over => `
            <tr>
              <td style="padding:8px 4px;font-weight:500">Over ${over.overNo} (${over.bowler})</td>
              <td>
                <div class="recent-over-runs">
                  ${over.stack.map(r => `<span>${r}</span>`).join('')}
                  <span class="recent-over-total-run">${over.runs}</span>
                </div>
              </td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;
}

function renderModal() {
  if (!state.isModalOpen) return '';
  const data = state.data;
  const { team1, team2 } = data;

  let runOutSection = '';
  if (state.outType === RUN_OUT) {
    const batter1Name = state.batter1.name || '';
    const batter2Name = state.batter2.name || '';
    runOutSection = `
      <div class="run-out-row">
        <span style="font-size:0.85rem;margin-right:8px">Who is run out?</span>
        <select id="run-out-select" style="border:1px solid #ccc;padding:4px;font-family:inherit" class="run-out-player">
          <option value="">Select</option>
          ${state.batter1.id ? `<option value="${state.batter1.id}">${batter1Name}</option>` : ''}
          ${state.batter2.id ? `<option value="${state.batter2.id}">${batter2Name}</option>` : ''}
        </select>
      </div>
      <p class="run-out-player-error hide" id="run-out-error">Required</p>
    `;
  }

  return `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-box" role="dialog">
        <div style="padding:8px">
          <fieldset class="form-control-fieldset">
            <legend class="form-label-legend">Wicket Type</legend>
            <div class="radio-group" id="out-type-radio-group">
              ${[BOLD, CATCH, STUMP, HIT_WICKET, RUN_OUT].map(type => `
                <label class="form-control-label">
                  <input class="radio-input" type="radio" name="outType" value="${type}" ${state.outType === type ? 'checked' : ''} />
                  <span class="radio-custom"></span>
                  <span class="form-control-label-text">${type}</span>
                </label>
              `).join('')}
            </div>
          </fieldset>
          ${runOutSection}
          <div style="display:flex;gap:8px;padding:8px;justify-content:flex-end">
            <button class="btn btn-contained" id="modal-cancel">Cancel</button>
            <button class="btn btn-contained btn-contained-primary" id="modal-ok">OK</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderScoreBoard2ndInning() {
  const data = state.data;
  const { team1, team2, batting } = data;
  const team1Batting = state.match.inning1;
  const team2Batting = state.match.inning2;

  const inning1Team = batting;
  const inning2Team = batting === team1 ? team2 : team1;

  return `
    <div class="score-board-container">
      ${renderInningScoreCard(inning1Team, team1Batting, 1)}
      ${renderInningScoreCard(inning2Team, team2Batting, 2)}
    </div>
  `;
}

function renderInningScoreCard(teamName, inning, inningNo) {
  if (!inning || !inning.batters) return '';
  return `
    <div>
      <div class="score-board-innings">
        <span>${teamName} - Inning ${inningNo}</span>
        <span>${inning.runs || 0}-${inning.wickets || 0} (${inning.overs || 0})</span>
      </div>
      <div class="score-board-text">Batting</div>
      <div class="sb-batting">
        <table>
          <thead>
            <tr>
              <th>Batter</th><th>Status</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th>
            </tr>
          </thead>
          <tbody>
            ${(inning.batters || []).map(b => `
              <tr>
                <td>${escHtml(b.name)}</td>
                <td>${b.battingStatus}</td>
                <td>${b.run}</td>
                <td>${b.ball}</td>
                <td>${b.four}</td>
                <td>${b.six}</td>
                <td>${b.strikeRate}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="score-board-extras">
        <span>Extras: ${inning.extra ? inning.extra.total : 0}</span>
        <span>Wide: ${inning.extra ? inning.extra.wide : 0}</span>
        <span>No Ball: ${inning.extra ? inning.extra.noBall : 0}</span>
      </div>
      <div class="score-board-text">Bowling</div>
      <div class="sb-bowling">
        <table>
          <thead>
            <tr>
              <th>Bowler</th><th>O</th><th>M</th><th>R</th><th>W</th><th>Econ</th>
            </tr>
          </thead>
          <tbody>
            ${(inning.bowlers || []).map(b => `
              <tr>
                <td>${escHtml(b.name)}</td>
                <td>${b.over}</td>
                <td>${b.maiden}</td>
                <td>${b.run}</td>
                <td>${b.wicket}</td>
                <td>${b.economy}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function bindScoreBoardEvents() {
  // End inning button
  const endBtn = document.getElementById('end-inning');
  if (endBtn) {
    endBtn.addEventListener('click', handleEndInning);
  }

  // Score buttons
  document.querySelectorAll('.score-types-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const score = e.currentTarget.dataset.score;
      handleScore(score);
    });
  });

  // Batter inputs
  const batter1Input = document.getElementById('batter1Name');
  const batter2Input = document.getElementById('batter2Name');
  if (batter1Input) {
    batter1Input.addEventListener('blur', (e) => handleBatterBlur(e, 1));
  }
  if (batter2Input) {
    batter2Input.addEventListener('blur', (e) => handleBatterBlur(e, 2));
  }

  // Strike toggle
  const strikeBtn1 = document.getElementById('strike-btn-1');
  const strikeBtn2 = document.getElementById('strike-btn-2');
  if (strikeBtn1) strikeBtn1.addEventListener('click', () => handleToggleStrike(1));
  if (strikeBtn2) strikeBtn2.addEventListener('click', () => handleToggleStrike(2));

  // Edit/Delete batter
  const editBatter1 = document.getElementById('edit-batter1');
  const editBatter2 = document.getElementById('edit-batter2');
  const deleteBatter1 = document.getElementById('delete-batter1');
  const deleteBatter2 = document.getElementById('delete-batter2');
  if (editBatter1) editBatter1.addEventListener('click', () => editBatterName(1));
  if (editBatter2) editBatter2.addEventListener('click', () => editBatterName(2));
  if (deleteBatter1) deleteBatter1.addEventListener('click', () => deleteBatter(1));
  if (deleteBatter2) deleteBatter2.addEventListener('click', () => deleteBatter(2));

  // Bowler input
  const bowlerInput = document.getElementById('bowlerNameInput');
  if (bowlerInput) {
    bowlerInput.addEventListener('blur', handleBowlerBlur);
    bowlerInput.addEventListener('input', handleBowlerInput);
  }

  // Edit/Delete bowler
  const editBowler = document.getElementById('edit-bowler');
  const deleteBowlerBtn = document.getElementById('delete-bowler');
  if (editBowler) editBowler.addEventListener('click', editBowlerName);
  if (deleteBowlerBtn) deleteBowlerBtn.addEventListener('click', deleteBowler);

  // Suggestion clicks
  const suggestionsEl = document.getElementById('bowler-suggestions');
  if (suggestionsEl) {
    suggestionsEl.addEventListener('mousedown', (e) => {
      const li = e.target.closest('li[data-id]');
      if (li) {
        const id = li.dataset.id;
        const name = li.dataset.name;
        state.bowler = { id, name };
        state.inputBowler = name;
        state.hasNameSuggested = true;
        const bowlerInput = document.getElementById('bowlerNameInput');
        if (bowlerInput) {
          bowlerInput.value = name;
          bowlerInput.disabled = true;
        }
        suggestionsEl.classList.remove('react-autosuggest__suggestions-container--open');
        suggestionsEl.innerHTML = '';
        renderCurrentScore();
      }
    });
  }

  // Modal events
  const modalCancel = document.getElementById('modal-cancel');
  const modalOk = document.getElementById('modal-ok');
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalCancel) modalCancel.addEventListener('click', () => { state.isModalOpen = false; state.outType = ''; renderScoreBoard(); });
  if (modalOk) modalOk.addEventListener('click', handleModalOk);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) { state.isModalOpen = false; state.outType = ''; renderScoreBoard(); }
    });
  }

  // Modal radio
  document.querySelectorAll('input[name="outType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.outType = e.target.value;
      renderScoreBoard();
    });
  });
}

function handleToggleStrike(batterNo) {
  if (state.hasMatchEnded) return;
  state.batter1 = { ...state.batter1, onStrike: !state.batter1.onStrike };
  state.batter2 = { ...state.batter2, onStrike: !state.batter2.onStrike };
  if (batterNo === 1) {
    state.strikeValue = state.batter1.onStrike ? 'strike' : 'non-strike';
  } else {
    state.strikeValue = state.batter2.onStrike ? 'strike' : 'non-strike';
  }
  renderScoreBoard();
}

function changeStrike() {
  state.batter1 = { ...state.batter1, onStrike: !state.batter1.onStrike };
  state.batter2 = { ...state.batter2, onStrike: !state.batter2.onStrike };
}

function handleBatterBlur(e, batterNo) {
  let name = e.target.value;
  if (!name) return;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  e.target.value = name;
  e.target.disabled = true;

  if (batterNo === 1) {
    if (state.isBatter1Edited) {
      state.batter1 = { ...state.batter1, name };
      state.isBatter1Edited = false;
    } else {
      const randomNo = MathUtil.getRandomNo();
      state.batter1 = {
        id: name + randomNo,
        name,
        run: 0,
        ball: 0,
        four: 0,
        six: 0,
        strikeRate: 0,
        onStrike: state.strikeValue === 'strike',
        battingOrder: state.battingOrder + 1,
        battingStatus: BATTING,
      };
      state.battingOrder++;
    }
  } else {
    if (state.isBatter2Edited) {
      state.batter2 = { ...state.batter2, name };
      state.isBatter2Edited = false;
    } else {
      const randomNo = MathUtil.getRandomNo();
      state.batter2 = {
        id: name + randomNo,
        name,
        run: 0,
        ball: 0,
        four: 0,
        six: 0,
        strikeRate: 0,
        onStrike: state.strikeValue === 'non-strike',
        battingOrder: state.battingOrder + 1,
        battingStatus: BATTING,
      };
      state.battingOrder++;
    }
  }
  renderScoreBoard();
}

function editBatterName(batterNo) {
  if (state.overCount >= state.maxOver || state.wicketCount >= 10 || state.hasMatchEnded) return;
  const input = document.getElementById(`batter${batterNo}Name`);
  if (input) {
    input.disabled = false;
    input.focus();
  }
  if (batterNo === 1) state.isBatter1Edited = true;
  else state.isBatter2Edited = true;
}

function deleteBatter(batterNo) {
  if (batterNo === 1) {
    state.batters.push({ ...state.batter1, battingStatus: OUT });
    state.batter1 = {};
  } else {
    state.batters.push({ ...state.batter2, battingStatus: OUT });
    state.batter2 = {};
  }
  renderScoreBoard();
}

function handleBowlerInput(e) {
  state.inputBowler = e.target.value;
  const inputValue = e.target.value.trim().toLowerCase();
  const suggestionsEl = document.getElementById('bowler-suggestions');
  if (!suggestionsEl) return;

  if (inputValue.length === 0) {
    suggestionsEl.classList.remove('react-autosuggest__suggestions-container--open');
    suggestionsEl.innerHTML = '';
    return;
  }

  const matches = state.bowlers.filter(b => b.name.toLowerCase().includes(inputValue));
  state.suggestions = matches;

  if (matches.length > 0) {
    suggestionsEl.classList.add('react-autosuggest__suggestions-container--open');
    suggestionsEl.innerHTML = matches.map(b =>
      `<li class="react-autosuggest__suggestion" data-id="${b.id}" data-name="${escHtml(b.name)}">${escHtml(b.name)}</li>`
    ).join('');
  } else {
    suggestionsEl.classList.remove('react-autosuggest__suggestions-container--open');
    suggestionsEl.innerHTML = '';
  }
}

function handleBowlerBlur(e) {
  let name = e.target.value;
  if (!name) return;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  state.inputBowler = name;
  e.target.value = name;
  e.target.disabled = true;

  const suggestionsEl = document.getElementById('bowler-suggestions');
  if (suggestionsEl) {
    suggestionsEl.classList.remove('react-autosuggest__suggestions-container--open');
    suggestionsEl.innerHTML = '';
  }

  if (state.isBowlerEdited) {
    state.bowler = { ...state.bowler, name };
    state.isBowlerEdited = false;
  } else {
    if (state.hasNameSuggested) {
      state.hasNameSuggested = false;
    } else {
      const randomNo = MathUtil.getRandomNo();
      const id = name + randomNo;
      state.bowler = { id, name };
    }
  }
  renderCurrentScore();
}

function editBowlerName() {
  if (state.overCount >= state.maxOver || state.wicketCount >= 10 || state.hasMatchEnded) return;
  const bowlerInput = document.getElementById('bowlerNameInput');
  if (bowlerInput) {
    bowlerInput.disabled = false;
    bowlerInput.focus();
  }
  state.isBowlerEdited = true;
}

function deleteBowler() {
  state.bowler = {};
  state.inputBowler = '';
  renderScoreBoard();
}

function renderCurrentScore() {
  // Check if all inputs are ready, enable score buttons
  if (state.batter1.id && state.batter2.id && state.bowler.id) {
    enableAllScoreButtons();
  }
}

function handleScore(scoreType) {
  if (!state.batter1.id || !state.batter2.id || !state.bowler.id) return;
  if (state.hasMatchEnded) return;

  if (scoreType === 'W') {
    state.isModalOpen = true;
    renderScoreBoard();
    return;
  }

  if (scoreType === 'nb') {
    // No ball - toggle state, next run should add to no ball
    state.isNoBall = !state.isNoBall;
    renderScoreBoard();
    return;
  }

  processDelivery(scoreType);
}

function processDelivery(scoreType) {
  let runs = 0;
  let isWide = false;
  let isNoBall = false;
  let displayValue = scoreType;
  let isLegalBall = true;

  if (scoreType === 'wd') {
    isWide = true;
    runs = 1;
    isLegalBall = false;
    state.extras.total++;
    state.extras.wide++;
    state.currentRunStack.push('wd');
    state.totalRuns += runs;
    state.runsByOver += runs;
    if (state.inningNo === 2) state.remainingRuns -= runs;
  } else if (scoreType === 'nb') {
    isNoBall = true;
    runs = 1;
    isLegalBall = false;
    state.extras.total++;
    state.extras.noBall++;
    state.currentRunStack.push('nb');
    state.totalRuns += runs;
    state.runsByOver += runs;
    if (state.inningNo === 2) state.remainingRuns -= runs;
    state.isNoBall = false;
  } else {
    runs = parseInt(scoreType, 10);
    state.totalRuns += runs;
    state.runsByOver += runs;
    if (state.inningNo === 2) state.remainingRuns -= runs;

    if (state.isNoBall) {
      // This run is on a no ball
      isNoBall = true;
      isLegalBall = false;
      state.extras.total++;
      state.extras.noBall++;
      state.currentRunStack.push(`nb${runs}`);
      state.isNoBall = false;
    } else {
      state.currentRunStack.push(runs === 0 ? '0' : runs);
    }
  }

  // Update batting stats
  if (isLegalBall) {
    const onStrikeBatter = state.batter1.onStrike ? 'batter1' : 'batter2';
    const batState = state[onStrikeBatter];
    batState.ball++;
    batState.run += runs;
    if (runs === 4) batState.four++;
    if (runs === 6) batState.six++;
    batState.strikeRate = Math.round((batState.run / batState.ball) * 100);
    state[onStrikeBatter] = batState;

    // Rotate strike on odd runs
    if (runs % 2 !== 0) {
      changeStrike();
    }
  } else if (!isNoBall && !isWide) {
    // No-ball delivery with runs
    const onStrikeBatter = state.batter1.onStrike ? 'batter1' : 'batter2';
    const batState = state[onStrikeBatter];
    batState.run += runs;
    if (runs === 4) batState.four++;
    if (runs === 6) batState.six++;
    batState.strikeRate = batState.ball > 0 ? Math.round((batState.run / batState.ball) * 100) : 0;
    state[onStrikeBatter] = batState;
    if (runs % 2 !== 0) changeStrike();
  } else if (isWide) {
    // Wide - no runs to batter, no ball counted
  }

  if (isLegalBall) {
    state.ballCount++;
    const totalBallsDelivered = state.overCount * 6 + state.ballCount;
    state.totalOvers = Math.round((Math.floor(totalBallsDelivered / 6) + (totalBallsDelivered % 6) * 0.1) * 10) / 10;
    if (state.inningNo === 2) state.remainingBalls--;

    if (state.ballCount === 6) {
      // Over completed
      overCompleted();
      return;
    }
  }

  renderScoreBoard();
}

function overCompleted() {
  const currentRunStackCopy = [...state.currentRunStack];
  const runsByOverCopy = state.runsByOver;

  // Rotate strike at end of over
  changeStrike();

  const index = state.bowlers.findIndex(blr => blr.id === state.bowler.id);
  let isMaidenOver = true;
  let countWicket = 0;
  let countNoBall = 0;
  let countWide = 0;
  const deliveries = ['1', '2', '3', '4', '6', 'wd'];

  for (let delivery of currentRunStackCopy) {
    delivery = delivery.toString();
    if (deliveries.includes(delivery) || delivery.includes('nb')) isMaidenOver = false;
    if (delivery === 'W') countWicket++;
    if (delivery.includes('nb')) countNoBall++;
    if (delivery.includes('wd')) countWide++;
  }

  if (index !== -1) {
    const existing = state.bowlers[index];
    existing.over++;
    existing.maiden = isMaidenOver ? existing.maiden + 1 : existing.maiden;
    existing.run += runsByOverCopy;
    existing.wicket += countWicket;
    existing.noBall += countNoBall;
    existing.wide += countWide;
    existing.economy = Math.round((existing.run / existing.over) * 100) / 100;
    state.bowlers[index] = existing;
  } else {
    state.bowlers.push({
      id: state.bowler.id,
      name: state.bowler.name,
      over: 1,
      maiden: isMaidenOver ? 1 : 0,
      run: runsByOverCopy,
      wicket: countWicket,
      noBall: countNoBall,
      wide: countWide,
      economy: runsByOverCopy,
    });
  }

  state.recentOvers.push({
    overNo: state.overCount + 1,
    bowler: state.bowler.name,
    runs: runsByOverCopy,
    stack: currentRunStackCopy,
  });

  state.overCount++;
  state.ballCount = 0;
  state.currentRunStack = [];
  state.runsByOver = 0;
  state.inputBowler = '';
  state.bowler = {};

  if (state.overCount === state.maxOver) {
    const endBtn = document.getElementById('end-inning');
    if (endBtn) endBtn.disabled = false;
    disableAllScoreButtons();
  } else {
    // New over - disable score buttons until new bowler entered
    disableAllScoreButtons();
  }

  renderScoreBoard();
}

function handleModalOk() {
  if (!state.outType) return;

  if (state.outType === RUN_OUT) {
    const select = document.getElementById('run-out-select');
    if (!select || !select.value) {
      const errEl = document.getElementById('run-out-error');
      if (errEl) errEl.classList.remove('hide');
      return;
    }
    state.runOutPlayerId = select.value;
  }

  // Process wicket
  state.wicketCount++;
  state.currentRunStack.push('W');
  state.isModalOpen = false;

  if (!state.isNoBall) {
    state.ballCount++;
    const totalBallsDelivered = state.overCount * 6 + state.ballCount;
    state.totalOvers = Math.round((Math.floor(totalBallsDelivered / 6) + (totalBallsDelivered % 6) * 0.1) * 10) / 10;
    if (state.inningNo === 2) state.remainingBalls--;
  }

  // Determine which batter is out
  let outBatterNo = 1;
  if (state.outType === RUN_OUT) {
    // The one selected is out
    if (state.runOutPlayerId === state.batter2.id) outBatterNo = 2;
    else outBatterNo = 1;
  } else {
    // Batter on strike is out
    outBatterNo = state.batter1.onStrike ? 1 : 2;
  }

  // Update ball count for on-strike batter
  if (outBatterNo === 1) {
    if (!state.isNoBall) {
      state.batter1.ball++;
      state.batter1.strikeRate = state.batter1.ball > 0 ? Math.round((state.batter1.run / state.batter1.ball) * 100) : 0;
    }
  } else {
    if (!state.isNoBall) {
      state.batter2.ball++;
      state.batter2.strikeRate = state.batter2.ball > 0 ? Math.round((state.batter2.run / state.batter2.ball) * 100) : 0;
    }
  }

  state.isNoBall = false;

  // Move out batter to batters array
  if (outBatterNo === 1) {
    state.batters.push({ ...state.batter1, battingStatus: OUT });
    state.batter1 = {};
  } else {
    state.batters.push({ ...state.batter2, battingStatus: OUT });
    state.batter2 = {};
  }

  state.outType = '';
  state.runOutPlayerId = '';

  if (state.wicketCount >= 10) {
    const endBtn = document.getElementById('end-inning');
    if (endBtn) endBtn.disabled = false;
    disableAllScoreButtons();
  }

  // Check if over completed (wicket on 6th ball)
  if (state.ballCount === 6 && !state.isNoBall) {
    overCompleted();
    return;
  }

  renderScoreBoard();
}

function handleEndInning() {
  const endBtn = document.getElementById('end-inning');
  if (endBtn && endBtn.textContent === 'Reset') {
    navigateTo('setup');
    return;
  }

  // Save current batters
  if (state.batter1.id !== undefined) {
    state.batters.push({ ...state.batter1, battingStatus: BATTING });
  }
  if (state.batter2.id !== undefined) {
    state.batters.push({ ...state.batter2, battingStatus: BATTING });
  }

  // Save current bowler data
  if (state.bowler.id !== undefined) {
    const currentDisplayOver = Math.round((state.ballCount === 6 ? 1 : state.ballCount * 0.1) * 10) / 10;
    let isMaidenOver = true;
    let countWicket = 0;
    let countNoBall = 0;
    let countWide = 0;
    const deliveries = ['1', '2', '3', '4', '6', 'wd'];

    for (let delivery of state.currentRunStack) {
      delivery = delivery.toString();
      if (deliveries.includes(delivery) || delivery.includes('nb')) isMaidenOver = false;
      if (delivery === 'W') countWicket++;
      if (delivery.includes('nb')) countNoBall++;
      if (delivery.includes('wd')) countWide++;
    }

    if (state.ballCount !== 6) isMaidenOver = false;

    const index = state.bowlers.findIndex(blr => blr.id === state.bowler.id);
    if (index !== -1) {
      const existing = state.bowlers[index];
      const bowlerTotalOver = existing.over + state.ballCount / 6;
      existing.over += currentDisplayOver;
      existing.maiden = isMaidenOver ? existing.maiden + 1 : existing.maiden;
      existing.run += state.runsByOver;
      existing.wicket += countWicket;
      existing.noBall += countNoBall;
      existing.wide += countWide;
      existing.economy = Math.round((existing.run / bowlerTotalOver) * 100) / 100;
      state.bowlers[index] = existing;
    } else {
      if (state.ballCount !== 0) {
        state.bowlers.push({
          id: state.bowler.id,
          name: state.bowler.name,
          over: currentDisplayOver,
          maiden: isMaidenOver ? 1 : 0,
          run: state.runsByOver,
          wicket: countWicket,
          noBall: countNoBall,
          wide: countWide,
          economy: state.ballCount > 0 ? Math.round((state.runsByOver / (state.ballCount / 6)) * 100) / 100 : 0,
        });
      }
    }
  }

  const totalFours = state.batters.map(b => b.four).reduce((prev, next) => prev + next, 0);
  const totalSixes = state.batters.map(b => b.six).reduce((prev, next) => prev + next, 0);

  if (state.inningNo === 1) {
    const crr = getCRR();
    state.match.inning1 = {
      runs: state.totalRuns,
      wickets: state.wicketCount,
      runRate: crr,
      overs: state.totalOvers,
      four: totalFours,
      six: totalSixes,
      extra: { ...state.extras },
      batters: [...state.batters],
      bowlers: [...state.bowlers],
    };

    const prevRuns = state.totalRuns;
    state.inningNo = 2;
    state.currentRunStack = [];
    state.totalRuns = 0;
    state.extras = { total: 0, wide: 0, noBall: 0 };
    state.runsByOver = 0;
    state.wicketCount = 0;
    state.totalOvers = 0;
    state.ballCount = 0;
    state.overCount = 0;
    state.recentOvers = [];
    state.batter1 = {};
    state.batter2 = {};
    state.batters = [];
    state.bowlers = [];
    state.battingOrder = 0;
    state.inputBowler = '';
    state.bowler = {};
    state.remainingBalls = state.maxOver * 6;
    state.remainingRuns = prevRuns + 1;
    state.strikeValue = 'strike';
    state.isNoBall = false;

    renderScoreBoard();
    document.getElementById('end-inning').disabled = true;
  } else {
    const crr = getCRR();
    state.match.inning2 = {
      runs: state.totalRuns,
      wickets: state.wicketCount,
      runRate: crr,
      overs: state.totalOvers,
      four: totalFours,
      six: totalSixes,
      extra: { ...state.extras },
      batters: [...state.batters],
      bowlers: [...state.bowlers],
    };

    state.hasMatchEnded = true;
    renderScoreBoard();
    document.getElementById('end-inning').textContent = 'Reset';
    document.getElementById('end-inning').disabled = false;
    disableAllScoreButtons();
  }
}

// ===== UTILITIES =====
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ===== APP INIT =====
function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Setup Page -->
    <div id="page-setup" class="page">
      <div class="app-bar">
        <div class="toolbar">
          <h6 class="typography-h6">Multi Step Form</h6>
        </div>
      </div>
      <div class="container">
        <div class="box-margin-top">
          <div id="stepper" class="stepper"></div>
          <div class="main-container">
            <div class="form-container">
              <div id="form-content"></div>
              <div id="nav-buttons" class="nav-buttons" style="margin-top:1rem"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Score Page -->
    <div id="page-score" class="page">
      <div id="score-page-content"></div>
    </div>

    <!-- Not Found Page -->
    <div id="page-notfound" class="page not-found">
      <h2>NotFound</h2>
    </div>
  `;

  // Check if we have existing data and route to score
  const existingData = localStorage.getItem('data');
  const path = window.location.hash;

  if (path === '#/score' && existingData) {
    navigateTo('score');
  } else {
    navigateTo('setup');
  }
}

// Handle browser back/forward
window.addEventListener('hashchange', () => {
  if (window.location.hash === '#/score') {
    navigateTo('score');
  } else {
    navigateTo('setup');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered with scope:', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed:', err);
      });
  });
}

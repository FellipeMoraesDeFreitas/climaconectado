// Clima Conectado — front-end
// Consome a API Flask (back-end) em /api/*. Se o back-end não estiver no ar,
// usa dados locais de fallback para o app continuar demonstrável.

const API_BASE = window.CLIMA_API_BASE || "http://localhost:5000/api";

const app = document.getElementById("app");
const navItems = document.querySelectorAll(".nav-item");

const FALLBACK_QUIZ = [
  { pergunta: "Qual é o principal gás de efeito estufa emitido por atividades humanas?", opcoes: ["Oxigênio", "Dióxido de carbono (CO₂)", "Nitrogênio", "Hidrogênio"], correta: 1 },
  { pergunta: "O Acordo de Paris estabeleceu como meta limitar o aquecimento global a quanto, preferencialmente?", opcoes: ["1,5°C", "5°C", "10°C", "0,1°C"], correta: 0 },
  { pergunta: "Qual setor é uma das maiores fontes de emissão de CO₂ no mundo?", opcoes: ["Educação", "Geração de energia", "Artes", "Esportes"], correta: 1 },
  { pergunta: "O desmatamento contribui para o aquecimento global porque:", opcoes: ["Reduz a capacidade de absorção de CO₂", "Aumenta a umidade do ar", "Resfria o solo", "Não tem relação com o clima"], correta: 0 },
  { pergunta: "O que é a \"pegada de carbono\"?", opcoes: ["Um tipo de pegada de animal", "A quantidade de gases de efeito estufa emitidos por uma pessoa ou atividade", "Uma marca de calçado sustentável", "Um índice de poluição do ar apenas"], correta: 1 },
  { pergunta: "Qual dessas ações reduz emissões de CO₂?", opcoes: ["Usar mais transporte individual motorizado", "Priorizar transporte público e bicicleta", "Aumentar o consumo de carne vermelha", "Desperdiçar energia elétrica"], correta: 1 },
  { pergunta: "O aumento do nível do mar é causado principalmente por:", opcoes: ["Derretimento de gelo e expansão térmica da água", "Aumento da chuva", "Erosão costeira apenas", "Marés mais fortes"], correta: 0 },
  { pergunta: "Energias renováveis incluem:", opcoes: ["Carvão e petróleo", "Solar e eólica", "Gás natural", "Diesel"], correta: 1 },
  { pergunta: "O ODS 13 da ONU trata de:", opcoes: ["Erradicação da pobreza", "Ação contra a mudança global do clima", "Igualdade de gênero", "Educação de qualidade"], correta: 1 },
  { pergunta: "Reduzir o desperdício de alimentos ajuda o clima porque:", opcoes: ["Não tem nenhum efeito", "Diminui emissões ligadas à produção e ao descarte de comida", "Aumenta o consumo de energia", "Aumenta o desmatamento"], correta: 1 }
];

const FALLBACK_DICAS = [
  { titulo: "Priorize o transporte ativo", texto: "Ir a pé, de bicicleta ou de transporte público reduz bastante suas emissões de CO₂ em relação ao carro." },
  { titulo: "Economize energia elétrica", texto: "Desligue aparelhos em stand-by e prefira lâmpadas de LED — pequenos hábitos reduzem seu consumo mensal." },
  { titulo: "Reduza o desperdício de alimentos", texto: "Planeje as compras e reaproveite as sobras. Alimento desperdiçado também representa emissões desperdiçadas." },
  { titulo: "Diminua o consumo de carne vermelha", texto: "A pecuária é uma das maiores fontes de metano. Reduzir o consumo, mesmo que gradualmente, já ajuda." },
  { titulo: "Separe o lixo para reciclagem", texto: "Reciclar economiza energia e matéria-prima em relação à produção de itens novos." }
];

function setActiveNav(view) {
  navItems.forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
}

async function apiGet(path, fallback) {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error("resposta não ok");
    return await res.json();
  } catch (e) {
    console.warn(`API indisponível (${path}), usando dados locais de fallback.`, e);
    return fallback;
  }
}

async function apiPost(path, body, fallbackFn) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("resposta não ok");
    return await res.json();
  } catch (e) {
    console.warn(`API indisponível (${path}), calculando localmente.`, e);
    return fallbackFn(body);
  }
}

// ---------- VIEWS ----------

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <h1>Entenda as mudanças climáticas. Aja agora.</h1>
      <p>Teste seus conhecimentos e calcule sua pegada de carbono.</p>
      <button class="btn-primary" id="goQuizHero">Iniciar Quiz</button>
    </section>

    <button class="card" data-go="quiz">
      <span class="card-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1 1-1 1.7"/><line x1="12" y1="17" x2="12" y2="17.1"/></svg>
      </span>
      <span class="card-body">
        <h3>Quiz Interativo</h3>
        <p>10 perguntas sobre o clima</p>
      </span>
      <span class="card-arrow">&#8594;</span>
    </button>

    <button class="card" data-go="calc">
      <span class="card-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/></svg>
      </span>
      <span class="card-body">
        <h3>Calculadora de Pegada</h3>
        <p>Estime suas emissões de CO₂</p>
      </span>
      <span class="card-arrow">&#8594;</span>
    </button>

    <button class="card" data-go="dicas">
      <span class="card-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0-4 10.5c.6.5 1 1.3 1 2.1V16h6v-.4c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/></svg>
      </span>
      <span class="card-body">
        <h3>Dicas de Mitigação</h3>
        <p>Atitudes práticas do dia a dia</p>
      </span>
      <span class="card-arrow">&#8594;</span>
    </button>
  `;
  document.getElementById("goQuizHero").onclick = () => navigate("quiz");
  app.querySelectorAll("[data-go]").forEach(el => {
    el.onclick = () => navigate(el.dataset.go);
  });
}

async function renderQuiz() {
  app.innerHTML = `<p class="loading">Carregando perguntas…</p>`;
  const data = await apiGet("/quiz", FALLBACK_QUIZ);

  let index = 0;
  let score = 0;

  function renderQuestion() {
    const q = data[index];
    app.innerHTML = `
      <button class="back-link" id="backHome">&#8592; Início</button>
      <div class="quiz-progress"><div class="quiz-progress-fill" style="width:${(index / data.length) * 100}%"></div></div>
      <p class="quiz-question">${index + 1}. ${q.pergunta}</p>
      <div id="options"></div>
    `;
    document.getElementById("backHome").onclick = () => navigate("home");

    const optionsEl = document.getElementById("options");
    q.opcoes.forEach((opcao, i) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.textContent = opcao;
      btn.onclick = () => {
        const allBtns = optionsEl.querySelectorAll(".quiz-option");
        allBtns.forEach(b => (b.disabled = true));
        if (i === q.correta) {
          btn.classList.add("correct");
          score++;
        } else {
          btn.classList.add("wrong");
          allBtns[q.correta].classList.add("correct");
        }
        setTimeout(() => {
          index++;
          if (index < data.length) renderQuestion();
          else renderResult();
        }, 700);
      };
      optionsEl.appendChild(btn);
    });
  }

  function renderResult() {
    app.innerHTML = `
      <div class="quiz-result">
        <p>Você acertou</p>
        <p class="score">${score} / ${data.length}</p>
        <p>${score >= data.length * 0.7 ? "Ótimo! Você entende bem o tema." : "Vale a pena revisar as Dicas de Mitigação."}</p>
        <br/>
        <button class="btn-primary" id="retry">Refazer Quiz</button>
      </div>
    `;
    document.getElementById("retry").onclick = () => { index = 0; score = 0; renderQuestion(); };
  }

  renderQuestion();
}

function localCalc({ km_carro_semana, kwh_mes, refeicoes_carne_semana }) {
  // Fatores aproximados (kg CO2), só usados se o back-end estiver fora do ar.
  const co2Transporte = km_carro_semana * 0.192 * 4.345; // kg/mês
  const co2Energia = kwh_mes * 0.0817; // kg/mês (fator médio SIN Brasil)
  const co2Carne = refeicoes_carne_semana * 3.3 * 4.345; // kg/mês
  const total = co2Transporte + co2Energia + co2Carne;
  let nivel = "baixo";
  if (total > 400) nivel = "alto";
  else if (total > 200) nivel = "medio";
  return { total_kg_mes: Math.round(total), nivel };
}

function renderCalc() {
  app.innerHTML = `
    <button class="back-link" id="backHome">&#8592; Início</button>
    <h2 class="section-title">Calculadora de Pegada</h2>
    <form id="calcForm">
      <div class="field">
        <label for="km">Km rodados de carro por semana</label>
        <input type="number" id="km" min="0" value="0" required />
      </div>
      <div class="field">
        <label for="kwh">Consumo de energia elétrica (kWh/mês)</label>
        <input type="number" id="kwh" min="0" value="150" required />
      </div>
      <div class="field">
        <label for="carne">Refeições com carne vermelha por semana</label>
        <input type="number" id="carne" min="0" value="3" required />
      </div>
      <button type="submit" class="btn-primary" style="width:100%">Calcular</button>
    </form>
    <div id="result"></div>
  `;
  document.getElementById("backHome").onclick = () => navigate("home");

  document.getElementById("calcForm").onsubmit = async (e) => {
    e.preventDefault();
    const body = {
      km_carro_semana: Number(document.getElementById("km").value),
      kwh_mes: Number(document.getElementById("kwh").value),
      refeicoes_carne_semana: Number(document.getElementById("carne").value)
    };
    const result = await apiPost("/calcular", body, localCalc);
    const label = { baixo: "Pegada baixa", medio: "Pegada média", alto: "Pegada alta" }[result.nivel];
    document.getElementById("result").innerHTML = `
      <div class="calc-result">
        <p>Emissão estimada</p>
        <p class="kg">${result.total_kg_mes} kg CO₂/mês</p>
        <span class="level level-${result.nivel}">${label}</span>
      </div>
    `;
  };
}

async function renderDicas() {
  app.innerHTML = `<p class="loading">Carregando dicas…</p>`;
  const dicas = await apiGet("/dicas", FALLBACK_DICAS);
  app.innerHTML = `
    <button class="back-link" id="backHome">&#8592; Início</button>
    <h2 class="section-title">Dicas de Mitigação</h2>
    ${dicas.map(d => `<div class="tip"><h4>${d.titulo}</h4><p>${d.texto}</p></div>`).join("")}
  `;
  document.getElementById("backHome").onclick = () => navigate("home");
}

// ---------- ROUTER ----------

function navigate(view) {
  setActiveNav(view);
  window.location.hash = view;
  if (view === "home") renderHome();
  else if (view === "quiz") renderQuiz();
  else if (view === "calc") renderCalc();
  else if (view === "dicas") renderDicas();
}

navItems.forEach(btn => btn.addEventListener("click", () => navigate(btn.dataset.view)));

window.addEventListener("hashchange", () => {
  const view = window.location.hash.replace("#", "") || "home";
  navigate(view);
});

// inicialização
navigate(window.location.hash.replace("#", "") || "home");

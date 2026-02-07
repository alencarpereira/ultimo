
/* ================================
    HELPERS
================================ */
function getValues(selector) {
    return Array.from(document.querySelectorAll(selector))
        .map(i => Number(i.value))
        .filter(v => !isNaN(v));
}

function calcBTTS(marcados, sofridos) {
    let jogos = Math.min(marcados.length, sofridos.length);
    if (jogos === 0) return 0;

    let btts = 0;
    for (let i = 0; i < jogos; i++) {
        if (marcados[i] > 0 && sofridos[i] > 0) {
            btts++;
        }
    }
    return (btts / jogos) * 100;
}

function media(arr) {
    if (!arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/* ================================
   EVENTO PRINCIPAL
================================ */
document.getElementById("btnCalcular").addEventListener("click", () => {

    // ---------- BANCA ----------
    const banca = Number(document.getElementById("banca").value);
    const perda = Number(document.getElementById("perda").value);
    const odds = Number(document.getElementById("odds").value);

    // ---------- TIME A ----------
    const aMarcados = getValues(".a-marcados");
    const aSofridos = getValues(".a-sofridos");

    // ---------- TIME B ----------
    const bMarcados = getValues(".b-marcados");
    const bSofridos = getValues(".b-sofridos");

    // ---------- H2H ----------
    const h2hA = getValues(".h2h-a");
    const h2hB = getValues(".h2h-b");

    // ---------- BTTS ----------
    const bttsA = calcBTTS(aMarcados, aSofridos);
    const bttsB = calcBTTS(bMarcados, bSofridos);
    const bttsH2H = calcBTTS(h2hA, h2hB);

    // ---------- MÉDIAS ----------
    const mediaGolsA = media(aMarcados);
    const mediaSofreA = media(aSofridos);
    const mediaGolsB = media(bMarcados);
    const mediaSofreB = media(bSofridos);

    // ---------- SCORE PONDERADO ----------
    // pesos: Time A 35% | Time B 35% | H2H 30%
    const scoreFinal =
        (bttsA * 0.35) +
        (bttsB * 0.35) +
        (bttsH2H * 0.30);

    // ---------- DECISÃO ----------
    let decisao = "❌ NÃO ENTRAR";
    if (scoreFinal >= 60) decisao = "✅ ENTRAR (BTTS SIM)";
    else if (scoreFinal >= 52) decisao = "⚠️ CUIDADO";

    // ---------- GESTÃO FINANCEIRA ----------
    let aposta = 0;
    let risco = 0;

    if (odds > 1 && perda > 0) {
        aposta = (perda + 1) / (odds - 1);
        risco = banca ? (aposta / banca) * 100 : 0;
    }

    let alerta = "";
    if (risco > 20) alerta = "🚨 RISCO ALTO (>20% da banca)";
    else if (risco > 15) alerta = "⚠️ Atenção ao risco";
    else alerta = "🟢 Risco controlado";

    // ---------- OUTPUT ----------
    document.getElementById("resultado").innerHTML = `
        <h2>Resultado Estatístico</h2>

        <p><strong>BTTS Time A:</strong> ${bttsA.toFixed(1)}%</p>
        <p><strong>BTTS Time B:</strong> ${bttsB.toFixed(1)}%</p>
        <p><strong>BTTS H2H:</strong> ${bttsH2H.toFixed(1)}%</p>

        <hr>

        <p><strong>Média gols Time A:</strong> ${mediaGolsA.toFixed(2)}</p>
        <p><strong>Média sofre Time A:</strong> ${mediaSofreA.toFixed(2)}</p>
        <p><strong>Média gols Time B:</strong> ${mediaGolsB.toFixed(2)}</p>
        <p><strong>Média sofre Time B:</strong> ${mediaSofreB.toFixed(2)}</p>

        <hr>

        <h3>Score Final: ${scoreFinal.toFixed(1)}%</h3>
        <h3>${decisao}</h3>

        <hr>

        <h3>Gestão da Aposta</h3>
        <p><strong>Aposta sugerida:</strong> R$ ${aposta.toFixed(2)}</p>
        <p><strong>Risco da banca:</strong> ${risco.toFixed(1)}%</p>
        <p>${alerta}</p>
    `;
});

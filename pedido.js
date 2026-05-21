/* ====== Visualizador read-only de orçamento ======
   Lê o pedido do hash da URL e renderiza como nota fiscal HTML.
   Depende de produtos.js e nota.js. */

const $ = (id) => document.getElementById(id);

function lerPedidoDaUrl() {
    if (!location.hash.startsWith("#p=")) return null;
    return decodePedidoBase64(location.hash.slice(3));
}

function renderNota(state) {
    if (!state || state.itens.length === 0) {
        return `
            <div class="view-vazio">
                <p>Link inválido ou pedido vazio.</p>
                <p><a href="index.html">Abrir a calculadora</a> para criar um novo orçamento.</p>
            </div>
        `;
    }

    const t = calcTotais(state);
    const data = dataNotaTexto();
    const numero = state.numeroNota || "----";
    const cliente = (state.cliente || "").trim();
    const anot = (state.anotacoes || "").trim();
    const totalUnidades = state.itens.reduce((s, it) => s + it.quantidade, 0);

    const linhasItens = state.itens.map(it => {
        const p = PRODUTOS[indiceProduto(it.produtoId)];
        const sub = it.precoUnit * it.quantidade;
        return `
            <tr>
                <td class="nt-nome">${escapeHtml(it.produtoId)}</td>
                <td class="nt-qtd">${it.quantidade}</td>
                <td class="nt-unit">${fmt(it.precoUnit)}</td>
                <td class="nt-sub">${fmt(sub)}</td>
            </tr>
        `;
    }).join("");

    const linhaDesconto = t.descAplicado > 0 ? `
        <tr class="nt-tot-desc">
            <td colspan="3">Desconto (${t.descAplicado.toFixed(2)}%):</td>
            <td>-${fmt(t.subtotal - t.total)}</td>
        </tr>
    ` : "";

    const blocoCliente = cliente ? `
        <p class="nt-cliente"><span class="lbl">Cliente:</span> ${escapeHtml(cliente)}</p>
    ` : "";

    const blocoAnotacoes = anot ? `
        <div class="nt-observacoes">
            <h4>Observações</h4>
            <p>${escapeHtml(anot)}</p>
        </div>
    ` : "";

    return `
        <header class="nt-header">
            <div class="nt-crest" aria-hidden="true">
                <svg viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M 30 12 L 32.5 22 L 43 22.5 L 35 28.5 L 38 39 L 30 33 L 22 39 L 25 28.5 L 17 22.5 L 27.5 22 Z"
                          fill="currentColor"/>
                </svg>
            </div>
            <h1>Fazenda Rockefeller</h1>
            <p class="nt-razao">Rockefeller Produtos Agropecuários S.A.</p>
            <p class="nt-endereco">Flatneck Station · New Hanover · Westfox</p>
        </header>

        <section class="nt-meta">
            <p class="nt-numero">NOTA DE ORÇAMENTO · Nº ${escapeHtml(String(numero))}</p>
            <p class="nt-data">${data.texto} — ${data.hh}:${data.mm}</p>
            ${blocoCliente}
        </section>

        <table class="nt-itens">
            <thead>
                <tr>
                    <th class="nt-nome">Produto</th>
                    <th class="nt-qtd">Qtd</th>
                    <th class="nt-unit">Unit.</th>
                    <th class="nt-sub">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${linhasItens}
            </tbody>
            <tfoot>
                <tr class="nt-tot-sub">
                    <td colspan="3">Subtotal:</td>
                    <td>${fmt(t.subtotal)}</td>
                </tr>
                ${linhaDesconto}
                <tr class="nt-tot-final">
                    <td colspan="3">TOTAL A PAGAR</td>
                    <td>${fmt(t.total)}</td>
                </tr>
            </tfoot>
        </table>

        <p class="nt-resumo">${state.itens.length} ${state.itens.length === 1 ? "item" : "itens"} · ${totalUnidades} ${totalUnidades === 1 ? "unidade" : "unidades"}</p>

        ${blocoAnotacoes}

        <div class="nt-assinaturas">
            <div class="nt-sig">
                <span class="nt-sig-label">Atendido por</span>
                <span class="nt-sig-line"></span>
            </div>
            <div class="nt-sig">
                <span class="nt-sig-label">Assinatura</span>
                <span class="nt-sig-line"></span>
            </div>
        </div>

        <footer class="nt-footer">
            <p class="nt-virtudes">✦ Tradição · Trabalho · Visão · Legado ✦</p>
            <p class="nt-razao-foot">Rockefeller Produtos Agropecuários S.A.</p>
        </footer>
    `;
}

function montarLinkEditor(hash) {
    let base = location.pathname.replace(/pedido\.html$/, "");
    if (!base.endsWith("/")) base += "/";
    return `${location.origin}${base}index.html${hash}`;
}

async function copiarTextoDiscord(state) {
    const feedback = $("copy-feedback");
    if (!state || state.itens.length === 0) {
        feedback.textContent = "Pedido vazio — nada a copiar.";
        setTimeout(() => { feedback.textContent = ""; }, 3000);
        return;
    }
    const texto = gerarNotaFiscal(state);
    try {
        await navigator.clipboard.writeText(texto);
        feedback.textContent = "✓ Orçamento copiado! Cole no Discord (Ctrl+V).";
    } catch {
        feedback.textContent = "Não foi possível copiar. Tente o botão direito → Copiar.";
    }
    setTimeout(() => { feedback.textContent = ""; }, 4000);
}

function init() {
    const state = lerPedidoDaUrl();
    const conteudo = $("nota-content");

    if (!state) {
        conteudo.innerHTML = `
            <div class="view-vazio">
                <p>Link inválido ou ausente.</p>
                <p><a href="index.html">Abrir a calculadora</a> para criar um orçamento.</p>
            </div>
        `;
        // Esconde botões inúteis
        document.querySelector(".view-actions").hidden = true;
        return;
    }

    conteudo.innerHTML = renderNota(state);

    document.title = state.cliente
        ? `Orçamento Nº ${state.numeroNota || "----"} — ${state.cliente}`
        : `Orçamento Nº ${state.numeroNota || "----"} — Fazenda Rockefeller`;

    $("copy-discord").addEventListener("click", () => copiarTextoDiscord(state));
    $("open-editor").addEventListener("click", () => {
        location.href = montarLinkEditor(location.hash);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

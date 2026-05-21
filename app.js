/* ====== Livro de Orçamento da Fazenda Rockefeller ======
   Calculadora estática, 100% client-side. */

const PRODUTOS = [
    { nome: "Açúcar",                 min: 0.50, max: 0.60 },
    { nome: "Algodão",                min: 0.40, max: 0.50 },
    { nome: "Alho",                   min: 0.40, max: 0.50 },
    { nome: "Ameixa",                 min: 0.40, max: 0.50 },
    { nome: "Amora",                  min: 0.40, max: 0.50 },
    { nome: "Banana",                 min: 0.40, max: 0.50 },
    { nome: "Batata",                 min: 0.40, max: 0.50 },
    { nome: "Cacau",                  min: 0.40, max: 0.50 },
    { nome: "Café",                   min: 0.40, max: 0.50 },
    { nome: "Cana-de-açúcar",         min: 0.40, max: 0.50 },
    { nome: "Carne de Porco",         min: 0.60, max: 0.80 },
    { nome: "Carne de Vaca",          min: 1.50, max: 2.00 },
    { nome: "Cenoura",                min: 0.40, max: 0.50 },
    { nome: "Coalhada",               min: 1.20, max: 1.50 },
    { nome: "Couro de Cavalo",        min: 0.80, max: 1.00 },
    { nome: "Fertilizante",           min: 0.50, max: 0.80 },
    { nome: "Giseng Americano",       min: 0.40, max: 0.50 },
    { nome: "Giseng-do-Alaska",       min: 0.40, max: 0.50 },
    { nome: "Hortelã",                min: 0.40, max: 0.50 },
    { nome: "Lã de Ovelha",           min: 0.50, max: 0.60 },
    { nome: "Laranja",                min: 0.40, max: 0.50 },
    { nome: "Leite",                  min: 0.50, max: 0.60 },
    { nome: "Leite de Cabra",         min: 0.60, max: 0.75 },
    { nome: "Lúpulo",                 min: 0.40, max: 0.50 },
    { nome: "Maçã",                   min: 0.40, max: 0.50 },
    { nome: "Manteiga",               min: 1.70, max: 2.30 },
    { nome: "Milho",                  min: 0.40, max: 0.50 },
    { nome: "Orégano",                min: 0.40, max: 0.50 },
    { nome: "Ovo",                    min: 0.60, max: 0.80 },
    { nome: "Pêssego",                min: 0.40, max: 0.50 },
    { nome: "Queijo",                 min: 1.20, max: 1.50 },
    { nome: "Queijo de Cabra",        min: 2.00, max: 2.50 },
    { nome: "Ração",                  min: 15.00, max: 18.00 },
    { nome: "Requeijão",              min: 3.60, max: 4.50 },
    { nome: "Ricota",                 min: 1.20, max: 1.50 },
    { nome: "Saco de Algodão",        min: 15.00, max: 18.00 },
    { nome: "Saco de Alho",           min: 15.00, max: 18.00 },
    { nome: "Saco de Ameixa",         min: 15.00, max: 18.00 },
    { nome: "Saco de Amora",          min: 15.00, max: 18.00 },
    { nome: "Saco de Banana",         min: 15.00, max: 18.00 },
    { nome: "Saco de Batata",         min: 15.00, max: 18.00 },
    { nome: "Saco de Cacau",          min: 15.00, max: 18.00 },
    { nome: "Saco de Café",           min: 15.00, max: 18.00 },
    { nome: "Saco de Cana-de-açúcar", min: 15.00, max: 18.00 },
    { nome: "Saco de Cenoura",        min: 15.00, max: 18.00 },
    { nome: "Saco de Giseng Americano",  min: 15.00, max: 18.00 },
    { nome: "Saco de Giseng-do-Alaska",  min: 15.00, max: 18.00 },
    { nome: "Saco de Hortelã",        min: 15.00, max: 18.00 },
    { nome: "Saco de Laranja",        min: 15.00, max: 18.00 },
    { nome: "Saco de Lúpulo",         min: 15.00, max: 18.00 },
    { nome: "Saco de Maçã",           min: 15.00, max: 18.00 },
    { nome: "Saco de Milho",          min: 15.00, max: 18.00 },
    { nome: "Saco de Orégano",        min: 15.00, max: 18.00 },
    { nome: "Saco de Pêssego",        min: 15.00, max: 18.00 },
    { nome: "Saco de Tomilho",        min: 15.00, max: 18.00 },
    { nome: "Saco de Trigo",          min: 15.00, max: 18.00 },
    { nome: "Saco de Uva",            min: 15.00, max: 18.00 },
    { nome: "Tabaco",                 min: 0.40, max: 0.50 },
    { nome: "Tomilho",                min: 0.40, max: 0.50 },
    { nome: "Trigo",                  min: 0.40, max: 0.50 },
    { nome: "Uva",                    min: 0.40, max: 0.50 },
];

PRODUTOS.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

const STORAGE_KEY = "fazenda-rockefeller-pedido-v1";

const estado = carregar() || {
    itens: [],
    descontoPercent: 0,
};

function carregar() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || !Array.isArray(data.itens)) return null;
        return data;
    } catch { return null; }
}

function salvar() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(estado)); } catch {}
}

const $ = (id) => document.getElementById(id);
const fmt = (n) => `$${n.toFixed(2)}`;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function indiceProduto(nome) {
    return PRODUTOS.findIndex(p => p.nome === nome);
}

function popularSelect() {
    const sel = $("produto-select");
    sel.innerHTML = PRODUTOS.map((p, i) =>
        `<option value="${i}">${p.nome} &nbsp;($${p.min.toFixed(2)} – $${p.max.toFixed(2)})</option>`
    ).join("");
    atualizarHintProduto();
    sel.addEventListener("change", atualizarHintProduto);
}

function atualizarHintProduto() {
    const i = parseInt($("produto-select").value, 10);
    const p = PRODUTOS[i];
    if (!p) { $("produto-hint").textContent = ""; return; }
    $("produto-hint").textContent = `Faixa permitida: ${fmt(p.min)} a ${fmt(p.max)} por unidade.`;
}

function adicionarItem() {
    const i = parseInt($("produto-select").value, 10);
    const qtd = Math.max(1, Math.floor(parseFloat($("qtd-input").value) || 1));
    const p = PRODUTOS[i];
    if (!p) return;

    // Se já existe, soma a quantidade
    const existente = estado.itens.find(it => it.produtoId === p.nome);
    if (existente) {
        existente.quantidade += qtd;
    } else {
        estado.itens.push({
            produtoId: p.nome,
            quantidade: qtd,
            precoUnit: p.max,  // começa no máximo
        });
    }
    $("qtd-input").value = 1;
    salvar();
    render();
}

function removerItem(idx) {
    estado.itens.splice(idx, 1);
    salvar();
    render();
}

function atualizarQtd(idx, valor) {
    const v = Math.max(1, Math.floor(parseFloat(valor) || 1));
    estado.itens[idx].quantidade = v;
    salvar();
    render();
}

function atualizarPreco(idx, valor) {
    const item = estado.itens[idx];
    const p = PRODUTOS[indiceProduto(item.produtoId)];
    let v = parseFloat(valor);
    if (isNaN(v)) v = p.max;
    const original = v;
    v = clamp(v, p.min, p.max);
    item.precoUnit = v;
    item._aviso = (original !== v);
    salvar();
    render();
}

function calcTotais() {
    let subtotal = 0;
    let minTotal = 0;
    for (const it of estado.itens) {
        subtotal += it.precoUnit * it.quantidade;
        const p = PRODUTOS[indiceProduto(it.produtoId)];
        minTotal += p.min * it.quantidade;
    }
    // desconto máximo permitido (em %) tal que total >= minTotal
    let descMaxPct = 100;
    if (subtotal > 0) {
        descMaxPct = Math.max(0, (1 - minTotal / subtotal) * 100);
    }
    let descAplicado = estado.descontoPercent;
    let descClampado = false;
    if (descAplicado > descMaxPct) {
        descAplicado = descMaxPct;
        descClampado = true;
    }
    if (descAplicado < 0) descAplicado = 0;
    const total = subtotal * (1 - descAplicado / 100);
    return { subtotal, minTotal, descMaxPct, descAplicado, descClampado, total };
}

function render() {
    const lista = $("itens-lista");

    if (estado.itens.length === 0) {
        lista.innerHTML = `<div class="vazio">Nenhum item no pedido ainda, forasteiro.</div>`;
    } else {
        lista.innerHTML = estado.itens.map((it, idx) => {
            const p = PRODUTOS[indiceProduto(it.produtoId)];
            const sub = it.precoUnit * it.quantidade;
            const warnClass = it._aviso ? "preco-warning" : "";
            return `
                <div class="item-row">
                    <div class="nome">
                        ${escapeHtml(p.nome)}
                        <small>min ${fmt(p.min)} · max ${fmt(p.max)}</small>
                    </div>
                    <div class="qtd-wrap">
                        <input type="number" min="1" step="1" value="${it.quantidade}"
                            data-acao="qtd" data-idx="${idx}" aria-label="Quantidade">
                    </div>
                    <div class="preco-wrap">
                        <input type="number" min="${p.min}" max="${p.max}" step="0.01"
                            value="${it.precoUnit.toFixed(2)}"
                            class="${warnClass}"
                            data-acao="preco" data-idx="${idx}" aria-label="Preço unitário">
                    </div>
                    <div class="subtotal">${fmt(sub)}</div>
                    <button class="btn-remover" data-acao="remover" data-idx="${idx}" title="Remover">✕</button>
                </div>
            `;
        }).join("");
    }

    const t = calcTotais();
    $("subtotal-val").textContent = fmt(t.subtotal);
    $("total-val").textContent = fmt(t.total);
    $("desconto-input").value = t.descAplicado.toFixed(t.descAplicado % 1 === 0 ? 0 : 2);
    $("desconto-hint").textContent =
        estado.itens.length > 0 ? `máx permitido: ${t.descMaxPct.toFixed(2)}%` : "";

    const aviso = $("aviso-desconto");
    if (t.descClampado) {
        aviso.textContent = `Desconto reduzido para ${t.descMaxPct.toFixed(2)}% — limite mínimo do contrato com a fazenda.`;
    } else {
        aviso.textContent = "";
    }
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
        ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

function gerarTextoDiscord() {
    const t = calcTotais();
    const hoje = new Date();
    const data = hoje.toLocaleDateString('pt-BR');
    const hora = hoje.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (estado.itens.length === 0) {
        return "```\n📜 Pedido vazio — Fazenda Rockefeller\n```";
    }

    // Largura máxima do nome para alinhar
    const maxNome = Math.max(...estado.itens.map(it => it.produtoId.length));

    const linhas = estado.itens.map(it => {
        const nome = it.produtoId.padEnd(maxNome, " ");
        const qtd = String(it.quantidade).padStart(4, " ");
        const preco = fmt(it.precoUnit).padStart(7, " ");
        const sub = fmt(it.precoUnit * it.quantidade).padStart(9, " ");
        return `  ${nome}  x ${qtd}  @ ${preco}  = ${sub}`;
    });

    const linha = "═".repeat(Math.max(48, maxNome + 32));

    let out = "```";
    out += "\n📜 PEDIDO — FAZENDA ROCKEFELLER";
    out += `\n${data} · ${hora}`;
    out += `\n${linha}`;
    out += `\n${linhas.join("\n")}`;
    out += `\n${linha}`;
    out += `\n  Subtotal: ${fmt(t.subtotal).padStart(40)}`;
    if (t.descAplicado > 0) {
        const valorDesc = t.subtotal - t.total;
        out += `\n  Desconto (${t.descAplicado.toFixed(2)}%): ${("- " + fmt(valorDesc)).padStart(31 - String(t.descAplicado.toFixed(2)).length)}`;
    }
    out += `\n  TOTAL:    ${fmt(t.total).padStart(40)}`;
    out += "\n```";
    return out;
}

async function copiarParaDiscord() {
    const texto = gerarTextoDiscord();
    const feedback = $("copy-feedback");
    try {
        await navigator.clipboard.writeText(texto);
        feedback.textContent = "✓ Orçamento copiado! Cole no Discord (Ctrl+V).";
    } catch {
        // Fallback
        const ta = document.createElement("textarea");
        ta.value = texto;
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand("copy");
            feedback.textContent = "✓ Orçamento copiado! Cole no Discord (Ctrl+V).";
        } catch {
            feedback.textContent = "Não foi possível copiar automaticamente. Selecione e copie manualmente:";
            const pre = document.createElement("pre");
            pre.textContent = texto;
            pre.style.cssText = "background:#f3e3bc;padding:8px;margin-top:8px;text-align:left;white-space:pre;overflow:auto;border:1px solid #4a3522;";
            feedback.appendChild(pre);
        }
        document.body.removeChild(ta);
    }
    setTimeout(() => {
        if (feedback.firstChild && feedback.firstChild.nodeType === Node.TEXT_NODE) {
            feedback.textContent = "";
        }
    }, 4000);
}

function limparPedido() {
    if (estado.itens.length === 0) return;
    if (!confirm("Tem certeza que deseja limpar todo o pedido, forasteiro?")) return;
    estado.itens = [];
    estado.descontoPercent = 0;
    salvar();
    render();
}

function init() {
    popularSelect();

    $("add-btn").addEventListener("click", adicionarItem);
    $("qtd-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") adicionarItem();
    });

    $("itens-lista").addEventListener("input", (e) => {
        const t = e.target;
        const acao = t.dataset.acao;
        const idx = parseInt(t.dataset.idx, 10);
        if (acao === "qtd") atualizarQtd(idx, t.value);
        else if (acao === "preco") atualizarPreco(idx, t.value);
    });
    $("itens-lista").addEventListener("click", (e) => {
        const t = e.target.closest("[data-acao='remover']");
        if (!t) return;
        removerItem(parseInt(t.dataset.idx, 10));
    });

    $("desconto-input").addEventListener("input", (e) => {
        const v = parseFloat(e.target.value);
        estado.descontoPercent = isNaN(v) ? 0 : v;
        salvar();
        render();
    });

    $("copiar-btn").addEventListener("click", copiarParaDiscord);
    $("limpar-btn").addEventListener("click", limparPedido);

    render();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

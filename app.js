/* ====== Livro de Orçamento — Família Rockefeller ======
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

function categoriaDe(nome) {
    if (nome.startsWith("Saco de")) return "Sacos";
    if (/(Carne|Couro|Ovo|Ração)/i.test(nome)) return "Animais & Insumos";
    if (/(Leite|Queijo|Manteiga|Coalhada|Ricota|Requeijão)/i.test(nome)) return "Laticínios";
    if (/(Açúcar|Cacau|Café|Hortelã|Orégano|Tomilho|Lúpulo|Tabaco|Giseng)/i.test(nome)) return "Especiarias & Outros";
    if (/(Algodão|Lã|Fertilizante)/i.test(nome)) return "Matérias-primas";
    return "Frutas, Grãos & Vegetais";
}
PRODUTOS.forEach(p => { p.categoria = categoriaDe(p.nome); });

const ORDEM_CATEGORIAS = [
    "Frutas, Grãos & Vegetais",
    "Laticínios",
    "Animais & Insumos",
    "Especiarias & Outros",
    "Matérias-primas",
    "Sacos",
];

function semAcento(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const STORAGE_KEY = "fazenda-rockefeller-pedido-v2";
const MAX_RECENTES = 6;

const estado = carregar() || {
    itens: [],
    descontoPercent: 0,
    recentes: [],
    numeroNota: null,
    cliente: "",
};
if (!Array.isArray(estado.recentes)) estado.recentes = [];
if (typeof estado.numeroNota === "undefined") estado.numeroNota = null;
if (typeof estado.cliente !== "string") estado.cliente = "";

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

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
        ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

function registrarRecente(nome) {
    estado.recentes = [nome, ...estado.recentes.filter(n => n !== nome)].slice(0, MAX_RECENTES);
}

// ============ COMBOBOX (busca + lista filtrada) ============
const combo = {
    aberto: false,
    indiceAtivo: -1,
    selecionado: null,
    filtrados: [],
};

function filtrarProdutos(termo) {
    const q = semAcento(termo.trim());
    const itensFiltrados = q
        ? PRODUTOS.filter(p => semAcento(p.nome).includes(q))
        : PRODUTOS.slice();

    const lista = [];
    for (const cat of ORDEM_CATEGORIAS) {
        const doGrupo = itensFiltrados.filter(p => p.categoria === cat);
        if (doGrupo.length === 0) continue;
        lista.push({ tipo: "cat", nome: cat });
        for (const p of doGrupo) {
            lista.push({ tipo: "item", produtoIdx: PRODUTOS.indexOf(p), produto: p });
        }
    }
    return lista;
}

function itensFiltradosOnly() {
    return combo.filtrados.filter(r => r.tipo === "item");
}

function renderListaCombobox() {
    const ul = $("produto-lista");
    if (combo.filtrados.length === 0) {
        ul.innerHTML = `<li class="combo-vazio">Nenhum produto encontrado.</li>`;
        return;
    }
    let posItem = -1;
    ul.innerHTML = combo.filtrados.map((row) => {
        if (row.tipo === "cat") {
            return `<li class="combo-cat" role="presentation">${escapeHtml(row.nome)}</li>`;
        }
        posItem++;
        const p = row.produto;
        const ativo = posItem === combo.indiceAtivo;
        return `
            <li class="combo-item ${ativo ? "ativo" : ""}" role="option" aria-selected="${ativo}"
                data-pos="${posItem}" data-produto-idx="${row.produtoIdx}">
                <span class="combo-nome">${escapeHtml(p.nome)}</span>
                <span class="combo-preco">${fmt(p.min)} – ${fmt(p.max)}</span>
            </li>
        `;
    }).join("");

    const ativo = ul.querySelector(".combo-item.ativo");
    if (ativo) ativo.scrollIntoView({ block: "nearest" });
}

function abrirCombobox() {
    if (combo.aberto) return;
    combo.aberto = true;
    $("produto-lista").hidden = false;
    $("produto-busca").setAttribute("aria-expanded", "true");
    $("combobox").classList.add("aberto");
}

function fecharCombobox() {
    combo.aberto = false;
    combo.indiceAtivo = -1;
    $("produto-lista").hidden = true;
    $("produto-busca").setAttribute("aria-expanded", "false");
    $("combobox").classList.remove("aberto");
}

function selecionarProduto(produtoIdx) {
    combo.selecionado = produtoIdx;
    const p = PRODUTOS[produtoIdx];
    $("produto-busca").value = p.nome;
    fecharCombobox();
    atualizarHintProduto();
    $("qtd-input").focus();
    $("qtd-input").select();
}

function atualizarHintProduto() {
    if (combo.selecionado == null) { $("produto-hint").textContent = ""; return; }
    const p = PRODUTOS[combo.selecionado];
    $("produto-hint").textContent = `Faixa permitida: ${fmt(p.min)} a ${fmt(p.max)} por unidade.`;
}

function inicializarCombobox() {
    const input = $("produto-busca");
    const ul = $("produto-lista");
    const toggle = $("combobox-toggle");

    const atualizar = () => {
        combo.filtrados = filtrarProdutos(input.value);
        const items = itensFiltradosOnly();
        if (combo.indiceAtivo >= items.length) combo.indiceAtivo = items.length - 1;
        if (combo.indiceAtivo < 0 && items.length > 0) combo.indiceAtivo = 0;
        renderListaCombobox();
    };

    input.addEventListener("focus", () => { atualizar(); abrirCombobox(); });
    input.addEventListener("input", () => {
        combo.selecionado = null;
        combo.indiceAtivo = 0;
        atualizar();
        abrirCombobox();
        atualizarHintProduto();
    });

    input.addEventListener("keydown", (e) => {
        const items = itensFiltradosOnly();
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!combo.aberto) { atualizar(); abrirCombobox(); }
            combo.indiceAtivo = Math.min(items.length - 1, combo.indiceAtivo + 1);
            renderListaCombobox();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            combo.indiceAtivo = Math.max(0, combo.indiceAtivo - 1);
            renderListaCombobox();
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (combo.aberto && items[combo.indiceAtivo]) {
                selecionarProduto(items[combo.indiceAtivo].produtoIdx);
            } else if (combo.selecionado != null) {
                adicionarItem();
            }
        } else if (e.key === "Escape") {
            fecharCombobox();
        }
    });

    toggle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (combo.aberto) { fecharCombobox(); }
        else { atualizar(); abrirCombobox(); input.focus(); }
    });

    ul.addEventListener("mousedown", (e) => {
        const li = e.target.closest(".combo-item");
        if (!li) return;
        e.preventDefault();
        const idx = parseInt(li.dataset.produtoIdx, 10);
        selecionarProduto(idx);
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest("#combobox")) fecharCombobox();
    });
}

// ============ RECENTES ============
function renderRecentes() {
    const wrap = $("recentes-wrap");
    const chips = $("recentes-chips");
    if (estado.recentes.length === 0) {
        wrap.hidden = true;
        return;
    }
    wrap.hidden = false;
    chips.innerHTML = estado.recentes.map(nome => {
        const idx = indiceProduto(nome);
        if (idx < 0) return "";
        return `
            <button type="button" class="chip-recente" data-recente-idx="${idx}" role="listitem"
                    aria-label="Selecionar ${escapeHtml(nome)}">
                <span class="star" aria-hidden="true">★</span>
                <span>${escapeHtml(nome)}</span>
            </button>
        `;
    }).join("");
}

// ============ ITEM (CRUD) ============
function adicionarItem() {
    if (combo.selecionado == null) {
        const termo = semAcento($("produto-busca").value.trim());
        if (termo) {
            const match = PRODUTOS.findIndex(p => semAcento(p.nome) === termo);
            if (match >= 0) combo.selecionado = match;
        }
    }
    if (combo.selecionado == null) {
        $("produto-hint").textContent = "Escolha um produto da lista, forasteiro.";
        $("produto-busca").focus();
        return;
    }
    const qtd = Math.max(1, Math.floor(parseFloat($("qtd-input").value) || 1));
    const p = PRODUTOS[combo.selecionado];

    const existente = estado.itens.find(it => it.produtoId === p.nome);
    if (existente) {
        existente.quantidade += qtd;
    } else {
        estado.itens.push({
            produtoId: p.nome,
            quantidade: qtd,
            precoUnit: p.max,
        });
    }
    if (!estado.numeroNota) {
        estado.numeroNota = gerarNumeroNota();
    }
    registrarRecente(p.nome);

    $("qtd-input").value = "";
    $("produto-busca").value = "";
    combo.selecionado = null;
    $("produto-hint").textContent = "";
    $("produto-busca").focus();
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
    item.precoUnit = Math.round(v * 100) / 100;
    item._aviso = (Math.abs(original - v) > 0.001);
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
                <div class="item-row" role="group" aria-label="${escapeHtml(p.nome)}" title="${escapeHtml(p.nome)} — min ${fmt(p.min)} · máx ${fmt(p.max)}">
                    <div class="nome">${escapeHtml(p.nome)}</div>
                    <div class="col-qtd">
                        <input type="number" id="qtd-${idx}" min="1" step="1" value="${it.quantidade}"
                            inputmode="numeric" data-acao="qtd" data-idx="${idx}"
                            aria-label="Quantidade de ${escapeHtml(p.nome)}">
                    </div>
                    <div class="col-preco">
                        <input type="number" id="preco-${idx}" min="${p.min}" max="${p.max}" step="0.01"
                            value="${it.precoUnit.toFixed(2)}" inputmode="decimal"
                            class="${warnClass}"
                            data-acao="preco" data-idx="${idx}"
                            aria-label="Preço unitário de ${escapeHtml(p.nome)}">
                    </div>
                    <div class="col-slider">
                        <span class="preco-meta-min">${fmt(p.min)}</span>
                        <input type="range" class="preco-slider" min="${p.min}" max="${p.max}" step="0.01"
                            value="${it.precoUnit.toFixed(2)}"
                            aria-label="Ajustar preço de ${escapeHtml(p.nome)}"
                            data-acao="preco-slider" data-idx="${idx}">
                        <span class="preco-meta-max">${fmt(p.max)}</span>
                    </div>
                    <div class="subtotal">${fmt(sub)}</div>
                    <button class="btn-remover" data-acao="remover" data-idx="${idx}"
                            title="Remover ${escapeHtml(p.nome)}" aria-label="Remover ${escapeHtml(p.nome)}">✕</button>
                </div>
            `;
        }).join("");
    }

    const t = calcTotais();
    $("subtotal-val").textContent = fmt(t.subtotal);
    $("total-val").textContent = fmt(t.total);
    $("fs-valor").textContent = fmt(t.total);

    const descInput = $("desconto-input");
    if (document.activeElement !== descInput) {
        descInput.value = t.descAplicado.toFixed(t.descAplicado % 1 === 0 ? 0 : 2);
    }
    $("desconto-hint").textContent =
        estado.itens.length > 0 ? `máx permitido: ${t.descMaxPct.toFixed(2)}%` : "";

    const aviso = $("aviso-desconto");
    if (t.descClampado) {
        aviso.textContent = `Desconto reduzido para ${t.descMaxPct.toFixed(2)}% — limite do contrato com a fazenda.`;
    } else {
        aviso.textContent = "";
    }

    renderRecentes();
    atualizarFloatingSummary(t);
}

// ============ FLOATING SUMMARY ============
let floatingObserver = null;
function inicializarFloatingSummary() {
    const totaisEl = $("totais-section");
    const fs = $("floating-summary");

    if (!('IntersectionObserver' in window)) return;

    floatingObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            const visivel = !entry.isIntersecting && estado.itens.length > 0;
            fs.dataset.visible = visivel ? "true" : "false";
            fs.hidden = !visivel;
            fs.setAttribute("aria-hidden", visivel ? "false" : "true");
        }
    }, { threshold: 0.05 });
    floatingObserver.observe(totaisEl);

    $("fs-copiar").addEventListener("click", copiarParaDiscord);
}

function atualizarFloatingSummary(t) {
    const fs = $("floating-summary");
    // Se o pedido está vazio, esconde
    if (estado.itens.length === 0) {
        fs.dataset.visible = "false";
        fs.hidden = true;
        fs.setAttribute("aria-hidden", "true");
    }
}

async function copiarParaDiscord() {
    const texto = gerarTextoDiscord();
    const feedback = $("copy-feedback");
    feedback.innerHTML = "";
    try {
        await navigator.clipboard.writeText(texto);
        feedback.textContent = "✓ Orçamento copiado! Cole no Discord (Ctrl+V).";
    } catch {
        const ta = document.createElement("textarea");
        ta.value = texto;
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand("copy");
            feedback.textContent = "✓ Orçamento copiado! Cole no Discord (Ctrl+V).";
        } catch {
            feedback.textContent = "Não foi possível copiar automaticamente. Copie manualmente abaixo:";
            const pre = document.createElement("pre");
            pre.textContent = texto;
            pre.style.cssText = "background:#1c1408;padding:12px;margin-top:10px;text-align:left;white-space:pre;overflow:auto;border:1px solid #b8923a;color:#ead7a4;font-family:'Special Elite',monospace;";
            feedback.appendChild(pre);
        }
        document.body.removeChild(ta);
    }
    setTimeout(() => {
        if (feedback.children.length === 0) feedback.textContent = "";
    }, 4500);
}

function limparPedido() {
    if (estado.itens.length === 0 && !estado.cliente) return;
    if (!confirm("Tem certeza que deseja limpar todo o pedido, forasteiro?")) return;
    estado.itens = [];
    estado.descontoPercent = 0;
    estado.numeroNota = null;
    estado.cliente = "";
    const cliInput = $("cliente-input");
    if (cliInput) cliInput.value = "";
    salvar();
    render();
}

// ============ NOTA FISCAL ============
const MESES_PT = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function gerarNumeroNota() {
    // 4 dígitos pseudo-aleatórios baseados em ms — visualmente "sequencial"
    const n = (Date.now() % 9000) + 1000;
    return String(n).padStart(4, "0");
}

function dataNota() {
    const h = new Date();
    const dia = h.getDate();
    const mes = MESES_PT[h.getMonth()];
    const hh = String(h.getHours()).padStart(2, "0");
    const mm = String(h.getMinutes()).padStart(2, "0");
    return { dia, mes, hh, mm, texto: `${String(dia).padStart(2,"0")} de ${mes} de 1900` };
}

// Centraliza texto numa largura dada (sem contar bordas)
function centralizar(txt, largura) {
    const sobra = largura - txt.length;
    if (sobra <= 0) return txt.slice(0, largura);
    const esq = Math.floor(sobra / 2);
    const dir = sobra - esq;
    return " ".repeat(esq) + txt + " ".repeat(dir);
}

function truncar(txt, max) {
    return txt.length <= max ? txt : txt.slice(0, max - 1) + "…";
}

function gerarNotaFiscal() {
    const t = calcTotais();
    const data = dataNota();
    const numero = estado.numeroNota || "----";
    const cliente = (estado.cliente || "").trim();

    const W = 62;
    const COL_NOME = 28, COL_QTD = 6, COL_UNIT = 8, COL_SUB = 10;

    const center = (txt) => centralizar(txt, W);

    // "  PRODUTO ... QTD ... UNIT. ... SUBTOTAL"
    const itemFmt = (nome, qtd, unit, sub) =>
        "  " +
        nome.padEnd(COL_NOME, " ") + "  " +
        String(qtd).padStart(COL_QTD, " ") + "  " +
        unit.padStart(COL_UNIT, " ") + "  " +
        sub.padStart(COL_SUB, " ");

    // Label à direita, valor numa coluna fixa de 12 chars no final
    const linhaTotal = (label, valor) => {
        const valStr = valor.padStart(12);
        const lblStr = label.padStart(W - 12);
        return lblStr + valStr;
    };

    const totalItens = estado.itens.length;
    const totalUnidades = estado.itens.reduce((s, it) => s + it.quantidade, 0);

    const out = [];
    out.push("```");

    // ===== CABEÇALHO =====
    out.push(center("ROCKEFELLER PRODUTOS AGROPECUÁRIOS S.A."));
    out.push(center("Flatneck Station · New Hanover · Westfox"));
    out.push(center("─".repeat(46)));
    out.push("");
    out.push(center(`NOTA DE ORÇAMENTO  Nº ${numero}`));
    out.push(center(`${data.texto}  —  ${data.hh}:${data.mm}`));
    out.push("");

    // ===== CLIENTE =====
    if (cliente) {
        out.push(`  Cliente:  ${truncar(cliente, W - 12)}`);
        out.push("");
    }

    // ===== ITENS =====
    if (estado.itens.length === 0) {
        out.push(center("( Nenhum item lançado )"));
        out.push("```");
        return out.join("\n");
    }

    out.push(itemFmt("PRODUTO", "QTD", "UNIT.", "SUBTOTAL"));
    out.push("  " + "─".repeat(W - 4));

    for (const it of estado.itens) {
        const nome = truncar(it.produtoId, COL_NOME);
        const sub = it.precoUnit * it.quantidade;
        out.push(itemFmt(nome, it.quantidade, fmt(it.precoUnit), fmt(sub)));
    }

    out.push("  " + "─".repeat(W - 4));
    out.push(center(`Itens: ${totalItens}  ·  Unidades: ${totalUnidades}`));
    out.push("");

    // ===== TOTAIS =====
    out.push(linhaTotal("SUBTOTAL:", fmt(t.subtotal)));
    if (t.descAplicado > 0) {
        const valorDesc = t.subtotal - t.total;
        out.push(linhaTotal(`DESCONTO (${t.descAplicado.toFixed(2)}%):`, "-" + fmt(valorDesc)));
    }
    out.push(" ".repeat(W - 30) + "─".repeat(30));
    out.push(linhaTotal("TOTAL A PAGAR:", fmt(t.total)));
    out.push("");
    out.push("");

    // ===== ASSINATURAS =====
    out.push("  Atendido por: ____________________________");
    out.push("  Assinatura:   ____________________________");
    out.push("");
    out.push(center("✦  Tradição · Trabalho · Visão · Legado  ✦"));
    out.push(center("Rockefeller Produtos Agropecuários S.A."));
    out.push("```");

    return out.join("\n");
}

function gerarTextoDiscord() {
    return gerarNotaFiscal();
}

// ============ INIT ============
function init() {
    inicializarCombobox();
    inicializarFloatingSummary();

    $("add-btn").addEventListener("click", adicionarItem);

    // Enter na qtd adiciona
    $("qtd-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); adicionarItem(); }
    });

    // Quantidade rápida
    document.querySelectorAll(".chip-qtd").forEach(btn => {
        btn.addEventListener("click", () => {
            const incremento = parseInt(btn.dataset.add, 10);
            const atual = Math.max(0, Math.floor(parseFloat($("qtd-input").value) || 0));
            $("qtd-input").value = Math.max(1, atual + incremento);
            $("qtd-input").focus();
        });
    });

    // Recentes (delegação)
    $("recentes-chips").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-recente-idx]");
        if (!btn) return;
        selecionarProduto(parseInt(btn.dataset.recenteIdx, 10));
    });

    // Lista de itens (delegação: input number + range + remover)
    const lista = $("itens-lista");
    lista.addEventListener("input", (e) => {
        const t = e.target;
        const acao = t.dataset.acao;
        const idx = parseInt(t.dataset.idx, 10);
        if (acao === "qtd") atualizarQtd(idx, t.value);
        else if (acao === "preco") atualizarPreco(idx, t.value);
        else if (acao === "preco-slider") atualizarPreco(idx, t.value);
    });
    lista.addEventListener("click", (e) => {
        const t = e.target.closest("[data-acao='remover']");
        if (!t) return;
        removerItem(parseInt(t.dataset.idx, 10));
    });

    // Desconto
    $("desconto-input").addEventListener("input", (e) => {
        const v = parseFloat(e.target.value);
        estado.descontoPercent = isNaN(v) ? 0 : v;
        salvar();
        render();
    });

    $("copiar-btn").addEventListener("click", copiarParaDiscord);
    $("limpar-btn").addEventListener("click", limparPedido);

    // Cliente
    const cliInput = $("cliente-input");
    cliInput.value = estado.cliente || "";
    cliInput.addEventListener("input", (e) => {
        estado.cliente = e.target.value;
        salvar();
    });

    // Atalho global "/" para focar busca
    document.addEventListener("keydown", (e) => {
        if (e.key !== "/") return;
        const ae = document.activeElement;
        if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable)) return;
        e.preventDefault();
        const input = $("produto-busca");
        input.focus();
        input.select();
    });

    render();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

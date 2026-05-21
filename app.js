/* ====== Livro de Orçamento — Família Rockefeller ======
   Calculadora estática, 100% client-side.
   Depende de: produtos.js (catálogo + helpers) e nota.js (cálculos + nota fiscal). */

const STORAGE_KEY = "fazenda-rockefeller-pedido-v2";
const MAX_RECENTES = 6;

const estado = carregar() || {
    itens: [],
    descontoPercent: 0,
    recentes: [],
    numeroNota: null,
    cliente: "",
    anotacoes: "",
};
if (!Array.isArray(estado.recentes)) estado.recentes = [];
if (typeof estado.numeroNota === "undefined") estado.numeroNota = null;
if (typeof estado.cliente !== "string") estado.cliente = "";
if (typeof estado.anotacoes !== "string") estado.anotacoes = "";

// ============ HISTÓRICO ============
const HISTORICO_KEY = "fazenda-rockefeller-historico-v1";

function carregarHistorico() {
    try {
        const raw = localStorage.getItem(HISTORICO_KEY);
        if (!raw) return [];
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
    } catch { return []; }
}

function salvarHistorico() {
    try { localStorage.setItem(HISTORICO_KEY, JSON.stringify(historico)); } catch {}
}

let historico = carregarHistorico();

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
                data-produto-idx="${row.produtoIdx}">
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

    const t = calcTotais(estado);
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

    // Subtotais por categoria
    const catInfo = $("categorias-info");
    if (estado.itens.length >= 2) {
        const grupos = subtotaisPorCategoria(estado);
        const partes = Object.entries(grupos)
            .sort((a, b) => b[1] - a[1])
            .map(([nome, val]) =>
                `<span class="cat"><span class="cat-nome">${escapeHtml(nome.split(",")[0].split("&")[0].trim())}:</span><span class="cat-val">${fmt(val)}</span></span>`
            );
        catInfo.innerHTML = partes.join(" · ");
    } else {
        catInfo.innerHTML = "";
    }

    // Margem do contrato: quanto sobra acima do mínimo + quanto de
    // desconto ainda cabe sem violar o piso.
    const margemInfo = $("margem-info");
    if (estado.itens.length > 0 && t.minTotal > 0) {
        const sinal = t.margem > 0 ? "+" : "";
        const folga = t.margemPct < 0.05
            ? "sem folga restante"
            : `cabem ainda ${t.margemPct.toFixed(1)}% de desconto`;
        margemInfo.innerHTML = `Margem do contrato: <span class="pct">${sinal}${fmt(t.margem)}</span> · ${folga}`;
    } else {
        margemInfo.innerHTML = "";
    }

    renderRecentes();
    renderHistorico();
    atualizarFloatingSummary();
}

// ============ FLOATING SUMMARY ============
function inicializarFloatingSummary() {
    const totaisEl = $("totais-section");
    const fs = $("floating-summary");

    if (!('IntersectionObserver' in window)) return;

    new IntersectionObserver((entries) => {
        for (const entry of entries) {
            const visivel = !entry.isIntersecting && estado.itens.length > 0;
            fs.dataset.visible = visivel ? "true" : "false";
            fs.hidden = !visivel;
            fs.setAttribute("aria-hidden", visivel ? "false" : "true");
        }
    }, { threshold: 0.05 }).observe(totaisEl);

    $("fs-copiar").addEventListener("click", copiarParaDiscord);
}

function atualizarFloatingSummary() {
    // Força esconder quando o pedido está vazio (o IntersectionObserver
    // não dispara só por mudança de estado, então este é o sinal direto).
    if (estado.itens.length === 0) {
        const fs = $("floating-summary");
        fs.dataset.visible = "false";
        fs.hidden = true;
        fs.setAttribute("aria-hidden", "true");
    }
}

async function copiarParaDiscord() {
    const texto = gerarNotaFiscal(estado);
    const feedback = $("copy-feedback");
    feedback.innerHTML = "";
    adicionarAoHistorico();
    try {
        await navigator.clipboard.writeText(texto);
        feedback.textContent = "✓ Orçamento copiado e salvo no histórico! Cole no Discord (Ctrl+V).";
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
    if (estado.itens.length === 0 && !estado.cliente && !estado.anotacoes) return;
    if (!confirm("Tem certeza que deseja limpar todo o pedido, forasteiro?")) return;
    estado.itens = [];
    estado.descontoPercent = 0;
    estado.numeroNota = null;
    estado.cliente = "";
    estado.anotacoes = "";
    const cliInput = $("cliente-input");
    if (cliInput) cliInput.value = "";
    const anotInput = $("anotacoes-input");
    if (anotInput) anotInput.value = "";
    salvar();
    render();
}

// ============ HISTÓRICO ============
function adicionarAoHistorico() {
    if (estado.itens.length === 0) return;
    const t = calcTotais(estado);
    const entry = {
        numero: estado.numeroNota,
        cliente: estado.cliente,
        anotacoes: estado.anotacoes,
        itens: estado.itens.map(it => ({ ...it })),
        descontoPercent: estado.descontoPercent,
        total: t.total,
        salvoEm: Date.now(),
    };
    historico = [entry, ...historico.filter(h => h.numero !== entry.numero)].slice(0, 20);
    salvarHistorico();
    renderHistorico();
}

function carregarDoHistorico(idx) {
    const h = historico[idx];
    if (!h) return;
    if (estado.itens.length > 0 && !confirm("Carregar esta nota substitui o pedido atual. Continuar?")) return;
    estado.itens = h.itens.map(it => ({ ...it }));
    estado.descontoPercent = h.descontoPercent || 0;
    estado.cliente = h.cliente || "";
    estado.anotacoes = h.anotacoes || "";
    estado.numeroNota = h.numero;
    $("cliente-input").value = estado.cliente;
    $("anotacoes-input").value = estado.anotacoes;
    salvar();
    render();
    document.getElementById("itens-lista")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function removerDoHistorico(idx) {
    if (!confirm("Remover este orçamento do histórico?")) return;
    historico.splice(idx, 1);
    salvarHistorico();
    renderHistorico();
}

function renderHistorico() {
    const lista = $("historico-lista");
    const vazio = $("historico-vazio");
    if (historico.length === 0) {
        vazio.hidden = false;
        lista.hidden = true;
        lista.innerHTML = "";
        return;
    }
    vazio.hidden = true;
    lista.hidden = false;
    lista.innerHTML = historico.map((h, i) => {
        const d = new Date(h.salvoEm);
        const data = `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
        const cli = (h.cliente && h.cliente.trim()) ? escapeHtml(h.cliente) : "<em>sem cliente</em>";
        return `
            <li class="historico-row">
                <button class="historico-load" data-hist-idx="${i}" type="button"
                        title="Carregar este pedido (substitui o atual)">
                    <span class="h-num">Nº ${escapeHtml(String(h.numero || "----"))}</span>
                    <span class="h-cli">${cli}</span>
                    <span class="h-data">${data}</span>
                    <span class="h-total">${fmt(h.total)}</span>
                </button>
                <button class="historico-del" data-hist-del="${i}" type="button"
                        aria-label="Remover do histórico">✕</button>
            </li>
        `;
    }).join("");
}

// ============ URL SHARE (calculadora gera link pra view-only) ============
function urlBase() {
    // Pega o diretório do documento atual, funciona em http(s)://, file://
    // e qualquer preview server. Strip de query/hash + remove o filename.
    return location.href.split("#")[0].split("?")[0].replace(/[^/]*$/, "");
}

function gerarUrlPedido() {
    const b64 = encodePedidoTuple(estado);
    return `${urlBase()}pedido.html#p=${b64}`;
}

function carregarDeUrl() {
    if (!location.hash.startsWith("#p=")) return false;
    const decoded = decodePedidoBase64(location.hash.slice(3));
    if (!decoded) return false;
    if (estado.itens.length > 0 &&
        !confirm("Há um pedido neste link. Carregar substitui o pedido atual. Continuar?")) {
        history.replaceState(null, "", location.pathname);
        return false;
    }
    estado.itens = decoded.itens;
    estado.descontoPercent = decoded.descontoPercent;
    estado.cliente = decoded.cliente;
    estado.anotacoes = decoded.anotacoes;
    estado.numeroNota = decoded.numeroNota || gerarNumeroNota();
    history.replaceState(null, "", location.pathname);
    salvar();
    return true;
}

async function copiarLink() {
    const feedback = $("copy-feedback");
    feedback.innerHTML = "";

    if (estado.itens.length === 0) {
        feedback.textContent = "Adicione itens antes de gerar o link.";
        setTimeout(() => { feedback.textContent = ""; }, 3500);
        return;
    }

    const url = gerarUrlPedido();
    console.log("[link] URL gerada:", url);

    const copiouNoClip = await tentarCopiarClipboard(url);
    if (copiouNoClip) {
        feedback.innerHTML = `✓ Link copiado! Cole no Discord — <a href="${escapeHtml(url)}" target="_blank" rel="noopener" style="color:var(--ouro-vivo);text-decoration:underline;">testar agora</a>`;
    } else {
        // Mostra link clicável + URL legível pra cópia manual
        feedback.innerHTML = `
            Não consegui copiar automaticamente.
            <a href="${escapeHtml(url)}" target="_blank" rel="noopener" style="color:var(--ouro-vivo);text-decoration:underline;">Abrir o link</a>
            ou selecione abaixo:
            <textarea readonly style="width:100%;margin-top:6px;padding:6px;font-family:'Special Elite',monospace;font-size:12px;background:rgba(0,0,0,0.25);color:var(--ouro-claro);border:1px solid var(--ouro-medio);" onclick="this.select()">${escapeHtml(url)}</textarea>
        `;
    }

    setTimeout(() => {
        // Limpa apenas se ainda for o feedback de sucesso (sem children complexos)
        if (feedback.querySelector("textarea")) return;
        feedback.innerHTML = "";
    }, 8000);
}

async function tentarCopiarClipboard(texto) {
    // Caminho 1: API moderna (HTTPS / localhost / file:// recente)
    if (navigator.clipboard && window.isSecureContext !== false) {
        try {
            await navigator.clipboard.writeText(texto);
            return true;
        } catch (err) {
            console.warn("[clipboard] navigator.clipboard falhou:", err);
        }
    }
    // Caminho 2: fallback execCommand via textarea oculto
    try {
        const ta = document.createElement("textarea");
        ta.value = texto;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:absolute;left:-9999px;top:0;opacity:0;";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
    } catch (err) {
        console.warn("[clipboard] execCommand falhou:", err);
        return false;
    }
}

// ============ INIT ============
function init() {
    carregarDeUrl();

    inicializarCombobox();
    inicializarFloatingSummary();

    $("add-btn").addEventListener("click", adicionarItem);

    $("qtd-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); adicionarItem(); }
    });

    document.querySelectorAll(".chip-qtd").forEach(btn => {
        btn.addEventListener("click", () => {
            const incremento = parseInt(btn.dataset.add, 10);
            const atual = Math.max(0, Math.floor(parseFloat($("qtd-input").value) || 0));
            $("qtd-input").value = Math.max(1, atual + incremento);
            $("qtd-input").focus();
        });
    });

    $("recentes-chips").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-recente-idx]");
        if (!btn) return;
        selecionarProduto(parseInt(btn.dataset.recenteIdx, 10));
    });

    const lista = $("itens-lista");
    lista.addEventListener("input", (e) => {
        const t = e.target;
        const acao = t.dataset.acao;
        const idx = parseInt(t.dataset.idx, 10);
        if (acao === "qtd") atualizarQtd(idx, t.value);
        else if (acao === "preco" || acao === "preco-slider") atualizarPreco(idx, t.value);
    });
    lista.addEventListener("click", (e) => {
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
    $("link-btn").addEventListener("click", copiarLink);

    const cliInput = $("cliente-input");
    cliInput.value = estado.cliente || "";
    cliInput.addEventListener("input", (e) => {
        estado.cliente = e.target.value;
        salvar();
    });

    const anotInput = $("anotacoes-input");
    anotInput.value = estado.anotacoes || "";
    anotInput.addEventListener("input", (e) => {
        estado.anotacoes = e.target.value;
        salvar();
    });

    $("historico-lista").addEventListener("click", (e) => {
        const del = e.target.closest("[data-hist-del]");
        if (del) {
            removerDoHistorico(parseInt(del.dataset.histDel, 10));
            return;
        }
        const load = e.target.closest("[data-hist-idx]");
        if (load) {
            carregarDoHistorico(parseInt(load.dataset.histIdx, 10));
        }
    });

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

/* ====== Geração de nota fiscal + URL share ======
   Funções puras compartilhadas entre a calculadora e o viewer.
   Depende de produtos.js (PRODUTOS, indiceProduto, fmt, etc.) */

const MESES_PT = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function gerarNumeroNota() {
    // 4 dígitos pseudo-sequenciais baseados no relógio
    return String((Date.now() % 9000) + 1000).padStart(4, "0");
}

function dataNotaTexto(timestampMs) {
    const h = timestampMs ? new Date(timestampMs) : new Date();
    const dia = String(h.getDate()).padStart(2, "0");
    const mes = MESES_PT[h.getMonth()];
    const hh = String(h.getHours()).padStart(2, "0");
    const mm = String(h.getMinutes()).padStart(2, "0");
    return { hh, mm, texto: `${dia} de ${mes} de 1900` };
}

function calcTotais(state) {
    let subtotal = 0;
    let minTotal = 0;
    for (const it of state.itens) {
        subtotal += it.precoUnit * it.quantidade;
        const p = PRODUTOS[indiceProduto(it.produtoId)];
        if (!p) continue;
        minTotal += p.min * it.quantidade;
    }
    let descMaxPct = 100;
    if (subtotal > 0) {
        descMaxPct = Math.max(0, (1 - minTotal / subtotal) * 100);
    }
    let descAplicado = state.descontoPercent || 0;
    let descClampado = false;
    if (descAplicado > descMaxPct) { descAplicado = descMaxPct; descClampado = true; }
    if (descAplicado < 0) descAplicado = 0;
    const total = subtotal * (1 - descAplicado / 100);
    const margem = total - minTotal;
    // Margem como % do total = "folga ainda disponível para desconto".
    // Consistente com descMaxPct (calculado sobre o subtotal): quando
    // o desconto está em 0, ambos batem; à medida que o desconto sobe,
    // a folga (margemPct sobre total atual) diminui.
    const margemPct = total > 0 ? (margem / total) * 100 : 0;
    return { subtotal, minTotal, descMaxPct, descAplicado, descClampado, total, margem, margemPct };
}

function subtotaisPorCategoria(state) {
    const grupos = {};
    for (const it of state.itens) {
        const p = PRODUTOS[indiceProduto(it.produtoId)];
        if (!p) continue;
        const sub = it.precoUnit * it.quantidade;
        grupos[p.categoria] = (grupos[p.categoria] || 0) + sub;
    }
    return grupos;
}

function centralizar(txt, largura) {
    const sobra = largura - txt.length;
    if (sobra <= 0) return txt.slice(0, largura);
    const esq = Math.floor(sobra / 2);
    return " ".repeat(esq) + txt + " ".repeat(sobra - esq);
}

function truncar(txt, max) {
    return txt.length <= max ? txt : txt.slice(0, max - 1) + "…";
}

function gerarNotaFiscal(state) {
    const t = calcTotais(state);
    const data = dataNotaTexto();
    const numero = state.numeroNota || "----";
    const cliente = (state.cliente || "").trim();
    const anot = (state.anotacoes || "").trim();

    const W = 62;
    const COL_NOME = 28, COL_QTD = 6, COL_UNIT = 8, COL_SUB = 10;

    const center = (txt) => centralizar(txt, W);

    const itemFmt = (nome, qtd, unit, sub) =>
        "  " +
        nome.padEnd(COL_NOME, " ") + "  " +
        String(qtd).padStart(COL_QTD, " ") + "  " +
        unit.padStart(COL_UNIT, " ") + "  " +
        sub.padStart(COL_SUB, " ");

    const linhaTotal = (label, valor) => {
        const valStr = valor.padStart(12);
        const lblStr = label.padStart(W - 12);
        return lblStr + valStr;
    };

    const totalItens = state.itens.length;
    const totalUnidades = state.itens.reduce((s, it) => s + it.quantidade, 0);

    const out = ["```"];
    out.push(center("ROCKEFELLER PRODUTOS AGROPECUÁRIOS S.A."));
    out.push(center("Flatneck Station · New Hanover · Westfox"));
    out.push(center("─".repeat(46)));
    out.push("");
    out.push(center(`NOTA DE ORÇAMENTO  Nº ${numero}`));
    out.push(center(`${data.texto}  —  ${data.hh}:${data.mm}`));
    out.push("");

    if (cliente) {
        out.push(`  Cliente:  ${truncar(cliente, W - 12)}`);
        out.push("");
    }

    if (state.itens.length === 0) {
        out.push(center("( Nenhum item lançado )"));
        out.push("```");
        return out.join("\n");
    }

    out.push(itemFmt("PRODUTO", "QTD", "UNIT.", "SUBTOTAL"));
    out.push("  " + "─".repeat(W - 4));
    for (const it of state.itens) {
        const nome = truncar(it.produtoId, COL_NOME);
        const sub = it.precoUnit * it.quantidade;
        out.push(itemFmt(nome, it.quantidade, fmt(it.precoUnit), fmt(sub)));
    }
    out.push("  " + "─".repeat(W - 4));
    out.push(center(`Itens: ${totalItens}  ·  Unidades: ${totalUnidades}`));
    out.push("");

    out.push(linhaTotal("SUBTOTAL:", fmt(t.subtotal)));
    if (t.descAplicado > 0) {
        const valorDesc = t.subtotal - t.total;
        out.push(linhaTotal(`DESCONTO (${t.descAplicado.toFixed(2)}%):`, "-" + fmt(valorDesc)));
    }
    out.push(" ".repeat(W - 30) + "─".repeat(30));
    out.push(linhaTotal("TOTAL A PAGAR:", fmt(t.total)));
    out.push("");
    out.push("");

    if (anot) {
        out.push("  Observações:");
        const palavras = anot.split(/\s+/);
        let linha = "";
        const linhas = [];
        const maxLen = W - 4;
        for (const w of palavras) {
            if ((linha + " " + w).trim().length > maxLen) {
                if (linha) linhas.push(linha);
                linha = w;
            } else {
                linha = (linha + " " + w).trim();
            }
        }
        if (linha) linhas.push(linha);
        for (const l of linhas) out.push("    " + l);
        out.push("");
    }

    out.push("  Atendido por: ____________________________");
    out.push("  Assinatura:   ____________________________");
    out.push("");
    out.push(center("✦  Tradição · Trabalho · Visão · Legado  ✦"));
    out.push(center("Rockefeller Produtos Agropecuários S.A."));
    out.push("```");

    return out.join("\n");
}

// ============ URL SHARE ============
// Formato compacto (tupla posicional):
//   [ itens, descontoPercent, cliente, anotacoes, numeroNota ]
// onde itens = [[produtoIdx, quantidade, precoCents], ...]
//
// Codificado em base64url (sem '+/=' pra ser amigável a URL).

function encodePedidoTuple(state) {
    const tuple = [
        state.itens.map(it => [
            indiceProduto(it.produtoId),
            it.quantidade,
            Math.round(it.precoUnit * 100),
        ]),
        Math.round((state.descontoPercent || 0) * 100) / 100,
        state.cliente || "",
        state.anotacoes || "",
        state.numeroNota || "",
    ];
    const json = JSON.stringify(tuple);
    return btoa(unescape(encodeURIComponent(json)))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodePedidoBase64(b64) {
    try {
        let s = b64.replace(/-/g, "+").replace(/_/g, "/");
        while (s.length % 4) s += "=";
        const json = decodeURIComponent(escape(atob(s)));
        const parsed = JSON.parse(json);

        // Formato novo (tupla)
        if (Array.isArray(parsed)) {
            const [itens, d, c, a, n] = parsed;
            return {
                itens: (itens || []).map(arr => {
                    const [first, qtd, third] = arr;
                    if (typeof first === "number") {
                        const p = PRODUTOS[first];
                        if (!p) return null;
                        return { produtoId: p.nome, quantidade: qtd, precoUnit: third / 100 };
                    }
                    // Fallback: nome no primeiro slot, preço já em float
                    return { produtoId: first, quantidade: qtd, precoUnit: third };
                }).filter(Boolean),
                descontoPercent: d || 0,
                cliente: c || "",
                anotacoes: a || "",
                numeroNota: n || "",
            };
        }
        // Formato legado (objeto {i, d, c, a, n})
        if (parsed && parsed.i) {
            return {
                itens: parsed.i.map(([p, q, u]) => ({ produtoId: p, quantidade: q, precoUnit: u })),
                descontoPercent: parsed.d || 0,
                cliente: parsed.c || "",
                anotacoes: parsed.a || "",
                numeroNota: parsed.n || "",
            };
        }
        return null;
    } catch {
        return null;
    }
}

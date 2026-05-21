# 🛠 Plano de Refatoração e Melhorias

Backlog estruturado de issues e sub-issues para o projeto. Cada `##` é uma issue principal e cada `###` aninhado é uma sub-issue (filha).

> Como criar no GitHub: cada bloco já está pronto para copiar em **Title** + **Body**. Quando o `gh` CLI estiver instalado, dá pra usar `gh issue create --title "..." --body-file ...` em lote.

**Legenda de prioridade:** 🔴 alta · 🟡 média · 🟢 baixa
**Legenda de esforço:** ⏱ <1h · ⏱⏱ 1-3h · ⏱⏱⏱ 3-8h

---

## Sumário

| # | Categoria | Título | Prio | Esforço |
|---|---|---|---|---|
| 1 | refac | Aplicar lint estático (ESLint + Stylelint) | 🟢 | ⏱⏱ |
| 2 | refac | Render incremental do `itens-lista` | 🟡 | ⏱⏱⏱ |
| 3 | refac | Debounce em inputs de texto livre | 🟢 | ⏱ |
| 4 | ui | Slider mostrar valor flutuante (bubble) | 🟡 | ⏱⏱ |
| 5 | ui | Touch targets WCAG AA (44×44) | 🟡 | ⏱ |
| 6 | ui | Breakpoint intermediário tablet (760-980) | 🟢 | ⏱ |
| 7 | ui | Tooltip custom (não-nativo) para nomes truncados | 🟢 | ⏱⏱ |
| 8 | ux | Undo de remoção de item (toast 5s) | 🟡 | ⏱⏱ |
| 9 | ux | Histórico com busca e ação "duplicar" | 🟡 | ⏱⏱ |
| 10 | ux | Pin manual de favoritos (★) | 🟢 | ⏱⏱ |
| 11 | ux | Substituir `confirm()` por modal temático | 🟢 | ⏱⏱ |
| 12 | ux | Atalhos globais ampliados (Ctrl+C, Ctrl+L…) | 🟢 | ⏱ |
| 13 | ux | Export adicional: CSV, JSON e print stylesheet | 🟢 | ⏱⏱ |
| 14 | a11y | Contraste WCAG AA em metas/hints | 🔴 | ⏱ |
| 15 | a11y | `aria-valuetext` nos sliders | 🟡 | ⏱ |
| 16 | a11y | `aria-live` granular em vez de re-render total | 🟡 | ⏱⏱ |
| 17 | a11y | Ícone ⚠ em `preco-warning` (não depender só de cor) | 🔴 | ⏱ |
| 18 | a11y | Mover foco para floating summary quando aparece | 🟢 | ⏱ |
| 19 | feat | PWA installable (manifest + service worker) | 🟢 | ⏱⏱ |

---

## #1 — chore: aplicar lint estático no projeto 🟢

**Body:**
Hoje não há nenhum lint configurado. Adicionar ESLint (config `recommended` + regra `no-unused-vars`) e Stylelint pra apanhar regularmente sobras como as que foram removidas neste último commit (`orn-divider` órfão, classes CSS sem uso, parâmetros não lidos).

Como é projeto estático sem build, o lint roda direto pela linha de comando (`npx eslint app.js` / `npx stylelint style.css`). Não precisa CI inicialmente — basta rodar antes de cada deploy.

**Critério de aceite:**
- `npx eslint app.js` roda sem erro
- `npx stylelint style.css` roda sem erro
- `package.json` com scripts `lint:js` e `lint:css`

---

## #2 — refac: render incremental do `itens-lista` 🟡

**Body:**
Atualmente toda mudança em qualquer input do pedido (qtd, preço, slider) chama `render()` que faz `innerHTML = ...` do `<div id="itens-lista">` inteiro. Isso causa:

- Perda de foco em campos sendo editados em pedidos longos
- Anúncio repetido pelo screen reader (relacionado a #16)
- Trabalho desnecessário em pedidos com 20+ linhas

Refatorar pra atualização cirúrgica: cada linha de item vira um elemento que é reaproveitado entre renders; só campos derivados (subtotal, totais) são atualizados.

**Critério de aceite:**
- Editar o preço de um item não re-cria o `<input>` (foco preservado)
- DevTools Performance mostra ≤ 1 ms por keystroke num pedido com 30 itens

---

## #3 — refac: debounce em inputs de texto livre 🟢

**Body:**
Os inputs `#cliente-input` e `#anotacoes-input` chamam `salvar()` (e portanto `localStorage.setItem`) a cada keystroke. Em texto longo isso é desperdício.

Aplicar `debounce` de ~250ms só nesses dois inputs (os numéricos podem continuar imediatos, já que disparam `render()`).

---

## #4 — feat(ui): slider mostrar valor flutuante (price bubble) 🟡

**Body:**
Hoje o `<input type="range">` ao lado de cada item mostra só o thumb; o valor numérico está separado no input ao lado. Adicionar uma "bolinha" flutuante sobre o thumb mostrando o preço corrente formatado (`$0.55`) enquanto arrasta — feedback visual imediato.

Implementação: pseudo-elemento sobre o thumb posicionado via `calc()` baseado no `value`/`min`/`max`.

### #4.1 — Estado vazio mostra apenas tracks (sem bubble)
Bubble só aparece em `:active` / `:focus-visible` do range pra não poluir a linha.

---

## #5 — fix(ui): garantir touch targets ≥ 44×44 (WCAG 2.5.5) 🟡

**Body:**
Vários botões pequenos estão abaixo do mínimo WCAG AA para dispositivos touch:
- `.chip-qtd` (52×~30px)
- `.btn-remover` (26×26px)
- `.historico-del` (24×?)
- `.btn-sm` (~24px alto)

Aumentar `min-height: 44px` em dispositivos `pointer: coarse`, ou alterar interação (ex: swipe pra remover item no mobile).

---

## #6 — ui: breakpoint intermediário entre 760 e 980 🟢

**Body:**
Entre 760px (mobile) e 980px (book-spread duas páginas), o item-row volta a ficar em linha única mas o spread continua empilhado. Resultado: layout fica esticado e item-row aperta demais.

Adicionar breakpoint extra em ~860px que mantém item-row em 2 linhas (nome+actions / qtd+preço+slider+subtotal).

---

## #7 — feat(ui): tooltip custom para nomes truncados 🟢

**Body:**
Nomes longos (ex: "Saco de Cana-de-açúcar") são truncados com `text-overflow: ellipsis` e usam `title="..."` nativo. O tooltip do browser demora ~1.5s pra aparecer.

Substituir por componente leve de tooltip CSS (`:hover::after`) com a paleta dourada, aparecendo em 200ms.

---

## #8 — feat(ux): undo de remoção de item (toast 5s) 🟡

**Body:**
Clicar no ✕ remove o item imediatamente, sem confirmação. Erro de clique é destrutivo.

Adicionar toast no canto inferior com "Item X removido — [Desfazer]" por 5 segundos. Clique no botão restaura o item na mesma posição.

### #8.1 — Stack de undos
Se o usuário remove 3 itens rápido, mostrar "3 itens removidos — Desfazer último / Restaurar todos".

---

## #9 — feat(ux): histórico mais útil (busca + duplicar) 🟡

**Body:**
Lista de histórico hoje só lista as últimas 20. Em pedidos recorrentes do mesmo cliente fica difícil achar.

### #9.1 — Campo de busca no histórico
Filtra por nome do cliente em tempo real.

### #9.2 — Ação "Duplicar como novo pedido"
Hoje carregar do histórico substitui o pedido atual com o mesmo `numeroNota`. Adicionar ação alternativa que cria nova nota (novo Nº) com os mesmos itens, pra repedidos.

### #9.3 — Limite configurável e badge "Pinar"
Permitir pinar pedidos importantes que não saem do histórico mesmo após 20 entradas.

---

## #10 — feat(ux): pin manual de favoritos 🟢

**Body:**
Hoje a seção "Recentes" é puramente automática (últimos 6 adicionados). Adicionar pin manual:
- Cada recente tem um ⭐ pra fixar
- Itens fixados ficam no topo e não são limpos pela rotação
- Persistido em localStorage separado de `recentes` automáticas

---

## #11 — feat(ux): substituir `confirm()` por modal temático 🟢

**Body:**
Hoje "Limpar pedido", "Carregar do histórico" e "Remover do histórico" usam `window.confirm()` nativo, que quebra a identidade visual.

Criar `<dialog>` temático com a paleta dourada e botões "Confirmar / Cancelar", reutilizável em todos os pontos. HTMLDialogElement é nativo e tem suporte amplo (modal acessível, foco trapped automaticamente).

---

## #12 — feat(ux): atalhos globais ampliados 🟢

**Body:**
Hoje só `/` foca a busca. Adicionar:

- `Ctrl+C` (quando nenhum input focado) → copiar pro Discord
- `Ctrl+L` → focar input "Cliente"
- `Ctrl+Shift+L` → limpar pedido
- `Ctrl+K` → abrir busca (alternativa ao `/`)
- `?` → modal mostrando lista de atalhos

---

## #13 — feat(ux): exports adicionais (CSV/JSON/Print) 🟢

**Body:**
Botão único "Copiar pro Discord" hoje. Adicionar dropdown "Exportar como":

- **CSV** — abre no Excel/Google Sheets
- **JSON** — pra backup/integração
- **Imprimir** — `@media print` stylesheet limpa pra papel
- **Imagem (PNG)** — `html2canvas` da nota pra anexar em rede social

---

## #14 — a11y: contraste WCAG AA em metas e hints 🔴

**Body:**
Computado com WebAIM Contrast Checker:

| Elemento | Cor texto | Cor fundo | Razão | AA? |
|---|---|---|---|---|
| `.preco-meta-min` (`--tinta-mute`) | #8b7a4a | #f5ecd0 | ~3.9:1 | ❌ |
| `.hint` (`--tinta-fade`) | #6e5418 | #f5ecd0 | ~6.8:1 | ✅ |
| `.atalhos-hint` (`--tinta-mute`) | #8b7a4a | #f5ecd0 | ~3.9:1 | ❌ |
| `.combo-cat` (`--ouro-prof`) | #3d2e0e | #f5ecd0 (~14% transparência ouro) | ~10:1 | ✅ |

Aumentar `--tinta-mute` pra `#7a653a` ou similar até bater 4.5:1 em todos os usos sobre `--page`.

### #14.1 — Auditoria automatizada
Rodar `pa11y` ou `axe-core` na página inteira pra apanhar outros pontos.

---

## #15 — a11y: `aria-valuetext` nos sliders de preço 🟡

**Body:**
Hoje screen reader anuncia o slider como "0.45 of 0.40 to 0.50". Adicionar `aria-valuetext` com `"45 centavos"` ou `"$0.45 por unidade"` pra leitura natural.

---

## #16 — a11y: `aria-live` granular em vez de re-render total 🟡

**Body:**
`<div id="itens-lista" aria-live="polite">` faz o screen reader anunciar a lista inteira a cada mudança. Em vez disso:

- Mover `aria-live` para uma região status separada (visualmente escondida)
- Anunciar mudanças específicas: "Açúcar removido", "Quantidade de Trigo: 50", "Total: $XX"

Depende de #2 (render incremental) pra funcionar bem.

---

## #17 — a11y: indicar `preco-warning` por ícone, não só cor 🔴

**Body:**
Quando o usuário tenta digitar preço fora do range, a borda fica laranja. Usuários daltônicos não percebem. Adicionar ícone ⚠ (com `aria-label="Fora do intervalo permitido"`) ao lado do input quando warning ativo.

---

## #18 — a11y: mover foco pro floating summary quando aparece 🟢

**Body:**
Em mobile, o usuário rola pra baixo e a floating summary aparece com o botão "Copiar". Screen reader não sabe que apareceu nova UI.

Anunciar via `aria-live="polite"` no container "Pedido pronto para copiar — $X.XX".

---

## #19 — feat: tornar PWA installable 🟢

**Body:**
Adicionar:
- `manifest.json` com nome, ícones (192/512), `theme_color: #b8923a`, `background_color: #f5ecd0`, `display: standalone`
- Service worker mínimo que cacheia `index.html`, `style.css`, `app.js`, fontes Google
- Funciona offline (catálogo de produtos já está embutido)
- Ícone na home do celular/desktop

---

## Como criar essas issues via `gh` CLI

Quando o `gh` estiver instalado e autenticado:

```bash
# Issue 1 (depois cada outra de forma similar)
gh issue create --repo barrosgg/rockefeller \
  --title "chore: aplicar lint estático no projeto" \
  --label "refactor,chore" \
  --body "..."
```

Ou, alternativa: copiar este `ISSUES.md` pra um `gh issue create --body-file ISSUES.md` único como "epic master" e quebrar manualmente depois.

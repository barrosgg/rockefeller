# 📜 Livro de Orçamento da Fazenda Rockefeller

Calculadora web para montar pedidos de orçamento da Fazenda WestFox no servidor de RP, no estilo Red Dead Redemption.

## Recursos

- 🐄 Catálogo completo de produtos com preços mínimo/máximo
- ✏️ Edita preço unitário (clampado dentro da faixa permitida)
- 🔢 Quantidade e remoção por item
- 💰 Desconto percentual sobre o total — limitado automaticamente para nunca violar o mínimo de contrato
- 📋 Copia o pedido formatado para colar no Discord
- 💾 Rascunho salvo automaticamente no navegador (localStorage)
- 📱 Layout responsivo

## Uso local

Basta abrir `index.html` no navegador (duplo clique). Sem build, sem dependências.

## Deploy no GitHub Pages

1. Suba o repositório para o GitHub.
2. Em `Settings → Pages`, escolha branch `main` e pasta `/` (root).
3. Acesse `https://<seu-usuario>.github.io/<nome-do-repo>/`.

## Arquivos

- `index.html` — markup
- `style.css` — tema RDR
- `app.js` — lógica e tabela de produtos embutida
- `Tabela Fazenda WestFox - Fazendas.csv` — fonte de referência dos preços

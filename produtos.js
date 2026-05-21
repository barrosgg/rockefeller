/* ====== Catálogo de produtos + utilitários compartilhados ====== */

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

function indiceProduto(nome) {
    return PRODUTOS.findIndex(p => p.nome === nome);
}

function semAcento(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const fmt = (n) => `$${n.toFixed(2)}`;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
        ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

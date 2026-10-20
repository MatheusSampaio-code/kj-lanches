// ===== CONFIGURAÇÃO: o dono só precisa mexer aqui =====
const NUMERO_WHATSAPP = "5521999272731"; // 55 + DDD + número do dono, sem espaços nem traços

// ===== CARDÁPIO: cada produto é uma linha. Para mudar preço ou nome, edite aqui =====
// id = identificador único (sem espaço) | nome = o que o cliente vê | preco = número com ponto | desc = descrição
const cardapio = [
  { categoria: "Hambúrgueres", itens: [ // grupo 1
    { id: "xburguer", nome: "X-Burguer", preco: 10, desc: "Pão fofinho, carne suculenta, cheddar derretido, salada fresca, ketchup, maionese e molho verde." },
    { id: "xtudo", nome: "X-Tudo", preco: 13, desc: "Carne, cheddar, ovo, linguiça e bacon crocante, milho, ervilha e passas, batata palha, queijo ralado, salada e molhos." },
    { id: "xduplo", nome: "X-Duplo", preco: 16, desc: "2 carnes suculentas, 2 cheddars derretidos, 2 ovos, linguiça e bacon, milho, ervilha, batata palha, salada e molhos." },
    { id: "xcalabresa", nome: "X-Calabresa", preco: 16, desc: "Carne, cheddar, mais linguiça e bacon crocante, milho, ervilha, batata palha, queijo ralado, salada e molhos." },
    { id: "xbacon", nome: "X-Bacon", preco: 17, desc: "Carne, cheddar, ovo, linguiça e mais bacon crocante, milho, ervilha, batata palha, queijo ralado, salada e molhos." },
    { id: "xmontanha", nome: "X-Montanha", preco: 20, desc: "3 carnes suculentas, 3 cheddars, 3 ovos, linguiça e bacon, milho, ervilha, batata palha, salada e molhos." },
    { id: "duplocheddar", nome: "Duplo Cheddar", preco: 12, desc: "2 carnes suculentas, 2x de molho cheddar cremoso e cebola branca." }
  ]},
  { categoria: "Combos", itens: [ // grupo 2
    { id: "combosolitario", nome: "Combo Solitário", preco: 15, desc: "X-Burguer + batata M mega crocante + Guaravita (290ml)." },
    { id: "combosolteiro", nome: "Combo Solteiro", preco: 18, desc: "X-Tudo + batata M mega crocante + Guaravita (290ml)." },
    { id: "combocasal", nome: "Combo Casal", preco: 34, desc: "2 X-Tudo + 2 batatas M mega crocantes + 2 Guaravitas (290ml)." }
  ]},
  { categoria: "Bebidas", itens: [ // grupo 3
    { id: "guaravita", nome: "Guaravita (290ml)", preco: 2.5, desc: "" },
    { id: "guarana", nome: "Guaraná Antárctica 1L", preco: 8, desc: "" },
    { id: "coca", nome: "Coca-Cola 1,5L", preco: 11, desc: "" },
    { id: "sukita", nome: "Sukita Uva 2L", preco: 7.5, desc: "" }
  ]}
];

// ===== CARRINHO: guarda { id do produto: quantidade }. Começa vazio =====
const carrinho = {};

// ===== FUNÇÃO reais: transforma número em dinheiro (13 vira "R$ 13,00") =====
const reais = (v) => "R$ " + v.toFixed(2).replace(".", ","); // toFixed(2) = 2 casas; replace troca ponto por vírgula

// ===== LISTA ÚNICA: junta todos os produtos dos 3 grupos (facilita buscar por id) =====
const todos = cardapio.flatMap((c) => c.itens);

// ===== FUNÇÃO desenharCardapio: cria os quadros dos produtos na tela =====
function desenharCardapio() {
  let html = ""; // texto HTML que vamos montando
  for (const grupo of cardapio) { // repete para cada grupo
    html += `<h2>${grupo.categoria}</h2>`; // título do grupo
    for (const p of grupo.itens) { // repete para cada produto do grupo
      html += `
        <div class="item">
          <div>
            <h3>${p.nome}</h3>
            ${p.desc ? `<small>${p.desc}</small>` : ""}
            <span class="preco">${reais(p.preco)}</span>
          </div>
          <div class="ctrl">
            <button onclick="mudar('${p.id}', -1)" aria-label="Tirar ${p.nome}">−</button>
            <span id="q-${p.id}">0</span>
            <button onclick="mudar('${p.id}', 1)" aria-label="Adicionar ${p.nome}">+</button>
          </div>
        </div>`; // quadro do produto: nome, descrição, preço e botões − e +
    }
  }
  document.getElementById("cardapio").innerHTML = html; // coloca tudo dentro do <main>
}

// ===== FUNÇÃO mudar: soma (+1) ou tira (-1) quantidade de um produto =====
function mudar(id, delta) {
  const nova = Math.max(0, (carrinho[id] || 0) + delta); // soma e impede número negativo
  if (nova === 0) delete carrinho[id]; // se zerou, tira do carrinho
  else carrinho[id] = nova; // senão, guarda a nova quantidade
  document.getElementById("q-" + id).textContent = nova; // atualiza o número na tela
  atualizarBarra(); // atualiza a barra vermelha
  if (document.getElementById("fundoModal").style.display === "flex") desenharResumo(); // se o carrinho está aberto, atualiza a lista
}

// ===== FUNÇÃO totais: calcula quantidade de itens e valor total =====
function totais() {
  let qtd = 0, total = 0; // começam em zero
  for (const id in carrinho) { // para cada item do carrinho
    const p = todos.find((x) => x.id === id); // acha o produto pelo id
    qtd += carrinho[id]; // soma a quantidade
    total += carrinho[id] * p.preco; // soma quantidade × preço
  }
  return { qtd, total }; // devolve os dois valores
}

// ===== FUNÇÃO atualizarBarra: atualiza a barra vermelha do rodapé =====
function atualizarBarra() {
  const { qtd, total } = totais(); // pega quantidade e total
  const barra = document.getElementById("barra"); // acha a barra
  barra.style.display = qtd > 0 ? "flex" : "none"; // só aparece se tiver item
  document.getElementById("barraQtd").textContent = qtd + (qtd === 1 ? " item" : " itens") + " • Ver pedido"; // texto da esquerda
  document.getElementById("barraTotal").textContent = reais(total); // texto da direita
}

// ===== FUNÇÃO desenharResumo: lista os itens dentro do carrinho =====
function desenharResumo() {
  let html = ""; // texto HTML do resumo
  for (const id in carrinho) { // para cada item escolhido
    const p = todos.find((x) => x.id === id); // acha o produto
    html += `<div class="linha"><span>${carrinho[id]}x ${p.nome}</span><span>${reais(carrinho[id] * p.preco)}</span></div>`; // linha: quantidade, nome e subtotal
  }
  html += `<div class="linha"><strong>Total</strong><strong class="preco">${reais(totais().total)}</strong></div>`; // linha do total
  document.getElementById("resumo").innerHTML = html; // coloca na tela
}

// ===== FUNÇÕES abrirCarrinho e fecharCarrinho: mostram e escondem a janela =====
function abrirCarrinho() {
  desenharResumo(); // monta a lista atualizada
  document.getElementById("fundoModal").style.display = "flex"; // mostra a janela
}
function fecharCarrinho() {
  document.getElementById("fundoModal").style.display = "none"; // esconde a janela
}

// ===== FUNÇÃO enviarPedido: monta a mensagem e abre o WhatsApp =====
function enviarPedido() {
  const nome = document.getElementById("nome").value.trim(); // lê o nome (trim tira espaços sobrando)
  const endereco = document.getElementById("endereco").value.trim(); // lê o endereço
  const pagamento = document.getElementById("pagamento").value; // lê a forma de pagamento
  const erro = document.getElementById("erro"); // acha o espaço de aviso

  if (!endereco || !pagamento) { // se faltar endereço ou pagamento
    erro.textContent = "Preencha o endereço e escolha a forma de pagamento."; // escreve o aviso
    erro.style.display = "block"; // mostra o aviso
    return; // para aqui e não envia
  }
  erro.style.display = "none"; // esconde o aviso se estiver tudo certo

  let msg = "Olá! Quero fazer um pedido:\n\n"; // início da mensagem (\n = pular linha)
  for (const id in carrinho) { // para cada item escolhido
    const p = todos.find((x) => x.id === id); // acha o produto
    msg += `${carrinho[id]} x ${p.nome}\n`; // escreve, por exemplo: 1 x X-Tudo
  }
  msg += `\nTotal: ${reais(totais().total)}`; // total do pedido
  if (nome) msg += `\nNome: ${nome}`; // nome (só se foi preenchido)
  msg += `\nEndereço: ${endereco}`; // endereço
  msg += `\nForma de pagamento: ${pagamento}`; // forma de pagamento

  const link = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(msg); // monta o link do WhatsApp (encodeURIComponent deixa o texto seguro para link)
  window.open(link, "_blank"); // abre o WhatsApp
}

desenharCardapio(); // desenha o cardápio assim que a página abre


async function fetchDados() {
    const container = document.getElementById('resultado');
    try {
        const URL = "https://dummyjson.com/products";
        const resposta = await fetch(URL);
        const produtos = await resposta.json();

        let p = '';

        produtos.products.forEach(produto => {
        p += `
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="${produto.thumbnail}" class="card-img-top">

                    <div class="card-body">
                        <h5 class="card-title">${produto.title}</h5>
                        <p class="card-text">R$ ${produto.price}</p>

                        <button class="btn btn-primary" onclick="detalhes(${produto.id})">
                            Ver detalhes
                        </button>
                    </div>
                </div>
            </div>
            `;
            });

        container.innerHTML = p;

    } catch (erro) {
        console.error('Erro na api', erro);
    }
}

document.addEventListener('DOMContentLoaded', fetchDados);

async function detalhes(idProduto) {
    try {
        const resposta = await fetch(`https://dummyjson.com/products/${idProduto}`);
        const produto = await resposta.json();

        const container = document.getElementById('resultado');

        container.innerHTML = `
            <h2>${produto.title}</h2>
            <p>Preço: ${produto.price}</p>
            <p>${produto.description}</p>
            <img src="${produto.thumbnail}" width="200">
            <br><br>
           <button onclick="carrinho(${idProduto}, ${produto.price})">Adicionar ao Carrinho</button>
            <button onclick="fetchDados()">Voltar</button>
        `;

    } catch (erro) {
        console.error('Erro ao buscar detalhes', erro);
    }
}

function carrinho(idProduto , preco ){

    let itens = 0; 

    const prod = { id: idProduto, preco : preco};
   
    const json = JSON.stringify(prod);

    localStorage.setItem(idProduto, json);

    itens = localStorage.length;
   
    const componente = document.getElementById('carrinho-resposta');
    componente.innerHTML = itens;
}

function verCarrinho(){
    
}
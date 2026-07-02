

async function fetchDados() {
    const container = document.getElementById('resultado');

    const itens = document.getElementById('carrinho-resposta');

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

        itens.innerHTML = localStorage.length;

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
           <button onclick="carrinho(${idProduto}, ${produto.price}, '${produto.title}')">Adicionar ao Carrinho</button>
            <button onclick="fetchDados()">Voltar</button>
        `;

    } catch (erro) {
        console.error('Erro ao buscar detalhes', erro);
    }
}

function carrinho(idProduto , preco , titulo ){

    let itens = 0; 

    const prod = { id: idProduto, preco : preco, titulo: titulo};
   
    const json = JSON.stringify(prod);

    localStorage.setItem(idProduto, json);

    itens = localStorage.length;
   
    const componente = document.getElementById('carrinho-resposta');
    componente.innerHTML = itens;
}

function verCarrinho() {
    const container = document.getElementById('resultado');
    
    
    if (localStorage.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3>Seu carrinho está vazio 🛒</h3>
                <button class="btn btn-primary mt-3" onclick="fetchDados()">Voltar às compras</button>
            </div>
        `;
        return;
    }

    let tabelaItens = '';
    let totalGeral = 0;

    
    for (let i = 0; i < localStorage.length; i++) {
        let chave = localStorage.key(i);
        
    
        if (chave !== "" && !isNaN(Number(chave))) {
            let produtoJson = localStorage.getItem(chave);
            let produto = JSON.parse(produtoJson);
            
            totalGeral += Number(produto.preco);

            tabelaItens += `
                <tr>
                    <td>ID: ${produto.id}</td>
                    <td>${produto.titulo}</td>
                    <td>R$ ${Number(produto.preco).toFixed(2)}</td>
                </tr>
            `;
        }
    }


    container.innerHTML = `
        <div class="col-12 m-auto mt-4" style="max-width: 600px;">
            <h2 class="mb-4">Seu Carrinho</h2>
            <table class="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Item</th>
                        <th>Preço</th>
                    </tr>
                </thead>
                <tbody>
                    ${tabelaItens}
                </tbody>
                <tfoot>
                    <tr class="table-dark">
                        <td colspan="2"><strong>Total geral:</strong></td>
                        <td><strong>R$ ${totalGeral.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
            <div class="d-flex gap-2 justify-content-end mt-3">
                <button class="btn btn-secondary" onclick="fetchDados()">Voltar</button>
                <button class="btn btn-danger" onclick="limparCarrinhoCompleto()">Esvaziar Carrinho</button>
            </div>
        </div>
    `;
}
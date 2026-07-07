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
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 g-4">
                <div class="card h-100 border-0 shadow-sm custom-card">
                    
                    <div class="bg-light d-flex align-items-center justify-content-center rounded-top" style="height: 200px; overflow: hidden;">
                        <img src="${produto.thumbnail}" class="img-fluid p-3" alt="${produto.title}" style="max-height: 100%; object-fit: contain;">
                    </div>

                    <div class="card-body d-flex flex-column p-3">
                        <span class="text-uppercase text-muted small fw-bold mb-1" style="font-size: 0.75rem;">
                            ${produto.category || 'Produto'}
                        </span>
                        
                        <h6 class="card-title text-dark fw-semibold mb-2 text-truncate-2" style="height: 44px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            ${produto.title}
                        </h6>

                        <div class="mt-auto mb-3">
                            <span class="text-muted small d-block mb-0">R$ ${Number(produto.price * 1.15).toFixed(2)}</span> <h5 class="text-dark fw-bold mb-0">
                                R$ ${Number(produto.price).toFixed(2)}
                            </h5>
                            <small class="text-success fw-medium">em 10x sem juros</small>
                        </div>

                        <button class="btn btn-primary w-100 fw-medium py-2 rounded-2" onclick="detalhes(${produto.id})">
                            Ver detalhes
                        </button>
                    </div>
                </div>
            </div>
            `;
        });

        container.innerHTML = p;

        atualizarContadorHeader();

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

        const tituloEscapado = produto.title.replace(/'/g, "\\'");

      container.innerHTML = `
    <div class="col-12 mt-4">
        <button class="btn btn-outline-secondary mb-4" onclick="fetchDados()">
            ← Voltar para a loja
        </button>

        <div class="card shadow-sm p-4">
            <div class="row g-4 align-items-center">
                
                <div class="col-md-5 text-center">
                    <img src="${produto.thumbnail}" alt="${produto.title}" class="img-fluid rounded bg-light p-3" style="max-height: 350px; object-fit: contain;">
                </div>

                <div class="col-md-7">
                    <span class="badge bg-secondary mb-2">${produto.category || 'Produto'}</span>
                    <h2 class="fw-bold mb-2">${produto.title}</h2>
                    <p class="text-muted mb-4">${produto.description}</p>
                    
                    <div class="mb-4">
                        <span class="text-muted small d-block">Preço à vista</span>
                        <h3 class="text-success fw-bold">R$ ${Number(produto.price).toFixed(2)}</h3>
                    </div>

                    <div class="d-grid gap-2 d-sm-flex">
                        <button class="btn btn-success btn-lg px-4" onclick="carrinho(${idProduto}, ${produto.price}, '${tituloEscapado}'); verCarrinho();">
                            Comprar Agora
                        </button>
                        
                        <button class="btn btn-outline-primary btn-lg px-4" onclick="carrinho(${idProduto}, ${produto.price}, '${tituloEscapado}')">
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
`;

    } catch (erro) {
        console.error('Erro ao buscar detalhes', erro);
    }
}

function carrinho(idProduto, preco, titulo) {

    let itens = 0;

    const prod = { id: idProduto, preco: preco, titulo: titulo };

    const json = JSON.stringify(prod);

    localStorage.setItem(idProduto, json);



    const componente = document.getElementById('carrinho-resposta');

    atualizarContadorHeader();

    alert(`${titulo} foi adicionado ao seu carrinho! 🛒`);
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
                   <td class="text-center"><button class="btn btn-outline-danger btn-sm" onclick="reverItemCarrinho(${produto.id})"><img src="/assets/img/icons8-lixeira.svg" alt="Deletar"></button></td>
                    
                   
                </tr>
            `;
        }
    }


    container.innerHTML = `
        <div class="col-12 m-auto mt-4" style="max-width: 600px;">
            <h2 class="mb-4">Seu Carrinho</h2>
            <table class="table table-striped table-hover align-middle shadow-sm rounded">
                <thead class="table-primary">
                    <tr>
                        <th>Código</th>
                        <th>Item</th>
                        <th>Preço</th>
                        <th class="text-center">Ações</th> </tr>
                </thead>
                <tbody>
                    ${tabelaItens}
                </tbody>
                <tfoot>
                    <tr class="table-dark">
                        <td colspan="2"><strong>Total geral:</strong></td>
                        <td colspan="2"><strong>R$ ${totalGeral.toFixed(2)}</strong></td> </tr>
                </tfoot>
            </table>
            <div class="d-flex gap-2 justify-content-end mt-3">
                <button class="btn btn-secondary" onclick="fetchDados()">Voltar</button>
                <button class="btn btn-danger" onclick="limparCarrinhoCompleto()">Esvaziar Carrinho</button>
            </div>
        </div>
    `;
    atualizarContadorHeader();
}

function reverItemCarrinho(idItem) {
    localStorage.removeItem(idItem);
    atualizarContadorHeader();
    verCarrinho();
}

function limparCarrinhoCompleto() {
    localStorage.clear();
    atualizarContadorHeader();
    verCarrinho();
}

function atualizarContadorHeader() {
    const componente = document.getElementById('carrinho-resposta');
    if (componente) {
        let totalItensValidos = 0;
        for (let i = 0; i < localStorage.length; i++) {
            let chave = localStorage.key(i);
            if (chave !== "" && !isNaN(Number(chave))) {
                totalItensValidos++;
            }
        }
        componente.innerHTML = totalItensValidos;
    }
}

function comprar(){

}
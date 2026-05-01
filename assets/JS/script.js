

async function fetchDados() {
    const container = document.getElementById('resultado');
    try {
        const URL = "https://dummyjson.com/products";
        const resposta = await fetch(URL);
        const produtos = await resposta.json();

        let p = '';

        produtos.products.forEach(produto => {
            p += `
                <li>
                    <p>${produto.title}</p>
                    <p>${produto.price}</p>
                   <img src="${produto.thumbnail}" width="200">
                    <button type="button" onclick="detalhes(${produto.id})">Ver</button>
                </li>
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
            <button onclick="fetchDados()">Voltar</button>
        `;

    } catch (erro) {
        console.error('Erro ao buscar detalhes', erro);
    }
}
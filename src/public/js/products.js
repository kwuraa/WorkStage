// backend for database
const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const contentItemList = document.getElementById("contentItemList");
  const productModal = document.getElementById("productModal");
  const modalProductContent = document.getElementById("modalProductContent");
  const spanClose = document.querySelector(".close");

  // Renderiza a lista de produtos
  async function fetchProdutos() {
    try {
      const response = await fetch(`${API_URL}/produtos`);
      const produtos = await response.json();
      renderProdutos(produtos);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }

  function renderProdutos(produtos) {
    contentItemList.innerHTML = "";
    produtos.forEach((produto) => {
      const li = document.createElement("li");
      li.classList.add("infos");

      li.innerHTML = `
        <span id="idProduto">${produto.id}</span>
        <span id="produto">${produto.nome}</span>
        <span id="dataCadastro">${formatDate(produto.data_cadastro)}</span>
        <span id="status">${produto.status}</span> 
      `;

      // Ao clicar em um produto, abre o modal
      li.addEventListener("click", function () {
        renderProdutoDetalhes(produto);
        productModal.style.display = "flex";
        setTimeout(() => productModal.classList.add("show"), 10);
      });

      contentItemList.appendChild(li);
    });
  }

  // Função para renderizar os detalhes do produto, incluindo seus processos
  async function renderProdutoDetalhes(produto) {
    // Preenche os dados básicos do produto
    modalProductContent.innerHTML = `
    <div class="modalDetails">
      <h2>Detalhes do Produto</h2>
      <h3> ${produto.nome} </h3>
      <span> Status: ${produto.status} </span>
    </div>
    <div class="description">
    <h3 class="titles">Descrição:</h3> 
    <div class="displayDetails">
      <p>ID: ${produto.id}</p>
      <p>Data de Cadastro: ${formatDate(produto.data_cadastro)}</p>
      <p class="descricao">${produto.descricao}</p>
      </div>
    </div>
    <div class="process">
      <div id="processosContainer">
        <p>Carregando processos...</p>
      </div>
    </div>
    <div class="btnModal">
    <button class="iconPlus"></button>
    <button class="iconEdit"></button>
    <button class="iconTrash"></button>
    </div>
    `;

    // Busca os processos relacionados ao produto
    try {
      const response = await fetch(
        `${API_URL}/produtos/${produto.id}/processos`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar os processos");
      }
      const processos = await response.json();
      const processosContainer = document.getElementById("processosContainer");

      if (!processos.length) {
        processosContainer.innerHTML = `<p>Sem processos cadastrados.</p>`;
        return;
      }

      // Monta a lista de processos
      let htmlProcessos =
        '<h3 class="titles">Produção:</h3><ul><div class="displayModal">';
      processos.forEach((processo) => {
        htmlProcessos += ` 
          <li>
            <button>${processo.nome}</button>
          </li>
         
        `;
      });
      htmlProcessos += " </div> </ul>";
      processosContainer.innerHTML = htmlProcessos;
    } catch (error) {
      console.error("Erro ao buscar processos:", error);
      const processosContainer = document.getElementById("processosContainer");
      processosContainer.innerHTML = `<p>Erro ao carregar processos.</p>`;
    }
  }

  // Fecha o modal
  function closeModal() {
    productModal.classList.remove("show");
    setTimeout(() => {
      productModal.style.display = "none";
    }, 400);
  }

  // Evento para fechar ao clicar no "x"
  spanClose.addEventListener("click", closeModal);

  // Fecha o modal se o usuário clicar fora do conteúdo dele
  window.addEventListener("click", function (event) {
    if (event.target === productModal) {
      closeModal();
    }
  });

  // Carrega os produtos assim que a página for carregada
  atualizarEstadoBotoes();
  fetchProdutos();
});

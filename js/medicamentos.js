document.addEventListener('DOMContentLoaded', function() {
    // Função para buscar medicamentos e atualizar a tabela
    function atualizarListaMedicamentos(params = {}) {
        const query = new URLSearchParams(params).toString();
        const url = `http://localhost:8080/medicamentos?${query}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Dados recebidos:', data); // Imprime os dados recebidos
                const tbody = document.getElementById('medicamentos-tbody');
                tbody.innerHTML = ''; // Limpa o conteúdo existente

                if (Array.isArray(data)) {
                    data.forEach(medicamento => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${medicamento.id}</td>
                            <td>${medicamento.lote}</td>
                            <td>${medicamento.nome}</td>
                            <td>${medicamento.validade}</td>
                            <td>${medicamento.quantidadeTotal}</td>
                            <td>${medicamento.saidaEstoque || 0}</td>
                            <td>
                                <button onclick="openEditModal(${medicamento.id})">Editar</button>
                                <button onclick="openDeleteModal(${medicamento.id})">Deletar</button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                } else {
                    console.error('Esperado um array de medicamentos, mas recebido:', data);
                }
            })
            .catch(error => console.error('Erro ao buscar medicamentos:', error));
    }

    // Atualiza a lista de medicamentos ao carregar a página
    atualizarListaMedicamentos();

    // Adiciona evento ao formulário de cadastro
    document.getElementById('cadastrar-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const medicamento = {
            nome: document.getElementById('nome').value,
            categoria: document.getElementById('categoria').value,
            quantidadeTotal: document.getElementById('quantidade').value,
            validade: document.getElementById('validade').value,
            lote: document.getElementById('lote').value
        };

        fetch('http://localhost:8080/medicamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medicamento)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Medicamento cadastrado:', data);
            alert('Medicamento cadastrado com sucesso!');
            closeModal('cadastrar-modal');
            atualizarListaMedicamentos(); // Atualiza a lista sem recarregar a página
        })
        .catch(error => {
            console.error('Erro ao cadastrar medicamento:', error);
        });
    });

    // Adiciona evento ao botão de busca
    document.querySelector('.search-container button').addEventListener('click', function() {
        const nome = document.getElementById('search').value.trim();
        atualizarListaMedicamentos({ nome });
    });
});

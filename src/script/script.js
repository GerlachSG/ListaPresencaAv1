// Espera a página carregar inteira para o script começar a rodar.
document.addEventListener('DOMContentLoaded', () => {

    
    // Pega todos os botões, campos e textos da tela e guarda em variáveis.
    const inputDocente = document.getElementById('input-docente');
    const dataEl = document.getElementById('data-atual');
    const tituloTurmaEl = document.getElementById('titulo-turma');
    const turmaSelect = document.getElementById('select-turma');
    const btnCarregar = document.getElementById('btn-carregar');
    const btnSalvar = document.getElementById('btn-salvar');
    const btnLimpar = document.getElementById('btn-limpar');
    const listaTbody = document.getElementById('lista-tbody');
    const feedbackEl = document.getElementById('feedback-mensagem');

    
    // Coloca a data de hoje no topo da página, no formato dd/mm/aaaa.
    function atualizarData() {
        const hoje = new Date();
        dataEl.textContent = hoje.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    
    // Mostra uma mensagem para o usuário (de erro ou sucesso) que some sozinha.
    function showFeedback(mensagem, tipo = 'info') {
        feedbackEl.textContent = mensagem;
        feedbackEl.className = tipo; 
        feedbackEl.classList.add('fade-anim'); 

        
        // Define o tempo que a mensagem fica na tela (deve ser igual ao da animação no CSS).
        setTimeout(() => {
            feedbackEl.textContent = '';
            feedbackEl.className = '';
        }, 3500); 
    }

    
    // Busca o arquivo "turmas.json" para criar a lista de turmas no menu de seleção.
    async function carregarIndiceTurmas() {
        // Pega o caminho da turma, dentro das pastas.
        const indexPath = `../assets/turmas/turmas.json`;
        try {
            const response = await fetch(indexPath);
            if (!response.ok) {
                throw new Error('Falha ao carregar o índice de turmas.');
            }
            const turmas = await response.json();

            
            // Limpa o "Carregando..." e bota a opção padrão.
            turmaSelect.innerHTML = '<option value="">-- Turmas --</option>';

            
            // Cria um <option> para cada turma encontrada no JSON.
            turmas.forEach(turma => {
                const option = document.createElement('option');
                option.value = turma.id;   
                option.textContent = turma.nome; 
                turmaSelect.appendChild(option);
            });

        } catch (error) {
            console.error(error);
            turmaSelect.innerHTML = '<option value="">Erro ao carregar</option>';
            showFeedback(error.message, 'erro');
        }
    }


    // Busca o arquivo JSON da turma que o professor selecionou e chama a função para criar a lista de alunos.
    async function carregarTurma() {
        const turma = turmaSelect.value;
        if (!turma) {
            showFeedback('Por favor, selecione uma turma primeiro.', 'erro');
            return;
        }

        // Pega o caminho do arquivo dentro das pastas
        const filePath = `../assets/turmas/${turma}.json`;

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Arquivo da turma ${turma} não encontrado.`);
            }
            const alunos = await response.json();

            // Coloca o nome da turma no título (H2)
            const turmaNomeDisplay = turmaSelect.options[turmaSelect.selectedIndex].text;
            tituloTurmaEl.textContent = `Turma: ${turmaNomeDisplay}`;
            
            // Manda os alunos para a função que cria a tabela.
            popularLista(alunos);
            showFeedback(`Turma ${turma} carregada.`, 'sucesso');

        } catch (error) {
            console.error('Erro ao carregar turma:', error);
            showFeedback(error.message, 'erro');
            tituloTurmaEl.textContent = '';
            listaTbody.innerHTML = '';
        }
    }

    // Recebe a lista de alunos (do JSON) e cria uma linha na tabela para cada aluno.
    function popularLista(alunos) {
        listaTbody.innerHTML = ''; // Limpa a tabela antes de adicionar novos alunos.
        if (!alunos || alunos.length === 0) {
            listaTbody.innerHTML = '<tr><td colspan="3">Nenhum aluno encontrado.</td></tr>';
            return;
        }

        // Cria a linha (tr) para cada aluno da lista.
        alunos.forEach((aluno, index) => {
            const radioName = `presenca-${aluno.ra || index}`;
            const tr = document.createElement('tr');
            // Guarda o RA e o Nome "escondidos" na linha para usar ao salvar.
            tr.dataset.ra = aluno.ra;
            tr.dataset.nome = aluno.nome;
            
            // Este é o HTML de cada linha da tabela.
            tr.innerHTML = `
                <td>${aluno.nome}</td>
                <td>
                    <div class="controle-presenca">
                        <input type="radio" id="p-${radioName}" name="${radioName}" value="presente">
                        <label for="p-${radioName}">P</label>

                        <input type="radio" id="f-${radioName}" name="${radioName}" value="falta">
                        <label for="f-${radioName}">F</label>
                    </div>
                </td>
                <td>
                    <input type="text" class="input-obs" placeholder="Opcional...">
                </td>
            `;
            listaTbody.appendChild(tr); // Adiciona a linha na tabela.
        });
    }

    // Desmarca todos os botões [P] e [F] e limpa as observações.
    function limparSelecao() {
        const radios = listaTbody.querySelectorAll('input[type="radio"]:checked');
        radios.forEach(radio => radio.checked = false);

        const observacoes = listaTbody.querySelectorAll('input.input-obs');
        observacoes.forEach(input => input.value = '');

        showFeedback('Marcações limpas.', 'info');
    }

    // Verifica se tudo foi preenchido, junta todos os dados (professor, turma, alunos) e chama a função para baixar o arquivo JSON.
    function salvarChamada() {
        const nomeDocente = inputDocente.value;
        const turma = turmaSelect.value;
        const data = dataEl.textContent;
        const linhas = listaTbody.querySelectorAll('tr');

        
        // === Verifica se o professor preencheu tudo ===
        if (!nomeDocente) {
            showFeedback('Erro: Por favor, insira o seu nome.', 'erro');
            inputDocente.focus();
            return;
        }
        if (!turma) {
            showFeedback('Erro: Nenhuma turma carregada.', 'erro');
            return;
        }
        if (linhas.length === 0 || !linhas[0].dataset.nome) {
            showFeedback('Erro: Não há alunos na lista.', 'erro');
            return;
        }

        
        // Cria o "pacote" de dados que vai virar o JSON.
        const chamadaData = {
            docente: nomeDocente,
            turma: turma,
            turmaNome: turmaSelect.options[turmaSelect.selectedIndex].text,
            data: data,
            alunos: []
        };

        // Passa por cada linha da tabela verificando o que foi marcado.
        let todosMarcados = true;
        linhas.forEach(linha => {
            const presencaInput = linha.querySelector('input[type="radio"]:checked');
            const observacao = linha.querySelector('.input-obs').value;
            const status = presencaInput ? presencaInput.value : 'nao-marcado';

            if (status === 'nao-marcado') {
                todosMarcados = false; // Se achar UM aluno sem [P] ou [F], trava o salvamento.
            }

            // Adiciona o aluno atual no "pacote" de dados.
            chamadaData.alunos.push({
                ra: linha.dataset.ra,
                nome: linha.dataset.nome,
                status: status,
                observacao: observacao || ''
            });
        });

        
        // Se `todosMarcados` for `false`, mostra o erro e para a função.
        if (!todosMarcados) {
            
            showFeedback('Erro: Todos os alunos devem ter [P] ou [F] marcado.', 'erro');
            return;
        }

        
        // Se chegou até aqui, está tudo certo!
        const jsonString = JSON.stringify(chamadaData, null, 2); // Formata o JSON para ficar legível
        const dataArquivo = new Date().toISOString().split('T')[0]; 
        const filename = `chamada_${turma}_${dataArquivo}.json`;

        downloadJSON(jsonString, filename); // Chama a função que faz o download.
        showFeedback('Chamada salva com sucesso! O download foi iniciado.', 'sucesso');
    }

    
    // Cria um arquivo JSON e força o navegador a fazer o download dele.
    function downloadJSON(jsonString, filename) {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); // Cria um link invisível
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click(); // Clica no link
        document.body.removeChild(a); // Remove o link
        URL.revokeObjectURL(url);
    }

    
    // === Quando a página abrir: ===
    atualizarData(); // Coloca a data
    carregarIndiceTurmas(); // Carrega a lista de turmas
    
    
    // === Define o que cada botão principal faz quando é clicado ===
    btnCarregar.addEventListener('click', carregarTurma);
    btnSalvar.addEventListener('click', salvarChamada);
    btnLimpar.addEventListener('click', limparSelecao);
});
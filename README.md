# 📚 Lista de Presença (Av1)

Este é um projeto de frontend simples criado para Situação Desafiadora (Avaliação), que simula um sistema de lista de chamada para professores. A aplicação é construída inteiramente com **HTML5**, **CSS3** e **JavaScript** puro (Vanilla JS), sem a necessidade de bibliotecas ou frameworks.

A aplicação permite que um docente selecione uma turma, carregue a lista de alunos dinamicamente e marque a presença ou falta, podendo salvar um registro da chamada em formato JSON.

## ✨ Funcionalidades Principais

* **Carregamento Dinâmico de Turmas:** A lista de turmas disponíveis é carregada a partir de um arquivo `turmas.json`, populando o menu de seleção.
* **Carregamento de Alunos:** Ao selecionar uma turma e clicar em "Carregar", a aplicação busca o arquivo `.json` correspondente (ex: `2ADS.json`) e exibe a lista de alunos na tabela.
* **Interface Intuitiva de Chamada:** O professor pode marcar **[P]** para Presente ou **[F]** para Falta com um único clique.
* **Campo de Observações:** É possível adicionar observações individuais para cada aluno (ex: "Atestado", "Saiu mais cedo").
* **Validação de Formulário:** O sistema não permite salvar a chamada se o nome do professor não estiver preenchido ou se algum aluno não tiver sua presença/falta marcada.
* **Salvar em JSON:** Ao clicar em "Salvar", o sistema gera e baixa um arquivo `.json` contendo todos os dados da chamada (professor, turma, data e o status de cada aluno).
* **Feedback Animado:** Mensagens de sucesso ou erro aparecem de forma suave no rodapé da página.

## 🚀 Como Usar

1.  **Abra o Projeto:** A forma mais simples de usar é abrir o `[website](https://gerlachsg.github.io/ListaPresencaAv1/src/pages/index)` diretamente no seu navegador.
2.  **Digite seu Nome:** Insira seu nome no campo "Nome:" no cabeçalho.
3.  **Selecione a Turma:** Na parte inferior, escolha uma turma no menu de seleção (ex: "4ADS - Noite").
4.  **Carregue os Alunos:** Clique no botão "CARREGAR TURMA". A lista de alunos aparecerá na tabela.
5.  **Faça a Chamada:** Marque **[P]** ou **[F]** para cada aluno e adicione observações se necessário.
6.  **Salve o Registro:** Clique em "SALVAR". Um arquivo `.json` (ex: `chamada_4ADS_2025-10-31.json`) será baixado para o seu computador.

### README Gerado por IA.

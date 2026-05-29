# **Diretrizes do Projeto de Desenvolvimento Web \- Front-End Responsivo**

**Componente Curricular:** Desenvolvimento de Aplicações Web  
**Contexto:** Construção de Interface Dinâmica e Persistência Local  
**Nível de Atuação:** Desenvolvedor de Software Front-End Jr.

## **1\. Visão Geral do Projeto**

Este documento estabelece as diretrizes oficiais e os requisitos técnicos para a concepção, design e implementação do Projeto Prático de Desenvolvimento Web. O objetivo fundamental desta atividade é consolidar competências práticas na criação de interfaces modernas, fluidas, totalmente navegáveis e responsivas, utilizando frameworks de estilo atuais aliados à manipulação dinâmica de dados em memória do navegador.  
O tema do projeto é de livre escolha da equipe, permitindo que os desenvolvedores apliquem os conceitos técnicos em cenários do mundo real de seu interesse (sistemas de gestão, e-commerce fictício, plataformas de agendamento, controle acadêmico, entre outros).

## **2\. Escopo Funcional (Requisitos do Sistema)**

A aplicação desenvolvida deve apresentar um fluxo de dados completo e funcional baseado em manipulações de registros. O escopo das funcionalidades obrigatórias está estruturado na tabela abaixo:

| Tipo de Funcionalidade | Quantidade Mínima | Diretrizes de Implementação   |
| :---- | :---- | :---- |
| **Cadastro (Create)** | 02 Funcionalidades | Interfaces dedicadas para a inserção de novos registros no sistema. Exemplos: Cadastro de login/usuários, cadastro de alunos, cadastro de produtos ou de serviços. |
| **Edição (Update)** | 02 Funcionalidades | Mecanismos que permitam a alteração de dados já existentes de forma intuitiva, atualizando as informações modificadas pelo usuário. |
| **Consulta (Read)** | 02 Funcionalidades | Visualização estruturada dos dados de forma coletiva (tabelas, listagens ou cards) ou individual (filtros/detalhes de um registro específico). |
| **Exclusão (Delete)** | 02 Tipos Distintos | Estratégias diferenciadas para a remoção de informações (ex: exclusão lógica/desativação, exclusão física de registros, ou exclusão em lote/individual). |

## **3\. Requisitos Não-Funcionais e Arquitetura de Interface**

Para garantir a qualidade, usabilidade e portabilidade do software gerado, a aplicação deverá atender rigorosamente aos seguintes critérios arquiteturais de front-end:

### **Responsividade Avançada:**

* O layout deve ser totalmente responsivo, adaptando-se com perfeição a smartphones, tablets e desktops.  
* É obrigatório o uso do sistema de **layout grid baseado em 12 colunas** fornecido pelo framework de estilização para gerenciar o comportamento dos elementos em diferentes resoluções de tela.

### **Uso do Framework Bootstrap e Componentes:**

* **Modals:** É obrigatório o emprego de janelas modais (Modals) em, no mínimo, uma das funcionalidades principais da aplicação (ex: confirmações de exclusão, formulários de edição rápida ou alertas importantes).  
* **Componentes Adicionais:** A interface deve enriquecer a experiência do usuário fazendo uso de outras features nativas do Bootstrap, como componentes de Carrossel (Carousel) para exibição de mídias/destaques, Cards, Alerts ou Badges.

### **Navegabilidade e Integridade:**

* A aplicação deve ser completamente navegável, configurando uma SPA (Single Page Application) ou um ecossistema multipáginas coeso.  
* **Zero Links Quebrados:** Todas as âncoras, menus de navegação (Navbars) e botões de redirecionamento devem conduzir a destinos válidos e funcionais.

### **Persistência de Dados e APIs:**

* **Persistência Local:** Todos os dados criados, editados ou excluídos devem ser persistidos obrigatoriamente utilizando a API localStorage do navegador. **Não deve ser utilizado nenhum Banco de Dados Relacional ou NoSQL tradicional.**  
* **Integração Externa (Opcional):** A aplicação está autorizada a consumir APIs públicas externas para enriquecimento de dados da interface (ex: API de CEPs, cotações, dados de clima, etc.).

## **4\. Diretrizes de Organização e Entrega**

* **Constituição das Equipes:** O trabalho poderá ser executado individualmente ou em grupos de **até 3 integrantes**.  
* **Gerenciamento de Código:** Recomenda-se a componentização adequada e a escrita de código limpo e documentado para facilitar a divisão de tarefas no front-end.
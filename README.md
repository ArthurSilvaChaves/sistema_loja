# Sistema de Loja (Ponto de Vendas) genérico

Um sistema de gereciamento de produtos e funcionarios desenvolvido para estudo de **backend**, **banco de dados** e **frontend**.

Projeto **full stack** com API rest, banco de dados e frontend em **REACT**.

## 
## Tecnologias do Projeto

### **Backend**(/backend)

- **Node.js**
- Express
- Prisma ORM
- MariaDB (usando provider do mysql)
- **Js**

### **Frontend**(/frontend)

- **React**
- **Ts**
- Vite
- Css

## Funções 

### **Dashboard**

A tela de **Dashboard** lista os produtos que estão no banco, permite criar novos produtos e excluir os existentes, além de filtrar por nome os produtos listados. Tela simples apenas para acompanhar que produtos estão no banco, seu estoque e preço.

### **Caixa**

A tela de **Caixa** realiza as vendas. ela registra o funcionário loggado na seção e registra a venda no nome dele. Na tela de caixa as vendas são feitas por escolher o produto, quantidade, forma de pagamento e (se a forma de pagamento for dinheiro ou pix), desconto. Depois de finalizada a venda fica salva na seção atual, **mas ainda não é guardada no banco**.

## Como executar 

### 1. Clone o repositório 

rode no terminal: `git clone https://github.com/ArthurSilvaChaves/sistema_loja`

### 2. Ative a backend e API

entre na pasta do backend e execute:

`npm install` para instalar as dependências (node.js)

configure o ***.env*** para ligar com banco de dados:

`DATABASE_URL="mysql://usuario:senha@localhost:3306/pdv"`

execute as *migrations*(prisma):

`npx prisma migrate dev`

Inicie a API:

`npm run dev`

##### *essas são as configurações apenas do back e devem ser iniciadas na pasta /backend

### 3. Ative o frontend 

entre na pasta do frontend e execute:

`npm install` para instalar as dependências e `npm run dev` para iniciar o react; depois pegue o endereço dado pelo terminal e jogue no seu navegador de internet.

## Endpoints da API

### Produtos

1. - Método: **GET**  
    - Endpoint: `/products`
    - Descrição: Lista todos os produtos.

###

2. - Método **GET**
    - Endpoint: `/products/:id`
    - Descrição: Busca um produto pelo id.

###

3. - Método **POST**
    - Endpoint: `/products`
    - Descrição: Cadastra um produto no banco.

### 

4. - Método **PUT**
    - Endpoint: `/products/:id`
    - Descrição: atualiza um produto.

###

5. - Método **DELETE**
    - Endpoint: `/products/:id`
    - Descrição: Remove um produto.

### Funcionários

1. - Método: **GET**  
    - Endpoint: `/products`
    - Descrição: Lista todos os 
    funcionários.

###

2. - Método **GET**
    - Endpoint: `/products/:id`
    - Descrição: Busca um funcionário pelo id.

###

3. - Método **POST**
    - Endpoint: `/products`
    - Descrição: Cadastra um funcionário no banco.

### 

4. - Método **PUT**
    - Endpoint: `/products/:id`
    - Descrição: atualiza um funcionário.

###

5. - Método **DELETE**
    - Endpoint: `/products/:id`
    - Descrição: Remove um funcionário.

    
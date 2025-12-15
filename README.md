# 📱 App Catálogo Interativo

Projeto de aplicativo **React Native** com **Expo** (TypeScript), desenvolvido como pré-requisito para aprovação na disciplina **Programação Mobile** do curso de Engenharia da Computação da Faculdade UNIFEAF.

## ✅ Como executar

1) Instale as dependências

```bash
npm install
```

2) Inicie o app

```bash
npx expo start --tunnel
```

---

## 🚀 Funcionalidades

### 1) Autenticação (Login)
- Simulação de login via **nome** e **e-mail**
- Validação de campos **no próprio formulário** (mensagens inline)
- Armazenamento temporário do usuário em **Redux Toolkit** (sessão em memória)



### 2) Lista de Produtos (com Tabs)
- Integração com a API **DummyJSON** via **Axios**
- Navegação por abas:
  - **Masculino**
  - **Feminino**
- Carregamento de produtos por **subcategorias** (endpoints por categoria)
- Filtro por subcategoria dentro de cada aba
- Exibição de desconto (quando aplicável)

### 3) Detalhes do Produto
- Navegação passando o parâmetro **id** (rota com parâmetro)
- Consumo do endpoint de produto por **ID**
- Exibição:
  - Nome
  - Imagem
  - Preço com desconto (quando aplicável)
  - Preço original (tachado, quando há desconto)
  - Subcategoria (conforme retornado pela API)
  - Descrição
  - Marca
  - Avaliação
  - Estoque

### 4) Menu Sanduíche
- Alternância de tema:
  - ☀️ Claro
  - 🌙 Escuro
  - 🖥️ Sistema
- 🚪 Sair (logoff), retornando à tela de login e limpando estado em memória

---

## 🛠️ Tecnologias Utilizadas (revisado)

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/) (roteamento/navegação)
- [Axios](https://axios-http.com/) (requisições HTTP)
- [Redux Toolkit](https://redux-toolkit.js.org/) (gerenciamento de estado)
- [React Redux](https://react-redux.js.org/) (bindings do Redux para React)
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context) (SafeAreaView)

> Itens removidos por não estarem presentes no código fornecido:
> - React Navigation (o app usa **Expo Router** diretamente)
> - AsyncStorage (não há persistência implementada atualmente)
> - Expo Vector Icons (os ícones usados são emojis)

---

## 📡 API Utilizada

O projeto consome dados públicos da **DummyJSON**. Documentação disponível em: https://dummyjson.com/docs/

### Endpoints usados

- **Produtos por categoria**
  - `GET https://dummyjson.com/products/category/{categoria}`

- **Produto por ID**
  - `GET https://dummyjson.com/products/{id}`

### Subcategorias consideradas no app

**MASCULINO**
- `mens-shirts`
- `mens-shoes`
- `mens-watches`

**FEMININO**
- `womens-bags`
- `womens-dresses`
- `womens-jewellery`
- `womens-shoes`
- `womens-watches`

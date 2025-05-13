# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

  ## Antes de tudo:
  - Ter a versão LTS do Node.js instalada
  - usar npm ou yarn para instalar as dependências
  - Crie o arquivo .env

🚀 Tecnologias Utilizadas
* React: Biblioteca para construção de interfaces de usuário
* TypeScript: Superset de JavaScript com tipagem estática
* Vite: Build tool e servidor de desenvolvimento
* Tailwind CSS: Framework CSS para estilização
* Zustand: Gerenciamento de estado
* Axios: Cliente HTTP para consumo de APIs
* React Router DOM: Roteamento de páginas

  
📋 Funcionalidades
* Listagem de produtos com informações completas
* Formulário para cadastro de novos produtos
* Filtragem por nome e faixa de preço
* Ordenação por diferentes critérios
* Paginação para a lista de produtos
* Layout responsivo para diferentes dispositivos
* Formulario para castastro de novo usuários(Clientes)
* Login com as credencias de email e senha
* Compra de um ou varios produtos
* Dashoard(Admin) sendo que apenas o usuário com acesso de administrador pode acessar-lo.
  
🛠️ Estrutura do Projeto
src/
├── api/              # Para funções de chamada à API
├── components/       # Componentes reutilizáveis
├── pages/            # Páginas/Rotas da aplicação
├── store/            # Gerenciamento de estado (Zustand)
|-- interfaces/       # Tipagem
├── App.tsx           # Componente principal
├── main.tsx          # Ponto de entrada
.env                  # Variaveis do ambiente 

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

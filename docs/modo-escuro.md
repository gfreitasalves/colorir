# Modo escuro

- Estado `darkMode` em `App.jsx`, inicializado lendo `localStorage.getItem('colorir:darkMode')`.
- Um `useEffect` sincroniza esse estado com o DOM (`document.documentElement.classList.toggle('dark', darkMode)`) e persiste a escolha de volta em `localStorage` a cada mudança.
- O restante da aplicação usa as classes `dark:` do Tailwind CSS normalmente (fundo, texto, bordas de cada componente têm uma variante escura definida lado a lado com a clara).
- O botão de alternância fica no `Header`, mostrando "🌙 Escuro" ou "☀️ Claro" conforme o estado atual.

Por depender apenas de uma classe CSS e de `localStorage`, o modo escuro não interfere em nada relacionado ao canvas — a imagem original e a coloração do usuário aparecem exatamente iguais nos dois temas.

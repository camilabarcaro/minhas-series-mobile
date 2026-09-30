# Minhas Series

Aplicativo mobile para cadastrar, acompanhar e organizar series usando Expo, Expo Router, NativeWind e SQLite.

## Como executar

```bash
npm install
npx expo start --clear
```

O projeto usa Expo Router com as telas `index`, `form` e `detalhe`. Os dados sao persistidos localmente no SQLite.

## Diario do copiloto

### Registro 1 — Etapa 1
**O que eu pedi:** criar o projeto Expo TypeScript com Expo Router, SQLite e NativeWind.
**O que a IA sugeriu (resumo):** criar o projeto com `create-expo-app`, instalar dependencias compativeis com o SDK usando `npx expo install` e configurar os arquivos do NativeWind.
**O que eu fiz:** aceitei, porque essa estrutura correspondia ao que foi pedido na aula e deixou o projeto pronto para as etapas seguintes.

### Registro 2 — Etapa 2
**O que eu pedi:** criar os tipos `Serie`, `CreateSerieInput`, `UpdateSerieInput` e `SerieFilter`.
**O que a IA sugeriu (resumo):** separar a entidade completa dos dados de criacao, atualizacao e filtragem.
**O que eu fiz:** aceitei e revisei os campos para que `CreateSerieInput` nao tivesse `id`, `createdAt` nem `concluida`.

### Registro 3 — Etapa 3
**O que eu pedi:** criar a conexao SQLite como singleton e a migracao da tabela `series`.
**O que a IA sugeriu (resumo):** usar `openDatabaseSync` uma unica vez, guardar a conexao em uma variavel privada e executar WAL com `CREATE TABLE IF NOT EXISTS`.
**O que eu fiz:** aceitei, porque evita abrir varias conexoes e torna a migracao repetivel sem recriar a tabela.

### Registro 4 — Etapa 4
**O que eu pedi:** criar o repositorio com as seis operacoes de series e filtros resolvidos no SQL.
**O que a IA sugeriu (resumo):** usar `?` em todas as entradas variaveis, `lastInsertRowId` no cadastro e `ORDER BY createdAt DESC, id DESC` na listagem.
**O que eu fiz:** aceitei, porque mantem os valores parametrizados, evita SQL montado por interpolacao e garante a ordenacao mais recente primeiro.

### Registro 5 — Revisao conforme a rubrica
**O que eu pedi:** verificar se havia sugestoes contrarias ao conteudo da aula.
**O que a IA sugeriu (resumo):** inicialmente o contrato usava `boolean` para `concluida` e o repositorio convertia `0/1` para boolean.
**O que eu fiz:** corrigi e rejeitei essa sugestao, porque a rubrica exige `concluida: number` para representar o `INTEGER` do SQLite. O repositorio passou a trabalhar diretamente com `0` e `1`.

### Registro 6 — Correcao do NativeWind
**O que eu pedi:** investigar o erro `.plugins is not a valid Plugin property` ao abrir o app.
**O que a IA sugeriu (resumo):** mover `nativewind/babel` de `plugins` para `presets` e importar `global.css` antes do Router no layout.
**O que eu fiz:** aceitei e validei com `npx expo export --platform android`, porque o bundle Android passou a ser gerado sem o erro do Babel.

## Funcionalidades

- Cadastro e edicao de series na mesma tela.
- Filtros por todas, assistindo e concluidas.
- Avaliacao de uma a cinco estrelas.
- Marcacao de serie como concluida ou assistindo.
- Exclusao com confirmacao.
- Persistencia local com SQLite.

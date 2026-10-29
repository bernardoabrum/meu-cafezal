# Meu Cafezal

O Meu Cafezal é um sistema de gerenciamento de propriedades rurais focados na produção de cafeeira, baseado em georreferenciamento para melhorar a experiência, e atribuir as propriedades e talhões (subdivisões das lavouras de café, geralmente variando espaçamento, espécie, ou separado por estradas), informações importantes sobre a divisão, como área, número de plantas, nome e posição, e também informações sobre estatísticas de produção, que após terem informações lançadas pelo usuário, faz cálculos, gera gráficos e tabelas transformando dados brutos em visualização simples, que permite fazer comparações, extrair métricas, e acompanhar a evolução da lavoura. 

Este projeto foi criado e apresentado no meu Trabalho de Conclusão de Curso, após, continuei implementando melhorias e funcionalidades, e hoje utilizo para o gerenciamento das propriedades da família.

O projeto é criado com Vue.js, as os dados são armazenados no banco não relacional do firebase (Firestore).

## Como utilizar?

Basta acessar a url: [www.meu-cafezal.web.app](https://meu-cafezal.web.app), e realizar seu registro:

<img width="1917" height="918" alt="image" src="https://github.com/user-attachments/assets/6a065f65-3531-4740-9b6e-31853f077e47" />

Você irá se deparar com a página Home, com as opções de delimitar uma nova área, ver as propriedades antes demarcadas, ou acompanhar as estatísticas:

<img width="1919" height="901" alt="image" src="https://github.com/user-attachments/assets/aeb244d9-24b2-44fd-b313-5b15661fea03" />

Acredito que a seção de demarcar área é bem intuitiva, então seguimos para a tela de Visualização, onde você encontra um menu lateral que permite navegar mais facilmente pelas propriedades:

<img width="1911" height="928" alt="image" src="https://github.com/user-attachments/assets/f4eabdd2-5363-45f2-8331-2363a7ed050b" />

Ao selecionar uma área, você pode ver suas informações anteriormente preenchidas como nome, número de plantas calculado através dos dados informados e extraídos através da API do Google Maps, e espécie:

<img width="692" height="466" alt="image" src="https://github.com/user-attachments/assets/0ec870e9-db11-4649-af55-64fa9dda6ee7" />

Você também pode lançar uma nova quantidade de produção (No café, a colheita é feita ao longo de vários dias, então a ideia é que o usuário possa ir lançando na medida que for colhendo, e isso será somado ou total da produção daquele ano), ou editar as informações, e também pode ver informações das colheitas dos anos passados:

<img width="674" height="438" alt="image" src="https://github.com/user-attachments/assets/e30aa664-c5db-425d-b7f2-e2709d09d8e1" />

Ao selecionar uma área azul (Propriedade), você visualiza um modal de informações sobre a propriedade, que concentra e calcula informações de todos os talhões da propriedade, de acordo com o ano:

<img width="651" height="431" alt="image" src="https://github.com/user-attachments/assets/824baae3-4d95-43ae-b253-65a8b4c2562e" />

## Tela de estatísticas?

Por fim, temos a tela de estatísticas, que apresenta as informações concentradas de maneira visualmente mais simples filtradas por ano, separadas por propriedades, e também uma média geral da evolução:

<img width="1888" height="921" alt="image" src="https://github.com/user-attachments/assets/a41a5a3d-8443-44fa-af3f-86aa0200acee" />

Existe uma tabela de produtividade, que calcula a produtividade da produção por hectare, com base na quantidade de volumes lançados, e também estima a produtividade estimadas em sacas beneficiadas, com base em um estudo de redução após o processo de limpeza/descascamento:

<img width="1886" height="531" alt="image" src="https://github.com/user-attachments/assets/2d6ce4cb-a94c-436b-ade2-22bc84ac0ce7" />

Por fim, podemos acompanhar a distribuição da produção por talhão, de cada propriedade:

<img width="1887" height="642" alt="image" src="https://github.com/user-attachments/assets/bcd19ec3-a655-4358-8a4d-8bd12fcd017c" />






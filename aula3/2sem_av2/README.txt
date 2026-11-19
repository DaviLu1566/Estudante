AV1 - Carteira Digital de Vacinação Infantil - Suécia
=====================================================

COMO EXECUTAR
1. Abra esta pasta no VS Code.
2. Execute index.html com a extensão Live Server.
3. O arquivo vaccinationsprogram.json é carregado via fetch, por isso o Live Server é recomendado.

MISSÕES IMPLEMENTADAS
1. Adaptação para a Suécia: idioma sueco, bandeira sueca, identidade visual azul/amarelo e calendário sueco.
2. Validação de documento: personnummer sueco com validação do dígito de controle (módulo 10/Luhn) e conferência com a data de nascimento.
3. Alertas de atraso: doses vencidas pela idade são marcadas automaticamente como "Försenad".
4. Persistência: a carteirinha é salva em localStorage e também baixada como arquivo JSON.

MASCOTE
Foi usado apenas um mascote: assets/mascote.png, conforme solicitado.

FONTES OFICIAIS USADAS
- Folkhälsomyndigheten: programa sueco de vacinação infantil.
- Skatteverket: estrutura e dígito de controle do personnummer.

OBSERVAÇÃO
Não foi criado um equivalente fictício ao Cartão SUS, pois a Suécia não possui um identificador nacional de saúde diretamente equivalente. O personnummer é o identificador nacional usado na adaptação.

use esses dados para testar.
01/01/2010
100101-0006

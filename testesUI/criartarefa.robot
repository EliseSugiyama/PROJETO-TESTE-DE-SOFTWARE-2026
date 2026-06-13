*** Settings ***
Library           SeleniumLibrary
Suite Setup       Dado que o usuario esta autenticado e acessa o painel
Suite Teardown    E fecha o navegador

*** Variables ***
${URL_LOGIN}        http://localhost:3000
${URL_HOME}         http://localhost:3000/home
${BROWSER}          chrome
${EMAIL_LOGIN}      ana.costa@teste.com
${SENHA_LOGIN}      123456
${BTN_NOVA}         id=open-modal-btn
${MODAL}            id=appointment-modal
${INPUT_TITULO}     id=app-title
${SELECT_TIPO}      id=app-tipo
${INPUT_HORARIO}    id=app-time
${INPUT_LOCAL}      id=app-agent
${INPUT_RESP}       id=app-responsible
${BTN_SALVAR}       css=#appointment-form button[type="submit"]

*** Test Cases ***
CT01 - Deve criar consulta com todos os campos preenchidos
    Dado que o usuario abre o modal de nova consulta
    E informa o titulo              Consulta com cardiologista
    E seleciona o tipo              Consulta
    E informa o horario             10:00
    E informa o medico local        Clinica Toda Vida
    E informa o responsavel         irmao
    Quando salvar a consulta
    Entao o modal deve fechar

CT02 - Deve criar consulta com campos minimos obrigatorios
    Dado que o usuario abre o modal de nova consulta
    E informa o titulo              Exame de sangue
    E seleciona o tipo              Exame
    E informa o horario             08:00
    Quando salvar a consulta
    Entao o modal deve fechar

CT03 - Deve validar tipo obrigatorio
    Dado que o usuario abre o modal de nova consulta
    E informa o titulo              Consulta sem tipo
    E nao seleciona o tipo
    E informa o horario             09:00
    Quando salvar a consulta
    Entao o modal deve permanecer aberto
    E o campo tipo deve ser invalido

CT04 - Deve validar titulo obrigatorio
    Dado que o usuario abre o modal de nova consulta
    E nao informa o titulo
    E seleciona o tipo              Consulta
    E informa o horario             09:00
    Quando salvar a consulta
    Entao o modal deve permanecer aberto
    E o campo titulo deve ser invalido

CT05 - Deve validar horario obrigatorio
    Dado que o usuario abre o modal de nova consulta
    E informa o titulo              Consulta sem horario
    E seleciona o tipo              Consulta
    E nao informa o horario
    Quando salvar a consulta
    Entao o modal deve permanecer aberto
    E o campo horario deve ser invalido

*** Keywords ***
Dado que o usuario esta autenticado e acessa o painel
    Open Browser    ${URL_LOGIN}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    id=login-form       timeout=10s
    Input Text                       id=login-email      ${EMAIL_LOGIN}
    Input Password                   id=login-password   ${SENHA_LOGIN}
    Click Button                     css=#login-form button[type="submit"]
    Sleep    2s
    ${alert}=    Run Keyword And Return Status    Alert Should Be Present    timeout=2s
    Run Keyword If    ${alert}    Handle Alert    ACCEPT
    Run Keyword If    ${alert}    Fail    Login falhou — verifique email e senha nas variaveis do arquivo
    Wait Until Location Contains     /home               timeout=10s

Dado que o usuario abre o modal de nova consulta
    Wait Until Element Is Visible    ${BTN_NOVA}         timeout=10s
    Click Button                     ${BTN_NOVA}
    Wait Until Element Is Visible    ${MODAL}            timeout=5s
    Clear Element Text               ${INPUT_TITULO}
    Select From List By Value        ${SELECT_TIPO}      ${EMPTY}
    Execute Javascript               document.getElementById('app-time').value = ''

E informa o titulo
    [Arguments]    ${titulo}
    Input Text    ${INPUT_TITULO}    ${titulo}

E nao informa o titulo
    Clear Element Text    ${INPUT_TITULO}

E seleciona o tipo
    [Arguments]    ${tipo}
    Select From List By Label    ${SELECT_TIPO}    ${tipo}

E nao seleciona o tipo
    Select From List By Value    ${SELECT_TIPO}    ${EMPTY}

E informa o horario
    [Arguments]    ${horario}
    Execute Javascript    document.getElementById('app-time').value = '${horario}'

E nao informa o horario
    Execute Javascript    document.getElementById('app-time').value = ''

E informa o medico local
    [Arguments]    ${local}
    Input Text    ${INPUT_LOCAL}    ${local}

E informa o responsavel
    [Arguments]    ${responsavel}
    Input Text    ${INPUT_RESP}    ${responsavel}

Quando salvar a consulta
    Click Button    ${BTN_SALVAR}
    Sleep           1s

Entao o modal deve fechar
    Wait Until Element Is Not Visible    ${MODAL}    timeout=5s

Entao o modal deve permanecer aberto
    Element Should Be Visible    ${MODAL}

E o campo titulo deve ser invalido
    ${valid}=    Execute Javascript    return document.getElementById('app-title').validity.valid
    Should Be Equal    '${valid}'    'False'

E o campo tipo deve ser invalido
    ${valid}=    Execute Javascript    return document.getElementById('app-tipo').validity.valid
    Should Be Equal    '${valid}'    'False'

E o campo horario deve ser invalido
    ${valid}=    Execute Javascript    return document.getElementById('app-time').validity.valid
    Should Be Equal    '${valid}'    'False'

E fecha o navegador
    Close Browser

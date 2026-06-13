*** Settings ***
Library           SeleniumLibrary
Suite Setup       Dado que o usuario acessa a tela de cadastro
Suite Teardown    E fecha o navegador

*** Variables ***
${URL}            http://localhost:3000/cadastro
${BROWSER}        chrome
${INPUT_NOME}     id=reg-name
${INPUT_EMAIL}    id=reg-email
${INPUT_SENHA}    id=reg-password
${BTN_CADASTRAR}  css=#cadastro-form button[type="submit"]

*** Test Cases ***
CT01 - Deve realizar cadastro com dados validos
    Dado que o usuario limpa os campos
    E informa o nome                Ana Costa
    E informa o email               ana.costa@teste.com
    E informa a senha               123456
    Quando solicitar o cadastro
    Entao o sistema nao deve exibir erro de validacao

CT02 - Deve validar nome obrigatorio
    Dado que o usuario limpa os campos
    E informa o nome                ${EMPTY}
    E informa o email               sem.nome@teste.com
    E informa a senha               123456
    Quando solicitar o cadastro
    Entao o campo nome deve ser invalido

CT03 - Deve validar email obrigatorio
    Dado que o usuario limpa os campos
    E informa o nome                Ana Costa
    E informa o email               ${EMPTY}
    E informa a senha               123456
    Quando solicitar o cadastro
    Entao o campo email deve ser invalido

CT04 - Deve validar senha obrigatoria
    Dado que o usuario limpa os campos
    E informa o nome                Ana Costa
    E informa o email               sem.senha@teste.com
    E informa a senha               ${EMPTY}
    Quando solicitar o cadastro
    Entao o campo senha deve ser invalido

CT05 - Deve validar senha com menos de 6 caracteres
    Dado que o usuario limpa os campos
    E informa o nome                Ana Costa
    E informa o email               senha.curta@teste.com
    E informa a senha               123
    Quando solicitar o cadastro
    Entao o campo senha deve ser invalido

*** Keywords ***
Dado que o usuario acessa a tela de cadastro
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    id=cadastro-form    timeout=10s

Dado que o usuario limpa os campos
    Go To           ${URL}
    Wait Until Element Is Visible    id=cadastro-form    timeout=10s

E informa o nome
    [Arguments]    ${nome}=${EMPTY}
    Clear Element Text    ${INPUT_NOME}
    Run Keyword If    '${nome}' != '${EMPTY}'    Input Text    ${INPUT_NOME}    ${nome}

E informa o email
    [Arguments]    ${email}=${EMPTY}
    Clear Element Text    ${INPUT_EMAIL}
    Run Keyword If    '${email}' != '${EMPTY}'    Input Text    ${INPUT_EMAIL}    ${email}

E informa a senha
    [Arguments]    ${senha}=${EMPTY}
    Clear Element Text    ${INPUT_SENHA}
    Run Keyword If    '${senha}' != '${EMPTY}'    Input Password    ${INPUT_SENHA}    ${senha}

Quando solicitar o cadastro
    Click Button    ${BTN_CADASTRAR}

Entao o sistema nao deve exibir erro de validacao
    Sleep    1s
    ${alert_present}=    Run Keyword And Return Status    Alert Should Be Present
    Run Keyword If    ${alert_present}    Handle Alert    ACCEPT
    Run Keyword Unless    ${alert_present}    Page Should Not Contain Element    css=input:invalid

Entao o campo nome deve ser invalido
    Element Should Be Visible         ${INPUT_NOME}
    ${valid}=    Execute Javascript    return document.getElementById('reg-name').validity.valid
    Should Be Equal    '${valid}'     'False'

Entao o campo email deve ser invalido
    Element Should Be Visible         ${INPUT_EMAIL}
    ${valid}=    Execute Javascript    return document.getElementById('reg-email').validity.valid
    Should Be Equal    '${valid}'     'False'

Entao o campo senha deve ser invalido
    Element Should Be Visible         ${INPUT_SENHA}
    ${valid}=    Execute Javascript    return document.getElementById('reg-password').validity.valid
    Should Be Equal    '${valid}'     'False'

E fecha o navegador
    Close Browser

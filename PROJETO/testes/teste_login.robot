*** Settings ***
Library    SeleniumLibrary

Suite Setup       Dado que o usuário acessa a tela de login
Suite Teardown    Fechar o navegador

*** Variables ***
${URL}              http://localhost:3000/html/index.html
${BROWSER}          chrome

${INPUT_EMAIL}      id=login-email
${INPUT_SENHA}      id=login-password
${BOTAO_LOGIN}      css=#login-form button[type="submit"]

# Usuário pré-cadastrado via seed ou cadastro manual antes de rodar os testes
${EMAIL_VALIDO}     ana.teste@sistemagenda.com
${SENHA_VALIDA}     senha123
${SENHA_ERRADA}     senhaERRADA

*** Test Cases ***

CT-L01 - Login com dados válidos deve redirecionar para home
    Dado que o usuário informa o email       ${EMAIL_VALIDO}
    E informa a senha                        ${SENHA_VALIDA}
    Quando clicar em Entrar no Painel
    Então deve ser redirecionado para        home.html

CT-L02 - Login com e-mail em branco deve bloquear envio
    Dado que o usuário informa o email       ${EMPTY}
    E informa a senha                        ${SENHA_VALIDA}
    Quando clicar em Entrar no Painel
    Então o campo de e-mail deve ser inválido

CT-L03 - Login com senha em branco deve bloquear envio
    Dado que o usuário informa o email       ${EMAIL_VALIDO}
    E informa a senha                        ${EMPTY}
    Quando clicar em Entrar no Painel
    Então o campo de senha deve ser inválido

CT-L04 - Login com senha incorreta deve exibir alerta de erro
    Dado que o usuário informa o email       ${EMAIL_VALIDO}
    E informa a senha                        ${SENHA_ERRADA}
    Quando clicar em Entrar no Painel
    Então deve aparecer um alerta de erro

*** Keywords ***

Dado que o usuário acessa a tela de login
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Title Should Be    Login - Dashboard

Dado que o usuário informa o email
    [Arguments]    ${email}
    Clear Element Text    ${INPUT_EMAIL}
    Input Text            ${INPUT_EMAIL}    ${email}

E informa a senha
    [Arguments]    ${senha}
    Clear Element Text    ${INPUT_SENHA}
    Input Password        ${INPUT_SENHA}    ${senha}

Quando clicar em Entrar no Painel
    Click Button    ${BOTAO_LOGIN}

Então deve ser redirecionado para
    [Arguments]    ${pagina}
    Wait Until Location Contains    ${pagina}    timeout=5s

Então o campo de e-mail deve ser inválido
    ${valido}=    Execute Javascript    return document.getElementById('login-email').validity.valid
    Should Be Equal    ${valido}    ${False}

Então o campo de senha deve ser inválido
    ${valido}=    Execute Javascript    return document.getElementById('login-password').validity.valid
    Should Be Equal    ${valido}    ${False}

Então deve aparecer um alerta de erro
    Handle Alert    action=ACCEPT    timeout=5s

Fechar o navegador
    Close Browser

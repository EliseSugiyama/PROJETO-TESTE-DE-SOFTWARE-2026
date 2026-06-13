*** Settings ***
Library           SeleniumLibrary
Test Setup        Abrir Página de Login
Test Teardown     Close Browser

*** Variables ***
${URL}              http://localhost:3000
${BROWSER}          chrome

${INPUT_EMAIL}      id=login-email
${INPUT_SENHA}      id=login-password
${BOTAO_LOGIN}      css=.btn-primary

${EMAIL_VALIDO}     user@email.com
${SENHA_VALIDA}     123456

${PAGINA}           http://localhost:3000/home

*** Keywords ***
Abrir Página de Login
    Open Browser              ${URL}      ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s

Verificar Mensagem de Erro
    [Arguments]    ${mensagem}
    Wait Until Page Contains    ${mensagem}    timeout=5s

*** Test Cases ***
CT01 - Login com credenciais válidas
    Open Browser     ${URL}    ${BROWSER}
    Maximize Browser Window
    Title Should Be     FamilyCare — Login
    Clear Element Text    ${INPUT_EMAIL}
    Input Text       ${INPUT_EMAIL}    ${EMAIL_VALIDO}
    Clear Element Text     ${INPUT_SENHA}
    Input Password    ${INPUT_SENHA}    ${SENHA_VALIDA}
    Click Button    ${BOTAO_LOGIN}
    Wait Until Location Contains    ${pagina}    timeout=5s

CT02 - Campo EMAIL vazio
    Open Browser     ${URL}    ${BROWSER}
    Maximize Browser Window
    Title Should Be     FamilyCare — Login
    Clear Element Text     ${INPUT_SENHA}
    Input Password    ${INPUT_SENHA}    ${SENHA_VALIDA}
    Click Button    ${BOTAO_LOGIN}
    ${valido}=    Execute Javascript    return document.getElementById('login-email').validity.valid
    Should Be Equal    ${valido}    ${False}

CT03 - Campo SENHA vazio
    Open Browser     ${URL}    ${BROWSER}
    Maximize Browser Window
    Title Should Be     FamilyCare — Login
    Clear Element Text    ${INPUT_EMAIL}
    Input Text       ${INPUT_EMAIL}    ${EMAIL_VALIDO}
    Click Button    ${BOTAO_LOGIN}
    ${valido}=    Execute Javascript    return document.getElementById('login-password').validity.valid
    Should Be Equal    ${valido}    ${False}
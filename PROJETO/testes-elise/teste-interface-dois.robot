*** Settings ***
Library           SeleniumLibrary
Test Setup        Abrir Página de Cadastro
Test Teardown     Close Browser

*** Variables ***
${URL}              http://localhost:3000/cadastro
${BROWSER}          chrome

${INPUT_NOME}       id=reg-name
${INPUT_EMAIL}      id=reg-email
${INPUT_SENHA}      id=reg-password
${BOTAO_CADASTRO}   css=.btn-primary

${NOME_VALIDO}      Nome Sobrenome
${EMAIL_VALIDO}     user2@email.com
${EMAIL_CADASTRADO}    email.jaCadastrado@email.com
${SENHA_VALIDA}     123456
${SENHA_CURTA}      00

${PAGINA}           http://localhost:3000/home
${PAGINA_LOGIN}     http://localhost:3000

*** Keywords ***
Abrir Página de Cadastro
    Open Browser              ${URL}      ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_NOME}    10s

*** Test Cases ***
CT01 - Cadastro com credenciais válidas
    Title Should Be     FamilyCare — Cadastro
    Clear Element Text    ${INPUT_NOME}
    Input Text        ${INPUT_NOME}     ${NOME_VALIDO}
    Clear Element Text    ${INPUT_EMAIL}
    Input Text        ${INPUT_EMAIL}    ${EMAIL_VALIDO}
    Clear Element Text    ${INPUT_SENHA}
    Input Password    ${INPUT_SENHA}    ${SENHA_VALIDA}
    Click Button      ${BOTAO_CADASTRO}
    ${alerta}=    Handle Alert    action=ACCEPT
    Should Contain    ${alerta}    Conta criada com sucesso! Faca login para continuar.
    Wait Until Location Contains    ${PAGINA_LOGIN}    timeout=5s

CT02 - Campo NOME vazio
    Title Should Be     FamilyCare — Cadastro
    Clear Element Text    ${INPUT_EMAIL}
    Input Text        ${INPUT_EMAIL}    ${EMAIL_VALIDO}
    Clear Element Text    ${INPUT_SENHA}
    Input Password    ${INPUT_SENHA}    ${SENHA_VALIDA}
    Click Button      ${BOTAO_CADASTRO}
    ${valido}=    Execute Javascript    return document.getElementById('reg-name').validity.valid
    Should Be Equal    ${valido}    ${False}

CT03 - Campo EMAIL vazio
    Title Should Be     FamilyCare — Cadastro
    Clear Element Text    ${INPUT_NOME}
    Input Text        ${INPUT_NOME}     ${NOME_VALIDO}
    Clear Element Text    ${INPUT_SENHA}
    Input Password    ${INPUT_SENHA}    ${SENHA_VALIDA}
    Click Button      ${BOTAO_CADASTRO}
    ${valido}=    Execute Javascript    return document.getElementById('reg-email').validity.valid
    Should Be Equal    ${valido}    ${False}

CT04 - Formato de EMAIL inválido
    Title Should Be     FamilyCare — Cadastro
    Clear Element Text    ${INPUT_NOME}
    Input Text        ${INPUT_NOME}     ${NOME_VALIDO}
    Clear Element Text    ${INPUT_EMAIL}
    Input Text        ${INPUT_EMAIL}    user.email.com
    Clear Element Text    ${INPUT_SENHA}
    Input Password    ${INPUT_SENHA}    ${SENHA_VALIDA}
    Click Button      ${BOTAO_CADASTRO}
    ${valido}=    Execute Javascript    return document.getElementById('reg-email').validity.valid
    Should Be Equal    ${valido}    ${False}

CT05 - Email indisponível (já cadastrado)
    Title Should Be     FamilyCare — Cadastro
    Clear Element Text    ${INPUT_NOME}
    Input Text        ${INPUT_NOME}     ${NOME_VALIDO}
    Clear Element Text    ${INPUT_EMAIL}
    Input Text        ${INPUT_EMAIL}    ${EMAIL_CADASTRADO}
    Clear Element Text    ${INPUT_SENHA}
    Input Password    ${INPUT_SENHA}    ${SENHA_VALIDA}
    Click Button      ${BOTAO_CADASTRO}
    ${alerta}=    Handle Alert    action=ACCEPT
    Should Contain    ${alerta}    E-mail já cadastrado.

CT06 - Campo SENHA vazio
    Title Should Be     FamilyCare — Cadastro
    Clear Element Text    ${INPUT_NOME}
    Input Text        ${INPUT_NOME}     ${NOME_VALIDO}
    Clear Element Text    ${INPUT_EMAIL}
    Input Text        ${INPUT_EMAIL}    ${EMAIL_VALIDO}
    Click Button      ${BOTAO_CADASTRO}
    ${valido}=    Execute Javascript    return document.getElementById('reg-password').validity.valid
    Should Be Equal    ${valido}    ${False}

CT07 - Senha inválida (menos de 6 caracteres)
    Title Should Be     FamilyCare — Cadastro
    Clear Element Text    ${INPUT_NOME}
    Input Text        ${INPUT_NOME}     ${NOME_VALIDO}
    Clear Element Text    ${INPUT_EMAIL}
    Input Text        ${INPUT_EMAIL}    ${EMAIL_VALIDO}
    Clear Element Text    ${INPUT_SENHA}
    Input Password    ${INPUT_SENHA}    ${SENHA_CURTA}
    Click Button      ${BOTAO_CADASTRO}
    ${valido}=    Execute Javascript    return document.getElementById('reg-password').validity.valid
    Should Be Equal    ${valido}    ${False}
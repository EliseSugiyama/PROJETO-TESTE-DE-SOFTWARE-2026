*** Settings ***
Library    SeleniumLibrary

Suite Setup       Dado que o usuário acessa a tela de cadastro
Suite Teardown    Fechar o navegador

*** Variables ***
${URL}                  http://localhost:3000/html/cadastro.html
${BROWSER}              chrome

${INPUT_NOME}           id=reg-name
${INPUT_EMAIL}          id=reg-email
${INPUT_SENHA}          id=reg-password
${CHECKBOX_TERMOS}      id=reg-terms
${BOTAO_CADASTRAR}      css=#cadastro-form button[type="submit"]

*** Test Cases ***

CT-C01 - Cadastro com dados válidos deve redirecionar para login
    Dado que o usuário informa o nome    Teste Robot
    E informa o email                    robot.ct01@sistemagenda.com
    E informa a senha                    senha123
    E aceita os termos
    Quando clicar em Concluir Cadastro
    Então deve ser redirecionado para    index.html

CT-C02 - Cadastro sem nome deve bloquear envio
    Dado que o usuário informa o nome    ${EMPTY}
    E informa o email                    robot.ct02@sistemagenda.com
    E informa a senha                    senha123
    E aceita os termos
    Quando clicar em Concluir Cadastro
    Então o campo de nome deve ser inválido

CT-C03 - Cadastro com senha abaixo do mínimo deve bloquear envio
    Dado que o usuário informa o nome    Teste Robot
    E informa o email                    robot.ct03@sistemagenda.com
    E informa a senha                    12345
    E aceita os termos
    Quando clicar em Concluir Cadastro
    Então o campo de senha deve ser inválido por comprimento mínimo

CT-C04 - Cadastro sem aceitar os termos deve bloquear envio
    Dado que o usuário informa o nome    Teste Robot
    E informa o email                    robot.ct04@sistemagenda.com
    E informa a senha                    senha123
    Quando clicar em Concluir Cadastro
    Então o checkbox de termos deve ser inválido

*** Keywords ***

Dado que o usuário acessa a tela de cadastro
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Title Should Be    Cadastro - Dashboard

Dado que o usuário informa o nome
    [Arguments]    ${nome}
    Clear Element Text    ${INPUT_NOME}
    Input Text            ${INPUT_NOME}    ${nome}

E informa o email
    [Arguments]    ${email}
    Clear Element Text    ${INPUT_EMAIL}
    Input Text            ${INPUT_EMAIL}    ${email}

E informa a senha
    [Arguments]    ${senha}
    Clear Element Text    ${INPUT_SENHA}
    Input Password        ${INPUT_SENHA}    ${senha}

E aceita os termos
    Select Checkbox    ${CHECKBOX_TERMOS}

Quando clicar em Concluir Cadastro
    Click Button    ${BOTAO_CADASTRAR}

Então deve ser redirecionado para
    [Arguments]    ${pagina}
    Wait Until Location Contains    ${pagina}    timeout=5s

Então o campo de nome deve ser inválido
    ${valido}=    Execute Javascript    return document.getElementById('reg-name').validity.valid
    Should Be Equal    ${valido}    ${False}

Então o campo de senha deve ser inválido por comprimento mínimo
    ${valido}=    Execute Javascript    return document.getElementById('reg-password').validity.valid
    Should Be Equal    ${valido}    ${False}

Então o checkbox de termos deve ser inválido
    ${valido}=    Execute Javascript    return document.getElementById('reg-terms').validity.valid
    Should Be Equal    ${valido}    ${False}

Fechar o navegador
    Close Browser

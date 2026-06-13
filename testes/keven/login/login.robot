*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}              http://localhost:3000
${BROWSER}          chrome
${INPUT_EMAIL}      id=login-email
${INPUT_SENHA}      id=login-password
${BOTAO_LOGIN}      css=.btn-primary

*** Test Cases ***
CT01 - Login com credenciais validas
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text        ${INPUT_EMAIL}    keven@gmail.com
    Input Password    ${INPUT_SENHA}    123456
    Click Button      ${BOTAO_LOGIN}
    Sleep    2s
    Location Should Contain    localhost:3000
    Close Browser

CT02 - Login com senha incorreta
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text        ${INPUT_EMAIL}    keven@gmail.com
    Input Password    ${INPUT_SENHA}    senhaerrada
    Click Button      ${BOTAO_LOGIN}
    Handle Alert      action=ACCEPT
    Location Should Contain    localhost:3000
    Close Browser

CT03 - Login com email nao cadastrado
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text        ${INPUT_EMAIL}    naoexiste@gmail.com
    Input Password    ${INPUT_SENHA}    123456
    Click Button      ${BOTAO_LOGIN}
    Handle Alert      action=ACCEPT
    Location Should Contain    localhost:3000
    Close Browser

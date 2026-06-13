*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL_LOGIN}        http://localhost:3000
${URL_PERFIL}       http://localhost:3000/configuracoes
${BROWSER}          chrome
${INPUT_EMAIL}      id=login-email
${INPUT_SENHA}      id=login-password
${BOTAO_LOGIN}      css=.btn-primary
${INPUT_NOME}       id=user-name-input
${INPUT_SUB}        id=user-role-input
${BOTAO_SALVAR}     xpath=//button[contains(text(),'Salvar')]

*** Keywords ***
Abrir Chrome Sem Popups
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys
    Call Method    ${options}    add_argument    --disable-save-password-bubble
    Call Method    ${options}    add_argument    --disable-notifications
    Call Method    ${options}    add_argument    --disable-password-manager-reauthentication
    Call Method    ${options}    add_argument    --no-first-run
    Call Method    ${options}    add_argument    --disable-default-apps
    ${prefs}=    Create Dictionary
    ...    credentials_enable_service=${False}
    ...    credentials_enable_autosign=${False}
    ...    profile.password_manager_enabled=${False}
    ...    profile.password_manager_leak_detection=${False}
    Call Method    ${options}    add_experimental_option    prefs    ${prefs}
    Create Webdriver    Chrome    options=${options}
    Go To    ${URL_LOGIN}
    Maximize Browser Window

*** Test Cases ***
CT01 - Atualizar perfil com dados validos
    Abrir Chrome Sem Popups
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text        ${INPUT_EMAIL}    keven@gmail.com
    Input Password    ${INPUT_SENHA}    123456
    Click Button      ${BOTAO_LOGIN}
    Sleep    2s
    Go To    ${URL_PERFIL}
    Wait Until Element Is Visible    ${INPUT_NOME}    10s
    Clear Element Text    ${INPUT_NOME}
    Input Text    ${INPUT_NOME}    Keven Régio
    Clear Element Text    ${INPUT_SUB}
    Input Text    ${INPUT_SUB}    FamilyCare
    Click Button    ${BOTAO_SALVAR}
    Sleep    3s
    Handle Alert    action=ACCEPT    timeout=10s
    Close Browser

CT02 - Atualizar perfil com nome vazio
    Abrir Chrome Sem Popups
    Wait Until Element Is Visible    ${INPUT_EMAIL}    10s
    Input Text        ${INPUT_EMAIL}    keven@gmail.com
    Input Password    ${INPUT_SENHA}    123456
    Click Button      ${BOTAO_LOGIN}
    Sleep    2s
    Go To    ${URL_PERFIL}
    Wait Until Element Is Visible    ${INPUT_NOME}    10s
    Clear Element Text    ${INPUT_NOME}
    Input Text    ${INPUT_NOME}    ${EMPTY}
    Clear Element Text    ${INPUT_SUB}
    Input Text    ${INPUT_SUB}    FamilyCare
    Click Button    ${BOTAO_SALVAR}
    Sleep    2s
    Location Should Contain    configuracoes
    Close Browser

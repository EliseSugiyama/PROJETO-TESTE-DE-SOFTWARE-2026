*** Settings ***
Library    SeleniumLibrary

Suite Setup       Dado que o usuário acessa o formulário de edição
Suite Teardown    E fecha o navegador

*** Variables ***
${URL_LOGIN}          http://localhost:3000/login
${URL_EDITAR}         http://localhost:3000/consultas/1/editar
${BROWSER}            chrome

${INPUT_EMAIL}        id=email
${INPUT_SENHA}        id=senha
${BOTAO_LOGIN}        id=btnLogin

${INPUT_DATA}         id=dataConsulta
${INPUT_HORARIO}      id=horario
${INPUT_ESPECIALIDADE}    id=especialidade
${INPUT_MEDICO}       id=nomeMedico
${CHECK_EXAMES}       id=examesPendentes
${BOTAO_SALVAR}       id=btnSalvar
${MENSAGEM}           id=mensagem
${ERRO_DATA}          id=erroData
${ERRO_HORARIO}       id=erroHorario

${EMAIL_VALIDO}       usuario@familycare.com
${SENHA_VALIDA}       senha123

*** Test Cases ***

CT01 - Deve salvar consulta com dados válidos completos
    Dado que o usuário está logado no sistema
    E acessa o formulário de edição da consulta
    Quando preencher a data com    2026-06-20
    E preencher o horário com    14:00
    E preencher a especialidade com    Cardiologia
    E preencher o nome do médico com    Dr. Carlos Lima
    E marcar exames pendentes
    E clicar em Salvar alterações
    Então o sistema deve exibir a mensagem    Consulta atualizada com sucesso

CT02 - Deve exibir erro para data passada
    Dado que o usuário está logado no sistema
    E acessa o formulário de edição da consulta
    Quando preencher a data com    2026-06-01
    E preencher o horário com    14:00
    E clicar em Salvar alterações
    Então o campo data deve exibir o erro    Data deve ser futura

CT03 - Deve exibir erro para data vazia
    Dado que o usuário está logado no sistema
    E acessa o formulário de edição da consulta
    Quando deixar o campo data vazio
    E preencher o horário com    14:00
    E clicar em Salvar alterações
    Então o campo data deve exibir o erro    Campo obrigatório

CT04 - Deve exibir erro para horário inválido
    Dado que o usuário está logado no sistema
    E acessa o formulário de edição da consulta
    Quando preencher a data com    2026-06-20
    E preencher o horário com    25:99
    E clicar em Salvar alterações
    Então o campo horário deve exibir o erro    Horário inválido

CT05 - Deve exibir erro para horário vazio
    Dado que o usuário está logado no sistema
    E acessa o formulário de edição da consulta
    Quando preencher a data com    2026-06-20
    E deixar o campo horário vazio
    E clicar em Salvar alterações
    Então o campo horário deve exibir o erro    Campo obrigatório

*** Keywords ***

Dado que o usuário acessa o formulário de edição
    Open Browser    ${URL_LOGIN}    ${BROWSER}
    Maximize Browser Window

Dado que o usuário está logado no sistema
    Go To    ${URL_LOGIN}
    Input Text    ${INPUT_EMAIL}    ${EMAIL_VALIDO}
    Input Password    ${INPUT_SENHA}    ${SENHA_VALIDA}
    Click Button    ${BOTAO_LOGIN}
    Wait Until Page Contains    Bem-vindo    timeout=5s

E acessa o formulário de edição da consulta
    Go To    ${URL_EDITAR}
    Wait Until Page Contains Element    ${INPUT_DATA}    timeout=5s

Quando preencher a data com
    [Arguments]    ${data}
    Clear Element Text    ${INPUT_DATA}
    Input Text    ${INPUT_DATA}    ${data}

E preencher o horário com
    [Arguments]    ${horario}
    Clear Element Text    ${INPUT_HORARIO}
    Input Text    ${INPUT_HORARIO}    ${horario}

E preencher a especialidade com
    [Arguments]    ${especialidade}
    Input Text    ${INPUT_ESPECIALIDADE}    ${especialidade}

E preencher o nome do médico com
    [Arguments]    ${medico}
    Input Text    ${INPUT_MEDICO}    ${medico}

E marcar exames pendentes
    Select Checkbox    ${CHECK_EXAMES}

E clicar em Salvar alterações
    Click Button    ${BOTAO_SALVAR}

Então o sistema deve exibir a mensagem
    [Arguments]    ${mensagem}
    Wait Until Element Is Visible    ${MENSAGEM}    timeout=5s
    Element Text Should Be    ${MENSAGEM}    ${mensagem}

Então o campo data deve exibir o erro
    [Arguments]    ${erro}
    Wait Until Element Is Visible    ${ERRO_DATA}    timeout=5s
    Element Text Should Be    ${ERRO_DATA}    ${erro}

Então o campo horário deve exibir o erro
    [Arguments]    ${erro}
    Wait Until Element Is Visible    ${ERRO_HORARIO}    timeout=5s
    Element Text Should Be    ${ERRO_HORARIO}    ${erro}

Quando deixar o campo data vazio
    Clear Element Text    ${INPUT_DATA}

E deixar o campo horário vazio
    Clear Element Text    ${INPUT_HORARIO}

E fecha o navegador
    Close Browser

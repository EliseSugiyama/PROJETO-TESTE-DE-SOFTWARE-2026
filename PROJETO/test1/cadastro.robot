*** Settings ***
Library    SeleniumLibrary

Suite Setup       Abrir Navegador
Suite Teardown    Fechar Navegador

*** Variables ***
${URL_BASE}             http://localhost:3000
${URL_CONFIG}           http://localhost:3000/configuracoes
${BROWSER}              chrome

# Credenciais — troque para um usuario real do seu banco
${USUARIO_ID}           1
${USUARIO_NOME}         Marco
${USUARIO_EMAIL}        Marco@email.com
${USUARIO_SUBTITULO}    FamilyCare

# Seletores — Configuracoes
${INPUT_NOME}           id=user-name-input
${INPUT_SUBTITULO}      id=user-role-input
${BOTAO_SALVAR}         css=#settings-form button[type="submit"]
${DISPLAY_NOME}         id=profile-name-display
${DISPLAY_SUBTITULO}    id=profile-role-display
${DISPLAY_AVATAR}       id=profile-avatar
${BOTAO_LOGOUT}         id=logout-btn

*** Test Cases ***

CT01 - Deve carregar a pagina de configuracoes apos autenticacao
    [Documentation]    Verifica que a pagina de configuracoes carrega corretamente para usuario autenticado
    Autenticar Via SessionStorage
    Go To    ${URL_CONFIG}
    Wait Until Element Is Visible    ${INPUT_NOME}    timeout=5s
    Title Should Be    FamilyCare — Configuracoes

CT02 - Deve exibir o nome atual do usuario no formulario
    [Documentation]    Verifica que o campo nome esta pre-preenchido com os dados do usuario logado
    Autenticar Via SessionStorage
    Go To    ${URL_CONFIG}
    Wait Until Element Is Visible    ${INPUT_NOME}    timeout=5s
    ${valor}=    Get Value    ${INPUT_NOME}
    Should Not Be Empty    ${valor}

CT03 - Deve atualizar o nome exibido na sidebar ao salvar
    [Documentation]    Verifica que salvar alteracoes atualiza o perfil na barra lateral
    Autenticar Via SessionStorage
    Go To    ${URL_CONFIG}
    Wait Until Element Is Visible    ${INPUT_NOME}    timeout=5s
    Clear Element Text    ${INPUT_NOME}
    Input Text    ${INPUT_NOME}    Nome Atualizado Robot
    Click Button    ${BOTAO_SALVAR}
    Handle Alert    action=ACCEPT
    ${nome_sidebar}=    Get Text    ${DISPLAY_NOME}
    Should Contain    ${nome_sidebar}    Nome Atualizado Robot

CT04 - Deve atualizar o subtitulo exibido na sidebar ao salvar
    [Documentation]    Verifica que o campo subtitulo e salvo e exibido na sidebar corretamente
    Autenticar Via SessionStorage
    Go To    ${URL_CONFIG}
    Wait Until Element Is Visible    ${INPUT_SUBTITULO}    timeout=5s
    Clear Element Text    ${INPUT_SUBTITULO}
    Input Text    ${INPUT_SUBTITULO}    Cuidadora Principal
    Click Button    ${BOTAO_SALVAR}
    Handle Alert    action=ACCEPT
    ${subtitulo_sidebar}=    Get Text    ${DISPLAY_SUBTITULO}
    Should Contain    ${subtitulo_sidebar}    Cuidadora Principal

CT05 - Deve exibir avatar com inicial do nome
    [Documentation]    Verifica que o avatar exibe a primeira letra do nome do usuario
    Autenticar Via SessionStorage
    Go To    ${URL_CONFIG}
    Wait Until Element Is Visible    ${DISPLAY_AVATAR}    timeout=5s
    ${avatar}=    Get Text    ${DISPLAY_AVATAR}
    ${inicial}=   Evaluate    "${USUARIO_NOME}"[0].upper()
    Should Be Equal    ${avatar}    ${inicial}

CT06 - Deve redirecionar para login ao clicar em Sair
    [Documentation]    Verifica que o botao de logout limpa a sessao e redireciona para o login
    Autenticar Via SessionStorage
    Go To    ${URL_CONFIG}
    Wait Until Element Is Visible    ${BOTAO_LOGOUT}    timeout=5s
    Click Button    ${BOTAO_LOGOUT}
    Wait Until Location Is    ${URL_BASE}/    timeout=5s
    Title Should Be    FamilyCare — Login

CT07 - Deve redirecionar para login sem autenticacao
    [Documentation]    Verifica que acessar configuracoes sem estar logado redireciona para o login
    # Garante que nao ha sessao ativa
    Go To    ${URL_BASE}
    Execute Javascript    sessionStorage.clear();
    Go To    ${URL_CONFIG}
    Wait Until Location Is    ${URL_BASE}/    timeout=5s
    Title Should Be    FamilyCare — Login

*** Keywords ***

Abrir Navegador
    Open Browser    ${URL_BASE}    ${BROWSER}
    Maximize Browser Window

Fechar Navegador
    Close Browser

Autenticar Via SessionStorage
    [Documentation]    Injeta os dados de sessao diretamente via JS, simulando um login bem-sucedido
    Go To    ${URL_BASE}
    ${usuario_json}=    Set Variable
    ...    {"id_usuario": ${USUARIO_ID}, "nome": "${USUARIO_NOME}", "email": "${USUARIO_EMAIL}", "funcao_subtitulo": "${USUARIO_SUBTITULO}"}
    Execute Javascript    sessionStorage.setItem('userAuthenticated', 'true');
    Execute Javascript    sessionStorage.setItem('usuario', '${usuario_json}');

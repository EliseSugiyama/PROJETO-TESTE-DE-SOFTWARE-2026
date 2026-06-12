// ============================================================
// FamilyCare — Helper de requisições autenticadas 
// Injeta automaticamente o Bearer token JWT em cada fetch.
// ============================================================

function getToken() {
    return sessionStorage.getItem('token') || '';
}

// Substitui o fetch nativo, sempre injetando Authorization
async function apiFetch(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...(options.headers || {})
    };

    const response = await fetch(url, { ...options, headers });

    // Token expirado ou inválido — redireciona para login
    if (response.status === 401 || response.status === 403) {
        sessionStorage.clear();
        window.location.href = '/';
        return;
    }

    return response;
}

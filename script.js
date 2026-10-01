// =============================================================
// НАСТРОЙКА ПАРОЛЯ
// =============================================================
// Пароль хранится в виде SHA-256 хеша. Сам пароль в коде НЕ виден.
// 
// Как сгенерировать свой хеш:
// 1. Откройте https://emn178.github.io/online-tools/sha256.html
// 2. Введите свой пароль (минимум 12 символов!)
// 3. Скопируйте полученную hex-строку (64 символа)
// 4. Вставьте её ниже вместо текущей.
//
// Текущий хеш соответствует паролю: admin123 (СМЕНИТЕ ЕГО!)
// =============================================================
const ADMIN_PASSWORD_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

// =============================================================
// ДАННЫЕ ПО УМОЛЧАНИЮ (на случай, если JSON не загрузится)
// =============================================================
const DEFAULT_MFO = [
    { id: 1, name: "Займер", legal: 'ООО МФК "Займер"', sum: 30000, term: 21, age: 18, approval: 5, psk: 0, erid: "", badge: "Хит", color: "gray", refLink: "https://zaymer.ru/?ref=123", cover: "" },
    { id: 2, name: "Займ.ру", legal: 'ООО МФК "Займ.ру"', sum: 30000, term: 21, age: 18, approval: 5, psk: 0, erid: "", badge: "", color: "blue", refLink: "https://zaim.ru/?ref=456", cover: "" },
    { id: 3, name: "Webbankir", legal: 'ООО МФК "Веббанкир"', sum: 15000, term: 30, age: 20, approval: 10, psk: 292, erid: "", badge: "", color: "green", refLink: "https://webbankir.com/?ref=789", cover: "" },
    { id: 4, name: "MoneyMan", legal: 'ООО МФК "Мани Мен"', sum: 80000, term: 126, age: 18, approval: 15, psk: 0, erid: "", badge: "0%", color: "orange", refLink: "https://moneyman.ru/?ref=101", cover: "" },
    { id: 5, name: "TurboZaim", legal: 'ООО МФК "Турбозайм"', sum: 15000, term: 30, age: 21, approval: 7, psk: 292, erid: "", badge: "", color: "red", refLink: "https://turbozaim.ru/?ref=102", cover: "" },
    { id: 6, name: "Creditter", legal: 'ООО МКК "Кредиттер"', sum: 100000, term: 365, age: 18, approval: 20, psk: 292, erid: "", badge: "", color: "purple", refLink: "https://creditter.ru/?ref=103", cover: "" },
    { id: 7, name: "МигКредит", legal: 'ООО МФК "МигКредит"', sum: 100000, term: 365, age: 22, approval: 25, psk: 292, erid: "", badge: "", color: "cyan", refLink: "https://migcredit.ru/?ref=104", cover: "" },
    { id: 8, name: "Платиза", legal: 'ООО МФК "Платиза.ру"', sum: 15000, term: 21, age: 18, approval: 5, psk: 292, erid: "", badge: "", color: "yellow", refLink: "https://platiza.ru/?ref=105", cover: "" },
    { id: 9, name: "Быстроденьги", legal: 'ООО МФК "Быстроденьги"', sum: 100000, term: 365, age: 18, approval: 30, psk: 292, erid: "", badge: "", color: "lime", refLink: "https://bistrodengi.ru/?ref=106", cover: "" },
    { id: 10, name: "Екапуста", legal: 'ООО МКК "Русинтерфинанс"', sum: 30000, term: 21, age: 18, approval: 5, psk: 0, erid: "", badge: "", color: "pink", refLink: "https://ekapusta.com/?ref=107", cover: "" },
    { id: 11, name: "СмсФинанс", legal: 'ООО МФК "СМСФИНАНС"', sum: 30000, term: 30, age: 18, approval: 10, psk: 292, erid: "", badge: "", color: "teal", refLink: "https://smsfinance.ru/?ref=108", cover: "" },
    { id: 12, name: "АйКредит", legal: 'ООО МФК "АйКредит"', sum: 30000, term: 30, age: 18, approval: 8, psk: 292, erid: "", badge: "", color: "brown", refLink: "https://icredit.ru/?ref=109", cover: "" },
    { id: 13, name: "Кредит7", legal: 'ООО МКК "Кредит7"', sum: 20000, term: 30, age: 18, approval: 12, psk: 292, erid: "", badge: "", color: "navy", refLink: "https://credit7.ru/?ref=110", cover: "" },
    { id: 14, name: "ФинТерра", legal: 'ООО МКК "ФинТерра"', sum: 30000, term: 21, age: 18, approval: 6, psk: 292, erid: "", badge: "", color: "olive", refLink: "https://finterra.ru/?ref=111", cover: "" },
    { id: 15, name: "ГринМани", legal: 'ООО МФК "ГринМани"', sum: 30000, term: 21, age: 18, approval: 5, psk: 0, erid: "", badge: "", color: "maroon", refLink: "https://greenmoney.ru/?ref=112", cover: "" }
];

// =============================================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// =============================================================
let mfoData = [];
let isAdmin = false;
let editingId = null;

// =============================================================
// УТИЛИТЫ
// =============================================================
async function sha256(str) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// =============================================================
// ЗАГРУЗКА И СОХРАНЕНИЕ ДАННЫХ
// =============================================================
async function loadData() {
    // 1. Локальные правки админа (если есть) — приоритет
    const local = localStorage.getItem('mfo_data');
    if (local) {
        try {
            return JSON.parse(local);
        } catch (e) {
            console.warn('Битый localStorage, игнорируем:', e);
        }
    }

    // 2. Иначе тянем JSON с сервера
    try {
        const res = await fetch('mfo-data.json?t=' + Date.now());
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        // Кэшируем для скорости
        localStorage.setItem('mfo_data', JSON.stringify(data));
        return data;
    } catch (e) {
        console.warn('Не удалось загрузить mfo-data.json, используем DEFAULT_MFO:', e);
        return JSON.parse(JSON.stringify(DEFAULT_MFO));
    }
}

function saveData(data) {
    localStorage.setItem('mfo_data', JSON.stringify(data));
}

// =============================================================
// ОТРИСОВКА КАРТОЧЕК
// =============================================================
function renderCards(data, customRefLink = '') {
    const container = document.getElementById('mfo-list');
    container.innerHTML = '';

    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#888;padding:20px;">По вашим параметрам ничего не найдено 😔</p>';
        return;
    }

    data.forEach(mfo => {
        const finalLink = customRefLink || mfo.refLink || '#';
        const adminBtn = isAdmin ? `<button class="card-edit-btn" data-id="${mfo.id}">✏️</button>` : '';
        const coverHTML = mfo.cover ? `<img src="${mfo.cover}" alt="${mfo.name}" class="card-cover" loading="lazy">` : '';
        const pskHTML = (mfo.psk !== undefined && mfo.psk !== '' && mfo.psk !== null)
            ? `<span class="psk-badge">ПСК: ${mfo.psk}%</span>`
            : '';
        const eridHTML = mfo.erid ? `<span class="erid-badge">ERID: ${mfo.erid}</span>` : '';
        const badgeHTML = mfo.badge ? `<div class="badge">${mfo.badge}</div>` : '';

        const cardHTML = `
            <div class="card">
                ${adminBtn}
                ${badgeHTML}
                ${coverHTML}
                <div class="card-header">
                    <div class="logo-placeholder ${mfo.color || 'gray'}">${mfo.name}</div>
                    <div class="title">
                        <h2>${mfo.name}</h2>
                        <p class="legal">${mfo.legal}</p>
                    </div>
                </div>

                <div class="info-grid">
                    <div class="info-item">
                        <span class="value">до ${Number(mfo.sum).toLocaleString('ru-RU')} ₽</span>
                        <span class="label">Сумма</span>
                    </div>
                    <div class="info-item">
                        <span class="value">до ${mfo.term} дней</span>
                        <span class="label">Срок</span>
                    </div>
                    <div class="info-item">
                        <span class="value">с ${mfo.age} лет</span>
                        <span class="label">Возраст</span>
                    </div>
                    <div class="info-item">
                        <span class="value">от ${mfo.approval} минут</span>
                        <span class="label">Одобрение</span>
                    </div>
                </div>

                <a href="${finalLink}" target="_blank" rel="noopener" class="btn">Оформить</a>

                <div class="card-footer">
                    ${pskHTML}
                    ${eridHTML}
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });

    if (isAdmin) {
        document.querySelectorAll('.card-edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)));
        });
    }
}

// =============================================================
// ФИЛЬТРЫ
// =============================================================
function applyFilters() {
    const sumInput = document.getElementById('filter-sum').value;
    const ageInput = document.getElementById('filter-age').value;
    const approvalInput = document.getElementById('filter-approval').value;
    const refLinkInput = document.getElementById('ref-link').value;

    const filtered = mfoData.filter(mfo => {
        const sumMatch = !sumInput || mfo.sum >= parseInt(sumInput);
        const ageMatch = !ageInput || mfo.age <= parseInt(ageInput);
        const approvalMatch = !approvalInput || mfo.approval <= parseInt(approvalInput);
        return sumMatch && ageMatch && approvalMatch;
    });

    renderCards(filtered, refLinkInput);
}

function resetFilters() {
    document.getElementById('filter-sum').value = '';
    document.getElementById('filter-age').value = '';
    document.getElementById('filter-approval').value = '';
    document.getElementById('ref-link').value = '';
    renderCards(mfoData);
}

// =============================================================
// МОДАЛЬНОЕ ОКНО РЕДАКТИРОВАНИЯ
// =============================================================
function openEditModal(id) {
    if (!isAdmin) return;
    editingId = id;
    const mfo = mfoData.find(m => m.id === id);
    if (!mfo) return;

    document.getElementById('edit-modal-title').textContent = `Редактирование: ${mfo.name}`;
    document.getElementById('edit-name').value = mfo.name || '';
    document.getElementById('edit-legal').value = mfo.legal || '';
    document.getElementById('edit-sum').value = mfo.sum || 0;
    document.getElementById('edit-term').value = mfo.term || 0;
    document.getElementById('edit-age').value = mfo.age || 18;
    document.getElementById('edit-approval').value = mfo.approval || 5;
    document.getElementById('edit-psk').value = mfo.psk || 0;
    document.getElementById('edit-erid').value = mfo.erid || '';
    document.getElementById('edit-refLink').value = mfo.refLink || '';
    document.getElementById('edit-badge').value = mfo.badge || '';
    document.getElementById('edit-color').value = mfo.color || 'gray';
    document.getElementById('edit-cover').value = mfo.cover || '';
    document.getElementById('edit-cover-file').value = '';

    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    editingId = null;
}

function saveEdit() {
    const mfo = mfoData.find(m => m.id === editingId);
    if (!mfo) return;

    mfo.name = document.getElementById('edit-name').value.trim() || 'Без названия';
    mfo.legal = document.getElementById('edit-legal').value.trim();
    mfo.sum = parseInt(document.getElementById('edit-sum').value) || 0;
    mfo.term = parseInt(document.getElementById('edit-term').value) || 0;
    mfo.age = parseInt(document.getElementById('edit-age').value) || 18;
    mfo.approval = parseInt(document.getElementById('edit-approval').value) || 5;
    mfo.psk = parseFloat(document.getElementById('edit-psk').value) || 0;
    mfo.erid = document.getElementById('edit-erid').value.trim();
    mfo.refLink = document.getElementById('edit-refLink').value.trim();
    mfo.badge = document.getElementById('edit-badge').value.trim();
    mfo.color = document.getElementById('edit-color').value;
    mfo.cover = document.getElementById('edit-cover').value.trim();

    saveData(mfoData);
    renderCards(mfoData);
    closeEditModal();
}

function deleteCard() {
    if (!confirm('Удалить эту МФО?')) return;
    mfoData = mfoData.filter(m => m.id !== editingId);
    saveData(mfoData);
    renderCards(mfoData);
    closeEditModal();
}

function addNewCard() {
    const newId = mfoData.length ? Math.max(...mfoData.map(m => m.id)) + 1 : 1;
    const newMfo = {
        id: newId,
        name: "Новая МФО",
        legal: 'ООО МФК "Название"',
        sum: 30000, term: 21, age: 18, approval: 5,
        psk: 0, erid: "", badge: "", color: "gray",
        refLink: "https://example.com", cover: ""
    };
    mfoData.push(newMfo);
    saveData(mfoData);
    renderCards(mfoData);
    openEditModal(newId);
}

// =============================================================
// ЗАГРУЗКА ОБЛОЖКИ (в base64)
// =============================================================
function handleCoverUpload(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Можно загружать только изображения');
        return;
    }
    // Проверка размера (чтобы не раздувать localStorage)
    if (file.size > 500 * 1024) {
        if (!confirm('Файл больше 500 КБ. Это может замедлить сайт. Продолжить?')) {
            return;
        }
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('edit-cover').value = e.target.result;
    };
    reader.readAsDataURL(file);
}

// =============================================================
// ЭКСПОРТ / ИМПОРТ JSON
// =============================================================
function exportJSON() {
    // Убираем data:image из экспорта? Нет, оставляем — иначе обложки потеряются.
    const dataStr = JSON.stringify(mfoData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mfo-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!Array.isArray(data)) throw new Error('Файл должен содержать массив');
            mfoData = data;
            saveData(mfoData);
            renderCards(mfoData);
            alert('Импорт успешен! Не забудьте нажать "Экспорт" и залить файл на GitHub.');
        } catch (err) {
            alert('Ошибка импорта: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// =============================================================
// АДМИН-РЕЖИМ
// =============================================================
async function toggleAdmin() {
    if (isAdmin) {
        isAdmin = false;
        document.getElementById('admin-panel').classList.add('hidden');
        document.getElementById('admin-toggle').textContent = '🔒';
        renderCards(mfoData);
        return;
    }

    const pass = prompt('Введите пароль администратора:');
    if (pass === null) return;

    const hash = await sha256(pass);
    if (hash === ADMIN_PASSWORD_HASH) {
        isAdmin = true;
        document.getElementById('admin-panel').classList.remove('hidden');
        document.getElementById('admin-toggle').textContent = '🔓';
        renderCards(mfoData);
    } else {
        alert('Неверный пароль');
    }
}

// =============================================================
// ИНИЦИАЛИЗАЦИЯ
// =============================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Загружаем данные с сервера (или из localStorage)
    mfoData = await loadData();
    renderCards(mfoData);

    // Панель фильтров
    document.getElementById('settings-btn').addEventListener('click', () => {
        document.getElementById('settings-panel').classList.toggle('hidden');
    });
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);

    // Админка
    document.getElementById('admin-toggle').addEventListener('click', toggleAdmin);
    document.getElementById('admin-add-card').addEventListener('click', addNewCard);
    document.getElementById('admin-export').addEventListener('click', exportJSON);
    document.getElementById('admin-import').addEventListener('click', () => {
        document.getElementById('admin-import-file').click();
    });
    document.getElementById('admin-import-file').addEventListener('change', (e) => {
        if (e.target.files[0]) importJSON(e.target.files[0]);
    });
    document.getElementById('admin-reset').addEventListener('click', async () => {
        if (confirm('Сбросить локальные правки и загрузить с GitHub?')) {
            localStorage.removeItem('mfo_data');
            mfoData = await loadData();
            renderCards(mfoData);
        }
    });

    // Модальное окно
    document.getElementById('edit-save').addEventListener('click', saveEdit);
    document.getElementById('edit-delete').addEventListener('click', deleteCard);
    document.getElementById('edit-cancel').addEventListener('click', closeEditModal);
    document.getElementById('edit-cover-file').addEventListener('change', (e) => {
        handleCoverUpload(e.target.files[0]);
    });
    document.getElementById('edit-modal').addEventListener('click', (e) => {
        if (e.target.id === 'edit-modal') closeEditModal();
    });
});

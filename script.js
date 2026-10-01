const mfoData = [
    { id: 1, name: "Займер", legal: 'ООО МФК "Займер"', sum: 30000, term: 21, age: 18, approval: 5, badge: "Хит", color: "gray", refLink: "https://zaymer.ru/?ref=123" },
    { id: 2, name: "Займ.ру", legal: 'ООО МФК "Займ.ру"', sum: 30000, term: 21, age: 18, approval: 5, badge: "", color: "blue", refLink: "https://zaim.ru/?ref=456" },
    { id: 3, name: "Webbankir", legal: 'ООО МФК "Веббанкир"', sum: 15000, term: 30, age: 20, approval: 10, badge: "", color: "green", refLink: "https://webbankir.com/?ref=789" },
    { id: 4, name: "MoneyMan", legal: 'ООО МФК "Мани Мен"', sum: 80000, term: 126, age: 18, approval: 15, badge: "0%", color: "orange", refLink: "https://moneyman.ru/?ref=101" },
    { id: 5, name: "TurboZaim", legal: 'ООО МФК "Турбозайм"', sum: 15000, term: 30, age: 21, approval: 7, badge: "", color: "red", refLink: "https://turbozaim.ru/?ref=102" },
    { id: 6, name: "Creditter", legal: 'ООО МКК "Кредиттер"', sum: 100000, term: 365, age: 18, approval: 20, badge: "", color: "purple", refLink: "https://creditter.ru/?ref=103" },
    { id: 7, name: "МигКредит", legal: 'ООО МФК "МигКредит"', sum: 100000, term: 365, age: 22, approval: 25, badge: "", color: "cyan", refLink: "https://migcredit.ru/?ref=104" },
    { id: 8, name: "Платиза", legal: 'ООО МФК "Платиза.ру"', sum: 15000, term: 21, age: 18, approval: 5, badge: "", color: "yellow", refLink: "https://platiza.ru/?ref=105" },
    { id: 9, name: "Быстроденьги", legal: 'ООО МФК "Быстроденьги"', sum: 100000, term: 365, age: 18, approval: 30, badge: "", color: "lime", refLink: "https://bistrodengi.ru/?ref=106" },
    { id: 10, name: "Екапуста", legal: 'ООО МКК "Русинтерфинанс"', sum: 30000, term: 21, age: 18, approval: 5, badge: "", color: "pink", refLink: "https://ekapusta.com/?ref=107" },
    { id: 11, name: "СмсФинанс", legal: 'ООО МФК "СМСФИНАНС"', sum: 30000, term: 30, age: 18, approval: 10, badge: "", color: "teal", refLink: "https://smsfinance.ru/?ref=108" },
    { id: 12, name: "АйКредит", legal: 'ООО МФК "АйКредит"', sum: 30000, term: 30, age: 18, approval: 8, badge: "", color: "brown", refLink: "https://icredit.ru/?ref=109" },
    { id: 13, name: "Кредит7", legal: 'ООО МКК "Кредит7"', sum: 20000, term: 30, age: 18, approval: 12, badge: "", color: "navy", refLink: "https://credit7.ru/?ref=110" },
    { id: 14, name: "ФинТерра", legal: 'ООО МКК "ФинТерра"', sum: 30000, term: 21, age: 18, approval: 6, badge: "", color: "olive", refLink: "https://finterra.ru/?ref=111" },
    { id: 15, name: "ГринМани", legal: 'ООО МФК "ГринМани"', sum: 30000, term: 21, age: 18, approval: 5, badge: "", color: "maroon", refLink: "https://greenmoney.ru/?ref=112" },
];

function renderCards(data, customRefLink = '') {
    const container = document.getElementById('mfo-list');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#888;padding:20px;">По вашим параметрам ничего не найдено 😔</p>';
        return;
    }

    data.forEach(mfo => {
        const finalLink = customRefLink || mfo.refLink;

        const cardHTML = `
            <div class="card">
                ${mfo.badge ? `<div class="badge">${mfo.badge}</div>` : ''}
                <div class="card-header">
                    <div class="logo-placeholder ${mfo.color}">${mfo.name}</div>
                    <div class="title">
                        <h2>${mfo.name}</h2>
                        <p class="legal">${mfo.legal}</p>
                    </div>
                </div>

                <div class="info-grid">
                    <div class="info-item">
                        <span class="value">до ${mfo.sum.toLocaleString('ru-RU')} ₽</span>
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

                <a href="${finalLink}" target="_blank" class="btn">Оформить</a>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

function applyFilters() {
    const sumInput = document.getElementById('filter-sum').value;
    const ageInput = document.getElementById('filter-age').value;
    const approvalInput = document.getElementById('filter-approval').value;
    const refLinkInput = document.getElementById('ref-link').value;

    const filteredData = mfoData.filter(mfo => {
        const sumMatch = !sumInput || mfo.sum >= parseInt(sumInput);
        const ageMatch = !ageInput || mfo.age <= parseInt(ageInput);
        const approvalMatch = !approvalInput || mfo.approval <= parseInt(approvalInput);
        return sumMatch && ageMatch && approvalMatch;
    });

    renderCards(filteredData, refLinkInput);
}

function resetFilters() {
    document.getElementById('filter-sum').value = '';
    document.getElementById('filter-age').value = '';
    document.getElementById('filter-approval').value = '';
    document.getElementById('ref-link').value = '';
    renderCards(mfoData);
}

document.addEventListener('DOMContentLoaded', () => {
    renderCards(mfoData);

    document.getElementById('settings-btn').addEventListener('click', () => {
        document.getElementById('settings-panel').classList.toggle('hidden');
    });

    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
});

const addClient = document.querySelector('.btn-add'),
    modalOpen = document.querySelector('.overlay'),
    modalDeleteOpen = document.querySelector('.overlay-delete'),
    modalEditOpen = document.querySelector('.overlay-edit'),
    modalCloseX = document.querySelectorAll('.modal__close');

let regChar = /[A-Za-zА-Яа-яЁё]/g;
let regNum = /[0-9]/g;

const phoneMask = new Inputmask("+7(999)999-99-99")
const emailMask = new Inputmask("*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]");

//Отключим ввод чисел в инпуте хедера
document.querySelector('.header_input').addEventListener('input', noNum)

function newContactPlaceholder(btn) {
    const input = btn.parentNode.parentNode.childNodes[2].childNodes[1];
    if (btn.textContent.trim() === 'Телефон' || 'Доп. телефон') {
        input.type = 'tel';
        input.placeholder = '+7(___)___-__-__';
        input.dataset.inputmask = "'mask': '+7(999)999-99-99'";
        input.dataset.emailValidation = false;
        input.dataset.required = true;
    }
    if (btn.textContent.trim() === 'VK') {
        input.type = 'text';
        input.placeholder = 'vk.com/id123'
        input.dataset.emailValidation = false;
        input.dataset.required = true;
        input.removeAttribute('data-inputmask');
        Inputmask.remove(input);
    }
    if (btn.textContent.trim() === 'Email') {
        input.type = 'email';
        input.placeholder = 'example@gmail.com';
        input.dataset.emailValidation = true;
        input.removeAttribute('data-inputmask');
        Inputmask.remove(input);
    }
    if (btn.textContent.trim() === 'Facebook') {
        input.type = 'text';
        input.placeholder = 'facebook.com/';
        input.dataset.emailValidation = false;
        input.dataset.required = true;
        input.removeAttribute('data-inputmask');
        Inputmask.remove(input);
    }
    Inputmask().mask(document.querySelectorAll("input"));
}

//Открытие модала добавление
addClient.addEventListener('click', () => {
    const container = document.createElement('div');
    container.classList.add('modal-win', 'modal-win__add', 'modal-open');
    container.innerHTML = `<div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title">Новый клиент</h5>
        <button type="button" class="modal__close btn-reset">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M16.2332 1.73333L15.2665 0.766664L8.49985 7.53336L1.73318 0.766696L0.766515 1.73336L7.53318 8.50003L0.766542 15.2667L1.73321 16.2333L8.49985 9.46669L15.2665 16.2334L16.2332 15.2667L9.46651 8.50003L16.2332 1.73333Z"
                    fill="#B0B0B0" />
            </svg>
        </button>
    </div>
    <form action="" novalidate>
        <div class="modal-body">    
            <div class="text-field">
                <input class="text-field__inp validation" type="text" id="inputSurname" required data-required="true">
                <label class="text-field__placeholder">Фамилия<span style="color: #9873FF;">*</span></label>
            </div>
            <div class="text-field">
                <input class="text-field__inp validation" type="text" id="inputName" required data-required="true">
                <label class="text-field__placeholder">Имя<span style="color: #9873FF;">*</span></label>
            </div>
            <div class="text-field">
                <input class="text-field__inp validation" type="text" id="inputLastName" required>
                <label class="text-field__placeholder">Отчество</label>
            </div>
        </div>    
        <div class="add-contact">
            <div class="add-contact__container">    
            </div>
            <button type="button" class="add-contact__btn btn-reset">
                Добавить контакт
            </button>
        </div>    
        <div class="modal-footer">
            <button type="submit" class="btn-save btn-reset" id="save">Сохранить</button>
            <button type="button" class="btn-cancel btn-reset">Отмена</button>
        </div>
    </form>
    </div>`

    modalOpen.append(container);

    modalOpen.classList.add('modal-open', 'overflow-y');
    document.body.classList.add('overflow-hidden');

    //Клик по кнопке "Добавить контакт" в "Новый клиент"
    const addContactBtn = document.querySelector('.add-contact__btn');
    addContactBtn.addEventListener('click', () => {
        createNewContact()
    })

    // Закрытие модала по кнопке "Отмена"
    document.querySelectorAll('.btn-cancel').forEach(cancel => cancel.onclick = () => closeModal());
    //Закрытие модала по "Х"
    document.querySelectorAll('.modal__close').forEach(cancel => cancel.onclick = () => closeModal());

    // Клик по "Сохранить"
    const saveBtn = document.getElementById('save');
    saveBtn.addEventListener('click', function (e) {
        e.preventDefault()

        if (validation('.validation')) {
            const inputSurname = document.querySelector('#inputSurname').value;
            const inputName = document.querySelector('#inputName').value;
            const inputLastName = document.querySelector('#inputLastName').value;

            // Проверка значений контактов
            let contactType = document.querySelectorAll('.dropdown-toggle');
            let contactValue = document.querySelectorAll('.add-contact__input');

            let contactArr = [];
            for (let i = 0; i < contactType.length; i++) {
                let contactObj = {
                    type: contactType[i].textContent.trim(),
                    value: contactValue[i].value.trim(),
                }
                if (contactObj.value !== '') {
                    contactArr.push(contactObj)
                }
            }
            postClients(inputName, inputSurname, inputLastName, contactArr);
        }
    })

    //Отключим ввод чисел в поля ФИО
    document.querySelectorAll('.text-field__inp').forEach(input => input.addEventListener('input', noNum));
});

function validation(inputs) {
    let result = true;

    function removeError(input) {
        const parent = input.parentNode;
        if (parent.classList.contains('error')) {
            parent.querySelector('.error-label').remove();
            parent.classList.remove('error');
        }
    }
    function createError(input, text) {
        const parent = input.parentNode;
        parent.classList.add('error');

        const errorLabel = document.createElement('label');
        errorLabel.classList.add('error-label');
        errorLabel.innerHTML = text;

        parent.append(errorLabel)
    }

    document.querySelectorAll(inputs).forEach(input => {
        removeError(input)
        const emoji = "&#9757;";
        if (input.dataset.required === "true") {
            if (input.value === "") {
                createError(input, `Заполните это поле${emoji}`)
                result = false;
            } else {
                removeError(input)
            }
        }
        if (input.dataset.emailValidation === 'true') {
            removeError(input)
            if (!input.value.includes('@')) {
                createError(input, `Тут нужна @${emoji}`)
                result = false;
            } else {
                removeError(input)
            }
        }
    })
    return result
}

// Функция для закрытия модального окна "Новый Клиент" и "Изменить клиента"
function closeModal() {
    const modalAddClientOpen = document.querySelector('.modal-win__add');
    const modalEditClientOpen = document.querySelector('.modal-win__edit');

    if (modalAddClientOpen) {
        modalAddClientOpen.classList.remove('modal-open');
        modalOpen.classList.remove('modal-open');
        modalAddClientOpen.remove();
        console.log(modalAddClientOpen)
    }
    if (modalEditClientOpen) {
        modalEditOpen.classList.remove('modal-open');
        modalEditClientOpen.classList.remove('modal-open');
        modalEditClientOpen.remove();
    }
    modalDeleteOpen.classList.remove('modal-open');
    document.body.classList.remove('overflow-hidden');
}

function closeModalDelete() {
    modalOpen.classList.remove('modal-open');
    modalDeleteOpen.classList.remove('modal-open');
    modalEditOpen.classList.remove('modal-open');
    document.body.classList.remove('overflow-hidden');
}

//Закрытие модала по клику за пределами окна
modalOpen.addEventListener('click', (e) => {
    if (e.target === modalOpen) {
        closeModal()
    }
})
modalDeleteOpen.addEventListener('click', (e) => {
    if (e.target === modalDeleteOpen) {
        modalDeleteOpen.classList.remove('modal-open');
        document.body.classList.remove('overflow-hidden');
    }
})
modalEditOpen.addEventListener('click', (e) => {
    if (e.target === modalEditOpen) {
        closeModal()
    }
})

//Создадим форму добавления контакта в "Новом клиенте"
function createNewContact() {
    const container = document.createElement('div');
    container.classList.add('add-contact__item');
    container.innerHTML = `<div class="dropdown">
            <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Телефон
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Доп. телефон</a></li>
              <li><a class="dropdown-item" href="#">Email</a></li>
              <li><a class="dropdown-item" href="#">VK</a></li>
              <li><a class="dropdown-item" href="#">Facebook</a></li>
            </ul>
        </div>
        <div class="new-contact_input-container">
        <input class="add-contact__input validation" type="tel">
        <button class="add-contact__delete-btn btn-reset"></button>
        </div>`;

    const newContact = document.querySelector('.add-contact');
    const newContactContainer = document.querySelector('.add-contact__container');
    newContactContainer.append(container);
    newContact.prepend(newContactContainer);

    container.classList.add('add-contact__item--open');
    document.querySelector('.add-contact').classList.add('add-contact--open');

    deleteModalContact('.add-contact__delete-btn');

    const deleteContactBtn = document.createElement('button');
    deleteContactBtn.classList.add('add-contact__delete-btn', 'btn-reset"');

    //Выбор селекта 
    const selectBtn = document.querySelectorAll('.dropdown-toggle');
    const selectContact = document.querySelectorAll('.dropdown-item');
    selectBtn.forEach(btn => {
        newContactPlaceholder(btn);
        btn.onclick = () => {
            selectContact.forEach(item => {
                item.onclick = () => {
                    let btnItem = btn.textContent.trim();
                    btn.textContent = item.textContent;
                    item.textContent = btnItem;
                    newContactPlaceholder(btn);
                }
            })
        }

    })

};

//Создадим форму добавления контакта в "Изменить данные"
function createNewContactInEdit() {
    const container = document.createElement('div');
    container.classList.add('add-contact__item-edit');
    container.innerHTML = `<div class="dropdown">
        <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Телефон
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Доп. телефон</a></li>
          <li><a class="dropdown-item" href="#">Email</a></li>
          <li><a class="dropdown-item" href="#">VK</a></li>
          <li><a class="dropdown-item" href="#">Facebook</a></li>
        </ul>
    </div>
    <div class="new-contact_input-container">
    <input class="add-contact__input validation" type="tel">
    <button class="add-contact__delete-btn btn-reset"></button>
    </div>`;

    const newContactContainer = document.querySelector('.add-contact-edit__container');
    const newContact = document.querySelector('.add-contact__edit');

    newContactContainer.append(container);
    newContact.prepend(newContactContainer);

    document.querySelectorAll('.add-contact__item-edit').forEach(item => item.classList.add('add-contact__item--open'));
    document.querySelector('.add-contact__edit').classList.add('add-contact--open');

    deleteModalContact('.add-contact__delete-btn');
};

//Удалим строку контактов по нажатию Х
function deleteModalContact(id) {
    const deleteContactBtn = document.querySelectorAll(id);

    deleteContactBtn.forEach(btn => {
        btn.onclick = () => {
            btn.parentNode.parentNode.remove();

            if (document.querySelector('.modal-win__add')) {
                if (document.querySelectorAll('.add-contact__item').length === 0) {
                    document.querySelector('.add-contact').classList.remove('add-contact--open');
                }
            }
            if (document.querySelector('.modal-win__edit')) {
                if (document.querySelectorAll('.add-contact__item-edit').length === 0) {
                    document.querySelector('.add-contact__edit').classList.remove('add-contact--open');
                }
            }

        }
    })

}

//POST клиента на сервер
async function postClients(name, surname, lastName, clientTel) {
    const response = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            surname: surname,
            lastName: lastName,
            contacts: clientTel,
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

//PATCH отправка формы изменение клиента
function patchClients(id, name, surname, lastName, clientTel) {
    const response = fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            name: name,
            surname: surname,
            lastName: lastName,
            contacts: clientTel,
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

//DELETE Удаление клиента
function deleteClients(id) {
    const response = fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'DELETE',
    });
};

//! Рисовка таблицы клиентов
function createClientsList(arr) {
    const container = document.querySelector('.user-list');
    arr.forEach(client => {
        let row = document.createElement('div');
        row.classList.add('line');

        // ID
        let containerId = document.createElement('div');
        containerId.classList.add('line__id');
        let paragraphId = document.createElement('p');
        let id = client.id.slice(7, 13);
        paragraphId.append(id);
        containerId.append(paragraphId);
        row.append(containerId);

        row.dataset.id = client.id;

        // ФИО
        let containerFio = document.createElement('div');
        containerFio.classList.add('line__fio');
        let paragraphFio = document.createElement('p');
        paragraphFio.classList.add('fio');
        let fio = `${client.surname} ${client.name} ${client.lastName}`;
        paragraphFio.append(fio);
        containerFio.append(paragraphFio);
        row.append(containerFio);

        // Дата и время создания
        let conrainerCreatedAt = document.createElement('div');
        conrainerCreatedAt.classList.add('line__created-at');

        let paragraphCreatedAtDate = document.createElement('p');
        paragraphCreatedAtDate.classList.add('ceated-at__date');
        paragraphCreatedAtDate.textContent = client.createdAt.slice(0, 10).replaceAll('-', '.');

        let paragraphCreatedAtTime = document.createElement('p');
        paragraphCreatedAtTime.classList.add('ceated-at__time');
        paragraphCreatedAtTime.textContent = client.createdAt.slice(11, 16);

        conrainerCreatedAt.append(paragraphCreatedAtDate);
        conrainerCreatedAt.append(paragraphCreatedAtTime);
        row.append(conrainerCreatedAt);

        // Последние изменения
        let conrainerUpdatedAt = document.createElement('div');
        conrainerUpdatedAt.classList.add('line__last-changes');

        let paragraphUpdatedAtDate = document.createElement('p');
        paragraphUpdatedAtDate.classList.add('ceated-at__date');
        paragraphUpdatedAtDate.textContent = client.updatedAt.slice(0, 10).replaceAll('-', '.');

        let paragraphUpdatedAtTime = document.createElement('p');
        paragraphUpdatedAtTime.classList.add('ceated-at__time');
        paragraphUpdatedAtTime.textContent = client.updatedAt.slice(11, 16);

        conrainerUpdatedAt.append(paragraphUpdatedAtDate);
        conrainerUpdatedAt.append(paragraphUpdatedAtTime);
        row.append(conrainerUpdatedAt);

        // Контакты
        const contactContainer = document.createElement('div');
        contactContainer.classList.add('container__contacts');

        //Добавим контакты в значения атрибутов
        if (client.contacts[0] !== undefined) {
            client.contacts.forEach(item => {
                const contact = document.createElement('div');
                contact.classList.add('contact-icon');

                contact.dataset.contact = item.type;
                contact.dataset.value = item.value;

                // сворачивание контактов
                contactContainer.append(contact);
            })
        }

        row.append(contactContainer);

        const containerForActionBtn = document.createElement('div');
        containerForActionBtn.classList.add('container__action');
        //Изменить 
        const editBtn = document.createElement('button');
        editBtn.classList.add('btn-reset', 'btn-edit', 'btn-edite__bg');
        editBtn.textContent = 'Изменить';
        // Удаление
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn-reset', 'btn-delete', 'btn-delete__bg');
        deleteBtn.textContent = 'Удалить';

        containerForActionBtn.append(editBtn);
        containerForActionBtn.append(deleteBtn);

        row.append(containerForActionBtn);

        container.append(row);

        //Открытие модала изменение
        const editBtnOpen = document.querySelectorAll('.btn-edit');
        editBtnOpen.forEach(editBtn => {
            editBtn.onclick = () => {
                const editBtnSpiner = document.createElement('div');
                editBtnSpiner.classList.add('spinner-border', 'spinner-border__edit');
                editBtnSpiner.role = "status";
                const contentSpinner = document.createElement('span');
                contentSpinner.classList.add('visually-hidden');
                contentSpinner.textContent = 'Загрузка...';

                editBtnSpiner.append(contentSpinner);
                editBtn.prepend(editBtnSpiner);

                editBtn.classList.remove('btn-edite__bg');

                setTimeout(function () {
                    editBtnSpiner.remove();
                    editBtn.classList.add('btn-edite__bg');
                }, 500)

                const container = document.createElement('div');
                container.classList.add('modal-win', 'modal-win__edit', 'modal-open');

                container.innerHTML = `<div class="modal-content">
                <div class="modal-header modal-header__edit">
                    <div class="d-flex align-items-center">
                        <h5 class="modal-title modal-edit__title">Изменить данные</h5>
                        <p class="modal-edit__id"></p>
                    </div>
                    <button type="button" class="modal__close btn-reset">
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M16.2332 1.73333L15.2665 0.766664L8.49985 7.53336L1.73318 0.766696L0.766515 1.73336L7.53318 8.50003L0.766542 15.2667L1.73321 16.2333L8.49985 9.46669L15.2665 16.2334L16.2332 15.2667L9.46651 8.50003L16.2332 1.73333Z"
                                fill="#B0B0B0" />
                        </svg>
                    </button>
                </div>
                <form action="" novalidate>
                    <div class="modal-body">
                        <div class="text-field">
                            <input class="text-field__inp validation" type="text" required id="inputSurnameEdit" data-required="true">
                            <label class="text-field__placeholder">Фамилия<span style="color: #9873FF;">*</span></label>
                        </div>
                        <div class="text-field">
                            <input class="text-field__inp validation" type="text" required id="inputNameEdit" data-required="true">
                            <label class="text-field__placeholder">Имя<span style="color: #9873FF;">*</span></label>
                        </div>
                        <div class="text-field">
                            <input class="text-field__inp validation" type="text" required id="inputLastNameEdit">
                            <label class="text-field__placeholder">Отчество</label>
                        </div>
                    </div>
                    <div class="add-contact add-contact__edit">
                        <div class="add-contact-edit__container">
            
                        </div>
                        <button class="add-contact__btn btn-reset add-contact__btn-reset">
                            Добавить контакт
                        </button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-save btn-reset" id="editBtn">Сохранить</button>
                        <button type="button" class="btn-cancel btn-reset" id="deleteBtnEdite">Удалить клиента</button>
                    </div>
                </form>
                </div>`

                modalEditOpen.append(container);

                document.querySelector('.overlay-edit').classList.add('modal-open');
                document.body.classList.add('overflow-hidden');

                //Закрытие модала по "Х"
                document.querySelectorAll('.modal__close').forEach(cancel => cancel.onclick = () => closeModal());

                const addContactBtnReset = document.querySelector('.add-contact__btn-reset');
                addContactBtnReset.addEventListener('click', () => {
                    createNewContactInEdit()

                    //Уберём кнопку "Добавить контакт" если полей будет = 10
                    if (document.querySelectorAll('.add-contact__item-edit').length === 10) {
                        document.querySelector('.add-contact__btn-reset').style.display = 'none';
                        document.body.querySelector('.add-contact__edit').style.paddingBottom = '9px';
                    };

                    //Выбор селект 
                    const selectBtn = document.querySelectorAll('.dropdown-toggle');
                    const selectContact = document.querySelectorAll('.dropdown-item');
                    selectBtn.forEach(btn => {
                        newContactPlaceholder(btn);
                        btn.onclick = () => {
                            selectContact.forEach(item => {
                                item.onclick = () => {
                                    let btnItem = btn.textContent.trim();
                                    btn.textContent = item.textContent;
                                    item.textContent = btnItem;
                                    newContactPlaceholder(btn);
                                }
                            })
                        }
                    })
                })
                //Заполним № ID в шапке
                let getId = editBtn.parentNode.parentNode.dataset.id;
                console.log(getId)
                modalEditId = document.querySelector('.modal-edit__id');
                modalEditId.textContent = `ID: ${getId.slice(7, 13)}`;
                modalEditId.dataset.id = getId;

                clientsArr.forEach(client => {
                    if (client.id === getId) {
                        //Заполним формы ФИО
                        document.querySelector('#inputNameEdit').value = client.name;
                        document.querySelector('#inputSurnameEdit').value = client.surname;
                        document.querySelector('#inputLastNameEdit').value = client.lastName;

                        //Заполним формы контакты
                        if (client.contacts.length !== 0) {
                            for (let i = 0; i < client.contacts.length; i++) {
                                createNewContactInEdit();
                                document.querySelectorAll('.dropdown-toggle')[i].textContent = client.contacts[i].type;
                                document.querySelectorAll('.add-contact__input')[i].value = client.contacts[i].value;
                            }
                        }
                    }
                })

                // Удалить клиента
                document.querySelector('#deleteBtnEdite').onclick = () => deleteClients(getId);

                // Клик по кнопке "Сохранить" в "Изменить данные"
                document.getElementById('editBtn').addEventListener('click', saveBtnEdit);

                //Отключим ввод с клавиатуры чисел в поля ФИО
                document.querySelectorAll('.text-field__inp').forEach(input => input.addEventListener('input', noNum));
            }
        })

        //Открытие модала удаление
        deleteBtn.addEventListener('click', () => {
            const deleteBtnSpiner = document.createElement('div');
            deleteBtnSpiner.classList.add('spinner-border', 'spinner-border__delete');
            deleteBtnSpiner.role = "status";
            const contentSpinner = document.createElement('span');
            contentSpinner.classList.add('visually-hidden');
            contentSpinner.textContent = 'Загрузка...';

            deleteBtnSpiner.append(contentSpinner);
            deleteBtn.prepend(deleteBtnSpiner);

            deleteBtn.classList.remove('btn-delete__bg');

            setTimeout(function () {
                deleteBtnSpiner.remove();
                deleteBtn.classList.add('btn-delete__bg');
            }, 500)

            modalDeleteOpen.classList.add('modal-open');
            document.querySelector('.modal-win__delete').classList.add('modal-open');
            document.body.classList.add('overflow-hidden');

            let getId = String(deleteBtn.parentNode.parentNode.dataset.id);
            //Удаление клиента
            const deleteModalBtn = document.querySelector('#deleteBtn');
            deleteModalBtn.onclick = () => {
                console.log(getId);
                deleteClients(getId);
            }
        })
        // Закрытие модала по кнопке "Отмена"
        document.querySelectorAll('.btn-cancel').forEach(cancel => cancel.onclick = () => closeModalDelete());
        //Закрытие модала по "Х"
        document.querySelectorAll('.modal__close').forEach(cancel => cancel.onclick = () => closeModalDelete());
    })
}

// Клик по кнопке "Сохранить" в "Изменить данные"
function saveBtnEdit() {
    if (validation('.validation') === true) {
        const editBtn = document.querySelector('#editBtn');
        editBtn.onclick = () => {
            //Получим ID
            let getId = String(document.querySelector('.modal-edit__id').dataset.id);
            //Получим ФИО
            const inputSurname = document.querySelector('#inputSurnameEdit').value;
            const inputName = document.querySelector('#inputNameEdit').value;
            const inputLastName = document.querySelector('#inputLastNameEdit').value;

            // Проверка значений контактов
            let contactType = document.querySelectorAll('.dropdown-toggle');
            let contactValue = document.querySelectorAll('.add-contact__input');

            let contactArr = [];
            for (let i = 0; i < contactType.length; i++) {
                let contactObj = {
                    type: contactType[i].textContent.trim(),
                    value: contactValue[i].value.trim(),
                }
                console.log(contactObj);
                if (contactObj.value !== '') {
                    contactArr.push(contactObj)
                }
            }
            patchClients(getId, inputName, inputSurname, inputLastName, contactArr);
        }
    }
}

// Получаем список клиентов
let clientsArr = [];
async function getClient() {
    let getClients = fetch(`http://localhost:3000/api/clients`);
    getClients
        .then(data => data.json())
        .then(clients => {
            clientsArr.push(clients);
            clientsArr = [...clientsArr[0]];
            createClientsList(clientsArr);
            collapseContactIcon()

            clientsArr.forEach(client => {
                client.fio = `${client.surname} ${client.name} ${client.lastName}`
            })
        })
        .catch(err => {
            console.log('Ошибка', err);
        })
    let result = await getClients;
    return result
}
getClient();

function collapseContactIcon() {
    document.querySelectorAll('.container__contacts').forEach(contacts => {
        let contactRow = contacts.childNodes;
        let collapseContactIcon = document.createElement('div');
        collapseContactIcon.classList.add('collapse-icon')
        if (contactRow.length > 4) {
            for (let i = 4; contactRow.length - 1 >= i; i++) {
                contactRow[i].classList.add('d-none');
            }
            collapseContactIcon.textContent = `+${contactRow.length - 4}`;
            contacts.append(collapseContactIcon);
            collapseContactIcon.onclick = () => contactRow.forEach(item => {
                item.classList.remove('d-none');
                // document.querySelector('.line').style.height = 
                collapseContactIcon.remove();
            });

        }
    })
}

//Функция сортировки массива по столбцам
function sort(arr, func) {
    let result = [...arr]
    for (let j = 0; j < result.length; j++) {
        for (let i = 0; i < result.length - 1; i++) {
            if (func(result[i], result[i + 1])) {
                //Меняем местами
                let temp = result[i];
                result[i] = result[i + 1];
                result[i + 1] = temp;
            }
        }
    }
    return result
}

//Удалим всю отрисовку таблицы клиентов
function deleteClientsList() {
    document.querySelectorAll('.line').forEach(item => item.remove())
}

//сортировка по ID
let action = 1;
document.querySelector('#column-id').addEventListener('click', () => {
    if (action === 1) {
        clientsArr = sort(clientsArr, function (A, B) {
            //Для смены направления сортировки мы просто поменяем знак на >
            return A.id < B.id
        })
        action = 2;
    } else {
        clientsArr = sort(clientsArr, function (A, B) {
            //Для смены направления сортировки мы просто поменяем знак на >
            return A.id > B.id
        })
        action = 1;
    }
    deleteClientsList()
    createClientsList(clientsArr)
    collapseContactIcon()

    // Развернём стрелочку
    document.querySelector('.nav-item__id-icon').classList.toggle('rotate');
    document.querySelector('.column-fio').classList.remove('column-fio--click');
    document.querySelector('.nav-item__date-create-icon').classList.remove('rotate');
    document.querySelector('.nav-item__last-create-icon').classList.remove('rotate');
})

//Сортировка по ФИО
document.querySelector('.column-fio').addEventListener('click', () => {
    if (action === 1) {
        clientsArr = sort(clientsArr, function (A, B) {
            //Для смены направления сортировки мы просто поменяем знак на >
            return A.fio < B.fio
        })
        action = 2;
    } else {
        clientsArr = sort(clientsArr, function (A, B) {
            //Для смены направления сортировки мы просто поменяем знак на >
            return A.fio > B.fio
        })
        action = 1;
    }
    deleteClientsList();
    createClientsList(clientsArr);
    collapseContactIcon();

    //Развернём стрелочку
    document.querySelector('.nav-item__id-icon').classList.remove('rotate');
    document.querySelector('.column-fio').classList.toggle('column-fio--click');
    document.querySelector('.nav-item__date-create-icon').classList.remove('rotate');
    document.querySelector('.nav-item__last-create-icon').classList.remove('rotate');
})

//Сортировка по Дата и время создания
document.querySelector('.nav-item__date-create').addEventListener('click', () => {
    if (action === 1) {
        clientsArr = sort(clientsArr, function (A, B) {
            //Для смены направления сортировки мы просто поменяем знак на >
            return A.createdAt < B.createdAt
        })
        action = 2;
    } else {
        clientsArr = sort(clientsArr, function (A, B) {
            //Для смены направления сортировки мы просто поменяем знак на >
            return A.createdAt > B.createdAt
        })
        action = 1;
    }
    deleteClientsList();
    createClientsList(clientsArr);
    collapseContactIcon();

    // Развернём стрелочку
    document.querySelector('.nav-item__id-icon').classList.remove('rotate');
    document.querySelector('.column-fio').classList.remove('column-fio--click');
    document.querySelector('.nav-item__date-create-icon').classList.toggle('rotate');
    document.querySelector('.nav-item__last-create-icon').classList.remove('rotate');
})

//Сортировка по Последние изменения
document.querySelector('.nav-item__last-create').addEventListener('click', () => {
    if (action === 1) {
        clientsArr = sort(clientsArr, function (A, B) {
            //Для смены направления сортировки мы просто поменяем знак на >
            return A.updatedAt < B.updatedAt
        })
        action = 2;
    } else {
        clientsArr = sort(clientsArr, function (A, B) {
            //Для смены направления сортировки мы просто поменяем знак на >
            return A.updatedAt > B.updatedAt
        })
        action = 1;
    }
    deleteClientsList();
    createClientsList(clientsArr);
    collapseContactIcon();

    // Развернём стрелочку
    document.querySelector('.nav-item__id-icon').classList.remove('rotate');
    document.querySelector('.column-fio').classList.remove('column-fio--click');
    document.querySelector('.nav-item__date-create-icon').classList.remove('rotate');
    document.querySelector('.nav-item__last-create-icon').classList.toggle('rotate');
})

//Строка поиска
//Получим отфильтрованный массив
const haederInput = document.querySelector('.header_input');
function getOptions(word, arr) {
    return arr.filter(v => {

        const regex = new RegExp(word, 'gi');

        return v.fio.match(regex);
    })
}

function createOptions() {
    const options = getOptions(haederInput.value, clientsArr);
    deleteClientsList();
    createClientsList(options);
    collapseContactIcon();
}

haederInput.addEventListener('input', () => setTimeout(createOptions, 300));

//Закрытие спиннера
window.onload = function () {
    // if (document.querySelector('.line')) 
    document.querySelector('.spinner-border__main').classList.add('loaded');
    // setTimeout(function() {
    //     document.querySelector('.spinner-border').style.display = 'none';
    // }, 1000)
}

const hashUpdate = document.getElementById('hash-update');


window.addEventListener('hashchange', () => {

    // console.log(location.hash)
    // console.log(location.hash.substring(1))

    // window.location.hash = getId;
})

window.location.hash = 123123123;

//Отключим ввод с клавиатуры чисел
function noNum() {
    this.value = this.value.replace(regNum, '');
}

//Отключим ввод с клавиатуры букв
function noChar() {
    this.value = this.value.replace(regChar, '');
}
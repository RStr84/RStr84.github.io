const inputField = document.querySelector('#inputField');
const addButton = document.querySelector('#addButton');
const itemList = document.querySelector('#itemList');

window.onload = function () {
    loadItemsFromLocalStorage();
};

// Laden der Daten vom LocalStorage
const loadItemsFromLocalStorage = function () {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    storedItems.forEach(item => {
        addItemToDOM(item.text, item.checked);
    });
};

// Add Item
// erzeugt einen neuen Paragrafen mit dem ItemText aus dem Input-Feld
// zusätzlich wird der ItemText in "rot" ausgegeben
// 'item' bezieht sich aud Style.
// wenn der User nichts eingibt und den Add-Button klickt, wird nichts ausgeführt
const addItemToDOM = function (itemText, checked) {
    if (itemText === '') return;
    const listItem = document.createElement('div');
    listItem.classList.add('item');

    // Checkbox
    // es wird ein Input-Feld des Typs "Checkbox" erzeugt, dass die Schriftfarbe des ListItems,
    // wenn die Checkbox gesetzt ist oder nicht
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    checkbox.addEventListener('change', () => {
        listItem.classList.toggle('grün', checkbox.checked);
        listItem.classList.toggle('rot', !checkbox.checked);
        textNode.classList.toggle('rot', !checkbox.checked);
        saveList();
    });

    // Span
    // damit der ItemText nach Hinzufügen "rot" erscheint
    const textNode = document.createElement('span');
    textNode.textContent = itemText;
    textNode.classList.add('rot');
    // setzt die Textfarbe anhand des Zustands der Checkbox
    if (checked) {
        listItem.classList.add('grün');
        textNode.classList.remove('rot');
    }

    // TextNode und Edit-Button
    // hier wird der ItemTextNode (inputField.value) übernommen und außerdem ein Edit-Button erstellt,
    // der mit einem EventListener auf die später deklarierte Funktion EditItem zugreifen kann
    const editButton = document.createElement('button');
    editButton.textContent = 'Ändern';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => editItem(listItem, itemText));

    // Delete
    // Buttonerstellung und Benennung, sowie Hinzufügen eine EventListeners, der bei Klicken mit
    // der remove-Methode das Item löscht
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Löschen';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
        listItem.remove();
        saveList();
    });

    // AppendChild für Buttons und Checkbox/TextNode
    // hier werden die einzelnen Elemente (Checkbox, TextNode, EditButton, DeleteButton)
    // als ListItem-Container zur ItemList hinzugefügt
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';

    // Button-Container
    // hier werden die Buttons separat einem Container hinzugefügt aus Gründen des Styles
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    // Append aller Elemente zum listItem
    listItem.appendChild(checkbox);
    listItem.appendChild(textNode);
    listItem.appendChild(buttonContainer);

    // Append des ListItems zur ItemList
    itemList.appendChild(listItem);

    // Return
    // nach dem Ausführen der addItem-Funktion wird das Input-Feld "geleert"
    inputField.value = '';
    saveList();

};

const saveList = function () {
    const items = [];
    itemList.childNodes.forEach(item => {
        if (item.childNodes.length >= 3) {
            const text = item.childNodes[1].textContent;
            const checked = item.childNodes[0].checked;
            items.push({ text, checked });
        }
    });
    localStorage.setItem('items', JSON.stringify(items));
    console.log('Items erfolgreich gespeichert', items);
};

// Edit-Methode (als Deklaration, da weiter oben EventListener)
// als Input-Feld wird ein "Prompt" erzeugt mit den Parametern "Message" und dem "Default-Wert"
// bzw. dem ursprünglichen Wert (ItemText)
// mit der If-Abfrage wird sichergestellt, dass ein neuer Wert erzeugt werden muss
// listItem.childNodes[1] bezieht sich auf den ItemText, wobei [0] = Checkbox, [2] = Edit-Button
// und [3] = Delete-Button sind
function editItem(listItem, oldText) {
    const newText = prompt('Ändere die Eingabe:', oldText);
    if (newText !== null && newText !== '') {
        listItem.childNodes[1].textContent = newText;
        saveList();
    }
}

// Item hinzufügen, wenn die Eingabetaste gedrückt wird
inputField.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addButton.click();
    }
});

// Item hinzufügen, wenn der Add-Button gedrückt wird
addButton.addEventListener('click', () => {
    const itemText = inputField.value.trim();
    if (itemText !== '') {
        addItemToDOM(itemText, false);
    }
});
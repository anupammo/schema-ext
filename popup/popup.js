// popup/popup.js

document.addEventListener('DOMContentLoaded', () => {
    const schemaSelect = document.getElementById('schemaType');
    const generateBtn = document.getElementById('generateSchema');
    const outputArea = document.getElementById('schemaOutput');
    const formContainer = document.getElementById('missingFieldsForm');

    let scannedData = {};
    let requiredFields = [];

    // Request scanned data from content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'scanPage' }, (response) => {
            if (response?.data) {
                scannedData = response.data;
                console.log('Scanned Data:', scannedData);
            }
        });
    });

    // When schema type changes, update required fields
    schemaSelect.addEventListener('change', () => {
        requiredFields = getRequiredFields(schemaSelect.value);
        renderMissingFieldsForm();
    });

    // Generate schema on button click
    generateBtn.addEventListener('click', () => {
        const userInputs = collectFormInputs();
        const finalData = { ...scannedData, ...userInputs };
        const schema = buildSchema(schemaSelect.value, finalData);
        outputArea.value = JSON.stringify(schema, null, 2);
    });

    function getRequiredFields(type) {
        const templates = {
            "Article": ["headline", "author", "datePublished", "mainEntityOfPage"],
            "Product": ["name", "image", "description", "sku", "offers"],
            "Event": ["name", "startDate", "location", "description"]
        };
        return templates[type] || [];
    }

    function renderMissingFieldsForm() {
        formContainer.innerHTML = '';
        requiredFields.forEach(field => {
            if (!scannedData[field]) {
                const label = document.createElement('label');
                label.textContent = `${field}: `;
                const input = document.createElement('input');
                input.type = 'text';
                input.name = field;
                label.appendChild(input);
                formContainer.appendChild(label);
                formContainer.appendChild(document.createElement('br'));
            }
        });
    }

    function collectFormInputs() {
        const inputs = formContainer.querySelectorAll('input');
        const data = {};
        inputs.forEach(input => {
            if (input.value.trim()) {
                data[input.name] = input.value.trim();
            }
        });
        return data;
    }

    function buildSchema(type, data) {
        // This will call your schemaTemplates.js functions
        if (window.schemaTemplates && typeof window.schemaTemplates[type] === 'function') {
            return window.schemaTemplates[type](data);
        }
        return {};
    }
});

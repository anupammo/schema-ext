// popup/popup.js

document.addEventListener('DOMContentLoaded', () => {
    const schemaSelect = document.getElementById('schemaType');
    const scanBtn = document.getElementById('scanBtn');
    const outputArea = document.getElementById('output');
    const formContainer = document.getElementById('formContainer');
    const copyBtn = document.getElementById('copyBtn');
    let currentType = schemaSelect.value;

    let scannedData = {};
    let requiredFields = [];

    // Request scanned data from content script
    scanBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'scanPage' }, (response) => {
                if (response?.data) {
                    scannedData = response.data;
                    currentType = schemaSelect.value;
                    requiredFields = getRequiredFields(currentType);
                    renderMissingFieldsForm();
                    // Build and show schema
                    const userInputs = collectFormInputs();
                    const finalData = { ...getTypeData(scannedData, currentType), ...userInputs };
                    const schema = buildSchema(currentType, finalData);
                    outputArea.textContent = JSON.stringify(schema, null, 2);
                    console.log('Scanned Data:', scannedData);
                }
            });
        });
    });

    // Copy JSON-LD to clipboard
    copyBtn.addEventListener('click', () => {
        const json = outputArea.textContent;
        if (json) {
            navigator.clipboard.writeText(json).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy JSON-LD';
                }, 1200);
            });
        }
    });

    // When schema type changes, update required fields
    schemaSelect.addEventListener('change', () => {
        currentType = schemaSelect.value;
        requiredFields = getRequiredFields(currentType);
        renderMissingFieldsForm();
    });

    function getTypeData(data, type) {
        // Map lowercase type to correct key in scannedData
        const map = {
            article: 'article',
            breadcrumb: 'breadcrumb',
            faq: 'faq',
            localBusiness: 'localBusiness',
            organization: 'organization',
            profile: 'profile'
        };
        return data[map[type]] || {};
    }

    function getRequiredFields(type) {
        const templates = {
            article: ["headline", "author", "datePublished", "description"],
            breadcrumb: ["position", "name", "item"],
            faq: ["question", "answer"],
            localBusiness: ["name", "address", "phone", "website"],
            organization: ["name", "url", "logo"],
            profile: ["name", "jobTitle", "image"]
        };
        return templates[type] || [];
    }

    function renderMissingFieldsForm() {
        formContainer.innerHTML = '';
        const typeData = getTypeData(scannedData, currentType);
        requiredFields.forEach(field => {
            if (!typeData[field]) {
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
        if (window.SchemaTemplates && typeof window.SchemaTemplates[type] === 'function') {
            return window.SchemaTemplates[type](data);
        }
        return {};
    }
});

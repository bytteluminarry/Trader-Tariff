document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('#allCountriesSelection .inner ul li').forEach(function (li) {
        li.addEventListener('click', function () {
            var spanElement = document.querySelector('#allCountriesSelection .inner span');
            spanElement.textContent = li.textContent;
        });
    });

    var tabs = document.querySelectorAll('#tabPanel .tabs li');
    var panelsLists = document.querySelectorAll('.panels-list .panel');

    tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (t) {
                t.classList.remove('active');
            });

            panelsLists.forEach(function (panelList) {
                panelList.classList.remove('show');
            });

            tab.classList.add('active');
            panelsLists[index].classList.add('show');
        });
    });
});

document.addEventListener('click', function (event) {
    var ulElement = document.querySelector('#allCountriesSelection .inner ul');
    var innerDiv = document.querySelector('#allCountriesSelection .inner');
    ulElement.style.display = 'none';
});

function toggleDropdown(event) {
    var ulElement = document.querySelector('#allCountriesSelection .inner ul');
    ulElement.style.display = (ulElement.style.display === 'block') ? 'none' : 'block';
    event.stopPropagation();
}

function toggleInformativeDiv(anchor) {
    var divToToggle = anchor.nextElementSibling;

    if (divToToggle.style.display === 'none' || divToToggle.style.display === '') {
        divToToggle.style.display = 'block';
    } else {
        divToToggle.style.display = 'none';
    }
}

function CreatePopup() {
    var popupBackground = document.createElement("div");
    popupBackground.style.position = "fixed";
    popupBackground.style.width = "100%";
    popupBackground.style.height = "100%";
    popupBackground.style.left = "0";
    popupBackground.style.top = "0";
    popupBackground.style.display = "grid";
    popupBackground.style.placeItems = "center";
    popupBackground.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    popupBackground.style.zIndex = "1000";

    var popupContainer = document.createElement("div");
    popupContainer.classList.add("popupContainer");
    popupContainer.style.position = "relative";
    popupContainer.style.width = "70%";
    popupContainer.style.height = "80%";
    popupContainer.style.display = "flex";
    popupContainer.style.flexDirection = "column";
    popupContainer.style.backgroundColor = "#fff";
    popupContainer.style.padding = "20px";
    popupContainer.style.border = "1px solid #ccc";
    popupContainer.style.borderRadius = "5px";
    popupContainer.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    popupContainer.style.overflow = "hidden";

    var topDiv = document.createElement("div");
    topDiv.classList.add("topDiv");
    topDiv.style.padding = "20px";
    topDiv.style.borderBottom = "1px solid #ccc";
    topDiv.style.overflow = "hidden";
    topDiv.style.position = "relative";
    popupContainer.appendChild(topDiv);

    var title = document.createElement("h2");
    title.style.fontSize = "2rem";
    title.style.color = "#333";
    topDiv.appendChild(title);

    var paragraph = document.createElement("p");
    paragraph.style.fontSize = "1.1rem";
    paragraph.style.marginTop = "10px";
    paragraph.style.marginBottom = "20px";
    paragraph.style.color = "#444";
    topDiv.appendChild(paragraph);

    var closeButton = document.createElement("button");
    closeButton.innerText = "X";
    closeButton.onclick = function () {
        document.body.removeChild(popupBackground);
    };
    closeButton.style.float = "right";
    closeButton.style.fontSize = "1rem";
    closeButton.style.color = "#333";
    closeButton.style.background = "none";
    closeButton.style.border = "1px solid #333";
    closeButton.style.padding = "10px 20px";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.style.position = "absolute";
    closeButton.style.top = "20px";
    closeButton.style.right = "20px";
    topDiv.appendChild(closeButton);

    var scrollDiv = document.createElement("div");
    scrollDiv.classList.add("scrollDiv");
    scrollDiv.style.overflowY = "auto";
    scrollDiv.style.padding = "30px";
    scrollDiv.style.flex = "1";
    popupContainer.appendChild(scrollDiv);

    popupBackground.appendChild(popupContainer);

    return popupBackground;
}

function formatDateString(dateString) {
    const dateObject = new Date(dateString);

    const day = dateObject.getDate();
    const monthIndex = dateObject.getMonth();
    const year = dateObject.getFullYear();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];

    const monthText = months[monthIndex];

    return day + ' ' + monthText + ' ' + year;
}

let selectedCommodityCode = null;

function dutyCalculator() {
    window.open(`https://trade-tariff.service.gov.uk/duty-calculator/uk/${selectedCommodityCode}/import-date`, '_blank');
}

document.querySelector('#searchResultsTbody').innerHTML = "";
document.querySelector('#importDutiesTbody').innerHTML = "";
document.querySelector('#quotasTbody').innerHTML = "";
document.querySelector('#additionalDutiesTbody').innerHTML = "";
document.querySelector('#suspensionsTbody').innerHTML = "";
document.querySelector('#importVatTbody').innerHTML = "";
document.querySelector('#importControlsTbody').innerHTML = "";
document.querySelector('#exportsTbody').innerHTML = "";
document.querySelector('#allCountriesSelectionList').innerHTML = "";

function checkInput() {
    var input = document.getElementById('inputField').value.trim();

    var digitPattern = /^\d+$/;

    if (input.trim() === '') {
        alert('Input is empty.');
    } else if (digitPattern.test(input)) {
        RenderCommodityCode(input);
    } else {
        getCommodityCode(input);
    }
}

function getCommodityCode(name) {
    fetch(`https://data.api.trade.gov.uk/v1/datasets/uk-tariff-2021-01-01/versions/v2.1.0/data?format=json&query-s3-select=SELECT%20c.commodity__code,c.commodity__description%20FROM%20S3Object[*].commodities[*]%20c%20WHERE%20lower(c.commodity__description)%20like%20'%${name}%'`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.querySelector('#searchResultsLabel1').innerHTML = `Search results for ‘${name}’`;
            document.querySelector('#searchResultsLabel2').innerHTML = `Best commodity matches for ‘${name}’`;

            document.querySelector('#searchResults').style.display = "flex";

            data.rows.forEach((item) => {
                const newRow = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.innerHTML = `<a onclick="RenderCommodityCode('${item.commodity__code}')">${item.commodity__description}</a>`;

                const codeCell = document.createElement('td');
                const codeCellTD = document.createElement('div');
                codeCellTD.classList.add('code-container');
                codeCellTD.innerHTML = "";

                for (let i = 0; i < item.commodity__code.length; i += 2) {
                    const pair = item.commodity__code.slice(i, i + 2);
                    codeCellTD.innerHTML += i == 0 ? `<div class="code-digit primary">${pair}</div>` :
                        i == 2 ? `<div class="code-digit secondary">${pair}</div>` : `<div class="code-digit">${pair}</div>`;
                }

                codeCell.appendChild(codeCellTD);

                newRow.appendChild(nameCell);
                newRow.appendChild(codeCell);

                document.querySelector('#searchResultsTbody').appendChild(newRow);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

let Countries = [];
let MeasuresTypes = [];
let MeasuresConditions = [];
let DutiesExpressions = [];
let Footnotes = [];
let PreferenceCodes = [];
let OrderNumbers = [];
let Measures = [];

function RenderCommodityCode(input) {
    Countries = [];
    DutiesExpressions = [];
    MeasuresTypes = [];
    MeasuresConditions = [];
    Footnotes = [];
    PreferenceCodes = [];
    OrderNumbers = [];
    Measures = [];

    fetch(`https://www.trade-tariff.service.gov.uk/api/v2/commodities/${input}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch commodity code');
            }
        })
        .then(response => {
            let data = response.data;

            document.querySelector('#commodityCode').innerText = `Commodity ${input}`;
            document.querySelector('#commodityCode2').innerText = input;
            document.querySelector('#commodityDescription').innerText = data.attributes.description;
            document.querySelector('#commodityValidFrom').innerText = formatDateString(data.attributes.validity_start_date);
            document.querySelector('#currentDate').innerText = formatDateString(new Date());
            document.querySelector('#label1').innerHTML = `The table below lists the import duties that apply to the import of commodity ${input}.`;
            document.querySelector('#label2').innerHTML = `Use our tariff duty calculator to <span>calculate the duties and taxes applicable to the import of commodity ${input}.</span> Click on a measure type to find out more about the measure and the preference code to be used on declarations.`;
            document.querySelector('#label3').innerHTML = `The commodity code for exporting and <span>Intrastat reporting</span> is ${input.substring(0, 8)}.`;
            document.querySelector('#label4').innerHTML = `Notes for commodity ${input}`;

            if (response.hasOwnProperty('included')) {
                let Included = Array.from(response.included);

                Included.forEach(item => {
                    if (item.hasOwnProperty('type')) {
                        if (item.type === "geographical_area") {
                            Countries.push(item);
                            document.querySelector('#allCountriesSelectionList').innerHTML += `<li onclick="filterBySelectionEncoded('${btoa(encodeURIComponent(item.attributes.description.replace("ERGA OMNES", "All countries")))}')">${item.attributes.description.replace("ERGA OMNES", "All countries")}</li>`;
                        }
                    }
                });

                Included.forEach(item => {
                    if (item.hasOwnProperty('type')) {
                        if (item.type === "measure_type") {
                            MeasuresTypes.push(item);
                        }
                    }
                });

                Included.forEach(item => {
                    if (item.hasOwnProperty('type')) {
                        if (item.type === "measure_condition") {
                            MeasuresConditions.push(item);
                        }
                    }
                });

                Included.forEach(item => {
                    if (item.hasOwnProperty('type')) {
                        if (item.type === "duty_expression") {
                            DutiesExpressions.push(item);
                        }
                    }
                });

                Included.forEach(item => {
                    if (item.hasOwnProperty('type')) {
                        if (item.type === "footnote") {
                            Footnotes.push(item);
                        }
                    }
                });

                Included.forEach(item => {
                    if (item.hasOwnProperty('type')) {
                        if (item.type === "preference_code") {
                            PreferenceCodes.push(item);
                        }
                    }
                });

                Included.forEach(item => {
                    if (item.hasOwnProperty('type')) {
                        if (item.type === "order_number") {
                            OrderNumbers.push(item);
                        }
                    }
                });

                Included.forEach(item => {
                    if (item.hasOwnProperty('type')) {
                        if (item.type === "measure") {
                            Measures.push(item);
                        }
                    }
                });

                RenderRelations();

                selectedCommodityCode = input;
                document.querySelector('#allCountriesSelectionList').innerHTML = "";
                document.querySelector('#allCountriesSelection').style.display = "flex";
                document.querySelector('#tabPanel').style.display = "block";
            }
        })
        .catch(error => {
            console.error('Error fetching commodity code:', error);
        });
}

function RenderRelations() {
    document.querySelector('#importDutiesTbody').innerHTML = "";
    document.querySelector('#quotasTbody').innerHTML = "";
    document.querySelector('#additionalDutiesTbody').innerHTML = "";
    document.querySelector('#suspensionsTbody').innerHTML = "";
    document.querySelector('#importVatTbody').innerHTML = "";
    document.querySelector('#importControlsTbody').innerHTML = "";
    document.querySelector('#exportsTbody').innerHTML = "";
    let fillTables = false;
    let existingIds = {};
    let selectedCountry = document.querySelector("#selectedCountry").innerHTML;

    Measures.forEach((measure) => {
        if (measure.hasOwnProperty('attributes')) {
            let vat = false;
            let exise = false;

            if (measure.attributes.hasOwnProperty('vat')) {
                vat = measure.attributes.vat;
            }

            if (measure.attributes.hasOwnProperty('excise')) {
                excise = measure.attributes.excise;
            }

            let is_export = measure.attributes.export === true;
            let is_import = measure.attributes.import === true;

            if (measure.hasOwnProperty('relationships')) {
                if (measure.attributes.import === true ||
                    measure.attributes.export === true) {
                    let relationships = measure.relationships;

                    fillTables = false;

                    let measure_type = null;
                    if (relationships.hasOwnProperty('measure_type')) {
                        measure_type = MeasuresTypes.find(measure_type => measure_type.id === relationships.measure_type.data.id);
                    }

                    let duty_expression = null;
                    if (relationships.hasOwnProperty('duty_expression')) {
                        duty_expression = DutiesExpressions.find(duty_expression => duty_expression.id === relationships.duty_expression.data.id);

                    }

                    let footnotes = "";
                    if (relationships.hasOwnProperty('footnotes')) {
                        if (relationships.footnotes.data != null &&
                            relationships.footnotes.data.length > 0) {
                            relationships.footnotes.data.forEach((item, index) => {
                                let footnote = Footnotes.find(footnote => footnote.id === item.id);

                                if (footnote) {
                                    if (index > 0) {
                                        footnotes += " - ";
                                    }



                                    footnotes += `<a onclick="ShowFootnotePopup('${btoa(encodeURIComponent(JSON.stringify(footnote)))}');">${footnote.attributes.code}</a>`;
                                }
                            });
                        }
                    }

                    let preference_code = null;
                    if (relationships.hasOwnProperty('preference_code') &&
                        relationships.preference_code.data &&
                        relationships.preference_code.data.id) {
                        preference_code = PreferenceCodes.find(preference_code => preference_code.id === relationships.preference_code.data.id);
                    }

                    let is_control = false;
                    let conditions = "";
                    if (relationships.hasOwnProperty('measure_conditions')) {
                        if (relationships.measure_conditions.data != null &&
                            relationships.measure_conditions.data.length > 0) {
                            relationships.measure_conditions.data.forEach((item) => {
                                let condition = MeasuresConditions.find(condition => condition.id === item.id);

                                if (condition && condition.attributes.action !== "Measure not applicable") {
                                    if (conditions.length > 0) {
                                        conditions += " - ";
                                    }
                                    if (condition.attributes.action.toLowerCase().indexOf('control') != -1) {
                                        is_control = true;
                                    }

                                    conditions += `<a onclick="try { ShowConditionPopup('${btoa(encodeURIComponent(JSON.stringify(condition)))}'); } catch (error) { alert('An error occurred while encoding the condition. Please try again later.'); }">Condition</a>`;
                                }
                            });
                        }
                    }

                    let order_number = null;
                    if (relationships.hasOwnProperty('order_number') &&
                        relationships.order_number.data) {
                        order_number = OrderNumbers.find(order_number => order_number.id === relationships.order_number.data.id);
                    }

                    if (relationships.hasOwnProperty('geographical_area') &&
                        !existingIds[relationships.geographical_area.data.id]) {
                        //existingIds[relationships.geographical_area.data.id] = true;

                        let country = Countries.find(country => country.id === relationships.geographical_area.data.id);

                        if (selectedCountry.toLowerCase() !== 'all countries') {
                            if (selectedCountry.toLowerCase() === country.attributes.description.replace("ERGA OMNES", "All countries").toLowerCase() ||
                                country.attributes.description.replace("ERGA OMNES", "All countries").toLowerCase() === "all countries") {
                                fillTables = true;
                            }
                        }
                        else {
                            fillTables = true;
                        }


                        if (fillTables) {
                            const newRow = document.createElement('tr');

                            const countryCell = document.createElement('td');

                            var digitPattern = /^\d+$/;

                            if (digitPattern.test(country.id)) {
                                countryCell.innerHTML = `<a onclick="ShowGeographicalAreasPopup('${country.id}', '${btoa(encodeURIComponent(country.attributes.description.replace("ERGA OMNES", "All countries")))}')">${country.attributes.description.replace("ERGA OMNES", "All countries")} (${country.id})</a>`;
                            } else {
                                countryCell.textContent = `${country.attributes.description.replace("ERGA OMNES", "All countries")} (${country.id})`;
                            }

                            const measureTypeCell = document.createElement('td');
                            measureTypeCell.innerHTML = `<a onclick="ShowMeasuresTypesPopup('${measure_type.id}', '${btoa(encodeURIComponent(measure_type.attributes.description))}', ${is_export}, '${preference_code ? preference_code.id : ''}', '${preference_code ? btoa(encodeURIComponent(preference_code.attributes.description)) : ''}')">${measure_type.attributes.description}</a>`;

                            if (order_number) {
                                measureTypeCell.innerHTML += `<br/><p>${order_number.id}</p>`;
                            }

                            const dutyRateCell = document.createElement('td');
                            dutyRateCell.textContent = `${duty_expression.attributes.verbose_duty}`;

                            const conditionsCell = document.createElement('td');
                            conditionsCell.innerHTML = conditions;

                            const footnotesCell = document.createElement('td');
                            footnotesCell.innerHTML = footnotes;

                            newRow.appendChild(countryCell);
                            newRow.appendChild(measureTypeCell);
                            newRow.appendChild(dutyRateCell);
                            newRow.appendChild(conditionsCell);
                            newRow.appendChild(footnotesCell);

                            if (is_import) {
                                if (is_control) {
                                    document.getElementById('importControlsTbody').appendChild(newRow);
                                }
                                else if (vat || excise) {
                                    document.getElementById('importVatTbody').appendChild(newRow);
                                }
                                else {
                                    if (measure_type.id === "117") {
                                        document.getElementById('suspensionsTbody').appendChild(newRow);
                                    }
                                    else if (measure_type.id === "695") {
                                        document.getElementById('additionalDutiesTbody').appendChild(newRow);
                                    }
                                    else {
                                        if (order_number) {
                                            document.getElementById('quotasTbody').appendChild(newRow);
                                        }
                                        else {
                                            document.getElementById('importDutiesTbody').appendChild(newRow);
                                        }
                                    }
                                }
                            }
                            if (is_export) {
                                document.getElementById('exportsTbody').appendChild(newRow);
                            }
                        }
                    }
                }
            }
        }
    });
}

function filterBySelection(country_description) {
    document.querySelector("#selectedCountry").innerHTML = country_description;
    RenderCommodityCode(selectedCommodityCode);

    document.getElementById('importControlsTbody').scrollIntoView({ behavior: 'smooth' });
}

function filterBySelectionEncoded(country_descriptionEncoded) {
    var country_description = decodeURIComponent(atob(country_descriptionEncoded));
    document.querySelector("#selectedCountry").innerHTML = country_description;

    RenderCommodityCode(selectedCommodityCode);
    document.getElementById('importControlsTbody').scrollIntoView({ behavior: 'smooth' });
}

function ShowGeographicalAreasPopup(country_id, country_descriptionEncoded) {
    var popupBackground = CreatePopup();
    var popupContainer = popupBackground.getElementsByClassName('popupContainer')[0];
    var topDiv = popupContainer.getElementsByClassName('topDiv')[0];
    var country_description = decodeURIComponent(atob(country_descriptionEncoded));
    var title = popupContainer.getElementsByTagName('h2')[0];
    title.innerText = "Geographical Areas for " + country_id;
    var paragraph = popupContainer.getElementsByTagName('p')[0];
    var scrollDiv = popupContainer.getElementsByClassName('scrollDiv')[0];

    var table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    headerRow.style.borderBottom = "1px solid #333";
    var idHeader = document.createElement("th");
    idHeader.innerText = "ID";
    idHeader.style.fontWeight = "bold";
    idHeader.style.fontSize = "1.2rem";
    idHeader.style.color = "#333";
    idHeader.style.textAlign = "left";
    idHeader.style.paddingTop = "10px";
    idHeader.style.paddingBottom = "10px";
    var descriptionHeader = document.createElement("th");
    descriptionHeader.innerText = "Description";
    descriptionHeader.style.fontWeight = "bold";
    descriptionHeader.style.fontSize = "1.2rem";
    descriptionHeader.style.color = "#333";
    descriptionHeader.style.textAlign = "left";
    descriptionHeader.style.paddingTop = "10px";
    descriptionHeader.style.paddingBottom = "10px";
    headerRow.appendChild(idHeader);
    headerRow.appendChild(descriptionHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var countries = { areas: [] };

    if (country_id === "1011") {
        Countries.forEach(item => {
            countries.areas.push(
                { id: item.id, description: item.attributes.description }
            );
        });
    }
    else if (country_id === "1080") {
        countries.areas.push(
            { id: "GG", description: "Guernsey, Alderney, Sark" },
            { id: "JE", description: "Jersey" }
        );
    }
    else if (country_id === "1033") {
        countries.areas.push(
            { id: "AG", description: "Antigua and Barbuda" },
            { id: "BB", description: "Barbados" },
            { id: "BS", description: "The Bahamas" },
            { id: "BZ", description: "Belize" },
            { id: "DM", description: "Dominica" },
            { id: "DO", description: "Dominican Republic" },
            { id: "GD", description: "Grenada" },
            { id: "GY", description: "Guyana" },
            { id: "JM", description: "Jamaica" },
            { id: "KN", description: "St Kitts and Nevis" },
            { id: "LC", description: "St Lucia" },
            { id: "SR", description: "Suriname" },
            { id: "TT", description: "Trinidad and Tobago" },
            { id: "VC", description: "St Vincent" }
        );
    }
    else if (country_id === "2200") {
        countries.areas.push(
            { id: "CR", description: "Costa Rica" },
            { id: "GT", description: "Guatemala" },
            { id: "HN", description: "Honduras" },
            { id: "NI", description: "Nicaragua" },
            { id: "PA", description: "Panama" },
            { id: "SV", description: "El Salvador" }
        );
    }
    else if (country_id === "1062") {
        countries.areas.push(
            { id: "AF", description: "Afghanistan" },
            { id: "AO", description: "Angola" },
            { id: "BD", description: "Bangladesh" },
            { id: "BF", description: "Burkina Faso" },
            { id: "BI", description: "Burundi" },
            { id: "BJ", description: "Benin" },
            { id: "BT", description: "Bhutan" },
            { id: "CD", description: "Congo (Democratic Republic)" },
            { id: "CF", description: "Central African Republic" },
            { id: "DJ", description: "Djibouti" },
            { id: "ER", description: "Eritrea" },
            { id: "ET", description: "Ethiopia" },
            { id: "GM", description: "The Gambia" },
            { id: "GN", description: "Guinea" },
            { id: "GW", description: "Guinea-Bissau" },
            { id: "HT", description: "Haiti" },
            { id: "KH", description: "Cambodia" },
            { id: "KI", description: "Kiribati" },
            { id: "KM", description: "Comoros" },
            { id: "LA", description: "Laos" },
            { id: "LR", description: "Liberia" },
            { id: "LS", description: "Lesotho" },
            { id: "MG", description: "Madagascar" },
            { id: "ML", description: "Mali" },
            { id: "MM", description: "Myanmar (Burma)" },
            { id: "MR", description: "Mauritania" },
            { id: "MW", description: "Malawi" },
            { id: "MZ", description: "Mozambique" },
            { id: "NE", description: "Niger" },
            { id: "NP", description: "Nepal" },
            { id: "RW", description: "Rwanda" },
            { id: "SB", description: "Solomon Islands" },
            { id: "SD", description: "Sudan" },
            { id: "SL", description: "Sierra Leone" },
            { id: "SN", description: "Senegal" },
            { id: "SO", description: "Somalia" },
            { id: "SS", description: "South Sudan" },
            { id: "ST", description: "Sao Tome and Principe" },
            { id: "TD", description: "Chad" },
            { id: "TG", description: "Togo" },
            { id: "TL", description: "East Timor" },
            { id: "TV", description: "Tuvalu" },
            { id: "TZ", description: "Tanzania" },
            { id: "UG", description: "Uganda" },
            { id: "VU", description: "Vanuatu" },
            { id: "YE", description: "Yemen" },
            { id: "ZM", description: "Zambia" }
        );
    }
    else if (country_id === "1061") {
        countries.areas.push(
            { id: "BO", description: "Bolivia" },
            { id: "CG", description: "Congo" },
            { id: "CK", description: "Cook Islands" },
            { id: "CV", description: "Cabo Verde" },
            { id: "DZ", description: "Algeria" },
            { id: "FM", description: "Micronesia" },
            { id: "KG", description: "Kyrgyzstan" },
            { id: "LK", description: "Sri Lanka" },
            { id: "MN", description: "Mongolia" },
            { id: "NG", description: "Nigeria" },
            { id: "NU", description: "Niue" },
            { id: "PH", description: "Philippines" },
            { id: "PK", description: "Pakistan" },
            { id: "SY", description: "Syria" },
            { id: "TJ", description: "Tajikistan" },
            { id: "UZ", description: "Uzbekistan" }
        );
    }
    else if (country_id === "1060") {
        countries.areas.push(
            { id: "ID", description: "Indonesia" },
            { id: "IN", description: "India" }
        );
    }
    else if (country_id === "1034") {
        countries.areas.push(
            { id: "KM", description: "Comoros" },
            { id: "MG", description: "Madagascar" },
            { id: "MU", description: "Mauritius" },
            { id: "SC", description: "Seychelles" },
            { id: "ZW", description: "Zimbabwe" }
        );
    }
    else if (country_id === "1013") {
        countries.areas.push(
            { id: "AT", description: "Austria" },
            { id: "BE", description: "Belgium" },
            { id: "BG", description: "Bulgaria" },
            { id: "CY", description: "Cyprus" },
            { id: "CZ", description: "Czechia" },
            { id: "DE", description: "Germany" },
            { id: "DK", description: "Denmark" },
            { id: "EE", description: "Estonia" },
            { id: "ES", description: "Spain" },
            { id: "EU", description: "European Union" },
            { id: "FI", description: "Finland" },
            { id: "FR", description: "France" },
            { id: "GR", description: "Greece" },
            { id: "HR", description: "Croatia" },
            { id: "HU", description: "Hungary" },
            { id: "IE", description: "Ireland" },
            { id: "IT", description: "Italy" },
            { id: "LT", description: "Lithuania" },
            { id: "LU", description: "Luxembourg" },
            { id: "LV", description: "Latvia" },
            { id: "MT", description: "Malta" },
            { id: "NL", description: "Netherlands" },
            { id: "PL", description: "Poland" },
            { id: "PT", description: "Portugal" },
            { id: "RO", description: "Romania" },
            { id: "SE", description: "Sweden" },
            { id: "SI", description: "Slovenia" },
            { id: "SK", description: "Slovakia" }
        );
    }
    else if (country_id === "2080") {
        countries.areas.push(
            { id: "AI", description: "Anguilla" },
            { id: "BM", description: "Bermuda" },
            { id: "FK", description: "Falkland Islands" },
            { id: "GS", description: "South Georgia and South Sandwich Islands" },
            { id: "IO", description: "British Indian Ocean Territory" },
            { id: "KY", description: "Cayman Islands" },
            { id: "MS", description: "Montserrat" },
            { id: "PN", description: "Pitcairn, Henderson, Ducie and Oeno Islands" },
            { id: "SH", description: "St Helena, Ascension and Tristan da Cunha" },
            { id: "TC", description: "Turks and Caicos Islands" },
            { id: "VG", description: "British Virgin Islands" }
        );
    }
    else if (country_id === "1035") {
        countries.areas.push(
            { id: "BW", description: "Botswana" },
            { id: "LS", description: "Lesotho" },
            { id: "MZ", description: "Mozambique" },
            { id: "NA", description: "Namibia" },
            { id: "SZ", description: "Eswatini" }
        );
    }

    paragraph.innerHTML = `Geographical area <strong>${country_id}</strong>, <strong>${country_description}</strong>, includes the following ${countries.areas.length} countries / regions.`;

    var tbody = document.createElement("tbody");
    countries.areas.forEach(function (area) {
        var row = document.createElement("tr");
        row.style.borderBottom = "1px solid #ccc";
        var idCell = document.createElement("td");
        idCell.innerText = area.id;
        idCell.style.textAlign = "left";
        var descriptionCell = document.createElement("td");
        descriptionCell.innerText = area.description;
        descriptionCell.style.textAlign = "left";
        descriptionCell.style.paddingTop = "10px";
        descriptionCell.style.paddingBottom = "10px";
        row.appendChild(idCell);
        row.appendChild(descriptionCell);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    scrollDiv.appendChild(table);

    document.body.appendChild(popupBackground);
}

function ShowMeasuresTypesPopup(measure_id, measure_descriptionEncoded, is_export, preference_code_id, preference_code_descriptionEncoded) {
    var popupBackground = CreatePopup();
    var popupContainer = popupBackground.getElementsByClassName('popupContainer')[0];
    var topDiv = popupContainer.getElementsByClassName('topDiv')[0];
    var measure_description = decodeURIComponent(atob(measure_descriptionEncoded));
    var preference_code_description = preference_code_descriptionEncoded ? decodeURIComponent(atob(preference_code_descriptionEncoded)) : '';
    var title = popupContainer.getElementsByTagName('h2')[0];
    title.innerText = measure_description;
    var paragraph = popupContainer.getElementsByTagName('p')[0];
    paragraph.innerText = `About ${measure_description} measures`;
    var scrollDiv = popupContainer.getElementsByClassName('scrollDiv')[0];

    var table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    let trade_direction = is_export ? "Import, Export" : "Import only";

    var rowsData = [
        ["Measure type", measure_id],
        ["Description", measure_description],
        ["Trade direction", trade_direction],
        ["Preference code", preference_code_id],
        ["Preference code description", preference_code_description]
    ];

    rowsData.forEach(function (rowData) {
        var row = document.createElement("tr");
        let index = 0;
        rowData.forEach(function (cellData) {
            var cell = document.createElement(index === 0 ? "th" : "td"); // Check if it's the first row
            if (index === 0) {
                cell.style.fontWeight = "bold";
                cell.style.color = "#333";
            }
            else {
                cell.style.paddingLeft = "20px";
            }
            index++;
            cell.style.textAlign = "left";
            cell.style.paddingTop = "10px";
            cell.style.paddingBottom = "10px";
            row.style.borderBottom = "1px solid #ccc";
            cell.innerHTML = cellData;
            row.appendChild(cell);
        });

        table.appendChild(row);
    });

    scrollDiv.appendChild(table);

    document.body.appendChild(popupBackground);
}

function ShowFootnotePopup(footnoteJSON) {
    let decodedURI = atob(footnoteJSON);
    let decodedFootnoteJSON = decodeURIComponent(decodedURI);
    let footnote = JSON.parse(decodedFootnoteJSON);
    let footnote_id = footnote.id;
    let footnote_description = footnote.attributes.description;

    var popupBackground = CreatePopup();
    var popupContainer = popupBackground.getElementsByClassName('popupContainer')[0];
    var topDiv = popupContainer.getElementsByClassName('topDiv')[0];
    var title = popupContainer.getElementsByTagName('h2')[0];
    title.innerText = `Footnote with Code(${footnote_id})`;
    var paragraph = popupContainer.getElementsByTagName('p')[0];
    paragraph.innerText = `About ${footnote_id} Code`;
    var scrollDiv = popupContainer.getElementsByClassName('scrollDiv')[0];

    var table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    var rowsData = [
        ["Code", footnote_id],
        ["Description", footnote_description]
    ];

    rowsData.forEach(function (rowData) {
        var row = document.createElement("tr");
        let index = 0;
        rowData.forEach(function (cellData) {
            var cell = document.createElement(index === 0 ? "th" : "td"); // Check if it's the first row
            if (index === 0) {
                cell.style.fontWeight = "bold";
                cell.style.color = "#333";
            }
            else {
                cell.style.paddingLeft = "20px";
            }
            index++;
            cell.style.textAlign = "left";
            cell.style.paddingTop = "10px";
            cell.style.paddingBottom = "10px";
            row.style.borderBottom = "1px solid #ccc";
            cell.innerHTML = cellData;
            row.appendChild(cell);
        });

        table.appendChild(row);
    });

    scrollDiv.appendChild(table);

    document.body.appendChild(popupBackground);
}

function ShowConditionPopup(conditionJson) {
    let decodedURI = atob(conditionJson);
    let decodedConditionJSON = decodeURIComponent(decodedURI);
    let condition = JSON.parse(decodedConditionJSON);

    var popupBackground = CreatePopup();
    var popupContainer = popupBackground.getElementsByClassName('popupContainer')[0];
    var topDiv = popupContainer.getElementsByClassName('topDiv')[0];
    var title = popupContainer.getElementsByTagName('h2')[0];
    title.innerText = condition.attributes.action;
    var paragraph = popupContainer.getElementsByTagName('p')[0];
    paragraph.innerText = `About ${condition.attributes.action}`;
    var scrollDiv = popupContainer.getElementsByClassName('scrollDiv')[0];

    var table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    var rowsData = [
        ["Action", condition.attributes.action],
        ["Action Code", condition.attributes.action_code],
        ["Certificate Description", condition.attributes.certificate_description],
        ["Condition", condition.attributes.condition],
        ["Condition Code", condition.attributes.condition_code],
        ["Guidance CDS", condition.attributes.guidance_cds],
        ["Guidance Chef", condition.attributes.guidance_chief],
        ["Measure Condition Class", condition.attributes.measure_condition_class],
        ["Requirement", condition.attributes.requirement]
    ];

    rowsData.forEach(function (rowData) {
        var row = document.createElement("tr");
        let index = 0;
        rowData.forEach(function (cellData) {
            var cell = document.createElement(index === 0 ? "th" : "td"); // Check if it's the first row
            if (index === 0) {
                cell.style.fontWeight = "bold";
                cell.style.color = "#333";
            }
            else {
                cell.style.paddingLeft = "20px";
            }
            index++;
            cell.style.textAlign = "left";
            cell.style.paddingTop = "10px";
            cell.style.paddingBottom = "10px";
            row.style.borderBottom = "1px solid #ccc";
            cell.innerHTML = cellData;
            row.appendChild(cell);
        });

        table.appendChild(row);
    });

    scrollDiv.appendChild(table);

    document.body.appendChild(popupBackground);
}

const currentUrl = window.location.search;
const searchParams = new URLSearchParams(currentUrl);

if (searchParams.has('query')) {
    document.getElementById('inputField').value = searchParams.get('query');
    checkInput();
} 

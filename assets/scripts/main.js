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
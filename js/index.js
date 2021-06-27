const keyIn = document.getElementById('key');
const accessForm = document.getElementById('access');
const submitBtn = document.getElementById('submit');
const count1P = document.getElementById('count1');
const count2P = document.getElementById('count2');
const loaderDiv = document.getElementById('loader');

const openMod = new bootstrap.Modal(document.getElementById('open'));
const lockedMod = new bootstrap.Modal(document.getElementById('locked'));
const forbiddenMod = new bootstrap.Modal(document.getElementById('forbidden'));
const tooManyMod = new bootstrap.Modal(document.getElementById('tooMany'));
const defaultMod = new bootstrap.Modal(document.getElementById('default'));

// Update number of correct and failed logons
function getCounters() {
    const url = "count";
    const options = {
        method: "GET",
        dataType: "text",
        timeout: 10000
    }
    fetch(url, options).then(response => {
        if (response.ok) {
            response.text().then(text => {
                q = text.split('#');
                count1P.innerText = `Numero totale aperture: ${q[0]}`;
                count2P.innerText = `Tentativi falliti: ${q[1]}`;
            })
        } else {
            count2P.innerText = count1P.innerText = "-E-";
        }
    });
}

// Once DOM is loaded, attach events
document.addEventListener("DOMContentLoaded", () => {

    // Simulate click event when pressing enter
    keyIn.addEventListener('keydown', event => {
        var keyCode = (event.keyCode ? event.keyCode : event.which);
        if (keyCode == 13) {
            submitBtn.dispatchEvent(new Event('click'));
        }
    });

    // Deactivate old-school form submission
    accessForm.addEventListener('submit', event => {
        event.preventDefault();
    });

    // Main button submission
    submitBtn.addEventListener('click', event => {
        const url = `API/enter.php?uKey=${keyIn.value}`;
        const options = {
            method: "GET",
            dataType: "text",
            timeout: 10000
        };

        fetch(url, options).then(response => {
            loaderDiv.style.display = "none";
            switch (response.status) {
                case 200:
                    openMod.show();
                    break;
                case 423:
                    lockedMod.show();
                    break;
                case 403:
                    forbiddenMod.show();
                    break;
                case 429:
                    tooManyMod.show();
                    break;
                default:
                    defaultMod.show();
                    break;
                    getCounters();
            }
        });

        loaderDiv.style.display = "block";
    });

    getCounters();
});
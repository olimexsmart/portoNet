// Once DOM is loaded, attach events
document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById('submit');
    const MPIn = document.getElementById('MP');
    const userkeyIn = document.getElementById('userkey');
    const loaderDiv = document.getElementById('loader');

    // Elements to show/hide
    const oreDiv = document.getElementById('oreGroup');
    const adminStuff = document.getElementById('adminpassword');
    const userStuff = document.getElementById('userpassword');

    // Modal
    const openMod = new bootstrap.Modal(document.getElementById('open'));
    const bodyMod = document.getElementById('bodyMod');

    // List
    const listOl = document.getElementById('list');

    // Remember the last button clicked
    let mode = 'add.php';
    let interval = 0;
    let justTest = 0;

    // Manage mode button group
    document.getElementById('btnNuovo').addEventListener('click', () => {
        oreDiv.classList.remove('d-none');
        userStuff.classList.remove('d-none');
        adminStuff.classList.remove('d-none');
        mode = 'add.php';
    });
    document.getElementById('btnSvuota').addEventListener('click', () => {
        oreDiv.classList.add('d-none');
        userStuff.classList.add('d-none');
        adminStuff.classList.remove('d-none');
        mode = 'revokeAll.php';
    });
    document.getElementById('btnRevoca').addEventListener('click', () => {
        oreDiv.classList.add('d-none');
        userStuff.classList.remove('d-none');
        adminStuff.classList.remove('d-none');
        mode = 'revoke.php';
    });
    document.getElementById('btnTest').addEventListener('click', () => {
        oreDiv.classList.add('d-none');
        userStuff.classList.remove('d-none');
        adminStuff.classList.add('d-none');
        mode = 'enter.php';
        justTest = 1;
    });
    document.getElementById('btnKeys').addEventListener('click', () => {
        oreDiv.classList.add('d-none');
        userStuff.classList.add('d-none');
        adminStuff.classList.remove('d-none');
        mode = 'keyList.php';
    });
    document.getElementById('btnLog').addEventListener('click', () => {
        oreDiv.classList.add('d-none');
        userStuff.classList.add('d-none');
        adminStuff.classList.remove('d-none');
        mode = 'logList.php';
    });

    // Manage interval button group
    document.getElementById('btn6Ore').addEventListener('click', () => {
        interval = 0;
    });
    document.getElementById('btn3Giorni').addEventListener('click', () => {
        interval = 1;
    });
    document.getElementById('btn30Giorni').addEventListener('click', () => {
        interval = 2;
    });
    document.getElementById('btn1Anno').addEventListener('click', () => {
        interval = 3;
    });

    // Simulate click event when pressing enter
    MPIn.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            submitBtn.dispatchEvent(new Event('click'));
        }
    });
    userkeyIn.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            submitBtn.dispatchEvent(new Event('click'));
        }
    });

    // Main button submission
    submitBtn.addEventListener('click', () => {
        const url = `API/${mode}?MP=${MP.value}&uKey=${userkeyIn.value}&interval=${interval}&justTest=${justTest}`;
        const options = {
            method: "GET",
            timeout: 3000
        };

        fetch(url, options).then(response => {
            loaderDiv.style.display = "none";

            // Do not open the modal if we need to display the list
            if (mode == 'keyList.php' || mode == 'logList.php') {
                response.json().then((j) => {
                    listOl.classList.remove('d-none');
                    listOl.innerHTML = '';
                    for (let i = 0; i < j.length; i++) {
                        let html = `<li class="list-group-item d-flex justify-content-between align-items-start">`+
                        `<div class="ms-2 me-auto">`+
                        `<div class="fw-bold fs-4">${j[i].uKey}</div>`+
                        `<b>Expiration date:</b> ${j[i].expDate}</br>`+
                        `<b>Last used:</b> ${j[i].lastUsed}</br>`+
                        `<b>Used</b> ${j[i].nUsed} times`+
                        `</div>`+
                        `<span class="badge bg-${j[i].revoked=='0' ? 'primary' : 'danger'} rounded-pill">`+
                        `${j[i].revoked=='0' ? 'OK' : 'REVOKED'}`+
                        `</span>`+
                        `</li>`;
                        listOl.innerHTML += html;
                    }
                });
            } else {
                listOl.classList.add('d-none');
                response.text().then((text) => {
                    bodyMod.innerHTML = `<b>HTTP Status Code: </b>${response.status}</br>
                    <b>Response: </b>${text}`;
                    openMod.show();
                });
            }

            
        });

        loaderDiv.style.display = "block";
    });



    /*
        //handle = null;
        $('#submit').click(function () {
            d = $('#access').find('input:visible').serialize();
            if ($('#r3')[0].checked)
                d += '@' + (Math.floor(Date.now() / 1000) + parseInt($("input[name=v]:checked").val()));
    
            $.ajax({ // Send request
                url: res,
                method: "POST",
                dataType: "text",
                data: d,
                timeout: 10000,
                success: function (result) {
                    //console.log(result);
                    if (result.length > 0) { // Fill list
                        $('#list').empty()
    
                        if ($('#r5')[0].checked) {
                            var entries = result.split('\n');
                            entries.forEach(e => {
                                if (e.length > 1) { // Double \n entries                                    
                                    var at = e.indexOf('@');
                                    var key = e.substr(2, at - 2);
                                    var d = new Date(e.substr(at + 1) * 1000);
                                    var date = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes()
                                    $('#list').append(`<li class="list-group-item d-flex justify-content-between align-items-center">
                                                    ${key}
                                                    <span class="badge badge-primary badge-pill">${date}</span>
                                                    </li>`);
                                }
                            });
                        } else if ($('#r6')[0].checked) {
                            //console.log(result)
                            posts = CSVToArray(result, '\t');
    
                            for (let i = posts.length - 30; i < posts.length - 1; i++) {
                                let d = new Date(posts[i][0] * 1000);
                                var date = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes()
    
                                $('#list').append(`<li class="list-group-item d-flex justify-content-between align-items-center">
                                                    ${posts[i][1] + ' ' + posts[i][2]}
                                                    <span class="badge badge-primary badge-pill">${date}</span>
                                                    </li>`);
                            }
                        }
                        $('#list').show();
    
                    } else {
                        $('#completed').modal();
                    }
                    $('#loader').hide();
                },
                error: function (result) {
                    $('#loader').hide();
    
                    switch (result.status) {
                        case 423:
                            $('#locked').modal();
                            break;
                        case 403:
                            $('#forbidden').modal();
                            break;
                        case 429:
                            $('#tooMany').modal();
                            break;
                        default:
                            $('#default').modal();
                            break;
                    }
                }
            });
            //alert("Sent");                
            $('#loader').show();
        });
        */
})


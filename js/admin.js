res = [];
$(function () {
    // Without these two lines any options has the property checked to true
    $('#r3')[0].checked = true;
    $('#v1')[0].checked = true;
    res = "add";
    // Modifing the visibility of the UI
    // elements depending on the desired action
    $('#r1').on('change', function () {
        $('.adminpassword').show();
        $('.userpassword').hide();
        $('#timeval').hide();
        $('#list').hide();
        res = "lock";
    });
    $('#r2').on('change', function () {
        $('.adminpassword').show();
        $('.userpassword').hide();
        $('#timeval').hide();
        $('#list').hide();
        res = "revokeAll";
    });
    $('#r3').on('change', function () {
        $('.adminpassword').show();
        $('.userpassword').show();
        $('#timeval').show();
        $('#list').hide();
        res = "add";
    });
    $('#r4').on('change', function () {
        $('.adminpassword').hide();
        $('.userpassword').show();
        $('#timeval').hide();
        $('#list').hide();
        res = "check";
    });
    $('#r5').on('change', function () {
        $('.adminpassword').show();
        $('.userpassword').hide();
        $('#timeval').hide();
        $('#list').show();
        res = "active";
    });
    $('#r6').on('change', function () {
        $('.adminpassword').show();
        $('.userpassword').hide();
        $('#timeval').hide();
        $('#list').show();
        res = "posts";
    });

    $('.passwd').keydown(function (event) {
        var keyCode = (event.keyCode ? event.keyCode : event.which);
        if (keyCode == 13) {
            $('#submit').trigger('click');
        }
    });

    $('#access').submit(function (e) {
        e.preventDefault();
    });

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

    // Getting RTC from system
    $.ajax({
        url: "epoch",
        method: "GET",
        dataType: "text",
        timeout: 10000,
        success: function (result) {
            date = new Date(result * 1000);
            $('#rtc').text("Ora del sistema: " + date.toLocaleTimeString() + " " + date.toDateString());
        }
    });
})

function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [
        []
    ];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}
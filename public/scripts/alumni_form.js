function POST_alumni_form(params, callback) {
    let xhr = new XMLHttpRequest();

    xhr.open('POST', '/alumni/form', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);

    xhr.onload = function() {
        if (xhr.status == 500) {  
            // Error Block
            if (callback) {  callback(500, xhr.responseText) }
        } else if (xhr.status == 200) {
            // Success Block
           if (callback) { callback(200)}
        }
    }

    xhr.onerror = function() {
        console.log('XMLHTTPRequest error');
    }
}

function submitForm(e){

    e.preventDefault()

    let firstName = document.querySelector('#firstName').value;
    let lastName = document.querySelector('#lastName').value;
    let gradYear = document.querySelector('#gradYear').value;
    let degreeType = document.querySelector('#degreeType').value;
    let occupation = document.querySelector('#occupation').value;
    let email = document.querySelector('#email').value;
    let emailConfirm = document.querySelector('#emailConfirm').value;
    let emailList = document.querySelector('#emailList').checked;
    let description = document.querySelector('#description').value;

    let params = "firstName="+firstName+"&lastName="+lastName+"&gradYear="+gradYear+"&degreeType="+degreeType+"&occupation="+occupation+"&email="+email+"&emailConfirm="+emailConfirm+"&emailList="+emailList+"&description="+description;

    POST_alumni_form(params, (status, errors) => {
        if (status == 200) {

        } else if (status == 500) {
            console.log(errors)
            renderFormErrors(errors);
        }
    })
}

function renderFormErrors(errors) {
    errors = JSON.parse(errors);
    let errorList = document.querySelector('#errorList');
    errorList.innerHTML = '';
    for (i in errors) {
        let errorMsg = document.createTextNode('*' + errors[i].msg)
        let br = document.createElement('br')
        errorList.appendChild(errorMsg);
        errorList.appendChild(br);
    }

}

document.querySelector('#alumni_form').addEventListener('submit', (e) => {submitForm(e)});
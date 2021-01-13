// Global variable for current table filters
let alumniParams = 'status=approved';
let sortedHeader = '';

// Enable bootstrap tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

// Change behavor of button display when on a touch device
function displayButtonsOnTouch() {
    document.querySelectorAll('tbody tr').forEach( tr => {
        tr.addEventListener('touchend', () => {
            if (!tr.classList.contains('active')) {
                try {
                    document.querySelector('tr.active').classList.remove('active');
                } catch (error) {
                    console.error(error);
                } finally {
                    tr.classList.add('active');
                }
            }
            document.querySelectorAll('tr:not(.active) > td > button').forEach( button => {
                button.setAttribute('style', '')
            });
            tr.querySelectorAll('button').forEach( button => {
                setTimeout(() => {
                    button.setAttribute('style', 'display: inline-block !important');
                }, 0);
                
            })
        })
    })
}

// from event listener for dynamically setting form POST request url 
document.querySelector('.alumni_form').addEventListener('submit', (event) => {
    event.preventDefault();

    // Get data from DOM
    let firstName = document.querySelector('#firstName').value;
    let lastName = document.querySelector('#lastName').value;
    let gradYear = document.querySelector('#gradYear').value;
    let degreeType = document.querySelector('#degreeType').value;
    let occupation = document.querySelector('#occupation').value;
    let email = document.querySelector('#email').value;
    let emailList = document.querySelector('#emailList').checked;
    let description = document.querySelector('#description').value;

    let params = "firstName="+firstName+"&lastName="+lastName+"&gradYear="+gradYear+"&degreeType="+degreeType+"&occupation="+occupation+"&email="+email+"&emailList="+emailList+"&description="+description;

    if (document.querySelector('#submit').getAttribute('crud_type') == 'add') {
        POST_create_alumni(params, (status, err) => {
            if (status == 200) {
                renderTable();
                $('#form_modal').modal('hide');
            } else if (status == 500) { 
                renderFormErrors(err); 
            }
        })
    } else if (document.querySelector('#submit').getAttribute('crud_type') == 'update') {
        let id = document.querySelector('form').id;
        POST_update_alumni(id, params, (status, err) => {
            if (status == 200) {
                renderTable();
                $('#form_modal').modal('hide');
            } else if (status == 500) { 
                renderFormErrors(err); 
            }
        })
    }


});


function addDeleteEventListeners() {
    document.querySelectorAll('.delete_btn').forEach((btn) => { 
        btn.addEventListener('click', () => {
            DELETE_alumni(btn.getAttribute('alumni_id'), (status) => {
                if (status == 200) {
                    renderTable();
                    resetForm();
                    $('#form_modal').modal('hide');
                }
            });
        });
    })
}

addDeleteEventListeners();

document.querySelector('#close').addEventListener('click', resetForm());
document.querySelector('#btn-x').addEventListener('click', resetForm());

// Listens for active table header to be sorted
document.querySelectorAll('th').forEach( (th) => {
    th.addEventListener('click', (e) => {
        let element = e.target;

        if (element.classList.contains('positive-sort')) {
            element.classList.remove('positive-sort');
            element.classList.add('negative-sort');
        } else if (element.classList.contains('negative-sort')) {
            element.classList.remove('negative-sort');
            element.classList.add('positive-sort');
        } else {
            try {
                document.querySelector('.positive-sort, .negative-sort').classList.remove('positive-sort', 'negative-sort')
            } catch (error) {
                console.error(error);
            } finally {
                element.classList.add('positive-sort');
            }
        }        
        sortedHeader !== element.dataset.header ? sortedHeader = element.dataset.header : sortedHeader = '!' + element.dataset.header;
        console.log(element.classList.contains('text-truncate'))

        renderTable();
    });
});

document.querySelector('#searchBar').addEventListener('input', alumniSearch);

function alumniSearch(e) {
    let query = e.target.value;
    if (isNaN(query)) {
        alumniParams = 'firstName=' + query + '&lastName=' + query  + '&degreeType=' + query + '&occupation=' + query + '&email=' + query + '&status=approved';
    } else {
        query !== '' ? alumniParams = '&gradYear=' + query + '&status=approved' : alumniParams =  '&status=approved';
    }
    renderTable(); 
} 

// PAGE RENDERING FUNCTIONS


// Modal handler
$('#form_modal').on('show.bs.modal', function (event) {
    let errorList = document.querySelector('#errorList');
    errorList.innerHTML = '';
    let button = $(event.relatedTarget); 
    let crud_type = button.data('type'); 
    let modal = $(this);
    modal.find('.modal-title').text(crud_type + ' Alumni Entry');

    if (crud_type == 'Update') {
        GET_alumni_by_id(button[0].getAttribute('alumni_id'), (alumni) => {
            document.querySelector('#firstName').value = alumni.firstName;
            document.querySelector('#lastName').value = alumni.lastName;
            document.querySelector('#email').value = alumni.email;
            document.querySelector('#gradYear').value = alumni.gradYear;
            document.querySelector('#degreeType').value = alumni.degreeType;
            document.querySelector('#occupation').value = alumni.occupation;
            document.querySelector('#description').value = alumni.description === undefined ? '' : alumni.description;
            document.querySelector('#emailList').checked = alumni.emailList;
            document.querySelector('form').id = button[0].getAttribute('alumni_id');
        });
    } else if (crud_type == 'View') {
        GET_alumni_by_id(button[0].getAttribute('alumni_id'), (alumni) => {
            document.querySelector('#firstName').value = alumni.firstName;
            document.querySelector('#firstName').setAttribute('readonly', true);
            document.querySelector('#lastName').value = alumni.lastName;
            document.querySelector('#lastName').setAttribute('readonly', true);
            document.querySelector('#email').value = alumni.email;
            document.querySelector('#email').setAttribute('readonly', true);
            document.querySelector('#gradYear').value = alumni.gradYear;
            document.querySelector('#gradYear').setAttribute('readonly', true);
            document.querySelector('#degreeType').value = alumni.degreeType;
            document.querySelector('#degreeType').setAttribute('readonly', true);
            document.querySelector('#occupation').value = alumni.occupation;
            document.querySelector('#occupation').setAttribute('readonly', true);
            document.querySelector('#description').value = alumni.description === undefined ? '' : alumni.description;
            document.querySelector('#description').setAttribute('readonly', true);
            document.querySelector('#emailList').checked = alumni.emailList;
            document.querySelector('#emailList').setAttribute('disabled', true);
            document.querySelector('form').id = button[0].getAttribute('alumni_id');
            document.querySelector('#submit').setAttribute('style', 'display: none;');
        });
    } else {
        document.querySelector('form').id = '';
    }

    document.querySelector('#submit').setAttribute('crud_type', crud_type.toLowerCase());
   
});

$('#form_modal').on('hide.bs.modal', function (event) {
    resetForm();
}); 

// Renders modal with errors
function renderFormErrors(errors) {
    errors = JSON.parse(errors);
    let modal = $('#form_modal')
    let errorList = document.querySelector('#errorList');
    errorList.innerHTML = '';
    for (i in errors) {
        let errorMsg = document.createTextNode('*' + errors[i].msg)
        let br = document.createElement('br')
        errorList.appendChild(errorMsg);
        errorList.appendChild(br);
    }

}

// Remove user inputed values in form
function resetForm() {
    document.querySelector('#firstName').value = '';
    document.querySelector('#lastName').value = '';
    document.querySelector('#gradYear').value = '';
    document.querySelector('#degreeType').value = '';
    document.querySelector('#occupation').value = '';
    document.querySelector('#email').value = '';
    document.querySelector('#emailList').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#firstName').removeAttribute('readonly');
    document.querySelector('#lastName').removeAttribute('readonly');
    document.querySelector('#gradYear').removeAttribute('readonly');
    document.querySelector('#degreeType').removeAttribute('readonly');
    document.querySelector('#occupation').removeAttribute('readonly');
    document.querySelector('#email').removeAttribute('readonly');
    document.querySelector('#emailList').removeAttribute('disabled');
    document.querySelector('#description').removeAttribute('readonly');
    document.querySelector('#submit').setAttribute('style', 'display: inline-block');
}


// Renders table with updated database
function renderTable() {

    GET_alumni_entries(alumniParams ? alumniParams : '', (alumnis) => {
        if (sortedHeader === '') {sortedHeader = 'lastName';}
        if (sortedHeader[0] !== '!') {
            // ascending sort
            alumnis.sort(function(a, b) {let valA = eval(`a.${sortedHeader}`); let valB = eval(`b.${sortedHeader}`); return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;});
        } else {
            // decending sort
            alumnis.sort(function(a, b) {let valA = eval(`a.${sortedHeader.substr(1)}`); let valB = eval(`b.${sortedHeader.substr(1)}`); return (valA > valB) ? -1 : (valA < valB) ? 1 : 0;});
        }


        let tbody = document.querySelector('tbody');
        let clone = tbody.cloneNode(false);
        tbody.parentNode.replaceChild(clone, tbody);
        tbody = clone;
        for (i in alumnis) {
            let tr = document.createElement('tr'); 
            tr.innerHTML = `
            <td class='text-nowrap' alumni_id='${alumnis[i]._id}'>${alumnis[i].firstName}</td>
            <td class='text-nowarp' alumni_id='${alumnis[i]._id}'>${alumnis[i].lastName}</td>
            <td class='text-nowrap' alumni_id='${alumnis[i]._id}'>${alumnis[i].gradYear}</td>
            <td class='text-nowrap' alumni_id='${alumnis[i]._id}'>${alumnis[i].degreeType}</td>
            <td class='text-nowrap' alumni_id='${alumnis[i]._id}'>${alumnis[i].occupation}</td>
            <td class='text-nowrap' alumni_id='${alumnis[i]._id}'>${alumnis[i].email}</td>
            <td alumni_id='${alumnis[i]._id}'>${alumnis[i].emailList}</td>
            <td class='col-fixed-right text-nowrap p-0'>
                <button class='btn btn-secondary btn-sm mr-4 mr-sm-0 mt-2 ml-2' data-toggle='modal' data-target='#form_modal' data-type='Update' alumni_id='${alumnis[i]._id}'>
                    <i class="fas fa-pencil-alt d-sm-none"></i>
                    <span class='d-none d-sm-inline'>Update</span>
                </button>
                <button class='btn btn-danger btn-sm delete_btn mt-2' alumni_id='${alumnis[i]._id}'>
                    <i class="fas fa-trash d-sm-none"></i>
                    <span class='d-none d-sm-inline'>Delete</span>
                </button>
            </td>`;
            tbody.appendChild(tr);
        }

        addDeleteEventListeners();
        displayButtonsOnTouch();
    })
}

function renderPendingCount() {
    GET_alumni_entries("status=pending", (alumnis) => {
        document.querySelector('#pendingCount').innerHTML = Object.keys(alumnis).length;
    })
}


renderTable();

renderPendingCount();
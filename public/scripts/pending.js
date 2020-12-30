// Global Variables
let alumniParams = 'status=pending';
let sortedHeader = '';

// EVENT LISTENERS

// Table Header Listener for sorting the table
const table = document.querySelector('table');

//  tbody event listener for displaying accept and reject buttons
document.querySelector('tbody').addEventListener('mouseover', buttonVisibility);

// table event listener for hiding all accept and reject buttons when mouse leaves table
document.querySelector('table').addEventListener('mouseleave', (event) => {
    document.querySelectorAll('tbody button').forEach((button) => {
        button.style.visibility = 'hidden';
    });
});

document.querySelectorAll('th').forEach( (th) => {
    th.addEventListener('click', (e) => {
        let element = e.target;
        sortedHeader !== element.dataset.header ? sortedHeader = element.dataset.header : sortedHeader = '!' + element.dataset.header;
        renderTable();
    });
});

document.querySelector('#searchBar').addEventListener('input', alumniSearch);

function alumniSearch(e) {
    let query = e.target.value;
    if (isNaN(query)) {
        alumniParams = 'firstName=' + query + '&lastName=' + query  + '&degreeType=' + query + '&occupation=' + query + '&email=' + query + '&status=pending';
    } else {
        query !== '' ? alumniParams = '&gradYear=' + query + '&status=pending' : alumniParams =  '&status=pending';
    }
    renderTable(); 
} 


function buttonVisibility(event) {
    document.querySelectorAll('tbody button').forEach((button) => {
        button.style.visibility = 'hidden';
    });

    let tr = event.target;
    // Search block
    while (tr !== this && !tr.matches('tr')) {
        tr = tr.parentNode;
    }
    // Error block
    if (tr === this) {
        console.log("No table cell found");
    // Found block
    } else {
        tr.querySelectorAll('button').forEach((button) => {
            button.style.visibility = 'visible';
        });
    }
}

function addButtonEventListeners() {
    document.querySelectorAll('.accept_btn').forEach((btn) => { 
        let id = btn.getAttribute('alumni_id');
        btn.addEventListener('click', () => {
            POST_approve_alumni(id, (status) => {
                if (status == 200) {
                    renderTable();
                    resetForm();
                    $('#form_modal').modal('hide');
                }
            });
        });
    })
    document.querySelectorAll('.reject_btn').forEach((btn) => { 
        btn.addEventListener('click', () => {
            DELETE_alumni(btn.getAttribute('alumni_id'), (status) => {
                if (status == 200) {
                    renderTable();
                    resetForm();
                    $('#form_modal').modal('hide');
                }
            })
        });
    })
}

addButtonEventListeners();

// PAGE RENDERING FUNCTIONS

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
        tbody.addEventListener('mouseover', buttonVisibility);
        for (i in alumnis) {
            let tr = document.createElement('tr');
            tr.innerHTML = `
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].firstName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].lastName}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].gradYear}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].degreeType}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].occupation}</td>
            <td class='text-truncate' data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].email}</td>
            <td data-toggle='modal' data-target='#form_modal' data-type='View' alumni_id='${alumnis[i]._id}'>${alumnis[i].emailList}</td>
            <td class='px-0'><button class='btn btn-success btn-sm mr-3 accept_btn' alumni_id='${alumnis[i]._id}'>Accept</button></td>
            <td class='px-0'><button class='btn btn-danger btn-sm reject_btn' alumni_id='${alumnis[i]._id}'>Reject</button></td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
    })
}

renderTable();
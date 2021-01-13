// Global Variables
let alumniParams = 'status=pending';
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
                    console.log(error);
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
                    renderPendingCount();
                }
            });
        });
    })
    document.querySelectorAll('.reject_btn').forEach((btn) => { 
        btn.addEventListener('click', () => {
            DELETE_alumni(btn.getAttribute('alumni_id'), (status) => {
                if (status == 200) {
                    renderTable();
                    renderPendingCount();
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
            <td class='col-fixed-right text-nowrap p-0'>
                <button class='btn btn-success btn-sm mr-4 mr-sm-0 mt-2 ml-2 accept_btn' alumni_id='${alumnis[i]._id}'>
                    <i class="fas fa-check d-sm-none"></i>
                    <span class='d-none d-sm-inline'>Accept</span>
                </button>
                <button class='btn btn-danger btn-sm delete_btn mt-2 reject_btn' alumni_id='${alumnis[i]._id}'>
                    <i class="fas fa-times fa-lg d-sm-none"></i>
                    <span class='d-none d-sm-inline'>Reject</span>
                </button>
            </td>`;
            tbody.appendChild(tr);
        }

        addButtonEventListeners();
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
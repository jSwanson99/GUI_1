/*
    File: index.js 
    GUI Assignment:  HW4A - Multiplication table
    Jonathan Swanson, UMass Lowell Computer Science, jonathan_swanson@student.uml.edu 
    Copyright (c) 2021 by Jonathan.  All rights reserved.  May be freely copied or 
    excerpted for educational purposes with credit to the author. 
    updated by JS on November 20, 2021 at 12:00 PM 
*/

// JQuery Input Validator
let validator;

// Element constants
const table = document.getElementById("table");
const tableContainer = document.getElementById("table-container");
const errorBox = document.getElementById("error_msg");
const inputElements = Array.from(document.querySelectorAll("form input"));

// When page loads
$(document).ready(() => {
    // Override submit function
    $("#input_form").submit((event) => {
        event.preventDefault();
        return false;
    });

    // Clear inputs
    inputElements.forEach((el, i) => {
        el.value = i**2;
    }); 

    // Allow for validation
    validator = $("#input_form").validate({
        rules: {
            minRowNum: { 
                minr_gt_maxr: true,
                range: [-50, 50]
             }, 
            maxRowNum: { 
                minr_gt_maxr: true,
                range: [-50, 50] 
            }, 
            minColNum: { 
                minc_gt_maxc: true,
                range: [-50, 50] 
            }, 
            maxColNum: { 
                minc_gt_maxc: true,
                range: [-50, 50]
            }
        },
        submitHandler: () => generateTable(inputElements.map(el => el.value))
    });

    // Enforce whole form validation per input change (for min/max)
    inputElements.forEach(el => {
        $(el).change(() => validator.form());
    });

    // Adds min/max checking to validator
    addCustomRules();
});

// Enforced min/max checking on input pairs when one input changes
// --> When min row changes, max row is also checked
function addCustomRules() {
    $.validator.addMethod("minr_gt_maxr", (value, el) => {
        minr = parseInt($("#minRowNum").val());
        maxr = parseInt($("#maxRowNum").val());
        return minr < maxr;
    }, "Min row must be less than max row");
    $.validator.addMethod("minc_gt_maxc", (value, el) => {
        minc = parseInt($("#minColNum").val());
        maxc = parseInt($("#maxColNum").val());
        return minc < maxc;
    }, "Min col must be less than max col");
}

// Generates table based on previously validated inputs
function generateTable() {
    const inputs = inputElements.map(el => el.value);    
    const [minRow, maxRow, minCol, maxCol] = inputs;

    clearElement(table);
    tableContainer.style.visibility = 'visible';

    // Generate table using + 1 length to row and columns for the headers
    for (let i = minRow - 1; i <= maxRow; i++) {
        const row = table.insertRow();

        for (let j = minCol - 1; j <= maxCol; j++) {
            let cell = row.insertCell();
            // Row header
            if(i < minRow && j >= minCol) {
                const columnHeader = document.createElement('th');
                columnHeader.appendChild(document.createTextNode(j))
                cell.appendChild(columnHeader);
            // Column header
            } else if(j < minCol && i >= minRow) {
                const rowHeader = document.createElement('th');
                rowHeader.appendChild(document.createTextNode(i))
                cell.appendChild(rowHeader);
            // Actual datapoint / not a header
            } else if (i >= minRow && j >= minCol) {
                cell.appendChild(document.createTextNode(i * j));
            }
        }
    }
}

// Simple way of clearing contents of element
function clearElement(el) {
    el.innerHTML = "";
}
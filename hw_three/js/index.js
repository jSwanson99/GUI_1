/*
    File: index.js 
    GUI Assignment:  HW3 - Multiplication table
    Jonathan Swanson, UMass Lowell Computer Science, jonathan_swanson@student.uml.edu 
    Copyright (c) 2021 by Jonathan.  All rights reserved.  May be freely copied or 
    excerpted for educational purposes with credit to the author. 
    updated by JS on September 26, 2021 at 12:00 PM 
*/

// Element constants
const table = document.getElementById("table");
const tableContainer = document.getElementById("table-container");
const errorBox = document.getElementById("error_msg");

// Fetches inputs and updates table
function updateTable() {
    // Get unvalidated input as strings
    const inputs = {
        minRow: document.getElementById('minRowNum').value,
        maxRow: document.getElementById('maxRowNum').value,
        minCol: document.getElementById('minColNum').value,
        maxCol: document.getElementById('maxColNum').value
    }

    // Try to validate inputs & generate table
    try {
        validateInput(inputs);
        generateTable(inputs);
    } catch(e) {
        error(e)
    }
}

// Takes inputs and throws 
function validateInput(inputs) {
    // Clear errorBox in case there were old errors shown
    clearElement(errorBox)

    // Generic input validation
    let errors = [];

    Object.keys(inputs).forEach(key => {
        if(inputs[key] > 50) 
            errors.push(`${key} must not be greater than 50.`);
        if(inputs[key] < -50) 
            errors.push(`${key} must not be less than -50.`);
        if(inputs[key] != parseInt(inputs[key]))
            errors.push(`All keys (error regarding: ${key}) must be integers.`);
        // Cast input to integer, once passed basic validation
        inputs[key] = parseInt(inputs[key])
    });

    // Min/max row/col validation
    if(inputs['minRow'] > inputs['maxRow']) 
        errors.push(`minRow must be greater than maxRow.`);
    if(inputs['minCol'] > inputs['maxCol']) 
        errors.push(`minCol must be greater than maxCol.`);

    if(errors.length)
        throw errors;
}

// Generates table based on previously validated inputs
function generateTable(inputs) {
    clearElement(table);

    tableContainer.style.visibility = 'visible';
    const {minRow, maxRow, minCol, maxCol} = inputs;

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

// Throws an error message to the screen
function error(errors) {
    // Clear contents of error box and table
    clearElement(table);
    clearElement(errorBox);

    // Hide div to hide the scrollbars
    tableContainer.style.visibility = 'hidden';

    error_header = document.createElement("p");
    error_header.innerHTML = "Error(s): ";
    errorBox.appendChild(error_header);

    // Inject error message
    errors.forEach(er => {
        const error_p = document.createElement("p")
        error_p.innerHTML = er;
        errorBox.append(error_p);
    })
}

// Simple way of clearing contents of element
function clearElement(el) {
    el.innerHTML = "";
}
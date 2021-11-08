/*
    File: index.js 
    GUI Assignment:  HW3 - Multiplication table
    Jonathan Swanson, UMass Lowell Computer Science, jonathan_swanson@student.uml.edu 
    Copyright (c) 2021 by Jonathan.  All rights reserved.  May be freely copied or 
    excerpted for educational purposes with credit to the author. 
    updated by JS on November 6, 2021 at 2:00 PM 
*/

// Element constants
const table = document.getElementById("table");
const tableContainer = document.getElementById("table-container");
const errorBox = document.getElementById("error_msg");
const inputElements = Array.from(document.querySelectorAll("form input"));
const sliderElements = Array.from(document.querySelectorAll(".slider"))

// JQuery Slider Additional Options
const sliderOptions = {
    min: -50,
    max: 50,
    step: 1,
    value: 0,
    stop: function (e, ui) {
        i = $(this).data("num");
        $(inputElements[i]).val($(this).slider("value"));
        console.log('stop triggered')
        validateTruthyInputs();
        console.log('inputs validated')
    }
};

// JQuery Input Validator
let validator;

// When page loads
$(document).ready(() => {
    inputElements.forEach(el =>  el.value = "" ); // Clear inputs

    // Create sliders, bind data to sliders for easier indexing
    sliderElements.forEach((el, i) => $(el).data("num", i) );
    $(".slider").slider(sliderOptions); 

    // Bind text inputs to sliders
    inputElements.forEach((el, i) => {
        $(el).change(function () {
            $(sliderElements[i]).slider("value", $(el).val());
        })
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

    // Add min/max checking
    addCustomRules();
    
    // Override submit function to prevent page reload
    $("#input_form").submit((event) => {
        event.preventDefault();
        return false;
    })
});

// Enforced min/max checking on input pairs when one input changes
// --> When min row changes, max row is also checked
function addCustomRules () {
    // Add custom methods for min/max checking
    $.validator.addMethod("minr_gt_maxr", (value, el) => {
        minr = parseInt($("#minRowNum").val());
        maxr = parseInt($("#maxRowNum").val());
        // Ensures fields have been populated
        if(minr && maxr) 
            return minr < maxr;
        return true;
    }, "Min row must be less than max row");
    $.validator.addMethod("minc_gt_maxc", (value, el) => {
        minc = parseInt($("#minColNum").val());
        maxc = parseInt($("#maxColNum").val());
        // Ensures fields have been populated
        if(minc && maxc)
            return minc < maxc;
        return true;
    }, "Min col must be less than max col");

    $("#minRowNum").change(() => {
        if(parseInt($("#maxRowNum").val())) {
            $("#maxRowNum").valid()
            $("#minRowNum").valid()
        }
    });
    $("#maxRowNum").change(() => {
        if(parseInt($("#minRowNum").val())) {
            $("#maxRowNum").valid()
            $("#minRowNum").valid()
        }
    });
    
    $("#minColNum").change(() => {
        if(parseInt($("#maxColNum").val())) {
            $("#maxColNum").valid()
            $("#minColNum").valid()
        }
    });
    $("#maxColNum").change(() => {
        if(parseInt($("#minColNum").val())) {
            $("#maxColNum").valid()
            $("#minColNum").valid()
        }
    });
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

function validateTruthyInputs() {
    inputElements.forEach(el => {
        if(parseInt(el.value) == el.value) {
            $(el).valid();
        }
    })
}

// Simple way of clearing contents of element
function clearElement(el) {
    el.innerHTML = "";
}
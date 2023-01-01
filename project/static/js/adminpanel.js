
$("#sidebarToggleMenu").click(
    ()=>{
        if($("#accordionSidebar").hasClass("d-none")){
            $("#accordionSidebar").removeClass("d-none");
        }else{
            $("#accordionSidebar").addClass("d-none");
        }
    }
)

function makeAlert(type, message){
    if(type=="success"){
        $("#alert_success").removeClass("d-none");
        $("#alert_success").text(message);
        setTimeout(() => {
            $("#alert_success").addClass("d-none");
            $("#alert_success").text("");
        }, 3000);
    }
    if(type=="fail"){
        $("#alert_danger").removeClass("d-none");
        $("#alert_danger").text(message);
        setTimeout(() => {
            $("#alert_danger").addClass("d-none");
            $("#alert_danger").text("");
        }, 3000);
    }
}





const dashboard = document.querySelector(".link-1");
const unpaid_agree = document.querySelector(".link-2");
const detail_page = document.querySelector(".detail-page");

const nav_items = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
// const page_title = document.querySelector(".page-name");
var current_page = 0;
var prev_page = 0;

dashboard.addEventListener("click", loadDashboard);
unpaid_agree.addEventListener("click", loadUnpaid_Agree);


const close_detail_page = document.getElementById("close-detail-page");

close_detail_page.addEventListener("click", CloseDetailPage)

// function CloseDetailPage(){
//     $(".detail-page").addClass("d-none");
// }

// function load_detail_page(){
//     $(".detail-page").removeClass("d-none");
// }


function CloseDetailPage(){
    pages[4].classList.add("d-none");
    pages[prev_page].classList.remove("d-none");
    nav_items[prev_page].classList.add("active");
    current_page = prev_page;
}

function load_detail_page(){
    if(pages[2].classList.contains("d-none")){
        pages[2].classList.remove("d-none");
    }
    if(current_page != 2){
        pages[current_page].classList.add("d-none");
    }
    nav_items[current_page].classList.remove("active");
    prev_page = current_page;
    current_page = 2;
}


function loadDashboard(){
    if(pages[0].classList.contains("d-none")){
        pages[0].classList.remove("d-none");
    }
    if(current_page != 0){
        pages[current_page].classList.add("d-none");
    }
    nav_items[current_page].classList.remove("active");
    prev_page = current_page;
    current_page = 0;
    nav_items[current_page].classList.add("active");
}

function loadUnpaid_Agree(){
    if(pages[1].classList.contains("d-none")){
        pages[1].classList.remove("d-none");
    }
    if(current_page != 1){
        pages[current_page].classList.add("d-none");
    }
    nav_items[current_page].classList.remove("active");
    prev_page = current_page;
    current_page = 1;
    nav_items[current_page].classList.add("active");
    // get_unpaid_agreements();
}



// DashBoard Section

// var CURRENT_AGREEMENT_NUMBER = 0;

// $(document).ready(()=>{
//     CURRENT_AGREEMENT_NUMBER = $("#agreement-table tr").length;
// })

var myinterval;

function get_agreements(){

    CURRENT_AGREEMENT_NUMBER = $("#agreement-table tr").length;
    let TOTAL_AGREEMENT_NUMBER = 0;

    $.get("/data_count/", function(data, status, xhr){
        if(status == "success"){
            TOTAL_AGREEMENT_NUMBER = parseInt(data);

            let MISSING_AGREEMENTS = TOTAL_AGREEMENT_NUMBER - CURRENT_AGREEMENT_NUMBER;

            if(MISSING_AGREEMENTS > 0){

                clearInterval(myinterval);
                let url = "/data_by_number/" + MISSING_AGREEMENTS + "/"
                $.get(url, (data, status)=>{
                    if(status == "success"){
                        // console.log(data);
                        data.forEach(element => {
                            let child = `<tr><td>${element.pk}</td>
                                <td>${element.fields.first_name} ${element.fields.last_name}</td>
                                <td>${element.fields.agreement_start_date}</td>
                                <td>${element.fields.status}</td>
                                <td>${element.fields.total_amount}</td>
                                <td>${element.fields.payment_status}</td>
                                <td class="page-detail text-primary" style="cursor:pointer;" onclick="detail_page_info(${element.pk})">Details</td>
                                <td class="page-detail text-danger" style="cursor:pointer;" onclick="delete_agreement(this, ${element.pk})">Delete</td></tr>`
                                
                            $("#agreement-table").prepend(child);
                        });
                    }
                })
                CURRENT_AGREEMENT_NUMBER += MISSING_AGREEMENTS;
                myinterval = setInterval(get_agreements, 6000)
            }
        }
    })
}

myinterval = setInterval(get_agreements, 6000);



function delete_agreement(element, agreement_id){
    let get_url = "/delete_data/"+agreement_id+"/";
    element.parentNode.style.display = "none";
    // $("#spinner").css("display", "flex");
    $.get(get_url, (data, status)=>{
        if(status=="success"){
            makeAlert("success", data)
            element.parentNode.style.display = "none";
        }
        else{
            makeAlert("fail", "Something went wrong.")
        }
    })
}



// Unpaid Agreements Section
function get_unpaid_agreements(){
    $("#unpaidAgreement-table").empty();
    const table_rows = $("#unpaidAgreement-table tr td:first-child");
    let row_ids = []
    for(let i=0; i<table_rows.length; i++){
        row_ids.push(table_rows[i].innerText);
    }
    let url = "/unpaid_agreements/"
    $.get(url, function(data, status, xhr){
        if(status == "success"){
            data.forEach(element => {
                if(! row_ids.includes(element.pk)){
                    
                    let child = `<tr><td>${element.pk}</td>
                        <td>${element.fields.first_name} ${element.fields.last_name}</td>
                        <td>${element.fields.agreement_start_date}</td>
                        <td>${element.fields.status}</td>
                        <td>${element.fields.total_amount}</td>
                        <td><p class="page-detail text-primary" style="cursor:pointer;" onclick=detail_page_info(${element.pk})>Details</p></td>`
                        
                    $("#unpaidAgreement-table").prepend(child);
                }
            });
        }else{
            // alert("Error: " + xhr.status + ": " + xhr.statusText + "<br>" + "Refresh the page");
            let message = "Error: " + xhr.status + ": " + xhr.statusText + "-" + "Please, Refresh the page"
            makeAlert("fail", message);
        }
    })
}
// get_unpaid_agreements();




function delete_page(element, page_id){
    $("#spinner").removeClass("d-none");
    $("#spinner").addClass("d-flex");
    let url = "/delete_page/"+page_id;
    $.get(url, function(data, status){
        if (status == "success"){
            // alert(data);
            $("#spinner").addClass("d-none");
            $("#spinner").removeClass("d-flex");
            makeAlert("success", data);
            element.parentNode.style.display = "none";
            // get_dynamic_pages();
        }else{
            // alert("Something Went Wrong!!!!");
            makeAlert("fail", "Something Went Wrong.")
        }
    });
}




// Detail Page Section

function detail_page_info(agreement_id){
    $("#spinner").removeClass("d-none");
    $("#spinner").addClass("d-flex");


    $("#detailagreement_table").empty();
    // $("#detailproperty_table").empty();
    // $("#detaillandlord_table").empty();
    // $("#detailtenant_table").empty();

    $("#detailUsername").html("");
    $("#detailUseremail").html("");
    $("#detailphone").html("");
    $("#detailDate").html("");
    $("#detailPayment").html("");
    $("#detailProduct_Name").html("");
    $("#detailAddress").html("");


    const url = "/fetch_data/"+agreement_id+"/"
    $.get(url, (data, status)=>{
        if(status=="success"){

            $("#hidden_id").val(data[0].pk);


            data = data[0].fields
            let agreement_data = new Map();
            let property_data = new Map();
            let tenant_data = new Map();
            let landlord_data = new Map();

            for(let key in data){
                if(key.includes("property")){
                    let value = data[key];
                    key = key.replace("property_", "").replaceAll("_", " ");
                    property_data.set(key, value);
                }
                else if(key.includes("tenant")){
                    let value = data[key];
                    key = key.replace("tenant_", "").replaceAll("_", " ")
                    tenant_data.set(key, value);
                }
                else if(key.includes("landlord")){
                    let value = data[key];
                    key = key.replace("landlord_", "").replaceAll("_", " ")
                    landlord_data.set(key, value);
                }
                else{
                    let value = data[key];
                    key = key.replaceAll("_", " ")
                    agreement_data.set(key, value);
                }
            }

            

            const username = data.fname + " " + data.last_name;

            $("#detailUsername").html(username);
            $("#detailUsertype").html(data.user_type);
            $("#detailType").html(data.package_type);
            $("#detailDate").html(data.agreement_start_date);
            $("#detailPayment").html(data.payment_status);
            $("#detailDuration").html(data.agreement_duration);
            $("#contactNumber").html(data.contact_number);

            
            const optionValue = data.status;
            $("#detailStatus").empty();
            if(optionValue == "Submitted"){
                const x = `<option selected value="Submitted">Submitted</option>
                <option value="Processing">Processing</option>
                <option value="Registered">Registered</option>
                <option value="Expired">Expired</option>`
                $("#detailStatus").append(x);
            }else if(optionValue == "Processing"){
                const x = `<option value="Submitted">Submitted</option>
                <option selected value="Processing">Processing</option>
                <option value="Registered">Registered</option>
                <option value="Expired">Expired</option>`
                $("#detailStatus").append(x);
            }else if(optionValue == "Registered"){
                const x = `<option value="Submitted">Submitted</option>
                <option value="Processing">Processing</option>
                <option selected value="Registered">Registered</option>
                <option value="Expired">Expired</option>`
                $("#detailStatus").append(x);
            }else{
                const x = `<option value="Submitted">Submitted</option>
                <option value="Processing">Processing</option>
                <option value="Registered">Registered</option>
                <option selected value="Expired">Expired</option>`
                $("#detailStatus").append(x);
            }

            agreement_data.forEach((key, value)=>{
                let child = `<tr>
                    <td width="60%" class="px-2 px-md-5 text-bold" style="text-transform: capitalize; font-size: 1.2rem; color: black;">${value}</td>
                    <td >${key}</td>
                </tr>`
                $("#detailagreement_table").append(child);
            })

            property_data.forEach((key, value)=>{
                let child = `<tr>
                    <td width="60%" class="px-2 px-md-5 text-bold" style="text-transform: capitalize; font-size: 1.2rem; color: black;">${value}</td>
                    <td >${key}</td>
                </tr>`
                $("#detailproperty_table").append(child);
            })

            landlord_data.forEach((key, value)=>{
                let child = `<tr>
                    <td width="60%" class="px-2 px-md-5 text-bold" style="text-transform: capitalize; font-size: 1.2rem; color: black;">${value}</td>
                    <td >${key}</td>
                </tr>`
                $("#detaillandlord_table").append(child);
            })

            tenant_data.forEach((key, value)=>{
                let child = `<tr>
                    <td width="60%" class="px-2 px-md-5 text-bold" style="text-transform: capitalize; font-size: 1.2rem; color: black;">${value}</td>
                    <td >${key}</td>
                </tr>`
                $("#detailtenant_table").append(child);
            })

            $("#spinner").addClass("d-none");
            $("#spinner").removeClass("d-flex");
            
        }
    })
    window.scrollTo(0, 0);
    load_detail_page();
}


function changeStatus(){
    $("#spinner").removeClass("d-none");
    $("#spinner").addClass("d-flex");

    const agree_id = $("#hidden_id").val();
    const agree_status = $("#detailStatus").val()

    $.post("/update_data/",
    {
        "id": $("#hidden_id").val(),
        "status": $("#detailStatus").val(),
        "csrfmiddlewaretoken" : $("#staus_csrf_token").val()

    }, (data, status)=>{
        if(status=="success"){

            let isChanged = false;
            const paid_agreements_table = $("#agreement-table tr");

            for(let i=0; i<paid_agreements_table.length; i++){
                const row_id =  $($(paid_agreements_table[i]).children()[0]).text();
                if(row_id == agree_id){
                    $( $(paid_agreements_table[i]).children()[3] ).text(agree_status);
                    isChanged = true;
                    break;
                }
            }

            if(!isChanged){
                const unpaid_agreements_table = $("#unpaidAgreement-table tr");
                for(let i=0; i<unpaid_agreements_table.length; i++){
                    const row_id =  $($(unpaid_agreements_table[i]).children()[0]).text();
                    if(row_id == agree_id){
                        $( $(unpaid_agreements_table[i]).children()[3] ).text(agree_status);
                        isChanged = true;
                        break;
                    }
                }
            }

            $("#spinner").addClass("d-none");
            $("#spinner").removeClass("d-flex");
            makeAlert("success", data);
        }else{
            $("#spinner").addClass("d-none");
            $("#spinner").removeClass("d-flex");
            makeAlert("fail", "Something went Wrong. Please try again.");
        }
    })
}

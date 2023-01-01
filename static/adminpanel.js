


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

var current_page = 0;
var prev_page = 0;


dashboard.addEventListener("click", loadDashboard);
unpaid_agree.addEventListener("click", loadUnpaid_Agree);


function load_detail_page(){
    if(pages[2].classList.contains("d-none")){
        pages[2].classList.remove("d-none");
    }
    if(current_page != 2){
        pages[current_page].classList.add("d-none");
    }
    if (current_page < nav_items.length){
        nav_items[current_page].classList.remove("active");
    }
    prev_page = current_page;
    current_page = 2;
}


$("#profile").click(()=>{
    console.log(current_page);
    if(pages[3].classList.contains("d-none")){
        pages[3].classList.remove("d-none");
    }
    if(current_page != 3){
        pages[current_page].classList.add("d-none");
    }
    nav_items[current_page].classList.remove("active");
    prev_page = current_page;
    current_page = 3;
    console.log(current_page);
})


function loadDashboard(){
    if(pages[0].classList.contains("d-none")){
        pages[0].classList.remove("d-none");
    }
    if(current_page != 0){
        pages[current_page].classList.add("d-none");
    }
    if (current_page < nav_items.length){
        nav_items[current_page].classList.remove("active");
    }
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
    if (current_page < nav_items.length){
        nav_items[current_page].classList.remove("active");
    }
    prev_page = current_page;
    current_page = 1;
    nav_items[current_page].classList.add("active");
    // get_unpaid_agreements();
}


function setStatistics(){
    const total = $("#totaltickets");
    const percentage = $("#percentage");
    const percentagebar = $("#percentagebar");
    const progress = $("#progress");
    const incomplete = $("#incomplete");

    $.get("/statistics/", function(data, status, xhr){
        if(status == "success"){
            console.log(data);
            if(data){
                total.text(data.total);
                percentage.text(data.percentage+"%");
                percentagebar.attr("value", data.percentage);
                progress.text(data.progress);
                incomplete.text(data.incomplete);
            }
        }
    }
    )
}



var CURRENTCATEGORY = "all";
var myinterval;

function get_agreements(){
    CURRENT_AGREEMENT_NUMBER = $("#agreement-table tr:not([style*='display: none'])").length;
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
                        data.forEach((element) => {
                            
                            const date = element.fields.date;
                            const d1 = new Date(date);
                            const formattedDate = d1.format("mmm d, yyyy, h:MM:ss TT");
                            $("#detailDate").html(formattedDate);

                            if( CURRENTCATEGORY == 'all'){
                                var child = `<tr>
                                                <td>${element.pk}</td>
                                                <td>${element.fields.fname} ${element.fields.lname}</td>
                                                <td>${formattedDate}</td>
                                                <td>${element.fields.email}</td>
                                                <td>${element.fields.Phone_Number}</td>
                                                <td>${element.fields.status}</td>
                                                <td class="page-detail text-primary" style="cursor:pointer;" onclick="detail_page_info(${element.pk})">Details</td>
                                                <td class="page-detail text-danger" style="cursor:pointer;" onclick="delete_agreement(this, ${element.pk})">Delete</td>
                                            </tr>`
                            } else{
                                var child = `<tr class="d-none">
                                                <td>${element.pk}</td>
                                                <td>${element.fields.fname} ${element.fields.lname}</td>
                                                <td>${formattedDate}</td>
                                                <td>${element.fields.email}</td>
                                                <td>${element.fields.Phone_Number}</td>
                                                <td>${element.fields.status}</td>
                                                <td class="page-detail text-primary" style="cursor:pointer;" onclick="detail_page_info(${element.pk})">Details</td>
                                                <td class="page-detail text-danger" style="cursor:pointer;" onclick="delete_agreement(this, ${element.pk})">Delete</td>
                                            </tr>`
                            }
                                
                            $("#agreement-table").prepend(child);
                        });
                    }
                })
                setStatistics();
                CURRENT_AGREEMENT_NUMBER += MISSING_AGREEMENTS;
                myinterval = setInterval(get_agreements, 6000);
            }
        }else{
            console.log("not working");
        }
    })
}

myinterval = setInterval(get_agreements, 6000);






const allCategory = $("#allselection")
const progressCategory = $("#progressselection");
const incompleteCategory = $("#incompleteselection");
const CompletedCategory = $("#completeselection");


function displayall(){
    const paid_agreements_table = $("#agreement-table tr");
    for(let i=0; i<paid_agreements_table.length; i++){ 
        if ($(paid_agreements_table[i]).hasClass('d-none')){
            $(paid_agreements_table[i]).removeClass('d-none');
        }
    }
}


progressCategory.click(()=>{
    // clearInterval(myinterval);
    $("#spinner").removeClass("d-none");
    $("#spinner").addClass("d-flex");
    displayall();

    const paid_agreements_table = $("#agreement-table tr");

    for(let i=0; i<paid_agreements_table.length; i++){
        // console.log($($(paid_agreements_table[i]).children()[5]).text())
        const row_status =  $($(paid_agreements_table[i]).children()[5]).text();
        if(row_status != "Processing"){
            
            if ( ! $(paid_agreements_table[i]).hasClass('d-none')){
                $(paid_agreements_table[i]).addClass('d-none');
            }
        }
    }

    CURRENTCATEGORY = "Processing";
    console.log(CURRENTCATEGORY);

    $("#spinner").addClass("d-none");
    $("#spinner").removeClass("d-flex");
})



CompletedCategory.click(()=>{
    // clearInterval(myinterval);
    $("#spinner").removeClass("d-none");
    $("#spinner").addClass("d-flex");

    displayall();

    const paid_agreements_table = $("#agreement-table tr");

    for(let i=0; i<paid_agreements_table.length; i++){
        // console.log($($(paid_agreements_table[i]).children()[5]).text())
        const row_status =  $($(paid_agreements_table[i]).children()[5]).text();
        if(row_status != "Completed"){
            
            if ( ! $(paid_agreements_table[i]).hasClass('d-none')){
                $(paid_agreements_table[i]).addClass('d-none');
            }
        }
    }

    CURRENTCATEGORY = "Completed";
    console.log(CURRENTCATEGORY);

    $("#spinner").addClass("d-none");
    $("#spinner").removeClass("d-flex");
})



allCategory.click(()=>{
    
    $("#spinner").removeClass("d-none");
    $("#spinner").addClass("d-flex");
    
    displayall();
    CURRENTCATEGORY = "all";
    myinterval = setInterval(get_agreements, 6000);
    $("#spinner").addClass("d-none");
    $("#spinner").removeClass("d-flex");
})



incompleteCategory.click(()=>{
    // clearInterval(myinterval);
    $("#spinner").removeClass("d-none");
    $("#spinner").addClass("d-flex");

    displayall();

    const paid_agreements_table = $("#agreement-table tr");

    for(let i=0; i<paid_agreements_table.length; i++){
        // console.log($($(paid_agreements_table[i]).children()[5]).text())
        const row_status =  $($(paid_agreements_table[i]).children()[5]).text();
        if(row_status == "Completed"){
            
            if ( ! $(paid_agreements_table[i]).hasClass('d-none')){
                $(paid_agreements_table[i]).addClass('d-none');
            }
        }
    }

    CURRENTCATEGORY = "Incomplete";
    console.log(CURRENTCATEGORY);

    $("#spinner").addClass("d-none");
    $("#spinner").removeClass("d-flex");
})








function delete_agreement(element, agreement_id){
    let get_url = "/delete_data/"+agreement_id+"/";
    element.parentNode.style.display = "none";
    $.get(get_url, (data, status)=>{
        if(status=="success"){
            makeAlert("success", data)
            element.parentNode.style.display = "none";
        }
        else{
            makeAlert("fail", "Something went wrong.")
        }
    })
    setStatistics();
}

// Detail Page Section

function detail_page_info(agreement_id){
    $("#spinner").removeClass("d-none");
    $("#spinner").addClass("d-flex");


    $("#detailUsername").html("");
    $("#detailUseremail").html("");
    $("#detailphone").html("");
    $("#detailDate").html("");
    $("#detailProduct_Name").html("");
    $("#detailStatus").html("");
    $("#detailAddress").html("");
    $("#detailComment").html("");
    $("#solution").val("");


    const url = "/fetch_data_id/"+agreement_id+"/"
    $.get(url, (data, status)=>{
        if(status=="success"){
            $("#hidden_id").val(data[0].pk);
            data = data[0].fields
            console.log(data);
            const username = data.fname + " " + data.lname;
            $("#detailUsername").html(username);
            $("#detailUseremail").html(data.email);
            $("#detailphone").html(data.Phone_Number);

            const date = data.date;
            const d1 = new Date(date);
            const formattedDate = d1.format("dd/mm/yyyy");
            $("#detailDate").html(formattedDate);
            $("#detailProduct_Name").html(data.Product_Name);
            $("#detailAddress").html(data.Address);
            $("#detailComment").html(data.comment);
            console.log(data.answer);
            $("#solution").val(data.answer);


            
            const optionValue = data.status;
            $("#detailStatus").empty();
            if(optionValue == "Submitted"){
                const x = `<option selected value="Submitted">Submitted</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>`
                $("#detailStatus").append(x);
            }else if(optionValue == "Processing"){
                const x = `<option value="Submitted">Submitted</option>
                <option selected value="Processing">Processing</option>
                <option value="Completed">Completed</option>`
                $("#detailStatus").append(x);
            }else{
                const x = `<option value="Submitted">Submitted</option>
                <option value="Processing">Processing</option>
                <option selected value="Completed">Completed</option>`
                $("#detailStatus").append(x);
            }

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

    $.post("/data_change/",
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
                    $( $(paid_agreements_table[i]).children()[5] ).text(agree_status);
                    isChanged = true;
                    break;
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
    setTimeout(setStatistics, 3000);
    // setStatistics();
}




// Solution Submit Form
$("#solutionForm").submit((e)=>{
    e.preventDefault();
    $("#spinner").removeClass("d-none");
    $("#spinner").addClass("d-flex");

    const agree_id = $("#hidden_id").val();
    const agree_solution = $("#solution").val()

    $.post("/update_data_2/",
    {
        "id": $("#hidden_id").val(),
        "solution": $("#solution").val(),
        "csrfmiddlewaretoken" : $("#staus_csrf_token").val()

    }, (data, status)=>{
        if(status=="success"){
            $("#spinner").addClass("d-none");
            $("#spinner").removeClass("d-flex");
            makeAlert("success", data);
        }else{
            $("#spinner").addClass("d-none");
            $("#spinner").removeClass("d-flex");
            makeAlert("fail", "Something went Wrong. Please try again.");
        }
    })
})








"use strict";

// --------------------  https://webd6201-barberm-server.onrender.com ------------- WEBSITE LINK

//IIFE - Immediately Invoke Function Expression
//AKA - Anonymous Self - Executing Function
(function()
{
    function Start()
    {
        console.log("App Started!");

        let page_id = $("body")[0].getAttribute("id");

        CheckLogin();

        switch(page_id) {
            case "home" :
                DisplayHomePage();
                break;
            case "about" :
                DisplayAboutPage();
                break;
            case "services" :
                DisplayServicesPage();
                break;
            case "contact" :
                DisplayContactsPage();
                break;
            case "contact-link" :
                AuthGuard();
                DisplayContactListPage();
                break;
            case "edit" :
               // AuthGuard();
                DisplayEditPage();
                break;
            case "add" :
                //AuthGuard();
                DisplayEditPage();
                break;
            case "login" :
                DisplayLoginPage();
                break;
            case "products" :
                DisplayProductsPage();
                break;
            case "register" :
                DisplayRegisterPage();
                break;
            case "404" :
                Display404Page();
                break;
        }


    }
    window.addEventListener("load", Start)




    function Display404Page() : void {
        console.log("Display 404 page called");
    }

    function DisplayHomePage() : void {
        console.log("Display Home Called");


        $("main").append(`<p id="MainParagraph" class="mt-3">This is the Main Paragraph!!</p>`);

       // $("body").append(`<article><p id="ArticleParagraph"  class ="mt-3">This is my article paragraph</p></article>`);
    }

    function DisplayProductsPage() : void {
        console.log("Display Products Called");
    }

    function DisplayServicesPage() : void{
        console.log("Display Services Page Called");
    }

    function ContactFormValidation() : void {
        ValidateField("#fullName",
            /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/,
            "Please Enter a valid First Name and Last Name. (Ex. Stephen Strange)");
        ValidateField("#contactNumber",
            /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,
            "Please Enter a valid Contact Number (Ex. 905-555-5555");
        ValidateField("#emailAddress",
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,
            "Please Enter a valid Email Address. (Ex. ThisExample@dcmail.ca)");
    }

    function ValidateField(input_field_id : string, regular_expression : RegExp, error_Message : string) : void
    {
        let messageArea = $("#messageArea");

        $(input_field_id).on("blur", function() {
            let InputFieldText = $(this).val() as string;
            if(!regular_expression.test(InputFieldText)){
                // fail validation
                $(this).trigger("focus");  // Go back to the full name text box
                $(this).trigger("select"); // This will Highlight the text input
                messageArea.addClass("alert alert-danger");
                messageArea.text(error_Message);
                messageArea.show();
            }else {
                // pass validation
                messageArea.removeAttr("class");
                messageArea.hide();
            }
        })

    }

    function DisplayContactsPage() : void{
        console.log("Display Contacts Called");

        $("a[data ='contact-list']").off("click");
        $("a[data ='contact-list']").on("click", function () {
            location.href = "/contact-list";
        });

        ContactFormValidation();

        let sendButton = document.getElementById("sendButton") as HTMLElement;
        let subscribeCheckbox = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        sendButton.addEventListener("click", function (event)
        {
            if(subscribeCheckbox.checked)
            {
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;

                AddContact(fullName, contactNumber, emailAddress);
            }
        })
    }


    function DisplayAboutPage()  : void{
        console.log("Display About us page Called");
    }

    function DisplayContactListPage() : void {
        console.log("Display Contact List page Called");

        $("a.delete").on("click", function (event){
            if(!confirm("Delete contact, please onfirm")){
                event.preventDefault();
                location.href="/contact-list";
            }
            location.href="/contact-list";
        });
    }

    function DisplayEditPage() : void {
        console.log("Display Edit page Called");

        ContactFormValidation();

    }

    //EXTRA FUNCTIONS (USED MORE THAN ONCE)
    function AddContact(fullName : string, contactNumber : string, emailAddress : string) : void
    {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize())
        {
            let key = contact.FullName.substring(0,1) + Date.now();
            localStorage.setItem(key, contact.serialize() as string);
        }
    }

    function DisplayLoginPage() : void {
        console.log("Display Login page Called");

        let messageArea2 = $("#messageArea2");
        messageArea2.hide();

        $("#loginButton").on("click", function ()
        {
            let success = false; // set default to false
            let newUser = new core.User();

            $.get("./data/user.json", function(data){
                for(const u of data.user){

                    let userNameLogin = document.forms[0].userNameLogin.value;
                    let passwordLogin = document.forms[0].passwordLogin.value;

                    if (userNameLogin === u.Username && passwordLogin === u.Password) {
                        success = true;
                        newUser.fromJSON(u);
                        break;
                    }
                }
                if(success){
                    sessionStorage.setItem("user", newUser.serialize() as string);
                    messageArea2.removeAttr("class").hide();
                    location.href = "/contact-list";
                }else{
                    // fail authentication
                    $("#userNameLogin").trigger("focus").trigger("select");
                    messageArea2.addClass("alert alert-danger").text("Error - " +
                        "Failed to login with username & password entered.")
                    messageArea2.show();
                }
            });

        });

        $("#cancelButton").on("click", function () {
            document.forms[0].reset();
            location.href = "/home";
        });
    }

    /**
     *
     */
    function AuthGuard() : void {
        let protected_routes : string[] = ["contact-list", "edit"];

        if (protected_routes.indexOf(location.pathname) > -1){
            if(!sessionStorage.getItem("user")){
                location.href = "/login";
            }
        }
    }
// ADDED COMMENT TO FIX GITHUB UPLOAD

    function CheckLogin() : void {
        if(sessionStorage.getItem("user")){
            $("#login").html(`<a class="nav-link" id="logout" href="/">
                                                    <i class="fa-solid fa-right-to-bracket"></i> Log Out</a>`);
        }
        $("#logout").on("click", function() {
           sessionStorage.clear();
            location.href = "/home";
        });

    }

    function DisplayRegisterPage() : void {
        console.log("Display Register page Called");
    }

})();
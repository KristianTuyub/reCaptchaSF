({
    doInit : function(component, event, helper) {
        
        let vfOrigin = window.location.href;

        window.addEventListener("message", function(event) {
            // this.console.log(event.data); // event.data = 'locked' || 'unlocked'

            /*
            if(event.origin != vfOrigin) {
                return;
            }
            */
            if(event.data === "unlock") {
                // Access helper variable to mark that reCaptcha component gave access to the user to send data to the backend.
                helper.reCaptchaUsed = event.data;

                // Enable the Submit button
                let button = component.find("submitButton");
                button.set('v.disabled', false);
            }
        }, false);
    },

    doSubmit : function(component, event, helper) {

        if(helper.reCaptchaUsed === "unlock") {
            // Get Contact Attributes from Form
            let firstName = component.get("v.newContact.FirstName");
            let lastName = component.get("v.newContact.LastName");
            let secondLastName = component.get("v.newContact.SecondLastName");
            let email = component.get("v.newContact.Email");
            let companyName = component.get("v.newContact.CompanyName");
            let phoneNumber = component.get("v.newContact.PhoneNumber");

            // Get Case Attributes from Form
            let caseSubject = component.get("v.newCase.Subject");
            let caseSelectedType = component.find("caseFormCaseType").get("v.value"); // Find using the aura:id identifier
            let caseDescription = component.get("v.newCase.Description");

            // console.log(caseSelectedType); // test
            // CALL OF APEX CONTROLLER
            try {
                let action = component.get('c.NewCase');
                action.setParams({
                    'firstName': firstName, 
                    'lastname': lastName, 
                    'scndLastName': secondLastName, 
                    'newCorreo': email,
                    'companyName': companyName, 
                    'phNumber': phoneNumber, 
                    'TypeCase': caseSelectedType, 
                    'CaseSubject': caseSubject, 
                    'CaseDescription': caseDescription
                });
                /*
                let validateFields = component.get('c.validateFields');
                let validEmail = $A.enqueueAction(validateFields);

                console.log(validEmail + ' ----------- validemail');*/
                let blankFields = false;
                if( firstName === '', 
                    lastName === '', 
                    secondLastName === '', 
                    phoneNumber === '', 
                    caseSelectedType === '', 
                    caseSubject === '', 
                    caseDescription === '') {
                    blankFields = true;
                }

                let validEmail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));

                //console.log(validEmail + ' blankFields?: ' + blankFields);

                // First If executes if email is valid and the other fields are not left blank
                if(validEmail && !blankFields) {
                    //console.log('valid email, creating new case');
                    //DEFINE WHAT SHOULD HAPPEN AFTER SERVER-SIDE CALL RETURNS
                    action.setCallback(this, function(response) {
                        var state = response.getState();

                        if(component.isValid() && state === "SUCCESS") {
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                title : 'Success!',
                                message: 'New Open Case Created Successfully!',
                                duration:' 2000',
                                key: 'info_alt',
                                type: 'success',
                                mode: 'pester'
                            });
                            toastEvent.fire();
                            setTimeout(() => { window.location = "/donaciones/s/thank-you-for-contacting-us"; }, 3000);
                        }
                        else {
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                title : 'Error',
                                message:'Failed to create new Case - Server Error. Try Again in a few minutes',
                                duration:' 5000',
                                key: 'info_alt',
                                type: 'error',
                                mode: 'pester'
                            });
                            toastEvent.fire();
                        }
                    });

                    //DON'T FORGET TO ENQUEUE YOUR ACTION
                    $A.enqueueAction(action);
                } else if(blankFields) {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Error',
                        message:'Please, Complete All Required Fields and Try Again.',
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                } else if(!validEmail) {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Error',
                        message:'Please, provide a valid email address and try again',
                        duration:' 5000',
                        key: 'info_alt',
                        type: 'error',
                        mode: 'pester'
                    });
                    toastEvent.fire();
                }
                
            } catch (error) {
                console.log(error); // Looks unreachable
            }

        } else {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Error',
                message:'Captcha Challenge Not Resolved',
                duration:' 5000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
        
    }
})

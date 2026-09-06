document.addEventListener("DOMContentLoaded", function () {

   // raise header if active header__categories-select, header__lang-select, header__blockProfile
   const header = document.querySelector('.header.header');
   const trackedElements = [
      '.header__categories-select',
      '.header__lang-select',
      '.header__blockProfile'
   ];
   const checkOpenClass = () => { // Function to check for the presence of the open class
      const hasOpenClass = trackedElements.some(selector => {
         const element = document.querySelector(selector);
         return element && element.classList.contains('open');
      });
      if (hasOpenClass) {
         header.classList.add('lift-up');
      } else {
         header.classList.remove('lift-up');
      }
   };
   const observer = new MutationObserver(checkOpenClass); // Add MutationObserver to track class changes
   trackedElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
         observer.observe(element, { attributes: true, attributeFilter: ['class'] });
      }
   });

   // Open/close the number entry field
   document.querySelectorAll('.select-curent').forEach(openFieldPhone => {
      openFieldPhone.addEventListener('click', () => {
         openFieldPhone.parentNode.classList.toggle('open');
      });
   });

   // Process forms independently for log-in and registration tabs
   const forms = document.querySelectorAll('.log-in-form');

   forms.forEach(form => {
      const inputField = form.querySelector('.select-wrap-input input');
      const loginButton = form.querySelector('.log-in-form__button.submit-in-button');
      const displayFields = form.querySelectorAll('.log-in-entered-number'); // All elements for displaying the number
      
      const phoneBlock = form.querySelector('.log-in-form__block:first-child');
      const smsBlock = form.querySelector('[data-tabcontent="code-from-sms"]');

      const timerElement = form.querySelector('.log-in-form-timer');
      const blockInfo = form.querySelector('.log-in-form__block-info');
      const wrapSubmit = form.querySelector('.log-in-form__wrap-submit');
      const wrapSubmitTwoButton = form.querySelector('.log-in-form__wrap-submit.two-button');
      const wrapFieldsNumber = form.querySelector('.wrap-fields-number');
      const confirmButton = form.querySelector('.log-in-form__block-button');
      const numberFields = form.querySelectorAll('.wrap-fields-number input[type="number"]');

      let timerInterval; // Variable for storing the timer

      // Field in focus
      if (inputField) {
         inputField.addEventListener('focus', () => {
            inputField.parentNode.parentNode.classList.add('field-in-focus');
            setTimeout(() => { // Remove class after 3 seconds
               inputField.parentNode.parentNode.classList.remove('field-in-focus');
            }, 3000);
         });

         // Checking a field for validity / Add entered number to log-in-entered-number
         inputField.addEventListener('input', () => {
            inputField.value = inputField.value.replace(/[^\d]/g, '').slice(0, 10); // Remove non-numeric characters, including +
            const isValid = /^\d{10}$/.test(inputField.value); // Check if there are exactly 10 digits
            const formattedNumber = inputField.value.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4').trim(); // Formatting a number with spaces
            
            displayFields.forEach(field => { // Update all fields with class .log-in-entered-number
               field.textContent = formattedNumber;
            });

            if (isValid) {
               loginButton.classList.remove('disabled'); // Remove the class if the input is valid
               loginButton.removeAttribute('disabled');
            } else {
               loginButton.classList.add('disabled'); // Add class if input is invalid
               loginButton.setAttribute('disabled', 'true');
            }
         });
      }

      // Timer start function
      function startTimer() { 
         let timeLeft = 59; // Countdown from 59 seconds
         const updateTimerDisplay = () => {
            const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
            const seconds = String(timeLeft % 60).padStart(2, '0');
            if (timerElement) {
               timerElement.textContent = `${minutes}:${seconds}`;
            }
         };

         if (blockInfo) {
            blockInfo.classList.remove('not-receive'); // Reset state before restarting
         }

         clearInterval(timerInterval); // Clear the previous timer if there was one
         updateTimerDisplay(); // Set the initial value of the timer

         timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
               clearInterval(timerInterval); // Stop the timer
               if (blockInfo) {
                  blockInfo.classList.add('not-receive'); // Show resend button immediately after timer ends
               }
            }
         }, 1000);
      }

      // Go to SMS code input step on click "Увійти" / "Зареєструватись"
      if (loginButton) {
         loginButton.addEventListener('click', () => {
            if (loginButton.hasAttribute('disabled') || loginButton.classList.contains('disabled')) return;

            if (phoneBlock && smsBlock) {
               phoneBlock.classList.remove('block-active');
               smsBlock.classList.add('block-active');
            }

            // Hide only the wrapper
            if (wrapSubmit) {
               wrapSubmit.classList.add('hidden');
            }

            startTimer(); // Start the timer
            if (wrapSubmitTwoButton) {
               wrapSubmitTwoButton.classList.add('hidden');
            }
         });
      }

      // Click handler for log-in-form__block-info to resend SMS code
      if (blockInfo) { 
         blockInfo.addEventListener('click', () => {
            if (blockInfo.classList.contains('not-receive')) {
               startTimer(); // Restart the timer immediately
            }
         });
      }

      // Enter or paste code
      numberFields.forEach((field, index) => { // Function for handling input
         field.addEventListener('input', () => {
            // Leave only numbers
            field.value = field.value.replace(/\D/g, '');
            if (field.value.length > 1) { // Limit to one digit per field
               field.value = field.value[0]; // Leave only the first digit
            }
            if (field.value.length === 1 && index < numberFields.length - 1) { // If a number is entered, move to the next field
               numberFields[index + 1].focus();
            }
            // Check if all fields are filled (only 4 digits)
            const allValues = Array.from(numberFields).map(input => input.value).join('');
            if (allValues.length >= 4) {
               let values = allValues.slice(0, 4).split(''); // We take only the first 4 digits
               numberFields.forEach((input, i) => {
                  input.value = values[i] || ''; // Separate the numbers by fields, if there are less than 4, leave them empty
               });
            }
         });

         field.addEventListener('paste', (e) => { // Processing paste (Ctrl + V)
            e.preventDefault(); // Stop the default insert behavior
            // Get the inserted data
            const pasteData = e.clipboardData.getData('text').replace(/\D/g, ''); // Leave only numbers
            const dataToPaste = pasteData.slice(0, 4); // We take only the first 4 digits
            // Separate the numbers and insert them into fields
            let values = dataToPaste.split('');
            numberFields.forEach((input, i) => {
               input.value = values[i] || ''; // If the numbers are less than 4, leave them blank
            });
         });
      });

      // If the code is valid and the valid class is added to the parent of the code fields
      if (wrapFieldsNumber) {
         function checkValidClass() { // Function to check if class 'valid' exists
            if (wrapFieldsNumber.classList.contains('valid')) {
               if (blockInfo) { // Add the hidden class to .log-in-form__block-info
                  blockInfo.classList.add('hidden');
               }
               if (confirmButton) { // Remove the disabled attribute from the button
                  confirmButton.removeAttribute('disabled');
               }
            } else { // If there is no 'valid' class, add the 'hidden' class back and set the disabled attribute
               if (blockInfo) {
                  blockInfo.classList.remove('hidden');
               }
               if (confirmButton) {
                  confirmButton.setAttribute('disabled', 'true');
               }
            }
         }

         const observer2 = new MutationObserver(checkValidClass); // Track changes to the valid class
         observer2.observe(wrapFieldsNumber, {
            attributes: true, // track attribute changes
            attributeFilter: ['class'] // track only class changes
         });
         checkValidClass(); // We also run the check when the page initially loads
      }

      // Form submit handler for code confirmation
      form.addEventListener('submit', (e) => {
         if (confirmButton && confirmButton.hasAttribute('disabled')) {
            e.preventDefault();
            return;
         }
         
         const oneButtonSubmit = form.querySelector('.log-in-form__wrap-submit.one-button-submit');
         if (oneButtonSubmit) {
            oneButtonSubmit.classList.add('show');
         }
      });
   });

});
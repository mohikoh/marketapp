document.addEventListener('DOMContentLoaded', function () {
   // Main block with a large picture
   const mainPhotoInput = document.getElementById('profile-photo');
   const mainPhotoWrap = document.getElementById('create-add-wrap-photo');
   const shouldValidateMainPhoto = mainPhotoWrap && !mainPhotoWrap.classList.contains('do-not-use-in-validation');
   const additionalImagesWrap = document.querySelector('.create-add__additional-images');

   // Update image and add class for main block
   setupPhotoHandler(mainPhotoInput, mainPhotoWrap, additionalImagesWrap);

   // Processing additional images
   const additionalPhotoInputs = document.querySelectorAll('[id^="profile-photo-additional-"]');
   additionalPhotoInputs.forEach(input => {
      const wrap = input.closest('.create-add__wrapPhoto');
      setupPhotoHandler(input, wrap);
   });

   // Clearing the image by button
   const removeButtons = document.querySelectorAll('[id^="remove-photo-"]');
   removeButtons.forEach(button => {
      button.addEventListener('click', function () {
         const id = button.id.replace('remove-photo-', '');
         const wrap = document.getElementById(`create-add-wrap-additional-photo-${id}`);
         const input = document.getElementById(`profile-photo-additional-${id}`);
         clearPhoto(wrap, input);
      });
   });

   /**
    * Image processing initialization function
    * @param {HTMLInputElement} input - Image upload field
    * @param {HTMLElement} wrap - Image wrapper
    * @param {HTMLElement|null} additionalWrap - Additional wrapping (if any)
    */
   function setupPhotoHandler(input, wrap, additionalWrap = null) {
      // Handle image change via input
      if (input) {
         input.addEventListener('change', function () {
            handlePhotoChange(input, wrap, additionalWrap);
         });
      }
      // Add drag and drop support
      if (wrap) {
         wrap.addEventListener('dragover', (e) => {
            e.preventDefault();
            wrap.classList.add('dragover');
         });

         wrap.addEventListener('dragleave', () => {
            wrap.classList.remove('dragover');
         });
      
         wrap.addEventListener('drop', (e) => {
            e.preventDefault();
            wrap.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
               handleDroppedPhoto(file, wrap, input, additionalWrap);
            }
         });
      }
   }

   /**
    * Image selection processing function
    * @param {HTMLInputElement} input - Image upload field
    * @param {HTMLElement} wrap - Image wrapper
    * @param {HTMLElement|null} additionalWrap - Additional wrapping (if any)
    */
   function handlePhotoChange(input, wrap, additionalWrap = null) {
      if (input.files && input.files[0]) {
         const reader = new FileReader();
         reader.onload = function (e) {
            let img = wrap.querySelector('img');
            if (!img) {
               img = document.createElement('img');
               wrap.appendChild(img);
            }
            img.src = e.target.result;
            wrap.classList.add('photo-selected');
            if (additionalWrap) {
               additionalWrap.classList.add('show-additional-photo');
            }
         };
         reader.readAsDataURL(input.files[0]);
         setTimeout(() => {
            if (typeof validateForm === 'function') {
               validateForm();
            }
         }, 50);
      }
   }

   /**
    * Image processing function while dragging
    * @param {File} file - Dragged file
    * @param {HTMLElement} wrap - Image wrapper
    * @param {HTMLInputElement} input - Image upload field
    * @param {HTMLElement|null} additionalWrap - Additional wrapping (if any)
    */
   function handleDroppedPhoto(file, wrap, input, additionalWrap = null) {
      const reader = new FileReader();
      reader.onload = function (e) {
         let img = wrap.querySelector('img');
         if (!img) {
            img = document.createElement('img');
            wrap.appendChild(img);
         }
         img.src = e.target.result;
         wrap.classList.add('photo-selected');
         if (additionalWrap) {
            additionalWrap.classList.add('show-additional-photo');
         }
      };
      reader.readAsDataURL(file);

      // Update input to sync
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
   }

   /**
    * Image cleaning function
    * @param {HTMLElement} wrap - Image wrapper
    * @param {HTMLInputElement} input - Image upload field
    */
   function clearPhoto(wrap, input) {
      const img = wrap.querySelector('img');
      if (img) {
         img.remove();
      }
      input.value = ''; // Reset the value of input
      wrap.classList.remove('photo-selected');
      if (typeof validateForm === 'function') {
         validateForm();
      }
   }

   // Validate Form
   const form = document.querySelector('.create-add__form');

   if (form) {

      const submitButton = form.querySelector('button[type="submit"]');
      const previewButton = form.querySelector('.create-add__form-button.preview');

      const titleField = document.getElementById('create-add-title');
      const categoriesField = document.querySelector('input[name="sidebar-filters-select-categories"]');
      const countryField = document.getElementById('create-add-country');
      const cityField = document.querySelector('input[name="sidebar-filters-select-city"]');
      const descriptionField = document.getElementById('create-add-description');

      function toggleValidField(field) {
         const valid = field.value.trim() !== '';
         field.classList.toggle('is-valid', valid);
         return valid;
      }

      // отслеживание для навешивания класса чтобы цвет темнее был при выборе и заполнения тайтла и описания
      function updateSelectedStates() {

         // Select2 + hidden fields
         document.querySelectorAll('.wrap-select-form').forEach(wrap => {

            const hiddenField = wrap.querySelector('input[type="hidden"]');

            if (!hiddenField) {
               return;
            }

            wrap.classList.toggle('selected', hiddenField.value.trim() !== '');

         });

         // Title
         const titleField = document.getElementById('create-add-title');

         if (titleField) {
            titleField.classList.toggle('selected', titleField.value.trim() !== '');
         }

         // Description
         const descriptionField = document.getElementById('create-add-description');

         if (descriptionField) {
            descriptionField.classList.toggle('selected', descriptionField.value.trim() !== '');
         }
      }

      function validateForm() {

         updateSelectedStates();

         let isValid = true;

         /*
         if (!mainPhotoWrap.querySelector('img')) {
            isValid = false;
         }
         */

         if (shouldValidateMainPhoto && !mainPhotoWrap.querySelector('img')) {
            isValid = false;
         }

         if (!titleField.value.trim()) {
            isValid = false;
         }

         if (!categoriesField.value.trim()) {
            isValid = false;
         }

         if (!countryField.value.trim()) {
            isValid = false;
         }

         if (!cityField.value.trim()) {
            isValid = false;
         }

         if (!descriptionField.value.trim()) {
            isValid = false;
         }

         submitButton.disabled = !isValid;

         if (previewButton) {
            previewButton.classList.toggle('disabled', !isValid);
         }
      }

      titleField?.addEventListener('input', validateForm);
      descriptionField?.addEventListener('input', validateForm);

      categoriesField?.addEventListener('change', validateForm);
      countryField?.addEventListener('change', validateForm);
      cityField?.addEventListener('change', validateForm);

      // Фото
      mainPhotoInput?.addEventListener('change', () => {
         setTimeout(validateForm, 50);
      });

      validateForm();
   }
   document.querySelectorAll('.wrap-select-form input[type="hidden"]').forEach(input => {
      let oldValue = input.value;
      setInterval(() => {
         if (oldValue !== input.value) {
            oldValue = input.value;
            validateForm();
         }
      }, 200);
   });

   // === Сброс скрытого поля в wrap-select-form при сбросе select2 ===
   document.querySelectorAll('.wrap-select-form').forEach(wrap => {
      const select = wrap.querySelector('select');
      const hiddenInput = wrap.querySelector('input[type="hidden"]');
      if (!select || !hiddenInput) {
         return;
      }
      select.addEventListener('change', function () {
         hiddenInput.value = this.value || '';
         if (typeof validateForm === 'function') {
            validateForm();
         }
      });
   });

});


console.log('TourOperator.js loaded successfully!');

// Ensure everything runs after DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded.');

    // Sidebar Tab Switching Logic
    const navLinks = document.querySelectorAll('.nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabPanes.forEach((pane) => pane.classList.remove('active'));
    const activeTab = document.querySelector('.nav-link.active');
    if (activeTab) {
        document.getElementById(activeTab.dataset.tab).classList.add('active');
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach((link) => link.classList.remove('active'));
            tabPanes.forEach((pane) => pane.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(link.dataset.tab).classList.add('active');
        });
    });

    // Logout Modal Logic
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogout = document.getElementById('confirm-logout');
    const cancelLogout = document.getElementById('cancel-logout');

    const logoutTab = document.querySelector('[data-tab="logout"]');
    if (logoutTab) {
        logoutTab.addEventListener('click', () => {
            logoutModal.classList.add('show');
        });
    }

    confirmLogout?.addEventListener('click', () => {
        window.location.href = '{{ url_for("touroperator.logout") }}';
    });

    cancelLogout?.addEventListener('click', () => {
        logoutModal.classList.remove('show');
    });

    // Booking Tab Switching Logic
    const bookingTabBtns = document.querySelectorAll('.booking-tab-btn');
    const bookingCategories = document.querySelectorAll('.booking-category');

    bookingTabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            bookingTabBtns.forEach((btn) => btn.classList.remove('active'));
            btn.classList.add('active');

            const status = btn.dataset.status;
            bookingCategories.forEach((category) => {
                const categoryStatus = category.dataset.status;
                category.style.display =
                    status === 'all' || categoryStatus === status ? 'block' : 'none';
            });
        });
    });

// Booking Details Modal Logic
const bookingModal = document.getElementById('booking-modal');
const bookingInfo = document.getElementById('booking-info');
const closeBookingModal = document.getElementById('close-booking-modal');

function openBookingDetails(details) {
  bookingInfo.textContent = details;
  bookingModal.classList.add('show');
}

closeBookingModal.addEventListener('click', () => {
  bookingModal.classList.remove('show');
});














    
    // Functionality for editable fields
    setupEditableSection('name');
    setupEditableSection('email');
    setupEditableSection('contact-number');
    
    function setupEditableSection(fieldId) {
        const editBtn = document.getElementById(`edit-${fieldId}-btn`);
        const saveBtn = document.getElementById(`save-${fieldId}-btn`);
        const input = document.getElementById(fieldId);
    
        editBtn?.addEventListener('click', () => {
            input.disabled = false;
            input.focus();
            editBtn.classList.add('hidden');
            saveBtn.classList.remove('hidden');
        });
    
        saveBtn?.addEventListener('click', () => {
            input.disabled = true;
            editBtn.classList.remove('hidden');
            saveBtn.classList.add('hidden');
        });
    }
    




// Selecting elements
const changePicBtn = document.getElementById('change-pic-btn');
const uploadPicInput = document.getElementById('upload-pic');
const profilePicOperator = document.getElementById('profile-pic-operator');
const cropperModal = document.getElementById('cropper-modal');
const cropperContainer = document.getElementById('cropper-container');
const cropBtn = document.getElementById('crop-btn');
const closeCropperBtn = document.getElementById('close-cropper-modal');
const savePicBtn = document.getElementById('save-pic-btn');
let cropper;

// Hide "Save" button by default on page load
savePicBtn.classList.add('hidden');

// Open file input on button click
changePicBtn.addEventListener('click', () => {
  uploadPicInput.value = "";  // Reset file input to allow re-selection
  uploadPicInput.click();
});

// Show cropper modal on image selection
uploadPicInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.id = 'crop-image';
      cropperContainer.innerHTML = ''; // Clear previous image
      cropperContainer.appendChild(img);
      cropperModal.classList.add('show'); // Show the cropper modal

      // Destroy previous cropper instance if it exists, and create a new one
      if (cropper) {
        cropper.destroy();
        cropper = null;  // Ensure cropper is set to null after destruction
      }
      cropper = new Cropper(img, {
        aspectRatio: 1,
        viewMode: 1,
        movable: true,
        zoomable: true,
        scalable: true,
        cropBoxResizable: true,
      });
    };
    reader.readAsDataURL(file);
  }
});

// Crop and update profile picture preview
cropBtn.addEventListener('click', () => {
  const canvas = cropper.getCroppedCanvas({ width: 200, height: 200 });
  if (canvas) {
    // Update profile picture preview
    const newImageSrc = canvas.toDataURL();
    profilePicOperator.src = newImageSrc;

    cropperModal.classList.remove('show'); // Close modal
    savePicBtn.classList.remove('hidden'); // Show save button only after cropping
  } else {
    console.error("Error: Cropping failed. Canvas is not generated.");
  }
});

// Close cropper modal and destroy cropper instance
closeCropperBtn.addEventListener('click', () => {
  if (cropper) {
    cropper.destroy();
    cropper = null;  // Set cropper to null to ensure clean reinitialization
  }
  cropperModal.classList.remove('show');
});

// Save profile picture to backend
savePicBtn.addEventListener('click', () => {
  cropper.getCroppedCanvas({ width: 200, height: 200 }).toBlob((blob) => {
    const formData = new FormData();
    formData.append('profile_picture', blob);

    console.log("Uploading profile picture...");

    fetch('/tourguide/upload_profile_picture', {  // Updated URL for tour operator
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log("Server response:", data);

      if (data.success) {
        // Append a timestamp to prevent caching issues and update the profile picture in the UI
        const newImageUrl = `${data.url}?t=${new Date().getTime()}`;
        profilePicOperator.src = newImageUrl;

        savePicBtn.classList.add('hidden'); // Hide save button after saving
        alert('Profile picture saved successfully!');
      } else {
        alert('Failed to save profile picture.');
      }
    })
    .catch(error => {
      console.error('Error uploading image:', error);
      alert('An error occurred while saving the picture.');
    })
    .finally(() => {
      // Ensure the cropper instance is destroyed after saving
      if (cropper) {
        cropper.destroy();
        cropper = null;
      }
      cropperModal.classList.remove('show');
    });
  });
});



    // Password Management Logic
    const editPasswordBtn = document.getElementById('edit-password-btn');
    const savePasswordBtn = document.getElementById('save-password-btn');
    const reenterPasswordGroup = document.getElementById('reenter-password-group');
    const newPasswordGroup = document.getElementById('new-password-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');

    editPasswordBtn?.addEventListener('click', () => togglePasswordEdit(true));
    savePasswordBtn?.addEventListener('click', () => togglePasswordEdit(false));

    function togglePasswordEdit(isEditing) {
        [reenterPasswordGroup, newPasswordGroup, confirmPasswordGroup].forEach(group => {
            group.classList.toggle('hidden', !isEditing);
        });
        editPasswordBtn.classList.toggle('hidden', isEditing);
        savePasswordBtn.classList.toggle('hidden', !isEditing);
    }
});








// Ensure Tour Management Tab Displays on Load
window.addEventListener('DOMContentLoaded', () => {
  
    tabPanes.forEach((pane) => {
      pane.style.display = pane.id === 'tour-management' ? 'block' : 'none';
    });
  });
  
  // Add Tour Guide Modal Logic
  const addTourGuideBtn = document.getElementById('add-tour-guide-btn');
  const tourGuideModal = document.getElementById('tour-guide-modal');
  const closeTourGuideModal = document.getElementById('close-tour-guide-modal');
  
  addTourGuideBtn?.addEventListener('click', () => {
    tourGuideModal.classList.add('show');
  });
  
  closeTourGuideModal?.addEventListener('click', () => {
    tourGuideModal.classList.remove('show');
  });




  
  
// Open and Close Create Tour Package Modals
document.getElementById('open-form-btn').addEventListener('click', () => {
    document.getElementById('form-modal').classList.add('show');
    document.getElementById('modal-overlay').classList.add('show');
  });
  
  document.getElementById('close-form-modal').addEventListener('click', () => {
    document.getElementById('form-modal').classList.remove('show');
    document.getElementById('modal-overlay').classList.remove('show');
  });
  
  // Open the Details Modal
  document.getElementById('tour-packages-display').addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('view-details-btn')) {
      document.getElementById('details-modal').classList.add('show');
      document.getElementById('modal-overlay').classList.add('show');
    }
  });
  
  // Close the Details Modal
  document.getElementById('close-details-modal').addEventListener('click', () => {
    document.getElementById('details-modal').classList.remove('show');
    document.getElementById('modal-overlay').classList.remove('show');
  });
  
  // Close any open modal when clicking on the overlay
  document.getElementById('modal-overlay').addEventListener('click', () => {
    document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('show'));
    document.getElementById('modal-overlay').classList.remove('show');
  });
  
  // Add and Remove Inclusions/Exclusions
  document.getElementById('add-inclusion-btn').addEventListener('click', () => {
    const newInclusion = document.createElement('li');
    newInclusion.innerHTML = `<input type="text" placeholder="Add inclusion" class="editable-item" />
                              <button type="button" class="remove-btn">Remove</button>`;
    document.getElementById('inclusions-list').appendChild(newInclusion);
  });
  
  document.getElementById('add-exclusion-btn').addEventListener('click', () => {
    const newExclusion = document.createElement('li');
    newExclusion.innerHTML = `<input type="text" placeholder="Add exclusion" class="editable-item" />
                              <button type="button" class="remove-btn">Remove</button>`;
    document.getElementById('exclusions-list').appendChild(newExclusion);
  });
  
  // Remove an inclusion or exclusion item
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('remove-btn')) {
      e.target.parentElement.remove();
    }
  });
  




  


// //EMAIL
// const editNameBtn = document.getElementById('edit-name-btn');
// const saveNameBtn = document.getElementById('save-name-btn');
// const nameInput = document.getElementById('name-input');
// const passwordModal = document.getElementById('password-verification-modal');
// const verifyPasswordBtn = document.getElementById('verify-password-btn');
// const cancelVerificationBtn = document.getElementById('cancel-verification-btn');
// const verificationPasswordInput = document.getElementById('verification-password');

// // Show the password verification modal when the pencil button is clicked
// editNameBtn?.addEventListener('click', () => {
//   console.log("Edit button clicked");
//   passwordModal.classList.remove('hidden');
//   verificationPasswordInput.value = '';  // Clear any previous password
//   verificationPasswordInput.focus();  // Focus on the password input
// });

// // Close the modal if the user clicks "Cancel"
// cancelVerificationBtn?.addEventListener('click', () => {
//   console.log("Cancel button clicked");
//   passwordModal.classList.add('hidden');
// });

// // Handle password verification when "Verify" button is clicked
// verifyPasswordBtn?.addEventListener('click', async () => {
//   const password = verificationPasswordInput.value;

//   console.log("Verifying password");

//   try {
//     const response = await fetch('/tourguide/verify-password', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ password })
//     });
    
//     const result = await response.json();
//     if (result.success) {
//       console.log("Password verified successfully");
//       passwordModal.classList.add('hidden');
//       nameInput.disabled = false;
//       nameInput.focus();
//       editNameBtn.classList.add('hidden');
//       saveNameBtn.classList.remove('hidden');
//     } else {
//       alert('Incorrect password, please try again.');
//     }
//   } catch (error) {
//     console.error('Error verifying password:', error);
//     alert('An error occurred. Please try again later.');
//   }
// });

// // Handle saving the new name when the "Save" button is clicked
// saveNameBtn?.addEventListener('click', async () => {
//   const newName = nameInput.value;

//   console.log("Saving new name:", newName);

//   try {
//     const response = await fetch('/tourguide/update_email', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name: newName })
//     });

//     const result = await response.json();
//     if (result.success) {
//       alert('Name updated successfully!');
//       nameInput.disabled = true;
//       editNameBtn.classList.remove('hidden');
//       saveNameBtn.classList.add('hidden');
//     } else {
//       alert('Failed to update name. Please try again.');
//     }
//   } catch (error) {
//     console.error('Error updating name:', error);
//     alert('An error occurred. Please try again later.');
//   }
// });





// Elements
// Elements EMAIL and Contact number and PASSWORD
document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const guideEditEmailBtn = document.getElementById('guide-edit-email-btn');
  const guideEditContactBtn = document.getElementById('guide-edit-contact-btn');
  const guideEditPasswordBtn = document.getElementById('guide-edit-password-btn'); // Pencil icon for password change
  const guidePasswordModal = document.getElementById('guide-password-confirm-modal'); // Password verification modal
  const guideChangePasswordModal = document.getElementById('guide-change-password-modal'); // Change password modal
  const guideChangeEmailModal = document.getElementById('guide-change-email-modal'); // Change email modal
  const guideChangeContactModal = document.getElementById('guide-change-contact-modal'); // Change contact modal
  const guidePasswordCancelBtn = document.getElementById('guide-password-cancel-btn');
  const guidePasswordConfirmBtn = document.getElementById('guide-password-confirm-btn');
  const verifyPasswordInput = document.getElementById('guide-confirm-password-input');
  const newPasswordInput = document.getElementById('guide-new-password');
  const confirmNewPasswordInput = document.getElementById('guide-confirm-new-password');
  const guideCancelPasswordBtn = document.getElementById('guide-cancel-password-btn');
  const guideSavePasswordBtn = document.getElementById('guide-save-password-btn');
  const emailInput = document.getElementById('email');
  const guideSaveEmailBtn = document.getElementById('guide-save-email-btn');
  const guideCancelEmailBtn = document.getElementById('guide-cancel-email-btn');
  const contactNumberInput = document.getElementById('contact-number');
  const guideNewContactInput = document.getElementById('guide-new-contact-input');
  const guideSaveContactBtn = document.getElementById('guide-save-contact-btn');
  const guideCancelContactBtn = document.getElementById('guide-cancel-contact-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  
  let activeAction = ''; // Track the current action: 'email', 'contact', or 'password'

  // Function to show the password confirmation modal with overlay
  function openGuidePasswordModal(action) {
      activeAction = action;
      guidePasswordModal.classList.add('show');
      modalOverlay.classList.add('show');
  }

  // Function to close the password modal
  function closeGuidePasswordModal() {
      guidePasswordModal.classList.remove('show');
      modalOverlay.classList.remove('show');
      verifyPasswordInput.value = ''; // Clear password input field
  }

  // Function to show the specific modal based on action
  function openActionModal() {
      if (activeAction === 'email') {
          guideChangeEmailModal.classList.add('show');
      } else if (activeAction === 'contact') {
          guideChangeContactModal.classList.add('show');
      } else if (activeAction === 'password') {
          guideChangePasswordModal.classList.add('show');
      }
      modalOverlay.classList.add('show');
  }

  // Function to close all action modals
  function closeActionModals() {
      guideChangeEmailModal.classList.remove('show');
      guideChangeContactModal.classList.remove('show');
      guideChangePasswordModal.classList.remove('show');
      modalOverlay.classList.remove('show');
      newPasswordInput.value = '';
      confirmNewPasswordInput.value = '';
  }

  // Open the password verification modal on edit email, contact, or password button click
  guideEditEmailBtn.addEventListener('click', () => openGuidePasswordModal('email'));
  guideEditContactBtn.addEventListener('click', () => openGuidePasswordModal('contact'));
  guideEditPasswordBtn.addEventListener('click', () => openGuidePasswordModal('password'));

  // Close the password verification modal on cancel button click
  guidePasswordCancelBtn.addEventListener('click', closeGuidePasswordModal);

  // Verify password and open the appropriate modal if successful
  guidePasswordConfirmBtn.addEventListener('click', async () => {
    const password = verifyPasswordInput.value.trim();

    try {
      // Send request to verify the password
      const response = await fetch('/tourguide/verify_password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ password: password })
      });

      const result = await response.json();

      console.log("Password verification result:", result); // Debugging output

      if (result.success) {
          // Password is verified, close password modal and open the respective modal
          closeGuidePasswordModal();
          alert("Password verified successfully!"); // Show verification success message
          openActionModal(); // Only open the action modal if verification is successful
      } else {
          alert(result.message || 'Password verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      alert('There was an error verifying your password. Please try again.');
    }
  });

  // Close the email and contact modals on cancel buttons
  guideCancelEmailBtn.addEventListener('click', closeActionModals);
  guideCancelContactBtn.addEventListener('click', closeActionModals);
  guideCancelPasswordBtn.addEventListener('click', closeActionModals);

  // Save the updated email to the backend
  guideSaveEmailBtn.addEventListener('click', async () => {
    const newEmail = document.getElementById('guide-new-email-input').value.trim();

    if (!newEmail || !newEmail.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    try {
      const response = await fetch('/tourguide/update_email', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: newEmail })
      });

      const result = await response.json();

      if (result.success) {
          emailInput.value = newEmail; // Update displayed email
          closeActionModals();
          alert('Email updated successfully!');
      } else {
          alert(result.message || 'Failed to update email. Please try again.');
      }
    } catch (error) {
      console.error('Error updating email:', error);
      alert('There was an error processing your request. Please try again.');
    }
  });

  // Save the updated contact number to the backend
  guideSaveContactBtn.addEventListener('click', async () => {
    const newContactNumber = guideNewContactInput.value.trim();

    if (!newContactNumber || isNaN(newContactNumber) || newContactNumber.length < 11) {
        alert('Please enter a valid contact number.');
        return;
    }

    try {
      const response = await fetch('/touroperator/update_contact_number', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ contact_number: newContactNumber })
      });

      const result = await response.json();

      if (result.success) {
          contactNumberInput.value = newContactNumber; // Update displayed contact number
          closeActionModals();
          alert('Contact number updated successfully!');
      } else {
          alert(result.message || 'Failed to update contact number. Please try again.');
      }
    } catch (error) {
      console.error('Error updating contact number:', error);
      alert('There was an error processing your request. Please try again.');
    }
  });

  // Save the new password to the backend
  guideSavePasswordBtn.addEventListener('click', async () => {
    const newPassword = newPasswordInput.value.trim();
    const confirmNewPassword = confirmNewPasswordInput.value.trim();

    // Validate the new password inputs
    if (!newPassword || !confirmNewPassword) {
      alert('Please fill out all password fields.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      alert('New password should be at least 8 characters long.');
      return;
    }

    try {
      // Send a request to update the password
      const response = await fetch('/tourguide/update_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword })
      });

      const result = await response.json();

      if (result.success) {
        alert('Password updated successfully!');
        closeActionModals(); // Close the modal on success
      } else {
        alert(result.message || 'Failed to update password. Please try again.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('There was an error processing your request. Please try again.');
    }
  });
});









// Confirm password and open the appropriate modal for editing
document.addEventListener('DOMContentLoaded', function () {
  // Select the elements
  const guidePasswordConfirmBtn = document.getElementById('guide-password-confirm-btn');
  const guideConfirmPasswordInput = document.getElementById('guide-confirm-password-input');

  if (!guidePasswordConfirmBtn || !guideConfirmPasswordInput) {
      console.error('One or more elements not found.');
      return;
  }

  let guideActiveAction = ''; // Define this variable somewhere in scope to track action

  // Add event listener
  guidePasswordConfirmBtn.addEventListener('click', () => {
      // if (guideConfirmPasswordInput.value === 'password123') { // Replace 'password123' with actual logic to validate the password
      //     closeGuideModal();
      //     if (guideActiveAction === 'email') {
      //         openGuideChangeEmailModal();
      //     } else if (guideActiveAction === 'password') {
      //         openGuideChangePasswordModal();
      //     } else if (guideActiveAction === 'contact') {
      //         openGuideChangeContactModal();
      //     }
      // } else {
      //     alert('Incorrect password. Please try again.');
      // }
  });

  function closeGuideModal() {
      // Your function to close the password confirmation modal
      console.log('Closing password modal');
      // Actual code to close the modal goes here
  }

  function openGuideChangeEmailModal() {
      // Function to open the email change modal
      console.log('Opening email change modal');
      // Code to open the email modal goes here
  }

  function openGuideChangePasswordModal() {
      // Function to open the password change modal
      console.log('Opening password change modal');
      // Code to open the password modal goes here
  }

  function openGuideChangeContactModal() {
      // Function to open the contact change modal
      console.log('Opening contact change modal');
      // Code to open the contact modal goes here
  }
});






















// Save new email
document.addEventListener('DOMContentLoaded', function () {
  // Select the guideSaveEmailBtn element
  const guideSaveEmailBtn = document.getElementById('guide-save-email-btn');
  const guideNewEmailInput = document.getElementById('guide-new-email-input');
  
  if (!guideSaveEmailBtn || !guideNewEmailInput) {
      console.error('Element not found in the DOM.');
      return;
  }

  // Add event listener for the save button
  guideSaveEmailBtn.addEventListener('click', () => {
      const newEmail = guideNewEmailInput.value;
      alert(`New email saved: ${newEmail}`);
      closeGuideModal(); // Ensure this function is defined
  });
});

// Example function to close the modal (make sure this function is defined in your script)
function closeGuideModal() {
  const modal = document.getElementById('guide-change-email-modal');
  if (modal) {
      modal.classList.add('hidden');
  }
}













// Save new password
document.addEventListener('DOMContentLoaded', function () {
  // Select the elements
  const guideSavePasswordBtn = document.getElementById('guide-save-password-btn');
  const newPasswordInput = document.getElementById('guide-new-password');
  const confirmNewPasswordInput = document.getElementById('guide-confirm-new-password');

  // Check if elements exist before adding event listeners
  if (!guideSavePasswordBtn || !newPasswordInput || !confirmNewPasswordInput) {
      console.error('One or more elements not found in the DOM.');
      return;
  }

  // Add event listener for the save password button
  guideSavePasswordBtn.addEventListener('click', () => {
      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmNewPasswordInput.value;

      if (newPassword === confirmPassword) {
          alert('Password changed successfully!');
          closeGuideModal(); // Ensure this function is defined
      } else {
          alert('Passwords do not match.');
      }
  });
});

// Example function to close the modal (make sure this function is defined in your script)
function closeGuideModal() {
  const modal = document.getElementById('guide-change-password-modal');
  if (modal) {
      modal.classList.add('hidden');
  }
}














// Save new contact number



// Cancel and close modal actions
document.addEventListener('DOMContentLoaded', function () {
  // Get elements
  const guidePasswordCancelBtn = document.getElementById('guide-password-cancel-btn');
  const guideCancelEmailBtn = document.getElementById('guide-cancel-email-btn');
  const guideCancelPasswordBtn = document.getElementById('guide-cancel-password-btn');
  const guideCancelContactBtn = document.getElementById('guide-cancel-contact-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  
  // Check if elements exist before adding event listeners
  if (!guidePasswordCancelBtn || !guideCancelEmailBtn || !guideCancelPasswordBtn || !modalOverlay) {
      console.error('One or more elements are missing from the DOM');
      return;
  }

  // Add event listeners to close modals
  guidePasswordCancelBtn.addEventListener('click', closeGuideModal);
  guideCancelEmailBtn.addEventListener('click', closeGuideModal);
  guideCancelPasswordBtn.addEventListener('click', closeGuideModal);
  guideCancelContactBtn?.addEventListener('click', closeGuideModal); // Optional chaining for guideCancelContactBtn

  // Functions to open modals
  function openGuidePasswordModal() {
      document.getElementById('guide-password-confirm-modal').classList.add('show');
      modalOverlay.classList.add('show');
  }

  function openGuideChangeEmailModal() {
      document.getElementById('guide-change-email-modal').classList.add('show');
      modalOverlay.classList.add('show');
  }

  function openGuideChangePasswordModal() {
      document.getElementById('guide-change-password-modal').classList.add('show');
      modalOverlay.classList.add('show');
  }

  function openGuideChangeContactModal() {
      document.getElementById('guide-change-contact-modal').classList.add('show');
      modalOverlay.classList.add('show');
  }

  // Function to close all modals and overlay
  function closeGuideModal() {
      document.querySelectorAll('.modal.show').forEach(modal => modal.classList.remove('show'));
      modalOverlay.classList.remove('show');
      document.getElementById('guide-confirm-password-input').value = ''; // Reset password input
  }
});








//CURRENT PASSWORD 


// Function to open the booking details modal and populate it with data
// Example of placing openBookingDetails in the tour guide dashboard JavaScript

// Function to open the booking details modal and populate it with data
function openBookingDetails(bookingId) {
  console.log("Fetching booking details for ID:", bookingId);  // Debugging log
  fetch(`/tourguide/get_booking_details/${bookingId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(booking => {
          console.log("Received booking data:", booking);  // Debugging log
          document.getElementById("modal-traveler-name").textContent = booking.travelerName;
          document.getElementById("modal-tour-guide-name").textContent = booking.tourGuideName;
          document.getElementById("modal-tour-guide-number").textContent = booking.tourGuideNumber;
          document.getElementById("modal-tour-package").textContent = booking.tourType;
          document.getElementById("modal-tour-date").textContent = `${booking.date_start} - ${booking.date_end}`;
          document.getElementById("modal-traveler-quantity").textContent = booking.traveler_quantity;

          document.getElementById("booking-modal").classList.remove("hidden");
      })
      .catch(error => console.error("Error loading booking details:", error));
}


// Function to close the booking details modal
function closeBookingDetailsModal() {
  document.getElementById("booking-modal").classList.add("hidden");
}





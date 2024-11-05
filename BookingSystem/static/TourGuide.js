// Get elements
const sidebarToggle = document.getElementById('sidebar-toggle');
const sideNav = document.getElementById('side-nav');
const navLinks = document.querySelectorAll('.nav-link');
const tabPanes = document.querySelectorAll('.tab-pane');

// Logout modal elements
const logoutModal = document.getElementById('logout-modal');
const logoutOverlay = document.getElementById('logout-overlay');
const confirmLogoutBtn = document.getElementById('confirm-logout-btn');
const cancelLogoutBtn = document.getElementById('cancel-logout-btn');
const mainContent = document.querySelector('.tab-content'); // The main content area

// Toggle Sidebar on Mobile
sidebarToggle?.addEventListener('click', () => {
  sideNav.classList.toggle('active');
});

// Handle tab switching and show logout modal
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const targetTab = link.dataset.tab;

    if (targetTab === 'logout') {
      showLogoutModal(); // Show the logout modal
    } else {
      switchActiveTab(targetTab); // Switch to the clicked tab
    }

    // Close the sidebar if on mobile
    if (window.innerWidth <= 768) {
      sideNav.classList.remove('active');
    }
  });
});

// Switch active tabs
function switchActiveTab(targetTab) {
  navLinks.forEach((link) => link.classList.remove('active'));
  document.querySelector(`[data-tab="${targetTab}"]`).classList.add('active');

  tabPanes.forEach((pane) => {
    pane.style.display = pane.id === targetTab ? 'block' : 'none';
  });
}


// Show Logout Modal and Overlay
function showLogoutModal() {
  logoutModal.classList.add('show');
  logoutOverlay.classList.add('show');
  mainContent.classList.add('blurred'); // Apply blur effect to main content
}

// Hide Logout Modal and Remove Overlay
function hideLogoutModal() {
  logoutModal.classList.remove('show');
  logoutOverlay.classList.remove('show');
  mainContent.classList.remove('blurred'); // Remove blur effect
}

// Confirm Logout and Redirect
confirmLogoutBtn.addEventListener('click', () => {
  window.location.href = 'Traveler - TGList.html'; // Redirect to homepage
});

// Cancel Logout and Close Modal
cancelLogoutBtn.addEventListener('click', hideLogoutModal);

// Handle Logout Link Click
document.querySelector('[data-tab="logout"]').addEventListener('click', (e) => {
  e.preventDefault();
  showLogoutModal();
});



// Ensure Profile Tab Displays on Load
window.addEventListener('DOMContentLoaded', () => {
  tabPanes.forEach((pane) => {
    pane.style.display = pane.id === 'profile' ? 'block' : 'none';
  });
});


// Editable About Me Section
const editAboutBtn = document.getElementById('edit-about-btn');
const saveAboutBtn = document.getElementById('save-about-btn');
const aboutText = document.getElementById('about-text');

editAboutBtn.addEventListener('click', () => toggleEdit(aboutText, editAboutBtn, saveAboutBtn));
saveAboutBtn.addEventListener('click', () => toggleEdit(aboutText, editAboutBtn, saveAboutBtn, false));

// Editable Fields Toggle Function
function toggleEdit(input, editBtn, saveBtn, isEditing = true) {
  input.disabled = !isEditing;
  editBtn.classList.toggle('hidden', isEditing);
  saveBtn.classList.toggle('hidden', !isEditing);
  if (isEditing) input.focus();
}

// Editable Characteristics and Skills
function setupEditableList(editBtn, saveBtn, addBtn, list) {
  editBtn.addEventListener('click', () => toggleListEdit(list, true, addBtn, editBtn, saveBtn));
  saveBtn.addEventListener('click', () => toggleListEdit(list, false, addBtn, editBtn, saveBtn));

  addBtn.addEventListener('click', () => {
    const newItem = createEditableListItem();
    list.appendChild(newItem);
    newItem.querySelector('.editable').focus();
  });
}

// Helper: Create an Editable List Item
function createEditableListItem() {
  const li = document.createElement('li');
  li.innerHTML = `
    <span class="checkmark">&#10003;</span>
    <span class="editable" contenteditable="true">New Item</span>
    <button class="remove-btn">&#8722;</button>
  `;
  li.querySelector('.remove-btn').addEventListener('click', () => li.remove());
  return li;
}

// Toggle List Edit Mode
function toggleListEdit(list, isEditing, addBtn, editBtn, saveBtn) {
  Array.from(list.children).forEach((li) => {
    li.querySelector('.editable').contentEditable = isEditing;
    li.querySelector('.remove-btn').classList.toggle('hidden', !isEditing);
  });
  addBtn.classList.toggle('hidden', !isEditing);
  editBtn.classList.toggle('hidden', isEditing);
  saveBtn.classList.toggle('hidden', !isEditing);
}

// Initialize Editable Lists
setupEditableList(
  document.getElementById('edit-char-btn'),
  document.getElementById('save-char-btn'),
  document.getElementById('add-char-btn'),
  document.getElementById('characteristics-list')
);
setupEditableList(
  document.getElementById('edit-skills-btn'),
  document.getElementById('save-skills-btn'),
  document.getElementById('add-skills-btn'),
  document.getElementById('skills-list')
);


// Price Editing Logic
const editPriceBtn = document.getElementById('edit-price-btn');
const savePriceBtn = document.getElementById('save-price-btn');
const priceDisplay = document.getElementById('tour-price');
const priceInput = document.getElementById('price-input');

// Enable Price Editing
editPriceBtn.addEventListener('click', () => {
    priceDisplay.classList.add('hidden');
    priceInput.classList.remove('hidden');
    priceInput.value = parseFloat(priceDisplay.textContent.replace('₱', '')); // Populate input
    editPriceBtn.classList.add('hidden');
    savePriceBtn.classList.remove('hidden');
});

// Save Edited Price
savePriceBtn.addEventListener('click', () => {
    priceDisplay.textContent = `₱${priceInput.value}`;
    priceDisplay.classList.remove('hidden');
    priceInput.classList.add('hidden');
    editPriceBtn.classList.remove('hidden');
    savePriceBtn.classList.add('hidden');
});

// Elements for Profile Activation Modal
const profileToggle = document.getElementById('profile-toggle');
const toggleStatus = document.getElementById('toggle-status');
const activationModal = document.getElementById('activation-confirmation-modal');
const activationOverlay = document.getElementById('activation-overlay');
const confirmCompleteBtn = document.getElementById('confirm-complete-btn');
const cancelActivationBtn = document.getElementById('cancel-activation-btn');

// Open modal when attempting to activate profile
profileToggle.addEventListener('click', () => {
  if (!profileToggle.classList.contains('active')) {
    openActivationModal();
  } else {
    profileToggle.classList.remove('active');
    toggleStatus.textContent = 'Inactive';
  }
});

// Confirm profile activation and allow toggle
confirmCompleteBtn.addEventListener('click', () => {
  closeActivationModal();
  profileToggle.classList.add('active');
  toggleStatus.textContent = 'Active';
});

// Cancel button to close modal
cancelActivationBtn.addEventListener('click', closeActivationModal);

// Open and close functions for the activation modal
function openActivationModal() {
  activationModal.classList.add('show');
  activationOverlay.classList.add('show');
}

function closeActivationModal() {
  activationModal.classList.remove('show');
  activationOverlay.classList.remove('show');
}




// Profile Picture Cropper Modal Logic
const changePicBtn = document.getElementById('change-pic-btn');
const uploadPicInput = document.getElementById('upload-pic');
const profilePic = document.getElementById('profile-pic');
const cropperModal = document.getElementById('cropper-modal');
const cropperContainer = document.getElementById('cropper-container');
const cropBtn = document.getElementById('crop-btn');
const closeCropperBtn = document.getElementById('close-cropper-modal');
const savePicBtn = document.getElementById('save-pic-btn');
let cropper;

// Open file input
changePicBtn.addEventListener('click', () => uploadPicInput.click());

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

// Crop and update profile picture
cropBtn.addEventListener('click', () => {
  const canvas = cropper.getCroppedCanvas({ width: 200, height: 200 });
  profilePic.src = canvas.toDataURL();
  cropperModal.classList.remove('show');
  savePicBtn.classList.remove('hidden');
});

// Close cropper modal
closeCropperBtn.addEventListener('click', () => {
  cropperModal.classList.remove('show');
});

// Save profile picture
savePicBtn.addEventListener('click', () => {
  alert('Profile picture saved!');
  savePicBtn.classList.add('hidden');
});





// Variables for Notification Interaction
const notificationPanel = document.querySelector('.notification-list');
const viewNotificationDetails = (notificationText) => {
  alert(`Notification Details: ${notificationText}`);
};



// Get elements
const toggleTabsBtn = document.getElementById('toggle-tabs-btn');
const bookingsTabs = document.getElementById('bookings-tabs');
const bookingTabBtns = document.querySelectorAll('.booking-tab-btn');
const bookingCategories = document.querySelectorAll('.booking-category');

// Check screen size and adjust visibility
function adjustTabsForScreenSize() {
  if (window.innerWidth > 768) {
    // Show tabs and hide the toggle button on larger screens
    bookingsTabs.classList.remove('hidden');
    toggleTabsBtn.style.display = 'none';
  } else {
    // Hide tabs and show the toggle button on mobile screens
    bookingsTabs.classList.add('hidden');
    toggleTabsBtn.style.display = 'block';
  }
}

// Toggle tabs visibility on mobile screens
toggleTabsBtn.addEventListener('click', () => {
  bookingsTabs.classList.toggle('hidden');
  toggleTabsBtn.textContent = bookingsTabs.classList.contains('hidden') ? 'Show Tabs' : 'Hide Tabs';
});

// Handle tab selection and auto-collapse on mobile
bookingTabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Set active tab
    bookingTabBtns.forEach((btn) => btn.classList.remove('active'));
    btn.classList.add('active');

    const status = btn.dataset.status;

    // Show/Hide booking categories based on tab selection
    bookingCategories.forEach((category) => {
      const categoryStatus = category.dataset.status;
      category.style.display = status === 'all' || categoryStatus === status ? 'block' : 'none';
    });

    // Collapse the tabs if on mobile
    if (window.innerWidth <= 768) {
      bookingsTabs.classList.add('hidden');
      toggleTabsBtn.textContent = 'Show Tabs'; // Reset button text
    }
  });
});

// Initial check and add event listener to adjust on window resize
adjustTabsForScreenSize();
window.addEventListener('resize', adjustTabsForScreenSize);




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

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('availability-calendar');
  const editAvailabilityBtn = document.getElementById('edit-availability');
  const markAvailableBtn = document.getElementById('mark-available');
  const markUnavailableBtn = document.getElementById('mark-unavailable');
  const resetCalendarBtn = document.getElementById('reset-calendar');
  const saveAvailabilityBtn = document.getElementById('save-availability');

  let isEditing = false;
  let selectedDate = null;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    selectOverlap: false,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: [],

    // Allow date selection only if it's not already marked
    select: function (info) {
      if (isEditing) {
        const existingEvent = findEventByDate(info.startStr);
        if (existingEvent) {
          alert('This date already has a status. Please remove it first.');
          calendar.unselect(); // Unselect if already marked
        } else {
          selectedDate = info.startStr;
        }
      } else {
        alert('You need to enable edit mode to mark availability.');
        calendar.unselect();
      }
    },

    eventClick: function (info) {
      if (isEditing && info.event.extendedProps.status !== 'booked') {
        info.event.remove(); // Allow removal only if not booked
      } else if (info.event.extendedProps.status === 'booked') {
        alert('This date is booked and cannot be changed.');
      }
    },
  });

  calendar.render();

  // Helper to find event by date
  function findEventByDate(date) {
    return calendar.getEvents().find((event) => event.startStr === date);
  }

  // Toggle Edit Mode
  editAvailabilityBtn.addEventListener('click', () => {
    isEditing = !isEditing;
    toggleEditButtons(isEditing);
  });

  function toggleEditButtons(isEditing) {
    markAvailableBtn.classList.toggle('hidden', !isEditing);
    markUnavailableBtn.classList.toggle('hidden', !isEditing);
    resetCalendarBtn.classList.toggle('hidden', !isEditing);
    saveAvailabilityBtn.classList.toggle('hidden', !isEditing);
    editAvailabilityBtn.textContent = isEditing ? 'Exit Edit Mode' : 'Edit Availability';
  }

  // Mark Available
  markAvailableBtn.addEventListener('click', () => {
    if (selectedDate) {
      addEvent('Available', selectedDate, '#4ecdc4', 'available');
      selectedDate = null; // Clear the selection
    }
  });

  // Mark Unavailable
  markUnavailableBtn.addEventListener('click', () => {
    if (selectedDate) {
      addEvent('Unavailable', selectedDate, '#e63946', 'unavailable');
      selectedDate = null; // Clear the selection
    }
  });

  // Add an event to the calendar
  function addEvent(title, date, color, status) {
    if (!findEventByDate(date)) {
      calendar.addEvent({
        title: title,
        start: date,
        allDay: true,
        backgroundColor: color,
        textColor: 'white',
        extendedProps: { status: status },
      });
    } else {
      alert('This date already has a status.');
    }
  }

  // Reset Calendar (Excluding Booked Dates)
  resetCalendarBtn.addEventListener('click', () => {
    calendar.getEvents().forEach((event) => {
      if (event.extendedProps.status !== 'booked') event.remove();
    });
  });

  // Save Availability
  saveAvailabilityBtn.addEventListener('click', () => {
    const savedAvailability = calendar.getEvents().map((event) => ({
      title: event.title,
      start: event.startStr,
      status: event.extendedProps.status,
    }));
    console.log('Saved Availability:', savedAvailability);
  });

  // Example Booked Event (Non-Removable)
  calendar.addEvent({
    title: 'Booked',
    start: '2024-10-28',
    allDay: true,
    backgroundColor: '#1a535c',
    textColor: 'white',
    extendedProps: { status: 'booked' },
  });
});





// Elements
const guideEditEmailBtn = document.getElementById('guide-edit-email-btn');
const guideEditPasswordBtn = document.getElementById('guide-edit-password-btn');
const guidePasswordConfirmModal = document.getElementById('guide-password-confirm-modal');
const guideConfirmPasswordInput = document.getElementById('guide-confirm-password-input');
const guidePasswordConfirmBtn = document.getElementById('guide-password-confirm-btn');
const guidePasswordCancelBtn = document.getElementById('guide-password-cancel-btn');
const guideChangeEmailModal = document.getElementById('guide-change-email-modal');
const guideChangePasswordModal = document.getElementById('guide-change-password-modal');
const guideSaveEmailBtn = document.getElementById('guide-save-email-btn');
const guideCancelEmailBtn = document.getElementById('guide-cancel-email-btn');
const guideSavePasswordBtn = document.getElementById('guide-save-password-btn');
const guideCancelPasswordBtn = document.getElementById('guide-cancel-password-btn');
const modalOverlay = document.getElementById('modal-overlay');

let guideActiveAction = ''; // To track action

// Open password confirmation modal
guideEditEmailBtn.addEventListener('click', () => {
    guideActiveAction = 'email';
    openGuidePasswordModal();
});

guideEditPasswordBtn.addEventListener('click', () => {
    guideActiveAction = 'password';
    openGuidePasswordModal();
});








// Elements for Contact Number

// Elements
document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const guideEditContactBtn = document.getElementById('guide-edit-contact-btn');
  const guidePasswordModal = document.getElementById('guide-password-confirm-modal');
  const guidePasswordCancelBtn = document.getElementById('guide-password-cancel-btn');
  const guidePasswordConfirmBtn = document.getElementById('guide-password-confirm-btn');
  const passwordInput = document.getElementById('guide-confirm-password-input');
  const contactNumberInput = document.getElementById('contact-number');

  // Check if elements exist before adding event listeners
  if (!guideEditContactBtn || !guidePasswordModal || !guidePasswordCancelBtn || !guidePasswordConfirmBtn || !passwordInput || !contactNumberInput) {
    console.error('One or more elements are missing from the DOM');
    return;
  }

  // Function to show password modal
  function openGuidePasswordModal() {
      guidePasswordModal.classList.remove('hidden');
      guidePasswordModal.style.display = 'flex';
  }

  // Function to hide password modal
  function closeGuidePasswordModal() {
      guidePasswordModal.classList.add('hidden');
      guidePasswordModal.style.display = 'none';
      passwordInput.value = '';  // Clear password input field
  }

  // Event listener to open modal on edit button click
  guideEditContactBtn.addEventListener('click', openGuidePasswordModal);

  // Event listener to close modal on cancel button click
  guidePasswordCancelBtn.addEventListener('click', closeGuidePasswordModal);

  // Event listener for the confirm button in the password modal
  guidePasswordConfirmBtn.addEventListener('click', async () => {
    const password = passwordInput.value.trim();

    try {
      // Step 1: Send request to verify the password only (without changing the contact number yet)
      const response = await fetch('/tourguide/verify_password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ password: password })
      });

      const result = await response.json();

      console.log('Password verification response:', result);

      // Step 2: Check if the password verification was successful
      if (result.success) {
          alert("Password verified! You can now edit your contact number.");
          closeGuidePasswordModal();
          
          // Enable the contact number input for editing
          contactNumberInput.readOnly = false;
          console.log("Is contact number input readonly? ", contactNumberInput.readOnly); 

          console.log("Contact number input is now enabled for editing.");  // Debugging log

          // Optional: Add an event listener to save the updated contact number
          contactNumberInput.addEventListener('blur', async () => {
            const newContactNumber = contactNumberInput.value;
            try {
              const updateResponse = await fetch('/tourguide/update_contact', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ contact_number: newContactNumber })
              });

              const updateResult = await updateResponse.json();
              if (updateResult.success) {
                  alert("Contact number updated successfully!");
                  contactNumberInput.disabled = true; // Disable editing again
              } else {
                  alert("Failed to update contact number: " + updateResult.message);
              }
            } catch (updateError) {
              console.error('Error updating contact number:', updateError);
              alert('There was an error processing your request. Please try again.');
            }
          }, { once: true }); // Add this listener only once

      } else {
          // Only show this error if password verification fails
          alert(result.message);  // Show error message if password is incorrect
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      alert('There was an error verifying your password. Please try again.');
    }
  });
});






















// Confirm password and open the appropriate modal for editing
guidePasswordConfirmBtn.addEventListener('click', () => {
    if (guideConfirmPasswordInput.value === 'password123') {
        closeGuideModal();
        if (guideActiveAction === 'email') {
            openGuideChangeEmailModal();
        } else if (guideActiveAction === 'password') {
            openGuideChangePasswordModal();
        } else if (guideActiveAction === 'contact') {
            openGuideChangeContactModal();
        }
    } else {
        alert('Incorrect password. Please try again.');
    }
});

// Save new email
guideSaveEmailBtn.addEventListener('click', () => {
    alert(`New email saved: ${document.getElementById('guide-new-email-input').value}`);
    closeGuideModal();
});

// Save new password
guideSavePasswordBtn.addEventListener('click', () => {
    if (document.getElementById('guide-new-password').value === document.getElementById('guide-confirm-new-password').value) {
        alert('Password changed successfully!');
        closeGuideModal();
    } else {
        alert('Passwords do not match.');
    }
});

// Save new contact number


// Cancel and close modal actions
guidePasswordCancelBtn.addEventListener('click', closeGuideModal);
guideCancelEmailBtn.addEventListener('click', closeGuideModal);
guideCancelPasswordBtn.addEventListener('click', closeGuideModal);
//guideCancelContactBtn.addEventListener('click', closeGuideModal);

// Open specific modals
function openGuidePasswordModal() {
    guidePasswordConfirmModal.classList.add('show');
    modalOverlay.classList.add('show');
}

function openGuideChangeEmailModal() {
    guideChangeEmailModal.classList.add('show');
    modalOverlay.classList.add('show');
}

function openGuideChangePasswordModal() {
    guideChangePasswordModal.classList.add('show');
    modalOverlay.classList.add('show');
}

function openGuideChangeContactModal() {
    guideChangeContactModal.classList.add('show');
    modalOverlay.classList.add('show');
}

// Close all modals and overlay
function closeGuideModal() {
    document.querySelectorAll('.modal.show').forEach(modal => modal.classList.remove('show'));
    modalOverlay.classList.remove('show');
    guideConfirmPasswordInput.value = ''; // Reset password input
}




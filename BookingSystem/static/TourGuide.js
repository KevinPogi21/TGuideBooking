// Get elements
const sidebarToggle = document.getElementById('sidebar-toggle');
const sideNav = document.getElementById('side-nav');
const navLinks = document.querySelectorAll('.nav-link');
const tabPanes = document.querySelectorAll('.tab-pane');

// Toggle Sidebar on Mobile
sidebarToggle.addEventListener('click', () => {
  sideNav.classList.toggle('active');
});

// Close Sidebar on Mobile after Clicking a Link
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Switch Active Tab
    navLinks.forEach((link) => link.classList.remove('active'));
    link.classList.add('active');

    const targetTab = link.dataset.tab;
    tabPanes.forEach((pane) => {
      pane.style.display = pane.id === targetTab ? 'block' : 'none';
    });

    // Close Sidebar on Mobile after Clicking a Link
    if (window.innerWidth <= 768) {
      sideNav.classList.remove('active');
    }

    if (targetTab === 'logout') {
      const logoutUrl = "{{ url_for('tourguide.logout') }}"; // Ensure this URL is correct
      console.log("Logout URL: ", logoutUrl); // Log the URL to check its value
      setTimeout(() => {
        window.location.href = logoutUrl; // Redirect to the logout URL
      }, 2000);
    }
    
    
    
  });
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

// Function to toggle edit mode
function toggleEdit(textarea, editBtn, saveBtn, isEditing = true) {
    if (isEditing) {
        textarea.disabled = false; // Enable textarea for editing
        textarea.focus(); // Focus on the textarea for immediate editing
    } else {
        textarea.disabled = true; // Disable textarea after saving
        // Optional: Make a request to update the about text in the backend
        const updatedAboutText = textarea.value.trim();
        if (updatedAboutText) {
            fetch('/update-about', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ about: updatedAboutText }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => console.log('About text updated:', data))
            .catch(error => console.error('Error updating about text:', error));
        }
    }

    // Toggle visibility of buttons
    editBtn.classList.toggle('hidden', !isEditing);
    saveBtn.classList.toggle('hidden', isEditing);
}



// Event listeners for edit and save buttons
editAboutBtn.addEventListener('click', () => toggleEdit(aboutText, editAboutBtn, saveAboutBtn));
saveAboutBtn.addEventListener('click', () => toggleEdit(aboutText, editAboutBtn, saveAboutBtn, false));



// Editable Fields Toggle Function
function toggleEdit(input, editBtn, saveBtn, isEditing = true) {
  input.disabled = !isEditing;
  editBtn.classList.toggle('hidden', isEditing);
  saveBtn.classList.toggle('hidden', !isEditing);
  if (isEditing) input.focus();
}

// Function to create a new editable list item
function createEditableListItem() {
  const listItem = document.createElement('li');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'editable';
  input.placeholder = 'New Item';
  listItem.appendChild(document.createElement('span')).innerHTML = '&#10003;'; // Checkmark
  listItem.appendChild(input);
  
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn';
  removeBtn.innerHTML = '&#8722;';
  removeBtn.addEventListener('click', () => listItem.remove()); // Remove item on click
  listItem.appendChild(removeBtn);
  
  return listItem;
}

// Editable Characteristics and Skills Setup
function setupEditableList(editBtn, saveBtn, addBtn, list) {
  editBtn.addEventListener('click', () => {
      const inputs = list.querySelectorAll('.editable');
      inputs.forEach(input => toggleEdit(input, editBtn, saveBtn, true));
      addBtn.classList.remove('hidden'); // Show add button
  });

  saveBtn.addEventListener('click', () => {
      const inputs = list.querySelectorAll('.editable');
      inputs.forEach(input => toggleEdit(input, editBtn, saveBtn, false));
      addBtn.classList.add('hidden'); // Hide add button
  });

  addBtn.addEventListener('click', () => {
      const newItem = createEditableListItem();
      list.appendChild(newItem);
      newItem.querySelector('.editable').focus();
  });
}

// Initialize the editable lists
setupEditableList(document.getElementById('edit-char-btn'), document.getElementById('save-char-btn'), document.getElementById('add-char-btn'), document.getElementById('characteristics-list'));
setupEditableList(document.getElementById('edit-skills-btn'), document.getElementById('save-skills-btn'), document.getElementById('add-skills-btn'), document.getElementById('skills-list'));


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




// Edit and Save Name
const editNameBtn = document.getElementById('edit-name-btn');
const saveNameBtn = document.getElementById('save-name-btn');
const fullName = document.getElementById('full-name');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');

// Function to toggle the edit mode
function toggleEditName(isEditing) {
  firstNameInput.classList.toggle('hidden', !isEditing);
  lastNameInput.classList.toggle('hidden', !isEditing);
  fullName.classList.toggle('hidden', isEditing);
  editNameBtn.classList.toggle('hidden', isEditing);
  saveNameBtn.classList.toggle('hidden', !isEditing);

  if (isEditing) {
    firstNameInput.focus(); // Focus on the first name input when editing
  }
}

// Event listener for the Edit button
editNameBtn.addEventListener('click', () => {
  const [first, last] = fullName.textContent.trim().split(' '); // Trim and split name into first and last
  firstNameInput.value = first || ''; // Ensure input is not null
  lastNameInput.value = last || '';

  toggleEditName(true); // Enable editing mode
});

// Event listener for the Save button
saveNameBtn.addEventListener('click', () => {
  const newFirstName = firstNameInput.value.trim();
  const newLastName = lastNameInput.value.trim();

  // Validate the input
  if (newFirstName === '' || newLastName === '') {
    alert('Both first name and last name must be filled out.'); // Alert for empty input
    return;
  }

  const newName = `${newFirstName} ${newLastName}`; // Save new name
  fullName.textContent = newName; // Update the displayed name

  toggleEditName(false); // Disable editing mode

  // Optional: Make a request to update the name in the backend
  fetch('/update-name', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName: newFirstName, lastName: newLastName }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => console.log('Name updated:', data))
    .catch(error => console.error('Error updating name:', error));
});




// Edit and Save Email
// Get necessary elements
const editEmailBtn = document.getElementById('edit-email-btn');
const saveEmailBtn = document.getElementById('save-email-btn');
const emailDisplay = document.getElementById('email-display');
const emailInput = document.getElementById('email-input');

// Event listeners for editing and saving email
editEmailBtn.addEventListener('click', () => {
  emailInput.value = emailDisplay.textContent.trim(); // Populate input with current email
  toggleEditEmail(true); // Enable editing mode
});

saveEmailBtn.addEventListener('click', () => {
  const newEmail = emailInput.value.trim(); // Get the updated email
  emailDisplay.textContent = newEmail; // Update the display span

  toggleEditEmail(false); // Disable editing mode

  // Optional: Send the updated email to the backend
  fetch('/update-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: newEmail }),
  })
    .then(response => response.json())
    .then(data => console.log('Email updated:', data))
    .catch(error => console.error('Error:', error));
});

// Toggle function for editing and saving email
function toggleEditEmail(isEditing) {
  emailInput.classList.toggle('hidden', !isEditing); // Show/hide input
  emailDisplay.classList.toggle('hidden', isEditing); // Hide/display email span
  editEmailBtn.classList.toggle('hidden', isEditing); // Toggle edit button
  saveEmailBtn.classList.toggle('hidden', !isEditing); // Toggle save button

  if (isEditing) emailInput.focus(); // Focus on input when editing
}




// Edit and Save Contact Number
// Get necessary elements
const editContactBtn = document.getElementById('edit-contact-btn');
const saveContactBtn = document.getElementById('save-contact-btn');
const contactNumberDisplay = document.getElementById('contact-number-display');
const contactNumberInput = document.getElementById('contact-number-input');

// Event listeners for editing and saving contact number
editContactBtn.addEventListener('click', () => {
  contactNumberInput.value = contactNumberDisplay.textContent.trim(); // Populate input with current number
  toggleEditContact(true); // Enable editing mode
});

saveContactBtn.addEventListener('click', () => {
  const newContactNumber = contactNumberInput.value.trim(); // Get updated contact number
  contactNumberDisplay.textContent = newContactNumber; // Update the display span

  toggleEditContact(false); // Disable editing mode

  // Optional: Send the updated contact number to the backend
  fetch('/update-contact-number', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contact_number: newContactNumber }),
  })
    .then(response => response.json())
    .then(data => console.log('Contact number updated:', data))
    .catch(error => console.error('Error:', error));
});

// Toggle function for editing and saving contact number
function toggleEditContact(isEditing) {
  contactNumberInput.classList.toggle('hidden', !isEditing); // Show/hide input
  contactNumberDisplay.classList.toggle('hidden', isEditing); // Hide/display contact number span
  editContactBtn.classList.toggle('hidden', isEditing); // Toggle edit button
  saveContactBtn.classList.toggle('hidden', !isEditing); // Toggle save button

  if (isEditing) contactNumberInput.focus(); // Focus on input when editing
}



//??
// Toggle function to handle editing and saving
function toggleEditField(inputField, editBtn, saveBtn) {
  const isEditing = !inputField.disabled;
  inputField.disabled = isEditing; // Toggle the disabled state
  editBtn.classList.toggle('hidden', !isEditing);
  saveBtn.classList.toggle('hidden', isEditing);

  if (!isEditing) inputField.focus(); // Focus the field if starting to edit
}



// Password Management
// Get necessary elements
const editPasswordBtn = document.getElementById('edit-password-btn');
const savePasswordBtn = document.getElementById('save-password-btn');
const currentPasswordInput = document.getElementById('current-password');

const reenterPasswordGroup = document.getElementById('reenter-password-group');
const reenterPasswordInput = document.getElementById('reenter-password');

const newPasswordGroup = document.getElementById('new-password-group');
const newPasswordInput = document.getElementById('new-password');

const confirmPasswordGroup = document.getElementById('confirm-password-group');
const confirmPasswordInput = document.getElementById('confirm-password');

// Event listener to enable editing
editPasswordBtn.addEventListener('click', () => {
  togglePasswordEdit(true); // Enable editing mode
});

// Event listener to save password
savePasswordBtn.addEventListener('click', () => {
  const currentPassword = currentPasswordInput.value.trim();
  const reenteredPassword = reenterPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  // Validation checks
  if (newPassword !== confirmPassword) {
    alert('New passwords do not match!');
    return;
  }
  if (newPassword.length < 6) {
    alert('Password must be at least 6 characters long.');
    return;
  }
  if (!currentPassword || !reenteredPassword || !newPassword) {
    alert('Please fill in all fields.');
    return;
  }

  // Optional: Send new password to backend
  fetch('/bookingsystem/tourguide/update-password', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
    })
})
.then(response => {
    if (!response.ok) {
        return response.text().then(text => {
            console.error('Error response:', text); // Log HTML response
            throw new Error('Failed to update password');
        });
    }
    return response.json();
})
.then(data => {
    alert(data.message);
})
.catch(error => {
    console.error('Error:', error);
    alert(`An error occurred while updating the password: ${error.message}`);
});

});

// Toggle function for password editing mode
function togglePasswordEdit(isEditing) {
  currentPasswordInput.disabled = !isEditing;

  // Show or hide the additional password input fields
  reenterPasswordGroup.classList.toggle('hidden', !isEditing);
  newPasswordGroup.classList.toggle('hidden', !isEditing);
  confirmPasswordGroup.classList.toggle('hidden', !isEditing);

  // Toggle visibility of edit and save buttons
  editPasswordBtn.classList.toggle('hidden', isEditing);
  savePasswordBtn.classList.toggle('hidden', !isEditing);

  // Clear password inputs when switching modes
  if (!isEditing) {
    reenterPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
  }

  if (isEditing) reenterPasswordInput.focus(); // Focus on the re-enter field
}






document.addEventListener('DOMContentLoaded', function() {
  const firstNameInput = document.getElementById('fname'); // First name input
  const lastNameInput = document.getElementById('lname'); // Last name input
  const emailInput = document.getElementById('email'); // Email input
  const contactNumberInput = document.getElementById('contact_number'); // Contact number input
  const profileToggle = document.getElementById('profile-toggle'); // Profile toggle
  const profilePicInput = document.getElementById('profile-pic'); // Profile picture input
  const toggleLabel = document.getElementById('toggle-label'); // Label for toggle

  // Function to check if all required fields are filled
  function checkFieldsFilled() {
      return firstNameInput.value.trim() !== '' &&
             lastNameInput.value.trim() !== '' &&
             emailInput.value.trim() !== '' &&
             contactNumberInput.value.trim() !== '' &&
             profilePicInput.files.length > 0; // Check if a file is selected
  }

  // Function to update toggle state based on fields
  function updateToggleState() {
    const allFieldsFilled = checkFieldsFilled();
    console.log('First Name:', firstNameInput.value);
    console.log('Last Name:', lastNameInput.value);
    console.log('Email:', emailInput.value);
    console.log('Contact Number:', contactNumberInput.value);
    console.log('Profile Picture Selected:', profilePicInput.files.length > 0);

    if (allFieldsFilled) {
        profileToggle.classList.add('active');
        profileToggle.style.cursor = 'pointer';
        profileToggle.disabled = false;
        toggleLabel.textContent = 'Active';
        profileToggle.setAttribute('aria-pressed', 'true');
    } else {
        profileToggle.classList.remove('active');
        profileToggle.style.cursor = 'not-allowed';
        profileToggle.disabled = true;
        toggleLabel.textContent = 'Inactive';
        profileToggle.setAttribute('aria-pressed', 'false');
    }
}


  // Event listeners to check when inputs change
  firstNameInput.addEventListener('input', updateToggleState);
  lastNameInput.addEventListener('input', updateToggleState);
  emailInput.addEventListener('input', updateToggleState);
  contactNumberInput.addEventListener('input', updateToggleState);
  profilePicInput.addEventListener('change', updateToggleState); // Listen for file input changes

  // Event listener for profile toggle click
  profileToggle.addEventListener('click', function(event) {
      if (profileToggle.disabled) {
          event.preventDefault(); // Prevent the default action if disabled
      } else {
          // Add the action you want to take when the toggle is clicked and enabled
          console.log("Toggle activated!");
      }
  });

  // Initial check when the page loads
  updateToggleState();
});



document.addEventListener('DOMContentLoaded', function() {
// Profile Active/Inactive Toggle
  const profileToggle = document.getElementById('profile-toggle');
  const toggleLabel = document.querySelector('.toggle-label');

  profileToggle.addEventListener('click', () => {
    profileToggle.classList.toggle('active');
    toggleLabel.textContent = profileToggle.classList.contains('active') ? 'Active' : 'Inactive';
  });
});



document.addEventListener('DOMContentLoaded', function() {
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

});




document.addEventListener('DOMContentLoaded', function() {
// Variables for Notification Interaction
  const notificationPanel = document.querySelector('.notification-list');
  const viewNotificationDetails = (notificationText) => {
    alert(`Notification Details: ${notificationText}`);
  };

  // Toggle Tabs on Mobile
  const toggleTabsBtn = document.getElementById('toggle-tabs-btn');
  const bookingsTabs = document.getElementById('bookings-tabs');
  const bookingTabBtns = document.querySelectorAll('.booking-tab-btn');
  const bookingCategories = document.querySelectorAll('.booking-category');

  // Toggle tabs visibility on small screens
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
        category.style.display =
          status === 'all' || categoryStatus === status ? 'block' : 'none';
      });

      // Collapse the tabs if on mobile
      if (window.innerWidth <= 768) {
        bookingsTabs.classList.add('hidden');
        toggleTabsBtn.textContent = 'Show Tabs'; // Reset button text
      }
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
});





document.addEventListener('DOMContentLoaded', function() {
  function saveProfileData() {
      const firstName = document.getElementById('first-name').value;
      const lastName = document.getElementById('last-name').value;
      const email = document.getElementById('email-input').value;
      const contactNumber = document.getElementById('contact-number-input').value;

      fetch('/tourguide/save-profile', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              email: email,
              contact_number: contactNumber
          })
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Profile updated successfully!');
          } else {
              alert('Error: ' + data.error);
          }
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }

  // Attach event listeners to buttons
  document.getElementById('save-name-btn').addEventListener('click', saveProfileData);
  document.getElementById('save-email-btn').addEventListener('click', saveProfileData);
  document.getElementById('save-contact-btn').addEventListener('click', saveProfileData);
});


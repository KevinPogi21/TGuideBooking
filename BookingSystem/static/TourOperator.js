

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

    closeBookingModal?.addEventListener('click', () => {
        bookingModal.classList.remove('show');
    });

    // Profile Picture Upload and Cropper Logic
    const changePicBtn = document.getElementById('change-pic-btn');
    const uploadPicInput = document.getElementById('upload-pic');
    const profilePic = document.getElementById('profile-pic');
    const cropperModal = document.getElementById('cropper-modal');
    const cropperContainer = document.getElementById('cropper-container');
    const cropBtn = document.getElementById('crop-btn');
    const closeCropperModal = document.getElementById('close-cropper-modal');
    const savePicBtn = document.getElementById('save-pic-btn');
    let cropper = null;

    changePicBtn?.addEventListener('click', () => uploadPicInput.click());

    uploadPicInput?.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.id = 'crop-image';
                cropperContainer.innerHTML = '';
                cropperContainer.appendChild(img);

                cropperModal.classList.add('show');
                cropper = new Cropper(img, { aspectRatio: 1, viewMode: 1 });
            };
            reader.readAsDataURL(file);
        }
    });

    cropBtn?.addEventListener('click', () => {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas({ width: 200, height: 200 });
            profilePic.src = canvas.toDataURL();
            cropperModal.classList.remove('show');
            savePicBtn.classList.remove('hidden');
        }
    });

    savePicBtn?.addEventListener('click', () => {
        alert('Profile picture saved!');
        savePicBtn.classList.add('hidden');
    });

    closeCropperModal?.addEventListener('click', () => {
        cropperModal.classList.remove('show');
    });

    // Editable Fields Logic
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
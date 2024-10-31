// Smooth scrolling to sections
const tabLinks = document.querySelectorAll('.tab-link');

tabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetSection = document.querySelector(link.getAttribute('href'));
    window.scrollTo({
      top: targetSection.offsetTop - 20, // Adjust for spacing
      behavior: 'smooth'
    });

    // Set active tab
    tabLinks.forEach(link => link.classList.remove('active'));
    link.classList.add('active');
  });
});

const profilePic = document.getElementById('profile-pic');
const editPicBtn = document.getElementById('edit-pic-btn');
const uploadPicInput = document.getElementById('upload-pic');
const confirmModal = document.getElementById('confirm-modal');
const confirmChangeBtn = document.getElementById('confirm-change-btn');
const cancelChangeBtn = document.getElementById('cancel-change-btn');
const cropperModal = document.getElementById('cropper-modal');
const cropperContainer = document.getElementById('cropper-container');
const cropBtn = document.getElementById('crop-btn');
const closeCropperModal = document.getElementById('close-cropper-modal');

let cropper;

// Open confirmation modal on profile picture or edit button click
profilePic.addEventListener('click', () => openConfirmModal());
editPicBtn.addEventListener('click', () => openConfirmModal());

function openConfirmModal() {
  confirmModal.classList.add('show');
}

// Handle confirmation
confirmChangeBtn.addEventListener('click', () => {
  confirmModal.classList.remove('show');
  uploadPicInput.click();
});

// Cancel changing picture
cancelChangeBtn.addEventListener('click', () => {
  confirmModal.classList.remove('show');
});

// Open cropper modal after selecting a picture
uploadPicInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.id = 'crop-image';
      cropperContainer.innerHTML = ''; // Clear previous cropper
      cropperContainer.appendChild(img);
      cropperModal.classList.add('show');

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

// Crop and save the image
cropBtn.addEventListener('click', () => {
  const canvas = cropper.getCroppedCanvas({
    width: 150,
    height: 150,
  });
  profilePic.src = canvas.toDataURL();
  cropperModal.classList.remove('show');
});

// Close cropper modal
closeCropperModal.addEventListener('click', () => {
  cropperModal.classList.remove('show');
});




const categoryButtons = document.querySelectorAll('.tour-category-btn');
const tourCategories = document.querySelectorAll('.tour-category-content');

categoryButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Toggle active button
    categoryButtons.forEach((btn) => btn.classList.remove('active'));
    btn.classList.add('active');

    // Show corresponding category content
    const status = btn.dataset.status;
    tourCategories.forEach((category) => {
      category.style.display = category.dataset.status === status ? 'block' : 'none';
    });
  });
});



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

// Open and Close Review Modal
const reviewButtons = document.querySelectorAll('.review-btn');
const reviewModal = document.getElementById('review-modal');
const closeReviewModal = document.getElementById('close-review-modal');
const stars = document.querySelectorAll('.star');

// Open the modal when a review button is clicked
reviewButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    reviewModal.classList.add('show');
  });
});

// Close the modal
closeReviewModal.addEventListener('click', () => {
  reviewModal.classList.remove('show');
});

// Star Rating Logic
stars.forEach((star, index) => {
  star.addEventListener('click', () => {
    stars.forEach((s, i) => {
      s.classList.toggle('active', i <= index); // Highlight stars up to the clicked one
    });
  });
});


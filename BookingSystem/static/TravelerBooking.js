document.addEventListener('DOMContentLoaded', async () => {
    const tourGuideId = 1; // Replace this with the dynamic tour guide ID as needed
    const profilePicElement = document.querySelector('.profile-pic');
    const guideNameElement = document.querySelector('.h2-guide-name span');
    const aboutMeElement = document.querySelector('.about-me p');
    const characteristicsList = document.querySelector('.characteristics-box .checklist');
    const skillsList = document.querySelector('.skills-box .checklist');
    const priceLabelElement = document.querySelector('.price-label');

    try {
        const response = await fetch(`/tourguide/profile/${tourGuideId}`);
        const data = await response.json();

        if (data.success) {
            const profile = data.profile;

            // Update profile picture
            profilePicElement.src = profile.profile_picture;

            // Update guide name
            guideNameElement.textContent = profile.name;

            // Update About Me section
            aboutMeElement.textContent = profile.bio;

            // Update Characteristics
            characteristicsList.innerHTML = '';
            profile.characteristics.forEach(characteristic => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="checkmark">&#10003;</span> ${characteristic}`;
                characteristicsList.appendChild(li);
            });

            // Update Skills
            skillsList.innerHTML = '';
            profile.skills.forEach(skill => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="checkmark">&#10003;</span> ${skill}`;
                skillsList.appendChild(li);
            });

            // Update Price
            priceLabelElement.textContent = `₱${parseFloat(profile.price).toLocaleString()}`;
        } else {
            console.error("Profile not available or inactive:", data.message);
        }
    } catch (error) {
        console.error("Error fetching tour guide profile:", error);
    }
});







document.addEventListener('DOMContentLoaded', function () {
    const footerBookBtn = document.getElementById('footer-book-btn');
    const bookingForm = document.querySelector('.booking-form');
    const bookingModal = document.getElementById("booking-modal");
    const thankYouPopup = document.getElementById("thank-you-popup");
    const closeModalButton = document.getElementById("close-modal");
    const confirmBookingButton = document.querySelector('.confirm-btn');
    
    // Form input fields
    const dateInput = document.getElementById('date');
    const tourTypeInput = document.getElementById('tour-type');
    const travelerQuantityInput = document.getElementById('traveler-quantity');
    const personalizedTourInput = document.getElementById('personalized');
    
    // Modal display fields
    const modalTourDate = document.querySelector('.booking-details p strong:nth-child(2)');
    const modalTourType = document.querySelector('.booking-details p strong:nth-child(4)');
    const modalTravelerQuantity = document.querySelector('.booking-details p strong:nth-child(6)');
    const modalPersonalizedNotes = document.querySelector('.note-section p strong');
  
    // Open the modal with form values
    function openModal() {
      // Set modal content based on input values
      modalTourDate.textContent = dateInput.value;
      modalTourType.textContent = tourTypeInput.options[tourTypeInput.selectedIndex].text;
      modalTravelerQuantity.textContent = travelerQuantityInput.value;
      modalPersonalizedNotes.textContent = personalizedTourInput.value || "N/A";
  
      bookingModal.style.display = "flex";
      document.body.style.overflow = "hidden"; // Disable background scrolling
    }
  
    confirmBookingButton.addEventListener('click', openModal);
  
    // Close Modal Function
    function closeModal() {
      bookingModal.style.display = "none"; // Hide the modal
      document.body.style.overflow = "auto"; // Enable background scrolling
    }
  
    // Attach event listener to close button
    closeModalButton.addEventListener('click', closeModal);
  
    // Show Thank You Popup After Confirming Booking
    function showThankYouMessage() {
      closeModal(); // Close the booking modal
      thankYouPopup.style.display = "flex"; // Show thank you popup
  
      // Hide the popup automatically after 3 seconds
      setTimeout(() => {
        thankYouPopup.style.display = "none";
      }, 3000);
    }
  
    // Optional: Close Modal by Clicking Outside of It
    window.onclick = function (event) {
      if (event.target === bookingModal) {
        closeModal();
      }
    };
  });
  
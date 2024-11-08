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
    const modalTourDate = document.getElementById('modal-tour-date');
    const modalTourType = document.getElementById('modal-tour-type');
    const modalTravelerQuantity = document.getElementById('modal-traveler-quantity');
    const modalPersonalizedNotes = document.getElementById('modal-personalized-notes');
  
    // Open the modal with form values
    function openModal() {
      // Set modal content based on input values
      modalTourDate.textContent = dateInput.value || "Not selected";
      modalTourType.textContent = tourTypeInput.options[tourTypeInput.selectedIndex].text || "Not selected";
      modalTravelerQuantity.textContent = travelerQuantityInput.value || "1";
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






  document.addEventListener('DOMContentLoaded', async function () {
    console.log("DOM fully loaded and parsed");
    const tourGuideId = 1;  // Use the appropriate tour guide ID
    console.log(`Using tourGuideId: ${tourGuideId}`);

    const dateInput = document.getElementById('date');
    if (!dateInput) {
        console.error("Date input field not found for Flatpickr initialization.");
        return;
    }

    console.log(`Fetching from URL: /main/get_availability/${tourGuideId}`);
    try {
        const response = await fetch(`/main/get_availability/${tourGuideId}`);
        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const availabilityData = await response.json();
        console.log("Fetched availability data:", availabilityData);

        if (!Array.isArray(availabilityData)) {
            throw new Error("Unexpected data format. Expected an array.");
        }

        let unavailableDates = [];
        availabilityData.forEach(entry => {
            if (entry.status === 'unavailable') {
                unavailableDates.push(entry.date);
            }
        });
        
        console.log("Unavailable dates:", unavailableDates);

        // Initialize flatpickr with disabled dates
        flatpickr(dateInput, {
            dateFormat: 'Y-m-d',
            minDate: "today",
            disable: unavailableDates
        });

    } catch (error) {
        console.error('Error fetching availability:', error);
    }
});





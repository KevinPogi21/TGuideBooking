// document.addEventListener('DOMContentLoaded', async () => {
//     const tourGuideId = 1; // Replace this with the dynamic tour guide ID as needed
//     const profilePicElement = document.querySelector('.profile-pic');
//     const guideNameElement = document.querySelector('.h2-guide-name span');
//     const aboutMeElement = document.querySelector('.about-me p');
//     const characteristicsList = document.querySelector('.characteristics-box .checklist');
//     const skillsList = document.querySelector('.skills-box .checklist');
//     const priceLabelElement = document.querySelector('.price-label');

//     try {
//         const response = await fetch('/update_profile_picture/');
//         const data = await response.json();

//         if (data.success) {
//             const profile = data.profile;

//             // Update profile picture
//             profilePicElement.src = profile.profile_picture;

//             // Update guide name
//             guideNameElement.textContent = profile.name;

//             // Update About Me section
//             aboutMeElement.textContent = profile.bio;

//             // Update Characteristics
//             characteristicsList.innerHTML = '';
//             profile.characteristics.forEach(characteristic => {
//                 const li = document.createElement('li');
//                 li.innerHTML = `<span class="checkmark">&#10003;</span> ${characteristic}`;
//                 characteristicsList.appendChild(li);
//             });

//             // Update Skills
//             skillsList.innerHTML = '';
//             profile.skills.forEach(skill => {
//                 const li = document.createElement('li');
//                 li.innerHTML = `<span class="checkmark">&#10003;</span> ${skill}`;
//                 skillsList.appendChild(li);
//             });

//             // Update Price
//             priceLabelElement.textContent = `₱${parseFloat(profile.price).toLocaleString()}`;
//         } else {
//             console.error("Profile not available or inactive:", data.message);
//         }
//     } catch (error) {
//         console.error("Error fetching tour guide profile:", error);
//     }
// });








// Tourguide Form
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
      // Check if required fields are filled
      if (!dateInput.value) {
          closeModal(); // Close the modal if it was open
          alert("Please select a date.");
          dateInput.focus(); // Redirect user to date input field
          return; // Stop the function if date is missing
      }
      if (!tourTypeInput.value) {
          closeModal();
          alert("Please select a tour type.");
          tourTypeInput.focus();
          return;
      }
      if (!travelerQuantityInput.value) {
          closeModal();
          alert("Please enter the number of travelers.");
          travelerQuantityInput.focus();
          return;
      }

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
  async function showThankYouMessage() {
    closeModal(); // Close the booking modal
    thankYouPopup.style.display = "flex"; // Show thank you popup

    // Get the booking details
    const bookingData = {
        date: dateInput.value,
        tourType: tourTypeInput.options[tourTypeInput.selectedIndex].text,
        travelerQuantity: travelerQuantityInput.value,
        personalizedNotes: personalizedTourInput.value || "N/A"
    };

    try {
        // Send booking data to the server
        const response = await fetch('/submit_booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            console.log("Booking data sent successfully");
        } else {
            console.error("Failed to send booking data");
        }
    } catch (error) {
        console.error("Error sending booking data:", error);
    }

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
  const dateInput = document.getElementById('date');

  // Function to extract the tour guide ID from the URL path
  function getTourGuideIdFromPath() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
  }

  // Retrieve the tour guide ID from the URL path
  const tourGuideId = getTourGuideIdFromPath();

  if (!tourGuideId) {
    console.error("Tour Guide ID not found in URL path.");
    return;
  }

  if (!dateInput) {
    console.error("Date input field not found for Flatpickr initialization.");
    return;
  }

  try {
    // Fetch availability data for the specified tour guide
    const response = await fetch(`/tourguide/get_availability/${tourGuideId}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const availabilityData = await response.json();
    console.log("Fetched availability data:", availabilityData);

    // Filter only available dates
    const availableDates = availabilityData
      .filter(entry => entry.status === 'available')
      .map(entry => entry.date);

    // Initialize Flatpickr with only the available dates enabled
    flatpickr(dateInput, {
      dateFormat: 'Y-m-d',
      minDate: "today",
      enable: availableDates,
      onReady: function (selectedDates, dateStr, instance) {
        highlightAvailableDates(instance);
      },
      onMonthChange: function (selectedDates, dateStr, instance) {
        highlightAvailableDates(instance);
      }
    });

    // Function to highlight available dates
    function highlightAvailableDates(instance) {
      instance.calendarContainer.querySelectorAll('.flatpickr-day').forEach(dayElem => {
        const dateStr = dayElem.dateObj.toISOString().split('T')[1];
        if (availableDates.includes(dateStr)) {
          dayElem.style.backgroundColor = '#4ecdc4';
          dayElem.style.color = 'white';
          dayElem.style.borderRadius = '50%';
        }
      });
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
  }
});











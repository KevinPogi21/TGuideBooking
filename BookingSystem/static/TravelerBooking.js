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








// TOURGUIDE FORM BOOKING PROCESS
// JavaScript
// JavaScript
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
  const modalPrice = document.getElementById('modal-price');
  const modalGuideName = document.getElementById('modal-guide-name');

  // Open the modal with form values
  function openModal() {
      console.log("Attempting to open modal...");

      // Check if required fields are filled
      if (!dateInput.value) {
          console.warn("Date is missing");
          alert("Please select a date.");
          dateInput.focus();
          return;
      }
      if (!tourTypeInput.value) {
          console.warn("Tour Type is missing");
          alert("Please select a tour type.");
          tourTypeInput.focus();
          return;
      }
      if (!travelerQuantityInput.value) {
          console.warn("Traveler Quantity is missing");
          alert("Please enter the number of travelers.");
          travelerQuantityInput.focus();
          return;
      }

      // Fetch package_id and tourGuideId
      const selectedOption = tourTypeInput.options[tourTypeInput.selectedIndex];
      const packageId = selectedOption.getAttribute('data-package-id');
      const guideNameElement = document.querySelector('.guide-name span');
      const tourGuideId = guideNameElement ? guideNameElement.getAttribute('data-tour-guide-id') : null;

      // Log values for debugging
      console.log("Opening modal with data:");
      console.log("Tour Date:", dateInput.value);
      console.log("Tour Type:", tourTypeInput.options[tourTypeInput.selectedIndex].text);
      console.log("Package ID:", packageId); // Debugging package ID
      console.log("Number of Travelers:", travelerQuantityInput.value);
      console.log("Personalized Notes:", personalizedTourInput.value);
      console.log("Tour Guide ID:", tourGuideId); // Debugging tour guide ID

      if (!tourGuideId) {
          console.error("Error: Tour Guide ID is not found. Check the data attribute in HTML.");
      }

      modalTourDate.textContent = dateInput.value;
      modalTourType.textContent = tourTypeInput.options[tourTypeInput.selectedIndex].text;
      modalTravelerQuantity.textContent = travelerQuantityInput.value;
      modalPersonalizedNotes.textContent = personalizedTourInput.value || "N/A";

      const priceElement = document.querySelector('.price-label');
      if (priceElement) {
          modalPrice.textContent = priceElement.textContent;
          console.log("Price fetched:", priceElement.textContent);
      } else {
          console.warn("Price element not found.");
      }

      bookingModal.style.display = "flex";
      document.body.style.overflow = "hidden";
      console.log("Modal opened successfully.");
  }

  confirmBookingButton.addEventListener('click', openModal);

  // Close Modal Function
  function closeModal() {
      bookingModal.style.display = "none";
      document.body.style.overflow = "auto";
      console.log("Modal closed.");
  }

  closeModalButton.addEventListener('click', closeModal);

  async function showThankYouMessage() {
    closeModal();
    thankYouPopup.style.display = "flex";
    console.log("Thank You Popup displayed.");

    // Get the booking details, including price and guide name
    const bookingData = {
        date: dateInput.value,
        tourType: tourTypeInput.options[tourTypeInput.selectedIndex].text,
        packageId: packageId, // Use the fetched package ID
        travelerQuantity: travelerQuantityInput.value,
        personalizedNotes: personalizedTourInput.value || "N/A",
        price: priceElement ? parseFloat(priceElement.textContent.replace(/[^\d.-]/g, '')) : null,
        tourGuideId: 41 // Use the fetched tour guide ID
    };

    console.log("Booking data to send:", bookingData); // Shows the data being sent

    try {
      console.log("Sending booking data to backend:", bookingData);
      const response = await fetch('/submit_booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
      });
      
      console.log("Response Status from backend:", response.status); // Debug status
      
      if (response.ok) {
          console.log("Booking data sent successfully to backend");
          const result = await response.json();
          console.log("Backend response:", result);
      } else {
          console.error("Failed to send booking data. Status:", response.status);
          const errorText = await response.text();
          console.error("Error details from backend:", errorText);
      }
    } catch (error) {
      console.error("Error sending booking data:", error);
    }
    
    

    setTimeout(() => {
        thankYouPopup.style.display = "none";
        console.log("Thank You Popup hidden.");
    }, 3000);
  }

  window.onclick = function (event) {
      if (event.target === bookingModal) {
          closeModal();
      }
  };
});




















// TRAVELER CALENDAR
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











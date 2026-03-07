export default function initCallbackForm() {
    // Select the necessary DOM elements
    const form = document.querySelector('.callback-form');
    const dateSelect = document.getElementById('date-yes-no');
    const dateGroup = document.getElementById('date-group');
    const dateInput = document.getElementById('event-date');
    const phoneInput = document.getElementById('phone-number'); 
    
    const modal = document.getElementById('success-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    if (!form || !dateSelect || !dateGroup || !dateInput || !phoneInput || !modal) {
        console.warn('Callback form elements not found in the DOM.');
        return;
    }

    // Handle Phone Number Input Restriction (Optimized)
    phoneInput.addEventListener('input', function(e) {
        const originalValue = this.value;
        const cursorPosition = this.selectionStart;
        let cleanedValue = originalValue.replace(/[^0-9\+\s]/g, '');
        
        cleanedValue = cleanedValue.replace(/(?!^\+)\+/g, '');

        if (originalValue !== cleanedValue) {
            this.value = cleanedValue;
           this.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        }
    });

    // Handle the Event Date Toggle Logic
    dateSelect.addEventListener('change', (e) => {
        if (e.target.value === 'no') {
            dateGroup.style.display = 'none';
            dateInput.removeAttribute('required');
            dateInput.value = ''; 
        } else {
            dateGroup.style.display = 'flex'; 
            dateInput.setAttribute('required', 'true');
        }
    });

    //Date Restriction
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 3);
    const formatDate = (dateObj) => dateObj.toISOString().split('T')[0];
    dateInput.min = formatDate(tomorrow);
    dateInput.max = formatDate(maxDate);

    dateInput.addEventListener('click', function() {
       if ('showPicker' in HTMLInputElement.prototype) {
            try {
                this.showPicker();
            } catch (error) {
                console.warn('Browser blocked showPicker');
            }
        }
    });

    // Handle Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Call Back Request Data:', data);
        
        modal.classList.add('active');
        form.reset();
        dateGroup.style.display = 'flex';
        dateInput.setAttribute('required', 'true');

        // Logic to redirect the user to the home page
        const redirectToHome = () => {
            modal.classList.remove('active');
            window.location.hash = '#home'; // Tells your router to load the home page
        };

        if (btnCloseModal) {
            btnCloseModal.addEventListener('click', redirectToHome);
        }
    });
}
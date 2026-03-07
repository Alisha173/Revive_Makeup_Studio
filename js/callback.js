export default function initCallbackForm() {
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
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        if (!form.checkValidity()) {
            form.classList.add('show-errors');
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        try {
            const response = await fetch('/.netlify/functions/submitCallback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Data successfully saved to Google Sheets!');
                
                modal.classList.add('active');
                form.reset();
                form.classList.remove('show-errors');
                dateGroup.style.display = 'flex';
                dateInput.setAttribute('required', 'true');

                const redirectToHome = () => {
                    modal.classList.remove('active');
                    window.location.hash = '#home'; 
                };

                if (btnCloseModal) {
                    btnCloseModal.addEventListener('click', redirectToHome, { once: true });
                }
            } else {
                throw new Error('Server returned an error');
            }

        } catch (error) {
            console.error('Submission Error:', error);
            alert("Oops! Our servers are a bit busy. Please try again or contact us directly.");
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}
exports.handler = async (event) => {
  
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const formData = JSON.parse(event.body);

        if (formData['extra-info']) {
            console.warn("Bot detected via disguised honeypot.");
            return { 
                statusCode: 200, 
                body: JSON.stringify({ message: "Form submitted successfully!" }) 
            };
        }

        const { 
            "your-name": name, 
            "phone-number": phone, 
            "packages": packageSelected,
            "location": location,
            "date-yes-no": hasDate,
            "event-date": eventDate,
            "additional-details": details 
        } = formData;

        

        if (!name || name.trim().length < 2 || name.length > 50) {
            return { statusCode: 400, 
                    body: JSON.stringify({ error: "Invalid Name (2-50 chars required)" }) };
        }

        const phoneRegex = /^[0-9\+\s]+$/;
        if (!phone || phone.length < 10 || phone.length > 18 || !phoneRegex.test(phone)) {
            return { statusCode: 400,
                    body: JSON.stringify({ error: "Invalid Phone Number format" }) };
        }

        const validPackages = ["HD Makeup", "Ultra HD Makeup", "Glass Skin Makeup", "Airbrush Makeup", "Party Makeup", "Model/PhotoShoot Makeup", "Other"];
        if (!packageSelected || !validPackages.includes(packageSelected)) {
            return { statusCode: 400, 
                    body: JSON.stringify({ error: "Please select a valid package" }) };
        }

        if (!location || location.trim().length < 3 || location.length > 150) {
            return { statusCode: 400,
                    body: JSON.stringify({ error: "Invalid Location (3-150 chars required)" }) };
        }

        if (hasDate === "yes") {
            if (!eventDate) {
                return { statusCode: 400, body: JSON.stringify({ error: "Event date is required when 'Yes' is selected" }) };
            }
            const selectedDate = new Date(eventDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison
            if (isNaN(selectedDate.getTime()) || selectedDate < today) {
                return { statusCode: 400, body: JSON.stringify({ error: "Event date cannot be in the past" }) };
            }
        }

        if (details && details.length > 500) {
            return { statusCode: 400, body: JSON.stringify({ error: "Additional details must be under 500 characters" }) };
        }

        const googleAppScriptUrl = process.env.GOOGLE_SCRIPT_URL;
        formData.token = process.env.AUTH_TOKEN;

       const response = await fetch(googleAppScriptUrl, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        if (response.ok) {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Form submitted successfully!" }),
        };
        } else {
            throw new Error("Failed to save to Google Sheets");
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
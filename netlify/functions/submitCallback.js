exports.handler = async (event) => {
  
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const formData = JSON.parse(event.body);

        //temporary hardcode
        formData.token = "890733revive759299"; 

        const googleAppScriptUrl = "https://script.google.com/macros/s/AKfycbwgsyPFLlnId1kyT8VW8RpQxAX1N9MTTcLJvKFWi5117QMCEBaLGHgEbb2Se75s3-9g/exec"; 

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
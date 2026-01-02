// This object contains all the messages used in the application
export const message = {
  EMAIL_PROMPT: `You are a helpful email assistant. 
          The user provides the email address, subject, and body. 
          Your job is to use the SendWelcomeEmail tool with these exact values. 
          After the tool runs, it returns JSON with success status, recipient email, 
          subject, timestamp, formattedDate, and formattedTime. 
          If successful, confirm the email was sent with the details. 
          If it fails, report the error clearly.`,

  EMAIL_USER_MESSAGE: (email: string, subject: string, body: string) => 
    `Send an email to ${email} with subject: "${subject}" and body: "${body}"`,

  EMAIL_TOOL_DESCRIPTION: `Send an email to a specified email address with the provided subject and body. Returns a JSON object with success status, recipient email, subject, timestamp, formatted date and time.`,
};
<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
session_start();

// Include PHPMailer
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  try {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';

    // Validate required fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
      throw new Exception("Please fill in all required fields");
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      throw new Exception("Invalid email address");
    }

    // Map subject values to readable text
    $subjectMap = [
      'reservation' => 'Room Reservation',
      'event' => 'Event Inquiry',
      'general' => 'General Inquiry',
      'feedback' => 'Feedback',
      'other' => 'Other'
    ];
    $subjectText = $subjectMap[$subject] ?? 'Contact Form';

    // Track email sending status
    $autoReplyEmailSent = false;

    // Auto-reply email to customer
    $mailClient = new PHPMailer(true);
    try {
      // For testing with Mailtrap
      $mailClient->isSMTP();
      $mailClient->Host = 'smtp.mailtrap.io';
      $mailClient->SMTPAuth = true;
      $mailClient->Username = 'c37ef4508c01e6';
      $mailClient->Password = '25db67cf9f349e';
      $mailClient->SMTPSecure = 'tls';
      $mailClient->Port = 2525;

      // For production (uncomment and configure)
      // $mailClient->isSMTP();
      // $mailClient->Host = 'mail.caritonhotel.com';
      // $mailClient->SMTPAuth = true;
      // $mailClient->Username = 'info@caritonhotel.com';
      // $mailClient->Password = 'YOUR_EMAIL_PASSWORD';
      // $mailClient->SMTPSecure = 'ssl';
      // $mailClient->Port = 465;

      $mailClient->setFrom('info@caritonhotel.com', 'Cariton Hotel');
      $mailClient->addAddress($email, $name);
      $mailClient->Subject = 'Thank You for Contacting Cariton Hotel';
      $mailClient->isHTML(true);

      $clientEmailContent = "
    <html>
      <body style='margin:0;padding:0;background:#f5f7fa;font-family:-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;'>
        <table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='background:#f5f7fa;'>
          <tr>
            <td align='center' style='padding:24px;'>
              <table role='presentation' width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);'>
                <tr>
                  <td style='background:#1a1a1a;color:#d4af37;padding:20px 24px;'>
                    <div style='font-size:20px;font-weight:600;'>Cariton Hotel</div>
                    <div style='font-size:13px;opacity:.85; color:#ffffff;'>Thank You for Contacting Us</div>
                  </td>
                </tr>
                <tr>
                  <td style='padding:24px;color:#111827;'>
                    <p style='margin:0 0 12px;'>Dear $name,</p>
                    <p style='margin:0 0 20px;color:#374151;'>Thank you for reaching out to Cariton Hotel. We have received your message and will get back to you as soon as possible.</p>
                    <div style='background:#f9fafb;padding:16px;border-radius:8px;margin:20px 0;'>
                      <p style='margin:0 0 8px;'><strong>Your Message:</strong></p>
                      <p style='margin:0;color:#6b7280;'>Subject: $subjectText</p>
                      <p style='margin:8px 0 0;color:#6b7280;white-space:pre-wrap;'>$message</p>
                    </div>
                    <p style='margin:0 0 12px;color:#374151;'>We typically respond within 24 hours during business days.</p>
                    <p style='margin:0;color:#6b7280;font-size:13px;'>If you need immediate assistance, please call us at +234 704 473 8132.</p>
                  </td>
                </tr>
                <tr>
                  <td style='background:#f9fafb;padding:16px;text-align:center;color:#6b7280;font-size:12px;'>
                    <strong>Cariton Hotel</strong><br>
                    3 Tex Olawale Street, Lagos, Nigeria<br>
                    Phone: +234 704 473 8132 | Email: info@caritonhotel.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>";

      $mailClient->Body = $clientEmailContent;
      $mailClient->send();
      $autoReplyEmailSent = true;
    } catch (Exception $e) {
      error_log('Error sending auto-reply email: ' . $mailClient->ErrorInfo);
      // Continue to try sending admin notification even if auto-reply fails
    }

    // Notification email to admin
    $mailAdmin = new PHPMailer(true);
    try {
      // For testing with Mailtrap
      $mailAdmin->isSMTP();
      $mailAdmin->Host = 'smtp.mailtrap.io';
      $mailAdmin->SMTPAuth = true;
      $mailAdmin->Username = 'c37ef4508c01e6';
      $mailAdmin->Password = '25db67cf9f349e';
      $mailAdmin->SMTPSecure = 'tls';
      $mailAdmin->Port = 2525;

      // For production (uncomment and configure)
      // $mailAdmin->isSMTP();
      // $mailAdmin->Host = 'mail.caritonhotel.com';
      // $mailAdmin->SMTPAuth = true;
      // $mailAdmin->Username = 'info@caritonhotel.com';
      // $mailAdmin->Password = 'YOUR_EMAIL_PASSWORD';
      // $mailAdmin->SMTPSecure = 'ssl';
      // $mailAdmin->Port = 465;

      $mailAdmin->setFrom('info@caritonhotel.com', 'Cariton Hotel Website');
      $mailAdmin->addAddress('info@caritonhotel.com', 'Cariton Hotel Admin');
      $mailAdmin->Subject = "New Contact Form Message - $subjectText";
      $mailAdmin->isHTML(true);

      $phoneDisplay = !empty($phone) ? $phone : 'Not provided';

      $adminEmailContent = "
    <html>
      <body style='margin:0;padding:0;background:#f5f7fa;font-family:-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;'>
        <table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='background:#f5f7fa;'>
          <tr>
            <td align='center' style='padding:24px;'>
              <table role='presentation' width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);'>
                <tr>
                  <td style='background:#1a1a1a;color:#ffffff;padding:20px 24px;'>
                    <div style='font-size:20px;font-weight:600;'>Cariton Hotel</div>
                    <div style='font-size:13px;opacity:.85;'>New Contact Form Message</div>
                  </td>
                </tr>
                <tr>
                  <td style='padding:24px;color:#111827;'>
                    <p style='margin:0 0 16px;color:#374151;'>A new message has been received from the contact form:</p>
                    <table width='100%' cellpadding='0' cellspacing='0' style='border-collapse:collapse;'>
                      <tr><td style='padding:8px 0;color:#6b7280;'>Name</td><td style='padding:8px 0;text-align:right;font-weight:600;color:#111827;'>$name</td></tr>
                      <tr><td style='padding:8px 0;color:#6b7280;'>Email</td><td style='padding:8px 0;text-align:right;font-weight:600;color:#111827;'>$email</td></tr>
                      <tr><td style='padding:8px 0;color:#6b7280;'>Phone</td><td style='padding:8px 0;text-align:right;font-weight:600;color:#111827;'>$phoneDisplay</td></tr>
                      <tr><td style='padding:8px 0;color:#6b7280;'>Subject</td><td style='padding:8px 0;text-align:right;font-weight:600;color:#111827;'>$subjectText</td></tr>
                    </table>
                    <div style='margin:20px 0;padding:16px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;'>
                      <p style='margin:0 0 8px;font-weight:600;color:#111827;'>Message:</p>
                      <p style='margin:0;color:#374151;white-space:pre-wrap;'>$message</p>
                    </div>
                    <p style='margin:0;color:#6b7280;font-size:13px;'>Please respond to this inquiry as soon as possible.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>";

      $mailAdmin->Body = $adminEmailContent;
      $mailAdmin->send();

      // Success - redirect with success message
      if ($autoReplyEmailSent) {
        header("Location: contact.html?message=" . urlencode("Thank you for your message! We've sent a confirmation to $email"));
      } else {
        header("Location: contact.html?message=" . urlencode("Thank you for your message! We will get back to you soon."));
      }
      exit;
    } catch (Exception $e) {
      error_log('Error sending admin notification email: ' . $mailAdmin->ErrorInfo);
      // Even if admin email fails, still show success to user if auto-reply was sent
      if ($autoReplyEmailSent) {
        header("Location: contact.html?message=" . urlencode("Thank you for your message! We've sent a confirmation to $email"));
      } else {
        header("Location: contact.html?message=" . urlencode("Thank you for your message! We will get back to you soon."));
      }
      exit;
    }
  } catch (Exception $e) {
    error_log("Contact Form Error: " . $e->getMessage());
    header("Location: contact.html?error=" . urlencode("Error: " . $e->getMessage()));
    exit;
  }
}
?>
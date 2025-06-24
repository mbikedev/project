import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reservation, language = 'en' } = await req.json()

    // Check for Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY environment variable is not set')
      console.error('📧 To fix this:')
      console.error('1. Go to https://resend.com and create a free account')
      console.error('2. Get your API key from the dashboard')
      console.error('3. Add it to Supabase Edge Functions as RESEND_API_KEY')
      
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured',
          details: 'RESEND_API_KEY environment variable is missing',
          setup_url: 'https://resend.com',
          instructions: 'Add RESEND_API_KEY to Supabase Edge Functions environment variables'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log('✅ Resend API key found, attempting to send email...')

    // Email templates by language
    const templates = {
      en: {
        subject: `Reservation ${reservation.status === 'pending' ? 'Received' : 'Confirmed'} - ${reservation.reservation_number}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFF8DC;">
            <div style="background: linear-gradient(135deg, #8B4513, #CD853F); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-family: 'Playfair Display', serif;">East At West</h1>
              <p style="color: #FFF8DC; margin: 10px 0 0 0; font-size: 16px;">Authentic Lebanese Cuisine</p>
            </div>
            
            <div style="padding: 30px;">
              <h2 style="color: #8B4513; margin-bottom: 20px; font-family: 'Playfair Display', serif;">
                ${reservation.status === 'pending' ? 'Reservation Received - Pending Approval' : 'Reservation Confirmed!'}
              </h2>
              
              <p style="color: #2F1B14; font-size: 16px; line-height: 1.6;">
                Dear ${reservation.name},<br><br>
                ${reservation.status === 'pending' 
                  ? `Thank you for your reservation request at East At West. Your reservation for ${reservation.guests} guests is currently pending approval. We will contact you within 24 hours to confirm your booking.`
                  : 'Thank you for choosing East At West! Your reservation has been confirmed and we look forward to welcoming you.'
                }
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B4513;">
                <h3 style="color: #8B4513; margin-top: 0; font-family: 'Playfair Display', serif;">Reservation Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold; width: 40%;">Reservation Number:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.reservation_number}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Name:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Email:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.email}</td>
                  </tr>
                  ${reservation.phone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Phone:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.phone}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Date:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Time:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Number of Guests:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.guests}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Status:</td>
                    <td style="padding: 8px 0; color: #2F1B14; text-transform: capitalize; font-weight: bold; color: ${reservation.status === 'confirmed' ? '#059669' : '#D97706'};">${reservation.status}</td>
                  </tr>
                  ${reservation.additional_info ? `
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold; vertical-align: top;">Additional Information:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.additional_info}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="background: #F5F5DC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #8B4513; margin-top: 0; font-family: 'Playfair Display', serif;">Restaurant Information</h4>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>📍 Address:</strong> Bld de l'Empereur 26, 1000 Brussels, Belgium</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>📞 Phone:</strong> +32 465 20 60 24</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>✉️ Email:</strong> contact@eastatwest.com</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>🌐 Website:</strong> www.eastatwest.com</p>
              </div>
              
              ${reservation.status === 'confirmed' ? `
              <div style="background: #E8F5E8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
                <p style="color: #2F1B14; margin: 0; font-size: 14px;">
                  <strong>Important:</strong> Please arrive on time for your reservation. If you need to cancel or modify your booking, please contact us at least 2 hours in advance.
                </p>
              </div>
              ` : `
              <div style="background: #FEF3CD; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D97706;">
                <p style="color: #2F1B14; margin: 0; font-size: 14px;">
                  <strong>Next Steps:</strong> We will review your reservation request and contact you within 24 hours to confirm availability for your party of ${reservation.guests} guests.
                </p>
              </div>
              `}
              
              <p style="color: #2F1B14; margin-top: 30px; text-align: center;">
                We look forward to welcoming you to East At West!<br><br>
                <strong>Best regards,<br>
                The East At West Team</strong>
              </p>
            </div>
            
            <div style="background: #8B4513; padding: 20px; text-align: center;">
              <p style="color: #FFF8DC; margin: 0; font-size: 12px;">
                © 2025 East At West Restaurant. All rights reserved.<br>
                Bld de l'Empereur 26, 1000 Brussels, Belgium
              </p>
            </div>
          </div>
        `
      },
      fr: {
        subject: `Réservation ${reservation.status === 'pending' ? 'Reçue' : 'Confirmée'} - ${reservation.reservation_number}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFF8DC;">
            <div style="background: linear-gradient(135deg, #8B4513, #CD853F); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-family: 'Playfair Display', serif;">East At West</h1>
              <p style="color: #FFF8DC; margin: 10px 0 0 0; font-size: 16px;">Cuisine Libanaise Authentique</p>
            </div>
            
            <div style="padding: 30px;">
              <h2 style="color: #8B4513; margin-bottom: 20px; font-family: 'Playfair Display', serif;">
                ${reservation.status === 'pending' ? 'Réservation Reçue - En Attente d\'Approbation' : 'Réservation Confirmée!'}
              </h2>
              
              <p style="color: #2F1B14; font-size: 16px; line-height: 1.6;">
                Cher/Chère ${reservation.name},<br><br>
                ${reservation.status === 'pending' 
                  ? `Merci pour votre demande de réservation chez East At West. Votre réservation pour ${reservation.guests} personnes est en attente d'approbation. Nous vous contacterons dans les 24 heures pour confirmer votre réservation.`
                  : 'Merci d\'avoir choisi East At West! Votre réservation a été confirmée et nous avons hâte de vous accueillir.'
                }
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B4513;">
                <h3 style="color: #8B4513; margin-top: 0; font-family: 'Playfair Display', serif;">Détails de la Réservation</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold; width: 40%;">Numéro de Réservation:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.reservation_number}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Nom:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Email:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.email}</td>
                  </tr>
                  ${reservation.phone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Téléphone:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.phone}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Date:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${new Date(reservation.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Heure:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Nombre d'Invités:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.guests}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Statut:</td>
                    <td style="padding: 8px 0; color: #2F1B14; text-transform: capitalize; font-weight: bold; color: ${reservation.status === 'confirmed' ? '#059669' : '#D97706'};">${reservation.status === 'confirmed' ? 'Confirmé' : 'En attente'}</td>
                  </tr>
                  ${reservation.additional_info ? `
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold; vertical-align: top;">Informations Supplémentaires:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.additional_info}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="background: #F5F5DC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #8B4513; margin-top: 0; font-family: 'Playfair Display', serif;">Informations du Restaurant</h4>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>📍 Adresse:</strong> Bld de l'Empereur 26, 1000 Bruxelles, Belgique</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>📞 Téléphone:</strong> +32 465 20 60 24</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>✉️ Email:</strong> contact@eastatwest.com</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>🌐 Site Web:</strong> www.eastatwest.com</p>
              </div>
              
              <p style="color: #2F1B14; margin-top: 30px; text-align: center;">
                Nous avons hâte de vous accueillir chez East At West!<br><br>
                <strong>Cordialement,<br>
                L'équipe East At West</strong>
              </p>
            </div>
            
            <div style="background: #8B4513; padding: 20px; text-align: center;">
              <p style="color: #FFF8DC; margin: 0; font-size: 12px;">
                © 2025 East At West Restaurant. Tous droits réservés.<br>
                Bld de l'Empereur 26, 1000 Bruxelles, Belgique
              </p>
            </div>
          </div>
        `
      },
      nl: {
        subject: `Reservering ${reservation.status === 'pending' ? 'Ontvangen' : 'Bevestigd'} - ${reservation.reservation_number}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFF8DC;">
            <div style="background: linear-gradient(135deg, #8B4513, #CD853F); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-family: 'Playfair Display', serif;">East At West</h1>
              <p style="color: #FFF8DC; margin: 10px 0 0 0; font-size: 16px;">Authentieke Libanese Keuken</p>
            </div>
            
            <div style="padding: 30px;">
              <h2 style="color: #8B4513; margin-bottom: 20px; font-family: 'Playfair Display', serif;">
                ${reservation.status === 'pending' ? 'Reservering Ontvangen - In Afwachting van Goedkeuring' : 'Reservering Bevestigd!'}
              </h2>
              
              <p style="color: #2F1B14; font-size: 16px; line-height: 1.6;">
                Beste ${reservation.name},<br><br>
                ${reservation.status === 'pending' 
                  ? `Bedankt voor uw reserveringsverzoek bij East At West. Uw reservering voor ${reservation.guests} gasten is in afwachting van goedkeuring. We nemen binnen 24 uur contact met u op om uw reservering te bevestigen.`
                  : 'Bedankt voor het kiezen van East At West! Uw reservering is bevestigd en we kijken ernaar uit u te verwelkomen.'
                }
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B4513;">
                <h3 style="color: #8B4513; margin-top: 0; font-family: 'Playfair Display', serif;">Reservering Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold; width: 40%;">Reserveringsnummer:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.reservation_number}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Naam:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Email:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.email}</td>
                  </tr>
                  ${reservation.phone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Telefoon:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.phone}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Datum:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${new Date(reservation.date).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Tijd:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.time}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Aantal Gasten:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.guests}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold;">Status:</td>
                    <td style="padding: 8px 0; color: #2F1B14; text-transform: capitalize; font-weight: bold; color: ${reservation.status === 'confirmed' ? '#059669' : '#D97706'};">${reservation.status === 'confirmed' ? 'Bevestigd' : 'In afwachting'}</td>
                  </tr>
                  ${reservation.additional_info ? `
                  <tr>
                    <td style="padding: 8px 0; color: #2F1B14; font-weight: bold; vertical-align: top;">Aanvullende Informatie:</td>
                    <td style="padding: 8px 0; color: #2F1B14;">${reservation.additional_info}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="background: #F5F5DC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #8B4513; margin-top: 0; font-family: 'Playfair Display', serif;">Restaurant Informatie</h4>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>📍 Adres:</strong> Keizerslaan 26, 1000 Brussel, België</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>📞 Telefoon:</strong> +32 465 20 60 24</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>✉️ Email:</strong> contact@eastatwest.com</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>🌐 Website:</strong> www.eastatwest.com</p>
              </div>
              
              <p style="color: #2F1B14; margin-top: 30px; text-align: center;">
                We kijken ernaar uit u te verwelkomen bij East At West!<br><br>
                <strong>Met vriendelijke groeten,<br>
                Het East At West Team</strong>
              </p>
            </div>
            
            <div style="background: #8B4513; padding: 20px; text-align: center;">
              <p style="color: #FFF8DC; margin: 0; font-size: 12px;">
                © 2025 East At West Restaurant. Alle rechten voorbehouden.<br>
                Keizerslaan 26, 1000 Brussel, België
              </p>
            </div>
          </div>
        `
      }
    }

    const template = templates[language] || templates.en

    console.log(`📧 Sending ${language} email to ${reservation.email}...`)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'East At West <reservations@eastatwest.com>',
        to: [reservation.email],
        subject: template.subject,
        html: template.html,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('❌ Resend API error:', error)
      throw new Error(`Failed to send email: ${error}`)
    }

    const data = await res.json()
    console.log('✅ Email sent successfully! ID:', data.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: data.id,
        message: 'Email sent successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('❌ Email function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
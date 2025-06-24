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

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not set')
    }

    // Email templates by language
    const templates = {
      en: {
        subject: `Reservation Confirmation - ${reservation.reservation_number}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513, #CD853F); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">East At West</h1>
              <p style="color: #FFF8DC; margin: 10px 0 0 0;">Authentic Lebanese Cuisine</p>
            </div>
            
            <div style="padding: 30px; background: #FFF8DC;">
              <h2 style="color: #8B4513; margin-bottom: 20px;">Reservation Confirmed!</h2>
              
              <p style="color: #2F1B14; font-size: 16px; line-height: 1.6;">
                Dear ${reservation.name},<br><br>
                Thank you for choosing East At West! Your reservation has been confirmed.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B4513;">
                <h3 style="color: #8B4513; margin-top: 0;">Reservation Details</h3>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Reservation Number:</strong> ${reservation.reservation_number}</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Name:</strong> ${reservation.name}</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Email:</strong> ${reservation.email}</p>
                ${reservation.phone ? `<p style="margin: 8px 0; color: #2F1B14;"><strong>Phone:</strong> ${reservation.phone}</p>` : ''}
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Time:</strong> ${reservation.time}</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Number of Guests:</strong> ${reservation.guests}</p>
                ${reservation.additional_info ? `<p style="margin: 8px 0; color: #2F1B14;"><strong>Additional Information:</strong> ${reservation.additional_info}</p>` : ''}
              </div>
              
              <div style="background: #F5F5DC; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #8B4513; margin-top: 0;">Restaurant Information</h4>
                <p style="margin: 5px 0; color: #2F1B14;">📍 Bld de l'Empereur 26, 1000 Brussels, Belgium</p>
                <p style="margin: 5px 0; color: #2F1B14;">📞 +32 465 20 60 24</p>
                <p style="margin: 5px 0; color: #2F1B14;">✉️ contact@eastatwest.com</p>
              </div>
              
              <p style="color: #8B4513; font-size: 14px; margin-top: 20px;">
                Please arrive on time for your reservation. If you need to cancel or modify your booking, please contact us at least 2 hours in advance.
              </p>
              
              <p style="color: #2F1B14; margin-top: 20px;">
                We look forward to welcoming you to East At West!<br><br>
                Best regards,<br>
                The East At West Team
              </p>
            </div>
          </div>
        `
      },
      fr: {
        subject: `Confirmation de Réservation - ${reservation.reservation_number}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513, #CD853F); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">East At West</h1>
              <p style="color: #FFF8DC; margin: 10px 0 0 0;">Cuisine Libanaise Authentique</p>
            </div>
            
            <div style="padding: 30px; background: #FFF8DC;">
              <h2 style="color: #8B4513; margin-bottom: 20px;">Réservation Confirmée!</h2>
              
              <p style="color: #2F1B14; font-size: 16px; line-height: 1.6;">
                Cher/Chère ${reservation.name},<br><br>
                Merci d'avoir choisi East At West! Votre réservation a été confirmée.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B4513;">
                <h3 style="color: #8B4513; margin-top: 0;">Détails de la Réservation</h3>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Numéro de Réservation:</strong> ${reservation.reservation_number}</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Nom:</strong> ${reservation.name}</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Email:</strong> ${reservation.email}</p>
                ${reservation.phone ? `<p style="margin: 8px 0; color: #2F1B14;"><strong>Téléphone:</strong> ${reservation.phone}</p>` : ''}
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Heure:</strong> ${reservation.time}</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Nombre d'Invités:</strong> ${reservation.guests}</p>
                ${reservation.additional_info ? `<p style="margin: 8px 0; color: #2F1B14;"><strong>Informations Supplémentaires:</strong> ${reservation.additional_info}</p>` : ''}
              </div>
              
              <div style="background: #F5F5DC; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #8B4513; margin-top: 0;">Informations du Restaurant</h4>
                <p style="margin: 5px 0; color: #2F1B14;">📍 Bld de l'Empereur 26, 1000 Bruxelles, Belgique</p>
                <p style="margin: 5px 0; color: #2F1B14;">📞 +32 465 20 60 24</p>
                <p style="margin: 5px 0; color: #2F1B14;">✉️ contact@eastatwest.com</p>
              </div>
              
              <p style="color: #8B4513; font-size: 14px; margin-top: 20px;">
                Veuillez arriver à l'heure pour votre réservation. Si vous devez annuler ou modifier votre réservation, veuillez nous contacter au moins 2 heures à l'avance.
              </p>
              
              <p style="color: #2F1B14; margin-top: 20px;">
                Nous avons hâte de vous accueillir chez East At West!<br><br>
                Cordialement,<br>
                L'équipe East At West
              </p>
            </div>
          </div>
        `
      },
      nl: {
        subject: `Reservering Bevestiging - ${reservation.reservation_number}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8B4513, #CD853F); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">East At West</h1>
              <p style="color: #FFF8DC; margin: 10px 0 0 0;">Authentieke Libanese Keuken</p>
            </div>
            
            <div style="padding: 30px; background: #FFF8DC;">
              <h2 style="color: #8B4513; margin-bottom: 20px;">Reservering Bevestigd!</h2>
              
              <p style="color: #2F1B14; font-size: 16px; line-height: 1.6;">
                Beste ${reservation.name},<br><br>
                Bedankt voor het kiezen van East At West! Uw reservering is bevestigd.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B4513;">
                <h3 style="color: #8B4513; margin-top: 0;">Reservering Details</h3>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Reserveringsnummer:</strong> ${reservation.reservation_number}</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Naam:</strong> ${reservation.name}</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Email:</strong> ${reservation.email}</p>
                ${reservation.phone ? `<p style="margin: 8px 0; color: #2F1B14;"><strong>Telefoon:</strong> ${reservation.phone}</p>` : ''}
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Datum:</strong> ${new Date(reservation.date).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Tijd:</strong> ${reservation.time}</p>
                <p style="margin: 8px 0; color: #2F1B14;"><strong>Aantal Gasten:</strong> ${reservation.guests}</p>
                ${reservation.additional_info ? `<p style="margin: 8px 0; color: #2F1B14;"><strong>Aanvullende Informatie:</strong> ${reservation.additional_info}</p>` : ''}
              </div>
              
              <div style="background: #F5F5DC; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #8B4513; margin-top: 0;">Restaurant Informatie</h4>
                <p style="margin: 5px 0; color: #2F1B14;">📍 Keizerslaan 26, 1000 Brussel, België</p>
                <p style="margin: 5px 0; color: #2F1B14;">📞 +32 465 20 60 24</p>
                <p style="margin: 5px 0; color: #2F1B14;">✉️ contact@eastatwest.com</p>
              </div>
              
              <p style="color: #8B4513; font-size: 14px; margin-top: 20px;">
                Kom alstublieft op tijd voor uw reservering. Als u uw reservering moet annuleren of wijzigen, neem dan minstens 2 uur van tevoren contact met ons op.
              </p>
              
              <p style="color: #2F1B14; margin-top: 20px;">
                We kijken ernaar uit u te verwelkomen bij East At West!<br><br>
                Met vriendelijke groeten,<br>
                Het East At West Team
              </p>
            </div>
          </div>
        `
      }
    }

    const template = templates[language] || templates.en

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
      throw new Error(`Failed to send email: ${error}`)
    }

    const data = await res.json()

    return new Response(
      JSON.stringify({ success: true, emailId: data.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
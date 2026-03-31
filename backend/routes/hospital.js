const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const protect = require('../middleware/auth')
const getDistanceInKm = require('../utils/distance')
const sendEmail = require('../utils/sendEmail')

// POST AN URGENT REQUEST
router.post('/request', protect, async (req, res) => {
  const { blood_type, urgency_level, message, latitude, longitude } = req.body
  const hospitalId = req.user.id

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', hospitalId)
    .single()

  if (profileError) return res.status(400).json({ error: profileError.message })

  if (profile.role !== 'hospital') {
    return res.status(403).json({ error: 'Only hospitals can post requests' })
  }

  const { data, error } = await supabase
    .from('requests')
    .insert({
      hospital_id: hospitalId,
      blood_type,
      urgency_level,
      message,
      latitude,
      longitude
    })
    .select()

  if (error) return res.status(400).json({ error: error.message })

  const { data: donors } = await supabase
    .from('donors')
    .select('*, profiles(name, email)')
    .eq('blood_type', blood_type)
    .eq('is_available', true)

  const nearbyDonors = donors.filter(donor => {
    if (!donor.latitude || !donor.longitude) return false
    const distance = getDistanceInKm(
      parseFloat(latitude),
      parseFloat(longitude),
      donor.latitude,
      donor.longitude
    )
    return distance <= 10
  })

  // ✅ SEND RESPONSE FIRST (ONLY CHANGE)
  res.status(201).json({
    message: 'Request posted successfully',
    request: data[0],
    notified_donors: nearbyDonors.length
  })

  // ❌ REMOVED await loop
  // ✅ SEND EMAILS IN BACKGROUND (ONLY CHANGE)
  nearbyDonors.forEach(donor => {
    if (donor.profiles?.email) {
      sendEmail(
        donor.profiles.email,
        '🚨 Urgent Blood Request Near You!',
        `<html><body><h2>Urgent Blood Request!</h2><p><strong>Hospital:</strong> ${profile.name}</p><p><strong>Blood Type Needed:</strong> ${blood_type}</p><p><strong>Urgency:</strong> ${urgency_level}</p><p><strong>Message:</strong> ${message || 'No additional message'}</p><p>Please log in to respond to this request.</p></body></html>`
      ).catch(err => console.error("Email error:", err))
    }
  })
})

// GET ALL ACTIVE REQUESTS
router.get('/requests', protect, async (req, res) => {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })

  res.status(200).json({ requests: data })
})

// FIND NEARBY DONORS
router.get('/nearby-donors', protect, async (req, res) => {
  const { blood_type, latitude, longitude, radius = 10 } = req.query

  const { data: donors, error } = await supabase
    .from('donors')
    .select('*, profiles(name, phone)')
    .eq('blood_type', blood_type)
    .eq('is_available', true)

  if (error) return res.status(400).json({ error: error.message })

  const nearbyDonors = donors
    .filter(donor => {
      if (!donor.latitude || !donor.longitude) return false
      const distance = getDistanceInKm(
        parseFloat(latitude),
        parseFloat(longitude),
        donor.latitude,
        donor.longitude
      )
      donor.distance_km = parseFloat(distance.toFixed(2))
      return distance <= parseFloat(radius)
    })
    .sort((a, b) => a.distance_km - b.distance_km)

  res.status(200).json({
    total: nearbyDonors.length,
    donors: nearbyDonors
  })
})

// CLOSE A REQUEST
router.put('/request/:requestId/close', protect, async (req, res) => {
  const { requestId } = req.params
  const hospitalId = req.user.id

  const { data: request, error: requestError } = await supabase
    .from('requests')
    .select('*')
    .eq('id', requestId)
    .eq('hospital_id', hospitalId)
    .single()

  if (requestError || !request) {
    return res.status(404).json({ error: 'Request not found or unauthorized' })
  }

  const { error } = await supabase
    .from('requests')
    .update({ is_active: false })
    .eq('id', requestId)

  if (error) return res.status(400).json({ error: error.message })

  res.status(200).json({ message: 'Request closed successfully' })
})

// GET HOSPITAL REQUEST HISTORY
router.get('/history', protect, async (req, res) => {
  const hospitalId = req.user.id

  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      responses (
        status,
        created_at,
        profiles (
          name,
          phone,
          email
        )
      )
    `)
    .eq('hospital_id', hospitalId)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })

  res.status(200).json({ history: data })
})

module.exports = router

// correct working code

// const express = require('express')
// const router = express.Router()
// const supabase = require('../config/supabase')
// const protect = require('../middleware/auth')
// const getDistanceInKm = require('../utils/distance')
// const sendEmail = require('../utils/sendEmail')

// // POST AN URGENT REQUEST
// router.post('/request', protect, async (req, res) => {
//   const { blood_type, organ, urgency_level, message, latitude, longitude } = req.body
//   const hospitalId = req.user.id

//   // Check if user is a hospital
//   const { data: profile, error: profileError } = await supabase
//     .from('profiles')
//     .select('role, name')
//     .eq('id', hospitalId)
//     .single()

//   if (profileError) return res.status(400).json({ error: profileError.message })

//   if (profile.role !== 'hospital') {
//     return res.status(403).json({ error: 'Only hospitals can post requests' })
//   }

//   // Create the request
//   const { data, error } = await supabase
//     .from('requests')
//     .insert({
//       hospital_id: hospitalId,
//       blood_type,
//       organ,
//       urgency_level,
//       message,
//       latitude,
//       longitude
//     })
//     .select()

//   if (error) return res.status(400).json({ error: error.message })

//   // Find nearby donors with matching blood type
//   const { data: donors } = await supabase
//     .from('donors')
//     .select('*, profiles(name, email)')
//     .eq('blood_type', blood_type)
//     .eq('is_available', true)

//   // Filter nearby donors using haversine
//   const nearbyDonors = donors.filter(donor => {
//     if (!donor.latitude || !donor.longitude) return false
//     const distance = getDistanceInKm(
//       parseFloat(latitude),
//       parseFloat(longitude),
//       donor.latitude,
//       donor.longitude
//     )
//     return distance <= 10
//   })

//   // Send email to each nearby donor
//   for (const donor of nearbyDonors) {
//     if (donor.profiles?.email) {
//       await sendEmail(
//         donor.profiles.email,
//         '🚨 Urgent Blood Request Near You!',
//         `<html><body><h2>Urgent Blood Request!</h2><p><strong>Hospital:</strong> ${profile.name}</p><p><strong>Blood Type Needed:</strong> ${blood_type}</p><p><strong>Urgency:</strong> ${urgency_level}</p><p><strong>Message:</strong> ${message || 'No additional message'}</p><p>Please log in to respond to this request.</p></body></html>`
//       )
//     }
//   }

//   res.status(201).json({
//     message: 'Request posted successfully',
//     request: data[0],
//     notified_donors: nearbyDonors.length
//   })
// })

// // GET ALL ACTIVE REQUESTS
// router.get('/requests', protect, async (req, res) => {
//   const { data, error } = await supabase
//     .from('requests')
//     .select('*')
//     .eq('is_active', true)
//     .order('created_at', { ascending: false })

//   if (error) return res.status(400).json({ error: error.message })

//   res.status(200).json({ requests: data })
// })

// // FIND NEARBY DONORS
// router.get('/nearby-donors', protect, async (req, res) => {
//   const { blood_type, latitude, longitude, radius = 10 } = req.query

//   const { data: donors, error } = await supabase
//     .from('donors')
//     .select('*, profiles(name, phone)')
//     .eq('blood_type', blood_type)
//     .eq('is_available', true)

//   if (error) return res.status(400).json({ error: error.message })

//   const nearbyDonors = donors
//     .filter(donor => {
//       if (!donor.latitude || !donor.longitude) return false
//       const distance = getDistanceInKm(
//         parseFloat(latitude),
//         parseFloat(longitude),
//         donor.latitude,
//         donor.longitude
//       )
//       donor.distance_km = parseFloat(distance.toFixed(2))
//       return distance <= parseFloat(radius)
//     })
//     .sort((a, b) => a.distance_km - b.distance_km)

//   res.status(200).json({
//     total: nearbyDonors.length,
//     donors: nearbyDonors
//   })
// })

// // CLOSE A REQUEST
// router.put('/request/:requestId/close', protect, async (req, res) => {
//   const { requestId } = req.params
//   const hospitalId = req.user.id

//   const { data: request, error: requestError } = await supabase
//     .from('requests')
//     .select('*')
//     .eq('id', requestId)
//     .eq('hospital_id', hospitalId)
//     .single()

//   if (requestError || !request) {
//     return res.status(404).json({ error: 'Request not found or unauthorized' })
//   }

//   const { error } = await supabase
//     .from('requests')
//     .update({ is_active: false })
//     .eq('id', requestId)

//   if (error) return res.status(400).json({ error: error.message })

//   res.status(200).json({ message: 'Request closed successfully' })
// })

// // GET HOSPITAL REQUEST HISTORY
// router.get('/history', protect, async (req, res) => {
//   const hospitalId = req.user.id

//   const { data, error } = await supabase
//     .from('requests')
//     .select(`
//       *,
//       responses (
//         status,
//         created_at,
//         profiles (
//           name,
//           phone,
//           email
//         )
//       )
//     `)
//     .eq('hospital_id', hospitalId)
//     .order('created_at', { ascending: false })

//   if (error) return res.status(400).json({ error: error.message })

//   res.status(200).json({ history: data })
// })

// module.exports = router
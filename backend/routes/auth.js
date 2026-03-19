const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const protect = require('../middleware/auth')

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password, name, phone, role } = req.body

  // 1. Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) return res.status(400).json({ error: error.message })

  const userId = data.user.id

  // 2. Save basic info in profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      role,
      name,
      phone,
      email
    })

  if (profileError) return res.status(400).json({ error: profileError.message })

  // 3. If donor, also create a donor record
  if (role === 'donor') {
    const { error: donorError } = await supabase
      .from('donors')
      .insert({
        id: userId
      })

    if (donorError) return res.status(400).json({ error: donorError.message })
  }

  res.status(201).json({ message: 'User registered successfully', user: data.user })
})

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) return res.status(400).json({ error: error.message })

  res.status(200).json({ message: 'Login successful', session: data.session })
})

// GET PROFILE - protected route
router.get('/profile', protect, async (req, res) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single()

  if (error) return res.status(400).json({ error: error.message })

  res.status(200).json({
    message: 'You are logged in!',
    user: profile
  })
})

// GOOGLE AUTH CALLBACK
router.post('/google', async (req, res) => {
  const { access_token } = req.body

  // Exchange Google token for Supabase session
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: access_token
  })

  if (error) return res.status(400).json({ error: error.message })

  const user = data.user
  const session = data.session

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // If first time login create a profile
  if (!existingProfile) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        name: user.user_metadata.full_name,
        email: user.email,
        role: 'donor' // default role, user can change later
      })

    if (profileError) return res.status(400).json({ error: profileError.message })

    // Also create donor record by default
    await supabase
      .from('donors')
      .insert({ id: user.id })
  }

  res.status(200).json({
    message: 'Google login successful',
    session,
    user
  })
})

// COMPLETE PROFILE (for Google Auth users)
router.post('/complete-profile', protect, async (req, res) => {
  const { name, phone, role } = req.body
  const userId = req.user.id
  const email = req.user.email

  // Check if profile already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (existing) {
    return res.status(400).json({ error: 'Profile already exists' })
  }

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      name,
      phone,
      role,
      email
    })

  if (profileError) return res.status(400).json({ error: profileError.message })

  // If donor create donor record
  if (role === 'donor') {
    const { error: donorError } = await supabase
      .from('donors')
      .insert({ id: userId })

    if (donorError) return res.status(400).json({ error: donorError.message })
  }

  res.status(201).json({ message: 'Profile completed successfully' })
})

module.exports = router
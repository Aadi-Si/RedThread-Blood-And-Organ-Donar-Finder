const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const protect = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");
const getDistanceInKm = require('../utils/distance')

// UPDATE DONOR PROFILE
router.put("/profile", protect, async (req, res) => {
  const { blood_type, latitude, longitude, is_available } = req.body;
  const userId = req.user.id;

  const { error } = await supabase
    .from("donors")
    .update({
      blood_type,
      latitude,
      longitude,
      is_available,
    })
    .eq("id", userId);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "Donor profile updated successfully" });
});

// GET DONOR PROFILE
router.get("/profile", protect, async (req, res) => {
  const userId = req.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError)
    return res.status(400).json({ error: profileError.message });

  const { data: donor, error: donorError } = await supabase
    .from("donors")
    .select("*")
    .eq("id", userId)
    .single();

  if (donorError) return res.status(400).json({ error: donorError.message });

  res.status(200).json({
    profile,
    donor,
  });
});

// ACCEPT A REQUEST
router.post("/request/:requestId/accept", protect, async (req, res) => {
  const { requestId } = req.params;
  const donorId = req.user.id;

  const { data: existing } = await supabase
    .from("responses")
    .select("*")
    .eq("request_id", requestId)
    .eq("donor_id", donorId)
    .single();

  if (existing) {
    return res
      .status(400)
      .json({ error: "You have already responded to this request" });
  }

  const { error } = await supabase.from("responses").insert({
    request_id: requestId,
    donor_id: donorId,
    status: "accepted",
  });

  if (error) return res.status(400).json({ error: error.message });

  const { data: request } = await supabase
    .from("requests")
    .select("*, profiles(name, email)")
    .eq("id", requestId)
    .single();

  const { data: donorProfile } = await supabase
    .from("profiles")
    .select("name, phone")
    .eq("id", donorId)
    .single();

  const { data: donorData } = await supabase
    .from("donors")
    .select("blood_type")
    .eq("id", donorId)
    .single();

  // ✅ SEND RESPONSE FIRST (ONLY CHANGE)
  res.status(200).json({ message: "Request accepted successfully" });

  // ❌ REMOVED await
  // ✅ SEND EMAIL IN BACKGROUND (ONLY CHANGE)
  if (request?.profiles?.email) {
    sendEmail(
      request.profiles.email,
      "✅ A Donor is Coming!",
      `
<html>
<body>
<h2>Good News! A donor has accepted your request.</h2>
<p><strong>Donor Name:</strong> ${donorProfile.name}</p>
<p><strong>Donor Phone:</strong> ${donorProfile.phone}</p>
<p><strong>Blood Type:</strong> ${donorData?.blood_type || request.blood_type}</p>
<p>Please be ready to receive the donor.</p>
</body>
</html>
  `
    ).catch(err => console.error("Email error:", err));
  }
});

// REJECT A REQUEST
router.post("/request/:requestId/reject", protect, async (req, res) => {
  const { requestId } = req.params;
  const donorId = req.user.id;

  const { data: existing } = await supabase
    .from("responses")
    .select("*")
    .eq("request_id", requestId)
    .eq("donor_id", donorId)
    .single();

  if (existing) {
    return res
      .status(400)
      .json({ error: "You have already responded to this request" });
  }

  const { error } = await supabase.from("responses").insert({
    request_id: requestId,
    donor_id: donorId,
    status: "rejected",
  });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: "Request rejected" });
});

// GET ALL ACTIVE REQUESTS FOR DONOR
router.get("/requests", protect, async (req, res) => {
  const donorId = req.user.id;

  const { data: donor, error: donorError } = await supabase
    .from("donors")
    .select("*")
    .eq("id", donorId)
    .single();

  if (donorError) return res.status(400).json({ error: donorError.message });

  if (
    !donor.blood_type ||
    !donor.latitude ||
    !donor.longitude ||
    !donor.is_available
  ) {
    return res.status(200).json({
      requests: [],
      message: "Please complete your donor profile to see relevant requests",
    });
  }

  const { data, error } = await supabase
    .from("requests")
    .select("*, profiles(name, phone)")
    .eq("is_active", true)
    .eq("blood_type", donor.blood_type)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  // ✅ ADD THIS
const nearbyRequests = data.filter(request => {
  if (!request.latitude || !request.longitude) return false
  const distance = getDistanceInKm(
    donor.latitude,
    donor.longitude,
    request.latitude,
    request.longitude
  )
  return distance <= 10
})

  res.status(200).json({ requests: nearbyRequests });
});

// GET DONOR DONATION HISTORY
router.get("/history", protect, async (req, res) => {
  const donorId = req.user.id;

  const { data, error } = await supabase
    .from("responses")
    .select(
      `
      *,
      requests (
        blood_type,
        urgency_level,
        message,
        created_at,
        is_active,
        profiles (
          name,
          phone
        )
      )
    `
    )
    .eq("donor_id", donorId)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ history: data });
});

module.exports = router;
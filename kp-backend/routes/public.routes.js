const express = require('express')
const { VALID_SERVICES } = require('../utils/enquiryHelpers')

const router = express.Router()

const SERVICE_DETAILS = {
  'custom-fabrication': {
    title: 'Custom Fabrication',
    description: 'Bespoke steel and metal fabrication tailored to your specifications.',
  },
  'structural-steel': {
    title: 'Structural Steel',
    description: 'Frames, beams, and structural components for commercial and residential builds.',
  },
  'welding-repairs': {
    title: 'Welding & Repairs',
    description: 'On-site and workshop welding repairs for gates, frames, and equipment.',
  },
  'handrails-balustrades': {
    title: 'Handrails & Balustrades',
    description: 'Safety-compliant handrails and decorative balustrades.',
  },
  'gates-fencing': {
    title: 'Gates & Fencing',
    description: 'Security gates, driveway entrances, and perimeter fencing.',
  },
  other: {
    title: 'Other Services',
    description: 'Tell us about your project — we will advise on the best approach.',
  },
}

router.get('/services', (req, res) => {
  const services = VALID_SERVICES.map((id) => ({
    id,
    ...SERVICE_DETAILS[id],
  }))
  res.json(services)
})

module.exports = router

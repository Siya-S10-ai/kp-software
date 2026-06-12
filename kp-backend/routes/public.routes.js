const express = require('express')
const { VALID_SERVICES } = require('../utils/enquiryHelpers')

const router = express.Router()

const SERVICE_DETAILS = {
  'custom-fabrication': {
    imageSrc: 'https://images.unsplash.com/photo-1541888081-9b165243160e?auto=format&fit=crop&q=80&w=800',
    title: 'Custom Fabrication',
    description: 'Bespoke steel and metal fabrication tailored to your specifications.',
  },
  'structural-steel': {
    imageSrc: 'https://images.unsplash.com/photo-1504307651254-35680f356f27?auto=format&fit=crop&q=80&w=800',
    title: 'Structural Steel',
    description: 'Frames, beams, and structural components for commercial and residential builds.',
  },
  'welding-repairs': {
    imageSrc: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    title: 'Welding & Repairs',
    description: 'On-site and workshop welding repairs for gates, frames, and equipment.',
  },
  'handrails-balustrades': {
    imageSrc: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    title: 'Handrails & Balustrades',
    description: 'Safety-compliant handrails and decorative balustrades.',
  },
  'gates-fencing': {
    imageSrc: 'https://images.unsplash.com/photo-1517429128955-67ff5c1e29da?auto=format&fit=crop&q=80&w=800',
    title: 'Gates & Fencing',
    description: 'Security gates, driveway entrances, and perimeter fencing.',
  },
  other: {
    imageSrc: 'https://images.unsplash.com/photo-1533256037611-37eb89745167?auto=format&fit=crop&q=80&w=800',
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

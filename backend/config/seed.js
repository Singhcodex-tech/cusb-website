require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const Admin = require('../models/Admin');
const Notice = require('../models/Notice');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');
const Homepage = require('../models/Homepage');
const Contact = require('../models/Contact');
const QuickAccess = require('../models/QuickAccess');
const PortalUser = require('../models/PortalUser');

const seed = async () => {
  await connectDB();

  // Clear existing
  await Admin.deleteMany({});
  await Notice.deleteMany({});
  await Event.deleteMany({});
  await Announcement.deleteMany({});
  await Homepage.deleteMany({});
  await Contact.deleteMany({});
  await QuickAccess.deleteMany({});
  await PortalUser.deleteMany({});

  // Create superadmin (for CMS)
  const admin = await Admin.create({
    name: 'CUSB Admin',
    email: 'admin@cusb.ac.in',
    password: 'Admin@1234',
    role: 'superadmin'
  });
  console.log('CMS Admin created: admin@cusb.ac.in / Admin@1234');

  // Relative Dates
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Sample notices
  await Notice.insertMany([
    { title: 'CUET 2026–27 Admissions Open', category: 'Admission', isUrgent: true, content: 'Apply before June 30th via CUET portal.', date: new Date(), createdBy: admin._id },
    { title: 'Ph.D Entrance Test 2026', category: 'Academic', isUrgent: false, content: 'Entrance test scheduled for July 15, 2026.', date: new Date(), createdBy: admin._id },
    { title: 'Convocation Ceremony 2026', category: 'General', isUrgent: false, content: 'Registration deadline: May 1, 2026.', date: new Date(), createdBy: admin._id },
    { title: 'NIRF Ranking 2026 Announced', category: 'General', isUrgent: false, content: 'CUSB ranked 151-200 in University Category.', date: new Date(), createdBy: admin._id },
    { title: 'Semester Result Declared', category: 'Examination', isUrgent: false, content: 'Winter semester results now available on student portal.', date: new Date(), createdBy: admin._id },
  ]);

  // ── Events: all hardcoded cards migrated to MongoDB ──
  const d = (daysOffset) => new Date(Date.now() + daysOffset * 86400000);
  await Event.insertMany([
    // ── LIVE / UPCOMING ──
    {
      title: '1st NHRC-CUSB National Moot Court Competition, 2026',
      description: 'A prestigious national moot court competition co-organised with the National Human Rights Commission (NHRC) and CUSB\'s Dept. of Law & Governance. Open to law students across India.',
      date: d(30), category: 'Competition', categoryDisplay: 'Competition · Law',
      emoji: '⚖️', status: 'Upcoming', featured: true, isPast: false,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=952',
      createdBy: admin._id
    },
    {
      title: 'The Web Weavers – Smart Design for Website Development',
      description: 'CUSB invites participation in a competition on smart website design and development. Registration open since 14th February 2026. Open to all CUSB students and beyond.',
      date: d(45), category: 'Competition', categoryDisplay: 'Competition · Technology',
      emoji: '💻', status: 'Upcoming', featured: true, isPast: false,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=935',
      createdBy: admin._id
    },
    {
      title: 'CUSB Admission Bulletin 2026 – CUET-PG Now Open',
      description: 'Admissions for Postgraduate Programmes for Academic Year 2026–27 are now open. Apply through the SAMARTH portal using your CUET-PG 2026 scores.',
      date: d(7), category: 'Admissions', categoryDisplay: 'Admissions · PG 2026–27',
      emoji: '📖', status: 'Live', featured: false, isPast: false,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=894',
      createdBy: admin._id
    },
    {
      title: 'UG & Integrated Programmes Admission 2026–27 (NCET / CUET)',
      description: 'Applications are open for undergraduate and integrated teacher education programmes for AY 2026–27 through NCET-2026 and CUET-UG 2026.',
      date: d(14), category: 'Admissions', categoryDisplay: 'Admissions · UG 2026–27',
      emoji: '🏫', status: 'Live', featured: false, isPast: false,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=918',
      createdBy: admin._id
    },
    {
      title: 'CUET-PG 2026 Examination – March 6 to 27',
      description: 'The Common University Entrance Test (PG) 2026 is underway across India for admission to CUSB postgraduate programmes.',
      date: d(10), category: 'Examination', categoryDisplay: 'Examination · CUET-PG 2026',
      emoji: '🎓', status: 'Live', featured: false, isPast: false,
      sourceLink: 'https://cusbcuet.samarth.edu.in/', sourceLinkText: 'Apply via SAMARTH Portal',
      createdBy: admin._id
    },
    // ── PAST ──
    {
      title: 'CUSB Celebrates its 17th Foundation Day – Pledge of Self-Reliant India',
      description: 'CUSB celebrated its 17th Foundation Day on 27th February 2026 with cultural programmes, addresses by dignitaries, and felicitation of top achievers under the theme of Viksit Bharat.',
      date: d(-90), category: 'Cultural', categoryDisplay: 'Foundation Day · 17th',
      emoji: '🏛️', status: 'Past', featured: true, isPast: true,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=971',
      createdBy: admin._id
    },
    {
      title: 'Three-Day National Conference on AI in Sports Science, Healthcare & Ethics',
      description: 'A three-day national conference "NCS2HCE" organised by the Dept. of Physical Education, CUSB, bringing together experts on AI applications in sport, health, and ethics — Feb 21–23, 2026.',
      date: d(-100), endDate: d(-98), category: 'Seminar', categoryDisplay: 'National Conference · AI & Sports',
      emoji: '🤖', status: 'Past', featured: true, isPast: true,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=970',
      createdBy: admin._id
    },
    {
      title: 'Foundation Day Lecture on Viksit Bharat Shiksha Adhisthan Bill 2025',
      description: 'MMTTC, CUSB organised a Foundation Day lecture exploring the Viksit Bharat Shiksha Adhisthan Bill 2025 and its implications for higher education reform across India.',
      date: d(-95), category: 'Seminar', categoryDisplay: 'Foundation Day Lecture · MMTTC',
      emoji: '📜', status: 'Past', featured: false, isPast: true,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=966',
      createdBy: admin._id
    },
    {
      title: 'Foundation Day Lecture – Dept. of Pharmacy, CUSB',
      description: 'The School of Health Sciences, Dept. of Pharmacy held a Foundation Day lecture celebrating research milestones and academic achievements in pharmaceutical sciences.',
      date: d(-95), category: 'Academic', categoryDisplay: 'Foundation Day · Pharmacy',
      emoji: '💊', status: 'Past', featured: false, isPast: true,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=965',
      createdBy: admin._id
    },
    {
      title: 'Alumni Meet – Department of Biotechnology, CUSB',
      description: 'The Department of Biotechnology hosted its Alumni Meet as part of Foundation Day festivities, reconnecting graduates and celebrating the department\'s research legacy.',
      date: d(-95), category: 'Cultural', categoryDisplay: 'Alumni Meet · Biotechnology',
      emoji: '🧬', status: 'Past', featured: false, isPast: true,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=954',
      createdBy: admin._id
    },
    {
      title: 'Two-Day National Training: Special Service for Children Engaged in Begging',
      description: 'A two-day National Training Programme organised by the Dept. of Sociological Studies, CUSB, focused on child welfare policies and social work interventions for street children.',
      date: d(-95), category: 'Seminar', categoryDisplay: 'National Training · Social Work',
      emoji: '👶', status: 'Past', featured: false, isPast: true,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=953',
      createdBy: admin._id
    },
    {
      title: '4th Alumni Meet 2026 – School of Management, CUSB',
      description: 'The School of Management held its 4th Alumni Meet, bringing together Commerce and Business Studies graduates for networking, mentoring, and industry interactions.',
      date: d(-100), category: 'Cultural', categoryDisplay: 'Alumni Meet · Management',
      emoji: '📊', status: 'Past', featured: false, isPast: true,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=950',
      createdBy: admin._id
    },
    {
      title: 'CUSB Students Excel in UGC NET-JRF December 2025 Examination',
      description: 'Multiple CUSB students qualified in the UGC NET-JRF December 2025, earning Junior Research Fellowships across disciplines.',
      date: d(-85), category: 'Academic', categoryDisplay: 'Academic Achievement · UGC NET',
      emoji: '🏆', status: 'Past', featured: false, isPast: true,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=972',
      createdBy: admin._id
    },
    {
      title: 'CUSB Students Crack CSIR NET-JRF December 2025 Examination',
      description: 'Several CUSB students cleared the CSIR NET-JRF December 2025 Examination, demonstrating excellent training in science research at the university.',
      date: d(-83), category: 'Academic', categoryDisplay: 'Academic Achievement · CSIR NET',
      emoji: '🔬', status: 'Past', featured: false, isPast: true,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=973',
      createdBy: admin._id
    },
    {
      title: 'Patent by Dr. Rohit Ranjan Shahi & Team Published in GOI Journal',
      description: 'A patent by Dr. Rohit Ranjan Shahi and his CUSB research team has been officially published in the Journal of Patent of the Government of India.',
      date: d(-87), category: 'Research', categoryDisplay: 'Research · Patent',
      emoji: '📋', status: 'Past', featured: false, isPast: true,
      sourceLink: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=968',
      createdBy: admin._id
    },
  ]);
  console.log('Events seeded (15 records — all hardcoded cards migrated).');

  // Ticker announcements
  await Announcement.insertMany([
    { text: 'CUET 2026–27 Admissions Open — Apply before June 30th', order: 1, createdBy: admin._id },
    { text: 'Ph.D. Admissions: Entrance Test on July 15, 2026 — Register Now', order: 2, createdBy: admin._id },
    { text: 'National Seminar on "Sustainable Development" — April 12–13, 2026', order: 3, createdBy: admin._id },
    { text: 'NIRF Ranking 2026: CUSB ranked 151–200 in University Category', order: 4, createdBy: admin._id },
    { text: 'Convocation Ceremony 2026 — Registration Deadline: May 1, 2026', order: 5, createdBy: admin._id },
  ]);

  // Homepage sections
  await Homepage.insertMany([
    { section: 'hero', data: { title: 'Central University of South Bihar', subtitle: 'Empowering Minds. Transforming Lives.', tagline: 'Excellence in Education, Research & Innovation', established: '2009', location: 'Gaya, Bihar' } },
    { section: 'stats', data: { students: '5000+', faculty: '200+', departments: '22+', programmes: '80+', established: '2009', ranking: '151-200' } },
    { section: 'about', data: { heading: 'About CUSB', description: 'The Central University of South Bihar (CUSB) was established in 2009 by an Act of Parliament. Located in Gaya, Bihar, the university is committed to excellence in education, research, and innovation.', vision: 'To be a world-class university contributing to knowledge creation and societal development.', mission: 'To provide quality education through innovative teaching, research, and community engagement.' } },
  ]);

  // Contact info
  await Contact.insertMany([
    { section: 'main', data: { address: 'SH-7, Gaya Panchanpur Road, Village – Karhara, Post. Fatehpur, Gaya – 824236, Bihar', phone: '0631-2229530', email: 'registrar@cub.ac.in', website: 'www.cusb.ac.in' } },
    { section: 'social', data: { facebook: 'https://www.facebook.com/cusbofficial', twitter: 'https://twitter.com/CUSBofficial', linkedin: 'https://in.linkedin.com/school/cusb', youtube: 'https://www.youtube.com/user/CUBofficialchannel', instagram: 'https://www.instagram.com/cusbofficialpage' } },
  ]);

  // Quick Access items (as requested by the user)
  await QuickAccess.insertMany([
    { title: 'Admissions Notice', link: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=751&Itemid=616', icon: '📖', order: 1 },
    { title: 'circulars', link: 'https://www.cusb.ac.in/index.php?option=com_content&view=category&id=56&Itemid=621', icon: '📄', order: 2 },
    { title: 'Examination cell', link: 'https://www.cusb.ac.in/index.php?option=com_content&view=article&id=25&Itemid=129', icon: '🎓', order: 3 }
  ]);
  console.log('Quick Access items created.');

  // Portal Users (Student, Faculty, Admin)
  await PortalUser.create([
    { username: 'CUSB26001', password: 'Student@1234', role: 'student', name: 'John Doe', email: 'john.doe@cusb.ac.in', prog: 'B.Tech Computer Science', sem: 'Semester IV' },
    { username: 'faculty@cusb.ac.in', password: 'Faculty@1234', role: 'faculty', name: 'Dr. Sarah Connor', email: 'faculty@cusb.ac.in', prog: 'School of Technology', sem: 'Professor' },
    { username: 'admin@cusb.ac.in', password: 'Admin@1234', role: 'admin', name: 'CUSB Administrator', email: 'admin@cusb.ac.in', prog: 'Administrative Section', sem: 'Administrator' }
  ]);
  console.log('Portal Users created.');

  console.log('✅ Seed complete');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });

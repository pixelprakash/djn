/* All CV content for the /cv/:slug pages (see CvPage.jsx). Kept as plain data so
   the studio's seed script (studio/scripts/build-seed-work-resume.mjs) can read it
   too. An item is normally a string; a few are { text, href }. */
export const PAGES = {

  'educational-qualifications': {
    title: 'Educational Qualifications',
    parent: { label: 'Resume', path: '/resume' },
    sections: [
      {
        heading: 'Professional',
        items: [
          '2012 — Supervisors Training for Practice-Based Ph.D. guidance, University for the Creative Arts, Farnham, UK',
          '2005 — Ph.D. in Design Education. A study of the development and effectiveness of an Instructional strategy on color and form for Design Education',
          '2000 — Faculty Training Program, NID',
        ],
      },
      {
        heading: 'Educational',
        items: [
          '1996 — M.A. Fine Arts (Graphic Arts), M.S. University, Baroda',
          '1994 — B.F.A. (Painting), Fine Arts College, Trivandrum',
          '1990 — B.Sc. (Physics), Mahatma Gandhi University, Kerala',
        ],
      },
      {
        heading: 'Current Responsibilities',
        items: [
          'Professor, Department of Design, IIT Hyderabad (2014 – present)',
          'Adjunct Professor, Dept. of Mech. & Product Design Engineering, Swinburne University (Aug 2022 – present)',
          'Adjunct Professor, IIT Jodhpur (May 2023 – present)',
          'Head of the Department, Department of Design, IIT Hyderabad (2014 – Oct 2022)',
          'Former Head of Photography Department, NID Ahmedabad (2002 – 2013)',
        ],
      },
    ],
  },

  'scholarships-awards': {
    title: 'Scholarships & Awards',
    parent: { label: 'Resume', path: '/resume' },
    sections: [
      {
        heading: 'Grants & Fellowships',
        items: [
          '2012 — Partnership Development Seed Grant by Shastri Foundation — Expanded Connections: Photography and Artists Publications with Peter Sramek, OCAD University, Canada',
          '2011 — UKIERI India UK Study Mission Grant (16,000 GBP), British Council, with Anna Fox, University for the Creative Arts, Farnham UK',
          '2011 — Commonwealth Fellowship for developing a split-site PhD in Photography',
          '2008 — Grant of 50,000 GBP from UKIERI for developing a twin program for Photography Design at NID in collaboration with University for Creative Arts, Farnham UK',
          '1996 — Fellowship & NET for Ph.D. by University Grants Commission',
          '1997 — Nominated for Monbusho Scholarship by Government of India',
          '1998 — Nominated for Chinese Scholarship by Government of India',
        ],
      },
      {
        heading: 'Awards & Recognition',
        items: [
          '2006 — Photography Award, India Habitat Centre',
          '1999 — Young Artist of the Year, Alliance Française, New Delhi',
          '1997 — Kanoria Scholarship, Kanoria Art Centre, Ahmedabad',
          '1996 — Inlaks Fine Arts Award',
          '1994 — National Scholarship for Young Artists, Ministry of Human Resources, Government of India',
        ],
      },
    ],
  },

  'professional-experience': {
    title: 'Professional Experience',
    parent: { label: 'Resume', path: '/resume' },
    sections: [
      {
        heading: 'Logo & Identity Design',
        items: [
          '2020 — Logo Design for MDMS, Indian Council of Medical Research, Government of India',
          '2020 — Logo Design for CKM-VIGIL, IIT Hyderabad',
          '2019 — Logo Design for IIIT Raichur, Government of India',
          '2017 — Logo Design for Asia-Pacific Applied Economics Association (APAEA)',
          '2015 — Logo Design for IIT Bhilai, Government of India',
          '2015 — Logo Design for Centre for Healthcare Entrepreneurship, IIT Hyderabad',
          '2013 — Logo Design for National Rifle Association of India',
          '2011 — Logo Design for Bank Note Paper Mills, RBI, Government of India',
          '2011 — Logo Design for THDC, Tehri, Dehradun, Government of India',
          '2010 — Logo Design for 50 Years IIM Kolkata',
          '2009 — Logo Design for Cancer Foundation of India',
          '2009 — Logo Design for Mid-Day Meal Scheme, Government of India',
          '2009 — Logo Design for National Literacy Mission, Government of India',
        ],
      },
      {
        heading: 'Curatorial & Editorial',
        items: [
          '2012 — Curated the Photography Section at the United Art Fair 2012',
          '2012 — Organised an international conference on Photography of India (UCA, ICP, NYU, British Council)',
          '2010–2014 — Researching the History of Indian Studio Photography',
          '2009 — Mentor in India for the Tierney Fellowship USA',
          '2009 — Advisor to Kerala State Institute of Design',
          '2008 — Curated Exhibition of Henri Cartier-Bresson photographs at Design Gallery NID (Magnum, French Embassy, Alliance Française)',
          '2008 — Curated Exhibition of Anne Manigliér photographs at NID Aquarium',
          '2007 — Curated Exhibition of photographs of Raghu Rai at Design Gallery, NID Ahmedabad',
          '2006 — Governing Council Member, Art Labs, Chennai',
        ],
      },
      {
        heading: 'Publishing & Editing',
        items: [
          '2008 — Photo Editor, Ananya — a book on girl child, Ministry of Women and Child Welfare',
          '2008 — Photo Coordination, Hand Made in India (Aditi Ranjan & M.P. Ranjan)',
          '2008 — Photo Coordinator, Indian Design Edge by Dr. Darlie O Koshy, Rolli Publishers',
          '2009 — Photography, Indian Saris: Design + Perspectives, Wisdom Tree',
          '2005–2008 — Photo Editor, Design Plus, NID',
          '2009 — Photo Editor, D-Sign Design Six Monthly, NID',
          '2007–2008 — Photo Coordinator, Spectrum (monthly), Knowledge Management Centre NID',
        ],
      },
      {
        heading: 'Practice',
        items: [
          '1992 onwards — Professional Artist, freelance; participated in national and international exhibitions',
          '1992 onwards — Freelance Photographer: Fashion, product, corporate and industrial photography',
          '1992–1994 — Freelance Art Director, Asianet TV Channel',
        ],
      },
    ],
  },

  'teaching-experience': {
    title: 'Teaching Experience & Permanent Posts',
    parent: { label: 'Resume', path: '/resume' },
    sections: [
      {
        heading: 'Permanent Positions',
        items: [
          '2017 – present — Professor, Department of Design, IIT Hyderabad',
          '2014 – 2017 — Associate Professor, Department of Design, IIT Hyderabad',
          '2007 – 2013 — Associate Senior Faculty, National Institute of Design',
          '2004 – 2007 — Faculty, National Institute of Design',
          '2002 – 2004 — Associate Faculty, National Institute of Design',
          '2000 – 2002 — Faculty Development Program, National Institute of Design',
        ],
      },
    ],
  },

  'thesis-guidance': {
    title: 'Thesis Guidance',
    parent: { label: 'Resume', path: '/resume' },
    sections: [
      {
        heading: 'PhD & Masters Supervision',
        items: [
          'Graduated 5 Ph.D. students at CEPT University and IIT Hyderabad',
          'Guided student on web-based application for photo management for US-based clients (New Media)',
          'Guided a student on development of a plug-in module for school children in India — Strategic Design Management',
          'Guided 50 students in the Photography Design discipline',
          'Currently guiding 11 Ph.D. and 10 M.Des. students in Design discipline',
        ],
      },
    ],
  },

  'visiting-appointments': {
    title: 'Visiting Appointments',
    parent: { label: 'Resume', path: '/resume' },
    sections: [
      {
        heading: 'Visiting Roles',
        items: [
          '2014 — College of Fine Arts, Thrissur',
          '2013 — College of Fine Arts, Trivandrum',
          '2013 — MRID, Faculty of Fine Arts, M.S. University of Baroda',
          '2012 — Raja Ravi Verma College of Fine Arts, Mavelikkara',
          '2010 — CEPT University, Ahmedabad',
          '2009 — University for the Creative Arts, Farnham, UK',
          '2006 — D & A College, Christchurch, New Zealand',
          '2006 — IIT Kanpur',
          '2006 — Art Labs, Chennai',
          '2005–2006 — IPSA Rajkot / NSID Rajkot',
          '1998 — Navrachna School',
          '1992–1994 — Vinobha Nikethan, Trivandrum',
        ],
      },
    ],
  },

  'sponsored-projects': {
    title: 'Sponsored Projects',
    parent: { label: 'Work', path: '/work' },
    sections: [
      {
        heading: 'As Principal Investigator',
        items: [
          '2022 — Integrating AI, AR and VR in learning models and their impact, DSIR, Dept. of Science and Technology (₹23.1 Lakhs)',
          '2022 — Design and creation of a master plan for Keoladeo National Park (Bharatpur) as a world-class Wetland Birds Conservation Centre, Government of Rajasthan (₹35 Lakhs)',
          '2019 — Sitar National Camp 2019, Directorate of Higher Secondary Education, Government of Kerala (₹6 Lakhs)',
          '2019 — World Design Organization (Government of Telangana) — 2 projects (₹3 Lakhs + ₹3 Lakhs)',
          '2018 — Tangible and Intangible Heritage of Telangana — a Visual Documentation and Design Intervention (₹28 Lakhs)',
          '2017 — Passenger Drone Project (₹25 Lakhs)',
          '2016 — Design Innovation Center, Ministry of Education (₹10 Crores)',
        ],
      },
      {
        heading: 'As Co-Principal Investigator',
        items: [
          '2019 — Design and Fabrication of Autonomous Passenger Drone (₹8.5 Crore)',
        ],
      },
    ],
  },

  'solo-shows': {
    title: 'Solo Shows',
    parent: { label: 'Work', path: '/work' },
    sections: [
      {
        heading: 'Solo Exhibitions',
        items: [
          '2013 — "Doob Gaya Hum Duba Diya Hum Ne", Alliance Française Gallery, Ahmedabad',
          '2012 — "Missing Interiors", Corner Stone Gallery, Hope University, Manchester',
          '2008 — Alliance Française Gallery, Ahmedabad',
          '1998 — Nazar Gallery, Baroda',
          '1994 — Fine Arts College Gallery, Trivandrum',
        ],
      },
    ],
  },

  'selected-exhibitions': {
    title: 'Selected Exhibitions',
    parent: { label: 'Work', path: '/work' },
    sections: [
      {
        heading: 'Group Shows & Exhibitions',
        items: [
          '2022 — MERAK, group show curated by Shijo Jacob, Kerala',
          '2022 — "The Road Less Traveled", International Exhibition of Prints, curated by Sunil Lal T.R., Lalit Kala Akademi Kerala',
          '2015 — Invited to exhibit at Pune Biennale',
          '2015 — "Go Tell It on the Mountain", Balgandharva Art Gallery',
          '2014 — "Thekkan Kaattu", Birla Academy, Kolkata',
          '2013 — "Merging Submerging", Art Konsult, New Delhi (curated by Johny ML)',
          '2012 — "Mind the Gap", United Art Fair, New Delhi (curated by Johny ML)',
          '2012 — "Roti Kapada Makan", Ojas Art Gallery, New Delhi (curated by Anubhav Nath)',
          '2011 — "A for Arple", Gallery Ragini (curated by Johny ML)',
          '2011 — SOFA Show at India Art Fair (curated by Johny ML)',
          '2011 — "Lens-ing It.." at Aashna Gallery (curated by Johny ML)',
          '2011 — National Exhibition, Lalit Kala Akademi, New Delhi',
          '2010 — Whitechapel Gallery, London & Foto Museum Winterthur, Switzerland — "Where Three Dreams Cross: 150 Years of Photography from India, Pakistan and Bangladesh"',
          '2001 — Group show at IGNCA, New Delhi',
          '2000 — State Exhibition of Art, Gujarat Lalit Kala Akademi',
          '1999 — Carte Blanche Aux Jeunes Créateurs, Alliance Française, New Delhi',
          '1998 — National Exhibition of Art, Lalit Kala Academy, New Delhi',
          '1997 — All India Exhibition of Prints, AIFACS, New Delhi',
          '1995 — International Biennale of Prints, Bharat Bhavan, Bhopal',
          '1995–1997 — All India Exhibition of Art by AIFACS, New Delhi',
          '1992–2000 — State Exhibition of Art, Kerala Lalit Kala Academy (multiple years)',
          '1994 — National Exhibition of Painting, Kerala Tourism',
        ],
      },
    ],
  },

  'books': {
    title: 'Books',
    parent: { label: 'Resume', path: '/resume' },
    sections: [
      {
        heading: 'Authored & Contributed Books',
        items: [
          '2010 — Principles of Design Through Photography, Wisdom Tree',
          '2019 — A Contrarian IIT: Celebrating 10 Years of the Institute (IIT Hyderabad), Wisdom Tree',
        ],
      },
    ],
  },

  'papers-publications': {
    title: 'Papers & Publications',
    parent: { label: 'Resume', path: '/resume' },
    sections: [
      {
        heading: 'Selected Papers (2023–2026)',
        items: [
          '2026 — Visual Ethnography of the Dandari Gusadi Festival of the Raj Gonds of Telangana, India: Focusing on the Social and Ceremonial Cultural Expressions — Visual Studies, Taylor & Francis',
          '2026 — Cover photograph, "Gusai Mauk Dancing at the Dandari Gusadi Festival, Adilabad Telangana," published on the cover of Visual Studies, Vol. 41, Issue 2 — Taylor & Francis',
          '2026 — Rethinking Craft Identity through the Case of Dhoolpet Idol Makers in Hyderabad — 20th International Conference on Design Principles & Practices',
          '2026 — Reclaiming the Canvas: Evaluating Design Assessment and Creative Capital in Telangana’s Specialized Welfare Schools — UC-HDSF 2026',
          '2026 — Frugal Immersion: A Low-Cost, Smartphone-Based Virtual Reality Physics Lesson for Equitable Learning in Telangana Government Schools — UC-HDSF 2026',
          { text: '2025 — Human-Centred Design Approach: A Comprehensive Review on Enhancing the UAM Aircraft Experience for Indian Passengers — ICoRD 2025', href: 'https://doi.org/10.1007/978-981-96-6414-6_17' },
          { text: '2025 — Displaying Indigenous Heritage: Analysing Discourse on Cultural Heritage, Community Involvement, and Indigenous Representation in Museum Exhibition Design — ICoRD 2025', href: 'https://doi.org/10.1007/978-981-96-5511-3_23' },
          { text: '2025 — Empowering Dhokra Artisans: A Design-led Intervention Workshop for Enhancing Sustainable Livelihoods in the Ojha Community of Adilabad, Telangana — ICoRD 2025', href: 'https://doi.org/10.1007/978-981-96-5507-6_10' },
          { text: '2025 — Immersive Learning in Indian Schools: Exploring Approaches to Education Using AR and VR — Futuring Design Education 2024, IIT Delhi', href: 'https://doi.org/10.1007/978-981-97-9206-1_38' },
          '2025 — A Comprehensive Assessment of Technology-Enhanced Experiential Learning in Education — ICoRD 2025',
          { text: '2025 — Exploring Urban Air Mobility: A Proposal for Dual Landing Capabilities on Different Surfaces — ICoRD 2025', href: 'https://doi.org/10.1007/978-981-96-5487-1_20' },
          { text: '2025 — Study and Evaluation of User Perception of Light and Shadow on the Shape and Form of Physical Products in Industrial Product Design — ICoRD 2025', href: 'https://doi.org/10.1007/978-981-96-6511-2_43' },
          { text: '2025 — Bio-Wiz Framework for Industrial Design Practices: Bio-wisdom to Product Innovation — The International Journal of Designed Objects, Common Ground Research Network', href: 'https://doi.org/10.18848/2325-1379/CGP/v19i02/123-144' },
          { text: '2025 — Designing Futures: A Scoping Review and a Canvas for Scenario Building — Futuring Design Education Conference, Springer Nature Singapore', href: 'https://link.springer.com/chapter/10.1007/978-981-97-9210-8_9' },
          { text: '2025 — Innovating Air Traffic Management for Urban Air Mobility in Indian Cities: A Literature Review and Hypothetical Alternative Solutions for Low-Altitude Airspace — ServDes.2025 Service Design and Innovation Conference', href: 'https://doi.org/10.21606/servdes2025.79' },
          '2024 — Transforming Education through Virtual Reality in Indian Middle Schools in Telangana: Development and Testing Their Effectiveness — DAAD iHED Conference 2024',
          '2023 — Transforming Education through Virtual Reality: A Study of Integrating VR in Indian Government Schools — JoLII-GINTL Global Conference 2023, Finland',
        ],
      },
      {
        heading: 'Patents',
        items: [
          '2025 — Autonomous Advanced Air Mobility — Design Patent Granted, India',
          '2024 — Urban Air Mobility Aircraft — Design Patent Granted, India',
        ],
      },
      {
        heading: 'Selected Papers (2019–2023)',
        items: [
          '2023 — Virtual reality for creativity practice and art and design education: a literature review — ICoRD 2023',
          '2023 — Games as inherent learning environments: A thematic analysis in India — ICoRD 2023',
          '2022 — A critical review of National Education Policy 2020: role of 21st-century skills and scope of design education — International Journal of Design Education',
          '2022 — Factors influencing the exterior design of autonomous passenger drones — Proceedings of the Design Society',
          '2022 — Design Briefs: Review, Reframing and Analysis of a Study — International Journal of Design Education',
          '2022 — Table for Two — A parallel interactive narrative in VR (PIN VR) — The Changing Face of VR',
          '2021 — Enhancing creative learning methods by immersive virtual reality: A pilot study — ICoRD 2021',
          '2021 — Bio-bricks: Circular economy and new products — ICoRD 2021',
          '2021 — Digital preservation of the Qutb Shahi monuments — ICoRD 2021',
          '2020 — Users Survey for Development of Passenger Drones — Proceedings of the Design Society: DESIGN Conference',
          '2019 — Bio-Brick: Development of sustainable and cost-effective building material — ICED 2019',
          '2019 — A study on consumer awareness towards green fashion in India — ICoRD 2019',
          '2017 — Evolution of design briefs: Expressions from professional design practice — ICoRD 2017',
        ],
      },
      {
        heading: 'Articles & Columns',
        items: [
          '2013–2014 — "Spaces and Frames" — 8-part column, Indian Architecture and Builder',
          '2012–2013 — "In Loving Memory Of" — 10-part column, Indian Architecture and Builder',
          '2011–2012 — "Urban Village" — 12-part column, Indian Architecture and Builder',
          '2013 — "The Study and Practice of Photography in Indian Context", Take on Art, Vol. 3, Issue 12',
          '2013 — "Gen-X Documentary Photography", Art and Deal, September 2013',
          '2011 — "Images of Exoticism: Early Indian Photography", Trellis Vol. 2',
        ],
      },
    ],
  },

  'training-programs': {
    title: 'Training Programs',
    parent: { label: 'Resume', path: '/resume' },
    sections: [
      {
        heading: 'Workshops & Training',
        items: [
          '2013 — "Avant Garde 2013" — Visual Imaging Convention on Photography & Photojournalism, IIT Gandhinagar',
          '2013 — Traditional Printing Workshop, Chobi Mela, Dhaka',
          '2011, 2012 — Workshop "Always Carry Your Camera", IP&P, NID',
          '2006, 2008 — Product Photography Workshop for Professionals, IP&P, NID',
          '2009, 2010 — Architecture Photography Workshop, IP&P, NID',
          '2003–2010 — Basic Photography Workshops, IP&P, NID (multiple years)',
          '2007 — Product Development Workshop, Kalamkhush Papermaking',
          '2007 — Training Program for Professional Photographers, Kerala',
          '2006 — Photography Workshop, IIT Kanpur',
          '2005 — Lectures on Design Education and Teaching-Learning Methods, Design & Art College, New Zealand',
          '2005 — Documentary Photography Workshop for Professionals, NID Ahmedabad',
          '2005 — Digital Photography Workshop, IIM Ahmedabad',
          '1999 — Organised Artists Camp at Thekkady with Kerala Forest Department',
        ],
      },
    ],
  },

  'conferences-journals': {
    title: 'Conferences & Journals',
    parent: { label: 'Resume', path: '/resume' },
    sections: [
      {
        heading: '2023',
        items: [
          'Happy Bin, remodifying social behaviors — ICoRD 2023',
          'A Critical Review of National Education Policy 2020 — International Journal of Design Education',
          'Testing the Effectiveness of a Design Subject Towards Achieving 21st Century Skills — ICoRD 2023',
          'A Visual Design Analysis of Urban Air Mobility for Indian Passengers — ICoRD 2023',
          'Study and Evaluation of UX Design for Autonomous Passenger Drone Interior — ICoRD 2023',
          'Insider-Insider Observations from Table for Two (PIN VR) — ICoRD 2023',
        ],
      },
      {
        heading: '2022',
        items: [
          'Habit and perception towards games and game-based learning in India — DiGRA, Krakow, Poland',
          'An exploratory study using "Tattva Bhoomi" RPG to improve middle school learning — Innovations Journal',
          'Games as an inherent learning environment: thematic analysis — ICoRD 9th',
          'First-person RPG to improve learning: quasi-experimental study — Participatory Design Conference, India',
          'Workshop on Design Education — Asian Design Education Conference, NTU Singapore & IIT Bombay',
        ],
      },
      {
        heading: '2021',
        items: [
          'Curated Exhibition on Shyamsunderdas Archives — International Photo Festival, Hyderabad',
          'Design Intervention workshop for Ojha Gonds of Adilabad',
          'Teachers Training Program for Form Education at DAV School — IIC and DIC',
          'Design Teaching Program for School Children at DAV School — IIC and DIC',
        ],
      },
      {
        heading: '2020',
        items: [
          'Handholding Workshop for DIC Spokes, Ministry of Education',
          'Sitar National Camp 2019, Directorate of Higher Secondary Education, Kerala',
          'National Jury Member for Wacom Design Challenge 2020',
          'ICoRD 2020 — Session Chair',
          'National Webinar on Visual Arts',
          'National Conference on Innovation in Visual Arts (NCIVA)',
        ],
      },
    ],
  },
}

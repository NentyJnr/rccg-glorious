export interface GalleryPhoto {
  id: string;
  src: string;
  thumbnail: string;
  title: string;
  caption: string;
  photographer?: string;
}

export interface ProgramAlbum {
  id: string;
  title: string;
  shortTitle: string;
  tag: string;
  date: string;
  coverImage: string;
  description: string;
  externalDriveUrl: string;
  photos: GalleryPhoto[];
}

// Curated high-resolution photo IDs representing vibrant African Christian youth ministry:
// worship, high praise, prayer, choir, drama, evangelism, fellowship, community.
const worshipPhotoSeeds = [
  '8815046', '10353711', '18751058', '17026870', '7849436',
  '7195133', '7195129', '7195130', '8815049', '8815042',
  '8815048', '8815045', '7195135', '7195131', '8815044',
  '10353712', '10353713', '10353714', '18751059', '18751060',
  '17026871', '17026872', '7849437', '7849438', '7849439',
  '8815047', '8815043', '8815041', '8815050', '8815051',
  '7195134', '7195132', '7195136', '7195137', '7195138',
  '10353715', '10353716', '18751061', '18751062', '18751063',
  '17026873', '17026874', '7849440', '7849441', '7849442',
  '8815052', '8815053', '8815054', '8815055', '8815056'
];

const unsplashWorshipIds = [
  '1534528741775-53994a69daeb', '1507003211169-0a1dd7228f2d', '1517841905240-472988babdf9', '1539571696357-5a69c17a67c6',
  '1529156069898-49953e39b3ac', '1511632765486-a01980e01a18', '1492684223066-81342ee5ff30', '1494790108377-be9c29b29330',
  '1508214751196-bcfd4ca60f91', '1524504388940-b1c1722653e1', '1522202176988-66273c2fd55f', '1528605248644-14dd04022da1',
  '1519389950473-47ba0277781c', '1523240795612-9a054b0db644', '1531545514256-b1400bc00f31', '1517486808906-6ca8b3f04846',
  '1521737604893-d14cc237f11d', '1522071820081-009f0129c71c', '1543269865-cbf427effbad', '1573496359142-b8d87734a5a2',
  '1573497019940-1c28c88b4f3e', '1582213782179-e0d53f98f2ca', '1544717305-2782549b5136', '1544717302-de2939b7ef71',
  '1516251193007-45ef944ab0c6', '1516726817505-f5ed825624d8', '1517245386807-bb43f82c33c4', '1517048676732-d65bc937f952',
  '1491438590914-bc09fcaaf77a', '1475721027785-f74eccf877e2', '1465847899084-d164df4dedc6', '1499209974431-9dddcece7f88',
  '1506869640319-fe1a24fd76dc', '1485217988980-11786ced9454', '1463453091185-61582044d556', '1501386761578-eac5c94b800a',
  '1464366400600-7168b8af9bc3', '1472099645785-5658abf4ff4e', '1470225620780-dba8ba36b745', '1468818519844-64bc429824de',
  '1468245856972-a0333f3f8293', '1464375117522-1311d6a5b81f', '1464207687429-7505649dae38', '1464047736614-af63a29805bf',
  '1461896836934-ffe607ba8211', '1457195740890-4865c07917ad', '1455390582262-044cdead277a', '1453733197804-0d869704e32d',
  '1446776811953-b23d57bd21aa', '1442458017215-285b83f65851'
];

function generate50Photos(
  albumPrefix: string,
  categoryTitle: string,
  keywords: string[]
): GalleryPhoto[] {
  return Array.from({ length: 50 }, (_, i) => {
    const unsplashId = unsplashWorshipIds[i % unsplashWorshipIds.length];
    const pexelsId = worshipPhotoSeeds[i % worshipPhotoSeeds.length];
    // Alternate between high quality Unsplash portraits & Pexels community shots
    const src =
      i % 2 === 0
        ? `https://images.unsplash.com/photo-${unsplashId}?auto=format&fit=crop&w=1200&q=80`
        : `https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
    
    const thumbnail =
      i % 2 === 0
        ? `https://images.unsplash.com/photo-${unsplashId}?auto=format&fit=crop&w=200&h=140&q=70`
        : `https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=200&h=140&fit=crop`;

    const keyword = keywords[i % keywords.length];

    return {
      id: `${albumPrefix}-photo-${i + 1}`,
      src,
      thumbnail,
      title: `${categoryTitle} — Moment ${i + 1}`,
      caption: `${keyword} captured live during ${categoryTitle} at RCCG Glorious Church Youth Fellowship.`,
      photographer: i % 3 === 0 ? 'Glorious Media Vanguard' : i % 3 === 1 ? 'Youth Creative Team' : 'Parish Press'
    };
  });
}

export const youthAlbums: ProgramAlbum[] = [
  {
    id: 'awake-3-0',
    title: 'AWAKE 3.0 · High Praise Revival Convergence',
    shortTitle: 'AWAKE 3.0',
    tag: 'Faith & Worship',
    date: '16–18 OCT 2026',
    coverImage: 'https://images.pexels.com/photos/8815046/pexels-photo-8815046.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      '50 curated moments of explosive prophetic praise, deep worship, youth drama, and grand thanksgiving from AWAKE 3.0 at RCCG Glorious Church Auditorium.',
    externalDriveUrl: 'https://drive.google.com/drive/folders/rccg-glorious-awake-3-0-full-archive',
    photos: generate50Photos('awake3', 'AWAKE 3.0', [
      'Passionate Vigil Praise',
      'Min. Christopher Yinka Philip & Youth Leaders',
      'Glorious Youth Drama Ministration',
      'Youth Choir Psalmists in Unbroken Praise',
      'Congregational Worship & Impartation',
      'Joyful Thanksgiving & Prophetic Decrees',
      'Spiritual Warfare & Anointing Session',
      'Guest Ministers in Holy Reverence'
    ])
  },
  {
    id: 'awake-3-0-outreach',
    title: 'Awake 3.0 Outreach · Street Evangelism & Welfare',
    shortTitle: 'Awake 3.0 Outreach',
    tag: 'Outreach Day',
    date: '16 OCT 2026',
    coverImage: 'https://images.pexels.com/photos/7849436/pexels-photo-7849436.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      '50 candid scenes of vibrant youths taking the gospel to the streets, distributing food, interceding for commuters, and ministering Christ along Lekki-Epe Expressway during AWAKE 3.0.',
    externalDriveUrl: 'https://drive.google.com/drive/folders/rccg-glorious-awake-3-0-outreach-archive',
    photos: generate50Photos('awake3outreach', 'Awake 3.0 Outreach', [
      'Street Evangelism along Eputu Corridor',
      'Compassionate Welfare Distribution',
      'Praying with Market Men & Women',
      'Student Campus Evangelism Teams',
      'Youths United in Mission T-Shirts',
      'Hospital Outreach & Healing Prayers',
      'Sharing Salvation Tracts & Bibles',
      'Joyful Souls Won into the Kingdom'
    ])
  },
  {
    id: 'awake-2-0',
    title: 'AWAKE 2.0 · Divine Encounter & Praise Altar',
    shortTitle: 'AWAKE 2.0',
    tag: 'Revival Convergence',
    date: 'OCT 2025',
    coverImage: 'https://images.pexels.com/photos/10353711/pexels-photo-10353711.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      '50 unforgettable photos of intense praise, prophetic worship, midnight prayer vigils, and life-transforming impartation from AWAKE 2.0.',
    externalDriveUrl: 'https://drive.google.com/drive/folders/rccg-glorious-awake-2-0-archive',
    photos: generate50Photos('awake2', 'AWAKE 2.0', [
      'High Energy Revival Praise',
      'Prophetic Word Ministration',
      'Youth Leaders on Bended Knees',
      'Choir Symphony of Grace',
      'Miracle Healing Testimonies',
      'Youth Choir Leading Congregational Anthems',
      'Anointing & Commissioning of Leaders',
      'Joyful After-Meeting Fellowship'
    ])
  },
  {
    id: 'awake-1-0',
    title: 'AWAKE 1.0 · The Genesis of Revival',
    shortTitle: 'AWAKE 1.0',
    tag: 'Revival Convergence',
    date: 'OCT 2024',
    coverImage: 'https://images.pexels.com/photos/18751058/pexels-photo-18751058.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      '50 pioneering photos capturing the launch, inaugural praise altars, and foundational spiritual encounters of the AWAKE youth movement.',
    externalDriveUrl: 'https://drive.google.com/drive/folders/rccg-glorious-awake-1-0-archive',
    photos: generate50Photos('awake1', 'AWAKE 1.0', [
      'Inaugural AWAKE Worship Session',
      'Pioneer Youth Team Intercession',
      'Acoustic Altar Songs',
      'Congregational Tears of Surrender',
      'Foundational Prophetic Declarations',
      'Lighting the Youth Ministry Torch',
      'Fellowship Banquet & Group Portraits',
      'Thanksgiving to the God of RCCG Glorious'
    ])
  },
  {
    id: 'prayer-walk-2026',
    title: 'Annual Prayer Walk 2026 · Interceding for Our Land',
    shortTitle: 'Annual Prayer Walk 2026',
    tag: 'Prayer Walk',
    date: '14 MAR 2026',
    coverImage: 'https://images.pexels.com/photos/17026870/pexels-photo-17026870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      '50 dynamic photos of youths walking through the community in prayer, bearing faith placards, speaking peace over Lekki-Epe expressway, and claiming territory for Christ.',
    externalDriveUrl: 'https://drive.google.com/drive/folders/rccg-glorious-prayer-walk-2026-archive',
    photos: generate50Photos('prayerwalk', 'Annual Prayer Walk 2026', [
      'Gathering at Church Gates at Dawn',
      'Lifting Holy Hands on the Highway',
      'Praying for Peace and Economic Breakthrough',
      'Marching Youths with Gospel Banners',
      'Interceding for Schools and Families',
      'Spontaneous High Praise along the Route',
      'Corporate Shouts of Victory',
      'Return to Altar for Closing Thanksgiving'
    ])
  },
  {
    id: 'end-of-year-2025',
    title: '2025 Youth End of the year Gathering · Thanksgiving & Awards Banquet',
    shortTitle: '2025 Youth End of the year Gathering',
    tag: 'End of Year',
    date: '19 DEC 2025',
    coverImage: 'https://images.pexels.com/photos/7195133/pexels-photo-7195133.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description:
      '50 joyous photos celebrating God’s faithfulness throughout 2025: glamorous red carpet, awards presentation, youth dinner, carols, testimonies, and games.',
    externalDriveUrl: 'https://drive.google.com/drive/folders/rccg-glorious-end-of-year-2025-archive',
    photos: generate50Photos('eoy2025', '2025 Youth End of the year Gathering', [
      'Red Carpet Arrivals & Glamorous Smiles',
      'Youth President Welcome Address',
      'Excellence & Service Awards Ceremony',
      'Carols & Acoustic Special Numbers',
      'Youth Dinner Banquet & Feasting',
      'Fun Interactive Trivia & Games',
      'Testimonies of Miracles in 2025',
      'Closing Anointing & Prophetic Decrees for 2026'
    ])
  },
  {
    id: 'youth-community',
    title: 'Chosen Family · Community & Fellowship',
    shortTitle: 'Chosen Family',
    tag: 'Youth Community',
    date: 'Weekly Gatherings',
    coverImage: 'https://images.pexels.com/photos/8815049/pexels-photo-8815049.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      '50 candid photos of laughter, Christian bonding, interactive small groups, mentor talks, and genuine sisterhood and brotherhood among Glorious Youths.',
    externalDriveUrl: 'https://drive.google.com/drive/folders/rccg-glorious-youth-community-archive',
    photos: generate50Photos('community', 'Chosen Family', [
      'Interactive Roundtable Discussions',
      'Laughter & Pure Christian Fellowship',
      'Mentorship & Life Questions Session',
      'Youth Board Games & Fellowship Night',
      'Prayer Partners Interceding in Pairs',
      'Welcoming First-Timers with Warm Hugs',
      'Youth Leadership Council in Strategy',
      'Sunday Fellowship Hangouts'
    ])
  },
  {
    id: 'fellowship',
    title: 'Growing Together · Discipleship & Fellowship',
    shortTitle: 'Growing Together',
    tag: 'Fellowship',
    date: 'Bi-Weekly Circles',
    coverImage: 'https://images.pexels.com/photos/8815045/pexels-photo-8815045.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      '50 inspiring photos of youth fellowship circles, Bible deep dives, personal accountability groups, and shared testimonies of God’s goodness.',
    externalDriveUrl: 'https://drive.google.com/drive/folders/rccg-glorious-youth-fellowship-archive',
    photos: generate50Photos('fellowship', 'Growing Together', [
      'Heartfelt Word Discussions',
      'Bible Study in Small Circles',
      'Praying for One Another',
      'Sharing Triumphs & Challenges',
      'Mentors Guiding Young Believers',
      'Friendships Rooted in Faith',
      'Laughter and Shared Meals',
      'Spiritual Growth Milestones'
    ])
  },
  {
    id: 'sunday-gathering',
    title: 'One Body · Sunday Youth Celebration',
    shortTitle: 'One Body',
    tag: 'Sunday Gathering',
    date: 'Every Sunday',
    coverImage: 'https://images.pexels.com/photos/8815042/pexels-photo-8815042.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      '50 vibrant photos of Sunday worship services, youth choir ministrations, energetic band musicians, and multi-generational church life at RCCG Glorious Church.',
    externalDriveUrl: 'https://drive.google.com/drive/folders/rccg-glorious-sunday-gathering-archive',
    photos: generate50Photos('sunday', 'One Body', [
      'Youth Choir in Full Vocal Harmony',
      'Band Instrumentalists Glorifying God',
      'Congregational High Praise & Dance',
      'Taking Notes during the Word Ministration',
      'Sunday Ushers & Protocol in Action',
      'Post-Service Fellowship & Warm Smiles',
      'Pastor Blessing the Youths',
      'Generational Worship in God’s House'
    ])
  }
];

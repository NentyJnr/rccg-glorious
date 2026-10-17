import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Facebook,
  HeartHandshake,
  Instagram,
  MapPin,
  Menu,
  Music2,
  Quote,
  Sparkles,
  Target,
  Users,
  X,
  Youtube,
} from 'lucide-react';

const logo = '/assets/images/WhatsApp_Image_2026-10-16_at_5.23.05_AM.jpeg';

const galleryImages = [
  { src: 'https://images.pexels.com/photos/8815046/pexels-photo-8815046.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Worship night', tag: 'Faith & worship' },
  { src: 'https://images.pexels.com/photos/7849436/pexels-photo-7849436.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Serving with joy', tag: 'Outreach day' },
  { src: 'https://images.pexels.com/photos/10353711/pexels-photo-10353711.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Chosen family', tag: 'Youth community' },
  { src: 'https://images.pexels.com/photos/18751058/pexels-photo-18751058.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'Growing together', tag: 'Fellowship' },
  { src: 'https://images.pexels.com/photos/17026870/pexels-photo-17026870.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', title: 'One body', tag: 'Sunday gathering' },
];

const events = [
  { date: '08', month: 'NOV', title: 'Awaken Worship Night', detail: 'An evening of live worship, honest conversations and a fresh encounter with God.', time: '5:00 PM – 8:00 PM', place: 'Main Sanctuary', image: galleryImages[0].src },
  { date: '16', month: 'NOV', title: 'Serve the City', detail: 'We are taking the love of Jesus beyond our walls through practical acts of service.', time: '8:00 AM – 1:00 PM', place: 'Church Courtyard', image: galleryImages[1].src },
  { date: '30', month: 'NOV', title: 'The Table: Youth Connect', detail: 'A relaxed afternoon to meet new friends, share a meal and talk about real life.', time: '3:00 PM – 6:00 PM', place: 'Youth Hall', image: galleryImages[2].src },
];

const executives = [
  { name: 'Daniel Osei', role: 'Youth President', initials: 'DO', color: 'bg-[#e9d8c9]' },
  { name: 'Grace Nwosu', role: 'Vice President', initials: 'GN', color: 'bg-[#c8d7c2]' },
  { name: 'Samuel Addo', role: 'Worship Lead', initials: 'SA', color: 'bg-[#d6cbed]' },
  { name: 'Esther Mensah', role: 'Communications', initials: 'EM', color: 'bg-[#f0ddae]' },
];

function App() {
  const [activeEvent, setActiveEvent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveEvent((current) => (current + 1) % events.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  const event = events[activeEvent];
  const nextEvent = () => setActiveEvent((current) => (current + 1) % events.length);
  const previousEvent = () => setActiveEvent((current) => (current - 1 + events.length) % events.length);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f7f3] text-[#211b2e]">
      <div className="bg-[#211566] px-6 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85">
        Glorious Church of God · Youths Fellowship
      </div>
      <header className="absolute left-0 right-0 top-8 z-20 border-b border-white/15 bg-[#211566]/70 text-white backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a href="#top" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="Glorious Church Youths logo" className="h-12 w-24 object-contain brightness-0 invert" />
            <span className="hidden border-l border-white/30 pl-3 text-[10px] font-bold uppercase leading-4 tracking-[0.2em] sm:block">Glorious<br />Youth Fellowship</span>
          </a>
          <button className="rounded-full border border-white/20 p-2 lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className={`${menuOpen ? 'absolute left-0 right-0 top-[81px] flex flex-col bg-[#211566] px-6 py-5 shadow-xl' : 'hidden'} gap-6 text-sm font-medium lg:static lg:flex lg:flex-row lg:items-center lg:bg-transparent lg:p-0 lg:shadow-none`}>
            <a href="#about" onClick={() => setMenuOpen(false)} className="transition hover:text-[#70d57e]">About us</a>
            <a href="#events" onClick={() => setMenuOpen(false)} className="transition hover:text-[#70d57e]">Events</a>
            <a href="#gallery" onClick={() => setMenuOpen(false)} className="transition hover:text-[#70d57e]">Gallery</a>
            <a href="#team" onClick={() => setMenuOpen(false)} className="transition hover:text-[#70d57e]">Leadership</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="rounded-full bg-[#4dbb62] px-5 py-3 font-bold text-white shadow-lg shadow-[#4dbb62]/20 transition hover:bg-[#65ce75]">Join the family <ArrowRight className="ml-2 inline" size={15} /></a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="relative min-h-[720px] overflow-hidden bg-[#211566] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(77,187,98,0.24),transparent_32%),radial-gradient(circle_at_12%_65%,rgba(100,73,180,0.34),transparent_35%)]" />
          <div className="absolute -right-32 top-20 h-[520px] w-[520px] rounded-full border border-white/10" />
          <div className="absolute -right-10 top-48 h-[340px] w-[340px] rounded-full border border-[#4dbb62]/20" />
          <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-6 pb-20 pt-40 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:pb-14 lg:pt-36">
            <div className="max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#77d986]/30 bg-[#4dbb62]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#91e59d]"><Sparkles size={14} /> A generation on fire</div>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-8xl">Rooted in faith.<br /><span className="text-[#71d17e]">Alive with purpose.</span></h1>
              <p className="mt-7 max-w-lg text-lg leading-8 text-white/70">A vibrant family of young people discovering Jesus, serving boldly and growing together. There is a place for you here.</p>
              <div className="mt-9 flex flex-wrap items-center gap-4"><a href="#events" className="rounded-full bg-[#4dbb62] px-6 py-4 font-bold text-white shadow-xl shadow-[#4dbb62]/20 transition hover:-translate-y-1 hover:bg-[#65ce75]">See what’s happening <ArrowRight className="ml-2 inline" size={17} /></a><a href="#about" className="rounded-full border border-white/20 px-6 py-4 font-bold text-white transition hover:border-white/60">Discover our story</a></div>
              <div className="mt-14 flex items-center gap-6 text-sm text-white/50"><div className="flex -space-x-3">{['bg-[#d7b9a8]','bg-[#8c6148]','bg-[#c8a07e]','bg-[#6f4832]'].map((color) => <span key={color} className={`h-9 w-9 rounded-full border-2 border-[#211566] ${color}`} />)}</div><span><strong className="text-white">150+</strong> young people finding their place</span></div>
            </div>
            <div className="relative hidden h-[530px] lg:block"><div className="absolute bottom-0 right-8 h-[430px] w-[380px] rounded-t-[190px] bg-[#4dbb62]/20" /><img src={galleryImages[1].src} alt="Young people serving together" className="absolute bottom-3 right-0 h-[500px] w-[410px] rounded-t-[210px] object-cover grayscale-[15%]" /><div className="absolute bottom-8 left-0 w-56 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md"><HeartHandshake className="mb-5 text-[#80db8a]" size={25} /><p className="text-sm font-semibold leading-6">There is room for your story here.</p></div></div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"><div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#39994e]">Who we are</p><h2 className="max-w-md text-4xl font-semibold leading-tight tracking-[-0.03em] text-[#211566] sm:text-5xl">Not just a youth group. <span className="text-[#4dbb62]">A movement.</span></h2></div><p className="max-w-xl text-lg leading-8 text-[#625d6b]">We believe the church is at its best when young people are seen, heard and equipped to live out their faith. Every gathering is a chance to encounter God and one another.</p></div><div className="mt-16 grid gap-5 sm:grid-cols-3"><article className="rounded-3xl bg-[#211566] p-8 text-white transition hover:-translate-y-1"><Target className="mb-12 text-[#75d283]" size={30} /><h3 className="mb-3 text-xl font-bold">Know God</h3><p className="text-sm leading-6 text-white/60">We create honest spaces to encounter Jesus and build a faith that lasts.</p></article><article className="rounded-3xl bg-[#e9f2e5] p-8 text-[#211566] transition hover:-translate-y-1"><Users className="mb-12 text-[#39994e]" size={30} /><h3 className="mb-3 text-xl font-bold">Find belonging</h3><p className="text-sm leading-6 text-[#625d6b]">No pretending. Just real friendships, shared tables and a community that shows up.</p></article><article className="rounded-3xl bg-[#4dbb62] p-8 text-white transition hover:-translate-y-1"><HeartHandshake className="mb-12" size={30} /><h3 className="mb-3 text-xl font-bold">Live on mission</h3><p className="text-sm leading-6 text-white/75">We take what we learn beyond the room and into our neighborhoods.</p></article></div></section>

        <section id="events" className="bg-[#eee9e0] px-6 py-24 lg:px-10 lg:py-28"><div className="mx-auto max-w-7xl"><div className="mb-12 flex items-end justify-between gap-6"><div><p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#39994e]">Save your seat</p><h2 className="text-4xl font-semibold tracking-[-0.03em] text-[#211566] sm:text-5xl">What’s happening</h2></div><div className="hidden gap-2 sm:flex"><button onClick={previousEvent} className="rounded-full border border-[#211566]/20 p-3 text-[#211566] transition hover:bg-[#211566] hover:text-white" aria-label="Previous event"><ChevronLeft size={19} /></button><button onClick={nextEvent} className="rounded-full border border-[#211566]/20 p-3 text-[#211566] transition hover:bg-[#211566] hover:text-white" aria-label="Next event"><ChevronRight size={19} /></button></div></div><div className="grid overflow-hidden rounded-[2rem] bg-[#211566] lg:grid-cols-[1.08fr_0.92fr]"><div className="relative min-h-[390px] overflow-hidden"><img src={event.image} alt={event.title} className="absolute inset-0 h-full w-full object-cover transition-all duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-[#211566]/90 via-[#211566]/10 to-transparent" /><div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-white"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8fe09a]">Featured event</p><h3 className="text-3xl font-semibold">{event.title}</h3></div><div className="hidden text-center sm:block"><span className="block text-4xl font-bold leading-none">{event.date}</span><span className="text-xs font-bold tracking-widest text-[#8fe09a]">{event.month}</span></div></div></div><div className="flex flex-col justify-center p-8 text-white sm:p-12"><div className="mb-8 flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4dbb62] font-bold">{event.date}</span><span className="text-xs font-bold uppercase tracking-widest text-white/55">{event.month} 2026</span></div><p className="max-w-md text-lg leading-8 text-white/70">{event.detail}</p><div className="mt-8 space-y-4 text-sm text-white/70"><span className="flex items-center gap-3"><Clock3 size={17} className="text-[#75d283]" />{event.time}</span><span className="flex items-center gap-3"><MapPin size={17} className="text-[#75d283]" />{event.place}</span></div><button className="mt-10 self-start rounded-full bg-white px-6 py-3 font-bold text-[#211566] transition hover:bg-[#75d283]">I’m interested <ArrowRight className="ml-2 inline" size={15} /></button></div></div><div className="mt-6 flex justify-center gap-2 lg:hidden">{events.map((item, index) => <button key={item.title} onClick={() => setActiveEvent(index)} className={`h-2 rounded-full transition-all ${activeEvent === index ? 'w-8 bg-[#4dbb62]' : 'w-2 bg-[#211566]/20'}`} aria-label={`Show event ${index + 1}`} />)}</div></div></section>

        <section id="gallery" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#39994e]">The gallery</p><h2 className="text-4xl font-semibold tracking-[-0.03em] text-[#211566] sm:text-5xl">Scenes from the journey</h2></div><p className="max-w-xs text-sm leading-6 text-[#625d6b]">Every photo holds a memory. Every memory is part of a bigger story.</p></div><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{galleryImages.map((image, index) => <article key={image.title} className={`${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''} group relative min-h-[235px] overflow-hidden rounded-[1.5rem]`}><img src={image.src} alt={image.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#211566]/85 via-transparent to-transparent" /><div className="absolute bottom-5 left-5 text-white"><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ce5a4]">{image.tag}</p><h3 className="text-lg font-semibold">{image.title}</h3></div></article>)}</div></section>

        <section id="team" className="bg-[#211566] px-6 py-24 text-white lg:px-10 lg:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center"><div><p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[#81da8d]">Meet the team</p><h2 className="text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">Young leaders.<br /><span className="text-[#72d27f]">Big-hearted service.</span></h2><p className="mt-6 max-w-sm leading-7 text-white/60">A team of young people making space for others to meet God, grow in confidence and step into purpose.</p></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{executives.map((person) => <article key={person.name} className="group"><div className={`mb-4 flex aspect-[0.82] items-end justify-center overflow-hidden rounded-[1.3rem] ${person.color}`}><span className="text-5xl font-semibold text-[#211566]/70 transition duration-300 group-hover:scale-110">{person.initials}</span></div><h3 className="font-bold">{person.name}</h3><p className="mt-1 text-xs text-white/50">{person.role}</p></article>)}</div></div></div></section>

        <section className="bg-[#e9f2e5] px-6 py-20 lg:px-10"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div className="flex items-start gap-5"><div className="mt-1 hidden rounded-full bg-[#4dbb62] p-3 text-white sm:block"><Quote size={20} /></div><div><p className="max-w-2xl text-2xl font-medium leading-relaxed text-[#211566] sm:text-3xl">“I walked in looking for friends. I found a family and a faith that feels like home.”</p><p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#39994e]">— Adwoa, youth member</p></div></div><div className="flex items-center gap-3 text-sm font-bold text-[#211566]"><span className="h-2 w-2 rounded-full bg-[#4dbb62]" /> You belong here</div></div></section>
      </main>

      <footer id="contact" className="bg-[#16103e] px-6 pb-8 pt-20 text-white lg:px-10"><div className="mx-auto max-w-7xl"><div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]"><div><img src={logo} alt="Glorious Church Youths logo" className="mb-7 h-16 w-40 object-contain brightness-0 invert" /><p className="max-w-xs text-sm leading-7 text-white/55">A place to belong, believe and become. We cannot wait to meet you.</p><div className="mt-7 flex gap-3"><a href="#contact" className="rounded-full border border-white/15 p-3 text-white/70 transition hover:bg-[#4dbb62] hover:text-white" aria-label="Instagram"><Instagram size={17} /></a><a href="#contact" className="rounded-full border border-white/15 p-3 text-white/70 transition hover:bg-[#4dbb62] hover:text-white" aria-label="Facebook"><Facebook size={17} /></a><a href="#contact" className="rounded-full border border-white/15 p-3 text-white/70 transition hover:bg-[#4dbb62] hover:text-white" aria-label="Youtube"><Youtube size={17} /></a></div></div><div><h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#81da8d]">Explore</h3><div className="space-y-3 text-sm text-white/60"><a className="block hover:text-white" href="#about">Our story</a><a className="block hover:text-white" href="#events">Upcoming events</a><a className="block hover:text-white" href="#gallery">Gallery</a><a className="block hover:text-white" href="#team">Our leaders</a></div></div><div><h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#81da8d]">Gather with us</h3><div className="space-y-4 text-sm text-white/60"><p className="flex gap-3"><CalendarDays size={16} className="shrink-0 text-[#75d283]" />Every Sunday · 9:00 AM</p><p className="flex gap-3"><MapPin size={16} className="shrink-0 text-[#75d283]" />Glorious Church of God<br />Youth Hall</p></div></div><div><h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#81da8d]">Stay in the loop</h3><p className="mb-4 text-sm leading-6 text-white/55">Get event updates and encouragement in your inbox.</p><form className="flex border-b border-white/30 pb-2" onSubmit={(e) => e.preventDefault()}><input aria-label="Email address" type="email" placeholder="Your email address" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35" /><button aria-label="Subscribe" className="text-[#75d283]" type="submit"><ArrowRight size={19} /></button></form></div></div><div className="flex flex-col justify-between gap-4 pt-7 text-xs text-white/35 sm:flex-row"><p>© 2026 Glorious Church Youths Fellowship</p><p className="flex items-center gap-2"><Music2 size={14} /> Made for a generation on fire</p></div></div></footer>
    </div>
  );
}

export default App;

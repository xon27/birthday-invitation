import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { BD } from '../utils/assets';
import { GALLERY_IMAGES } from '../utils/galleryImages.generated';
import { getJoiners, setJoiners } from '../utils/storage';
import { addJoinersToList } from '../utils/joinersFirestore';

const MAPS_QUERY = '123+Anywhere+Street,+Any+City,+State+12345';
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

const FAQ_ITEMS = [
  { q: 'What time does the party start?', a: 'The party runs from 2:00 PM to 5:00 PM. We recommend arriving a few minutes early so you don\'t miss the blast-off!' },
  { q: 'Is there parking?', a: 'Yes, free parking is available on site. Look for the space-themed signs.' },
  { q: 'Do I need to bring anything?', a: 'Just yourself and your best space suit (optional)! Party favors and snacks will be provided.' },
  { q: 'What if my child has food allergies?', a: 'Please let us know when you RSVP so we can plan accordingly. We want everyone to enjoy the party safely.' },
  { q: 'When should I RSVP by?', a: 'Please reply by April 10 so we can finalize headcount and preparations.' },
];

export default function Invitation() {
  const [joiners, setJoinersState] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const loadJoiners = useCallback(() => {
    setJoinersState(getJoiners());
  }, []);

  useEffect(() => {
    loadJoiners();
  }, [loadJoiners]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  useEffect(() => {
    if (lightboxIndex != null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && modalOpen) setModalOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modalOpen]);

  const joinEnabled = name.trim() && lastname.trim();
  const sendEnabled = joiners.length > 0;

  const handleJoin = (e) => {
    e?.preventDefault();
    const n = name.trim();
    const l = lastname.trim();
    if (!n || !l) return;
    const next = [...joiners, { name: n, lastname: l }];
    setJoiners(next);
    setJoinersState(next);
    setName('');
    setLastname('');
  };

  const handleSend = async () => {
    if (joiners.length === 0) return;
    await addJoinersToList(joiners);
    setJoiners([]);
    setJoinersState([]);
    setSuccessMessage(joiners.length);
    setModalOpen(false);
  };

  const closeModal = () => setModalOpen(false);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goLightboxPrev = () => setLightboxIndex((i) => (i <= 0 ? GALLERY_IMAGES.length - 1 : i - 1));
  const goLightboxNext = () => setLightboxIndex((i) => (i >= GALLERY_IMAGES.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex == null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goLightboxPrev();
      if (e.key === 'ArrowRight') goLightboxNext();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [lightboxIndex]);

  const confetti = Array.from({ length: 20 }, (_, i) => <span key={i} className="confetti" />);

  return (
    <div className="page">
      <div className="space-bg" />
      <main className="card">
        <div className="confetti-wrap" aria-hidden="true">{confetti}</div>

        <header className="hero">
          <div className="hero-main">
            <img src={`${BD}/newimage.png`} alt="Birthday child smiling and waving" className="hero-kid" />
            <img src={`${BD}/birtdayimage.png`} alt="Happy Birthday balloons" className="hero-title" />
          </div>
          <div className="hero-copy">
            <p className="hero-name">Daniel</p>
            <p className="hero-subtitle">
              You're cordially invited to a <span>celestial</span> celebration
            </p>
          </div>
          <img src={`${BD}/spaceship.png`} alt="" className="decor decor-ship" aria-hidden="true" />
          <img src={`${BD}/astroboy.png`} alt="" className="decor decor-astronaut" aria-hidden="true" />
          <img src={`${BD}/imgi_11_pngtree-star-cartoon-cartoon-stars-icon-png-image_3816676.png`} alt="" className="decor decor-stars-1" aria-hidden="true" />
          <img src={`${BD}/imgi_11_pngtree-glossy-yellow-star-icon-3d-shiny-clipart-for-transparent-background-and-png-image_21270306.png`} alt="" className="decor decor-star-big" aria-hidden="true" />
          <img src={`${BD}/imgi_11_pngtree-star-cartoon-cartoon-stars-icon-png-image_3816676.png`} alt="" className="decor decor-stars-3" aria-hidden="true" />
          <img src={`${BD}/imgi_11_pngtree-glossy-yellow-star-icon-3d-shiny-clipart-for-transparent-background-and-png-image_21270306.png`} alt="" className="decor decor-star-4" aria-hidden="true" />
          <img src={`${BD}/imgi_11_pngtree-star-cartoon-cartoon-stars-icon-png-image_3816676.png`} alt="" className="decor decor-stars-5" aria-hidden="true" />
          <img src={`${BD}/imgi_11_pngtree-thunder-and-bolt-lighting-flash-vector-png-image_4723241.png`} alt="" className="decor decor-bolt" aria-hidden="true" />
          <img src={`${BD}/imgi_11_pngtree-thunder-and-bolt-lighting-flash-vector-png-image_4723241.png`} alt="" className="decor decor-bolt-2" aria-hidden="true" />
        </header>

        <div className="details-wrap">
          <img src={`${BD}/alien.png`} alt="" className="decor decor-alien-when" aria-hidden="true" />
          <img src={`${BD}/imgi_11_pngtree-thunder-and-bolt-lighting-flash-vector-png-image_4723241.png`} alt="" className="decor decor-bolt-details" aria-hidden="true" />
          <img src={`${BD}/imgi_11_pngtree-star-cartoon-cartoon-stars-icon-png-image_3816676.png`} alt="" className="decor decor-stars-details" aria-hidden="true" />
          <img src={`${BD}/moon.png`} alt="" className="decor decor-moon" aria-hidden="true" />
          <section className="info-grid">
            <section className="panel panel-when">
              <h2>When</h2>
              <p className="info-line"><strong>Saturday · April 20</strong></p>
              <p className="info-line">2:00 PM – 5:00 PM</p>
              <p className="info-note">We look forward to welcoming you.</p>
            </section>

            <section className="panel panel-where">
              <h2>Where</h2>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="info-row info-row-map" aria-label="Open address in Google Maps">
                <img src={`${BD}/gps_11081564 (1).png`} alt="" className="icon icon-gps" aria-hidden="true" />
                <div>
                  <p className="info-line"><strong>123 Anywhere Street</strong></p>
                  <p className="info-line">Any City, State 12345</p>
                  <span className="info-direction">Get directions →</span>
                </div>
              </a>
              <div className="info-row">
                <img src={`${BD}/mobile-phone_5993327.png`} alt="" className="icon icon-phone" aria-hidden="true" />
                <div>
                  <p className="info-line"><strong>Contact</strong></p>
                  <p className="info-line">Call or text: 123-456-7890</p>
                </div>
              </div>
            </section>

            <section className="panel panel-activities">
              <h2>Activities</h2>
              <ul>
                <li>Space games &amp; missions</li>
                <li>Pizza party &amp; snacks</li>
                <li>Art &amp; crafts corner</li>
                <li>Music, dancing &amp; prizes</li>
              </ul>
              <img src={`${BD}/remote.png`} alt="" className="decor decor-gamepad" aria-hidden="true" />
            </section>

            <section className="panel panel-important">
              <h2>Important Info</h2>
              <ul>
                <li>Please RSVP by <strong>April 10</strong>.</li>
                <li>Let us know about any food allergies.</li>
                <li>Party favors for all little astronauts.</li>
                <li>Free parking available on site.</li>
              </ul>
              <img src={`${BD}/imgi_11_pngtree-star-cartoon-cartoon-stars-icon-png-image_3816676.png`} alt="" className="decor decor-stars-2" aria-hidden="true" />
            </section>
          </section>
        </div>

        {GALLERY_IMAGES.length > 0 && (
          <section className="gallery-section" aria-label="Photo gallery">
            <h2 className="gallery-title">Photos</h2>
            <p className="gallery-subtitle">Click any photo to view larger</p>
            <div className="gallery-grid">
              {GALLERY_IMAGES.map((src, i) => (
                <div
                  key={i}
                  className="gallery-item"
                  role="button"
                  tabIndex={0}
                  onClick={() => openLightbox(i)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); } }}
                  aria-label={`View photo ${i + 1} of ${GALLERY_IMAGES.length}`}
                >
                  <img src={`${BD}/${src}`} alt="" loading="lazy" />
                  <span className="gallery-item-overlay" aria-hidden="true">
                    <span className="gallery-item-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </span>
                  </span>
                </div>
              ))}
            </div>
            {lightboxIndex != null && createPortal(
              <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={closeLightbox}>
                <button type="button" className="gallery-lightbox-close" onClick={closeLightbox} aria-label="Close">&times;</button>
                <button type="button" className="gallery-lightbox-prev" onClick={(e) => { e.stopPropagation(); goLightboxPrev(); }} aria-label="Previous photo">&lsaquo;</button>
                <div className="gallery-lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
                  <img src={`${BD}/${GALLERY_IMAGES[lightboxIndex]}`} alt="" />
                </div>
                <button type="button" className="gallery-lightbox-next" onClick={(e) => { e.stopPropagation(); goLightboxNext(); }} aria-label="Next photo">&rsaquo;</button>
              </div>,
              document.body
            )}
          </section>
        )}

        <section className="faq-section" aria-label="Frequently Asked Questions">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <ul className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <li key={i} className="faq-item">
                <button
                  type="button"
                  className={`faq-question ${openFaqIndex === i ? 'is-open' : ''}`}
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  aria-expanded={openFaqIndex === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  {item.q}
                  <span className="faq-icon" aria-hidden="true">{openFaqIndex === i ? '−' : '+'}</span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className="faq-answer"
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  hidden={openFaqIndex !== i}
                >
                  {item.a}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rsvp-section" id="rsvp">
          <div className="rsvp-bar">
            <img src={`${BD}/imgi_11_pngtree-glossy-yellow-star-icon-3d-shiny-clipart-for-transparent-background-and-png-image_21270306.png`} alt="" className="decor decor-star-rsvp" aria-hidden="true" />
            <p className="rsvp-text">Kindly reply by the date above</p>
            <button type="button" className="btn-rsvp" onClick={() => setModalOpen(true)} aria-haspopup="dialog" aria-expanded={modalOpen}>RSVP</button>
          </div>

          <div className={`rsvp-modal ${modalOpen ? 'is-open' : ''}`} id="rsvp-modal" role="dialog" aria-modal="true" aria-labelledby="rsvp-modal-title" aria-hidden={!modalOpen}>
            <div className="rsvp-modal-backdrop" onClick={closeModal} />
            <div className="rsvp-modal-content">
              <button type="button" className="rsvp-modal-close" onClick={closeModal} aria-label="Close">&times;</button>
              <h2 className="rsvp-modal-title" id="rsvp-modal-title">RSVP</h2>
              <form className="rsvp-form" onSubmit={handleJoin} noValidate>
                <div className="rsvp-field">
                  <label className="rsvp-label" htmlFor="rsvp-name">Name</label>
                  <input type="text" id="rsvp-name" className="rsvp-input" placeholder="First name" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="rsvp-field">
                  <label className="rsvp-label" htmlFor="rsvp-lastname">Last name</label>
                  <input type="text" id="rsvp-lastname" className="rsvp-input" placeholder="Last name" autoComplete="family-name" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                </div>
                <div className="rsvp-buttons">
                  <button type="button" className="btn-rsvp btn-rsvp-join" disabled={!joinEnabled} onClick={handleJoin}>Join</button>
                  <button type="button" className="btn-rsvp btn-rsvp-send" disabled={!sendEnabled} onClick={handleSend}>Send</button>
                </div>
              </form>
              <div className="rsvp-modal-joiners">
                <h3 className="joiners-title">Joiners</h3>
                <ul className="joiners-list">
                  {joiners.map((j, i) => (
                    <li key={i} className="joiner-item">{j.name} {j.lastname}</li>
                  ))}
                </ul>
                <p className="joiners-empty" style={{ display: joiners.length ? 'none' : 'block' }}>No joiners yet.</p>
              </div>
            </div>
          </div>

          {successMessage != null && (
            <p className="rsvp-success" role="status" aria-live="polite">
              You successfully sent {successMessage} {successMessage === 1 ? 'joiner' : 'joiners'}.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

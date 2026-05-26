import { useMemo, useState } from 'react';

const georgianDate = new Intl.DateTimeFormat('ka-GE', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
});

const fullDate = new Intl.DateTimeFormat('ka-GE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const coffeeGif =
  'https://media.tenor.com/YZPnGuPeZv8AAAAC/cat-coffee.gif';

function encodeForm(data) {
  return new URLSearchParams(data).toString();
}

function getNextSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);

    return {
      id: date.toISOString().slice(0, 10),
      date,
      label: georgianDate.format(date),
      fullLabel: fullDate.format(date),
    };
  });
}

function getTimeSlots() {
  const slots = [];

  for (let hour = 20; hour <= 25; hour += 1) {
    const normalizedHour = hour % 24;
    for (const minute of [0, 30]) {
      if (hour === 25 && minute === 30) continue;
      slots.push(
        `${String(normalizedHour).padStart(2, '0')}:${String(minute).padStart(
          2,
          '0',
        )}`,
      );
    }
  }

  return slots;
}

export default function App() {
  const dates = useMemo(getNextSevenDays, []);
  const timeSlots = useMemo(getTimeSlots, []);
  const [step, setStep] = useState('intro');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [runawayStyle, setRunawayStyle] = useState({});
  const [isRunawayHidden, setIsRunawayHidden] = useState(false);
  const [showUnavailableMessage, setShowUnavailableMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const moveRunawayButton = (event) => {
    event?.preventDefault();
    if (isRunawayHidden) return;

    const buttonWidth = 210;
    const buttonHeight = 58;
    const safePadding = 18;
    const maxLeft = Math.max(window.innerWidth - buttonWidth - safePadding, 0);
    const maxTop = Math.max(window.innerHeight - buttonHeight - safePadding, 0);

    setShowUnavailableMessage(true);
    setIsRunawayHidden(true);

    window.setTimeout(() => {
      setRunawayStyle({
        position: 'fixed',
        left: `${safePadding + Math.random() * maxLeft}px`,
        top: `${safePadding + Math.random() * maxTop}px`,
        zIndex: 20,
        transform: `rotate(${Math.random() * 18 - 9}deg)`,
      });
      setIsRunawayHidden(false);
    }, 180);
  };

  const acceptInvitation = () => {
    setStep('date');
    setSubmissionError('');
  };

  const continueToTime = () => {
    if (!selectedDate) return;
    setStep('time');
  };

  const submitDate = async () => {
    if (!selectedDate || !selectedTime) return;

    const chosenDate = dates.find((date) => date.id === selectedDate);
    const payload = {
      'form-name': 'coffee-date',
      date: chosenDate?.fullLabel ?? selectedDate,
      time: selectedTime,
      message: `თათიამ აირჩია: ${chosenDate?.fullLabel ?? selectedDate}, ${selectedTime}`,
    };

    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForm(payload),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setStep('done');
    } catch {
      setSubmissionError(
        'ვერ გავაგზავნე, მაგრამ არჩევანი შენახულია ეკრანზე. Netlify Forms-ის ჩართვის შემდეგ ხელახლა სცადე.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDateLabel = dates.find((date) => date.id === selectedDate)?.fullLabel;

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className={`card step-${step}`}>
        <div className="steam-cup" aria-hidden="true">
          <span />
          <span />
          <span />
          <div className="cup">
            <div className="coffee" />
          </div>
        </div>

        <p className="eyebrow">ერთი ძალიან მნიშვნელოვანი კითხვა</p>
        <h1>როდის წავიდეთ ყავის დასალევად თათია?</h1>
        <p className="subtitle">როდის მთავრდება შენი მორიგეობები?</p>

        {step === 'intro' && (
          <div className="intro-block">
            <div className="actions intro-actions">
              <button className="primary-button" type="button" onClick={acceptInvitation}>
                კაი ხო წავიდეთ
              </button>
              <button
                className={`ghost-button runaway-button ${
                  isRunawayHidden ? 'is-hidden' : ''
                }`}
                type="button"
                style={runawayStyle}
                onFocus={moveRunawayButton}
                onPointerDown={moveRunawayButton}
                onPointerEnter={moveRunawayButton}
              >
                ყავას მარტოც დავლევ
              </button>
            </div>
            {showUnavailableMessage && (
              <p className="unavailable-message">
                ეს ოფშენი არაა ამჟამად ხელმისაწვდომი ექიმოოოოო
              </p>
            )}
          </div>
        )}

        {step === 'date' && (
          <div className="panel pop-in">
            <img className="celebration-gif" src={coffeeGif} alt="სიხარულის გიფი" />
            <h2>ეგრე რა შე კაი კაცო</h2>
            <p>აირჩიე დღე შემდეგი ერთი კვირიდან და მერე საათზეც შევთანხმდეთ.</p>

            <div className="calendar-grid" aria-label="თარიღის არჩევა">
              {dates.map((date) => (
                <button
                  className={`date-card ${selectedDate === date.id ? 'selected' : ''}`}
                  key={date.id}
                  type="button"
                  onClick={() => setSelectedDate(date.id)}
                >
                  <span>{date.label.split(' ')[0]}</span>
                  <strong>{date.label.replace(date.label.split(' ')[0], '').trim()}</strong>
                </button>
              ))}
            </div>

            <button
              className="primary-button wide-button"
              type="button"
              disabled={!selectedDate}
              onClick={continueToTime}
            >
              თარიღი არჩეულია
            </button>
          </div>
        )}

        {step === 'time' && (
          <div className="panel slide-up">
            <h2>ძალიან კარგი, ახლა საათი</h2>
            <p>
              {selectedDateLabel} თავისუფალი ფანჯარაა 20:00-დან ღამის 01:00-მდე.
            </p>

            <div className="time-grid" aria-label="საათის არჩევა">
              {timeSlots.map((time) => (
                <button
                  className={`time-chip ${selectedTime === time ? 'selected' : ''}`}
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>

            <button
              className="primary-button wide-button"
              type="button"
              disabled={!selectedTime || isSubmitting}
              onClick={submitDate}
            >
              {isSubmitting ? 'იგზავნება...' : 'დადასტურება'}
            </button>
            {submissionError && <p className="error-text">{submissionError}</p>}
          </div>
        )}

        {step === 'done' && (
          <div className="panel done-panel pop-in">
            <div className="wink-face" aria-hidden="true">
              <span className="eye-left" />
              <span className="eye-right" />
              <span className="smile" />
            </div>
            <h2>შეთანხმდით</h2>
            <p>
              მანქანით გამოგივლი {selectedDateLabel}-ს, {selectedTime}-ზე. თვალი ჩავუკარი.
            </p>
            <p className="tiny-note">არჩევანი გაგზავნილია Netlify Form-ში.</p>
          </div>
        )}
      </section>
    </main>
  );
}

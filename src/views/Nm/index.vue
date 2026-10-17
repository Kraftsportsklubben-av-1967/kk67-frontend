<template>
  <div class="nm-page">
    <section class="nm-hero" aria-labelledby="nm-title">
      <div class="hero-topline">
        <p class="eyebrow">KK-67 presenterer · Norgesmesterskap i styrkeløft</p>
        <span class="anniversary">1967–2027 <strong>60 år</strong></span>
      </div>
      <div class="hero-grid">
        <div>
          <h1 id="nm-title">NM <span>2027</span></h1>
          <p class="hero-lead">Norges sterkeste.<br />Trondheims storstue.</p>
          <p class="hero-description">
            KK-67 fyller 60 år. Det feirer vi med en mesterskapshelg i hjertet av Trondheim.
            Knebøy, benkpress og markløft. Vi gleder oss til å fylle Samfundet med styrke.
          </p>
          <a class="hero-link" href="#nm-info">Mer om mesterskapet <span aria-hidden="true">↗</span></a>
        </div>
        <div class="hero-details">
          <img class="club-mark" src="/public/logo/kk-logo-white.png" alt="KK-67" />
          <dl>
            <dt>Sett av helgen</dt>
            <dd class="event-dates">{{ eventDates }}</dd>
            <dt>Vi møtes på</dt>
            <dd>{{ event.venue }}<br /><span class="event-city">{{ event.city }}</span></dd>
          </dl>
        </div>
      </div>
    </section>

    <section class="countdown-section" aria-labelledby="countdown-title">
      <h2 id="countdown-title" class="eyebrow">Hver dag bringer oss nærmere.</h2>
      <FlipCountdown :target-date="event.startsOn" :event-name="event.name" />
      <p class="countdown-note">Til første mesterskapsdag · norsk tid</p>
    </section>

    <section id="nm-info" class="information-section" aria-labelledby="information-title">
      <div class="section-intro">
        <div>
          <p class="eyebrow red">En helg. Tre løft. Ett mesterskap.</p>
          <h2 id="information-title">Sterke opplevelser.<br />Mer informasjon kommer.</h2>
        </div>
        <p>
          Vi inviterer utøvere, publikum og styrkeløftvenner til Storsalen på Studentersamfundet
          {{ eventDates }}. Her samler vi det du trenger å vite når mesterskapet nærmer seg.
        </p>
      </div>
      <div class="information-cards">
        <div class="information-card">
          <span class="card-number" aria-hidden="true">01</span>
          <h3>Program og tider</h3>
          <p>Løfting, puljer og tidsplan. Detaljene publiseres når de er klare.</p>
          <span class="coming-soon">Kommer senere</span>
        </div>
        <div class="information-card">
          <span class="card-number" aria-hidden="true">02</span>
          <h3>For utøvere</h3>
          <p>Informasjon om påmelding og alt det praktiske rundt deltakelsen.</p>
          <span class="coming-soon">Kommer senere</span>
        </div>
        <div class="information-card">
          <span class="card-number" aria-hidden="true">03</span>
          <h3>For publikum</h3>
          <p>Planlegg mesterskapshelgen. Informasjon om billetter og besøk følger.</p>
          <span class="coming-soon">Kommer senere</span>
        </div>
      </div>
    </section>

    <section class="video-section" aria-labelledby="video-title">
      <div>
        <p class="eyebrow red">Bak løftene</p>
        <h2 id="video-title">Følg reisen<br />mot NM.</h2>
        <p>Forberedelser, folk og øyeblikk fra klubben. Følg med – vi har mer å dele.</p>
      </div>
      <EventVideo
        :youtube-video-id="event.youtubeVideoId"
        :drive-file-id="event.driveFileId"
        :title="event.name"
      />
    </section>

    <div class="nm-signoff">
      <span>KK-67 · Styrke siden 1967</span>
      <span>Vi sees i Trondheim.</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FlipCountdown from '@components/Countdown/FlipCountdown.vue'
import EventVideo from '@components/Media/EventVideo.vue'
import { NM_EVENT } from '../../constants/nm'

export default defineComponent({
  components: { FlipCountdown, EventVideo },
  data() {
    return { event: NM_EVENT }
  },
  computed: {
    eventDates(): string {
      return new Intl.DateTimeFormat('nb-NO', {
        day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Oslo',
      }).formatRange(
        new Date(`${this.event.startsOn}T00:00:00Z`),
        new Date(`${this.event.endsOn}T00:00:00Z`),
      )
    },
  },
})
</script>

<style scoped>
.nm-page {
  --nm-red: #b91c1c;
  --nm-paper: #f4f0e7;
  margin-inline: clamp(1rem, 3vw, 2rem);
  color: #18191e;
}
.eyebrow {
  font-size: .72rem;
  font-weight: 700;
  line-height: 1.7;
  letter-spacing: .16em;
  text-transform: uppercase;
}
.red { color: var(--nm-red); }
.nm-hero {
  padding: clamp(1.5rem, 4vw, 4rem);
  border-top: 6px solid var(--nm-red);
  background: #131419;
  background-image: radial-gradient(circle at 100% 0,
    transparent 0 10rem, #ffffff03 10rem 14rem, transparent 14rem 18rem,
    #ffffff03 18rem 22rem, transparent 22rem);
  color: var(--nm-paper);
}
.hero-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #ffffff26;
}
.anniversary {
  display: flex;
  align-items: center;
  gap: .75rem;
  flex-shrink: 0;
  font-size: .7rem;
  letter-spacing: .08em;
}
.anniversary strong {
  padding: .4rem .6rem;
  border: 1px solid #ffffff66;
  font-size: .85rem;
  text-transform: uppercase;
}
.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, .85fr);
  gap: 3rem;
  align-items: end;
  padding-top: 2.5rem;
}
h1 {
  font-size: clamp(3.75rem, 9vw, 8.5rem);
  font-weight: 900;
  line-height: .95;
  letter-spacing: -.07em;
  white-space: nowrap;
}
h1 span { color: #f15d55; }
.hero-lead {
  margin-top: 1.5rem;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -.025em;
}
.hero-description {
  max-width: 31rem;
  margin-top: 1.25rem;
  color: #c6c4bd;
  font-size: .95rem;
  line-height: 1.8;
}
.hero-link {
  display: inline-flex;
  gap: 1.25rem;
  margin-top: 1.75rem;
  padding-bottom: .4rem;
  border-bottom: 1px solid #f4f0e77a;
  font-size: .85rem;
  font-weight: 700;
}
.hero-link:hover { color: #f15d55; }
.hero-link:focus-visible { outline: 2px solid var(--nm-paper); outline-offset: 5px; }
.hero-details { padding-left: 1.75rem; border-left: 1px solid #ffffff26; }
.club-mark { width: 5rem; margin-bottom: 2rem; }
dt {
  margin-top: 1.5rem;
  color: #c6c4bd;
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .15em;
  text-transform: uppercase;
}
dd {
  margin-top: .5rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.6;
}
.event-dates { font-size: clamp(1rem, 1.7vw, 1.5rem); }
.event-city { color: #c6c4bd; font-weight: 400; }
.countdown-section {
  padding: 2rem clamp(1rem, 3vw, 3rem);
  border-top: 1px solid #ffffff26;
  background: #1d1e23;
  color: var(--nm-paper);
}
.countdown-section h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #c6c4bd;
}
.countdown-note {
  margin-top: .75rem;
  color: #b8b6b1;
  text-align: center;
  font-size: .75rem;
}
.information-section {
  padding-block: clamp(2.5rem, 6vw, 5rem);
  scroll-margin-top: 1.5rem;
}
.section-intro {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 3rem;
  align-items: end;
}
h2 {
  margin-top: .75rem;
  font-size: clamp(1.9rem, 3.4vw, 3rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -.045em;
}
.section-intro > p, .video-section > div > p:last-child {
  color: #62605c;
  font-size: .95rem;
  line-height: 1.8;
}
.information-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 2.5rem;
  border-top: 2px solid #18191e;
}
.information-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem 0 0;
}
.information-card + .information-card { padding-left: 1.5rem; border-left: 1px solid #dedbd4; }
.card-number { color: var(--nm-red); font-size: .8rem; font-weight: 700; }
h3 { margin-top: 1.25rem; font-size: 1.1rem; font-weight: 700; }
.information-card p {
  flex-grow: 1;
  margin-top: .75rem;
  color: #62605c;
  font-size: .9rem;
  line-height: 1.7;
}
.coming-soon {
  margin-top: 1.5rem;
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.video-section {
  display: grid;
  grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
  gap: 3rem;
  align-items: center;
  padding: clamp(1.5rem, 3vw, 3rem);
  background: var(--nm-paper);
}
.video-section > div > p:last-child { margin-top: 1.25rem; }
.nm-signoff {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 1.5rem;
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
}
@media (max-width: 700px) {
  .hero-topline { align-items: start; gap: 1rem; }
  .anniversary { flex-direction: column; gap: .4rem; }
  .hero-grid, .section-intro, .video-section { grid-template-columns: 1fr; gap: 2rem; }
  .hero-details {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    padding: 1.5rem 0 0;
    border-left: 0;
    border-top: 1px solid #ffffff26;
  }
  .club-mark { width: 4rem; margin-bottom: 0; }
  dt:first-child { margin-top: 0; }
  .information-cards { grid-template-columns: 1fr; }
  .information-card, .information-card + .information-card {
    padding: 1.5rem 0;
    border-left: 0;
    border-bottom: 1px solid #dedbd4;
  }
  h3 { margin-top: .5rem; }
  .coming-soon { margin-top: 1rem; }
  .nm-signoff { flex-direction: column; gap: .5rem; }
}
</style>

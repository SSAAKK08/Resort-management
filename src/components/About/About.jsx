import newBanner from "../../assets/about/newBanner.jpg";
import takingInRoom from "../../assets/about/takingInRoom.jpg";
import roomOne from "../../assets/homeImg/room1.jpg";
import roomTwo from "../../assets/homeImg/room2.jpg";
import pool from "../../assets/homeImg/swimmingPool.jpg";
import { dataAbout } from "../data/about";
import AboutCard from "../cards/AboutCard";
import DeveloperCard from "../cards/DeveloperCard";
import FormContect from "./FormContect";
import AppLink from "../navigation/AppLink";

export default function About() {
  return (
    <div className="overflow-x-clip bg-slate-50 text-slate-900">
      <header
        className="relative flex min-h-[72vh] items-end overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${newBanner.src})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />
        <div className="relative mx-3 max-w-3xl pb-16 text-white lg:mx-16">
          <p className="font-semibold uppercase tracking-[0.25em] text-cyan-200">
            Our coastal story
          </p>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">
            Hospitality shaped by the Azure horizon
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
            A thoughtful resort where architecture, nature, and personal service
            create room to slow down.
          </p>
        </div>
      </header>

      <main>
        <section className="mx-3 grid items-center gap-10 py-16 lg:mx-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="font-bold uppercase tracking-widest text-primary-Blue">
              Our story
            </p>
            <h2 className="mt-3 text-3xl font-bold lg:text-4xl">
              A vision born from the Azure horizon
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Founded in 1994, Azurea began as a dream to create a sanctuary
              that respects the natural cadence of the coast. Our founders
              sought to bridge architectural precision and organic beauty.
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Over three decades, we have evolved from a boutique hideaway into
              a destination for restorative travel while keeping our original
              purpose: a place where time slows down.
            </p>
          </div>
          <img
            src={takingInRoom.src}
            alt="Guests relaxing in a resort room"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
          />
        </section>

        <section className="bg-slate-900 py-16 text-white">
          <div className="mx-3 lg:mx-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-bold uppercase tracking-widest text-cyan-300">
                Mission and vision
              </p>
              <h2 className="mt-3 text-3xl font-bold">
                Luxury that feels calm, personal, and responsible
              </h2>
              <p className="mt-5 leading-7 text-white/70">
                Our mission is to create meaningful stays through intuitive
                service and coastal experiences. Our vision is a resort where
                every guest feels restored and every choice respects the
                landscape around us.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {dataAbout.map((item) => (
                <AboutCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-3 py-16 lg:mx-16">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-bold uppercase tracking-widest text-primary-Blue">
                Resort highlights
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Designed around how you want to feel
              </h2>
            </div>
            <AppLink
              to="/booking"
              className="rounded-xl bg-primary-Blue px-6 py-3 font-bold text-white"
            >
              Explore rooms
            </AppLink>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <figure className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <img
                src={roomOne.src}
                alt="Ocean-view resort suite"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="p-5 font-semibold">
                Ocean-view sanctuaries
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <img
                src={pool.src}
                alt="Resort infinity pool"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="p-5 font-semibold">
                Restorative coastal experiences
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <img
                src={roomTwo.src}
                alt="Private resort room"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="p-5 font-semibold">
                Privacy and intuitive service
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="border-y bg-white py-12">
          <dl className="mx-3 grid grid-cols-2 gap-7 text-center md:grid-cols-4 lg:mx-16">
            <div>
              <dt className="text-4xl font-bold text-primary-Blue">30+</dt>
              <dd className="mt-2 text-slate-500">Years of hospitality</dd>
            </div>
            <div>
              <dt className="text-4xl font-bold text-primary-Blue">24/7</dt>
              <dd className="mt-2 text-slate-500">Guest assistance</dd>
            </div>
            <div>
              <dt className="text-4xl font-bold text-primary-Blue">6</dt>
              <dd className="mt-2 text-slate-500">Signature rooms</dd>
            </div>
            <div>
              <dt className="text-4xl font-bold text-primary-Blue">4</dt>
              <dd className="mt-2 text-slate-500">Curated experiences</dd>
            </div>
          </dl>
        </section>

        <section
          id="contact"
          className="mx-3 grid items-start gap-8 py-16 lg:mx-16 lg:grid-cols-[0.8fr_1.2fr]"
        >
          <div>
            <p className="font-bold uppercase tracking-widest text-primary-Blue">
              The hands behind the haven
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Built with care, shared with guests
            </h2>
            <div className="mt-7">
              <DeveloperCard />
            </div>
          </div>
          <div className="rounded-3xl bg-white p-3 shadow-sm">
            <FormContect />
          </div>
        </section>

        <section className="mx-3 mb-16 rounded-3xl bg-primary-Blue p-8 text-center text-white lg:mx-16 lg:p-12">
          <h2 className="text-3xl font-bold">Ready to experience Azurea?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            Choose a room, plan a coastal activity, and let our team take care
            of the rest.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <AppLink
              to="/booking"
              className="rounded-xl bg-white px-6 py-3 font-bold text-primary-Blue"
            >
              Book your stay
            </AppLink>
            <AppLink
              to="/activities"
              className="rounded-xl border border-white/50 px-6 py-3 font-bold"
            >
              Explore activities
            </AppLink>
          </div>
        </section>
      </main>
    </div>
  );
}

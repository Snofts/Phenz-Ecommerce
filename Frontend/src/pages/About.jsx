import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-top">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full max-w-[450px]" src={assets.about_img} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            <span>PHENZ</span> is a reflection of mood, presence, and quiet
            confidence, created for people who don’t overthink style. PHENZ
            makes it easy to show up as you are raw, timeless, and entirely
            real. Every piece is built on one belief: your clothes should feel
            like you. Not curated. Not performative. Just true.
          </p>
          <p>
            Driven by community and aligned with emotion, PHENZ is built through
            connection, not campaigns. It lives in moments, in moods, in the
            people who wear it without needing to explain it.
          </p>
          <p>
            At its core, PHENZ is about effortless expression. Nothing forced.
            Nothing fake. Just clothes that make sense — because they already
            feel like you.
          </p>
          <b className="text-gray-800">The Why</b>
          <p>
            Phenz’s logo is an expression freedom. It combines the letter P from
            PHENZ, symbolizing authenticity and individuality, with wings
            inspired by the wings of Hermes. The wings represent more than just
            speed — they embody the brand’s effortless expression, where you
            move freely and confidently through life, unburdened by external
            expectations. The P serves as the foundation, grounded in
            self-awareness and authenticity, while the wings provide the freedom
            to soar and evolve without constraints.
          </p>
          <p>
            PHENZ isn’t about following trends or seeking attention; it’s about
            staying true to yourself and expressing that truth with clarity and
            ease. The wings reinforce this idea of flowing through life
            naturally, rising to challenges and growing without force. The
            minimalist design is a powerful reminder that style doesn’t have to
            be loud or complicated, it’s about confidence in simplicity.
          </p>
        </div>
      </div>
      <div className="text-3xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row mb-20 text-sm">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Brand Values:</b>
          <p className="text-gray-600">
            Authenticity, Simplicity, Expression and Community
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Brand Persona:</b>
          <p className="text-gray-600">
            Effortlessly magnetic presence. Calm, grounded, and always in tune.
            It doesn’t chase trends or attention. PHENZ reflects those who wear
            what feels right, not what’s expected.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Brand Voice:</b>
          <p className="text-gray-600">
            Warm & Relatable (Like a close friend who gets you). Encouraging &
            Uplifting (Offers reassurance and boosts confidence in one’s
            personal style).
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
